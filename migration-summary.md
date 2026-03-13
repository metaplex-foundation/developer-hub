# Domain Migration Summary: `developers.metaplex.com` → `metaplex.com/docs`

## Overview

Migrated the Developer Hub from being served at `developers.metaplex.com` to `metaplex.com/docs` by adding Next.js `basePath: '/docs'` and updating all hardcoded references.

## What `basePath: '/docs'` handles automatically

- `<Link>` and `next/link` hrefs get `/docs` prepended
- `<Image>` and `next/image` src gets `/docs` prepended
- `router.push()` / `router.replace()` paths get `/docs` prepended
- `/_next/static/*` assets served from `/docs/_next/static/*`

## What we fixed manually

### Core config

| File | Change |
|------|--------|
| `next.config.js` | Added `basePath: '/docs'` |

### Middleware (critical basePath fixes)

| File | Change |
|------|--------|
| `src/middleware.js` | **Three fixes:** (1) Replaced all `new URL(path, request.url)` redirects with `request.nextUrl.clone()` — `new URL()` does NOT include basePath, causing redirects to go to `/` instead of `/docs/`. (2) Fixed root path rewrite from `/en/` (trailing slash) to `/en` (no trailing slash) to avoid trailing-slash redirect loop. (3) Added `'/'` to middleware matcher — the regex pattern `/((?!...).*` does not match the empty root path when basePath is active. |

### Static assets (raw HTML not handled by Next.js)

| File | Change |
|------|--------|
| `src/pages/_document.jsx` | Prefixed favicon/manifest `<link>` hrefs with `/docs` |
| `src/components/Header.jsx` | `<img src="/metaplex-logo-white.png">` → `<img src="/docs/metaplex-logo-white.png">` |
| `src/components/Footer.jsx` | Same logo path fix |
| `src/components/MobileNavigation.jsx` | Same logo path fix |

### Domain/URL references

| File | Change |
|------|--------|
| `src/components/SEOHead.jsx` | `SITE_URL` → `https://metaplex.com/docs`, `getBaseUrl()` now includes `/docs` for all environments, `twitter:domain` → `metaplex.com` |
| `src/pages/sitemap.xml.js` | Sitemap URLs now use `https://metaplex.com/docs` |
| `src/pages/api/og.jsx` | Logo URL and domain text in OG images updated |
| `src/components/OfficialLinks.jsx` | Documentation link updated |
| `scripts/generate-llms-txt.mjs` | `SITE_URL` and all hardcoded URLs updated |
| `public/robots.txt` | Sitemap URL updated |
| `public/llms.txt` | All URLs updated (also regeneratable via `node scripts/generate-llms-txt.mjs`) |

### Locale detection

| File | Change |
|------|--------|
| `src/contexts/LocaleContext.js` | Strips `/docs` from `window.location.pathname` before locale detection (browser URLs include basePath, but Next.js routing does not) |

### Markdoc internal links

| File | Change |
|------|--------|
| `markdoc/nodes.js` | Added custom `link` node using `MarkdocLink` component |
| `src/components/MarkdocLink.jsx` | **New file.** Renders internal links (`/...`, `#...`) via Next.js `<Link>` (which auto-prepends basePath), external links as plain `<a>` tags |

### Markdown content (64 files)

All `https://developers.metaplex.com` URLs in `src/pages/**/*.md` were replaced with `https://metaplex.com/docs`.

## Key gotchas discovered

1. **`new URL(path, request.url)` in middleware does NOT include basePath** — must use `request.nextUrl.clone()` + set `.pathname` instead. This affected ALL redirect rules.

2. **Middleware matcher regex doesn't match the basePath root** — the pattern `/((?!_next/static|...).*` requires at least one character after `/`. The basePath root path is effectively empty after stripping. Fix: add explicit `'/'` to the matcher array.

3. **Root rewrite trailing slash** — rewriting `/` to `/en/` (with trailing slash) triggers Next.js trailing-slash normalization which can interfere. Fix: rewrite to `/en` (no trailing slash) for the root path.

## Verification checklist

- [x] `pnpm run build` succeeds
- [x] Homepage at `localhost:3000/docs` (200)
- [x] Product page at `localhost:3000/docs/smart-contracts/core` (200)
- [x] Localized page at `localhost:3000/docs/ja/smart-contracts/core` (200)
- [x] Korean page at `localhost:3000/docs/ko/smart-contracts/core` (200)
- [x] Static assets load (logo 200, favicons 200)
- [x] Legacy redirects work (`/docs/core` → `/docs/smart-contracts/core`)
- [x] Correct `lang` attribute per locale (en, ja, ko)
- [x] Markdown internal links navigate correctly (all hrefs have `/docs` prefix)
- [x] OG images generate correctly (200, uses self-referencing host URL for logo)
- [x] Canonical URLs correct (`https://metaplex.com/docs/smart-contracts/core`)
- [x] hreflang tags correct (en, ja, ko, zh, x-default all point to `metaplex.com/docs/...`)
- [x] Sitemap code updated (500 in local dev is pre-existing — only works on Vercel deployment)

## Deployment notes

The app team needs to set up a rewrite from `metaplex.com/docs` to the internal docs URL (Vercel deployment). No other infrastructure changes are needed on the docs side.
