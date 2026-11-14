# Steven Barash personal site

A personal professional site for Steven Barash, Senior Solutions Engineer at Descope, aimed primarily at hiring managers and solutions engineering leaders. The homepage leads with a personal greeting and concise professional introduction, followed by technical background, Brooklyn interests, and a direct email close. The photography library stays in its dedicated gallery rather than decorating the homepage; the shared profile photograph is the only exception. Primary navigation covers experience, photography, and contact. Existing software project URLs remain intact but unpromoted on the homepage or resume. The working Windows 95 version is available at `/desktop` with `noindex, follow`.

The homepage headline emphasizes customer collaboration and hands-on building. Its supporting introduction covers authentication and authorization for both users and AI agents, from early technical conversations to working prototypes.

The background and experience summary use the same conversational voice, covering customer identity, identity for AI agents, and familiarity with web, mobile, backend, and SDK development. The shared profile photograph lives at `public/images/profile-photo.png`.

The code-side canonical origin is `https://barash.me`. DNS, Vercel project settings, redirects, and deployment are managed separately and are not changed by this repository phase.

## Requirements

- Node.js 22.19.0+ (22.x) or 24.0.0+; required by the lint and Lighthouse tooling
- npm
- Playwright Chromium and WebKit builds, installed once with `npx playwright install chromium webkit`
- Chrome or Chromium for Lighthouse

## Local development

```bash
npm install
npm run dev
```

Direct dependencies target stable releases, with exact resolutions in `package-lock.json`. Keep Next.js and `eslint-config-next`, React and React DOM, and the Tailwind packages aligned when upgrading. Preserve the TypeScript aliases: `@typescript/native` runs TypeScript 7, while `typescript` supplies the TypeScript 6 compatibility API for tooling.

Open `http://localhost:3000`.

## Verification commands

```bash
npm test
npm run lint
npm run type-check
npm run build
npm audit --omit=dev --audit-level=high
npm run lighthouse
```

`npm test` builds and tests an isolated production server on port 3101. `npm run lighthouse` builds and audits an isolated production server on port 3102. Both workflows own their build directories and clean up their servers.

`npm run build` also scans deployable output for private material and stale public identities. The scanner supports standard Next output and Vercel's adapter layout, including `output/functions/*.prerender-fallback.*` and `output/static` within the build directory. It still requires all three output classes: rendered HTML, route payloads, and first-party JavaScript. Do not disable this check to work around deployment path differences.

## Public routes

- `/`
- `/resume`
- `/projects`
- `/projects/pult`
- `/projects/uptick`
- `/projects/bike-cli`
- `/projects/personal-site`
- `/photos`
- `/contact`

The sitemap contains exactly those routes. `/desktop` and the `/credits` attribution utility page each have their own canonical URL, use `noindex, follow`, and are not listed in the sitemap.

## Route split and compatibility

Server-rendered portfolio documents are the primary public experience. The Windows 95 desktop and its focused application windows live only at `/desktop`.

Legacy links remain supported through fixed redirects and client normalization:

- `/?app=projects` redirects to `/projects`.
- `/?app=explorer` redirects to `/contact`.
- Known embedded applications move to `/desktop?app=<id>`.
- Recognized `#section-*` links resolve to their current stable destination.

Unknown project slugs return a clean 404. The dynamic project route keeps `dynamicParams = true` so Next 16 can reach `notFound()` without an internal `NoFallbackError` log.

## Design systems

The public site adapts [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) using `@once-ui-system/core`: self-hosted IBM Plex Sans, dark and light themes, cyan atmosphere, rounded controls, a floating desktop navigation pill, and an opaque mobile bottom bar with visible destination labels. Content is capped at 960px, with an 800px homepage reading column. The homepage hero has three groups: profile photograph/greeting/introduction, centered career context with a compact icon-only LinkedIn/GitHub/X row below, and experience/contact actions. All three groups share one centerline. Mobile typography and spacing are compact; below 375px, the primary actions stack at full width. Technical background, personal interests, and email follow directly; the Descope lead paragraph and work-examples section have been removed. The photography library lives on `/photos`. An authentic Windows 95 Start shortcut stays fixed bottom-left across public pages, including 404s, and opens `/desktop`. Its visible face matches the desktop Start button's screen coordinates. Mobile navigation sits beside it with a subtle divider, 12px Home/Resume/Photos/Contact labels, and rounded-rectangle selection. The mobile theme toggle sits in the top-right header. The photo modal covers navigation and makes it inert until dismissed.

