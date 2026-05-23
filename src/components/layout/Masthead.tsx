import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";

export default function Masthead() {
  const { lang, siteConfig: sc } = useApp();
  const today = new Date().toLocaleDateString(lang === "SI" ? "si-LK" : "en-LK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="newspaper-masthead py-5 sm:py-6 mb-4 sm:mb-6">
      <div className="newspaper-rule-double mb-4" aria-hidden />
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 text-center lg:text-left">
        <div>
          <p className="newspaper-edition-label">{today}</p>
          <h2 className="font-display newspaper-headline text-3xl sm:text-5xl font-medium tracking-tight mt-2">
            {t(lang, sc.branding.siteNameEn, sc.branding.siteNameSi)}
          </h2>
          {lang === "BILINGUAL" && (
            <p className="font-display text-xl text-muted mt-1 italic">{sc.branding.siteNameSi}</p>
          )}
        </div>
        <div className="lg:text-right max-w-sm mx-auto lg:mx-0">
          <p className="newspaper-edition-label">{t(lang, "Digital edition", "ඩිජිටල් කලාපය")}</p>
          <p className="text-sm text-muted mt-2 leading-relaxed newspaper-body">
            {t(lang, sc.branding.taglineEn, sc.branding.taglineSi)}
          </p>
        </div>
      </div>
      <div className="newspaper-rule mt-5" aria-hidden />
    </header>
  );
}
