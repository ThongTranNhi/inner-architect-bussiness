# 10 — Deployment & Operations

## Hiện trạng

Chưa chốt hosting/domain và chưa có pipeline deploy. Workflow CI không deploy. Chi tiết: `docs/04-delivery/deployment.md`.

## Môi trường

- **Local:** dữ liệu mẫu, không dùng secret production.
- **Preview:** gắn PR/commit, không index, giới hạn truy cập nếu có nội dung chưa công bố.
- **Production:** đúng artifact đã review/UAT; deploy cần phê duyệt cụ thể.

## Luồng phát hành

PR → CI → code review → preview → PM/content UAT → merge được duyệt → phê duyệt production → deploy đúng artifact → smoke test → release note.

Không tự deploy production trên mọi push cho đến khi chủ dự án duyệt chính sách. CI dùng permissions tối thiểu; credentials tách theo môi trường và GitHub Environment có reviewer khi nền tảng hỗ trợ.

## Cấu hình dự kiến

Tùy framework/hosting: database URL, Payload secret, public site URL, media storage và public contact URLs. `.env.example` chỉ ghi tên/giá trị giả; prefix public không được dùng cho secret.

## Pre-release

- CI xanh; diff/review hoàn tất; không có secret.
- Content/asset/CTA được duyệt; preview đúng commit.
- Migration và backup/restore đã thử nếu có database change.
- Domain/HTTPS/robots/redirect/security headers được xác nhận.
- Owner deploy, rollback target và thời gian theo dõi được ghi rõ.

## Smoke test và rollback

Kiểm tra home, sáu nhánh, contact, detail, menu mobile, CTA, media, metadata, 404, HTTPS, robots và lỗi runtime. Không gửi tin nhắn thật nếu chưa được giao.

Rollback về deployment ổn định hoặc revert bằng PR; không force-push `main`. Database/content migration cần restore riêng. Sau rollback chạy smoke test và ghi nhận sự cố.
