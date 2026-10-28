# 08 — Security & Privacy

## Mục tiêu và threat model

Bảo vệ nội dung quản trị, secret, hạ tầng và quyền riêng tư. Rủi ro chính: chiếm CMS, lộ secret, XSS qua rich text/URL, supply-chain compromise, link liên hệ giả/sai, analytics vượt nhu cầu và upload độc hại/asset thiếu quyền.

## Kiểm soát bắt buộc

- MFA cho GitHub/CMS/hosting; least privilege; rà quyền định kỳ.
- Secret ở secret store theo môi trường; rotation khi nghi ngờ lộ.
- Validate/sanitize CMS, allowlist protocol URL; CSP và security headers phù hợp.
- Dependency lockfile, review update; workflow dùng action tin cậy và permissions tối thiểu.
- Branch protection, PR review, status checks thật, secret scanning nếu có.
- Preview không index; production HTTPS/HSTS sau khi xác nhận.
- Backup/restore database/media trước migration quan trọng.

## Privacy

MVP không thu booking, payment, tài khoản hay dữ liệu sức khỏe. Analytics chỉ bật khi PM duyệt; tối thiểu hóa dữ liệu, có consent khi pháp lý yêu cầu, retention rõ và không ghi nội dung liên hệ. Zalo/Facebook là nền tảng bên thứ ba và policy phải nêu rõ việc chuyển nền tảng.

## Ứng phó sự cố

Thu hồi credential, giới hạn ảnh hưởng, khôi phục bản an toàn, ghi timeline/owner và thông báo theo nghĩa vụ. Xóa secret khỏi commit mới không đủ; phải rotate và phối hợp xử lý lịch sử.

Auth/role, upload, rich text, external URL, analytics, header bảo mật, workflow permissions, dependency và migration đều cần security review.
