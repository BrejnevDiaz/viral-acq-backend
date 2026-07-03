const fs = require('fs');
let content = fs.readFileSync('src/ShopAnalyzerTab.jsx', 'utf8');

// 1. Add states for Analysis Modal
const stateInjection = `
  const [analyzingAd, setAnalyzingAd] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [marketingAnalysisCount, setMarketingAnalysisCount] = useState(0);

  const handleMarketingAnalysis = (ad) => {
    if (userTier === 'free') {
      alert(uiLang === 'fr' ? 'Cette fonctionnalité est réservée aux forfaits payants (Standard / Pro).' : 'This feature is locked to Paid plans.');
      return;
    }
    if (userTier === 'standard' && marketingAnalysisCount >= 50) {
      alert(uiLang === 'fr' ? 'Limite de 50 analyses/semaine atteinte pour le forfait Standard (49€).' : 'Limit of 50 analyses/week reached for Standard plan.');
      return;
    }
    if (userTier === 'vip_pro' && marketingAnalysisCount >= 100) {
      alert(uiLang === 'fr' ? 'Limite de 100 analyses/jour atteinte pour le forfait VIP Pro (99€).' : 'Limit of 100 analyses/day reached for VIP Pro plan.');
      return;
    }

    setAnalyzingAd(ad);
    setTimeout(() => {
      setMarketingAnalysisCount(prev => prev + 1);
      setAnalyzingAd(null);
      setAnalysisResult({
        adId: ad.id,
        hook: uiLang === 'fr' ? "Problème/Solution : Montre le problème avant/après de façon dramatique." : "Problem/Solution: Dramatic before/after.",
        emotion: uiLang === 'fr' ? "Curiosité et soulagement." : "Curiosity and relief.",
        script: uiLang === 'fr' ? "3 sec: Hook choc. 10 sec: Démo produit. 15 sec: Social Proof. 20 sec: CTA Fort." : "3s: Shocking hook. 10s: Product demo. 15s: Social proof.",
        rating: "9.2/10"
      });
    }, 2000);
  };
`;

content = content.replace(
  /const \[activeShop, setActiveShop\] = useState\(null\);/,
  `const [activeShop, setActiveShop] = useState(null);\n${stateInjection}`
);

// 2. Add the button in the Ad Card
const buttonInjection = `
                          {/* Marketing Angle Button */}
                          <button 
                            onClick={() => handleMarketingAnalysis(ad)}
                            disabled={analyzingAd?.id === ad.id}
                            style={{ 
                              background: analyzingAd?.id === ad.id ? c.border : 'linear-gradient(90deg, #8B5CF6, #EC4899)', 
                              color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 700, 
                              cursor: analyzingAd?.id === ad.id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              marginTop: 'auto', transition: 'all 0.2s', opacity: (userTier === 'free' ? 0.6 : 1)
                            }}>
                            {analyzingAd?.id === ad.id ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            )}
                            {uiLang === 'fr' ? (analyzingAd?.id === ad.id ? 'Analyse...' : 'Analyser l\\'Angle Marketing') : (analyzingAd?.id === ad.id ? 'Analyzing...' : 'Analyze Marketing Angle')}
                            {userTier === 'free' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                          </button>
                        </div>
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*\)\s*\)\s*}\s*<\/div>\s*<\/div>\s*\)\s*}/,
  `${buttonInjection}\n                      ))\n                    )}\n                  </div>\n                </div>\n              )}`
);

// 3. Add the Analysis Result Modal
const modalInjection = `
      {/* Marketing Analysis Modal */}
      {analysisResult && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }}>
            <div style={{ background: c.card, border: \`1px solid \${c.border}\`, borderRadius: 16, width: 450, padding: 24, position: 'relative', boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
                <button onClick={() => setAnalysisResult(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: c.textDim, fontSize: 20, cursor: "pointer" }}>&times;</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: c.text }}>{uiLang === 'fr' ? 'Analyse Marketing IA' : 'AI Marketing Analysis'}</h3>
                </div>
                
                <div style={{ background: c.bg, border: \`1px solid \${c.border}\`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: c.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Hook (Accroche)</div>
                    <div style={{ fontSize: 14, color: c.text, fontWeight: 600 }}>{analysisResult.hook}</div>
                </div>

                <div style={{ background: c.bg, border: \`1px solid \${c.border}\`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: c.textDim, textTransform: 'uppercase', marginBottom: 4 }}>{uiLang === 'fr' ? 'Structure Script' : 'Script Structure'}</div>
                    <div style={{ fontSize: 14, color: c.text, fontWeight: 600 }}>{analysisResult.script}</div>
                </div>
                
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, background: c.bg, border: \`1px solid \${c.border}\`, borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: c.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Emotion</div>
                        <div style={{ fontSize: 14, color: '#F43F5E', fontWeight: 700 }}>{analysisResult.emotion}</div>
                    </div>
                    <div style={{ flex: 1, background: c.bg, border: \`1px solid \${c.border}\`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: c.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Viral Score</div>
                        <div style={{ fontSize: 24, color: '#10B981', fontWeight: 900 }}>{analysisResult.rating}</div>
                    </div>
                </div>
            </div>
        </div>
      )}
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*\)\s*}/,
  `${modalInjection}\n      </div>\n    </div>\n  </div>\n)}`
);

fs.writeFileSync('src/ShopAnalyzerTab.jsx', content, 'utf8');
console.log('Injected Marketing Analysis button and logic!');
