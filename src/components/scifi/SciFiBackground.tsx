import React from "react";
import { motion } from "motion/react";
import { HeroBackground } from "../../types/site";

export default function SciFiBackground({
  style,
  reducedMotion = false,
}: {
  style: HeroBackground;
  reducedMotion?: boolean;
}) {
  if (style === "minimal") return null;

  const anim = !reducedMotion;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {style === "cybergrid" && (
        <>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(var(--vc-grid) 1px, transparent 1px),
                linear-gradient(90deg, var(--vc-grid) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
              perspective: "500px",
              transform: "rotateX(60deg) scale(2)",
              transformOrigin: "center top",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2"
            style={{
              background: `linear-gradient(transparent, var(--vc-accent), transparent)`,
              boxShadow: `0 0 20px var(--vc-glow)`,
            }}
            animate={anim ? { opacity: [0.3, 0.8, 0.3] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </>
      )}

      {(style === "aurora" || style === "mesh" || style === "cybergrid") && (
        <>
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{
              background: "var(--vc-accent)",
              top: "-20%",
              left: "-10%",
              opacity: 0.2,
            }}
            animate={anim ? { x: [0, 60, 0], y: [0, 40, 0] } : {}}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-[90px]"
            style={{
              background: "var(--vc-accent-soft)",
              top: "-10%",
              right: "-5%",
              opacity: 0.18,
            }}
            animate={anim ? { x: [0, -50, 0], y: [0, 30, 0] } : {}}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {style === "particles" && (
        <div className="absolute inset-0">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 3 === 0 ? "var(--vc-accent)" : "var(--vc-accent-soft)",
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                boxShadow: `0 0 6px var(--vc-glow)`,
              }}
              animate={
                anim
                  ? {
                      opacity: [0.2, 1, 0.2],
                      scale: [1, 1.5, 1],
                    }
                  : {}
              }
              transition={{
                duration: 2 + (i % 5),
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      )}

      {style === "gradient" && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% -20%, color-mix(in srgb, var(--vc-accent) 30%, transparent), transparent)`,
          }}
        />
      )}
    </div>
  );
}
