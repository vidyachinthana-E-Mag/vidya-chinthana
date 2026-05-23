import React from "react";
import { motion } from "motion/react";
import {
  Mail,
  Globe,
  Share2,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { Lang, t } from "../../lib/labels";
import {
  AuthorSocial,
  socialLinksForProfile,
  SocialLinkKind,
} from "../../lib/social";

const KIND_STYLE: Record<
  SocialLinkKind,
  { icon: React.ReactNode; className: string }
> = {
  email: {
    icon: <Mail className="w-4 h-4" />,
    className: "social-pill social-pill--email",
  },
  whatsapp: {
    icon: <MessageCircle className="w-4 h-4" />,
    className: "social-pill social-pill--whatsapp",
  },
  facebook: {
    icon: <Facebook className="w-4 h-4" />,
    className: "social-pill social-pill--facebook",
  },
  instagram: {
    icon: <Instagram className="w-4 h-4" />,
    className: "social-pill social-pill--instagram",
  },
  twitter: {
    icon: <span className="text-xs font-bold leading-none">𝕏</span>,
    className: "social-pill social-pill--twitter",
  },
  website: {
    icon: <Globe className="w-4 h-4" />,
    className: "social-pill social-pill--website",
  },
};

export default function ProfileSocialBar({
  social,
  lang,
  onShare,
}: {
  social: AuthorSocial;
  lang: Lang;
  onShare: () => void;
}) {
  const links = socialLinksForProfile(social);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="profile-social-bar w-full"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onShare}
          className="social-pill social-pill--share"
        >
          <Share2 className="w-4 h-4" />
          <span>{t(lang, "Share profile", "පැතිකඩ බෙදාගන්න")}</span>
        </button>
        {links.map((link) => {
          const style = KIND_STYLE[link.kind];
          const labelSi =
            link.kind === "whatsapp"
              ? "WhatsApp"
              : link.kind === "facebook"
                ? "Facebook"
                : link.kind === "instagram"
                  ? "Instagram"
                  : link.label;
          return (
            <a
              key={link.kind}
              href={link.href}
              target={link.kind === "email" ? undefined : "_blank"}
              rel={link.kind === "email" ? undefined : "noreferrer"}
              className={style.className}
              aria-label={link.label}
            >
              {style.icon}
              <span className="hidden sm:inline">
                {t(lang, link.label, labelSi)}
              </span>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}
