# Architecture

## Overview

This is a Next.js 16 App Router application written in TypeScript. The primary site is a set of server-rendered minimal routes. A functional Windows 95 client experience remains available at `/desktop` as a noindex easter egg.

## Route structure

```text
src/app/
├── layout.tsx                  # Global metadata and one Person JSON-LD entity
├── page.tsx                    # Minimal homepage
├── resume/page.tsx            # Minimal resume
├── projects/page.tsx          # Four-project index
├── projects/[slug]/page.tsx   # Published project details and project JSON-LD
├── photos/page.tsx             # Minimal photography route
├── contact/page.tsx            # Minimal contact route
├── desktop/page.tsx            # Interactive Windows 95 easter egg
├── manifest.ts                 # Public PWA metadata
├── robots.ts                   # Crawler policy
├── sitemap.ts                  # Exact indexable route set
└── opengraph-image.tsx         # Minimal 1200 by 630 share image
```

`src/components/layout/MinimalSiteLayout.tsx` owns public navigation and document chrome. `DesktopEnvironment.tsx` and `src/components/ui/win95/` own desktop state and retro interaction. Shared facts live in `src/content` and `src/data`.

## Canonical and metadata model

`src/constants/site.ts` is the only code source for the canonical origin, `https://barash.me`, plus Steven's visible email and social identities. Root metadata supplies the exact default title, defensible keywords, global share defaults, and the canonical Person JSON-LD entity. Stable pages replace title, description, canonical, Open Graph, and Twitter values with route-specific metadata.

JSON-LD is serialized with `<` escaped before insertion. Project pages emit `SoftwareSourceCode` entities that reference the one global Person by `@id`; they do not create duplicate Person entities.

The sitemap contains only the homepage, Resume, Projects, four published project details, Photos, and Contact. Robots points to `https://barash.me/sitemap.xml`. `/desktop` remains canonical to itself with `noindex, follow` and is absent from the sitemap.

## Project route and clean 404 behavior

`generateStaticParams()` returns only the four published project slugs. `dynamicParams = true` is intentional in Next 16: unmatched and draft slugs reach the catalog guard, which calls `notFound()` and returns a clean 404 instead of producing an internal `NoFallbackError` log. Published routes still prerender.

## Legacy redirects

`src/proxy.ts` handles only known legacy inputs. Old `?app=projects` and `?app=explorer` links redirect to `/projects` and `/contact`. Embedded desktop apps redirect to `/desktop?app=<id>`. Recognized old hash routes are normalized by the desktop controller. Redirect targets come from fixed mappings, so arbitrary external redirects are not accepted.

The code-side canonical cutover does not change DNS, Vercel settings, external redirects, or deployment configuration.

## Design boundaries

The public site uses white, near-black, restrained blue, system sans typography, square geometry, and plain document or row layouts. `/desktop` retains teal, silver, navy, bevels, compact interface typography, Windows icons, and the terminal. The generated share image and manifest always follow the public system.

## Build and test workflow

```bash
npm run dev
npm test
npm run lint
npm run type-check
npm run build
npm run lighthouse
npm audit --omit=dev --audit-level=high
```

Development uses Webpack. `npm test` builds into `.next-playwright` and serves an isolated production server at `127.0.0.1:3101`. Lighthouse builds into `.next-lighthouse`, serves production at `127.0.0.1:3102`, writes `.lighthouse/local-production.report.json`, and removes its server and build directory after the run.

## Browser matrix

| Project | Browser profile | Main coverage |
| --- | --- | --- |
| `chromium` | Desktop Chrome | Stable routes, metadata, redirects, keyboard, desktop behavior, production output |
| `mobile-webkit` | iPhone 13 WebKit | Mobile layout, touch targets, overflow, desktop touch behavior |

Manual final screenshots cover Home, Projects, and Photos at desktop and mobile sizes. Port checks confirm that test and Lighthouse servers do not remain after verification.

## Icon provenance

The raster icons in `public/images/win95-icons/` were extracted from `@react95/icons` 2.5.3. Their licensing risk is documented in `public/images/win95-icons/SOURCE.md`. They remain part of the optional desktop experience and should not be substituted during routine public-site work.
