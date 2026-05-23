import { Lang, t } from "../../lib/labels";

export default function ProfileInsights({
  lang,
  categories,
  totalMin,
  articleCount,
}: {
  lang: Lang;
  categories: [string, number][];
  totalMin: number;
  articleCount: number;
}) {
  const max = Math.max(1, ...categories.map(([, n]) => n));

  return (
    <section className="profile-insights premium-card p-6 sm:p-8 mb-10">
      <h3 className="vc-section-label mb-6">
        {t(lang, "Publication insights", "ප්‍රකාශන විශ්ලේෂණ")}
      </h3>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="text-center sm:text-left">
          <p className="text-3xl font-display font-medium" style={{ color: "var(--vc-accent)" }}>
            {articleCount}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted mt-1">
            {t(lang, "Stories", "ලිපි")}
          </p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-3xl font-display font-medium" style={{ color: "var(--vc-accent)" }}>
            {totalMin}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted mt-1">
            {t(lang, "Minutes to read", "මිනිත්තු")}
          </p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-3xl font-display font-medium" style={{ color: "var(--vc-accent)" }}>
            {categories.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted mt-1">
            {t(lang, "Topics covered", "මාතෘකා")}
          </p>
        </div>
      </div>
      {categories.length > 0 && (
        <div className="space-y-3">
          {categories.map(([cat, n]) => (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1 capitalize">
                <span className="text-muted">{cat}</span>
                <span className="font-mono">{n}</span>
              </div>
              <div className="h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(n / max) * 100}%`,
                    background: "var(--vc-accent)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
