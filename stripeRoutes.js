// ─── Facturation Stripe (Chantier #19) ───────────────────────────────────────
// Abonnements mensuels des marques : Plus 69 €, VIP Pro 99 €, VIP Elite 299 €.
// Les créateurs restent gratuits, ils ne passent jamais par ici.
//
// ⚠️ RÈGLE CARDINALE — le plan d'un utilisateur n'est JAMAIS écrit par le
// client. Il l'était (RoleContext.jsx écrivait `profiles.plan` en direct), ce
// qui permettait à quiconque de s'offrir le plan Elite depuis la console du
// navigateur. Désormais, une seule chose peut changer un plan : le webhook
// Stripe ci-dessous, authentifié par signature et exécuté avec la clé service.
// Le trigger SQL `protect_profile_privileges` fait respecter cette règle même
// si un jour du code front tentait à nouveau d'écrire cette colonne.
//
// ⚠️ CORPS BRUT — la vérification de signature exige le body non parsé. La
// route webhook doit donc être montée AVANT `express.json()` (voir
// `registerStripeWebhook`), sinon la signature échouera systématiquement avec
// un message peu explicite.

import Stripe from "stripe";
import { supabase as serviceClient } from "./supabaseClient.js";

// Correspondance plan interne → variable d'environnement contenant l'id du
// prix Stripe. Les ids ne sont pas en dur : ils diffèrent entre le mode test et
// le mode production, et changent si tu recrées un produit.
const PRICE_ENV_BY_PLAN = {
  plus:      "STRIPE_PRICE_PLUS",
  vip_pro:   "STRIPE_PRICE_VIP_PRO",
  vip_elite: "STRIPE_PRICE_VIP_ELITE",
};

// Chemin inverse, pour retrouver le plan depuis l'abonnement reçu en webhook.
const planFromPriceId = (priceId) => {
  for (const [plan, envName] of Object.entries(PRICE_ENV_BY_PLAN)) {
    if (process.env[envName] && process.env[envName] === priceId) return plan;
  }
  return null;
};

const APP_URL = process.env.APP_PUBLIC_URL || "https://viralacq.vercel.app";

let stripeClient = null;
const stripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeClient) stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
};

/**
 * Applique l'état d'un abonnement Stripe sur le profil.
 * Seul point du code autorisé à écrire `profiles.plan`.
 */
async function applySubscription(subscription) {
  if (!serviceClient) return;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  if (!customerId) return;

  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = planFromPriceId(priceId);
  const status = subscription.status;

  // Un abonnement actif ou en essai donne le plan ; tout le reste (annulé,
  // impayé…) fait retomber sur `free`. `past_due` reste servi : Stripe relance
  // le paiement plusieurs jours, couper l'accès au premier échec serait brutal
  // pour un client dont la carte a simplement expiré.
  const grants = status === "active" || status === "trialing" || status === "past_due";

  // ⚠️ Un abonnement ACTIF dont le prix ne correspond à aucun plan connu est une
  // ERREUR DE CONFIGURATION (variable STRIPE_PRICE_* absente ou périmée), pas
  // une raison de rétrograder le client. Sans ce garde-fou, un client payant
  // était ramené à `free` avec un log de succès en vert.
  if (grants && !plan) {
    throw new Error(
      `Abonnement ${subscription.id} actif sur le prix ${priceId}, qui ne correspond à aucun STRIPE_PRICE_* configuré — plan NON appliqué`
    );
  }

  const nextPlan = grants && plan ? plan : "free";

  // La fin de période a migré sur les items d'abonnement dans les versions
  // récentes de l'API : on lit les deux emplacements.
  const periodEnd = subscription.current_period_end
    ?? subscription.items?.data?.[0]?.current_period_end
    ?? null;

  const { data, error } = await serviceClient
    .from("profiles")
    .update({
      plan: nextPlan,
      stripe_subscription_id: subscription.id,
      subscription_status: status,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    })
    .eq("stripe_customer_id", customerId)
    .select("id"); // permet de compter les lignes réellement touchées

  if (error) {
    // Jamais silencieux : un plan non appliqué, c'est un client qui a payé sans
    // recevoir son accès.
    throw new Error(`Mise à jour du plan impossible: ${error.message}`);
  }
  // ⚠️ 0 ligne modifiée n'est PAS une erreur pour supabase-js : sans ce test, un
  // profil non encore rattaché à son client Stripe (course entre
  // checkout.session.completed et subscription.created) était loggé en succès
  // alors que rien n'avait été écrit. On lève, Stripe rejouera.
  if (!data?.length) {
    throw new Error(`Aucun profil rattaché au client ${customerId} — plan non appliqué (l'événement sera rejoué)`);
  }
  console.log(`✅ [Stripe] ${customerId} → plan ${nextPlan} (${status})`);
}

