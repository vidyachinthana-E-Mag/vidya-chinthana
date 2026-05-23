import React, { useState } from "react";
import { motion } from "motion/react";
import { Page, useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import PageContainer from "../ui/PageContainer";
import {
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
} from "lucide-react";
import { CATEGORY_CONFIG, CATEGORY_IDS } from "../../lib/categories";

export default function Footer() {
  const { lang, siteConfig: sc, setPage, openCategory, openIssuesIndex, notify, user } = useApp();
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    notify(t(lang, "Thanks — we will be in touch.", "ස්තූතියි — අපි සම්බන්ධ වෙමු."));
    setEmail("");
  };

  return (
    <footer className="footer-premium relative mt-24 sm:mt-32">
      <div className="footer-premium-glow" aria-hidden />

      <PageContainer wide className="relative pt-16 sm:pt-20 pb-8">
        <div className="footer-cta-band premium-card p-8 sm:p-10 mb-14 sm:mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="vc-section-label flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" style={{ color: "var(--vc-accent)" }} />
              {t(lang, "Stay curious", "උනන්දුව තබා ගන්න")}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">
              {t(lang, "Never miss an issue.", "කලාපයක්වත් මග හරි නොකරන්න.")}
            </h3>
            <p className="text-sm text-muted mt-2 max-w-md">
              {t(lang, sc.footer.textEn, sc.footer.textSi)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openIssuesIndex()}
              className="btn-ghost flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              {t(lang, "Browse issues", "කලාප")}
            </button>
            <button
              type="button"
              onClick={() => (user ? setPage("dashboard") : setPage("login"))}
              className="btn-primary flex items-center gap-2"
            >
              {user ? t(lang, "Dashboard", "පුවරුව") : t(lang, "Sign in", "පිවිසෙන්න")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {sc.admin.media.logoUrl ? (
                <img
                  src={sc.admin.media.logoUrl}
                  alt=""
                  className="w-11 h-11 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-white text-lg"
                  style={{ background: "var(--vc-accent)" }}
                >
                  V
                </div>
              )}
              <div>
                <p className="font-display text-xl font-medium leading-tight">
                  {t(lang, sc.branding.siteNameEn, sc.branding.siteNameSi)}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">
                  {t(lang, sc.branding.taglineEn, sc.branding.taglineSi)}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              {t(lang, sc.footer.textEn, sc.footer.textSi)}
            </p>
            <form onSubmit={subscribe} className="mt-6 flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t(lang, "Email for updates", "email")}
                className="input-premium flex-1 text-xs py-2.5"
                aria-label="Newsletter email"
              />
              <button type="submit" className="btn-primary text-xs py-2.5 px-4 shrink-0">
                {t(lang, "Join", "එක් වන්න")}
              </button>
            </form>
          </div>

          <div>
            <p className="footer-col-title">{t(lang, "Explore", "ගවේෂණය")}</p>
            <ul className="space-y-2.5 text-sm">
              {sc.navItems
                .filter((n) => n.visible)
                .map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setPage(n.page as Page)}
                      className="footer-link"
                    >
                      {t(lang, n.labelEn, n.labelSi)}
                    </button>
                  </li>
                ))}
              <li>
                <button type="button" onClick={() => setPage("login")} className="footer-link">
                  {t(lang, "Sign in", "පිවිසෙන්න")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">{t(lang, "Topics", "මාතෘකා")}</p>
            <ul className="space-y-2.5 text-sm">
              {CATEGORY_IDS.map((id) => (
                <li key={id}>
                  <button type="button" onClick={() => openCategory(id)} className="footer-link flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: CATEGORY_CONFIG[id].accent }}
                    />
                    {t(lang, CATEGORY_CONFIG[id].labelEn, CATEGORY_CONFIG[id].labelSi)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-col-title">{t(lang, "Legal", "නීති")}</p>
            <ul className="space-y-2.5 text-sm mb-6">
              <li>
                <button type="button" onClick={() => setPage("privacy")} className="footer-link">
                  {t(lang, "Privacy", "පෞද්ගලිකත්ව")}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setPage("terms")} className="footer-link">
                  {t(lang, "Terms", "නියම")}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setPage("about")} className="footer-link">
                  {t(lang, "About", "අප ගැන")}
                </button>
              </li>
            </ul>
            <p className="footer-col-title">{t(lang, "Connect", "සම්බන්ධ")}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {sc.admin.social.contactEmail && (
                <a href={`mailto:${sc.admin.social.contactEmail}`} className="footer-social" aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {sc.admin.social.twitter && (
                <a href={sc.admin.social.twitter} target="_blank" rel="noreferrer" className="footer-social" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {sc.admin.social.facebook && (
                <a href={sc.admin.social.facebook} target="_blank" rel="noreferrer" className="footer-social" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {sc.admin.social.instagram && (
                <a href={sc.admin.social.instagram} target="_blank" rel="noreferrer" className="footer-social" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {sc.admin.social.youtube && (
                <a href={sc.admin.social.youtube} target="_blank" rel="noreferrer" className="footer-social" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 pt-8 border-t border-[var(--vc-border)] flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider text-muted">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              © {new Date().getFullYear()} Vidya Chinthana
            </span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span>{t(lang, "Sri Lanka", "ශ්‍රී ලංකාව")}</span>
            <span className="footer-badge">{t(lang, "Bilingual", "ද්විභාෂා")}</span>
            <span className="footer-badge">PWA-ready</span>
          </div>
          <p className="text-[10px] text-muted">
            {t(lang, "Crafted for curious minds.", "උනන්දු මනස් සඳහා.")}
          </p>
        </motion.div>
      </PageContainer>
    </footer>
  );
}
