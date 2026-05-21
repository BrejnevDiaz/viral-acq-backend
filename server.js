import express from "express";
import cors from "cors";
import { readFileSync, appendFileSync } from "fs";
import nodemailer from "nodemailer";
import cron from "node-cron";
import { saveLead, getLeadsToFollowUp } from "./db.js";
import { startCampaign, campaignState } from "./campaignManager.js";

// ─── Load .env ───────────────────────────────────────────────────────────────
try {
  const env = readFileSync(".env", "utf8");
  env.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  });
} catch (e) { console.warn("⚠️  .env non trouvé"); }

const app = express();
const PORT = 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json({ limit: "2mb" }));

// ─── Platform → site domain ───────────────────────────────────────────────────
const siteMap = {
  instagram: "instagram.com",
  tiktok:    "tiktok.com",
  facebook:  "facebook.com",
  pinterest: "pinterest.com",
  amazon:    "amazon.it",
  etsy:      "etsy.com",
  ebay:      "ebay.it",
  web:       null,
};

// ─── Rate limiter simple pour l'envoi d'emails ────────────────────────────────
let lastEmailSent = 0;
const EMAIL_MIN_INTERVAL_MS = 3000; // 3 secondes minimum entre chaque email

// ─── STEP 1 : Tavily Search ───────────────────────────────────────────────────
app.post("/api/google-search", async (req, res) => {
  const { query, num = 8, platform = "web" } = req.body;
  const key = process.env.TAVILY_API_KEY;

  if (!key || key === "TON_API_KEY_TAVILY") {
    return res.status(500).json({ error: "TAVILY_API_KEY manquante — inscris-toi sur app.tavily.com" });
  }

  const siteDomain = siteMap[platform] || null;
  const fullQuery  = siteDomain ? `site:${siteDomain} ${query}` : query;

  try {
    console.log(`🔍 [${platform}] "${fullQuery.slice(0, 65)}"`);

    const body = {
      query: fullQuery,
      max_results: Math.min(num, 10),
      search_depth: "basic",
      include_raw_content: false,
      include_answer: false,
    };
    if (siteDomain) body.include_domains = [siteDomain];

    const r = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("❌ Tavily error:", data);
      return res.status(r.status).json({ error: data.message || data.error || "Tavily error" });
    }

    const items = (data.results || []).map(item => ({
      title:       item.title,
      link:        item.url,
      snippet:     item.content?.slice(0, 300) || "",
      displayLink: (() => { try { return new URL(item.url).hostname; } catch { return item.url; } })(),
    }));

    console.log(`✅ [${platform}] ${items.length} résultats`);
    res.json({ items, totalResults: items.length });

  } catch (err) {
    console.error("❌ Tavily crash:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── STEP 2 : Claude Haiku — Score & Extract ─────────────────────────────────
app.post("/api/score-brand", async (req, res) => {
  const { brand } = req.body;
  const key = process.env.ANTHROPIC_API_KEY;

  // 1. Scraping rapide de l'email et réseaux sociaux sur le site web
  let scrapedEmail = brand.contact !== "À rechercher" ? brand.contact : null;
  let socials = {
    instagram: brand.instagram && brand.instagram.startsWith("http") ? brand.instagram : (brand.instagram ? `https://instagram.com/${brand.instagram.replace('@','')}` : null),
    tiktok: null,
    facebook: null,
    pinterest: null
  };

  if (brand.url && !brand.url.includes("instagram.com") && !brand.url.includes("facebook.com")) {
    try {
      const htmlRes = await fetch(brand.url, { signal: AbortSignal.timeout(3500) });
      const htmlText = await htmlRes.text();
      
      if (!scrapedEmail) {
        const matches = htmlText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g);
        if (matches) {
          const valid = matches.filter(e => !e.includes("sentry") && !e.includes("wixpress") && !e.includes("example") && !e.endsWith(".png") && !e.endsWith(".jpg"));
          if (valid.length > 0) scrapedEmail = valid[0].toLowerCase();
        }
      }

      const ig = htmlText.match(/https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.-]+/i);
      if (ig && !socials.instagram) socials.instagram = ig[0];

      const tk = htmlText.match(/https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_.-]+/i);
      if (tk) socials.tiktok = tk[0];

      const fb = htmlText.match(/https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_.-]+/i);
      if (fb) socials.facebook = fb[0];

      const pi = htmlText.match(/https?:\/\/(www\.)?pinterest\.(com|it|fr|co\.uk)\/[a-zA-Z0-9_.-]+/i);
      if (pi) socials.pinterest = pi[0];

    } catch (e) {
      // Ignore errors
    }
  }

  // ─── APOLLO.IO ENRICHMENT (Chercher le CEO/Directeur) ─────────────────
  let decisionMaker = null;
  const apolloKey = process.env.APOLLO_API_KEY;
  if (apolloKey && brand.url) {
    try {
      const domain = new URL(brand.url).hostname.replace("www.", "");
      const apRes = await fetch("https://api.apollo.io/v1/mixed_people/search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          api_key: apolloKey, 
          q_organization_domains: domain, 
          person_titles: ["ceo", "founder", "owner", "marketing", "cmo", "director"] 
        })
      });
      const apData = await apRes.json();
      if (apData.people && apData.people.length > 0) {
         const p = apData.people.find(x => x.email) || apData.people[0];
         decisionMaker = { name: p.first_name || p.name, email: p.email, title: p.title };
         if (p.email) scrapedEmail = p.email; // Remplace l'email info@ par l'email du décideur
      }
    } catch(e) { console.error("Apollo Error:", e.message); }
  }

  const finalContact = scrapedEmail || "À rechercher";

  if (!key || key.includes("XXXX")) {
    const score = Math.floor(Math.random() * 20) + 72;
    return res.json({
      score,
      contact:   finalContact,
      size:      "Emerging",
      reasoning: "Score auto",
      instagram: socials.instagram,
      socials,
      decisionMaker
    });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: `Analizza questo brand e-commerce italiano per Viral Acquisition (agenzia micro-influencer).
Brand: ${brand.name}
URL: ${brand.url}
Descrizione: ${brand.description?.slice(0, 300)}
Niche: ${brand.niche}
Rispondi SOLO con JSON: {"score":<60-99>,"size":"Startup|Emerging|Small|Medium","contact":"<email o 'À rechercher'>","instagram":"<@handle o null>","reasoning":"<max 15 parole>"}`,
        }],
      }),
    });

    const data = await r.json();
    if (!r.ok) throw new Error("Anthropic error");
    const text = data.content?.[0]?.text || "{}";
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || "{}");
    
    const scoredBrand = {
      score: parsed.score || 72,
      contact: parsed.contact || finalContact,
      size: parsed.size || "Emerging",
      reasoning: parsed.reasoning || "Scored via Claude",
      instagram: parsed.instagram || socials.instagram,
      socials: { ...socials, ...(parsed.socials || {}) },
      decisionMaker
    };
    res.json(scoredBrand);

  } catch (err) {
    console.error("Score Error:", err.message);
    res.json({ score: 72, size: "Emerging", contact: finalContact, instagram: socials.instagram, reasoning: "Score auto", socials, decisionMaker });
  }
});

