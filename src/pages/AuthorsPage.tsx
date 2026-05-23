import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import { usePageMeta } from "../hooks/usePageMeta";
import PageContainer from "../components/ui/PageContainer";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/motion/Reveal";
import { articlesForProfile } from "../lib/authors";
import { Award, ArrowRight, Search } from "lucide-react";
import SocialLinks from "../components/profile/SocialLinks";
import { hasPublicSocial } from "../lib/social";

export default function AuthorsPage() {
  const { lang, profiles, articles, openProfile } = useApp();
  const [q, setQ] = useState("");

  const sorted = useMemo(() => {
    const list = [...profiles].sort((a, b) => Number(b.featured) - Number(a.featured));
    const query = q.toLowerCase().trim();
    if (!query) return list;
    return list.filter(
      (p) =>
        p.nameEn.toLowerCase().includes(query) ||
        p.nameSi.includes(query) ||
        p.expertise.some((e) => e.toLowerCase().includes(query))
    );
  }, [profiles, q]);

  const authorsMeta = useMemo(
    () => ({
      title: t(lang, "Contributors", "සහයෝගීන්"),
      description: t(
        lang,
        "Meet the minds behind Vidya Chinthana.",
        "විද්‍යා චින්තනය පිටු පිටුවට ගෙන එන මනස්."
      ),
      path: "/authors",
    }),
    [lang]
  );
  usePageMeta(authorsMeta);

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14">
        <PageHero
          eyebrow={t(lang, "The newsroom", "ප්‍රවෘත්ති කාමරය")}
          title={t(lang, "Contributors & scholars", "සහයෝගීන් සහ විද්වතුන්")}
          subtitle={t(
            lang,
            "Meet the minds behind Vidya Chinthana — scientists, educators, and storytellers.",
            "විද්‍යා චින්තනය පිටු පිටුවට ගෙන එන මනස්."
          )}
        />

        <div className="relative max-w-md mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(lang, "Search contributors...", "සහයෝගීන් සොයන්න...")}
            className="input-premium"
          />
        </div>

        {sorted.length === 0 ? (
          <p className="text-center py-16 text-muted">{t(lang, "No contributors found.", "සහයෝගීන් නැත.")}</p>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sorted.map((p, i) => {
            const count = articlesForProfile(p, articles).length;
            return (
              <Reveal key={p.id} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => openProfile(p.slug)}
                  className="w-full text-left premium-card overflow-hidden cursor-pointer group"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={p.coverUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {p.featured && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-black/60 text-amber-300">
                        <Award className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex gap-4">
                    <img
                      src={p.avatarUrl}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover -mt-10 ring-4 ring-[var(--vc-paper)] dark:ring-[#141414] shrink-0 relative z-10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="font-display font-medium text-lg leading-tight group-hover:opacity-90">
                        {t(lang, p.nameEn, p.nameSi)}
                      </p>
                      <p className="text-xs text-muted mt-1 line-clamp-2">
                        {t(lang, p.titleEn, p.titleSi)}
                      </p>
                      <p className="text-[10px] text-muted mt-3 flex items-center gap-1" style={{ color: "var(--vc-accent)" }}>
                        {count} {t(lang, "articles", "ලිපි")}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </p>
                      {hasPublicSocial(p.social) && (
                        <div
                          className="mt-3"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          role="presentation"
                        >
                          <SocialLinks social={p.social} lang={lang} size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
        )}
      </PageContainer>
    </div>
  );
}
