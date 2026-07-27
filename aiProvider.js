// ─── Couche IA multi-provider (Gemini / OpenAI) ───────────────────────────────
// Gideon RAG peut tourner sur l'API Gemini (free tier via aistudio.google.com/apikey,
// sans carte bancaire) ou sur OpenAI. Sélection automatique : GEMINI_API_KEY
// prioritaire, sinon OPENAI_API_KEY. IMPORTANT : les embeddings stockés et les
// embeddings de requête doivent venir du MÊME provider — si tu changes de
// provider après ingestion, il faut ré-ingérer (les espaces vectoriels sont
// incompatibles). Dimension fixée à 768 des deux côtés → le schéma Supabase
// vector(768) reste valable tel quel.
//
// RÉSILIENCE (chaîne de secours) : si Gemini échoue à la GÉNÉRATION (quota 429
// épuisé, panne...), la génération bascule automatiquement sur le provider
// suivant disponible : Gemini → OpenAI → Claude (Anthropic). Les EMBEDDINGS
// restent toujours sur Gemini (compatibilité avec la base vectorielle ingérée)
// — seule la rédaction de la réponse change de moteur. Trois fournisseurs
// indépendants : le Coach ne tombe jamais en panne de quota.

const GEMINI_EMBED_MODEL = "gemini-embedding-001";
const GEMINI_CHAT_MODEL = "gemini-2.5-flash";
const OPENAI_EMBED_MODEL = "text-embedding-3-small";
const OPENAI_CHAT_MODEL = "gpt-4o-mini";
const ANTHROPIC_CHAT_MODEL = "claude-haiku-4-5-20251001";
export const EMBEDDING_DIM = 768;

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
    body: JSON.stringify({ model: OPENAI_EMBED_MODEL, input: texts, dimensions: EMBEDDING_DIM }),
  });
  return data.data.map((d) => d.embedding);
}

// ─── Helpers génération ──────────────────────────────────────────────────────
// attachments : [{ mime, kind: "image"|"pdf"|"video", name, data (base64) }]
// ou [{ …, uri }] pour les médias passés par la Files API (vidéos et fichiers
// > 12 Mo — voir geminiFiles.js). Joints UNIQUEMENT au message courant :
// l'historique reste textuel, re-payer l'encodage à chaque tour ferait
// exploser les tokens.
// Support par moteur : Gemini images+PDF+VIDÉO natif ; Claude images+PDF ;
// OpenAI gpt-4o-mini images seulement. Sur les moteurs de secours, tout média
// non lisible est remplacé par une note textuelle explicite — jamais d'analyse
// silencieusement amputée.
const geminiPart = (a) =>
  a.uri
    ? { fileData: { mimeType: a.mime, fileUri: a.uri } }
    : { inlineData: { mimeType: a.mime, data: a.data } };

const geminiContents = (history, question, attachments = []) => [
  ...history.slice(-10).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  })),
  {
    role: "user",
    // Google recommande de placer le texte APRÈS le média pour la vidéo.
    parts: [...attachments.map(geminiPart), { text: question }],
  },
];

// media_resolution LOW divise par ~3 le coût d'une vidéo (~100 tokens/seconde
// au lieu de ~300) : suffisant pour juger hook, rythme, cadrage et montage
// d'une créative. À repasser en défaut si Gideon doit un jour lire du petit
// texte incrusté (chiffres d'un dashboard filmé).
const geminiGenerationConfig = (attachments = []) => ({
  maxOutputTokens: 2048,
  temperature: 0.7,
  ...(attachments.some((a) => a.kind === "video") ? { mediaResolution: "MEDIA_RESOLUTION_LOW" } : {}),
});

// Note injectée à la place des médias qu'un moteur de secours ne sait pas lire.
// `sent` = la liste EXACTE des pièces réellement transmises au moteur ; tout ce
// qui n'y figure pas est signalé au modèle pour qu'il le dise à l'utilisateur.
const unreadableNote = (attachments, sent) => {
  const skipped = attachments.filter((a) => !sent.includes(a));
  if (!skipped.length) return "";
  const labels = skipped.map((a) => `${a.kind === "video" ? "vidéo" : a.kind === "pdf" ? "PDF" : "fichier"} "${a.name}"`).join(", ");
  return `\n\n[Note technique : ${labels} — non lisible(s) par le moteur de secours actuellement utilisé. Dis-le clairement à l'utilisateur au lieu de deviner leur contenu, et invite-le à réessayer dans quelques minutes.]`;
};

const openaiMessages = (system, history, question, attachments = []) => {
  // gpt-4o-mini ne lit que les images, et seulement en inline (une image
  // passée par la Files API Gemini n'a pas de base64 exploitable ici).
  const images = attachments.filter((a) => a.kind === "image" && a.data);
  const questionText = question + unreadableNote(attachments, images);
  return [
    { role: "system", content: system },
    ...history.slice(-10).map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })),
    {
      role: "user",
      content: images.length
        ? [
            { type: "text", text: questionText },
            ...images.map((a) => ({ type: "image_url", image_url: { url: `data:${a.mime};base64,${a.data}` } })),
          ]
        : questionText,
    },
  ];
};

