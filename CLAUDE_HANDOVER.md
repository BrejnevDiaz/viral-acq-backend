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

### ⏳ Reste à faire
1. Exécuter `knowledge_rls_patch.sql` (après vérif clé service_role) — voir ci-dessus.
2. Tester la persistance avec un vrai compte connecté (2-3 messages → F5 → la conversation revient).
3. Vérifier visuellement le streaming (texte qui s'écrit en direct) après redémarrage serveur + `npm run dev` + hard refresh (Ctrl+Shift+R).
4. Commit + push sur les deux dépôts GitHub (`acquisition-pro`, `viral-acq-backend`).
5. Avant commercialisation : activer la facturation Gemini (le free tier n'est pas viable pour des clients payants).
6. Le SaaS n'est PAS encore commercial — plusieurs sections (recherche produit...) renvoient des résultats factices.
