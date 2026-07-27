// ─── Gemini Files API — upload des médias lourds (Chantier #17) ──────────────
// Les vidéos (et les fichiers > 12 Mo) ne peuvent pas être envoyés en inline
// base64 : l'API Gemini plafonne une requête à ~20 Mo. On passe donc par la
// Files API : le fichier est téléversé une fois, Gemini renvoie une URI
// (`files/xxx`) qu'on référence ensuite dans les requêtes de génération.
//
// CYCLE DE VIE (documenté par Google, vérifié le 27/07/2026) :
// - 2 Go max par fichier, 20 Go par projet
// - le fichier est SUPPRIMÉ AUTOMATIQUEMENT APRÈS 48 H côté Google
// - une vidéo passe par un état PROCESSING avant de devenir ACTIVE : tant
//   qu'elle n'est pas ACTIVE, la référencer fait échouer la génération
//
// C'est pourquoi Supabase Storage reste la source de vérité : vignettes,
// historique et ré-analyse au-delà de 48 h. L'URI Gemini n'est PAS persistée —
// chaque message qui référence un média le re-téléverse. Un cache d'URI serait
// possible (il faudrait stocker l'URI et sa date dans les métadonnées du
// message, et la considérer morte après ~46 h), mais il n'est pas implémenté :
// ne pas laisser croire le contraire.
//
// COÛT : Gemini tokenise une vidéo à ~300 tokens/seconde en résolution par
// défaut, ~100 tokens/s en `media_resolution: low` (échantillonnage 1 image/s
// + audio). D'où la limite de durée par plan dans gideonUploads.js et le
// surcoût de quota appliqué dans server.js.

const GEMINI_FILES_BASE = "https://generativelanguage.googleapis.com";

// Une vidéo de 90 s met généralement quelques secondes à être traitée ; on
// borne l'attente pour ne jamais bloquer une requête HTTP indéfiniment.
const PROCESSING_TIMEOUT_MS = 60_000;
const PROCESSING_POLL_MS = 1_500;

/**
 * Téléverse un buffer vers la Files API et attend qu'il soit exploitable.
 * Protocole resumable en deux temps : on annonce la taille et le type, Google
 * renvoie une URL d'upload à usage unique, puis on y pousse les octets.
 * @param {Buffer} buffer
 * @param {Object} opts - { mime, displayName }
 * @returns {Promise<{uri: string, mime: string, name: string, uploadedAt: string}>}
 * @throws {Error} message lisible (jamais d'échec silencieux)
 */
export async function uploadToGeminiFiles(buffer, { mime, displayName = "fichier" } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY absente : impossible d'analyser ce média.");
  if (!buffer?.length) throw new Error("Fichier vide.");

  // 1. Démarrage : on obtient l'URL d'upload
  const startRes = await fetch(`${GEMINI_FILES_BASE}/upload/v1beta/files`, {
    method: "POST",
    headers: {
      "x-goog-api-key": key,
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(buffer.length),
      "X-Goog-Upload-Header-Content-Type": mime,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: { display_name: displayName } }),
  });
  if (!startRes.ok) {
    const body = await startRes.text().catch(() => "");
    throw new Error(`Files API (start) ${startRes.status} ${body.slice(0, 200)}`);
  }
  const uploadUrl = startRes.headers.get("x-goog-upload-url");
  if (!uploadUrl) throw new Error("Files API : URL d'upload absente de la réponse.");

  // 2. Envoi des octets + finalisation
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Length": String(buffer.length),
      "X-Goog-Upload-Offset": "0",
      "X-Goog-Upload-Command": "upload, finalize",
    },
    body: buffer,
  });
  if (!uploadRes.ok) {
    const body = await uploadRes.text().catch(() => "");
    throw new Error(`Files API (upload) ${uploadRes.status} ${body.slice(0, 200)}`);
  }
  const info = await uploadRes.json();
  const file = info?.file;
  if (!file?.uri || !file?.name) throw new Error("Files API : réponse d'upload inexploitable.");

  // 3. Attente de l'état ACTIVE (les vidéos sont transcodées avant usage)
  const state = await waitUntilActive(file, key);
  if (state !== "ACTIVE") {
    throw new Error(
      state === "FAILED"
        ? "Gemini n'a pas réussi à traiter ce média (format ou fichier corrompu)."
        : "Le traitement du média par Gemini a pris trop de temps. Réessaie dans un instant."
    );
  }

  return { uri: file.uri, mime: file.mimeType || mime, name: file.name, uploadedAt: new Date().toISOString() };
}

async function waitUntilActive(file, key) {
  if (file.state && file.state !== "PROCESSING") return file.state;
  const deadline = Date.now() + PROCESSING_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, PROCESSING_POLL_MS));
    const res = await fetch(`${GEMINI_FILES_BASE}/v1beta/${file.name}`, {
      headers: { "x-goog-api-key": key },
    });
    if (!res.ok) {
      // On log mais on continue : un hoquet transitoire ne doit pas tuer la requête
      console.warn(`⚠️ Files API (get) ${res.status} — nouvelle tentative`);
      continue;
    }
    const data = await res.json();
    if (data?.state && data.state !== "PROCESSING") return data.state;
  }
  return "TIMEOUT";
}

/** Supprime un fichier côté Gemini (best-effort — le TTL de 48 h fait le reste). */
export async function deleteGeminiFile(name) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !name) return;
  try {
    await fetch(`${GEMINI_FILES_BASE}/v1beta/${name}`, {
      method: "DELETE",
      headers: { "x-goog-api-key": key },
    });
  } catch (err) {
    console.warn("⚠️ Suppression Gemini Files impossible:", err.message);
  }
}
