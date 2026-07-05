// ─── Chatbot Assistant — knowledge base ───────────────────────────────────────
// SYSTEM_PROMPT is written for a real LLM call (OpenAI/Anthropic) once an API key
// is wired up. Until then, KNOWLEDGE_BASE drives a lightweight keyword-matching
// simulation so the widget already feels useful in the interface.

export const SYSTEM_PROMPT = `Tu es l'Assistant officiel d'Acquisition Pro, un SaaS d'acquisition et de matchmaking d'influence pour les marques e-commerce et les créateurs UGC (édité par l'agence Viral Acquisition).

TON RÔLE : guider les utilisateurs dans la plateforme, répondre à leurs questions sur les fonctionnalités et les forfaits, et les orienter vers le bon module. Réponds de façon concise, professionnelle et orientée action. Ne donne jamais de conseil financier ou juridique personnalisé — renvoie vers l'équipe support pour ces cas.

MODULES DE LA PLATEFORME :
- Creative AdSpy : espionnage publicitaire, plus de 80M d'annonces et de profils analysés en continu (hooks, formats, tendances).
- Product Finder : détection de produits gagnants à partir des données AdSpy.
- Shop Analyzer : analyse complète d'une marque concurrente (campagnes, créateurs utilisés, performance estimée).
- Sourcing CRM : recherche de marques e-commerce OU d'influenceurs/créateurs selon la cible choisie (Amazon/Etsy/eBay ne s'affichent que pour la cible "Marques e-commerce").
- Vetting IA : détection des faux abonnés et analyse de la qualité d'audience d'un influenceur.
- Matchmaking : mise en relation IA entre marques et créateurs, génération de pitchs, catalogue VIP des influenceurs prioritaires de l'agence, gestion des accords et génération de contrats.
- Marketplace Vidéo : feed UGC façon TikTok où les créateurs postent des vidéos produits que les marques peuvent parcourir et acheter.
- Talents & Gigs : espace des créateurs signés, missions et roster de l'agence.
- Portail Marques & Collaborations : formulaire de contact direct avec l'agence pour un accompagnement Done-For-You.
- Générateur de Contrats IA : création de contrats UGC juridiques prêts à l'emploi.
- Ressources & FAQ : formation gratuite, webinars et articles réservés aux membres VIP Pro/Elite.

FORFAITS :
- Gratuit et Standard (39€/mois) sont réservés aux créateurs/influenceurs (inscription, matching, badge vérifié).
- Plus (69€/mois), VIP Pro (99€/mois) et VIP Elite (299€/mois) sont les forfaits marques, avec un accès croissant à l'AdSpy, au CRM, au Matchmaking, au coaching et aux ressources VIP.

Si une question sort du cadre de la plateforme, reste bref et propose de contacter l'agence via le Portail Marques.`;

export const UI_TEXT = {
  fr: {
    bubbleLabel: "Besoin d'aide ?",
    header: "Assistant Acquisition Pro",
    subheader: "En ligne · répond en quelques secondes",
    greeting: "Salut 👋 Je suis l'assistant d'Acquisition Pro. Pose-moi une question sur les forfaits, l'AdSpy, le Matchmaking, le CRM ou n'importe quel module — je suis là pour t'aider.",
    placeholder: "Écris ton message...",
    typing: "L'assistant écrit...",
    fallback: "Bonne question ! Je n'ai pas encore une réponse précise là-dessus, mais l'équipe de Viral Acquisition peut t'aider directement — passe par l'onglet \"Contacte l'Agence\". En attendant, essaie de me demander : \"prix\", \"AdSpy\", \"matchmaking\", \"CRM\" ou \"contrat\".",
  },
  en: {
    bubbleLabel: "Need help?",
    header: "Acquisition Pro Assistant",
    subheader: "Online · replies in seconds",
    greeting: "Hey 👋 I'm the Acquisition Pro assistant. Ask me about plans, AdSpy, Matchmaking, the CRM, or any module — I'm here to help.",
    placeholder: "Type your message...",
    typing: "Assistant is typing...",
    fallback: "Good question! I don't have a precise answer for that yet, but the Viral Acquisition team can help directly — check the \"Contact the Agency\" tab. Meanwhile, try asking me about: \"pricing\", \"AdSpy\", \"matchmaking\", \"CRM\", or \"contract\".",
  },
  it: {
    bubbleLabel: "Serve aiuto?",
    header: "Assistente Acquisition Pro",
    subheader: "Online · risponde in pochi secondi",
    greeting: "Ciao 👋 Sono l'assistente di Acquisition Pro. Chiedimi qualsiasi cosa sui piani, l'AdSpy, il Matchmaking, il CRM o qualsiasi modulo — sono qui per aiutarti.",
    placeholder: "Scrivi il tuo messaggio...",
    typing: "L'assistente sta scrivendo...",
    fallback: "Ottima domanda! Non ho ancora una risposta precisa, ma il team di Viral Acquisition può aiutarti direttamente — vai alla scheda \"Contatta l'Agenzia\". Nel frattempo, prova a chiedermi: \"prezzi\", \"AdSpy\", \"matchmaking\", \"CRM\" o \"contratto\".",
  },
};

