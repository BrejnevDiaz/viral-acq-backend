import { useState, useRef, useEffect } from "react";
import { UI_TEXT, ELITE_UI_TEXT, getBotResponse, isAdvancedEcomQuestion, UPSELL_MESSAGE } from "./chatbotKnowledge";
import { getTierRank, TIER_RANK } from "./tierConfig";
import { apiFetch } from "./utils/apiClient";
import ReactMarkdown from "react-markdown";

export default function CoachIATab({ c, mono, uiLang = "fr", userTier = "free", API_URL, onUpgradeClick }) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const isElite = getTierRank(userTier) >= TIER_RANK.elite;
  const t = (isElite ? ELITE_UI_TEXT[uiLang] : UI_TEXT[uiLang]) || (isElite ? ELITE_UI_TEXT.fr : UI_TEXT.fr);

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
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", background: c.card, border: `1px solid ${c.border}`, borderRadius: 20, overflow: "hidden", position: "relative" }}>
      {/* Premium glow effect for Elite */}
      {isElite && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #EAB308, #EC4899, transparent)", opacity: 0.8, zIndex: 10 }} />
      )}
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 32px", borderBottom: `1px solid ${c.border}`, background: headerGradient }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: avatarGradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 24, flexShrink: 0, boxShadow: isElite ? "0 4px 20px rgba(234,179,8,0.4)" : "0 4px 20px rgba(139,92,246,0.3)" }}>
          {isElite ? "💎" : "AP"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="outfit" style={{ fontSize: 24, fontWeight: 800, color: c.text, letterSpacing: "-0.5px" }}>{t.header}</div>
          <div style={{ fontSize: 13, color: isElite ? "#EAB308" : "#10B981", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginTop: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: isElite ? "#EAB308" : "#10B981", display: "inline-block", boxShadow: `0 0 8px ${isElite ? "#EAB308" : "#10B981"}` }} />
            {t.subheader}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 24, background: c.bg }}>
        {/* Initial Greeting */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "75%" }}>
            <div style={{ fontSize: 12, color: c.textDim, fontWeight: 600, marginLeft: 16 }}>{t.header}</div>
            <div style={{
              padding: "16px 20px", borderRadius: "20px 20px 20px 4px",
              background: c.surface, border: `1px solid ${c.border}`,
              color: c.text, fontSize: 15, lineHeight: 1.6, boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}>
              {t.greeting}
            </div>
          </div>
        </div>

        {/* Conversation Messages */}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", gap: 6 }}>
            {m.role === "bot" && <div style={{ fontSize: 12, color: c.textDim, fontWeight: 600, marginLeft: 16 }}>{t.header}</div>}
            <div className={m.role === "bot" ? "markdown-body" : ""} style={{
              maxWidth: "75%", padding: "16px 20px", borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              background: m.role === "user" ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : c.surface,
              color: m.role === "user" ? "#fff" : c.text, fontSize: 15, lineHeight: 1.6,
              border: m.role === "user" ? "none" : `1px solid ${c.border}`,
              boxShadow: m.role === "user" ? "0 8px 16px rgba(124,58,237,0.2)" : "0 4px 12px rgba(0,0,0,0.05)"
            }}>
              {m.role === "bot" ? (
                <ReactMarkdown>{m.text || ""}</ReactMarkdown>
              ) : (
                m.text
              )}
            </div>
            {m.sources && m.sources.length > 0 && (
              <div style={{ marginTop: 4, fontSize: 12, color: c.textMuted, maxWidth: "75%" }}>
                📚 {uiLang === "fr" ? "Basé sur" : uiLang === "it" ? "Basato su" : "Based on"} : {[...new Set(m.sources.map(s => s.file))].slice(0, 2).join(", ")}
              </div>
            )}
            {m.isUpsell && (
              <button onClick={onUpgradeClick} className="hover-lift" style={{
                marginTop: 8, padding: "12px 24px", borderRadius: 12, border: "none",
                background: "linear-gradient(90deg, #EAB308, #F59E0B)", color: "#000", fontWeight: 800,
                fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 8px 16px rgba(234,179,8,0.3)"
              }}>
                💎 {uiLang === "fr" ? "Débloquer VIP Elite" : uiLang === "it" ? "Sblocca VIP Elite" : "Unlock VIP Elite"}
              </button>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start", gap: 6, flexDirection: "column" }}>
            <div style={{ fontSize: 12, color: c.textDim, fontWeight: 600, marginLeft: 16 }}>{t.header}</div>
            <div style={{ padding: "18px 20px", borderRadius: "20px 20px 20px 4px", background: c.surface, border: `1px solid ${c.border}`, display: "flex", gap: 6 }}>
              <span className="chat-typing-dot" style={{ animationDelay: "0s" }} />
              <span className="chat-typing-dot" style={{ animationDelay: "0.15s" }} />
              <span className="chat-typing-dot" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: "20px 32px", borderTop: `1px solid ${c.border}`, background: c.surface }}>
        <div style={{ display: "flex", gap: 12, background: c.bg, padding: 8, borderRadius: 16, border: `1px solid ${c.border}`, alignItems: "center" }}>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            placeholder={t.placeholder}
            style={{ flex: 1, padding: "12px 16px", background: "transparent", border: "none", color: c.text, fontSize: 15, fontFamily: mono, outline: "none" }}
          />
          <button onClick={handleSend} disabled={!inputValue.trim() || isTyping} style={{
            width: 48, height: 48, borderRadius: 12, border: "none", flexShrink: 0,
            background: inputValue.trim() && !isTyping ? bubbleGradient : c.border,
            color: inputValue.trim() && !isTyping ? (isElite ? "#000" : "#fff") : c.textMuted,
            cursor: inputValue.trim() && !isTyping ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s"
          }} aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
      
      <style>{`
        .chat-typing-dot {
          width: 8px; height: 8px; border-radius: 50%; background: ${c.textMuted};
          display: inline-block; animation: chatTypingBounce 1s infinite ease-in-out;
        }
        @keyframes chatTypingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .markdown-body {
          font-family: inherit;
        }
        .markdown-body p { margin: 0 0 1em 0; }
        .markdown-body p:last-child { margin: 0; }
        .markdown-body strong { font-weight: 700; color: ${isElite ? '#EAB308' : 'inherit'}; }
        .markdown-body ul, .markdown-body ol { margin: 0 0 1em 0; padding-left: 1.5em; }
        .markdown-body li { margin-bottom: 0.5em; }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 { margin: 1em 0 0.5em 0; font-weight: 700; }
        .markdown-body h1:first-child, .markdown-body h2:first-child, .markdown-body h3:first-child { margin-top: 0; }
      `}</style>
    </div>
  );
}
