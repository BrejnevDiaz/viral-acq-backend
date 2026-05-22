import React, { useState } from 'react';

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

export default function VettingTab({ c, mono, API_URL, uiLang, t }) {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setError(null);
    setData(null);

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
        body: JSON.stringify({ username: cleanUsername, platform })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Une erreur est survenue");
      setData(json);
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
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      {/* Search form */}
      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: 16, fontFamily: mono, color: c.text }}>🕵️‍♂️ Analyse de Profils (Vetting)</h2>
        <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 24, lineHeight: 1.5 }}>
          Détectez les faux abonnés et analysez la qualité de l'audience d'un influenceur avant de le proposer à vos clients.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <select 
            value={platform} 
            onChange={e => setPlatform(e.target.value)}
            style={{ padding: "14px 16px", borderRadius: 11, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 14, fontFamily: mono, cursor: "pointer" }}
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>

          <input 
            type="text" 
            placeholder="@pseudo ou lien du profil" 
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
            {loading ? "Analyse..." : "Analyser"}
          </button>
        </form>
        {error && <div style={{ marginTop: 16, color: c.error, fontSize: 13, background: c.errorBg, padding: "10px 14px", borderRadius: 8 }}>{error}</div>}
      </div>

      {/* Results */}
      {data && (
        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 24, animation: "fadeInUp 0.5s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
            <img src={data.profilePic} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `2px solid ${c.border}` }} />
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: 20, color: c.text, display: "flex", alignItems: "center", gap: 8 }}>
                {data.platform === "instagram" ? <InstaIcon /> : <TikTokIcon />}
                @{data.username}
              </h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: c.textMuted, fontFamily: mono }}>👥 {data.followersCount.toLocaleString()} abonnés</span>
                <span style={{ fontSize: 13, color: c.textMuted, fontFamily: mono }}>📈 {data.engagementRate} d'engagement</span>
              </div>
            </div>
            
            {/* Trust Score Gauge */}
            <div style={{ marginLeft: "auto", textAlign: "center", background: c.bg, padding: "12px 20px", borderRadius: 12, border: `1px solid ${c.border}` }}>
              <div style={{ fontSize: 11, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Trust Score</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: getScoreColor(data.trustScore) }}>
                {data.trustScore}<span style={{ fontSize: 16, color: c.textMuted }}>/100</span>
              </div>
            </div>
          </div>

          <div style={{ background: c.bg, borderRadius: 12, padding: 16, border: `1px solid ${c.border}`, marginBottom: 24 }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: 12, textTransform: "uppercase", color: c.textMuted, fontFamily: mono }}>🤖 Analyse IA (Commentaires & Audience)</h4>
            <p style={{ margin: 0, fontSize: 14, color: c.text, lineHeight: 1.6 }}>{data.aiSummary}</p>
          </div>

          {data.latestPosts && data.latestPosts.length > 0 && (
            <div>
              <h4 style={{ margin: "0 0 12px 0", fontSize: 12, textTransform: "uppercase", color: c.textMuted, fontFamily: mono }}>Derniers Posts</h4>
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
        </div>
      )}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
