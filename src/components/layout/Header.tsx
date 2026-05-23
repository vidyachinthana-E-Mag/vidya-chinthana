import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { Menu, Moon, Sun, X, Palette } from "lucide-react";
import { Page } from "../../context/AppContext";
import { motion } from "motion/react";

export default function Header({ onAuthOpen }: { onAuthOpen?: () => void }) {
  const { lang, setLang, theme, toggleTheme, page, setPage, user, logout, siteConfig } =
    useApp();
  const goLogin = () => {
    setPage("login");
    onAuthOpen?.();
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sc = siteConfig;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: Page | string) => {
    setPage(id);
    setMenuOpen(false);
  };

  const visibleNav = sc.navItems.filter((n) => n.visible);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "glass-panel border-[var(--vc-border)] shadow-sm shadow-black/[0.04]" : "border-transparent bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => go("home")}
          className="flex items-center gap-3 cursor-pointer"
          aria-label="Home"
        >
          {sc.admin.media.logoUrl ? (
            <img
              src={sc.admin.media.logoUrl}
              alt=""
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-display font-semibold text-sm text-white"
              style={{ background: "var(--vc-accent)" }}
            >
              V
            </div>
          )}
          <div className="text-left hidden sm:block">
            <p className="font-display text-sm font-medium tracking-tight leading-none">
              {t(lang, sc.branding.siteNameEn, sc.branding.siteNameSi)}
            </p>
            <p className="text-[10px] text-muted tracking-wide mt-0.5">
              {t(lang, sc.branding.taglineEn, sc.branding.taglineSi)}
            </p>
          </div>
        </motion.button>

        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main">
          {visibleNav.map((item) => {
            const pid = item.page;
            const isActive =
              pid.startsWith("page:")
                ? page === "page"
                : page === pid;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(pid)}
                className={`px-3.5 py-2 text-sm rounded-full transition-colors cursor-pointer relative ${
                  isActive ? "font-medium" : "text-muted hover:text-[var(--vc-ink)] dark:hover:text-[#f5f5f7]"
                }`}
                style={isActive ? { color: "var(--vc-accent)" } : {}}
              >
                {t(lang, item.labelEn, item.labelSi)}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{ background: "color-mix(in srgb, var(--vc-accent) 12%, transparent)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
          {user && (
            <button type="button" onClick={() => go("dashboard")} className={`px-3.5 py-2 text-sm rounded-full cursor-pointer ${page === "dashboard" ? "font-medium" : "text-muted"}`} style={page === "dashboard" ? { color: "var(--vc-accent)" } : {}}>
              {t(lang, "Dashboard", "පුවරුව")}
            </button>
          )}
          {(user?.role === "owner" || user?.role === "editor" || user?.role === "author") && (
            <button type="button" onClick={() => go("cms")} className={`px-3.5 py-2 text-sm rounded-full cursor-pointer ${page === "cms" ? "font-medium" : "text-muted"}`} style={page === "cms" ? { color: "var(--vc-accent)" } : {}}>
              CMS
            </button>
          )}
          {user?.role === "owner" && (
            <>
              <button
                type="button"
                onClick={() => go("admin")}
                className={`px-3.5 py-2 text-sm rounded-full cursor-pointer font-medium ${
                  page === "admin" ? "" : "text-muted"
                }`}
                style={page === "admin" ? { color: "var(--vc-accent)" } : {}}
              >
                Admin
              </button>
              <button type="button" onClick={() => go("studio")} className="btn-primary text-xs py-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Studio
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-full p-0.5 border border-[var(--vc-border)] text-[10px] font-semibold">
            {(["EN", "SI", "BILINGUAL"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                  lang === l ? "text-white" : "text-muted"
                }`}
                style={lang === l ? { background: "var(--vc-accent)" } : {}}
              >
                {l === "BILINGUAL" ? "Both" : l}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full border border-[var(--vc-border)] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => go("account")}
                className={`px-3 py-2 text-sm rounded-full cursor-pointer ${page === "account" ? "font-medium" : "text-muted"}`}
                style={page === "account" ? { color: "var(--vc-accent)" } : {}}
              >
                {user.name.split(" ")[0]}
              </button>
              <button type="button" onClick={logout} className="text-xs text-muted hover:opacity-80 cursor-pointer px-2">
                {t(lang, "Out", "පිට")}
              </button>
            </div>
          ) : (
            <button type="button" onClick={goLogin} className="hidden sm:block btn-primary text-xs py-2">
              {t(lang, "Sign in", "පිවිසෙන්න")}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-full border border-[var(--vc-border)] cursor-pointer"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t(lang, "Close menu", "මෙනුව වසන්න") : t(lang, "Open menu", "මෙනුව විවෘත කරන්න")}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden border-t border-[var(--vc-border)] px-4 py-4 space-y-1 glass-panel"
        >
          <div className="flex sm:hidden rounded-full p-0.5 border border-[var(--vc-border)] text-[10px] font-semibold mb-3 w-fit">
            {(["EN", "SI", "BILINGUAL"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                  lang === l ? "text-white" : "text-muted"
                }`}
                style={lang === l ? { background: "var(--vc-accent)" } : {}}
              >
                {l === "BILINGUAL" ? "Both" : l}
              </button>
            ))}
          </div>
          {visibleNav.map((item) => {
            const pid = item.page as Page;
            const active = page === pid;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(pid)}
                className={`w-full text-left py-3 text-sm cursor-pointer rounded-xl px-3 transition-colors ${
                  active ? "font-semibold bg-black/[0.04] dark:bg-white/[0.06]" : "font-medium text-muted"
                }`}
                style={active ? { color: "var(--vc-accent)" } : {}}
              >
                {t(lang, item.labelEn, item.labelSi)}
              </button>
            );
          })}
          {user?.role === "owner" && (
            <button type="button" onClick={() => go("studio")} className="w-full text-left py-3 text-sm font-semibold cursor-pointer" style={{ color: "var(--vc-accent)" }}>
              Site Studio
            </button>
          )}
          {!user && (
            <button type="button" onClick={goLogin} className="w-full btn-primary mt-2">
              {t(lang, "Sign in", "පිවිසෙන්න")}
            </button>
          )}
        </motion.div>
      )}
    </header>
  );
}
