import PageContainer from "../components/ui/PageContainer";
import PageHero from "../components/ui/PageHero";
import { useApp } from "../context/AppContext";
import { t } from "../lib/labels";

export default function TermsPage() {
  const { lang } = useApp();

  return (
    <div className="page-enter">
      <PageContainer className="py-10 sm:py-14 max-w-3xl">
        <PageHero
          eyebrow={t(lang, "Legal", "නීතිමය")}
          title={t(lang, "Terms of Use", "භාවිත නියම")}
          subtitle={t(
            lang,
            "Rules for reading and contributing to Vidya Chinthana.",
            "විද්‍යා චින්තන භාවිත නියම."
          )}
        />
        <div className="prose-premium space-y-6 text-muted text-sm leading-relaxed">
          <p>
            {t(
              lang,
              "Content is for education and editorial purposes. Do not reproduce articles without permission from the publisher.",
              "අන්තර්ගතය අධ්‍යාපන සහ සංස්කරණ අරමුණු සඳහා. අනුමතිය නොමැතිව නැවත ප්‍රකාශනය නොකරන්න."
            )}
          </p>
          <p>
            {t(
              lang,
              "Contributors are responsible for the accuracy of their published work. The platform owner may edit or remove content that violates community standards.",
              "ලේඛකයින් තම ලිපිවල නිරවද්‍යතාවට වගකි. ප්‍රමිති උල්ලංඝනය කළ අන්තර්ගතය ඉවත් කළ හැක."
            )}
          </p>
          <p>
            {t(
              lang,
              "Use of admin and studio tools is restricted to authorized roles.",
              "Admin සහ Studio tools අවසර ලැබූ roles වලට පමණි."
            )}
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
