import { useState, useRef, useEffect } from "react";
import DirectMessagePanel from "./DirectMessagePanel";

// ─── Mock UGC video catalogue (interface only — purchase logic wired later) ───
const VIDEOS = [
  { id: "v1", username: "diariatou_sow", niche: "Beauté", src: "https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4", product: "Sérum Éclat Vitamine C", price: "34,90 €", likes: "12.4k", comments: "284" },
  { id: "v2", username: "skincare_goddess", niche: "Beauté", src: "https://cdn.pixabay.com/video/2023/10/22/185966-876722008_tiny.mp4", product: "Crème Nuit Anti-Âge", price: "42,00 €", likes: "8.9k", comments: "156" },
  { id: "v3", username: "fashion_nova", niche: "Mode", src: "https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4", product: "Sac Cabas Cuir Végan", price: "59,90 €", likes: "21.1k", comments: "412" },
  { id: "v4", username: "fitfluencer.co", niche: "Fitness", src: "https://cdn.pixabay.com/video/2023/10/22/185966-876722008_tiny.mp4", product: "Résistance Bands Pro Set", price: "24,90 €", likes: "6.2k", comments: "98" },
  { id: "v5", username: "lena.situations", niche: "Lifestyle", src: "https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4", product: "Bougie Parfumée Signature", price: "18,50 €", likes: "34.7k", comments: "521" },
  { id: "v6", username: "marie.lopez", niche: "Beauté", src: "https://cdn.pixabay.com/video/2023/10/22/185966-876722008_tiny.mp4", product: "Palette Yeux 12 Teintes", price: "29,90 €", likes: "15.8k", comments: "203" },
];

const T = {
  fr: { title: "Marketplace Vidéo", subtitle: "L'UGC de vos créateurs, en scroll infini — repérez, swipez, achetez.", buy: "Acheter", soon: "🛒 Paiement en un clic — bientôt disponible !", dm: "Message", searchPlaceholder: "Rechercher par créateur, produit, mot-clé...", allNiches: "Toutes niches", noResults: "Aucune vidéo ne correspond à votre recherche." },
  en: { title: "Video Marketplace", subtitle: "Your creators' UGC, in infinite scroll — spot it, swipe it, buy it.", buy: "Buy", soon: "🛒 One-click checkout — coming soon!", dm: "Message", searchPlaceholder: "Search by creator, product, keyword...", allNiches: "All niches", noResults: "No videos match your search." },
  it: { title: "Marketplace Video", subtitle: "L'UGC dei tuoi creator, a scorrimento infinito — scopri, swipa, acquista.", buy: "Acquista", soon: "🛒 Pagamento in un clic — disponibile a breve!", dm: "Messaggio", searchPlaceholder: "Cerca per creator, prodotto, parola chiave...", allNiches: "Tutte le nicchie", noResults: "Nessun video corrisponde alla tua ricerca." },
};

