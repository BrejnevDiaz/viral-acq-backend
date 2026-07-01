const fs = require('fs');

let code = fs.readFileSync('src/ContractGeneratorTab.jsx', 'utf8');

// Replace the drawHeaderFooter function inside downloadContractPdf
code = code.replace(
  /doc\.setFontSize\(22\);\s*doc\.text\("VIRAL ACQUISITION", 15, 22\);\s*\/\/\s*"PRO SUITE" badge\s*doc\.setFillColor\(\.\.\.accentColor\);\s*doc\.rect\(88, 14, 30, 8, 'F'\);\s*doc\.setFontSize\(8\);\s*doc\.text\("PRO SUITE", 91, 20\);/g,
  \`
      // Logo shape
      doc.setFillColor(...primaryColor);
      doc.rect(15, 12, 10, 10, 'F');
      doc.setFillColor(...accentColor);
      doc.circle(28, 17, 5, 'F');
      
      doc.setFontSize(20);
      doc.text("VIRAL ACQUISITION", 38, 20);
      
      // "PRO SUITE" badge
      doc.setFillColor(...accentColor);
      doc.rect(120, 14, 30, 8, 'F');
      doc.setFontSize(8);
      doc.text("PRO SUITE", 123, 20);
\`
);

fs.writeFileSync('src/ContractGeneratorTab.jsx', code);
console.log("PDF header fixed.");
