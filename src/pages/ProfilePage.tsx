import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { findProfileBySlug } from "../lib/authors";
import { profileArticleStats } from "../lib/profileStats";
import { t } from "../lib/labels";
import { normalizeAuthorSocial } from "../lib/social";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePageMeta } from "../hooks/usePageMeta";
import { absoluteImage, buildProfileJsonLd } from "../lib/pageMeta";
import PageContainer from "../components/ui/PageContainer";
import ArticleCard from "../components/ui/ArticleCard";
import Reveal from "../components/motion/Reveal";
import ProfileSocialBar from "../components/profile/ProfileSocialBar";
import ProfileFeaturedStory from "../components/profile/ProfileFeaturedStory";
import ProfileInsights from "../components/profile/ProfileInsights";
import ProfileContactCard from "../components/profile/ProfileContactCard";
import CoverImage from "../components/ui/CoverImage";
import SciFiHero3D from "../components/effects/SciFiHero3D";
import AntigravityCanvas from "../components/effects/AntigravityCanvas";
import { useMotionEffects } from "../hooks/useMotionEffects";
import {
  ArrowLeft,
  MapPin,
  BookOpen,
  Award,
  Filter,
  Sparkles,
} from "lucide-react";

type ProfileTab = "articles" | "about" | "connect";

