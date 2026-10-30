# Homepage Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tái cấu trúc trang chủ thành một trải nghiệm editorial theo Norm/Openhouse, sửa selector hỏng và bảo đảm motion/accessibility hoạt động đúng.

**Architecture:** Chỉ thay markup của `Home` và thêm một namespace CSS `home-editorial-v3` để không ảnh hưởng trang phụ. Kiểm thử hợp đồng tĩnh bằng Node test runner, sau đó build và kiểm tra trực quan trên localhost ở desktop/mobile.

**Tech Stack:** React 19, TypeScript, Vite, CSS, Node built-in test runner

**Spec:** `docs/superpowers/specs/2026-10-29-homepage-editorial-redesign.md`

## Global Constraints

- Không đổi nội dung kinh doanh, route, CTA hoặc asset ngoài trang chủ.
- Không thêm dependency.
- Tôn trọng `prefers-reduced-motion` và viewport 390/768/1440.
- Không sửa Figma, commit, push, merge hoặc deploy.

## Review Focus

- Selector JSX/CSS phải khớp, đặc biệt story index và Journal.
- Không tràn ngang hoặc chữ đè nhau tại 390px.
- Motion giảm phải loại bỏ animation, transition, transform và clip-path ẩn nội dung.
- Journal phải có một bài chính và hai bài phụ, không phải ba cột đồng hạng.
- Header/CTA vẫn sử dụng được bằng bàn phím và giữ route cũ.

---

### Task 1: Homepage structure contract

**Files:**
- Create: `inner-architect-figma-make/tests/homepage-editorial.test.mjs`
- Modify: `inner-architect-figma-make/package.json`
- Test: `inner-architect-figma-make/tests/homepage-editorial.test.mjs`

**Interfaces:**
- Consumes: source text của `src/App.tsx` và `src/index.css`.
- Produces: regression contract cho namespace, story hierarchy, Journal hierarchy và reduced motion.

- [ ] Viết test thất bại cho `home-editorial-v3`, `home-story-feature`, `home-journal-feature` và reduced-motion override.
- [ ] Chạy `pnpm test` và xác nhận test thất bại vì cấu trúc mới chưa tồn tại.
- [ ] Thêm script `test` bằng Node test runner.

### Task 2: Editorial homepage markup and layout

**Files:**
- Modify: `inner-architect-figma-make/src/App.tsx:509-819`
- Modify: `inner-architect-figma-make/src/index.css`
- Test: `inner-architect-figma-make/tests/homepage-editorial.test.mjs`

**Interfaces:**
- Consumes: `IMG`, `news`, `danhSachBonTang`, `Link` hiện có.
- Produces: homepage namespaced với hero, chapters, story index, ethics, Journal feature và closing CTA.

- [ ] Thay markup Home, giữ nguyên route/copy/CTA.
- [ ] Thêm CSS 12 cột, editorial hierarchy, focus/hover và responsive.
- [ ] Chạy `pnpm test` đến khi contract đạt.

### Task 3: Motion, accessibility and browser verification

**Files:**
- Modify: `inner-architect-figma-make/src/index.css`
- Test: `inner-architect-figma-make/tests/homepage-editorial.test.mjs`

**Interfaces:**
- Consumes: `IntersectionObserver` và class `.is-visible` hiện có.
- Produces: hero sequence, section/child reveal, image clip reveal và reduced-motion fallback hoàn chỉnh.

- [ ] Hoàn thiện motion và override reduced motion ở cuối cascade.
- [ ] Chạy `pnpm test`, `pnpm build`.
- [ ] Kiểm tra localhost tại 1440, 768 và 390; xác nhận không overflow, ảnh hỏng hoặc console error.

