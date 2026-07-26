// ─── Pièces jointes du Coach IA — composants UI (chantier #16) ───────────────
// PendingAttachments : vignettes des fichiers sélectionnés avant envoi (avec
// suppression et état "envoi en cours"). MessageAttachments : vignettes des
// fichiers déjà joints à un message (URL signée à la demande, bucket privé).
import { useEffect, useState } from "react";
import { formatBytes, signedAttachmentUrl } from "./utils/gideonAttachments";

const PdfIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ImageIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

// Vignette générique : aperçu image, ou carte fichier (PDF — et image dont
// l'aperçu n'a pas pu être chargé : on garde alors l'icône du bon type plutôt
// que d'afficher un JPG comme un PDF).
function Chip({ c, kind, name, size, url, accent, onRemove, uploading }) {
  return (
    <div style={{
      position: "relative", display: "flex", alignItems: "center", gap: 10,
      padding: kind === "image" && url ? 0 : "8px 12px",
      borderRadius: 12, overflow: "hidden", flexShrink: 0,
      border: `1px solid ${c.border}`, background: c.surface,
      maxWidth: 210, opacity: uploading ? 0.6 : 1, transition: "opacity 0.2s",
    }}>
      {kind === "image" && url ? (
        <img src={url} alt={name} style={{ width: 64, height: 64, objectFit: "cover", display: "block" }} />
      ) : (
        <>
          <span style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: accent, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {kind === "pdf" ? <PdfIcon /> : <ImageIcon />}
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
          kind={it.file.type === "application/pdf" ? "pdf" : "image"}
          name={it.file.name}
          size={it.file.size}
          url={it.previewUrl}
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
        if (a.kind === "pdf" || a.mime === "application/pdf") continue;
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
          kind={a.mime === "application/pdf" ? "pdf" : "image"}
          name={a.name}
          size={a.size}
          url={urls[a.path]}
        />
      ))}
    </div>
  );
}