export default function ProfilePage() {
  const {
    lang,
    profiles,
    activeProfileSlug,
    articles,
    openArticle,
    openProfile,
    setPage,
    readProgress,
    notify,
    siteConfig,
  } = useApp();

  const [tab, setTab] = useState<ProfileTab>("articles");
  const [catFilter, setCatFilter] = useState<string>("all");

  const profile = activeProfileSlug
    ? findProfileBySlug(activeProfileSlug, profiles)
    : undefined;

  const profileTitle = profile ? t(lang, profile.nameEn, profile.nameSi) : null;
  useDocumentTitle(profileTitle);

  usePageMeta(
    profile
      ? {
          title: profileTitle ?? profile.nameEn,
          description: t(lang, profile.bioEn, profile.bioSi).slice(0, 160),
          path: `/profile/${profile.slug}`,
          image: absoluteImage(profile.avatarUrl || profile.coverUrl),
          ogType: "profile",
          jsonLd: buildProfileJsonLd(profile, lang),
        }
      : { title: t(lang, "Contributor", "ලේඛක"), path: "/authors" }
  );

  const stats = useMemo(
    () => (profile ? profileArticleStats(profile, articles) : null),
    [profile, articles]
  );

  const filteredArticles = useMemo(() => {
    if (!stats) return [];
    if (catFilter === "all") return stats.articles;
    return stats.articles.filter((a) => a.category === catFilter);
  }, [stats, catFilter]);

  const categories = useMemo(
    () => stats?.categories.map(([c]) => c) ?? [],
    [stats]
  );

  if (!profile || !stats) {
    return (
      <PageContainer className="py-24 text-center">
        <p className="text-muted text-lg">{t(lang, "Profile not found.", "පැතිකඩ හමු නොවීය.")}</p>
        <button type="button" onClick={() => setPage("authors")} className="btn-primary mt-8">
          {t(lang, "All contributors", "සියලු ලේඛකයින්")}
        </button>
      </PageContainer>
    );
  }

  const shareProfile = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/profile/${profile.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: t(lang, profile.nameEn, profile.nameSi),
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        notify(t(lang, "Profile link copied!", "පැතිකඩ සබැඳිය පිටපත් කළා!"));
      }
    } catch {
      /* cancelled */
    }
  };

  const social = normalizeAuthorSocial(profile.social);
  const reducedMotion = useMotionEffects(siteConfig.effects.reducedMotion);
  const profileName = t(lang, profile.nameEn, profile.nameSi);

  return (
    <div className="page-enter profile-page profile-page--advanced">
      <div className="profile-hero relative h-64 sm:h-80 overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <CoverImage
            src={profile.coverUrl}
            alt={profileName}
            seed={`cover-${profile.slug}`}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>
        {reducedMotion ? (
          <AntigravityCanvas className="opacity-40 mix-blend-screen" intensity={0.5} />
        ) : (
          <SciFiHero3D
            variant="profile"
            className="opacity-35 mix-blend-screen"
            intensity={0.5}
            fallbackIntensity={0.5}
          />
        )}
        <div className="profile-hero-overlay absolute inset-0" />
        <PageContainer className="absolute inset-0 flex flex-col justify-end pb-8 z-10">
          <button
            type="button"
            onClick={() => setPage("authors")}
            className="flex items-center gap-2 text-sm text-white/85 mb-auto pt-6 cursor-pointer hover:text-white w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(lang, "Contributors", "සහයෝගීන්")}
          </button>
          <div className="flex flex-wrap items-end gap-4">
            <CoverImage
              src={profile.avatarUrl}
              alt={profileName}
              seed={profile.slug}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl"
              loading="eager"
            />
            <div className="text-white min-w-0 flex-1">
              {profile.featured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-2">
                  <Award className="w-3 h-3" />
                  {t(lang, "Featured", "විශේෂාංග")}
                </span>
              )}
              <h1 className="font-display text-2xl sm:text-4xl font-medium tracking-tight leading-tight">
                {t(lang, profile.nameEn, profile.nameSi)}
              </h1>
              <p className="text-sm sm:text-base text-white/75 mt-1">
                {t(lang, profile.titleEn, profile.titleSi)}
              </p>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="pb-24 pt-8 sm:pt-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="hidden lg:block lg:col-span-4">
            <Reveal>
              <CoverImage
                src={profile.avatarUrl}
                alt={profileName}
                seed={profile.slug}
                className="w-full max-w-[280px] aspect-square rounded-2xl object-cover shadow-xl mb-6"
              />
              <ProfileContactCard
                social={social}
                lang={lang}
                name={t(lang, profile.nameEn, profile.nameSi)}
                onShare={shareProfile}
                onCopied={(msg) => notify(msg)}
              />
            </Reveal>
          </div>

          <div className="lg:col-span-8 min-w-0">
            <Reveal>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="w-4 h-4" style={{ color: "var(--vc-accent)" }} />
                  {t(lang, profile.locationEn, profile.locationSi)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[11px] border border-[var(--vc-border)] bg-black/[0.03] dark:bg-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="lg:hidden mb-6">
                <ProfileSocialBar social={social} lang={lang} onShare={shareProfile} />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: t(lang, "Articles", "ලිපි"), val: stats.count },
                  { label: t(lang, "Read time", "මිනිත්තු"), val: `${stats.totalMin}m` },
                  { label: t(lang, "Topics", "මාතෘකා"), val: categories.length },
                ].map(({ label, val }) => (
                  <div key={label} className="premium-card p-4 text-center">
                    <p className="text-2xl font-display font-medium" style={{ color: "var(--vc-accent)" }}>
                      {val}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-muted mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="flex gap-1 sm:gap-2 border-b border-[var(--vc-border)] overflow-x-auto scrollbar-hide">
              {(
                [
                  { id: "articles" as const, en: "Published work", si: "ප්‍රකාශිත" },
                  { id: "about" as const, en: "About", si: "පිළිබඳ" },
                  { id: "connect" as const, en: "Connect", si: "සම්බන්ධ" },
                ] as const
              ).map(({ id, en, si }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`shrink-0 px-4 py-3 text-sm font-medium cursor-pointer border-b-2 -mb-px transition-colors ${
                    tab === id ? "border-[var(--vc-accent)]" : "border-transparent text-muted"
                  }`}
                  style={tab === id ? { color: "var(--vc-accent)" } : {}}
                >
                  {t(lang, en, si)}
                </button>
              ))}
            </div>

            {tab === "connect" && (
              <Reveal>
                <div className="mt-8 lg:hidden">
                  <ProfileContactCard
                    social={social}
                    lang={lang}
                    name={t(lang, profile.nameEn, profile.nameSi)}
                    onShare={shareProfile}
                    onCopied={(msg) => notify(msg)}
                  />
                </div>
                <p className="hidden lg:block mt-8 text-sm text-muted premium-card p-6">
                  {t(
                    lang,
                    "WhatsApp, Facebook, Instagram, and share options are in the contact card on the left.",
                    "වම් පැති එකෙන් WhatsApp, Facebook, Instagram සහ බෙදාගැනීම භාවිතා කරන්න."
                  )}
                </p>
              </Reveal>
            )}

            {tab === "about" && (
              <Reveal>
                <div className="mt-8 premium-card p-6 sm:p-8">
                  <h3 className="vc-section-label flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4" />
                    {t(lang, "Biography", "ජීවන තොරතුරු")}
                  </h3>
                  <p className="text-lg leading-relaxed text-muted">
                    {t(lang, profile.bioEn, profile.bioSi)}
                  </p>
                  <p className="mt-6 pt-6 border-t border-[var(--vc-border)] text-sm text-muted">
                    {t(lang, siteConfig.branding.siteNameEn, siteConfig.branding.siteNameSi)} —{" "}
                    {t(lang, "contributor since 2026", "2026 සිට සහයෝගී")}
                  </p>
                </div>
                <ProfileInsights
                  lang={lang}
                  categories={stats.categories}
                  totalMin={stats.totalMin}
                  articleCount={stats.count}
                />
              </Reveal>
            )}

            {tab === "articles" && (
              <>
                {stats.featured && (
                  <div className="mt-8">
                    <ProfileFeaturedStory
                      article={stats.featured}
                      lang={lang}
                      onOpen={() => openArticle(stats.featured!)}
                    />
                  </div>
                )}
                <ProfileInsights
                  lang={lang}
                  categories={stats.categories}
                  totalMin={stats.totalMin}
                  articleCount={stats.count}
                />
                {categories.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-6 items-center">
                    <Filter className="w-4 h-4 text-muted" />
                    <button
                      type="button"
                      onClick={() => setCatFilter("all")}
                      className={`pill text-xs ${catFilter === "all" ? "pill-active" : ""}`}
                    >
                      {t(lang, "All", "සියල්ල")}
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCatFilter(c)}
                        className={`pill text-xs capitalize ${catFilter === c ? "pill-active" : ""}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
                <section className="stagger-grid">
                  {filteredArticles.length === 0 ? (
                    <p className="text-muted py-12 text-center">
                      {t(lang, "No articles in this topic.", "ලිපි නැත.")}
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                      {filteredArticles.map((art, i) => (
                        <Reveal key={art.id} delay={i * 0.05}>
                          <ArticleCard
                            article={art}
                            lang={lang}
                            onClick={() => openArticle(art)}
                            progress={readProgress[art.id]}
                          />
                        </Reveal>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>

        {profiles.filter((p) => p.id !== profile.id).length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--vc-border)]">
            <h3 className="vc-section-label mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t(lang, "More from the newsroom", "තවත් ලේඛකයින්")}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {profiles
                .filter((p) => p.id !== profile.id)
                .slice(0, 4)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openProfile(p.slug)}
                    className="premium-card p-4 text-left cursor-pointer flex items-center gap-3 group"
                  >
                    <img
                      src={p.avatarUrl}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate group-hover:opacity-80">
                        {t(lang, p.nameEn, p.nameSi)}
                      </p>
                      <p className="text-[10px] text-muted truncate">{p.titleEn}</p>
                    </div>
                  </button>
                ))}
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}