// ─── VIP Elite — "Elite Coach IA" persona ─────────────────────────────────────
// Swapped in for users whose real (server-verified) tier is elite/vip_elite.
// The actual coaching knowledge lives in the OpenAI Assistant's Vector Store
// (see chatbotRoutes.js) — nothing proprietary is hardcoded on the frontend.
export const ELITE_UI_TEXT = {
  fr: {
    bubbleLabel: "Parler au Coach IA",
    header: "Elite Coach IA",
    subheader: "Coaching e-commerce avancé · VIP Elite",
    greeting: "👑 Bienvenue dans le Coach IA VIP Elite. Pose-moi tes questions stratégiques les plus pointues sur le scaling, les campagnes, le budget publicitaire ou la structuration de ton business — je suis calibré pour aller plus loin que le support classique.",
    placeholder: "Pose ta question au Coach...",
  },
  en: {
    bubbleLabel: "Talk to the AI Coach",
    header: "Elite Coach AI",
    subheader: "Advanced e-commerce coaching · VIP Elite",
    greeting: "👑 Welcome to the VIP Elite AI Coach. Ask me your toughest strategic questions on scaling, campaigns, ad budget, or business structure — I'm built to go further than standard support.",
    placeholder: "Ask the Coach...",
  },
  it: {
    bubbleLabel: "Parla con il Coach IA",
    header: "Elite Coach IA",
    subheader: "Coaching e-commerce avanzato · VIP Elite",
    greeting: "👑 Benvenuto nel Coach IA VIP Elite. Fammi le tue domande strategiche più avanzate su scaling, campagne, budget pubblicitario o struttura del business — sono calibrato per andare oltre il supporto standard.",
    placeholder: "Chiedi al Coach...",
  },
};

// Heuristic gate for the upsell — a real LLM call isn't needed just to detect
// "this is an advanced strategy question", so this stays deterministic and instant.
const ADVANCED_ECOM_KEYWORDS = [
  "stratégie", "strategie", "scaling", "scale", "budget pub", "ad budget", "roas", "roi campagne",
  "funnel", "tunnel de vente", "business plan", "lever des fonds", "investisseur", "growth",
  "strategia", "budget pubblicitario", "piano aziendale", "investitore",
];

export function isAdvancedEcomQuestion(userText) {
  const normalized = userText.toLowerCase();
  return ADVANCED_ECOM_KEYWORDS.some(k => normalized.includes(k));
}

export const UPSELL_MESSAGE = {
  fr: "C'est exactement le type de question que traite le Coach IA Mindeo Blueprint 👑 — réservé au forfait VIP Elite. Le support standard reste disponible pour tout ce qui concerne la plateforme, mais pour du conseil stratégique e-commerce avancé, il te faut débloquer VIP Elite.",
  en: "That's exactly the kind of question the Mindeo Blueprint AI Coach handles 👑 — reserved for the VIP Elite plan. Standard support is still here for anything platform-related, but for advanced e-commerce strategy, you'll need to unlock VIP Elite.",
  it: "È esattamente il tipo di domanda gestita dal Coach IA Mindeo Blueprint 👑 — riservato al piano VIP Elite. Il supporto standard resta disponibile per tutto ciò che riguarda la piattaforma, ma per una consulenza strategica e-commerce avanzata devi sbloccare VIP Elite.",
};

