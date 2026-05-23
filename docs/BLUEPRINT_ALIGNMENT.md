# Blueprint → Site alignment

Reference: `Blueprint/Vidya_Chinthana_Project_Blueprint.txt`

## Phase 1 — Public website ✅ (code)

| Blueprint | Implementation |
|-----------|----------------|
| Homepage featured + issues + trending | HomePage + MagazineFront + TrendingRail + CategorySpotlight |
| Category pages (science, education, tech, sci-fi) | `#/category/:id` → `CategoryPage.tsx` |
| Author pages | `AuthorsPage` + `ProfilePage` |
| Article archives | `ArticlesPage` |
| Search | Home + Articles global search |
| Shareable links | `#/read/:id` hash routes |

## Phase 1 — Reading engine ✅

| Blueprint | Implementation |
|-----------|----------------|
| Scroll mode | ArticleReader scroll |
| Flip-book mode | ArticleReader flip |
| Font / line / theme | Reader controls |
| Continue reading | Home + Dashboard |
| Progress tracking | readProgress localStorage |

## Phase 2–3 — Auth, CMS ✅

| Blueprint | Implementation |
|-----------|----------------|
| Roles | owner / editor / author / reader |
| CMS workflow | CmsPage statuses |
| Profiles | ProfilePage + ProfileEditor |

## Phase 4 — Issues ✅

| Blueprint | Implementation |
|-----------|----------------|
| Issue detail | `IssuePage` + `#/issue/:id` |
| All issues index | `IssuesPage` → `#/issues` |

## Phase 5–7 — Future

Comments community, AI layout, mobile app — roadmap only.

## Tier B (your content)

Replace picsum, 10+ articles, custom domain — see `docs/WORLD_CLASS_PATH.md`.
