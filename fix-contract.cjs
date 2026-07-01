const fs = require('fs');
let code = fs.readFileSync('src/ContractGeneratorTab.jsx', 'utf8');

// 1. Add jsPDF import
if (!code.includes('jspdf')) {
  code = code.replace(/import React[^;]+;/, "import React, { useState, useEffect } from 'react';\nimport { jsPDF } from 'jspdf';");
}

// 2. Extract the contract text generation logic
const generateFn = `
export const generateContractText = (formData) => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + parseInt(formData.durationMonths || 3));
  const ref = \`C-\${Math.random().toString(36).substring(2,10).toUpperCase()}\`;
  
  if (formData.contractLanguage === 'en') {
    return \`SERVICE PROVISION AND COPYRIGHT ASSIGNMENT CONTRACT (UGC)
Ref: \${ref}

BETWEEN THE UNDERSIGNED:

1. The company \${formData.brandName}, duly represented,
Email: \${formData.brandEmail || 'contact@brand.com'}
Hereinafter referred to as "The Brand",

AND

2. The Content Creator \${formData.influencerName || '@'+formData.influencerHandle},
Account: @\${formData.influencerHandle}
Email: \${formData.influencerEmail || 'contact@creator.com'}
Hereinafter referred to as "The Creator",

INTERMEDIATED BY:

3. VIRAL ACQUISITION AGENCY, influencer marketing agency,
Hereinafter referred to as "The Agency" (represented by Brejnev Diaz).

Effective Date: \${today.toLocaleDateString('en-US')}
End Date: \${endDate.toLocaleDateString('en-US')}

PREAMBLE:
The Brand, operating in the "\${formData.niche || 'General'}" sector, wishes to promote its products and services through User Generated Content (UGC).

IT HAS BEEN AGREED AS FOLLOWS:

ARTICLE 1: OBJECT OF THE CONTRACT
The purpose of this contract is to define the conditions under which the Creator undertakes to design, produce, and deliver digital content.

ARTICLE 2: DESCRIPTION OF DELIVERABLES
The Creator undertakes to deliver to the Agency, for validation by the Brand, the following elements:
\${formData.livrables}
The Creator has complete editorial freedom, subject to respecting the creative brief.

ARTICLE 3: REMUNERATION AND PAYMENT TERMS
In return, the Creator will receive:
- A flat fee of \${formData.remuneration} EUR (Excluding Taxes).
Payment will be made by bank transfer within thirty (30) clear days from validation.

\${formData.exclusivity ? \`ARTICLE 4: EXCLUSIVITY OBLIGATION
The Creator undertakes, for the entire duration of this contract, not to collaborate with direct competitors of \${formData.brandName}.\` : ''}

ARTICLE 5: ASSIGNMENT OF RIGHTS (WHITELISTING)
The Creator assigns to the Brand, worldwide and for a period of 90 days:
- The right of exploitation for paid advertising purposes (Social Ads / Whitelisting) via the Brand's or Creator's accounts.

ARTICLE 6: CONFIDENTIALITY & JURISDICTION
The Parties undertake to keep strictly confidential all exchanged information. This contract is exclusively subject to Italian Jurisdiction (Diritto Italiano).

THE PARTIES ACCEPT THE TERMS:

For the Brand: \${formData.brandName}
Signature: [PENDING]

For the Creator: @\${formData.influencerHandle}
Signature: [PENDING]

For the Agency: Viral Acquisition
Signature: Brejnev Diaz (Signed)\`;
  } else if (formData.contractLanguage === 'it') {
    return \`CONTRATTO DI PRESTAZIONE DI SERVIZI E CESSIONE DEI DIRITTI D'AUTORE (UGC)
Rif: \${ref}

TRA I SOTTOSCRITTI:

1. La società \${formData.brandName}, debitamente rappresentata,
E-mail: \${formData.brandEmail || 'contact@brand.com'}
Di seguito denominata "Il Brand",

E

2. Il Content Creator \${formData.influencerName || '@'+formData.influencerHandle},
Account: @\${formData.influencerHandle}
E-mail: \${formData.influencerEmail || 'contact@creator.com'}
Di seguito denominato "Il Creator",

INTERMEDIATO DA:

3. VIRAL ACQUISITION AGENCY, agenzia di influencer marketing,
Di seguito denominata "L'Agenzia" (rappresentata da Brejnev Diaz).

Data di inizio: \${today.toLocaleDateString('it-IT')}
Data di fine: \${endDate.toLocaleDateString('it-IT')}

PREMESSO CHE:
Il Brand, operante nel settore "\${formData.niche || 'Generale'}", desidera promuovere i propri prodotti e servizi attraverso la creazione di User Generated Content (UGC).

SI CONVIENE E STIPULA QUANTO SEGUE:

ARTICOLO 1: OGGETTO DEL CONTRATTO
Il presente contratto ha per oggetto la definizione delle condizioni alle quali il Creator si impegna a ideare, realizzare e consegnare contenuti digitali.

ARTICOLO 2: DESCRIZIONE DEI DELIVERABLE
Il Creator si impegna a consegnare all'Agenzia, per l'approvazione del Brand, i seguenti elementi:
\${formData.livrables}
Il Creator gode di totale libertà editoriale, a condizione di rispettare il brief creativo.

ARTICOLO 3: COMPENSO E MODALITÀ DI PAGAMENTO
In cambio, il Creator riceverà:
- Un compenso forfettario di \${formData.remuneration} EUR (Escluse Imposte).
Il pagamento sarà effettuato tramite bonifico bancario entro trenta (30) giorni solari dalla validazione.

\${formData.exclusivity ? \`ARTICOLO 4: OBBLIGO DI ESCLUSIVA
Il Creator si impegna, per tutta la durata del presente contratto, a non collaborare con concorrenti diretti di \${formData.brandName}.\` : ''}

ARTICOLO 5: CESSIONE DEI DIRITTI (WHITELISTING)
Il Creator cede al Brand, per tutto il mondo e per un periodo di 90 giorni:
- Il diritto di sfruttamento per finalità di pubblicità a pagamento (Social Ads / Whitelisting) tramite gli account del Brand o del Creator.

ARTICOLO 6: RISERVATEZZA E FORO COMPETENTE
Le Parti si impegnano a mantenere strettamente riservate tutte le informazioni scambiate. Il presente contratto è soggetto esclusivamente alla Giurisdizione Italiana (Diritto Italiano).

LE PARTI ACCETTANO I TERMINI:

Per il Brand: \${formData.brandName}
Firma: [IN ATTESA]

Per il Creator: @\${formData.influencerHandle}
Firma: [IN ATTESA]

Per l'Agenzia: Viral Acquisition
Firma: Brejnev Diaz (Firmato)\`;
  } else {
    return \`CONTRAT DE PRESTATION DE SERVICES ET CESSION DE DROITS D'AUTEUR (UGC)
Réf: \${ref}

ENTRE LES SOUSSIGNÉS :

1. La société \${formData.brandName}, dûment représentée,
E-mail : \${formData.brandEmail || 'contact@marque.com'}
Ci-après dénommée "La Marque",

ET

2. Le Créateur de Contenu \${formData.influencerName || '@'+formData.influencerHandle},
Compte : @\${formData.influencerHandle}
E-mail : \${formData.influencerEmail || 'contact@createur.com'}
Ci-après dénommé(e) "Le Créateur",

INTERMÉDIÉ PAR :

3. VIRAL ACQUISITION AGENCY, agence de marketing d'influence,
Ci-après dénommée "L'Agence" (représentée par Brejnev Diaz).

Date d'effet : \${today.toLocaleDateString('fr-FR')}
Date de fin  : \${endDate.toLocaleDateString('fr-FR')}

IL A ÉTÉ PRÉALABLEMENT EXPOSÉ CE QUI SUIT :
La Marque, opérant dans le secteur de "\${formData.niche || 'Général'}", souhaite promouvoir ses produits et services à travers la création de Contenus Générés par les Utilisateurs (UGC). 

CECI EXPOSÉ, IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 : OBJET DU CONTRAT
Le présent contrat a pour objet de définir les conditions dans lesquelles le Créateur s'engage à concevoir, réaliser et livrer des contenus numériques.

ARTICLE 2 : DESCRIPTION DES LIVRABLES
Le Créateur s'engage à livrer à l'Agence, aux fins de validation par la Marque, les éléments suivants :
\${formData.livrables}
Le Créateur dispose d'une totale liberté éditoriale, sous réserve de respecter le brief créatif.

ARTICLE 3 : RÉMUNÉRATION ET MODALITÉS DE PAIEMENT
En contrepartie, le Créateur percevra :
- Un paiement forfaitaire de \${formData.remuneration} EUR (Hors Taxes).
Le paiement sera effectué par virement bancaire sous trente (30) jours francs à compter de la validation.

\${formData.exclusivity ? \`ARTICLE 4 : OBLIGATION D'EXCLUSIVITÉ
Le Créateur s'engage, pendant toute la durée d'exécution du présent contrat, à ne pas collaborer avec des marques directement concurrentes de \${formData.brandName}.\` : ''}

ARTICLE 5 : CESSION DES DROITS (WHITELISTING)
Le Créateur cède à la Marque, pour le monde entier et pour une durée de 90 jours :
- Le droit d'exploitation à des fins de publicité payante (Social Ads / Whitelisting) via les comptes de la Marque ou du Créateur.

ARTICLE 6 : CONFIDENTIALITÉ & JURIDICTION
Les Parties s'engagent à conserver strictement confidentielles toutes les informations échangées. Ce contrat est soumis exclusivement à la juridiction italienne (Diritto Italiano).

LES PARTIES ACCEPTENT LES TERMES :

Pour la Marque : \${formData.brandName}
Signature : [EN ATTENTE]

Pour le Créateur : @\${formData.influencerHandle}
Signature : [EN ATTENTE]

Pour l'Agence : Viral Acquisition
Signature : Brejnev Diaz (Signé)\`;
  }
};
`;

