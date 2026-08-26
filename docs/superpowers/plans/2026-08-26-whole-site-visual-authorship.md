# Whole-Site Visual Authorship Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the public site into one proof-led editorial portfolio with distinct project evidence, a curated photography sequence, a stronger contact conclusion, and complete responsive behavior.

**Architecture:** Keep the existing Quiet Studio shell and server-rendered Next.js routes. Add a typed server-component registry for project artifacts, derive the photography sequence from the existing library, and keep route-specific composition in focused components while shared layout and responsive behavior remain in `globals.css`.

**Tech Stack:** Next.js 16.3 App Router, React 19 server components, TypeScript 7 native preview, Next Image, Playwright, plain CSS.

**Spec:** `docs/superpowers/specs/2026-08-26-whole-site-visual-authorship-design.md`

## Global Constraints

- Preserve Quiet Studio: cool paper, black type, precise blue, square geometry, crisp rules, Geist typography, documentary photography, and asymmetric editorial layouts.
- Keep the current Windows 95 Start control and `/desktop` behavior.
- Keep Identity Work, drafts, evidence IDs, and private publication controls out of public output.
- Do not invent customers, testimonials, metrics, outcomes, screenshots, commands, or architecture details.
- Use only existing local assets and facts supported by `src/content/projects.ts`, the current repository, and linked public repositories.
- Do not add dependencies, a CMS, cards, gradients, glass, rounded containers, decorative monospace, or a new animation system.
- Keep interactive targets at least 44px high, preserve visible focus, and prevent horizontal overflow at 390px, 900px, and wide desktop sizes.
- Preserve existing metadata, canonical routes, sitemap boundaries, legacy query/hash compatibility, and `/desktop` as `noindex, follow`.
- Before editing Next.js route or image code, read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`.
- Use `apply_patch` for edits. Stage and commit only files owned by the current task.

## File Structure

**Create**

- `src/components/projects/artifacts/ProjectArtifact.tsx`: typed slug-to-component registry and shared `ProjectArtifact` interface.
- `src/components/projects/artifacts/UptickFlowArtifact.tsx`: Zed extension and Rust language-server evidence.
- `src/components/projects/artifacts/BikeCliArtifact.tsx`: verified command and output-format specimen.
- `src/components/projects/artifacts/PersonalSiteArchitectureArtifact.tsx`: public routes and optional desktop architecture.
- `src/content/photography.ts`: guarded featured-photo IDs and archive projection.

**Modify**

- `src/components/projects/MinimalProjectDetail.tsx`: render the registered detail artifact after the header.
- `src/components/projects/MinimalProjectIndex.tsx`: add compact evidence previews to every project row.
- `src/app/page.tsx`: make the primary work anchor begin with Pult.
- `src/app/photos/page.tsx`: render a five-photo opening sequence and remaining archive.
- `src/app/contact/page.tsx`: strengthen the email conclusion and subordinate social destinations.
- `src/components/layout/MinimalSiteLayout.tsx`: keep the Start control markup unchanged.
- `src/app/globals.css`: artifact, homepage, photography, contact, footer-spacing, touch-target, and breakpoint rules.
- `tests/e2e/phase-2-positioning.spec.ts`: align the manifest assertion with the approved broad positioning.
- `tests/e2e/task-4-remediation.spec.ts`: align the Open Graph source assertion with the approved thesis.
- `tests/e2e/phase-3-projects.spec.ts`: artifact, preview, breadcrumb, and responsive regressions.
- `tests/e2e/minimal-homepage.spec.ts`: work-order, mobile title-target, hero timing, and Start-control regressions.
- `tests/e2e/phase-3-minimal-routes.spec.ts`: photography and contact regressions.

---

### Task 1: Reconcile the Existing Metadata Test Contract

**Files:**

- Modify: `tests/e2e/phase-2-positioning.spec.ts:33`
- Modify: `tests/e2e/task-4-remediation.spec.ts:239`

**Interfaces:**

- Consumes: current manifest name from `src/app/manifest.ts` and thesis from `src/app/opengraph-image.tsx`.
- Produces: a green baseline for the two known stale assertions without changing public metadata.

- [ ] **Step 1: Run the two stale assertions and confirm the baseline failures**

Run:

```bash
npm test -- tests/e2e/phase-2-positioning.spec.ts tests/e2e/task-4-remediation.spec.ts --grep "approved broad technical narrative|Open Graph image contains"
```

Expected: two failures. The manifest does not contain `Senior Solutions Engineer`, and the Open Graph source does not contain `Senior Solutions Engineer at Descope`.

- [ ] **Step 2: Replace only the stale expectations**

In `phase-2-positioning.spec.ts`, replace the manifest assertion with:

```ts
expect(manifest.name).toContain('Products, Demos, and Technical Systems');
expect(manifest.name).not.toContain('Photographer');
expect(manifest.name).not.toContain('Senior Solutions Engineer');
```

In `task-4-remediation.spec.ts`, replace the old title assertion with:

```ts
expect(source).toContain('I turn complex technical systems into working products, demos, and decisions.');
```

- [ ] **Step 3: Run the focused assertions again**

Run the command from Step 1.

Expected: both tests pass.

- [ ] **Step 4: Commit the baseline correction**

```bash
git add tests/e2e/phase-2-positioning.spec.ts tests/e2e/task-4-remediation.spec.ts
git commit -m "test: align metadata assertions with approved positioning"
```

---

### Task 2: Add Typed Signature Artifacts to Every Project Detail

**Files:**

- Create: `src/components/projects/artifacts/ProjectArtifact.tsx`
- Create: `src/components/projects/artifacts/UptickFlowArtifact.tsx`
- Create: `src/components/projects/artifacts/BikeCliArtifact.tsx`
- Create: `src/components/projects/artifacts/PersonalSiteArchitectureArtifact.tsx`
- Modify: `src/components/projects/MinimalProjectDetail.tsx`
- Modify: `src/app/globals.css:2583-2648`
- Test: `tests/e2e/phase-3-projects.spec.ts`

**Interfaces:**

- Produces: `ProjectArtifact({ slug, variant }: { slug: string; variant: 'preview' | 'detail' }): ReactNode`.
- Produces: `isProjectArtifactSlug(slug: string): slug is ProjectArtifactSlug`.
- Preserves: `PultProtocolArtifact({ className }: { className: string })` for homepage reuse.

- [ ] **Step 1: Write failing detail-artifact tests**

Add:

```ts
const artifactExpectations = [
  ['pult', 'Pairing and control path'],
  ['uptick', 'Extension and analysis path'],
  ['bike-cli', 'One command, three output formats'],
  ['personal-site', 'One content system, two public surfaces'],
] as const;