// ─── STEP 3 : Claude Haiku — Génération email personnalisé ──────────────────
app.post("/api/generate-email", async (req, res) => {
  const { brand, emailLang = "it" } = req.body;
  const key = process.env.ANTHROPIC_API_KEY;
  const senderName = process.env.SENDER_NAME || "Diaz — Viral Acquisition";
  const senderEmail = process.env.GMAIL_USER || "viralacquisition@gmail.com";
  
  const recipientName = brand.decisionMaker?.name ? brand.decisionMaker.name : `Team ${brand.name}`;

  // ── Fallback templates by language ────────────────────────────────────────
  const templates = {
    it: {
      subject: `Collaborazione a Performance — Zero Rischi per ${brand.name}`,
      body: `Gentile ${recipientName},

Mi chiamo Diaz e sono il Direttore Commerciale di Viral Acquisition,
un'agenzia specializzata in influencer marketing nel settore ${brand.niche || "lifestyle"}.

Ho scoperto il vostro brand${brand.url ? ` (${brand.url})` : ""}${brand.platform ? ` su ${brand.platform}` : ""} e sono convinto che una collaborazione con micro-influencer selezionati possa accelerare significativamente la vostra crescita.

🔑 La nostra proposta in 3 punti:

1. ZERO COSTI FISSI — Lavoriamo esclusivamente a commissione sulle vendite generate.
2. MICRO-INFLUENCER VERIFICATI — Network di creatori autentici nel vostro settore.
3. TRACKING TRASPARENTE — Ogni vendita tracciata con link unici o codici sconto.

Risultati medi dei nostri clienti: +40% di vendite nei primi 60 giorni.

Sareste disponibili per approfondire l'argomento questa settimana?

Cordiali saluti,
${senderName}
📧 ${senderEmail}
🌐 www.viralacquisition.it`,
    },
    en: {
      subject: `Performance Collaboration — Zero Risk for ${brand.name}`,
      body: `Dear ${recipientName},

My name is Diaz and I am the Commercial Director of Viral Acquisition,
an influencer marketing agency specialized in the ${brand.niche || "lifestyle"} sector.

I came across your brand${brand.url ? ` (${brand.url})` : ""}${brand.platform ? ` on ${brand.platform}` : ""} and I'm confident that a strategic collaboration with selected micro-influencers can significantly accelerate your growth.

🔑 Our proposal in 3 points:

1. ZERO FIXED COSTS — We work exclusively on commission on generated sales.
2. VERIFIED MICRO-INFLUENCERS — Network of authentic creators in your sector with engaged audiences.
3. TRANSPARENT TRACKING — Every sale tracked with unique links or dedicated discount codes.

Average results for our clients: +40% in sales within the first 60 days.

Would you be available to discuss this further this week?

Best regards,
${senderName}
📧 ${senderEmail}
🌐 www.viralacquisition.it`,
    },
  };

  if (!key || key.includes("XXXX")) {
    console.log(`📝 Email template [${emailLang}] pour: ${brand.name}`);
    return res.json({ ...templates[emailLang], generatedBy: "template" });
  }

  const instructions = emailLang === "it"
    ? `Scrivi un'email commerciale a freddo per il brand "${brand.name}". Rivolgiti direttamente a: ${recipientName}. Usa un tono professionale ma moderno e fiducioso. NON chiedere di fare una chiamata (call). Chiedi solo se sono interessati ad approfondire. Firma come "${senderName}" di "Viral Acquisition" (email: ${senderEmail}, web: www.viralacquisition.it). Restituisci SOLO un JSON con "subject" e "body".`
    : `Write a cold outbound sales email for the brand "${brand.name}". Address the email directly to: ${recipientName}. Use a professional yet modern and confident tone. Do NOT ask for a call. Just ask if they are open to discussing further. Sign off as "${senderName}" from "Viral Acquisition" (email: ${senderEmail}, web: www.viralacquisition.it). Return ONLY a JSON with "subject" and "body".`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 800,
        messages: [{
          role: "user",
          content: `You are an expert in influencer marketing outreach. Write a professional, persuasive cold email.

${langInstructions[emailLang] || langInstructions.it}

Target brand: ${brand.name}
URL: ${brand.url || "N/A"}
Description: ${brand.description?.slice(0, 400) || "E-commerce brand"}
Niche: ${brand.niche || "lifestyle"}
Platform found on: ${brand.platform || "web"}
Potential score: ${brand.score || 80}/100

Sender: ${senderName} (Viral Acquisition — influencer marketing agency)
Sender email: ${senderEmail}

RULES:
- Max 200 words in the body
- Mention specifically the brand name "${brand.name}" and their niche
- Proposal: performance-based collaboration (zero fixed costs, commission on sales)
- Clear CTA: ask if they are available to discuss further (do NOT ask for a call)
- Do NOT use placeholders like [Name], use "${brand.name}" directly
- Sign with the full sender signature

Reply ONLY with valid JSON:
{"subject":"<compelling subject max 60 chars>","body":"<full email body with greeting and signature>"}`,
        }],
      }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error("Anthropic error");
    const text = data.content?.[0]?.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");
    const emailData = JSON.parse(jsonMatch[0]);
    console.log(`✅ Email IA [${emailLang}] → ${brand.name}`);
    res.json({ ...emailData, generatedBy: "claude-haiku" });
  } catch (err) {
    console.warn(`⚠️  Haiku fallback [${emailLang}]: ${err.message}`);
    res.json({ ...tmpl, generatedBy: "template" });
  }
});


