# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary visitors are hiring managers and solutions engineering leaders evaluating Steven Barash's hands-on engineering, technical judgment, communication, and ability to guide technical evaluations. Technical leaders, collaborators, and professional peers are secondary audiences. Visitors should quickly understand his range, inspect relevant experience, and find a direct way to contact him.

## Product Purpose

This is Steven Barash's public professional home. It brings together his work across complex technical systems, identity, agentic AI, independent software, photography, and contact information.

The site should answer three questions quickly:

1. What does Steven do?
2. What has he built?
3. How can someone contact him?

Success means visitors understand Steven's role from the first screen, can inspect his published work without friction, and leave with a specific impression of his judgment and personality rather than the memory of a generic portfolio template.

## Positioning

Steven is a solutions engineer who writes code. His work includes customer demos, integrations, debugging, POCs, demo automation, and technical enablement. Identity is a specialty, not the subject of every page.

His user-confirmed strengths are identity architecture and auth strategy (CIAM, OAuth/OIDC, SAML, MFA, RBAC/FGA, federation, and migrations); technical deal strategy; demo engineering and storytelling; demo automation and repeatability; POC design and execution; rapid API/SDK/MCP/agent prototyping and integrations; SE/AE technical enablement; and complex auth/integration debugging.

He is a Senior Solutions Engineer with 6+ years of experience in identity, developer platforms, and technical GTM. His supplied biography confirms that he leads enterprise CIAM presales at Descope across the U.S. East Coast and Europe. It also confirms presales and post-sales work at ID.me, including a multi-phase identity deployment for an unnamed large state agency that became the company's largest deal closed that fiscal year, and top-of-segment performance with multiple President's Club honors and a Solutions Engineer of the Year award at Okta. Keep the agency anonymous and do not infer revenue, a fiscal year, or a segment-specific ranking. Other general strengths must not become employer-specific accomplishments or customer outcomes without supporting evidence.

The homepage opens with an illustrated portrait, “Hi, I’m Steven Barash.” and a centered solutions-engineer introduction, followed by his 6+ years across identity, developer platforms, and technical GTM and work with startups, global enterprises, and government agencies. Experience/contact links lead to the primary destinations; his current role, prior employers, and location complete the introduction. Descope's enterprise CIAM presales scope follows before one highlighted professional example and two quieter rows covering sample apps and customer prototypes, the multi-phase state-agency deployment at ID.me, and Russian-language demos with two President's Club honors and the Okta FY23 award. A compact professional-background section names his identity protocols and authorization experience alongside interests in developer-first platforms, AI-enabled GTM, demo engineering, automation, and rapid prototyping. Brooklyn, unnecessarily long bike rides, human languages, exploring new places, and an invitation to the working Windows 95 desktop provide personal context before a direct email close. Photographs stay in their dedicated gallery, not on the homepage. The complete career history and capability groups remain on the experience page; the POC-method disclosure stays removed.

The experience page remains a complete, scannable resume with dates once per role, detailed protocols, all eight capabilities, education, and recognition. The contact page leads with his actual email and four social destinations; photography retains the real library within the shared public shell. GitHub-based examples and independent project showcases remain excluded from the homepage and resume; Work is absent from primary navigation. Existing project URLs remain functional and unpromoted.

## Operating Context

The public site is the primary experience. Visitors may arrive on the homepage or follow a direct link to a resume, project, photography, or contact page. Pages must remain easy to scan, link, and share across desktop and mobile.

The functional Windows 95 experience at `/desktop` is a noindex easter egg. It preserves the site's playful history and working desktop interactions without forcing visitors to learn an operating-system metaphor before reaching the public content.

## Capabilities and Constraints

The indexable route set is:

- `/`
- `/resume`
- `/projects`
- `/projects/pult`
- `/projects/uptick`
- `/projects/bike-cli`
- `/projects/personal-site`
- `/photos`
- `/contact`

`/desktop` has its own canonical URL and `noindex, follow`. Draft projects, query states, editorial IDs, publication controls, evidence-governance labels, and private Identity Work material must not appear in public routes or search indexes.

Claims about Steven's work and experience must remain supportable. Unsupported resume claims stay out until Steven confirms them. The Windows 95 version must remain functional while the primary public site evolves.

Steven has built personal agents, but they are not publicly documented yet. The site may state that experience without implying that a public case study, repository, customer endorsement, or measurable outcome exists.

## Brand Commitments

The site must feel distinctly Steven: technically credible, observant, personal, and willing to show taste. Clarity and restraint are useful, but the result must not feel anonymous, timid, sterile, underdesigned, or interchangeable with a minimal portfolio template.

Use plain, specific language. Describe the work; avoid slogans, vague claims, and sales copy.

The public experience does not need to imitate Windows 95. It should find its own character while preserving the desktop as an optional, fully realized expression of Steven's playful side. Photography and real project material are first-party assets, not decoration.

Keep photographs on `/photos`, not the homepage. The homepage should focus on Steven's professional introduction and work; the small illustrated portrait can remain as a personal signature.

## Evidence on Hand

- Professional profile and positioning: `src/content/profile.ts`
- Published project records: `src/content/projects.ts`
- Resume history: `src/data/resume.ts`
- Photography library: `src/data/photos.ts`
- Dormant speaking record, not publicly surfaced: `src/content/speaking.ts`
- Public-evidence boundaries: `src/content/public-evidence.ts`
- Existing public routes and metadata: `src/app/`
- Functional desktop implementation: `src/app/desktop/` and `src/components/ui/win95/`

Agentic identity prototyping for customers and independently built personal agents are confirmed experience, but there is no public case study or repository for them yet.

Future work must not invent customers, testimonials, outcomes, audience figures, or professional claims that these sources do not support.

## Product Principles

1. Make Steven recognizable, not merely legible.
2. Lead with plain language and concrete work.
3. Give real projects, photographs, and experience more weight than decorative portfolio conventions.
4. Keep stable destinations easy to scan, link, share, and find.
5. Preserve privacy and factual accuracy as hard boundaries.

## Accessibility & Inclusion

Keyboard, touch, and mobile use must remain practical. Interactive controls need visible focus, usable touch targets, readable text, and layouts that do not clip or require precision gestures. Character must come from art direction and craft, not from making the interface harder to use.
