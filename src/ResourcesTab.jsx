import React, { useState, useEffect } from 'react';

const PremiumTrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#trophyGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, verticalAlign: "bottom", filter: "drop-shadow(0px 2px 4px rgba(245,158,11,0.4))" }}>
    <defs><linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fcd34d"/><stop offset="100%" stopColor="#d97706"/></linearGradient></defs>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const PremiumBookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#bookGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, verticalAlign: "bottom", filter: "drop-shadow(0px 2px 4px rgba(16,185,129,0.4))" }}>
    <defs><linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#047857"/></linearGradient></defs>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
);

const PremiumDiamondIcon = ({ size = 24, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#diamondGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ ...style, verticalAlign: "bottom", filter: "drop-shadow(0px 2px 6px rgba(59,130,246,0.5))" }}>
    <defs><linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#93c5fd"/><stop offset="50%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#2563eb"/></linearGradient></defs>
    <path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13"/><path d="M13 3l3 6-4 13"/>
  </svg>
);

const PremiumHandshakeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#handGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, verticalAlign: "bottom", filter: "drop-shadow(0px 2px 4px rgba(168,85,247,0.4))" }}>
    <defs><linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c084fc"/><stop offset="100%" stopColor="#7e22ce"/></linearGradient></defs>
    <path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3-6 6"/><path d="m21 14-6 6"/><path d="M9 19 6 22a2 2 0 1 1-3-3l6-6a2 2 0 0 1 3 3"/><path d="m15 15-3 3"/>
  </svg>
);