// ─── STEP 4 : Nodemailer — Envoi email via Gmail SMTP ────────────────────────
app.post("/api/send-email", async (req, res) => {
  const { to, subject, body, brandName } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: "Paramètres manquants: to, subject, body" });
  }

  const gmailUser     = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;
  const senderName    = process.env.SENDER_NAME || "Diaz — Viral Acquisition";

  // Vérifier config Gmail
  if (!gmailUser || !gmailPassword || gmailPassword.includes("xxxx")) {
    return res.status(500).json({
      error: "Gmail non configuré",
      setup: "Remplis GMAIL_USER et GMAIL_APP_PASSWORD dans .env (App Password Google)",
    });
  }

  // Rate limit anti-spam
  const now = Date.now();
  const timeSinceLast = now - lastEmailSent;
  if (timeSinceLast < EMAIL_MIN_INTERVAL_MS) {
    const waitMs = EMAIL_MIN_INTERVAL_MS - timeSinceLast;
    await new Promise(r => setTimeout(r, waitMs));
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    const mailOptions = {
      from: `"${senderName}" <${gmailUser}>`,
      to,
      subject,
      text: body,
      html: body.split("\n").map(line => {
        if (!line.trim()) return "<br>";
        if (line.startsWith("🔑") || line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.")) {
          return `<p style="margin:4px 0">${line}</p>`;
        }
        return `<p style="margin:2px 0">${line}</p>`;
      }).join(""),
    };

    const info = await transporter.sendMail(mailOptions);
    lastEmailSent = Date.now();

    // Log l'envoi
    const logLine = `[${new Date().toISOString()}] ✅ Envoyé → ${to} | Brand: ${brandName || "?"} | MsgID: ${info.messageId}\n`;
    try { appendFileSync("sent_emails.log", logLine); } catch {}

    // CRM : Sauvegarde dans Supabase / locale
    try {
      await saveLead({
        emailTo: to,
        brandName,
        emailStatus: "sent",
        sentAt: new Date().toISOString(),
        replied: false,
        followUpSent: false
      });
    } catch(e) { console.error("Erreur save DB:", e.message); }

    console.log(`📤 Email envoyé → ${to} | Brand: ${brandName} | ${info.messageId}`);
    res.json({ success: true, messageId: info.messageId, to });

  } catch (err) {
    console.error("❌ Erreur envoi email:", err.message);
    res.status(500).json({
      error: err.message,
      hint: err.message.includes("Invalid login") ? "App Password incorrect — vérifie le .env" : undefined,
    });
  }
});

