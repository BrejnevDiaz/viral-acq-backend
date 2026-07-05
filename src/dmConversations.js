// ─── Direct Message mock conversations — UI-only, keyed by creator username ───
// No backend yet: VideoMarketplaceTab seeds one of these (or a generic fallback)
// per creator, and DirectMessagePanel appends new messages to local state only.
export const DM_CONVERSATIONS = {
  diariatou_sow: [
    { sender: "creator", text: "Salut ! Merci pour l'intérêt sur ma vidéo 🙌 Tu veux discuter du sérum vitamine C ?", time: "10:24" },
    { sender: "brand", text: "Oui exactement, on adore le rendu. On peut négocier un tarif pour une collab récurrente ?", time: "10:26" },
    { sender: "creator", text: "Avec plaisir ! Pour 3 vidéos/mois je peux faire un tarif dégressif, on en parle ?", time: "10:29" },
  ],
  skincare_goddess: [
    { sender: "creator", text: "Hello 👋 j'ai vu que tu regardais ma vidéo crème nuit, tu veux plus d'infos ?", time: "14:02" },
    { sender: "brand", text: "Salut ! Oui, est-ce que tu peux refaire une version avec un packaging différent ?", time: "14:05" },
  ],
  fashion_nova: [
    { sender: "creator", text: "Hey ! Le sac cabas cartonne cette semaine, +20k vues 🔥", time: "09:11" },
  ],
  "fitfluencer.co": [
    { sender: "creator", text: "Salut, dispo pour un shooting produit la semaine prochaine si besoin !", time: "18:40" },
  ],
  "lena.situations": [
    { sender: "creator", text: "Merci pour le message ! Je peux faire une story en plus de la vidéo si tu veux booster la visibilité.", time: "11:15" },
  ],
  "marie.lopez": [
    { sender: "creator", text: "Coucou 😊 la palette yeux a super bien performé, on continue sur d'autres teintes ?", time: "16:50" },
  ],
};

export const DM_QUICK_REPLIES = {
  fr: ["Peux-tu baisser ton tarif ?", "On peut faire une collab récurrente ?", "Peux-tu modifier la vidéo ?"],
  en: ["Can you lower your rate?", "Can we do a recurring collab?", "Can you tweak the video?"],
  it: ["Puoi abbassare la tariffa?", "Possiamo fare una collab ricorrente?", "Puoi modificare il video?"],
};
