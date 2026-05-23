import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { Category } from "../../types";
import { Sparkles, ArrowRight } from "lucide-react";
import CoverImage from "../ui/CoverImage";
import { CATEGORY_CONFIG } from "../../lib/categories";

const CATS: { id: Category; en: string; si: string }[] = [
  { id: "science", en: "Science", si: "විද්‍යාව" },
  { id: "education", en: "Education", si: "අධ්‍යාපනය" },
  { id: "technology", en: "Technology", si: "තාක්ෂණය" },
  { id: "scifi", en: "Sci-Fi", si: "Sci-Fi" },
];

export default function CategorySpotlight() {
  const { lang, articles, openArticle, openCategory } = useApp();
  const [cat, setCat] = useState<Category>("science");

  const pick = articles.filter((a) => a.category === cat)[0];
  if (!pick) return null;

  return (
    <section className="mb-14 sm:mb-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <h2 className="vc-section-label flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: "var(--vc-accent)" }} />
          {t(lang, "Spotlight by topic", "මාතෘකාව අනුව")}
        </h2>
        <button
          type="button"
          onClick={() => openCategory(cat)}
          className="text-xs font-semibold flex items-center gap-1 cursor-pointer"
          style={{ color: CATEGORY_CONFIG[cat].accent }}
        >
          {t(lang, "View section", "අංශය බලන්න")}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`pill text-xs capitalize ${cat === c.id ? "pill-active" : ""}`}
          >
            {t(lang, c.en, c.si)}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.button
          key={pick.id}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          onClick={() => openArticle(pick)}
          className="w-full text-left premium-card overflow-hidden cursor-pointer group p-0 grid sm:grid-cols-2"
        >
          <div className="aspect-[4/3] sm:aspect-auto sm:min-h-[220px] overflow-hidden">
            <CoverImage
              src={pick.coverUrl}
              alt=""
              seed={pick.id}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <span className="vc-section-label">{cat}</span>
            <h3 className="font-display text-xl sm:text-2xl font-medium mt-3 leading-tight">
              {t(lang, pick.titleEn, pick.titleSi)}
            </h3>
            <p className="text-sm text-muted mt-3 line-clamp-3">{t(lang, pick.summaryEn, pick.summarySi)}</p>
            <p className="mt-4 text-sm font-medium" style={{ color: "var(--vc-accent)" }}>
              {pick.authorName} · {pick.readingTimeMin} min
            </p>
          </div>
        </motion.button>
      </AnimatePresence>
    </section>
  );
}
