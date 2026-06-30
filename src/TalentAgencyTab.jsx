import React, { useState } from 'react';
import { supabase } from './supabaseClient';

// Real influencer talents scoured from https://viralacquisition.it/talents
const MOCK_TALENTS = [
  {
    id: "t_1",
    username: "diariatou__sow",
    niche: "beauty",
    followers: 48500,
    engagement: "6.2%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/diarry_sow.jpg",
    status: "active", // active | pending
    email: "diariatou@talent.viralacquisition.it"
  },
  {
    id: "t_2",
    username: "thatsnora",
    niche: "beauty", // fashion & beauty
    followers: 82100,
    engagement: "5.8%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/nora_coppini.jpg",
    status: "active",
    email: "nora@talent.viralacquisition.it"
  },
  {
    id: "t_3",
    username: "baratta_jessica",
    niche: "food",
    followers: 38200,
    engagement: "7.1%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/jessica_baratta.jpg",
    status: "active",
    email: "jessica@talent.viralacquisition.it"
  },
  {
    id: "t_4",
    username: "katerinmasi_",
    niche: "beauty",
    followers: 65400,
    engagement: "6.5%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/catherine_masiello.jpg",
    status: "active",
    email: "katerina@talent.viralacquisition.it"
  },
  {
    id: "t_5",
    username: "glamourousclaudia93",
    niche: "beauty",
    followers: 28000,
    engagement: "4.2%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/claudia_daniela.jpg",
    status: "active",
    email: "claudia@talent.viralacquisition.it"
  },
  {
    id: "t_6",
    username: "c.lau.g",
    niche: "food",
    followers: 52300,
    engagement: "5.1%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/claudia_guercio.jpg",
    status: "active",
    email: "clau@talent.viralacquisition.it"
  },
  {
    id: "t_7",
    username: "enzaoliva_",
    niche: "lifestyle",
    followers: 74800,
    engagement: "6.0%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/vincenza_oliva.jpg",
    status: "active",
    email: "enza@talent.viralacquisition.it"
  },
  {
    id: "t_8",
    username: "maryphotofashionmakeupfood",
    niche: "beauty",
    followers: 95200,
    engagement: "4.9%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/maria_teresa.jpg",
    status: "active",
    email: "mary@talent.viralacquisition.it"
  }
];

const MOCK_GIGS = [
  {
    id: "gig_1",
    brand: "GlowSkin Premium",
    title: "1 Instagram Reel - Spatola ad Ultrasuoni",
    niche: "beauty",
    budget: "$250 + 10% commission",
    requirements: "Micro-influencer Beauté (>30k followers)",
    description: "Vidéo esthétique montrant l'effet nettoyant de notre spatule à ultrasons. Envoi gratuit du produit inclus.",
    status: "open",
    logo: "https://logo.clearbit.com/glowskinco.com"
  },
  {
    id: "gig_2",
    brand: "FitBurn active",
    title: "2 Vidéos TikTok - Smoothie Proteico",
    niche: "food",
    budget: "$180 + 15% commission",
    requirements: "Créateurs Fitness/Food (>40k followers)",
    description: "Préparation d'un smoothie post-entraînement avec nos protéines végétales FitBurn.",
    status: "open",
    logo: "https://logo.clearbit.com/fitburnwear.com"
  },
  {
    id: "gig_3",
    brand: "PureMatcha Shop",
    title: "1 Instagram Post & Story - Ritual Matcha",
    niche: "food",
    budget: "$120 + 12% commission",
    requirements: "Profil Lifestyle/Food (>20k followers)",
    description: "Partagez votre rituel matinal apaisant autour de la préparation du Matcha en poudre bio.",
    status: "open",
    logo: "https://logo.clearbit.com/purematcha.com"
  }
];

