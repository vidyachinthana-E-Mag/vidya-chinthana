/** Detect stock / placeholder image hosts used in seed data. */
export function isPlaceholderImage(url: string): boolean {
  return /picsum\.photos|placeholder\.com|via\.placeholder|placehold\.co/i.test(url);
}

/** Stable hue 0–360 from a string (covers, titles, ids). */
export function hueFromSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

export function coverGradientStyle(seed: string): { background: string } {
  const h = hueFromSeed(seed);
  return {
    background: `linear-gradient(135deg, hsl(${h} 42% 42%) 0%, hsl(${(h + 48) % 360} 38% 28%) 50%, hsl(${(h + 96) % 360} 35% 18%) 100%)`,
  };
}