// Lightweight keyword-matching simulation — replace with a real API call once
// an LLM key is configured (see ChatbotWidget.jsx `getBotResponse`).
export const KNOWLEDGE_BASE = [
  {
    keywords: ["prix", "tarif", "forfait", "abonnement", "price", "pricing", "plan", "prezzo", "piano", "abbonamento"],
    answer: {
      fr: "Gratuit et Standard (39€/mois) sont pour les créateurs. Pour les marques : Plus (69€/mois, dropshipping), VIP Pro (99€/mois) et VIP Elite (299€/mois), avec un accès croissant à l'AdSpy, au CRM et au coaching. Tu peux voir le détail dans la fenêtre d'inscription.",
      en: "Free and Standard (€39/mo) are for creators. For brands: Plus (€69/mo, dropshipping), VIP Pro (€99/mo), and VIP Elite (€299/mo), with growing access to AdSpy, CRM, and coaching. Full details are in the signup window.",
      it: "Gratuito e Standard (39€/mese) sono per i creator. Per i brand: Plus (69€/mese, dropshipping), VIP Pro (99€/mese) e VIP Elite (299€/mese), con accesso crescente ad AdSpy, CRM e coaching. Trovi tutti i dettagli nella finestra di iscrizione.",
    },
  },
  {
    keywords: ["adspy", "espion", "pub", "annonce", "spy", "ad", "ads", "spia", "pubblicit"],
    answer: {
      fr: "L'AdSpy te donne accès à plus de 80 millions de publicités et profils analysés en continu. Tu peux décortiquer les hooks, formats et campagnes qui marchent chez tes concurrents avant de lancer les tiennes.",
      en: "AdSpy gives you access to over 80 million continuously analyzed ads and profiles. You can dissect the hooks, formats, and campaigns that work for your competitors before launching your own.",
      it: "L'AdSpy ti dà accesso a oltre 80 milioni di pubblicità e profili analizzati continuamente. Puoi analizzare hook, formati e campagne che funzionano per i concorrenti prima di lanciare le tue.",
    },
  },
  {
    keywords: ["matchmaking", "match", "influenceur", "créateur", "creator", "influencer", "creatore"],
    answer: {
      fr: "Le Matchmaking IA connecte marques et créateurs automatiquement selon la niche et l'audience réelle. Tu y trouveras aussi le Catalogue VIP des influenceurs prioritaires de l'agence, la génération de pitchs et de contrats.",
      en: "AI Matchmaking automatically connects brands and creators based on niche and real audience. You'll also find the agency's VIP Catalog of priority influencers, plus pitch and contract generation.",
      it: "Il Matchmaking IA connette automaticamente brand e creator in base a nicchia e audience reale. Troverai anche il Catalogo VIP degli influencer prioritari dell'agenzia, oltre alla generazione di pitch e contratti.",
    },
  },
  {
    keywords: ["crm", "sourcing", "lead", "prospect"],
    answer: {
      fr: "Le Sourcing CRM te permet de rechercher des marques e-commerce OU des créateurs selon ta cible. Astuce : Amazon, Etsy et eBay ne s'affichent que si tu choisis \"Marques E-commerce\".",
      en: "Sourcing CRM lets you search for e-commerce brands OR creators depending on your target. Tip: Amazon, Etsy, and eBay only show up if you select \"E-commerce Brands\".",
      it: "Il Sourcing CRM ti permette di cercare brand e-commerce O creator in base al tuo target. Suggerimento: Amazon, Etsy ed eBay compaiono solo se selezioni \"Brand E-commerce\".",
    },
  },
  {
    keywords: ["contrat", "contract", "legal", "juridique", "contratto"],
    answer: {
      fr: "Le Générateur de Contrats IA crée un contrat UGC juridique prêt à l'emploi directement depuis un accord validé dans le Matchmaking — plus besoin de juriste pour démarrer une collaboration.",
      en: "The AI Contract Generator creates a ready-to-use legal UGC contract directly from a validated deal in Matchmaking — no lawyer needed to kick off a collaboration.",
      it: "Il Generatore di Contratti IA crea un contratto UGC legale pronto all'uso direttamente da un accordo validato nel Matchmaking — nessun avvocato necessario per iniziare una collaborazione.",
    },
  },
  {
    keywords: ["video", "vidéo", "marketplace", "tiktok", "ugc"],
    answer: {
      fr: "La Marketplace Vidéo est un feed façon TikTok où les créateurs postent leurs vidéos produits. Les marques peuvent scroller et acheter directement les contenus qui leur plaisent.",
      en: "The Video Marketplace is a TikTok-style feed where creators post their product videos. Brands can scroll and buy content they like directly.",
      it: "Il Marketplace Video è un feed in stile TikTok dove i creator pubblicano i loro video prodotto. I brand possono scorrere e acquistare direttamente i contenuti che apprezzano.",
    },
  },
  {
    keywords: ["commencer", "démarrer", "start", "begin", "iniziare", "come funziona", "how"],
    answer: {
      fr: "Pour démarrer : crée ton compte (gratuit), explore l'AdSpy pour repérer ce qui marche dans ta niche, puis lance ton premier Matchmaking avec un créateur. Aucune carte bancaire requise pour le forfait Gratuit.",
      en: "To get started: create your free account, explore AdSpy to spot what's working in your niche, then launch your first Matchmaking with a creator. No credit card needed for the Free plan.",
      it: "Per iniziare: crea il tuo account gratuito, esplora l'AdSpy per individuare cosa funziona nella tua nicchia, poi avvia il tuo primo Matchmaking con un creator. Nessuna carta di credito richiesta per il piano Gratuito.",
    },
  },
];

// ─── Simulated response engine ────────────────────────────────────────────────
// Keyword-matched for now, so the widget already feels useful without a backend.
export function getBotResponse(userText, uiLang) {
  const normalized = userText.toLowerCase();
  const match = KNOWLEDGE_BASE.find(entry => entry.keywords.some(k => normalized.includes(k)));
  if (match) return match.answer[uiLang] || match.answer.fr;
  return UI_TEXT[uiLang]?.fallback || UI_TEXT.fr.fallback;
}

// ─── API payload for POST /api/chatbot (see chatbotRoutes.js) ────────────────
// The endpoint exists and is called by ChatbotWidget.jsx already — it just
// 500s with a clear message until OPENAI_API_KEY (and, for Elite,
// OPENAI_ELITE_ASSISTANT_ID) are set in .env, at which point real replies
// start flowing with zero further frontend changes.
// `uiLang` travels in the payload so the backend can force the reply language —
// see LANGUAGE_NAMES / languageDirective in chatbotRoutes.js.
export function buildChatRequestPayload(userText, history, uiLang) {
  return {
    system: SYSTEM_PROMPT,
    uiLang,
    history: history.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })),
    message: userText,
  };
}
