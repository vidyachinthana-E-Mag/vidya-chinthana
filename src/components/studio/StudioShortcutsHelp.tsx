import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const SHORTCUTS = [
  ["Ctrl+K", "Command palette"],
  ["Ctrl+Z", "Undo"],
  ["Ctrl+Y / Ctrl+Shift+Z", "Redo"],
  ["?", "This help"],
  ["Esc", "Close dialogs"],
];

export default function StudioShortcutsHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[550] flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12121a] p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">Vidya Studio shortcuts</h3>
              <button type="button" onClick={onClose} className="p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2 text-xs">
              {SHORTCUTS.map(([key, desc]) => (
                <li key={key} className="flex justify-between gap-4">
                  <kbd className="font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">{key}</kbd>
                  <span className="text-white/50">{desc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[10px] text-white/35 border-t border-white/10 pt-3">
              Figma parity roadmap: docs/STUDIO_VS_FIGMA.md
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
