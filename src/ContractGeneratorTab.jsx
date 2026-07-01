import React, { useState, useEffect } from 'react';

const Card = ({ children, c, style = {} }) => (
  <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 24, marginBottom: 16, boxShadow: `0 8px 24px rgba(0,0,0,0.1)`, ...style }}>
    {children}
  </div>
);

const Button = ({ children, onClick, bg, color, disabled, small, style = {} }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: small ? "8px 16px" : "12px 20px",
      borderRadius: 8,
      border: "none",
      background: bg,
      color: color,
      fontSize: small ? 13 : 14,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.2s",
      ...style
    }}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, c, type="text" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`,
      background: c.bg, color: c.text, outline: "none", marginBottom: 12, boxSizing: "border-box"
    }}
  />
);

export default function ContractGeneratorTab({ c, mono, uiLang }) {
  const [contracts, setContracts] = useState([]);
  
  const [formData, setFormData] = useState({
    brandName: '',
    brandEmail: '',
    influencerName: '',
    influencerEmail: '',
    influencerHandle: '',
    niche: '',
    remuneration: '',
    livrables: '2x Vidéos UGC (15-60s)\n1x Story Instagram (Swipe-up)',
    durationMonths: 3,
    exclusivity: true
  });
  
  const [previewContract, setPreviewContract] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("contract_generator_db");
    if (saved) {
      try {
        setContracts(JSON.parse(saved));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contract_generator_db", JSON.stringify(contracts));
  }, [contracts]);

  const handleGenerate = () => {
    if (!formData.brandName || !formData.influencerHandle || !formData.remuneration) return;
    setGenerating(true);
    
    setTimeout(() => {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setMonth(endDate.getMonth() + parseInt(formData.durationMonths || 3));
      
      const contractText = `CONTRAT DE PRESTATION DE SERVICES ET CESSION DE DROITS D'AUTEUR (UGC)
Réf: C-${Math.random().toString(36).substring(2,10).toUpperCase()}

ENTRE LES SOUSSIGNÉS :

1. La société ${formData.brandName}, dûment représentée,
E-mail : ${formData.brandEmail || 'contact@marque.com'}
Ci-après dénommée "La Marque",

ET

2. Le Créateur de Contenu ${formData.influencerName || '@'+formData.influencerHandle},
Compte : @${formData.influencerHandle}
E-mail : ${formData.influencerEmail || 'contact@createur.com'}
Ci-après dénommé(e) "Le Créateur",

INTERMÉDIÉ PAR :

3. VIRAL ACQUISITION AGENCY, agence de marketing d'influence,
Ci-après dénommée "L'Agence" (représentée par Brejnev Diaz).

Date d'effet : ${today.toLocaleDateString('fr-FR')}
Date de fin  : ${endDate.toLocaleDateString('fr-FR')}

IL A ÉTÉ PRÉALABLEMENT EXPOSÉ CE QUI SUIT :
La Marque, opérant dans le secteur de "${formData.niche || 'Général'}", souhaite promouvoir ses produits et services à travers la création de Contenus Générés par les Utilisateurs (UGC). 

CECI EXPOSÉ, IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 : OBJET DU CONTRAT
Le présent contrat a pour objet de définir les conditions dans lesquelles le Créateur s'engage à concevoir, réaliser et livrer des contenus numériques.

ARTICLE 2 : DESCRIPTION DES LIVRABLES
Le Créateur s'engage à livrer à l'Agence, aux fins de validation par la Marque, les éléments suivants :
${formData.livrables}
Le Créateur dispose d'une totale liberté éditoriale, sous réserve de respecter le brief créatif.

ARTICLE 3 : RÉMUNÉRATION ET MODALITÉS DE PAIEMENT
En contrepartie, le Créateur percevra :
- Un paiement forfaitaire de ${formData.remuneration} EUR (Hors Taxes).
Le paiement sera effectué par virement bancaire sous trente (30) jours francs à compter de la validation.

${formData.exclusivity ? `ARTICLE 4 : OBLIGATION D'EXCLUSIVITÉ
Le Créateur s'engage, pendant toute la durée d'exécution du présent contrat, à ne pas collaborer avec des marques directement concurrentes de ${formData.brandName}.` : ''}

