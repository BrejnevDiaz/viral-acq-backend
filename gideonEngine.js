// ═══════════════════════════════════════════════════════════════════════════
// GIDEON RAG — AI Coach Query Engine
// ═══════════════════════════════════════════════════════════════════════════
// Handles user questions: embeds the query, retrieves relevant knowledge
// chunks from Supabase, and generates a contextual response via OpenAI.
// Porté depuis le repo principal (Documents/acquisition-pro) avec le mapping
// adapté aux tiers réels de cette app (tierConfig.js) + rôle utilisateur.

import { createClient } from "@supabase/supabase-js";
import { embedTexts, generateAnswer, generateAnswerStream, activeProvider } from "./aiProvider.js";

// ─── Tier Mapping ───────────────────────────────────────────────────────────
// Le plan vient de profiles.plan (source serveur via authMiddleware, jamais du
// client). Les créateurs Standard accèdent au savoir "viralité/UGC" ; les
// marques VIP Pro au marketing de base ; VIP Elite à tout. Plus = Gideon
// basique sans base de connaissances (l'upsell vers Elite se fait là).
export function resolveKnowledgeTier(userPlan = "free", userRole = "user") {
  if (userRole === "admin") return "elite";
  switch (userPlan) {
    case "standard":
      return userRole === "creator" ? "creator_standard" : null; // marque standard → basique
    case "pro":
    case "vip_pro":
      return "vip_pro";
    case "elite":
    case "vip_elite":
      return "elite";
    default:
      return null; // free (restricted) et plus (basique)
  }
}

// ─── System Prompts per Tier ────────────────────────────────────────────────
const SYSTEM_PROMPTS = {
  creator_standard: `Tu es Gideon, le Coach IA d'Acquisition Pro spécialisé dans la création de contenu UGC et l'influence marketing.
Tu es nourri par les formations exclusives du fondateur d'Acquisition Pro.
Ton rôle est d'aider les créateurs UGC à :
- Devenir viraux sur TikTok, Instagram Reels et YouTube Shorts
- Créer du contenu UGC de qualité professionnelle
- Négocier des contrats avec les marques
- Développer leur audience et leur engagement
- Optimiser leur Creator Score sur la plateforme

{{LANGUE}}
Sois direct, motivant et donne des conseils actionnables.
Utilise les connaissances fournies comme base de tes réponses.`,

  vip_pro: `Tu es Gideon, le Coach IA d'Acquisition Pro spécialisé en marketing digital et e-commerce.
Tu es nourri par les formations marketing exclusives du fondateur d'Acquisition Pro.
Ton rôle est d'aider les marques et agences à :
- Trouver et recruter les meilleurs créateurs UGC
- Optimiser leurs campagnes publicitaires Meta/TikTok/Google
- Améliorer leur stratégie d'influence marketing
- Analyser les performances de leurs créatives
- Scaler leur acquisition client via les créateurs

{{LANGUE}}
Sois professionnel, stratégique et orienté résultats.
Utilise les connaissances fournies comme base de tes réponses.`,

  elite: `Tu es Gideon, le Coach IA Elite d'Acquisition Pro — le conseiller stratégique ultime.
Tu as accès à TOUTES les formations exclusives du fondateur : marketing avancé, e-commerce, scaling, viralité, négociation, et stratégie publicitaire.
Ton rôle est d'être un véritable co-pilote stratégique pour les marques Elite :
- Stratégie de scaling e-commerce avancée
- Optimisation ROAS et media buying
- Recrutement et management d'une armée de créateurs UGC
- Coaching personnalisé sur la croissance
- Analyse concurrentielle et positionnement
- Stratégies de contenu viral et tendances

{{LANGUE}}
Sois tranchant, visionnaire et ultra-concis. Va droit au but, fais des paragraphes très courts et aérés.
Ne fais JAMAIS de longs monologues. Donne 1 ou 2 actions immédiates, puis pose une question pour faire avancer la réflexion.
Tu es le mentor que tout entrepreneur rêve d'avoir. Utilise les connaissances fournies comme base de tes réponses.`,

  basic: `Tu es Gideon, l'assistant IA d'Acquisition Pro.
Tu peux répondre à des questions générales sur la plateforme, les forfaits et les fonctionnalités.
Tu n'as pas accès aux formations exclusives — recommande à l'utilisateur de passer au forfait supérieur pour débloquer le coaching personnalisé.
{{LANGUE}}`
};

