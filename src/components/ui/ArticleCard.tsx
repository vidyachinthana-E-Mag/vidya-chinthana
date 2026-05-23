import React, { useCallback } from "react";
import { Article } from "../../types";
import { Lang, categoryMeta, t } from "../../lib/labels";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import CoverImage from "./CoverImage";

export default function ArticleCard({
  article,
  lang,
  featured = false,
  onClick,
  progress,
}: {
  article: Article;
  lang: Lang;
  featured?: boolean;
  onClick: () => void;
  progress?: number;
}) {
  const cat = categoryMeta[article.category];

  const prefetchCover = useCallback(() => {
    if (!article.coverUrl || article.coverUrl.startsWith("data:")) return;
    const href = article.coverUrl;
    if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
  }, [article.coverUrl]);

  if (featured) {
    return (
      <motion.article
        layout
        onClick={onClick}
        onMouseEnter={prefetchCover}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group grid md:grid-cols-2 gap-0 premium-card cursor-pointer overflow-hidden"
      >
        <div className="aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden">
          <CoverImage
            src={article.coverUrl}
            alt={t(lang, article.titleEn, article.titleSi)}
            seed={article.id}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <span className="vc-section-label mb-4">
            {t(lang, "Featured", "විශේෂාංග")} · {t(lang, cat.en, cat.si)}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-medium leading-[1.1] tracking-tight">
            {t(lang, article.titleEn, article.titleSi)}
          </h2>
          {lang === "BILINGUAL" && (
            <p className="text-base text-muted mt-3 font-serif italic">{article.titleSi}</p>
          )}
          <p className="text-sm text-muted line-clamp-3 mt-4 leading-relaxed">
            {t(lang, article.summaryEn, article.summarySi)}
          </p>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--vc-border)] text-xs text-muted">
            <span>{article.authorName}</span>
            <span className="flex items-center gap-1 font-medium" style={{ color: "var(--vc-accent)" }}>
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMin} min
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      onClick={onClick}
      onMouseEnter={prefetchCover}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group premium-card cursor-pointer"
    >
      {progress !== undefined && progress > 0 && (
        <div className="h-0.5 bg-black/5 dark:bg-white/5">
          <div className="h-full read-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="aspect-[16/10] overflow-hidden">
        <CoverImage
          src={article.coverUrl}
          alt={t(lang, article.titleEn, article.titleSi)}
          seed={article.id}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-5 sm:p-6">
        <span className="vc-section-label text-[10px]">{t(lang, cat.en, cat.si)}</span>
        <h3 className="font-display text-lg sm:text-xl font-medium mt-2 leading-snug tracking-tight group-hover:opacity-90">
          {t(lang, article.titleEn, article.titleSi)}
        </h3>
        <p className="text-xs text-muted line-clamp-2 mt-2 leading-relaxed">
          {t(lang, article.summaryEn, article.summarySi)}
        </p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--vc-border)] text-[11px] text-muted">
          <span>{article.authorName}</span>
          <span className="flex items-center gap-1 font-semibold uppercase tracking-wide" style={{ color: "var(--vc-accent)" }}>
            {t(lang, "Read", "කියවන්න")}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
