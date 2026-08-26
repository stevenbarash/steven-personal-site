---
name: "Steven Barash Personal Site"
description: "Quiet Studio editorial portfolio with an intentionally isolated Windows 95 desktop easter egg."
colors:
  cool-paper: "#f8f8f6"
  ink: "#040404"
  precise-blue: "#034cfc"
  deep-blue: "#0038bf"
  dark-rule: "#161616"
  soft-rule: "#c8c8c8"
  muted-ink: "#2b2b2b"
  desktop-teal: "#008080"
  system-silver: "#c0c0c0"
  active-navy: "#000080"
  title-bar-blue: "#1084d0"
  window-white: "#ffffff"
  desktop-highlight: "#ffffff"
  desktop-light-edge: "#dfdfdf"
  desktop-shadow: "#808080"
  desktop-dark-edge: "#0a0a0a"
  system-black: "#000000"
typography:
  display:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(54px, 4.65vw, 74px)"
    fontWeight: 650
    lineHeight: 0.99
    letterSpacing: "-0.038em"
  tablet-display:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(46px, 5.6vw, 60px)"
    fontWeight: 650
    lineHeight: 0.99
    letterSpacing: "-0.038em"
  mobile-display:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(42px, 12vw, 50px)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(36px, 5vw, 48px)"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 640
    lineHeight: 1
    letterSpacing: "-0.035em"
  mobile-title:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "25px"
    fontWeight: 640
    lineHeight: 1
    letterSpacing: "-0.035em"
  subheading:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  prose-heading:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  supporting:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "-0.018em"
  section-heading:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  mobile-supporting:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "-0.018em"
  lede:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  mobile-label:
    fontFamily: "var(--font-quiet-studio), Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  desktop-interface:
    fontFamily: "Tahoma, Segoe UI, MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  terminal:
    fontFamily: "Courier New, Lucida Console, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  flat: "0px"
  desktop-tab-top: "2px 2px 0 0"
spacing:
  shell-max: "1510px"
  gutter-desktop: "76px"
  gutter-mobile: "32px"
  desktop-unit: "4px"
  touch-target: "44px"
  hero-height: "650px"
  action-height: "58px"
components:
  action-primary:
    backgroundColor: "{colors.precise-blue}"
    textColor: "{colors.window-white}"
    typography: "{typography.body}"
    rounded: "{rounded.flat}"
    padding: "12px 24px"
    height: "{spacing.action-height}"
  action-primary-hover:
    backgroundColor: "{colors.deep-blue}"
    textColor: "{colors.window-white}"
    typography: "{typography.body}"
    rounded: "{rounded.flat}"
    padding: "12px 24px"
    height: "{spacing.action-height}"
  action-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.precise-blue}"
    typography: "{typography.body}"
    rounded: "{rounded.flat}"
    height: "{spacing.action-height}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.flat}"
    height: "{spacing.touch-target}"
  project-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.flat}"
    height: "70px"
  desktop-raised-control:
    backgroundColor: "{colors.system-silver}"
    textColor: "{colors.system-black}"
    typography: "{typography.desktop-interface}"
    rounded: "{rounded.flat}"
    padding: "1px 6px"
    height: "23px"
---

# Design System: Steven Barash Personal Site

## Overview

**Creative North Star: "Quiet Studio"**

Quiet Studio is an editorial portfolio built from cool paper, exact black type, sparse precise blue, crisp rules, and first-party documentary photography. Its character comes from proportion, decisive image crops, asymmetry, and varied content density while the interface remains familiar and immediately usable.

The public system gives the oversized thesis and one real photograph equal weight, then shifts into unnumbered project rows and linear documents. It is flat, square, direct, and technically credible. Blue marks actions, links, focus, and active navigation rather than decorating the page.

The functional Windows 95 experience at `/desktop` is a separate visual system. It retains teal, silver, navy, hard bevels, compact Tahoma-style type, raster icons, menus, windows, and taskbar behavior. Shared content may feed both systems, but public Quiet Studio selectors and desktop chrome must never visually merge.

**Key Characteristics:**

- Oversized, tightly set Geist headlines balanced by quiet body copy.
- Cool near-white paper, exact black ink, sparse precise blue, and crisp rules.
- Flat, square surfaces with no shadows in the public system.
- First-party photography used as evidence-bearing content rather than decoration.
- Asymmetric editorial layouts that collapse into direct single-column mobile reading.
- An intentionally isolated Windows 95 world at `/desktop`.

**The Two-World Rule.** Quiet Studio owns every public route and share surface. Windows 95 styling remains inside `/desktop`; neither system borrows the other's chrome, typography, or interaction metaphor.

## Colors

