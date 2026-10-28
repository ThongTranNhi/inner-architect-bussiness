# 09 — Testing Strategy

## Nguyên tắc

Kiểm thử theo rủi ro và stack thực tế. Không xem kiểm tra chưa cấu hình là đạt. Bug fix cần regression test; chức năng mới cần test hành vi trước triển khai khi phù hợp.

## Các lớp kiểm tra

| Lớp | Mục tiêu |
| --- | --- |
| Static | format/lint, typecheck, schema/content validation, secret scan |
| Unit | hàm biến đổi, URL/contact, format, validation |
| Component | trạng thái, accessible name, keyboard, responsive behavior |
| Integration | CMS query, draft/published, 404/revalidation, media/SEO |
| E2E | navigation, sáu nhánh, CTA, mobile menu, 404 |
| Manual/UAT | nội dung thật, thiết bị/trình duyệt, thương hiệu, kênh ngoài |

## Quality gates

Khi ứng dụng có scripts, CI chạy `lint`, `typecheck`, `test`, `build` nếu tồn tại. PR đổi UI cần bằng chứng desktop/mobile; đổi content model cần test migration/rollback; đổi CTA cần thử URL desktop/mobile nhưng không gửi tin nhắn thật nếu chưa được giao.

## Ma trận tối thiểu

- Viewport: 360, 390, 768, 1024, 1440px.
- Browser: Chrome/Edge desktop, Safari iPhone, Chrome Android; ghi rõ giả lập/thực.
- Keyboard: skip link, header/menu, accordion, CTA, focus order, Escape.
- Content: title dài, ảnh thiếu, field optional null, slug không tồn tại, draft/archived.

## CI hiện tại

Repository chưa có ứng dụng. `.github/workflows/ci.yml` kiểm tra tài liệu bắt buộc và tự phát hiện package manager/scripts khi `package.json` xuất hiện. Sau khi khởi tạo app, cập nhật version/matrix và thêm test chuyên biệt.

## Báo cáo

Ghi command, môi trường, số test/lỗi và phần bỏ qua. Không nói “đã test” nếu chỉ đọc code hoặc kiểm tra một phần.
