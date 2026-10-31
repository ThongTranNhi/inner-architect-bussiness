# Thiết kế: tối ưu tải và hiển thị website

## Ý định

Ưu tiên cảm giác tải nhanh trên điện thoại khi mở hoặc reload website, không
thay đổi thiết kế, nội dung, route hash hay animation hiện tại.

## Mục tiêu

- Chỉ tải JavaScript của trang đang truy cập; các trang phụ tải theo nhu cầu.
- Hero/LCP image tải ưu tiên; ảnh ngoài màn hình tải lazy và không gây layout
  shift.
- Giảm đáng kể dung lượng ảnh tải lần đầu so với build hiện tại (~25 MB `dist`,
  phần lớn là PNG/JPEG công khai).
- Cache mạnh các asset có tên hash/phiên bản, còn HTML luôn nhận release mới.
- Đo được build size và Lighthouse mobile trước/sau.

## Không làm

- Không đổi React/Vite/Tailwind, UI, copy, URL hash hay cấu trúc content.
- Không đưa video/tài liệu nguồn ở root vào bản production.
- Không thay đổi DNS/VPS hay deploy trong hạng mục này.

## Hướng kỹ thuật

- Tách các page/module hiện đang ở `src/App.tsx` thành import động bằng
  `React.lazy`/`Suspense` theo router hash; homepage vẫn là entry eager.
- Bổ sung `loading="lazy"`, `decoding="async"`, `width`/`height` hợp lý cho
  ảnh dưới fold; hero giữ eager/high priority.
- Tạo WebP (và chỉ dùng AVIF nếu kiểm thử decoder/quality đạt) cho ảnh PNG/JPEG
  lớn, thay URL có kiểm soát và giữ thông tin kích thước trong source.
- Nginx: `index.html` no-cache/revalidate; asset fingerprinted cache dài,
  immutable. Asset công khai không hash giữ cache ngắn hoặc phải được version
  hoá trước khi đặt immutable.

## Tiêu chí hoàn thành

- `pnpm typecheck`, `pnpm test`, `pnpm build` đều pass.
- Không có URL asset tham chiếu bị thiếu; route và reduced-motion behavior giữ
  nguyên.
- Báo cáo có số trước/sau: tổng `dist`, largest payloads, Lighthouse mobile
  và danh sách asset đã thay đổi.
