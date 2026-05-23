import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** OS reduced-motion OR site config `effects.reducedMotion` */
export function useMotionEffects(siteReducedMotion = false): boolean {
  const prefers = usePrefersReducedMotion();
  return prefers || siteReducedMotion;
}
