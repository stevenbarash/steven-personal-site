---
name: "Steven Barash Personal Site"
description: "Once UI Magic Portfolio adaptation with an isolated Windows 95 desktop."
colors:
  dark-page: "oklch(0.1448 0 0)"
  dark-ink: "#ffffff"
  dark-support: "oklch(0.7636 0 0)"
  dark-link: "oklch(0.8962 0.1030 203.93)"
  dark-border: "oklch(0.1957 0 0)"
  light-page: "#ffffff"
  light-ink: "oklch(0.1448 0 0)"
  light-support: "oklch(0.5624 0 0)"
  light-border: "oklch(0.9461 0 0)"
  cyan-wash: "oklch(0.6640 0.1467 238.08 / 0.15)"
  desktop-teal: "#008080"
  system-silver: "#c0c0c0"
  active-navy: "#000080"
typography:
  display:
    fontFamily: "var(--font-portfolio), sans-serif"
    fontSize: "clamp(42px, 5.6vw, 68px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  introduction:
    fontFamily: "var(--font-portfolio), sans-serif"
    fontSize: "clamp(20px, 2.5vw, 26px)"
    fontWeight: 400
    lineHeight: 1.4
  section:
    fontFamily: "var(--font-portfolio), sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "var(--font-portfolio), sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  supporting:
    fontFamily: "var(--font-portfolio), sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  desktop-interface:
    fontFamily: "Tahoma, Segoe UI, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  surface: "16px"
  navigation: "28px"
  portrait: "50%"
  desktop: "0px"
spacing:
  content-max: "960px"
  homepage-max: "800px"
  gutter: "24px"
  mobile-gutter: "16px"
  section: "104px"
  group: "24px"
  touch-target: "44px"
components:
  primary-action:
    backgroundColor: "{colors.dark-ink}"
    textColor: "{colors.dark-page}"
    rounded: "{rounded.navigation}"
  navigation:
    backgroundColor: "{colors.dark-page}"
    rounded: "{rounded.navigation}"
    height: "{spacing.touch-target}"
  featured-work:
    backgroundColor: "{colors.cyan-wash}"
    rounded: "{rounded.surface}"
    padding: "32px"
  photography:
    rounded: "{rounded.surface}"
---

# Design System: Steven Barash Personal Site

## Overview

**Creative North Star: "Magic Portfolio"**

The public site adapts Once UI's Magic Portfolio, selected by Steven to replace the flat Quiet Studio direction. A centered personal introduction, floating navigation, rounded controls, soft cyan atmosphere, and theme-aware surfaces make the site feel like a professional home rather than an application dashboard. Existing factual content and real photography remain the subject.

**Key Characteristics:**

- Self-hosted Geist and a clear display-to-body hierarchy.
- Dark by default, with a persistent light-theme control.
- Cyan for links, focus, and atmosphere.
- Rounded photographs and selective surfaces, balanced with bare reading sections.
- A desktop navigation pill that becomes a persistent mobile bottom dock.
- A completely separate Windows 95 experience at `/desktop`.

**The Two-World Rule.** Public styling and theme state stay inside the portfolio boundary. Never apply Once UI's element resets or theme attributes to the Windows 95 desktop.

## Colors

Once UI's gray neutral and cyan brand schemes supply the palette. The frontmatter records observed theme values; component CSS consumes semantic variables rather than copying those values. The configuration uses contrast solids, playful borders, and translucent surfaces. Primary actions invert with the theme instead of becoming cyan blocks.

### Primary

Cyan links and focus come from `--brand-on-background-medium` and `--brand-on-background-strong`. The subtle atmosphere and featured-work surface use brand alpha tokens. Body text on a tinted surface uses the stronger neutral medium token; weak text on the light cyan wash does not meet body contrast requirements.

### Neutral

