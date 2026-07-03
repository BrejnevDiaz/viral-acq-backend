/* eslint-disable react-refresh/only-export-components -- config module, not a component file */
import {
  AdSpyIcon, ProductFinderIcon, ShopAnalyzerIcon, SourcingCRMIcon, VettingIAIcon,
  MatchmakingIcon, BriefcaseIcon, BrandPortalIcon, ContractGeneratorIcon, ResourcesIcon,
} from "./dashboardIcons";

// ─── Single source of truth for the dashboard nav tabs ───────────────────────
// group: "research" → Research & Discovery submenu ; "tools" → flat nav buttons.
// label: full nav label (sidebar + mobile dropdown) ; shortLabel: mobile trigger.
export const TABS = [
  { id: "adspy",             group: "research", Icon: AdSpyIcon,             label: "Creative AdSpy",     shortLabel: "AdSpy" },
  { id: "productfinder",     group: "research", Icon: ProductFinderIcon,     label: "Product Finder",     shortLabel: "Product Finder" },
  { id: "shopanalyzer",      group: "research", Icon: ShopAnalyzerIcon,      label: "Shop Analyzer",      shortLabel: "Shop Analyzer" },
  { id: "acquisition",       group: "tools",    Icon: SourcingCRMIcon,       label: "Sourcing CRM",       shortLabel: "Sourcing" },
  { id: "vetting",           group: "tools",    Icon: VettingIAIcon,         label: "Vetting IA",         shortLabel: "Vetting IA" },
  { id: "matchmaking",       group: "tools",    Icon: MatchmakingIcon,       label: "Matchmaking",        shortLabel: "Matchmaking" },
  { id: "talentagency",      group: "tools",    Icon: BriefcaseIcon,         label: "Talents & Gigs",     shortLabel: "Talents & Gigs" },
  { id: "brandportal",       group: "tools",    Icon: BrandPortalIcon,       label: "Contacte l'Agence",  shortLabel: "Marques" },
  { id: "contractgenerator", group: "tools",    Icon: ContractGeneratorIcon, label: "Générateur Contrats", shortLabel: "Contrats" },
  { id: "resources",         group: "tools",    Icon: ResourcesIcon,         label: "Ressources & FAQ",   shortLabel: "Resources" },
];

export default TABS;
