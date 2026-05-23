export interface SiteSeoSettings {
  titleEn: string;
  titleSi: string;
  descriptionEn: string;
  descriptionSi: string;
  keywords: string;
  ogImageUrl: string;
  canonicalUrl: string;
}

export interface SiteFeatureSettings {
  maintenanceMode: boolean;
  maintenanceMessageEn: string;
  maintenanceMessageSi: string;
  allowRegistration: boolean;
  defaultLanguage: "EN" | "SI" | "BILINGUAL";
  lockTheme: "light" | "dark" | null;
  showPlatformStats: boolean;
  enableReaderComments: boolean;
  enableBookmarks: boolean;
}

export interface SiteMediaSettings {
  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;
}

export interface SiteSocialSettings {
  contactEmail: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface SiteReaderSettings {
  defaultView: "scroll" | "flip";
  defaultFontScale: number;
  showReadingTime: boolean;
  enableGlossary: boolean;
}

export interface SiteAnalyticsSettings {
  googleAnalyticsId: string;
  plausibleDomain: string;
}

export interface SiteAdvancedSettings {
  customCss: string;
  announcementDismissible: boolean;
  navSticky: boolean;
}

export interface SiteAdminSettings {
  seo: SiteSeoSettings;
  features: SiteFeatureSettings;
  media: SiteMediaSettings;
  social: SiteSocialSettings;
  reader: SiteReaderSettings;
  analytics: SiteAnalyticsSettings;
  advanced: SiteAdvancedSettings;
}

export const DEFAULT_ADMIN_SETTINGS: SiteAdminSettings = {
  seo: {
    titleEn: "Vidya Chinthana | Premium Science Magazine",
    titleSi: "විද්‍යා චින්තන | විශේෂාංග විද්‍යා සඟරාව",
    descriptionEn:
      "Bilingual digital science magazine for Sri Lanka — articles, issues, and immersive reading in English and Sinhala.",
    descriptionSi:
      "ශ්‍රී ලංකාව සඳහා ද්විභාෂා ඩිජිටල් විද්‍යා සඟරාව — ඉංග්‍රීසි සහ සිංහල ලිපි.",
    keywords: "science, sri lanka, sinhala, magazine, education, technology",
    ogImageUrl: "/icon.svg",
    canonicalUrl: "",
  },
  features: {
    maintenanceMode: false,
    maintenanceMessageEn: "We are upgrading the experience. Back shortly.",
    maintenanceMessageSi: "අපි අත්දැකීම වැඩිදියුණු කරමින් සිටිමු. ඉක්මනින් නැවත.",
    allowRegistration: true,
    defaultLanguage: "BILINGUAL",
    lockTheme: null,
    showPlatformStats: true,
    enableReaderComments: true,
    enableBookmarks: true,
  },
  media: {
    logoUrl: "",
    faviconUrl: "/icon.svg",
    heroImageUrl: "",
  },
  social: {
    contactEmail: "hello@vidyachinthana.lk",
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
  },
  reader: {
    defaultView: "scroll",
    defaultFontScale: 100,
    showReadingTime: true,
    enableGlossary: true,
  },
  analytics: {
    googleAnalyticsId: "",
    plausibleDomain: "",
  },
  advanced: {
    customCss: "",
    announcementDismissible: true,
    navSticky: true,
  },
};
