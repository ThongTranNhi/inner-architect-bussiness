# Homepage Content Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cập nhật trang chủ theo mười chương nội dung đã được PM duyệt, với “Triết lý đồng hành” và “Hệ thống bốn tầng” nằm trong cùng một chương.

**Architecture:** Giữ component `Home`, route, asset và motion hiện có. Thay markup phần thân trang chủ bằng các section scoped `home-v4-*`, tiếp tục tái sử dụng hero, Journal, Link và dữ liệu bốn tầng.

**Tech Stack:** React 19, TypeScript, Vite 8, CSS hiện có, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-03-homepage-content-architecture-design.md`

## Global Constraints

- Không sửa trang phụ, header/footer, route, asset hoặc dữ liệu kinh doanh.
- Không bịa giá, địa chỉ, lịch hoặc liên kết chỉ đường.
- Không commit, push, merge hoặc deploy.
- Bảo toàn các thay đổi typography đang có trong worktree.

## Review Focus

- Thứ tự mười section phải đúng và chỉ có một `h1`.
- Nội dung dài không tràn cột ở 1440px, 1024px, 390px và 360px.
- Chương triết lý và bốn tầng phải nằm trong cùng một section DOM.
- CTA phải trỏ tới route hiện có và không tạo tương tác giả.
- Hero, ảnh lazy-load và reduced-motion phải giữ hành vi hiện tại.

---

### Task 1: Khóa hợp đồng nội dung và thứ tự section

**Files:**
- Modify: `tests/homepage-editorial.test.mjs`

- [ ] Thêm test kiểm tra mười section theo thứ tự, tiêu đề chính, nội dung trọng yếu và CTA.
- [ ] Chạy `node --test tests/homepage-editorial.test.mjs` và xác nhận test mới thất bại vì cấu trúc cũ.

### Task 2: Thay nội dung và cấu trúc Home

**Files:**
- Modify: `src/App.tsx`

- [ ] Thay copy hero theo bản PM duyệt.
- [ ] Tạo section giới thiệu.
- [ ] Gộp triết lý và bốn tầng trong một section, tái sử dụng `danhSachBonTang`.
- [ ] Tạo các section phiên đồng hành, workshop, sản phẩm, The Hermit, Khiêm Võ và kết nối.
- [ ] Giữ Journal hiện tại nhưng thay heading/dek theo copy mới.
- [ ] Chạy test đích và xác nhận nội dung/structure đã xanh trước khi chỉnh CSS.

### Task 3: Bố cục editorial responsive

**Files:**
- Modify: `src/index.css`

- [ ] Thêm CSS scoped `home-editorial-v4` / `home-v4-*` cho desktop, tablet và mobile.
- [ ] Giữ focus, reveal và reduced-motion hiện có.
- [ ] Chạy test đích, `pnpm typecheck` và `pnpm build`.

### Task 4: Kiểm tra trình duyệt và regression

**Files:**
- Verify only

- [ ] Kiểm tra desktop 1440×1000, tablet 1024×900, mobile 390×844 và 360×800.
- [ ] Xác nhận không tràn ngang, CTA hiển thị/click được và console không có lỗi.
- [ ] Chạy `pnpm test`; báo trung thực mọi lỗi tồn tại ngoài phạm vi.
- [ ] Chạy `git diff --check` và rà đúng phạm vi thay đổi.
