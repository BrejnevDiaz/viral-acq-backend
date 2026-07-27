// ─── Gideon — Pièces jointes multimodales (Chantiers #16 et #17) ─────────────
// Upload de fichiers (images, PDF, vidéos) joints aux messages du Coach IA,
// stockés dans le bucket privé Supabase Storage "gideon-uploads" (voir
// supabase/gideon_uploads.sql).
//
// SÉCURITÉ :
// - Les types sont validés côté serveur par MAGIC BYTES (jamais le mimetype
//   déclaré par le client, falsifiable) — un .exe renommé en .png est rejeté.
// - Chaque fichier est rangé sous `${user.id}/…` ; à la lecture, le serveur
//   vérifie que le chemin demandé appartient bien à l'appelant (un utilisateur
//   ne peut pas faire lire les fichiers d'un autre en forgeant un path).
// - Les uploads/downloads passent par le client serveur (supabaseClient.js,
//   clé service) : le bucket est privé, aucune URL publique.
//
// DEUX CHEMINS VERS GEMINI (chantier #17) :
// - inline base64 pour tout fichier ≤ 12 Mo : rapide, aucun aller-retour
//   supplémentaire. L'API plafonne une requête à ~20 Mo et le base64 gonfle de
//   ~33 %, d'où ce seuil (12 Mo → ~16 Mo encodés, marge pour prompt + RAG).
// - Files API (geminiFiles.js) au-delà, et TOUJOURS pour les vidéos : upload
//   séparé puis référence par URI. Coût : quelques secondes de traitement.
//
// FORMATS : pas de GIF — accepté par le navigateur mais refusé par l'inline
// Gemini (png/jpeg/webp/heic/heif uniquement) : le laisser passer produirait
// un échec du moteur principal sans explication pour l'utilisateur.

import crypto from "crypto";
import { supabase } from "./supabaseClient.js";
import { uploadToGeminiFiles, deleteGeminiFile } from "./geminiFiles.js";

export const GIDEON_UPLOAD_BUCKET = "gideon-uploads";

// Au-delà de ce seuil, un fichier part par la Files API au lieu de l'inline.
export const INLINE_MAX_BYTES = 12 * 1024 * 1024;

// ─── Budget vidéo ────────────────────────────────────────────────────────────
// Gemini tokenise ~100 tokens par seconde de vidéo en media_resolution LOW
// (1 image/s + audio). 90 s ≈ 9 000 tokens : coûteux mais maîtrisé, d'où la
// réservation au plan Elite et le surcoût de quota (server.js).
// La DURÉE est mesurée côté serveur en lisant la boîte `mvhd` du conteneur
// (readIsoBmffDuration) : c'est elle qui borne le coût, la taille ne le fait
// pas (60 Mo bien compressés = plusieurs dizaines de minutes). Conséquence :
// seuls les conteneurs ISO-BMFF sont acceptés — MP4, MOV, 3GP. WebM et AVI
// sont refusés faute de pouvoir lire leur durée.
export const VIDEO_MAX_SECONDS = 90;
export const VIDEO_MAX_BYTES = 60 * 1024 * 1024;

// ─── Limites par plan ────────────────────────────────────────────────────────
// maxFiles = nombre de fichiers par MESSAGE ; maxTotalBytes = poids total par
// message ; kinds = familles autorisées. Free : pas d'upload (Gideon est de
// toute façon restreint). Grille validée par Diaz (26/07, étendue le 27/07).
// La vidéo est réservée à Elite : c'est le poste de coût le plus lourd et un
// argument d'upsell assumé.
export const GIDEON_UPLOAD_LIMITS = {
  plus:      { maxFiles: 2,  maxTotalBytes: 5 * 1024 * 1024,  kinds: ["image"] },
  standard:  { maxFiles: 3,  maxTotalBytes: 8 * 1024 * 1024,  kinds: ["image", "pdf"] },
  pro:       { maxFiles: 5,  maxTotalBytes: 25 * 1024 * 1024, kinds: ["image", "pdf"] },
  vip_pro:   { maxFiles: 5,  maxTotalBytes: 25 * 1024 * 1024, kinds: ["image", "pdf"] },
  elite:     { maxFiles: 10, maxTotalBytes: VIDEO_MAX_BYTES,  kinds: ["image", "pdf", "video"] },
  vip_elite: { maxFiles: 10, maxTotalBytes: VIDEO_MAX_BYTES,  kinds: ["image", "pdf", "video"] },
};

