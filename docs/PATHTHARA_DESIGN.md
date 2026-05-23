# Paththara (පත්තර) — Digital Soft Copy Design

**Vidya Chinthana** · Bilingual science magazine presented as a realistic digital newspaper edition.

---

## Design intent | අරමුණ

We studied premium digital editions (NYT, Guardian, Apple News+, regional e-papers) and adapted the patterns that work for a **bilingual science paththara**:

| Pattern | Implementation |
|--------|----------------|
| Masthead + edition metadata | `EditionBar`, `Masthead`, newsstand masthead strip |
| Multi-column body | `paththara-body-columns` (`column-count: 2` on desktop) |
| Drop cap / serif body | `drop-cap`, `newspaper-dropcap`, `--font-article` |
| Fold / spread | `paththara-fold` center rule on wide layouts |
| Article jumps | `paththara-jump` “Continued below” kicker |
| Newsstand covers | `newsstand-grid` + `newsstand-front` 3:4 covers |
| Print / PDF | `@media print` on `.article-print-root` |
| Page texture | Subtle noise overlay on `.paththara-sheet` |

**Not in v1 (phase 2):** WebGL page-flip book, full spread PDF export, live weather API.

---

## Key components

- `EditionBar` — volume, issue #, date, optional weather/price strip
- `ArticleReader` — edition bar, paththara sheet, columns, print button
- `IssuePage` — cover spread + inside stories grid
- `IssuesPage` — digital newsstand
- `MagazineFront` — home front page with edition bar
- `CmsArticlePreview` — CMS split preview using same newspaper CSS

---

## CSS tokens

Uses existing vars: `--font-display`, `--font-article`, `--vc-border`, `--vc-accent`.

Print stylesheet hides chrome (header, toolbar, buttons) and forces two-column body for soft-copy output.

---

## Testing locally

```bash
npm run dev
```

Routes: `#/issues` (newsstand), open an issue, read any article (`#/read/:id`), CMS compose split preview (`#/cms` as editor).

Print: open article → printer icon or browser Print.