Page, foreground, supporting copy, and boundaries use `--page-background`, `--neutral-on-background-strong`, `--neutral-on-background-weak`, and `--neutral-border-weak`. Rebind `--default-border` on the portfolio boundary: a root alias cannot resolve variables defined only on a descendant theme element.

The web manifest and generated share image follow the default dark palette. Windows 95 retains its existing teal, silver, navy, white, black, and bevel-edge palette.

## Typography

Public headings, body, labels, and navigation use Geist from `next/font/google` through `--font-portfolio`. The portfolio boundary assigns that face to Once UI's heading, body, and label variables. Desktop system type remains independent.

The homepage uses the frontmatter display and introduction scales. Background and personal sections use 16px reading copy. Document headings and body use Once UI primitives with route-local responsive scales. Reading measures generally stay within 65–75 characters.

## Layout

The shared main is capped at 1008px including 24px horizontal padding, leaving 960px of content. The homepage is capped at 800px. Mobile gutters are 16px. Homepage sections are separated by 104px on desktop and 64px on small screens.

The homepage hero has three groups: portrait/greeting/introduction, career context with a centered social strip below it, and the experience/contact actions. Desktop identity elements use 16px gaps and the three groups use 32px gaps; small screens use 12px and 20px respectively. The portrait, heading, introduction, career paragraphs, social strip, and action group share one centerline. Mobile headings scale from 32px with a 1.08 line height, and introductory copy uses 18px. Below 375px, primary actions stack at full width; wider phones use a balanced two-button row. Social icons are paired with an 8px gap, 12px below the career paragraphs. Longer background copy follows below the hero.

The homepage moves directly from the hero to technical background. The Descope presales lead paragraph and all three work-example rows were removed at Steven's request; career details remain on the résumé.

The personal section is a single column headed “Outside of work,” with interests, languages, and a photography link. The Windows 95 promotional aside was removed; the persistent Start shortcut remains the dedicated entry.

The shared footer contains Steven's name and Credits only. The redundant Windows 95 text link was removed; Start remains available on every public page.

The homepage email close contains “Say hello,” the email address, and the contact link without an introductory email sentence.

The public header contains Steven's name and navigation, without a location label. Desktop navigation stays centered using balanced outer grid tracks; at 1024px and below, the header uses two tracks and 24px horizontal padding. At 767px and below, the theme toggle moves to the top-right header and four destinations occupy the opaque bottom bar beside Start. Home, Resume, Photos, and Contact use visible 12px labels; accessible names derive from the visible destination text. Each control has a 44px minimum target. A subtle vertical divider separates Start from site navigation. The bar follows safe-area insets, and footer padding reserves its space. Mobile main padding is 16px at the top; route-local padding avoids repeated desktop-sized gaps.

The experience page pairs a compact profile sidebar with a full career column and stacks on mobile. Photography uses one Once UI `MasonryGrid` with two columns, 24px gutters, and a single column at the framework's 768px small breakpoint. Every photograph keeps its original proportions and its caption; there is no separate featured-layout or archive-layout treatment. Retained project documents remain unpromoted in primary navigation.

## Elevation & Depth

Depth comes from a subtle cyan ambient layer, tonal contrast, curved controls, and selective surfaces. Desktop navigation carries a diffuse offset shadow (`0 8px 32px -12px` with neutral alpha); the mobile bottom bar is opaque and shadow-free. Resume chronology and supporting reading sections remain largely bare.

The homepage introduction animates once over 650ms with a small upward settle and blur release; content is visible from the start. Reduced-motion preferences remove animation, transitions, and smooth scrolling inside the public boundary.

## Shapes

Photography, contact rows, and the email close use 16px corners. Navigation and rounded primary actions use pill geometry; the illustrated portrait is circular. Desktop chrome keeps its authentic square beveled grammar.

## Components

### Navigation

