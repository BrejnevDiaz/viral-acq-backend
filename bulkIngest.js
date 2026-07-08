// ═══════════════════════════════════════════════════════════════════════════
// GIDEON RAG — Ingestion en masse des PDFs de formation
// ═══════════════════════════════════════════════════════════════════════════
// Usage :
//   node bulkIngest.js --dry-run                → montre le mapping sans rien ingérer
//   node bulkIngest.js                          → ingère le dossier par défaut
//   node bulkIngest.js "C:\chemin\vers\pdfs"    → ingère un autre dossier
//   node bulkIngest.js --tier elite --category ecommerce  → force tier/catégorie
//
// Le script : scanne les PDFs, déduit catégorie + tier d'accès depuis le nom de
// fichier, saute les doublons ("X (1).pdf") et les fichiers déjà ingérés
// (présents dans knowledge_uploads avec status=completed), puis lance le
// pipeline chunks → embeddings OpenAI → Supabase, un fichier à la fois.
// Prérequis : knowledge_schema.sql exécuté dans Supabase + OPENAI_API_KEY dans .env.

import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { ingestKnowledge } from "./knowledgeIngestion.js";
import { extractPdfText } from "./pdfText.js";

// ─── .env (même parsing manuel que server.js) ───────────────────────────────
try {
  const env = readFileSync(".env", "utf8");
  env.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  });
} catch { console.warn("⚠️  .env non trouvé"); }

// ─── Arguments ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const flagValue = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const forcedTier = flagValue("--tier");
const forcedCategory = flagValue("--category");
const folderArg = args.find(a => !a.startsWith("--") && a !== forcedTier && a !== forcedCategory);
const FOLDER = folderArg || "C:\\Users\\Thin\\Documents\\eCommerce\\eCom blueprint";

// ─── Mapping nom de fichier → { category, tier } ─────────────────────────────
// Première règle qui matche gagne. Rationale :
// - Savoir "créateur" (viralité, créatives, UGC, influence) → creator_standard :
//   c'est la promesse du forfait Créateur Standard 39€.
// - Marketing opérationnel (SEO, ads, email) → vip_pro (99€).
// - Business e-commerce complet (FBA, POD, sourcing, scaling, légal, études de
//   cas) → elite (299€). Elite voit aussi tout le reste (hiérarchie SQL).
const RULES = [
  { match: /viral|viraux|créer des tiktok|tournage|monter ses créatives|créative|creative|cr[ée]as?\b|ugc|contenu/i,
    category: "viralite", tier: "creator_standard" },
  { match: /influence|influenceur/i,               category: "ugc",       tier: "creator_standard" },
  { match: /pinterest(?!.*ads)/i,                  category: "viralite",  tier: "creator_standard" },
  { match: /email|klaviyo|flow|cart|post achat|welcome/i, category: "marketing", tier: "vip_pro" },
  { match: /seo|mots clés|blog|backlink/i,         category: "marketing", tier: "vip_pro" },
  { match: /ads|publicité|pub\b|campagne|google|facebook|performance max|shopping|display|paramétrage|testing|promotion|blocage|datas|search|structure de compte|s[ée]gmentation/i,
    category: "publicite", tier: "vip_pro" },
  { match: /scaling|scale/i,                       category: "scaling",   tier: "elite" },
  { match: /amazon|fba|pod|print on demand|sourcing|importation|business|fiche produit|recherche de produit|niche|positionnement|marque|domaine|shopify|juridique|légaux|legal|étude de cas|etude de cas|cycle de vie|calcul des couts|configuration|stratégie|innover|présentation/i,
    category: "ecommerce", tier: "elite" },
];

const classify = (filename) => {
  if (forcedTier || forcedCategory) {
    return { category: forcedCategory || "general", tier: forcedTier || "elite" };
  }
  for (const rule of RULES) {
    if (rule.match.test(filename)) return { category: rule.category, tier: rule.tier };
  }
  return { category: "general", tier: "elite" }; // défaut prudent : réservé Elite
};

