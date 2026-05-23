import { motion, AnimatePresence } from "motion/react";

export default function SiteLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--vc-paper-dark)]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div
              className="w-12 h-12 rounded-2xl mx-auto mb-6 flex items-center justify-center font-display text-xl font-bold text-white"
              style={{ background: "var(--vc-accent)" }}
            >
              V
            </div>
            <motion.div
              className="h-0.5 w-32 rounded-full overflow-hidden bg-white/10 mx-auto"
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--vc-accent)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