export const uploadLimitsFor = (plan = "free", role = "user") => {
  if (role === "admin") return GIDEON_UPLOAD_LIMITS.elite;
  return GIDEON_UPLOAD_LIMITS[plan] || null; // null → upload interdit (free)
};

// ─── Détection de type par magic bytes ───────────────────────────────────────
// Retourne { kind, mime, ext } ou null si le contenu ne correspond à aucun
// format autorisé. On fait AUTORITÉ sur le contenu réel, pas sur l'extension.
export function sniffFileType(buffer) {
  if (!buffer || buffer.length < 12) return null;
  const b = buffer;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)
    return { kind: "image", mime: "image/jpeg", ext: "jpg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return { kind: "image", mime: "image/png", ext: "png" };
  // RIFF sert à la fois au WebP (image) et à l'AVI (vidéo) — c'est le tag des
  // octets 8-12 qui tranche, jamais l'extension. L'AVI est refusé : sa durée
  // n'est pas lisible par notre parseur ISO-BMFF, donc son coût ne serait pas
  // borné (voir readIsoBmffDuration).
  if (b.slice(0, 4).toString("ascii") === "RIFF") {
    const tag = b.slice(8, 12).toString("ascii");
    if (tag === "WEBP") return { kind: "image", mime: "image/webp", ext: "webp" };
    return null;
  }
  if (b.slice(0, 5).toString("ascii") === "%PDF-")
    return { kind: "pdf", mime: "application/pdf", ext: "pdf" };
  // MP4 / MOV / 3GP : boîte "ftyp" à l'offset 4, la marque (brand) qui suit
  // distingue QuickTime du reste de la famille ISO-BMFF.
  if (b.slice(4, 8).toString("ascii") === "ftyp") {
    const brand = b.slice(8, 12).toString("ascii");
    if (brand.startsWith("qt")) return { kind: "video", mime: "video/quicktime", ext: "mov" };
    if (brand.startsWith("3g")) return { kind: "video", mime: "video/3gpp", ext: "3gp" };
    return { kind: "video", mime: "video/mp4", ext: "mp4" };
  }
  // WebM / Matroska volontairement NON accepté : conteneur EBML dont la durée
  // n'est pas lisible par readIsoBmffDuration, donc coût non bornable. Le
  // laisser passer reviendrait à accepter une vidéo de durée inconnue.
  return null;
}

/** Un média doit-il passer par la Files API plutôt que par l'inline base64 ? */
export const needsGeminiFilesApi = (kind, size = 0) => kind === "video" || size > INLINE_MAX_BYTES;

// ─── Durée d'une vidéo, mesurée côté serveur ─────────────────────────────────
// Le poids ne borne PAS le coût : 60 Mo de H.264 bien compressé peuvent
// contenir une demi-heure de vidéo, soit ~180 000 tokens. Seule la durée le
// borne, et le contrôle navigateur est trivialement contournable (le serveur
// est la seule autorité). ffprobe n'existe pas sur l'image Railway, alors on
// lit directement la boîte `mvhd` du conteneur ISO-BMFF (MP4, MOV, 3GP) :
// c'est un en-tête normalisé, pas un décodage.
// Renvoie les secondes, ou null si le conteneur n'est pas lisible (WebM, AVI,
// fichier tronqué) — l'appelant refuse alors le média plutôt que de laisser
// passer une durée inconnue.
export function readIsoBmffDuration(buffer) {
  const readBoxes = (start, end, depth = 0) => {
    let offset = start;
    while (offset + 8 <= end && depth < 4) {
      let size = buffer.readUInt32BE(offset);
      const type = buffer.slice(offset + 4, offset + 8).toString("ascii");
      let header = 8;
      if (size === 1) {
        // Taille 64 bits : on ignore les 32 bits de poids fort (aucun conteneur
        // légitime de cette application ne dépasse 4 Go).
        if (offset + 16 > end) return null;
        size = buffer.readUInt32BE(offset + 12);
        header = 16;
      } else if (size === 0) {
        size = end - offset; // boîte qui s'étend jusqu'à la fin du fichier
      }
      if (size < header || offset + size > end) return null;

      if (type === "mvhd") {
        const p = offset + header;
        const version = buffer[p];
        // version 0 : timescale et duration en 32 bits ; version 1 : dates en
        // 64 bits, timescale en 32, duration en 64.
        const tsOffset = p + (version === 1 ? 20 : 12);
        if (tsOffset + (version === 1 ? 12 : 8) > end) return null;
        const timescale = buffer.readUInt32BE(tsOffset);
        const duration = version === 1
          ? Number(buffer.readBigUInt64BE(tsOffset + 4))
          : buffer.readUInt32BE(tsOffset + 4);
        if (!timescale || !Number.isFinite(duration)) return null;
        return duration / timescale;
      }
      // `moov` et `trak` sont des conteneurs : on descend dedans.
      if (type === "moov" || type === "trak" || type === "mdia") {
        const inner = readBoxes(offset + header, offset + size, depth + 1);
        if (inner !== null) return inner;
      }
      offset += size;
    }
    return null;
  };

  try {
    return readBoxes(0, buffer.length);
  } catch {
    return null; // conteneur malformé → traité comme durée inconnue
  }
}

