# Vidya Studio vs Figma — සැබෑ මාර්ගය

## දැන් කොහෙද?

| විශේෂාණය | Vidya Studio | Figma |
|----------|--------------|-------|
| Site-specific editing | ✅ Hero, nav, theme, layout | ❌ Generic design tool |
| Live site preview | ✅ Real React preview | ⚠️ Prototype only |
| Contributor profiles + CMS | ✅ Built-in | ❌ Separate |
| Image upload + asset library | ✅ `/uploads` | ✅ Cloud assets |
| Multi-user design files | ❌ | ✅ |
| Vector tools, auto-layout v2 | ⚠️ Basic | ✅ |
| Design systems at scale | ⚠️ Theme presets | ✅ Variables v2 |
| Plugins ecosystem | ❌ | ✅ |

**නිගමනය:** Vidya Studio යනු **ඔයාගේ magazine site එකට optimized command center** — Figma replacer නොවේ. Figma වලට **සමාන UX patterns** (command palette, layers, assets, undo) දැන් තියෙනවා.

## Phase 1 — Done ✅

- **Insert panel** — home blocks, hero presets, nav links (Figma-style add to canvas)
- Command palette (Ctrl+K)
- Undo / redo history
- Device preview + zoom
- Layers list (home sections)
- Media + **Assets** panel
- **Image upload** (file picker + drag-drop)
- Unsaved changes indicator
- Publish to live site config

## Phase 2 — Launch polish (ඔබ + code)

1. Replace all picsum URLs with uploaded assets
2. Custom domain + HTTPS
3. Lighthouse 90+ on production

## Phase 3 — Figma-class studio (future)

| Feature | Effort |
|---------|--------|
| Figma MCP import (screens → tokens) | Medium — use `docs/FIGMA.md` |
| Visual drag-reorder on canvas | High |
| Component variants in studio | High |
| Real-time multi-editor | Very high |
| Full vector editor | Not recommended — use Figma for that |

**උපදෙස්:** Magazine layout සහ branding = **Vidya Studio**. Pixel-perfect marketing illustrations = **Figma** → export images → **Studio Assets upload**.

## Image upload

- Max **8MB** per file
- Stored in `public/uploads/`
- Requires login (owner/editor/author) + password on upload
- Account → Profile editor, or Studio → Assets
