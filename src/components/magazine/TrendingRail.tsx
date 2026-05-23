import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { Flame, Clock } from "lucide-react";

export default function TrendingRail() {
  const { lang, articles, openArticle, readProgress } = useApp();

  const trending = [...articles]
    .sort((a, b) => {
      const scoreA = (readProgress[a.id] ?? 0) + a.readingTimeMin + (a.comments?.length ?? 0) * 10;
      const scoreB = (readProgress[b.id] ?? 0) + b.readingTimeMin + (b.comments?.length ?? 0) * 10;
      return scoreB - scoreA;
    })
    .slice(0, 8);

  if (trending.length < 2) return null;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="vc-section-label flex items-center gap-2">
          <Flame className="w-4 h-4" style={{ color: "var(--vc-accent)" }} />
          {t(lang, "Trending now", "දැන් ජනප්‍රිය")}
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {trending.map((art, i) => (
          <motion.button
            key={art.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            onClick={() => openArticle(art)}
            className="snap-start shrink-0 w-[260px] sm:w-[280px] text-left premium-card overflow-hidden cursor-pointer group p-0"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={art.coverUrl}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <div className="p-4">
              <p className="text-[10px] uppercase text-muted">{art.category}</p>
              <p className="font-display text-sm font-medium mt-1 line-clamp-2 leading-snug">
                {t(lang, art.titleEn, art.titleSi)}
              </p>
              <p className="text-[11px] text-muted mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {art.readingTimeMin} min
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
