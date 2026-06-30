import React, { useState, useEffect } from 'react';

const Card = ({ children, c }) => (
  <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
    {children}
  </div>
);

const Button = ({ children, onClick, bg, color, disabled, small }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "8px 12px" : "12px 16px", borderRadius: 8, border: "none", background: disabled ? "#ccc" : bg, 
    color, cursor: disabled ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: small ? 12 : 14, fontFamily: "inherit",
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

export default function MatchmakingTab({ c, mono, API_URL, uiLang }) {
  const [brands, setBrands] = useState([]);
  const [influencers, setInfluencers] = useState([]);

  // Form states
  const [newBrand, setNewBrand] = useState({ name: '', website: '', niche: '', budget: '', description: '' });
  const [newInfluencer, setNewInfluencer] = useState({ username: '', platform: 'instagram', niche: '', followers: '', engagement: '' });

  // Pitch state
  const [pitchModal, setPitchModal] = useState({ isOpen: false, mode: '', source: null, target: null, relationship: 'cold', pitchLang: 'it', email: '', loading: false, recipientEmail: '', sendingEmail: false, emailSent: false });

  // Validated Matches state
  const [validatedMatches, setValidatedMatches] = useState([]);

  useEffect(() => {
    fetchData();
    fetchMatches();
  }, [API_URL]);

  const fetchData = async () => {
    try {
      const b = await fetch(`${API_URL}/api/catalogue/brands`).then(r => r.json());
      const i = await fetch(`${API_URL}/api/catalogue/influencers`).then(r => r.json());
      setBrands(b);
      setInfluencers(i);
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
      alert(uiLang === "fr" ? "Accord validé et enregistré au catalogue !" : "Accordo validato e registrato nel catalogo!");
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
    setNewInfluencer({ username: '', platform: 'instagram', niche: '', followers: '', engagement: '' });
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
    // type: 'brand' (source is brand, need to select influencer) or 'influencer'
    setPitchModal({ isOpen: true, mode: type === 'brand' ? 'brand_to_influencer' : 'influencer_to_brand', source: sourceItem, target: null, relationship: 'cold', pitchLang: 'it', email: '', loading: false });
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, color: c.text, margin: "0 0 8px 0" }}>🤝 Catalogue & Matchmaking</h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14 }}>Gérez vos accords marques et vos influenceurs signés, et générez des pitchs parfaits avec l'IA.</p>
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
              <div style={{ fontSize: 16, fontWeight: "bold", color: c.text, marginBottom: 4 }}>{b.name}</div>
              <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Niche: <span style={{ color: c.accent }}>{b.niche}</span></span>
                {b.createdAt && <span style={{ fontSize: 11, color: c.textDim, fontFamily: mono }}>📅 {new Date(b.createdAt).toLocaleString(uiLang === 'fr' ? 'fr-FR' : (uiLang === 'it' ? 'it-IT' : 'en-US'))}</span>}
              </div>
              <p style={{ fontSize: 13, color: c.text, margin: "0 0 16px 0", lineHeight: 1.4 }}>{b.description}</p>
              <Button onClick={() => openMatchModal(b, 'brand')} bg={`linear-gradient(90deg, ${c.accent}, #ff9a5c)`} color="#fff" small>🎯 Trouver un Influenceur pour {b.name}</Button>
            </div>
          ))}
        </div>

        {/* Colonne INFLUENCEURS */}
        <div style={{ flex: "1 1 400px", minWidth: 0 }}>
          <h3 style={{ fontSize: 16, color: c.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>⭐ Influenceurs Signés ({influencers.length})</h3>
          
          <Card c={c}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: 13, color: c.textMuted }}>➕ Ajouter un Influenceur</h4>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><Input placeholder="@username" value={newInfluencer.username} onChange={e=>setNewInfluencer({...newInfluencer, username: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}>
                <select value={newInfluencer.platform} onChange={e=>setNewInfluencer({...newInfluencer, platform: e.target.value})} style={{ width: "100%", padding: "9px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13, marginBottom: 10 }}>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
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
              <div style={{ fontSize: 16, fontWeight: "bold", color: c.text, marginBottom: 4 }}>@{i.username} <span style={{ fontSize: 12, fontWeight: "normal", color: c.textMuted }}>({i.platform})</span></div>
              <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Niche: <span style={{ color: c.success }}>{i.niche}</span></span>
                {i.createdAt && <span style={{ fontSize: 11, color: c.textDim, fontFamily: mono }}>📅 {new Date(i.createdAt).toLocaleString(uiLang === 'fr' ? 'fr-FR' : (uiLang === 'it' ? 'it-IT' : 'en-US'))}</span>}
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: c.text, marginBottom: 16 }}>
                <div>👥 {i.followers}</div>
                <div>🔥 {i.engagement}% eng</div>
              </div>
              <Button onClick={() => openMatchModal(i, 'influencer')} bg={`linear-gradient(90deg, ${c.success}, #69C9D0)`} color="#fff" small>🎯 Proposer à une Marque</Button>
            </div>
          ))}
        </div>
      </div>

      {/* MATCHMAKING MODAL */}
      {pitchModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 30, width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <button onClick={() => setPitchModal({...pitchModal, isOpen: false})} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: c.textMuted, cursor: "pointer", fontSize: 20 }}>✖</button>
            
            <h2 style={{ margin: "0 0 8px 0", fontSize: 20, color: c.text }}>⚡ Matchmaking IA</h2>
            
            {pitchModal.mode === "view_saved" ? (
              <div>
                <p style={{ color: c.textMuted, fontSize: 14, marginBottom: 24 }}>
                  Accord validé entre la marque <strong>{pitchModal.source.name}</strong> et l'influenceur <strong>@{pitchModal.target.username}</strong>
                </p>
                <h4 style={{ margin: "0 0 10px 0", fontSize: 13, color: c.text, textTransform: "uppercase" }}>📧 E-mail d'accord enregistré :</h4>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: c.textDim, fontStyle: "italic", pointerEvents: "none" }}>✏️ Modifiable</div>
                  <textarea
                    value={pitchModal.email}
                    onChange={e => setPitchModal({...pitchModal, email: e.target.value})}
                    style={{
                      width: "100%", minHeight: 260, maxHeight: "40vh", fontSize: 13.5, color: c.text,
                      background: c.bg, border: `1.5px solid ${c.emailBlue || '#6366f1'}55`, borderRadius: 8,
                      padding: "14px 16px", lineHeight: 1.7, resize: "vertical", outline: "none",
                      fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = c.emailBlue || '#6366f1'}
                    onBlur={e => e.target.style.borderColor = `${c.emailBlue || '#6366f1'}55`}
                  />
                </div>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Recipient + Send row */}
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
                  {/* Copy + Close row */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <Button onClick={() => { navigator.clipboard.writeText(pitchModal.email); alert("Copié !"); }} bg={c.success} color="#fff" small>📋 Copier l'e-mail</Button>
                    <Button onClick={() => setPitchModal({...pitchModal, isOpen: false})} bg={c.border} color={c.text} small>Fermer</Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p style={{ color: c.textMuted, fontSize: 14, marginBottom: 24 }}>
                  {pitchModal.mode === "brand_to_influencer" 
                    ? `Trouver le meilleur influenceur pour la marque ${pitchModal.source.name}`
                    : `Trouver la meilleure marque pour l'influenceur @${pitchModal.source.username}`}
                </p>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 8, textTransform: "uppercase" }}>
                    {pitchModal.mode === "brand_to_influencer" ? "Sélectionner un Influenceur cible :" : "Sélectionner une Marque cible :"}
                  </label>
                  
                  {(pitchModal.mode === "brand_to_influencer" && influencers.length === 0) || (pitchModal.mode === "influencer_to_brand" && brands.length === 0) ? (
                    <div style={{ background: "rgba(255, 100, 100, 0.1)", border: "1px solid rgba(255, 100, 100, 0.3)", padding: 16, borderRadius: 8, color: c.text, fontSize: 13, lineHeight: 1.5 }}>
                      ⚠️ <strong>Attention :</strong> Aucun {pitchModal.mode === "brand_to_influencer" ? "influenceur n'est" : "accord marque n'est"} présent dans votre catalogue.<br/>
                      Veuillez d'abord en ajouter un depuis l'onglet principal avant de générer un pitch.
                    </div>
                  ) : (
                    <select 
                      onChange={(e) => {
                        const targetList = pitchModal.mode === "brand_to_influencer" ? influencers : brands;
                        const target = targetList.find(item => item.id === e.target.value);
                        setPitchModal({...pitchModal, target});
                      }}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 14 }}
                    >
                      <option value="">Sélectionnez...</option>
                      {pitchModal.mode === "brand_to_influencer" 
                        ? influencers.map(i => <option key={i.id} value={i.id}>@{i.username} ({i.niche})</option>)
                        : brands.map(b => <option key={b.id} value={b.id}>{b.name} ({b.niche})</option>)
                      }
                    </select>
                  )}
                </div>

                {pitchModal.mode === "brand_to_influencer" && pitchModal.target && (
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
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 14 }}
                  >
                    <option value="it">🇮🇹 Italien (Recommandé)</option>
                    <option value="en">🇬🇧 Anglais</option>
                    <option value="fr">🇫🇷 Français</option>
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
                      {/* Recipient + Send row */}
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
                      {/* Copy + Validate row */}
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <Button onClick={() => { navigator.clipboard.writeText(pitchModal.email); alert("Copié !"); }} bg={c.success} color="#fff" small>📋 Copier l'e-mail</Button>
                        <Button onClick={validateMatch} bg={`linear-gradient(90deg, ${c.accent}, ${c.accent2})`} color="#fff" small>Valider & Enregistrer l'Accord 🤝</Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* SECTION ACCORDS VALIDES ET SIGNES */}
      <div className="glass-panel" style={{ marginTop: 40, background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, boxShadow: `0 8px 32px rgba(0,0,0,0.15)`, backdropFilter: "blur(10px)" }}>
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
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700 }}>Nicchia</th>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700 }}>Statuto</th>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700 }}>Data & Ora</th>
                  <th style={{ padding: "12px 10px", color: c.textMuted, fontWeight: 700, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {validatedMatches.map(m => (
                  <tr key={m.id} style={{ borderBottom: `1px solid ${c.border}`, transition: "background 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.01)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding: "14px 10px", fontWeight: "bold" }}>{m.brand.name}</td>
                    <td style={{ padding: "14px 10px", color: c.success, fontWeight: 600 }}>@{m.influencer.username}</td>
                    <td style={{ padding: "14px 10px" }}><span style={{ background: c.accentSoft, color: c.accent, fontSize: 10.5, padding: "3px 8px", borderRadius: 6, fontWeight: "bold", textTransform: "uppercase" }}>{m.brand.niche}</span></td>
                    <td style={{ padding: "14px 10px" }}><span style={{ fontSize: 11.5, color: m.relationship === "signed" ? c.success : c.warning, background: m.relationship === "signed" ? c.successSoft : c.warningBg, padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>{m.relationship === "signed" ? "Signed Talent 📝" : "Outreach ✉️"}</span></td>
                    <td style={{ padding: "14px 10px", color: c.textMuted, fontFamily: mono }}>{new Date(m.validatedAt).toLocaleString(uiLang === 'fr' ? 'fr-FR' : (uiLang === 'it' ? 'it-IT' : 'en-US'))}</td>
                    <td style={{ padding: "14px 10px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <Button onClick={() => {
                          setPitchModal({
                            isOpen: true,
                            mode: "view_saved",
                            source: m.brand,
                            target: m.influencer,
                            relationship: m.relationship,
                            pitchLang: m.pitchLang,
                            email: m.email,
                            loading: false
                          });
                        }} bg={c.accent} color="#fff" small>🔍 Lire</Button>
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
    </div>
  );
}
