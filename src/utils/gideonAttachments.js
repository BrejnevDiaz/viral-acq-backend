// ─── Pièces jointes du Coach IA — helpers front (chantier #16) ───────────────
// Le front ne fait AUCUNE confiance à ces contrôles pour la sécurité (tout est
// revalidé côté serveur par magic bytes) : ils servent uniquement à donner un
// retour immédiat à l'utilisateur avant de consommer sa bande passante.
import { apiFetch } from "./apiClient";

// Pas de GIF : refusé par l'inline Gemini (voir gideonUploads.js).
export const ACCEPTED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_PDF_MIME = "application/pdf";
// Vidéos (chantier #17) : analysées via la Files API Gemini, plan Elite.
// Uniquement des conteneurs ISO-BMFF — le serveur y lit la durée pour borner
// le coût, ce qu'il ne sait pas faire sur WebM ou AVI (voir gideonUploads.js).
export const ACCEPTED_VIDEO_MIMES = ["video/mp4", "video/quicktime"];

// Doit rester aligné sur VIDEO_MAX_SECONDS / VIDEO_MAX_BYTES (gideonUploads.js).
export const VIDEO_MAX_SECONDS = 90;

/** Attribut accept="" de l'input file selon les familles autorisées par le plan. */
export const acceptAttr = (kinds = ["image"]) =>
  [
    ...(kinds.includes("image") ? ACCEPTED_IMAGE_MIMES : []),
    ...(kinds.includes("pdf") ? [ACCEPTED_PDF_MIME] : []),
    ...(kinds.includes("video") ? ACCEPTED_VIDEO_MIMES : []),
  ].join(",");

export const formatBytes = (bytes = 0) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(bytes / 1024))} Ko`;

export const formatDuration = (seconds = 0) => {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export const kindOfMime = (mime) =>
  mime === ACCEPTED_PDF_MIME ? "pdf"
  : ACCEPTED_IMAGE_MIMES.includes(mime) ? "image"
  : ACCEPTED_VIDEO_MIMES.includes(mime) || String(mime).startsWith("video/") ? "video"
  : null;

/**
 * Durée d'une vidéo, lue par le navigateur avant tout upload.
 * Purement ergonomique : le serveur ne peut pas vérifier la durée sans ffprobe,
 * donc ce contrôle évite un upload inutile mais ne protège rien — c'est la
 * limite de TAILLE côté serveur qui fait foi.
 * @returns {Promise<number|null>} secondes, ou null si illisible
 */
export function readVideoDuration(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    const done = (value) => { URL.revokeObjectURL(url); resolve(value); };
    video.preload = "metadata";
    video.onloadedmetadata = () => done(Number.isFinite(video.duration) ? video.duration : null);
    video.onerror = () => done(null);
    setTimeout(() => done(null), 5000); // codec exotique : on laisse le serveur trancher
    video.src = url;
  });
}

/**
 * Pré-validation locale d'une sélection de fichiers.
 * @returns {{ok: true, files: File[]} | {ok: false, error: string}}
 */
export function validateSelection(files, limits, alreadyAttached = 0, alreadyBytes = 0, alreadyHasVideo = false) {
  if (!limits) return { ok: false, error: "L'envoi de fichiers est réservé aux forfaits payants." };
  const list = Array.from(files || []);
  if (list.length === 0) return { ok: true, files: [] };
  if (alreadyAttached + list.length > limits.maxFiles) {
    return { ok: false, error: `Maximum ${limits.maxFiles} fichier${limits.maxFiles > 1 ? "s" : ""} par message avec ton forfait.` };
  }
  for (const f of list) {
    const kind = kindOfMime(f.type);
    if (!kind || !limits.kinds.includes(kind)) {
      const accepted = ["JPG, PNG, WebP", limits.kinds.includes("pdf") && "PDF", limits.kinds.includes("video") && "MP4, MOV, WebM"]
        .filter(Boolean).join(", ");
      const upsell = kind === "video" && !limits.kinds.includes("video")
        ? " 🎬 L'analyse de vidéos est exclusive au forfait VIP Elite."
        : "";
      return { ok: false, error: `"${f.name}" : format non pris en charge (${accepted}).${upsell}` };
    }
  }
  // Une seule vidéo par message (recommandation Google, et coût maîtrisé)
  const videos = list.filter((f) => kindOfMime(f.type) === "video");
  if (videos.length > 1 || (videos.length === 1 && alreadyHasVideo)) {
    return { ok: false, error: "Une seule vidéo par message — envoie-les l'une après l'autre pour une analyse précise." };
  }
  // Le poids déjà sélectionné compte : sinon 4 Mo + 4 Mo passent le contrôle
  // local sur un plan à 5 Mo et l'erreur ne tombe qu'après l'upload.
  const total = alreadyBytes + list.reduce((s, f) => s + f.size, 0);
  if (total > limits.maxTotalBytes) {
    return { ok: false, error: `Poids total trop élevé (max ${formatBytes(limits.maxTotalBytes)} par message).` };
  }
  return { ok: true, files: list };
}

/**
 * Téléverse les fichiers et retourne les références serveur à joindre au
 * message : [{path, name, mime, size, kind}].
 * @throws {Error} message serveur prêt à afficher
 */
export async function uploadAttachments(API_URL, files) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f, f.name));
  // Pas de Content-Type manuel : le navigateur pose le boundary multipart.
  const res = await apiFetch(`${API_URL}/api/gideon/upload`, { method: "POST", body: form });
  let data = null;
  try { data = await res.json(); } catch { /* corps non JSON */ }
  if (!res.ok) throw new Error(data?.error || "Échec de l'envoi des fichiers.");
  // Un 200 sans références = anomalie serveur : on refuse d'envoyer le message
  // silencieusement sans les fichiers que l'utilisateur croit avoir joints.
  if (!Array.isArray(data?.attachments) || data.attachments.length !== files.length) {
    throw new Error("Les fichiers n'ont pas pu être enregistrés. Réessaie dans quelques instants.");
  }
  return { attachments: data.attachments, uploadLimits: data.uploadLimits || null };
}

/** Supprime des fichiers déjà téléversés (message abandonné / envoi échoué). */
export async function discardAttachments(API_URL, paths = []) {
  if (!paths.length) return;
  try {
    await apiFetch(`${API_URL}/api/gideon/upload`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch (err) {
    // Non bloquant pour l'utilisateur, mais tracé : un échec répété signifie
    // des fichiers orphelins facturés dans le bucket.
    console.warn("⚠️ Nettoyage des pièces jointes impossible:", err);
  }
}

/** URL signée (1 h) pour réafficher la vignette d'un message rechargé. */
export async function signedAttachmentUrl(API_URL, path) {
  try {
    const res = await apiFetch(`${API_URL}/api/gideon/attachment?path=${encodeURIComponent(path)}`);
    if (!res.ok) {
      console.warn(`⚠️ Aperçu indisponible pour ${path} (HTTP ${res.status})`);
      return null;
    }
    return (await res.json())?.url || null;
  } catch (err) {
    console.warn("⚠️ Aperçu de pièce jointe indisponible:", err);
    return null;
  }
}