// "X (1).pdf" → même contenu que "X.pdf" : on normalise pour dédupliquer.
const normalizeName = (f) => f.replace(/\s*\(\d+\)(?=\.pdf$)/i, "").replace(/\s+/g, " ").trim().toLowerCase();

// ─── Scan du dossier ─────────────────────────────────────────────────────────
const collectPdfs = (dir) => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...collectPdfs(full));
    else if (/\.pdf$/i.test(entry)) out.push(full);
  }
  return out;
};

const main = async () => {
  console.log(`\n🧠 GIDEON — Ingestion en masse\n📁 Dossier : ${FOLDER}\n`);

  let files;
  try {
    files = collectPdfs(FOLDER);
  } catch (e) {
    console.error(`❌ Dossier introuvable : ${FOLDER}\n   ${e.message}`);
    process.exit(1);
  }

  // Dédoublonnage des "(1).pdf"
  const seen = new Set();
  const unique = [];
  let dupes = 0;
  for (const f of files.sort()) {
    const key = normalizeName(path.basename(f));
    if (seen.has(key)) { dupes++; continue; }
    seen.add(key);
    unique.push(f);
  }

  // Fichiers déjà ingérés (repris d'un run précédent interrompu)
  let alreadyDone = new Set();
  if (!dryRun) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) { console.error("❌ SUPABASE_URL / SUPABASE_KEY manquants dans .env"); process.exit(1); }
    if (!process.env.OPENAI_API_KEY)  { console.error("❌ OPENAI_API_KEY manquant dans .env"); process.exit(1); }
    const sb = createClient(supabaseUrl, supabaseKey);
    // Purge les traces des tentatives ratées (processing/error) pour ne pas
    // encombrer l'onglet admin — seuls les "completed" comptent comme faits.
    await sb.from("knowledge_uploads").delete().neq("status", "completed");
    const { data } = await sb.from("knowledge_uploads").select("filename,status");
    alreadyDone = new Set((data || []).filter(u => u.status === "completed").map(u => u.filename));
  }

  console.log(`📚 ${files.length} PDFs trouvés · ${dupes} doublons ignorés · ${alreadyDone.size} déjà ingérés\n`);

  const stats = { ok: 0, skipped: 0, failed: 0, chunks: 0 };
  const byTier = {};

  for (let i = 0; i < unique.length; i++) {
    const file = unique[i];
    const filename = path.basename(file);
    const { category, tier } = classify(filename);
    byTier[tier] = (byTier[tier] || 0) + 1;
    const label = `[${String(i + 1).padStart(2)}/${unique.length}] ${filename}`;

    if (alreadyDone.has(filename)) {
      console.log(`⏭  ${label} — déjà ingéré`);
      stats.skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`🔎 ${label}\n     → catégorie: ${category} · tier: ${tier}`);
      continue;
    }

    try {
      const pdfData = await extractPdfText(readFileSync(file));
      if (!pdfData.text || pdfData.text.trim().length < 100) {
        console.log(`⚠️  ${label} — pas assez de texte exploitable (scan/images ?), ignoré`);
        stats.skipped++;
        continue;
      }
      const result = await ingestKnowledge({ text: pdfData.text, filename, category, tier });
      console.log(`✅ ${label} — ${result.chunksCount} chunks → ${tier}/${category}`);
      stats.ok++;
      stats.chunks += result.chunksCount;
    } catch (err) {
      console.error(`❌ ${label} — ${err.message}`);
      stats.failed++;
    }
  }

  console.log(`\n──────── Résumé ────────`);
  console.log(`Répartition par tier : ${Object.entries(byTier).map(([t, n]) => `${t}: ${n}`).join(" · ")}`);
  if (dryRun) {
    console.log(`(dry-run : rien n'a été ingéré — relance sans --dry-run pour lancer l'ingestion)`);
  } else {
    console.log(`✅ ${stats.ok} ingérés (${stats.chunks} chunks) · ⏭ ${stats.skipped} sautés · ❌ ${stats.failed} échecs`);
    console.log(`Relance le script pour reprendre les échecs — les fichiers complétés seront sautés.`);
  }
};

main().catch((e) => { console.error("❌ Erreur fatale :", e); process.exit(1); });
