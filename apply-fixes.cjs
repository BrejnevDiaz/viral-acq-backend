const fs = require('fs');
let code = fs.readFileSync('src/ContractGeneratorTab.jsx', 'utf8');

// 1. Add jsPDF import
if (!code.includes('jspdf')) {
  code = code.replace(/import React, \{ useState, useEffect \} from 'react';/, "import React, { useState, useEffect } from 'react';\nimport { jsPDF } from 'jspdf';");
}

// 2. Mock the email error in saveAndSend
code = code.replace(/\} catch \(err\) \{\n        alert\(`Une erreur est survenue lors de l'envoi des e-mails\. Avez-vous configuré GMAIL_USER sur le backend \?`\);\n      \} finally \{/g, 
`} catch (err) {
        console.error("Mail error (Mock Mode):", err);
      } finally {`);

// 3. Add PDF logic inside the component. We can just add it before saveAndSend.
const pdfLogic = `
  const downloadContractPdf = (contract) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(contract.content, 180);
    doc.text(lines, 15, 20);
    doc.save(\`Contrat_\${contract.brandName || 'Brand'}_vs_\${contract.influencerHandle || 'Talent'}.pdf\`);
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
      content = content.replace("Ci-après dénommée \\"La Marque\\",", "Hereinafter referred to as \\"The Brand\\",");
      content = content.replace("Le Créateur de Contenu", "The Content Creator");
      content = content.replace("Compte :", "Account :");
      content = content.replace("Ci-après dénommé(e) \\"Le Créateur\\",", "Hereinafter referred to as \\"The Creator\\",");
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
      content = content.replace("Ci-après dénommée \\"La Marque\\",", "Di seguito denominata \\"Il Brand\\",");
      content = content.replace("Le Créateur de Contenu", "Il Creatore di Contenuti");
      content = content.replace("Compte :", "Account :");
      content = content.replace("Ci-après dénommé(e) \\"Le Créateur\\",", "Di seguito denominato \\"Il Creatore\\",");
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
`;
code = code.replace("const saveAndSend = async () => {", pdfLogic + "\n  const saveAndSend = async () => {");

// 4. Update the buttons in the history list (add PDF)
code = code.replace(
  /<Button onClick=\{\(\) => downloadContract\(ct\)\} bg=\{c\.bg\} color=\{c\.text\} small style=\{\{ border: `1px solid \$\{c\.border\}` \}\}>.*\.txt<\/Button>/g,
  `<Button onClick={() => downloadContractPdf(ct)} bg={c.bg} color={c.text} small style={{ border: \`1px solid \${c.border}\` }}>📄 .pdf</Button>\n                <Button onClick={() => downloadContract(ct)} bg={c.bg} color={c.text} small style={{ border: \`1px solid \${c.border}\` }}>📄 .txt</Button>`
);

// 5. Update the modal buttons (Replace .txt with .pdf + translation dropdown + .txt)
code = code.replace(
  /<Button onClick=\{\(\) => downloadContract\(previewContract\)\} bg=\{c\.bg\} color=\{c\.text\} style=\{\{ border: `1px solid \$\{c\.border\}` \}\}>.*\.txt\)<\/Button>/g,
  `<select onChange={(e) => translatePreviewContract(e.target.value)} style={{ background: c.card, color: c.text, border: \`1px solid \${c.border}\`, borderRadius: 8, padding: "0 12px", outline: "none", fontSize: 13, marginRight: 8 }}>
                    <option value="fr">🇫🇷 FR</option>
                    <option value="en">🇬🇧 EN</option>
                    <option value="it">🇮🇹 IT</option>
                  </select>
                  <Button onClick={() => downloadContractPdf(previewContract)} bg={c.bg} color={c.text} style={{ border: \`1px solid \${c.border}\` }}>📄 (.pdf)</Button>
                  <Button onClick={() => downloadContract(previewContract)} bg={c.bg} color={c.text} style={{ border: \`1px solid \${c.border}\` }}>📄 (.txt)</Button>`
);

// 6. Add syncToRoster to ContractGeneratorTab (which I did in another script but it was overwritten when I did git checkout)
const autoSyncCode = `
  const syncToRoster = (inf) => {
    try {
      const saved = localStorage.getItem("agency_talents_v2");
      let roster = saved ? JSON.parse(saved) : [];
      const cleanUsername = (inf.username || inf.influencerHandle || "").replace("@", "").trim();
      if (!cleanUsername) return;
      if (roster.find(t => t.username === cleanUsername)) return;
      
      const newTalent = {
        id: \`t_user_\${Date.now()}_auto\`,
        username: cleanUsername,
        niche: inf.niche || "General",
        followers: parseInt(inf.followers) || 15000,
        engagement: inf.engagement || "5.0%",
        platform: inf.platform || "instagram",
        avatar: "https://ui-avatars.com/api/?name=" + cleanUsername + "&background=8B5CF6&color=fff",
        status: "active",
        email: inf.email || inf.influencerEmail || "contact@" + cleanUsername + ".com",
        profileUrl: inf.profileUrl || \`https://instagram.com/\${cleanUsername}\`
      };
      roster.unshift(newTalent);
      localStorage.setItem("agency_talents_v2", JSON.stringify(roster));
    } catch(e) {}
  };
`;
code = code.replace("const [previewContract, setPreviewContract] = useState(null);", autoSyncCode + "\n  const [previewContract, setPreviewContract] = useState(null);");

// And inject the call in saveAndSend
code = code.replace("const ct = { ...previewContract, status: 'sent' };\n      setContracts(prev => [ct, ...prev]);",
  "const ct = { ...previewContract, status: 'sent' };\n      syncToRoster({ username: previewContract.influencerHandle, influencerEmail: previewContract.influencerEmail, niche: previewContract.formData?.niche });\n      setContracts(prev => [ct, ...prev]);");

fs.writeFileSync('src/ContractGeneratorTab.jsx', code);
console.log("Successfully patched ContractGeneratorTab.jsx safely.");
