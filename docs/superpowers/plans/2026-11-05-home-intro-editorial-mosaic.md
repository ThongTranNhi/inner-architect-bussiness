# Homepage Intro Editorial Mosaic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển section giới thiệu trang chủ thành editorial mosaic cân bằng, không còn vùng trống lớn bên trái.

**Architecture:** Chỉ thay đổi CSS grid của `.home-v4-intro` ở desktop. Ảnh được đặt vào hàng dưới tiêu đề ở cột trái, còn nội dung giữ ở cột phải và trải qua hai hàng; mobile tiếp tục dùng luồng một cột hiện có.

**Tech Stack:** React 19, Vite 8, CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-05-home-intro-editorial-mosaic-design.md`

## Global Constraints

- Không thay đổi nội dung, ảnh, alt text hoặc JSX.
- Không thay đổi section ngoài `.home-v4-intro`.
- Không thêm dependency, không commit, không push.
- Kiểm tra desktop, mobile, overflow và reduced motion hiện có.

## Review Focus

- Desktop rộng: ảnh phải bắt đầu dưới tiêu đề, không chờ cột nội dung kết thúc.
- Desktop thấp: section không tạo khoảng trống trống quá nửa màn hình.
- Mobile 390px: thứ tự đọc vẫn là tiêu đề → nội dung → ảnh.
- Nội dung dài không chồng lấn ảnh.
- Không phát sinh tràn ngang hoặc lỗi console.

---

### Task 1: Recompose homepage intro section

**Files:**
- Modify: `tests/homepage-editorial.test.mjs`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: markup hiện tại của `.home-v4-intro` trong `src/App.tsx`.
- Produces: grid desktop hai cột/hai hàng và mobile một cột không đổi thứ tự DOM.

- [ ] **Step 1: Viết kiểm thử hồi quy thất bại**

Kiểm tra desktop grid đặt heading ở cột trái hàng 1, ảnh ở cột trái hàng 2, copy ở cột phải xuyên hai hàng; kiểm tra breakpoint mobile tiếp tục gộp về một cột.

- [ ] **Step 2: Chạy test để xác nhận RED**

Run: `node --test tests/homepage-editorial.test.mjs`

- [ ] **Step 3: Sửa CSS tối thiểu**

Chỉ cập nhật `.home-v4-intro`, `.home-v4-chapter-heading`, `.home-v4-intro-copy`, `.home-v4-intro-image` và ảnh con ở desktop; giữ các rule mobile hiện có.

- [ ] **Step 4: Chạy test để xác nhận GREEN**

Run: `node --test tests/homepage-editorial.test.mjs`

- [ ] **Step 5: Xác minh giao diện và build**

Run: `pnpm typecheck`, `pnpm test`, `pnpm build`, kiểm tra browser ở desktop/mobile và `git diff --check`.
