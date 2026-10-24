# Architecture

## Overview

This is a Next.js 16 App Router application written in TypeScript. The primary site is a set of server-rendered portfolio routes built with Once UI. A functional Windows 95 client experience remains available at `/desktop` as a noindex easter egg.

## Route structure

```text
src/app/
├── layout.tsx                  # Global metadata and one Person JSON-LD entity
├── page.tsx                    # Magic Portfolio-style homepage
├── resume/page.tsx             # Complete experience document
├── projects/page.tsx          # Four-project index
├── projects/[slug]/page.tsx   # Published project details and project JSON-LD
├── photos/page.tsx             # Unified Once UI masonry photography gallery
├── contact/page.tsx            # Email and public social destinations
├── credits/page.tsx            # Noindex template attribution utility page
├── desktop/page.tsx            # Interactive Windows 95 easter egg
├── manifest.ts                 # Public PWA metadata
├── robots.ts                   # Crawler policy
├── sitemap.ts                  # Exact indexable route set
└── opengraph-image.tsx         # Dark public 1200 by 630 share image
```

`src/components/layout/PortfolioLayout.tsx` owns public navigation and document chrome. `PortfolioProviders.tsx` owns the public theme preference and scoped Once UI layout context. `PortfolioProjectIndex.tsx` and `PortfolioProjectDetail.tsx` render retained project documents. `DesktopEnvironment.tsx` and `src/components/ui/win95/` own desktop state and retro interaction. Shared facts live in `src/content` and `src/data`.

`src/components/photos/PhotoMedia.tsx` owns button thumbnails and named native modal enlargement. Native `showModal()` places the dialog above navigation and makes background content inert; the component contains focus, locks document scrolling, and restores trigger focus when dismissed. `next/image` preserves catalog dimensions and optimized responsive sources. The first thumbnail loads eagerly with high fetch priority; others remain lazy. The gallery keeps the curated photographs first, followed by the remaining library, within a single responsive `MasonryGrid`.

The homepage portrait uses `next/image` directly at 72px with a matching size hint rather than the library Avatar's unoptimized native image. Both interfaces continue to share the original profile asset.

## Shared content across interfaces

- `src/content/profile.ts` owns the public background, protocols, interests, prototyping, personal, and language paragraphs. The homepage, desktop About Me, and read-only terminal biography consume those fields; the desktop profile record also derives its role, company, location, and portrait from this source.
- `src/data/resume.ts` supplies both résumé presentations: all eight employers, roles, dates, locations, bullets, education, skills, languages, and honors. Desktop tabs and public capability groups are presentation differences, not separate content.
- `src/data/photos.ts` owns every image and its descriptive metadata. `src/content/photography.ts` owns the shared casual introduction and public gallery ordering; desktop albums use the same complete catalog.
- `src/content/projects.ts` supplies both project indexes. Desktop project folders link to the canonical public case-study routes.
- `src/content/contact.ts` supplies the introduction and social destinations for both Contact views. `src/constants/site.ts` supplies canonical email and social identities, including the desktop home's X and GitHub actions.

Update these shared sources rather than adding interface-specific biographies or catalogs. Windows-style labels and chrome remain local to the desktop. About This Site explains the two interfaces and links to the main site and its credits.

## Canonical and metadata model

`src/constants/site.ts` is the only code source for the canonical origin, `https://barash.me`, plus Steven's visible email and social identities. Root metadata supplies the exact default title, defensible keywords, global share defaults, and the canonical Person JSON-LD entity. Stable pages replace title, description, canonical, Open Graph, and Twitter values with route-specific metadata.

JSON-LD is serialized with `<` escaped before insertion. Project pages emit `SoftwareSourceCode` entities that reference the one global Person by `@id`; they do not create duplicate Person entities.

The sitemap contains only the homepage, Resume, Projects, four published project details, Photos, and Contact. Robots points to `https://barash.me/sitemap.xml`. `/desktop` and `/credits` each remain canonical to themselves with `noindex, follow` and are absent from the sitemap.

## Project route and clean 404 behavior

`generateStaticParams()` returns only the four published project slugs. `dynamicParams = true` is intentional in Next 16: unmatched and draft slugs reach the catalog guard, which calls `notFound()` and returns a clean 404 instead of producing an internal `NoFallbackError` log. Published routes still prerender.

## Legacy redirects

`src/proxy.ts` handles only known legacy inputs. Old `?app=projects` and `?app=explorer` links redirect to `/projects` and `/contact`. Embedded desktop apps redirect to `/desktop?app=<id>`. Recognized old hash routes are normalized by the desktop controller. Redirect targets come from fixed mappings, so arbitrary external redirects are not accepted.

The code-side canonical cutover does not change DNS, Vercel settings, external redirects, or deployment configuration.

## Design boundaries

The public site adapts Once UI Magic Portfolio: IBM Plex Sans, cyan accents, dark/light themes, rounded controls, selective surfaces, and a mobile navigation dock. `/desktop` retains teal, silver, navy, bevels, compact interface typography, Windows icons, and the terminal. The generated share image and manifest follow the public default dark system.

The root imports Once UI token definitions, not unscoped element resets. `src/app/portfolio.scss` nests Once UI foundational styles and public artifact diagrams inside `.portfolio-site`; `globals.css` retains the desktop foundation. `PortfolioProviders` uses a deterministic dark server snapshot with `useSyncExternalStore`, persists `portfolio-theme`, and keeps an in-memory fallback if browser storage is denied. Theme attributes stay on the portfolio wrapper, never `html`. Public scrollbar and browser color-scheme selectors require that wrapper to be present.

Light-theme supporting text uses the stronger neutral medium foreground over the ambient cyan surface; the library's weak gray only passes on pure white. The override is scoped to the public light-theme boundary.

`Windows95Layout` owns floating window position and captured-pointer dragging. `WindowTitleBar` exposes pointer handlers only on its drag handle, above overlapping coarse-pointer menu hit areas. Drag dimensions are sampled at initiation; release, cancellation, lost capture, blur, resize, and maximize terminate the drag. Additional pointers cannot take ownership. Phone windows retain their pinned layout and native touch behavior.

`experimental.optimizePackageImports` tree-shakes the Once UI barrel so unused components do not enter first-party bundles. Public route content remains server-rendered; only theme state, navigation selection, and existing interactive destinations require client boundaries.

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

The post-build integrity scanner recognizes both local Next output (`server/app` and `static/chunks`) and Vercel adapter output under `<distDir>/output`. The adapter places rendered pages and route payloads in `output/functions/*.prerender-fallback.html` and `*.prerender-fallback.rsc`, with static assets under `output/static`. These artifacts undergo the same private-content checks as local prerenders. Every build must contain rendered HTML, rendered route payloads, and first-party JavaScript; deployment-specific layout is not a reason to skip those checks.

## Browser matrix

| Project | Browser profile | Main coverage |
| --- | --- | --- |
| `chromium` | Desktop Chrome | Stable routes, metadata, redirects, keyboard, desktop behavior, production output |
| `mobile-webkit` | iPhone 13 WebKit | Mobile layout, touch targets, overflow, desktop touch behavior |

Manual visual review covers Home, Experience, Contact, and Photography at desktop and mobile sizes, in both public themes where relevant. Full-gallery captures require loading and decoding the lazy images first. Project routes and Windows 95 interactions receive runtime smoke coverage.

## Icon provenance

The raster icons in `public/images/win95-icons/` were extracted from `@react95/icons` 2.5.3. Their licensing risk is documented in `public/images/win95-icons/SOURCE.md`. They remain part of the optional desktop experience and should not be substituted during routine public-site work.
