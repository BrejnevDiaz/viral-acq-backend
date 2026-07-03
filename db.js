import fs from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "leads.json");

// Chaque lead est tagué avec un ownerId (id Supabase de l'utilisateur).
// Les leads existants sans ownerId deviennent invisibles via l'API (choix de
// sécurité par défaut — pas de rattachement automatique à un compte).
export const saveLead = async (ownerId, lead) => {
  let leads = [];
  try {
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
  } catch(e){}

  const idx = leads.findIndex(l => l.ownerId === ownerId && l.emailTo && l.emailTo === lead.emailTo);
  if (idx >= 0) {
    // Préserve l'ownerId de l'enregistrement existant (important pour le CRON)
    leads[idx] = { ...leads[idx], ...lead, ownerId: leads[idx].ownerId };
  } else {
    leads.push({ ...lead, ownerId, sourcedAt: lead.sourcedAt || new Date().toISOString() });
  }
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
};

// Reste global (appelé par le CRON, sans contexte de requête) — chaque lead
// retourné porte son propre ownerId, à repasser à saveLead lors de la relance.
export const getLeadsToFollowUp = async () => {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return leads.filter(l => {
      if (l.followUpSent) return false;
      if (l.emailStatus !== "sent") return false;
      const sentDate = new Date(l.sentAt || l.sourcedAt);
      return !isNaN(sentDate) && sentDate < threeDaysAgo;
    });
  } catch (e) {
    return [];
  }
};

export const getAllLeads = async (ownerId) => {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
      return leads.filter(l => l.ownerId === ownerId);
    }
  } catch(e){}
  return [];
};

// Ne supprime plus tout le fichier : uniquement les leads du user courant.
export const deleteLeads = async (ownerId) => {
  let leads = [];
  try {
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
  } catch(e){}
  const remaining = leads.filter(l => l.ownerId !== ownerId);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(remaining, null, 2));
};