const anthropicUserContent = (question, attachments = []) => {
  if (!attachments.length) return question;
  // Claude lit images et PDF, mais pas la vidéo — et uniquement en base64
  // (les médias passés par la Files API Gemini n'ont pas de data ici).
  const readable = attachments.filter((a) => a.data && (a.kind === "image" || a.kind === "pdf"));
  const text = question + unreadableNote(attachments, readable);
  if (!readable.length) return text;
  return [
    ...readable.map((a) =>
      a.kind === "pdf"
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: a.data } }
        : { type: "image", source: { type: "base64", media_type: a.mime, data: a.data } }
    ),
    { type: "text", text },
  ];
};

// `mediaResolution` n'existe pas sur tous les modèles Gemini : un modèle qui
// ne le connaît pas répond 400 "Unknown name". Plutôt que de faire basculer
// TOUTES les requêtes vidéo sur des moteurs de secours incapables de les lire,
// on réessaie une fois sans ce réglage (coût x3, mais l'analyse a lieu).
const isUnknownFieldError = (err) =>
  /unknown name|invalid json payload|mediaResolution/i.test(String(err?.message || ""));

async function geminiGenerate({ system, history, question, attachments = [], tries = 4 }) {
  const key = process.env.GEMINI_API_KEY;
  const call = (generationConfig) => fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CHAT_MODEL}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: geminiContents(history, question, attachments),
        generationConfig,
      }),
    },
    tries
  );

  let data;
  try {
    data = await call(geminiGenerationConfig(attachments));
  } catch (err) {
    if (!isUnknownFieldError(err)) throw err;
    console.warn("⚠️ mediaResolution refusé par le modèle — nouvelle tentative sans (coût vidéo x3)");
    data = await call(geminiGenerationConfig([]));
  }

  const answer = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  // Une réponse vide n'est PAS un succès : blocage sécurité, quota atteint en
  // cours de route, finishReason inattendu… La laisser passer afficherait une
  // bulle vide et, pour une vidéo, la ferait facturer sans être décomptée.
  if (!answer.trim()) {
    const reason = data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason || "inconnue";
    throw new Error(`Réponse Gemini vide (raison : ${reason})`);
  }
  return { answer, model: GEMINI_CHAT_MODEL };
}

async function openaiGenerate({ system, history, question, attachments = [] }) {
  const data = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      messages: openaiMessages(system, history, question, attachments),
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });
  return { answer: data.choices?.[0]?.message?.content || "", model: OPENAI_CHAT_MODEL };
}

const anthropicHeaders = () => ({
  "Content-Type": "application/json",
  "x-api-key": process.env.ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
});

const anthropicBody = (system, history, question, stream = false, attachments = []) => JSON.stringify({
  model: ANTHROPIC_CHAT_MODEL,
  max_tokens: 2048,
  temperature: 0.7,
  system,
  messages: [
    ...history.slice(-10).map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })),
    { role: "user", content: anthropicUserContent(question, attachments) },
  ],
  ...(stream ? { stream: true } : {}),
});

async function anthropicGenerate({ system, history, question, attachments = [] }) {
  const data = await fetchWithRetry("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: anthropicHeaders(),
    body: anthropicBody(system, history, question, false, attachments),
  }, 1);
  const answer = (data.content || []).map((b) => b.text || "").join("");
  return { answer, model: ANTHROPIC_CHAT_MODEL };
}

// ─── Génération de réponse (chat) ────────────────────────────────────────────
/**
 * @param {Object} params
 * @param {string} params.system - System prompt (+ contexte RAG)
 * @param {Object[]} params.history - [{role:"user"|"assistant", content}]
 * @param {string} params.question - Question courante
 * @param {Object[]} [params.attachments] - Pièces jointes [{mime, kind, name, data}]
 * @returns {Promise<{ answer: string, model: string }>}
 */
export async function generateAnswer({ system, history = [], question, attachments = [] }) {
  const provider = activeProvider();
  if (!provider) throw new Error("Aucune clé IA : ajoute GEMINI_API_KEY ou OPENAI_API_KEY dans .env");

  // Chaîne de secours selon les clés disponibles : Gemini → OpenAI → Claude.
  // S'il y a au moins un secours, pas de retries lents (20-60s) sur Gemini :
  // on bascule immédiatement au premier échec.
  const chain = [];
  if (provider === "gemini") chain.push(["gemini", (hasBackup) => geminiGenerate({ system, history, question, attachments, tries: hasBackup ? 1 : 4 })]);
  if (process.env.OPENAI_API_KEY) chain.push(["openai", () => openaiGenerate({ system, history, question, attachments })]);
  if (process.env.ANTHROPIC_API_KEY) chain.push(["claude", () => anthropicGenerate({ system, history, question, attachments })]);

  let lastErr;
  for (let i = 0; i < chain.length; i++) {
    const [name, fn] = chain[i];
    try {
      return await fn(chain.length > 1);
    } catch (err) {
      lastErr = err;
      if (i < chain.length - 1) {
        console.warn(`⚠️ Génération ${name} KO (${String(err.message).slice(0, 80)}…) — bascule sur ${chain[i + 1][0]}`);
      }
    }
  }
  throw lastErr;
}

