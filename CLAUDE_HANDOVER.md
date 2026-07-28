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

### 7. Session du 26/07 — Multi-conversations du Coach (façon ChatGPT)
- Nouveau `supabase/gideon_conversations.sql` (⏳ À EXÉCUTER dans le SQL Editor) : table `gideon_conversations` (titre auto = début de la 1re question, RLS par user) + colonne `conversation_id` sur `gideon_messages` (CASCADE). Les anciens messages de test (conversation_id NULL) ne s'affichent plus — voulu.
- `gideonHistory.js` réécrit : `listConversations` / `createConversation` / `deleteConversation` / `ensureConversation` ; `fetchHistory(user, conversationId)` renvoie désormais `{conversationId, messages}` (sans id → conversation la plus récente) ; `saveExchange` rattache à la conversation et remonte son `updated_at`.
- `server.js` : routes `GET|POST /api/gideon/conversations`, `DELETE /api/gideon/conversations/:id` ; `/api/gideon` et `/api/gideon/stream` acceptent `conversationId` (auto-création au 1er message, id renvoyé dans la réponse/event done) ; `GET /history?conversationId=`.
- `CoachIATab.jsx` : panneau latéral 250px (bouton Nouvelle conversation, liste titres+dates, corbeille au survol, actif surligné or/violet, caché < 900px via `.conv-sidebar`). `ChatbotWidget.jsx` : suit la conversation active via `convId`.
- Config Supabase corrigée le 26/07 : Site URL = viralacq.vercel.app, Redirect URLs = viralacq + localhost:5173/** (le login Google renvoyait vers l'app obsolète).
- Fix persistance : insert multi-lignes avec colonnes identiques (NOT NULL sources) + tri secondaire sur role (timestamps identiques dans la paire).
- ⏭️ Chantier suivant demandé par Diaz : VRAIES données pour Recherche produit / Shop Analyzer (Meta, TikTok, Amazon... — Apify déjà utilisé pour AdSpy), puis retirer les ComingSoonOverlay.

### 8. Session du 26/07 — Chantier #16 : upload multimodal dans le Coach IA
Gideon analyse désormais les fichiers joints aux messages (screenshot de dashboard Meta Ads, page produit, PDF de rapport…).

**Périmètre v1** : images (JPG/PNG/WebP/GIF) + PDF. **Vidéos volontairement exclues** — Gemini les lit, mais les moteurs de secours OpenAI/Claude non : une bascule de fallback aurait produit une analyse muette. À traiter dans un chantier dédié via la Files API Gemini.

- **`supabase/gideon_uploads.sql` (⏳ À EXÉCUTER dans le SQL Editor)** : bucket privé `gideon-uploads` (15 Mo/fichier, mimes en liste blanche) + policies `storage.objects` limitant chacun à son dossier `${auth.uid()}/…` + colonne `gideon_messages.attachments` (jsonb). Idempotent. Tant qu'il n'est pas exécuté, le Coach fonctionne mais les uploads échouent et l'historique se recharge sans pièces jointes (repli automatique codé dans `gideonHistory.js`, log serveur explicite).
- **`gideonUploads.js` (nouveau)** : limites par plan (`GIDEON_UPLOAD_LIMITS` — plus 2 fichiers/5 Mo images seules, standard 3/8 Mo +PDF, pro 5/12 Mo, elite 10/12 Mo ; free interdit), validation par **magic bytes** (jamais le mimetype client, falsifiable), stockage tout-ou-rien (un fichier refusé → les précédents sont supprimés), rechargement avec contrôle d'appartenance du chemin (`${user.id}/…`, pas de `..`), `sanitizeAttachmentRefs` (les métadonnées persistées sont reconstruites à partir du fichier réellement stocké, jamais du body client).
  - ⚠️ Le plafond **12 Mo** est technique : l'API Gemini limite une requête inline à ~20 Mo **base64 compris** (+33 %), auxquels s'ajoutent system prompt et contexte RAG. Pour aller au-delà (vidéos, gros PDF), passer à la Files API.
  - ⚠️ **Pas de GIF** : accepté par le navigateur mais refusé par l'inline Gemini (png/jpeg/webp/heic/heif) — le laisser passer faisait échouer le moteur principal sans explication.
- **`server.js`** : `POST /api/gideon/upload`, `DELETE /api/gideon/upload` (purge des fichiers d'un envoi abandonné), `GET /api/gideon/attachment?path=` (URL signée 1 h) ; `/api/gideon` et `/api/gideon/stream` acceptent `attachments: [{path,name,mime,size}]`. `/api/gideon/history` renvoie aussi `uploadLimits`.
  - ⚠️ Le parseur multer est **construit avec les limites du plan** (`gideonUploadFor(limits)`) et le plan free est refusé **avant** de lire le body : un cap fixe large aurait permis à n'importe quel compte de faire bufferiser 150 Mo en RAM avant le 403 (OOM sur Railway 512 Mo, aucun rate-limiter dans ce serveur).
  - Sur le stream, les pièces jointes sont chargées **avant** les headers SSE pour qu'un refus sorte en HTTP 4xx lisible et non en event SSE. Les refus liés aux fichiers portent `code: "attachment"` (voir front).
  - `attachments` est lu via `Array.isArray(req.body?.attachments)` : un défaut de déstructuration ne couvre pas `null` et provoquait un 500.
- **`aiProvider.js`** : `attachments` propagé dans toute la chaîne. Gemini → `inlineData` ; Claude → blocs `image`/`document` (PDF nativement) ; OpenAI gpt-4o-mini → images seules, les PDF sont remplacés par une note textuelle explicite (le moteur le dit au lieu de faire semblant). Les fichiers ne sont joints qu'au **message courant** (jamais réencodés dans l'historique — explosion de tokens) ; le front ajoute en revanche une note texte `[N fichier(s) joint(s) précédemment : …]` pour que le tour suivant reste cohérent.
- **`gideonHistory.js`** : `purgeAttachments()` supprime les fichiers du bucket **avant** tout DELETE en base (`deleteConversation`, `clearHistory`) — sinon « supprimer ma conversation » laissait les fichiers stockés et facturés (et un problème RGPD). Repli automatique si la colonne `attachments` n'existe pas encore.
- **Front** : `src/utils/gideonAttachments.js` (pré-validation locale poids cumulé compris, upload multipart, purge, URL signée), `src/GideonAttachments.jsx` (vignettes avant envoi + dans les bulles), `CoachIATab.jsx` (bouton trombone premium gradient violet/or Elite avec badge de compteur et hover `translateY(-2px)`, bandeau d'erreur rouge dismissible, spinner pendant l'upload, envoi possible **sans texte** — consigne par défaut injectée).
  - ⚠️ Piège React 19 : les ObjectURL d'aperçu sont créés **à la sélection** dans `CoachIATab`, pas dans un `useEffect` du composant d'affichage (la règle `react-hooks/set-state-in-effect` casse le lint et provoque des rendus en cascade). Ils sont révoqués au retrait / vidage, mais **pas** après envoi (ils alimentent la vignette de la bulle).
  - Un refus serveur marqué `code: "attachment"` (→ `err.userFacing` dans `gideonStream.js`) n'est **pas** replié sur `/api/gideon` : le message remonte tel quel, le message optimiste est retiré, la sélection restaurée et les fichiers déjà stockés supprimés. Le filtrage se limite à ce code — un 401 (token expiré) doit continuer à suivre le repli normal, sinon il effaçait le message que l'utilisateur venait de taper.
  - ⚠️ Le 3ᵉ repli (simulation locale hors-ligne `getBotResponse`) est **interdit dès qu'il y a des pièces jointes** : il aurait laissé croire à une analyse jamais faite. Message d'erreur explicite + purge des fichiers à la place.
  - `limitsKnown` distingue « le serveur dit non » de « on ne sait pas encore » : sans ça, un échec de `/api/gideon/history` au montage affichait un faux upsell à un abonné payant.
- Vérifié : `node --check` sur tous les modules backend, `eslint` propre sur les fichiers touchés (reste 1 warning `exhaustive-deps` préexistant), bundle esbuild du graphe `CoachIATab` OK, tests unitaires manuels de `sniffFileType` (PNG/PDF OK, GIF/exe/tronqué rejetés) et `sanitizeAttachmentRefs`. Revue de code adversariale passée (sous-agent) — 2 bloquants et 7 importants corrigés.
- `vite build` non exécutable dans le sandbox Linux (binaire natif rolldown installé pour Windows) → **`npm run build` à lancer côté Diaz avant push**.

**⏭️ Restes connus non bloquants (chantier #16)** : pas de purge TTL des fichiers anciens (à ajouter en cron si le Storage grossit) ; si le stream casse *après* des chunks, la bulle partielle garde son curseur et une 2ᵉ bulle s'ajoute (bug préexistant, plus probable avec de gros payloads) ; grille de plans où `plus` a moins de droits que `standard` (cohérent avec `GIDEON_DAILY_LIMITS`, à confirmer côté produit).

### ✅ Prod activée le 27/07 (clôture du chantier #16)
- `supabase/gideon_uploads.sql` **exécuté** (bucket privé + 3 policies + colonne `attachments` vérifiés en SQL). Ne pas rejouer.
- Variables Railway **configurées** (clés IA + Supabase service_role) ; `ALLOW_DEV_AUTH` supprimé de la prod. Backend public : `https://viral-acq-backend-production.up.railway.app`.
- ⚠️ **Piège majeur trouvé ce jour-là** : `src/App.jsx:146` fait `const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"`. `VITE_API_URL` n'était **pas défini sur Vercel** → le site de prod demandait à chaque visiteur d'appeler SA propre machine sur le port 3001. Invisible en interne (notre backend local tourne), fatal pour un vrai client. Désormais défini sur Vercel, scope Production. **`import.meta.env` est inliné au build → changer cette variable exige un REDÉPLOIEMENT**, la définir ne suffit pas.
- Upload multimodal **validé en production** : pièce jointe analysée, et au tour suivant Gideon distingue correctement « pas de nouveau fichier » du document précédent (grâce à la note d'historique injectée par le front).
- À traiter avant commercialisation : restreindre `app.use(cors())` (server.js:58) au domaine de prod — l'API est ouverte à toutes origines. Risque limité (auth par header Bearer, qu'un site tiers ne possède pas) mais pas propre.
- Amélioration suggérée non faite : faire échouer explicitement le build/démarrage en production si `VITE_API_URL` est absent, au lieu du repli silencieux sur localhost.

### 9. Session du 27/07 — Chantier #17 : analyse VIDÉO dans le Coach
Gideon décortique désormais les créatives vidéo (hook, rythme, montage), en plus des images et PDF.

**Périmètre** : vidéo réservée au plan **Elite**, **90 s max**, **une seule par message**, `media_resolution: LOW`. Les images/PDF > 12 Mo passent aussi par la Files API (plafond inline levé).

- **`geminiFiles.js` (nouveau)** : upload resumable vers la Files API + polling de l'état `ACTIVE` (une vidéo est transcodée avant d'être exploitable) + `deleteGeminiFile`. Rappels : 2 Go/fichier, **20 Go par PROJET partagés entre tous les utilisateurs**, suppression auto après 48 h. Les fichiers sont supprimés après chaque requête (`releaseGeminiFiles`) — sans ça le quota projet se remplirait et casserait la vidéo pour tout le monde.
- **Coût, le vrai sujet** : Gemini tokenise ~300 tokens/seconde de vidéo, ~100/s en `MEDIA_RESOLUTION_LOW`. 90 s ≈ 9 000 tokens.
  - ⚠️ **Le poids ne borne PAS le coût** : 60 Mo de H.264 bien compressé, c'est 30 minutes de vidéo. Seule la **durée** le borne. D'où `readIsoBmffDuration()` dans `gideonUploads.js` : lecture de la boîte `mvhd` du conteneur (pas un décodage — ffprobe n'existe pas sur l'image Railway). Testé sur de vrais fichiers : MP4 12 s et 200 s lus exactement, MOV reconnu, fichiers tronqués → `null` → refus.
  - Conséquence assumée : **WebM et AVI sont refusés** (durée non lisible par ce parseur). Seuls MP4/MOV/3GP passent, côté front comme côté serveur comme dans le bucket.
  - ⚠️ `mediaResolution` n'existe pas sur tous les modèles Gemini : un 400 « Unknown name » déclenche **un réessai sans ce réglage** (`aiProvider.js`). Sans ce repli, toute requête vidéo basculerait sur OpenAI/Claude, qui répondraient poliment qu'ils ne savent pas lire une vidéo.
- **Garde-fou financier** : `GIDEON_DAILY_VIDEO_LIMIT = 15` vidéos/jour/compte, **admins inclus** (le compte qui teste le plus consomme le plus). Indispensable car Elite est *illimité en messages* : le surcoût de quota classique (`GIDEON_VIDEO_QUOTA_COST = 3`) n'y mordrait pas.
  - **FAIL CLOSED** : si le comptage est impossible (migration absente, Supabase KO), la vidéo est **refusée** avec log d'erreur, pas autorisée sans limite. Seule exception : le bypass local sans token.
  - ⚠️ Le quota s'appuie sur le `kind` **sniffé par magic bytes**, jamais sur celui du body : déclarer `kind:"image"` sur un .mp4 contournait tout le garde-fou (trouvé en revue).
- **`loadGideonAttachments` restructuré** en deux temps — `inspectGideonAttachments` (download + magic bytes + dédoublonnage des chemins + durée) puis upload Gemini. Permet d'évaluer le quota sur des types vérifiés **avant** d'envoyer le moindre octet à Google.
- **Ordre des contrôles inversé** dans les deux routes : quota AVANT chargement des pièces jointes. Sinon un message refusé pour quota laissait derrière lui des fichiers téléversés que rien ne référence, donc jamais purgés.
- **Pas de repli sur `/api/gideon` quand une vidéo est jointe** (`CoachIATab.jsx`) : rejouer la requête re-téléverserait et refacturerait la vidéo entière pour un seul message. Message d'échec explicite + sélection conservée.
- **Réponse vide = erreur** (`aiProvider.js`) : un `finishReason` SAFETY ou une coupure silencieuse renvoyait une bulle vide, et pour une vidéo, une facturation sans décompte. Désormais `throw` → chaîne de secours.
- **Garde-fou mémoire** : contrôle du `Content-Length` avant multer — celui-ci plafonne chaque fichier, pas le total, donc 10 × 60 Mo = 600 Mo bufferisés en RAM (OOM sur Railway 512 Mo).
- Front : durée lue par le navigateur avant upload (confort ; le serveur reste l'autorité), vignette avec première frame + badge de durée + repli carte-icône si le codec n'est pas décodable (cas du .mov sur Chrome), indicateur « analyse image par image » pendant le traitement, compteur de vidéos restantes affiché à partir de 5.
- ObjectURL des messages jetés désormais révoqués (`releaseMessagePreviews`) : anecdotique pour des images, jusqu'à 60 Mo pièce avec des vidéos.
- Vérifié : `node --check` sur tous les modules, eslint propre, bundle esbuild OK, parseur de durée testé sur fichiers ffmpeg réels, revue adversariale (sous-agent) — 4 bloquants et 7 importants corrigés.

**⏳ À faire avant de tester le #17**
1. **Rejouer `supabase/gideon_uploads.sql`** : le bucket doit accepter les mimes vidéo et passer à 60 Mo. Le script est idempotent (`ON CONFLICT DO UPDATE`).
2. `npm run build` local, puis push par Gemini (Vercel + Railway).
3. Tester avec un vrai MP4 < 90 s, puis vérifier qu'un MP4 de 3 min est refusé avec un message clair.

### 10. Session du 27/07 — Trois bugs de production corrigés (hors chantiers)
- **PAGE BLANCHE — cause trouvée** : `Uncaught TypeError: Cannot read properties of undefined (reading 'toUpperCase')` dans un `Array.map`. Origine : `ad.platform.toUpperCase()` (`AdSpyTab.jsx`) sur des données venant d'API externes (Apify/RapidAPI) — un seul créatif sans champ `platform` faisait tomber TOUTE l'application. Tous les accès de ce type ont été blindés (`AdSpyTab`, `ProductFinderTab`, `ShopAnalyzerTab`, `TalentAgencyTab`, `VideoMarketplaceTab`, `SourcingCRMTab`, `MatchmakingTab`).
  - ⚠️ **Règle à tenir** : ne jamais appeler `.toUpperCase()` / `.toLowerCase()` / `[0]` directement sur un champ issu d'une réponse d'API. Toujours `String(x || "")` ou `?.`. Un `grep` de contrôle est décrit ci-dessous.
  - **`src/ErrorBoundary.jsx` (nouveau)**, monté dans `main.jsx` AUTOUR des providers : un crash affiche désormais un écran de secours (bouton recharger + trace repliable) au lieu d'une page vide. Filet de sécurité, pas un substitut aux corrections.
  - Commande de contrôle avant chaque release :
    `grep -rn "\.\(toUpperCase\|toLowerCase\)()" src/*.jsx | grep -vE "String\(|\|\| \"|charAt|\?\?"`
- **TITRES DE PAGE** : `PAGE_TITLES` (`DesktopTopbar.jsx`) ne contenait pas `coach`, `creatorscore`, `knowledge` ni `matchmaking` → ces onglets héritaient de `default` = « CATALOGUE MATCHMAKING » (affiché sur le Coach IA). Toute entrée ajoutée à `TABS` doit désormais l'être aussi ici.
- **MENU « AMPUTÉ »** : aucune entrée n'était supprimée — la liste **défilait**. Trois causes cumulées : libellés sur deux lignes en italien/anglais, aucune barre de défilement visible, espacement vertical généreux. Corrigé par `nowrap` + ellipsis sur les libellés, classe `.sidebar-nav-scroll` (barre fine permanente + ombres de défilement, `index.css`) et padding réduit.
- **LANGUE MÉLANGÉE DU COACH** : la consigne « réponds en français sauf si l'utilisateur écrit dans une autre langue » produisait des réponses hybrides (« Come posso aiutarti a scaler ta marque »). Remplacée par un marqueur `{{LANGUE}}` dans les system prompts, substitué par une règle stricte selon `uiLang` (`LANGUAGE_RULES` dans `gideonEngine.js`). `uiLang` est désormais transmis par le front (`CoachIATab`, `ChatbotWidget`, `gideonStream`) et validé en liste blanche côté serveur. Les messages système (quota, accès refusé, panne, quota vidéo) sont traduits via `pick(uiLang, {...})`.

### 11. Session du 27/07 — Vignettes AdSpy (toutes identiques)
Symptôme : tous les créatifs affichaient la MÊME image. Cause : seules TikTok (oEmbed) et Meta/Apify fournissaient une vraie miniature ; **Instagram et Google utilisaient une unique image Unsplash par niche**, donc identique pour tous les résultats d'une même recherche.
- `fetchInstagramThumbnail()` (server.js) : lit la page `/embed/captioned/` du post (publique, sans App token Facebook) et en extrait l'image via trois motifs connus (`display_url`, `og:image`, `EmbeddedMediaImage`). Timeout 4 s, jamais bloquant, appels **parallélisés** (`Promise.all`) — en série, 6 posts auraient pu ajouter 24 s à la requête.
  - ⚠️ Non validé en conditions réelles : Instagram peut bloquer selon l'IP de sortie. Si les vignettes restent génériques après déploiement, vérifier les logs Railway ; l'alternative propre est l'oEmbed officiel Facebook (nécessite un App token).
- `fallbackThumb(niche, index)` : le repli pioche dans un jeu de 4 images par niche, **par rotation d'index** et non par hash de l'URL — les URL d'une même recherche ne diffèrent que par un shortcode, et même un bon hash (testé : FNV-1a) produisait des doublons visibles côte à côte. Vérifié par test.
- `AdSpyTab.jsx` : `onError` sur la vignette (les CDN Instagram/TikTok expirent ou refusent le hotlink → carte noire vide auparavant) + `loading="lazy"`.
- ⚠️⚠️ **PIÈGE MAJEUR — le cache masque les correctifs** : la route AdSpy met ses résultats en cache 6 h dans `api_cache` (Supabase). Après le premier déploiement du correctif, les vignettes étaient TOUJOURS identiques : le cache servait la réponse enregistrée avant le déploiement, mon code n'était jamais exécuté. **`ADSPY_CACHE_VERSION` a été introduite dans la clé de cache — l'incrémenter à chaque changement de format ou de provenance des créatifs**, sinon un correctif reste invisible jusqu'à 6 h et on croit à tort qu'il ne fonctionne pas.
  - Purge manuelle si besoin : `DELETE FROM api_cache WHERE cache_key LIKE 'adspy:%';`
  - Les deux autres caches n'ont pas encore de version : `pf:` (Product Finder, 24 h) et `shop:` (Shop Analyzer, 12 h). Même piège à prévoir.
- ℹ️ Sans rapport : les 404 `cdn.pixabay.com/*.mp4` et `/demo-video.mp4` de la console viennent de `LandingFeatures.jsx`, `LandingHero.jsx` et `VideoMarketplaceTab.jsx` (vidéos de démo dont les URL ne répondent plus). À remplacer avant commercialisation.

### 12. Session du 27/07 — Chantier #18 : commerce du Marketplace Vidéo
Une marque peut mettre des vidéos en favori, les ajouter à un panier, envoyer une commande, et échanger de vrais messages avec le créateur (qui est notifié par email). La messagerie était jusqu'ici **entièrement factice** : les messages vivaient en mémoire et un 👍 automatique arrivait après 1,2 s.

- **`supabase/marketplace_commerce.sql` (nouveau, ⏳ À EXÉCUTER)** : `marketplace_favorites`, `marketplace_cart`, `marketplace_threads`, `marketplace_messages`, `marketplace_orders`.
- **`marketplaceRoutes.js` (nouveau)** : messagerie et commandes, monté dans server.js via `registerMarketplaceRoutes(app, requireAnyUser)`.
- **`src/utils/marketplaceCommerce.js` (nouveau)** + `VideoMarketplaceTab.jsx` (cœur favori, badge panier, tiroir de commande, onglet Messages) + `DirectMessagePanel.jsx` (fil réel).

**⚠️⚠️ LE POINT LE PLUS IMPORTANT DE CE CHANTIER — modèle d'écriture**
La clé anon Supabase est **publique** (elle est dans le bundle front) : tout utilisateur connecté peut appeler l'API REST directement. Une règle métier écrite seulement dans `server.js` n'est donc **pas** une protection. La première version de ce chantier laissait les tables ouvertes en écriture ; une revue adversariale a montré qu'on pouvait alors, en une requête `curl` :
- commander une vidéo à 500 € en inscrivant `total: 0.01` ;
- s'auto-accepter une commande, ou en réécrire `items`/`creator_id` après coup ;
- **réécrire le `brand_id` d'un fil et donner à un tiers l'accès à tout l'historique de la conversation** ;
- forger un fil désignant un créateur arbitraire et déclencher un email signé du domaine de la plateforme (usurpation + spam).

Le modèle retenu, à **conserver** :
- **favoris / panier** → écriture directe autorisée (`FOR ALL USING(auth.uid() = user_id) WITH CHECK(...)`). Aucune règle métier, « la ligne m'appartient » suffit et s'exprime en RLS.
- **fils / messages / commandes** → **aucune policy INSERT ni UPDATE**. La RLS bloque toute écriture venue du front. Seul `marketplaceRoutes.js` écrit, avec la **clé service**, et vérifie l'appartenance **explicitement** à chaque fois (la clé service ignore la RLS : rien n'est implicite).
- Les **lectures** restent scopées au JWT : la RLS filtre, aucun risque de fuite par oubli.
- ⚠️ Piège Postgres : `FOR UPDATE USING (...)` **sans `WITH CHECK`** réutilise le `USING` comme `WITH CHECK` — la ligne peut donc être modifiée librement tant qu'elle reste « à soi ». C'est ce qui rendait la réécriture du `brand_id` possible.

Autres corrections issues de la revue : transitions de statut énumérées explicitement (`completed` n'est atteignable que depuis `accepted`) ; HTML des emails échappé (un nom de produit pouvait injecter un lien de phishing) ; **l'email de l'expéditeur n'est plus divulgué** au destinataire (l'expéditeur est désigné par son rôle) ; cooldown de notification séparé par destinataire (`last_notified_at` / `last_notified_brand_at`) sans quoi une réponse dans l'heure ne prévenait jamais l'autre partie ; panier vidé uniquement des vidéos réellement commandées ; ids non-UUID écartés avant Postgres.

**Onglet « Messages »** ajouté dans le Marketplace : sans lui, le créateur recevait un email « Répondre dans Acquisition Pro » sans aucun écran pour le faire — la messagerie était à sens unique.

**Vidéos de démonstration** : `isDemoVideo()` (id non-UUID) désactive message et commande avec la mention « Exemple », ces vidéos n'ayant aucun créateur inscrit derrière.

**⏳ Reste sur ce chantier** : pas de paiement (choix assumé — la commande est une demande, le règlement se convient entre les parties) ; pas d'idempotence serveur sur un double envoi de commande ; `read_at` des messages jamais renseigné (pas d'accusé de lecture).

### 13. Session du 27/07 — Stratégie application mobile (décision) + bandeau PWA
Question posée : transformer le SaaS en app téléchargeable (PWA / Capacitor / Tauri).

**Décision : PWA maintenant, Capacitor reporté, Tauri abandonné.**
- **PWA** — `src/InstallAppBanner.jsx` (nouveau), monté dans `App.jsx`. Coût nul, aucune commission de store. ⚠️ Piège : `beforeinstallprompt` **n'existe pas sur Safari iOS** — un bandeau qui n'écouterait que cet événement ne s'afficherait jamais sur iPhone, précisément la cible des créateurs UGC. D'où le second chemin, avec instructions manuelles « Partager → Sur l'écran d'accueil ». Un refus met le bandeau en sommeil 21 jours (`va_install_dismissed_until`).
- **Tauri : abandonné.** Une agence sur Mac ouvre un navigateur ; le gain se limite à un raccourci dans le dock, contre une cible de build à signer et notarier. La PWA installable sur desktop couvre déjà ce besoin.
- **Capacitor : bon choix technique, mais prématuré.** À rouvrir quand ~30 créateurs publieront chaque semaine ET se plaindront de l'upload navigateur. Aujourd'hui le Marketplace n'a aucun créateur inscrit, la moitié des onglets sont sous « Bientôt disponible », et packager figerait la capacité à corriger en quinze minutes — celle qui a sauvé la journée du 27/07 sur la page blanche.

**Trois obstacles à traiter AVANT tout packaging Capacitor** (à ne pas découvrir en cours de route) :
1. **OAuth Google cassé** : `AuthContext.jsx` utilise `redirectTo: window.location.origin` ; sous Capacitor l'origine devient `capacitor://localhost`. Il faut le flux PKCE + deep links + schéma d'URL déclaré côté Supabase, iOS et Android.
2. **`VITE_API_URL` est inliné au build** : l'URL Railway serait figée dans le binaire installé. Un changement d'hébergeur imposerait une republication et une revue Apple, en laissant les utilisateurs installés cassés. À rendre configurable à distance avant de packager.
3. **Uploads vidéo** : limite actuelle 50 Mo, upload direct navigateur → Storage. Une vidéo d'iPhone fait 150 à 400 Mo. Il faudra compression client + upload reprenable.

**⚠️ Point commercial à trancher avant développement — commission Apple.**
L'achat de vidéos UGC entre marque et créateur est un service entre tiers : exempté d'achat intégré (comme Uber). Mais **l'abonnement SaaS à 49/99 € est du numérique consommé dans l'app** : Apple exigera l'IAP et sa commission. Parade classique (Netflix, Spotify) : l'app mobile ne vend rien, l'abonnement se souscrit sur le web. Conséquence directe : **pas de bouton « Améliorer » dans l'app iOS**, alors que tout l'entonnoir actuel est construit autour. À décider avant de coder, pas après un rejet de revue.

### 14. Session du 27/07 — Chantier #19 : facturation Stripe + DEUX FAILLES CRITIQUES

**🚨 FAILLE 1 — mot de passe propriétaire en clair dans le bundle front (CORRIGÉE)**
`src/contexts/AuthContext.jsx` contenait un bypass comparant l'email ET LE MOT DE PASSE en dur. Tout ce fichier part dans le bundle JavaScript public : **le mot de passe était lisible par quiconque ouvrait viralacq.vercel.app**, et donnait un accès admin + Elite complet sans authentification. Le bloc jumeau de `RoleContext.jsx` (`isLoggedIn && !userId` → admin/elite) a été retiré aussi.
→ **Ce mot de passe doit être considéré comme compromis et changé partout où Diaz l'utilise.** Il reste dans l'historique Git.
→ Règle : aucun secret, sous aucune forme, dans `src/`. Rien de ce qui est envoyé au navigateur n'est privé.

**🚨 FAILLE 2 — élévation de privilège par écriture directe (CORRIGÉE)**
`RoleContext.jsx` écrivait `profiles.plan` depuis le navigateur, et la policy `users_update_own` n'restreint pas les colonnes. N'importe qui pouvait exécuter dans la console :
`supabase.from("profiles").update({ plan: "elite", role: "admin" })` — plan à 299 €/mois et droits admin gratuits (`requireAdmin` fait autorité sur cette colonne).
→ Trigger `protect_profile_privileges` (`supabase/stripe_billing.sql`), **BEFORE INSERT OR UPDATE** : `plan` figé, `role` ne peut jamais devenir `admin` depuis le front. Le changement creator ↔ brand reste possible (sinon la fonctionnalité serait cassée en silence). Seule la clé service écrit ces colonnes.

**Facturation** — `stripeRoutes.js` (nouveau), `supabase/stripe_billing.sql` (nouveau), `stripe@^22.3.2` ajouté.
- Checkout hébergé Stripe, portail client (changement de formule, annulation, factures), webhook signé.
- ⚠️ **`registerStripeWebhook` DOIT rester monté AVANT `express.json()`** (server.js:65 vs 67) : la vérification de signature exige le corps brut. Monté après, toutes les signatures échouent avec un message peu explicite.
- Les ids de prix viennent de `STRIPE_PRICE_PLUS`, `STRIPE_PRICE_VIP_PRO`, `STRIPE_PRICE_VIP_ELITE` — jamais en dur : ils diffèrent entre test et production.

**Bloquants trouvés par la revue adversariale et corrigés :**
1. **La contrainte `profiles_plan_check` n'autorisait pas les plans vendus** (`plus`, `vip_pro`, `vip_elite`) : 100 % des paiements auraient échoué en base, silencieusement pour le client. Contrainte élargie, ainsi que `role` qui ignorait `brand` — rendant `requireBrand` inatteignable.
2. **Anti-rejeu inversé** : l'événement était journalisé AVANT traitement, donc un incident transitoire le perdait définitivement (paiement encaissé, plan jamais accordé). Le marqueur est maintenant posé APRÈS succès.
3. **`UPDATE` touchant 0 ligne loggé en succès** : supabase-js ne renvoie pas d'erreur dans ce cas. On lève désormais une exception → Stripe rejoue.
4. **Prix inconnu → client rétrogradé en `free` avec un log vert** : un abonnement actif dont le prix ne correspond à aucun `STRIPE_PRICE_*` lève maintenant une erreur explicite.
5. **Double souscription** : un abonné repassant par le paywall créait un second abonnement (double prélèvement), et l'annulation du premier le rétrogradait alors que le second courait. Renvoyé vers le portail.
6. **Retour de paiement muet** : le webhook arrive quelques secondes après le retour du client, qui voyait encore `free`. Sondage court avec message d'état.

**⏳ RESTE À TRAITER — non corrigé dans cette session :**
- ⚠️ `authMiddleware.js:58` promeut en admin quiconque présente un JWT avec l'un de trois emails en dur, alors que `supabase_schema.sql` demande de **désactiver la confirmation d'email** : une de ces adresses non encore inscrite permet à un tiers de s'inscrire avec et d'obtenir admin. À remplacer par un drapeau en base.
- `ALLOW_DEV_AUTH=true` accorde admin/elite sans token — aucun garde-fou n'empêche son activation en production.
- Policy `admins_read_all` (`supabase_schema.sql:48`) interroge `profiles` depuis une policy sur `profiles` : motif classique de récursion infinie (42P17), à vérifier sur la base réelle.
- Stripe exige un statut légal d'entreprise (exigence réglementaire européenne, identique chez PayPal et Revolut). Développement en mode test possible immédiatement ; passage en production après validation.

### 15. Session du 28/07 — Chantier #20 : vraies données dans Ressources & FAQ

**⚠️ Statistiques inventées retirées.** La page affichait quatre chiffres écrits en dur dans `ResourcesTab.jsx` : « +150k boutiques analysées », « 12M créatifs indexés », « 98,8 % de taux de sourcing » et surtout **« +320 % de ROAS moyen DE NOS CLIENTS »** — alors que la plateforme n'avait aucun client payant. Une allégation chiffrée invérifiable engage l'éditeur, a fortiori sur une page de vente et au moment de mettre en place l'encaissement. Remplacées par quatre compteurs réellement mesurés (`/api/resources/stats`, cache mémoire 10 min) : créateurs inscrits, vidéos UGC en vente, marques inscrites, extraits de formation du Coach. Chiffres modestes au début, mais vrais et croissants. Si l'API ne répond pas, **la section ne s'affiche pas** plutôt que d'inventer.

**Blog VIP et coaching** — `supabase/resources.sql` (nouveau, ⏳ À EXÉCUTER), `resourcesRoutes.js` (nouveau).
- `resource_articles` : titre, extrait, corps, palier minimum. Le serveur ne renvoie **jamais** le corps à qui n'a pas le palier — le masquer à l'affichage laisserait le texte lisible dans la réponse réseau.
- `coaching_sessions` : sessions live (date + lien visio) et replays. ⚠️ **Cette table n'a AUCUNE policy de lecture**, volontairement : elle contient les liens de visio. Une policy SELECT ouverte les exposerait via l'API REST avec la clé anon, rendant le coaching gratuit. Tout passe par le backend, qui retire `meetingUrl`/`replayUrl` pour les non-abonnés.
- `coaching_signups` : inscriptions, écriture directe autorisée (aucune règle métier, « la ligne m'appartient » suffit).
- Publication : routes admin `POST /api/resources/articles` et `/api/resources/coaching` (protégées par `requireAdmin`).

**⏳ Pas d'interface d'administration pour l'instant** : la publication se fait par `INSERT` SQL depuis Supabase, ou par appel direct aux routes admin. Une UI d'édition serait le prolongement naturel, mais elle n'a de sens qu'une fois qu'il y a du contenu à publier.

### ⚠️ RÈGLE DE VÉRIFICATION DES RAPPORTS (28/07/2026)
Un rapport de déploiement de Gemini a décrit des observations **entièrement inventées** : noms de champs inexistants (`creatorsCount` au lieu de `creators`), une route jamais créée (`/api/resources/sessions` au lieu de `/coaching`), des logs `📊 [Resources] Stats` alors que le fichier ne contient aucun `console.log`, et des colonnes absentes du schéma (intervenant, places, vues, likes). Les chiffres annoncés — 13 créateurs, 45 vidéos, 11 marques — étaient faux : la réalité mesurée était **0 créateur, 0 vidéo, 4 marques, 616 extraits de formation**.

**À appliquer systématiquement :**
- Ce que Gemini **exécute** est fiable et vérifiable (identifiants de commit, sorties de build).
- Ce qu'il **observe et résume** ne l'est pas. Exiger la **sortie brute** des commandes (`curl`, `railway logs`), jamais un paragraphe rédigé.
- Se méfier d'un rapport très détaillé et très favorable : c'est le signe le plus courant d'une fabrication.
- Vérification indépendante possible sans authentification :
  `curl https://viral-acq-backend-production.up.railway.app/api/resources/stats`

### ⏳ Reste à faire
1. Exécuter `knowledge_rls_patch.sql` (après vérif clé service_role) — voir ci-dessus.
2. Tester la persistance avec un vrai compte connecté (2-3 messages → F5 → la conversation revient).
3. Vérifier visuellement le streaming (texte qui s'écrit en direct) après redémarrage serveur + `npm run dev` + hard refresh (Ctrl+Shift+R).
4. Commit + push sur les deux dépôts GitHub (`acquisition-pro`, `viral-acq-backend`).
5. Avant commercialisation : activer la facturation Gemini (le free tier n'est pas viable pour des clients payants).
6. Le SaaS n'est PAS encore commercial — plusieurs sections (recherche produit...) renvoient des résultats factices.
