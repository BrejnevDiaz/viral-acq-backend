# CLAUDE CODE HANDOVER : ACQUISITION PRO

Bonjour Claude. Ce document contient absolument tout ce que tu dois savoir sur ce projet pour le refactoriser, corriger ses incohérences et améliorer son angle marketing, sans rien casser.

## 1. CONTEXTE PRODUIT & BUSINESS

**Nom du SaaS** : Acquisition Pro
**Éditeur** : Agence Viral Acquisition (Fondateur : Brejnev Diaz)
**Concept** : C'est une plateforme hybride (Matchmaking / AdSpy / CRM) qui connecte les marques E-commerce avec des créateurs de contenu UGC.

### Les 2 Cibles (Architecture des Rôles)
1. **Les Marques / Agences (Rôle : `brand`)** : 
   - Paient un abonnement (Essai gratuit 14 jours, puis 49€ ou 99€).
   - Cherchent à espionner la concurrence (AdSpy, Shop Analyzer) et trouver des produits gagnants.
   - Utilisent le CRM pour recruter des créateurs UGC et gérer leurs contrats.
2. **Les Créateurs UGC (Rôle : `creator`)** :
   - Accès 100% gratuit, 0% de commission.
   - Sont verrouillés (Feature Gating) : Ils n'ont pas accès aux outils d'espionnage (Adspy, Shop Analyzer). 
   - Leur interface principale est le "Creator Dashboard" (Onglet *Talents & Gigs*) où ils reçoivent et gèrent les missions (Briefs) envoyées par les marques.

### L'Offre "Agence Done-For-You"
En plus du SaaS "Do-It-Yourself", il y a un upsell majeur : si une marque n'a pas le temps, elle peut tout déléguer à l'Agence Viral Acquisition via une Modale de Contact Interne premium (Qualification des prospects).

## 2. MISSIONS POUR CLAUDE (TES OBJECTIFS)

En tant qu'IA de refactoring, tu as 3 objectifs principaux :

