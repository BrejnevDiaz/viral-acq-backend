const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

app = app.replace(
    /`}\s*\.hover-bg-light:hover \{ background: rgba\(255,255,255,0\.05\) !important; \}\r?\n<\/style>/,
    `        .hover-bg-light:hover { background: rgba(255,255,255,0.05) !important; }\n      \`}</style>`
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Fixed CSS syntax error!');
