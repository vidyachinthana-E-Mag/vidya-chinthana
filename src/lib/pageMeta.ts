import { Article, AuthorProfile } from "../types";
import { Lang, t } from "./labels";
import { SiteConfig } from "../types/site";

const SITE_NAME = "Vidya Chinthana";

export function siteOrigin(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function hashUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${window.location.pathname}#${clean}`;
}

export function absoluteImage(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${siteOrigin()}${url.startsWith("/") ? url : `/${url}`}`;
}

export function buildWebSiteJsonLd(config: SiteConfig, lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t(lang, config.branding.siteNameEn, config.branding.siteNameSi),
    description: t(lang, config.admin.seo.descriptionEn, config.admin.seo.descriptionSi),
    url: hashUrl("/home"),
    inLanguage: ["en", "si"],
    publisher: buildOrganizationJsonLd(config, lang),
  };
}

export function buildOrganizationJsonLd(config: SiteConfig, lang: Lang) {
  const logo = absoluteImage(config.admin.media.faviconUrl || "/icon.svg");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t(lang, config.branding.siteNameEn, config.branding.siteNameSi),
    url: siteOrigin(),
    logo,
    description: t(lang, config.admin.seo.descriptionEn, config.admin.seo.descriptionSi),
  };
}

export function buildArticleJsonLd(article: Article, lang: Lang) {
  const title = t(lang, article.titleEn, article.titleSi);
  const desc = t(lang, article.summaryEn, article.summarySi);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: desc,
    image: absoluteImage(article.coverUrl),
    author: { "@type": "Person", name: article.authorName },
    datePublished: article.publishedAt,
    timeRequired: `PT${article.readingTimeMin}M`,
    url: hashUrl(`/read/${article.id}`),
    inLanguage: lang === "SI" ? "si" : "en",
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function buildProfileJsonLd(profile: AuthorProfile, lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: t(lang, profile.nameEn, profile.nameSi),
      description: t(lang, profile.bioEn, profile.bioSi),
      image: absoluteImage(profile.avatarUrl),
      url: hashUrl(`/profile/${profile.slug}`),
    },
  };
}
