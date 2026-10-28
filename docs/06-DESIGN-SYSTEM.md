# 06 — Design System

## Hướng thị giác

Natural modern: nền sáng ấm, nâu/đất/trà làm điểm tựa, xanh tự nhiên tiết chế, typography editorial kết hợp sans-serif rõ ràng, ảnh thật và nhiều khoảng thở. Tránh “mystical” quá mức, tương phản yếu hoặc trang trí làm mờ thông tin dịch vụ.

## Token đề xuất

Tên token mang tính ngữ nghĩa; giá trị cuối lấy từ thiết kế đã duyệt.

- Color: `surface`, `surface-muted`, `text`, `text-muted`, `brand`, `brand-strong`, `accent`, `border`, `focus`, `danger`, `success`.
- Typography: `font-display`, `font-body`, `text-xs` đến `text-5xl`, line-height đọc dài 1.5–1.8.
- Space: thang 4/8px; section spacing responsive.
- Radius/shadow/motion: ít mức, nhất quán; motion 150–300ms và tôn trọng `prefers-reduced-motion`.

## Component nền tảng

Button/link, header/mobile navigation, footer, breadcrumb, card dịch vụ/chương trình/sản phẩm/bài viết, rich text, image, quote, accordion, badge trạng thái, CTA contact, empty/error state và pagination khi thật sự cần.

Mỗi component cần default, hover, focus-visible, active, disabled/loading nếu có, error/empty liên quan và responsive behavior. Link điều hướng không giả dạng button; button hành động không giả dạng link.

## Accessibility

- Tương phản WCAG 2.1 AA; focus không chỉ dựa vào màu.
- Touch target tối thiểu 44×44px khi có thể.
- Heading/landmark/accessible name đầy đủ.
- Alt mô tả mục đích; ảnh trang trí dùng alt rỗng.
- Không autoplay; animation không chặn đọc/thao tác.

## Quản trị

Không hard-code token lặp lại. Component mới phải chứng minh nhu cầu dùng lại; đổi token diện rộng cần design review và regression check.
