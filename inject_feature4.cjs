const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const newSection = `
          {/* NOUVELLE SECTION : INSPIRATION MARQUES */}
          <section style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                  <h2 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>Inspirez-vous des <span style={{ color: '#F43F5E' }}>géants de votre niche</span></h2>
                  <p style={{ color: '#A1A1AA', fontSize: 20, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>Pourquoi réinventer la roue ? Analysez les publicités et campagnes des plus grandes marques de votre secteur et reproduisez leur succès.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'center' }}>
                  
                  {/* Mockup UI Benchmark */}
                  <div style={{ background: '#18181B', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#F43F5E', letterSpacing: 1 }}>VEILLE CONCURRENTIELLE</div>
                          <div style={{ display: 'flex', gap: 8 }}>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                          </div>
                      </div>

                      <div style={{ background: '#09090B', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                              </div>
                              <div>
                                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Recherche par Niche</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Tapez "Skincare", "Fitness" ou un nom de marque.</div>
                              </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <div style={{ height: 140, borderRadius: 12, background: 'url(https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop) center/cover', position: 'relative' }}>
                                 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }}>1.2M Vues</div>
                              </div>
                              <div style={{ height: 140, borderRadius: 12, background: 'url(https://images.unsplash.com/photo-1571781526291-c477ebfd024b?q=80&w=400&auto=format&fit=crop) center/cover', position: 'relative' }}>
                                 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }}>850K Vues</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Arguments Text */}
                  <div style={{ paddingLeft: '10%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                          <div>
                              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Décelez les tendances avant les autres</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Découvrez exactement quels formats vidéos performent pour vos concurrents. Arrêtez de deviner et basez votre créativité sur des données concrètes.</p>
                          </div>
                          
                          <div>
                              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Créez des briefs parfaits</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Sauvegardez les meilleures publicités de votre secteur dans un Moodboard et partagez-les en un clic avec vos créateurs pour leur montrer exactement ce que vous attendez.</p>
                          </div>
                          
                          <div>
                              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Adaptez les stratégies gagnantes</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Ce qui marche pour Gymshark ou Sephora peut marcher pour vous. Analysez leurs hooks (accroches), leurs appels à l'action et la durée de leurs vidéos.</p>
                          </div>
                      </div>
                  </div>

              </div>
          </section>
`;

if (!app.includes("Inspirez-vous des")) {
    app = app.replace(
        "          <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>\n              <h2 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></h2>",
        newSection + "\n          <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>\n              <h2 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></h2>"
    );
    fs.writeFileSync('src/App.jsx', app, 'utf8');
    console.log('Successfully added Inspiration section!');
} else {
    console.log('Already added');
}
