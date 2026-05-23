import React from "react";
import { motion } from "motion/react";
import { HeroBackground } from "../../types/site";

export default function AuroraBackground({ style }: { style: HeroBackground }) {
  if (style === "minimal") return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {style === "gradient" && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--vc-accent) 35%, transparent), transparent)`,
          }}
        />
      )}
      {style === "mesh" && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px] opacity-30 bg-[var(--vc-accent)]" />
          <div className="absolute top-20 right-1/4 w-72 h-72 rounded-full blur-[80px] opacity-20 bg-[var(--vc-accent-soft)]" />
        </>
      )}
      {style === "aurora" && (
        <>
          <motion.div
            className="absolute -top-1/2 left-[-10%] w-[70%] h-[80%] rounded-full blur-[120px] opacity-25"
            style={{ background: "var(--vc-accent)" }}
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -top-1/3 right-[-5%] w-[55%] h-[70%] rounded-full blur-[100px] opacity-20"
            style={{ background: "var(--vc-accent-soft)" }}
            animate={{ x: [0, -35, 0], y: [0, 25, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 left-1/3 w-[40%] h-[50%] rounded-full blur-[90px] opacity-10 bg-violet-500"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </>
      )}
    </div>
  );
}
