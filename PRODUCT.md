# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary visitors are hiring managers, technical leaders, potential collaborators, and professional peers evaluating Steven Barash's work, experience, judgment, and personality. They should be able to understand what he does quickly, inspect relevant work, and find a direct way to contact him.

## Product Purpose

This is Steven Barash's public professional home. It brings together his work across complex technical systems, identity, agentic AI, independent software, photography, and contact information.

The site should answer three questions quickly:

1. What does Steven do?
2. What has he built?
3. How can someone contact him?

Success means visitors understand Steven's role from the first screen, can inspect his published work without friction, and leave with a specific impression of his judgment and personality rather than the memory of a generic portfolio template.

## Positioning

Steven turns complex technical systems into working products, demos, and decisions. Identity and agentic AI are two areas of depth rather than the limits of his positioning.

As a Senior Solutions Engineer at Descope, he helps teams reason about authentication and authorization, prototypes agentic identity concepts and proofs of concept for customers, and builds demos and workshops to test technical decisions. His identity work includes CIAM, OAuth/OIDC, passkeys, FAPI, identity federation, B2B authorization, and RBAC.

The combination of customer-facing technical judgment, hands-on prototypes, independent software, photography, and a functional Windows 95 desktop gives the site material that a conventional professional profile cannot truthfully copy.

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

The public experience does not need to imitate Windows 95. It should find its own character while preserving the desktop as an optional, fully realized expression of Steven's playful side. Photography and real project material are first-party assets, not decoration.

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
