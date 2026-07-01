import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const InstaIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#E1306C" }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#69C9D0" }}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

export default function VettingTab({ c, mono, API_URL, uiLang, t, userId }) {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const key = `vetting_history_${userId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) { }
    } else {
      setHistory([]);
    }
  }, [userId]);

  const saveToHistory = (newRec) => {
    setHistory(prev => {
      const updated = [newRec, ...prev.filter(h => h.username !== newRec.username)].slice(0, 50);
      localStorage.setItem(`vetting_history_${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const el = document.getElementById("vetting-result-card");
      if (!el) return;
      const canvas = await html2canvas(el, { backgroundColor: c.bg });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Vetting_${data.username}.pdf`);
    } catch (e) {
      console.error("PDF Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const runDeepAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/api/vetting/analyze-deep`, {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username: data.username, platform: data.platform })
      });
      const resData = await res.json();
      setDeepAnalysis(resData.report);
    } catch(e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setError(null);
    setData(null);
    setDeepAnalysis(null);

    // Clean username if user pastes a URL
    let cleanUsername = username.trim();
    if (cleanUsername.includes("instagram.com/")) {
      cleanUsername = cleanUsername.split("instagram.com/")[1].split("/")[0].split("?")[0];
    } else if (cleanUsername.includes("tiktok.com/@")) {
      cleanUsername = cleanUsername.split("tiktok.com/@")[1].split("/")[0].split("?")[0];
    }
    if (cleanUsername.startsWith("@")) cleanUsername = cleanUsername.substring(1);

    try {
      const res = await fetch(`${API_URL}/api/vetting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername, platform, lang: uiLang })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Une erreur est survenue");
      setData(json);
      
      // Save to local history per user
      saveToHistory({
        username: cleanUsername,
        platform,
        profilePic: json.profilePic,
        score: json.score,
        engagement: json.metrics.engagementRate
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return c.success;
    if (score >= 50) return c.warning;
    return c.error;
  };

  return (
    <div style={{ display: "flex", gap: 24, animation: "fadeIn 0.4s ease-out", flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ flex: "1 1 600px", minWidth: 0 }}>
        {/* Search form */}
      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: 16, fontFamily: mono, color: c.text }}>🕵️‍♂️ {t("vettingTitle")}</h2>
        <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 24, lineHeight: 1.5 }}>
          {t("vettingDesc")}
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: c.card, borderRadius: 11, border: `1.5px solid ${c.border}`, overflow: "hidden" }}>
            <button 
              type="button" 
              onClick={() => setPlatform('instagram')} 
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", border: "none", background: platform === 'instagram' ? `linear-gradient(135deg, ${c.accent}22, transparent)` : "transparent", color: c.text, cursor: "pointer", borderRight: `1px solid ${c.border}`, transition: "all 0.2s" }}
            >
              <InstaIcon /> <span style={{ fontSize: 13, fontWeight: platform === 'instagram' ? "bold" : "normal" }}>Insta</span>
            </button>
            <button 
              type="button" 
              onClick={() => setPlatform('tiktok')} 
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", border: "none", background: platform === 'tiktok' ? `linear-gradient(135deg, ${c.accent}22, transparent)` : "transparent", color: c.text, cursor: "pointer", transition: "all 0.2s" }}
            >
              <TikTokIcon /> <span style={{ fontSize: 13, fontWeight: platform === 'tiktok' ? "bold" : "normal" }}>TikTok</span>
            </button>
          </div>

          <input 
            type="text" 
            placeholder={t("vettingPh")}
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "14px 16px", borderRadius: 11, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 14, transition: "border-color 0.2s" }}
            onFocus={e=>e.target.style.borderColor=c.accent} 
            onBlur={e=>e.target.style.borderColor=c.border}
          />

          <button 
            type="submit" 
            disabled={loading || !username}
            style={{ padding: "14px 24px", borderRadius: 11, border: "none", background: loading ? c.border : c.accent, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: mono, cursor: loading ? "not-allowed" : "pointer", transition: "transform 0.1s" }}
            onMouseDown={e=>!loading && (e.target.style.transform="scale(0.96)")} 
            onMouseUp={e=>!loading && (e.target.style.transform="scale(1)")}
          >
            {loading ? t("vettingBtnLoad") : t("vettingBtn")}
          </button>
        </form>
        {error && <div style={{ marginTop: 16, color: c.error, fontSize: 13, background: c.errorBg, padding: "10px 14px", borderRadius: 8 }}>{error}</div>}
      </div>

      {/* Results */}
      {data && (
        <div id="vetting-result-card" style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 24, animation: "fadeInUp 0.5s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
            <img src={`${API_URL}/api/image-proxy?url=${encodeURIComponent(data.profilePic)}`} onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${data.username}&background=333&color=fff&size=150&rounded=true`; }} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `2px solid ${c.border}` }} />
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: 20, color: c.text, display: "flex", alignItems: "center", gap: 8 }}>
                {data.platform === "instagram" ? <InstaIcon /> : <TikTokIcon />}
                @{data.username}
              </h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: c.textMuted, fontFamily: mono }}>👥 {data.followersCount.toLocaleString()} {t("vettingSub")}</span>
                <span style={{ fontSize: 13, color: c.textMuted, fontFamily: mono }}>📈 {data.engagementRate} {t("vettingEng")}</span>
              </div>
            </div>
            
            {/* Trust Score Gauge */}
            <div style={{ marginLeft: "auto", textAlign: "center", background: c.bg, padding: "12px 20px", borderRadius: 12, border: `1px solid ${c.border}` }}>
              <div style={{ fontSize: 11, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Trust Score</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: getScoreColor(data.trustScore) }}>
                {data.trustScore}<span style={{ fontSize: 16, color: c.textMuted }}>/100</span>
              </div>
            </div>

            {/* ROI Estimate */}
            {data.estimatedROI && (
              <div style={{ marginLeft: 16, textAlign: "center", background: c.bg, padding: "12px 20px", borderRadius: 12, border: `1px solid ${c.border}` }}>
                <div style={{ fontSize: 11, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>ROI Estimé</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: c.success }}>
                  {data.estimatedROI}
                </div>
              </div>
            )}
          </div>

          <div style={{ background: c.bg, borderRadius: 12, padding: 16, border: `1px solid ${c.border}`, marginBottom: 24 }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: 12, textTransform: "uppercase", color: c.textMuted, fontFamily: mono }}>{t("vettingAi")}</h4>
            <p style={{ margin: 0, fontSize: 14, color: c.text, lineHeight: 1.6 }}>{data.aiSummary}</p>
          </div>

          {data.latestPosts && data.latestPosts.length > 0 && (
            <div>
              <h4 style={{ margin: "0 0 12px 0", fontSize: 12, textTransform: "uppercase", color: c.textMuted, fontFamily: mono }}>{t("vettingPosts")}</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                {data.latestPosts.map((post, i) => (
                  <a key={i} href={post.url} target="_blank" rel="noreferrer" style={{ display: "block", background: c.bg, borderRadius: 10, padding: 12, border: `1px solid ${c.border}`, textDecoration: "none", transition: "transform 0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                    <div style={{ fontSize: 12, color: c.text, marginBottom: 4 }}>❤️ {post.likes}</div>
                    <div style={{ fontSize: 12, color: c.textMuted }}>💬 {post.comments}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 10 }} data-html2canvas-ignore="true">
            <button onClick={exportPDF} disabled={isExporting} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.card, color: c.textMuted, fontSize: 13, fontWeight: 600, fontFamily: mono, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {isExporting ? "⏳ Génération PDF..." : "📄 Exporter PDF"}
            </button>
            <button onClick={runDeepAnalysis} disabled={analyzing} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: mono, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {analyzing ? "🔍 Analyse des 10 posts..." : "🔍 Analyse Profonde (10 posts)"}
            </button>
          </div>

          {deepAnalysis && (
            <div style={{ marginTop: 24, padding: 20, background: "rgba(0,0,0,0.2)", border: `1px solid ${c.border}`, borderRadius: 12 }}>
              <h4 style={{ margin: "0 0 12px 0", color: c.accent, fontSize: 15, fontFamily: mono }}>🤖 Rapport d'Analyse IA</h4>
              <div style={{ whiteSpace: "pre-wrap", fontSize: 13, color: c.text, lineHeight: 1.6 }}>{deepAnalysis}</div>
            </div>
          )}
        </div>
      )}
      </div>

      {/* Sidebar Historique */}
      <div style={{ flex: "0 0 320px", background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, minHeight: 400 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontFamily: mono, color: c.text }}>📜 Historique ({history.length})</h3>
        {history.length === 0 ? (
          <p style={{ color: c.textMuted, fontSize: 13 }}>Aucun historique disponible.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((h, idx) => (
              <div key={idx} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={h.profilePic ? `${API_URL}/api/image-proxy?url=${encodeURIComponent(h.profilePic)}` : `https://ui-avatars.com/api/?name=${h.username}&background=333&color=fff&size=50&rounded=true`} alt="Profile" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `1px solid ${c.border}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: c.text }}>@{h.username}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: (h.score || h.trust_score) >= 80 ? c.success : ((h.score || h.trust_score) >= 50 ? c.warning : c.error) }}>
                        {h.score || h.trust_score}/100
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                      <span style={{ color: c.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                        {h.platform === 'instagram' ? <InstaIcon /> : <TikTokIcon />} {h.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                      </span>
                      <span style={{ color: c.textMuted }}>{h.engagement}% eng</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
