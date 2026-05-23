import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { categoryMeta, t } from "../../lib/labels";
import { Article } from "../../types";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import CoverImage from "../ui/CoverImage";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export default function MagazineFront({
  articles,
  onOpen,
}: {
  articles: Article[];
  onOpen: (a: Article) => void;
}) {
  const { lang, issues } = useApp();
  const reduced = usePrefersReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = parallaxRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const shift = Math.min(48, Math.max(0, -rect.top * 0.12));
      el.style.setProperty("--magazine-parallax", `${shift}px`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  if (articles.length < 2) return null;

  const lead = articles[0];
  const secondary = articles.slice(1, 4);
  const leadCat = categoryMeta[lead.category];
  const issue = lead.issueId ? issues.find((i) => i.id === lead.issueId) : undefined;

  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true } as const,
      };

  const sideMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x: 12 } as const,
          whileInView: { opacity: 1, x: 0 } as const,
          viewport: { once: true } as const,
          transition: { delay: i * 0.08 } as const,
        };

  return (
    <section className="mb-14 sm:mb-20 newspaper-front-page" aria-labelledby="magazine-front-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 id="magazine-front-heading" className="vc-section-label flex items-center gap-2">
            <BookOpen className="w-4 h-4" aria-hidden />
            {t(lang, "Front page", "මුහුණු පිට")}
          </h2>
          {issue && (
            <p className="mt-2 text-sm text-muted">
              {t(lang, `Vol ${issue.volume} · Issue ${issue.number}`, `කලාප ${issue.volume} · #${issue.number}`)}
              {" · "}
              {t(lang, issue.titleEn, issue.titleSi)}
            </p>
          )}
        </div>
        <p className="text-xs text-muted max-w-xs sm:text-right">
          {t(lang, "Editor’s pick — tap any story to read", "සංස්කාරක තේරීම — කියවීමට තට්ටු කරන්න")}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
        <motion.button
          type="button"
          {...motionProps}
          onClick={() => onOpen(lead)}
          className="lg:col-span-7 group text-left premium-card overflow-hidden cursor-pointer p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vc-accent)] magazine-cover-story"
        >
          <div
            ref={parallaxRef}
            className={`relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden magazine-cover-parallax ${reduced ? "" : ""}`}
          >
            <CoverImage
              src={lead.coverUrl}
              alt={t(lang, lead.titleEn, lead.titleSi)}
              seed={lead.id}
              className={`w-full h-full object-cover magazine-cover-parallax-media ${reduced ? "" : "transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"}`}
              loading="eager"
              fetchPriority="high"
            />
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/25 to-black/5"
              aria-hidden
            />
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
              <span className="vc-section-label text-white/90 drop-shadow-sm">
                {t(lang, "Cover story", "මුහුණු කථාව")}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-wrap items-center gap-2">
              <span
                className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full text-white/95 backdrop-blur-sm"
                style={{ background: "color-mix(in srgb, var(--vc-accent) 75%, transparent)" }}
              >
                {t(lang, leadCat.en, leadCat.si)}
              </span>
              {issue && (
                <span className="text-[10px] uppercase tracking-wider text-white/80 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                  Vol {issue.volume} · #{issue.number}
                </span>
              )}
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <span className="vc-section-label">{t(lang, "Lead story", "ප්‍රධාන ලිපිය")}</span>
            <h3 className="font-display text-2xl sm:text-4xl font-medium leading-[1.1] mt-3 tracking-tight group-hover:opacity-90">
              {t(lang, lead.titleEn, lead.titleSi)}
            </h3>
            <p className="mt-4 text-muted line-clamp-3 leading-relaxed">{t(lang, lead.summaryEn, lead.summarySi)}</p>
            <p className="mt-5 flex flex-wrap items-center gap-2 text-sm font-medium" style={{ color: "var(--vc-accent)" }}>
              <Clock className="w-4 h-4 shrink-0" aria-hidden />
              <span>
                {lead.readingTimeMin} {t(lang, "min", "මිනි")} · {lead.authorName}
              </span>
              <span className="inline-flex items-center gap-1 ml-auto sm:ml-2">
                {t(lang, "Read story", "ලිපිය කියවන්න")}
                <ArrowRight className={`w-4 h-4 ${reduced ? "" : "group-hover:translate-x-1 transition-transform"}`} aria-hidden />
              </span>
            </p>
          </div>
        </motion.button>

        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
          {secondary.map((art, i) => {
            const cat = categoryMeta[art.category];
            return (
              <motion.button
                key={art.id}
                type="button"
                {...sideMotion(i)}
                onClick={() => onOpen(art)}
                className="group flex gap-4 p-4 premium-card text-left cursor-pointer flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vc-accent)]"
              >
                <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden shrink-0">
                  <CoverImage
                    src={art.coverUrl}
                    alt={t(lang, art.titleEn, art.titleSi)}
                    seed={art.id}
                    className={`w-full h-full object-cover ${reduced ? "" : "group-hover:scale-105 transition-transform duration-500"}`}
                  />
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-muted">{t(lang, cat.en, cat.si)}</span>
                  <h3 className="font-display text-base sm:text-lg font-medium leading-snug mt-1 line-clamp-2 group-hover:opacity-90">
                    {t(lang, art.titleEn, art.titleSi)}
                  </h3>
                  <p className="text-[11px] text-muted mt-2 flex items-center gap-1.5">
                    {art.authorName}
                    <span aria-hidden>·</span>
                    {art.readingTimeMin} {t(lang, "min", "මිනි")}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
