export default function LandingAgencyFAQAcademy({ uiLang, setShowContactModal, setAuthMode, setShowLoginModal }) {
  return (
    <>
          {/* SECTION AGENCE DONE-FOR-YOU */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="flex-col-mobile" style={{ display: 'flex', gap: 60, alignItems: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0.8))', borderRadius: 32, padding: 60, border: '1px solid rgba(139,92,246,0.3)', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                  
                  {/* Background Glow */}
                  <div style={{ position: 'absolute', top: -50, right: -100, width: 400, height: 400, background: 'rgba(139,92,246,0.2)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

                  {/* Left: Text & Benefits */}
                  <div className="w-full-mobile text-center-mobile" style={{ flex: 1, zIndex: 10 }}>
                      <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(139,92,246,0.1)', color: '#C4B5FD', borderRadius: 20, fontSize: 14, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(139,92,246,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>{uiLang === 'fr' ? "Service Premium" : "Premium Service"}</div>
                      
                      <h2 className="text-mobile-h2" style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.1 }}>
                          {uiLang === 'fr' ? <>Besoin d'experts pour scaler ?<br/><span style={{ color: '#A78BFA' }}>Déléguez tout à l'Agence.</span></> : <>Ready to scale massively?<br/><span style={{ color: '#A78BFA' }}>Delegate to our Agency.</span></>}
                      </h2>
                      
                      <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>
                          {uiLang === 'fr' 
                          ? "Passez en mode « Done-For-You ». L'équipe Viral Acquisition gère vos campagnes de A à Z : sourcing, scripts créatifs, gestion des contrats, montage vidéo publicitaire et lancement des campagnes."
                          : "Switch to « Done-For-You » mode. The Viral Acquisition team manages your campaigns from A to Z: sourcing, creative scripts, contract management, ad editing, and campaign launch."}
                      </p>
                      
                      <div className="text-left-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? "Gestion Complète" : "Full Management"}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "On s'occupe des influenceurs pendant que vous vous occupez de vos ventes." : "We handle influencers while you handle sales."}</div>
                              </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? "Créatives Performantes" : "High-Converting Creatives"}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "Nos monteurs transforment le contenu brut en publicités ultra-rentables." : "Our editors turn raw content into highly profitable ads."}</div>
                              </div>
                          </div>
                      </div>
                      
                      <button onClick={() => setShowContactModal(true)} className="hover-glow-intense" style={{ background: 'linear-gradient(90deg, #A78BFA, #7C3AED)', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto' }}>
                          {uiLang === 'fr' ? "Réserver un appel avec l'Agence" : "Book a call with the Agency"}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      </button>
                  </div>

                  {/* Right: Visual */}
                  <div className="w-full-mobile hide-mobile" style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
                          <img src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=500&q=80" style={{ width: '100%', borderRadius: 24, border: '2px solid rgba(139,92,246,0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} alt="Viral Acquisition Agency Team" />
                          <div style={{ position: 'absolute', bottom: -20, left: -20, background: '#18181B', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                              </div>
                              <div>
                                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>+340%</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase' }}>{uiLang === 'fr' ? 'Augmentation du ROI' : 'ROI Increase'}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          <section style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.15) 0%, transparent 100%)', padding: '120px 24px' }}>
             <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 60, letterSpacing: '-1px' }}>Nous répondons à vos questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {[
                     "Puis-je gérer mes contrats légaux sur la plateforme ?",
                     "Est-ce adapté si je débute en e-commerce ?",
                     "Quelle est la différence entre VIP Pro et VIP Elite ?"
                   ].map((q, i) => (
                      <details key={i} style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                         <summary style={{ padding: 24, fontSize: 16, fontWeight: 600, color: '#E4E4E7', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {q}
                            <span style={{ color: '#8B5CF6', fontSize: 24 }}>›</span>
                         </summary>
                         <div style={{ padding: '0 24px 24px 24px', color: '#A1A1AA', fontSize: 15, lineHeight: 1.6 }}>
                            Notre IA analyse des milliers de données (engagement, audience, niche) pour vous connecter automatiquement avec les créateurs UGC et influenceurs les plus rentables pour votre marque. Finies les heures de recherche manuelle.
                         </div>
                      </details>
                   ))}
                </div>
             </div>
          </section>

          {/* ACADEMY FORMATION */}
          <section style={{ maxWidth: 1100, margin: '100px auto', position: 'relative', padding: '0 24px' }}>
             <div style={{ background: '#111', borderRadius: 32, padding: 60, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 60, overflow: 'hidden', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                {/* Background Glow */}
                <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'rgba(236,72,153,0.2)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
                
                <div style={{ flex: 1, zIndex: 10 }}>
                   <h2 style={{ fontSize: 24, color: '#EC4899', fontWeight: 800, marginBottom: 16 }}>Apprends à lancer ta première campagne</h2>
                   <h3 style={{ fontSize: 48, color: '#fff', fontWeight: 800, lineHeight: 1.1, marginBottom: 32, letterSpacing: '-1px' }}>Accède à une formation de +10h gratuitement</h3>
                   <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                     background: 'linear-gradient(90deg, #EC4899, #8B5CF6)', color: '#fff', border: 'none',
                     padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
                     boxShadow: '0 10px 30px rgba(236,72,153,0.3)', transition: 'transform 0.2s'
                   }} className="hover-lift">
                     Commencer la formation
                   </button>
                </div>
                
                <div style={{ flex: 1, zIndex: 10, position: 'relative' }}>
                   <div style={{ background: '#18181B', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                      <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 24 }}>Sommaire</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         {[
                           { t: "À regarder avant de se lancer", dur: "12m 34s", p: 100 },
                           { t: "Tout savoir sur le Matchmaking", dur: "30m 22s", p: 60 },
                           { t: "La méthode Virale", dur: "9m 15s", p: 0 },
                           { t: "Décrypter l'engagement TikTok", dur: "25m 47s", p: 0 }
                         ].map((v, i) => (
                           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', background: v.p === 100 ? '#10B981' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>{v.p === 100 ? '✓' : ''}</div>
                              <div style={{ width: 60, height: 40, background: '#27272A', borderRadius: 8, position: 'relative' }}>
                                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #fff' }}></div>
                              </div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: 13, color: '#E4E4E7', fontWeight: 600 }}>{v.t}</span>
                                    <span style={{ fontSize: 11, color: '#A1A1AA' }}>{v.dur}</span>
                                 </div>
                                 <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: `${v.p}%`, height: '100%', background: '#EC4899' }}></div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </section>
    </>
  );
}
