# Vidya Chinthana — Internal Site Audit (2026-05-23)

## Build & types
- [x] `npx tsc --noEmit` — pass
- [x] Error boundary + lazy routes
- [x] World-Class path doc + `qualityGate.ts`

## Accessibility
- [x] Skip link, focus states on auth form (ids)
- [ ] Decorative images still use `alt=""` in places — OK if `aria-hidden` on wrappers; improve with descriptive alt on hero logos
- [x] `prefers-reduced-motion` + `effects.reducedMotion`
- [x] CoverImage gradient fallback (no broken network for empty URLs)

## Performance
- [x] Three.js lazy-loaded per route (`React.lazy` on scene chunk)
- [x] Canvas DPR capped at 1.5
- [ ] Lighthouse 90+ — manual on deploy (Tier C)
- [x] Article/profile images lazy except above-fold

## React / console
- [x] WorldStudio `setSiteConfigDraft` in `useEffect` (not render)
- [x] No picsum in `data_db/` seed
- [ ] Legacy `src/data.ts` still has picsum for dev fallback — CoverImage intercepts

## 3D / motion
- [x] SciFiHero3D (Three.js) on Home hero, Login, Splash, Profile
- [x] AntigravityCanvas fallback when reduced motion or Suspense

## Remaining (future phase)
- Full Webflow-style Studio canvas / drag-drop page builder
- Replace all placeholder URLs in CMS defaults
- CDN + WebP, newsletter, production domain
