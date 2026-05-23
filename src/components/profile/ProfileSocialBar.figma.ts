// url=https://www.figma.com/design/REPLACE_FILE_KEY/Vidya-Chinthana?node-id=0-0
// source=src/components/profile/ProfileSocialBar.tsx
// component=ProfileSocialBar
import figma from "figma";

const instance = figma.selectedInstance;

const showWhatsapp = instance.getBoolean("Show WhatsApp", { true: "true", false: "false" });
const showShare = instance.getBoolean("Show Share", { true: "true", false: "false" });

export default {
  id: "profile-social-bar",
  example: figma.code`<ProfileSocialBar
  social={normalizeAuthorSocial(profile.social)}
  lang={lang}
  onShare={shareProfile}
/>`,
  imports: [
    'import ProfileSocialBar from "@/src/components/profile/ProfileSocialBar"',
    'import { normalizeAuthorSocial } from "@/src/lib/social"',
  ],
  metadata: {
    nestable: true,
    props: { showWhatsapp, showShare },
  },
};
