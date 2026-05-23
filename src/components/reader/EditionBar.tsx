import { CloudSun, Newspaper } from "lucide-react";
import { Lang, t } from "../../lib/labels";
import { Issue } from "../../types";

export type EditionBarConfig = {
  showWeather?: boolean;
  showPrice?: boolean;
  priceLabel?: string;
  weatherLabel?: string;
};

export default function EditionBar({
  lang,
  issue,
  label,
  config = {},
}: {
  lang: Lang;
  issue?: Issue;
  label?: string;
  config?: EditionBarConfig;
}) {
  const today = new Date().toLocaleDateString(lang === "SI" ? "si-LK" : "en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const showWeather = config.showWeather ?? true;
  const showPrice = config.showPrice ?? false;

  return (
    <div
      className="newspaper-edition-bar paththara-edition-bar text-[10px] sm:text-[11px] font-mono uppercase tracking-wider"
      role="region"
      aria-label={t(lang, "Edition information", "කලාප තොරතුරු")}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-2 text-muted min-w-0">
          <Newspaper className="w-3.5 h-3.5 shrink-0 text-[var(--vc-accent)]" aria-hidden />
          <span className="truncate">
            {label ?? t(lang, "Vidya Chinthana · Paththara", "විද්‍යා චින්තන · පත්තර")}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center text-center flex-1">
          {issue ? (
            <>
              <span>
                {t(lang, "Vol", "කලාප")} {issue.volume} · #{issue.number}
              </span>
              <span className="hidden sm:inline opacity-40" aria-hidden>
                |
              </span>
              <span className="text-[var(--vc-ink)] dark:text-[#e8e4df] font-semibold normal-case tracking-normal font-display text-xs sm:text-sm">
                {t(lang, issue.titleEn, issue.titleSi)}
              </span>
            </>
          ) : (
            <span>{today}</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-muted shrink-0">
          {showWeather && (
            <span className="hidden md:inline-flex items-center gap-1">
              <CloudSun className="w-3 h-3" aria-hidden />
              {config.weatherLabel ?? t(lang, "Fair · 28°C", "සුවපත් · 28°C")}
            </span>
          )}
          {showPrice && (
            <span>{config.priceLabel ?? t(lang, "Free digital", "නොමිලේ ඩිජිටල්")}</span>
          )}
          {!issue && <time dateTime={new Date().toISOString().slice(0, 10)}>{today}</time>}
          {issue?.publishedAt && (
            <time className="normal-case">{issue.publishedAt}</time>
          )}
        </div>
      </div>
      <div className="newspaper-rule paththara" aria-hidden />
    </div>
  );
}