test('every published project has one truthful signature artifact after its header', async ({ page }) => {
  for (const [slug, caption] of artifactExpectations) {
    await page.goto(`/projects/${slug}`);
    const artifact = page.locator(`[data-project-artifact="${slug}"][data-project-artifact-variant="detail"]`);
    await expect(artifact).toHaveCount(1);
    await expect(artifact.getByRole('figure', { name: caption })).toHaveCount(1);
    await expect(page.locator('.minimal-project-header + [data-project-artifact]')).toHaveCount(1);
  }
});

test('project artifacts expose only verified technical claims', async ({ page }) => {
  await page.goto('/projects/uptick');
  await expect(page.getByText('Thin Zed extension', { exact: true })).toBeVisible();
  await expect(page.getByText('Rust language server', { exact: true })).toBeVisible();
  await expect(page.getByText('Registry data + OSV', { exact: true })).toBeVisible();
  await expect(page.getByText('Hints, diagnostics, links, and update actions through LSP', { exact: true })).toBeVisible();

  await page.goto('/projects/bike-cli');
  for (const command of ['bike now', 'bike now --format json', 'bike wear --format csv']) {
    await expect(page.getByText(command, { exact: true })).toBeVisible();
  }

  await page.goto('/projects/personal-site');
  for (const label of ['Typed content', 'Public routes', 'Optional /desktop', 'Legacy query + hash links']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

```bash
npm test -- tests/e2e/phase-3-projects.spec.ts --grep "signature artifact|verified technical claims"
```

Expected: failures because three artifact components and the registry do not exist.

- [ ] **Step 3: Create the three new focused artifact components**

Use semantic `<figure>` elements with real captions. The compact preview and detail versions share the same facts and differ only through `data-variant` and CSS.

`UptickFlowArtifact.tsx`:

```tsx
interface ArtifactProps { variant: 'preview' | 'detail' }

export function UptickFlowArtifact({ variant }: ArtifactProps) {
  return (
    <figure className="uptick-flow" data-variant={variant}>
      <figcaption>Extension and analysis path</figcaption>
      <ol>
        <li>Dependency file in Zed</li>
        <li>Thin Zed extension</li>
        <li>Rust language server</li>
        <li>Registry data + OSV</li>
      </ol>
      <p>Hints, diagnostics, links, and update actions through LSP</p>
    </figure>
  );
}
```

`BikeCliArtifact.tsx` must use only commands documented in the public README:

```tsx
interface ArtifactProps { variant: 'preview' | 'detail' }

export function BikeCliArtifact({ variant }: ArtifactProps) {
  return (
    <figure className="bike-cli-specimen" data-variant={variant}>
      <figcaption>One command, three output formats</figcaption>
      <dl>
        <div><dt>Readable</dt><dd><code>bike now</code></dd></div>
        <div><dt>JSON</dt><dd><code>bike now --format json</code></dd></div>
        <div><dt>CSV</dt><dd><code>bike wear --format csv</code></dd></div>
      </dl>
    </figure>
  );
}
```

`PersonalSiteArchitectureArtifact.tsx`:

```tsx
interface ArtifactProps { variant: 'preview' | 'detail' }

export function PersonalSiteArchitectureArtifact({ variant }: ArtifactProps) {
  return (
    <figure className="site-route-map" data-variant={variant}>
      <figcaption>One content system, two public surfaces</figcaption>
      <div className="site-route-map-source">Typed content</div>
      <ul>
        <li><strong>Public routes</strong><span>Work, experience, photography, contact</span></li>
        <li><strong>Optional /desktop</strong><span>Legacy query + hash links</span></li>
      </ul>
    </figure>
  );
}
```

- [ ] **Step 4: Create the typed registry**

`ProjectArtifact.tsx`:

```tsx
import type { ComponentType } from 'react';
import { PultProtocolArtifact } from '@/components/projects/PultProtocolArtifact';
import { BikeCliArtifact } from './BikeCliArtifact';
import { PersonalSiteArchitectureArtifact } from './PersonalSiteArchitectureArtifact';
import { UptickFlowArtifact } from './UptickFlowArtifact';

export type ProjectArtifactVariant = 'preview' | 'detail';
export type ProjectArtifactSlug = 'pult' | 'uptick' | 'bike-cli' | 'personal-site';
type ArtifactComponent = ComponentType<{ variant: ProjectArtifactVariant }>;

const PultArtifact: ArtifactComponent = ({ variant }) => (
  <PultProtocolArtifact className={`pult-protocol-flow project-artifact-${variant}`} />
);

const artifactRegistry = {
  pult: PultArtifact,
  uptick: UptickFlowArtifact,
  'bike-cli': BikeCliArtifact,
  'personal-site': PersonalSiteArchitectureArtifact,
} satisfies Record<ProjectArtifactSlug, ArtifactComponent>;

export function isProjectArtifactSlug(slug: string): slug is ProjectArtifactSlug {
  return Object.prototype.hasOwnProperty.call(artifactRegistry, slug);
}

export function ProjectArtifact({ slug, variant }: { slug: string; variant: ProjectArtifactVariant }) {
  if (!isProjectArtifactSlug(slug)) return null;
  const Artifact = artifactRegistry[slug];
  return (
    <div data-project-artifact={slug} data-project-artifact-variant={variant}>
      <Artifact variant={variant} />
    </div>
  );
}
```

- [ ] **Step 5: Replace the Pult-only conditional in the detail page**

Remove the direct `PultProtocolArtifact` import and render:

```tsx
<ProjectArtifact slug={project.slug} variant="detail" />
```

immediately after `.minimal-project-header`.

- [ ] **Step 6: Add flat artifact styles and mobile collapse**

Use shared rules, not card containers:

```css
[data-project-artifact] {
  padding-block: 32px;
  border-bottom: 1px solid #e5e8ec;
}

[data-project-artifact] figure { margin: 0; }
[data-project-artifact] figcaption {
  margin-bottom: 18px;
  color: #2b2b2b;
  font-size: 14px;
  font-weight: 650;
}

.uptick-flow ol,
.bike-cli-specimen dl,
.site-route-map ul {
  display: grid;
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.uptick-flow ol { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.bike-cli-specimen dl { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.site-route-map ul { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.uptick-flow li,
.bike-cli-specimen dl > div,
.site-route-map li {
  padding: 16px;
  border-block: 1px solid #aeb5bf;
}

@media (max-width: 767px) {
  .uptick-flow ol,
  .bike-cli-specimen dl,
  .site-route-map ul { grid-template-columns: minmax(0, 1fr); }
}
```

Keep actual `<code>` typography confined to the bike-cli command specimen.

- [ ] **Step 7: Run project tests**

```bash
npm test -- tests/e2e/phase-3-projects.spec.ts
```

Expected: all project route, artifact, metadata, privacy, and responsive tests pass.

The bike-cli command specimen is grounded in the public repository's documented commands and output formats: `https://github.com/stevenbarash/bike-cli#readme`.

- [ ] **Step 8: Commit the detail artifacts**

```bash
git add src/components/projects/artifacts src/components/projects/MinimalProjectDetail.tsx src/app/globals.css tests/e2e/phase-3-projects.spec.ts
git commit -m "feat: add signature project artifacts"
```

---

### Task 3: Add Project Proof Previews and Complete Mobile Link Targets

**Files:**

- Modify: `src/components/projects/MinimalProjectIndex.tsx`
- Modify: `src/app/globals.css:2453-2536, 3400-3440`
- Test: `tests/e2e/phase-3-projects.spec.ts`
- Test: `tests/e2e/minimal-homepage.spec.ts`

**Interfaces:**

- Consumes: `ProjectArtifact({ slug, variant: 'preview' })` from Task 2.
- Produces: one compact proof preview per project index row and 44px project/breadcrumb/homepage title hit areas.

- [ ] **Step 1: Write failing preview and touch-target tests**

Add to `phase-3-projects.spec.ts`:

```ts
test('project index previews each project through its registered artifact', async ({ page }) => {
  await page.goto('/projects');
  for (const project of expectedProjects) {
    const row = page.getByRole('listitem').filter({
      has: page.getByRole('heading', { name: project.name, exact: true }),
    });
    await expect(row.locator(`[data-project-artifact="${project.slug}"][data-project-artifact-variant="preview"]`)).toHaveCount(1);
  }
});

test('mobile project title and breadcrumb links meet the 44px floor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects');
  for (const project of expectedProjects) {
    const box = await page.getByRole('link', { name: project.name, exact: true }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await page.goto('/projects/pult');
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Projects' });
  const box = await breadcrumb.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(44);
});
```

Extend the existing mobile homepage target loop with the `Uptick` and `bike-cli` title links.

- [ ] **Step 2: Run the focused tests and confirm failure**

```bash
npm test -- tests/e2e/phase-3-projects.spec.ts tests/e2e/minimal-homepage.spec.ts --grep "previews each project|breadcrumb links|key targets"
```

Expected: preview test fails; homepage title links and breadcrumb are below 44px.

- [ ] **Step 3: Render the compact artifact in every index row**

Import `ProjectArtifact` and render after `.minimal-project-differentiator`:

```tsx
<ProjectArtifact slug={project.slug} variant="preview" />
```

Keep status and technology facts after the preview. Do not add a card wrapper or a second project action.

- [ ] **Step 4: Add compact preview and touch-target CSS**

```css
.minimal-project-list [data-project-artifact-variant="preview"] {
  margin-top: 24px;
  padding-block: 20px;
}

.minimal-project-breadcrumb a,
.quiet-studio-projects h3 a {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  touch-action: manipulation;
}

@media (max-width: 767px) {
  .minimal-project-list article { max-width: none; }
  .minimal-project-list [data-project-artifact-variant="preview"] { margin-top: 18px; }
}
```

- [ ] **Step 5: Run the focused tests**

Run the command from Step 2.

Expected: all selected tests pass.

- [ ] **Step 6: Commit the project index changes**

```bash
git add src/components/projects/MinimalProjectIndex.tsx src/app/globals.css tests/e2e/phase-3-projects.spec.ts tests/e2e/minimal-homepage.spec.ts
git commit -m "feat: preview project proof on the work index"
```

---

### Task 4: Correct the Homepage Journey and Preserve the Start Signature

**Files:**

- Modify: `src/app/page.tsx:43-119`
- Modify: `src/app/globals.css:1910-1968, 3318-3360, 3475-3550`
- Test: `tests/e2e/minimal-homepage.spec.ts`

**Interfaces:**

- Produces: `#work` as the homepage's first proof anchor on the Pult section.
- Preserves: existing Start-control markup, image, label, face dimensions, and `/desktop` destination.

- [ ] **Step 1: Write failing order, mobile timing, and footer-spacing tests**

Replace the old CTA assertion and add:

```ts
await expect(page.getByRole('link', { name: 'See the work', exact: true })).toHaveAttribute('href', '#work');

test('the work anchor starts with Pult before the broader project list', async ({ page }) => {
  await page.goto('/');
  const work = page.locator('#work[data-pult-workbench]');
  await expect(work).toHaveCount(1);
  expect(await work.evaluate((node) => {
    const selected = document.querySelector('[data-quiet-studio-work]');
    return selected !== null && Boolean(node.compareDocumentPosition(selected) & Node.DOCUMENT_POSITION_FOLLOWING);
  })).toBe(true);
});

test('mobile reaches the documentary image sooner without moving it ahead of the thesis', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const statement = await page.locator('.quiet-studio-statement').boundingBox();
  const image = await page.locator('.quiet-studio-hero-photo').boundingBox();
  expect(statement).not.toBeNull();
  expect(image).not.toBeNull();
  expect(statement!.height).toBeLessThanOrEqual(500);
  expect(image!.y).toBeGreaterThanOrEqual(statement!.y + statement!.height - 1);
});

test('the Start face stays authentic inside a more deliberate footer close', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('.minimal-footer-inner');
  const face = page.locator('[data-desktop-start-face]');
  expect((await footer.boundingBox())!.height).toBeGreaterThanOrEqual(136);
  await expect(face).toHaveCSS('font-size', '11px');
  await expect(face).toHaveCSS('background-color', 'rgb(192, 192, 192)');
});
```

- [ ] **Step 2: Run the focused homepage tests and confirm failure**

```bash
npm test -- tests/e2e/minimal-homepage.spec.ts --grep "work anchor|documentary image sooner|Start face stays"
```

- [ ] **Step 3: Move the anchor to the Pult section**

Change the primary action to `href="#work"`. Add `id="work"` to the existing `data-pult-workbench` section. Keep `id="selected-work"` on the broader project list for direct legacy anchors.

- [ ] **Step 4: Tighten mobile hero height and add footer breathing room**

```css
.minimal-footer-inner { min-height: 136px; }

@media (max-width: 767px) {
  .quiet-studio-statement { min-height: 480px; }
  .minimal-footer-inner { min-height: 152px; padding-block: 36px; }
}
```

Do not change `.minimal-desktop-start-face` or its active-state rules.

- [ ] **Step 5: Run the complete homepage suite**

```bash
npm test -- tests/e2e/minimal-homepage.spec.ts
```

Expected: all homepage, Start-control, mobile, privacy, and desktop-isolation tests pass.

- [ ] **Step 6: Commit the homepage journey**

```bash
git add src/app/page.tsx src/app/globals.css tests/e2e/minimal-homepage.spec.ts
git commit -m "feat: lead the homepage work journey with proof"
```

---

### Task 5: Turn Photography into a Featured Sequence and Complete Archive

**Files:**

- Create: `src/content/photography.ts`
- Modify: `src/app/photos/page.tsx`
- Modify: `src/app/globals.css:3207-3240, 3513-3521`
- Test: `tests/e2e/phase-3-minimal-routes.spec.ts`

**Interfaces:**

- Produces: `featuredPhotos: PhotoItem[]` with exactly five guarded entries.
- Produces: `archivePhotos: PhotoItem[]` containing every non-featured library entry exactly once.
- Preserves: `photoLibrary` as the generated source of truth.

- [ ] **Step 1: Write failing projection and layout tests**

Add imports for `featuredPhotos` and `archivePhotos`, then add:

```ts
test('photography opens with five selected images and keeps the full library exactly once', async ({ page }) => {
  expect(featuredPhotos.map(({ id }) => id)).toEqual([
    'ig-DTM8x-XjH87',
    'ig-DC4r__8xPDU',
    'ig-Cz83QsPOSTh',
    'ig-CoQuyVsOJJA',
    'ig-Cn-S9S4O_Of',
  ]);
  const projectedIds = [...featuredPhotos, ...archivePhotos].map(({ id }) => id);
  expect(projectedIds).toHaveLength(photoLibrary.length);
  expect(new Set(projectedIds).size).toBe(photoLibrary.length);
  expect(projectedIds).toEqual(expect.arrayContaining(photoLibrary.map(({ id }) => id)));

  await page.goto('/photos');
  await expect(page.locator('[data-photo-featured] figure')).toHaveCount(5);
  await expect(page.locator('[data-photo-archive] figure')).toHaveCount(photoLibrary.length - 5);
  await expect(page.locator('main figure')).toHaveCount(photoLibrary.length);
});

test('featured photography varies scale on desktop and keeps one reading column on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/photos');
  const figures = page.locator('[data-photo-featured] figure');
  expect((await figures.nth(0).boundingBox())!.width).toBeGreaterThan((await figures.nth(1).boundingBox())!.width);

  await page.setViewportSize({ width: 390, height: 844 });
  const boxes = await figures.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  expect(Math.max(...boxes) - Math.min(...boxes)).toBeLessThan(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
```

- [ ] **Step 2: Run the photography tests and confirm failure**

```bash
npm test -- tests/e2e/phase-3-minimal-routes.spec.ts --grep "photography opens|featured photography"
```

- [ ] **Step 3: Add the guarded projection**

`src/content/photography.ts`:

```ts
import { photoLibrary } from '@/data/photos';

export const featuredPhotoIds = [
  'ig-DTM8x-XjH87',
  'ig-DC4r__8xPDU',
  'ig-Cz83QsPOSTh',
  'ig-CoQuyVsOJJA',
  'ig-Cn-S9S4O_Of',
] as const;

export const featuredPhotos = featuredPhotoIds.map((id) => {
  const photo = photoLibrary.find((candidate) => candidate.id === id);
  if (!photo) throw new Error(`Featured photograph ${id} is missing from the verified library.`);
  return photo;
});

const featuredSet = new Set<string>(featuredPhotoIds);
export const archivePhotos = photoLibrary.filter(({ id }) => !featuredSet.has(id));
```

- [ ] **Step 4: Split page rendering without duplicating figures**

Extract a local `PhotoFigure` server component in `photos/page.tsx`. Render:

```tsx
<section className="minimal-photo-featured" data-photo-featured aria-label="Featured photographs">
  {featuredPhotos.map((photo, index) => <PhotoFigure key={photo.id} photo={photo} eager={index === 0} />)}
</section>
<section className="minimal-photo-archive" data-photo-archive aria-label="Photography archive">
  {archivePhotos.map((photo) => <PhotoFigure key={photo.id} photo={photo} />)}
</section>
```

Only the first featured image is eager/preloaded. All others remain lazy.

- [ ] **Step 5: Add exact editorial layout rules**

```css
.minimal-photo-featured {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 64px 34px;
  padding-block: 56px 88px;
  border-top: 1px solid #d9dde3;
}
.minimal-photo-featured figure:nth-child(1) { grid-column: 1 / span 8; }
.minimal-photo-featured figure:nth-child(2) { grid-column: 9 / -1; align-self: end; }
.minimal-photo-featured figure:nth-child(3) { grid-column: 3 / span 5; }
.minimal-photo-featured figure:nth-child(4) { grid-column: 7 / -1; }
.minimal-photo-featured figure:nth-child(5) { grid-column: 1 / span 7; }
.minimal-photo-archive { column-count: 2; column-gap: 34px; padding-top: 56px; border-top: 1px solid #d9dde3; }

@media (max-width: 767px) {
  .minimal-photo-featured { display: block; padding-block: 44px 64px; }
  .minimal-photo-featured figure { margin-bottom: 48px; }
  .minimal-photo-archive { column-count: 1; padding-top: 44px; }
}
```

Move the existing shared figure, image, and caption styles so they apply to both sections.

- [ ] **Step 6: Run all photography tests**

```bash
npm test -- tests/e2e/phase-3-minimal-routes.spec.ts --grep "photography|photo catalog"
```

Expected: all image count, source, intrinsic dimension, caption, loading, responsive, and sequencing tests pass.

- [ ] **Step 7: Commit the photography sequence**

```bash
git add src/content/photography.ts src/app/photos/page.tsx src/app/globals.css tests/e2e/phase-3-minimal-routes.spec.ts
git commit -m "feat: curate photography as an editorial sequence"
```

---

### Task 6: Make Contact the Strong Final Action

**Files:**

- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/globals.css:3241-3278, 3522-3532`
- Test: `tests/e2e/phase-3-minimal-routes.spec.ts`

**Interfaces:**

- Preserves: existing email address, topic list, and four social destinations.
- Produces: `data-contact-primary` and `data-contact-secondary` regions for stable hierarchy checks.

- [ ] **Step 1: Write the failing hierarchy test**

```ts
test('contact makes email the primary conclusion and social links secondary', async ({ page }) => {
  await page.goto('/contact');
  const primary = page.locator('[data-contact-primary]');
  const secondary = page.locator('[data-contact-secondary]');
  await expect(primary.getByText('Email is the best place to start.', { exact: true })).toBeVisible();
  const email = primary.getByRole('link', { name: `Email ${siteConfig.emailDisplay}`, exact: true });
  await expect(email).toHaveAttribute('href', 'mailto:steven@barash.me');
  expect(Number.parseFloat(await email.evaluate((node) => getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(28);
  const primaryBox = await primary.boundingBox();
  const secondaryBox = await secondary.boundingBox();
  expect(primaryBox).not.toBeNull();
  expect(secondaryBox).not.toBeNull();
  expect(secondaryBox!.y).toBeGreaterThan(primaryBox!.y + primaryBox!.height);
});
```

- [ ] **Step 2: Run the contact test and confirm failure**

```bash
npm test -- tests/e2e/phase-3-minimal-routes.spec.ts --grep "contact makes email"
```

- [ ] **Step 3: Add the primary and secondary regions**

Inside the document header, wrap the approved lede, new invitation, and email in:

```tsx
<div className="minimal-contact-primary" data-contact-primary>
  <p className="minimal-document-lede">Email me about identity architecture, agentic systems, technical evaluations, or workshops.</p>
  <p className="minimal-contact-invitation">Email is the best place to start.</p>
  <a className="minimal-email-link" href={decodeEmailHref(contactContent.emailDisplay)} aria-label={`Email ${contactContent.emailDisplay}`}>
    {contactContent.emailDisplay}
  </a>
</div>
```

Add `data-contact-secondary` to the existing social-link section. Keep all labels and URLs unchanged.

- [ ] **Step 4: Add hierarchy styles**

```css
.minimal-contact-primary { max-width: 760px; }
.minimal-contact-invitation { margin-top: 28px !important; color: #2b2b2b; }
.minimal-email-link {
  display: inline-flex;
  min-height: 58px;
  align-items: center;
  margin-top: 12px;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 650;
  letter-spacing: -0.025em;
}
.minimal-contact-list { margin-top: 24px; }
```

- [ ] **Step 5: Run the complete contact and route tests**

```bash
npm test -- tests/e2e/phase-3-minimal-routes.spec.ts --grep "contact|Phase 3 routes"
```

- [ ] **Step 6: Commit the contact conclusion**

```bash
git add src/app/contact/page.tsx src/app/globals.css tests/e2e/phase-3-minimal-routes.spec.ts
git commit -m "feat: make email the contact conclusion"
```

---

### Task 7: Run Full Cross-Route Verification and Finish the Source Diff

**Files:**

- Verify: all files changed in Tasks 1-6
- Modify only when a failing check identifies a defect in those files.

**Interfaces:**

- Consumes: every prior task's committed output.
- Produces: one verified public-site implementation with no deployment side effects.

- [ ] **Step 1: Run focused public-route suites**

```bash
npm test -- tests/e2e/minimal-homepage.spec.ts tests/e2e/phase-3-projects.spec.ts tests/e2e/phase-3-minimal-routes.spec.ts
```

Expected: all focused tests pass.

- [ ] **Step 2: Run static quality checks**

```bash
npm run type-check
npm run lint
git diff --check
```

Expected: type-check exits 0, application lint has no errors, and diff check is clean. Existing warnings from checked-in tooling must be separated from application findings in the handoff.

- [ ] **Step 3: Run the production build and output-integrity scan**

```bash
npm run build
```

Expected: Next.js production build, type generation, and `scripts/check-built-output.mjs` all exit 0.

- [ ] **Step 4: Run the complete Playwright suite**

```bash
npm test
```

Expected: all tests pass. If any unrelated baseline failure appears, report it with the exact test name and do not weaken its assertion to force green.

- [ ] **Step 5: Run the Impeccable detector once**

```bash
node .agents/skills/impeccable/scripts/detect.mjs --json src/app
```

Expected: `[]` and exit 0. Fix only findings introduced by this plan.

- [ ] **Step 6: Perform one bounded visual confirmation pass**

Inspect `/`, `/projects`, all four project details, `/photos`, `/contact`, and `/resume` at:

- 1440px wide desktop
- 900px intermediate
- 390px mobile

Confirm:

- the homepage moves from thesis to Pult to broader work;
- all four project artifacts are distinct, readable, and flat;
- photography has a paced five-image opening and complete archive;
- contact ends on email before quieter social destinations;
- Start control appearance is unchanged;
- mobile targets are at least 44px;
- no content clips or overflows;
- console warnings and page errors are empty.

Capture desktop and mobile screenshots in `/private/tmp/whole-site-visual-authorship/`. Reset any temporary browser viewport override afterward.

- [ ] **Step 7: Review the final diff against factual and privacy boundaries**

```bash
git diff --stat
git diff -- src/app src/components/projects src/components/layout/MinimalSiteLayout.tsx src/content tests/e2e
```

Reject any accidental appearance of `Identity Work`, draft slugs, evidence IDs, fabricated output, response-time promises, or unrelated formatting churn.

## Execution Notes

- Keep the existing localhost preview on port 3103 when available. Do not kill an existing matching Next.js server merely because `npm run dev` reports `EADDRINUSE` or an existing-server notice.
- Playwright may start and stop its own temporary server. Recheck `http://127.0.0.1:3103` outside the network sandbox after test completion and restart only if needed.
- No push, PR, deployment, Cloudflare change, Vercel change, DNS change, or public-host mutation is authorized by this plan.
