import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";

export default function SkipLink() {
  const { lang } = useApp();
  return (
    <a href="#main-content" className="skip-link">
      {t(lang, "Skip to main content", "ප්‍රධාන අන්තර්ගතයට පනින්න")}
    </a>
  );
}
