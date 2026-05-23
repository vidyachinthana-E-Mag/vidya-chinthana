import React from "react";
import { SiteConfig } from "../../types/site";
import { Lang, t } from "../../lib/labels";
import PremiumMesh from "../ui/PremiumMesh";
import { Search } from "lucide-react";

export default function SitePreview({
  config,
  lang = "EN",
}: {
  config: SiteConfig;
  lang?: Lang;
  scale?: number;
}) {
  const c = config;
  const tkn = c.theme;

  return (
    <div
      className="text-[var(--vc-ink)] overflow-hidden"
      style={{
        background: tkn.paperDark,
        ["--vc-accent" as string]: tkn.accent,
        ["--vc-accent-soft" as string]: tkn.accentSoft,
        ["--vc-accent-alt" as string]: tkn.accentAlt,
        ["--vc-paper" as string]: tkn.paper,
        ["--vc-paper-dark" as string]: tkn.paperDark,
        ["--vc-ink" as string]: tkn.ink,
        ["--vc-neon" as string]: tkn.neon,
        ["--vc-grid" as string]: tkn.grid,
        ["--vc-glow" as string]: tkn.glow,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {c.homeSections.showAnnouncement && c.announcement.enabled && (
        <div
          className="text-center text-[10px] py-2 px-3 font-mono tracking-wider"
          style={{
            background: `linear-gradient(90deg, color-mix(in srgb, ${tkn.accent} 20%, transparent), color-mix(in srgb, ${tkn.accentSoft} 20%, transparent))`,
            color: tkn.accent,
            borderBottom: `1px solid color-mix(in srgb, ${tkn.accent} 30%, transparent)`,
          }}
        >
          {t(lang, c.announcement.messageEn, c.announcement.messageSi)}
        </div>
      )}

      <div className="relative px-6 py-12 text-center min-h-[200px] flex flex-col justify-center overflow-hidden">
        <PremiumMesh style={c.hero.backgroundStyle} reducedMotion />
        <p className="text-[9px] font-mono uppercase tracking-[0.3em] mb-3 relative neon-text">
          {t(lang, c.hero.badgeEn, c.hero.badgeSi)}
        </p>
        <h1
          className="text-2xl font-black leading-tight relative uppercase"
          style={{ fontFamily: tkn.fontDisplay, textShadow: `0 0 30px ${tkn.glow}` }}
        >
          {t(lang, c.hero.headlineEn, c.hero.headlineSi)}
        </h1>
        <p className="text-[11px] mt-3 opacity-60 max-w-sm mx-auto relative leading-relaxed">
          {t(lang, c.hero.subheadEn, c.hero.subheadSi)}
        </p>
        {c.hero.showSearch && (
          <div className="mt-5 max-w-xs mx-auto relative flex items-center gap-2 px-4 py-2 rounded-full glass-scifi text-[10px]">
            <Search className="w-3 h-3 opacity-50" />
            <span className="opacity-40">Search quantum archives...</span>
          </div>
        )}
      </div>

      {c.homeSections.showStats && (
        <div className="px-4 pb-3 grid grid-cols-4 gap-2">
          {["12", "4", "10", "2"].map((n, i) => (
            <div key={i} className="p-2 rounded-lg glass-scifi text-center cyber-card">
              <p className="text-sm font-bold neon-text">{n}</p>
              <p className="text-[8px] opacity-40 uppercase">Stat</p>
            </div>
          ))}
        </div>
      )}

      <div
        className="px-4 py-2 text-[9px] text-center font-mono opacity-40 border-t"
        style={{ borderColor: `color-mix(in srgb, ${tkn.accent} 20%, transparent)` }}
      >
        {t(lang, c.footer.textEn, c.footer.textSi)}
      </div>
    </div>
  );
}
