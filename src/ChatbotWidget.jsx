import { useState, useRef, useEffect } from "react";
import { UI_TEXT, ELITE_UI_TEXT, getBotResponse, isAdvancedEcomQuestion, UPSELL_MESSAGE, buildChatRequestPayload } from "./chatbotKnowledge";
import { getTierRank, TIER_RANK } from "./tierConfig";
import { apiFetch } from "./utils/apiClient";

export default function ChatbotWidget({ uiLang = "fr", userTier = "free", API_URL, onUpgradeClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const isElite = getTierRank(userTier) >= TIER_RANK.elite;
  const t = (isElite ? ELITE_UI_TEXT[uiLang] : UI_TEXT[uiLang]) || (isElite ? ELITE_UI_TEXT.fr : UI_TEXT.fr);

  // The greeting is rendered straight from `t.greeting` below (not stored in
  // `messages`), so it always reflects the current uiLang/tier — no seeding
  // step, no stale copy left behind after a language switch.
  const handleToggle = () => setIsOpen(v => !v);

  // Lets other parts of the app (e.g. Sidebar's "Support" menu item) open this
  // widget without lifting isOpen state up through every layout component.
  useEffect(() => {
    const openChatbot = () => setIsOpen(true);
    window.addEventListener("va-open-chatbot", openChatbot);
    return () => window.removeEventListener("va-open-chatbot", openChatbot);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;
    const history = messages;
    setMessages(prev => [...prev, { role: "user", text }]);
    setInputValue("");

    setIsTyping(true);
    try {
      // Gideon RAG : le serveur détermine le tier de savoir depuis le JWT
      // (profiles.plan/role) — créateurs Standard = viralité/UGC, VIP Pro =
      // marketing, VIP Elite = tout. Free reçoit restricted:true → upsell.
      const res = await apiFetch(`${API_URL}/api/gideon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          conversationHistory: history.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
        }),
      });
      if (!res.ok) throw new Error("Gideon API not ready yet");
      const data = await res.json();
      if (data.restricted) {
        setMessages(prev => [...prev, { role: "bot", text: data.answer, isUpsell: true }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: data.answer, sources: data.sources }]);
      }
    } catch (err) {
      // Backend indisponible ou non configuré — repli sur la simulation locale
      // (avec le gate upsell historique) pour que le widget reste utile.
      console.error("⚠️ Gideon API error:", err);
      if (!isElite && isAdvancedEcomQuestion(text)) {
        setMessages(prev => [...prev, { role: "bot", text: UPSELL_MESSAGE[uiLang] || UPSELL_MESSAGE.fr, isUpsell: true }]);
      } else {
        const reply = getBotResponse(text, uiLang);
        setMessages(prev => [...prev, { role: "bot", text: reply }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const headerGradient = isElite ? "linear-gradient(90deg, rgba(234,179,8,0.2), rgba(236,72,153,0.1))" : "linear-gradient(90deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))";
  const avatarGradient = isElite ? "linear-gradient(135deg, #EAB308, #EC4899)" : "linear-gradient(135deg, #8B5CF6, #EC4899)";
  const bubbleGradient = isElite ? "linear-gradient(135deg, #EAB308, #F59E0B)" : "linear-gradient(135deg, #8B5CF6, #EC4899)";

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="modal-pop" style={{
          position: "fixed", bottom: 96, right: 24, width: 360, maxWidth: "calc(100vw - 32px)", height: 500, maxHeight: "calc(100vh - 140px)",
          background: "rgba(20,20,24,0.97)", border: `1px solid ${isElite ? "rgba(234,179,8,0.25)" : "rgba(255,255,255,0.1)"}`, borderRadius: 20,
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${isElite ? "rgba(234,179,8,0.15)" : "rgba(139,92,246,0.1)"}`, backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 999
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: headerGradient }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: avatarGradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
              {isElite ? "💎" : "AP"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{t.header}</div>
              <div style={{ fontSize: 11.5, color: isElite ? "#EAB308" : "#10B981", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: isElite ? "#EAB308" : "#10B981", display: "inline-block" }} />
                {t.subheader}
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#A1A1AA", cursor: "pointer", fontSize: 18, padding: 4 }} aria-label="Close chat">✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                maxWidth: "80%", padding: "10px 14px", borderRadius: "14px 14px 14px 2px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.05)",
                color: "#E4E4E7", fontSize: 13.5, lineHeight: 1.5
              }}>
                {t.greeting}
              </div>
            </div>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  background: m.role === "user" ? "linear-gradient(90deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.06)",
                  color: m.role === "user" ? "#fff" : "#E4E4E7", fontSize: 13.5, lineHeight: 1.5,
                  border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.05)"
                }}>
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 10.5, color: "#71717A", maxWidth: "80%" }}>
                    📚 {uiLang === "fr" ? "Basé sur" : uiLang === "it" ? "Basato su" : "Based on"} : {[...new Set(m.sources.map(s => s.file))].slice(0, 2).join(", ")}
                  </div>
                )}
                {m.isUpsell && (
                  <button onClick={onUpgradeClick} className="hover-lift" style={{
                    marginTop: 8, padding: "8px 16px", borderRadius: 8, border: "none",
                    background: "linear-gradient(90deg, #EAB308, #F59E0B)", color: "#000", fontWeight: 800,
                    fontSize: 12.5, cursor: "pointer"
                  }}>
                    💎 {uiLang === "fr" ? "Débloquer VIP Elite" : uiLang === "it" ? "Sblocca VIP Elite" : "Unlock VIP Elite"}
                  </button>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 2px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 4 }}>
                  <span className="chat-typing-dot" style={{ animationDelay: "0s" }} />
                  <span className="chat-typing-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="chat-typing-dot" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              placeholder={t.placeholder}
              className="input-premium"
              style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 13.5, outline: "none" }}
            />
            <button onClick={handleSend} disabled={!inputValue.trim() || isTyping} style={{
              width: 40, height: 40, borderRadius: 10, border: "none", flexShrink: 0,
              background: inputValue.trim() && !isTyping ? bubbleGradient : "rgba(255,255,255,0.08)",
              color: isElite ? "#000" : "#fff", cursor: inputValue.trim() && !isTyping ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center"
            }} aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={handleToggle}
        className="hover-lift"
        style={{
          position: "fixed", bottom: 24, right: 24, width: 60, height: 60, borderRadius: "50%", border: "none",
          background: bubbleGradient, color: isElite ? "#000" : "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
          boxShadow: isOpen
            ? `0 8px 24px ${isElite ? "rgba(234,179,8,0.4)" : "rgba(139,92,246,0.4)"}`
            : `0 8px 24px ${isElite ? "rgba(234,179,8,0.5)" : "rgba(139,92,246,0.5)"}, 0 0 0 6px ${isElite ? "rgba(234,179,8,0.12)" : "rgba(139,92,246,0.12)"}`
        }}
        aria-label={t.bubbleLabel}
        title={t.bubbleLabel}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : isElite ? (
          <span style={{ fontSize: 24 }}>💎</span>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        )}
      </button>

      <style>{`
        .chat-typing-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #A1A1AA;
          display: inline-block; animation: chatTypingBounce 1s infinite ease-in-out;
        }
        @keyframes chatTypingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
