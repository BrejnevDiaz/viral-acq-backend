// ─── Client SSE pour /api/gideon/stream ──────────────────────────────────────
// Lit le flux Server-Sent Events du backend et appelle onChunk(texteComplet)
// à chaque fragment reçu (texte cumulé, prêt à afficher). Retourne l'état
// final { answer, sources, tier, restricted, model } émis par l'event "done".
// En cas d'échec (réseau, HTTP != 200, event "error"), throw — l'appelant
// bascule alors sur le endpoint non-streamé /api/gideon.
import { apiFetch } from "./apiClient";

export async function streamGideon({ API_URL, question, conversationHistory = [], conversationId = null, onChunk }) {
  const res = await apiFetch(`${API_URL}/api/gideon/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, conversationHistory, conversationId }),
  });
  if (!res.ok || !res.body) throw new Error(`Gideon stream HTTP ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "chunk";
  let fullText = "";
  let result = null;

  const processLine = (line) => {
    if (line.startsWith("event:")) {
      currentEvent = line.slice(6).trim();
      return;
    }
    if (!line.startsWith("data:")) return;
    const payload = line.slice(5).trim();
    if (!payload) return;
    let json;
    try { json = JSON.parse(payload); } catch { return; }

    if (currentEvent === "chunk" && json.text) {
      fullText += json.text;
      onChunk?.(fullText);
    } else if (currentEvent === "done") {
      result = json;
    } else if (currentEvent === "error") {
      throw new Error(json.message || "Gideon stream error");
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // ligne potentiellement incomplète
    for (const line of lines) processLine(line.trim());
  }

  if (!result) throw new Error("Stream terminé sans event done");
  return result;
}
