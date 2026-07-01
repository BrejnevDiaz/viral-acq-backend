const fs = require('fs');

const premiumPdfCode = `
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
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("VIRAL ACQUISITION", 15, 22);
      
      // "PRO SUITE" badge
      doc.setFillColor(...accentColor);
      doc.rect(88, 14, 30, 8, 'F');
      doc.setFontSize(8);
      doc.text("PRO SUITE", 91, 20);

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
      doc.text(\`Page \${pageNumber}\`, 185, 289);
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

    doc.save(\`Contrat_\${contract.brandName || 'Brand'}_vs_\${contract.influencerHandle || 'Talent'}.pdf\`);
  };
`;

let code = fs.readFileSync('src/ContractGeneratorTab.jsx', 'utf8');

// Replace the old downloadContractPdf function
const regex = /const downloadContractPdf = \(contract\) => \{[\s\S]*?doc\.save.*?\);\n  \};/;
code = code.replace(regex, premiumPdfCode.trim());

fs.writeFileSync('src/ContractGeneratorTab.jsx', code);
console.log("PDF generation made premium.");
