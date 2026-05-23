import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import { usePageMeta } from "../hooks/usePageMeta";
import { buildOrganizationJsonLd } from "../lib/pageMeta";
import PageContainer from "../components/ui/PageContainer";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/motion/Reveal";
import { BookOpen, Globe, Layout, Sparkles } from "lucide-react";

export default function AboutPage() {
  const { lang, siteConfig: sc } = useApp();

  const aboutMeta = useMemo(
    () => ({
      title: t(lang, "About", "අප ගැන"),
      description: t(lang, sc.about.bodyEn, sc.about.bodySi),
      path: "/about",
      jsonLd: buildOrganizationJsonLd(sc, lang),
    }),
    [lang, sc]
  );
  usePageMeta(aboutMeta);

  const features = [
    { icon: BookOpen, en: "Magazine-grade reading", si: "සඟරා මට්ටමේ කියවීම" },
    { icon: Globe, en: "Bilingual publishing", si: "ද්විභාෂා ප්‍රකාශනය" },
    { icon: Layout, en: "Editorial CMS", si: "සංස්කාරක CMS" },
    { icon: Sparkles, en: "Visual Site Studio", si: "දෘශ්‍ය Site Studio" },
  ];

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14 max-w-4xl">
        <PageHero
          eyebrow={t(lang, "About", "අප ගැන")}
          title={t(lang, sc.about.titleEn, sc.about.titleSi)}
          subtitle={t(lang, sc.about.bodyEn, sc.about.bodySi)}
        />
        <Reveal delay={0.1}>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, en, si }) => (
              <div key={en} className="premium-card p-6 sm:p-8">
                <Icon className="w-5 h-5 mb-4" style={{ color: "var(--vc-accent)" }} />
                <h3 className="font-display text-lg font-medium">{t(lang, en, si)}</h3>
              </div>
            ))}
          </div>
        </Reveal>
      </PageContainer>
    </div>
  );
}
