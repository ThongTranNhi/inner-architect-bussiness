# 11 — Changelog

Ghi thay đổi đáng chú ý theo [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Không coi “Unreleased” là đã phát hành.

## [Unreleased]

### Added

- Backend `server/` (Node.js + Express 5 + TypeScript + MySQL): API `/api/v1` nhận thông tin khách hàng, đăng nhập session, quản lý khách hàng, thống kê; migration SQL có version; script tạo tài khoản nhân viên (D10).
- Biểu mẫu "Để lại thông tin" trên trang Liên hệ (4 trường + đồng ý chính sách bảo mật).
- Trang quản trị Customer Care `/jathong` (đăng nhập, dashboard, danh sách/tìm/lọc, chi tiết, cập nhật trạng thái).
- Tài liệu `docs/backend/`.

- Bộ tài liệu chuẩn `01-PRD.md` đến `11-CHANGELOG.md`.
- `CLAUDE.md` và `.github/copilot-instructions.md` cho công cụ AI.
- GitHub Actions CI tự nhận diện package manager/scripts và kiểm tra tài liệu.
- Pull request template có cổng code review, JSDoc/TSDoc, bảo mật và rollback.

### Changed

- Trang Liên hệ, ghi chú khối liên hệ và Chính sách bảo mật (bản nháp) mô tả đúng việc website lưu thông tin từ biểu mẫu.
- Chuẩn hóa `AGENTS.md` với 20 Git/GitHub & AI Coding Rules bắt buộc.
- Cập nhật README phản ánh repository đã tồn tại nhưng chưa có ứng dụng.

### Security

- Ghi rõ secret, privacy, security review và permissions tối thiểu.

## Quy ước cập nhật

Dùng `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`. Mỗi release dùng ngày `YYYY-MM-DD` và liên kết tag/compare khi có. Không đưa dữ liệu nhạy cảm hoặc chi tiết khai thác chưa khắc phục vào changelog công khai.
