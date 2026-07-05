# DESIGN SYSTEM : Acquisition Pro (by Viral Acquisition)

Ce document centralise la direction artistique et les composants UI du SaaS "Acquisition Pro". **Toute refactorisation ou création de nouveau composant doit se référer strictement à ces guidelines pour garantir la cohérence visuelle.**

## 1. Typographie (Fonts)

Nous utilisons une typographie moderne, clean et "Tech/SaaS" :
- **Police principale (Titres & UI)** : \`Outfit\`, sans-serif (Google Fonts).
- **Police secondaire (Paragraphes & Data)** : \`Inter\`, sans-serif (Google Fonts).
- **Police Monospace (Code & Badges)** : \`JetBrains Mono\` ou system monospace.

*Import CSS (dans \`index.css\`) :*
\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;700;800;900&display=swap');
\`\`\`

## 2. Palette de Couleurs (Variables)

Le Dashboard (post-login) reste **Sombre (Dark Mode) et Premium** par défaut à l'origine, mais démarre désormais en **thème clair** par défaut (basculable par l'utilisateur via le menu profil de la Sidebar — voir DARK/LIGHT dans \`App.jsx\`). La home page publique (avant login : \`LandingPage.jsx\`, \`BlogPage.jsx\`, \`FooterInfoPage.jsx\`) est en **thème clair sophistiqué** défini dans \`src/landingTheme.js\` (objet \`L\`), avec le Footer et les mockups produit (captures d'écran du Dashboard) volontairement laissés en sombre — comme des screenshots d'app encadrés sur une page claire (pattern Stripe/Linear).

**Dashboard — palette sombre (DARK, App.jsx) :**
- **Background Principal** : \`#09090b\` (Zinc 950)
- **Background Secondaire (Cards/Surfaces)** : \`#18181B\` (Zinc 900)
- **Bordures (Subtiles)** : \`rgba(255, 255, 255, 0.1)\`
- **Texte Principal** : \`#ffffff\` (Blanc)
- **Texte Secondaire (Muted)** : \`#A1A1AA\` (Zinc 400)
- **Texte Tertiaire / Labels** : \`#71717A\` (Zinc 500)

**Dashboard — palette claire (LIGHT, App.jsx, thème par défaut) :**
- **Background Principal** : \`#f3f4f6\` — **Cards/Surfaces** : \`#ffffff\`
- **Texte Principal** : \`#1f2937\` — **Texte Muted** : \`#4b5563\` — **Texte Dim** : \`#9ca3af\`

**Home page publique — palette claire (\`L\`, landingTheme.js) :**
- **Background** : \`#FAFAF8\` — **Surface (cards)** : \`#FFFFFF\`
- **Texte Principal** : \`#18181B\` — **Texte Muted** : \`#52525B\` — **Texte Dim** : \`#71717A\`
- **Bordures** : \`rgba(0,0,0,0.09)\`

**Couleurs d'Accents (Gradients & Boutons) :**
- **Primary Gradient (Violet vers Rose)** : \`linear-gradient(90deg, #8B5CF6, #EC4899)\` ou \`linear-gradient(90deg, #8B5CF6, #F43F5E, #F97316)\`
- **Primary Solid** : \`#8B5CF6\` (Violet)
- **Secondary / Success (Métriques, ROI, Viral Score)** : \`#10B981\` (Emerald) avec fond léger \`rgba(16, 185, 129, 0.1)\`
- **Warning / Alert** : \`#F59E0B\` (Amber)
- **Danger / Error** : \`#EF4444\` (Red)

## 3. Patterns Visuels & UI (Glassmorphism & Glow)

L'UI doit paraître "Vibrante" avec des effets de lumière et de profondeur. Ne pas utiliser de couleurs plates pour les éléments mis en avant.

### A. Effet "Glassmorphism" (Panneaux & Modales)
\`\`\`css
/* Tailwind equivalent: backdrop-blur-xl bg-white/5 border border-white/10 */
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px; /* ou 24px pour les grosses modales */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
\`\`\`

### B. Background Glow (Lumière d'ambiance)
Pour mettre en valeur une section (ex: Pricing, Hero, Modale), ajouter des "blobs" de couleur floutés en arrière-plan (position absolue, \`z-index: 0\`).
\`\`\`css
background: radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, transparent 60%);
\`\`\`

### C. Boutons CTA (Call To Action) Principaux
\`\`\`css
background: linear-gradient(90deg, #8B5CF6, #EC4899);
color: #fff;
border: none;
border-radius: 8px; /* ou 12px */
padding: 14px 28px;
font-weight: 800; /* Outfit */
cursor: pointer;
transition: all 0.2s ease;
\`\`\`
*(Hover Effect)* : Légère translation et augmentation du glow :
\`\`\`css
transform: translateY(-2px);
box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
\`\`\`

## 4. Ordre d'attaque (Stratégie de Refactoring Claude Code)

Pour refactoriser \`App.jsx\` de manière sécurisée (il fait plus de 3000 lignes), Claude doit suivre cet ordre d'extraction progressif :

1. **PHASE 1 : Séparation de la Landing Page (Low Risk)**
   - Extraire \`Navbar\`, \`HeroSection\`, \`FeaturesGrid\`, \`CreatorSection\`, \`AgencySection\`, \`FAQ\`, \`Footer\`.
   - Extraire \`PricingModal\` et \`LoginModal\` (avec la logique \`signupRole\`).
   - Tester le rendu.

2. **PHASE 2 : Layout du Dashboard & Composants Partagés (Medium Risk)**
   - Extraire \`Sidebar\` et \`MobileNav\`.
   - Créer un layout principal \`DashboardLayout\` qui gère le \`currentTab\` et les "Lock Screens" (Feature Gating selon le \`userRole\`).

3. **PHASE 3 : Extraction des Onglets "Métier" (High Risk)**
   - Extraire un par un les onglets complexes dans des fichiers dédiés :
     - \`MatchmakingTab.jsx\` (Déjà partiellement séparé)
     - \`ShopAnalyzerTab.jsx\` (Déjà partiellement séparé - Attention à la logique Marketing Angle)
     - \`AdSpyTab.jsx\`
     - \`CRMTab.jsx\` / \`TalentAgencyTab.jsx\` (Espace Créateur)
   - S'assurer que le passage des props (états globaux) est propre.

4. **PHASE 4 : State Management**
   - Remplacer les dizaines de \`useState\` globaux dans \`App.jsx\` par un ou plusieurs Contextes React (\`AuthContext\`, \`FilterContext\`) ou un store (Zustand) pour nettoyer le passage de props.
