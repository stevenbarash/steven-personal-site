# Steven Barash personal site

A minimal public portfolio for Steven Barash, Senior Solutions Engineer at Descope. The primary routes cover his resume, software projects, photography, and contact details. A functional Windows 95 version remains available at `/desktop` as a noindex easter egg.

The code-side canonical origin is `https://barash.me`. DNS, Vercel project settings, redirects, and deployment are managed separately and are not changed by this repository phase.

## Requirements

- Node.js 20.9.0 or newer
- npm
- Playwright Chromium and WebKit builds, installed once with `npx playwright install chromium webkit`
- Chrome or Chromium for Lighthouse

## Local development

```bash
npm install
npm run dev
```

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

The sitemap contains exactly those routes. `/desktop` is canonical to `/desktop`, uses `noindex, follow`, and is not listed in the sitemap.

## Route split and compatibility

Minimal server-rendered documents are the primary public experience. The Windows 95 desktop and its focused application windows live only at `/desktop`.

Legacy links remain supported through fixed redirects and client normalization:

- `/?app=projects` redirects to `/projects`.
- `/?app=explorer` redirects to `/contact`.
- Known embedded applications move to `/desktop?app=<id>`.
- Recognized `#section-*` links resolve to their current stable destination.

Unknown project slugs return a clean 404. The dynamic project route keeps `dynamicParams = true` so Next 16 can reach `notFound()` without an internal `NoFallbackError` log.

## Design systems

The public site uses a white background, near-black text, one restrained blue accent, square geometry, and a system sans stack. It does not use cards, glass, decorative gradients, or terminal styling.

The `/desktop` route retains teal, silver, navy, hard bevels, Windows 95 raster icons, compact system type, menus, windows, and a taskbar. See `DESIGN.md` for tokens and `ARCHITECTURE.md` for rendering boundaries.

## Browser test matrix

| Playwright project | Browser | Coverage |
| --- | --- | --- |
| `chromium` | Desktop Chromium | Public routes, metadata, redirects, keyboard, desktop interaction |
| `mobile-webkit` | iPhone 13 WebKit | Mobile layout, touch behavior, overflow, responsive desktop interaction |

Final visual review uses fresh desktop and mobile screenshots for Home, Projects, and Photos.

## Metadata and source centralization

`src/constants/site.ts` is the code source of truth for the canonical origin, visible email, and social identities. Route metadata, robots, sitemap, manifest, Person JSON-LD, profile content, and resume links derive from it. The root share image is generated at 1200 by 630 pixels from `src/app/opengraph-image.tsx`.

## Windows icon provenance

The raster assets in `public/images/win95-icons/` come from `@react95/icons` 2.5.3. Their licensing note is recorded in `public/images/win95-icons/SOURCE.md`. They remain limited to the optional desktop experience.