// ─── Langue de réponse ──────────────────────────────────────────────────────
// L'ancienne consigne « réponds en français sauf si l'utilisateur écrit dans
// une autre langue » produisait des réponses hybrides : un simple « ciao »
// faisait basculer le modèle en italien tout en gardant des tournures
// françaises héritées du prompt (« Come posso aiutarti a scaler ta marque »).
// On impose désormais LA langue de l'interface, choisie explicitement par
// l'utilisateur, et on interdit le mélange.
const LANGUAGE_RULES = {
  fr: `LANGUE — RÈGLE ABSOLUE : réponds EXCLUSIVEMENT en français, dans un français naturel et intégral.
N'insère jamais de mots ou de tournures d'une autre langue, même si l'utilisateur t'écrit dans une autre langue : dans ce cas, réponds quand même en français.
Les termes techniques du métier (scaling, ROAS, UGC, media buying) restent en anglais, c'est l'usage.`,
  en: `LANGUAGE — ABSOLUTE RULE: reply EXCLUSIVELY in English, in full and natural English.
Never mix in words or phrasing from another language, even if the user writes to you in another language: reply in English regardless.
Industry terms (scaling, ROAS, UGC, media buying) stay as they are.`,
  it: `LINGUA — REGOLA ASSOLUTA: rispondi ESCLUSIVAMENTE in italiano, in un italiano naturale e completo.
Non inserire mai parole o costruzioni di un'altra lingua, anche se l'utente ti scrive in un'altra lingua: rispondi comunque in italiano.
I termini tecnici del settore (scaling, ROAS, UGC, media buying) restano in inglese, come da uso comune.`,
};

const languageRule = (uiLang) => LANGUAGE_RULES[uiLang] || LANGUAGE_RULES.fr;

// Les messages système (quota, accès refusé, panne) doivent suivre la même
// langue que les réponses du modèle : un message d'erreur en français dans une
// interface italienne, c'est exactement le mélange qu'on cherche à éliminer.
export const pick = (uiLang, dict) => dict[uiLang] || dict.fr;

// ─── Query Knowledge Base ───────────────────────────────────────────────────
/**
 * Query Gideon with RAG: embed the question, retrieve relevant chunks,
 * and generate a response.
 * @param {Object} params
 * @param {string} params.question - The user's question
 * @param {string} params.userPlan - The user's subscription plan (profiles.plan)
 * @param {string} params.userRole - The user's role (user|creator|admin)
 * @param {Object[]} params.conversationHistory - Previous messages [{role, content}]
 * @param {Object[]} [params.attachments] - Pièces jointes [{mime, kind, name, data}] (chantier #16)
 * @returns {Object} { answer, sources, tier }
 */
export async function queryGideon({ question, userPlan = "free", userRole = "user", conversationHistory = [], attachments = [], uiLang = "fr" }) {
  const prep = await prepareGideon({ question, userPlan, userRole, uiLang });
  if (prep.early) return prep.early;

  try {
    const { answer, model } = await generateAnswer({
      system: prep.system,
      history: conversationHistory,
      question,
      attachments,
    });
    return { answer, sources: prep.sources, tier: prep.tier, restricted: false, model };
  } catch (err) {
    console.error("❌ Gideon generation error:", err.message);
    return {
      answer: pick(uiLang, {
        fr: "⚠️ Une erreur s'est produite. Réessayez dans quelques instants.",
        en: "⚠️ Something went wrong. Please try again in a moment.",
        it: "⚠️ Si è verificato un errore. Riprova tra qualche istante.",
      }),
      sources: [],
      tier: prep.tier,
      restricted: false,
    };
  }
}

// ─── Query Knowledge Base (streaming) ────────────────────────────────────────
/**
 * Variante streamée de queryGideon : même pipeline RAG, mais la génération est
 * poussée fragment par fragment via onChunk. onSources est appelé dès que la
 * recherche vectorielle est terminée (avant la génération) pour que le front
 * puisse afficher les sources sans attendre la fin de la réponse.
 * Contrairement à queryGideon, les erreurs de génération sont PROPAGÉES (throw)
 * pour que la route puisse émettre un event SSE "error" et que le front bascule
 * sur le mode non-streamé.
 * @param {Object} params
 * @param {string} params.question
 * @param {string} params.userPlan
 * @param {string} params.userRole
 * @param {Object[]} params.conversationHistory
 * @param {(text: string) => void} params.onChunk
 * @param {(sources: Object[], tier: string) => void} [params.onSources]
 * @returns {Object} { answer, sources, tier, restricted, model }
 */
