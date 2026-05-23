import React from "react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import PageContainer from "../components/ui/PageContainer";
import PageHero from "../components/ui/PageHero";
import { Bookmark, BookOpenCheck, BarChart3, Clock, Palette } from "lucide-react";

export default function DashboardPage() {
  const {
    lang,
    user,
    articles,
    completedIds,
    bookmarks,
    readProgress,
    toggleTheme,
    theme,
    openArticle,
    setLang,
    setPage,
  } = useApp();

  if (!user) return null;

  const bookmarked = articles.filter((a) => bookmarks.includes(a.id));
  const inProgress = articles
    .filter((a) => {
      const p = readProgress[a.id] ?? 0;
      return p > 0 && p < 100 && !completedIds.includes(a.id);
    })
    .slice(0, 5);
  const pct = articles.length
    ? Math.round((completedIds.length / articles.length) * 100)
    : 0;

  const estMinutes = articles.reduce((sum, a) => {
    const p = readProgress[a.id] ?? 0;
    return sum + Math.round((a.readingTimeMin * p) / 100);
  }, 0);

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14 max-w-3xl">
        <PageHero
          eyebrow={t(lang, "Your space", "ඔබේ අවකාශය")}
          title={t(lang, "Dashboard", "පුවරුව")}
          subtitle={`${user.name} · ${user.role}`}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpenCheck, label: t(lang, "Read", "කියවා"), val: `${completedIds.length}/${articles.length}` },
            { icon: Bookmark, label: t(lang, "Saved", "සුරකින"), val: String(bookmarks.length) },
            { icon: BarChart3, label: t(lang, "Progress", "ප්‍රගතිය"), val: `${pct}%` },
            { icon: Clock, label: t(lang, "Reading time", "කියවීම"), val: `${estMinutes}m` },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="premium-card p-5 sm:p-6">
              <Icon className="w-5 h-5 mb-3" style={{ color: "var(--vc-accent)" }} />
              <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
              <p className="text-2xl font-display font-medium mt-1">{val}</p>
            </div>
          ))}
        </div>

        {user.role === "owner" && (
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setPage("admin")}
              className="p-6 rounded-[var(--vc-radius)] premium-card text-left cursor-pointer"
            >
              <p className="font-display text-lg font-medium flex items-center gap-2">
                <Palette className="w-5 h-5" style={{ color: "var(--vc-accent)" }} />
                {t(lang, "Admin Center", "Admin Center")}
              </p>
              <p className="text-sm text-muted mt-2">
                {t(lang, "SEO, users, features, system", "SEO, users, features")}
              </p>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setPage("studio")}
              className="p-6 rounded-[var(--vc-radius)] premium-card text-left cursor-pointer"
            >
              <p className="font-display text-lg font-medium">{t(lang, "Design Studio", "Design Studio")}</p>
              <p className="text-sm text-muted mt-2">{t(lang, "Visual editor", "දෘශ්‍ය සංස්කාරකය")}</p>
            </motion.button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="premium-card p-5 flex justify-between items-center">
            <span className="text-sm">{t(lang, "Theme", "තේමාව")}</span>
            <button type="button" onClick={toggleTheme} className="btn-primary text-xs py-2">
              {theme === "dark" ? t(lang, "Light", "එළිය") : t(lang, "Dark", "අඳුරු")}
            </button>
          </div>
          <div className="premium-card p-5">
            <span className="text-sm block mb-3">{t(lang, "Language", "භාෂාව")}</span>
            <div className="flex gap-1">
              {(["EN", "SI", "BILINGUAL"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`pill text-[10px] ${lang === l ? "pill-active" : ""}`}
                >
                  {l === "BILINGUAL" ? "Both" : l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {inProgress.length > 0 && (
          <section className="mt-12">
            <h2 className="vc-section-label mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t(lang, "In progress", "කියවමින්")}
            </h2>
            <div className="space-y-3">
              {inProgress.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => openArticle(a)}
                  className="w-full text-left p-5 rounded-2xl premium-card cursor-pointer"
                >
                  <p className="text-sm font-medium">{t(lang, a.titleEn, a.titleSi)}</p>
                  <div className="mt-3 h-1 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div className="h-full read-progress-bar" style={{ width: `${readProgress[a.id]}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {bookmarked.length > 0 && (
          <section className="mt-12">
            <h2 className="vc-section-label mb-4">{t(lang, "Bookmarks", "සුරකින ලද")}</h2>
            <div className="space-y-3">
              {bookmarked.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => openArticle(a)}
                  className="w-full text-left p-5 rounded-2xl premium-card cursor-pointer text-sm font-medium"
                >
                  {t(lang, a.titleEn, a.titleSi)}
                </button>
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}
