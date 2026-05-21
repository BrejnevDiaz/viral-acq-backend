import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Lecture de l'environnement depuis server.js ou fallback
let supabase = null;
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY;

if (useSupabase) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  console.log("🟢 DB: Connecté à Supabase");
} else {
  console.log("🟠 DB: Supabase non configuré, utilisation du fallback local db.json");
  if (!fs.existsSync("db.json")) {
    fs.writeFileSync("db.json", JSON.stringify({ leads: [] }));
  }
}

export const saveLead = async (lead) => {
  if (useSupabase) {
    const { error } = await supabase.from("leads").upsert(lead, { onConflict: "emailTo" });
    if (error) console.error("❌ Erreur Supabase upsert:", error);
  } else {
    try {
      const db = JSON.parse(fs.readFileSync("db.json", "utf8"));
      // On utilise l'email comme identifiant unique
      const idx = db.leads.findIndex(l => l.emailTo === lead.emailTo && lead.emailTo);
      if (idx >= 0) {
        db.leads[idx] = { ...db.leads[idx], ...lead };
      } else {
        db.leads.push(lead);
      }
      fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    } catch (err) {
      console.error("❌ Erreur sauvegarde locale:", err);
    }
  }
};

export const getLeadsToFollowUp = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  if (useSupabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("emailStatus", "sent")
      .lt("sentAt", threeDaysAgo.toISOString())
      .is("replied", false)
      .is("followUpSent", false);
    return data || [];
  } else {
    try {
      const db = JSON.parse(fs.readFileSync("db.json", "utf8"));
      return db.leads.filter(l => {
        if (l.emailStatus !== "sent" || !l.sentAt || l.replied || l.followUpSent) return false;
        const sentDate = new Date(l.sentAt);
        return sentDate < threeDaysAgo;
      });
    } catch (err) {
      return [];
    }
  }
};