`/photos` uses Once UI `MasonryGrid` with two columns on desktop, one on mobile, consistent 24px gutters, original image proportions, and captions. `PhotoMedia` uses optimized `next/image` thumbnails and a named native modal dialog. The first thumbnail loads eagerly with high fetch priority; others are lazy. Click, touch, Enter, or Space opens enlargement. Escape, the close button, or a backdrop click dismisses it. Focus stays inside the modal, background scrolling is locked, and dismissal returns focus to the originating photograph. Light-theme supporting copy uses a stronger semantic foreground to maintain contrast over the cyan atmosphere.

The homepage portrait uses a 72px optimized, eager-loaded `next/image`, avoiding the full-resolution PNG download for a small avatar. Contact retains descriptive bordered social links in a two-column grid that stacks on phones.

The `/desktop` route retains teal, silver, navy, hard bevels, Windows 95 raster icons, compact system type, menus, windows, and a taskbar. Floating windows support captured mouse, touch, and pen dragging, with cancellation and interruption cleanup; phone windows stay pinned. See `DESIGN.md` for tokens and `ARCHITECTURE.md` for rendering boundaries.

Magic Portfolio is used under its [CC BY-NC 4.0 license](https://creativecommons.org/licenses/by-nc/4.0/). A compact Credits footer link leads to `/credits`, which credits Once UI, identifies this adaptation, and links the template source and license. This free license permits noncommercial use; commercial use requires the template's commercial license. The Once UI core package is MIT-licensed.

`PortfolioProviders` keeps theme attributes and persisted preference inside `.portfolio-site`. Sass scopes Once UI's foundational CSS to that boundary, preserving desktop resets and typography. Next's `optimizePackageImports` excludes unused Once UI modules from deployed bundles.

## Browser test matrix

| Playwright project | Browser | Coverage |
| --- | --- | --- |
| `chromium` | Desktop Chromium | Public routes, metadata, redirects, keyboard, desktop interaction |
| `mobile-webkit` | iPhone 13 WebKit | Mobile layout, touch behavior, overflow, responsive desktop interaction |

Visual review covers Home, Experience, Photography, and Contact at desktop and mobile sizes. Retained project routes receive production smoke coverage.

## Metadata and source centralization

`src/constants/site.ts` is the code source of truth for the canonical origin, visible email, and social identities. Route metadata, robots, sitemap, manifest, Person JSON-LD, profile content, and resume links derive from it. The root share image is generated at 1200 by 630 pixels from `src/app/opengraph-image.tsx`.

The professional headline, broad `professionalLabel`, public biography, technical background, interests (including building agents), and personal details are centralized in `src/content/profile.ts`. The public homepage, Windows 95 About Me, and terminal biography render the same shared paragraphs; the desktop home shares the headline and background, with first-class X and GitHub links from `siteConfig`. Global metadata, the manifest, and the root share image reuse the profile identity. Both interfaces use the same complete résumé, photograph catalog, published projects, and contact destinations; their layouts remain distinct. The supplied biography confirms Descope coverage across the U.S. East Coast and Europe and the anonymous ID.me deployment becoming the company's largest deal closed that fiscal year; it does not establish a customer name, revenue amount, or segment-specific ranking.

## Windows icon provenance

The raster assets in `public/images/win95-icons/` come from `@react95/icons` 2.5.3. Their licensing note is recorded in `public/images/win95-icons/SOURCE.md`. They remain limited to the optional desktop experience.
