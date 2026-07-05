import { useState, useRef, useEffect } from "react";
import { DM_CONVERSATIONS, DM_QUICK_REPLIES } from "./dmConversations";

const T = {
  fr: { online: "En ligne", placeholder: "Écris ton message...", empty: "Démarre la conversation avec ce créateur.", quickTitle: "Réponses rapides" },
  en: { online: "Online", placeholder: "Type your message...", empty: "Start the conversation with this creator.", quickTitle: "Quick replies" },
  it: { online: "Online", placeholder: "Scrivi il tuo messaggio...", empty: "Inizia la conversazione con questo creator.", quickTitle: "Risposte rapide" },
};

export default function DirectMessagePanel({ video, uiLang, onClose }) {
  const [messages, setMessages] = useState(() => DM_CONVERSATIONS[video.username] || []);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);
  const t = T[uiLang] || T.fr;
  const quickReplies = DM_QUICK_REPLIES[uiLang] || DM_QUICK_REPLIES.fr;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const nowLabel = () => new Date().toLocaleTimeString(uiLang === "fr" ? "fr-FR" : uiLang === "it" ? "it-IT" : "en-US", { hour: "2-digit", minute: "2-digit" });

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { sender: "brand", text: trimmed, time: nowLabel() }]);
    setInputValue("");
    // UI-only mock: simulate a lightweight creator acknowledgement so the thread feels alive.
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "creator", text: "👍", time: nowLabel() }]);
    }, 1200);
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1400, animation: "fadeIn 0.2s ease-out" }} />

      {/* Slide-over panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400, maxWidth: "100vw",
        background: "#0c0c10", borderLeft: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.6)", zIndex: 1401,
        display: "flex", flexDirection: "column", animation: "dmSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(90deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))" }}>
          <img src={`https://ui-avatars.com/api/?name=${video.username}&background=8B5CF6&color=fff&rounded=true`} alt={video.username} style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>@{video.username}</div>
            <div style={{ fontSize: 11.5, color: "#10B981", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
              {t.online}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#A1A1AA", cursor: "pointer", fontSize: 20, padding: 4 }} aria-label="Close">✕</button>
        </div>

        {/* Product context strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <span style={{ fontSize: 11, color: "#71717A" }}>{uiLang === "fr" ? "À propos de :" : uiLang === "it" ? "A proposito di:" : "Regarding:"}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#E4E4E7" }}>{video.product}</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#10B981", marginLeft: "auto" }}>{video.price}</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "18px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#71717A", fontSize: 13, fontStyle: "italic", marginTop: 40 }}>{t.empty}</div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.sender === "brand" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "78%", padding: "10px 14px", borderRadius: m.sender === "brand" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.sender === "brand" ? "linear-gradient(90deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.07)",
                color: m.sender === "brand" ? "#fff" : "#E4E4E7", fontSize: 13.5, lineHeight: 1.5,
                border: m.sender === "brand" ? "none" : "1px solid rgba(255,255,255,0.05)"
              }}>
                {m.text}
              </div>
              <span style={{ fontSize: 10, color: "#52525B", marginTop: 3, padding: "0 4px" }}>{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div style={{ padding: "0 16px 10px 16px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {quickReplies.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)} className="hover-bg-white-10" style={{
              padding: "6px 12px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent", color: "#A1A1AA", fontSize: 11.5, cursor: "pointer", transition: "background 0.2s"
            }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 8, padding: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") sendMessage(inputValue); }}
            placeholder={t.placeholder}
            className="input-premium"
            style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 13.5, outline: "none" }}
          />
          <button onClick={() => sendMessage(inputValue)} disabled={!inputValue.trim()} style={{
            width: 42, height: 42, borderRadius: 10, border: "none", flexShrink: 0,
            background: inputValue.trim() ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "rgba(255,255,255,0.08)",
            color: "#fff", cursor: inputValue.trim() ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center"
          }} aria-label="Send message">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dmSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
