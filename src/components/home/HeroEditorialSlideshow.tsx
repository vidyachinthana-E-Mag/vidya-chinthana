import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import CoverImage from "../ui/CoverImage";
import { ArrowRight, Clock } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export default function HeroEditorialSlideshow() {
  const { lang, articles, openArticle } = useApp();
  const reduced = usePrefersReducedMotion();
  const slides = articles.slice(0, 5);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced || slides.length < 2) return;
    const tmr = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(tmr);
  }, [reduced, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[idx];

  return (
    <div className="hero-slideshow relative w-full max-w-4xl mx-auto mt-10 rounded-2xl overflow-hidden border border-[var(--vc-border)] shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.button
          key={current.id}
          type="button"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => openArticle(current)}
          className="w-full text-left cursor-pointer group block"
        >
          <div className="relative aspect-[21/9] overflow-hidden">
            <CoverImage
              src={current.coverUrl}
              alt=""
              seed={current.id}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.2s]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 mb-2">
                {t(lang, "Featured story", "විශේෂ ලිපිය")}
              </p>
              <h3 className="font-display text-xl sm:text-3xl font-medium leading-tight">
                {t(lang, current.titleEn, current.titleSi)}
              </h3>
              <p className="mt-2 text-sm text-white/75 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {current.readingTimeMin} min
                <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </div>
        </motion.button>
      </AnimatePresence>
      <div className="flex justify-center gap-2 py-3 bg-black/40 backdrop-blur-sm">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === idx ? "w-8 bg-[var(--vc-accent)]" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
