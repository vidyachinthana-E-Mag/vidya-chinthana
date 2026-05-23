import React, { useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import { usePageMeta } from "../hooks/usePageMeta";
import PageContainer from "../components/ui/PageContainer";
import CoverImage from "../components/ui/CoverImage";
import Reveal from "../components/motion/Reveal";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function IssuePage() {
  const { lang, issues, activeIssueId, setActiveIssueId, openIssuesIndex, articles, openArticle } =
    useApp();

  const issue = issues.find((i) => i.id === activeIssueId);

  useEffect(() => {
    if (!issue) openIssuesIndex();
  }, [issue, openIssuesIndex]);

  if (!issue) return null;

  const issueArticles = articles.filter((a) => issue.articleIds.includes(a.id));

  const issueMeta = useMemo(
    () => ({
      title: t(lang, issue.titleEn, issue.titleSi),
      description: t(lang, issue.descriptionEn, issue.descriptionSi),
      path: `/issue/${issue.id}`,
      image: issue.coverImage,
    }),
    [lang, issue]
  );
  usePageMeta(issueMeta);

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14 max-w-4xl">
        <button
          type="button"
          onClick={() => {
            setActiveIssueId(null);
            openIssuesIndex();
          }}
          className="flex items-center gap-2 text-sm text-muted mb-10 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang, "All issues", "සියලු කලාප")}
        </button>

        <Reveal>
          <div className="premium-card overflow-hidden mb-12">
            <CoverImage
              src={issue.coverImage}
              alt=""
              seed={issue.id}
              className="w-full aspect-[21/9] object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="p-8 sm:p-10">
              <p className="vc-section-label">
                Vol {issue.volume} · #{issue.number} · {issue.publishedAt}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-medium mt-3 tracking-tight">
                {t(lang, issue.titleEn, issue.titleSi)}
              </h1>
              <p className="text-muted mt-4 leading-relaxed text-base sm:text-lg">
                {t(lang, issue.descriptionEn, issue.descriptionSi)}
              </p>
            </div>
          </div>
        </Reveal>

        <h2 className="vc-section-label mb-6">{t(lang, "In this issue", "මෙම කලාපයේ")}</h2>
        <div className="space-y-3">
          {issueArticles.map((art, i) => (
            <Reveal key={art.id} delay={i * 0.04}>
              <button
                type="button"
                onClick={() => openArticle(art)}
                className="w-full text-left p-6 rounded-2xl premium-card cursor-pointer group flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-display text-lg font-medium">{t(lang, art.titleEn, art.titleSi)}</p>
                  <p className="text-xs text-muted mt-1 capitalize">{art.category}</p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: "var(--vc-accent)" }} />
              </button>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
