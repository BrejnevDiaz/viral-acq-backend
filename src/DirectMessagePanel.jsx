// ─── Messagerie marque ↔ créateur (Chantier #18) ─────────────────────────────
// Ce panneau était entièrement factice : les messages vivaient en mémoire et un
// 👍 automatique arrivait après 1,2 s. Il est désormais branché sur la vraie
// messagerie (marketplace_threads / marketplace_messages) et le créateur reçoit
// une notification email.
import { useState, useRef, useEffect, useCallback } from "react";
import { DM_QUICK_REPLIES } from "./dmConversations";
import { fetchThreadMessages, findThreadForVideo, sendMarketplaceMessage } from "./utils/marketplaceCommerce";

const T = {
  fr: { online: "En ligne", placeholder: "Écris ton message...", empty: "Démarre la conversation avec ce créateur.", quickTitle: "Réponses rapides",
        loading: "Chargement de la conversation...", sending: "Envoi...", you: "Vous",
        demo: "Vidéo d'exemple : aucun créateur réel derrière, l'envoi est désactivé.",
        notified: "Le créateur est prévenu par email." },
  en: { online: "Online", placeholder: "Type your message...", empty: "Start the conversation with this creator.", quickTitle: "Quick replies",
        loading: "Loading conversation...", sending: "Sending...", you: "You",
        demo: "Sample video: no real creator behind it, sending is disabled.",
        notified: "The creator is notified by email." },
  it: { online: "Online", placeholder: "Scrivi il tuo messaggio...", empty: "Inizia la conversazione con questo creator.", quickTitle: "Risposte rapide",
        loading: "Caricamento della conversazione...", sending: "Invio...", you: "Tu",
        demo: "Video di esempio: nessun creator reale dietro, l'invio è disabilitato.",
        notified: "Il creator riceve una notifica via email." },
};

export default function DirectMessagePanel({ video, uiLang, onClose, API_URL, userId, isDemo = false }) {
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(!isDemo);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const t = T[uiLang] || T.fr;
  const quickReplies = DM_QUICK_REPLIES[uiLang] || DM_QUICK_REPLIES.fr;

  // Charge le fil existant pour cette vidéo, s'il y en a un.
  useEffect(() => {
    if (isDemo) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const thread = await findThreadForVideo(API_URL, video.id);
        if (cancelled) return;
        if (!thread) { setLoading(false); return; }
        setThreadId(thread.id);
        const msgs = await fetchThreadMessages(API_URL, thread.id);
        if (!cancelled) setMessages(msgs);
      } catch (err) {
        // Erreur visible : une conversation qui ne charge pas ne doit pas
        // ressembler à une conversation vide.
        if (!cancelled) setError(String(err.message || err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [API_URL, video.id, isDemo]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const timeLabel = useCallback((iso) => {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleTimeString(uiLang === "fr" ? "fr-FR" : uiLang === "it" ? "it-IT" : "en-US", { hour: "2-digit", minute: "2-digit" });
  }, [uiLang]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    if (isDemo) { setError(t.demo); return; }
    setError(null);
    setSending(true);
    setInputValue("");
    try {
      const data = await sendMarketplaceMessage(API_URL, { videoId: video.id, threadId, body: trimmed });
      if (data?.thread?.id) setThreadId(data.thread.id);
      setMessages(prev => [...prev, data.message]);
    } catch (err) {
      // Le message est restauré dans le champ : l'utilisateur ne perd pas ce
      // qu'il a écrit parce que le réseau a flanché.
      setInputValue(trimmed);
      setError(String(err.message || err));
    } finally {
      setSending(false);
    }
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
          {loading && (
            <div style={{ textAlign: "center", color: "#71717A", fontSize: 13, marginTop: 40 }}>{t.loading}</div>
          )}
          {!loading && messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#71717A", fontSize: 13, fontStyle: "italic", marginTop: 40 }}>
              {isDemo ? t.demo : t.empty}
            </div>
          )}
          {/* L'expéditeur est déterminé par l'id réel, plus par un champ figé :
              le fil affiche donc correctement les réponses du créateur. */}
          {messages.map((m, i) => {
            const mine = m.sender_id ? m.sender_id === userId : true;
            return (
              <div key={m.id || i} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "78%", padding: "10px 14px", borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: mine ? "linear-gradient(90deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.07)",
                  color: mine ? "#fff" : "#E4E4E7", fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap",
                  border: mine ? "none" : "1px solid rgba(255,255,255,0.05)"
                }}>
                  {m.body ?? m.text}
                </div>
                <span style={{ fontSize: 10, color: "#52525B", marginTop: 3, padding: "0 4px" }}>{timeLabel(m.created_at)}</span>
              </div>
            );
          })}
        </div>

        {/* Erreurs et état d'envoi — jamais d'échec muet. */}
        {(error || sending) && (
          <div style={{
            margin: "0 16px 8px", padding: "9px 12px", borderRadius: 10, fontSize: 12, lineHeight: 1.45,
            background: error ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${error ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.08)"}`,
            color: error ? "#F87171" : "#A1A1AA",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          }}>
            <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>{error || t.sending}</span>
            {error && (
              <button onClick={() => setError(null)} aria-label="Fermer" style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer", flexShrink: 0, padding: 2 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        )}

        {/* Quick replies */}
        <div style={{ padding: "0 16px 10px 16px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {quickReplies.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)} disabled={isDemo || sending} className="hover-bg-white-10" style={{
              padding: "6px 12px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent", color: "#A1A1AA", fontSize: 11.5,
              cursor: isDemo || sending ? "not-allowed" : "pointer", opacity: isDemo || sending ? 0.5 : 1, transition: "background 0.2s"
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
            placeholder={isDemo ? t.demo : t.placeholder}
            disabled={isDemo || sending}
            className="input-premium"
            style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 13.5, outline: "none", opacity: isDemo ? 0.6 : 1 }}
          />
          <button onClick={() => sendMessage(inputValue)} disabled={!inputValue.trim() || isDemo || sending} style={{
            width: 42, height: 42, borderRadius: 10, border: "none", flexShrink: 0,
            background: inputValue.trim() && !isDemo && !sending ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "rgba(255,255,255,0.08)",
            color: "#fff", cursor: inputValue.trim() && !isDemo && !sending ? "pointer" : "not-allowed",
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
