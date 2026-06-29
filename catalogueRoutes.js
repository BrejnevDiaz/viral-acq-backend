import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const router = express.Router();
const DATA_DIR = path.join(process.cwd(), 'data');

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// S'assurer que les fichiers existent
const brandsFile = path.join(DATA_DIR, 'brands.json');
const influencersFile = path.join(DATA_DIR, 'influencers.json');
const matchesFile = path.join(DATA_DIR, 'matches.json');

const readJSON = (file) => {
  if (!existsSync(file)) return [];
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeJSON = (file, data) => {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

// ==========================================
// MARQUES (BRANDS)
// ==========================================
router.get('/brands', (req, res) => {
  res.json(readJSON(brandsFile));
});

router.post('/brands', (req, res) => {
  const { name, website, niche, budget, description } = req.body;
  if (!name || !niche) return res.status(400).json({ error: 'Name and niche required' });
  const brands = readJSON(brandsFile);
  const newBrand = { id: Date.now().toString(), name, website, niche, budget, description, createdAt: new Date().toISOString() };
  brands.push(newBrand);
  writeJSON(brandsFile, brands);
  res.json(newBrand);
});

router.delete('/brands/:id', (req, res) => {
  let brands = readJSON(brandsFile);
  brands = brands.filter(b => b.id !== req.params.id);
  writeJSON(brandsFile, brands);
  res.json({ success: true });
});

// ==========================================
// INFLUENCEURS SIGNES (INFLUENCERS)
// ==========================================
router.get('/influencers', (req, res) => {
  res.json(readJSON(influencersFile));
});

router.post('/influencers', (req, res) => {
  const { username, platform, niche, followers, engagement, avatar } = req.body;
  if (!username || !platform) return res.status(400).json({ error: 'Username and platform required' });
  const influencers = readJSON(influencersFile);
  const newInfluencer = { id: Date.now().toString(), username, platform, niche, followers, engagement, avatar, createdAt: new Date().toISOString() };
  influencers.push(newInfluencer);
  writeJSON(influencersFile, influencers);
  res.json(newInfluencer);
});

router.delete('/influencers/:id', (req, res) => {
  let influencers = readJSON(influencersFile);
  influencers = influencers.filter(i => i.id !== req.params.id);
  writeJSON(influencersFile, influencers);
  res.json({ success: true });
});

// ==========================================
// MATCHMAKING AI (Génération d'Email)
// ==========================================
router.post('/generate-pitch', async (req, res) => {
  const { brand, influencer, mode, relationship = 'cold', lang = 'fr' } = req.body;
  // mode: "brand_to_influencer" (on pitch la marque à un influenceur)
  // mode: "influencer_to_brand" (on pitch l'influenceur à une marque)
  // relationship: "cold" (nouveau) ou "signed" (déjà en agence)

  try {
    let prompt = "";
    if (mode === "brand_to_influencer") {
      if (relationship === "signed") {
        prompt = `Tu es un agent de l'agence d'influence "Acquisition Pro". L'influenceur @${influencer.username} (${influencer.followers} abonnés, niche: ${influencer.niche}) FAIT DÉJÀ PARTIE de notre agence, c'est un talent avec qui nous travaillons au quotidien.
Nous venons de signer un accord avec la marque ${brand.name} (Niche: ${brand.niche}, Description: ${brand.description}).
Rédige un message sympa et chaleureux (en ${lang}) à notre talent @${influencer.username} pour lui proposer cette nouvelle campagne exclusive. Dis-lui qu'on a pensé directement à lui car son profil matche parfaitement. Limite à 150 mots maximum, inclut un objet d'e-mail avec [Objet] au début.`;
      } else {
        prompt = `Tu es un agent de l'agence d'influence "Acquisition Pro". 
Nous représentons la marque suivante : ${brand.name} (Niche: ${brand.niche}, Description: ${brand.description}).
Rédige un e-mail professionnel de prospection (en ${lang}) à destination d'un NOUVEL influenceur @${influencer.username} (${influencer.platform}, ${influencer.followers} abonnés, engagement: ${influencer.engagement}%).
Le but est de le démarcher à froid pour lui proposer une collaboration avec la marque ${brand.name}. Mets en avant pourquoi son profil a retenu notre attention. Limite à 150 mots maximum, inclut un objet d'e-mail avec [Objet] au début.`;
      }
    } else {
      prompt = `Tu es un agent de l'agence d'influence "Acquisition Pro".
Nous représentons l'influenceur talentueux @${influencer.username} (${influencer.platform}, ${influencer.followers} abonnés dans la niche ${influencer.niche}, avec un excellent engagement de ${influencer.engagement}%).
Rédige un e-mail B2B percutant (en ${lang}) à destination du responsable marketing de la marque ${brand.name} (Niche: ${brand.niche}).
Le but est de proposer une collaboration sponsorisée entre cette marque et notre influenceur. Explique pourquoi cette audience est un match parfait pour les produits de ${brand.name}. Limite à 150 mots maximum, inclut un objet d'e-mail avec [Objet] au début.`;
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey || anthropicKey.includes("XXXX")) {
      return res.status(400).json({ error: "Clé API Anthropic manquante" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": anthropicKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }]
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Erreur Anthropic");
    
    res.json({ email: data.content[0].text });
  } catch (err) {
    console.error("Matchmaking error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ACCORDS VALIDES (MATCHES)
// ==========================================
router.get('/matches', (req, res) => {
  res.json(readJSON(matchesFile));
});

router.post('/matches', (req, res) => {
  const { brand, influencer, relationship, email, pitchLang } = req.body;
  if (!brand || !influencer) return res.status(400).json({ error: 'Brand and Influencer required' });
  const matches = readJSON(matchesFile);
  const newMatch = {
    id: Date.now().toString(),
    brand,
    influencer,
    relationship,
    email,
    pitchLang,
    validatedAt: new Date().toISOString()
  };
  matches.push(newMatch);
  writeJSON(matchesFile, matches);
  res.json(newMatch);
});

router.delete('/matches/:id', (req, res) => {
  let matches = readJSON(matchesFile);
  matches = matches.filter(m => m.id !== req.params.id);
  writeJSON(matchesFile, matches);
  res.json({ success: true });
});

export default router;
