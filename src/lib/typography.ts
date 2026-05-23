/** Site-wide typography stacks — loaded via index.html Google Fonts */
export const TYPOGRAPHY = {
  display: '"Newsreader", "Instrument Serif", Georgia, "Times New Roman", serif',
  serif: '"Source Serif 4", "Lora", Georgia, serif',
  sans: '"Outfit", system-ui, -apple-system, sans-serif',
  sinhala: '"Noto Sans Sinhala", "Outfit", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export function applyTypography() {
  const r = document.documentElement;
  r.style.setProperty("--font-display", TYPOGRAPHY.display);
  r.style.setProperty("--font-serif", TYPOGRAPHY.serif);
  r.style.setProperty("--font-sans", TYPOGRAPHY.sans);
  r.style.setProperty("--font-sinhala", TYPOGRAPHY.sinhala);
  r.style.setProperty("--font-mono", TYPOGRAPHY.mono);
}