Once UI `ToggleButton` links identify Home, Experience, Photography, and Contact on desktop; mobile uses Home, Resume, Photos, and Contact. The selected destination has `aria-current="page"`. Mobile selection uses a 12px-radius rectangular fill with a stronger icon and semibold label. Pressed states increase contrast immediately, and an inset keyboard-focus outline stays within the bottom bar. All navigation controls have a 44px minimum size. The theme `IconButton` names the theme it will select and remains in the desktop navigation or mobile header, with only one visible at a time. Navigation is sticky on desktop and fixed at the bottom on mobile.

### Actions

Once UI `Button` owns primary, secondary, and tertiary actions; `SmartLink` owns text links. High-contrast primary actions invert by theme. Public controls receive a visible two-pixel theme-aware focus outline with four-pixel offset. Contact email remains a real mailto destination.

X and GitHub profile links form a compact centered row beneath the career details in the homepage hero. Each has an unframed 24px glyph inside a 48px square target, an accessible label announcing its new-tab behavior, and the canonical URL from `siteConfig`. Their inline brand glyphs come from [Simple Icons](https://github.com/simple-icons/simple-icons), licensed under [CC0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md); no additional icon package or remote image request is needed.

The shared Start shortcut is an intentional, isolated exception to the public control style: the existing Windows 95 flag, square silver `win95-button` bevel, bold 11px system type, and a 23px face inside a 44px minimum touch target. It stays fixed at the bottom-left on every public page, including not-found pages, outside the animated hero. Its visible face matches the desktop Start button exactly: 2px from the left and 4.5px from the bottom with zero safe-area insets, using the desktop's max(2px, safe-area inset) padding and 23px face centered within a 28px row. Mobile navigation sits alongside it in the same bottom bar, with separate touch targets. It depresses while pressed and links to `/desktop` without prefetching the separate desktop experience. Enlarged photographs temporarily hide the shortcut and cover the navigation bar. `/desktop` retains its own real Start menu without a duplicate public control.

### Photography

Once UI `Media` provides in-place image enlargement within the masonry gallery. `PhotoMedia` adapts it to `next/image` with real catalog dimensions, optimized responsive sources, and Next 16 preload for the first photograph; remaining photos are lazy loaded. Enter and Space toggle enlargement, Escape or a backdrop click dismisses it, and focus remains on the photograph. While a photo is enlarged, the public main layer moves above navigation so neither the header nor mobile dock obscures the image. Visual review must scroll through and decode the complete gallery before taking full-page evidence.

### Theme Boundary

`PortfolioProviders` subscribes to the browser's `portfolio-theme` preference, with a deterministic dark server snapshot and an in-memory fallback when storage is unavailable. Its `data-theme` and scheme attributes live on `.portfolio-site`, not `html`. Browser color scheme and scrollbar styling are conditional on the presence of that boundary.

### Attribution

The footer uses a small, muted, underlined 12px Credits link beside Steven's name, with a 44px touch target. `/credits` identifies the adaptation of Magic Portfolio by Once UI and links its source and CC BY-NC 4.0 license. Keep that attribution publicly accessible while using the free template license. The footer also preserves a plain link to the separate desktop.

## Do's and Don'ts

### Do:

- **Do** use Once UI primitives and semantic theme variables for public components.
- **Do** preserve factual content, deep links, metadata, and the full photography library.
- **Do** maintain readable contrast in both themes, including tinted surfaces.
- **Do** keep photography on `/photos` and the illustrated portrait on the homepage.
- **Do** keep X and GitHub profile links prominent in the homepage hero, with accessible icon-only controls.
- **Do** keep the Windows 95 desktop functional and stylistically isolated.

### Don't:

- **Don't** restore the obsolete flat-only Quiet Studio restrictions.
- **Don't** turn the site into a dashboard or add template demo content, a blog, or a newsletter without a content requirement.
- **Don't** promote repository projects on the homepage or resume, or add GitHub links to the resume.
- **Don't** invent professional claims, testimonials, customers, or outcomes.
- **Don't** set shared root theme attributes or import unscoped Once UI element resets.
