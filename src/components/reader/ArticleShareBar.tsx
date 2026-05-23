import { Bookmark, Link2, Share2 } from "lucide-react";
import { Lang, t } from "../../lib/labels";

type Props = {
  lang: Lang;
  isBookmarked: boolean;
  onShare: () => void;
  onCopyLink: () => void;
  onBookmark: () => void;
};

export default function ArticleShareBar({
  lang,
  isBookmarked,
  onShare,
  onCopyLink,
  onBookmark,
}: Props) {
  return (
    <aside
      className="article-share-bar fixed bottom-0 left-0 right-0 z-50 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-auto sm:right-4 sm:w-auto"
      aria-label={t(lang, "Share article", "ලිපිය බෙදාගන්න")}
    >
      <div className="flex sm:flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:p-2.5 mx-3 mb-3 sm:mx-0 sm:mb-0 rounded-2xl glass-panel border border-[var(--vc-border)] shadow-lg">
        <button
          type="button"
          onClick={onCopyLink}
          className="p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vc-accent)]"
          title={t(lang, "Copy link", "සබැඳිය පිටපත්")}
        >
          <Link2 className="w-4 h-4" aria-hidden />
          <span className="sr-only">{t(lang, "Copy link", "සබැඳිය පිටපත්")}</span>
        </button>
        <button
          type="button"
          onClick={onShare}
          className="p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vc-accent)]"
          title={t(lang, "Share", "බෙදාගන්න")}
        >
          <Share2 className="w-4 h-4" aria-hidden />
          <span className="sr-only">{t(lang, "Share", "බෙදාගන්න")}</span>
        </button>
        <button
          type="button"
          onClick={onBookmark}
          className={`p-3 rounded-xl cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vc-accent)] ${
            isBookmarked
              ? "text-[var(--vc-accent)] bg-[color-mix(in_srgb,var(--vc-accent)_12%,transparent)]"
              : "hover:bg-black/5 dark:hover:bg-white/5"
          }`}
          title={t(lang, "Bookmark", "පොත් සලකුණ")}
        >
          <Bookmark className="w-4 h-4" aria-hidden />
          <span className="sr-only">{t(lang, "Bookmark", "පොත් සලකුණ")}</span>
        </button>
      </div>
    </aside>
  );
}
