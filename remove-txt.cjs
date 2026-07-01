const fs = require('fs');
let code = fs.readFileSync('src/ContractGeneratorTab.jsx', 'utf8');

// Replace history button
code = code.replace(
  /<Button onClick=\{\(\) => downloadContract\(ct\)\} bg=\{c\.bg\} color=\{c\.text\} small style=\{\{ border: `1px solid \$\{c\.border\}` \}\}>.*\.txt<\/Button>/g,
  `<Button onClick={() => downloadContractPdf(ct)} bg={c.bg} color={c.text} small style={{ border: \`1px solid \${c.border}\` }}>📄 .pdf</Button>`
);

// Replace modal button (by completely removing the txt one, leaving only the pdf one)
code = code.replace(
  /<Button onClick=\{\(\) => downloadContract\(previewContract\)\} bg=\{c\.bg\} color=\{c\.text\} style=\{\{ border: `1px solid \$\{c\.border\}` \}\}>.*\.txt\)<\/Button>/g,
  ""
);

fs.writeFileSync('src/ContractGeneratorTab.jsx', code);
console.log("TXT downloads replaced with PDF!");
