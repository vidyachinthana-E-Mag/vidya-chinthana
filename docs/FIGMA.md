# Figma Code Connect — Vidya Chinthana

## Config

`figma.config.json` maps React components under `src/components/ui/` and `src/components/profile/`.

## Templates

| File | Code component | Notes |
|------|----------------|-------|
| `src/components/ui/ArticleCard.figma.ts` | `ArticleCard` | Magazine article card grid |
| `src/components/profile/ProfileSocialBar.figma.ts` | `ProfileSocialBar` | Share + WhatsApp / Facebook / Instagram / email |

Replace `REPLACE_FILE_KEY` in each template’s `// url=` comment with your Figma file key and set `node-id` after publishing components to a team library.

## Connect in Figma

1. Publish components to your team library (Organization/Enterprise plan).
2. Open the component in Figma → **Code Connect** → link to the matching `.figma.ts` template.
3. Use the Figma MCP `get_code_connect_suggestions` flow (see Cursor Figma plugin skills) to refresh mappings.

TypeScript excludes `**/*.figma.ts` from `tsc --noEmit` because those files run in Figma’s Code Connect runtime (`import figma from "figma"`).
