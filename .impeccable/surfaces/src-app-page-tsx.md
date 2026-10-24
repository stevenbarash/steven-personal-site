---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/page.module.css","src/components/layout/PortfolioLayout.tsx","src/components/layout/PortfolioProviders.tsx","src/app/portfolio.scss","src/app/layout.tsx","tests/e2e/minimal-homepage.spec.ts"]
---

Scope: Public homepage and shared public shell only. The /desktop route remains a separate noindex easter egg.
Mode: Persuade.
Audience: Hiring managers and solutions engineering leaders evaluating Steven's technical judgment, hands-on engineering, and communication.
Job: Introduce Steven plainly and route visitors to experience or contact.
Primary action: View experience (/resume). Secondary action: Get in touch (/contact); the closing section links directly to his real email.
Proof: Complete career history on /resume and real photography on /photos.
Content: “Hi, I’m Steven Barash.” followed by “I help customers see what’s possible and build it with them.” Supporting copy covers authentication and authorization for users and AI agents, the Descope role and regional scope, prior employers, and Brooklyn. Technical background covers customer identity, agent identity, web/mobile/backend/SDK development, developer tools, customer demos, and shared prototyping. Cycling, languages, and the photography link follow. The Descope lead paragraph and all three work-example rows were removed at Steven's request; do not restore them.
Constraints: Do not expose private Identity Work, customer names, customer metrics, unpublished agent work, or private repositories. No project showcases or repository promotion on the homepage. The LinkedIn/GitHub/X profile links remain in the hero. Preserve `/desktop` as a separate visual world. No invented professional claims, fake case-study evidence, blog, or newsletter.
Image selection: Keep the photography library on `/photos`. The shared profile photograph at 72px is the only homepage photographic asset; use responsive Next image optimization.
Direction: Refine the existing Once UI Magic Portfolio implementation. `.impeccable/mocks/quiet-studio.webp` is a discarded historical reference, not an approved reproduction target.
Memorable moment: The introduction leads directly into technical background, without work-example rows.
Palette: Theme-aware Once UI gray neutrals and cyan brand tokens; dark by default with a persisted light-theme option. Light-theme supporting text uses the medium neutral foreground over the cyan atmosphere.
Form: Introduction, technical background, personal interests, and a direct email close. No work-example rows.
Inventory: Shared profile photograph at 72px. The full verified photography library remains on `/photos`.
Medium: Typography, navigation, actions, and the shared profile photograph. No work-example components.
