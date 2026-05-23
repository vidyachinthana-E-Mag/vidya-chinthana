import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/** Rich decorative SVG — magazine + science motif */
export default function AuthIllustration() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="auth-illustration relative w-full max-w-xl mx-auto aspect-[4/3]">
      <motion.div
        className="auth-orb auth-orb-1"
        animate={reduced ? {} : { y: [0, -14, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="auth-orb auth-orb-2"
        animate={reduced ? {} : { y: [0, 12, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <svg viewBox="0 0 480 360" className="w-full h-full relative z-10" aria-hidden>
        <defs>
          <linearGradient id="ag1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--vc-accent)" />
            <stop offset="100%" stopColor="var(--vc-accent-soft)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="ag2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--vc-accent-alt)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--vc-neon)" stopOpacity="0.2" />
          </linearGradient>
          <filter id="agGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0, 1, 2].map((i) => (
          <motion.ellipse
            key={i}
            cx={240}
            cy={180}
            rx={150 - i * 28}
            ry={110 - i * 20}
            fill="none"
            stroke="url(#ag1)"
            strokeWidth={0.6 + i * 0.2}
            opacity={0.25 - i * 0.05}
            animate={reduced ? {} : { opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <g filter="url(#agGlow)" opacity="0.9">
          <rect x="100" y="90" width="120" height="160" rx="6" fill="url(#ag1)" opacity="0.08" transform="rotate(-8 160 170)" />
          <rect x="200" y="70" width="130" height="175" rx="8" fill="url(#ag2)" opacity="0.12" />
          <rect x="280" y="100" width="110" height="150" rx="6" fill="url(#ag1)" opacity="0.07" transform="rotate(6 335 175)" />
        </g>

        <line x1="220" y1="130" x2="310" y2="130" stroke="var(--vc-accent)" strokeWidth="2.5" opacity="0.55" strokeLinecap="round" />
        <line x1="220" y1="155" x2="290" y2="155" stroke="var(--vc-accent-soft)" strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />
        <line x1="220" y1="180" x2="320" y2="180" stroke="var(--vc-accent-soft)" strokeWidth="1.8" opacity="0.35" strokeLinecap="round" />
        <line x1="220" y1="205" x2="270" y2="205" stroke="var(--vc-accent-soft)" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />

        <path
          d="M60 200 Q120 120 180 200 T300 200 T420 200"
          fill="none"
          stroke="url(#ag2)"
          strokeWidth="1.2"
          opacity="0.35"
        />

        {!reduced &&
          [0, 1, 2, 3, 4, 5].map((i) => {
            const cy = 60 + (i % 3) * 25;
            return (
              <circle
                key={`p-${i}`}
                cx={80 + i * 55}
                cy={cy}
                r={2 + (i % 2)}
                fill="var(--vc-neon)"
                opacity={0.4 + (i % 3) * 0.15}
                className="auth-particle"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            );
          })}

        <circle cx="240" cy="180" r="36" fill="color-mix(in srgb, var(--vc-paper) 90%, transparent)" className="dark:fill-[#14141c]" />
        <circle cx="240" cy="180" r="34" fill="none" stroke="var(--vc-accent)" strokeWidth="1.5" opacity="0.5" />
        <text x="240" y="188" textAnchor="middle" fill="var(--vc-accent)" fontSize="28" fontFamily="Georgia, serif" fontWeight="600">
          V
        </text>
      </svg>
    </div>
  );
}
