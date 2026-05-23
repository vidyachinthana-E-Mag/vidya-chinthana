import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SciFiHero3D from "../effects/SciFiHero3D";
import AntigravityCanvas from "../effects/AntigravityCanvas";
import { useMotionEffects } from "../../hooks/useMotionEffects";

const KEY = "vc-splash-seen";

export default function OpeningSplash({
  siteName,
  reducedMotion: siteReduced = false,
}: {
  siteName: string;
  reducedMotion?: boolean;
}) {
  const reduced = useMotionEffects(siteReduced);
  const [show, setShow] = useState(() => {
    if (reduced) return false;
    try {
      return !sessionStorage.getItem(KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show) return;
    const tmr = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    }, 2400);
    return () => clearTimeout(tmr);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="opening-splash fixed inset-0 z-[200] flex items-center justify-center bg-[#050508]"
        >
          {reduced ? (
            <AntigravityCanvas intensity={1.2} />
          ) : (
            <SciFiHero3D variant="splash" intensity={1.1} fallbackIntensity={1.2} />
          )}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center px-6"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-400/80 mb-4 font-mono">
              Digital Edition
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-medium text-white tracking-tight neon-text">
              {siteName}
            </h1>
            <motion.div
              className="mt-8 h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