The public palette is cool, high-contrast, and deliberately narrow; the isolated desktop palette preserves authentic Windows 95 state and material cues.

### Primary

- **Precise Blue** (`#034cfc`): Primary actions, links, selection, keyboard focus, active navigation, the manifest theme, and the Open Graph accent.
- **Deep Blue** (`#0038bf`): Hover state for primary blue actions and links.

### Neutral

- **Cool Paper** (`#f8f8f6`): Default public canvas, menu surface, Open Graph background, and manifest background.
- **Ink** (`#040404`): Primary public text and high-contrast headings.
- **Dark Rule** (`#161616`): Header, mobile-menu, and decisive section boundaries.
- **Soft Rule** (`#c8c8c8`): Repeated project-row dividers.
- **Muted Ink** (`#2b2b2b`): Concise supporting copy in selected-work rows.

### Isolated Desktop Palette

- **Desktop Teal** (`#008080`): `/desktop` environment only.
- **System Silver** (`#c0c0c0`): Window chrome and controls inside `/desktop`.
- **Active Navy** (`#000080`) and **Title-Bar Blue** (`#1084d0`): Selected states and the authentic active title-bar gradient inside `/desktop` only.
- **Window White** (`#ffffff`), **Desktop Highlight** (`#ffffff`), **Desktop Light Edge** (`#dfdfdf`), **Desktop Shadow** (`#808080`), **Desktop Dark Edge** (`#0a0a0a`), and **System Black** (`#000000`): Desktop content wells, text, and structural bevel edges.

**The Blue Precision Rule.** Precise Blue is scarce and functional. Use it for action, navigation state, focus, and selection; never spread it into decorative fills or ornamental systems.

**The Desktop-Palette Containment Rule.** Desktop Teal, System Silver, Active Navy, and the four-edge bevel neutrals belong to `/desktop` only.

## Typography

**Display Font:** Geist through `--font-quiet-studio`, with Helvetica Neue, Helvetica, and Arial fallbacks

**Body Font:** Geist through the same public stack

**Desktop Interface Font:** Tahoma with Segoe UI, MS Sans Serif, Microsoft Sans Serif, and Arial fallbacks

**Label/Mono Font:** Courier New with Lucida Console and monospace fallbacks for `/desktop` terminal content only

**Character:** Public typography is contemporary, tightly composed, and plainspoken. The oversized thesis supplies confidence while body copy and labels remain compact and highly readable. The desktop keeps its separate dense operating-system voice.

### Hierarchy

- **Display** (650, `clamp(54px, 4.65vw, 74px)`, 0.99): Homepage thesis on desktop; mobile shifts to `clamp(42px, 12vw, 50px)` at a 1.0 line height.
- **Responsive Display** (650): The homepage thesis tightens to `clamp(46px, 5.6vw, 60px)` on tablet and `clamp(42px, 12vw, 50px)` on mobile.
- **Headline** (650, `clamp(36px, 5vw, 48px)`, 1.15): Public route titles and major document headings.
- **Title** (640, `26px`, 1.0): Selected project names and strong row-level headings.
- **Supporting** (400, `21px` desktop / `19px` mobile, 1.35): Homepage thesis support copy.
- **Document Hierarchy** (`24px`, `22px`, `20px`, `18px`): Subheadings and ledes in linear public documents.
- **Body** (400, `16px`, 1.5): Navigation, documents, and primary explanatory copy, generally constrained to roughly 70 characters per line.
- **Label** (550, `13px` desktop / `14px` mobile, -0.01em): Project metadata and concise action labels; primary actions increase to 16px and uppercase.
- **Desktop Interface** (400, `11px`, 1.5): Windows, menus, controls, and status fields inside `/desktop`.
- **Terminal** (400, `12px`, 1.4): Command-like content inside the desktop terminal only.

**The One Public Voice Rule.** Geist owns public headlines, body copy, labels, and navigation through `--font-quiet-studio`. Monospace and Tahoma-style system type stay inside `/desktop`.

## Layout

Public pages use a centered shell capped at 1510px. Desktop and tablet layouts reserve 76px total horizontal gutter. Mobile layouts switch at 767px and reserve 32px total horizontal gutter. At 1100px and below, the homepage tightens its two-column proportions and typography before the mobile stack takes over.

The homepage begins with a flat two-column hero, a 650px image plane on the right, and a vertically centered thesis on the left. Selected work begins at the fold with an offset photograph and unnumbered rows. Public detail routes use linear documents with readable measure, rules, and clear route navigation rather than card grids.

At 767px and below, the hero, work composition, document sections, and project rows become direct single-column reading. The top navigation becomes a native details disclosure, and interactive targets remain at least 44px high.