export default function VideoMarketplaceTab({ c, mono, uiLang }) {
  const [toast, setToast] = useState(null);
  const [dmVideo, setDmVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNiche, setActiveNiche] = useState("all");
  const t = T[uiLang] || T.fr;

  const niches = ["all", ...new Set(VIDEOS.map(v => v.niche))];
  const filteredVideos = VIDEOS.filter(video => {
    const matchesNiche = activeNiche === "all" || video.niche === activeNiche;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || [video.username, video.product, video.niche].some(field => field.toLowerCase().includes(q));
    return matchesNiche && matchesQuery;
  });

  // Only the slide actually in view should decode/play — with autoPlay on every
  // <video>, all of them streamed and decoded concurrently regardless of scroll
  // position. An IntersectionObserver plays the visible slide and pauses the rest.
  const scrollRef = useRef(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { root: container, threshold: [0, 0.6] });

    Object.values(videoRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filteredVideos]);

  const handleBuy = (video) => {
    setToast(video.id);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="video-feed-header" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #EC4899, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px rgba(236,72,153,0.3)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="3"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none"/></svg>
          </div>
          {t.title}
        </h2>
        <p className="video-feed-subtitle" style={{ color: c.textMuted, margin: 0, fontSize: 14 }}>{t.subtitle}</p>
      </div>

      {/* Search & niche filters — lets brands find specific creator UGC by keyword */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.textDim} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="input-premium"
            style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12, border: `1px solid ${c.border}`, background: c.card, color: c.text, fontSize: 13.5, outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          {niches.map(niche => (
            <button
              key={niche}
              onClick={() => setActiveNiche(niche)}
              style={{
                padding: "6px 14px", borderRadius: 20, border: `1px solid ${activeNiche === niche ? "transparent" : c.border}`,
                background: activeNiche === niche ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "transparent",
                color: activeNiche === niche ? "#fff" : c.textMuted, fontSize: 12, fontWeight: 700, fontFamily: mono, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {niche === "all" ? t.allNiches : niche}
            </button>
          ))}
        </div>
      </div>

      <div className="video-feed-outer" style={{ display: "flex", justifyContent: "center" }}>
        <div ref={scrollRef} className="video-feed-scroll" style={{
          width: "100%", maxWidth: 420, height: "78vh", borderRadius: 24, overflowY: "scroll",
          scrollSnapType: "y mandatory", background: "#000", border: `1px solid ${c.border}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)", position: "relative"
        }}>
          {filteredVideos.length === 0 && (
            <div className="video-slide" style={{ height: "78vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#A1A1AA", fontSize: 14, textAlign: "center", padding: 24 }}>
              {t.noResults}
            </div>
          )}
          {filteredVideos.map(video => (
            <div key={video.id} className="video-slide" style={{ height: "78vh", scrollSnapAlign: "start", scrollSnapStop: "always", position: "relative", overflow: "hidden" }}>
              <video
                ref={el => { videoRefs.current[video.id] = el; }}
                src={video.src} loop muted playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Gradient overlay for legibility */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.9) 100%)", pointerEvents: "none" }} />

              {/* Bottom-left: creator + product info */}
              <div style={{ position: "absolute", bottom: 20, left: 16, right: 90, color: "#fff" }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  @{video.username}
                  <span style={{ fontSize: 10, background: "rgba(139,92,246,0.4)", padding: "2px 8px", borderRadius: 10, fontWeight: 700, textTransform: "uppercase" }}>{video.niche}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{video.product}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#10B981", fontFamily: mono }}>{video.price}</div>
              </div>

              {/* Right-side action rail (TikTok-style) */}
              <div style={{ position: "absolute", bottom: 24, right: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M12 21s-6.7-4.35-9.3-8.1C.6 10 1.4 6 5 4.6 7.2 3.7 9.6 4.6 12 7.3c2.4-2.7 4.8-3.6 7-2.7 3.6 1.4 4.4 5.4 2.3 8.3C18.7 16.65 12 21 12 21z"/></svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{video.likes}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{video.comments}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff" }}>
                  <button onClick={() => setDmVideo(video)} className="hover-lift" style={{
                    width: 42, height: 42, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff"
                  }} title={t.dm}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{t.dm}</span>
                </div>
                <button onClick={() => handleBuy(video)} className="hover-lift" style={{
                  width: 52, height: 52, borderRadius: "50%", border: "none",
                  background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(16,185,129,0.5)", fontSize: 22
                }} title={t.buy}>
                  🛒
                </button>
              </div>

              {toast === video.id && (
                <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.85)", color: "#fff", padding: "10px 20px", borderRadius: 30, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", animation: "fadeIn 0.2s ease-out" }}>
                  {t.soon}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {dmVideo && <DirectMessagePanel video={dmVideo} uiLang={uiLang} onClose={() => setDmVideo(null)} />}

      <style>{`
        .video-feed-scroll::-webkit-scrollbar { display: none; }
        .video-feed-scroll { scrollbar-width: none; }

        /* Native-app feel on phones: edge-to-edge, taller, no rounded "card" look */
        @media (max-width: 768px) {
          .video-feed-header { margin-bottom: 10px !important; }
          .video-feed-subtitle { display: none !important; }
          .video-feed-outer { margin: 0 -16px !important; }
          .video-feed-scroll {
            max-width: 100% !important; border-radius: 0 !important;
            border-left: none !important; border-right: none !important;
            height: calc(100dvh - 130px) !important; box-shadow: none !important;
          }
          .video-feed-scroll .video-slide { height: calc(100dvh - 130px) !important; }
        }
      `}</style>
    </div>
  );
}
