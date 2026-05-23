import { SiteConfig } from "../types/site";

export function applySiteTheme(config: SiteConfig) {
  const r = document.documentElement;
  const t = config.theme;
  r.style.setProperty("--vc-accent", t.accent);
  r.style.setProperty("--vc-accent-soft", t.accentSoft);
  r.style.setProperty("--vc-accent-alt", t.accentAlt);
  r.style.setProperty("--vc-paper", t.paper);
  r.style.setProperty("--vc-paper-dark", t.paperDark);
  r.style.setProperty("--vc-ink", t.ink);
  r.style.setProperty("--vc-neon", t.neon);
  r.style.setProperty("--vc-grid", t.grid);
  r.style.setProperty("--vc-glow", t.glow);
  r.style.setProperty("--font-display", config.typography?.display ?? t.fontDisplay);
  r.style.setProperty("--font-serif", config.typography?.body ?? '"Newsreader", Georgia, serif');
  r.style.setProperty("--font-article", config.typography?.article ?? config.typography?.body ?? '"Newsreader", Georgia, serif');
  if (config.typography?.ui) {
    r.style.setProperty("--font-sans", config.typography.ui);
  }
  r.dataset.scanlines = config.effects.scanlines ? "1" : "0";
  r.dataset.grid = config.effects.gridOverlay ? "1" : "0";
  r.dataset.glow = config.effects.neonGlow ? "1" : "0";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("theme-color", t.paperDark);
}