**The Breakpoint Contract Rule.** Treat 767px and 1100px as the observed Quiet Studio boundaries. Preserve the large editorial split above them and the direct mobile reading order below them.

## Elevation & Depth

Quiet Studio is completely flat. Public surfaces use color, rules, crop, scale, and whitespace to establish hierarchy; box shadows, translucent layers, glass, glow, and ambient depth are absent. The hero photograph reveals over 560ms with `cubic-bezier(0.16, 1, 0.3, 1)`, navigation underlines transition over 160ms, and reduced-motion preferences remove both.

The isolated desktop uses hard one- and two-pixel inset bevels for raised, pressed, and sunken state. Those structural edges are part of the Windows 95 interaction grammar and are never exported to public Quiet Studio surfaces.

**The Flat Public Rule.** Public depth comes from editorial hierarchy and real photography. Never add shadows or simulated material layers to Quiet Studio.

## Shapes

Public form is square and exact: zero-radius actions, menus, rows, image crops, section boundaries, and focus treatments. Hairline rules and rectangular blue action blocks create structure without containers. `/desktop` also remains predominantly square, with its existing two-pixel top-only tab corners as the narrow system-authentic exception.

## Components

### Primary Action

- **Character:** A slim, decisive blue block for the single strongest action in a composition.
- **Shape:** Square (`0px`) with a 58px desktop height and 12px by 24px padding.
- **Color:** Precise Blue with Window White text; Deep Blue on hover.
- **Focus:** A 3px Precise Blue outline offset by 3px.

### Secondary Action

- **Character:** A direct text link that stays visibly subordinate to the filled action.
- **Shape:** Square and at least 54px to 58px high depending on viewport.
- **Color:** Precise Blue with a long 9px underline offset; Deep Blue on hover.

### Navigation

- **Character:** Familiar horizontal route labels, with no taxonomy or decorative index system.
- **Desktop:** A 60px header row, generous label gaps, and a 2px underline that transitions over 160ms on hover, focus, and active state.
- **Mobile:** A 68px header row and native details disclosure. The menu is a flat Cool Paper rectangle with a 1px Dark Rule border.
- **State:** Active navigation uses Precise Blue; focus always receives the shared 3px outline.

### Project Rows

- **Character:** Unnumbered editorial rows that keep title, proof, and route action in one scan path.
- **Desktop:** Three columns with a minimum 70px row height and Soft Rule dividers.
- **Mobile:** A two-column title/action line with the description below, at least 112px tall.
- **Typography:** A 26px tightly set title, 13px Muted Ink description, and 13px blue action.

### Documentary Photography

- **Character:** First-party content with decisive crops and accurate alt text.
- **Hero:** Full-height, edge-to-edge crop inside a 650px plane on desktop.
- **Selected Work:** Smaller offset crop that changes the density of the work section without becoming a card.
- **Motion:** The hero image may use the single Quiet Studio reveal; all other photography stays still.

### Linear Documents

- **Character:** Resume, project, contact, and photography routes read as documents rather than dashboards.
- **Structure:** Readable measures, section rules, plain lists, strong route titles, and touch-safe links.
- **Containers:** No card wrappers, floating panels, decorative badges, or artificial evidence blocks.

### Windows 95 Controls

- **Scope:** `/desktop` only.
- **Character:** Square, compact, and stateful with authentic raised, pressed, and sunken bevels.
- **Behavior:** Every visible control must keep its keyboard, pointer, and mobile-equivalent behavior; the public component system never imitates this chrome.

## Do's and Don'ts

### Do:

- **Do** use Quiet Studio across every public route, the Open Graph image, and the manifest.
- **Do** use first-party photography as visible content with decisive crops, accurate alt text, and truthful captions.
- **Do** build hierarchy with typography, proportion, whitespace, and crisp rules.
- **Do** keep the primary action blue, square, obvious, and touch safe.
- **Do** keep project lists unnumbered and evidence grounded.
- **Do** preserve the functional Windows 95 system inside `/desktop` as a separate noindex experience.

### Don't:

- **Don't** introduce cards, bento grids, floating panels, or rounded containers into Quiet Studio.
- **Don't** use arbitrary numbering, index spines, timelines, nodes, paths, or decorative taxonomy.
- **Don't** use gradients, glass, glow, blurred shadows, textures, or decorative depth on public surfaces.
- **Don't** fabricate metrics, testimonials, customer evidence, case-study proof, or unpublished work.
- **Don't** turn technical terms into badges, keyword clouds, or terminal styling on public routes.
- **Don't** merge Windows 95 colors, bevels, raster iconography, or system type into the public visual world.
