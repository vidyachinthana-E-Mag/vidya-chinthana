import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import { usePageMeta } from "../hooks/usePageMeta";
import { absoluteImage, buildOrganizationJsonLd, buildWebSiteJsonLd } from "../lib/pageMeta";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import ArticleCard from "../components/ui/ArticleCard";
import { ArticleGridSkeleton } from "../components/ui/ArticleCardSkeleton";
import HeroCinematic from "../components/home/HeroCinematic";
import Masthead from "../components/layout/Masthead";
import NewsTicker from "../components/ui/NewsTicker";
import MagazineFront from "../components/magazine/MagazineFront";
import FeaturedContributors from "../components/magazine/FeaturedContributors";
import TrendingRail from "../components/magazine/TrendingRail";
import CategorySpotlight from "../components/magazine/CategorySpotlight";
import PageContainer from "../components/ui/PageContainer";
import FilterPills from "../components/ui/FilterPills";
import Reveal from "../components/motion/Reveal";
import { Search, Layers, BookOpen, ArrowRight, FileQuestion } from "lucide-react";
import { motion } from "motion/react";

export default function HomePage() {
  const {
    lang,
    siteConfig: sc,
    articles,
    issues,
    stats,
    search,
    setSearch,
    category,
    setCategory,
    activeIssueId,
    setActiveIssueId,
    openArticle,
    setPage,
    openIssue,
    openIssuesIndex,
    lastArticleId,
    readProgress,
    bookmarks,
    dataReady,
  } = useApp();

  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      a.titleEn.toLowerCase().includes(q) ||
      a.titleSi.toLowerCase().includes(q) ||
      a.summaryEn.toLowerCase().includes(q);
    const matchCat = category === "all" || a.category === category;
    const matchIssue = !activeIssueId || a.issueId === activeIssueId;
    return matchQ && matchCat && matchIssue;
  });

  const continueArticle = lastArticleId
    ? articles.find((a) => a.id === lastArticleId)
    : null;
  const continuePct = continueArticle ? readProgress[continueArticle.id] ?? 0 : 0;
  const bookmarked = articles.filter((a) => bookmarks.includes(a.id)).slice(0, 3);
  const hs = sc.homeSections;
  const reduced = sc.effects.reducedMotion;

  const showMagazineFront =
    !search && category === "all" && !activeIssueId && filtered.length >= 2;

  const homeMeta = useMemo(
    () => ({
      title: t(lang, sc.branding.siteNameEn, sc.branding.siteNameSi),
      description: t(lang, sc.hero.subheadEn, sc.hero.subheadSi),
      path: "/home",
      image: absoluteImage(sc.admin.seo.ogImageUrl || "/icon.svg"),
      jsonLd: [buildWebSiteJsonLd(sc, lang), buildOrganizationJsonLd(sc, lang)],
    }),
    [lang, sc]
  );
  usePageMeta(homeMeta);

  return (
    <div className="page-enter">
      <NewsTicker />

      <HeroCinematic sc={sc}>
        <Reveal>
          <p className="vc-section-label mb-5 relative">{t(lang, sc.hero.badgeEn, sc.hero.badgeSi)}</p>
          <h1 className="font-display vc-hero-title relative hero-neon-title">
            {t(lang, sc.hero.headlineEn, sc.hero.headlineSi)}
          </h1>
          {lang === "BILINGUAL" && (
            <p className="mt-4 text-xl sm:text-2xl font-display text-muted relative italic">
              {sc.hero.headlineSi}
            </p>
          )}
          <p className="mt-6 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed relative">
            {t(lang, sc.hero.subheadEn, sc.hero.subheadSi)}
          </p>
        </Reveal>
        {sc.hero.showSearch && (
          <Reveal delay={0.12}>
            <div className="mt-10 relative max-w-md w-full mx-auto px-4">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="home-search"
                name="q"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t(lang, "Search articles...", "ලිපි සොයන්න...")}
                className="input-premium"
                aria-label={t(lang, "Search", "සොයන්න")}
              />
            </div>
          </Reveal>
        )}
      </HeroCinematic>

      <PageContainer className="pb-20 -mt-8">
        <Masthead />
        {showMagazineFront && (
          <MagazineFront articles={filtered} onOpen={openArticle} />
        )}
        <FeaturedContributors />
        <TrendingRail />
        <CategorySpotlight />
        {hs.showStats && sc.admin.features.showPlatformStats && stats && (
          <Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-16">
              {[
                { label: t(lang, "Articles", "ලිපි"), val: stats.articles, icon: BookOpen },
                { label: t(lang, "Issues", "කලාප"), val: stats.issues, icon: Layers },
                { label: t(lang, "Glossary", "පද"), val: stats.glossary, icon: BookOpen },
                { label: t(lang, "In review", "සමාලෝචනය"), val: stats.drafts, icon: BookOpen },
              ].map(({ label, val, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="premium-card p-5 sm:p-6"
                >
                  <Icon className="w-4 h-4 mb-3" style={{ color: "var(--vc-accent)" }} />
                  <p className="text-3xl font-display font-medium tracking-tight">
                    <AnimatedCounter value={val} />
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-muted mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        )}

        {hs.showContinueReading && continueArticle && continuePct < 100 && (
          <Reveal>
            <motion.button
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => openArticle(continueArticle)}
              className="w-full mb-12 p-6 sm:p-8 rounded-[var(--vc-radius)] premium-card text-left cursor-pointer"
            >
              <p className="vc-section-label mb-2">{t(lang, "Continue reading", "කියවීම දිගටම")}</p>
              <p className="font-display text-xl sm:text-2xl font-medium">
                {t(lang, continueArticle.titleEn, continueArticle.titleSi)}
              </p>
              <div className="mt-4 h-1 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden max-w-xs">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${continuePct}%`, background: "var(--vc-accent)" }}
                />
              </div>
            </motion.button>
          </Reveal>
        )}

        {hs.showBookmarks && bookmarked.length > 0 && (
          <Reveal>
            <div className="mb-12">
              <h3 className="vc-section-label mb-4">{t(lang, "Saved for later", "පසුව කියවන්න")}</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {bookmarked.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => openArticle(a)}
                    className="shrink-0 btn-ghost"
                  >
                    {t(lang, a.titleEn, a.titleSi).slice(0, 40)}…
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--vc-accent)" }} />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <div className={`grid gap-12 lg:gap-16 ${hs.showIssuesSidebar ? "lg:grid-cols-12" : ""}`}>
          {hs.showIssuesSidebar && (
            <aside className="lg:col-span-4 space-y-4">
              <Reveal>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="vc-section-label flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    {t(lang, "Magazine issues", "සඟරා කලාප")}
                  </h2>
                  <button
                    type="button"
                    onClick={openIssuesIndex}
                    className="text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    style={{ color: "var(--vc-accent)" }}
                  >
                    {t(lang, "All issues", "සියලු කලාප")}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIssueId(null)}
                  className={`w-full text-left p-4 rounded-2xl text-sm cursor-pointer transition-all ${
                    !activeIssueId ? "premium-card font-semibold" : "btn-ghost w-full justify-start rounded-2xl"
                  }`}
                  style={!activeIssueId ? { color: "var(--vc-accent)" } : {}}
                >
                  {t(lang, "All issues", "සියලු කලාප")}
                </button>
                {issues.map((iss, i) => (
                  <motion.button
                    key={iss.id}
                    type="button"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => openIssue(iss.id)}
                    className={`w-full text-left rounded-2xl overflow-hidden cursor-pointer premium-card ${
                      activeIssueId === iss.id ? "ring-2" : ""
                    }`}
                    style={activeIssueId === iss.id ? ({ "--tw-ring-color": "var(--vc-accent)" } as React.CSSProperties) : {}}
                  >
                    <img
                      src={iss.coverImage}
                      alt=""
                      className="w-full h-28 object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4">
                      <span className="text-[10px] text-muted uppercase tracking-wider">
                        Vol {iss.volume} · #{iss.number}
                      </span>
                      <p className="font-display text-base mt-1">{t(lang, iss.titleEn, iss.titleSi)}</p>
                    </div>
                  </motion.button>
                ))}
              </Reveal>
            </aside>
          )}

          <div className={hs.showIssuesSidebar ? "lg:col-span-8" : ""}>
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-medium">
                    {t(lang, "Latest stories", "නවතම ලිපි")}
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    {t(lang, "Curated science & education", "විද්‍යාව සහ අධ්‍යාපනය")}
                  </p>
                </div>
                <FilterPills lang={lang} category={category} setCategory={setCategory} />
              </div>
            </Reveal>

            {!dataReady ? (
              <ArticleGridSkeleton count={4} />
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 sm:py-20 premium-card px-6 sm:px-10 max-w-lg mx-auto">
                <FileQuestion className="w-10 h-10 mx-auto text-muted opacity-60" aria-hidden />
                <p className="font-display text-xl font-medium mt-5">
                  {t(lang, "No stories match", "ගැලපෙන ලිපි නැත")}
                </p>
                <p className="text-sm text-muted mt-2 leading-relaxed">
                  {t(
                    lang,
                    "Try a different search, category, or issue filter.",
                    "වෙනත් සෙවුම, කාණ්ඩය හෝ කලාපය උත්සාහ කරන්න."
                  )}
                </p>
                {(search || category !== "all" || activeIssueId) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setActiveIssueId(null);
                    }}
                    className="btn-primary mt-6 text-sm"
                  >
                    {t(lang, "Clear filters", "පෙරහන් ඉවත් කරන්න")}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 stagger-grid">
                {(showMagazineFront ? filtered.slice(4) : filtered).map((art, i) => (
                  <Reveal key={art.id} delay={i * 0.05}>
                    <ArticleCard
                      article={art}
                      lang={lang}
                      featured={!showMagazineFront && i === 0}
                      onClick={() => openArticle(art)}
                      progress={readProgress[art.id]}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
