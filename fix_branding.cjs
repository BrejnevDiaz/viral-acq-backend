const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Header Logo
app = app.replace(
    /<span style=\{\{ fontSize: 20, fontWeight: 800, letterSpacing: '-0\.5px' \}\}>ViralAcquisition<\/span>/g,
    `<span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>Acquisition Pro</span>`
);

// 2. Testimonial 1
app = app.replace(
    /"ViralAcquisition est mon outil préféré/g,
    `"Acquisition Pro est mon outil préféré`
);

// 3. Testimonial 2 (Lucas Bivert)
app = app.replace(
    /c'est ViralAcquisition\./g,
    `c'est Acquisition Pro.`
);

// 4. Founder section
app = app.replace(
    /Fondateur de ViralAcquisition \(Agence\)/g,
    `Fondateur de l'Agence Viral Acquisition`
);

// 5. Founder quote
app = app.replace(
    /"Mon objectif avec ViralAcquisition est simple/g,
    `"Mon objectif avec Acquisition Pro est simple`
);

// 6. Footer logo is actually using the same regex as Header Logo (since I used /g)
// 7. Footer copyright
app = app.replace(
    /ViralAcquisition © 2026\. Tous droits réservés\./g,
    `Acquisition Pro by Viral Acquisition © 2026. Tous droits réservés.`
);

// 8. Mentions Légales
app = app.replace(
    /Le site Acquisition Pro est édité par l'agence ViralAcquisition\./g,
    `Le site Acquisition Pro est édité par l'agence Viral Acquisition (fondée par Brejnev Diaz).`
);

// 9. SaaS dashboard header (if any)
app = app.replace(
    /VIRALACQ\n\s*PRO SUITE/g,
    `ACQUISITION\nPRO SUITE`
);
app = app.replace(
    /VIRALACQ/g,
    `ACQUISITION PRO`
);

// But wait, there might be places where we mention "Viral Acquisition" instead of "ViralAcquisition".
// Let's ensure the Agency section (Done-For-You) has the correct text.
// "L'équipe Viral Acquisition gère vos campagnes" - this is correct.

// 10. Dashboard Sidebar Title
app = app.replace(
    /ACQUISITION PRO<br\/>PRO SUITE/g, // if it was already formatted like this
    `ACQUISITION<br/>PRO SUITE`
);

// Make sure Brejnev Diaz is mentioned. He already is in the Founder section and the Modal.

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Branding texts replaced!');
