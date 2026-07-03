const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// Fix the typo title
app = app.replace(
    `Pilotez vos campagnes et votre <span style={{ color: '#8B5CF6' }}>Trouver une collab</span>`,
    `Pilotez vos campagnes et votre <span style={{ color: '#8B5CF6' }}>Sourcing & CRM</span>`
);

// We need to inject images into the empty black dashboard mock boxes.
// The boxes have classes/styles like: background: '#000', borderRadius: 12, position: 'relative'
// Let's use a counter to inject different images.
let imgCount = 0;
const images = [
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1512413917887-8463c6591873?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=300&q=80"
];

// In the dashboard mockup (which is in the Hero section), there are several `background: '#000'` boxes.
// Let's specifically target the ones with: `border: '1px solid rgba(255,255,255,0.05)'` or `border: '1px solid rgba(255,255,255,0.1)'`
// that do NOT already have an `<img` inside them.
// But it's easier to just match them precisely based on the view count labels.

app = app.replace(
    /(<div style={{.*?background: '#000'.*?position: 'relative'(?:, overflow: 'hidden')?.*?}}>\s*)(<div style={{ position: 'absolute', bottom: 8, left: 8)/g,
    (match, divStart, innerDiv) => {
        // If it's one of the boxes, inject an image
        if (imgCount < images.length) {
            const img = `<img src="${images[imgCount]}" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />\n                            `;
            imgCount++;
            
            // Make sure overflow: 'hidden' is in the divStart if it wasn't
            let newDivStart = divStart;
            if (!newDivStart.includes("overflow: 'hidden'")) {
                newDivStart = newDivStart.replace("position: 'relative'", "position: 'relative', overflow: 'hidden'");
            }
            
            return newDivStart + img + innerDiv;
        }
        return match;
    }
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Fixed typo and added images. Injected images: ' + imgCount);
