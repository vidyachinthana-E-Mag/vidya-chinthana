import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";

export type StudioCommand = {
  id: string;
  label: string;
  group: string;
  run: () => void;
};

export default function StudioCommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean;
  onClose: () => void;
  commands: StudioCommand[];
}) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const filtered = commands.filter(
    (c) =>
      !q ||
      c.label.toLowerCase().includes(q.toLowerCase()) ||
      c.group.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[600] flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -8 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#12121a] shadow-[0_0_80px_rgba(0,240,255,0.12)] overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08]">
              <Search className="w-4 h-4 text-cyan-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search panels & actions… (Ctrl+K)"
                className="flex-1 bg-transparent text-sm outline-none"
                autoFocus
              />
              <kbd className="text-[9px] px-1.5 py-0.5 rounded border border-white/15 text-white/40">esc</kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <li className="px-4 py-6 text-center text-xs text-white/40">No matches</li>
              ) : (
                filtered.map((cmd) => (
                  <li key={cmd.id}>
                    <button
                      type="button"
                      onClick={() => {
                        cmd.run();
                        onClose();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-cyan-500/10 cursor-pointer flex justify-between gap-2"
                    >
                      <span className="text-sm">{cmd.label}</span>
                      <span className="text-[10px] text-white/30 uppercase">{cmd.group}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
