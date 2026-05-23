import { SiteConfig } from "../types/site";
import { Lang } from "./labels";

export function applySiteAdmin(config: SiteConfig, lang: Lang = "EN") {
  const { seo, features, media, analytics, advanced } = config.admin;

  const title =
    lang === "SI" ? seo.titleSi : lang === "BILINGUAL" ? seo.titleEn : seo.titleEn;
  const desc =
    lang === "SI" ? seo.descriptionSi : seo.descriptionEn;

  document.title = title || config.branding.siteNameEn;

  const setMeta = (name: string, content: string, prop = false) => {
    if (!content) return;
    const attr = prop ? "property" : "name";
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setMeta("description", desc);
  setMeta("keywords", seo.keywords);
  setMeta("og:title", title, true);
  setMeta("og:description", desc, true);
  if (seo.ogImageUrl) setMeta("og:image", seo.ogImageUrl, true);

  if (media.faviconUrl) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = media.faviconUrl;
  }

  let styleEl = document.getElementById("vc-custom-css") as HTMLStyleElement | null;
  if (advanced.customCss.trim()) {
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "vc-custom-css";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = advanced.customCss;
  } else if (styleEl) {
    styleEl.remove();
  }

  if (analytics.googleAnalyticsId && !document.getElementById("vc-ga")) {
    const s = document.createElement("script");
    s.id = "vc-ga";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`;
    document.head.appendChild(s);
    const inline = document.createElement("script");
    inline.id = "vc-ga-inline";
    inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analytics.googleAnalyticsId}');`;
    document.head.appendChild(inline);
  }
}

export function isMaintenanceForUser(
  config: SiteConfig,
  userRole?: string | null
): boolean {
  if (!config.admin.features.maintenanceMode) return false;
  return userRole !== "owner" && userRole !== "editor";
}