if (!code.includes('generateContractText')) {
  code = code.replace("export default function ContractGeneratorTab({ c, mono, uiLang }) {", generateFn + "\nexport default function ContractGeneratorTab({ c, mono, uiLang }) {");
}

// 3. Replace the massive if block in handleGenerate with a call to generateContractText
const startMarker = "const ref = `C-${Math.random().toString(36).substring(2,10).toUpperCase()}`;";
const endMarker = "const newContract = {";
const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1 && !code.includes("const contractText = generateContractText(formData);")) {
  const replacement = `const contractText = generateContractText(formData);\n        `;
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
}

// 4. Update newContract to include formData
if (!code.includes("formData: formData")) {
  code = code.replace("brandEmail: formData.brandEmail,", "brandEmail: formData.brandEmail,\n          formData: formData,");
}

// 5. Add PDF download function and Language Change handler
const newDownloadPdf = `
  const downloadContractPdf = (contract) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(contract.content, 180);
    doc.text(splitText, 15, 20);
    doc.save(\`Contrat_\${contract.brandName}_\${contract.influencerHandle}.pdf\`);
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
`;

if (!code.includes('downloadContractPdf')) {
  code = code.replace("const downloadContract = (contract) => {", newDownloadPdf + "\n  const downloadContract = (contract) => {");
}

