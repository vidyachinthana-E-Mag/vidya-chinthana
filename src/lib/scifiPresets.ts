import { SiteConfig, PREMIUM_DEFAULT_THEME, SCIFI_DEFAULT_THEME } from "../types/site";

export type ThemePreset = {
  id: string;
  name: string;
  theme: SiteConfig["theme"];
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "editorial-blue",
    name: "Editorial Blue",
    theme: PREMIUM_DEFAULT_THEME,
  },
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    theme: {
      ...PREMIUM_DEFAULT_THEME,
      accent: "#c9a227",
      accentSoft: "#e8c547",
      accentAlt: "#0077ed",
      neon: "#c9a227",
      glow: "rgba(201, 162, 39, 0.35)",
    },
  },
  {
    id: "quantum-cyan",
    name: "Quantum Cyan",
    theme: SCIFI_DEFAULT_THEME,
  },
  {
    id: "neon-magenta",
    name: "Neon Magenta",
    theme: {
      ...SCIFI_DEFAULT_THEME,
      accent: "#ff00aa",
      accentSoft: "#ff6bcb",
      accentAlt: "#00f0ff",
      neon: "#ff00aa",
      glow: "rgba(255, 0, 170, 0.5)",
    },
  },
  {
    id: "matrix-green",
    name: "Matrix Green",
    theme: {
      ...SCIFI_DEFAULT_THEME,
      accent: "#39ff14",
      accentSoft: "#00ff88",
      accentAlt: "#00f0ff",
      neon: "#39ff14",
      glow: "rgba(57, 255, 20, 0.45)",
    },
  },
  {
    id: "void-purple",
    name: "Void Purple",
    theme: {
      ...SCIFI_DEFAULT_THEME,
      accent: "#8b5cf6",
      accentSoft: "#c084fc",
      accentAlt: "#22d3ee",
      neon: "#a78bfa",
      glow: "rgba(139, 92, 246, 0.5)",
    },
  },
];

export function mergePresetIntoConfig(
  config: SiteConfig,
  presetId: string
): SiteConfig {
  const preset = THEME_PRESETS.find((p) => p.id === presetId);
  if (!preset) return config;
  return {
    ...config,
    themePreset: presetId,
    theme: { ...config.theme, ...preset.theme },
  };
}
