const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const images = [
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1512413917887-8463c6591873?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=300&q=80"
];

let imgCount = 0;

// Match <video ...> ... </video> blocks
app = app.replace(
    /<video[\s\S]*?<\/video>/g,
    (match) => {
        // Only replace if it contains pixabay
        if (match.includes("pixabay") && imgCount < images.length) {
            const img = `<img src="${images[imgCount]}" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />`;
            imgCount++;
            return img;
        }
        return match;
    }
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Replaced dead videos with images. Count: ' + imgCount);
