import React, { useState, useEffect } from 'react';

const Card = ({ children, c }) => (
  <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
    {children}
  </div>
);

const InstaIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, verticalAlign: "middle" }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, verticalAlign: "middle" }}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const Button = ({ children, onClick, bg, color, disabled, small }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "8px 12px" : "12px 16px", borderRadius: 8, border: "none", 
    background: disabled ? "rgba(255, 255, 255, 0.05)" : bg, 
    color: disabled ? "rgba(255, 255, 255, 0.3)" : color, 
    cursor: disabled ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: small ? 12 : 14, fontFamily: "inherit",
    transition: "transform 0.1s"
  }}
  onMouseDown={e=>!disabled && (e.target.style.transform="scale(0.96)")}
  onMouseUp={e=>!disabled && (e.target.style.transform="scale(1)")}
  >
    {children}
  </button>
);

const Input = ({ placeholder, value, onChange, c }) => (
  <input type="text" placeholder={placeholder} value={value} onChange={onChange} style={{
    width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text,
    outline: "none", fontSize: 13, marginBottom: 10, boxSizing: "border-box"
  }} />
);

// Force dark text on native <option> elements (OS renders them with white bg)
const selectStyle = (c) => ({
  width: "100%", padding: "12px 14px", borderRadius: 8,
  border: `1px solid ${c.border}`, background: c.bg, color: c.text,
  outline: "none", fontSize: 14
});
const optionStyle = { color: "#111", background: "#fff" };

