import { categoryMeta, Lang, t } from "../../lib/labels";
import { Category } from "../../types";

export default function FilterPills({
  lang,
  category,
  setCategory,
  includeAll = true,
}: {
  lang: Lang;
  category: string;
  setCategory: (c: string) => void;
  includeAll?: boolean;
}) {
  const items = includeAll
    ? (["all", ...Object.keys(categoryMeta)] as const)
    : (Object.keys(categoryMeta) as Category[]);

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((c) => {
        const active = category === c;
        const label =
          c === "all"
            ? t(lang, "All", "සියල්ල")
            : t(lang, categoryMeta[c as Category].en, categoryMeta[c as Category].si);
        return (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`pill ${active ? "pill-active" : ""}`}
            style={
              active && c !== "all"
                ? {
                    background: "color-mix(in srgb, var(--vc-accent) 15%, transparent)",
                    color: "var(--vc-accent)",
                    borderColor: "transparent",
                  }
                : undefined
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
