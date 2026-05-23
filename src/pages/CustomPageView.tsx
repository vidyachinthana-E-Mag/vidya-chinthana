import { useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";
import { usePageMeta } from "../hooks/usePageMeta";
import BlockRenderer from "../components/builder/BlockRenderer";
import PageContainer from "../components/ui/PageContainer";

export default function CustomPageView() {
  const { lang, siteConfig: sc, activePageSlug, setPage } = useApp();
  const page = sc.customPages.find((p) => p.slug === activePageSlug);

  const meta = useMemo(
    () =>
      page
        ? {
            title: t(lang, page.titleEn, page.titleSi),
            description: t(lang, page.titleEn, page.titleSi),
            path: `/page/${page.slug}`,
          }
        : null,
    [lang, page]
  );
  usePageMeta(meta ?? { title: "Page", description: "", path: "/page" });

  useEffect(() => {
    if (!page) setPage("home");
  }, [page, setPage]);

  if (!page) return null;

  return (
    <div className="page-enter">
      <PageContainer className="py-6 sm:py-8">
        <p className="newspaper-edition-label mb-2">{t(lang, "Special edition", "විශේෂ කලාපය")}</p>
        <h1 className="font-display text-3xl sm:text-5xl font-medium tracking-tight newspaper-headline">
          {t(lang, page.titleEn, page.titleSi)}
        </h1>
        <hr className="newspaper-rule mt-6 mb-2" />
      </PageContainer>
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
