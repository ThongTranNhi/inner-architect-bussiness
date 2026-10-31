# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve mobile initial-load and reload performance while preserving the current INNER ARCHITECT experience.

**Architecture:** Keep Vite as the static-site builder, but split non-home routes into lazily imported modules, load only visible images eagerly, and shrink oversized public images. Serve the resulting immutable Vite assets with long cache lifetimes while ensuring release HTML revalidates.

**Tech Stack:** React 19, Vite 8, TypeScript 5.7, Tailwind CSS 4, pnpm, Nginx.

**Spec:** `docs/superpowers/specs/2026-10-31-performance-design.md`

## Global Constraints

- Preserve all visual design, Vietnamese copy, hash routes and reduced-motion behavior.
- Do not add analytics or third-party performance services without approval.
- Public assets must remain accessible by their current expected URLs unless every reference is migrated together.
- Do not commit, push or deploy during this work.

## Review Focus

- Hero image must remain visible immediately, not be incorrectly lazy-loaded.
- Dynamic imports must preserve direct hash navigation and 404 behavior.
- Converted images must retain correct aspect ratio and meaningful alt text.
- Cache rules must never leave stale `index.html` after an atomic release switch.
- Lazy loading must not hide content for keyboard, no-JS, or reduced-motion users.

---

### Task 1: Capture a performance baseline

**Files:**
- Inspect: `dist/`, `src/App.tsx`, `src/journal/JournalPage.tsx`, `src/founder/FounderPage.tsx`
- Create: `docs/performance/2026-10-31-baseline.md`

**Interfaces:**
- Consumes: root production build.
- Produces: repeatable pre-change size and Lighthouse measurements.

- [ ] **Step 1: Build and record the current artifact inventory**

Run: `pnpm build`, then list total `dist` bytes and the 15 largest files.

- [ ] **Step 2: Run Lighthouse mobile against a production preview**

Record Performance, LCP, CLS, Total Blocking Time and transferred bytes for
home, Journal and Founder routes.

- [ ] **Step 3: Identify initial viewport image candidates**

Document which images are above the fold for each route and which are below it.

### Task 2: Make route and image loading intentional

**Files:**
- Modify/split: `src/App.tsx`, `src/journal/JournalPage.tsx`, `src/founder/FounderPage.tsx`
- Test: `tests/homepage-editorial.test.mjs`, `tests/journal.test.mjs`, `tests/founder.test.mjs`

**Interfaces:**
- Produces: lazily imported page components with stable hash-router output.

- [ ] **Step 1: Add a failing route-loading test**

Test that each existing hash route renders its current page through the router
boundary and that the fallback does not replace the route's accessible heading.

- [ ] **Step 2: Extract non-home page modules and import them with `React.lazy`**

Keep homepage eager. Use a minimal `Suspense` fallback that preserves layout
space and does not conceal real page content after the module resolves.

- [ ] **Step 3: Add explicit image loading policy**

Hero/LCP images get `fetchPriority="high"` and eager loading; below-fold images
get `loading="lazy"` and `decoding="async"`. Preserve or provide intrinsic
dimensions for every converted/changed image.

- [ ] **Step 4: Run focused and full tests**

Run: `pnpm test`

Expected: all existing behavior tests plus new route/image tests pass.

### Task 3: Optimize oversized public images

**Files:**
- Modify: selected files under `public/assets/`
- Modify: source image maps in `src/App.tsx`, `src/journal/loc-journal.ts`, and
  any component that references replaced files
- Test: asset-reference tests under `tests/`

**Interfaces:**
- Consumes: ranked largest image list from Task 1.
- Produces: compatible WebP/AVIF assets and updated public URLs.

- [ ] **Step 1: Add a failing asset-integrity test for every planned replacement**

Assert each replacement URL exists in `public/` and its declared dimensions
match the image metadata used by the layout.

- [ ] **Step 2: Convert only ranked oversized PNG/JPEG files**

Use a reproducible local image command/script, quality-check each image at its
largest rendered size, and keep the original only where needed as fallback.

- [ ] **Step 3: Update source URLs and dimensions**

Change every consuming source map/component in the same task so no route
requests a deleted format.

- [ ] **Step 4: Run image and application tests**

Run: `pnpm test && pnpm build`

Expected: no missing asset URL and lower total build payload than the baseline.

### Task 4: Configure production caching and measure the result

**Files:**
- Modify: `deploy/nginx-inner-architect.conf.example`
- Modify: `docs/CI-CD.md`
- Modify: `docs/performance/2026-10-31-baseline.md` (final before/after table)

**Interfaces:**
- Consumes: root `dist/` output.
- Produces: cache policy and measurable final performance report.

- [ ] **Step 1: Add cache-control policy by asset class**

Keep `index.html` revalidating/no-cache. Give Vite hashed files under
`/assets/` one-year `immutable` caching. Keep stable public paths at a shorter
cache duration unless explicitly versioned.

- [ ] **Step 2: Validate Nginx configuration without deploying**

Run the appropriate Nginx syntax check on a Linux host or container using the
rendered template after placeholders are supplied.

- [ ] **Step 3: Re-run size and Lighthouse baseline commands**

Update the report with before/after values and list any metric that regressed.

- [ ] **Step 4: Final verification**

Run: `pnpm typecheck && pnpm test && pnpm build && git diff --check`

Expected: all commands pass; do not commit, push or deploy.
