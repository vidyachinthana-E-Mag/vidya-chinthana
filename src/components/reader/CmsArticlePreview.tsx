import { Lang, categoryMeta, t } from "../../lib/labels";
import { Article, ArticleBlock, Category } from "../../types";

function PreviewBlock({ block, lang }: { block: ArticleBlock; lang: Lang }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="font-display text-xl font-bold mt-8 mb-3 paththara-kicker">
          {t(lang, block.valueEn, block.valueSi)}
        </h2>
      );
    case "quote":
      return (
        <blockquote className="magazine-pullquote my-6 px-5 py-3 border-l-4 italic font-display text-lg">
          {t(lang, block.valueEn, block.valueSi)}
        </blockquote>
      );
    case "highlight":
      return (
        <div className="magazine-highlight my-6 p-4 text-sm leading-relaxed">
          {t(lang, block.valueEn, block.valueSi)}
        </div>
      );
    default:
      return (
        <p className="newspaper-body newspaper-dropcap leading-[1.85] mb-4 text-[#3a3a48] dark:text-[#c8c4bf]">
          {t(lang, block.valueEn, block.valueSi)}
        </p>
      );
  }
}

export default function CmsArticlePreview({
  lang,
  titleEn,
  titleSi,
  summaryEn,
  summarySi,
  category,
  blocks,
  authorName = "Editor",
}: {
  lang: Lang;
  titleEn: string;
  titleSi: string;
  summaryEn: string;
  summarySi: string;
  category: Category;
  blocks: ArticleBlock[];
  authorName?: string;
}) {
  const cat = categoryMeta[category];
  const dateline = new Date().toLocaleDateString(lang === "SI" ? "si-LK" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="paththara-sheet paththara-preview-article newspaper-article">
      <header className="text-center border-b border-[var(--vc-border)] pb-6 mb-8">
        <p className="vc-section-label">{t(lang, cat.en, cat.si)}</p>
        <p className="newspaper-edition-label mt-2">{dateline}</p>
        <h1 className="font-display newspaper-headline text-2xl sm:text-4xl mt-4">
          {titleEn || t(lang, "Untitled draft", "නිර්ණාමික කෙටුම්පත")}
        </h1>
        {titleSi && (
          <p className="mt-3 text-lg italic text-muted font-serif">{titleSi}</p>
        )}
        <p className="mt-4 text-xs text-muted uppercase tracking-widest">
          {t(lang, "By", "ලියූවේ")} {authorName}
        </p>
        {summaryEn && (
          <p className="mt-6 magazine-deck text-left sm:text-center text-muted leading-relaxed max-w-xl mx-auto">
            {t(lang, summaryEn, summarySi)}
          </p>
        )}
      </header>
      <div className="paththara-body-columns newspaper-body">
        {blocks.map((b, i) => (
          <div key={b.id}>
            <PreviewBlock block={b} lang={lang} />
            {lang === "BILINGUAL" && b.valueSi && b.type === "paragraph" && (
              <p className="text-sm italic text-muted mb-4 -mt-2">{b.valueSi}</p>
            )}
            {i === 0 && b.type === "paragraph" && (
              <p className="text-[10px] text-muted text-right mt-2 font-mono">
                {t(lang, "Continued on page 2 →", "පිටු 2 →")}
              </p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
