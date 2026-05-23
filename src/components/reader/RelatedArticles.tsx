import { useApp } from "../../context/AppContext";
import { categoryMeta, t } from "../../lib/labels";
import { Article } from "../../types";
import Reveal from "../motion/Reveal";
import CoverImage from "../ui/CoverImage";

export default function RelatedArticles({
  current,
  articles,
}: {
  current: Article;
  articles: Article[];
}) {
  const { lang, openArticle } = useApp();

  const related = articles
    .filter((a) => a.id !== current.id && a.category === current.category)
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section className="mt-20 pt-12 border-t border-[var(--vc-border)]">
      <h3 className="vc-section-label mb-6">{t(lang, "Continue exploring", "තවත් කියවන්න")}</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {related.map((a, i) => (
          <Reveal key={a.id} delay={i * 0.06}>
            <button
              type="button"
              onClick={() => openArticle(a)}
              className="w-full text-left premium-card overflow-hidden cursor-pointer group p-0"
            >
              <div className="h-32 overflow-hidden">
                <CoverImage
                  src={a.coverUrl}
                  alt={t(lang, a.titleEn, a.titleSi)}
                  seed={a.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase text-muted">
                  {t(lang, categoryMeta[a.category].en, categoryMeta[a.category].si)}
                </p>
                <p className="font-display text-sm font-medium mt-1 line-clamp-2">
                  {t(lang, a.titleEn, a.titleSi)}
                </p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
