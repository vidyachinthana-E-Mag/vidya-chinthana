import { MessageCircle, Copy, Mail } from "lucide-react";
import { Lang, t } from "../../lib/labels";
import {
  AuthorSocial,
  socialLinksForProfile,
  whatsappHref,
  normalizeAuthorSocial,
} from "../../lib/social";
import ProfileSocialBar from "./ProfileSocialBar";

export default function ProfileContactCard({
  social: raw,
  lang,
  name,
  onShare,
  onCopied,
}: {
  social: AuthorSocial;
  lang: Lang;
  name: string;
  onShare: () => void;
  onCopied: (msg: string) => void;
}) {
  const social = normalizeAuthorSocial(raw);
  const links = socialLinksForProfile(social);
  const wa = whatsappHref(social.whatsapp);

  const copyBundle = async () => {
    const lines = [
      name,
      ...links.map((l) => `${l.label}: ${l.href}`),
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      onCopied(
        t(lang, "Contact details copied!", "සම්බන්ධතා පිටපත් කළා!")
      );
    } catch {
      onCopied(t(lang, "Could not copy.", "පිටපත් කිරීම අසාර්ථකයි."));
    }
  };

  return (
    <aside className="profile-contact-card premium-card p-6 lg:sticky lg:top-24">
      <h3 className="vc-section-label mb-4">
        {t(lang, "Connect", "සම්බන්ධ වන්න")}
      </h3>

      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="profile-wa-cta w-full flex items-center justify-center gap-3 mb-5"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{t(lang, "Message on WhatsApp", "WhatsApp පණිවිඩය")}</span>
        </a>
      )}

      <ProfileSocialBar social={social} lang={lang} onShare={onShare} />

      {social.email?.trim() && (
        <a
          href={`mailto:${social.email.trim()}`}
          className="mt-4 w-full btn-ghost justify-center text-sm"
        >
          <Mail className="w-4 h-4" />
          {t(lang, "Send email", "ඊමේල් යවන්න")}
        </a>
      )}

      {links.length > 0 && (
        <button
          type="button"
          onClick={copyBundle}
          className="mt-3 w-full btn-ghost justify-center text-xs"
        >
          <Copy className="w-3.5 h-3.5" />
          {t(lang, "Copy all contact links", "සියලු සබැඳි පිටපත් කරන්න")}
        </button>
      )}
    </aside>
  );
}