/**
 * Route webhook. À monter AVANT express.json() : la signature se vérifie sur le
 * corps brut.
 */
export function registerStripeWebhook(app, express) {
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const client = stripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!client || !secret) {
      console.warn("⚠️ [Stripe] webhook reçu mais STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET absents");
      return res.status(503).send("Stripe non configuré");
    }

    let event;
    try {
      // C'est CETTE vérification qui empêche n'importe qui d'appeler l'URL du
      // webhook pour s'attribuer un plan : sans la signature de Stripe, la
      // requête est rejetée.
      event = client.webhooks.constructEvent(req.body, req.headers["stripe-signature"], secret);
    } catch (err) {
      console.error("❌ [Stripe] signature webhook invalide:", err.message);
      return res.status(400).send(`Signature invalide: ${err.message}`);
    }

    // ⚠️ L'anti-rejeu est vérifié ICI mais n'est ENREGISTRÉ qu'APRÈS un
    // traitement réussi (voir plus bas). Enregistrer avant, comme je l'avais
    // fait d'abord, transformait le moindre incident transitoire (Supabase
    // indisponible, timeout Stripe) en perte définitive : la seconde livraison
    // était classée « déjà traité » et le client payait sans jamais recevoir
    // son plan.
    if (serviceClient) {
      const { data: seen } = await serviceClient
        .from("stripe_events").select("id").eq("id", event.id).maybeSingle();
      if (seen) {
        console.log(`↩️ [Stripe] événement ${event.id} déjà traité`);
        return res.json({ received: true, duplicate: true });
      }
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          // On rattache le client Stripe au profil AVANT d'appliquer le plan :
          // `applySubscription` retrouve le profil par `stripe_customer_id`.
          const userId = session.client_reference_id || session.metadata?.user_id;
          if (userId && session.customer && serviceClient) {
            const { data: linked, error: linkErr } = await serviceClient.from("profiles")
              .update({ stripe_customer_id: session.customer }).eq("id", userId).select("id");
            // Sans ce contrôle, un rattachement raté restait invisible et le
            // plan n'était jamais appliqué (applySubscription cherche le profil
            // par stripe_customer_id).
            if (linkErr) throw new Error(`Rattachement client Stripe impossible: ${linkErr.message}`);
            if (!linked?.length) throw new Error(`Profil ${userId} introuvable pour rattachement Stripe`);
          }
          if (session.subscription) {
            const sub = await client.subscriptions.retrieve(session.subscription);
            await applySubscription(sub);
          }
          break;
        }
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await applySubscription(event.data.object);
          break;
        case "invoice.payment_failed":
          console.warn(`⚠️ [Stripe] paiement échoué pour ${event.data.object.customer}`);
          break;
        default:
          break; // les autres événements ne nous concernent pas
      }

      // Marqueur d'idempotence posé SEULEMENT maintenant : l'événement a été
      // traité de bout en bout.
      if (serviceClient) {
        await serviceClient.from("stripe_events")
          .insert({ id: event.id, type: event.type })
          .then(({ error }) => error && console.warn("⚠️ [Stripe] journal d'événement:", error.message));
      }
      res.json({ received: true });
    } catch (err) {
      console.error(`❌ [Stripe] traitement de ${event.type} (${event.id}):`, err.message);
      // 500 → Stripe réessaiera, ce qui est exactement le comportement voulu :
      // l'événement n'ayant pas été journalisé, la nouvelle tentative repartira
      // du début.
      res.status(500).send("Erreur de traitement");
    }
  });
}

