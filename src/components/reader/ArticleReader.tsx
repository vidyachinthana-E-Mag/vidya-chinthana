import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../context/AppContext";
import { Lang, categoryMeta, t } from "../../lib/labels";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { usePageMeta } from "../../hooks/usePageMeta";
import { absoluteImage, buildArticleJsonLd } from "../../lib/pageMeta";
import ArticleShareBar from "./ArticleShareBar";
import CoverImage from "../ui/CoverImage";
import { Article, ArticleBlock, GlossaryTerm } from "../../types";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageSquare,
  Type,
  AlignLeft,
  BookMarked,
} from "lucide-react";
import RelatedArticles from "./RelatedArticles";

function highlightGlossary(text: string, terms: GlossaryTerm[]): React.ReactNode {
  if (!terms.length) return text;
  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
  let parts: React.ReactNode[] = [text];
  for (const term of sorted) {
    const next: React.ReactNode[] = [];
    for (const part of parts) {
      if (typeof part !== "string") {
        next.push(part);
        continue;
      }
      const re = new RegExp(`\\b(${term.term})\\b`, "gi");
      const bits = part.split(re);
      bits.forEach((bit, i) => {
        if (i % 2 === 1) {
          next.push(
            <abbr
              key={`${term.term}-${i}`}
              title={`${term.termSi}: ${term.definitionEn}`}
              className="glossary-term no-underline"
            >
              {bit}
            </abbr>
          );
        } else if (bit) next.push(bit);
      });
    }
    parts = next;
  }
  return <>{parts}</>;
}

function BlockView({
  block,
  lang,
  dropCap,
  glossary,
}: {
  block: ArticleBlock;
  lang: Lang;
  dropCap?: boolean;
  glossary: GlossaryTerm[];
}) {
  const en = block.valueEn;
  const si = block.valueSi;

  switch (block.type) {
    case "heading":
      return (
        <h2
          id={`section-${block.id}`}
          className="font-display text-2xl font-bold mt-10 mb-4 scroll-mt-36"
        >
          {lang === "BILINGUAL" ? (
            <>
              {en}
              <span className="block text-lg text-[#5c5c6e] dark:text-[#9a9aaa] mt-1 font-serif font-normal italic">
                {si}
              </span>
            </>
          ) : (
            t(lang, en, si)
          )}
        </h2>
      );
    case "quote":
      return (
        <blockquote className="magazine-pullquote my-10 px-6 py-4 border-l-4 italic font-display text-xl sm:text-2xl leading-snug">
          {t(lang, en, si)}
        </blockquote>
      );
    case "highlight":
      return (
        <div className="my-8 p-6 rounded-2xl magazine-highlight text-sm sm:text-base leading-relaxed">
          {t(lang, en, si)}
        </div>
      );
    case "image":
      return (
        <figure className="my-8">
          <img
            src={en || si}
            alt={block.imageCaptionEn || ""}
            className="w-full rounded-xl"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {(block.imageCaptionEn || block.imageCaptionSi) && (
            <figcaption className="text-xs text-center mt-2 text-[#5c5c6e]">
              {t(lang, block.imageCaptionEn || "", block.imageCaptionSi || "")}
            </figcaption>
          )}
        </figure>
      );
    default:
      return (
        <p
          className={`leading-[1.85] text-[#3a3a48] dark:text-[#c8c4bf] mb-5 font-serif ${
            dropCap ? "drop-cap" : ""
          }`}
        >
          {lang === "BILINGUAL" ? (
            <>
              <span>{highlightGlossary(en, glossary)}</span>
              <span className="block mt-4 text-[#5c5c6e] dark:text-[#9a9aaa] text-sm italic">
                {si}
              </span>
            </>
          ) : (
            highlightGlossary(t(lang, en, si), glossary)
          )}
        </p>
      );
  }
}

