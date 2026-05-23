import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import { usePageMeta } from "../hooks/usePageMeta";
import PageContainer from "../components/ui/PageContainer";
import PageHero from "../components/ui/PageHero";
import CoverImage from "../components/ui/CoverImage";
import Reveal from "../components/motion/Reveal";
import { Layers, ArrowRight } from "lucide-react";

export default function IssuesPage() {
  const { lang, issues, articles, openIssue } = useApp();

  const meta = useMemo(
    () => ({
      title: t(lang, "Magazine issues", "සඟරා කලාප"),
      description: t(
        lang,
        "Browse every edition of Vidya Chinthana — curated science, education, and sci-fi.",
        "විද්‍යා චින්තනයේ සියලු කලාප — විද්‍යාව, අධ්‍යාපනය, sci-fi."
      ),
      path: "/issues",
    }),
    [lang]
  );
  usePageMeta(meta);

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14">
        <PageHero
          eyebrow={t(lang, "Magazine", "සඟරාව")}
          title={t(lang, "All issues", "සියලු කලාප")}
          subtitle={t(
            lang,
            "Issue-based publishing — the blueprint for a true digital magazine.",
            "කලාප මත පදනම් වූ ප්‍රකාශනය — සැබෑ ඩිජිටල් සඟරාවක්."
          )}
        />

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {issues.map((iss, i) => {
            const count = articles.filter((a) => iss.articleIds.includes(a.id)).length;
            return (
              <Reveal key={iss.id} delay={i * 0.05}>
                <button
                  type="button"
                  onClick={() => openIssue(iss.id)}
                  className="w-full text-left premium-card overflow-hidden cursor-pointer group p-0"
                >
                  <CoverImage
                    src={iss.coverImage}
                    alt=""
                    className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    seed={`issue-${iss.id}`}
                  />
                  <div className="p-6 sm:p-8">
                    <p className="vc-section-label flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5" />
                      Vol {iss.volume} · #{iss.number}
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-medium mt-2">
                      {t(lang, iss.titleEn, iss.titleSi)}
                    </h2>
                    <p className="text-sm text-muted mt-2 line-clamp-2">
                      {t(lang, iss.descriptionEn, iss.descriptionSi)}
                    </p>
                    <p className="mt-4 text-xs font-semibold flex items-center gap-1" style={{ color: "var(--vc-accent)" }}>
                      {count} {t(lang, "articles", "ලිපි")}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </PageContainer>
    </div>
  );
}