/** Routes authentifiées : souscription et gestion de l'abonnement. */
export default function registerStripeRoutes(app, requireAnyUser) {
  // ─── POST /api/stripe/checkout — démarrer un abonnement ───────────────────
  app.post("/api/stripe/checkout", ...requireAnyUser, async (req, res) => {
    const client = stripe();
    if (!client) return res.status(503).json({ error: "Le paiement n'est pas encore configuré." });
    // Les abonnements sont réservés aux marques : un créateur, dont l'accès est
    // gratuit par principe, n'a rien à souscrire ici.
    if (req.user.role === "creator") {
      return res.status(403).json({ error: "Les créateurs bénéficient d'un accès gratuit — aucun abonnement n'est nécessaire." });
    }

    const plan = String(req.body?.plan || "");
    const priceEnv = PRICE_ENV_BY_PLAN[plan];
    const priceId = priceEnv ? process.env[priceEnv] : null;
    if (!priceId) {
      console.error(`❌ [Stripe] prix manquant pour le plan "${plan}" (${priceEnv} non défini)`);
      return res.status(400).json({ error: "Ce forfait n'est pas disponible à la souscription." });
    }

    try {
      // Réutilise le client Stripe existant s'il y en a un, pour ne pas créer
      // un doublon à chaque changement de formule.
      let customerId = null;
      if (serviceClient) {
        const { data: profile } = await serviceClient
          .from("profiles").select("stripe_customer_id, subscription_status").eq("id", req.user.id).maybeSingle();
        customerId = profile?.stripe_customer_id || null;

        // ⚠️ Un abonné qui repasse par le paywall au lieu du portail se
        // retrouverait avec DEUX abonnements actifs, donc deux prélèvements —
        // et l'annulation du premier ferait retomber son plan à `free` alors
        // que le second court toujours. On le renvoie vers le portail, seul
        // endroit prévu pour changer de formule.
        if (["active", "trialing", "past_due"].includes(profile?.subscription_status)) {
          return res.status(409).json({
            error: "Vous avez déjà un abonnement actif. Utilisez « Gérer mon abonnement » pour changer de formule.",
            code: "already_subscribed",
          });
        }
      }

      const session = await client.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        ...(customerId ? { customer: customerId } : { customer_email: req.user.email }),
        // client_reference_id : c'est ce qui relie le paiement à l'utilisateur
        // au retour du webhook. Sans lui, impossible de savoir qui a payé.
        client_reference_id: req.user.id,
        metadata: { user_id: req.user.id, plan },
        // Laisse Stripe appliquer un code promo (la remise du premier mois se
        // gère par un coupon Stripe, pas dans notre code).
        allow_promotion_codes: true,
        success_url: `${APP_URL}/?checkout=success`,
        cancel_url: `${APP_URL}/?checkout=cancelled`,
      });

      res.json({ url: session.url });
    } catch (err) {
      console.error("❌ [Stripe] création de session:", err.message);
      res.status(500).json({ error: "Impossible d'ouvrir le paiement. Réessaie dans un instant." });
    }
  });

  // ─── POST /api/stripe/portal — gérer son abonnement ───────────────────────
  // Portail hébergé par Stripe : changement de formule, moyen de paiement,
  // annulation, factures. Évite de réimplémenter tout cela.
  app.post("/api/stripe/portal", ...requireAnyUser, async (req, res) => {
    const client = stripe();
    if (!client || !serviceClient) return res.status(503).json({ error: "Gestion d'abonnement indisponible." });

    try {
      const { data: profile } = await serviceClient
        .from("profiles").select("stripe_customer_id").eq("id", req.user.id).maybeSingle();
      if (!profile?.stripe_customer_id) {
        return res.status(400).json({ error: "Aucun abonnement actif sur ce compte." });
      }
      const session = await client.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: APP_URL,
      });
      res.json({ url: session.url });
    } catch (err) {
      console.error("❌ [Stripe] portail client:", err.message);
      res.status(500).json({ error: "Impossible d'ouvrir la gestion de l'abonnement." });
    }
  });

  // ─── GET /api/stripe/subscription — état de l'abonnement ──────────────────
  app.get("/api/stripe/subscription", ...requireAnyUser, async (req, res) => {
    if (!serviceClient) return res.json({ subscription: null });
    try {
      const { data } = await serviceClient
        .from("profiles")
        .select("plan, subscription_status, current_period_end, stripe_customer_id")
        .eq("id", req.user.id).maybeSingle();
      res.json({
        subscription: data
          ? {
              plan: data.plan,
              status: data.subscription_status,
              currentPeriodEnd: data.current_period_end,
              // On expose un booléen, jamais l'identifiant client Stripe.
              hasBilling: !!data.stripe_customer_id,
            }
          : null,
      });
    } catch (err) {
      console.error("❌ [Stripe] lecture abonnement:", err.message);
      res.status(500).json({ error: "État de l'abonnement indisponible." });
    }
  });
}
