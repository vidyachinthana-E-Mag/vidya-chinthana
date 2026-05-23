import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { Article } from "../../types";
import { CheckCircle2, Clock } from "lucide-react";

export default function ArticleListRow({
  article,
  done,
  onOpen,
  onToggleDone,
}: {
  article: Article;
  done: boolean;
  onOpen: () => void;
  onToggleDone: () => void;
}) {
  const { lang, readProgress } = useApp();
  const pct = readProgress[article.id] ?? 0;

  return (
    <div className="article-list-row premium-card p-0 overflow-hidden flex gap-0 group">
      <button type="button" onClick={onOpen} className="flex flex-1 gap-4 p-4 text-left cursor-pointer min-w-0">
        <img
          src={article.coverUrl}
          alt=""
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase tracking-wider text-muted">{article.category}</span>
          <p className="font-display text-base sm:text-lg font-medium mt-1 line-clamp-2 group-hover:opacity-90">
            {t(lang, article.titleEn, article.titleSi)}
          </p>
          <p className="text-xs text-muted mt-2 flex flex-wrap gap-3">
            <span>{article.authorName}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTimeMin} min
            </span>
          </p>
          {pct > 0 && (
            <div className="mt-3 h-0.5 rounded-full bg-black/5 dark:bg-white/10 max-w-[200px]">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--vc-accent)" }} />
            </div>
          )}
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleDone();
        }}
        className={`shrink-0 px-4 flex items-center border-l border-[var(--vc-border)] cursor-pointer ${
          done ? "text-[var(--vc-accent)]" : "text-muted"
        }`}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
      >
        <CheckCircle2 className="w-5 h-5" />
      </button>
    </div>
  );
}
