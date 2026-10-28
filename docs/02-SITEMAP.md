# 02 — Sitemap

## Cây trang đề xuất

```text
/
├── /gioi-thieu
│   └── /doi-ngu/[slug]
├── /dich-vu
│   ├── /dich-vu/tra-dao
│   ├── /dich-vu/tarot
│   └── /dich-vu/dong-hanh-1-1
├── /workshop/[slug]
├── /academy/[slug]
├── /san-pham/[slug]
├── /journal/[slug]
├── /faq
├── /lien-he
├── /chinh-sach-bao-mat
└── /404
```

## Điều hướng chính

Header ưu tiên nhãn người dùng hiểu ngay: Dịch vụ, Workshop, Academy, Sản phẩm, Journal, Giới thiệu và Liên hệ. Mobile menu phải mở/đóng bằng bàn phím và Escape; focus quay lại nút mở sau khi đóng.

## Nguyên tắc

- Slug tiếng Việt không dấu, chữ thường, kebab-case; đổi URL sau phát hành phải có redirect.
- Trang tổng quan dẫn đến đủ ba dịch vụ chính và ba nhánh mở rộng.
- Detail page có CTA đúng ngữ cảnh và liên kết liên quan có chủ đích.
- Không tạo trang rỗng chỉ để đủ sitemap; ẩn khỏi điều hướng đến khi nội dung được duyệt.
- The Hermit/LARA chỉ xuất hiện như nhánh/khái niệm sau khi PM chốt cách gọi.

Chi tiết: `docs/02-design/sitemap.md`, `docs/02-design/user-flows.md`.