export default function ResourcesTab({ c, mono, uiLang, userTier, onUpgradeTier }) {
  const [openFaq, setOpenFaq] = useState(null);

  // Premium Access & Simulation States
  const [activeVipTab, setActiveVipTab] = useState(null); // null | 'coaching' | 'blog'
  const [openArticle, setOpenArticle] = useState(null); // null | article object
  
  const [unlockedWebinars, setUnlockedWebinars] = useState(() => {
    try {
      const stored = localStorage.getItem("va_unlocked_webinars");
      return stored ? JSON.parse(stored) : ["session_1"];
    } catch { return ["session_1"]; }
  });
  const [unlockedArticles, setUnlockedArticles] = useState(() => {
    try {
      const stored = localStorage.getItem("va_unlocked_articles");
      return stored ? JSON.parse(stored) : ["a1"];
    } catch { return ["a1"]; }
  });
  
  // Paywall & Upgrade simulation states
  const [lockedTarget, setLockedTarget] = useState(""); // 'coaching' | 'blog'
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("elite"); // 'pro' | 'elite'
  const [upgradeMessage, setUpgradeMessage] = useState("");
  
  // Interactive Enhancements States
  const [liveViewers, setLiveViewers] = useState(142);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [activeReminder, setActiveReminder] = useState(null); // id of session with reminder active
  const [watchedSessions, setWatchedSessions] = useState(new Set(["session_1"])); // Track watched training sessions

  // Live Webinar Chat Message State
  const [chatMessages, setChatMessages] = useState([
    { user: "Sarah_K", text: uiLang === 'fr' ? "Le calcul du Chiffre d'Affaires avec le taux de conversion de 1.8% est vraiment précis pour ma boutique !" : (uiLang === 'it' ? "La stima del fatturato con tasso del 1.8% è incredibilmente accurata per il mio negozio!" : "The revenue estimation with the 1.8% CR is super accurate for my shop!"), time: "09:42" },
    { user: "Antonio_M", text: uiLang === 'fr' ? "Brejnev, tu conseilles quel agent logistique pour expédier en Italie ?" : (uiLang === 'it' ? "Brejnev, quale agente consigli per spedire e sdoganare in Italia?" : "Brejnev, which shipping agent do you recommend for Italy?"), time: "09:44" },
    { user: "Brejnev Diaz 👑", text: uiLang === 'fr' ? "Ciao Antonio, je vais répondre en direct dans 2 minutes et te donner nos contacts d'agents privés à Florence." : (uiLang === 'it' ? "Ciao Antonio, rispondo in diretta tra 2 minuti e ti passo i contatti dei nostri agenti a Firenze." : "Ciao Antonio, I will answer live in 2 minutes and give you our private agents contacts in Florence."), time: "09:45" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Live Viewers dynamic count oscillation
  useEffect(() => {
    if (activeVipTab === "coaching") {
      const interval = setInterval(() => {
        setLiveViewers(prev => {
          const delta = Math.random() > 0.55 ? 1 : -1;
          const newVal = prev + delta;
          return newVal > 130 && newVal < 160 ? newVal : prev;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeVipTab]);

  const t = {
    fr: {
      titleSuccess: "🏆 Nos Succès & Métriques Clés",
      descSuccess: "Les statistiques en temps réel de notre plateforme d'acquisition.",
      shopsAnalyzed: "Boutiques Shopify Analysées",
      shopsDesc: "Suivi quotidien du trafic et des applications.",
      creativesIndexed: "Créatifs AdSpy Indexés",
      creativesDesc: "Vidéos Meta, TikTok et Pinterest.",
      sourcingRate: "Taux de Sourcing Réussi",
      sourcingDesc: "Fournisseurs AliExpress & Google trouvés.",
      roasAverage: "ROAS Moyen de nos Clients",
      roasDesc: "Augmentation après analyse concurrentielle.",
      
      titleEdu: "📚 Nos Ressources Éducatives (VIP)",
      descEdu: "Accélérez votre croissance e-commerce avec nos ressources exclusives.",
      liveCoaching: "Coaching Live VIP",
      everyWeek: "Chaque Semaine",
      liveCoachingDesc: "Participez à nos sessions de coaching vidéo pour auditer vos boutiques et accroître vos performances d'acquisition avec Brejnev Diaz et l'équipe.",
      blogStrategies: "Blog & Stratégies VIP",
      blogDesc: "Conseils, astuces et études de cas concrètes sur l'acquisition payante et l'influence pour scaler votre boutique Shopify de 0 à 100k€ par mois.",
      shopifyOffer: "Boutique Shopify à 1$/mois 🚀",
      shopifyOfferDesc: "Profitez de notre partenariat d'affiliation exclusif : Créez votre boutique Shopify avec essai gratuit et profitez de l'offre spéciale.",
      claimOffer: "Profiter de l'offre ➔",
      
      titleFaq: "❓ Foire Aux Questions (FAQ)",
      descFaq: "Toutes les réponses à vos questions techniques et fonctionnelles.",
      
      titlePartners: "🤝 Nos Partenariats & Intégrations",
      descPartners: "Nous collaborons avec les meilleures technologies du marché.",
      
      titleLegal: "⚖️ Mentions Légales",
      descLegal: "Informations obligatoires concernant l'éditeur et l'hébergeur de l'application.",
      legalSec1: "1. Éditeur de l'application",
      legalSec1Desc: "La suite Pro ViralAcq est éditée par la société Viral Acquisition S.r.l., au capital social de 10 000 €, immatriculée sous le numéro fiscal IT820492049, ayant son siège social à Milan, Italie. Directeur de la publication : Brejnev Diaz, Fondateur & CEO.",
      legalSec2: "2. Hébergement",
      legalSec2Desc: "Cette application SaaS est hébergée sur les serveurs sécurisés d'Amazon Web Services (AWS) Europe (Francfort) et de Supabase Inc., garantissant une protection maximale de vos données et une conformité totale au Règlement Général sur la Protection des Données (RGPD).",
      legalSec3: "3. Données Personnelles et Sécurité",
      legalSec3Desc: "Conformément à la législation européenne, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Les données collectées pour la prospection ne sont jamais partagées à des tiers et restent confinées dans votre CRM privé sécurisé.",
      
      q1: "Comment fonctionne l'estimation du Chiffre d'Affaires ?",
      a1: "Notre algorithme croise le volume de trafic mensuel détecté avec le panier moyen typique du secteur (niche) et un taux de conversion standard de 1.8% à 2.5% pour estimer le chiffre d'affaires généré de manière réaliste.",
      q2: "Comment les applications et le thème Shopify sont-ils identifiés ?",
      a2: "En analysant le code source HTML public de la boutique cible, notre système détecte les signatures CSS des thèmes populaires ainsi que les scripts de tracking et les APIs tierces connectées (Klaviyo, Loox, Recharge, etc.).",
      q3: "D'où proviennent les données des produits phares et des publicités ?",
      a3: "Les produits best-sellers sont extraits en analysant le catalogue public de la boutique. Les créatifs publicitaires sont récupérés en direct depuis la bibliothèque publicitaire Meta Ads, TikTok Creative Center et Pinterest Ads.",
      q4: "Puis-je exporter une boutique directement dans le CRM de prospection ?",
      a4: "Oui ! En cliquant sur 'Prospecter Boutique' ou 'Importer', la marque est instantanément ajoutée à vos leads CRM. Vous pouvez alors lui attribuer des créateurs partenaires et lancer des campagnes d'outreach automatisées.",

      // Premium Access Keys
      vipCoachingBtn: "Rejoindre le Live Coaching 🎥",
      vipBlogBtn: "Accéder au Blog VIP & Études de Cas 📰",
      lockedTitle: "💎 ESPACE EXCLUSIF PREMIUM VIP",
      lockedSub: "Ce contenu est réservé aux membres de nos clubs VIP & aux Administrateurs.",
      lockedFeat1: "Sessions de coaching vidéo hebdomadaires en direct pour auditer vos campagnes et boutiques.",
      lockedFeat2: "Études de cas ultra-détaillées sur le scaling réel de 0 à +100k€/mois.",
      lockedFeat3: "Accès prioritaire à notre roster d'influenceurs performants et support expert 24/7.",
      upgradeBtn: "Confirmer l'Abonnement (Stripe Checkout) ⚡",
      stripeSecure: "Traitement sécurisé Stripe... 🔐",
      upgradeSuccess: "Paiement réussi ! 🎉 Bienvenue au Club VIP. Votre rôle a été surclassé.",
      backBtn: "Retour aux Ressources ⬅️",
      sendBtn: "Envoyer 🚀",
      chatPlaceholder: "Écrivez un message dans le live chat...",
      readArticle: "Lire l'article ➔",
      
      // Tiers titles
      planPro: "Abonnement VIP Pro 💎",
      planElite: "Abonnement VIP Elite 🔥",
      planProPrice: "3999 € / mois",
      planElitePrice: "5999 € / mois",
      planProLimits: "• 2 coachings live par mois\n• 2 études de cas blog par mois\n• Support VIP standard",
      planEliteLimits: "• 1 coaching live chaque semaine (4/mois)\n• Études de cas & blog en illimité\n• Support VIP prioritaire 24/7"
    },
    en: {
      titleSuccess: "🏆 Our Success & Key Metrics",
      descSuccess: "Real-time statistics of our acquisition platform.",
      shopsAnalyzed: "Shopify Stores Analyzed",
      shopsDesc: "Daily tracking of traffic and applications.",
      creativesIndexed: "AdSpy Creatives Indexed",
      creativesDesc: "Meta, TikTok and Pinterest videos.",
      sourcingRate: "Successful Sourcing Rate",
      sourcingDesc: "AliExpress & Google suppliers found.",
      roasAverage: "Average ROAS of our Clients",
      roasDesc: "Increase after competitive analysis.",
      
      titleEdu: "📚 Our Educational Resources (VIP)",
      descEdu: "Accelerate your e-commerce growth with our exclusive resources.",
      liveCoaching: "VIP Live Coaching",
      everyWeek: "Every Week",
      liveCoachingDesc: "Join our weekly live video sessions to audit your advertising campaigns and optimize your acquisition rate with Brejnev Diaz and the team.",
      blogStrategies: "VIP Blog & Strategies",
      blogDesc: "Tips, tricks and concrete case studies on paid acquisition and influence to scale your Shopify store from 0 to €100k per month.",
      shopifyOffer: "Shopify Store at $1/month 🚀",
      shopifyOfferDesc: "Take advantage of our exclusive affiliate partnership: Create your Shopify store with a free trial and special deal.",
      claimOffer: "Claim the offer ➔",
      
      titleFaq: "❓ Frequently Asked Questions (FAQ)",
      descFaq: "All answers to your technical and functional questions.",
      
      titlePartners: "🤝 Our Partnerships & Integrations",
      descPartners: "We collaborate with the best technologies on the market.",
      
      titleLegal: "⚖️ Legal Notice",
      descLegal: "Mandatory information concerning the publisher and host of the application.",
      legalSec1: "1. App Publisher",
      legalSec1Desc: "The ViralAcq Pro suite is published by the company Viral Acquisition S.r.l., with a share capital of €10,000, registered under tax number IT820492049, with its registered office in Milan, Italy. Publishing Director: Brejnev Diaz, Founder & CEO.",
      legalSec2: "2. Hosting",
      legalSec2Desc: "This SaaS application is hosted on secure servers of Amazon Web Services (AWS) Europe (Frankfurt) and Supabase Inc., ensuring maximum data protection and full compliance with the General Data Protection Regulation (GDDR).",
      legalSec3: "3. Personal Data and Security",
      legalSec3Desc: "In accordance with European legislation, you have the right to access, rectify and delete your personal data. The data collected for prospecting is never shared with third parties and remains confined to your private secure CRM.",
      
      q1: "How does Turnover estimation work?",
      a1: "Our algorithm crosses the detected monthly traffic volume with the typical average basket of the sector (niche) and a standard conversion rate of 1.8% to 2.5% to estimate the generated revenue realistically.",
      q2: "How are Shopify apps and themes identified?",
      a2: "By analyzing the public HTML source code of the target store, our system detects CSS signatures of popular themes as well as tracking scripts and connected third-party APIs (Klaviyo, Loox, Recharge, etc.).",
      q3: "Where do hot products and ad data come from?",
      a3: "Best-selling products are extracted by analyzing the store's public catalog. Advertising creatives are retrieved live from the Meta Ads Library, TikTok Creative Center and Pinterest Ads.",
      q4: "Can I export a store directly to the prospecting CRM?",
      a4: "Yes! By clicking on 'Prospect Store' or 'Import', the brand is instantly added to your CRM leads. You can then assign partner creators and launch automated outreach campaigns.",

      vipCoachingBtn: "Join Live Coaching 🎥",
      vipBlogBtn: "Access VIP Blog & Case Studies 📰",
      lockedTitle: "💎 EXCLUSIVE PREMIUM VIP AREA",
      lockedSub: "This content is reserved for our VIP members & Administrators.",
      lockedFeat1: "Weekly live video coaching webinars to audit your active campaigns and Shopify stores.",
      lockedFeat2: "Highly confidential case studies tracing real store scaling from 0 to +$100k/month.",
      lockedFeat3: "Priority bookings in our high-performance UGC talent roster and 24/7 expert messaging support.",
      upgradeBtn: "Confirm Subscription (Stripe Checkout) ⚡",
      stripeSecure: "Processing secure Stripe checkout... 🔐",
      upgradeSuccess: "Payment successful! 🎉 Welcome to the VIP Club. Your account has been upgraded.",
      backBtn: "Back to Resources ⬅️",
      sendBtn: "Send 🚀",
      chatPlaceholder: "Write a message in the live chat...",
      readArticle: "Read full article ➔",
      
      planPro: "VIP Pro Membership 💎",
      planElite: "VIP Elite Membership 🔥",
      planProPrice: "€3999 / month",
      planElitePrice: "€5999 / month",
      planProLimits: "• 2 live coachings per month\n• 2 blog case studies per month\n• Standard VIP support",
      planEliteLimits: "• 1 live coaching every week (4/month)\n• Unlimited case studies & blog posts\n• Priority 24/7 Expert support"
    },
    it: {
      titleSuccess: "🏆 I Nostri Successi & Metriche Chiave",
      descSuccess: "Statistiche in tempo reale della nostra piattaforma di acquisizione.",
      shopsAnalyzed: "Negozi Shopify Analizzati",
      shopsDesc: "Tracciamento quotidiano di traffico e applicazioni.",
      creativesIndexed: "Creativi AdSpy Indicizzati",
      creativesDesc: "Video di Meta, TikTok e Pinterest.",
      sourcingRate: "Tasso di Sourcing Riuscito",
      sourcingDesc: "Fornitori AliExpress & Google trovati.",
      roasAverage: "ROAS Medio dei nostri Clienti",
      roasDesc: "Aumento dopo l'analisi della concorrenza.",
      
      titleEdu: "📚 Le Nostre Risorse Educative (VIP)",
      descEdu: "Accelera la tua crescita e-commerce con le nostre risorse esclusive.",
      liveCoaching: "Coaching dal Vivo VIP",
      everyWeek: "Ogni Settimana",
      liveCoachingDesc: "Partecipa alle nostre sessioni di video coaching dal vivo per analizzare i tuoi creativi e ottimizzare il tasso di acquisizione con Brejnev Diaz e il team.",
      blogStrategies: "Blog & Strategie VIP",
      blogDesc: "Consigli, trucchi e casi di studio concreti sull'acquisizione a pagamento e sull'influenza per scalare il tuo negozio Shopify da 0 a 100k€ al mese.",
      shopifyOffer: "Negozio Shopify a 1$/mese 🚀",
      shopifyOfferDesc: "Approfitta della nostra partnership di affiliazione esclusiva: Crea il tuo negozio Shopify con prova gratuita ed offerta speciale.",
      claimOffer: "Approfitta dell'offerta ➔",
      
      titleFaq: "❓ Domande Frequenti (FAQ)",
      descFaq: "Tutte le risposte alle tue domande tecniche e funzionali.",
      
      titlePartners: "🤝 Le Nostre Partnership & Integrazioni",
      descPartners: "Collaboriamo con le migliori tecnologie sul mercato.",
      
      titleLegal: "⚖️ Note Legali",
      descLegal: "Informazioni obbligatorie riguardanti l'editore e l'host dell'applicazione.",
      legalSec1: "1. Editore dell'applicazione",
      legalSec1Desc: "La suite ViralAcq Pro è pubblicata dalla società Viral Acquisition S.r.l., con un capitale sociale di 10.000 €, iscritta con il codice fiscale IT820492049, con sede legale a Milano, Italia. Direttore editoriale: Brejnev Diaz, Fondatore & CEO.",
      legalSec2: "2. Hosting",
      legalSec2Desc: "Questa applicazione SaaS è ospitata sui server sicuri di Amazon Web Services (AWS) Europe (Francoforte) e Supabase Inc., garantendo la massima protezione dei tuoi dati e la piena conformità al Regolamento Generale sulla Protezione dei Dati (GDPR).",
      legalSec3: "3. Dati Personali e Sicurezza",
      legalSec3Desc: "In conformità con la legislazione europea, hai il diritto di accedere, rettificare e cancellare i tuoi dati personali. I dati raccolti per la prospezione non vengono mai condivisi con terze parti e rimangono confinati nel tuo CRM privato sicuro.",
      
      q1: "Come funziona la stima del fatturato?",
      a1: "Il nostro algoritmo incrocia il volume di traffico mensile rilevato con il carrello medio tipico del settore (nicchia) e un tasso di conversione standard dell'1.8% al 2.5% per stimare il fatturato generato in modo realistico.",
      q2: "Come vengono identificati i temi e le app Shopify?",
      a2: "Analizzando il codice sorgente HTML pubblico del negozio di destinazione, il nostro sistema rileva le firme CSS dei temi popolari, nonché gli script di tracciamento e le API di terze parti collegate (Klaviyo, Loox, Recharge, ecc.).",
      q3: "Da dove provengono i dati dei prodotti di punta e delle inserzioni?",
      a3: "I prodotti più venduti vengono estratti analizzando il catalogo pubblico del negozio. I creativi pubblicitari vengono recuperati in tempo reale dalla Meta Ads Library, TikTok Creative Center e Pinterest Ads.",
      q4: "Posso esportare un negozio direttamente nel CRM di prospezione?",
      a4: "Sì! Cliccando su 'Prospetta Negozio' o 'Importa', il marchio viene istantaneamente aggiunto ai tuoi lead CRM. Puoi quindi assegnare creatori partner e avviare campagne di outreach automatizzate.",

      vipCoachingBtn: "Accedi al Live Coaching 🎥",
      vipBlogBtn: "Accedi al Blog VIP & Casi Studio 📰",
      lockedTitle: "💎 AREA ESCLUSIVA PREMIUM VIP",
      lockedSub: "Questo contenuto è riservato ai membri dei club VIP & agli Amministratori.",
      lockedFeat1: "Sessioni settimanali di video coaching dal vivo per analizzare inserzioni e store.",
      lockedFeat2: "Casi studio ultra-dettagliati sullo scaling reale da 0 a +100k€/mese con dati e fatturati.",
      lockedFeat3: "Priorità di prenotazione sui talent UGC del roster e supporto dedicato 24/7 dai nostri esperti.",
      upgradeBtn: "Conferma Abbonamento (Stripe Checkout) ⚡",
      stripeSecure: "Elaborazione transazione Stripe sicura... 🔐",
      upgradeSuccess: "Pagamento completato! 🎉 Benvenuto nel Club VIP. Il tuo profilo è premium.",
      backBtn: "Torna alle Risorse ⬅️",
      sendBtn: "Invia 🚀",
      chatPlaceholder: "Scrivi un messaggio nella chat live...",
      readArticle: "Leggi l'articolo completo ➔",
      
      planPro: "Abbonamento VIP Pro 💎",
      planElite: "Abbonamento VIP Elite 🔥",
      planProPrice: "3999 € / mese",
      planElitePrice: "5999 € / mese",
      planProLimits: "• 2 coaching live al mese\n• 2 casi studio blog al mese\n• Supporto VIP standard",
      planEliteLimits: "• 1 coaching live ogni settimana (4/mese)\n• Casi studio & blog in illimitato\n• Supporto VIP prioritario 24/7"
    }
  }[uiLang] || t.fr;

  const stats = [
    { number: "+150k", label: t.shopsAnalyzed, desc: t.shopsDesc },
    { number: "12M+", label: t.creativesIndexed, desc: t.creativesDesc },
    { number: "98.8%", label: t.sourcingRate, desc: t.sourcingDesc },
    { number: "+320%", label: t.roasAverage, desc: t.roasDesc }
  ];

  const partnerships = [
    { name: "Shopify Partner", logo: "https://cdn.simpleicons.org/shopify/96bf48" },
    { name: "Meta Business Partner", logo: "https://cdn.simpleicons.org/meta/0668e1" },
    { name: "TikTok Shop Partner", logo: "https://cdn.simpleicons.org/tiktok/000000" },
    { name: "Pinterest Business", logo: "https://cdn.simpleicons.org/pinterest/bd081c" },
    { name: "AliExpress Sourcing", logo: "https://cdn.simpleicons.org/aliexpress/ff4747" }
  ];

  const faqs = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 }
  ];

  // Premium Blog Articles Database
  const premiumArticles = {
    fr: [
      {
        id: "a1",
        title: "📈 Comment nous avons scalé 'GlowSkin' de 0 à 120k€/mois en 45 jours avec TikTok UGC",
        date: "20/05/2026",
        tag: "SCALING • VIP",
        readTime: "6 min",
        content: `La majorité des e-commerçants échoue par manque d'agilité créative. Pour GlowSkin, nous avons mis en place une méthode stricte d'acquisition UGC (User Generated Content).

Étape 1 : Le Sourcing Créateur
- Nous avons sélectionné 5 créateurs beauté de notre agence exclusive avec un taux d'engagement > 5.5%.
- Brief envoyé : Démontrer l'efficacité immédiate de notre Spatule Ultrasonore sous forme de format court style "ASMR" (bruits de peau nette) et "Avant/Après" en 15 secondes.

Étape 2 : Le Testing des Créatifs (TikTok Ads)
- Budget : 50 € par jour par Ad Set (CBO).
- Nous avons testé 3 accroches différentes : "Cette spatule a sauvé ma peau", "Ne achetez pas de soin en institut avant d'avoir vu ça", et un format silencieux.
- L'accroche "Cette spatule a sauvé ma peau" a généré un CTR de 4.8% avec un coût par achat de seulement 6.40 €.

Étape 3 : Le scaling sans fatigue
- Une fois le gagnant isolé, nous avons multiplié le budget par 4, en créant des variations d'accroches de fin (Call to Action promotionnel 1 acheté = 1 gratuit).
- Résultat final : Un ROAS global de 8.4x sur les 45 jours et 120k€ de chiffre d'affaires encaissé sur Shopify.`
      },
      {
        id: "a2",
        title: "📦 Les secrets cachés du sourcing européen pour maximiser vos marges à +85%",
        date: "15/05/2026",
        tag: "SOURCING",
        readTime: "8 min",
        content: `S'approvisionner uniquement sur AliExpress en livraison standard ruine l'expérience utilisateur et génère 15% de litiges pour colis perdus. Voici comment notre agence gère la logistique.

1. Le Groupage de Fret Aérien
- Au lieu d'expédier les colis individuellement depuis Shenzhen, nous regroupons tous les colis de nos e-commerçants partenaires à l'aéroport de Guangzhou.
- Le dédouanement est effectué de manière groupée en Europe (Liège ou Francfort), réduisant le délai de livraison à 5 jours ouvrés garantis vers la France et l'Italie.

2. Les Agents Privés en Italie et en Europe
- Pour les produits phares de la niche Beauté (crèmes, huiles bio), nous travaillons avec des laboratoires basés en Italie du Nord (Florence).
- Le coût unitaire est 20% plus élevé que le bas de gamme chinois, mais la valeur perçue multiplie le prix de vente par 4. Les marges nettes restent supérieures à 80% avec un taux de retour inférieur à 1%.`
      },
      {
        id: "a3",
        title: "🎯 ROAS 12x : Stratégies de scaling de budgets publicitaires sans perdre en efficacité",
        date: "10/05/2026",
        tag: "ADS • META",
        readTime: "5 min",
        content: `Le scaling publicitaire horizontal est l'art de dupliquer les audiences gagnantes tout en maintenant un coût d'acquisition stable.

Voici la structure de notre campagne VIP Meta Ads :
- 1 Campagne principale en CBO (Campaign Budget Optimization) avec un budget initial de 250 €/jour.
- 1 Ad Set ciblant les audiences similaires (Lookalike 1% à 3% sur les acheteurs récents).
- 1 Ad Set ciblant des intérêts larges (Skincare, Cosmétique, Esthétique).
- 1 Ad Set en Broad complet (aucun ciblage, uniquement l'algorithme de Meta qui cherche la cible).

Règle d'or : Ne modifiez jamais une campagne active de plus de 20% par jour pour éviter de relancer la phase d'apprentissage. Créez des campagnes de duplication (campagnes "Scales") pour tester des budgets 5x plus élevés sur les créatifs les plus performants.`
      }
    ],
    en: [
      {
        id: "a1",
        title: "📈 How We Scaled 'GlowSkin' from 0 to €120,000/month in 45 Days with TikTok UGC",
        date: "20/05/2026",
        tag: "SCALING • VIP",
        readTime: "6 min",
        content: `Most e-commerce founders fail because they lack creative testing agility. For GlowSkin, we implemented a strict UGC (User Generated Content) workflow.

Step 1: Creator Staffing
- Selected 5 beauty creators from our roster with engagement rates > 5.5%.
- Brief sent: Show immediate product efficacy (ultrasonic spatula) with ASMR and 15s "Before/After" hooks.

Step 2: Creative Testing (TikTok Ads)
- Budget: €50/day per Ad Set (CBO).
- Tested 3 hooks: "This spatula saved my skin", "Don't buy clinic facials before watching this", and a silent ASMR format.
- "This spatula saved my skin" generated a 4.8% CTR with a €6.40 Cost Per Purchase.

Step 3: Scaling phase
- Scaled budget 4x on the winning hook, creating call-to-action variations (e.g. 1+1 Free promo).
- Final Result: 8.4x ROAS over 45 days, generating €120k on Shopify.`
      },
      {
        id: "a2",
        title: "📦 Hidden European Sourcing Secrets to Maximize Margins at +85%",
        date: "15/05/2026",
        tag: "SOURCING",
        readTime: "8 min",
        content: `Shipping individually from AliExpress ruins user experience and causes up to 15% chargeback rates. Here is how our agency handles modern sourcing.

1. Air Freight Groupage
- Instead of individual packages from China, we consolidate inventory at Guangzhou airport.
- Custom clearance is done in bulk at Liège or Frankfurt, dropping delivery times to 5 working days to France/Italy.

2. Private Agents in Italy & Europe
- For cosmetic products, we source from Northern Italian labs.
- Costs are 20% higher than bulk Chinese imports, but the premium branding allows selling at 4x the price, keeping net margins above 80% with less than 1% refund requests.`
      },
      {
        id: "a3",
        title: "🎯 ROAS 12x: Advanced Advertising Scaling Tactics Without Dropping Efficacy",
        date: "10/05/2026",
        tag: "ADS • META",
        readTime: "5 min",
        content: `Scaling is the art of expanding winning audiences while holding acquisition costs steady.

Our VIP Meta Ads structure:
- 1 Main Campaign under CBO (Campaign Budget Optimization) starting at €250/day.
- 1 Lookalike Ad Set (1% to 3% on customer lifetime value).
- 1 Interest Ad Set (Skincare, Cosmetics, Aesthetics).
- 1 Broad Ad Set (completely open, relying solely on pixel optimization).

Rule of thumb: Never increase active campaign budgets by more than 20% a day to protect the learning phase. Use scale duplication campaigns to test 5x budgets on verified creatives.`
      }
    ],
    it: [
      {
        id: "a1",
        title: "📈 Come abbiamo scalato 'GlowSkin' da 0 a 120.000 €/mese in 45 giorni con TikTok UGC",
        date: "20/05/2026",
        tag: "SCALING • VIP",
        readTime: "6 min",
        content: `La maggior parte degli e-commerce fallisce per mancanza di agilità creativa. Per GlowSkin, abbiamo introdotto una strategia UGC (User Generated Content) rigorosa.

Fase 1: Selezione dei Creator
- Abbiamo scelto 5 creator beauty del nostro roster esclusivo con tasso di engagement > 5.5%.
- Brief inviato: Mostrare l'efficacia immediata della Spatola ad Ultrasuoni stile "ASMR" ed effetti "Prima/Dopo" in 15 secondi.

Fase 2: Test dei Creativi (TikTok Ads)
- Budget: 50 € al giorno per Ad Set (CBO).
- Testati 3 ganci (hooks): "Questa spatola ha salvato la mia pelle", "Non comprare trattamenti estetici prima di aver visto questo", e un formato asettico.
- Il gancio "Questa spatola ha salvato la mia pelle" ha registrato un CTR del 4.8% con costo per acquisto di soli 6.40 €.

Fase 3: Scaling del budget
- Trovato il vincitore, abbiamo scalato il budget di 4 volte, creando varianti di Call to Action promozionali (es. 1 acquistato = 1 in omaggio).
- Risultato finale: ROAS globale di 8.4x in 45 giorni e 120.000 € di fatturato su Shopify.`
      },
      {
        id: "a2",
        title: "📦 I segreti nascosti del sourcing europeo per massimizzare i margini al +85%",
        date: "15/05/2026",
        tag: "SOURCING",
        readTime: "8 min",
        content: `Spedire i pacchi singolarmente tramite AliExpress standard rovina l'esperienza dell'utente e genera fino al 15% di rimborsi. Ecco come gestiamo la logistica.

1. Consolidamento di Spedizione Aerea
- Invece di pacchi singoli, raggruppiamo i prodotti dei nostri brand partner all'aeroporto di Guangzhou.
- Lo sdoganamento in Europa avviene in blocco a Liegi o Francoforte, abbattendo i tempi a soli 5 giorni lavorativi.

2. Agenti Privati in Italia ed Europa
- Per cosmetici e oli bio, collaboriamo direttamente con laboratori in Toscana e Lombardia.
- Il costo unitario è del 20% superiore rispetto alla Cina, ma la qualità premium consente di vendere a un prezzo 4 volte superiore, tenendo i margi netti sopra l'80% e resi a meno dell'1%.`
      },
      {
        id: "a3",
        title: "🎯 ROAS 12x: Strategie di scaling dei budget pubblicitari senza perdere efficacia",
        date: "10/05/2026",
        tag: "ADS • META",
        readTime: "5 min",
        content: `Lo scaling pubblicitario orizzontale è l'arte di espandere il pubblico vincente mantenendo stabile il costo di acquisizione.

Struttura della nostra campagna VIP Meta Ads:
- 1 Campagna principale CBO (Campaign Budget Optimization) a 250 €/giorno.
- 1 Ad Set di Lookalike (1% al 3% sui clienti recenti).
- 1 Ad Set di interessi (Skincare, Cosmetici, Estetica).
- 1 Ad Set in Broad completo (nessun target, basato solo su pixel Meta).

Regola d'oro: Non aumentare mai il budget di campagne attive di oltre il 20% al giorno per evitare di resettare la fase di apprendimento. Usa campagne di duplicazione per testare budget 5 volte superiori sui creativi testati.`
      }
    ]
  }[uiLang] || premiumArticles.fr;

  // Visual Webinar Training modules list
  const coachingSessions = [
    { id: "session_1", title: uiLang === 'fr' ? "1. ROAS 12x : Structures de Campagnes Facebook CBO" : "1. ROAS 12x: Facebook CBO Ad Structures", type: "replay", duration: "45 min" },
    { id: "session_2", title: uiLang === 'fr' ? "2. Sourcing Asie & Europe : Maximiser vos marges" : "2. Sourcing Asia & Europe: Maximize margins", type: "replay", duration: "52 min" },
    { id: "session_3", title: uiLang === 'fr' ? "3. En Direct : Audits Boutiques & Taux de Conversion" : "3. Live Now: Shopify Store & CR Audits", type: "live", duration: "LIVE 🔴" },
    { id: "session_4", title: uiLang === 'fr' ? "4. Stratégie de Scaling Horizontal & Duplication" : "4. Scale Strategy & Duplication Hacks", type: "upcoming", duration: "Monday 18:00" }
  ];

  // Handle premium click gate
  const checkVipAccess = (target) => {
    if (userTier === "vip_pro" || userTier === "vip_elite" || userTier === "admin") {
      setActiveVipTab(target);
    } else {
      setLockedTarget(target);
    }
  };

  // Simulated stripe billing upgrade
  const handleUpgrade = () => {
    setIsUpgrading(true);
    setUpgradeMessage(t.stripeSecure);
    setTimeout(() => {
      if (onUpgradeTier) {
        onUpgradeTier(selectedPlan === "pro" ? "vip_pro" : "vip_elite");
      }
      setIsUpgrading(false);
      setUpgradeMessage("");
      setActiveVipTab(lockedTarget);
      setLockedTarget("");
      alert(t.upgradeSuccess);
    }, 1800);
  };

  // Simulated PDF Download
  const handleDownloadPdf = (articleTitle) => {
    setIsDownloadingPdf(true);
    setTimeout(() => {
      setIsDownloadingPdf(false);
      alert(uiLang === 'fr' 
        ? `📥 Téléchargement réussi : PDF "${articleTitle}" enregistré !` 
        : `📥 Download successful: PDF "${articleTitle}" saved!`);
    }, 1500);
  };

  // Simulated Reminder setting
  const toggleReminder = (sessionId) => {
    if (activeReminder === sessionId) {
      setActiveReminder(null);
      alert(uiLang === 'fr' ? "🔔 Rappel désactivé." : "🔔 Reminder disabled.");
    } else {
      setActiveReminder(sessionId);
      alert(uiLang === 'fr' ? "🔔 Rappel activé ! Vous recevrez un e-mail 15 min avant le début du live." : "🔔 Reminder enabled! You will be notified 15 mins before the live.");
    }
  };

  // Add message to live chat
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      user: userTier === 'admin' ? "Admin Brejnev 👑" : "Vous (Premium) ✨",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, msg]);
    setChatInput("");
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* ── SIMULATION SELECTOR FOR TESTING TIER ACCESS ── */}
      <div style={{
        background: `linear-gradient(135deg, ${c.card}, rgba(139, 92, 246, 0.05))`,
        border: `1.5px solid ${c.border}`,
        borderRadius: 14,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <PremiumDiamondIcon size={28} />
          <div>
            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: c.text }}>
              {uiLang === 'fr' ? 'Simulateur d\'Abonnement (Test d\'Accès VIP Tiers)' : (uiLang === 'it' ? 'Simulatore di Abbonamento (Test VIP Tiers)' : 'Billing Tier Simulator (VIP Tiers Test)')}
            </h4>
            <p style={{ margin: 0, fontSize: 11.5, color: c.textMuted }}>
              {uiLang === 'fr' ? 'Basculez entre Pro (3999€, 2 sessions/mois) et Elite (5999€, hebdomadaire illimité).' : (uiLang === 'it' ? 'Bilocato tra Pro (3999€, 2 sessioni/mese) ed Elite (5999€, illimitato).' : 'Switch between Pro (€3999, 2 sessions/mo) and Elite (€5999, weekly unlimited).')}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "standard", label: uiLang === 'fr' ? "Standard" : (uiLang === 'it' ? "Standard" : "Standard"), color: c.textMuted },
            { id: "vip_pro", label: uiLang === 'fr' ? "💎 VIP Pro (3999 €/mo)" : (uiLang === 'it' ? "💎 VIP Pro (3999 €/mese)" : "💎 VIP Pro (€3999/mo)"), color: c.accent },
            { id: "vip_elite", label: uiLang === 'fr' ? "🔥 VIP Elite (5999 €/mo)" : (uiLang === 'it' ? "🔥 VIP Elite (5999 €/mese)" : "🔥 VIP Elite (€5999/mo)"), color: c.accent2 },
            { id: "admin", label: uiLang === 'fr' ? "👑 Admin (Accès Total)" : (uiLang === 'it' ? "👑 Admin (Accesso Totale)" : "👑 Admin (Full Access)"), color: c.success }
          ].map(tier => (
            <button
              key={tier.id}
              onClick={() => {
                if (onUpgradeTier) {
                  onUpgradeTier(tier.id);
                }
                if (tier.id === "standard") {
                  setActiveVipTab(null);
                  setOpenArticle(null);
                }
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1.5px solid ${userTier === tier.id ? tier.color : c.border}`,
                background: userTier === tier.id ? `${tier.color}15` : "transparent",
                color: userTier === tier.id ? tier.color : c.textDim,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: mono,
                transition: "all 0.15s"
              }}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── PREMIUM TIER COMPARISON PAYWALL OVERLAY ── */}
      {lockedTarget && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, backdropFilter: "blur(10px)", padding: 20, boxSizing: "border-box",
          animation: "fadeIn 0.2s"
        }}>
          <div style={{
            background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 20,
            width: "100%", maxWidth: 640, padding: 30, position: "relative",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)", textAlign: "center"
          }}>
            <button 
              onClick={() => setLockedTarget("")} 
              style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", color: c.textDim, fontSize: 18, cursor: "pointer" }}
            >
              ✖
            </button>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><PremiumDiamondIcon size={46} /></div>
            <h3 style={{ fontSize: 19, fontWeight: 900, color: c.text, margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
              {t.lockedTitle}
            </h3>
            <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5, marginBottom: 24 }}>
              {t.lockedSub}
            </p>
            
            {/* Two Column Plan Comparison Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
              
              {/* VIP Pro Plan */}
              <div 
                onClick={() => setSelectedPlan("pro")}
                style={{
                  background: selectedPlan === "pro" ? `${c.accent}10` : c.bg,
                  border: `2px solid ${selectedPlan === "pro" ? c.accent : c.border}`,
                  borderRadius: 14, padding: 18, textAlign: "left", cursor: "pointer", transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: c.text }}>{t.planPro}</h4>
                  <input type="radio" checked={selectedPlan === "pro"} onChange={() => setSelectedPlan("pro")} style={{ accentColor: c.accent }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: c.accent, fontFamily: mono, marginBottom: 12 }}>{t.planProPrice}</div>
                <div style={{ fontSize: 12, color: c.textMuted, whiteSpace: "pre-line", lineHeight: 1.6 }}>{t.planProLimits}</div>
              </div>

              {/* VIP Elite Plan */}
              <div 
                onClick={() => setSelectedPlan("elite")}
                style={{
                  background: selectedPlan === "elite" ? `${c.accent2}10` : c.bg,
                  border: `2px solid ${selectedPlan === "elite" ? c.accent2 : c.border}`,
                  borderRadius: 14, padding: 18, textAlign: "left", cursor: "pointer", transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: c.text }}>{t.planElite}</h4>
                  <input type="radio" checked={selectedPlan === "elite"} onChange={() => setSelectedPlan("elite")} style={{ accentColor: c.accent2 }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: c.accent2, fontFamily: mono, marginBottom: 12 }}>{t.planElitePrice}</div>
                <div style={{ fontSize: 12, color: c.textMuted, whiteSpace: "pre-line", lineHeight: 1.6 }}>{t.planEliteLimits}</div>
              </div>

            </div>

            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              style={{
                width: "100%", padding: "14px", borderRadius: 10, border: "none",
                background: selectedPlan === "pro" ? c.accent : `linear-gradient(135deg, ${c.accent2}, #3b82f6)`, color: "#fff",
                fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: mono,
                boxShadow: `0 4px 16px ${selectedPlan === 'pro' ? c.accentGlow : 'rgba(59, 130, 246, 0.3)'}`
              }}
            >
              {isUpgrading ? t.stripeSecure : t.upgradeBtn}
            </button>
          </div>
        </div>
      )}

      {/* ── CHOSEN VIP TAB: LIVE COACHING WEBINAR ── */}
      {activeVipTab === "coaching" && (
        <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, animation: "fadeIn 0.3s" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${c.border}`, paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 700, background: userTier === 'vip_pro' ? c.accentSoft : c.successSoft, color: userTier === 'vip_pro' ? c.accent : c.success, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", display: "inline-block", marginBottom: 4, fontFamily: mono }}>
                {userTier === 'vip_pro' ? "MEMBRE VIP PRO (3999€/mois) • 2 LIVE / MOIS" : (userTier === 'admin' ? "👑 ADMIN • ACCÈS ILLIMITÉ" : "MEMBRE VIP ELITE (5999€/mois) • LIVE HEBDOMADAIRE")}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: 0 }}>📢 {t.liveCoaching}</h3>
            </div>
            <button 
              onClick={() => setActiveVipTab(null)}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: mono }}
            >
              {t.backBtn}
            </button>
          </div>

          {/* Alert check for Pro vs Elite constraints */}
          {userTier === 'vip_pro' && (
            <div style={{ background: `rgba(245, 158, 11, 0.08)`, border: `1.5px solid rgba(245, 158, 11, 0.3)`, color: c.text, borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 12.5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                ⚠️ <strong>Abonnement VIP Pro actif (3999 €) :</strong> Vous consommez actuellement <strong>{unlockedWebinars.length} crédit(s) sur 2</strong> autorisés ce mois-ci.<br/>
                Les replays avancés et les lives hebdomadaires complémentaires nécessitent la formule Elite.
              </div>
              <button 
                onClick={() => { setSelectedPlan("elite"); setLockedTarget("coaching"); }} 
                style={{ background: c.warning, border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: mono }}
              >
                Passer à Elite (+2000€) 🔥
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            
            {/* Live Streaming Video & Training List */}
            <div style={{ flex: "2 1 360px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Active Webinar box with live viewer count oscillation */}
              <div style={{ position: "relative", width: "100%", height: 320, borderRadius: 14, overflow: "hidden", background: "#000", border: `1.5px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  src="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-in-a-coffee-shop-41865-large.mp4" 
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
                />
                <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(220, 38, 38, 0.9)", color: "#fff", padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 10.5, fontFamily: mono, boxShadow: "0 0 10px rgba(220, 38, 38, 0.4)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "pulse 1.2s infinite" }}></span>
                  LIVE 🔴
                </div>
                <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.65)", color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 10.5, fontFamily: mono }}>
                  👥 {liveViewers} {uiLang === 'fr' ? 'membres connectés' : (uiLang === 'it' ? 'membri connessi' : 'members online')}
                </div>
                <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 12 }}>
                  🎤 {uiLang === 'fr' ? 'Présentateur : Brejnev Diaz (CEO)' : (uiLang === 'it' ? 'Presentatore: Brejnev Diaz (CEO)' : 'Presenter: Brejnev Diaz (CEO)')}
                </div>
              </div>

              {/* Training Modules list with access locks */}
              <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: 13.5, color: c.text, textTransform: "uppercase", fontFamily: mono }}>
                  📚 {uiLang === 'fr' ? 'Sessions de ce Mois' : 'Webinar Sessions of the Month'}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {coachingSessions.map((session, index) => {
                    // Check if Pro member has reached limit
                    // Pro members can only open Session 1 and Session 3. Session 2 requires VIP Elite.
                    const isLockedForPro = userTier === "vip_pro" && !unlockedWebinars.includes(session.id) && unlockedWebinars.length >= 2;
                    
                    return (
                      <div 
                        key={session.id} 
                        style={{
                          background: c.bg, border: `1.5px solid ${isLockedForPro ? c.border : c.borderActive}`, borderRadius: 10, padding: 12,
                          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                          opacity: isLockedForPro ? 0.6 : 1
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <strong style={{ fontSize: 13, color: c.text }}>{session.title}</strong>
                            <span style={{ fontSize: 9.5, background: session.type === 'live' ? c.successSoft : (session.type === 'replay' ? `${c.accent}15` : c.border), color: session.type === 'live' ? c.success : (session.type === 'replay' ? c.accent : c.textMuted), padding: "2px 6px", borderRadius: 4, textTransform: "uppercase", fontWeight: "bold" }}>
                              {session.type}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: c.textDim, fontFamily: mono }}>⏱️ {session.duration}</span>
                        </div>
                        
                        <div>
                          {isLockedForPro ? (
                            <button 
                              onClick={() => {
                                alert("🔒 Limite VIP Pro Atteinte : Vous avez déjà visionné 2 coachings ce mois-ci. Passez à la formule VIP Elite (+100€/mois) pour accéder à l'intégralité des lives hebdomadaires !");
                                setSelectedPlan("elite");
                                setLockedTarget("coaching");
                              }}
                              style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: c.accent2, color: "#fff", fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: mono }}
                            >
                              🔒 Débloquer Elite
                            </button>
                          ) : session.type === 'upcoming' ? (
                            <button 
                              onClick={() => toggleReminder(session.id)}
                              style={{ 
                                padding: "6px 10px", borderRadius: 6, 
                                border: `1.5px solid ${activeReminder === session.id ? c.success : c.border}`, 
                                background: activeReminder === session.id ? c.successSoft : "transparent",
                                color: activeReminder === session.id ? c.success : c.textMuted, 
                                fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: mono 
                              }}
                            >
                              {activeReminder === session.id ? "🔔 Rappel Actif ✓" : "🔔 M'avertir"}
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                if (userTier === "vip_pro" && !unlockedWebinars.includes(session.id)) {
                                  const updated = [...unlockedWebinars, session.id];
                                  setUnlockedWebinars(updated);
                                  localStorage.setItem("va_unlocked_webinars", JSON.stringify(updated));
                                }
                                setWatchedSessions(prev => {
                                  const next = new Set(prev);
                                  next.add(session.id);
                                  return next;
                                });
                                alert(uiLang === 'fr' ? `🎬 Lancement de l'enregistrement : "${session.title}"` : `🎬 Loading training: "${session.title}"`);
                              }}
                              style={{ 
                                padding: "6px 10px", borderRadius: 6, 
                                border: `1.5px solid ${watchedSessions.has(session.id) ? c.border : c.accent}`,
                                background: watchedSessions.has(session.id) ? "transparent" : c.accentSoft,
                                color: watchedSessions.has(session.id) ? c.textDim : c.accent,
                                fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: mono 
                              }}
                            >
                              {watchedSessions.has(session.id) ? "✓ Revoir" : "▶ Regarder"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Live Chat Client */}
            <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", height: 480, background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: 12, borderBottom: `1px solid ${c.border}`, background: c.card }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: c.text, fontFamily: mono }}>💬 LIVE WEBINAR CHAT</span>
              </div>

              {/* Chat list */}
              <div style={{ flex: 1, padding: 12, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ fontSize: 12, lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 800, color: msg.user.includes("Brejnev") ? c.accent : (msg.user.includes("Vous") ? c.accent2 : c.textDim), fontFamily: mono, marginRight: 6 }}>
                      {msg.user}
                    </span>
                    <span style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono, marginRight: 6 }}>{msg.time}</span>
                    <p style={{ margin: "2px 0 0 0", color: c.text }}>{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Send Box */}
              <form onSubmit={handleSendChatMessage} style={{ padding: 10, borderTop: `1px solid ${c.border}`, background: c.card, display: "flex", gap: 6 }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={t.chatPlaceholder}
                  style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, fontSize: 12, outline: "none" }}
                />
                <button type="submit" style={{ padding: "0 12px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: mono }}>
                  {t.sendBtn}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── CHOSEN VIP TAB: BLOG & CASE STUDIES ── */}
      {activeVipTab === "blog" && (
        <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, animation: "fadeIn 0.3s" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${c.border}`, paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 700, background: userTier === 'vip_pro' ? c.accentSoft : c.successSoft, color: userTier === 'vip_pro' ? c.accent : c.success, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", display: "inline-block", marginBottom: 4, fontFamily: mono }}>
                {userTier === 'vip_pro' ? "MEMBRE VIP PRO (3999€/mois) • 2 ARTICLES / MOIS" : (userTier === 'admin' ? "👑 ADMIN • ACCÈS ILLIMITÉ" : "MEMBRE VIP ELITE (5999€/mois) • ACCÈS ILLIMITÉ")}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: 0 }}>📰 {t.blogStrategies}</h3>
            </div>
            <button 
              onClick={() => {
                if (openArticle) setOpenArticle(null);
                else setActiveVipTab(null);
              }}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: mono }}
            >
              {t.backBtn}
            </button>
          </div>

          {openArticle ? (
            /* Full Article Reader View with simulated PDF download and loader */
            <div style={{ animation: "fadeInUp 0.3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ background: c.accentSoft, color: c.accent, fontSize: 9.5, padding: "3px 8px", borderRadius: 6, fontWeight: "bold", textTransform: "uppercase", fontFamily: mono }}>{openArticle.tag}</span>
                  <span style={{ fontSize: 11.5, color: c.textDim, fontFamily: mono }}>📅 {openArticle.date} • ⏱️ {openArticle.readTime}</span>
                </div>
                
                {/* PDF Download Button with simulated spinner */}
                <button
                  onClick={() => handleDownloadPdf(openArticle.title)}
                  disabled={isDownloadingPdf}
                  style={{
                    padding: "8px 14px", borderRadius: 8, border: "none",
                    background: isDownloadingPdf ? c.border : c.success, color: "#fff",
                    fontSize: 11, fontWeight: "bold", cursor: isDownloadingPdf ? "not-allowed" : "pointer", fontFamily: mono,
                    display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  {isDownloadingPdf ? (
                    <>
                      <span className="spinner-icon" style={{ display: "inline-block", width: 10, height: 10, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></span>
                      {uiLang === 'fr' ? "Téléchargement..." : "Downloading..."}
                    </>
                  ) : (
                    <>📥 {uiLang === 'fr' ? "Télécharger en PDF" : "Download PDF"}</>
                  )}
                </button>
              </div>
              
              <h3 style={{ fontSize: 20, fontWeight: 800, color: c.text, marginBottom: 16, letterSpacing: "-0.5px" }}>{openArticle.title}</h3>
              
              <div style={{ 
                background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: 22, 
                fontSize: 14, color: c.text, whiteSpace: "pre-wrap", lineHeight: 1.7 
              }}>
                {openArticle.content}
              </div>
              
              <div style={{ marginTop: 20 }}>
                <button 
                  onClick={() => setOpenArticle(null)}
                  style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: mono }}
                >
                  ⬅️ {uiLang === 'fr' ? 'Retour aux Articles' : (uiLang === 'it' ? 'Torna agli articoli' : 'Back to Articles')}
                </button>
              </div>
            </div>
          ) : (
            /* Article Feed List with Pro limitations */
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {premiumArticles.map((art, idx) => {
                const isLockedForPro = userTier === "vip_pro" && !unlockedArticles.includes(art.id) && unlockedArticles.length >= 2;
                
                return (
                  <div 
                    key={art.id}
                    style={{ 
                      background: c.bg, border: `1.5px solid ${isLockedForPro ? c.border : c.borderActive}`, borderRadius: 14, padding: 18, 
                      transition: "all 0.2s", opacity: isLockedForPro ? 0.6 : 1 
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                      <span style={{ background: c.accentSoft, color: c.accent, fontSize: 9, padding: "2px 6px", borderRadius: 5, fontWeight: "bold", textTransform: "uppercase", fontFamily: mono }}>{art.tag}</span>
                      <span style={{ fontSize: 11, color: c.textDim, fontFamily: mono }}>📅 {art.date} • ⏱️ {art.readTime}</span>
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 800, color: c.text, margin: "0 0 8px 0" }}>{art.title}</h4>
                    
                    {isLockedForPro ? (
                      <button 
                        onClick={() => {
                          alert("🔒 Limite VIP Pro Atteinte : Vous avez déjà lu 2 études de cas ce mois-ci. Passez à la formule VIP Elite (+2000€/mois) pour débloquer l'accès en illimité à tous nos articles stratégiques !");
                          setSelectedPlan("elite");
                          setLockedTarget("blog");
                        }}
                        style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: c.accent2, color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: mono }}
                      >
                        🔒 Débloquer l'accès VIP Elite
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if (userTier === "vip_pro" && !unlockedArticles.includes(art.id)) {
                            const updated = [...unlockedArticles, art.id];
                            setUnlockedArticles(updated);
                            localStorage.setItem("va_unlocked_articles", JSON.stringify(updated));
                          }
                          setOpenArticle(art);
                        }}
                        style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: `${c.accent}12`, color: c.accent, fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: mono }}
                      >
                        {t.readArticle}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Resource View when no VIP Tab is currently open */}
      {!activeVipTab && (
        <>
          {/* ── SECTION SUCCESS / NOS SUCCÈS ── */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ display: "flex", alignItems: "center", fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
                <PremiumTrophyIcon />
                {t.titleSuccess.replace(/🏆 /g, "")}
              </h3>
              <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descSuccess}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              {stats.map((s, idx) => (
                <div key={idx} style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 20, textAlign: "center", transition: "transform 0.2s" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6, fontFamily: mono }}>{s.number}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: c.textMuted }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION RESSOURCES (INSPIRED BY COPYFY) ── */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ display: "flex", alignItems: "center", fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
                <PremiumBookIcon />
                {t.titleEdu.replace(/📚 /g, "")}
              </h3>
              <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descEdu}</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              
              {/* Live Coaching Card */}
              <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", gap: 16, alignItems: "flex-start", flexFlow: "row wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${c.accent}12`, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent, flexShrink: 0, fontSize: 20 }}>📢</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 800, color: c.text, margin: 0 }}>{t.liveCoaching}</h4>
                    <span style={{ fontSize: 9, fontWeight: 700, background: c.successSoft, color: c.success, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>{t.everyWeek}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.5, margin: "0 0 16px 0" }}>
                    {t.liveCoachingDesc}
                  </p>
                  
                  {/* Join Webinar Action Gated Button */}
                  <button 
                    onClick={() => checkVipAccess("coaching")}
                    style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: mono, boxShadow: `0 4px 12px ${c.accentGlow}` }}
                  >
                    {t.vipCoachingBtn}
                  </button>
                </div>
              </div>

              {/* Blog Card */}
              <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", gap: 16, alignItems: "flex-start", flexFlow: "row wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${c.accent2}12`, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent2, flexShrink: 0, fontSize: 20 }}>📰</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.blogStrategies}</h4>
                  <p style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.5, margin: "0 0 16px 0" }}>
                    {t.blogDesc}
                  </p>
                  
                  {/* Read Blog Action Gated Button */}
                  <button 
                    onClick={() => checkVipAccess("blog")}
                    style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: `linear-gradient(90deg, ${c.accent2}, #3b82f6)`, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: mono }}
                  >
                    {t.vipBlogBtn}
                  </button>
                </div>
              </div>

              {/* Shopify $1 Offer Affiliation Card - FIXED LINK */}
              <div style={{ background: `linear-gradient(135deg, ${c.card}, rgba(16,185,129,0.02))`, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", flex: "1 1 300px" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, border: `1px solid rgba(149,191,72,0.2)`, background: "rgba(149,191,72,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src="https://cdn.simpleicons.org/shopify/96bf48" style={{ width: 32, height: 32 }} alt="Shopify" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: "0 0 4px 0" }}>{t.shopifyOffer}</h4>
                    <p style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
                      {t.shopifyOfferDesc}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => window.open("https://www.shopify.com/free-trial", "_blank")}
                  style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "#96bf48", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono, boxShadow: "0 4px 16px rgba(150,191,72,0.3)" }}
                >
                  {t.claimOffer}
                </button>
              </div>
            </div>
          </div>

          {/* ── SECTION FAQ (ACCORDION) ── */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{t.titleFaq}</h3>
              <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descFaq}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      background: c.card, 
                      border: `1.5px solid ${isOpen ? c.borderActive : c.border}`, 
                      borderRadius: 12, 
                      overflow: "hidden",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                  >
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{ 
                        width: "100%", 
                        padding: "16px 20px", 
                        background: "transparent", 
                        border: "none", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        color: isOpen ? c.accent : c.text, 
                        fontWeight: 700, 
                        fontSize: 14, 
                        textAlign: "left",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <span>{item.q}</span>
                      <span style={{ fontSize: 12, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        ▼
                      </span>
                    </button>
                    
                    {isOpen && (
                      <div style={{ 
                        padding: "0 20px 16px 20px", 
                        color: c.textMuted, 
                        fontSize: 13, 
                        lineHeight: 1.5,
                        borderTop: `1px solid ${c.border}22`,
                        paddingTop: 12,
                        animation: "fadeIn 0.2s ease-out" 
                      }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── SECTION PARTENARIATS ── */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ display: "flex", alignItems: "center", fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
                <PremiumHandshakeIcon />
                {t.titlePartners.replace(/🤝 /g, "")}
              </h3>
              <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descPartners}</p>
            </div>
            <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", flexWrap: "wrap", gap: 30, justifyContent: "center", alignItems: "center" }}>
              {partnerships.map((p, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.7, transition: "opacity 0.2s" }}>
                  <img src={p.logo} style={{ width: 22, height: 22, filter: c.iconFilter }} alt={p.name} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION MENTIONS LÉGALES ── */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{t.titleLegal}</h3>
              <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descLegal}</p>
            </div>
            
            <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h5 style={{ fontSize: 13, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.legalSec1}</h5>
                <p style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
                  {t.legalSec1Desc}
                </p>
              </div>
              <div>
                <h5 style={{ fontSize: 13, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.legalSec2}</h5>
                <p style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
                  {t.legalSec2Desc}
                </p>
              </div>
              <div>
                <h5 style={{ fontSize: 13, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.legalSec3}</h5>
                <p style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
                  {t.legalSec3Desc}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
