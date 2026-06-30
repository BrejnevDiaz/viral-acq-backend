import React, { useState } from 'react';

export default function BrandPortalTab({ c, uiLang }) {
  const [formData, setFormData] = useState({
    brandName: '',
    website: '',
    niche: '',
    budget: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.brandName || !formData.message) return;
    setStatus('submitting');
    
    // Simulate API call for now (or integrate with a real backend endpoint if one existed)
    setTimeout(() => {
      setStatus('success');
      setFormData({ brandName: '', website: '', niche: '', budget: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const t = {
    fr: {
      title: "Portail Marques & Collaborations",
      desc: "Vous êtes une marque et souhaitez développer votre croissance via l'influence marketing ? Confiez-nous votre campagne, nous nous occupons de tout : casting, contractualisation, brief, et reporting de ROI.",
      formTitle: "Demande de Collaboration",
      brandName: "Nom de la Marque *",
      website: "Site Web (ex: bleame.com)",
      niche: "Niche (Beauté, Tech, Food...)",
      budget: "Budget estimé pour la campagne",
      message: "Décrivez vos objectifs (UGC, Notoriété, Conversion) *",
      submit: "Envoyer la demande à l'Agence",
      success: "✅ Demande envoyée avec succès ! Notre équipe (Brejnev Diaz) vous contactera sous 24h.",
      submitting: "Envoi en cours..."
    },
    en: {
      title: "Brand & Collaboration Portal",
      desc: "Are you a brand looking to scale through influencer marketing? Entrust us with your campaign, we handle everything: casting, contracting, briefing, and ROI reporting.",
      formTitle: "Collaboration Request",
      brandName: "Brand Name *",
      website: "Website (e.g., bleame.com)",
      niche: "Niche (Beauty, Tech, Food...)",
      budget: "Estimated Campaign Budget",
      message: "Describe your goals (UGC, Brand Awareness, Conversion) *",
      submit: "Send Request to Agency",
      success: "✅ Request sent successfully! Our team (Brejnev Diaz) will contact you within 24h.",
      submitting: "Sending..."
    },
    it: {
      title: "Portale Brand & Collaborazioni",
      desc: "Sei un brand che desidera scalare tramite l'influencer marketing? Affidaci la tua campagna, pensiamo a tutto noi: casting, contratti, brief e reportistica ROI.",
      formTitle: "Richiesta di Collaborazione",
      brandName: "Nome del Brand *",
      website: "Sito Web (es: bleame.com)",
      niche: "Nicchia (Beauty, Tech, Food...)",
      budget: "Budget stimato per la campagna",
      message: "Descrivi i tuoi obiettivi (UGC, Notorietà, Conversione) *",
      submit: "Invia richiesta all'Agenzia",
      success: "✅ Richiesta inviata con successo! Il nostro team (Brejnev Diaz) ti contatterà entro 24 ore.",
      submitting: "Invio in corso..."
    }
  }[uiLang] || {
    // default to French if somehow missing
    title: "Portail Marques & Collaborations",
    desc: "Vous êtes une marque et souhaitez développer votre croissance via l'influence marketing ? Confiez-nous votre campagne.",
    formTitle: "Demande de Collaboration",
    brandName: "Nom de la Marque *",
    website: "Site Web",
    niche: "Niche",
    budget: "Budget estimé",
    message: "Décrivez vos objectifs *",
    submit: "Envoyer",
    success: "✅ Demande envoyée avec succès !",
    submitting: "Envoi en cours..."
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: c.text, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
          🏢 {t.title}
        </h2>
        <p style={{ color: c.textMuted, margin: "0 auto", fontSize: 15, lineHeight: 1.6, maxWidth: 650 }}>
          {t.desc}
        </p>
      </div>

      <div style={{
        background: c.card, border: `1px solid ${c.border}`, borderRadius: 16,
        padding: "32px", boxShadow: `0 8px 32px rgba(0,0,0,0.1)`, position: "relative", overflow: "hidden"
      }}>
        {/* Glow effect */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 250, height: 250, background: `radial-gradient(circle, ${c.accent}33 0%, transparent 70%)`, pointerEvents: "none" }}></div>

        <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          ✨ {t.formTitle}
        </h3>

        {status === 'success' ? (
          <div style={{ background: c.successSoft, border: `1.5px solid ${c.success}`, borderRadius: 12, padding: "20px", textAlign: "center", animation: "fadeInUp 0.3s" }}>
            <span style={{ fontSize: 40, display: "block", marginBottom: 10 }}>🎉</span>
            <div style={{ color: c.success, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t.success}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 6, textTransform: "uppercase" }}>{t.brandName}</label>
                <input 
                  required
                  type="text" 
                  value={formData.brandName} 
                  onChange={e => setFormData({...formData, brandName: e.target.value})}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", boxSizing: "border-box" }} 
                />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 6, textTransform: "uppercase" }}>{t.website}</label>
                <input 
                  type="text" 
                  value={formData.website} 
                  onChange={e => setFormData({...formData, website: e.target.value})}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", boxSizing: "border-box" }} 
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 6, textTransform: "uppercase" }}>{t.niche}</label>
                <input 
                  type="text" 
                  value={formData.niche} 
                  onChange={e => setFormData({...formData, niche: e.target.value})}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", boxSizing: "border-box" }} 
                />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 6, textTransform: "uppercase" }}>{t.budget}</label>
                <select 
                  value={formData.budget} 
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", boxSizing: "border-box" }}
                >
                  <option value="">Sélectionnez...</option>
                  <option value="<1000">&lt; 1,000 €</option>
                  <option value="1000-5000">1,000 € - 5,000 €</option>
                  <option value="5000-10000">5,000 € - 10,000 €</option>
                  <option value=">10000">&gt; 10,000 €</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: c.textMuted, marginBottom: 6, textTransform: "uppercase" }}>{t.message}</label>
              <textarea 
                required
                rows={5}
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", boxSizing: "border-box", resize: "vertical" }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={status === 'submitting' || !formData.brandName || !formData.message}
              style={{
                width: "100%", padding: "14px", borderRadius: 8, border: "none", 
                background: `linear-gradient(90deg, ${c.accent}, ${c.accent2})`, color: "#fff", 
                fontSize: 15, fontWeight: 800, cursor: (status === 'submitting' || !formData.brandName || !formData.message) ? "not-allowed" : "pointer",
                marginTop: 10, opacity: (status === 'submitting' || !formData.brandName || !formData.message) ? 0.7 : 1
              }}
            >
              {status === 'submitting' ? t.submitting : t.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
