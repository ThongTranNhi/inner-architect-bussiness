# Root Application Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `D:\inner-architect` the single application root for the Vite website.

**Architecture:** Move the current Vite app upward with Git-aware renames while retaining root-level documentation and source-material directories. Root becomes the sole location for pnpm, Vite, source, public assets, tests, deployment scripts and Figma Make configuration; production deployment continues to publish only `dist`.

**Tech Stack:** React 19, Vite 8, TypeScript 5.7, Tailwind CSS 4, pnpm 12, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-31-root-app-layout-design.md`

## Global Constraints

- Preserve the existing React/Vite/Tailwind/pnpm stack and runtime routes.
- Use `git mv` for tracked app files; never move `node_modules/` or `dist/`.
- Preserve uncommitted user work and untracked source-material directories unless explicitly in scope.
- Do not commit, push or deploy as part of this migration.
- Only `public/` and source imports may feed the production static artifact.

## Review Focus

- A root build must retain every `/assets/...` and `/logocongty.jpg` URL used by source.
- CI must not run duplicate test/build jobs after the app is detected at root.
- The deploy workflow must archive root `dist`, not a stale nested path.
- Figma Make configuration must remain reachable as `/.figma/make/site.json` from root.
- No root documentation or policy file may be silently overwritten during filename collisions.

---

### Task 1: Inventory collisions and protect the current tree

**Files:**
- Inspect: `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `README.md`, `.github/`, `docs/`
- Inspect: `inner-architect-figma-make/` and all uncommitted changes

**Interfaces:**
- Consumes: the current root Git status and the nested app inventory.
- Produces: a written collision map and a clean set of move candidates.

- [ ] **Step 1: Record the pre-migration state**

Run: `git status --short && git ls-files inner-architect-figma-make`

Expected: a list that distinguishes tracked nested-app files from user changes and untracked root source materials.

- [ ] **Step 2: Compare each colliding root/app policy file before moving**

Run: `git diff --no-index -- AGENTS.md inner-architect-figma-make/AGENTS.md` (repeat for each collision, accepting exit code 1 as a difference report).

Expected: an explicit decision for every collision: retain root, retain app, or manually merge.

- [ ] **Step 3: Save the collision decisions in the migration commit message/body or a focused migration note**

Expected: no file will be overwritten by an implicit move.

### Task 2: Relocate the Vite application to root

**Files:**
- Move: nested `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.mise.toml`, `src/`, `public/`, `tests/`, `.figma/`
- Merge as decided in Task 1: root policy/readme/gitignore files

**Interfaces:**
- Consumes: collision decisions from Task 1.
- Produces: root-level pnpm/Vite application layout.

- [ ] **Step 1: Move tracked non-colliding app files using `git mv`**

Move one top-level application unit at a time; do not move nested `node_modules/` or `dist/`.

- [ ] **Step 2: Merge colliding files rather than overwriting them**

Ensure root `.gitignore` keeps the app ignores for `node_modules/`, `dist/`, `.env*`, Vite cache and Figma design context.

- [ ] **Step 3: Update root-relative references in configuration and tests**

Remove any remaining `inner-architect-figma-make/` prefix in Vite, package scripts, tests and documentation that points to the runnable app.

- [ ] **Step 4: Prove root toolchain behavior**

Run: `pnpm install --frozen-lockfile && pnpm typecheck && pnpm test && pnpm build`

Expected: all commands succeed at `D:\inner-architect`; output is `D:\inner-architect\dist`.

### Task 3: Adapt CI/CD and deployment assets

**Files:**
- Modify: `.github/workflows/ci-cd.yml`
- Modify: `.github/workflows/ci.yml`
- Move/modify: `scripts/deploy/`, `deploy/`, `docs/CI-CD.md`

**Interfaces:**
- Consumes: root build output `dist/`.
- Produces: root-based verification and deploy artifact paths.

- [ ] **Step 1: Update `ci-cd.yml` paths**

Remove default nested `working-directory`, set pnpm cache path to `pnpm-lock.yaml`, upload/download the root archive, and retain the existing verify-before-deploy dependency.

- [ ] **Step 2: Remove duplicated application checks from `ci.yml`**

Keep documentation integrity and whitespace checks; let `ci-cd.yml` be the single source of app typecheck/test/build/deploy verification.

- [ ] **Step 3: Move deployment and Nginx templates to root paths**

Update workflow script references and `docs/CI-CD.md` commands to root-relative `scripts/deploy/` and `deploy/` paths.

- [ ] **Step 4: Validate workflow syntax and artifact assumptions**

Run: YAML parser check plus `git diff --check`.

Expected: workflow parses and archive source is root `dist/`.

### Task 4: Validate assets and finalize the migration boundary

**Files:**
- Inspect: `public/assets/`, `src/`, root source-material directories
- Remove: now-empty `inner-architect-figma-make/` only after all checks pass

**Interfaces:**
- Consumes: root app build and source asset URL inventory.
- Produces: a root-only runnable layout with deliberate asset boundaries.

- [ ] **Step 1: Check every referenced public URL exists after the move**

Run the existing asset-reference test suite and inspect `dist/assets` plus copied public paths.

Expected: no `/assets/...`, `/favicon.svg`, or `/logocongty.jpg` reference resolves to a missing file.

- [ ] **Step 2: Confirm non-app root directories remain outside production output**

Verify that `information/`, `video/`, and any source-only material are absent from `dist/` unless intentionally integrated as a website asset.

- [ ] **Step 3: Run full root verification**

Run: `pnpm typecheck && pnpm test && pnpm build && git diff --check`

Expected: all commands pass and the old nested app directory is empty/removed only after successful build.

- [ ] **Step 4: Stop for review before commit/push/deploy**

Report moved files, resolved collisions, preserved root materials and verification output. Do not commit, push or deploy.