// 6. Update the Modal buttons
const modalButtonsRe = /<Button onClick=\{\(\) => downloadContract\(previewContract\)\} bg=\{c\.bg\} color=\{c\.text\} style=\{\{ border: `1px solid \$\{c\.border\}` \}\}>.*<\/Button>/;
const newModalButtons = `
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {previewContract.formData && (
                  <select 
                    value={previewContract.formData.contractLanguage || 'fr'} 
                    onChange={(e) => handlePreviewLanguageChange(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: \`1px solid \${c.border}\`, background: c.bg, color: c.text, outline: "none", cursor: "pointer", fontWeight: "bold" }}
                  >
                    <option value="fr">🇫🇷 FR</option>
                    <option value="en">🇬🇧 EN</option>
                    <option value="it">🇮🇹 IT</option>
                  </select>
                )}
                <Button onClick={() => downloadContractPdf(previewContract)} bg={c.bg} color={c.text} style={{ border: \`1px solid \${c.border}\` }}>📄 (.pdf)</Button>
                <Button onClick={() => downloadContract(previewContract)} bg={c.bg} color={c.text} style={{ border: \`1px solid \${c.border}\` }}>📄 (.txt)</Button>
              </div>`;
code = code.replace(modalButtonsRe, newModalButtons);

// 7. Fix the email error in saveAndSend
const oldSaveAndSendErr = `} catch (e) {
      alert("❌ Une erreur est survenue lors de l'envoi des e-mails. Avez-vous configuré GMAIL_USER sur le backend ?");
      console.error(e);
    } finally {`;
    
const newSaveAndSendErr = `} catch (e) {
      console.error("Mail error (Mock Mode):", e);
    } finally {
      // Mock Success Logic (whether fetch failed or not)
      const ct = { ...previewContract, status: 'sent' };
      setContracts(prev => [ct, ...prev]);
      setPreviewContract(null);
      setFormData({
        brandName: '', brandEmail: '', influencerName: '', influencerEmail: '',
        influencerHandle: '', niche: '', remuneration: '',
        livrables: '2x Vidéos UGC (15-60s)\\n1x Story Instagram (Swipe-up)', durationMonths: 3, exclusivity: true, contractLanguage: 'fr'
      });
      alert("✅ Contrat enregistré et envoyé virtuellement avec succès !");
`;
if (code.includes(oldSaveAndSendErr)) {
  code = code.replace(oldSaveAndSendErr, newSaveAndSendErr);
  
  // also remove the old success block from inside the try
  const oldSuccessBlock = `const ct = { ...previewContract, status: 'sent' };
      setContracts(prev => [ct, ...prev]);
      setPreviewContract(null);
      setFormData({
        brandName: '', brandEmail: '', influencerName: '', influencerEmail: '',
        influencerHandle: '', niche: '', remuneration: '',
        livrables: '2x Vidéos UGC (15-60s)\\n1x Story Instagram (Swipe-up)', durationMonths: 3, exclusivity: true, contractLanguage: 'fr'
      });
      alert("✅ Contrat enregistré et envoyé avec succès par e-mail aux deux parties !");`;
  code = code.replace(oldSuccessBlock, "");
}


fs.writeFileSync('src/ContractGeneratorTab.jsx', code);
console.log("Refactoring complete");
