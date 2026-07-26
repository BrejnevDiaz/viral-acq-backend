// ─── Gideon — Pièces jointes multimodales (Chantier #16) ─────────────────────
// Upload de fichiers (images, PDF) joints aux messages du Coach IA, stockés
// dans le bucket privé Supabase Storage "gideon-uploads" (voir
// supabase/gideon_uploads.sql). Vidéos : hors périmètre v1 (les moteurs de
// secours OpenAI/Claude ne les lisent pas — réévaluer avec Gemini Files API).
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
// LIMITE TECHNIQUE : l'API Gemini plafonne une REQUÊTE inline à ~20 Mo, et le
// base64 gonfle les octets de ~33 % — auxquels s'ajoutent le system prompt et
// le contexte RAG. Le total utile par message est donc borné à 12 Mo quel que
// soit le plan (12 Mo → ~16 Mo encodés, marge confortable). Passer à la Files
// API Gemini pour lever cette limite (v2).
//
// FORMATS : pas de GIF — accepté par le navigateur mais refusé par l'inline
// Gemini (png/jpeg/webp/heic/heif uniquement) : le laisser passer produirait
// un échec du moteur principal sans explication pour l'utilisateur.

import crypto from "crypto";
import { supabase } from "./supabaseClient.js";

export const GIDEON_UPLOAD_BUCKET = "gideon-uploads";

// Plafond technique inline Gemini (voir note d'en-tête).
const MAX_INLINE_TOTAL = 12 * 1024 * 1024;

// ─── Limites par plan ────────────────────────────────────────────────────────
// maxFiles = nombre de fichiers par MESSAGE ; maxTotalBytes = poids total par
// message ; kinds = familles autorisées. Free : pas d'upload (Gideon est de
// toute façon restreint). Grille validée par Diaz le 26/07 (MB ajustés au
// plafond inline Gemini pour pro/elite).
export const GIDEON_UPLOAD_LIMITS = {
  plus:      { maxFiles: 2,  maxTotalBytes: 5 * 1024 * 1024, kinds: ["image"] },
  standard:  { maxFiles: 3,  maxTotalBytes: 8 * 1024 * 1024, kinds: ["image", "pdf"] },
  pro:       { maxFiles: 5,  maxTotalBytes: MAX_INLINE_TOTAL, kinds: ["image", "pdf"] },
  vip_pro:   { maxFiles: 5,  maxTotalBytes: MAX_INLINE_TOTAL, kinds: ["image", "pdf"] },
  elite:     { maxFiles: 10, maxTotalBytes: MAX_INLINE_TOTAL, kinds: ["image", "pdf"] },
  vip_elite: { maxFiles: 10, maxTotalBytes: MAX_INLINE_TOTAL, kinds: ["image", "pdf"] },
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
  if (b.slice(0, 4).toString("ascii") === "RIFF" && b.slice(8, 12).toString("ascii") === "WEBP")
    return { kind: "image", mime: "image/webp", ext: "webp" };
  if (b.slice(0, 5).toString("ascii") === "%PDF-")
    return { kind: "pdf", mime: "application/pdf", ext: "pdf" };
  return null;
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

  const stored = [];
  for (const file of files) {
    const type = sniffFileType(file.buffer);
    if (!type) {
      await removeGideonAttachments(stored.map((a) => a.path));
      return { error: `"${safeName(file.originalname)}" : format non pris en charge. Formats acceptés : JPG, PNG, WebP${limits.kinds.includes("pdf") ? ", PDF" : ""}.`, status: 400 };
    }
    if (!limits.kinds.includes(type.kind)) {
      await removeGideonAttachments(stored.map((a) => a.path));
      const upsell = type.kind === "pdf" ? " Les PDF sont disponibles à partir du forfait Standard." : "";
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
 * génération multimodale (base64). Vérifie l'APPARTENANCE de chaque chemin.
 * @param {Object} user - req.user
 * @param {Object[]} refs - [{path, name, mime, size}] envoyés par le front
 * @returns {Promise<{attachments?: {mime,name,data}[], error?: string, status?: number}>}
 */
export async function loadGideonAttachments(user, refs) {
  if (!refs || refs.length === 0) return { attachments: [] };
  const limits = uploadLimitsFor(user?.plan, user?.role);
  if (!limits) return { error: "Pièces jointes non autorisées avec ton forfait.", status: 403 };
  if (!supabase) return { error: "Stockage non configuré côté serveur", status: 500 };
  if (!Array.isArray(refs) || refs.length > limits.maxFiles) {
    return { error: `Maximum ${limits.maxFiles} fichiers par message.`, status: 400 };
  }

  const attachments = [];
  let total = 0;
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
    attachments.push({ mime: type.mime, kind: type.kind, name: safeName(ref?.name || path.split("/").pop()), data: buffer.toString("base64") });
  }
  return { attachments };
}
