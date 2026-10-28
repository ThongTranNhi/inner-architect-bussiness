# CLAUDE.md

Đọc và tuân thủ `AGENTS.md` trước mọi thay đổi. File này chỉ là điểm vào cho Claude Code; `AGENTS.md` là nguồn quy tắc đầy đủ.

## Bối cảnh nhanh

- INNER ARCHITECT có sáu nhánh: trà đạo có hướng dẫn theo lịch hẹn, Tarot online/offline, đồng hành 1:1, workshop, Academy và sản phẩm.
- MVP chưa có booking/payment nội bộ; CTA chuyển sang một Zalo/Facebook chung đã được duyệt.
- Thiết kế natural modern. Không bịa dữ liệu kinh doanh hoặc chỉnh Figma khi chưa được giao.
- TypeScript + Next.js + Payload CMS + PostgreSQL là phương án mục tiêu nếu phù hợp; luôn đọc source thực tế và không ép chuyển framework.

## Trước và sau khi làm

1. Kiểm tra `git status`, đọc `README.md`, `docs/01-PRD.md`, `docs/03-ARCHITECTURE.md` và tài liệu liên quan.
2. Sửa tối thiểu, bảo toàn file/đổi dở hiện có.
3. Hàm mới hoặc sửa đáng kể cần JSDoc/TSDoc theo Rule 14 trong `AGENTS.md`.
4. Chạy đúng scripts hiện có; ghi rõ kiểm tra chưa cấu hình.
5. Không commit, push, merge hoặc deploy nếu chưa được yêu cầu rõ.
