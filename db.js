import fs from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "leads.json");

export const saveLead = async (lead) => {
  let leads = [];
  try {
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
  } catch(e){}
  
  const idx = leads.findIndex(l => l.emailTo && l.emailTo === lead.emailTo);
  if (idx >= 0) {
    leads[idx] = { ...leads[idx], ...lead };
  } else {
    leads.push({ ...lead, sourcedAt: lead.sourcedAt || new Date().toISOString() });
  }
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
};

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

export const getAllLeads = async () => {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      return JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
  } catch(e){}
  return [];
};

export const deleteLeads = async () => {
  fs.writeFileSync(LEADS_FILE, "[]");
};