// ─── Génération streamée (SSE) ───────────────────────────────────────────────
// Lit un flux SSE (Gemini streamGenerateContent ou OpenAI stream:true) et
// appelle onChunk(texte) à chaque fragment. Retourne la réponse complète.
async function readSseStream(res, provider, onChunk) {
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  const model = provider === "gemini" ? GEMINI_CHAT_MODEL : provider === "claude" ? ANTHROPIC_CHAT_MODEL : OPENAI_CHAT_MODEL;

  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // dernière ligne potentiellement incomplète
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      let json;
      try { json = JSON.parse(payload); } catch { continue; }
      const text = provider === "gemini"
        ? (json.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "")
        : provider === "claude"
        ? (json.type === "content_block_delta" ? (json.delta?.text || "") : "")
        : (json.choices?.[0]?.delta?.content || "");
      if (text) {
        full += text;
        onChunk?.(text);
      }
    }
  }

  return { answer: full, model };
}

async function openaiStream({ system, history, question, attachments = [], onChunk }) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      messages: openaiMessages(system, history, question, attachments),
      max_tokens: 2048,
      temperature: 0.7,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${body.slice(0, 300)}`);
  }
  return readSseStream(res, "openai", onChunk);
}

async function anthropicStream({ system, history, question, attachments = [], onChunk }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: anthropicHeaders(),
    body: anthropicBody(system, history, question, true, attachments),
  });
  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${body.slice(0, 300)}`);
  }
  return readSseStream(res, "claude", onChunk);
}

async function geminiStream({ system, history, question, attachments = [], onChunk }) {
  const key = process.env.GEMINI_API_KEY;
  const open = (generationConfig) => fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CHAT_MODEL}:streamGenerateContent?alt=sse&key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: geminiContents(history, question, attachments),
        generationConfig,
      }),
    }
  );

  let res = await open(geminiGenerationConfig(attachments));
  if (res.status === 400) {
    // Même repli qu'en non-streamé : un modèle qui ignore mediaResolution ne
    // doit pas envoyer la vidéo vers des moteurs incapables de la lire.
    const body = await res.text().catch(() => "");
    if (!isUnknownFieldError({ message: body })) throw new Error(`400 ${body.slice(0, 300)}`);
    console.warn("⚠️ mediaResolution refusé par le modèle — nouvelle tentative sans (coût vidéo x3)");
    res = await open(geminiGenerationConfig([]));
  }
  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${body.slice(0, 300)}`);
  }
  const out = await readSseStream(res, "gemini", onChunk);
  // Flux qui se termine sans un mot : blocage sécurité ou coupure silencieuse.
  if (!out.answer.trim()) throw new Error("Flux Gemini terminé sans contenu");
  return out;
}

/**
 * Même contrat que generateAnswer, mais appelle onChunk(texte) à chaque
 * fragment reçu. Chaîne de secours Gemini → OpenAI → Claude : un provider qui
 * échoue AVANT d'avoir émis le moindre fragment est remplacé par le suivant.
 * Si du texte a déjà été streamé au client, l'erreur est propagée (impossible
 * de repartir de zéro sans doubler le texte) — l'appelant (la route SSE) émet
 * alors un event error et le front se replie sur /api/gideon, qui a la même
 * chaîne de secours.
 * @param {Object} params
 * @param {string} params.system
 * @param {Object[]} params.history
 * @param {string} params.question
 * @param {(text: string) => void} params.onChunk
 * @param {Object[]} [params.attachments] - Pièces jointes [{mime, kind, name, data}]
 * @returns {Promise<{ answer: string, model: string }>}
 */
export async function generateAnswerStream({ system, history = [], question, attachments = [], onChunk }) {
  const provider = activeProvider();
  if (!provider) throw new Error("Aucune clé IA : ajoute GEMINI_API_KEY ou OPENAI_API_KEY dans .env");

  const chain = [];
  if (provider === "gemini") chain.push(["gemini", geminiStream]);
  if (process.env.OPENAI_API_KEY) chain.push(["openai", openaiStream]);
  if (process.env.ANTHROPIC_API_KEY) chain.push(["claude", anthropicStream]);

  let emitted = false;
  const guardedChunk = (text) => { emitted = true; onChunk?.(text); };

  let lastErr;
  for (let i = 0; i < chain.length; i++) {
    const [name, fn] = chain[i];
    try {
      return await fn({ system, history, question, attachments, onChunk: guardedChunk });
    } catch (err) {
      lastErr = err;
      if (emitted) throw err; // du texte est déjà parti vers le client
      if (i < chain.length - 1) {
        console.warn(`⚠️ Stream ${name} KO (${String(err.message).slice(0, 80)}…) — bascule sur ${chain[i + 1][0]}`);
      }
    }
  }
  throw lastErr;
}
