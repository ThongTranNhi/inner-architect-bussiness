# GitHub Copilot instructions — INNER ARCHITECT

Đọc và tuân thủ `/AGENTS.md`; đây là nguồn đầy đủ. Trước khi tạo/sửa code, đọc tài liệu liên quan trong `/docs` và kiểm tra stack/scripts thực tế.

- Sửa tối thiểu, bảo toàn thay đổi hiện có; không tự refactor hoặc chuyển framework.
- Không bịa giá, lịch, hồ sơ, địa chỉ, đánh giá hoặc URL liên hệ.
- MVP không có booking, payment, tài khoản hoặc thu thập dữ liệu sức khỏe.
- TypeScript + Next.js + Payload + PostgreSQL chỉ dùng khi source/quyết định thực tế phù hợp.
- Hàm mới hoặc sửa đáng kể phải có JSDoc/TSDoc hữu ích.
- Hàm dự án dùng tiếng Việt không dấu, camelCase theo quy ước; giữ tên chuẩn của API/framework.
- Viết/điều chỉnh test theo hành vi và chạy scripts tồn tại; không giả định kiểm tra đạt.
- Không hard-code secret; không đưa PII vào log/analytics/URL.
- Code review bắt buộc trước merge. Không tự commit, push, merge hoặc deploy.
