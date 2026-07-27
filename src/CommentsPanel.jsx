// ─── Fil de commentaires d'une vidéo (Chantier #18) ──────────────────────────
// Le compteur affiché sous l'icône bulle était purement décoratif : cliquer
// dessus ne faisait rien. Ce panneau ouvre le vrai fil, alimenté par
// `marketplace_comments`.
//
// Lecture directe Supabase (fil public entre membres), écriture par le backend
// qui seul peut établir un libellé d'auteur fiable — sinon chacun pourrait
// publier sous le nom d'un autre.
import { useState, useEffect, useRef } from "react";
import { fetchComments, postComment, deleteComment } from "./utils/marketplaceCommerce";

const T = {
  fr: {
    title: "Commentaires", empty: "Aucun commentaire. Lance la discussion !",
    placeholder: "Ajoute un commentaire...", send: "Publier", sending: "Envoi...",
    loading: "Chargement...", demo: "Vidéo d'exemple — les commentaires sont désactivés.",
    delete: "Supprimer", close: "Fermer", justNow: "à l'instant",
  },
  en: {
    title: "Comments", empty: "No comments yet. Start the conversation!",
    placeholder: "Add a comment...", send: "Post", sending: "Posting...",
    loading: "Loading...", demo: "Sample video — comments are disabled.",
    delete: "Delete", close: "Close", justNow: "just now",
  },
  it: {
    title: "Commenti", empty: "Nessun commento. Inizia tu la conversazione!",
    placeholder: "Aggiungi un commento...", send: "Pubblica", sending: "Invio...",
    loading: "Caricamento...", demo: "Video di esempio — i commenti sono disattivati.",
    delete: "Elimina", close: "Chiudi", justNow: "ora",
  },
};

export default function CommentsPanel({ video, uiLang = "fr", API_URL, userId, isDemo = false, onClose, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(!isDemo);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const t = T[uiLang] || T.fr;

  useEffect(() => {
    if (isDemo) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchComments(video.id);
        if (!cancelled) setComments(data);
      } catch (err) {
        // Un fil qui ne charge pas ne doit pas ressembler à un fil vide.
        if (!cancelled) setError(String(err.message || err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [video.id, isDemo]);

  const timeLabel = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return t.justNow;
    return new Date(iso).toLocaleDateString(uiLang === "fr" ? "fr-FR" : uiLang === "it" ? "it-IT" : "en-US", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  };

  const submit = async () => {
    const text = value.trim();
    if (!text || sending) return;
    if (isDemo) { setError(t.demo); return; }
    setError(null);
    setSending(true);
    setValue("");
    try {
      const created = await postComment(API_URL, video.id, text);
      setComments((prev) => [created, ...prev]);
      onCountChange?.(1);
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      // On rend le texte à l'utilisateur : il ne doit pas perdre ce qu'il a écrit.
      setValue(text);
      setError(String(err.message || err));
    } finally {
      setSending(false);
    }
  };

  const remove = async (comment) => {
    const previous = comments;
    setComments((prev) => prev.filter((c) => c.id !== comment.id));
    const r = await deleteComment(comment.id);
    if (!r.ok) { setComments(previous); setError(r.error); return; }
    onCountChange?.(-1);
  };

  // Suppression possible sur son propre commentaire, ou sur n'importe lequel
  // si l'on est le créateur de la vidéo (modération de son propre contenu).
  const canDelete = (c) => c.user_id === userId || video.ownerId === userId;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1400, animation: "fadeIn 0.2s ease-out" }} />

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400, maxWidth: "100vw",
        background: "#0c0c10", borderLeft: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.6)", zIndex: 1401,
        display: "flex", flexDirection: "column", animation: "dmSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="outfit" style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>💬 {t.title}</div>
            <div style={{ fontSize: 11.5, color: "#71717A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{video.product}</div>
          </div>
          <button onClick={onClose} aria-label={t.close} style={{ background: "none", border: "none", color: "#A1A1AA", cursor: "pointer", fontSize: 20, padding: 4 }}>✕</button>
        </div>

        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {loading && <div style={{ textAlign: "center", color: "#71717A", fontSize: 13, marginTop: 30 }}>{t.loading}</div>}
          {!loading && comments.length === 0 && (
            <div style={{ textAlign: "center", color: "#71717A", fontSize: 13, fontStyle: "italic", marginTop: 30 }}>
              {isDemo ? t.demo : t.empty}
            </div>
          )}
          {comments.map((cm) => (
            <div key={cm.id} style={{ display: "flex", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12, fontWeight: 800,
              }}>{String(cm.author_label || "?").slice(0, 2).toUpperCase()}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#E4E4E7" }}>@{cm.author_label}</span>
                  <span style={{ fontSize: 10.5, color: "#52525B" }}>{timeLabel(cm.created_at)}</span>
                </div>
                <div style={{ fontSize: 13.5, color: "#D4D4D8", lineHeight: 1.5, marginTop: 2, overflowWrap: "anywhere" }}>{cm.body}</div>
              </div>

              {canDelete(cm) && (
                <button onClick={() => remove(cm)} aria-label={t.delete} style={{ border: "none", background: "transparent", color: "#52525B", cursor: "pointer", padding: 2, flexShrink: 0, alignSelf: "flex-start" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            margin: "0 16px 8px", padding: "9px 12px", borderRadius: 10, fontSize: 12,
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#F87171",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          }}>
            <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>{error}</span>
            <button onClick={() => setError(null)} aria-label={t.close} style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, padding: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder={isDemo ? t.demo : t.placeholder}
            disabled={isDemo || sending}
            maxLength={1000}
            style={{
              flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 13.5, outline: "none",
              opacity: isDemo ? 0.6 : 1,
            }}
          />
          <button
            onClick={submit}
            disabled={!value.trim() || isDemo || sending}
            style={{
              padding: "0 16px", height: 42, borderRadius: 10, border: "none", flexShrink: 0,
              background: value.trim() && !isDemo && !sending ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "rgba(255,255,255,0.08)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: value.trim() && !isDemo && !sending ? "pointer" : "not-allowed",
            }}
          >{sending ? t.sending : t.send}</button>
        </div>
      </div>
    </>
  );
}