export default function MatchmakingTab({ c, mono, API_URL, uiLang }) {
  const [brands, setBrands] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [agencyTalents, setAgencyTalents] = useState([]);

  // Form states
  const [newBrand, setNewBrand] = useState({ name: '', website: '', niche: '', budget: '', description: '' });
  const [newInfluencer, setNewInfluencer] = useState({ username: '', platform: 'instagram', niche: '', followers: '', engagement: '', profileUrl: '' });
  const [showRosterDropdown, setShowRosterDropdown] = useState(false);

  // Pitch state
  const [pitchModal, setPitchModal] = useState({ isOpen: false, mode: '', source: null, target: null, relationship: 'cold', pitchLang: 'it', email: '', loading: false, recipientEmail: '', sendingEmail: false, emailSent: false });

  // Validated Matches state
  const [validatedMatches, setValidatedMatches] = useState([]);

  // Contracts state
  const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem("matchmaking_contracts");
    if (saved) { try { return JSON.parse(saved); } catch(e) {} }
    return [];
  });
  const [contractModal, setContractModal] = useState({ isOpen: false, match: null, generating: false, contract: null });

  // Brand contact form (merged from Brand Portal)


  useEffect(() => {
    localStorage.setItem("matchmaking_contracts", JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    fetchData();
    fetchMatches();
  }, [API_URL]);

  const fetchData = async () => {
    try {
      const rBrand = await fetch(`${API_URL}/api/catalogue/brands`);
      const rInf = await fetch(`${API_URL}/api/catalogue/influencers`);
      setBrands((await rBrand.json()).brands || []);
      setInfluencers((await rInf.json()).influencers || []);
      
      const saved = localStorage.getItem("agency_talents_v2");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) setAgencyTalents(parsed);
        } catch (e) {}
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_URL}/api/catalogue/matches`).then(r => r.json());
      setValidatedMatches(res);
    } catch (e) {
      console.error(e);
    }
  };

  const validateMatch = async () => {
    const isBToI = pitchModal.mode === "brand_to_influencer";
    const brand = isBToI ? pitchModal.source : pitchModal.target;
    const influencer = isBToI ? pitchModal.target : pitchModal.source;
    
    if (!brand || !influencer) return;

    try {
      const res = await fetch(`${API_URL}/api/catalogue/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          influencer,
          relationship: pitchModal.relationship,
          email: pitchModal.email,
          pitchLang: pitchModal.pitchLang
        })
      }).then(r => r.json());
      
      setValidatedMatches(prev => [...prev, res]);
      alert(uiLang === "fr" ? "Accord validé et enregistré !" : "Accordo validato e registrato!");
      setPitchModal({ ...pitchModal, isOpen: false });
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const sendMatchEmail = async () => {
    if (!pitchModal.recipientEmail || !pitchModal.email) return;
    setPitchModal(prev => ({ ...prev, sendingEmail: true }));
    try {
      const res = await fetch(`${API_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: pitchModal.recipientEmail,
          subject: pitchModal.email.split('\n')[0].replace(/^\[?Objet\]?:?\s*/i, '').trim() || 'Proposition de collaboration',
          body: pitchModal.email
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPitchModal(prev => ({ ...prev, sendingEmail: false, emailSent: true }));
      setTimeout(() => setPitchModal(prev => ({ ...prev, emailSent: false })), 4000);
    } catch (err) {
      setPitchModal(prev => ({ ...prev, sendingEmail: false }));
      alert(`Erreur d'envoi: ${err.message}`);
    }
  };

  const deleteMatch = async (id) => {
    if (!window.confirm(uiLang === "fr" ? "Supprimer cet accord ?" : "Eliminare questo accordo?")) return;
    try {
      await fetch(`${API_URL}/api/catalogue/matches/${id}`, { method: "DELETE" });
      setValidatedMatches(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const addBrand = async () => {
    if (!newBrand.name || !newBrand.niche) return;
    await fetch(`${API_URL}/api/catalogue/brands`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newBrand)
    });
    setNewBrand({ name: '', website: '', niche: '', budget: '', description: '' });
    fetchData();
  };

  const deleteBrand = async (id) => {
    await fetch(`${API_URL}/api/catalogue/brands/${id}`, { method: "DELETE" });
    fetchData();
  };

  const addInfluencer = async () => {
    if (!newInfluencer.username || !newInfluencer.niche) return;
    await fetch(`${API_URL}/api/catalogue/influencers`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newInfluencer)
    });
    setNewInfluencer({ username: '', platform: 'instagram', niche: '', followers: '', engagement: '', profileUrl: '' });
    fetchData();
  };

  const deleteInfluencer = async (id) => {
    await fetch(`${API_URL}/api/catalogue/influencers/${id}`, { method: "DELETE" });
    fetchData();
  };

  const generatePitch = async () => {
    setPitchModal({ ...pitchModal, loading: true, email: '' });
    try {
      const res = await fetch(`${API_URL}/api/catalogue/generate-pitch`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: pitchModal.mode,
          brand: pitchModal.mode === "brand_to_influencer" ? pitchModal.source : pitchModal.target,
          influencer: pitchModal.mode === "brand_to_influencer" ? pitchModal.target : pitchModal.source,
          relationship: pitchModal.relationship,
          lang: pitchModal.pitchLang
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPitchModal({ ...pitchModal, loading: false, email: data.email });
    } catch (err) {
      setPitchModal({ ...pitchModal, loading: false, email: `Erreur: ${err.message}` });
    }
  };

  const openMatchModal = (sourceItem, type) => {
    setPitchModal({ isOpen: true, mode: type === 'brand' ? 'brand_to_influencer' : 'influencer_to_brand', source: sourceItem, target: null, relationship: 'cold', pitchLang: 'it', email: '', loading: false });
  };

  // ── Contract Generation ──
  const generateContract = (match) => {
    setContractModal({ isOpen: true, match, generating: true, contract: null });
    setTimeout(() => {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setMonth(endDate.getMonth() + 3);
      const contractText = `CONTRAT DE PRESTATION DE SERVICES ET CESSION DE DROITS D'AUTEUR (UGC)
Réf: C-${match.id.substring(0, 8).toUpperCase()}

ENTRE LES SOUSSIGNÉS :

1. La société ${match.brand.name}, dûment représentée,
Ci-après dénommée "La Marque",

ET

2. Le Créateur de Contenu @${match.influencer.username},
Ci-après dénommé(e) "Le Créateur",

INTERMÉDIÉ PAR :

3. VIRAL ACQUISITION AGENCY, agence de marketing d'influence, sise en France,
Ci-après dénommée "L'Agence" (représentée par Brejnev Diaz).

Date d'effet : ${today.toLocaleDateString('fr-FR')}
Date de fin  : ${endDate.toLocaleDateString('fr-FR')}

IL A ÉTÉ PRÉALABLEMENT EXPOSÉ CE QUI SUIT :
La Marque, opérant dans le secteur de "${match.brand.niche}", souhaite promouvoir ses produits et services à travers la création de Contenus Générés par les Utilisateurs (UGC). Le Créateur possède une expertise reconnue dans la création de tels contenus.

CECI EXPOSÉ, IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 : OBJET DU CONTRAT
Le présent contrat a pour objet de définir les conditions dans lesquelles le Créateur s'engage à concevoir, réaliser et livrer des contenus numériques (ci-après les "Livrables") pour le compte de la Marque, par l'intermédiaire de l'Agence.

ARTICLE 2 : DESCRIPTION DES LIVRABLES
Le Créateur s'engage à livrer à l'Agence, aux fins de validation par la Marque, les éléments suivants :
- Deux (2) vidéos UGC optimisées pour le format vertical (9:16, 1080x1920) d'une durée de 15 à 60 secondes.
- Les vidéos devront intégrer un hook (accroche) fort dans les 3 premières secondes, un développement (démonstration du produit), et un appel à l'action (Call-to-Action).
- Une (1) Story Instagram (ou format similaire) incluant le lien d'affiliation ou le Swipe-Up fourni par l'Agence.
Le Créateur dispose d'une totale liberté éditoriale, sous réserve de respecter le brief créatif transmis en annexe.

ARTICLE 3 : RÉMUNÉRATION ET MODALITÉS DE PAIEMENT
En contrepartie de l'exécution complète des prestations et de la cession de droits visée à l'Article 5, le Créateur percevra :
- Un paiement forfaitaire de [À DÉFINIR] EUR (Hors Taxes).
- La dotation gratuite du ou des produit(s) d'une valeur marchande de [À DÉFINIR] EUR, expédié(s) à l'adresse du Créateur.
Le paiement sera effectué par virement bancaire sous trente (30) jours francs à compter de la validation définitive des Livrables par la Marque et réception de la facture correspondante émise par le Créateur ou l'Agence.

ARTICLE 4 : OBLIGATION D'EXCLUSIVITÉ
Le Créateur s'engage, pendant toute la durée d'exécution du présent contrat et pour une durée de trente (30) jours suivant la livraison, à ne pas collaborer, mentionner, ou créer des contenus pour le compte de marques directement concurrentes de ${match.brand.name}.

ARTICLE 5 : CESSION DES DROITS DE PROPRIÉTÉ INTELLECTUELLE (WHITELISTING)
Le Créateur cède à la Marque, pour le monde entier et pour une durée de quatre-vingt-dix (90) jours à compter de la livraison :
- Le droit de reproduction et de représentation des Livrables sur l'ensemble des réseaux sociaux de la Marque (Instagram, TikTok, Facebook).
- Le droit d'exploitation des Livrables à des fins de publicité payante (Social Ads / Whitelisting) via les comptes de la Marque ou du Créateur.
- Le droit d'adaptation mineure (recadrage, ajout de sous-titres ou de musique libre de droit).

ARTICLE 6 : CONFIDENTIALITÉ
Les Parties s'engagent à conserver strictement confidentielles toutes les informations échangées dans le cadre de la négociation et l'exécution du présent contrat (briefs, statistiques, montants financiers).

ARTICLE 7 : LOI APPLICABLE ET JURIDICTION COMPÉTENTE
Le présent contrat est soumis au droit français. Tout litige relatif à son interprétation ou son exécution sera soumis aux tribunaux compétents du ressort du siège de l'Agence.

Fait pour valoir ce que de droit.

LES PARTIES ACCEPTENT LES TERMES DU PRÉSENT CONTRAT :

Pour la Marque : ${match.brand.name}
Date : ______________
Signature :


Pour le Créateur : @${match.influencer.username}
Date : ______________
Signature :


Pour l'Agence : Viral Acquisition
Date : ${today.toLocaleDateString('fr-FR')}
Signature :
(Brejnev Diaz, CEO)
`;
      setContractModal(prev => ({ ...prev, generating: false, contract: contractText }));
    }, 1500);
  };

  const saveContract = () => {
    if (!contractModal.contract || !contractModal.match) return;
    const newContract = {
      id: `contract_${Date.now()}`,
      matchId: contractModal.match.id,
      brandName: contractModal.match.brand.name,
      influencerUsername: contractModal.match.influencer.username,
      niche: contractModal.match.brand.niche,
      content: contractModal.contract,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    setContracts(prev => [...prev, newContract]);
    setContractModal({ isOpen: false, match: null, generating: false, contract: null });
    alert(uiLang === "fr" ? "Contrat sauvegardé !" : "Contratto salvato!");
  };

  const deleteContract = (id) => {
    if (!window.confirm("Supprimer ce contrat ?")) return;
    setContracts(prev => prev.filter(ct => ct.id !== id));
  };

  const updateContractStatus = (id, status) => {
    setContracts(prev => prev.map(ct => ct.id === id ? { ...ct, status } : ct));
  };


  // Combine influencers + roster for dropdown rendering
  const getCombinedInfluencers = () => {
    const combined = [...influencers];
    agencyTalents.forEach(at => {
      if (at.status !== "pending" && !combined.some(i => i.username === at.username || i.username.replace('@','') === at.username.replace('@',''))) {
        combined.push({ ...at, isRoster: true });
      }
    });
    return combined;
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, color: c.text, margin: "0 0 8px 0" }}>🤝 Matchmaking & Collaborations</h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14 }}>Gérez vos marques, influenceurs, et générez des pitchs et contrats via l'IA.</p>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Colonne MARQUES */}
        <div style={{ flex: "1 1 400px", minWidth: 0 }}>
          <h3 style={{ fontSize: 16, color: c.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>💼 Accords Marques ({brands.length})</h3>
          
          <Card c={c}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: 13, color: c.textMuted }}>➕ Ajouter une Marque</h4>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><Input placeholder="Nom (ex: Sephora)" value={newBrand.name} onChange={e=>setNewBrand({...newBrand, name: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="Niche (ex: Beauté)" value={newBrand.niche} onChange={e=>setNewBrand({...newBrand, niche: e.target.value})} c={c} /></div>
            </div>
            <Input placeholder="Description des produits & Cible" value={newBrand.description} onChange={e=>setNewBrand({...newBrand, description: e.target.value})} c={c} />
            <Button onClick={addBrand} bg={c.accent} color="#fff" disabled={!newBrand.name || !newBrand.niche} small>Ajouter au catalogue</Button>
          </Card>

          {brands.map(b => (
            <div key={b.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, marginBottom: 12, position: "relative" }}>
              <button onClick={() => deleteBrand(b.id)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: c.error, cursor: "pointer" }}>✖</button>
              
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <img src={`https://ui-avatars.com/api/?name=${b.name}&background=333&color=fff&size=50&rounded=true`} alt="Brand Logo" style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${c.border}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: c.text }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: c.textMuted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Niche: <span style={{ color: c.accent }}>{b.niche}</span></span>
                    {b.createdAt && <span style={{ fontSize: 11, color: c.textDim, fontFamily: mono }}>📅 {new Date(b.createdAt).toLocaleString(uiLang === 'fr' ? 'fr-FR' : (uiLang === 'it' ? 'it-IT' : 'en-US'))}</span>}
                  </div>
                </div>
              </div>
              
              <p style={{ fontSize: 13, color: c.text, margin: "0 0 16px 0", lineHeight: 1.4 }}>{b.description}</p>
              <Button onClick={() => openMatchModal(b, 'brand')} bg={`linear-gradient(90deg, ${c.accent}, #ff9a5c)`} color="#fff" small style={{ width: "100%" }}>🎯 Trouver un Influenceur pour {b.name}</Button>
            </div>
          ))}
        </div>

        {/* Colonne INFLUENCEURS */}
        <div style={{ flex: "1 1 400px", minWidth: 0 }}>
          <h3 style={{ fontSize: 16, color: c.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>⭐ Influenceurs Signés ({influencers.length})</h3>
          
          <Card c={c}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: 13, color: c.textMuted }}>➕ Ajouter un Influenceur</h4>
            
            {agencyTalents.length > 0 && (
              <div style={{ marginBottom: 14, position: "relative" }}>
                <button 
                  onClick={() => setShowRosterDropdown(!showRosterDropdown)}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.accent}`,
                    background: `rgba(139, 92, 246, 0.08)`, color: c.text, outline: "none", fontSize: 13.5,
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    fontWeight: 600, fontFamily: mono, transition: "background 0.2s"
                  }}
                  onMouseOver={e=>e.currentTarget.style.background="rgba(139, 92, 246, 0.15)"}
                  onMouseOut={e=>e.currentTarget.style.background="rgba(139, 92, 246, 0.08)"}
                >
                  <span>👥 Sélectionner depuis le Roster de l'Agence...</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: showRosterDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="m6 9 6 6 6-6"/></svg>
                </button>
                
                {showRosterDropdown && (
                  <>
                    <div onClick={() => setShowRosterDropdown(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 98 }} />
                    <div style={{ 
                      position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, 
                      background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, 
                      boxShadow: "0 12px 30px rgba(0,0,0,0.6)", zIndex: 100,
                      maxHeight: 280, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 4
                    }}>
                      {agencyTalents.filter(t => t.status !== "pending").map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => {
                            setNewInfluencer({
                              username: t.username.replace('@',''),
                              platform: t.platform,
                              niche: t.niche,
                              followers: t.followers.toString(),
                              engagement: t.engagement.toString().replace('%',''),
                              profileUrl: t.profileUrl || `https://instagram.com/${t.username.replace('@','')}`
                            });
                            setShowRosterDropdown(false);
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", 
                            borderRadius: 8, cursor: "pointer", transition: "background 0.2s"
                          }}
                          onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                          onMouseOut={e=>e.currentTarget.style.background="transparent"}
                        >
                          <img 
                            src={t.avatar || `https://ui-avatars.com/api/?name=${t.username.replace('@','')}&background=333&color=fff&rounded=true`} 
                            alt={t.username}
                            style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: `1px solid ${c.border}` }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: c.text, fontSize: 13.5 }}>@{t.username.replace('@','')}</div>
                            <div style={{ fontSize: 11.5, color: c.textMuted, marginTop: 4, display: "flex", gap: 12, alignItems: "center" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#E1306C" }}>
                                <InstaIcon />
                                {t.followers >= 1000 ? `${(t.followers/1000).toFixed(1)}k` : t.followers}
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff" }}>
                                <TikTokIcon />
                                {t.tiktokFollowers ? (t.tiktokFollowers >= 1000 ? `${(t.tiktokFollowers/1000).toFixed(1)}k` : t.tiktokFollowers) : `${(t.followers * 1.5 / 1000).toFixed(1)}k`}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 140 }}><Input placeholder="@username" value={newInfluencer.username} onChange={e=>setNewInfluencer({...newInfluencer, username: e.target.value})} c={c} /></div>
              <div style={{ flex: 1, minWidth: 140 }}><Input placeholder="Lien profil (URL)" value={newInfluencer.profileUrl} onChange={e=>setNewInfluencer({...newInfluencer, profileUrl: e.target.value})} c={c} /></div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <select 
                  value={newInfluencer.platform} 
                  onChange={e => {
                    const newPlat = e.target.value;
                    const t = agencyTalents.find(x => x.username.replace('@','') === newInfluencer.username.replace('@',''));
                    if (t) {
                      setNewInfluencer({
                        ...newInfluencer,
                        platform: newPlat,
                        profileUrl: newPlat === "tiktok" ? (t.tiktokProfileUrl || `https://tiktok.com/@${t.username.replace('@','')}`) : (t.profileUrl || `https://instagram.com/${t.username.replace('@','')}`),
                        followers: (newPlat === "tiktok" ? (t.tiktokFollowers || Math.floor(t.followers * 1.5)) : t.followers).toString(),
                        engagement: (newPlat === "tiktok" ? (t.tiktokEngagement || (parseFloat(t.engagement.replace('%','')) * 1.2).toFixed(1) + '%') : t.engagement).toString().replace('%','')
                      });
                    } else {
                      setNewInfluencer({
                        ...newInfluencer,
                        platform: newPlat,
                        profileUrl: newInfluencer.username ? `https://${newPlat}.com/${newPlat === "tiktok" ? "@" : ""}${newInfluencer.username.replace('@','')}` : ''
                      });
                    }
                  }} 
                  style={{ ...selectStyle(c), marginBottom: 10, padding: "9px" }}
                >
                  <option value="instagram" style={optionStyle}>Instagram</option>
                  <option value="tiktok" style={optionStyle}>TikTok</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 2 }}><Input placeholder="Niche (ex: Tech)" value={newInfluencer.niche} onChange={e=>setNewInfluencer({...newInfluencer, niche: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="Abonnés" value={newInfluencer.followers} onChange={e=>setNewInfluencer({...newInfluencer, followers: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="Eng %" value={newInfluencer.engagement} onChange={e=>setNewInfluencer({...newInfluencer, engagement: e.target.value})} c={c} /></div>
            </div>
            <Button onClick={addInfluencer} bg={c.success} color="#fff" disabled={!newInfluencer.username || !newInfluencer.niche} small>Ajouter au catalogue</Button>
          </Card>

          {influencers.map(i => (
            <div key={i.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, marginBottom: 12, position: "relative" }}>
              <button onClick={() => deleteInfluencer(i.id)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: c.error, cursor: "pointer" }}>✖</button>
              
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <img src={i.avatar || `https://ui-avatars.com/api/?name=${i.username}&background=10B981&color=fff&size=50&rounded=true`} alt="Profile" style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${c.border}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: c.text, display: "flex", alignItems: "center", gap: 6 }}>
                    @{i.username} 
                  </div>
                  <div style={{ fontSize: 12, color: c.textMuted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Niche: <span style={{ color: c.success }}>{i.niche}</span></span>
                    {i.createdAt && <span style={{ fontSize: 11, color: c.textDim, fontFamily: mono }}>📅 {new Date(i.createdAt).toLocaleString(uiLang === 'fr' ? 'fr-FR' : (uiLang === 'it' ? 'it-IT' : 'en-US'))}</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, fontSize: 12, color: c.text, marginBottom: 16, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#E1306C" }}><InstaIcon /> {i.followers >= 1000 ? `${(i.followers/1000).toFixed(1)}k` : i.followers}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff" }}><TikTokIcon /> {i.tiktokFollowers ? (i.tiktokFollowers >= 1000 ? `${(i.tiktokFollowers/1000).toFixed(1)}k` : i.tiktokFollowers) : `${(i.followers * 1.5 / 1000).toFixed(1)}k`}</div>
                <div style={{ marginLeft: 8 }}>🔥 {i.engagement}% eng</div>
              </div>
              <Button onClick={() => openMatchModal(i, 'influencer')} bg={`linear-gradient(90deg, ${c.success}, #69C9D0)`} color="#fff" small>🎯 Proposer à une Marque</Button>
            </div>
          ))}
        </div>
      </div>

      {/* ══════ SECTION ACCORDS VALIDÉS & SIGNÉS ══════ */}
      <div className="glass-panel" style={{ marginTop: 40, background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, boxShadow: `0 8px 32px rgba(0,0,0,0.15)` }}>
        <h3 className="outfit" style={{ fontSize: 17, color: c.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>🏆 Accords Validés & Signés ({validatedMatches.length})</h3>
        
        {validatedMatches.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 10px", color: c.textDim, fontSize: 13.5, fontStyle: "italic" }}>
            Aucun accord validé pour le moment. Générez un pitch IA depuis un profil de marque ou d'influenceur ci-dessus et cliquez sur "Valider & Enregistrer l'Accord" pour l'enregistrer ici.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, color: c.text }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${c.border}`, textAlign: "left" }}>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700 }}>Marque</th>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700 }}>Talent</th>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700 }}>Niche</th>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700 }}>Statut</th>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700 }}>Date</th>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {validatedMatches.map(m => (
                  <tr key={m.id} style={{ borderBottom: `1px solid ${c.border}`, transition: "background 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.01)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding: "14px 10px", fontWeight: "bold" }}>{m.brand.name}</td>
                    <td style={{ padding: "14px 10px", color: c.success, fontWeight: 600 }}>@{m.influencer.username}</td>
                    <td style={{ padding: "14px 10px" }}><span style={{ background: c.accentSoft, color: c.accent, fontSize: 10.5, padding: "3px 8px", borderRadius: 6, fontWeight: "bold", textTransform: "uppercase" }}>{m.brand.niche}</span></td>
                    <td style={{ padding: "14px 10px" }}><span style={{ fontSize: 11.5, color: m.relationship === "signed" ? c.success : c.warning, background: m.relationship === "signed" ? c.successSoft : c.warningBg, padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>{m.relationship === "signed" ? "Signed 📝" : "Outreach ✉️"}</span></td>
                    <td style={{ padding: "14px 10px", color: c.textMuted, fontFamily: mono, fontSize: 11 }}>{new Date(m.validatedAt).toLocaleString('fr-FR')}</td>
                    <td style={{ padding: "14px 10px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <Button onClick={() => {
                          setPitchModal({
                            isOpen: true, mode: "view_saved", source: m.brand, target: m.influencer,
                            relationship: m.relationship, pitchLang: m.pitchLang, email: m.email, loading: false
                          });
                        }} bg={c.accent} color="#fff" small>🔍 Lire</Button>
                        <Button onClick={() => generateContract(m)} bg={`linear-gradient(90deg, #f59e0b, #ef4444)`} color="#fff" small>📄 Contrat</Button>
                        <Button onClick={() => deleteMatch(m.id)} bg={c.error} color="#fff" small>✖</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════ SECTION GESTION DES CONTRATS ══════ */}
      <div className="glass-panel" style={{ marginTop: 24, background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, boxShadow: `0 8px 32px rgba(0,0,0,0.15)` }}>
        <h3 className="outfit" style={{ fontSize: 17, color: c.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>📋 Gestion des Contrats ({contracts.length})</h3>
        
        {contracts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 10px", color: c.textDim, fontSize: 13.5, fontStyle: "italic" }}>
            Aucun contrat généré. Validez un accord ci-dessus, puis cliquez sur "📄 Contrat" pour en créer un.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {contracts.map(ct => {
              const statusColors = {
                draft: { bg: c.warningBg, color: c.warning, label: "Brouillon ✏️" },
                sent: { bg: c.emailBlueSoft || "rgba(59,130,246,0.12)", color: c.emailBlue || "#3b82f6", label: "Envoyé 📤" },
                signed: { bg: c.successSoft, color: c.success, label: "Signé ✅" },
                expired: { bg: c.errorBg, color: c.error, label: "Expiré ❌" }
              };
              const st = statusColors[ct.status] || statusColors.draft;
              return (
                <div key={ct.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: st.bg, color: st.color, textTransform: "uppercase" }}>{st.label}</span>
                    <span style={{ fontSize: 10, color: c.textDim, fontFamily: mono }}>{new Date(ct.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: c.text, marginBottom: 4 }}>{ct.brandName}</div>
                  <div style={{ fontSize: 13, color: c.success, fontWeight: 600, marginBottom: 4 }}>↔ @{ct.influencerUsername}</div>
                  <div style={{ fontSize: 11, color: c.textDim, marginBottom: 12 }}>Niche: {ct.niche}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <select
                      value={ct.status}
                      onChange={e => updateContractStatus(ct.id, e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${c.border}`, background: c.card, color: c.text, fontSize: 11, cursor: "pointer" }}
                    >
                      <option value="draft" style={optionStyle}>Brouillon</option>
                      <option value="sent" style={optionStyle}>Envoyé</option>
                      <option value="signed" style={optionStyle}>Signé</option>
                      <option value="expired" style={optionStyle}>Expiré</option>
                    </select>
                    <Button onClick={() => {
                      setContractModal({ isOpen: true, match: null, generating: false, contract: ct.content });
                    }} bg={c.accent} color="#fff" small>👁️ Voir</Button>
                    <Button onClick={() => {
                      navigator.clipboard.writeText(ct.content);
                      alert("Contrat copié !");
                    }} bg={c.success} color="#fff" small>📋 Copier</Button>
                    <Button onClick={() => deleteContract(ct.id)} bg={c.error} color="#fff" small>✖</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════ MATCHMAKING MODAL ══════ */}
      {pitchModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 30, width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <button onClick={() => setPitchModal({...pitchModal, isOpen: false})} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: c.textMuted, cursor: "pointer", fontSize: 20 }}>✖</button>
            
            <h2 style={{ margin: "0 0 8px 0", fontSize: 20, color: c.text }}>⚡ Matchmaking IA</h2>
            
            {pitchModal.mode === "view_saved" ? (
              <div>
                <p style={{ color: c.textMuted, fontSize: 14, marginBottom: 24 }}>
                  Accord entre <strong>{pitchModal.source.name}</strong> et <strong>@{pitchModal.target.username}</strong>
                </p>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: c.textDim, fontStyle: "italic", pointerEvents: "none" }}>✏️ Cliquez pour modifier</div>
                  <textarea
                    value={pitchModal.email}
                    onChange={e => setPitchModal({...pitchModal, email: e.target.value})}
                    style={{
                      width: "100%", minHeight: 300, fontSize: 13.5, color: c.text,
                      background: c.bg, border: `1.5px solid ${c.emailBlue || '#6366f1'}55`, borderRadius: 8,
                      padding: "14px 16px", lineHeight: 1.7, resize: "vertical", outline: "none",
                      fontFamily: "inherit", boxSizing: "border-box"
                    }}
                  />
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                    <input
                      type="email"
                      placeholder="📬 Email du destinataire"
                      value={pitchModal.recipientEmail || ''}
                      onChange={e => setPitchModal({...pitchModal, recipientEmail: e.target.value})}
                      style={{
                        flex: 1, padding: "9px 14px", borderRadius: 8, fontSize: 13,
                        border: `1.5px solid ${pitchModal.recipientEmail ? (c.emailBlue || '#6366f1') : c.border}`,
                        background: c.bg, color: c.text, outline: "none", fontFamily: "inherit"
                      }}
                    />
                    <Button
                      onClick={sendMatchEmail}
                      disabled={!pitchModal.recipientEmail || pitchModal.sendingEmail || pitchModal.emailSent}
                      bg={pitchModal.emailSent ? c.success : `linear-gradient(135deg, ${c.emailBlue || '#6366f1'}, #818cf8)`}
                      color="#fff"
                      small
                    >
                      {pitchModal.emailSent ? '✅ Envoyé !' : pitchModal.sendingEmail ? '⏳ Envoi...' : '🚀 Envoyer'}
                    </Button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <Button onClick={() => { navigator.clipboard.writeText(pitchModal.email); alert("Copié !"); }} bg={c.success} color="#fff" small>📋 Copier l'e-mail</Button>
                  <Button onClick={() => setPitchModal({...pitchModal, isOpen: false})} bg={c.border} color={c.text} small>Fermer</Button>
                </div>
              </div>
            ) : (() => {
                const isBrandToInf = pitchModal.mode === "brand_to_influencer";
                const combinedInfs = isBrandToInf ? getCombinedInfluencers() : [];
                const brandNiche = (isBrandToInf && pitchModal.source) ? (pitchModal.source.niche?.toLowerCase() || "") : "";
                const matchInfs = combinedInfs.filter(i => i.niche && (i.niche.toLowerCase().includes(brandNiche) || brandNiche.includes(i.niche.toLowerCase())));
                const otherInfs = combinedInfs.filter(i => !matchInfs.includes(i));

                return (
                  <>
                    <p style={{ color: c.textMuted, fontSize: 14, marginBottom: 24 }}>
                      {isBrandToInf
                        ? `Trouver le meilleur influenceur pour la marque ${pitchModal.source.name}`
                        : `Trouver la meilleure marque pour l'influenceur @${pitchModal.source.username}`}
                    </p>

                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 8, textTransform: "uppercase" }}>
                        {isBrandToInf ? "Sélectionner un Influenceur cible :" : "Sélectionner une Marque cible :"}
                      </label>
                      
                      {(isBrandToInf && combinedInfs.length === 0) || (!isBrandToInf && brands.length === 0) ? (
                        <div style={{ background: "rgba(255, 100, 100, 0.1)", border: "1px solid rgba(255, 100, 100, 0.3)", padding: 16, borderRadius: 8, color: c.text, fontSize: 13, lineHeight: 1.5 }}>
                          ⚠️ <strong>Attention :</strong> Aucun {isBrandToInf ? "influenceur n'est" : "accord marque n'est"} présent dans votre base.<br/>
                          Veuillez d'abord en ajouter un depuis l'onglet principal avant de générer un pitch.
                        </div>
                      ) : (
                        <select 
                          onChange={(e) => {
                            const targetList = isBrandToInf ? combinedInfs : brands;
                            const target = targetList.find(item => item.id === e.target.value);
                            setPitchModal({
                              ...pitchModal, 
                              target,
                              relationship: target?.isRoster ? 'signed' : (pitchModal.relationship || 'cold')
                            });
                          }}
                          style={selectStyle(c)}
                        >
                          <option value="" style={optionStyle}>Sélectionnez...</option>
                          {isBrandToInf ? (
                            <>
                              {matchInfs.length > 0 && (
                                <optgroup label={`✨ Suggestions IA (Niche: ${pitchModal.source.niche})`}>
                                  {matchInfs.map(i => <option key={i.id} value={i.id} style={optionStyle}>@{i.username} ({i.niche}) — {i.followers.toLocaleString('fr-FR')} abonnés {i.isRoster ? '⭐ Roster' : ''}</option>)}
                                </optgroup>
                              )}
                              {otherInfs.length > 0 && (
                                <optgroup label="Autres Talents">
                                  {otherInfs.map(i => <option key={i.id} value={i.id} style={optionStyle}>@{i.username} ({i.niche}) — {i.followers.toLocaleString('fr-FR')} abonnés {i.isRoster ? '⭐ Roster' : ''}</option>)}
                                </optgroup>
                              )}
                            </>
                          ) : (
                            brands.map(b => <option key={b.id} value={b.id} style={optionStyle}>{b.name} ({b.niche})</option>)
                          )}
                        </select>
                      )}
                    </div>

                    {isBrandToInf && pitchModal.target && (
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 8, textTransform: "uppercase" }}>
                          Statut de l'influenceur :
                        </label>
                        <div style={{ display: "flex", gap: 12 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 8, color: c.text, fontSize: 14, cursor: "pointer" }}>
                            <input type="radio" name="relationship" checked={pitchModal.relationship === 'cold'} onChange={() => setPitchModal({...pitchModal, relationship: 'cold'})} />
                            Nouveau (Prospection)
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: 8, color: c.text, fontSize: 14, cursor: "pointer" }}>
                            <input type="radio" name="relationship" checked={pitchModal.relationship === 'signed'} onChange={() => setPitchModal({...pitchModal, relationship: 'signed'})} />
                            Déjà en agence (Proposer campagne)
                          </label>
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 8, textTransform: "uppercase" }}>
                        Langue de l'e-mail :
                      </label>
                      <select 
                        value={pitchModal.pitchLang} 
                        onChange={(e) => setPitchModal({...pitchModal, pitchLang: e.target.value})}
                        style={selectStyle(c)}
                      >
                        <option value="it" style={optionStyle}>🇮🇹 Italien (Recommandé)</option>
                        <option value="en" style={optionStyle}>🇬🇧 Anglais</option>
                        <option value="fr" style={optionStyle}>🇫🇷 Français</option>
                      </select>
                    </div>

                    <Button 
                      onClick={generatePitch} 
                      disabled={!pitchModal.target || pitchModal.loading} 
                      bg={c.accent} color="#fff"
                    >
                      {pitchModal.loading ? "Génération par Claude..." : "✨ Générer le Pitch Magique"}
                    </Button>

                    {pitchModal.email && (
                      <div style={{ marginTop: 24, animation: "fadeInUp 0.4s" }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: 13, color: c.text, textTransform: "uppercase" }}>📧 E-mail généré par l'IA :</h4>
                        <div style={{ position: "relative" }}>
                          <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: c.textDim, fontStyle: "italic", pointerEvents: "none" }}>✏️ Cliquez pour modifier</div>
                          <textarea
                            value={pitchModal.email}
                            onChange={e => setPitchModal({...pitchModal, email: e.target.value})}
                            style={{
                              width: "100%", minHeight: 280, fontSize: 13.5, color: c.text,
                              background: c.bg, border: `1.5px solid ${c.emailBlue || '#6366f1'}55`, borderRadius: 8,
                              padding: "14px 16px", lineHeight: 1.7, resize: "vertical", outline: "none",
                              fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s"
                            }}
                            onFocus={e => e.target.style.borderColor = c.emailBlue || '#6366f1'}
                            onBlur={e => e.target.style.borderColor = `${c.emailBlue || '#6366f1'}55`}
                          />
                        </div>
                        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                              type="email"
                              placeholder="📬 Email du destinataire (ex: contact@influencer.com)"
                              value={pitchModal.recipientEmail}
                              onChange={e => setPitchModal({...pitchModal, recipientEmail: e.target.value})}
                              style={{
                                flex: 1, padding: "9px 14px", borderRadius: 8, fontSize: 13,
                                border: `1.5px solid ${pitchModal.recipientEmail ? (c.emailBlue || '#6366f1') : c.border}`,
                                background: c.bg, color: c.text, outline: "none", fontFamily: "inherit"
                              }}
                            />
                            <Button
                              onClick={sendMatchEmail}
                              disabled={!pitchModal.recipientEmail || pitchModal.sendingEmail || pitchModal.emailSent}
                              bg={pitchModal.emailSent ? c.success : `linear-gradient(135deg, ${c.emailBlue || '#6366f1'}, #818cf8)`}
                              color="#fff"
                              small
                            >
                              {pitchModal.emailSent ? '✅ Envoyé !' : pitchModal.sendingEmail ? '⏳ Envoi...' : '🚀 Envoyer'}
                            </Button>
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <Button onClick={() => { navigator.clipboard.writeText(pitchModal.email); alert("Copié !"); }} bg={c.success} color="#fff" small>📋 Copier l'e-mail</Button>
                            <Button onClick={validateMatch} bg={`linear-gradient(90deg, ${c.accent}, ${c.accent2})`} color="#fff" small>Valider & Enregistrer l'Accord 🤝</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()
            }
          </div>
        </div>
      )}

      {/* ══════ CONTRACT MODAL ══════ */}
      {contractModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001, padding: 20, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 30, width: "100%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <button onClick={() => setContractModal({ isOpen: false, match: null, generating: false, contract: null })} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: c.textMuted, cursor: "pointer", fontSize: 20 }}>✖</button>
            
            <h2 style={{ margin: "0 0 16px 0", fontSize: 20, color: c.text }}>📄 Contrat de Collaboration</h2>
            
            {contractModal.generating ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1.5s infinite" }}>⚙️</div>
                <div style={{ color: c.textMuted, fontSize: 15 }}>Génération du contrat en cours...</div>
              </div>
            ) : contractModal.contract ? (
              <div>
                <textarea
                  value={contractModal.contract}
                  onChange={e => setContractModal({...contractModal, contract: e.target.value})}
                  style={{
                    width: "100%", minHeight: 450, fontSize: 12.5, color: c.text,
                    background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 8,
                    padding: "16px", lineHeight: 1.6, resize: "vertical", outline: "none",
                    fontFamily: "'JetBrains Mono','Fira Code',monospace", boxSizing: "border-box"
                  }}
                />
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  {contractModal.match && (
                    <Button onClick={saveContract} bg={`linear-gradient(90deg, ${c.accent}, ${c.accent2})`} color="#fff">💾 Sauvegarder le Contrat</Button>
                  )}
                  <Button onClick={() => { navigator.clipboard.writeText(contractModal.contract); alert("Contrat copié !"); }} bg={c.success} color="#fff" small>📋 Copier</Button>
                  <Button onClick={() => setContractModal({ isOpen: false, match: null, generating: false, contract: null })} bg={c.border} color={c.text} small>Fermer</Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
