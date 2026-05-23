import { useApp } from "../../context/AppContext";
import { t, Lang } from "../../lib/labels";
import { PageBlock } from "../../types/pageBuilder";
import ArticleCard from "../ui/ArticleCard";
import CoverImage from "../ui/CoverImage";
import PageContainer from "../ui/PageContainer";

function BlockHero({ block, lang }: { block: PageBlock; lang: Lang }) {
  const align = String(block.props.align || "center");
  return (
    <section
      className={`newspaper-hero-block py-14 sm:py-20 ${align === "left" ? "text-left" : "text-center"}`}
    >
      <PageContainer>
        <h1 className="font-display text-4xl sm:text-6xl font-medium tracking-tight leading-[1.05]">
          {t(lang, String(block.props.headlineEn), String(block.props.headlineSi))}
        </h1>
        <p className="mt-5 text-lg text-muted max-w-2xl mx-auto leading-relaxed newspaper-body">
          {t(lang, String(block.props.subEn), String(block.props.subSi))}
        </p>
      </PageContainer>
    </section>
  );
}

export default function BlockRenderer({
  blocks,
  preview,
}: {
  blocks: PageBlock[];
  preview?: boolean;
}) {
  const { lang, articles, openArticle, setPage } = useApp();

  return (
    <div className={preview ? "pointer-events-none" : ""}>
      {blocks
        .filter((b) => b.visible)
        .map((block) => {
          switch (block.type) {
            case "hero":
              return <BlockHero key={block.id} block={block} lang={lang} />;
            case "richtext":
              return (
                <PageContainer key={block.id} className="py-8 max-w-3xl">
                  <div className="newspaper-body text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                    {lang === "BILINGUAL" ? (
                      <>
                        <p>{String(block.props.bodyEn)}</p>
                        <p className="mt-4 text-muted italic">{String(block.props.bodySi)}</p>
                      </>
                    ) : (
                      t(lang, String(block.props.bodyEn), String(block.props.bodySi))
                    )}
                  </div>
                </PageContainer>
              );
            case "image": {
              const url = String(block.props.url || "");
              if (!url) return null;
              return (
                <PageContainer key={block.id} className="py-6">
                  <figure>
                    <CoverImage src={url} alt={String(block.props.altEn)} className="w-full rounded-xl object-cover max-h-[480px]" />
                    {block.props.captionEn && (
                      <figcaption className="mt-2 text-xs text-muted text-center">
                        {t(lang, String(block.props.captionEn), String(block.props.captionSi || ""))}
                      </figcaption>
                    )}
                  </figure>
                </PageContainer>
              );
            }
            case "spacer":
              return <div key={block.id} style={{ height: Number(block.props.height) || 48 }} />;
            case "divider":
              return (
                <PageContainer key={block.id} className="py-4">
                  <hr className="newspaper-rule" />
                </PageContainer>
              );
            case "cta":
              return (
                <PageContainer key={block.id} className="py-10 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (preview) return;
                      const link = String(block.props.link || "/home");
                      setPage(link.startsWith("/") ? link.slice(1) : link);
                    }}
                    className={block.props.style === "ghost" ? "btn-ghost" : "btn-primary"}
                  >
                    {t(lang, String(block.props.labelEn), String(block.props.labelSi))}
                  </button>
                </PageContainer>
              );
            case "article_grid": {
              const count = Number(block.props.count) || 6;
              const cat = String(block.props.category || "all");
              const list = articles
                .filter((a) => cat === "all" || a.category === cat)
                .slice(0, count);
              return (
                <PageContainer key={block.id} className="py-10">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((a) => (
                      <ArticleCard key={a.id} article={a} lang={lang} onClick={() => !preview && openArticle(a)} />
                    ))}
                  </div>
                </PageContainer>
              );
            }
            case "columns":
              return (
                <PageContainer key={block.id} className="py-8">
                  <div className="newspaper-columns newspaper-body gap-8 text-sm sm:text-base leading-relaxed">
                    <div>
                      {lang === "BILINGUAL" ? (
                        <>
                          <p>{String(block.props.leftEn)}</p>
                          <p className="mt-3 text-muted">{String(block.props.leftSi)}</p>
                        </>
                      ) : (
                        t(lang, String(block.props.leftEn), String(block.props.leftSi))
                      )}
                    </div>
                    <div>
                      {lang === "BILINGUAL" ? (
                        <>
                          <p>{String(block.props.rightEn)}</p>
                          <p className="mt-3 text-muted">{String(block.props.rightSi)}</p>
                        </>
                      ) : (
                        t(lang, String(block.props.rightEn), String(block.props.rightSi))
                      )}
                    </div>
                  </div>
                </PageContainer>
              );
            default:
              return null;
          }
        })}
    </div>
  );
}
