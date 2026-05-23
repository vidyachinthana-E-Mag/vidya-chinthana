import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";
import { t, Lang } from "../lib/labels";
import AuthIllustration from "../components/auth/AuthIllustration";
import AuthLoginMesh from "../components/auth/AuthLoginMesh";
import SciFiHero3D from "../components/effects/SciFiHero3D";
import AntigravityCanvas from "../components/effects/AntigravityCanvas";
import { useMotionEffects } from "../hooks/useMotionEffects";
import PageContainer from "../components/ui/PageContainer";
import {
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  User,
  Lock,
  BookOpen,
  Shield,
  Globe,
  Loader2,
} from "lucide-react";

const DEMO_ACCOUNTS = [
  { username: "admin", roleEn: "Owner", roleSi: "හිමිකරු", color: "#00f0ff" },
  { username: "editor", roleEn: "Editor", roleSi: "සංස්කාරක", color: "#bf5af2" },
  { username: "author", roleEn: "Author", roleSi: "ලේඛක", color: "#30d158" },
  { username: "reader", roleEn: "Reader", roleSi: "පාඨක", color: "#ff9f0a" },
];

export default function LoginPage() {
  const { lang, setLang, user, login, register, siteConfig: sc, setPage, toggleTheme, theme } = useApp();
  const allowRegister = sc.admin.features.allowRegistration;
  const reducedMotion = useMotionEffects(sc.effects.reducedMotion);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setPage("dashboard");
  }, [user, setPage]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(username, password);
      else await register(username, password, name);
      setPage("dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const pickDemo = (u: string) => {
    setUsername(u);
    setPassword("password123");
    setMode("login");
  };

  return (
    <div className="auth-page min-h-screen relative">
      <div className="newspaper-edition-bar relative z-20">
        <PageContainer wide className="py-2 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-muted font-mono">
          <span>{t(lang, "Vidya Chinthana — Member access", "විද්‍යා චින්තන — සාමාජික ප්‍රවේශය")}</span>
          <span>{new Date().getFullYear()}</span>
        </PageContainer>
      </div>
      <AuthLoginMesh />
      {reducedMotion ? (
        <AntigravityCanvas className="opacity-50" intensity={0.75} />
      ) : (
        <SciFiHero3D variant="auth" className="opacity-55" intensity={0.75} fallbackIntensity={0.75} />
      )}

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="auth-page-visual relative flex-1 flex flex-col justify-center px-6 py-14 lg:py-0 lg:min-h-screen lg:px-12">
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20">
            <button
              type="button"
              onClick={() => setPage("home")}
              className="flex items-center gap-2 text-sm text-muted hover:opacity-80 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t(lang, "Magazine", "සඟරාව")}
            </button>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex rounded-full p-0.5 border border-[var(--vc-border)] text-[9px] font-bold">
                {(["EN", "SI", "BILINGUAL"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={`px-2 py-0.5 rounded-full cursor-pointer ${lang === l ? "text-white" : "text-muted"}`}
                    style={lang === l ? { background: "var(--vc-accent)" } : {}}
                  >
                    {l === "BILINGUAL" ? "Both" : l}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full border border-[var(--vc-border)] text-sm cursor-pointer"
                aria-label="Theme"
              >
                {theme === "dark" ? "☀" : "☾"}
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-lg"
          >
            {sc.admin.media.logoUrl ? (
              <img
                src={sc.admin.media.logoUrl}
                alt={t(lang, sc.branding.siteNameEn, sc.branding.siteNameSi)}
                className="w-14 h-14 rounded-2xl mb-6 object-cover"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center font-display text-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--vc-accent), var(--vc-accent-soft))" }}
              >
                V
              </div>
            )}
            <p className="auth-shimmer-label vc-section-label mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: "var(--vc-accent)" }} />
              {t(lang, sc.branding.taglineEn, sc.branding.taglineSi)}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-medium tracking-tight leading-[1.08]">
              {t(lang, sc.branding.siteNameEn, sc.branding.siteNameSi)}
            </h1>
            <p className="mt-5 text-muted text-sm sm:text-base leading-relaxed max-w-md">
              {t(
                lang,
                "Your gateway to science, education, and sci-fi — curated like a world-class digital magazine.",
                "විද්‍යාව, අධ්‍යාපනය, sci-fi — ලෝක මට්ටමේ ඩිජිටල් සඟරාවක්."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: BookOpen, en: "Magazine reading", si: "සඟරා කියවීම" },
                { icon: Globe, en: "EN + Sinhala", si: "ද්විභාෂා" },
                { icon: Shield, en: "Secure access", si: "ආරක්ෂිත" },
              ].map(({ icon: Icon, en, si }) => (
                <span
                  key={en}
                  className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-[var(--vc-border)] text-muted"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "var(--vc-accent)" }} />
                  {t(lang, en, si)}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.12 }}
            className="mt-8 lg:mt-10 hidden sm:block"
          >
            <AuthIllustration />
          </motion.div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:min-h-screen lg:border-l border-[var(--vc-border)] bg-[color-mix(in_srgb,var(--vc-paper)_75%,transparent)] dark:bg-[color-mix(in_srgb,#0c0c10_85%,transparent)] backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="auth-card w-full max-w-[420px] p-7 sm:p-9"
          >
            <div className="auth-mode-tabs mb-8">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`auth-mode-tab ${mode === "login" ? "auth-mode-tab-active" : ""}`}
              >
                {t(lang, "Sign in", "පිවිසෙන්න")}
              </button>
              {allowRegister && (
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`auth-mode-tab ${mode === "register" ? "auth-mode-tab-active" : ""}`}
                >
                  {t(lang, "Register", "ලියාපදිංචි")}
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display text-2xl font-medium mb-1">
                  {mode === "login"
                    ? t(lang, "Welcome back", "නැවත සාදරයෙන්")
                    : t(lang, "Join us", "එක් වන්න")}
                </h2>
                <p className="text-xs text-muted mb-6">
                  {mode === "login"
                    ? t(lang, "Access bookmarks, dashboard, and CMS.", "Bookmarks, dashboard, CMS.")
                    : t(lang, "Create your reader account.", "පාඨක ගිණුම සාදන්න.")}
                </p>
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/25 p-3 rounded-xl"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            {mode === "login" && (
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">
                  {t(lang, "Quick demo access", "ඉක්මන් demo")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((d) => (
                    <button
                      key={d.username}
                      type="button"
                      onClick={() => pickDemo(d.username)}
                      className="auth-demo-chip text-left cursor-pointer"
                      style={{ borderColor: `${d.color}44` }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: d.color }}>
                        {d.username}
                      </span>
                      <span className="block text-[9px] text-muted mt-0.5">
                        {t(lang, d.roleEn, d.roleSi)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4" autoComplete="on">
              {mode === "register" && (
                <label className="auth-field" htmlFor="auth-name">
                  <User className="auth-field-icon" />
                  <input
                    id="auth-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t(lang, "Full name", "සම්පූර්ණ නම")}
                    required
                    className="auth-input auth-input-icon"
                    autoComplete="name"
                  />
                </label>
              )}
              <label className="auth-field" htmlFor="auth-username">
                <User className="auth-field-icon" />
                <input
                  id="auth-username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t(lang, "Username", "පරිශීලක නාමය")}
                  required
                  className="auth-input auth-input-icon"
                  autoComplete="username"
                />
              </label>
              <label className="auth-field" htmlFor="auth-password">
                <Lock className="auth-field-icon" />
                <input
                  id="auth-password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t(lang, "Password", "මුරපදය")}
                  required
                  className="auth-input auth-input-icon pr-12"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </label>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015 }}
                whileTap={{ scale: 0.99 }}
                className="auth-submit w-full flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading
                  ? t(lang, "Signing in…", "පිවිසෙමින්…")
                  : mode === "login"
                    ? t(lang, "Enter the newsroom", "ප්‍රවෘත්ති කාමරයට")
                    : t(lang, "Create account", "ගිණුම සාදන්න")}
              </motion.button>
            </form>

            <button
              type="button"
              onClick={() => setPage("home")}
              className="w-full mt-6 text-xs text-center text-muted cursor-pointer hover:underline"
            >
              {t(lang, "Continue as guest →", "අමුත්තෙකු ලෙස →")}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
