import type { SiteAdminSettings } from "./adminSettings";
import { DEFAULT_ADMIN_SETTINGS } from "./adminSettings";
import type { CustomPage, SiteTypography } from "./pageBuilder";
import { DEFAULT_TYPOGRAPHY } from "./pageBuilder";

export type { SiteAdminSettings };

export type HeroBackground =
  | "cybergrid"
  | "aurora"
  | "mesh"
  | "gradient"
  | "minimal"
  | "particles";

export interface SiteTheme {
  accent: string;
  accentSoft: string;
  accentAlt: string;
  paper: string;
  paperDark: string;
  ink: string;
  neon: string;
  grid: string;
  glow: string;
  fontDisplay: string;
}

export interface SiteEffects {
  scanlines: boolean;
  gridOverlay: boolean;
  neonGlow: boolean;
  reducedMotion: boolean;
}

export interface SiteBranding {
  siteNameEn: string;
  siteNameSi: string;
  taglineEn: string;
  taglineSi: string;
}

export interface SiteHero {
  badgeEn: string;
  badgeSi: string;
  headlineEn: string;
  headlineSi: string;
  subheadEn: string;
  subheadSi: string;
  showSearch: boolean;
  backgroundStyle: HeroBackground;
}

export interface SiteHomeSections {
  showStats: boolean;
  showContinueReading: boolean;
  showBookmarks: boolean;
  showIssuesSidebar: boolean;
  showAnnouncement: boolean;
  order: string[];
}

export interface SiteAnnouncement {
  enabled: boolean;
  messageEn: string;
  messageSi: string;
  link: string;
}

export interface SiteFooter {
  textEn: string;
  textSi: string;
}

export interface SiteNavItem {
  id: string;
  page: string;
  labelEn: string;
  labelSi: string;
  visible: boolean;
}

export interface SiteAbout {
  titleEn: string;
  titleSi: string;
  bodyEn: string;
  bodySi: string;
}

export interface SiteConfig {
  version: number;
  updatedAt: string;
  themePreset: string;
  branding: SiteBranding;
  theme: SiteTheme;
  typography: SiteTypography;
  effects: SiteEffects;
  hero: SiteHero;
  homeSections: SiteHomeSections;
  announcement: SiteAnnouncement;
  footer: SiteFooter;
  navItems: SiteNavItem[];
  about: SiteAbout;
  customPages: CustomPage[];
  admin: SiteAdminSettings;
}

export { DEFAULT_ADMIN_SETTINGS };

/** World-class editorial palette (Apple / Linear inspired) */
export const PREMIUM_DEFAULT_THEME: SiteTheme = {
  accent: "#0077ed",
  accentSoft: "#5ac8fa",
  accentAlt: "#30d158",
  paper: "#fbfbfd",
  paperDark: "#000000",
  ink: "#1d1d1f",
  neon: "#0077ed",
  grid: "rgba(0, 0, 0, 0.04)",
  glow: "rgba(0, 119, 237, 0.25)",
  fontDisplay: "Instrument Serif",
};

export const SCIFI_DEFAULT_THEME: SiteTheme = {
  accent: "#00f0ff",
  accentSoft: "#bf00ff",
  accentAlt: "#39ff14",
  paper: "#0b1020",
  paperDark: "#030508",
  ink: "#e8f7ff",
  neon: "#00f0ff",
  grid: "rgba(0, 240, 255, 0.08)",
  glow: "rgba(0, 240, 255, 0.45)",
  fontDisplay: "Orbitron",
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  version: 5,
  updatedAt: new Date().toISOString(),
  themePreset: "editorial-blue",
  branding: {
    siteNameEn: "Vidya Chinthana",
    siteNameSi: "විද්‍යා චින්තන",
    taglineEn: "Premium Science Magazine",
    taglineSi: "විශේෂාංග විද්‍යා සඟරාව",
  },
  theme: PREMIUM_DEFAULT_THEME,
  typography: DEFAULT_TYPOGRAPHY,
  effects: {
    scanlines: false,
    gridOverlay: false,
    neonGlow: false,
    reducedMotion: false,
  },
  hero: {
    badgeEn: "Issue 01 — Now Reading",
    badgeSi: "කලාප 01 — දැන් කියවන්න",
    headlineEn: "Science, beautifully told.",
    headlineSi: "විද්‍යාව, අලංකාර ලෙස කියවීමට.",
    subheadEn:
      "A world-class bilingual digital magazine for Sri Lanka — rigorous reporting, immersive reading, and editorial craft.",
    subheadSi:
      "ශ්‍රී ලංකාව සඳහා ලෝක මට්ටමේ ද්විභාෂා ඩිජිටල් සඟරාව — නිරවුලු වාර්තා, ගැඹුරු කියවීම්, සංස්කාරක ශිල්පය.",
    showSearch: true,
    backgroundStyle: "mesh",
  },
  homeSections: {
    showStats: true,
    showContinueReading: true,
    showBookmarks: true,
    showIssuesSidebar: true,
    showAnnouncement: true,
    order: ["announcement", "hero", "stats", "continue", "bookmarks", "issues", "articles"],
  },
  announcement: {
    enabled: true,
    messageEn: "New issue online — quantum foundations & CRISPR horizons",
    messageSi: "නව කලාපය — ක්වොන්ටම් පදනම සහ CRISPR දිගුව",
    link: "",
  },
  footer: {
    textEn: "Crafted for curious minds across Sri Lanka and the world.",
    textSi: "ශ්‍රී ලංකාව සහ ලෝකය පුරා උනන්දු මනස් සඳහා නිර්මාණය කළ.",
  },
  navItems: [
    { id: "n1", page: "home", labelEn: "Home", labelSi: "මුල් පිටුව", visible: true },
    { id: "n2", page: "issues", labelEn: "Issues", labelSi: "කලාප", visible: true },
    { id: "n3", page: "articles", labelEn: "Articles", labelSi: "ලිපි", visible: true },
    { id: "n4", page: "authors", labelEn: "Authors", labelSi: "ලේඛකයින්", visible: true },
    { id: "n5", page: "about", labelEn: "About", labelSi: "අප ගැන", visible: true },
  ],
  customPages: [],
  about: {
    titleEn: "Our mission",
    titleSi: "අපේ මෙහෙවර",
    bodyEn:
      "Vidya Chinthana brings editorial excellence to science communication in English and Sinhala — a reading experience designed to rival the world's finest digital publications.",
    bodySi:
      "විද්‍යා චින්තන ඉංග්‍රීසි සහ සිංහලෙන් විද්‍යා සන්නිවේදනයට සංස්කාරක ගුණාත්මකභාවය ගෙන එයි — ලෝකේ හොඳම ඩිජිටල් ප්‍රකාශනවලට සමාන කියවීම් අත්දැකීමක්.",
  },
  admin: DEFAULT_ADMIN_SETTINGS,
};
