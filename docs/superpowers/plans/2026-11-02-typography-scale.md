# Typography Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thu nhỏ và cân chỉnh hệ thống tiêu đề theo từng trang, đồng thời thay mốc học vấn đã được PM xác nhận thành `2027`.

**Architecture:** Giữ nguyên component, font, màu, animation và cấu trúc layout. Chỉnh trực tiếp các selector heading đã có trong `src/index.css` và `src/founder/founder.css`, với giới hạn riêng cho desktop/mobile; cập nhật dữ liệu nguồn trong `src/founder/noi-dung-founder.ts`.

**Tech Stack:** React 19, TypeScript, Vite 8, CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-02-typography-scale-design.md`

## Global Constraints

- Chỉ sửa cỡ chữ, line-height, độ rộng dòng/khoảng cách trực tiếp phục vụ tiêu đề và giá trị `2027`.
- Không thay cấu trúc component, sitemap, hình ảnh, animation, palette, font hoặc dependency.
- Không sửa nội dung thương hiệu ngoài `Đang chờ nhận bằng` → `2027`.
- Không commit, push, merge hoặc deploy nếu chưa được người dùng yêu cầu riêng.
- Mọi thay đổi hành vi phải đi qua chu kỳ test đỏ → xanh.

## Review Focus

- Viewport 360px: không có tiêu đề tràn ngang; kiểm tra bằng browser ở Task 3.
- Desktop 1440px: tiêu đề không chiếm quá phần lớn viewport hoặc tạo dòng đơn quá dài; kiểm tra bằng browser ở Task 3.
- Nội dung dài trên Journal và bài viết: line-height và max-width vẫn dễ đọc; kiểm tra bằng browser ở Task 3.
- Tên Võ Khiêm vẫn nằm gọn trong cột hero mà không đè ảnh; kiểm tra bằng browser ở Task 3.
- Giá trị `2027` xuất hiện đúng một mốc học vấn và chuỗi cũ không còn trong mã nguồn; kiểm tra tự động ở Task 1.

---

### Task 1: Cập nhật mốc học vấn 2027

**Files:**
- Modify: `tests/founder.test.mjs`
- Modify: `src/founder/noi-dung-founder.ts`

**Interfaces:**
- Consumes: `hocVanFounder.muc[].moc` hiện có.
- Produces: mốc Tâm lý học chính xác là chuỗi `2027`.

- [ ] **Step 1: Đổi assertion hiện tại thành giá trị đã duyệt**

Trong test `psychology degree is not presented as awarded`, giữ các assertion hiện có và đổi `tamLy.moc` thành `2027`; thêm assertion mã nguồn không chứa `Đang chờ nhận bằng`.

- [ ] **Step 2: Chạy test để xác nhận đỏ**

Run: `node --test tests/founder.test.mjs`

Expected: FAIL vì dữ liệu hiện tại vẫn là `Đang chờ nhận bằng`.

- [ ] **Step 3: Cập nhật dữ liệu tối thiểu**

Trong `src/founder/noi-dung-founder.ts`, đổi duy nhất `moc: "Đang chờ nhận bằng"` thành `moc: "2027"`.

- [ ] **Step 4: Chạy test để xác nhận xanh**

Run: `node --test tests/founder.test.mjs`

Expected: toàn bộ test founder PASS.

### Task 2: Cân chỉnh thang tiêu đề theo từng nhóm trang

**Files:**
- Modify: `tests/homepage-editorial.test.mjs`
- Modify: `tests/journal.test.mjs`
- Modify: `tests/founder.test.mjs`
- Modify: `src/index.css`
- Modify: `src/founder/founder.css`

**Interfaces:**
- Consumes: các class hiện có `home-v3-*`, `journal-page`, `page-hero`, `article-head`, `hermit-*`, `founder-page`.
- Produces: thang display heading mới theo từng trang, không tạo global `h1/h2/h3` override.

- [ ] **Step 1: Thêm test hợp đồng CSS cho trang chủ**

Thêm test xác nhận:

- `.home-v3-hero h1` có trần `72px`.
- nhóm `.home-v3-opening-heading h2`, `.home-v3-section-heading h2`, `.home-v3-journal-heading h2` có trần `64px`.
- `.home-v3-ethics-statement h2` có trần `76px`.
- `.home-v3-closing h2` có trần `80px`.
- mobile các tiêu đề section không vượt `42px`, ethics không vượt `46px`, closing không vượt `48px`.

- [ ] **Step 2: Thêm test hợp đồng CSS cho Journal và Founder**

Thêm assertion:

- Journal masthead có trần `108px` desktop và `52px` mobile.
- Journal featured/library/series heading có trần lần lượt `54px`, `48px`, `48px`.
- Founder hero có trần `80px`; heading trong cột hẹp có trần `46px`; mobile hero có trần `48px`.

- [ ] **Step 3: Chạy test để xác nhận đỏ**

Run: `node --test tests/homepage-editorial.test.mjs tests/journal.test.mjs tests/founder.test.mjs`

Expected: FAIL vì CSS vẫn chứa thang cũ.

- [ ] **Step 4: Sửa các selector trang chủ trong `src/index.css`**

Đặt các giá trị:

- `.home-v3-hero h1`: `clamp(44px, 4.8vw, 72px)`, line-height `0.96`.
- nhóm heading section: `clamp(42px, 4.2vw, 64px)`, line-height `1`.
- ethics: `clamp(46px, 5.1vw, 76px)`, line-height `0.98`.
- closing: `clamp(48px, 5.2vw, 80px)`, line-height `0.98`.
- mobile section `40px`, ethics `44px`, closing `48px`; giữ gutter và layout hiện có.

- [ ] **Step 5: Sửa các selector trang phụ trong `src/index.css`**

- `.page-hero h1`: `clamp(56px, 7vw, 104px)`; mobile `50px`.
- `.article-head h1`: `clamp(48px, 6vw, 88px)`; mobile `44px`.
- The Hermit hero/intro/ritual/pair/tarot/visit giảm về trần `88px`, `68px`, `58px`, `60px`; mobile hero `48px` và section `40–42px`.
- Journal masthead `clamp(54px, 7.5vw, 108px)`, mobile `52px`; featured `54px`; library/series `48px`; card title không quá `38px`.
- Chỉ thêm max-width/text-wrap khi cần để tạo dòng 2–3 hàng cân bằng; không đổi grid.

- [ ] **Step 6: Sửa thang Founder trong `src/founder/founder.css`**

- Hero `clamp(50px, 5.6vw, 80px)` và giữ `white-space: nowrap` ở desktop.
- Heading cột hẹp `clamp(32px, 3.2vw, 46px)`.
- Mobile hero `clamp(40px, 12vw, 48px)`, cho phép xuống dòng nếu viewport không đủ rộng.
- `.founder-page h2.serif`: `clamp(36px, 4.2vw, 56px)`, line-height `1.08`.
- Mobile `h2.serif` tối đa `42px`; không đổi bố cục ảnh/chữ.

- [ ] **Step 7: Chạy test để xác nhận xanh**

Run: `node --test tests/homepage-editorial.test.mjs tests/journal.test.mjs tests/founder.test.mjs`

Expected: toàn bộ test mục tiêu PASS.

### Task 3: Kiểm tra hồi quy và giao diện thực tế

**Files:**
- Không sửa production file nếu không tái hiện được lỗi cụ thể.

**Interfaces:**
- Consumes: CSS và dữ liệu sau Task 1–2.
- Produces: bằng chứng test/build/browser cho thay đổi đã duyệt.

- [ ] **Step 1: Chạy toàn bộ kiểm tra cấu hình sẵn**

Run: `pnpm test`

Expected: báo rõ mọi PASS/FAIL; không che giấu test hiệu năng đang lỗi nếu vẫn tồn tại.

Run: `pnpm typecheck`

Expected: PASS.

Run: `pnpm build`

Expected: PASS.

- [ ] **Step 2: Kiểm tra trình duyệt desktop**

Tại `1440x1000`, kiểm tra trang chủ, Journal, Võ Khiêm và The Hermit: tiêu đề không tràn, không đè ảnh, không tạo dòng đơn quá dài; giá trị `2027` hiển thị đúng.

- [ ] **Step 3: Kiểm tra tablet và mobile**

Tại `1024x768` và `390x844`, kiểm tra cùng các trang; xác nhận `document.documentElement.scrollWidth === window.innerWidth` và CTA vẫn nhìn thấy/nhấn được.

- [ ] **Step 4: Kiểm tra diff cuối**

Run: `git diff --check`

Run: `git status --short`

Expected: chỉ có spec/plan, test và ba file production nằm trong phạm vi; không có secret, build artifact hoặc thay đổi ngoài yêu cầu.
