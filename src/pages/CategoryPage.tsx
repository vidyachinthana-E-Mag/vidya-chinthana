import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import { usePageMeta } from "../hooks/usePageMeta";
import { CATEGORY_CONFIG, isCategoryId } from "../lib/categories";
import { Category } from "../types";
import PageContainer from "../components/ui/PageContainer";
import ArticleCard from "../components/ui/ArticleCard";
import { ArticleGridSkeleton } from "../components/ui/ArticleCardSkeleton";
import Reveal from "../components/motion/Reveal";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const { lang, category, articles, openArticle, setPage, dataReady } = useApp();

  if (!isCategoryId(category)) {
    setPage("articles");
    return null;
  }

  const cfg = CATEGORY_CONFIG[category as Category];
  const list = articles.filter((a) => a.category === category);

  const meta = useMemo(
    () => ({
      title: t(lang, cfg.labelEn, cfg.labelSi),
      description: t(lang, cfg.descEn, cfg.descSi),
      path: `/category/${category}`,
    }),
    [lang, category, cfg]
  );
  usePageMeta(meta);

  return (
    <div className="page-enter">
      <section
        className="relative border-b border-[var(--vc-border)] overflow-hidden"
        style={{ background: cfg.gradient }}
      >
        <PageContainer className="py-14 sm:py-20 relative">
          <button
            type="button"
            onClick={() => setPage("home")}
            className="flex items-center gap-2 text-sm text-muted mb-8 cursor-pointer hover:opacity-80"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(lang, "Home", "මුල් පිටුව")}
          </button>
          <Reveal>
            <p className="vc-section-label" style={{ color: cfg.accent }}>
              {t(lang, "Category", "කාණ්ඩය")}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight mt-3">
              {t(lang, cfg.labelEn, cfg.labelSi)}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              {t(lang, cfg.descEn, cfg.descSi)}
            </p>
            <p className="mt-4 text-sm text-muted">
              {list.length} {t(lang, "stories", "ලිපි")}
            </p>
          </Reveal>
        </PageContainer>
      </section>

      <PageContainer className="py-12 sm:py-16">
        {!dataReady ? (
          <ArticleGridSkeleton count={6} />
        ) : list.length === 0 ? (
          <p className="text-center text-muted py-16">{t(lang, "No stories yet in this section.", "මෙම අංශයේ ලිපි නැත.")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {list.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.04}>
                <ArticleCard article={a} lang={lang} onClick={() => openArticle(a)} />
              </Reveal>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
