import { useEffect, useRef, useState } from "react";
import { apiFetch } from "./utils/apiClient";

// ─── Connaissances IA (admin) ─────────────────────────────────────────────────
// Interface d'ingestion du savoir de Gideon : upload d'un PDF de formation →
// le backend le découpe en chunks, génère les embeddings OpenAI et stocke dans
// Supabase pgvector. Chaque PDF est taggé par catégorie + tier d'accès, ce qui
// détermine quels abonnés voient ce savoir dans leurs réponses Gideon.
// Onglet visible uniquement pour le rôle admin (filtré dans Sidebar + App).

const TIERS = [
  { id: "creator_standard", labelFr: "Créateurs Standard (39€) — viralité, UGC, négociation", labelEn: "Standard Creators (39€) — virality, UGC, negotiation" },
  { id: "vip_pro",          labelFr: "VIP Pro (99€) — marketing de base",                      labelEn: "VIP Pro (99€) — core marketing" },
  { id: "elite",            labelFr: "VIP Elite (299€) — tout le savoir avancé",               labelEn: "VIP Elite (299€) — all advanced knowledge" },
];

const CATEGORIES = ["marketing", "ecommerce", "viralite", "ugc", "negociation", "scaling", "publicite", "general"];

export default function KnowledgeAdminTab({ c, mono, uiLang = "fr", API_URL }) {
  const fr = uiLang === "fr", it = uiLang === "it";
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("marketing");
  const [tier, setTier] = useState("elite");
  const [ingesting, setIngesting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [uploads, setUploads] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const loadUploads = async () => {
    try {
      const res = await apiFetch(`${API_URL}/api/knowledge-uploads`);
      const data = await res.json();
      setUploads(data.uploads || []);
    } catch {
      setUploads([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { loadUploads(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const handleIngest = async () => {
    if (!file || ingesting) return;
    setIngesting(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append("pdf", file);
      form.append("category", category);
      form.append("tier", tier);
      const res = await apiFetch(`${API_URL}/api/ingest-knowledge`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'ingestion");
      setStatus({ type: "success", message: `✅ ${data.message} — ${data.chunksCount} chunks` });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      loadUploads();
    } catch (err) {
      setStatus({ type: "error", message: `❌ ${err.message}` });
    } finally {
      setIngesting(false);
    }
  };

  const handleDelete = async (id) => {
    if (pendingDeleteId !== id) { setPendingDeleteId(id); setTimeout(() => setPendingDeleteId(null), 3000); return; }
    setPendingDeleteId(null);
    try {
      await apiFetch(`${API_URL}/api/knowledge-uploads/${id}`, { method: "DELETE" });
      setUploads(prev => prev.filter(u => u.id !== id));
    } catch { /* la liste se resynchronisera au prochain chargement */ }
  };

  const tierBadge = (t) => {
    const map = { creator_standard: { label: "Créateurs Std", color: c.accent }, vip_pro: { label: "VIP Pro", color: c.accent2 }, elite: { label: "VIP Elite", color: c.success } };
    const m = map[t] || { label: t, color: c.textDim };
    return <span style={{ fontSize: 10, fontWeight: 800, fontFamily: mono, textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: `${m.color}1e`, color: m.color, border: `1px solid ${m.color}55`, whiteSpace: "nowrap" }}>{m.label}</span>;
  };

  const statusBadge = (s) => {
    const map = { completed: { label: "✓", color: c.success }, processing: { label: "…", color: c.warning }, error: { label: "✗", color: c.error } };
    const m = map[s] || map.processing;
    return <span style={{ color: m.color, fontWeight: 800, fontFamily: mono, fontSize: 13 }}>{m.label}</span>;
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", color: c.text, maxWidth: 980 }}>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>
        🧠 {fr ? "Connaissances IA (Gideon)" : it ? "Conoscenze IA (Gideon)" : "AI Knowledge (Gideon)"}
      </h2>
      <p style={{ margin: "6px 0 22px 0", fontSize: 13, color: c.textMuted, maxWidth: 640, lineHeight: 1.5 }}>
        {fr ? "Uploade tes formations PDF : elles nourrissent les réponses de Gideon selon le forfait de l'abonné. Un PDF taggé « VIP Elite » n'est jamais visible d'un créateur Standard."
          : it ? "Carica i tuoi corsi PDF: alimentano le risposte di Gideon in base al piano dell'abbonato."
          : "Upload your training PDFs: they feed Gideon's answers based on the subscriber's plan."}
      </p>

      {/* ── Formulaire d'ingestion ── */}
      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "2 1 260px", minWidth: 220 }}>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>
              {fr ? "Fichier PDF" : "PDF file"}
            </label>
            <input
              ref={fileRef} type="file" accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px dashed ${c.border}`, background: c.bg, color: c.text, fontSize: 12.5, boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: "1 1 160px", minWidth: 150 }}>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>
              {fr ? "Catégorie" : it ? "Categoria" : "Category"}
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg, color: c.text, fontSize: 13, outline: "none" }}>
              {CATEGORIES.map(cat => <option key={cat} value={cat} style={{ color: "#111", background: "#fff" }}>{cat}</option>)}
            </select>
          </div>
          <div style={{ flex: "2 1 260px", minWidth: 220 }}>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>
              {fr ? "Accessible à partir de" : it ? "Accessibile da" : "Accessible from"}
            </label>
            <select value={tier} onChange={(e) => setTier(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg, color: c.text, fontSize: 13, outline: "none" }}>
              {TIERS.map(t => <option key={t.id} value={t.id} style={{ color: "#111", background: "#fff" }}>{fr ? t.labelFr : t.labelEn}</option>)}
            </select>
          </div>
          <button
            onClick={handleIngest} disabled={!file || ingesting}
            style={{
              padding: "12px 22px", borderRadius: 10, border: "none", flexShrink: 0,
              background: (!file || ingesting) ? c.border : `linear-gradient(90deg, ${c.accent}, ${c.accent2})`,
              color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: mono, cursor: (!file || ingesting) ? "not-allowed" : "pointer"
            }}
          >
            {ingesting ? (fr ? "⏳ Ingestion..." : "⏳ Ingesting...") : (fr ? "🧠 Ingérer" : it ? "🧠 Ingerisci" : "🧠 Ingest")}
          </button>
        </div>
        {ingesting && (
          <p style={{ margin: "12px 0 0 0", fontSize: 12, color: c.textMuted, fontFamily: mono }}>
            {fr ? "Extraction du texte → découpage en chunks → embeddings OpenAI → stockage Supabase. Compte ~10-60s selon la taille du PDF."
              : "Extracting text → chunking → OpenAI embeddings → Supabase storage. ~10-60s depending on PDF size."}
          </p>
        )}
        {status && (
          <p style={{ margin: "12px 0 0 0", fontSize: 12.5, fontWeight: 700, color: status.type === "success" ? c.success : c.error }}>
            {status.message}
          </p>
        )}
      </div>

      {/* ── Liste des connaissances ingérées ── */}
      <h3 style={{ margin: "0 0 10px 0", fontSize: 14, fontWeight: 800, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
        {fr ? "Base de connaissances" : it ? "Base di conoscenza" : "Knowledge base"} ({uploads.length})
      </h3>
      {loadingList ? (
        <p style={{ fontSize: 13, color: c.textDim, fontFamily: mono }}>{fr ? "Chargement..." : "Loading..."}</p>
      ) : uploads.length === 0 ? (
        <div style={{ padding: 28, borderRadius: 14, border: `1px dashed ${c.border}`, textAlign: "center", color: c.textDim, fontSize: 13 }}>
          {fr ? "Aucun PDF ingéré pour l'instant. Gideon répond avec son savoir générique tant que la base est vide."
            : "No PDF ingested yet. Gideon answers with generic knowledge while the base is empty."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {uploads.map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: "10px 14px" }}>
              {statusBadge(u.status)}
              <span style={{ flex: "1 1 220px", minWidth: 180, fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📄 {u.filename}</span>
              <span style={{ fontSize: 11, fontFamily: mono, color: c.textMuted, textTransform: "capitalize" }}>{u.category}</span>
              {tierBadge(u.tier)}
              <span style={{ fontSize: 11, fontFamily: mono, color: c.textDim }}>{u.chunks_count ? `${u.chunks_count} chunks` : (u.error_message ? "erreur" : "…")}</span>
              <button onClick={() => handleDelete(u.id)} style={{
                padding: "6px 12px", borderRadius: 8, border: `1px solid ${pendingDeleteId === u.id ? c.error : c.border}`,
                background: pendingDeleteId === u.id ? c.errorBg : "transparent", color: pendingDeleteId === u.id ? c.error : c.textDim,
                fontSize: 11, fontWeight: 700, fontFamily: mono, cursor: "pointer", flexShrink: 0
              }}>
                {pendingDeleteId === u.id ? (fr ? "Confirmer ?" : "Confirm?") : "🗑"}
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: c.textDim, fontFamily: mono, marginTop: 18, lineHeight: 1.6 }}>
        ⚙️ {fr ? "Prérequis : exécuter supabase/knowledge_schema.sql dans le SQL Editor Supabase, et OPENAI_API_KEY dans le .env du serveur. Supprimer un PDF retire aussi tous ses chunks de la base."
          : "Prerequisites: run supabase/knowledge_schema.sql in the Supabase SQL Editor, and set OPENAI_API_KEY in the server .env. Deleting a PDF also removes all its chunks."}
      </p>
    </div>
  );
}
