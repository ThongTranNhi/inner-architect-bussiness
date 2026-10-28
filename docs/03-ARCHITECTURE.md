# 03 — Architecture

## Hiện trạng

Repository hiện có tài liệu, nội dung và asset tham chiếu; chưa có ứng dụng, `package.json`, CMS, database hoặc deployment. Không xem kiến trúc dưới đây là đã triển khai.

## Kiến trúc mục tiêu có điều kiện

```text
Browser
  → Next.js application (TypeScript)
      → Payload CMS/server
          → PostgreSQL
      → Zalo/Facebook external links
      → optional privacy-safe analytics
```

- **Next.js:** route, rendering, metadata, image optimization và UI.
- **Payload:** quản trị nội dung đã duyệt, role và media metadata.
- **PostgreSQL:** content model/CMS state; không lưu booking/payment trong MVP.
- **Object storage:** media production nếu hosting yêu cầu; file gốc nội bộ không public.

Nếu source tương lai dùng framework khác, giữ ranh giới sản phẩm và cập nhật tài liệu thay vì ép migration.

## Ranh giới module

- `app/routes`: composition và metadata.
- `features`: services, workshops, academy, products, journal, contact.
- `components/ui`, `components/layout`: component dùng chung.
- `config/contact`: một nguồn cho Zalo/Facebook công khai.
- `lib`: tích hợp và hàm thuần; không trộn business content vào component.
- `content` hoặc CMS: nguồn nội dung đã duyệt, có draft/published.

## Nguyên tắc

Server-first; progressive enhancement; không có API booking/payment giả; không ghi PII vào analytics; mọi hàm mới/sửa đáng kể có JSDoc/TSDoc theo `AGENTS.md`.

## Quyết định cần ADR

Framework/CMS, hosting, media storage, analytics, search, preview/auth và migration URL.
