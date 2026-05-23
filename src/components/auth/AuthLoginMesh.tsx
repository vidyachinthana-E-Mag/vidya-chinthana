import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/** Full-screen ambient background for login */
export default function AuthLoginMesh() {
  const { siteConfig: sc } = useApp();
  const reduced = usePrefersReducedMotion();

  return (
    <div className="auth-login-mesh pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 20% 10%, color-mix(in srgb, var(--vc-accent) 22%, transparent), transparent 55%),
            radial-gradient(ellipse 70% 50% at 90% 80%, color-mix(in srgb, var(--vc-accent-soft) 18%, transparent), transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, color-mix(in srgb, var(--vc-accent-alt) 8%, transparent), transparent 60%)
          `,
        }}
      />
      {!reduced &&
        Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="auth-login-star absolute w-1 h-1 rounded-full bg-[var(--vc-accent)]"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              opacity: 0.15 + (i % 5) * 0.08,
            }}
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.4, 1] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      {sc.effects.gridOverlay && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(var(--vc-grid) 1px, transparent 1px), linear-gradient(90deg, var(--vc-grid) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      )}
    </div>
  );
}
