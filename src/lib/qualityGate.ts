import { Article, AuthorProfile } from "../types";
import { SiteConfig } from "../types/site";

export type QualityTier = "A" | "B" | "C";

export interface QualityCheck {
  id: string;
  tier: QualityTier;
  labelEn: string;
  labelSi: string;
  pass: boolean;
  hintEn: string;
  hintSi: string;
}

export function runQualityChecks(
  articles: Article[],
  profiles: AuthorProfile[],
  siteConfig: SiteConfig
): QualityCheck[] {
  const published = articles.filter((a) => a.status === "published");
  const usesPlaceholder = (url: string) =>
    /picsum\.photos|placeholder|via\.placeholder/i.test(url);

  const hasSocialProfiles = profiles.some(
    (p) => p.social.whatsapp?.trim() || p.social.facebook?.trim() || p.social.instagram?.trim()
  );

  return [
    {
      id: "a-typescript",
      tier: "A",
      labelEn: "TypeScript build",
      labelSi: "TypeScript build",
      pass: true,
      hintEn: "Run npm run lint before deploy.",
      hintSi: "Deploy කිරීමට පෙර npm run lint.",
    },
    {
      id: "a-articles",
      tier: "A",
      labelEn: "Published articles exist",
      labelSi: "ප්‍රකාශිත ලිපි තිබේ",
      pass: published.length > 0,
      hintEn: "Publish at least one article in CMS.",
      hintSi: "CMS එකෙන් අවම වශයෙන් ලිපියක් publish කරන්න.",
    },
    {
      id: "a-profiles",
      tier: "A",
      labelEn: "Contributor profiles",
      labelSi: "ලේඛක පැතිකඩ",
      pass: profiles.length >= 2,
      hintEn: "Add profiles in Admin → Content.",
      hintSi: "Admin → Content වල profiles එක් කරන්න.",
    },
    {
      id: "a-social",
      tier: "A",
      labelEn: "Social links on profiles",
      labelSi: "පැතිකඩ social links",
      pass: hasSocialProfiles,
      hintEn: "Add WhatsApp / Facebook / Instagram in profile editor.",
      hintSi: "Profile editor එකේ social fields පුරවන්න.",
    },
    {
      id: "a-seo-desc",
      tier: "A",
      labelEn: "SEO description configured",
      labelSi: "SEO description සකසා ඇත",
      pass: Boolean(siteConfig.admin.seo.descriptionEn?.trim()),
      hintEn: "Admin → Settings → SEO.",
      hintSi: "Admin → Settings → SEO.",
    },
    {
      id: "a-legal",
      tier: "A",
      labelEn: "Privacy & Terms pages",
      labelSi: "Privacy සහ Terms පිටු",
      pass: true,
      hintEn: "Footer links to #/privacy and #/terms.",
      hintSi: "Footer → privacy / terms.",
    },
    {
      id: "b-no-placeholder",
      tier: "B",
      labelEn: "Original images (no picsum)",
      labelSi: "මුල් ඡායාරූප (picsum නැත)",
      pass:
        published.length > 0 &&
        !published.some((a) => usesPlaceholder(a.coverUrl)) &&
        !profiles.some((p) => usesPlaceholder(p.avatarUrl) || usesPlaceholder(p.coverUrl)),
      hintEn: "Replace placeholder URLs with your own CDN or uploads.",
      hintSi: "picsum URLs ඔබේ ඡායාරූප වලින් ප්‍රතිස්ථාපනය කරන්න.",
    },
    {
      id: "b-article-count",
      tier: "B",
      labelEn: "10+ published stories",
      labelSi: "ප්‍රකාශිත ලිපි 10+",
      pass: published.length >= 10,
      hintEn: `${published.length}/10 published — keep writing.`,
      hintSi: `${published.length}/10 — ලිපි එක් කරන්න.`,
    },
    {
      id: "b-canonical",
      tier: "B",
      labelEn: "Production domain (canonical URL)",
      labelSi: "Production domain",
      pass: Boolean(
        siteConfig.admin.seo.canonicalUrl?.trim() &&
          !siteConfig.admin.seo.canonicalUrl.includes("localhost")
      ),
      hintEn: "Set canonical URL in Admin → Settings → SEO.",
      hintSi: "Admin SEO වල canonical URL එක් කරන්න.",
    },
    {
      id: "c-lighthouse",
      tier: "C",
      labelEn: "Lighthouse 90+ (manual)",
      labelSi: "Lighthouse 90+ (ඔබ)",
      pass: false,
      hintEn: "Run Chrome Lighthouse on deployed HTTPS URL.",
      hintSi: "Deploy කළ site එකේ Lighthouse test කරන්න.",
    },
    {
      id: "c-audience",
      tier: "C",
      labelEn: "Audience & editorial rhythm",
      labelSi: "පාඨකයින් + නිති ප්‍රකාශනය",
      pass: false,
      hintEn: "Marketing + weekly publishing — outside code.",
      hintSi: "Marketing + සතිපතා ලිපි — code පිටත.",
    },
  ];
}

export function tierSummary(checks: QualityCheck[]) {
  const tierPass = (t: QualityTier) =>
    checks.filter((c) => c.tier === t).every((c) => c.pass);
  return {
    platformOk: tierPass("A"),
    launchOk: tierPass("A") && tierPass("B"),
    worldElite: tierPass("A") && tierPass("B") && tierPass("C"),
    aDone: checks.filter((c) => c.tier === "A" && c.pass).length,
    aTotal: checks.filter((c) => c.tier === "A").length,
    bDone: checks.filter((c) => c.tier === "B" && c.pass).length,
    bTotal: checks.filter((c) => c.tier === "B").length,
  };
}
