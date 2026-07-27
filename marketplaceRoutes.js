// ─── Marketplace Vidéo — messagerie, commandes (Chantier #18) ────────────────
// Une marque discute avec un créateur à propos d'une vidéo précise, et lui
// adresse des commandes. Voir supabase/marketplace_commerce.sql.
//
// RÉPARTITION DES RESPONSABILITÉS :
// - Favoris et panier : le front parle directement à Supabase (RLS suffisante,
//   aucune logique métier, aucune latence inutile).
// - Messagerie et commandes : ces routes, car elles doivent envoyer des emails
//   (SMTP côté serveur uniquement) et appliquer des règles que la RLS ne sait
//   pas exprimer (transitions de statut, anti-spam de notification).
//
// ⚠️ SÉCURITÉ — pourquoi les ÉCRITURES passent par la clé service.
// La clé anon est publique (bundle front) : n'importe quel utilisateur connecté
// peut appeler l'API REST Supabase directement. Tant que les tables acceptaient
// les INSERT/UPDATE du client, tous les contrôles ci-dessous étaient
// contournables en une requête : commander à un prix choisi, s'auto-accepter
// une commande, ou réécrire le brand_id d'un fil pour en lire l'historique.
// `marketplace_threads`, `marketplace_messages` et `marketplace_orders` n'ont
// donc PLUS aucune policy d'écriture (voir le SQL) : seul ce fichier écrit,
// avec la clé service, et c'est ici que l'appartenance est vérifiée — jamais
// implicitement par la RLS. Chaque écriture doit donc explicitement contrôler
// que l'appelant est bien partie prenante.
// Les LECTURES restent scopées au JWT : la RLS y fait le filtrage, ce qui évite
// d'avoir à le refaire et supprime tout risque de fuite par oubli.

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { supabase as serviceClient } from "./supabaseClient.js";

// Client de LECTURE : scopé au JWT de l'appelant, donc soumis à la RLS.
const scopedClient = (token) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey || !token) return null;
  return createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
};

// Client d'ÉCRITURE : clé service, hors RLS. Toute requête passant par lui doit
// être précédée d'un contrôle d'appartenance explicite dans ce fichier.
const writeClient = () => serviceClient;

// Le créateur n'est prévenu par email qu'une fois par heure et par fil : sans
// cette borne, dix messages d'affilée déclencheraient dix emails.
const NOTIFY_COOLDOWN_MS = 60 * 60 * 1000;

const APP_URL = "https://viralacq.vercel.app";

