// ─── Couche IA multi-provider (Gemini / OpenAI) ───────────────────────────────
// Gideon RAG peut tourner sur l'API Gemini (free tier via aistudio.google.com/apikey,
// sans carte bancaire) ou sur OpenAI. Sélection automatique : GEMINI_API_KEY
// prioritaire, sinon OPENAI_API_KEY. IMPORTANT : les embeddings stockés et les
// embeddings de requête doivent venir du MÊME provider — si tu changes de
// provider après ingestion, il faut ré-ingérer (les espaces vectoriels sont
// incompatibles). Dimension fixée à 1536 des deux côtés → le schéma Supabase
// vector(1536) reste valable tel quel.

const GEMINI_EMBED_MODEL = "gemini-embedding-001";
const GEMINI_CHAT_MODEL = "gemini-2.5-flash";
const OPENAI_EMBED_MODEL = "text-embedding-3-small";
const OPENAI_CHAT_MODEL = "gpt-4o-mini";
export const EMBEDDING_DIM = 1536;

export const activeProvider = () =>
  process.env.GEMINI_API_KEY ? "gemini" : process.env.OPENAI_API_KEY ? "openai" : null;

// fetch avec retry sur 429/503 — le free tier Gemini a des limites par minute,
// on attend et on réessaie plutôt que de faire échouer tout un PDF.
async function fetchWithRetry(url, options, tries = 4) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    const res = await fetch(url, options);
    if (res.ok) return res.json();
    const body = await res.text().catch(() => "");
    if ((res.status === 429 || res.status === 503) && attempt < tries) {
      const waitS = 20 * attempt;
      console.log(`   ⏳ ${res.status} rate limit — attente ${waitS}s (essai ${attempt}/${tries})...`);
      await new Promise((r) => setTimeout(r, waitS * 1000));
      continue;
    }
    throw new Error(`${res.status} ${body.slice(0, 300)}`);
  }
}

// ─── Embeddings ───────────────────────────────────────────────────────────────
/**
 * @param {string[]} texts
 * @param {Object} opts - { taskType: "RETRIEVAL_DOCUMENT" (ingestion) | "RETRIEVAL_QUERY" (question) }
 * @returns {Promise<number[][]>}
 */
export async function embedTexts(texts, { taskType = "RETRIEVAL_DOCUMENT" } = {}) {
  const provider = activeProvider();
  if (!provider) throw new Error("Aucune clé IA : ajoute GEMINI_API_KEY ou OPENAI_API_KEY dans .env");

  if (provider === "gemini") {
    const key = process.env.GEMINI_API_KEY;
    const data = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBED_MODEL}:batchEmbedContents?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: texts.map((text) => ({
            model: `models/${GEMINI_EMBED_MODEL}`,
            content: { parts: [{ text }] },
            taskType,
            outputDimensionality: EMBEDDING_DIM,
          })),
        }),
      }
    );
    // outputDimensionality < 3072 → vecteurs non normalisés : on normalise pour
    // que la similarité cosinus de pgvector reste propre.
    return (data.embeddings || []).map((e) => {
      const v = e.values;
      const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
      return v.map((x) => x / norm);
    });
  }

  // OpenAI
  const data = await fetchWithRetry("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: OPENAI_EMBED_MODEL, input: texts }),
  });
  return data.data.map((d) => d.embedding);
}

// ─── Génération de réponse (chat) ────────────────────────────────────────────
/**
 * @param {Object} params
 * @param {string} params.system - System prompt (+ contexte RAG)
 * @param {Object[]} params.history - [{role:"user"|"assistant", content}]
 * @param {string} params.question - Question courante
 * @returns {Promise<{ answer: string, model: string }>}
 */
export async function generateAnswer({ system, history = [], question }) {
  const provider = activeProvider();
  if (!provider) throw new Error("Aucune clé IA : ajoute GEMINI_API_KEY ou OPENAI_API_KEY dans .env");

  if (provider === "gemini") {
    const key = process.env.GEMINI_API_KEY;
    const contents = [
      ...history.slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: question }] },
    ];
    const data = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CHAT_MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
        }),
      }
    );
    const answer = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    return { answer, model: GEMINI_CHAT_MODEL };
  }

  // OpenAI
  const data = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      messages: [{ role: "system", content: system }, ...history.slice(-10), { role: "user", content: question }],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });
  return { answer: data.choices?.[0]?.message?.content || "", model: OPENAI_CHAT_MODEL };
}