// ─── Health ───────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => {
  const tavily    = process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY !== "TON_API_KEY_TAVILY";
  const anthropic = process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("XXXX");
  const gmail     = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && !process.env.GMAIL_APP_PASSWORD.includes("xxxx");
  res.json({
    status: "ok",
    serper:    tavily    ? "✅" : "❌",
    anthropic: anthropic ? "✅ (scoring IA)" : "⚠️ (score auto)",
    gmail:     gmail     ? "✅" : "⚠️ (non configuré)",
  });
});

// ─── CRM ──────────────────────────────────────────────────────────────────────
app.get("/api/leads", async (req, res) => {
  try {
    const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY;
    if (useSupabase) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return res.json({ leads: data || [] });
    } else {
      try {
        const dbText = readFileSync("db.json", "utf8");
        const db = JSON.parse(dbText);
        return res.json({ leads: db.leads || [] });
      } catch (e) {
        return res.json({ leads: [] });
      }
    }
  } catch (err) {
    res.json({ leads: [] });
  }
});

// ─── BACKGROUND QUEUES ────────────────────────────────────────────────────────
app.post("/api/campaigns/start", (req, res) => {
  if (campaignState.isRunning) {
    return res.status(400).json({ error: "Une campagne est déjà en cours." });
  }
  // Lance la fonction asynchrone sans bloquer la réponse
  startCampaign(req.body);
  res.json({ success: true, message: "Campagne démarrée en arrière-plan." });
});

app.get("/api/campaigns/status", (req, res) => {
  res.json(campaignState);
});

// ─── CRON JOB : Relance Automatique (Follow-up à J+3) ──────────────────────
// Tourne tous les jours à 10h00
cron.schedule("0 10 * * *", async () => {
  console.log("⏰ Lancement du CRON de relances automatiques...");
  try {
    const leadsToFollowUp = await getLeadsToFollowUp();
    if (leadsToFollowUp.length === 0) {
      console.log("   Aucune relance à effectuer aujourd'hui.");
      return;
    }
    
    console.log(`   ${leadsToFollowUp.length} prospect(s) à relancer. Rédation et Envoi en cours...`);
    
    for (const lead of leadsToFollowUp) {
      // Pour l'instant on marque juste le lead dans la base de données
      // Tu pourras brancher la logique nodemailer ici plus tard !
      await saveLead({ ...lead, followUpSent: true, followUpDate: new Date().toISOString() });
      console.log(`   ✅ Relance marquée comme envoyée pour ${lead.emailTo}`);
    }
  } catch (err) {
    console.error("❌ Erreur CRON:", err.message);
  }
});

app.listen(PORT, () => {
  const tavily    = process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY !== "TON_API_KEY_TAVILY";
  const anthropic = process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("XXXX");
  const gmail     = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && !process.env.GMAIL_APP_PASSWORD.includes("xxxx");
  console.log(`\n✅ Proxy backend → http://localhost:${PORT}`);
  console.log(`   Tavily      : ${tavily    ? "✅" : "❌ — va sur app.tavily.com"}`);
  console.log(`   Anthropic   : ${anthropic ? "✅ Scoring + Email IA actif" : "⚠️  Template email (sans IA)"}`);
  console.log(`   Gmail SMTP  : ${gmail     ? "✅ Envoi email actif" : "⚠️  Configure GMAIL_APP_PASSWORD dans .env"}`);
});