// Tout ce qui vient d'un utilisateur (nom de produit saisi par le créateur,
// texte du message) est échappé avant d'entrer dans le HTML de l'email :
// sinon un créateur pourrait glisser un lien de phishing dans un courriel
// expédié depuis l'adresse officielle de la plateforme.
const escapeHtml = (str = "") =>
  String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function notifyCreator({ creatorEmail, creatorName, brandName, videoProduct, preview }) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPassword) {
    console.warn("⚠️ [Marketplace] GMAIL_USER/GMAIL_APP_PASSWORD absents — notifications email désactivées");
    return false;
  }
  if (!creatorEmail) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPassword },
  });

  const safeBrand = escapeHtml(brandName);
  const safeProduct = escapeHtml(videoProduct);
  const subject = `💬 ${brandName} vous a contacté sur Acquisition Pro`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;color:#18181B">
      <p style="font-size:15px">Bonjour ${escapeHtml(creatorName || "")},</p>
      <p style="font-size:15px"><strong>${safeBrand}</strong> vient de vous écrire au sujet de votre contenu
        <strong>${safeProduct}</strong>.</p>
      <blockquote style="margin:16px 0;padding:12px 16px;background:#F4F4F5;border-left:3px solid #8B5CF6;font-size:14px">
        ${escapeHtml(String(preview).slice(0, 300))}
      </blockquote>
      <p style="font-size:15px">
        <a href="${APP_URL}" style="display:inline-block;padding:12px 22px;border-radius:10px;
           background:linear-gradient(90deg,#8B5CF6,#EC4899);color:#fff;text-decoration:none;font-weight:700">
          Répondre dans Acquisition Pro
        </a>
      </p>
      <p style="font-size:12px;color:#71717A">Vous recevez cet email car une marque vous a contacté sur la Marketplace Vidéo.</p>
    </div>`;

  await transporter.sendMail({
    from: `"Acquisition Pro" <${gmailUser}>`,
    to: creatorEmail,
    subject,
    text: `${brandName} vous a écrit au sujet de ${videoProduct} : ${String(preview).slice(0, 300)}\n\nRépondez sur ${APP_URL}`,
    html,
  });
  return true;
}

export default function registerMarketplaceRoutes(app, requireAnyUser) {
  // ─── GET /api/marketplace/threads — fils de l'utilisateur ─────────────────
  // Renvoie aussi bien les fils où il est la marque que ceux où il est le
  // créateur : la RLS filtre, on n'a pas à distinguer côté serveur.
  app.get("/api/marketplace/threads", ...requireAnyUser, async (req, res) => {
    const db = scopedClient(req.user?.token);
    if (!db) return res.json({ threads: [] });
    try {
      const { data, error } = await db
        .from("marketplace_threads")
        .select("id, video_id, brand_id, creator_id, last_message_at, marketplace_videos(product, username, price, video_url)")
        .order("last_message_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      res.json({ threads: data || [] });
    } catch (err) {
      console.error("❌ [Marketplace] threads:", err.message);
      res.status(500).json({ error: "Impossible de charger vos conversations." });
    }
  });

  // ─── GET /api/marketplace/threads/:id/messages ────────────────────────────
  app.get("/api/marketplace/threads/:id/messages", ...requireAnyUser, async (req, res) => {
    const db = scopedClient(req.user?.token);
    if (!db) return res.json({ messages: [] });
    try {
      const { data, error } = await db
        .from("marketplace_messages")
        .select("id, sender_id, body, created_at")
        .eq("thread_id", req.params.id)
        .order("created_at", { ascending: true })
        .limit(200);
      if (error) throw error;
      // La RLS renvoie un tableau vide si l'appelant n'est pas partie au fil :
      // aucune fuite possible, inutile de re-vérifier ici.
      res.json({ messages: data || [] });
    } catch (err) {
      console.error("❌ [Marketplace] messages:", err.message);
      res.status(500).json({ error: "Impossible de charger la conversation." });
    }
  });

  // ─── POST /api/marketplace/messages — écrire à un créateur ────────────────
  // Body : { videoId, body, threadId? }. Le fil est créé au premier message.
  app.post("/api/marketplace/messages", ...requireAnyUser, async (req, res) => {
    const { videoId, body, threadId = null } = req.body || {};
    const text = String(body || "").trim();
    if (!text) return res.status(400).json({ error: "Message vide." });
    if (text.length > 4000) return res.status(400).json({ error: "Message trop long (4000 caractères maximum)." });

    const db = writeClient();
    if (!db) return res.status(503).json({ error: "Messagerie indisponible (configuration serveur)." });

    try {
      let thread = null;

      if (threadId) {
        const { data } = await db.from("marketplace_threads")
          .select("id, brand_id, creator_id, video_id, last_notified_at, last_notified_brand_at").eq("id", threadId).maybeSingle();
        // Contrôle d'appartenance EXPLICITE : la clé service ignore la RLS,
        // c'est donc ici — et nulle part ailleurs — qu'on empêche d'écrire
        // dans le fil d'autrui.
        if (!data || (data.brand_id !== req.user.id && data.creator_id !== req.user.id)) {
          return res.status(403).json({ error: "Cette conversation ne vous appartient pas." });
        }
        thread = data;
      }

      if (!thread) {
        // Le créateur destinataire est déduit de la VIDÉO, jamais du body :
        // sinon n'importe qui pourrait ouvrir un fil au nom d'un tiers.
        const { data: video, error: vErr } = await db
          .from("marketplace_videos").select("id, user_id, product, username").eq("id", videoId).maybeSingle();
        if (vErr || !video) return res.status(404).json({ error: "Cette vidéo n'existe plus." });
        if (video.user_id === req.user.id) {
          return res.status(400).json({ error: "Vous ne pouvez pas vous écrire à vous-même." });
        }

        // Un seul fil par couple (vidéo, marque) — contrainte UNIQUE en base.
        const { data: existing } = await db.from("marketplace_threads")
          .select("id, brand_id, creator_id, video_id, last_notified_at, last_notified_brand_at")
          .eq("video_id", videoId).eq("brand_id", req.user.id).maybeSingle();

        if (existing) {
          thread = existing;
        } else {
          const { data: created, error: cErr } = await db.from("marketplace_threads")
            .insert({ video_id: videoId, brand_id: req.user.id, creator_id: video.user_id })
            .select("id, brand_id, creator_id, video_id, last_notified_at, last_notified_brand_at").single();
          if (cErr) throw cErr;
          thread = created;
        }
      }

      const { data: message, error: mErr } = await db.from("marketplace_messages")
        .insert({ thread_id: thread.id, sender_id: req.user.id, body: text })
        .select("id, sender_id, body, created_at").single();
      if (mErr) throw mErr;

      const { error: tErr } = await db.from("marketplace_threads")
        .update({ last_message_at: new Date().toISOString() }).eq("id", thread.id);
      if (tErr) console.warn("⚠️ [Marketplace] last_message_at non mis à jour:", tErr.message);

      res.json({ thread: { id: thread.id }, message });

      // Notification email APRÈS la réponse : l'utilisateur ne doit pas
      // attendre le SMTP, et un email en échec ne doit pas perdre son message.
      notifyRecipient(db, req.user, thread, text).catch((err) =>
        console.error("⚠️ [Marketplace] notification email:", err.message)
      );
    } catch (err) {
      console.error("❌ [Marketplace] envoi message:", err.message);
      res.status(500).json({ error: "Votre message n'a pas pu être envoyé. Réessayez." });
    }
  });

  // ─── POST /api/marketplace/orders — envoyer une commande ──────────────────
  // Body : { videoIds: [] }. Une commande est créée PAR CRÉATEUR concerné,
  // avec un message récapitulatif dans le fil correspondant.
  app.post("/api/marketplace/orders", ...requireAnyUser, async (req, res) => {
    const videoIds = Array.isArray(req.body?.videoIds) ? [...new Set(req.body.videoIds)] : [];
    if (videoIds.length === 0) return res.status(400).json({ error: "Votre panier est vide." });
    if (videoIds.length > 50) return res.status(400).json({ error: "Trop d'articles dans une même commande." });

    const db = writeClient();
    if (!db) return res.status(503).json({ error: "Commande indisponible (configuration serveur)." });

    // Les ids non-UUID (vidéos de démonstration côté front) feraient échouer la
    // requête Postgres avec une 500 illisible : on les écarte proprement.
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validIds = videoIds.filter((id) => UUID_RE.test(String(id)));
    if (validIds.length === 0) {
      return res.status(400).json({ error: "Votre panier ne contient aucune vidéo commandable." });
    }

    try {
      // Les prix sont relus EN BASE, jamais pris du client : sinon une marque
      // pourrait commander à un prix qu'elle a choisi elle-même.
      const { data: videos, error: vErr } = await db
        .from("marketplace_videos").select("id, user_id, product, price, username")
        .eq("status", "active").in("id", validIds);
      if (vErr) throw vErr;
      if (!videos?.length) return res.status(404).json({ error: "Ces vidéos ne sont plus disponibles." });

      const own = videos.filter((v) => v.user_id === req.user.id);
      if (own.length) return res.status(400).json({ error: "Votre panier contient vos propres vidéos." });

      // Une commande distincte par créateur : chacun ne voit que ce qui le
      // concerne, et peut accepter indépendamment des autres.
      const byCreator = new Map();
      for (const v of videos) {
        if (!byCreator.has(v.user_id)) byCreator.set(v.user_id, []);
        byCreator.get(v.user_id).push(v);
      }

      const orders = [];
      for (const [creatorId, items] of byCreator) {
        const total = items.reduce((s, v) => s + Number(v.price || 0), 0);

        // Fil rattaché à la première vidéo du lot, créé s'il n'existe pas.
        let { data: thread } = await db.from("marketplace_threads")
          .select("id, brand_id, creator_id, video_id, last_notified_at, last_notified_brand_at")
          .eq("video_id", items[0].id).eq("brand_id", req.user.id).maybeSingle();
        if (!thread) {
          const { data: created, error: tErr } = await db.from("marketplace_threads")
            .insert({ video_id: items[0].id, brand_id: req.user.id, creator_id: creatorId })
            .select("id, brand_id, creator_id, video_id, last_notified_at, last_notified_brand_at").single();
          // Sans ce log, un échec (envois concurrents violant la contrainte
          // UNIQUE) créait une commande sans fil, donc sans récapitulatif ni
          // notification : le créateur ne l'apprenait jamais.
          if (tErr) console.error("❌ [Marketplace] création du fil de commande:", tErr.message);
          thread = created;
        }

        const { data: order, error: oErr } = await db.from("marketplace_orders").insert({
          brand_id: req.user.id,
          creator_id: creatorId,
          thread_id: thread?.id || null,
          items: items.map((v) => ({ video_id: v.id, product: v.product, price: Number(v.price || 0) })),
          total,
        }).select("id, total, status, created_at").single();
        if (oErr) throw oErr;
        orders.push(order);

        // Le récapitulatif est tronqué à 4000 caractères, limite imposée par la
        // contrainte CHECK de la colonne : au-delà, l'insert échouerait et le
        // créateur ne recevrait aucun message.
        const lines = items.map((v) => `• ${v.product} — ${Number(v.price || 0).toFixed(2)} €`).join("\n");
        const recap = `🛒 Nouvelle commande\n\n${lines.slice(0, 3600)}\n\nTotal : ${total.toFixed(2)} €\n\nPouvez-vous confirmer votre disponibilité ?`;
        if (thread?.id) {
          const { error: rErr } = await db.from("marketplace_messages")
            .insert({ thread_id: thread.id, sender_id: req.user.id, body: recap });
          if (rErr) console.error("❌ [Marketplace] récapitulatif de commande non enregistré:", rErr.message);
          await db.from("marketplace_threads").update({ last_message_at: new Date().toISOString() }).eq("id", thread.id);
          notifyRecipient(db, req.user, thread, recap).catch((err) =>
            console.error("⚠️ [Marketplace] notification commande:", err.message)
          );
        }
      }

      // On ne retire du panier QUE ce qui a réellement été commandé : une vidéo
      // devenue indisponible doit y rester visible, pas disparaître en silence.
      const orderedIds = videos.map((v) => v.id);
      const { error: cErr } = await db.from("marketplace_cart")
        .delete().eq("user_id", req.user.id).in("video_id", orderedIds);
      if (cErr) console.error("❌ [Marketplace] panier non vidé:", cErr.message);

      const skipped = validIds.length - orderedIds.length;
      res.json({
        orders,
        orderedIds,
        message: `Commande envoyée à ${orders.length} créateur${orders.length > 1 ? "s" : ""}.`
          + (skipped > 0 ? ` ${skipped} vidéo${skipped > 1 ? "s" : ""} n'${skipped > 1 ? "étaient" : "était"} plus disponible${skipped > 1 ? "s" : ""} et rest${skipped > 1 ? "ent" : "e"} dans votre panier.` : ""),
      });
    } catch (err) {
      console.error("❌ [Marketplace] commande:", err.message);
      res.status(500).json({ error: "La commande n'a pas pu être envoyée. Réessayez." });
    }
  });

  // ─── PATCH /api/marketplace/orders/:id — accepter / refuser / annuler ─────
  app.patch("/api/marketplace/orders/:id", ...requireAnyUser, async (req, res) => {
    const status = String(req.body?.status || "");
    const db = writeClient();
    if (!db) return res.status(503).json({ error: "Action indisponible." });

    try {
      const { data: order, error } = await db.from("marketplace_orders")
        .select("id, brand_id, creator_id, status").eq("id", req.params.id).maybeSingle();
      if (error || !order) return res.status(404).json({ error: "Commande introuvable." });

      // La clé service ignore la RLS : l'appartenance se vérifie donc ici.
      const isCreator = order.creator_id === req.user.id;
      const isBrand = order.brand_id === req.user.id;
      if (!isCreator && !isBrand) {
        return res.status(403).json({ error: "Cette commande ne vous concerne pas." });
      }

      // Qui a le droit de faire quoi : le créateur accepte, refuse ou clôture ;
      // la marque annule.
      const allowed = isCreator ? ["accepted", "declined", "completed"] : ["cancelled"];
      if (!allowed.includes(status)) {
        return res.status(403).json({ error: "Action non autorisée sur cette commande." });
      }
      // Transitions valides, énumérées explicitement : « terminée » ne doit être
      // accessible que depuis une commande acceptée, jamais depuis une commande
      // refusée ou annulée.
      const VALID_FROM = { accepted: ["pending"], declined: ["pending"], cancelled: ["pending"], completed: ["accepted"] };
      if (!VALID_FROM[status]?.includes(order.status)) {
        return res.status(409).json({ error: "Cette commande a déjà été traitée." });
      }

      const { data: updated, error: uErr } = await db.from("marketplace_orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", order.id).select("id, status").single();
      if (uErr) throw uErr;
      res.json({ order: updated });
    } catch (err) {
      console.error("❌ [Marketplace] maj commande:", err.message);
      res.status(500).json({ error: "Mise à jour impossible." });
    }
  });
}

