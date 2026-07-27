// ─── Pièces jointes du Coach IA — composants UI (chantier #16) ───────────────
// PendingAttachments : vignettes des fichiers sélectionnés avant envoi (avec
// suppression et état "envoi en cours"). MessageAttachments : vignettes des
// fichiers déjà joints à un message (URL signée à la demande, bucket privé).
import { useEffect, useState } from "react";
import { formatBytes, formatDuration, kindOfMime, signedAttachmentUrl } from "./utils/gideonAttachments";

const PdfIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const VideoIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="14" height="16" rx="2" />
    <path d="m22 7-6 5 6 5V7z" />
  </svg>
);

const ImageIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

// Vignette générique : aperçu visuel (image, ou première frame d'une vidéo),
// sinon carte fichier avec l'icône du bon type — ne jamais présenter un JPG
// comme un PDF quand l'aperçu n'a pas pu être chargé.
function Chip({ c, kind, name, size, url, accent, onRemove, uploading, duration }) {
  // Un .mov ne se décode pas dans Chrome/Firefox : si le média ne s'affiche
  // pas, on retombe sur la carte-icône au lieu d'un rectangle noir muet.
  const [previewFailed, setPreviewFailed] = useState(false);
  const hasPreview = (kind === "image" || kind === "video") && url && !previewFailed;
  return (
    <div style={{
      position: "relative", display: "flex", alignItems: "center", gap: 10,
      padding: hasPreview ? 0 : "8px 12px",
      borderRadius: 12, overflow: "hidden", flexShrink: 0,
      border: `1px solid ${c.border}`, background: c.surface,
      maxWidth: 210, opacity: uploading ? 0.6 : 1, transition: "opacity 0.2s",
    }}>
      {hasPreview ? (
        <div style={{ position: "relative", width: 96, height: 64 }}>
          {kind === "video" ? (
            // muted + preload metadata : le navigateur affiche une frame sans
            // télécharger toute la vidéo ni jouer de son.
            <video src={url} muted preload="metadata" onError={() => setPreviewFailed(true)} style={{ width: 96, height: 64, objectFit: "cover", display: "block", background: "#000" }} />
          ) : (
            <img src={url} alt={name} onError={() => setPreviewFailed(true)} style={{ width: 96, height: 64, objectFit: "cover", display: "block" }} />
          )}
          {kind === "video" && (
            <>
              <span style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.6)", pointerEvents: "none",
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              {duration ? (
                <span style={{
                  position: "absolute", bottom: 4, left: 4, padding: "1px 6px", borderRadius: 6,
                  background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
                }}>{formatDuration(duration)}</span>
              ) : null}
            </>
          )}
        </div>
      ) : (
        <>
          <span style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: accent, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {kind === "pdf" ? <PdfIcon /> : kind === "video" ? <VideoIcon /> : <ImageIcon />}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
            {size ? <div style={{ fontSize: 11, color: c.textMuted }}>{formatBytes(size)}</div> : null}
          </div>
        </>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Retirer ${name}`}
          style={{
            position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%",
            border: "none", background: "rgba(0,0,0,0.65)", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}

/**
 * Vignettes des fichiers en attente d'envoi.
 * items : [{ file, previewUrl }] — l'ObjectURL est créé et révoqué par le
 * parent (à la sélection / au retrait), pas ici : le générer dans un effet
 * imposerait un setState en cascade à chaque rendu.
 */
export function PendingAttachments({ c, items, onRemove, uploading, accent }) {
  if (items.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
      {items.map((it, i) => (
        <Chip
          key={`${it.file.name}-${i}`}
          c={c}
          accent={accent}
          kind={kindOfMime(it.file.type) || "image"}
          name={it.file.name}
          size={it.file.size}
          url={it.previewUrl}
          duration={it.duration}
          uploading={uploading}
          onRemove={uploading ? null : () => onRemove(i)}
        />
      ))}
    </div>
  );
}

/** Vignettes des fichiers joints à un message déjà envoyé (refs serveur). */
export function MessageAttachments({ c, API_URL, attachments = [], accent }) {
  const [urls, setUrls] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = {};
      for (const a of attachments) {
        // Les PDF n'ont pas d'aperçu visuel : inutile de payer une URL signée.
        if ((a.kind || kindOfMime(a.mime)) === "pdf") continue;
        const url = a.localUrl || (await signedAttachmentUrl(API_URL, a.path));
        if (url) next[a.path] = url;
      }
      if (!cancelled) setUrls(next);
    })();
    return () => { cancelled = true; };
  }, [API_URL, attachments]);

  if (!attachments || attachments.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "75%" }}>
      {attachments.map((a) => (
        <Chip
          key={a.path}
          c={c}
          accent={accent}
          kind={a.kind || kindOfMime(a.mime) || "image"}
          name={a.name}
          size={a.size}
          url={urls[a.path]}
        />
      ))}
    </div>
  );
}
