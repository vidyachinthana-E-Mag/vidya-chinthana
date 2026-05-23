import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { runQualityChecks, tierSummary } from "../../lib/qualityGate";
import { CheckCircle2, Circle, Trophy, Rocket, Globe } from "lucide-react";

export default function AdminQualityPanel() {
  const { lang, articles, profiles, siteConfig } = useApp();

  const checks = useMemo(
    () => runQualityChecks(articles, profiles, siteConfig),
    [articles, profiles, siteConfig]
  );
  const summary = useMemo(() => tierSummary(checks), [checks]);

  const tiers = [
    {
      key: "platform",
      ok: summary.platformOk,
      icon: Rocket,
      en: "Platform OK",
      si: "Platform OK",
      subEn: `${summary.aDone}/${summary.aTotal} checks`,
      subSi: `පරීක්ෂණ ${summary.aDone}/${summary.aTotal}`,
      color: "cyan",
    },
    {
      key: "launch",
      ok: summary.launchOk,
      icon: Trophy,
      en: "Launch OK",
      si: "Launch OK",
      subEn: `Tier B: ${summary.bDone}/${summary.bTotal}`,
      subSi: `Tier B: ${summary.bDone}/${summary.bTotal}`,
      color: "emerald",
    },
    {
      key: "world",
      ok: summary.worldElite,
      icon: Globe,
      en: "World Elite",
      si: "ලෝක නායක",
      subEn: "Tier C — manual + growth",
      subSi: "Tier C — audience + craft",
      color: "amber",
    },
  ];

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyan-500/5 to-transparent p-6 space-y-6">
      <div>
        <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
          {t(lang, "World-class quality gate", "ලෝක-මට්ටම quality gate")}
        </h3>
        <p className="text-xs text-white/40 mt-1">
          {t(
            lang,
            "See docs/WORLD_CLASS_PATH.md for the full roadmap.",
            "සම්පූර්ණ මාර්ගය: docs/WORLD_CLASS_PATH.md"
          )}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {tiers.map(({ ok, icon: Icon, en, si, subEn, subSi, key }) => {
          const okBox =
            key === "platform"
              ? "border-cyan-500/40 bg-cyan-500/10"
              : key === "launch"
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-amber-500/40 bg-amber-500/10";
          const okIcon =
            key === "platform"
              ? "text-cyan-400"
              : key === "launch"
                ? "text-emerald-400"
                : "text-amber-400";
          const okText =
            key === "platform"
              ? "text-cyan-300"
              : key === "launch"
                ? "text-emerald-300"
                : "text-amber-300";
          return (
            <div
              key={en}
              className={`p-4 rounded-xl border ${ok ? okBox : "border-white/10 bg-white/[0.02]"}`}
            >
              <Icon className={`w-5 h-5 mb-2 ${ok ? okIcon : "text-white/30"}`} />
              <p className="font-semibold text-sm">{t(lang, en, si)}</p>
              <p className={`text-lg font-bold mt-1 ${ok ? okText : "text-white/40"}`}>
                {ok ? "OK ✓" : "—"}
              </p>
              <p className="text-[10px] text-white/35 mt-1">{t(lang, subEn, subSi)}</p>
            </div>
          );
        })}
      </div>

      {summary.platformOk && (
        <div className="p-4 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-100 text-sm">
          <strong>{t(lang, "Platform OK certified.", "Platform OK සහතිකයි.")}</strong>{" "}
          {t(
            lang,
            "Codebase is production-ready. Complete Tier B for Launch OK.",
            "Code production-ready. Launch OK සඳහා Tier B සම්පූර්ණ කරන්න."
          )}
        </div>
      )}

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {checks.map((c) => (
          <li
            key={c.id}
            className="flex gap-3 text-xs py-2 border-b border-white/[0.06] last:border-0"
          >
            {c.pass ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-white/25 shrink-0" />
            )}
            <div className="min-w-0">
              <span className="text-white/50 mr-2">[{c.tier}]</span>
              <span className="text-white/80">{t(lang, c.labelEn, c.labelSi)}</span>
              {!c.pass && (
                <p className="text-white/35 mt-0.5">{t(lang, c.hintEn, c.hintSi)}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
