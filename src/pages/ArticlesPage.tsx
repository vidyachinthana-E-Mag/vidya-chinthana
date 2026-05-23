import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import { usePageMeta } from "../hooks/usePageMeta";
import ArticleCard from "../components/ui/ArticleCard";
import { ArticleGridSkeleton } from "../components/ui/ArticleCardSkeleton";
import ArticleListRow from "../components/ui/ArticleListRow";
import PageContainer from "../components/ui/PageContainer";
import PageHero from "../components/ui/PageHero";
import FilterPills from "../components/ui/FilterPills";
import Reveal from "../components/motion/Reveal";
import { CheckCircle2, Search, LayoutGrid, List } from "lucide-react";

type SortKey = "newest" | "title" | "reading";
type ViewMode = "grid" | "list";

export default function ArticlesPage() {
  const {
    lang,
    articles,
    search,
    setSearch,
    category,
    setCategory,
    openArticle,
    completedIds,
    toggleCompleted,
    readProgress,
    dataReady,
  } = useApp();

  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = articles.filter((a) => {
      const matchQ =
        !q ||
        a.titleEn.toLowerCase().includes(q) ||
        a.titleSi.toLowerCase().includes(q) ||
        a.summaryEn.toLowerCase().includes(q);
      const matchCat = category === "all" || a.category === category;
      return matchQ && matchCat;
    });
    if (sort === "title") {
      list = [...list].sort((a, b) => a.titleEn.localeCompare(b.titleEn));
    } else if (sort === "reading") {
      list = [...list].sort((a, b) => b.readingTimeMin - a.readingTimeMin);
    }
    return list;
  }, [articles, search, category, sort]);

  const pct = articles.length
    ? Math.round((completedIds.length / articles.length) * 100)
    : 0;

  const articlesMeta = useMemo(
    () => ({
      title: t(lang, "Articles", "ලිපි"),
      description: t(
        lang,
        "Search and browse every story — science, education, technology, and sci-fi.",
        "සියලු ලිපි — විද්‍යාව, අධ්‍යාපනය, තාක්ෂණය, sci-fi."
      ),
      path: "/articles",
    }),
    [lang]
  );
  usePageMeta(articlesMeta);

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14">
        <PageHero
          eyebrow={t(lang, "Library", "ගබඩාව")}
          title={t(lang, "All articles", "සියලු ලිපි")}
          subtitle={t(lang, "Browse, sort, and track your reading progress.", "සොයන්න, වර්ගීකරණය කරන්න, ප්‍රගතිය බලන්න.")}
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="premium-card px-5 py-4 flex items-center gap-4">
              <span className="text-3xl font-display font-medium" style={{ color: "var(--vc-accent)" }}>
                {pct}%
              </span>
              <span className="text-xs text-muted">
                {completedIds.length}/{articles.length} {t(lang, "completed", "අවසන්")}
              </span>
            </div>
            <div className="premium-card px-5 py-4">
              <p className="text-2xl font-display">{filtered.length}</p>
              <p className="text-[10px] uppercase text-muted mt-1">{t(lang, "Showing", "පෙන්වයි")}</p>
            </div>
          </div>
        </PageHero>

        <Reveal>
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(lang, "Search articles...", "ලිපි සොයන්න...")}
              className="input-premium"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <FilterPills lang={lang} category={category} setCategory={setCategory} />
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="input-premium py-2 text-xs w-auto min-w-[140px]"
                aria-label="Sort"
              >
                <option value="newest">{t(lang, "Default order", "පෙරනිමි")}</option>
                <option value="title">{t(lang, "Title A–Z", "ශීර්ෂය")}</option>
                <option value="reading">{t(lang, "Longest read", "දිගම කියවීම")}</option>
              </select>
              <div className="flex rounded-xl border border-[var(--vc-border)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`p-2.5 cursor-pointer ${view === "grid" ? "bg-[color-mix(in_srgb,var(--vc-accent)_12%,transparent)]" : ""}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`p-2.5 cursor-pointer border-l border-[var(--vc-border)] ${view === "list" ? "bg-[color-mix(in_srgb,var(--vc-accent)_12%,transparent)]" : ""}`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {!dataReady ? (
          <ArticleGridSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <p className="text-center py-20 text-muted">{t(lang, "No articles found.", "ලිපි හමු නොවීය.")}</p>
        ) : view === "list" ? (
          <div className="space-y-3">
            {filtered.map((art, i) => (
              <Reveal key={art.id} delay={i * 0.03}>
                <ArticleListRow
                  article={art}
                  done={completedIds.includes(art.id)}
                  onOpen={() => openArticle(art)}
                  onToggleDone={() => toggleCompleted(art.id)}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 stagger-grid">
            {filtered.map((art, i) => {
              const done = completedIds.includes(art.id);
              return (
                <Reveal key={art.id} delay={i * 0.04}>
                  <div className="relative">
                    <ArticleCard
                      article={art}
                      lang={lang}
                      onClick={() => openArticle(art)}
                      progress={readProgress[art.id]}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompleted(art.id);
                      }}
                      className={`absolute top-4 right-4 p-2 rounded-full border cursor-pointer backdrop-blur-md transition-colors ${
                        done
                          ? "border-[var(--vc-accent)] bg-[color-mix(in_srgb,var(--vc-accent)_15%,transparent)]"
                          : "border-[var(--vc-border)] bg-[var(--vc-paper)]/80 dark:bg-black/40"
                      }`}
                      aria-label={done ? "Mark incomplete" : "Mark complete"}
                    >
                      <CheckCircle2 className="w-4 h-4" style={done ? { color: "var(--vc-accent)" } : {}} />
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