export default function TalentAgencyTab({ c, mono, API_URL, uiLang, onImportLead, userPlan = "free", userId = null }) {
  const isRestricted = ["free", "standard"].includes(userPlan);
  const [currentUserRole, setCurrentUserRole] = useState("admin"); // admin | brand | influencer
  const [talents, setTalents] = useState(MOCK_TALENTS);
  const [gigs, setGigs] = useState(MOCK_GIGS);
  const [contracts, setContracts] = useState([
    {
      id: "c_1",
      talentName: "thatsnora",
      brandName: "GlowSkin Premium",
      title: "1 Instagram Reel - Spatola ad Ultrasuoni",
      budget: "$250 + 10% commission",
      status: "signature" // signature | produit_envoye | contenu_cree | live
    }
  ]);

  // Form states
  const [newTalent, setNewTalent] = useState({ username: "", niche: "beauty", followers: "", engagement: "5.0", platform: "instagram", email: "" });
  const [newGig, setNewGig] = useState({ brand: "", title: "", niche: "beauty", budget: "", requirements: "", description: "" });
  const [activeTab, setActiveTab] = useState("roster"); // roster | adecojobs | join
  const [matchingLoader, setMatchingLoader] = useState(false);
  const [aiMatchesResult, setAiMatchesResult] = useState(null);

  // Campaign Placements & Tracking Modals States
  const [activeModal, setActiveModal] = useState(null); // { type: 'shipping' | 'review' | 'roi', contract: ... }
  const [commentsByContract, setCommentsByContract] = useState({
    c_1: [
      { sender: "brand", text: uiLang === 'fr' ? "Le produit est bien visible, mais peux-tu zoomer un peu plus sur la texture de la crème au début ?" : (uiLang === 'it' ? "Il prodotto è ben visibile, ma potresti zoomare un po' di più sulla consistenza della crema all'inizio?" : "The product is clearly visible, but can you zoom in a bit more on the cream's texture at the start?"), time: "22/05/2026, 14:30" },
      { sender: "influencer", text: uiLang === 'fr' ? "Pas de souci ! J'ajoute le plan macro dans le montage final." : (uiLang === 'it' ? "Nessun problema! Aggiungo lo scatto macro nel montaggio finale." : "No problem! I will add the macro shot in the final edit."), time: "22/05/2026, 16:15" }
    ]
  });
  const [newCommentText, setNewCommentText] = useState("");

  const addComment = (contractId) => {
    if (!newCommentText.trim()) return;
    const comment = {
      sender: currentUserRole === "brand" ? "brand" : (currentUserRole === "influencer" ? "influencer" : "admin"),
      text: newCommentText.trim(),
      time: new Date().toLocaleString(uiLang === 'fr' ? 'fr-FR' : (uiLang === 'it' ? 'it-IT' : 'en-US'))
    };
    setCommentsByContract(prev => ({
      ...prev,
      [contractId]: [...(prev[contractId] || []), comment]
    }));
    setNewCommentText("");
  };

  const t = {
    fr: {
      title: "💼 Agence Talents & Missions",
      desc: "L'agence exclusive de placement pour Influenceurs : Gérez notre roster exclusif de talents, proposez-leur des contrats de marques, et matchez-les automatiquement par IA en 1 clic.",
      rosterTab: "Roster Talents 🌟",
      gigsTab: "Missions & Gigs 🎯",
      joinTab: "Rejoindre le Roster 📝",
      signupTitle: "✍️ Inscription Influenceur (Portail Roster)",
      signupDesc: "Vous êtes créateur Beauty ou Food ? Rejoignez notre agence exclusive et accédez aux meilleures offres de dropshipping.",
      addBtn: "Postuler à l'agence",
      postGigTitle: "➕ Publier une offre de mission (Brand)",
      postGigBtn: "Publier l'offre de mission",
      autoMatch: "⚡ Associer Roster & Missions par IA",
      contractTitle: "🤝 Contrats Actifs & Suivi Placement",
      prodShipped: "📦 Produit expédié",
      contentCreated: "🎥 Contenu créé (Vérification)",
      liveCampaign: "🚀 Publié & Live (Suivi ROI)",
      matchingActive: "Moteur IA en cours d'attribution...",
      successMatch: "IA Placement Réussi ! Les meilleurs talents ont été assignés aux contrats.",
      noPending: "Aucun talent compatible trouvé.",
      pendingText: "Auditer & Valider",
      followers: "abonnés",
      niche: "Niche",
      budget: "Budget",
      req: "Critères"
    },
    en: {
      title: "💼 Talent Agency & Gig Board",
      desc: "The premier staffing agency for Influencers: Manage our exclusive roster, post dropshipping gigs, and let the AI automatically match signed creators in 1 click.",
      rosterTab: "Roster Talents 🌟",
      gigsTab: "Gigs Marketplace 🎯",
      joinTab: "Join Roster Portal 📝",
      signupTitle: "✍️ Creator Application (Roster Portal)",
      signupDesc: "Are you a Beauty or Food creator? Join our exclusive roster and get direct contracts from top e-commerce shops.",
      addBtn: "Apply to Agency",
      postGigTitle: "➕ Post a Brand Campaign/Gig",
      postGigBtn: "Publish Gig",
      autoMatch: "⚡ Run AI Auto-Staffing Matchmaker",
      contractTitle: "🤝 Active Placements & Contracts",
      prodShipped: "📦 Product Shipped",
      contentCreated: "🎥 Content Draft (Review)",
      liveCampaign: "🚀 Live Campaign (Tracking)",
      matchingActive: "AI Matchmaker allocating talents...",
      successMatch: "AI Placement Success! Best compatible talents matched to gigs.",
      noPending: "No compatible talents found.",
      pendingText: "Audit & Accept",
      followers: "followers",
      niche: "Niche",
      budget: "Budget",
      req: "Criteria"
    },
    it: {
      title: "💼 Roster & Agenzia Lavoro Influencer",
      desc: "L'agenzia di performance e staffing per gli Influencer: Gestisci il roster dei nostri talent esclusivi, pubblica offerte di brand e avvia il matching IA istantaneo in 1 clic.",
      rosterTab: "Roster Talent 🌟",
      gigsTab: "Missions & Gig 🎯",
      joinTab: "Candidati al Roster 📝",
      signupTitle: "✍️ Registrazione Creator (Roster Portal)",
      signupDesc: "Sei un creator Beauty o Food? Unisciti alla nostra agenzia esclusiva ed accedi a contratti diretti con i migliori brand.",
      addBtn: "Candidati all'Agenzia",
      postGigTitle: "➕ Pubblica Offerta di Lavoro Brand",
      postGigBtn: "Pubblica Gig",
      autoMatch: "⚡ Avvia Staffing & Matching IA in 1 clic",
      contractTitle: "🤝 Contratti Attivi & Piazzamenti",
      prodShipped: "📦 Prodotto spedito",
      contentCreated: "🎥 Contenuto creato (Verifica)",
      liveCampaign: "🚀 Campagna Live (ROI)",
      matchingActive: "Moteur IA associando i talent...",
      successMatch: "IA Placement completato con successo! Assegnati i migliori creator disponibili.",
      noPending: "Nessun talent disponibile trovato.",
      pendingText: "Analizza & Approva",
      followers: "follower",
      niche: "Nicchia",
      budget: "Budget",
      req: "Criteri"
    }
  }[uiLang] || {
    title: "💼 Agence Talents & Missions",
    desc: "Gérez notre roster exclusif de talents, proposez-leur des contrats, et matchez-les en 1 clic.",
    rosterTab: "Roster 🌟",
    gigsTab: "Missions 🎯",
    joinTab: "S'inscrire 📝",
    signupTitle: "Inscrivez-vous",
    signupDesc: "Rejoignez le roster d'influenceurs exclusifs de notre agence.",
    addBtn: "Postuler",
    postGigTitle: "Publier une offre",
    postGigBtn: "Publier",
    autoMatch: "⚡ Staffing IA 1-clic",
    contractTitle: "Contrats Actifs",
    prodShipped: "Produit expédié",
    contentCreated: "Contenu créé",
    liveCampaign: "Live",
    matchingActive: "Placement IA...",
    successMatch: "Attribution IA Réussie !",
    noPending: "Aucun créateur.",
    pendingText: "Audit & Accepter",
    followers: "abonnés",
    niche: "Niche",
    budget: "Budget",
    req: "Critères"
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!newTalent.username) return;
    const cleanUsername = newTalent.username.replace("@", "").trim();
    if (userId) {
      await supabase.from("roster_applications").insert({
        user_id: userId,
        username: cleanUsername,
        platform: newTalent.platform,
        niche: newTalent.niche,
        followers: parseInt(newTalent.followers) || 15000,
        engagement: newTalent.engagement + "%",
        email: newTalent.email || null
      });
    }
    const item = {
      id: `t_user_${Date.now()}`,
      username: cleanUsername,
      niche: newTalent.niche,
      followers: parseInt(newTalent.followers) || 15000,
      engagement: newTalent.engagement + "%",
      platform: newTalent.platform,
      avatar: "https://ui-avatars.com/api/?name=" + cleanUsername + "&background=8B5CF6&color=fff&size=100&rounded=false",
      status: "pending",
      email: newTalent.email || "info@" + cleanUsername + ".com"
    };
    setTalents([item, ...talents]);
    setNewTalent({ username: "", niche: "beauty", followers: "", engagement: "5.0", platform: "instagram", email: "" });
    if (!isRestricted) setActiveTab("roster");
  };

  const handlePostGig = (e) => {
    e.preventDefault();
    if (!newGig.brand || !newGig.title) return;
    const cleanDomain = newGig.brand.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
    const item = {
      id: `gig_user_${Date.now()}`,
      brand: newGig.brand,
      title: newGig.title,
      niche: newGig.niche,
      budget: newGig.budget || "$200",
      requirements: newGig.requirements || "Micro-influencer",
      description: newGig.description || "Branded integration content creation.",
      status: "open",
      logo: `https://logo.clearbit.com/${cleanDomain}`
    };
    setGigs([item, ...gigs]);

    // Trouver tous les talents dans la même niche (qu'ils soient actifs ou pending)
    const matchingTalents = talents.filter(t => t.niche === newGig.niche);

    if (matchingTalents.length > 0) {
      console.log(`✉️ Envoi de notifications à ${matchingTalents.length} créateurs...`);
      fetch(`${API_URL}/api/gigs/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gig: item, influencers: matchingTalents })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(uiLang === "fr" 
            ? `✉️ Offre publiée ! Notifications envoyées par mail à nos ${matchingTalents.length} influenceurs de la niche ${newGig.niche.toUpperCase()} !` 
            : `✉️ Gig published! Email notifications sent to our ${matchingTalents.length} influencers in the ${newGig.niche.toUpperCase()} niche!`);
        }
      })
      .catch(err => console.error("Erreur envoi notification email:", err));
    }

    setNewGig({ brand: "", title: "", niche: "beauty", budget: "", requirements: "", description: "" });
  };

  // Moteur d'attribution de Staffing IA (Agency 1-Click)
  const runAiStaffing = () => {
    setMatchingLoader(true);
    setTimeout(() => {
      const openGigs = gigs.filter(g => g.status === "open");
      if (openGigs.length === 0) {
        alert(uiLang === "fr" ? "Toutes les offres de missions ont déjà été assignées !" : "All gigs have already been staffed!");
        setMatchingLoader(false);
        return;
      }
      
      const newContracts = [];
      const updatedGigs = gigs.map(g => {
        if (g.status === "open") {
          // Trouver un talent dans le roster actif qui match la niche du contrat et n'a pas déjà de contrat pour cette marque
          const targetTalent = talents.find(t => t.status === "active" && t.niche === g.niche && !contracts.some(c => c.talentName === t.username && c.brandName === g.brand));
          
          if (targetTalent) {
            newContracts.push({
              id: `c_auto_${Date.now()}_${g.id}`,
              talentName: targetTalent.username,
              brandName: g.brand,
              title: g.title,
              budget: g.budget,
              status: "signature"
            });
            return { ...g, status: "filled" };
          }
        }
        return g;
      });

      if (newContracts.length > 0) {
        setGigs(updatedGigs);
        setContracts([...newContracts, ...contracts]);
        setAiMatchesResult(newContracts);
      } else {
        alert(t.noPending);
      }
      setMatchingLoader(false);
    }, 2000);
  };

  const approvePending = (talentId) => {
    setTalents(prev => prev.map(t => t.id === talentId ? { ...t, status: "active" } : t));
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>{t.title}</h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14, lineHeight: 1.5, maxWidth: 800 }}>{t.desc}</p>
      </div>

      {/* Simulator Header */}
      <div style={{
        background: `linear-gradient(135deg, ${c.card}, rgba(139, 92, 246, 0.05))`,
        border: `1.5px solid ${c.border}`,
        borderRadius: 14,
        padding: "14px 20px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: c.text }}>Simulation Anti-Double (Sécurité Agent)</h4>
            <p style={{ margin: 0, fontSize: 11.5, color: c.textMuted }}>Sécurité anti-contournement : les marques ne voient pas les pseudos Instagram des talents, et les influenceurs ne voient pas le nom des marques.</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "admin", label: "👑 Admin (Tout visible)", color: c.accent },
            { id: "brand", label: "🛍️ Brand / Client (Talents Anonymes)", color: c.accent2 },
            { id: "influencer", label: "📸 Influencer (Marques Anonymisées)", color: c.success }
          ].map(role => (
            <button
              key={role.id}
              onClick={() => setCurrentUserRole(role.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1.5px solid ${currentUserRole === role.id ? role.color : c.border}`,
                background: currentUserRole === role.id ? `${role.color}15` : "transparent",
                color: currentUserRole === role.id ? role.color : c.textDim,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: mono,
                transition: "all 0.15s"
              }}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs list */}
      <div style={{ display: "flex", gap: 12, borderBottom: `1px solid ${c.border}`, paddingBottom: 12, marginBottom: 20 }}>
        {["roster", "adecojobs", "join"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 18px", borderRadius: 9, border: "none",
              background: activeTab === tab ? c.accent : "transparent",
              color: activeTab === tab ? "#fff" : c.textMuted,
              fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono,
              transition: "all 0.2s"
            }}
          >
            {tab === "roster" ? t.rosterTab : tab === "adecojobs" ? t.gigsTab : t.joinTab}
          </button>
        ))}
      </div>

      {activeTab === "roster" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.3s" }}>
          
          {/* AI staffing button */}
          <div style={{ background: c.card, border: `1.5px dashed ${c.accent}`, padding: 18, borderRadius: 14, display: "flex", alignItems: "center", justify: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: 15, fontWeight: 800, color: c.text }}>⚡ IA Recruitment & Staffing</h4>
              <p style={{ margin: 0, fontSize: 12.5, color: c.textMuted }}>Déclenchez l'algorithme d'attribution de l'agence pour attribuer le créateur idéal à chaque contrat e-commerce ouvert.</p>
            </div>
            <button
              onClick={runAiStaffing}
              disabled={matchingLoader}
              style={{
                padding: "12px 20px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff",
                fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono,
                boxShadow: `0 4px 16px ${c.accentGlow}`, opacity: matchingLoader ? 0.6 : 1
              }}
            >
              {matchingLoader ? t.matchingActive : t.autoMatch}
            </button>
          </div>

          {/* Identity masking notice for restricted plans */}
          {isRestricted && (
            <div style={{ background: "rgba(139,92,246,0.06)", border: "1.5px solid rgba(139,92,246,0.25)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "#c4b5fd" }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <span>
                {uiLang === "it"
                  ? "Le identità dei talent sono mascherate. Candidati al Roster per essere messo in contatto direttamente."
                  : uiLang === "en"
                  ? "Talent identities are hidden on your current plan. Join the Roster to get direct placement."
                  : "Les identités des talents sont masquées sur votre forfait actuel. Rejoignez le roster pour être mis en relation directement."}
              </span>
            </div>
          )}

          {/* Roster talents grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {talents.map((talent, idx) => {
              const isBrand = currentUserRole === "brand";
              const shouldMask = isRestricted || isBrand;
              const displayName = shouldMask ? `Talent ${talent.niche.toUpperCase()} #${idx + 1}` : `@${talent.username}`;
              const displayAvatar = shouldMask
                ? `https://ui-avatars.com/api/?name=Talent+${talent.niche}&background=8B5CF6&color=fff&size=100&rounded=true`
                : talent.avatar;

              return (
                <div
                  key={talent.id}
                  style={{
                    background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 20,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)", position: "relative"
                  }}
                >
                  {talent.status === "pending" && (
                    <span style={{ position: "absolute", top: 12, right: 12, background: c.warningBg, color: c.warning, fontSize: 9.5, fontWeight: 700, padding: "4px 8px", borderRadius: 5, fontFamily: mono }}>
                      PENDING REVIEW
                    </span>
                  )}
                  
                  {/* Profile header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <img src={displayAvatar} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2.5px solid ${talent.status === 'active' ? c.accent : c.warning}` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 15.5, fontWeight: 800, color: c.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</h3>
                      <span style={{ fontSize: 11.5, color: c.textDim, fontFamily: mono, display: "flex", alignItems: "center", gap: 4 }}>
                        <img src={`https://cdn.simpleicons.org/${talent.platform}/888888`} width={10} height={10} alt="" />
                        {talent.platform.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
                    <div style={{ background: c.bg, padding: 8, borderRadius: 10, border: `1px solid ${c.border}`, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: c.textDim, fontFamily: mono }}>FOLLOWERS</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>
                        {talent.followers >= 1000 ? `${(talent.followers / 1000).toFixed(0)}k` : talent.followers}
                      </div>
                    </div>
                    <div style={{ background: c.bg, padding: 8, borderRadius: 10, border: `1px solid ${c.border}`, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: c.textDim, fontFamily: mono }}>ENGAGEMENT</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: c.success }}>{talent.engagement}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justify: "space-between", fontSize: 12, marginBottom: 14 }}>
                    <span style={{ color: c.textDim }}>{t.niche}</span>
                    <span style={{ color: c.accent, fontWeight: 700, textTransform: "uppercase" }}>{talent.niche}</span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 6 }}>
                    {talent.status === "pending" ? (
                      <>
                        <button
                          disabled={isBrand}
                          onClick={() => onImportLead({
                            name: talent.username,
                            url: `https://instagram.com/${talent.username}`,
                            platform: "Instagram",
                            platformId: "instagram",
                            niche: talent.niche,
                            region: "it",
                            contact: talent.email,
                            instagram: `@${talent.username}`,
                            socials: { instagram: `https://instagram.com/${talent.username}` },
                            score: 85,
                            size: "Micro-Influencer",
                            reasoning: "Adecco applicant"
                          })}
                          style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: "transparent", color: isBrand ? c.textDim : c.textMuted, fontSize: 11, fontWeight: 650, cursor: isBrand ? "not-allowed" : "pointer" }}
                        >
                          {t.pendingText} 🕵️‍♂️
                        </button>
                        <button
                          disabled={isBrand}
                          onClick={() => approvePending(talent.id)}
                          style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: isBrand ? c.border : c.success, color: "#fff", fontSize: 11, fontWeight: 700, cursor: isBrand ? "not-allowed" : "pointer" }}
                        >
                          Accepter Roster ✓
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (isBrand) {
                            alert(uiLang === "fr" 
                              ? "🔒 Contact direct bloqué (Sécurité Anti-Double). Ce talent exclusif a signé avec notre agence. Veuillez passer par l'Admin Brejnev Diaz pour vos projets." 
                              : "🔒 Direct contact locked (Anti-double protection). This exclusive talent is represented by the agency. Please consult Admin Brejnev Diaz to book.");
                          } else {
                            window.open(`https://${talent.platform}.com/${talent.username}`, "_blank")
                          }
                        }}
                        style={{ 
                          width: "100%", padding: "9px", borderRadius: 8, 
                          border: `1.5px solid ${isBrand ? c.border : c.borderActive}`, 
                          background: isBrand ? c.bg : "transparent", 
                          color: isBrand ? c.textDim : c.textMuted, 
                          fontSize: 12, fontWeight: 650, 
                          cursor: isBrand ? "not-allowed" : "pointer" 
                        }}
                      >
                        {isBrand ? "🔒 Contact Exclusif Agence" : "Voir Profil Talent 🌐"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active contracts block */}
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, marginTop: 10 }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 800, color: c.text }}>{t.contractTitle} ({contracts.length})</h3>
            
            {/* Trilingual Tooltip explaining the steps and "Produit expédié" */}
            <p style={{ margin: "0 0 16px 0", fontSize: 12, color: c.textMuted, lineHeight: 1.5, background: `${c.bg}80`, border: `1px solid ${c.border}`, padding: "10px 14px", borderRadius: 8 }}>
              💡 <strong>{uiLang === 'fr' ? 'À quoi sert chaque étape ?' : (uiLang === 'it' ? 'A cosa serve ciascuna fase?' : 'What is each stage for?')}</strong><br/>
              {uiLang === 'fr' 
                ? "1. Produit expédié : La marque expédie l'échantillon gratuit au talent de notre roster pour qu'il puisse tourner le contenu UGC. Cliquez pour suivre le colis DHL. | 2. Contenu créé : Le créateur envoie son brouillon vidéo pour vérification. Cliquez pour le lire, commenter et l'approuver. | 3. Publié & Live : La vidéo est en ligne sur TikTok/Instagram avec les résultats ROI réels. Cliquez pour voir le dashboard de performance live."
                : uiLang === 'it'
                ? "1. Prodotto spedito: Il brand spedisce il campione gratuito al talent del roster per registrare il video UGC. Clicca per tracciare la spedizione DHL. | 2. Contenuto creato: Il creator invia la bozza video per la revisione. Clicca per riprodurlo, commentare e approvarlo. | 3. Pubblicato & Live: Il video è online su TikTok/Instagram con i risultati ROI reali. Clicca per vedere la dashboard di performance live."
                : "1. Product Shipped: The brand ships the free product sample to our roster creator to record the UGC video. Click to track the DHL package. | 2. Content Created: The creator submits the draft video for review. Click to play, comment, and approve it. | 3. Published & Live: The video is published on TikTok/Instagram with real ROI results. Click to view the live performance dashboard."
              }
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {contracts.map((contract) => {
                const isBrand = currentUserRole === "brand";
                const isInfluencer = currentUserRole === "influencer";
                const displayContractTalent = isBrand ? "Talent Partenaire" : `@${contract.talentName}`;
                const displayContractBrand = isInfluencer ? "Marque Exclusive (Masquée)" : contract.brandName;

                return (
                  <div
                    key={contract.id}
                    style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: 14, display: "flex", justify: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: 13.5, color: c.text, fontWeight: 700 }}>
                        {displayContractTalent} <span style={{ color: c.textMuted, fontWeight: 400 }}>avec</span> {displayContractBrand}
                      </h4>
                      <span style={{ fontSize: 11.5, color: c.textDim, fontFamily: mono }}>{contract.title}</span>
                    </div>

                  {/* Status switches */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <span style={{
                      fontSize: 10.5, padding: "4px 10px", borderRadius: 6, fontWeight: 600, fontFamily: mono,
                      background: contract.status === "signature" ? "rgba(167, 139, 250, 0.15)" : "transparent",
                      border: `1px solid ${contract.status === "signature" ? c.accent2 : "rgba(255,255,255,0.05)"}`,
                      color: contract.status === "signature" ? c.accent2 : c.textDim,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                    }} onClick={() => {
                      setActiveModal({ type: 'contract', contract });
                    }}>
                      📜 {uiLang === 'fr' ? 'Contrat' : (uiLang === 'it' ? 'Contratto' : 'Contract')}
                    </span>
                    <span style={{
                      fontSize: 10.5, padding: "4px 10px", borderRadius: 6, fontWeight: 600, fontFamily: mono,
                      background: contract.status === "produit_envoye" ? c.warningBg : "transparent",
                      border: `1px solid ${contract.status === "produit_envoye" ? c.warning : "rgba(255,255,255,0.05)"}`,
                      color: contract.status === "produit_envoye" ? c.warning : c.textDim,
                      cursor: contract.status === "signature" ? "not-allowed" : "pointer"
                    }} onClick={() => {
                      if (contract.status !== "signature") setActiveModal({ type: 'shipping', contract });
                    }}>
                      {t.prodShipped}
                    </span>
                    <span style={{
                      fontSize: 10.5, padding: "4px 10px", borderRadius: 6, fontWeight: 600, fontFamily: mono,
                      background: contract.status === "contenu_cree" ? c.accentSoft : "transparent",
                      border: `1px solid ${contract.status === "contenu_cree" ? c.accent : "rgba(255,255,255,0.05)"}`,
                      color: contract.status === "contenu_cree" ? c.accent : c.textDim,
                      cursor: "pointer"
                    }} onClick={() => {
                      setActiveModal({ type: 'review', contract });
                    }}>
                      {t.contentCreated}
                    </span>
                    <span style={{
                      fontSize: 10.5, padding: "4px 10px", borderRadius: 6, fontWeight: 600, fontFamily: mono,
                      background: contract.status === "live" ? c.successSoft : "transparent",
                      border: `1px solid ${contract.status === "live" ? c.success : "rgba(255,255,255,0.05)"}`,
                      color: contract.status === "live" ? c.success : c.textDim,
                      cursor: "pointer"
                    }} onClick={() => {
                      setActiveModal({ type: 'roi', contract });
                    }}>
                      {t.liveCampaign}
                    </span>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "adecojobs" && (
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 24, animation: "fadeIn 0.3s" }}>
          
          {/* Post gig form */}
          <div style={{ flex: "1 1 300px", background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 14, padding: 20, height: "fit-content" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 800, color: c.text }}>{t.postGigTitle}</h3>
            
            <form onSubmit={handlePostGig}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Nom de la Marque</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Sephora, GlowSkin"
                  value={newGig.brand}
                  onChange={e => setNewGig({ ...newGig, brand: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Intitulé de la Mission</label>
                <input
                  type="text"
                  required
                  placeholder="ex: 1 Instagram Reel - Ultrasonic Scrub"
                  value={newGig.title}
                  onChange={e => setNewGig({ ...newGig, title: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Niche</label>
                  <select
                    value={newGig.niche}
                    onChange={e => setNewGig({ ...newGig, niche: e.target.value })}
                    style={{ width: "100%", padding: "9px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13 }}
                  >
                    <option value="beauty">Beauty</option>
                    <option value="food">Food</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Budget / Paye</label>
                  <input
                    type="text"
                    placeholder="ex: $200 + 10%"
                    value={newGig.budget}
                    onChange={e => setNewGig({ ...newGig, budget: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Critères Roster Requis</label>
                <input
                  type="text"
                  placeholder="ex: Roster Beauté (>30k followers)"
                  value={newGig.requirements}
                  onChange={e => setNewGig({ ...newGig, requirements: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Description Brief</label>
                <textarea
                  placeholder="Brief détaillé du contenu attendu..."
                  value={newGig.description}
                  onChange={e => setNewGig({ ...newGig, description: e.target.value })}
                  style={{ width: "100%", minHeight: 70, padding: "10px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%", padding: "12px", borderRadius: 8, border: "none",
                  background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff",
                  fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono
                }}
              >
                {t.postGigBtn}
              </button>
            </form>
          </div>

          {/* Active gigs marketplace */}
          <div style={{ flex: "2 1 400px", display: "flex", flexDirection: "column", gap: 14 }}>
            {gigs.map((g, idx) => {
              const isInfluencer = currentUserRole === "influencer";
              const displayBrandName = isInfluencer ? `Confidential Brand #${idx + 1}` : g.brand;
              const displayLogo = isInfluencer 
                ? `https://ui-avatars.com/api/?name=VA&background=8B5CF6&color=fff&size=100&rounded=false`
                : g.logo;

              return (
                <div
                  key={g.id}
                  style={{
                    background: c.card, border: `1.5px solid ${g.status === 'filled' ? c.border : c.borderActive}`,
                    borderRadius: 16, padding: 20, position: "relative"
                  }}
                >
                  {/* Status tag */}
                  <span style={{
                    position: "absolute", top: 18, right: 18, fontSize: 10, fontWeight: 800, fontFamily: mono, padding: "4px 8px", borderRadius: 5,
                    background: g.status === "open" ? c.successSoft : "rgba(128,128,128,0.1)",
                    color: g.status === "open" ? c.success : c.textDim, border: `1px solid ${g.status === "open" ? c.success : c.border}`
                  }}>
                    {g.status === "open" ? "DISPONIBLE (OPEN)" : "ATTRIBUÉ (FILLED)"}
                  </span>

                  {/* Gig header with Clearbit Logo */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 8, border: `1px solid ${c.border}`, background: `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                      <img
                        src={displayLogo}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayBrandName)}&background=8B5CF6&color=fff&size=100&rounded=false`;
                        }}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: 0 }}>{g.title}</h3>
                      <span style={{ fontSize: 11.5, color: c.textDim, fontFamily: mono }}>{displayBrandName}</span>
                    </div>
                  </div>

                <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5, margin: "0 0 16px 0", background: c.bg, padding: 12, borderRadius: 10, border: `1px solid ${c.border}` }}>
                  "{g.description}"
                </p>

                {/* Criteria parameters */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 11.5 }}>
                  <div>
                    <span style={{ color: c.textDim, display: "block", fontSize: 9.5, fontFamily: mono, textTransform: "uppercase" }}>{t.niche}</span>
                    <span style={{ color: c.accent, fontWeight: 700, textTransform: "uppercase" }}>{g.niche}</span>
                  </div>
                  <div>
                    <span style={{ color: c.textDim, display: "block", fontSize: 9.5, fontFamily: mono, textTransform: "uppercase" }}>{t.budget}</span>
                    <span style={{ color: c.success, fontWeight: 700 }}>{g.budget}</span>
                  </div>
                  <div>
                    <span style={{ color: c.textDim, display: "block", fontSize: 9.5, fontFamily: mono, textTransform: "uppercase" }}>{t.req}</span>
                    <span style={{ color: c.text, fontWeight: 650 }}>{g.requirements}</span>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {activeTab === "join" && (
        <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 20, padding: 26, maxWidth: 640, margin: "0 auto", animation: "fadeIn 0.3s" }}>
          
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.signupTitle}</h3>
            <p style={{ color: c.textMuted, fontSize: 13.5, margin: 0 }}>{t.signupDesc}</p>
          </div>

          <form onSubmit={handleRegister}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Handle Profil (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="ex: @diariatou__sow"
                  value={newTalent.username}
                  onChange={e => setNewTalent({ ...newTalent, username: e.target.value })}
                  style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Réseau Social</label>
                <select
                  value={newTalent.platform}
                  onChange={e => setNewTalent({ ...newTalent, platform: e.target.value })}
                  style={{ width: "100%", padding: "10.5px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Niche Principale</label>
                <select
                  value={newTalent.niche}
                  onChange={e => setNewTalent({ ...newTalent, niche: e.target.value })}
                  style={{ width: "100%", padding: "10.5px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                >
                  <option value="beauty">Beauty / Skincare</option>
                  <option value="food">Food / Nutrition</option>
                  <option value="fitness">Fitness / Wellness</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Nombre d'Abonnés (Followers)</label>
                <input
                  type="number"
                  required
                  placeholder="ex: 45000"
                  value={newTalent.followers}
                  onChange={e => setNewTalent({ ...newTalent, followers: e.target.value })}
                  style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Taux d'Engagement (%)</label>
                <input
                  type="text"
                  required
                  placeholder="ex: 5.8"
                  value={newTalent.engagement}
                  onChange={e => setNewTalent({ ...newTalent, engagement: e.target.value })}
                  style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>E-mail Professionnel</label>
                <input
                  type="email"
                  required
                  placeholder="ex: contact@talent.com"
                  value={newTalent.email}
                  onChange={e => setNewTalent({ ...newTalent, email: e.target.value })}
                  style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%", padding: "14px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff",
                fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: mono,
                boxShadow: `0 4px 16px ${c.accentGlow}`
              }}
            >
              {t.addBtn}
            </button>
          </div>
        </div>
      )}

      {/* AI Staffing Matches Modal */}
      {aiMatchesResult && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ background: c.card, border: `1.5px solid ${c.accent}`, borderRadius: 16, padding: 30, width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: `0 20px 40px ${c.accent}33` }}>
            <button onClick={() => setAiMatchesResult(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: c.textMuted, cursor: "pointer", fontSize: 20 }}>✖</button>
            
            <h2 style={{ margin: "0 0 16px 0", fontSize: 20, color: c.text, display: "flex", alignItems: "center", gap: 8 }}>
              ⚡ {t.successMatch || "Placement Réussi !"}
            </h2>
            <p style={{ color: c.textMuted, fontSize: 14, marginBottom: 20 }}>
              {uiLang === "fr" ? "L'IA a généré ces nouveaux contrats. Vous pouvez maintenant notifier les influenceurs assignés :" : "AI has generated these new contracts. You can now notify the assigned influencers:"}
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {aiMatchesResult.map(contract => {
                const talent = talents.find(t => t.username === contract.talentName);
                return (
                  <div key={contract.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: "bold", color: c.text }}>{contract.brandName}</div>
                        <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>
                          Mission : <span style={{ color: c.text }}>{contract.title}</span>
                        </div>
                        <div style={{ fontSize: 14, marginTop: 8 }}>
                          Talent : <strong style={{ color: c.success }}>@{contract.talentName}</strong>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: c.accent, background: c.accentSoft, padding: "4px 8px", borderRadius: 6, fontWeight: "bold" }}>
                        {contract.budget}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <a href={`mailto:${talent?.email || ''}?subject=${encodeURIComponent('Nouvelle mission: ' + contract.brandName)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flex: 1 }}>
                        <button style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: c.emailBlue || '#6366f1', color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: 12, transition: "opacity 0.2s" }} onMouseOver={e=>e.target.style.opacity=0.8} onMouseOut={e=>e.target.style.opacity=1}>
                          ✉️ Envoyer Email
                        </button>
                      </a>
                      <a href={`https://ig.me/m/${contract.talentName}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flex: 1 }}>
                        <button style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: 12, transition: "opacity 0.2s" }} onMouseOver={e=>e.target.style.opacity=0.8} onMouseOut={e=>e.target.style.opacity=1}>
                          📱 DM Instagram
                        </button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button onClick={() => setAiMatchesResult(null)} style={{ marginTop: 24, width: "100%", padding: "12px", borderRadius: 8, border: "none", background: c.border, color: c.text, fontWeight: 700, cursor: "pointer" }}>
              Terminer
            </button>
          </div>
        </div>
      )}

      {/* Placement Tracking Modals Overlay */}
      {activeModal && (() => {
        const contract = activeModal.contract;
        if (!contract) return null;
        
        const isBrand = currentUserRole === "brand";
        const isInfluencer = currentUserRole === "influencer";
        const displayContractTalent = isBrand ? "Talent Partenaire" : `@${contract.talentName}`;
        const displayContractBrand = isInfluencer ? "Marque Exclusive (Masquée)" : contract.brandName;
        
        // Find matching talent in roster to get details
        const talentDetails = talents.find(t => t.username === contract.talentName) || {
          niche: "beauty",
          avatar: "https://ui-avatars.com/api/?name=" + contract.talentName,
          platform: "instagram"
        };
        
        // Determine type of modal
        const { type } = activeModal;
        
        // Translate modal headers
        const modalTitle = {
          fr: {
            shipping: "📦 Logistique & Suivi Colis DHL Express",
            review: "🎥 Revue UGC & Approbation de Contenu",
            roi: "🚀 Dashboard ROI & Performance en Direct"
          },
          en: {
            shipping: "📦 DHL Express Shipping & Logistics Tracker",
            review: "🎥 UGC Draft Review & Brand Approval",
            roi: "🚀 Live ROI & Campaign Performance Dashboard"
          },
          it: {
            shipping: "📦 Tracciamento Spedizione DHL Express",
            review: "🎥 Revisione Bozza UGC & Approvazione",
            roi: "🚀 Dashboard ROI & Performance Live"
          }
        }[uiLang]?.[type] || {
          shipping: "📦 Suivi Colis DHL Express",
          review: "🎥 Revue UGC & Approbation",
          roi: "🚀 Performance & ROI"
        }[type];
        
        return (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
            background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, backdropFilter: "blur(6px)", padding: 20, boxSizing: "border-box",
            animation: "fadeIn 0.2s ease-out"
          }}>
            <div style={{
              background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 20,
              width: "100%", maxWidth: 640, padding: 26, position: "relative",
              maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
            }}>
              {/* Close button */}
              <button 
                onClick={() => setActiveModal(null)} 
                style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", color: c.textDim, fontSize: 18, cursor: "pointer" }}
              >
                ✖
              </button>
              
              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 800, fontFamily: mono, background: c.accentSoft, color: c.accent, padding: "4px 8px", borderRadius: 5, textTransform: "uppercase", display: "inline-block", marginBottom: 8 }}>
                  {type === 'shipping' ? (uiLang === 'fr' ? 'Étape 1 : Logistique' : (uiLang === 'it' ? 'Fase 1: Logistica' : 'Stage 1: Logistics')) : 
                   type === 'review' ? (uiLang === 'fr' ? 'Étape 2 : Revue UGC' : (uiLang === 'it' ? 'Fase 2: Revisione UGC' : 'Stage 2: UGC Review')) : 
                   (uiLang === 'fr' ? 'Étape 3 : Suivi Live' : (uiLang === 'it' ? 'Fase 3: Campagna Live' : 'Stage 3: Live Campaign'))}
                </span>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
                  {modalTitle}
                </h3>
                <p style={{ margin: 0, fontSize: 12.5, color: c.textMuted }}>
                  {displayContractTalent} • <strong>{displayContractBrand}</strong>
                </p>
              </div>
              
              {/* MODAL 0: LEGAL CONTRACT */}
            {activeModal && activeModal.type === 'contract' && (() => {
              const contract = activeModal.contract;
              const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
              return (
                <div style={{
                  position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: "100%", maxWidth: 650, maxHeight: "90vh", overflowY: "auto",
                  background: "#f9fafb", borderRadius: 8, padding: 32, zIndex: 1000,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)", color: "#111827", fontFamily: "Georgia, serif"
                }}>
                  <div style={{ textAlign: "center", borderBottom: "2px solid #e5e7eb", paddingBottom: 16, marginBottom: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px 0", letterSpacing: 1, textTransform: "uppercase" }}>UGC & Influencer Marketing Agreement</h2>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontFamily: "sans-serif" }}>Ref: {contract.id.toUpperCase()}</p>
                  </div>
                  
                  <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                    This Influencer Marketing Agreement (the "Agreement") is entered into as of <strong>{date}</strong> (the "Effective Date"), by and between:
                  </p>
                  <ul style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                    <li><strong>Agency:</strong> Viral Acquisition LLC ("Agency"), acting on behalf of <strong>{contract.brandName}</strong> ("Brand").</li>
                    <li><strong>Creator:</strong> @{contract.talentName} ("Creator").</li>
                  </ul>
                  
                  <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginTop: 24, marginBottom: 12 }}>1. Scope of Services</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>The Creator agrees to produce the following deliverables for the Brand: <strong>{contract.title}</strong>. The content must be uploaded for Agency review before public posting.</p>
                  
                  <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginTop: 24, marginBottom: 12 }}>2. Compensation</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>In exchange for the full and satisfactory performance of the Services, Agency shall pay the Creator: <strong>{contract.budget || "$250 + 10% commission"}</strong>.</p>
                  
                  <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginTop: 24, marginBottom: 12 }}>3. Usage & Whitelisting Rights (UGC)</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>Creator grants the Brand and Agency a worldwide, royalty-free, perpetual license to use, reproduce, modify, and run paid advertisements (whitelisting) using the deliverables across all digital platforms (TikTok, Meta, Google).</p>

                  <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginTop: 24, marginBottom: 12 }}>4. Exclusivity & Governing Law</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>The Creator agrees not to promote direct competitors of the Brand for a period of 30 days after posting. This Agreement shall be governed by the laws of the jurisdiction where the Agency is registered.</p>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 20, borderTop: "1px dashed #d1d5db" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 30 }}>Agency Representative:</div>
                      <div style={{ fontFamily: "'Brush Script MT', cursive, sans-serif", fontSize: 24, color: "#1f2937" }}>ViralAcq</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>Creator Signature:</div>
                      {contract.status === "signature" ? (
                        <button 
                          onClick={() => {
                            setContracts(prev => prev.map(cr => cr.id === contract.id ? { ...cr, status: "produit_envoye" } : cr));
                            setActiveModal(null);
                            alert(uiLang === 'fr' ? '✅ Contrat signé numériquement. Le produit peut maintenant être expédié !' : '✅ Contract digitally signed. Product shipping unlocked!');
                          }}
                          style={{ background: "#10b981", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, boxShadow: "0 4px 10px rgba(16,185,129,0.3)" }}>
                          {uiLang === 'fr' ? '🖊️ Signer Numériquement' : '🖊️ Digitally Sign'}
                        </button>
                      ) : (
                        <div style={{ fontFamily: "'Brush Script MT', cursive, sans-serif", fontSize: 24, color: "#10b981" }}>@{contract.talentName}</div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: "right", marginTop: 20 }}>
                    <button onClick={() => setActiveModal(null)} style={{ background: "transparent", color: "#6b7280", border: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>Close</button>
                  </div>
                </div>
              );
            })()}

            {/* MODAL 1: SHIPPING */}
              {type === 'shipping' && (
                <div>
                  <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 13, marginBottom: 12 }}>
                      <div>
                        <span style={{ color: c.textDim, display: "block", fontSize: 9.5, fontFamily: mono, textTransform: "uppercase" }}>
                          {uiLang === 'fr' ? 'Code de Suivi' : (uiLang === 'it' ? 'Codice Tracking' : 'Tracking ID')}
                        </span>
                        <strong style={{ color: c.accent, fontFamily: mono }}>JV-381-098-DE</strong>
                      </div>
                      <div>
                        <span style={{ color: c.textDim, display: "block", fontSize: 9.5, fontFamily: mono, textTransform: "uppercase" }}>
                          {uiLang === 'fr' ? 'LIVRAISON ESTIMÉE' : (uiLang === 'it' ? 'CONSEGNA PREVISTA' : 'ESTIMATED DELIVERY')}
                        </span>
                        <strong style={{ color: c.success }}>25/05/2026</strong>
                      </div>
                      <div>
                        <span style={{ color: c.textDim, display: "block", fontSize: 9.5, fontFamily: mono, textTransform: "uppercase" }}>
                          {uiLang === 'fr' ? 'DESTINATION' : (uiLang === 'it' ? 'DESTINAZIONE' : 'DESTINATION')}
                        </span>
                        <strong>{isBrand ? "Talent Partenaire (Sécurisé)" : "Milano, IT"}</strong>
                      </div>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', height: 6, borderRadius: 3, position: "relative", margin: "20px 0 10px 0" }}>
                      <div style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.success})`, width: "75%", height: "100%", borderRadius: 3, boxShadow: `0 0 10px ${c.accentGlow}` }}></div>
                      <div style={{ position: "absolute", top: -5, left: "75%", width: 16, height: 16, borderRadius: "50%", background: c.success, border: `3.5px solid ${c.card}`, boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)" }}></div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: c.textDim, fontFamily: mono }}>
                      <span>{uiLang === 'fr' ? 'Expédié' : (uiLang === 'it' ? 'Spedito' : 'Shipped')}</span>
                      <span>{uiLang === 'fr' ? 'En Transit (75%)' : (uiLang === 'it' ? 'In Transito (75%)' : 'In Transit (75%)')}</span>
                      <span>{uiLang === 'fr' ? 'Livré' : (uiLang === 'it' ? 'Consegnato' : 'Delivered')}</span>
                    </div>
                  </div>
                  
                  {/* Detailed Timeline Logs */}
                  <h4 style={{ margin: "0 0 10px 0", fontSize: 13, color: c.text, textTransform: "uppercase", fontFamily: mono, display: "flex", alignItems: "center", gap: 6 }}>
                    📋 {uiLang === 'fr' ? 'Historique d\'Expédition' : (uiLang === 'it' ? 'Storico Spedizione' : 'Shipping History')}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, maxHeight: 180, overflowY: "auto", marginBottom: 20 }}>
                    {[
                      { time: "23/05/2026, 08:30", desc: uiLang === 'fr' ? "Arrivé au centre de tri régional - Milan, IT" : (uiLang === 'it' ? "Arrivato al centro di smistamento locale - Milano, IT" : "Arrived at local distribution center - Milan, IT"), active: true },
                      { time: "22/05/2026, 18:45", desc: uiLang === 'fr' ? "En transit - Munich, DE" : (uiLang === 'it' ? "In transito - Monaco, DE" : "In transit - Munich, DE"), active: false },
                      { time: "22/05/2026, 10:15", desc: uiLang === 'fr' ? "Pris en charge par le transporteur - Paris, FR" : (uiLang === 'it' ? "Preso in carico dal corriere - Parigi, FR" : "Picked up by carrier - Paris, FR"), active: false },
                      { time: "21/05/2026, 14:00", desc: uiLang === 'fr' ? "Colis prêt chez l'expéditeur (GlowSkin Premium)" : (uiLang === 'it' ? "Pacco preparato dal brand (GlowSkin Premium)" : "Package prepared by sender (GlowSkin Premium)"), active: false }
                    ].map((log, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 12, position: "relative" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: log.active ? c.accent : c.border, zIndex: 1, flexShrink: 0 }}></div>
                          {idx !== 3 && <div style={{ width: 1.5, flexGrow: 1, background: c.border, margin: "4px 0" }}></div>}
                        </div>
                        <div style={{ paddingBottom: idx === 3 ? 0 : 6 }}>
                          <span style={{ display: "block", fontSize: 10, color: c.textDim, fontFamily: mono }}>{log.time}</span>
                          <span style={{ fontSize: 12, color: log.active ? c.text : c.textMuted, fontWeight: log.active ? 600 : 400 }}>{log.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Action Button to simulate advancement */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => {
                        setContracts(prev => prev.map(cr => cr.id === contract.id ? { ...cr, status: "contenu_cree" } : cr));
                        setActiveModal(prev => ({ ...prev, contract: { ...prev.contract, status: "contenu_cree" }, type: 'review' }));
                        alert(uiLang === "fr" 
                          ? "📦 Colis livré ! Transition automatique vers l'étape de Revue de Contenu UGC 🎥" 
                          : (uiLang === "it" 
                            ? "📦 Pacco consegnato! Transizione automatica alla fase di revisione UGC 🎥" 
                            : "📦 Package delivered! Auto-transitioned to UGC Content Review stage 🎥"));
                      }}
                      style={{
                        flex: 1, padding: "12px", borderRadius: 8, border: "none",
                        background: c.accent, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono,
                        boxShadow: `0 4px 12px ${c.accentGlow}`
                      }}
                    >
                      {uiLang === 'fr' ? '🚚 Confirmer Livraison & Passer à la Revue' : (uiLang === 'it' ? '🚚 Conferma Consegna & Vai a Revisione' : '🚚 Confirm Delivery & Move to Review')}
                    </button>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        padding: "12px 18px", borderRadius: 8, border: `1.5px solid ${c.border}`,
                        background: "transparent", color: c.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono
                      }}
                    >
                      {uiLang === 'fr' ? 'Fermer' : (uiLang === 'it' ? 'Chiudi' : 'Close')}
                    </button>
                  </div>
                </div>
              )}
              
              {/* MODAL 2: UGC VIDEO REVIEW */}
              {type === 'review' && (
                <div>
                  {/* Visual Video Player */}
                  <div style={{ position: "relative", width: "100%", borderRadius: 14, overflow: "hidden", background: "#000", border: `1.5px solid ${c.border}`, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
                    <video 
                      controls 
                      src={talentDetails.niche === 'food' 
                        ? "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-preparing-a-healthy-smoothie-42526-large.mp4"
                        : "https://assets.mixkit.co/videos/preview/mixkit-girl-applying-beauty-mask-on-her-face-41130-large.mp4"
                      }
                      style={{ width: "100%", maxHeight: 260, objectFit: "contain" }}
                      poster={talentDetails.avatar}
                    />
                    <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.accent, animation: "pulse 1.5s infinite" }}></span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", fontFamily: mono }}>UGC_DRAFT_V1.mp4</span>
                    </div>
                  </div>
                  
                  {/* Feedback comments thread */}
                  <h4 style={{ margin: "0 0 10px 0", fontSize: 13, color: c.text, textTransform: "uppercase", fontFamily: mono }}>
                    💬 {uiLang === 'fr' ? 'Corrections & Retours Révisions' : (uiLang === 'it' ? 'Revisioni & Feedback' : 'Revisions & Feedback Thread')}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, maxHeight: 180, overflowY: "auto", marginBottom: 16 }}>
                    {(commentsByContract[contract.id] || []).length === 0 ? (
                      <div style={{ color: c.textDim, fontStyle: "italic", fontSize: 12.5, textAlign: "center", padding: "10px 0" }}>
                        {uiLang === 'fr' ? 'Aucun retour de correction pour le moment.' : (uiLang === 'it' ? 'Nessun feedback inviato finora.' : 'No feedback comments submitted yet.')}
                      </div>
                    ) : (
                      (commentsByContract[contract.id] || []).map((msg, idx) => {
                        const isMsgBrand = msg.sender === "brand";
                        const isMsgInfluencer = msg.sender === "influencer";
                        const senderName = isMsgBrand ? (uiLang === 'fr' ? "Marque (Client)" : "Brand (Client)") : (isMsgInfluencer ? `@${contract.talentName}` : "Admin Brejnev");
                        
                        return (
                          <div key={idx} style={{ display: "flex", flexDirection: "column", alignSelf: isMsgBrand ? "flex-start" : "flex-end", maxWidth: "85%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: c.textDim, fontFamily: mono, marginBottom: 3, padding: "0 4px" }}>
                              <span>{senderName}</span>
                              <span>{msg.time}</span>
                            </div>
                            <div style={{
                              background: isMsgBrand ? `${c.accent}18` : (isMsgInfluencer ? `${c.successSoft}` : c.border),
                              border: `1px solid ${isMsgBrand ? c.accent : (isMsgInfluencer ? c.success : c.border)}`,
                              borderRadius: 10, padding: "8px 12px", color: c.text, fontSize: 12.5, lineHeight: 1.4
                            }}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Comment Input */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    <input
                      type="text"
                      placeholder={uiLang === 'fr' ? "Ajouter une demande de modification..." : (uiLang === 'it' ? "Richiedi una modifica o commenta..." : "Add a revision request...")}
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addComment(contract.id)}
                      style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13 }}
                    />
                    <button
                      onClick={() => addComment(contract.id)}
                      style={{
                        padding: "0 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff",
                        fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: mono
                      }}
                    >
                      {uiLang === 'fr' ? 'Envoyer' : (uiLang === 'it' ? 'Invia' : 'Send')}
                    </button>
                  </div>
                  
                  {/* Approval Action */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => {
                        setContracts(prev => prev.map(cr => cr.id === contract.id ? { ...cr, status: "live" } : cr));
                        setActiveModal(prev => ({ ...prev, contract: { ...prev.contract, status: "live" }, type: 'roi' }));
                        alert(uiLang === "fr" 
                          ? "✅ Brouillon UGC Approuvé avec succès ! La campagne est désormais PUBLIÉE et le suivi ROI est activé ! 🚀" 
                          : (uiLang === "it" 
                            ? "✅ Bozza UGC Approvata con successo! La campagna è PUBBLICATA e il monitoraggio ROI è attivo! 🚀" 
                            : "✅ UGC Draft Approved successfully! The campaign is now PUBLISHED and live ROI tracking is activated! 🚀"));
                      }}
                      style={{
                        flex: 1, padding: "12px", borderRadius: 8, border: "none",
                        background: c.success, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono,
                        boxShadow: `0 4px 12px rgba(16, 185, 129, 0.4)`
                      }}
                    >
                      {uiLang === 'fr' ? '✅ Approuver le brouillon vidéo & Mettre en ligne' : (uiLang === 'it' ? '✅ Approva la Bozza & Pubblica Online' : '✅ Approve Draft & Publish Campaign')}
                    </button>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        padding: "12px 18px", borderRadius: 8, border: `1.5px solid ${c.border}`,
                        background: "transparent", color: c.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono
                      }}
                    >
                      {uiLang === 'fr' ? 'Fermer' : (uiLang === 'it' ? 'Chiudi' : 'Close')}
                    </button>
                  </div>
                </div>
              )}
              
              {/* MODAL 3: PERFORMANCE ROI DASHBOARD */}
              {type === 'roi' && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.success, animation: "pulse 1.5s infinite" }}></span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: c.success, fontFamily: mono, textTransform: "uppercase" }}>
                      🟢 {uiLang === 'fr' ? 'CAMPAGNE ACTIVE EN DIRECT' : (uiLang === 'it' ? 'CAMPAGNA LIVE ATTIVA' : 'ACTIVE LIVE CAMPAIGN')}
                    </span>
                  </div>

                  {/* Grid of KPI Metrics */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
                    {(() => {
                      const contract = activeModal.contract;
                      // Dynamic fake ROI metrics based on the contract ID and length of name
                      const seed = contract.id.length + contract.talentName.length;
                      const views = 142000 + (seed * 8500);
                      const clicks = Math.floor(views * (0.04 + (seed * 0.001)));
                      const conv = Math.floor(clicks * 0.076);
                      // Extract budget number if possible
                      const match = contract.budget ? contract.budget.match(/\$(\d+)/) : null;
                      const budgetNum = match ? parseInt(match[1]) : 250;
                      const gross = conv * 24.50; // Assume $24.5 AOV
                      const net = gross - budgetNum;
                      const roas = (gross / budgetNum).toFixed(1);
                      const roiPct = Math.floor((net / budgetNum) * 100);

                      return [
                        { label: uiLang === 'fr' ? 'Vues TikTok/IG' : (uiLang === 'it' ? 'Visualizzazioni' : 'Views'), val: views.toLocaleString(), col: c.text },
                        { label: uiLang === 'fr' ? 'Swipes / Clics' : (uiLang === 'it' ? 'Clic' : 'Clicks'), val: `${clicks.toLocaleString()}`, col: c.text },
                        { label: uiLang === 'fr' ? 'Ventes' : (uiLang === 'it' ? 'Vendite' : 'Conversions'), val: `${conv.toLocaleString()}`, col: c.success },
                        { label: uiLang === 'fr' ? 'Budget Dépensé' : (uiLang === 'it' ? 'Costo Speso' : 'Spent (Cost)'), val: `$${budgetNum.toLocaleString()}`, col: c.textDim },
                        { label: uiLang === 'fr' ? 'Revenu Brut' : (uiLang === 'it' ? 'Fatturato Lordo' : 'Gross Revenue'), val: `$${gross.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, col: c.accent },
                        { label: uiLang === 'fr' ? 'Bénéfice Net' : (uiLang === 'it' ? 'Profitto Netto' : 'Net Profit'), val: `$${net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, col: c.success },
                        { label: "ROAS", val: `${roas}x`, col: c.success },
                        { label: "ROI", val: `+${roiPct}%`, col: col => c.success }
                      ].map((kpi, idx) => (
                        <div key={idx} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: 10, textAlign: "center" }}>
                          <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 4 }}>{kpi.label}</div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: kpi.label === "ROI" || kpi.label === "ROAS" || kpi.label.includes("Ventes") || kpi.label.includes("Net") ? c.success : (kpi.label.includes("Brut") ? c.accent : c.text) }}>{kpi.val}</div>
                        </div>
                      ));
                    })()}
                  </div>
                  
                  {/* Sales trend pure CSS visual chart */}
                  <h4 style={{ margin: "0 0 10px 0", fontSize: 13, color: c.text, textTransform: "uppercase", fontFamily: mono, display: "flex", alignItems: "center", gap: 6 }}>
                    📈 {uiLang === 'fr' ? 'Progression des Ventes (7 derniers jours)' : (uiLang === 'it' ? 'Andamento Vendite (Ultimi 7 giorni)' : 'Sales Trend (Last 7 Days)')}
                  </h4>
                  <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: "20px 16px", marginBottom: 20 }}>
                    {/* Chart Container */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 120, borderBottom: `1.5px solid ${c.border}`, paddingBottom: 6, marginBottom: 8 }}>
                      {[
                        { day: "Day 1", pct: "15%", val: "$450" },
                        { day: "Day 2", pct: "30%", val: "$920" },
                        { day: "Day 3", pct: "45%", val: "$1,350" },
                        { day: "Day 4", pct: "85%", val: "$2,500" },
                        { day: "Day 5", pct: "60%", val: "$1,800" },
                        { day: "Day 6", pct: "70%", val: "$2,100" },
                        { day: "Day 7", pct: "95%", val: "$4,560" }
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          display: "flex", flexDirection: "column", alignItems: "center", width: "12%", height: "100%", justifyContent: "flex-end"
                        }} title={`${item.day}: ${item.val}`}>
                          <span style={{ fontSize: 8.5, color: c.textDim, fontFamily: mono, marginBottom: 4 }}>{item.val}</span>
                          <div style={{
                            width: "100%", height: item.pct, borderRadius: "4px 4px 0 0",
                            background: `linear-gradient(to top, ${c.accent}40, ${c.success})`,
                            boxShadow: `0 0 10px rgba(16, 185, 129, 0.25)`,
                            transition: "all 0.2s"
                          }}
                          onMouseOver={e=>e.target.style.filter="brightness(1.2)"}
                          onMouseOut={e=>e.target.style.filter="none"}
                          ></div>
                        </div>
                      ))}
                    </div>
                    {/* X Axis Labels */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: c.textDim, fontFamily: mono, padding: "0 2px" }}>
                      <span>J-7</span>
                      <span>J-6</span>
                      <span>J-5</span>
                      <span>J-4</span>
                      <span>J-3</span>
                      <span>J-2</span>
                      <span>J-1</span>
                    </div>
                  </div>
                  
                  {/* Action Close */}
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        padding: "12px 24px", borderRadius: 8, border: "none",
                        background: c.accent, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono,
                        boxShadow: `0 4px 12px ${c.accentGlow}`
                      }}
                    >
                      {uiLang === 'fr' ? 'Fermer' : (uiLang === 'it' ? 'Chiudi' : 'Close')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 0.6; } }
      `}</style>
    </div>
  );
}
