# Architecture

## Overview

This is a Next.js 16 App Router application written in TypeScript. The server-rendered app shell owns metadata and route-file conventions; the interactive Windows 95 desktop runs in client components. The product is a focused desktop portfolio, not a set of independently routed content pages.

## Application structure

```text
src/
├── app/
│   ├── layout.tsx              # Root metadata, structured data, analytics shell
│   ├── page.tsx                # Desktop application registry and page entry
│   ├── globals.css             # Windows 95 palette, bevels, typography, touch targets
│   ├── manifest.ts             # PWA manifest route
│   ├── robots.ts               # Crawler policy route
│   ├── sitemap.ts              # Stable sitemap route
│   └── opengraph-image.tsx     # Generated 1200×630 social preview image
├── components/
│   ├── layout/
│   │   ├── DesktopEnvironment.tsx # URL-driven focused-window controller
│   │   └── Windows95Layout.tsx    # Shared window chrome
│   └── ui/win95/               # Desktop, menu, taskbar, explorer, and section UI
├── data/                       # Profile, résumé, projects, and photo content
├── types/                      # Shared TypeScript models
└── lib/                        # Small reusable utilities

tests/e2e/
├── desktop-navigation.spec.ts  # Production-browser navigation and target-size coverage
├── menu-navigation.spec.ts     # Menu semantics, routing, keyboard, and touch coverage
├── resume-tabs.spec.ts         # Canonical Resume and accessible-tab coverage
└── task-4-remediation.spec.ts  # Final accessibility, motion, and metadata regressions
```

## Focused window and URL state

`DesktopEnvironment` treats the query parameter `app` as the single canonical focused-window state. An absent `app` value means My Computer. Known IDs render only their corresponding application; unknown IDs are normalized to My Computer. Launching an application pushes the canonical query state, and clearing `app` leaves unrelated parameters intact. Browser history therefore reconstructs the focused window on Back, Forward, refresh, and cold load.

Recognized legacy `#section-*` fragments are input compatibility only. On cold load the client maps them to `?app=<id>` with a history replacement, retaining unrelated query parameters. This avoids duplicate canonical states.

`MenuBar` is a command surface over that same state model. File owns window/session actions, View owns application launchers, and Help owns help/site-information launchers. Cross-route commands use the section-to-application mapping in `DesktopEnvironment`, so a command chosen from `/photos` retains its intended `?app=<id>` target when it returns to the desktop.

## Rendering boundary

The root layout, metadata routes, sitemap, robots file, manifest, and generated social image are App Router server-side concerns. The desktop controller and interactive controls are client components because they respond to browser history, keyboard, pointer, and touch events. Static content is held in `src/data` and is rendered by focused application components.

## Design constraints

`DESIGN.md` defines the accepted visual contract: the Windows 95 palette, Tahoma/system interface typography, Courier terminal typography, raised and sunken bevels, pixel imagery, desktop double-click behavior, keyboard Enter/Space behavior, and one-tap mobile access. Coarse-pointer interactive targets are at least 44 by 44 CSS pixels while the visible artwork retains its original density.

## Metadata and static routes

`layout.tsx` supplies canonical, Open Graph, Twitter, structured-data, and Brooklyn locality metadata. The actual portrait is 250×250 and the structured data declares those dimensions. `opengraph-image.tsx` emits the 1200×630 Windows 95 image used by the metadata image route. The manifest retains only the valid SVG icon entry; it does not assert unavailable raster icon or screenshot dimensions. The sitemap deliberately omits a build-time `lastModified` value so it does not pretend that every build changed site content.

## Build and test workflow

Development and production builds use Webpack:

```bash
npm run dev
npm run build
```

`npm run build` first runs the project type check. `npm test` invokes Playwright against an isolated Webpack production build in `.next-playwright` on port 3101 and never reuses another server. The suite covers deep links, canonicalization, browser history, desktop/keyboard/touch launching, command-menu semantics, cross-route targets, coarse-pointer target sizes, canonical Resume tabs, shutdown-dialog modality, reduced motion, and generated-image text guards. It does not download a browser.

Linting and type checking are separate commands:

```bash
npm run lint
npm run type-check
```

## Icon provenance decision

The icons in `public/images/win95-icons/` are native 16×16 and 32×32 raster variants extracted from `@react95/icons` 2.5.3. React95's source notice says its MIT license does not cover the Windows-associated images, which remain Microsoft property. The user has explicitly accepted that unresolved licensing risk and directed that the actual raster assets be retained. Do not replace, redraw, rename, or delete them during ordinary implementation work. The source record is in [`public/images/win95-icons/SOURCE.md`](public/images/win95-icons/SOURCE.md).
