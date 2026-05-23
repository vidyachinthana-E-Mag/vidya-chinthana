import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { motion } from "motion/react";

export default function NewsTicker() {
  const { lang, siteConfig: sc } = useApp();
  if (!sc.homeSections.showAnnouncement || !sc.announcement.enabled) return null;

  const text = t(lang, sc.announcement.messageEn, sc.announcement.messageSi);

  return (
    <div
      className="news-ticker border-b border-[var(--vc-border)] overflow-hidden"
      role="region"
      aria-label={t(lang, "Announcement", "නිවේදනය")}
    >
      <div className="max-w-7xl mx-auto flex items-stretch">
        <span className="shrink-0 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-[var(--vc-accent)] text-white flex items-center">
          {t(lang, "Breaking", "නවතම")}
        </span>
        <div className="flex-1 overflow-hidden relative py-2.5" aria-live="polite">
          <motion.div
            className="news-ticker-track whitespace-nowrap text-sm font-medium"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            aria-hidden={false}
          >
            <span className="mx-8">{text}</span>
            <span className="mx-8 opacity-60" aria-hidden>
              {text}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
