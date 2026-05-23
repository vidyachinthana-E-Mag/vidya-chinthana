import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { articlesForProfile } from "../../lib/authors";

export default function FeaturedContributors() {
  const { lang, profiles, articles, openProfile } = useApp();
  const featured = profiles.filter((p) => p.featured).slice(0, 6);
  if (!featured.length) return null;

  return (
    <section className="mb-14 py-10 border-y border-[var(--vc-border)]">
      <h2 className="vc-section-label mb-6 text-center">
        {t(lang, "Editorial board & contributors", "සංස්කාරක මණ්ඩලය")}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 justify-center flex-wrap sm:flex-nowrap">
        {featured.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openProfile(p.slug)}
            className="shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl premium-card cursor-pointer w-[140px] group"
          >
            <img
              src={p.avatarUrl}
              alt=""
              className="w-16 h-16 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[var(--vc-accent)] transition-all"
              referrerPolicy="no-referrer"
            />
            <p className="text-xs font-medium text-center line-clamp-2">{t(lang, p.nameEn, p.nameSi)}</p>
            <p className="text-[10px] text-muted">
              {articlesForProfile(p, articles).length} {t(lang, "stories", "ලිපි")}
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