export default function ArticleReader() {
  const {
    readingArticle: article,
    closeArticle,
    lang,
    theme,
    user,
    glossary,
    profiles,
    openProfile,
    siteConfig,
    bookmarks,
    toggleBookmark,
    toggleCompleted,
    completedIds,
    addComment,
    setStatus,
    readProgress,
    setReadProgress,
    notify,
    articles,
  } = useApp();

  const title = article ? t(lang, article.titleEn, article.titleSi) : null;
  useDocumentTitle(title);

  usePageMeta(
    article
      ? {
          title: title ?? article.titleEn,
          description: t(lang, article.summaryEn, article.summarySi),
          path: `/read/${article.id}`,
          image: absoluteImage(article.coverUrl),
          ogType: "article",
          jsonLd: buildArticleJsonLd(article, lang),
        }
      : { title: "Vidya Chinthana" }
  );

  if (!article) return null;

  const readerCfg = siteConfig.admin.reader;
  const cat = categoryMeta[article.category];
  const [mode, setMode] = useState<"scroll" | "flip">(readerCfg.defaultView);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [lineHeight, setLineHeight] = useState<"normal" | "relaxed" | "loose">("relaxed");
  const [flipPage, setFlipPage] = useState(0);
  const [comment, setComment] = useState("");
  const [showGlossary, setShowGlossary] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pages = useMemo(() => {
    const chunks: ArticleBlock[][] = [];
    let current: ArticleBlock[] = [];
    for (const b of article.blocks) {
      current.push(b);
      if (current.length >= 3) {
        chunks.push(current);
        current = [];
      }
    }
    if (current.length) chunks.push(current);
    return chunks.length ? chunks : [article.blocks];
  }, [article.blocks]);

  const progress = readProgress[article.id] ?? 0;
  const layoutClass =
    article.layoutTemplate === "scifi-neon"
      ? "layout-scifi-neon"
      : article.layoutTemplate === "editorial-serif"
        ? "layout-editorial-serif"
        : "layout-academic";

  const sizeClass =
    fontSize === "sm" ? "text-sm" : fontSize === "lg" ? "text-lg" : "text-base";
  const lhClass =
    lineHeight === "loose"
      ? "leading-[2]"
      : lineHeight === "normal"
        ? "leading-normal"
        : "leading-relaxed";

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || mode !== "scroll") return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? Math.round((el.scrollTop / max) * 100) : 100;
      setReadProgress(article.id, pct);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [article.id, mode, setReadProgress]);

  const articleUrl = `${window.location.origin}${window.location.pathname}#/read/${article.id}`;

  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      notify(t(lang, "Link copied!", "සබැඳිය පිටපත් විය!"));
    } catch {
      notify(t(lang, "Could not copy link", "සබැඳිය පිටපත් කළ නොහැක"), "error");
    }
  };

  const shareArticle = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.titleEn, url: articleUrl });
      } else {
        await copyArticleLink();
      }
    } catch {
      /* user cancelled */
    }
  };

  const scrollToSection = (blockId: string) => {
    document.getElementById(`section-${blockId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const isBookmarked = bookmarks.includes(article.id);
  const isDone = completedIds.includes(article.id);
  const canEdit = user?.role === "owner" || user?.role === "editor";
  const authorProfile = profiles.find(
    (p) => p.nameEn === article.authorName || p.userId === article.authorId || p.id === article.authorId
  );
  const headings = article.blocks.filter((b) => b.type === "heading");
  const scalePct = readerCfg.defaultFontScale / 100;

  return (
    <div className={`min-h-screen magazine-reader article-print-root ${layoutClass}`}>
      <div
        className="read-progress-bar fixed top-0 left-0 right-0 z-[60]"
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      <div className="relative h-[40vh] sm:h-[50vh] min-h-[280px] overflow-hidden">
        <CoverImage
          src={article.coverUrl}
          alt={title ?? ""}
          seed={article.id}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--vc-paper-dark)] via-black/50 to-black/20" aria-hidden />
        <button
          type="button"
          onClick={closeArticle}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm cursor-pointer text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang, "Back", "ආපසු")}
        </button>
      </div>

      <div className="sticky top-0 z-40 border-b border-[var(--vc-border)] glass-panel reader-toolbar">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center gap-2 justify-end">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mr-auto overflow-x-auto scrollbar-hide max-w-full pb-0.5">
            <div className="flex rounded-lg border border-black/8 dark:border-white/10 p-0.5 text-[10px]">
              {(["scroll", "flip"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2.5 py-1 rounded-md cursor-pointer capitalize ${
                    mode === m
                      ? "bg-[#1a1a24] dark:bg-[#e8e4df] text-white dark:text-[#0c0c10]"
                      : ""
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setFontSize((s) => (s === "sm" ? "md" : s === "md" ? "lg" : "sm"))
              }
              className="p-2 rounded-lg border border-black/8 dark:border-white/10 cursor-pointer"
              title="Font size"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setLineHeight((l) =>
                  l === "normal" ? "relaxed" : l === "relaxed" ? "loose" : "normal"
                )
              }
              className="p-2 rounded-lg border border-black/8 dark:border-white/10 cursor-pointer"
              title="Line height"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowGlossary(!showGlossary)}
              className={`p-2 rounded-lg border cursor-pointer ${
                showGlossary ? "border-[#c45c26] text-[#c45c26]" : "border-black/8 dark:border-white/10"
              }`}
            >
              <BookMarked className="w-4 h-4" />
            </button>
            <button
              onClick={shareArticle}
              className="p-2 rounded-lg border border-black/8 dark:border-white/10 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-lg border cursor-pointer ${
                isBookmarked ? "border-[#c45c26] text-[#c45c26]" : "border-black/8 dark:border-white/10"
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                toggleCompleted(article.id);
                notify(isDone ? "Marked unread" : "Marked as read!");
              }}
              className={`p-2 rounded-lg border cursor-pointer ${
                isDone ? "border-emerald-500 text-emerald-600" : "border-black/8 dark:border-white/10"
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 flex gap-8" style={{ fontSize: `${scalePct}rem` }}>
        <article
          ref={scrollRef}
          className={`flex-1 article-body newspaper-article magazine-column ${sizeClass} ${lhClass} ${
            mode === "scroll" ? "" : ""
          }`}
        >
          <header className="mb-12 text-center max-w-2xl mx-auto">
            <span className="vc-section-label">{t(lang, cat.en, cat.si)}</span>
            {article.publishedAt && (
              <time
                dateTime={article.publishedAt}
                className="block text-[11px] text-muted mt-2 uppercase tracking-wider"
              >
                {new Date(article.publishedAt).toLocaleDateString(
                  lang === "SI" ? "si-LK" : "en-GB",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </time>
            )}
            <h1 className="font-display text-3xl sm:text-5xl font-medium leading-[1.08] tracking-tight mt-4">
              {t(lang, article.titleEn, article.titleSi)}
            </h1>
            {lang === "BILINGUAL" && (
              <p className="mt-4 text-lg italic text-muted font-serif">{article.titleSi}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
              {authorProfile ? (
                <button
                  type="button"
                  onClick={() => openProfile(authorProfile.slug)}
                  className="font-semibold cursor-pointer hover:underline"
                  style={{ color: "var(--vc-accent)" }}
                >
                  {article.authorName}
                </button>
              ) : (
                <span>{article.authorName}</span>
              )}
              {readerCfg.showReadingTime && (
                <>
                  <span>·</span>
                  <span>{article.readingTimeMin} min read</span>
                </>
              )}
              <span>·</span>
              <span>{progress}%</span>
            </div>
            {article.summaryEn && (
              <p className="mt-8 text-base sm:text-lg text-muted leading-relaxed text-left sm:text-center magazine-deck">
                {t(lang, article.summaryEn, article.summarySi)}
              </p>
            )}
          </header>

          {mode === "scroll" && headings.length > 1 && (
            <nav
              className="mb-10 p-5 rounded-2xl border border-[var(--vc-border)] bg-black/[0.02] dark:bg-white/[0.02] article-toc"
              aria-label={t(lang, "Table of contents", "අන්තර්ගතය")}
            >
              <p className="vc-section-label mb-3">{t(lang, "In this article", "මෙම ලිපියේ")}</p>
              <ol className="space-y-2 text-sm list-none">
                {headings.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(h.id)}
                      className="text-left text-muted hover:text-[var(--vc-accent)] cursor-pointer w-full py-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vc-accent)] rounded"
                    >
                      {t(lang, h.valueEn, h.valueSi)}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {mode === "scroll" ? (
            article.blocks.map((block, i) => (
              <div key={block.id}>
                <BlockView
                  block={block}
                  lang={lang}
                  glossary={readerCfg.enableGlossary ? glossary : []}
                  dropCap={i === 1 && block.type === "paragraph"}
                />
              </div>
            ))
          ) : (
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={flipPage}
                  initial={{ opacity: 0, rotateY: -8 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 8 }}
                  transition={{ duration: 0.35 }}
                  className={`min-h-[55vh] p-8 sm:p-12 rounded-2xl border border-[var(--vc-border)] magazine-page ${
                    theme === "dark" ? "bg-[#14141c]" : "bg-white shadow-xl"
                  }`}
                >
                  {pages[flipPage]?.map((block, i) => (
                    <div key={block.id}>
                      <BlockView block={block} lang={lang} glossary={readerCfg.enableGlossary ? glossary : []} dropCap={i === 0} />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center justify-between mt-6">
                <button
                  disabled={flipPage === 0}
                  onClick={() => {
                    setFlipPage((p) => p - 1);
                    setReadProgress(article.id, Math.round(((flipPage - 1) / pages.length) * 100));
                  }}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t(lang, "Prev", "පෙර")}
                </button>
                <span className="text-xs text-[#5c5c6e]">
                  {flipPage + 1} / {pages.length}
                </span>
                <button
                  disabled={flipPage >= pages.length - 1}
                  onClick={() => {
                    setFlipPage((p) => p + 1);
                    setReadProgress(article.id, Math.round(((flipPage + 1) / pages.length) * 100));
                  }}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border disabled:opacity-30 cursor-pointer"
                >
                  {t(lang, "Next", "ඊළඟ")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {(article.comments?.length ?? 0) > 0 && (
            <section className="mt-14 pt-8 border-t border-black/8 dark:border-white/10">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#c45c26]" />
                {t(lang, "Editorial Notes", "සංස්කාරක සටහන්")}
              </h3>
              <div className="space-y-3">
                {article.comments?.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-sm"
                  >
                    <p className="font-semibold text-xs text-[#c45c26] mb-1">
                      {c.author} • {c.role}
                    </p>
                    <p>{c.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {user && siteConfig.admin.features.enableReaderComments && (
            <section className="mt-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t(lang, "Add a comment...", "අදහසක් එක් කරන්න...")}
                className="w-full p-4 rounded-xl border border-black/8 dark:border-white/10 bg-transparent text-sm resize-none h-24"
              />
              <button
                onClick={async () => {
                  if (!comment.trim()) return;
                  await addComment(article.id, comment);
                  setComment("");
                }}
                className="mt-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#c45c26] text-white cursor-pointer hover:opacity-90"
              >
                {t(lang, "Post Comment", "පළ කරන්න")}
              </button>
            </section>
          )}

          {canEdit && article.status !== "published" && (
            <div className="mt-8 flex gap-2">
              <button
                onClick={() => setStatus(article.id, "under-review")}
                className="px-4 py-2 text-xs rounded-lg border cursor-pointer"
              >
                Review
              </button>
              <button
                onClick={() => setStatus(article.id, "published")}
                className="px-4 py-2 text-xs rounded-lg bg-emerald-600 text-white cursor-pointer"
              >
                Publish
              </button>
            </div>
          )}

          <RelatedArticles current={article} articles={articles} />
        </article>

        <ArticleShareBar
          lang={lang}
          isBookmarked={isBookmarked}
          onShare={shareArticle}
          onCopyLink={copyArticleLink}
          onBookmark={() => toggleBookmark(article.id)}
        />

        {showGlossary && glossary.length > 0 && (
          <aside className="hidden xl:block w-64 shrink-0 sticky top-32 self-start max-h-[70vh] overflow-y-auto">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c45c26] mb-3">
              {t(lang, "Glossary", "ශබ්දකෝෂය")}
            </h4>
            <div className="space-y-2">
              {glossary.slice(0, 12).map((g) => (
                <div
                  key={g.term}
                  className="p-3 rounded-lg border border-black/8 dark:border-white/10 text-xs"
                >
                  <p className="font-bold">{g.term}</p>
                  <p className="text-[#5c5c6e] italic">{g.termSi}</p>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
