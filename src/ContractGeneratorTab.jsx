import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

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


export const generateContractText = (formData) => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + parseInt(formData.durationMonths || 3));
  const contractText = generateContractText(formData);
        const newContract = {
        id: `CG_${Date.now()}`,
        brandName: formData.brandName,
        influencerHandle: formData.influencerHandle,
        content: contractText,
        status: 'draft', // draft | sent | signed_brand | signed_both
        createdAt: new Date().toISOString(),
        brandEmail: formData.brandEmail,
          formData: formData,
        influencerEmail: formData.influencerEmail
      };
      
      setPreviewContract(newContract);
      setGenerating(false);
    }, 1200);
  };

  const saveAndSend = async () => {
    if (!previewContract) return;
    
    if (!previewContract.brandEmail || !previewContract.influencerEmail) {
      alert("⚠️ Vous devez renseigner les adresses e-mail de la Marque et du Créateur dans le formulaire avant de pouvoir envoyer le contrat.");
      return;
    }

    setSendingEmail(true);

    try {
      // 1. Send to Brand
      await fetch("https://viral-acq-backend.vercel.app/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: previewContract.brandEmail,
          subject: `Validation Requise : Contrat avec @${previewContract.influencerHandle}`,
          body: `Bonjour ${previewContract.brandName},\n\nVotre contrat de partenariat avec @${previewContract.influencerHandle} a été généré par Viral Acquisition.\n\nVeuillez le consulter et procéder à sa signature électronique.\n\nCordialement,\nL'équipe Viral Acquisition.`,
          brandName: previewContract.brandName
        })
      });

      // 2. Send to Influencer
      await fetch("https://viral-acq-backend.vercel.app/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: previewContract.influencerEmail,
          subject: `Nouveau Contrat UGC : ${previewContract.brandName}`,
          body: `Bonjour @${previewContract.influencerHandle},\n\nUn nouveau contrat a été généré pour votre collaboration avec ${previewContract.brandName}.\n\nVeuillez le consulter et procéder à sa signature.\n\nCordialement,\nViral Acquisition.`,
          brandName: previewContract.brandName
        })
      });

      
    } catch (e) {
      console.error("Mail error (Mock Mode):", e);
    } finally {
      // Mock Success Logic (whether fetch failed or not)
      const ct = { ...previewContract, status: 'sent' };
      syncToRoster({ username: previewContract.influencerHandle, influencerEmail: previewContract.influencerEmail, niche: previewContract.formData?.niche });
      setContracts(prev => [ct, ...prev]);
      setPreviewContract(null);
      setFormData({
        brandName: '', brandEmail: '', influencerName: '', influencerEmail: '',
        influencerHandle: '', niche: '', remuneration: '',
        livrables: '2x Vidéos UGC (15-60s)\n1x Story Instagram (Swipe-up)', durationMonths: 3, exclusivity: true, contractLanguage: 'fr'
      });
      alert("✅ Contrat enregistré et envoyé virtuellement avec succès !");

      setSendingEmail(false);
    }
  };

  const simulateSignature = (id, targetStatus) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: targetStatus } : c));
  };
  
  const deleteContract = (id) => {
    if(window.confirm("Supprimer ce contrat ?")) {
      setContracts(prev => prev.filter(c => c.id !== id));
    }
  };

  
  const downloadContractPdf = (contract) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(contract.content, 180);
    doc.text(splitText, 15, 20);
    doc.save(`Contrat_${contract.brandName}_${contract.influencerHandle}.pdf`);
  };
  
  const handlePreviewLanguageChange = (newLang) => {
    if (!previewContract.formData) {
       alert("Impossible de traduire ce contrat car il a été généré avec une ancienne version de l'application.");
       return; 
    }
    const updatedFormData = { ...previewContract.formData, contractLanguage: newLang };
    const newContent = generateContractText(updatedFormData);
    const updatedContract = { ...previewContract, formData: updatedFormData, content: newContent };
    
    // Update preview
    setPreviewContract(updatedContract);
    
    // Update in history if it exists
    setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
  };

  const downloadContract = (contract) => {
    const blob = new Blob([contract.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Contrat_${contract.brandName}_${contract.influencerHandle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredContracts = contracts.filter(ct => {
    if (activeTab === 'all') return true;
    if (activeTab === 'validated') return ct.status === 'signed_both';
    if (activeTab === 'pending') return ['sent', 'signed_brand'].includes(ct.status);
    return true;
  });

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, color: c.text, margin: "0 0 8px 0" }}>⚖️ Générateur de Contrats Internationaux</h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14 }}>
          Générez des contrats juridiques conformes (Juridiction Italienne), traduisez-les instantanément, et notifiez les signataires par E-mail.
        </p>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* FORMULAIRE DE CRÉATION */}
        <div style={{ flex: "1 1 450px", minWidth: 0 }}>
          <Card c={c} style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: `radial-gradient(circle, ${c.accent}15 0%, transparent 70%)`, pointerEvents: "none" }}></div>
            <h3 style={{ fontSize: 16, color: c.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>📝 Paramètres du Contrat</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: c.textMuted, marginBottom: 6, display: "block" }}>Langue du Contrat</label>
              <select 
                value={formData.contractLanguage} 
                onChange={e=>setFormData({...formData, contractLanguage: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none" }}
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="it">🇮🇹 Italiano</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><Input placeholder="Nom Marque *" value={formData.brandName} onChange={e=>setFormData({...formData, brandName: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="E-mail Marque *" type="email" value={formData.brandEmail} onChange={e=>setFormData({...formData, brandEmail: e.target.value})} c={c} /></div>
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><Input placeholder="Pseudo Créateur (sans @) *" value={formData.influencerHandle} onChange={e=>setFormData({...formData, influencerHandle: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="E-mail Créateur *" type="email" value={formData.influencerEmail} onChange={e=>setFormData({...formData, influencerEmail: e.target.value})} c={c} /></div>
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><Input placeholder="Nom Complet (Optionnel)" value={formData.influencerName} onChange={e=>setFormData({...formData, influencerName: e.target.value})} c={c} /></div>
              <div style={{ flex: 1 }}><Input placeholder="Niche (ex: Beauté)" value={formData.niche} onChange={e=>setFormData({...formData, niche: e.target.value})} c={c} /></div>
            </div>
            
            <Input placeholder="Rémunération (€) *" type="number" value={formData.remuneration} onChange={e=>setFormData({...formData, remuneration: e.target.value})} c={c} />

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

            <Button onClick={handleGenerate} bg={`linear-gradient(90deg, ${c.accent}, ${c.accent2})`} color="#fff" disabled={generating || !formData.brandName || !formData.influencerHandle || !formData.remuneration || !formData.brandEmail || !formData.influencerEmail} style={{ width: "100%" }}>
              {generating ? "⏳ Génération IA..." : "✨ Générer le Contrat"}
            </Button>
          </Card>
        </div>

        {/* COLONNE GESTION DES CONTRATS */}
        <div style={{ flex: "1 1 500px", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, color: c.text, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>🗂️ Historique des Contrats</h3>
            <div style={{ display: "flex", background: c.card, borderRadius: 8, padding: 4, border: `1px solid ${c.border}` }}>
              {[{id: 'all', label: 'Tous'}, {id: 'pending', label: 'En attente'}, {id: 'validated', label: 'Validés'}].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "4px 10px", fontSize: 12, borderRadius: 6, border: "none",
                    background: activeTab === tab.id ? c.accentSoft : "transparent",
                    color: activeTab === tab.id ? c.accent : c.textMuted,
                    cursor: "pointer", fontWeight: activeTab === tab.id ? 700 : 500
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {filteredContracts.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", border: `1px dashed ${c.border}`, borderRadius: 12, color: c.textMuted, fontSize: 13 }}>
              Aucun contrat ne correspond à ce filtre.
            </div>
          )}

          {filteredContracts.map(ct => (
            <div key={ct.id} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, marginBottom: 12, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: "bold", color: c.text, display: "flex", alignItems: "center", gap: 6 }}>
                    {ct.brandName} 🤝 @{ct.influencerHandle}
                  </div>
                  <div style={{ fontSize: 11, color: c.textMuted, marginTop: 4, fontFamily: mono }}>Réf: {ct.id} • {new Date(ct.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {ct.status === 'signed_both' && <span style={{ padding: "4px 8px", background: c.successSoft, color: c.success, borderRadius: 6, fontSize: 11, fontWeight: "bold" }}>✅ Validé</span>}
                  {(ct.status === 'sent' || ct.status === 'signed_brand') && <span style={{ padding: "4px 8px", background: c.warningBg, color: c.warning, borderRadius: 6, fontSize: 11, fontWeight: "bold" }}>⏳ En attente</span>}
                  <button onClick={() => deleteContract(ct.id)} style={{ background: "none", border: "none", color: c.error, cursor: "pointer", fontSize: 16, padding: "4px" }}>✖</button>
                </div>
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
                  <Button onClick={() => simulateSignature(ct.id, 'signed_brand')} bg={c.bg} color={c.text} small style={{ border: `1px solid ${c.border}`, flex: 1 }}>Valider Marque</Button>
                )}
                {ct.status === 'signed_brand' && (
                  <Button onClick={() => simulateSignature(ct.id, 'signed_both')} bg={c.bg} color={c.text} small style={{ border: `1px solid ${c.border}`, flex: 1 }}>Valider Talent</Button>
                )}
                <Button onClick={() => downloadContract(ct)} bg={c.bg} color={c.text} small style={{ border: `1px solid ${c.border}` }}>📥 .txt</Button>
                <Button onClick={() => {
                  setPreviewContract(ct);
                }} bg={c.accentSoft} color={c.accent} small>Détails</Button>
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
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
              
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {previewContract.formData && (
                  <select 
                    value={previewContract.formData.contractLanguage || 'fr'} 
                    onChange={(e) => handlePreviewLanguageChange(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", cursor: "pointer", fontWeight: "bold" }}
                  >
                    <option value="fr">🇫🇷 FR</option>
                    <option value="en">🇬🇧 EN</option>
                    <option value="it">🇮🇹 IT</option>
                  </select>
                )}
                <Button onClick={() => downloadContractPdf(previewContract)} bg={c.bg} color={c.text} style={{ border: `1px solid ${c.border}` }}>📄 (.pdf)</Button>
                <Button onClick={() => downloadContract(previewContract)} bg={c.bg} color={c.text} style={{ border: `1px solid ${c.border}` }}>📄 (.txt)</Button>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Button onClick={() => setPreviewContract(null)} bg={c.bg} color={c.text} style={{ border: `1px solid ${c.border}` }}>Fermer</Button>
                {(!previewContract.status || previewContract.status === 'draft') && (
                  <Button onClick={saveAndSend} disabled={sendingEmail} bg={`linear-gradient(90deg, ${c.accent}, ${c.accent2})`} color="#fff">
                    {sendingEmail ? "Envoi en cours..." : "✅ Valider & Envoyer pour Signature (E-mail)"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
