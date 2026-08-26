# Whole-Site Visual Authorship Design

Date: 2026-08-26
Status: Approved direction, pending written-spec review

## Goal

Make the public site feel complete and distinctly Steven across every route, without replacing the Quiet Studio visual system or weakening factual and privacy boundaries.

The finished experience should build one continuous argument:

1. Steven turns complex technical systems into working products, demos, and decisions.
2. His projects show different forms of technical judgment.
3. His photography and Windows 95 desktop show personal taste without obscuring the work.
4. Contact is the confident conclusion.

## Scope

This design covers:

- `/`
- `/projects`
- `/projects/pult`
- `/projects/uptick`
- `/projects/bike-cli`
- `/projects/personal-site`
- `/photos`
- `/contact`
- shared public navigation, footer, project components, content types, and responsive styles

The résumé keeps its current hiring-scan design except for shared-system changes. `/desktop` keeps its current design and behavior. No route is published, removed, committed to a remote, or deployed by this work.

## Design Direction

Use a proof-led editorial portfolio within Quiet Studio.

Keep the existing cool paper, black type, precise blue, square geometry, crisp rules, Geist typography, documentary photography, and asymmetrical layouts. Add authorship through evidence, pacing, and route-specific composition instead of decorative effects.

The public footer keeps the current Windows 95 Start control. Its surrounding spacing should make it read as an intentional closing signature. Windows 95 styling must remain limited to the control itself and `/desktop`.

## Content Rules

- Use only facts already supported by `src/content/projects.ts`, public repositories, and approved public evidence.
- Do not invent customers, metrics, outcomes, testimonials, screenshots, commands, or architecture details.
- Each project artifact must correspond to a real behavior, interface, command, or technical decision.
- Keep project limitations visible and plainly written.
- Keep Identity Work and other draft or private material out of public output.

## Information Architecture

### Homepage

Preserve the current hero and thesis. Change the work journey to:

1. Hero and positioning
2. Pult as the strongest proof
3. Broader selected projects
4. About and photography
5. Contact invitation

The primary work action must no longer skip Pult. It should target an anchor placed before the Pult section. The label remains direct and must accurately describe the destination.

### Projects Index

The index remains one list, not a card grid. Each project row should contain:

- project name and direct link
- one-line purpose
- one signature proof preview
- status and concise technology line
- a consistent route action

The rows share typographic structure but vary in their evidence module. The evidence makes projects comparable without making them visually identical.

### Project Details

Every project page keeps the shared breadcrumb, factual header, actions, limitations, prose, and back link. A signature artifact appears between the header and prose.

The artifact is selected by project slug through a typed registry or explicit component mapping. The shared document component must not accumulate large inline conditionals.

## Signature Project Artifacts

### Pult

Retain the existing protocol artifact. It should continue to show the real pairing and command paths, ports, and the separation between iPhone and Google TV behavior.

### Uptick

Show the actual extension architecture:

- manifest or dependency file in Zed
- thin Zed extension
- Rust language server
- registry and OSV lookups
- returned hints, diagnostics, links, and update actions through LSP

The artifact should communicate why the extension and server are separate. It must not imply complete security coverage.

### bike-cli

Show one truthful terminal session derived from documented commands. The specimen should demonstrate the tool's unified command hierarchy and at least two output concerns, such as readable terminal output and structured JSON or CSV.

Any command and output included in the site must exist in the public repository or be produced locally from the real CLI. Synthetic output must not be presented as real.

### Personal Site

Show the route architecture as two connected worlds:

- stable public routes for work, experience, photography, and contact
- optional `/desktop` experience
- compatibility path for retained query and hash links
- shared typed content feeding both surfaces where applicable

This diagram explains the design decision without exposing internal publication controls, private material, or development-only contracts.

## Photography

Turn the page into a small exhibition followed by an archive.

- Select five existing photographs for the opening sequence.
- Use varied width, orientation, and spacing to establish pace.
- Preserve the source aspect ratio and truthful caption for every image.
- Follow the featured sequence with the complete existing library in a quieter two-column archive.
- On mobile, retain one reading column and use spacing changes rather than fragile offset layouts.

The selection and ordering should come from the current library. No image is removed from the archive.

## Contact

Make email the dominant final action.

- Keep the current approved list of conversation topics.
- Give the email link the strongest scale and whitespace on the page.
- Add only factual supporting copy about the kind of conversation invited.
- Place social destinations below as quieter rows.
- Keep every destination labeled and keyboard accessible.

Do not promise a response time unless Steven supplies one.

## Shared Footer

Keep the current Windows 95 Start control and accessible label.

- Preserve its current visual treatment and `/desktop` destination.
- Increase separation from the preceding page content and balance it against the Steven Barash footer label.
- Do not spread Windows 95 colors, typography, bevels, icons, or interaction styles into other public components.

## Responsive Behavior

- Preserve the existing public breakpoints at 767px and 1100px unless live evidence shows a narrower local correction is necessary.
- Keep all public content in one reading column at mobile widths.
- Bring the homepage photograph earlier in the mobile journey by reducing excessive text-plane height, without moving it ahead of the thesis.
- Make project-title links, breadcrumb links, and other controls at least 44px high or provide an equivalent 44px clickable area.
- Preserve visible focus, logical document order, meaningful headings, reduced motion, and no horizontal overflow.
- Confirm intermediate layouts at 900px rather than treating only desktop and phone as supported.

## Component Architecture

Introduce the narrowest reusable structure needed:

- a typed project-artifact registry keyed by published project slug
- one artifact component per project
- a small shared artifact frame only if repeated layout behavior justifies it
- a featured-photo sequence plus archive projection derived from the existing photo library

Keep project facts in `src/content/projects.ts`. Keep visual components in `src/components/projects/`. Do not turn factual content into JSX constants inside page components.

## Interaction and States

- Project proof previews must link clearly to their project detail page.
- External source links must retain `noopener noreferrer` and a clear destination label.
- Mobile navigation must remain a native disclosure with 44px targets.
- Project artifacts are content, not interactive demos, unless a real interaction already exists and can be made keyboard and touch safe.
- Lazy-loaded archive photography must reserve space and use intrinsic dimensions.
- Missing optional source or live URLs must not leave blank controls.

## Verification

Implementation is complete only when all of the following are fresh and passing:

- focused tests for homepage order and anchor behavior
- focused tests for every published project artifact and factual source boundary
- project index and detail checks at desktop, 900px, and 390px
- mobile 44px link-target checks, including project titles and breadcrumbs
- photography featured-sequence and complete-archive checks
- no horizontal overflow, page errors, or console warnings on all public routes
- keyboard focus and heading-order checks
- production build and built-output integrity scan
- Impeccable detector and one bounded desktop/mobile visual confirmation pass
- source diff review for accidental churn, duplicated styles, private content, and invented claims

## Non-Goals

- Replacing Quiet Studio with a new visual identity
- Redesigning the résumé again
- Changing or removing the Start control
- Publishing private Identity Work
- Adding a CMS, animation system, testimonials, metrics, or decorative cards
- Rebuilding `/desktop`
- Deploying or changing public DNS, Cloudflare, or Vercel state

## Success Criteria

A hiring manager should be able to answer these questions without opening every page:

1. What does Steven do?
2. Which project best demonstrates the kind of judgment they care about?
3. How do Pult, Uptick, bike-cli, and Personal Site differ beyond their technology stacks?
4. What personal taste does Steven bring to the work?
5. How can they start a relevant conversation?

The result should feel varied but coherent, factual but not sterile, and authored without becoming harder to navigate.
