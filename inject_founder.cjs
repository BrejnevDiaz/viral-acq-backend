const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Revert testimonial
const oldTestimonial = `<img src="https://ui-avatars.com/api/?name=Brejnev+Diaz&background=8B5CF6&color=fff&size=150" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                   <div>
                      <p style={{ fontSize: 13, color: '#A1A1AA', margin: '0 0 8px 0', lineHeight: 1.4 }}>"J'utilise ViralAcq depuis des années. En 3 clics, je trouve des produits à fort potentiel pour ma marque."</p>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Brejnev Diaz, <span style={{ color: '#8B5CF6' }}>Fondateur</span></div>`;

const newTestimonial = `<img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                   <div>
                      <p style={{ fontSize: 13, color: '#A1A1AA', margin: '0 0 8px 0', lineHeight: 1.4 }}>"J'utilise ViralAcq pour recruter mes créateurs. En 3 clics, je trouve des influenceurs à fort potentiel pour ma marque."</p>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Thomas, <span style={{ color: '#8B5CF6' }}>Marque E-com</span></div>`;

app = app.replace(oldTestimonial, newTestimonial);


// 2. Inject Founder section right before FAQ
const faqStart = app.indexOf('{/* FAQ */}');
if (faqStart !== -1) {
    const founderSection = `
            {/* FOUNDER SECTION */}
            <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, padding: '60px 40px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                
                <img src="https://github.com/BrejnevDiaz.png" alt="Brejnev Diaz" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #8B5CF6', marginBottom: 24, boxShadow: '0 10px 30px rgba(139,92,246,0.4)', position: 'relative', zIndex: 2 }} />
                
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8, position: 'relative', zIndex: 2 }}>Brejnev Diaz</h2>
                <div style={{ fontSize: 16, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 32, position: 'relative', zIndex: 2 }}>Fondateur de ViralAcquisition</div>
                
                <p style={{ fontSize: 20, color: '#E4E4E7', lineHeight: 1.6, maxWidth: 700, margin: '0 auto', fontStyle: 'italic', fontWeight: 300, position: 'relative', zIndex: 2 }}>
                  "Mon objectif avec ViralAcquisition est simple : supprimer toutes les frictions entre les marques e-commerce et les créateurs de contenu. Nous ne sommes pas juste un outil d'espionnage, nous sommes le pont qui permet de nouer des partenariats ultra-rentables et de disrupter le marché de l'influence."
                </p>
              </div>
            </section>
            
            `;
    app = app.substring(0, faqStart) + founderSection + app.substring(faqStart);
}

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully injected Founder section and reverted testimonial!');
