# 04 — Database & Content Model

## Trạng thái

Chưa có database. Mô hình này là đề xuất cho Payload/PostgreSQL hoặc CMS tương đương; không tạo migration đến khi stack được duyệt.

## Collections đề xuất

| Collection | Trường cốt lõi |
| --- | --- |
| `services` | `title`, `slug`, `kind`, `summary`, `body`, `deliveryModes`, dữ liệu thời lượng/giá optional, người thực hiện, `contactContext`, `status` |
| `people` | `name`, `slug`, `role`, `bio`, `credentials[]`, `portrait`, `verificationStatus` |
| `programs` | `type`, `title`, `slug`, nội dung, người hướng dẫn, lịch/địa điểm/giá optional, `registrationStatus` |
| `products` | `title`, `slug`, nội dung, ảnh, thông số, giá/trạng thái optional |
| `journalPosts` | `title`, `slug`, `excerpt`, `body`, cover, tác giả, ngày publish, `status` |
| `media` | file, `alt`, caption, quyền sở hữu/sử dụng, focal point |
| `siteSettings` | navigation, SEO, public contact channels, footer, legal links |

## Quy tắc dữ liệu

- `slug` duy nhất theo collection và ổn định sau publish.
- Giá/thời lượng chưa xác nhận dùng `null`, không dùng `0` hoặc nội dung đoán.
- `status`: `draft`, `review`, `published`, `archived`; chỉ published công khai.
- Credential/quote/ảnh cần xác minh và quyền sử dụng trước publish.
- Zalo/Facebook ở một nguồn `siteSettings.contactChannels`; content chỉ giữ ngữ cảnh CTA.
- Timestamps UTC; giao diện định dạng theo locale Việt Nam.

## Không lưu trong MVP

Lịch trống, booking, payment, hồ sơ khách, hội thoại ngoài nền tảng, dữ liệu sức khỏe/tâm lý và dữ liệu thẻ.

## Migration/backup

Migration phải versioned, review và thử trên bản sao; trước thay đổi phá vỡ tương thích cần backup đã kiểm tra restore và rollback.
