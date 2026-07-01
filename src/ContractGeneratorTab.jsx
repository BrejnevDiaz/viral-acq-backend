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

export default function ContractGeneratorTab({ c, mono, uiLang }) {
  const [contracts, setContracts] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all | validated | pending
  
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
    exclusivity: true,
    contractLanguage: 'fr'
  });
  
  
  const syncToRoster = (inf) => {
    try {
      const saved = localStorage.getItem("agency_talents_v2");
      let roster = saved ? JSON.parse(saved) : [];
      const cleanUsername = (inf.username || inf.influencerHandle || "").replace("@", "").trim();
      if (!cleanUsername) return;
      if (roster.find(t => t.username === cleanUsername)) return;
      
      const newTalent = {
        id: `t_user_${Date.now()}_auto`,
        username: cleanUsername,
        niche: inf.niche || "General",
        followers: parseInt(inf.followers) || 15000,
        engagement: inf.engagement || "5.0%",
        platform: inf.platform || "instagram",
        avatar: "https://ui-avatars.com/api/?name=" + cleanUsername + "&background=8B5CF6&color=fff",
        status: "active",
        email: inf.email || inf.influencerEmail || "contact@" + cleanUsername + ".com",
        profileUrl: inf.profileUrl || `https://instagram.com/${cleanUsername}`
      };
      roster.unshift(newTalent);
      localStorage.setItem("agency_talents_v2", JSON.stringify(roster));
    } catch(e) {}
  };

  const [previewContract, setPreviewContract] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

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
      
      const ref = `C-${Math.random().toString(36).substring(2,10).toUpperCase()}`;
      let contractText = "";

      if (formData.contractLanguage === 'en') {
        contractText = `SERVICE PROVISION AND COPYRIGHT ASSIGNMENT CONTRACT (UGC)
Ref: ${ref}

BETWEEN THE UNDERSIGNED:

1. The company ${formData.brandName}, duly represented,
Email: ${formData.brandEmail || 'contact@brand.com'}
Hereinafter referred to as "The Brand",

AND

2. The Content Creator ${formData.influencerName || '@'+formData.influencerHandle},
Account: @${formData.influencerHandle}
Email: ${formData.influencerEmail || 'contact@creator.com'}
Hereinafter referred to as "The Creator",

INTERMEDIATED BY:

3. VIRAL ACQUISITION AGENCY, influencer marketing agency,
Hereinafter referred to as "The Agency" (represented by Brejnev Diaz).

Effective Date: ${today.toLocaleDateString('en-US')}
End Date: ${endDate.toLocaleDateString('en-US')}

PREAMBLE:
The Brand, operating in the "${formData.niche || 'General'}" sector, wishes to promote its products and services through User Generated Content (UGC).

IT HAS BEEN AGREED AS FOLLOWS:

ARTICLE 1: OBJECT OF THE CONTRACT
The purpose of this contract is to define the conditions under which the Creator undertakes to design, produce, and deliver digital content.

ARTICLE 2: DESCRIPTION OF DELIVERABLES
The Creator undertakes to deliver to the Agency, for validation by the Brand, the following elements:
${formData.livrables}
The Creator has complete editorial freedom, subject to respecting the creative brief.

ARTICLE 3: REMUNERATION AND PAYMENT TERMS
In return, the Creator will receive:
- A flat fee of ${formData.remuneration} EUR (Excluding Taxes).
Payment will be made by bank transfer within thirty (30) clear days from validation.

${formData.exclusivity ? `ARTICLE 4: EXCLUSIVITY OBLIGATION
The Creator undertakes, for the entire duration of this contract, not to collaborate with direct competitors of ${formData.brandName}.` : ''}

ARTICLE 5: ASSIGNMENT OF RIGHTS (WHITELISTING)
The Creator assigns to the Brand, worldwide and for a period of 90 days:
- The right of exploitation for paid advertising purposes (Social Ads / Whitelisting) via the Brand's or Creator's accounts.

ARTICLE 6: CONFIDENTIALITY & JURISDICTION
The Parties undertake to keep strictly confidential all exchanged information. This contract is exclusively subject to Italian Jurisdiction (Diritto Italiano).

THE PARTIES ACCEPT THE TERMS:

For the Brand: ${formData.brandName}
Signature: [PENDING]

For the Creator: @${formData.influencerHandle}
Signature: [PENDING]

For the Agency: Viral Acquisition
Signature: Brejnev Diaz (Signed)`;
      } else if (formData.contractLanguage === 'it') {
        contractText = `CONTRATTO DI PRESTAZIONE DI SERVIZI E CESSIONE DEI DIRITTI D'AUTORE (UGC)
Rif: ${ref}

TRA I SOTTOSCRITTI:

1. La società ${formData.brandName}, debitamente rappresentata,
E-mail: ${formData.brandEmail || 'contact@brand.com'}
Di seguito denominata "Il Brand",

E

2. Il Content Creator ${formData.influencerName || '@'+formData.influencerHandle},
Account: @${formData.influencerHandle}
E-mail: ${formData.influencerEmail || 'contact@creator.com'}
Di seguito denominato "Il Creator",

INTERMEDIATO DA:

3. VIRAL ACQUISITION AGENCY, agenzia di influencer marketing,
Di seguito denominata "L'Agenzia" (rappresentata da Brejnev Diaz).

Data di inizio: ${today.toLocaleDateString('it-IT')}
Data di fine: ${endDate.toLocaleDateString('it-IT')}

PREMESSO CHE:
Il Brand, operante nel settore "${formData.niche || 'Generale'}", desidera promuovere i propri prodotti e servizi attraverso la creazione di User Generated Content (UGC).

SI CONVIENE E STIPULA QUANTO SEGUE:

ARTICOLO 1: OGGETTO DEL CONTRATTO
Il presente contratto ha per oggetto la definizione delle condizioni alle quali il Creator si impegna a ideare, realizzare e consegnare contenuti digitali.

ARTICOLO 2: DESCRIZIONE DEI DELIVERABLE
Il Creator si impegna a consegnare all'Agenzia, per l'approvazione del Brand, i seguenti elementi:
${formData.livrables}
Il Creator gode di totale libertà editoriale, a condizione di rispettare il brief creativo.

ARTICOLO 3: COMPENSO E MODALITÀ DI PAGAMENTO
In cambio, il Creator riceverà:
- Un compenso forfettario di ${formData.remuneration} EUR (Escluse Imposte).
Il pagamento sarà effettuato tramite bonifico bancario entro trenta (30) giorni solari dalla validazione.

${formData.exclusivity ? `ARTICOLO 4: OBBLIGO DI ESCLUSIVA
Il Creator si impegna, per tutta la durata del presente contratto, a non collaborare con concorrenti diretti di ${formData.brandName}.` : ''}

ARTICOLO 5: CESSIONE DEI DIRITTI (WHITELISTING)
Il Creator cede al Brand, per tutto il mondo e per un periodo di 90 giorni:
- Il diritto di sfruttamento per finalità di pubblicità a pagamento (Social Ads / Whitelisting) tramite gli account del Brand o del Creator.

ARTICOLO 6: RISERVATEZZA E FORO COMPETENTE
Le Parti si impegnano a mantenere strettamente riservate tutte le informazioni scambiate. Il presente contratto è soggetto esclusivamente alla Giurisdizione Italiana (Diritto Italiano).

LE PARTI ACCETTANO I TERMINI:

Per il Brand: ${formData.brandName}
Firma: [IN ATTESA]

Per il Creator: @${formData.influencerHandle}
Firma: [IN ATTESA]

Per l'Agenzia: Viral Acquisition
Firma: Brejnev Diaz (Firmato)`;
      } else {
        contractText = `CONTRAT DE PRESTATION DE SERVICES ET CESSION DE DROITS D'AUTEUR (UGC)
Réf: ${ref}

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
Les Parties s'engagent à conserver strictement confidentielles toutes les informations échangées. Ce contrat est soumis exclusivement à la juridiction italienne (Diritto Italiano).

LES PARTIES ACCEPTENT LES TERMES :

Pour la Marque : ${formData.brandName}
Signature : [EN ATTENTE]

Pour le Créateur : @${formData.influencerHandle}
Signature : [EN ATTENTE]

Pour l'Agence : Viral Acquisition
Signature : Brejnev Diaz (Signé)
`;
      }
      
      const newContract = {
        id: `CG_${Date.now()}`,
        brandName: formData.brandName,
        influencerHandle: formData.influencerHandle,
        content: contractText,
        status: 'draft', // draft | sent | signed_brand | signed_both
        createdAt: new Date().toISOString(),
        brandEmail: formData.brandEmail,
        influencerEmail: formData.influencerEmail
      };
      
      setPreviewContract(newContract);
      setGenerating(false);
    }, 1200);
  };

  
  const downloadContractPdf = (contract) => {
    const doc = new jsPDF();
    
    // Agency Colors
    const primaryColor = [139, 92, 246]; // #8B5CF6 (Purple)
    const accentColor = [236, 72, 153]; // #EC4899 (Pink)
    const textColor = [40, 40, 40];
    const lightText = [120, 120, 120];

    const drawHeaderFooter = (pageNumber) => {
      // Header Background
      doc.setFillColor(15, 10, 25); // Dark header
      doc.rect(0, 0, 210, 35, 'F');
      
      // Gradient line under header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 35, 105, 2, 'F');
      doc.setFillColor(...accentColor);
      doc.rect(105, 35, 105, 2, 'F');

      // Agency Name / Logo Text
      doc.setFillColor(...primaryColor);
      doc.rect(15, 12, 10, 10, 'F');
      doc.setFillColor(...accentColor);
      doc.circle(28, 17, 5, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("VIRAL ACQUISITION", 38, 20);
      
      // "PRO SUITE" badge
      doc.setFillColor(...accentColor);
      doc.rect(125, 14, 28, 8, 'F');
      doc.setFontSize(8);
      doc.text("PRO SUITE", 128, 20);

      // Document Type
      doc.setTextColor(200, 200, 200);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("CONTRAT OFFICIEL", 160, 22);

      // Footer
      doc.setFillColor(245, 245, 245);
      doc.rect(0, 280, 210, 17, 'F');
      doc.setTextColor(...lightText);
      doc.setFontSize(8);
      doc.text("Viral Acquisition Agency - Document généré et sécurisé par IA", 15, 289);
      doc.text(`Page ${pageNumber}`, 185, 289);
    };

    let pageNum = 1;
    drawHeaderFooter(pageNum);

    doc.setTextColor(...textColor);
    
    // Split the raw content into lines
    const rawLines = doc.splitTextToSize(contract.content, 170);
    
    let y = 50;

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i];
      let isTitle = false;
      
      // Heuristic: If line is ALL CAPS and length > 4 and doesn't just contain spaces
      const trimmed = line.trim();
      if (trimmed.length > 4 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
        isTitle = true;
      }

      if (y > 270) {
        doc.addPage();
        pageNum++;
        drawHeaderFooter(pageNum);
        y = 50;
      }

      if (isTitle) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...primaryColor);
        doc.text(line, 15, y);
        y += 7; // More spacing after title
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...textColor);
        doc.text(line, 15, y);
        y += 5; // Standard line height
      }
    }

    doc.save(`Contrat_${contract.brandName || 'Brand'}_vs_${contract.influencerHandle || 'Talent'}.pdf`);
  };

  const translatePreviewContract = (lang) => {
    if (!previewContract) return;
    let content = previewContract.content;
    
    // Quick and dirty translation logic for the static template parts
    if (lang === 'en') {
      content = content.replace("CONTRAT DE PRESTATION DE SERVICES ET CESSION DE DROITS D'AUTEUR (UGC)", "SERVICE PROVISION AND COPYRIGHT ASSIGNMENT CONTRACT (UGC)");
      content = content.replace("ENTRE LES SOUSSIGNÉS :", "BETWEEN THE UNDERSIGNED :");
      content = content.replace("La société", "The company");
      content = content.replace("dûment représentée,", "duly represented,");
      content = content.replace("Ci-après dénommée \"La Marque\",", "Hereinafter referred to as \"The Brand\",");
      content = content.replace("Le Créateur de Contenu", "The Content Creator");
      content = content.replace("Compte :", "Account :");
      content = content.replace("Ci-après dénommé(e) \"Le Créateur\",", "Hereinafter referred to as \"The Creator\",");
      content = content.replace("INTERMÉDIÉ PAR :", "INTERMEDIATED BY :");
      content = content.replace("L'agence Viral Acquisition", "The agency Viral Acquisition");
      content = content.replace("IL A ÉTÉ CONVENU CE QUI SUIT :", "IT HAS BEEN AGREED AS FOLLOWS :");
      content = content.replace("Article 1 - Objet du Contrat", "Article 1 - Object of the Contract");
      content = content.replace("Le Créateur s'engage à créer et livrer les contenus suivants :", "The Creator agrees to create and deliver the following contents :");
      content = content.replace("Article 2 - Rémunération", "Article 2 - Remuneration");
      content = content.replace("En contrepartie, La Marque versera au Créateur la somme de", "In return, The Brand will pay the Creator the sum of");
      content = content.replace("net.", "net.");
      content = content.replace("Article 3 - Cession des Droits", "Article 3 - Assignment of Rights");
      content = content.replace("Le Créateur cède à La Marque l'ensemble des droits d'exploitation", "The Creator assigns to The Brand all exploitation rights");
      content = content.replace("pour une durée de", "for a duration of");
      content = content.replace("mois.", "months.");
      content = content.replace("Article 4 - Exclusivité", "Article 4 - Exclusivity");
      content = content.replace("Le Créateur s'interdit de collaborer avec une marque concurrente", "The Creator refrains from collaborating with a competing brand");
      content = content.replace("dans la même niche pendant la durée de la cession.", "in the same niche during the term of the assignment.");
      content = content.replace("Fait pour valoir ce que de droit.", "Done to serve and avail as of right.");
    } else if (lang === 'it') {
      content = content.replace("CONTRAT DE PRESTATION DE SERVICES ET CESSION DE DROITS D'AUTEUR (UGC)", "CONTRATTO DI PRESTAZIONE DI SERVIZI E CESSIONE DI DIRITTI D'AUTORE (UGC)");
      content = content.replace("ENTRE LES SOUSSIGNÉS :", "TRA I SOTTOSCRITTI :");
      content = content.replace("La société", "La società");
      content = content.replace("dûment représentée,", "debitamente rappresentata,");
      content = content.replace("Ci-après dénommée \"La Marque\",", "Di seguito denominata \"Il Brand\",");
      content = content.replace("Le Créateur de Contenu", "Il Creatore di Contenuti");
      content = content.replace("Compte :", "Account :");
      content = content.replace("Ci-après dénommé(e) \"Le Créateur\",", "Di seguito denominato \"Il Creatore\",");
      content = content.replace("INTERMÉDIÉ PAR :", "INTERMEDIATO DA :");
      content = content.replace("L'agence Viral Acquisition", "L'agenzia Viral Acquisition");
      content = content.replace("IL A ÉTÉ CONVENU CE QUI SUIT :", "È STATO CONVENUTO QUANTO SEGUE :");
      content = content.replace("Article 1 - Objet du Contrat", "Articolo 1 - Oggetto del Contratto");
      content = content.replace("Le Créateur s'engage à créer et livrer les contenus suivants :", "Il Creatore si impegna a creare e consegnare i seguenti contenuti :");
      content = content.replace("Article 2 - Rémunération", "Articolo 2 - Remunerazione");
      content = content.replace("En contrepartie, La Marque versera au Créateur la somme de", "In cambio, Il Brand pagherà al Creatore la somma di");
      content = content.replace("net.", "netti.");
      content = content.replace("Article 3 - Cession des Droits", "Articolo 3 - Cessione dei Diritti");
      content = content.replace("Le Créateur cède à La Marque l'ensemble des droits d'exploitation", "Il Creatore cede al Brand tutti i diritti di sfruttamento");
      content = content.replace("pour une durée de", "per una durata di");
      content = content.replace("mois.", "mesi.");
      content = content.replace("Article 4 - Exclusivité", "Articolo 4 - Esclusiva");
      content = content.replace("Le Créateur s'interdit de collaborer avec une marque concurrente", "Il Creatore si impegna a non collaborare con un marchio concorrente");
      content = content.replace("dans la même niche pendant la durée de la cession.", "nella stessa nicchia durante la durata della cessione.");
      content = content.replace("Fait pour valoir ce que de droit.", "Fatto per valere a tutti gli effetti di legge.");
    }
    
    setPreviewContract({ ...previewContract, content });
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

      const ct = { ...previewContract, status: 'sent' };
      setContracts(prev => [ct, ...prev]);
      setPreviewContract(null);
      setFormData({
        brandName: '', brandEmail: '', influencerName: '', influencerEmail: '',
        influencerHandle: '', niche: '', remuneration: '',
        livrables: '2x Vidéos UGC (15-60s)\n1x Story Instagram (Swipe-up)', durationMonths: 3, exclusivity: true, contractLanguage: 'fr'
      });
      alert("✅ Contrat enregistré et envoyé avec succès par e-mail aux deux parties !");
    } catch (e) {
      alert("❌ Une erreur est survenue lors de l'envoi des e-mails. Avez-vous configuré GMAIL_USER sur le backend ?");
      console.error(e);
    } finally {
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
                <Button onClick={() => downloadContractPdf(ct)} bg={c.bg} color={c.text} small style={{ border: `1px solid ${c.border}` }}>📄 .pdf</Button>
                <Button onClick={() => downloadContract(ct)} bg={c.bg} color={c.text} small style={{ border: `1px solid ${c.border}` }}>📄 .txt</Button>
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
              <select onChange={(e) => translatePreviewContract(e.target.value)} style={{ background: c.card, color: c.text, border: `1px solid ${c.border}`, borderRadius: 8, padding: "0 12px", outline: "none", fontSize: 13, marginRight: 8 }}>
                    <option value="fr">🇫🇷 FR</option>
                    <option value="en">🇬🇧 EN</option>
                    <option value="it">🇮🇹 IT</option>
                  </select>
                  <Button onClick={() => downloadContractPdf(previewContract)} bg={c.bg} color={c.text} style={{ border: `1px solid ${c.border}` }}>📄 (.pdf)</Button>
                  <Button onClick={() => downloadContract(previewContract)} bg={c.bg} color={c.text} style={{ border: `1px solid ${c.border}` }}>📄 (.txt)</Button>
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
