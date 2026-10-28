# Project Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện bộ quy tắc, tài liệu chuẩn và CI an toàn cho repository INNER ARCHITECT mà không thay đổi source sản phẩm chưa tồn tại.

**Architecture:** Giữ tài liệu chi tiết hiện có, bổ sung bộ tài liệu đánh số 01–11 làm điểm vào chuẩn. CI tự nhận diện package manager/scripts khi ứng dụng xuất hiện và chỉ kiểm tra tài liệu ở trạng thái hiện tại.

**Tech Stack:** Markdown, GitHub Actions; stack ứng dụng chỉ được mô tả có điều kiện.

**Spec:** `docs/01-PRD.md`

## Global Constraints

- Không xóa hoặc ghi đè thay đổi hiện có của người dùng.
- Không commit, push, merge hoặc deploy.
- Không ép chuyển Next.js/Payload/PostgreSQL khi source chưa xác nhận.
- Code review và JSDoc/TSDoc cho hàm mới/sửa đáng kể là bắt buộc.

## Review Focus

- Tài liệu không mô tả chức năng chưa có như đã triển khai.
- CI chạy được cả khi chưa có `package.json`.
- Liên kết Markdown nội bộ trỏ đến file tồn tại.
- Không đưa dữ liệu kinh doanh chưa xác nhận thành sự thật.
- Quy tắc AI/Git không tự cấp quyền commit/push/deploy.

---

### Task 1: Quy tắc cộng tác

**Files:** `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/pull_request_template.md`

- [x] Chuẩn hóa 20 quy tắc và cổng review/kiểm tra.
- [x] Thêm điểm vào tương thích cho công cụ AI.
- [x] Bổ sung checklist PR.

### Task 2: Bộ tài liệu chuẩn

**Files:** `README.md`, `docs/01-PRD.md` đến `docs/11-CHANGELOG.md`

- [x] Bổ sung tài liệu và liên kết từ README.
- [x] Phân biệt hiện trạng, kiến trúc mục tiêu và quyết định chờ.

### Task 3: CI và xác minh

**Files:** `.github/workflows/ci.yml`

- [x] Thêm CI tự nhận diện stack/scripts.
- [x] Kiểm tra YAML, liên kết Markdown, file bắt buộc và `git diff --check`.
