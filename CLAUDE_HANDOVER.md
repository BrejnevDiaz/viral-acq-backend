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

- **Backgrounds** : Sombre (Zinc 950 : `#09090b` et Zinc 900 : `#18181B`).
- **Glassmorphism** : Effets de transparence sur les cartes et modales (`background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1);`).
- **Gradients de Marque (CTA)** : `linear-gradient(90deg, #8B5CF6, #EC4899)`.
- **Textes** : `#ffffff` (Principal) et `#A1A1AA` (Secondaire).
- **Polices** : `Outfit` (Titres) et `Inter` (Corps de texte).
- **Micro-interactions** : Hover avec translation légère vers le haut (`translateY(-2px)`) et augmentation du glow box-shadow.
