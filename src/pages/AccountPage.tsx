import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import PageContainer from "../components/ui/PageContainer";
import PageHero from "../components/ui/PageHero";
import ProfileEditor from "../components/profile/ProfileEditor";
import { Bookmark, BookOpenCheck, BarChart3, User, LogOut, ExternalLink, Pencil } from "lucide-react";
import { AuthorProfile } from "../types";

export default function AccountPage() {
  const {
    lang,
    user,
    articles,
    profiles,
    completedIds,
    bookmarks,
    readProgress,
    logout,
    setPage,
    openArticle,
    openProfile,
    toggleTheme,
    theme,
    setLang,
  } = useApp();

  const [showEditor, setShowEditor] = useState(false);
  const [myProfile, setMyProfile] = useState<AuthorProfile | undefined>(() =>
    user ? profiles.find((p) => p.userId === user.id) : undefined
  );

  useEffect(() => {
    if (!user) setPage("home");
  }, [user, setPage]);

  useEffect(() => {
    if (user) setMyProfile(profiles.find((p) => p.userId === user.id));
  }, [profiles, user]);

  if (!user) return null;

  const bookmarked = articles.filter((a) => bookmarks.includes(a.id));
  const pct = articles.length
    ? Math.round((completedIds.length / articles.length) * 100)
    : 0;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const canEditProfile = ["owner", "editor", "author"].includes(user.role);

  const readingBars = articles.slice(0, 6).map((a) => ({
    id: a.id,
    title: t(lang, a.titleEn, a.titleSi).slice(0, 28),
    pct: readProgress[a.id] ?? 0,
  }));

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14 max-w-3xl">
        <PageHero
          eyebrow={t(lang, "Your account", "ඔබේ ගිණුම")}
          title={user.name}
          subtitle={`@${user.username} · ${user.role}`}
        />

        <div className="flex items-center gap-6 mb-8 p-6 premium-card">
          {myProfile ? (
            <img
              src={myProfile.avatarUrl}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover shrink-0 ring-2 ring-[var(--vc-accent)]/30"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-display font-bold text-white shrink-0"
              style={{ background: "var(--vc-accent)" }}
            >
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted capitalize">{user.role} account</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {myProfile && (
                <button
                  type="button"
                  onClick={() => openProfile(myProfile.slug)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer hover:underline"
                  style={{ color: "var(--vc-accent)" }}
                >
                  {t(lang, "View public profile", "ප්‍රසිද්ධ පැතිකඩ")}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
              {canEditProfile && (
                <button
                  type="button"
                  onClick={() => setShowEditor((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer btn-ghost py-1 px-2"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {showEditor
                    ? t(lang, "Hide editor", "සංස්කාරකය සඟවන්න")
                    : t(lang, "Edit profile", "පැතිකඩ සංස්කරණය")}
                </button>
              )}
            </div>
          </div>
          <button type="button" onClick={logout} className="btn-ghost text-red-500 border-red-500/30 shrink-0">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t(lang, "Sign out", "පිටවීම")}</span>
          </button>
        </div>

        {showEditor && canEditProfile && (
          <div className="mb-10">
            <ProfileEditor
              initial={myProfile}
              onSaved={(p) => {
                setMyProfile(p);
                setShowEditor(false);
              }}
            />
          </div>
        )}

        {readingBars.some((b) => b.pct > 0) && (
          <section className="mb-10 premium-card p-6">
            <h3 className="vc-section-label mb-4">{t(lang, "Reading activity", "කියවීම් ක්‍රියාකාරකම")}</h3>
            <div className="space-y-3">
              {readingBars
                .filter((b) => b.pct > 0)
                .map((b) => (
                  <div key={b.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate pr-4 text-muted">{b.title}…</span>
                      <span className="font-mono shrink-0">{Math.round(b.pct)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${b.pct}%`, background: "var(--vc-accent)" }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: BookOpenCheck, label: t(lang, "Completed", "අවසන්"), val: `${completedIds.length}` },
            { icon: Bookmark, label: t(lang, "Saved", "සුරකින"), val: `${bookmarks.length}` },
            { icon: BarChart3, label: t(lang, "Progress", "ප්‍රගතිය"), val: `${pct}%` },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="premium-card p-5">
              <Icon className="w-5 h-5 mb-2" style={{ color: "var(--vc-accent)" }} />
              <p className="text-2xl font-display">{val}</p>
              <p className="text-[10px] uppercase text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>

        {bookmarked.length > 0 && (
          <section className="mb-10">
            <h3 className="vc-section-label mb-4">{t(lang, "Saved articles", "සුරකින ලිපි")}</h3>
            <div className="space-y-2">
              {bookmarked.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => openArticle(a)}
                  className="w-full text-left p-4 rounded-xl premium-card cursor-pointer text-sm font-medium"
                >
                  {t(lang, a.titleEn, a.titleSi)}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="premium-card p-5">
            <p className="text-sm mb-3">{t(lang, "Theme", "තේමාව")}</p>
            <button type="button" onClick={toggleTheme} className="btn-primary text-xs">
              {theme === "dark" ? t(lang, "Light", "එළිය") : t(lang, "Dark", "අඳුරු")}
            </button>
          </div>
          <div className="premium-card p-5">
            <p className="text-sm mb-3">{t(lang, "Language", "භාෂාව")}</p>
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

        {(user.role === "owner" || user.role === "editor" || user.role === "author") && (
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => setPage("dashboard")}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              {t(lang, "Dashboard", "පුවරුව")}
            </button>
            {user.role === "owner" && (
              <button
                type="button"
                onClick={() => setPage("studio")}
                className="flex-1 btn-ghost border-[var(--vc-accent)]/40"
              >
                {t(lang, "Vidya Studio", "Vidya Studio")}
              </button>
            )}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
