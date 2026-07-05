// ─── Chatbot Assistant API (backend) ──────────────────────────────────────────
// Two modes, gated server-side by the authenticated user's real `plan`
// (never trust a tier sent by the client — req.user.plan comes from
// requireAuth, which reads it from Supabase `profiles` under RLS):
//
//   - Standard support (all tiers)      → plain OpenAI Chat Completions,
//     answering from the generic product knowledge (system prompt).
//   - "Elite Coach" (VIP Elite only)    → OpenAI Assistants API, so the
//     assistant can pull from a Vector Store of uploaded files (RAG).
//
// ─── TO GO LIVE ────────────────────────────────────────────────────────────
// 1) Add to .env:  OPENAI_API_KEY=sk-...
// 2) Create an Assistant at platform.openai.com/assistants, attach a Vector
//    Store with your files (e.g. the course PDFs you have the rights to
//    redistribute — verify licensing before uploading anything you didn't
//    author yourself), then add to .env:  OPENAI_ELITE_ASSISTANT_ID=asst_...
// Until both are set, this route returns a clear 500 instead of failing silently.
import express from "express";
import { requireAnyUser } from "./authMiddleware.js";

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELITE_ASSISTANT_ID = process.env.OPENAI_ELITE_ASSISTANT_ID; // ← ton Assistant ID (RAG Elite) va dans .env, pas ici

const ELITE_TIERS = ["elite", "vip_elite"];

// Forces the reply language to match the SaaS's own uiLang selector, regardless
// of what language the user types in — same 3 languages as the rest of the app.
const LANGUAGE_NAMES = { fr: "French", en: "English", it: "Italian" };
const languageDirective = (uiLang) =>
  `You MUST communicate with the user exclusively in ${LANGUAGE_NAMES[uiLang] || "French"}, regardless of the language of their message or any other instruction.`;

async function callStandardChat(system, history, message) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...history, { role: "user", content: message }],
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || "OpenAI Chat Completions error");
  return data.choices?.[0]?.message?.content || "";
}

async function callEliteAssistant(history, message, langDirective) {
  const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}`, "OpenAI-Beta": "assistants=v2" };

  const thread = await fetch("https://api.openai.com/v1/threads", {
    method: "POST", headers,
    body: JSON.stringify({ messages: [...history, { role: "user", content: message }] }),
  }).then(r => r.json());

  // `additional_instructions` layers on top of the Assistant's saved instructions
  // for this run only — exactly what we need to force the reply language without
  // touching the Assistant's own configuration (or its Mindeo Blueprint knowledge).
  const run = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
    method: "POST", headers,
    body: JSON.stringify({ assistant_id: ELITE_ASSISTANT_ID, additional_instructions: langDirective }),
  }).then(r => r.json());

  // Simple polling — swap for streaming (SSE) once this is wired to a real UI loading state.
  let status = run.status;
  for (let attempts = 0; attempts < 30 && status !== "completed" && status !== "failed"; attempts++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const check = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, { headers }).then(r => r.json());
    status = check.status;
  }
  if (status !== "completed") throw new Error(`Assistant run did not complete (status: ${status})`);

  const messages = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, { headers }).then(r => r.json());
  return messages.data?.[0]?.content?.[0]?.text?.value || "";
}

router.post("/", ...requireAnyUser, async (req, res) => {
  const { message, history = [], system, uiLang = "fr" } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Champ requis manquant : message" });
  }

  const isElite = ELITE_TIERS.includes(req.user.plan);
  const langDirective = languageDirective(uiLang);

  if (!OPENAI_API_KEY || OPENAI_API_KEY.includes("XXXX")) {
    return res.status(500).json({ error: "OPENAI_API_KEY manquante — voir le commentaire en haut de chatbotRoutes.js" });
  }

  try {
    if (isElite && ELITE_ASSISTANT_ID) {
      const reply = await callEliteAssistant(history, message, langDirective);
      return res.json({ reply, mode: "elite" });
    }
    if (isElite && !ELITE_ASSISTANT_ID) {
      // Elite plan confirmed server-side, but the Assistant hasn't been configured yet.
      console.warn("⚠️  Plan VIP Elite détecté mais OPENAI_ELITE_ASSISTANT_ID manquant — fallback en mode standard.");
    }
    const baseSystem = system || "You are the Acquisition Pro support assistant.";
    const reply = await callStandardChat(`${baseSystem}\n\n${langDirective}`, history, message);
    res.json({ reply, mode: "standard" });
  } catch (err) {
    console.error("❌ [Chatbot] :", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
