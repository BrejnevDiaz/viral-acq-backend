const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
c = c.replaceAll('\\`', '`');
fs.writeFileSync('src/App.jsx', c);
console.log('Fixed backslashes');
