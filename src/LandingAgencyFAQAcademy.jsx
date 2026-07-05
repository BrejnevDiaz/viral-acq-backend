import { L } from "./landingTheme";

export default function LandingAgencyFAQAcademy({ uiLang, setShowContactModal, openAuthWithIntent }) {
  return (
    <>
          {/* SECTION AGENCE DONE-FOR-YOU */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="flex-col-mobile" style={{ display: 'flex', gap: 60, alignItems: 'center', background: 'linear-gradient(135deg, rgba(88,28,135,0.92), rgba(9,9,11,0.94))', borderRadius: 32, padding: 60, border: '1px solid rgba(139,92,246,0.3)', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.35)' }}>
                  
                  {/* Background Glow */}
                  <div style={{ position: 'absolute', top: -50, right: -100, width: 400, height: 400, background: 'rgba(139,92,246,0.2)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

                  {/* Left: Text & Benefits */}
                  <div className="w-full-mobile text-center-mobile" style={{ flex: 1, zIndex: 10 }}>
                      <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(139,92,246,0.1)', color: '#C4B5FD', borderRadius: 20, fontSize: 14, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(139,92,246,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>{uiLang === 'fr' ? "Service Premium" : "Premium Service"}</div>
                      
                      <h2 className="text-mobile-h2" style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.1 }}>
                          {uiLang === 'fr' ? <>Besoin d'experts pour scaler ?<br/><span style={{ color: '#A78BFA' }}>Déléguez tout à l'Agence.</span></> : uiLang === 'it' ? <>Hai bisogno di esperti per scalare?<br/><span style={{ color: '#A78BFA' }}>Delega tutto all'Agenzia.</span></> : <>Ready to scale massively?<br/><span style={{ color: '#A78BFA' }}>Delegate to our Agency.</span></>}
                      </h2>

                      <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>
                          {uiLang === 'fr'
                          ? "Passez en mode « Done-For-You ». L'équipe Viral Acquisition gère vos campagnes de A à Z : sourcing, scripts créatifs, gestion des contrats, montage vidéo publicitaire et lancement des campagnes."
                          : uiLang === 'it'
                          ? "Passa alla modalità « Done-For-You ». Il team di Viral Acquisition gestisce le tue campagne dalla A alla Z: sourcing, script creativi, gestione dei contratti, montaggio video pubblicitario e lancio delle campagne."
                          : "Switch to « Done-For-You » mode. The Viral Acquisition team manages your campaigns from A to Z: sourcing, creative scripts, contract management, ad editing, and campaign launch."}
                      </p>
                      
                      <div className="text-left-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? "Gestion Complète" : uiLang === 'it' ? "Gestione Completa" : "Full Management"}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "On s'occupe des influenceurs pendant que vous vous occupez de vos ventes." : uiLang === 'it' ? "Ci occupiamo degli influencer mentre tu ti occupi delle vendite." : "We handle influencers while you handle sales."}</div>
                              </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? "Créatives Performantes" : uiLang === 'it' ? "Creatività ad Alte Prestazioni" : "High-Converting Creatives"}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "Nos monteurs transforment le contenu brut en publicités ultra-rentables." : uiLang === 'it' ? "I nostri editor trasformano i contenuti grezzi in pubblicità ultra-redditizie." : "Our editors turn raw content into highly profitable ads."}</div>
                              </div>
                          </div>
                      </div>
                      
                      <button onClick={() => setShowContactModal(true)} className="hover-glow-intense" style={{ background: 'linear-gradient(90deg, #A78BFA, #7C3AED)', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto' }}>
                          {uiLang === 'fr' ? "Réserver mon Appel Stratégique →" : uiLang === 'it' ? "Prenota la mia Chiamata Strategica →" : "Book My Strategy Call →"}
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
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase' }}>{uiLang === 'fr' ? 'Augmentation du ROI' : uiLang === 'it' ? 'Aumento del ROI' : 'ROI Increase'}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          <section style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.15) 0%, transparent 100%)', padding: '120px 24px' }}>
             <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, color: L.text, textAlign: 'center', marginBottom: 60, letterSpacing: '-1px' }}>{uiLang === 'fr' ? "Vos Questions, Nos Réponses — Sans Détour" : uiLang === 'it' ? "Le tue Domande, le Nostre Risposte — Senza Giri di Parole" : "Your Questions, Our Answers — Straight Up"}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {[
                     {
                       q: { fr: "Puis-je gérer mes contrats légaux sur la plateforme ?", en: "Can I manage my legal contracts on the platform?", it: "Posso gestire i miei contratti legali sulla piattaforma?" },
                       a: { fr: "Oui. Acquisition Pro inclut un générateur de contrats intégré directement dans le CRM : renseignez la marque, le créateur et les conditions de la collaboration, et un contrat juridique prêt à l'emploi est généré automatiquement — prêt pour signature électronique, sans juriste ni allers-retours par email.", en: "Yes. Acquisition Pro includes a contract generator built directly into the CRM: enter the brand, the creator, and the terms of the deal, and a ready-to-use legal contract is generated automatically — ready for e-signature, with no lawyer and no email back-and-forth.", it: "Sì. Acquisition Pro include un generatore di contratti integrato direttamente nel CRM: inserisci il brand, il creator e le condizioni della collaborazione, e un contratto legale pronto all'uso viene generato automaticamente — pronto per la firma elettronica, senza avvocato né infiniti scambi di email." }
                     },
                     {
                       q: { fr: "Est-ce adapté si je débute en e-commerce ?", en: "Is this suitable if I'm just starting out in e-commerce?", it: "È adatto se sto iniziando ora nell'e-commerce?" },
                       a: { fr: "Absolument. La majorité de nos utilisateurs démarrent avec le forfait Gratuit et notre Académie intégrée (+10h de formation offerte) pour maîtriser les bases du sourcing et du matchmaking avant de scaler. Vous montez en compétence à votre rythme, sans risquer un centime avant d'être prêt à passer au niveau supérieur.", en: "Absolutely. Most of our users start on the Free plan with our built-in Academy (+10h of free training) to master the basics of sourcing and matchmaking before scaling. You build your skills at your own pace, without risking a cent before you're ready to level up.", it: "Assolutamente sì. La maggior parte dei nostri utenti inizia con il piano Gratuito e la nostra Academy integrata (+10h di formazione gratuita) per padroneggiare le basi del sourcing e del matchmaking prima di scalare. Costruisci le tue competenze al tuo ritmo, senza rischiare un centesimo prima di essere pronto a salire di livello." }
                     },
                     {
                       q: { fr: "Quelle est la différence entre VIP Pro et VIP Elite ?", en: "What's the difference between VIP Pro and VIP Elite?", it: "Qual è la differenza tra VIP Pro e VIP Elite?" },
                       a: { fr: "Les deux forfaits donnent un accès total à la plateforme (AdSpy, CRM, Matchmaking, Vetting, Contrats). VIP Pro (99€/mois) inclut 1 séance de coaching et 2 articles de blog premium par mois. VIP Elite (299€/mois) est pensé pour les marques qui veulent scaler vite : coaching hebdomadaire et blog illimité, pour ne jamais rater une stratégie gagnante.", en: "Both plans give full access to the platform (AdSpy, CRM, Matchmaking, Vetting, Contracts). VIP Pro (€99/month) includes 1 coaching session and 2 premium blog posts per month. VIP Elite (€299/month) is built for brands that want to scale fast: weekly coaching and unlimited blog access, so you never miss a winning strategy.", it: "Entrambi i piani danno accesso completo alla piattaforma (AdSpy, CRM, Matchmaking, Vetting, Contratti). VIP Pro (99€/mese) include 1 sessione di coaching e 2 articoli del blog premium al mese. VIP Elite (299€/mese) è pensato per i brand che vogliono scalare in fretta: coaching settimanale e blog illimitato, per non perdere mai una strategia vincente." }
                     }
                   ].map((item, i) => (
                      <details key={i} className="hover-card-dark" style={{ background: L.surface, borderRadius: 12, border: `1px solid ${L.border}`, cursor: 'pointer' }}>
                         <summary style={{ padding: 24, fontSize: 16, fontWeight: 600, color: L.text, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {item.q[uiLang]}
                            <span style={{ color: '#8B5CF6', fontSize: 24 }}>›</span>
                         </summary>
                         <div style={{ padding: '0 24px 24px 24px', color: L.textMuted, fontSize: 15, lineHeight: 1.6 }}>
                            {item.a[uiLang]}
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
                   <h2 style={{ fontSize: 24, color: '#EC4899', fontWeight: 800, marginBottom: 16 }}>{uiLang === 'fr' ? "Apprenez à Lancer une Campagne qui Convertit dès Aujourd'hui" : uiLang === 'it' ? "Impara a Lanciare una Campagna che Converte da Oggi" : "Learn to Launch a Converting Campaign Today"}</h2>
                   <h3 style={{ fontSize: 48, color: '#fff', fontWeight: 800, lineHeight: 1.1, marginBottom: 32, letterSpacing: '-1px' }}>{uiLang === 'fr' ? "Accédez Gratuitement à Notre Formation Complète (+10h)" : uiLang === 'it' ? "Accedi Gratis al nostro Corso Completo (+10h)" : "Get Free Access to our Full Training (+10h)"}</h3>
                   <button onClick={() => openAuthWithIntent('resources')} style={{
                     background: 'linear-gradient(90deg, #EC4899, #8B5CF6)', color: '#fff', border: 'none',
                     padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
                     boxShadow: '0 10px 30px rgba(236,72,153,0.3)', transition: 'transform 0.2s'
                   }} className="hover-lift">
                     {uiLang === 'fr' ? "Débloquer la Formation Gratuite →" : uiLang === 'it' ? "Sblocca il Corso Gratuito →" : "Unlock Free Training →"}
                   </button>
                </div>
                
                <div style={{ flex: 1, zIndex: 10, position: 'relative' }}>
                   <div style={{ background: '#18181B', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                      <div style={{ height: 140, position: 'relative', background: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80) center/cover' }}>
                         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #18181B 0%, rgba(24,24,27,0.2) 60%, rgba(24,24,27,0.5) 100%)' }} />
                         <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(236,72,153,0.85)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {uiLang === 'fr' ? 'Formation vidéo' : uiLang === 'it' ? 'Corso video' : 'Video course'}
                         </div>
                         <div style={{ position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '11px solid #fff', marginLeft: 3 }} />
                         </div>
                      </div>
                      <div style={{ padding: 24 }}>
                      <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 24 }}>{uiLang === 'fr' ? 'Sommaire' : uiLang === 'it' ? 'Sommario' : 'Syllabus'}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         {[
                           { t: uiLang === 'fr' ? "À regarder avant de se lancer" : uiLang === 'it' ? "Da guardare prima di iniziare" : "Watch before you start", dur: "12m 34s", p: 100 },
                           { t: uiLang === 'fr' ? "Tout savoir sur le Matchmaking" : uiLang === 'it' ? "Tutto sul Matchmaking" : "Everything about Matchmaking", dur: "30m 22s", p: 60 },
                           { t: uiLang === 'fr' ? "La méthode Virale" : uiLang === 'it' ? "Il metodo Virale" : "The Viral method", dur: "9m 15s", p: 0 },
                           { t: uiLang === 'fr' ? "Décrypter l'engagement TikTok" : uiLang === 'it' ? "Decifrare l'engagement su TikTok" : "Decoding TikTok engagement", dur: "25m 47s", p: 0 }
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
             </div>
          </section>
    </>
  );
}
