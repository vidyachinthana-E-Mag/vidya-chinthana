import { motion } from "motion/react";
import { HeroBackground } from "../../types/site";
import SciFiBackground from "../scifi/SciFiBackground";

/** Elegant hero atmosphere — mesh for premium, SciFi for cyber presets */
export default function PremiumMesh({
  style,
  reducedMotion = false,
}: {
  style: HeroBackground;
  reducedMotion?: boolean;
}) {
  const cyber = style === "cybergrid" || style === "particles";
  if (cyber || style === "aurora") {
    return <SciFiBackground style={style} reducedMotion={reducedMotion} />;
  }

  const anim = !reducedMotion;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        className="absolute inset-0 opacity-60 dark:opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--vc-accent) 18%, transparent), transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 50%, color-mix(in srgb, var(--vc-accent-soft) 12%, transparent), transparent 50%),
            radial-gradient(ellipse 50% 30% at 0% 80%, color-mix(in srgb, var(--vc-accent-alt) 8%, transparent), transparent 45%)
          `,
        }}
      />
      {style !== "minimal" && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-[min(480px,80vw)] h-[min(480px,80vw)] rounded-full blur-[100px]"
            style={{ background: "color-mix(in srgb, var(--vc-accent) 25%, transparent)" }}
            animate={anim ? { x: [0, 40, 0], y: [0, -30, 0] } : {}}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-[min(360px,60vw)] h-[min(360px,60vw)] rounded-full blur-[80px]"
            style={{ background: "color-mix(in srgb, var(--vc-accent-soft) 20%, transparent)" }}
            animate={anim ? { x: [0, -30, 0], y: [0, 20, 0] } : {}}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
}