// Nettoie un nom de fichier pour l'affichage/stockage en métadonnée (jamais
// utilisé comme chemin réel — le chemin est un UUID généré serveur).
const safeName = (name = "fichier") =>
  String(name).replace(/[^\w.\- ]+/g, "_").slice(0, 120) || "fichier";

// ─── Upload ──────────────────────────────────────────────────────────────────
/**
 * Valide et stocke les fichiers d'un message. Tout-ou-rien : si un fichier est
 * refusé, aucun n'est conservé (les déjà-stockés sont supprimés).
 * @param {Object} user - req.user (id, plan, role)
 * @param {Object[]} files - fichiers multer (memoryStorage : .buffer, .originalname, .size)
 * @returns {Promise<{attachments?: Object[], error?: string, status?: number}>}
 */
export async function storeGideonAttachments(user, files) {
  const limits = uploadLimitsFor(user?.plan, user?.role);
  if (!limits) {
    return { error: "📎 L'envoi de fichiers à Gideon est réservé aux abonnés. Passe à un forfait payant pour débloquer l'analyse de tes screenshots et documents !", status: 403 };
  }
  if (!supabase) return { error: "Stockage non configuré côté serveur", status: 500 };
  if (!files || files.length === 0) return { error: "Aucun fichier reçu", status: 400 };
  if (files.length > limits.maxFiles) {
    return { error: `Maximum ${limits.maxFiles} fichier${limits.maxFiles > 1 ? "s" : ""} par message avec ton forfait.`, status: 400 };
  }
  const total = files.reduce((s, f) => s + (f.size || 0), 0);
  if (total > limits.maxTotalBytes) {
    return { error: `Poids total trop élevé (max ${Math.round(limits.maxTotalBytes / 1024 / 1024)} Mo par message avec ton forfait).`, status: 400 };
  }

  // Une seule vidéo par message : Google recommande explicitement un seul
  // média vidéo par requête, et deux vidéos doubleraient un coût déjà lourd.
  const videos = files.filter((f) => sniffFileType(f.buffer)?.kind === "video");
  if (videos.length > 1) {
    return { error: "Une seule vidéo par message — envoie-les l'une après l'autre pour une analyse précise.", status: 400 };
  }
  if (videos.length === 1 && videos[0].size > VIDEO_MAX_BYTES) {
    return { error: `Vidéo trop lourde (max ${Math.round(VIDEO_MAX_BYTES / 1024 / 1024)} Mo, soit environ ${VIDEO_MAX_SECONDS} secondes de créative).`, status: 400 };
  }

  const stored = [];
  for (const file of files) {
    const type = sniffFileType(file.buffer);
    if (!type) {
      await removeGideonAttachments(stored.map((a) => a.path));
      const accepted = ["JPG, PNG, WebP", limits.kinds.includes("pdf") && "PDF", limits.kinds.includes("video") && "MP4, MOV, WebM"]
        .filter(Boolean).join(", ");
      return { error: `"${safeName(file.originalname)}" : format non pris en charge. Formats acceptés : ${accepted}.`, status: 400 };
    }
    if (!limits.kinds.includes(type.kind)) {
      await removeGideonAttachments(stored.map((a) => a.path));
      const upsell = type.kind === "pdf"
        ? " Les PDF sont disponibles à partir du forfait Standard."
        : type.kind === "video"
        ? " 🎬 L'analyse de vidéos est exclusive au forfait VIP Elite — Gideon décortique le hook, le rythme et le montage de tes créatives."
        : "";
      return { error: `"${safeName(file.originalname)}" : type non autorisé avec ton forfait.${upsell}`, status: 400 };
    }

    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${type.ext}`;
    const { error } = await supabase.storage
      .from(GIDEON_UPLOAD_BUCKET)
      .upload(path, file.buffer, { contentType: type.mime, upsert: false });
    if (error) {
      console.error("❌ Gideon upload storage error:", error.message);
      await removeGideonAttachments(stored.map((a) => a.path));
      return { error: "Échec du stockage du fichier. Réessaie dans quelques instants.", status: 500 };
    }
    stored.push({ path, name: safeName(file.originalname), mime: type.mime, size: file.size, kind: type.kind });
  }
  return { attachments: stored };
}

/** Supprime des fichiers du bucket (best-effort, jamais bloquant). */
export async function removeGideonAttachments(paths = []) {
  if (!supabase || paths.length === 0) return;
  const { error } = await supabase.storage.from(GIDEON_UPLOAD_BUCKET).remove(paths);
  if (error) console.error("⚠️ Gideon upload cleanup error:", error.message);
}

/**
 * Supprime des fichiers APRÈS avoir vérifié qu'ils appartiennent bien à
 * l'appelant — sert au nettoyage déclenché par le client (message abandonné,
 * envoi échoué) pour ne pas laisser d'orphelins dans le bucket.
 */
export async function removeOwnedAttachments(user, paths = []) {
  const owned = (paths || [])
    .map((p) => String(p || ""))
    .filter((p) => p.startsWith(`${user.id}/`) && !p.includes(".."));
  await removeGideonAttachments(owned);
  return owned.length;
}

/**
 * Normalise les métadonnées à persister : on ne fait PAS confiance aux champs
 * renvoyés par le client (name/mime/size arbitraires) — on les reconstruit à
 * partir des données réellement stockées.
 */
export function sanitizeAttachmentRefs(refs = [], loaded = []) {
  return (refs || []).map((ref, i) => ({
    path: String(ref?.path || ""),
    name: loaded[i]?.name || safeName(ref?.name),
    mime: loaded[i]?.mime || "application/octet-stream",
    kind: loaded[i]?.kind || "image",
    size: Number.isFinite(ref?.size) ? ref.size : null,
  })).filter((r) => r.path);
}

/** Extrait tous les chemins de pièces jointes d'un lot de lignes gideon_messages. */
export const pathsFromMessageRows = (rows = []) =>
  rows.flatMap((r) => (Array.isArray(r?.attachments) ? r.attachments : []))
      .map((a) => a?.path)
      .filter(Boolean);

// ─── Lecture pour le pipeline IA ─────────────────────────────────────────────
/**
 * Charge les pièces jointes référencées par un message et les prépare pour la
 * génération multimodale. Vérifie l'APPARTENANCE de chaque chemin.
 * Deux formes de sortie selon la taille et le type (chantier #17) :
 * - { kind, mime, name, data }  → inline base64 (≤ 12 Mo, hors vidéo)
 * - { kind, mime, name, uri }   → référence Files API (vidéos et gros fichiers)
 * @param {Object} user - req.user
 * @param {Object[]} refs - [{path, name, mime, size}] envoyés par le front
 * @returns {Promise<{attachments?: Object[], error?: string, status?: number}>}
 */
export async function loadGideonAttachments(user, refs, { onVideoDetected } = {}) {
  const inspected = await inspectGideonAttachments(user, refs);
  if (inspected.error) return inspected;
  if (inspected.items.length === 0) return { attachments: [], hasVideo: false };

  // Le garde-fou vidéo s'appuie sur le type RÉEL (magic bytes), jamais sur le
  // `kind` du body — sinon il suffirait de déclarer `kind:"image"` pour faire
  // analyser une vidéo hors quota. Et il s'exécute AVANT tout upload : inutile
  // de pousser 60 Mo chez Google pour découvrir ensuite que le plafond est
  // atteint.
  if (inspected.hasVideo && onVideoDetected) {
    const refusal = await onVideoDetected();
    if (refusal) return refusal;
  }

  const attachments = [];
  for (const item of inspected.items) {
    if (!needsGeminiFilesApi(item.kind, item.buffer.length)) {
      attachments.push({ kind: item.kind, mime: item.mime, name: item.name, data: item.buffer.toString("base64") });
      continue;
    }
    // Vidéos et fichiers volumineux : upload séparé vers Gemini, puis simple
    // référence par URI. L'échec est remonté tel quel à l'utilisateur — jamais
    // d'analyse silencieusement amputée — et les fichiers déjà poussés chez
    // Google sont supprimés pour ne pas grignoter le quota projet de 20 Go.
    try {
      const file = await uploadToGeminiFiles(item.buffer, { mime: item.mime, displayName: item.name });
      attachments.push({ kind: item.kind, mime: file.mime, name: item.name, uri: file.uri, geminiName: file.name });
    } catch (err) {
      console.error("❌ Gemini Files upload error:", err.message);
      await releaseGeminiFiles(attachments);
      return { error: `"${item.name}" : ${err.message}`, status: 502 };
    }
  }
  return { attachments, hasVideo: inspected.hasVideo };
}

/**
 * Télécharge et authentifie les pièces jointes SANS rien envoyer à Gemini :
 * appartenance du chemin, type réel par magic bytes, dédoublonnage, plafonds.
 * Séparé de l'upload pour que le quota vidéo puisse être évalué sur des types
 * vérifiés avant de payer le moindre octet de bande passante.
 */
async function inspectGideonAttachments(user, refs) {
  if (!refs || refs.length === 0) return { items: [], hasVideo: false };
  const limits = uploadLimitsFor(user?.plan, user?.role);
  if (!limits) return { error: "Pièces jointes non autorisées avec ton forfait.", status: 403 };
  if (!supabase) return { error: "Stockage non configuré côté serveur", status: 500 };
  if (!Array.isArray(refs) || refs.length > limits.maxFiles) {
    return { error: `Maximum ${limits.maxFiles} fichiers par message.`, status: 400 };
  }

  // Un même chemin répété ferait uploader et facturer le même média plusieurs
  // fois pour une seule unité de quota.
  const paths = [...new Set(refs.map((r) => String(r?.path || "")))];
  if (paths.length !== refs.length) {
    return { error: "Pièce jointe dupliquée dans le message.", status: 400 };
  }

  const items = [];
  let total = 0;
  let videos = 0;
  for (const ref of refs) {
    const path = String(ref?.path || "");
    // Un chemin doit appartenir à l'appelant : `${user.id}/xxxx.ext`, sans "..".
    if (!path.startsWith(`${user.id}/`) || path.includes("..")) {
      return { error: "Pièce jointe invalide.", status: 400 };
    }
    const { data, error } = await supabase.storage.from(GIDEON_UPLOAD_BUCKET).download(path);
    if (error || !data) {
      console.error("❌ Gideon attachment download error:", error?.message || "vide");
      return { error: "Une pièce jointe est introuvable — renvoie tes fichiers.", status: 400 };
    }
    const buffer = Buffer.from(await data.arrayBuffer());
    const type = sniffFileType(buffer); // re-validation du contenu réel stocké
    if (!type || !limits.kinds.includes(type.kind)) {
      return { error: "Pièce jointe invalide.", status: 400 };
    }
    total += buffer.length;
    if (total > limits.maxTotalBytes) {
      return { error: `Poids total des pièces jointes trop élevé (max ${Math.round(limits.maxTotalBytes / 1024 / 1024)} Mo).`, status: 400 };
    }

    if (type.kind === "video") {
      // Règle revérifiée ici : l'upload se fait fichier par fichier, deux
      // appels séparés pourraient sinon aboutir à deux vidéos dans un message.
      if (++videos > 1) {
        return { error: "Une seule vidéo par message — envoie-les l'une après l'autre pour une analyse précise.", status: 400 };
      }
      if (buffer.length > VIDEO_MAX_BYTES) {
        return { error: `Vidéo trop lourde (max ${Math.round(VIDEO_MAX_BYTES / 1024 / 1024)} Mo).`, status: 400 };
      }
      // Durée mesurée côté SERVEUR : c'est elle qui borne réellement le coût
      // (~100 tokens/s), pas le poids du fichier — 60 Mo de H.264 bien
      // compressé peuvent représenter une demi-heure de vidéo.
      const seconds = readIsoBmffDuration(buffer);
      if (seconds === null) {
        return { error: `"${safeName(ref?.name)}" : durée illisible. Réencode ta vidéo en MP4 (H.264) et réessaie.`, status: 400 };
      }
      if (seconds > VIDEO_MAX_SECONDS) {
        return { error: `Vidéo trop longue (${Math.round(seconds)}s, maximum ${VIDEO_MAX_SECONDS}s). Découpe la séquence qui t'intéresse.`, status: 400 };
      }
    }

    items.push({ kind: type.kind, mime: type.mime, name: safeName(ref?.name || path.split("/").pop()), buffer });
  }
  return { items, hasVideo: videos > 0 };
}

/** Supprime côté Google les médias déjà téléversés pour un message avorté. */
export async function releaseGeminiFiles(attachments = []) {
  for (const a of attachments) {
    if (a?.geminiName) await deleteGeminiFile(a.geminiName);
  }
}
