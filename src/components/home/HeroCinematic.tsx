import type { ReactNode } from "react";
import { motion } from "motion/react";
import SciFiHero3D from "../effects/SciFiHero3D";
import PremiumMesh from "../ui/PremiumMesh";
import HeroEditorialSlideshow from "./HeroEditorialSlideshow";
import { useMotionEffects } from "../../hooks/useMotionEffects";
import type { SiteConfig } from "../../types/site";
import HeroParticles from "../3d/HeroParticles";

/** Sci-fi hero: mesh + particle field + editorial slideshow */
export default function HeroCinematic({
  children,
  sc,
}: {
  children: ReactNode;
  sc: SiteConfig;
}) {
  const reduced = useMotionEffects(sc.effects.reducedMotion);

  return (
    <section className="vc-hero hero-cinematic relative overflow-hidden">
      <PremiumMesh style={sc.hero.backgroundStyle} reducedMotion={reduced} />
      {!reduced && sc.hero.backgroundStyle === "particles" && (
        <HeroParticles color={sc.theme.accent} />
      )}
      {!reduced && (
        <>
          <SciFiHero3D variant="hero" className="opacity-75" intensity={0.9} fallbackIntensity={0.9} />
          <div className="hero-scifi-beams" aria-hidden />
          <div className="hero-scifi-grid" aria-hidden />
        </>
      )}
      <div className="relative z-10">{children}</div>
      {!reduced && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroEditorialSlideshow />
        </motion.div>
      )}
    </section>
  );
}
