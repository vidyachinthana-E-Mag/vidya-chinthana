import { DEFAULT_ADMIN_SETTINGS } from "../types/adminSettings";
import { SiteConfig, DEFAULT_SITE_CONFIG } from "../types/site";

/** Deep-merge saved site.json with defaults (handles older configs). */
export function mergeSiteConfig(raw: Partial<SiteConfig> | null | undefined): SiteConfig {
  const base = structuredClone(DEFAULT_SITE_CONFIG);
  if (!raw || typeof raw !== "object") return base;

  const merged = {
    ...base,
    ...raw,
    theme: { ...base.theme, ...raw.theme },
    typography: { ...base.typography, ...raw.typography },
    effects: { ...base.effects, ...raw.effects },
    branding: { ...base.branding, ...raw.branding },
    hero: { ...base.hero, ...raw.hero },
    homeSections: {
      ...base.homeSections,
      ...raw.homeSections,
      order: raw.homeSections?.order?.length ? raw.homeSections.order : base.homeSections.order,
    },
    announcement: { ...base.announcement, ...raw.announcement },
    footer: { ...base.footer, ...raw.footer },
    about: { ...base.about, ...raw.about },
    navItems: raw.navItems?.length ? raw.navItems : base.navItems,
    customPages: raw.customPages?.length ? raw.customPages : base.customPages,
    admin: {
      ...DEFAULT_ADMIN_SETTINGS,
      ...raw.admin,
      seo: { ...DEFAULT_ADMIN_SETTINGS.seo, ...raw.admin?.seo },
      features: { ...DEFAULT_ADMIN_SETTINGS.features, ...raw.admin?.features },
      media: { ...DEFAULT_ADMIN_SETTINGS.media, ...raw.admin?.media },
      social: { ...DEFAULT_ADMIN_SETTINGS.social, ...raw.admin?.social },
      reader: { ...DEFAULT_ADMIN_SETTINGS.reader, ...raw.admin?.reader },
      analytics: { ...DEFAULT_ADMIN_SETTINGS.analytics, ...raw.admin?.analytics },
      advanced: { ...DEFAULT_ADMIN_SETTINGS.advanced, ...raw.admin?.advanced },
    },
  };

  if ((raw.version ?? 1) < 5) {
    merged.version = 5;
    merged.typography = { ...base.typography, ...raw.typography };
    merged.customPages = raw.customPages ?? base.customPages;
  }

  if ((raw.version ?? 1) < 4 && !raw.admin) {
    merged.version = Math.max(merged.version, 4);
    merged.admin = DEFAULT_ADMIN_SETTINGS;
  }

  if ((raw.version ?? 1) < 3) {
    merged.version = 3;
    merged.effects = { ...base.effects, ...raw.effects, scanlines: false, gridOverlay: false, neonGlow: false };
    if (!raw.themePreset || raw.themePreset === "quantum-cyan") {
      merged.theme = { ...base.theme, ...raw.theme };
      merged.themePreset = "editorial-blue";
    }
  }

  return merged;
}
