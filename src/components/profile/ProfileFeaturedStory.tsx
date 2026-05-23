import { motion } from "motion/react";
import { Clock, ArrowRight } from "lucide-react";
import { Article } from "../../types";
import { Lang, t } from "../../lib/labels";

export default function ProfileFeaturedStory({
  article,
  lang,
  onOpen,
}: {
  article: Article;
  lang: Lang;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onOpen}
      className="profile-featured-story w-full text-left premium-card overflow-hidden cursor-pointer group p-0 mb-10"
    >
      <div className="grid md:grid-cols-5 gap-0">
        <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:min-h-[220px] overflow-hidden">
          <img
            src={article.coverUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
          <span className="vc-section-label">
            {t(lang, "Signature story", "විශේෂාංග ලිපිය")}
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-medium mt-3 leading-tight group-hover:opacity-90">
            {t(lang, article.titleEn, article.titleSi)}
          </h2>
          <p className="text-sm text-muted mt-3 line-clamp-3 leading-relaxed">
            {t(lang, article.summaryEn, article.summarySi)}
          </p>
          <p
            className="mt-5 flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--vc-accent)" }}
          >
            <Clock className="w-4 h-4" />
            {article.readingTimeMin} min
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>
    </motion.button>
  );
}
