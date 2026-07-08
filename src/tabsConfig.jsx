/* eslint-disable react-refresh/only-export-components -- config module, not a component file */
import {
  AdSpyIcon, ProductFinderIcon, ShopAnalyzerIcon, SourcingCRMIcon, VettingIAIcon,
  MatchmakingIcon, BriefcaseIcon, BrandPortalIcon, ContractGeneratorIcon, ResourcesIcon,
  VideoMarketplaceIcon, TrophyIcon, BrainIcon,
} from "./dashboardIcons";

// ─── Single source of truth for the dashboard nav tabs ───────────────────────
// group: "research" → Research & Discovery submenu ; "tools" → flat nav buttons.
// label: full nav label (sidebar + mobile dropdown) ; shortLabel: mobile trigger.
// Both are { fr, en, it } dictionaries — use tab.label[uiLang] / tab.shortLabel[uiLang].
export const TABS = [
  { id: "adspy",             group: "research", Icon: AdSpyIcon,
    label: { fr: "Creative AdSpy", en: "Creative AdSpy", it: "Creative AdSpy" },
    shortLabel: { fr: "AdSpy", en: "AdSpy", it: "AdSpy" } },
  { id: "productfinder",     group: "research", Icon: ProductFinderIcon,
    label: { fr: "Product Finder", en: "Product Finder", it: "Product Finder" },
    shortLabel: { fr: "Product Finder", en: "Product Finder", it: "Product Finder" } },
  { id: "shopanalyzer",      group: "research", Icon: ShopAnalyzerIcon,
    label: { fr: "Shop Analyzer", en: "Shop Analyzer", it: "Shop Analyzer" },
    shortLabel: { fr: "Shop Analyzer", en: "Shop Analyzer", it: "Shop Analyzer" } },
  { id: "creatorscore",      group: "tools",    Icon: TrophyIcon,
    label: { fr: "Creator Score", en: "Creator Score", it: "Creator Score" },
    shortLabel: { fr: "Score", en: "Score", it: "Score" } },
  { id: "acquisition",       group: "tools",    Icon: SourcingCRMIcon,
    label: { fr: "Sourcing CRM", en: "Sourcing CRM", it: "Sourcing CRM" },
    shortLabel: { fr: "Sourcing", en: "Sourcing", it: "Sourcing" } },
  { id: "vetting",           group: "tools",    Icon: VettingIAIcon,
    label: { fr: "Vetting IA", en: "AI Vetting", it: "Vetting IA" },
    shortLabel: { fr: "Vetting IA", en: "AI Vetting", it: "Vetting IA" } },
  { id: "matchmaking",       group: "tools",    Icon: MatchmakingIcon,
    label: { fr: "Matchmaking", en: "Matchmaking", it: "Matchmaking" },
    shortLabel: { fr: "Matchmaking", en: "Matchmaking", it: "Matchmaking" } },
  { id: "videomarketplace",  group: "tools",    Icon: VideoMarketplaceIcon,
    label: { fr: "Marketplace Vidéo", en: "Video Marketplace", it: "Marketplace Video" },
    shortLabel: { fr: "Vidéos", en: "Videos", it: "Video" } },
  { id: "talentagency",      group: "tools",    Icon: BriefcaseIcon,
    label: { fr: "Talents & Gigs", en: "Talents & Gigs", it: "Talent & Gigs" },
    shortLabel: { fr: "Talents & Gigs", en: "Talents & Gigs", it: "Talent & Gigs" } },
  { id: "brandportal",       group: "tools",    Icon: BrandPortalIcon,
    label: { fr: "Contacte l'Agence", en: "Contact the Agency", it: "Contatta l'Agenzia" },
    shortLabel: { fr: "Marques", en: "Brands", it: "Brand" } },
  { id: "contractgenerator", group: "tools",    Icon: ContractGeneratorIcon,
    label: { fr: "Générateur Contrats", en: "Contract Generator", it: "Generatore Contratti" },
    shortLabel: { fr: "Contrats", en: "Contracts", it: "Contratti" } },
  { id: "resources",         group: "tools",    Icon: ResourcesIcon,
    label: { fr: "Ressources & FAQ", en: "Resources & FAQ", it: "Risorse & FAQ" },
    shortLabel: { fr: "Resources", en: "Resources", it: "Risorse" } },
  // adminOnly : filtré dans Sidebar + rendu gated dans App.jsx (role admin).
  { id: "knowledge",          group: "tools",    Icon: BrainIcon, adminOnly: true,
    label: { fr: "Connaissances IA", en: "AI Knowledge", it: "Conoscenze IA" },
    shortLabel: { fr: "Savoir IA", en: "AI Knowledge", it: "Sapere IA" } },
];

export default TABS;
