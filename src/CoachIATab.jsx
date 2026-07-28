import { useState, useRef, useEffect } from "react";
import { UI_TEXT, ELITE_UI_TEXT, getBotResponse, isAdvancedEcomQuestion, UPSELL_MESSAGE } from "./chatbotKnowledge";
import { getTierRank, TIER_RANK } from "./tierConfig";
import { apiFetch } from "./utils/apiClient";
import { streamGideon } from "./utils/gideonStream";
import { acceptAttr, discardAttachments, formatBytes, formatDuration, kindOfMime, readVideoDuration, uploadAttachments, validateSelection, VIDEO_MAX_SECONDS } from "./utils/gideonAttachments";
import { PendingAttachments, MessageAttachments } from "./GideonAttachments";
import ReactMarkdown from "react-markdown";

export default function CoachIATab({ c, mono, uiLang = "fr", userTier = "free", API_URL, onUpgradeClick }) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [quota, setQuota] = useState(null); // { used, limit, remaining } — null si illimité
  const [conversations, setConversations] = useState([]); // panneau latéral
  const [activeConvId, setActiveConvId] = useState(null);
  // Pièces jointes (chantier #16) : fichiers sélectionnés en attente d'envoi,
  // limites du plan (null = upload interdit → upsell), erreur visible.
  const [pending, setPending] = useState([]);
  const [uploadLimits, setUploadLimits] = useState(null);
  // limitsKnown distingue "le serveur a répondu : pas d'upload pour ce plan"
  // (→ upsell) de "on n'a pas encore pu savoir" (→ on laisse tenter, c'est le
  // serveur qui tranche ; sinon un abonné payant verrait un faux upsell si
  // /history a échoué au montage).
  const [limitsKnown, setLimitsKnown] = useState(false);
  const [attachError, setAttachError] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Vidéo (chantier #17) : quota journalier dédié + étape d'attente pendant
  // que Gemini transcode le média (plusieurs secondes avant la réponse).
  const [videoQuota, setVideoQuota] = useState(null);
  const [analyzingVideo, setAnalyzingVideo] = useState(false);
  // Tiroir des conversations, utilisé uniquement sur mobile (voir le CSS).
  const [convDrawerOpen, setConvDrawerOpen] = useState(false);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  const isElite = getTierRank(userTier) >= TIER_RANK.elite;
  const t = (isElite ? ELITE_UI_TEXT[uiLang] : UI_TEXT[uiLang]) || (isElite ? ELITE_UI_TEXT.fr : UI_TEXT.fr);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const mapRows = (rows) => rows.map(m => ({
    role: m.role === "user" ? "user" : "bot",
    text: m.content,
    sources: Array.isArray(m.sources) && m.sources.length > 0 ? m.sources : undefined,
    attachments: Array.isArray(m.attachments) && m.attachments.length > 0 ? m.attachments : undefined,
  }));

  const refreshConversations = async () => {
    try {
      const res = await apiFetch(`${API_URL}/api/gideon/conversations`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.conversations)) setConversations(data.conversations);
    } catch { /* backend hors-ligne */ }
  };

  // Au montage : panneau des conversations + chargement de la plus récente.
  // Silencieux en cas d'échec — le Coach démarre simplement vide.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      refreshConversations();
      try {
        const res = await apiFetch(`${API_URL}/api/gideon/history`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data.quota) setQuota(data.quota);
        if (data.videoQuota) setVideoQuota(data.videoQuota);
        setUploadLimits(data.uploadLimits || null);
        setLimitsKnown(true);
        if (data.conversationId) setActiveConvId(data.conversationId);
        if (Array.isArray(data.messages) && data.messages.length > 0) setMessages(mapRows(data.messages));
      } catch { /* backend hors-ligne — pas d'historique */ }
    })();
    return () => { cancelled = true; };
  }, [API_URL]);

  // Bascule vers une conversation du panneau
  const loadConversation = async (id) => {
    if (isTyping || id === activeConvId) return;
    setConvDrawerOpen(false); // le tiroir mobile se referme sur la sélection
    try {
      const res = await apiFetch(`${API_URL}/api/gideon/history?conversationId=${encodeURIComponent(id)}`);
      if (!res.ok) return;
      const data = await res.json();
      setActiveConvId(id);
      setMessages(prev => { releaseMessagePreviews(prev); return Array.isArray(data.messages) ? mapRows(data.messages) : []; });
      if (data.quota) setQuota(data.quota);
    } catch { /* no-op */ }
  };

  // Nouvelle conversation : vide localement — créée côté serveur au premier
  // message (titre auto = début de la question)
  // Vide la sélection en attente en libérant les ObjectURL (aucun n'a encore
  // été transmis à un message : ceux-là restent valides).
  const clearPending = () => setPending(prev => {
    prev.forEach(p => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
    return [];
  });

  // Libère les aperçus des messages qu'on s'apprête à jeter. Sans ça, chaque
  // changement de conversation abandonnait des blobs en mémoire — anecdotique
  // pour des images, jusqu'à 60 Mo pièce depuis l'arrivée des vidéos.
  const releaseMessagePreviews = (list) =>
    list.forEach(m => m.attachments?.forEach(a => a.localUrl && URL.revokeObjectURL(a.localUrl)));

  const handleNewConversation = () => {
    if (isTyping) return;
    setConvDrawerOpen(false);
    setMessages(prev => { releaseMessagePreviews(prev); return []; });
    setActiveConvId(null);
    clearPending();
    setAttachError(null);
  };

  // ─── Pièces jointes (chantier #16) ────────────────────────────────────────
  // Fallback permissif quand les limites ne sont pas connues (backend injoignable
  // au montage) : le serveur reste la seule autorité, il refusera si besoin.
  const effectiveLimits = uploadLimits || (limitsKnown ? null : { maxFiles: 5, maxTotalBytes: 12 * 1024 * 1024, kinds: ["image", "pdf"] });

  const handlePickFiles = () => {
    setAttachError(null);
    if (!effectiveLimits) {
      setAttachError(uiLang === "fr"
        ? "📎 L'analyse de fichiers par Gideon est réservée aux abonnés — passe à un forfait supérieur pour lui montrer tes dashboards et créatives."
        : uiLang === "it"
        ? "📎 L'analisi dei file è riservata agli abbonati."
        : "📎 File analysis with Gideon is for paid plans only.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (e) => {
    const pendingBytes = pending.reduce((s, p) => s + (p.file?.size || 0), 0);
    const pendingHasVideo = pending.some(p => kindOfMime(p.file?.type) === "video");
    const check = validateSelection(e.target.files, effectiveLimits, pending.length, pendingBytes, pendingHasVideo);
    e.target.value = ""; // permet de re-sélectionner le même fichier après retrait
    if (!check.ok) { setAttachError(check.error); return; }
    setAttachError(null);

    // ObjectURL créé ici (et révoqué au retrait / après envoi) : le faire dans
    // un effet du composant d'affichage provoquerait un rendu en cascade.
    const items = check.files.map(file => ({
      file,
      previewUrl: /^(image|video)\//.test(file.type) ? URL.createObjectURL(file) : undefined,
    }));

    // Durée lue par le navigateur : évite d'envoyer 60 Mo pour rien. Contrôle
    // de confort uniquement — le serveur, lui, borne la TAILLE (il ne peut pas
    // mesurer une durée sans ffprobe).
    for (const item of items) {
      if (kindOfMime(item.file.type) !== "video") continue;
      const duration = await readVideoDuration(item.file);
      if (duration && duration > VIDEO_MAX_SECONDS) {
        items.forEach(i => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
        setAttachError(`"${item.file.name}" dure ${formatDuration(duration)} — maximum ${VIDEO_MAX_SECONDS} secondes. Découpe la séquence qui t'intéresse, Gideon l'analysera image par image.`);
        return;
      }
      item.duration = duration || undefined;
    }

    setPending(prev => [...prev, ...items]);
  };

  const removePending = (index) => {
    setPending(prev => {
      if (prev[index]?.previewUrl) URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    setAttachError(null);
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    try { await apiFetch(`${API_URL}/api/gideon/conversations/${id}`, { method: "DELETE" }); } catch { /* no-op */ }
    if (id === activeConvId) { setMessages([]); setActiveConvId(null); }
    refreshConversations();
  };

  const handleSend = async () => {
    // Un message peut n'être QUE des pièces jointes : on fournit alors une
    // consigne par défaut (le backend exige une question non vide).
    const defaultPrompt = uiLang === "fr"
      ? "Analyse ce que je te joins et donne-moi tes recommandations concrètes."
      : uiLang === "it"
      ? "Analizza i file allegati e dammi raccomandazioni concrete."
      : "Analyse the attached files and give me concrete recommendations.";
    const text = inputValue.trim() || (pending.length > 0 ? defaultPrompt : "");
    if (!text || isTyping || uploading) return;
    const history = messages;

    // 0. Téléversement des pièces jointes AVANT d'afficher le message : si
    // l'upload échoue, rien n'est envoyé et l'erreur reste visible (pas
    // d'erreur silencieuse).
    let attachmentRefs = [];
    if (pending.length > 0) {
      setUploading(true);
      try {
        const up = await uploadAttachments(API_URL, pending.map(p => p.file));
        attachmentRefs = up.attachments;
        if (up.uploadLimits) { setUploadLimits(up.uploadLimits); setLimitsKnown(true); }
      } catch (err) {
        setAttachError(err.message || "Échec de l'envoi des fichiers.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // L'ObjectURL déjà créé à la sélection est transmis à la bulle (évite un
    // aller-retour d'URL signée) — il reste valide jusqu'au rechargement.
    const localPreviews = attachmentRefs.map((ref, i) => ({
      ...ref,
      localUrl: pending[i]?.previewUrl,
    }));

    setMessages(prev => [...prev, { role: "user", text, attachments: localPreviews.length ? localPreviews : undefined }]);
    setInputValue("");
    // Pas de clearPending() ici : les ObjectURL viennent d'être transmis aux
    // bulles du message, les révoquer casserait les vignettes affichées.
    setPending([]);
    setAttachError(null);

    setIsTyping(true);
    // Une vidéo passe par la Files API Gemini (upload + transcodage) : plusieurs
    // secondes avant le premier fragment. On le dit, sinon l'attente ressemble
    // à un plantage.
    if (localPreviews.some(a => a.kind === "video")) setAnalyzingVideo(true);
    // Les fichiers ne sont pas réencodés dans l'historique (coût en tokens) :
    // on signale leur présence en texte pour que Gideon ne réponde pas comme
    // si le tour précédent n'avait contenu aucune pièce jointe.
    const conversationHistory = history.map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.attachments?.length
        ? `${m.text}\n[${m.attachments.length} fichier(s) joint(s) précédemment : ${m.attachments.map(a => a.name).join(", ")}]`
        : m.text,
    }));

    // Remplace le contenu du dernier message bot (celui en cours de stream)
    const updateLastBot = (patch) => setMessages(prev => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], ...patch };
      return next;
    });

    try {
      // 1. Streaming SSE — la réponse s'écrit en direct, effet "machine à écrire"
      let started = false;
      const data = await streamGideon({
        API_URL,
        question: text,
        conversationHistory,
        conversationId: activeConvId,
        attachments: attachmentRefs,
        uiLang,
        onChunk: (fullText) => {
          if (!started) {
            started = true;
            setIsTyping(false); // les 3 points laissent place au texte qui s'écrit
            setMessages(prev => [...prev, { role: "bot", text: fullText, streaming: true }]);
          } else {
            updateLastBot({ text: fullText });
          }
        },
      });
      // État final : texte complet + sources + upsell éventuel + quota
      if (data.quota) setQuota(data.quota);
      if (data.videoQuota) setVideoQuota(data.videoQuota);
      setAnalyzingVideo(false);
      if (data.conversationId) {
        if (!activeConvId) setActiveConvId(data.conversationId);
        refreshConversations(); // le titre / l'ordre du panneau ont pu changer
      }
      if (started) {
        updateLastBot({ ...(data.answer ? { text: data.answer } : {}), sources: data.sources, isUpsell: !!data.restricted || !!data.quotaExceeded, streaming: false });
      } else if (data.restricted || data.quotaExceeded) {
        setMessages(prev => [...prev, { role: "bot", text: data.answer, isUpsell: true }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: data.answer, sources: data.sources }]);
      }
    } catch (streamErr) {
      // Refus explicite du serveur (pièce jointe invalide, quota de fichiers…) :
      // on affiche le message tel quel au lieu de replier sur /api/gideon, qui
      // renverrait la même erreur.
      if (streamErr?.userFacing) {
        setAttachError(streamErr.message);
        setMessages(prev => prev.slice(0, -1)); // retire le message optimiste
        setPending(pending); // la sélection locale reste, l'utilisateur corrige
        // Les fichiers déjà stockés seraient orphelins : on les supprime (un
        // nouvel envoi les re-téléversera proprement).
        discardAttachments(API_URL, attachmentRefs.map(a => a.path));
        setIsTyping(false);
        return;
      }
      // Vidéo : PAS de repli automatique. Rejouer la requête re-téléverserait
      // la vidéo chez Gemini et la refacturerait entièrement pour un seul
      // message. On affiche l'échec et on laisse l'utilisateur décider.
      if (attachmentRefs.some(a => a.kind === "video")) {
        console.warn("⚠️ Gideon stream KO avec vidéo — pas de repli (coût):", streamErr);
        setMessages(prev => prev.slice(0, -1));
        setPending(pending);
        setAttachError(uiLang === "fr"
          ? "⚠️ L'analyse de ta vidéo a échoué en cours de route. Ta vidéo est toujours sélectionnée : renvoie-la quand tu veux."
          : uiLang === "it"
          ? "⚠️ L'analisi del video non è riuscita. Il video è ancora selezionato, riprova quando vuoi."
          : "⚠️ Video analysis failed midway. Your video is still attached — send it again when ready.");
        discardAttachments(API_URL, attachmentRefs.map(a => a.path));
        setIsTyping(false);
        setAnalyzingVideo(false);
        return;
      }
      // 2. Repli : endpoint non-streamé classique
      console.warn("⚠️ Gideon stream indisponible, repli sur /api/gideon:", streamErr);
      try {
        const res = await apiFetch(`${API_URL}/api/gideon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text, conversationHistory, conversationId: activeConvId, attachments: attachmentRefs, uiLang }),
        });
        if (!res.ok) throw new Error("Gideon API not ready yet", { cause: streamErr });
        const data = await res.json();
        if (data.quota) setQuota(data.quota);
        if (data.videoQuota) setVideoQuota(data.videoQuota);
        if (data.conversationId) {
          if (!activeConvId) setActiveConvId(data.conversationId);
          refreshConversations();
        }
        if (data.restricted || data.quotaExceeded) {
          setMessages(prev => [...prev, { role: "bot", text: data.answer, isUpsell: true }]);
        } else {
          setMessages(prev => [...prev, { role: "bot", text: data.answer, sources: data.sources }]);
        }
      } catch (err) {
        console.error("⚠️ Gideon API error:", err);
        // 3. Dernier repli : simulation locale hors-ligne. INTERDIT dès qu'il y
        // a des pièces jointes — la simulation ne les a jamais vues et laisser
        // croire à une analyse serait une erreur silencieuse. On le dit et on
        // supprime les fichiers devenus orphelins.
        if (attachmentRefs.length > 0) {
          setMessages(prev => prev.slice(0, -1));
          setPending(pending);
          setAttachError(uiLang === "fr"
            ? "⚠️ Gideon est momentanément injoignable : tes fichiers n'ont pas été analysés. Réessaie dans quelques instants."
            : uiLang === "it"
            ? "⚠️ Gideon non è raggiungibile: i tuoi file non sono stati analizzati. Riprova."
            : "⚠️ Gideon is unreachable — your files were not analysed. Please retry.");
          discardAttachments(API_URL, attachmentRefs.map(a => a.path));
        } else if (!isElite && isAdvancedEcomQuestion(text)) {
          setMessages(prev => [...prev, { role: "bot", text: UPSELL_MESSAGE[uiLang] || UPSELL_MESSAGE.fr, isUpsell: true }]);
        } else {
          const reply = getBotResponse(text, uiLang);
          setMessages(prev => [...prev, { role: "bot", text: reply }]);
        }
      }
    } finally {
      setIsTyping(false);
      setAnalyzingVideo(false);
    }
  };

  const canSend = (!!inputValue.trim() || pending.length > 0) && !isTyping && !uploading;

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
        {/* Accès à l'historique sur mobile, où le panneau latéral est masqué.
            Bascule : le même bouton ouvre ET referme. Il n'ouvrait que dans un
            sens, obligeant à deviner qu'il fallait toucher le voile. */}
        <button
          onClick={() => setConvDrawerOpen(v => !v)}
          className="conv-drawer-toggle"
          aria-expanded={convDrawerOpen}
          aria-label={uiLang === "fr" ? "Mes conversations" : uiLang === "it" ? "Le mie conversazioni" : "My conversations"}
          style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0, cursor: "pointer",
            border: `1px solid ${c.border}`, background: c.card, color: c.text,
            alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
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

      {/* Corps : panneau des conversations + colonne chat */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, position: "relative" }}>
        {/* Voile de fermeture du tiroir (mobile uniquement) */}
        {convDrawerOpen && <div className="conv-drawer-backdrop" onClick={() => setConvDrawerOpen(false)} />}
        {/* Sur mobile ce panneau devient un tiroir : `conv-drawer-open` le
            fait réapparaître par-dessus le chat. Sans cela, il était purement
            masqué et l'historique des conversations restait inaccessible au
            téléphone — régression introduite en corrigeant le débordement. */}
        <div
          className={`conv-sidebar${convDrawerOpen ? " conv-drawer-open" : ""}`}
          style={{ width: 250, flexShrink: 0, borderRight: `1px solid ${c.border}`, background: c.surface, display: "flex", flexDirection: "column" }}
        >
          <div style={{ padding: 14 }}>
            <button onClick={handleNewConversation} className="hover-lift" style={{
              width: "100%", padding: "12px 14px", borderRadius: 12,
              border: `1px solid ${isElite ? "rgba(234,179,8,0.35)" : c.border}`,
              background: "transparent", color: isElite ? "#EAB308" : c.text,
              fontSize: 13.5, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              {uiLang === "fr" ? "Nouvelle conversation" : uiLang === "it" ? "Nuova conversazione" : "New conversation"}
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 14px" }}>
            {conversations.map((conv) => (
              <div key={conv.id} onClick={() => loadConversation(conv.id)} className="conv-item" style={{
                padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer",
                background: conv.id === activeConvId ? (isElite ? "rgba(234,179,8,0.12)" : "rgba(139,92,246,0.10)") : "transparent",
                border: `1px solid ${conv.id === activeConvId ? (isElite ? "rgba(234,179,8,0.35)" : "rgba(139,92,246,0.3)") : "transparent"}`,
                display: "flex", alignItems: "center", gap: 6, transition: "background 0.15s",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.title}</div>
                  <div style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>
                    {new Date(conv.updated_at).toLocaleDateString(uiLang === "fr" ? "fr-FR" : uiLang === "it" ? "it-IT" : "en-US", { day: "numeric", month: "short" })}
                  </div>
                </div>
                <button onClick={(e) => handleDeleteConversation(conv.id, e)} className="conv-delete" aria-label="Delete conversation" style={{ border: "none", background: "transparent", color: c.textMuted, cursor: "pointer", padding: 4, borderRadius: 6, flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                </button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div style={{ padding: "10px 12px", fontSize: 12.5, color: c.textMuted, lineHeight: 1.5 }}>
                {uiLang === "fr" ? "Tes conversations sauvegardées apparaîtront ici." : uiLang === "it" ? "Le tue conversazioni salvate appariranno qui." : "Your saved conversations will appear here."}
              </div>
            )}
          </div>
        </div>

        {/* Colonne chat */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>

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
            {m.attachments && m.attachments.length > 0 && (
              <MessageAttachments c={c} API_URL={API_URL} attachments={m.attachments} accent={avatarGradient} />
            )}
            <div className={m.role === "bot" ? "markdown-body" : ""} style={{
              maxWidth: "75%", padding: "16px 20px", borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              background: m.role === "user" ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : c.surface,
              color: m.role === "user" ? "#fff" : c.text, fontSize: 15, lineHeight: 1.6,
              border: m.role === "user" ? "none" : `1px solid ${c.border}`,
              boxShadow: m.role === "user" ? "0 8px 16px rgba(124,58,237,0.2)" : "0 4px 12px rgba(0,0,0,0.05)"
            }}>
              {m.role === "bot" ? (
                <>
                  <ReactMarkdown>{m.text || ""}</ReactMarkdown>
                  {m.streaming && <span className="stream-cursor" />}
                </>
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

        {/* Typing Indicator — mention explicite pendant le traitement vidéo */}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start", gap: 6, flexDirection: "column" }}>
            <div style={{ fontSize: 12, color: c.textDim, fontWeight: 600, marginLeft: 16 }}>{t.header}</div>
            <div style={{ padding: "18px 20px", borderRadius: "20px 20px 20px 4px", background: c.surface, border: `1px solid ${c.border}`, display: "flex", gap: 10, alignItems: "center" }}>
              <span className="chat-typing-dot" style={{ animationDelay: "0s" }} />
              <span className="chat-typing-dot" style={{ animationDelay: "0.15s" }} />
              <span className="chat-typing-dot" style={{ animationDelay: "0.3s" }} />
              {analyzingVideo && (
                <span style={{ fontSize: 13, color: c.textMuted, fontWeight: 600 }}>
                  {uiLang === "fr" ? "🎬 Analyse de ta vidéo image par image…"
                    : uiLang === "it" ? "🎬 Analisi del video fotogramma per fotogramma…"
                    : "🎬 Analysing your video frame by frame…"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: "20px 32px", borderTop: `1px solid ${c.border}`, background: c.surface }}>
        {/* Pièces jointes en attente (chantier #16) */}
        <PendingAttachments c={c} items={pending} onRemove={removePending} uploading={uploading} accent={avatarGradient} />
        {attachError && (
          <div style={{
            marginBottom: 10, padding: "10px 14px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>{attachError}</span>
            <button onClick={() => setAttachError(null)} aria-label="Fermer" style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer", flexShrink: 0, padding: 2 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, background: c.bg, padding: 8, borderRadius: 16, border: `1px solid ${c.border}`, alignItems: "center" }}>
          {/* Bouton d'attache premium */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptAttr(effectiveLimits?.kinds || ["image"])}
            onChange={handleFilesSelected}
            style={{ display: "none" }}
          />
          <button
            onClick={handlePickFiles}
            disabled={isTyping || uploading}
            className="gideon-attach"
            title={effectiveLimits
              ? `${effectiveLimits.maxFiles} fichier${effectiveLimits.maxFiles > 1 ? "s" : ""} max · ${formatBytes(effectiveLimits.maxTotalBytes)} · ${
                  effectiveLimits.kinds.includes("video") ? `images, PDF et vidéos (${VIDEO_MAX_SECONDS}s max)`
                  : effectiveLimits.kinds.includes("pdf") ? "images et PDF"
                  : "images"}`
              : (uiLang === "fr" ? "Réservé aux forfaits payants" : "Paid plans only")}
            aria-label="Joindre un fichier"
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              border: `1px solid ${isElite ? "rgba(234,179,8,0.35)" : "rgba(139,92,246,0.3)"}`,
              background: effectiveLimits ? "transparent" : c.border,
              color: effectiveLimits ? (isElite ? "#EAB308" : "#8B5CF6") : c.textMuted,
              cursor: isTyping || uploading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", position: "relative",
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            {pending.length > 0 && (
              <span style={{
                position: "absolute", top: -5, right: -5, minWidth: 17, height: 17, borderRadius: 9,
                background: bubbleGradient, color: isElite ? "#000" : "#fff",
                fontSize: 10.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
              }}>{pending.length}</span>
            )}
          </button>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            placeholder={t.placeholder}
            style={{ flex: 1, padding: "12px 16px", background: "transparent", border: "none", color: c.text, fontSize: 15, fontFamily: mono, outline: "none" }}
          />
          {/* Envoyable avec du texte OU seulement des pièces jointes */}
          <button onClick={handleSend} disabled={!canSend} style={{
            width: 48, height: 48, borderRadius: 12, border: "none", flexShrink: 0,
            background: canSend ? bubbleGradient : c.border,
            color: canSend ? (isElite ? "#000" : "#fff") : c.textMuted,
            cursor: canSend ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s"
          }} aria-label="Send message">
            {uploading ? (
              <span className="gideon-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            )}
          </button>
        </div>
        {(quota?.limit > 0 || videoQuota) && (
          <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, textAlign: "right", display: "flex", gap: 14, justifyContent: "flex-end", flexWrap: "wrap" }}>
            {quota?.limit > 0 && (
              <span style={{ color: quota.remaining <= 5 ? "#F59E0B" : c.textMuted, transition: "color 0.3s" }}>
                {uiLang === "fr"
                  ? `${quota.remaining} message${quota.remaining > 1 ? "s" : ""} restant${quota.remaining > 1 ? "s" : ""} aujourd'hui`
                  : uiLang === "it"
                  ? `${quota.remaining} messaggi rimanenti oggi`
                  : `${quota.remaining} messages left today`}
              </span>
            )}
            {/* Compteur vidéo : affiché seulement quand il devient pertinent,
                pour ne pas encombrer l'interface d'un Elite qui n'en fait pas. */}
            {videoQuota && videoQuota.remaining <= 5 && (
              <span style={{ color: videoQuota.remaining <= 2 ? "#F59E0B" : c.textMuted }}>
                {uiLang === "fr"
                  ? `🎬 ${videoQuota.remaining} vidéo${videoQuota.remaining > 1 ? "s" : ""} restante${videoQuota.remaining > 1 ? "s" : ""}`
                  : uiLang === "it"
                  ? `🎬 ${videoQuota.remaining} video rimanenti`
                  : `🎬 ${videoQuota.remaining} video${videoQuota.remaining > 1 ? "s" : ""} left`}
              </span>
            )}
          </div>
        )}
      </div>

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
        .stream-cursor {
          display: inline-block; width: 9px; height: 17px; margin-left: 3px;
          vertical-align: text-bottom; border-radius: 2px;
          background: ${isElite ? "#EAB308" : "#8B5CF6"};
          animation: streamBlink 0.9s steps(2, start) infinite;
        }
        @keyframes streamBlink { to { visibility: hidden; } }
        .gideon-attach:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px ${isElite ? "rgba(234,179,8,0.25)" : "rgba(139,92,246,0.25)"};
          background: ${isElite ? "rgba(234,179,8,0.10)" : "rgba(139,92,246,0.10)"} !important;
        }
        .gideon-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: ${isElite ? "#000" : "#fff"};
          animation: gideonSpin 0.7s linear infinite;
        }
        @keyframes gideonSpin { to { transform: rotate(360deg); } }
        .conv-delete { opacity: 0; transition: opacity 0.15s, color 0.15s; }
        .conv-item:hover .conv-delete { opacity: 1; }
        .conv-delete:hover { color: #EF4444 !important; }
        /* !important obligatoire : le panneau porte un style inline
           display:"flex", qui bat une règle CSS non marquée — sans ça la
           sidebar de 250px reste affichée sur mobile et écrase la colonne de
           chat (texte rendu une lettre par ligne). */
        /* ─── Conversations : panneau fixe sur desktop, tiroir sur mobile ───
           Le !important reste nécessaire : le panneau porte un style inline
           display:"flex", qui bat une règle CSS non marquée. */
        @media (max-width: 900px) {
          .conv-sidebar { display: none !important; }
          .conv-sidebar.conv-drawer-open {
            display: flex !important;
            position: absolute; top: 0; bottom: 0; left: 0;
            width: 82%; max-width: 300px; z-index: 60;
            box-shadow: 8px 0 30px rgba(0,0,0,0.25);
          }
          .conv-drawer-toggle { display: flex !important; }
        }
        .conv-drawer-toggle { display: none; }
        .conv-drawer-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 55; }
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
