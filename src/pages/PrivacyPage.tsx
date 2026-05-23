import PageContainer from "../components/ui/PageContainer";
import PageHero from "../components/ui/PageHero";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";

export default function PrivacyPage() {
  const { lang } = useApp();

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14 max-w-3xl">
        <PageHero
          eyebrow={t(lang, "Legal", "නීතිමය")}
          title={t(lang, "Privacy Policy", "පෞද්ගලිකත්ව ප්‍රතිපත්තිය")}
          subtitle={t(
            lang,
            "How Vidya Chinthana handles your data on this device and platform.",
            "මෙම උපාංගයේ දත්ත කළමනාකරණය."
          )}
        />
        <div className="prose-premium space-y-6 text-muted text-sm leading-relaxed">
          <p>
            {t(
              lang,
              "Reading progress, bookmarks, and language preferences are stored locally in your browser unless you sign in. We do not sell personal data.",
              "කියවීම් ප්‍රගතිය, bookmarks, භාෂා preference browser එකේ locally සුරකිනව. පෞද්ගලික දත්ත විකුණන්නේ නැහැ."
            )}
          </p>
          <p>
            {t(
              lang,
              "If you create an account, your username and role are stored on our server for authentication and editorial workflows.",
              "ගිණුමක් සාදාගත්තොත් username සහ role server එකේ authentication සඳහා සුරකිනව."
            )}
          </p>
          <p>
            {t(
              lang,
              "Contact the site owner via the email in the footer for data requests or deletion.",
              "දත්ත ඉල්ලීම් සඳහා footer එකේ email එකට සම්බන්ධ වන්න."
            )}
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