ARTICLE 5 : CESSION DES DROITS (WHITELISTING)
Le Créateur cède à la Marque, pour le monde entier et pour une durée de 90 jours :
- Le droit d'exploitation à des fins de publicité payante (Social Ads / Whitelisting) via les comptes de la Marque ou du Créateur.

ARTICLE 6 : CONFIDENTIALITÉ & JURIDICTION
Les Parties s'engagent à conserver strictement confidentielles toutes les informations échangées. Ce contrat est soumis au droit français.

LES PARTIES ACCEPTENT LES TERMES :

Pour la Marque : ${formData.brandName}
Signature : [EN ATTENTE]

Pour le Créateur : @${formData.influencerHandle}
Signature : [EN ATTENTE]

Pour l'Agence : Viral Acquisition
Signature : Brejnev Diaz (Signé)
`;
      
      const newContract = {
        id: `CG_${Date.now()}`,
        brandName: formData.brandName,
        influencerHandle: formData.influencerHandle,
        content: contractText,
        status: 'draft', // draft | sent | signed_brand | signed_both
        createdAt: new Date().toISOString()
      };
      
      setPreviewContract(newContract);
      setGenerating(false);
    }, 1200);
  };

  const saveAndSend = () => {
    if (!previewContract) return;
    const ct = { ...previewContract, status: 'sent' };
    setContracts(prev => [ct, ...prev]);
    setPreviewContract(null);
    setFormData({
      brandName: '', brandEmail: '', influencerName: '', influencerEmail: '',
      influencerHandle: '', niche: '', remuneration: '',
      livrables: '2x Vidéos UGC (15-60s)\\n1x Story Instagram (Swipe-up)', durationMonths: 3, exclusivity: true
    });
    alert("✅ Contrat enregistré et 'envoyé' (simulé) pour signature électronique !");
  };

  const simulateSignature = (id, targetStatus) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: targetStatus } : c));
  };
  
  const deleteContract = (id) => {
    if(window.confirm("Supprimer ce contrat ?")) {
      setContracts(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, color: c.text, margin: "0 0 8px 0" }}>⚖️ Générateur de Contrats</h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14 }}>
          Générez des contrats juridiques précis (UGC, Whitelisting, Exclusivité) et gérez les signatures électroniques.
        </p>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* FORMULAIRE DE CRÉATION */}
        <div style={{ flex: "1 1 450px", minWidth: 0 }}>
          <Card c={c} style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: `radial-gradient(circle, ${c.accent}15 0%, transparent 70%)`, pointerEvents: "none" }}></div>
            <h3 style={{ fontSize: 16, color: c.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>📝 Nouveau Contrat</h3>
            
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><Input placeholder="Nom Marque *" value={formData.brandName} onChange={e=>setFormData({...formData, brandName: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="E-mail Marque" type="email" value={formData.brandEmail} onChange={e=>setFormData({...formData, brandEmail: e.target.value})} c={c} /></div>
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><Input placeholder="Pseudo Créateur (sans @) *" value={formData.influencerHandle} onChange={e=>setFormData({...formData, influencerHandle: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="Nom Complet (Optionnel)" value={formData.influencerName} onChange={e=>setFormData({...formData, influencerName: e.target.value})} c={c} /></div>
            </div>
            
            <Input placeholder="E-mail Créateur" type="email" value={formData.influencerEmail} onChange={e=>setFormData({...formData, influencerEmail: e.target.value})} c={c} />
            
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><Input placeholder="Niche (ex: Beauté)" value={formData.niche} onChange={e=>setFormData({...formData, niche: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="Rémunération (€) *" type="number" value={formData.remuneration} onChange={e=>setFormData({...formData, remuneration: e.target.value})} c={c} /></div>
            </div>

            <label style={{ fontSize: 12, color: c.textMuted, marginBottom: 4, display: "block" }}>Livrables attendus</label>
            <textarea 
              rows={3} 
              value={formData.livrables}
              onChange={e=>setFormData({...formData, livrables: e.target.value})}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", marginBottom: 12, resize: "vertical" }}
            />

            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: c.text, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={formData.exclusivity} onChange={e=>setFormData({...formData, exclusivity: e.target.checked})} />
                Clause d'exclusivité (anti-concurrence)
              </label>
            </div>

            <Button onClick={handleGenerate} bg={`linear-gradient(90deg, ${c.accent}, ${c.accent2})`} color="#fff" disabled={generating || !formData.brandName || !formData.influencerHandle || !formData.remuneration} style={{ width: "100%" }}>
              {generating ? "⏳ Génération IA..." : "✨ Générer le Contrat"}
            </Button>
          </Card>
        </div>

        {/* COLONNE GESTION DES CONTRATS */}
        <div style={{ flex: "1 1 500px", minWidth: 0 }}>
          <h3 style={{ fontSize: 16, color: c.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>🗂️ Contrats Actifs ({contracts.length})</h3>
          
          {contracts.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", border: `1px dashed ${c.border}`, borderRadius: 12, color: c.textMuted, fontSize: 13 }}>
              Aucun contrat généré. Utilisez le formulaire pour en créer un.
            </div>
          )}

          {contracts.map(ct => (
            <div key={ct.id} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, marginBottom: 12, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: "bold", color: c.text, display: "flex", alignItems: "center", gap: 6 }}>
                    {ct.brandName} 🤝 @{ct.influencerHandle}
                  </div>
                  <div style={{ fontSize: 11, color: c.textMuted, marginTop: 4, fontFamily: mono }}>Réf: {ct.id} • {new Date(ct.createdAt).toLocaleDateString()}</div>
                </div>
                <button onClick={() => deleteContract(ct.id)} style={{ background: "none", border: "none", color: c.error, cursor: "pointer", fontSize: 18 }}>✖</button>
              </div>

              {/* Status Timeline */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: "bold", background: c.bg, padding: "8px 12px", borderRadius: 8 }}>
                <span style={{ color: ct.status === 'sent' || ct.status === 'signed_brand' || ct.status === 'signed_both' ? c.success : c.textMuted }}>✉️ Envoyé</span>
                <span style={{ color: c.textDim }}>→</span>
                <span style={{ color: ct.status === 'signed_brand' || ct.status === 'signed_both' ? c.success : c.textMuted }}>✒️ Signé Marque</span>
                <span style={{ color: c.textDim }}>→</span>
                <span style={{ color: ct.status === 'signed_both' ? c.success : c.textMuted }}>✒️ Signé Talent</span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {ct.status === 'sent' && (
                  <Button onClick={() => simulateSignature(ct.id, 'signed_brand')} bg={c.bg} color={c.text} small style={{ border: `1px solid ${c.border}`, flex: 1 }}>Simuler Signature Marque</Button>
                )}
                {ct.status === 'signed_brand' && (
                  <Button onClick={() => simulateSignature(ct.id, 'signed_both')} bg={c.bg} color={c.text} small style={{ border: `1px solid ${c.border}`, flex: 1 }}>Simuler Signature Talent</Button>
                )}
                <Button onClick={() => {
                  setPreviewContract(ct);
                }} bg={c.accentSoft} color={c.accent} small>Voir Détails</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PREVIEW CONTRAT */}
      {previewContract && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 30, width: "100%", maxWidth: 700, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, color: c.text }}>📄 Aperçu du Contrat</h2>
              <button onClick={() => setPreviewContract(null)} style={{ background: "none", border: "none", color: c.textMuted, cursor: "pointer", fontSize: 20 }}>✖</button>
            </div>
            
            <textarea
              readOnly={previewContract.status && previewContract.status !== 'draft'}
              value={previewContract.content}
              onChange={e => setPreviewContract({...previewContract, content: e.target.value})}
              style={{
                width: "100%", flex: 1, minHeight: 400, fontSize: 13.5, color: c.text,
                background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: 16,
                fontFamily: mono, lineHeight: 1.6, outline: "none", resize: "none"
              }}
            />
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
              <Button onClick={() => setPreviewContract(null)} bg={c.bg} color={c.text} style={{ border: `1px solid ${c.border}` }}>Fermer</Button>
              {(!previewContract.status || previewContract.status === 'draft') && (
                <Button onClick={saveAndSend} bg={`linear-gradient(90deg, ${c.accent}, ${c.accent2})`} color="#fff">
                  ✅ Valider & Envoyer pour Signature (E-mail)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
