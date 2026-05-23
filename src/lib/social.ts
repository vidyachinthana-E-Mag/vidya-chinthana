import { AuthorProfile } from "../types";

export type AuthorSocial = AuthorProfile["social"];

export const EMPTY_AUTHOR_SOCIAL: AuthorSocial = {
  email: "",
  twitter: "",
  website: "",
  facebook: "",
  instagram: "",
  whatsapp: "",
};

/** Merge persisted profiles that predate extended social fields. */
export function normalizeAuthorSocial(
  social?: Partial<AuthorSocial> | null
): AuthorSocial {
  return { ...EMPTY_AUTHOR_SOCIAL, ...social };
}

export function hasPublicSocial(social: AuthorSocial): boolean {
  return Object.values(social).some((v) => Boolean(v?.trim()));
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function whatsappHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http")) return trimmed;
  const digits = digitsOnly(trimmed);
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function externalHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("www.")) return `https://${trimmed}`;
  if (trimmed.includes(".") && !trimmed.includes(" ")) return `https://${trimmed}`;
  return null;
}

export function twitterHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http")) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return `https://twitter.com/${handle}`;
}

export function facebookHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http")) return trimmed;
  return `https://facebook.com/${trimmed.replace(/^@/, "")}`;
}

export function instagramHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http")) return trimmed;
  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
}

export type SocialLinkKind =
  | "email"
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "twitter"
  | "website";

export function socialLinksForProfile(
  social: AuthorSocial
): { kind: SocialLinkKind; href: string; label: string }[] {
  const out: { kind: SocialLinkKind; href: string; label: string }[] = [];
  if (social.email?.trim()) {
    out.push({ kind: "email", href: `mailto:${social.email.trim()}`, label: "Email" });
  }
  const wa = whatsappHref(social.whatsapp);
  if (wa) out.push({ kind: "whatsapp", href: wa, label: "WhatsApp" });
  const fb = facebookHref(social.facebook);
  if (fb) out.push({ kind: "facebook", href: fb, label: "Facebook" });
  const ig = instagramHref(social.instagram);
  if (ig) out.push({ kind: "instagram", href: ig, label: "Instagram" });
  const tw = twitterHref(social.twitter);
  if (tw) out.push({ kind: "twitter", href: tw, label: "X" });
  const web = externalHref(social.website);
  if (web) out.push({ kind: "website", href: web, label: "Website" });
  return out;
}