### Objectif A : Refactoring de l'Architecture (Priorité 1)
Le fichier `src/App.jsx` est devenu un monolithe de plus de 3000 lignes. Tu dois extraire les composants de manière chirurgicale, en respectant cet ordre (pour ne pas briser les `useState` et `useEffect`) :
1. **Phase 1** : Extraire les sections de la Landing Page (Hero, Features, Pricing, Modales d'inscription).
2. **Phase 2** : Créer un Layout pour le Dashboard (Sidebar, Topbar).
3. **Phase 3** : Extraire les gros onglets métier (AdSpy, CRM, Shop Analyzer) s'ils ne le sont pas déjà entièrement.
4. **Phase 4** : Remplacer le prop-drilling par un contexte global (ex: `AuthContext`, `RoleContext`).

### Objectif B : Audit Full-Stack & Chasse aux Incohérences (Front & Back)
Pendant ton refactoring, tu as un mandat total pour analyser et corriger tout ce qui te semble incorrect ou non optimisé, que ce soit sur le Front-end ou le Back-end (Node.js/Express, requêtes API, Supabase) :
- Vérifie et corrige les liens morts, les routes inexistantes ou les boutons qui ne font rien.
- Résous les bugs visuels (Modales qui se superposent mal, z-index défectueux, responsivité mobile).
- Blinde la logique côté serveur et client (Logiques de "Feature Gating" contournables, requêtes API non sécurisées).
- Supprime les classes CSS inexistantes et le code mort.
- Si une logique te semble absurde ou fragile, réécris-la proprement.

### Objectif C : Optimisation Marketing Extrême & Copywriting
Tu as pour mission de rendre ce SaaS irrésistible. Le copywriting doit transpirer l'expertise, l'urgence, la rareté et la haute valeur perçue (High Ticket). 
- Audit de Copywriting : Si un texte actuel te semble "pas assez vendeur", "mal formulé" ou "moins attractif", **réécris-le immédiatement** pour qu'il soit percutant. 
- Utilise des angles marketing orientés "Performance pure", "Explosion du ROI", "Scalabilité massive", "Gains de temps".
- S'il manque des appels à l'action (CTA) stratégiques dans le Dashboard ou le flux utilisateur, ajoute-les (Upsells, upgrades).

## 3. DESIGN SYSTEM (Règles UI strictes)

Tu ne dois pas inventer de nouveau style. Utilise ces règles :

- **Backgrounds** : Le Dashboard démarre en thème **clair** par défaut (`#f3f4f6`/`#ffffff`, texte `#1f2937`), avec un thème sombre (Zinc 950 : `#09090b` et Zinc 900 : `#18181B`) toujours disponible via le bouton bascule du menu profil (Sidebar). La home page publique (avant login) est en thème clair sophistiqué (`src/landingTheme.js`, objet `L` : fond `#FAFAF8`, texte `#18181B`) — voir DESIGN_SYSTEM.md §2 pour le détail des 3 palettes. Le Footer public et les mockups produit restent volontairement sombres (screenshots d'app encadrés).
- **Glassmorphism** : Effets de transparence sur les cartes et modales (`background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1);`) — toujours valable pour les surfaces volontairement sombres (modales, mockups).
- **Gradients de Marque (CTA)** : `linear-gradient(90deg, #8B5CF6, #EC4899)`.
- **Textes** : sur fond sombre `#ffffff` (Principal) et `#A1A1AA` (Secondaire) ; sur fond clair `L.text`/`c.text` et `L.textMuted`/`c.textMuted` selon la palette active — ne jamais coder une couleur de texte en dur sans vérifier le fond réel derrière elle.
- **Polices** : `Outfit` (Titres) et `Inter` (Corps de texte).
- **Micro-interactions** : Hover avec translation légère vers le haut (`translateY(-2px)`) et augmentation du glow box-shadow.

---

## CHANGELOG — Session du 11-12/07/2026 (Claude, Coach IA Gideon)

**⚠️ Deux copies du repo coexistent** : `Documents/acquisition-pro` (principal, celui de Gemini) et `.gemini/antigravity/scratch/prospect-agent` (copie). Les deux sont synchronisées à la fin de cette session — toute modification future doit être appliquée aux deux (ou la copie abandonnée).

### 1. Streaming SSE du Coach IA
- `aiProvider.js` → `generateAnswerStream()` (Gemini `streamGenerateContent?alt=sse`, OpenAI `stream:true`).
- `gideonEngine.js` → refactoré : pipeline commun `prepareGideon()` (gate d'accès + RAG + prompt), `queryGideon` + `queryGideonStream`.
- `server.js` → `POST /api/gideon/stream` (events SSE : `sources`, `chunk`, `done`, `error`). ⚠️ Piège corrigé : écouter `res.on("close")`, PAS `req.on("close")` (req émet "close" dès le body consommé en Node moderne → coupait tout le flux).
- Front (`CoachIATab.jsx`, `ChatbotWidget.jsx`, nouveau `src/utils/gideonStream.js`) → effet machine à écrire + curseur clignotant (doré Elite), triple repli : stream → `/api/gideon` → simulation locale.

### 2. Persistance des conversations
- Table `gideon_messages` (SQL : `supabase/gideon_messages.sql`, ✅ exécuté en prod le 11/07) avec RLS par utilisateur.
- `gideonHistory.js` → `fetchHistory` / `saveExchange` / `clearHistory` / `countToday` via client scoped au JWT.
- Routes `GET|DELETE /api/gideon/history` + sauvegarde auto fire-and-forget après chaque réponse.
- Front : historique rechargé au montage (Coach) / à l'ouverture (widget), bouton "＋ Nouvelle conversation" dans le header.
- NB : en bypass local (`ALLOW_DEV_AUTH=true`, pas de token) la persistance est désactivée par design.

### 3. Quotas journaliers par plan
- `server.js` : `GIDEON_DAILY_LIMITS` (plus 20, standard 30, pro/vip_pro 100, elite/admin illimités), comptage via `countToday` sur `gideon_messages` (jour UTC).
- Épuisement → message d'upsell + bouton "💎 Débloquer VIP Elite" (champ `quotaExceeded` dans la réponse).
- `CoachIATab.jsx` : compteur "X messages restants aujourd'hui" sous l'input (orange ≤ 5 restants), invisible pour les illimités.

### 4. Chaîne de secours Gemini → OpenAI → Claude (résilience quota)
- `aiProvider.js` réécrit : embeddings TOUJOURS Gemini (base vectorielle 768 dims). Génération : chaîne de secours Gemini → OpenAI (gpt-4o-mini) → Claude (claude-haiku-4-5, via ANTHROPIC_API_KEY déjà en .env) — bascule auto au premier échec (429...), pas de retries lents si un secours existe. Trois fournisseurs indépendants.
- En stream : bascule seulement si AUCUN fragment n'a été émis (sinon erreur propagée → le front se replie sur /api/gideon qui a la même chaîne).
- Contexte : le quota journalier Gemini free tier a été épuisé le 11/07 au soir — d'où cette protection.
- Un prompt de relève complet pour Gemini existe : `PROMPT_RELEVE_GEMINI.md` (racine du repo principal).

### 5. Sécurité / nettoyage
- `authMiddleware.js` : bypass local via `ALLOW_DEV_AUTH === "true"` explicite (fait par Gemini sur recommandation Claude — ne JAMAIS définir cette variable en prod).
- `supabase/knowledge_schema.sql` : mis à jour pour refléter la prod (vector 768, migration Gemini) — l'ancien fichier déclarait 1536.
- `supabase/knowledge_rls_patch.sql` : **⏳ EN ATTENTE D'EXÉCUTION** — supprime les policies `USING(true)` qui exposent les 91 PDF à quiconque a la clé anon. PRÉREQUIS : vérifier que `SUPABASE_KEY` du `.env` backend est la clé service_role.

### ⏳ Reste à faire
1. Exécuter `knowledge_rls_patch.sql` (après vérif clé service_role) — voir ci-dessus.
2. Tester la persistance avec un vrai compte connecté (2-3 messages → F5 → la conversation revient).
3. Vérifier visuellement le streaming (texte qui s'écrit en direct) après redémarrage serveur + `npm run dev` + hard refresh (Ctrl+Shift+R).
4. Commit + push sur les deux dépôts GitHub (`acquisition-pro`, `viral-acq-backend`).
5. Avant commercialisation : activer la facturation Gemini (le free tier n'est pas viable pour des clients payants).
6. Le SaaS n'est PAS encore commercial — plusieurs sections (recherche produit...) renvoient des résultats factices.