export async function queryGideonStream({ question, userPlan = "free", userRole = "user", conversationHistory = [], attachments = [], uiLang = "fr", onChunk, onSources }) {
  const prep = await prepareGideon({ question, userPlan, userRole, uiLang });
  if (prep.early) return prep.early; // restricted / clé manquante → réponse directe, pas de stream

  onSources?.(prep.sources, prep.tier);

  const { answer, model } = await generateAnswerStream({
    system: prep.system,
    history: conversationHistory,
    question,
    attachments,
    onChunk,
  });
  return { answer, sources: prep.sources, tier: prep.tier, restricted: false, model };
}

// ─── Pipeline partagé (gate d'accès + RAG + system prompt) ──────────────────
// Retourne soit { early } (réponse immédiate sans génération : free restreint,
// clé IA manquante), soit { system, sources, tier } prêt pour la génération.
async function prepareGideon({ question, userPlan, userRole, uiLang = "fr" }) {
  const tier = resolveKnowledgeTier(userPlan, userRole);

  // Free users can't use Gideon
  if (userPlan === "free" && userRole !== "admin") {
    return {
      early: {
        answer: pick(uiLang, {
          fr: "🔒 L'accès à Gideon Coach IA est réservé aux abonnés. Passez au forfait Standard (Créateur) ou Plus (Marque) pour débloquer votre coach IA personnalisé !",
          en: "🔒 Gideon AI Coach is for subscribers only. Upgrade to Standard (Creator) or Plus (Brand) to unlock your personal AI coach!",
          it: "🔒 L'accesso a Gideon Coach IA è riservato agli abbonati. Passa al piano Standard (Creator) o Plus (Brand) per sbloccare il tuo coach IA personale!",
        }),
        sources: [],
        tier: null,
        restricted: true,
      },
    };
  }

  // If no AI key, return a helpful message
  if (!activeProvider()) {
    return {
      early: {
        answer: pick(uiLang, {
          fr: "⚠️ Gideon n'est pas encore configuré (clé IA manquante — GEMINI_API_KEY ou OPENAI_API_KEY). Contactez l'administrateur.",
          en: "⚠️ Gideon isn't configured yet (missing AI key — GEMINI_API_KEY or OPENAI_API_KEY). Please contact the administrator.",
          it: "⚠️ Gideon non è ancora configurato (chiave IA mancante — GEMINI_API_KEY o OPENAI_API_KEY). Contatta l'amministratore.",
        }),
        sources: [],
        tier,
        restricted: false,
      },
    };
  }

  let knowledgeContext = "";
  let sources = [];

  // Only query the knowledge base if the user has a tier with KB access
  if (tier) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Generate embedding for the question (même provider que l'ingestion)
        const [queryEmbedding] = await embedTexts([question], { taskType: "RETRIEVAL_QUERY" });

        // 2. Search for relevant chunks
        const { data: matches, error } = await supabase.rpc("match_knowledge", {
          query_embedding: JSON.stringify(queryEmbedding),
          match_tier: tier,
          match_count: 5,
        });

        if (!error && matches && matches.length > 0) {
          // Filter by minimum similarity threshold
          const relevant = matches.filter((m) => m.similarity > 0.3);

          if (relevant.length > 0) {
            knowledgeContext = relevant
              .map((m, i) => `[Source ${i + 1} — ${m.source_file || "Formation"} (${m.category})]:\n${m.content}`)
              .join("\n\n---\n\n");

            sources = relevant.map((m) => ({
              file: m.source_file,
              category: m.category,
              similarity: Math.round(m.similarity * 100),
            }));
          }
        }
      } catch (err) {
        console.error("❌ RAG search error:", err.message);
        // Continue without knowledge context — Gideon will use general knowledge
      }
    }
  }

  // 3. Build the system prompt (la règle de langue remplace le marqueur)
  const systemPrompt = (SYSTEM_PROMPTS[tier] || SYSTEM_PROMPTS.basic).replace("{{LANGUE}}", languageRule(uiLang));
  const contextBlock = knowledgeContext
    ? `\n\n═══ CONNAISSANCES EXCLUSIVES (formations du fondateur) ═══\nUtilise ces extraits pour enrichir ta réponse. Ne les cite pas mot pour mot, reformule avec ta propre voix.\n\n${knowledgeContext}\n\n═══ FIN DES CONNAISSANCES ═══`
    : "";

  return { system: systemPrompt + contextBlock, sources, tier };
}