/**
 * Prévient par email l'AUTRE partie du fil, avec une borne anti-spam d'une
 * heure. Jamais bloquant : un échec est loggé, pas remonté à l'utilisateur
 * dont le message est déjà enregistré.
 */
async function notifyRecipient(db, sender, thread, preview) {
  if (!thread?.id) return;
  const recipientId = thread.brand_id === sender.id ? thread.creator_id : thread.brand_id;
  if (!recipientId) return;

  // Le cooldown est propre à CHAQUE destinataire : partagé, la réponse du
  // créateur dans l'heure ne prévenait pas la marque, et inversement.
  const cooldownField = recipientId === thread.creator_id ? "last_notified_at" : "last_notified_brand_at";
  const lastNotified = thread[cooldownField];
  if (lastNotified && Date.now() - new Date(lastNotified).getTime() < NOTIFY_COOLDOWN_MS) {
    return; // ce destinataire a déjà été prévenu récemment pour ce fil
  }

  // L'email du destinataire est lu côté serveur uniquement : il sert à envoyer
  // le courriel et n'est jamais renvoyé au client ni écrit dans un log.
  if (!serviceClient) return;
  const { data: profile } = await serviceClient
    .from("profiles").select("email").eq("id", recipientId).maybeSingle();
  if (!profile?.email) {
    console.warn("⚠️ [Marketplace] pas d'email pour le destinataire — notification ignorée");
    return;
  }

  const { data: video } = await db.from("marketplace_videos")
    .select("product").eq("id", thread.video_id).maybeSingle();

  // ⚠️ On n'expose PAS l'email de l'expéditeur au destinataire : la policy
  // `users_read_own` de `profiles` interdit précisément de lire l'adresse d'un
  // autre utilisateur, et la contourner par email reviendrait au même. On
  // désigne donc l'expéditeur par son rôle dans le fil.
  const senderLabel = sender.id === thread.brand_id ? "Une marque" : "Un créateur";

  const sent = await notifyCreator({
    creatorEmail: profile.email,
    creatorName: "",
    brandName: senderLabel,
    videoProduct: video?.product || "votre contenu",
    preview,
  });
  if (sent) {
    await db.from("marketplace_threads")
      .update({ [cooldownField]: new Date().toISOString() }).eq("id", thread.id);
  }
}
