# INNER ARCHITECT — quy tắc làm việc

## An toàn và phạm vi

- Trước khi sửa, kiểm tra `git status` và diff liên quan. Không reset, stash, xóa hoặc ghi đè thay đổi hiện có nếu chưa được yêu cầu rõ ràng.
- Chỉ sửa file cần cho nhiệm vụ; không tự đổi framework, kiến trúc, thương hiệu hoặc mở rộng MVP.
- Không bịa dữ liệu kinh doanh: giá, lịch, thời lượng, hồ sơ, đánh giá, địa chỉ, số điện thoại hoặc URL liên hệ.
- Không tự thêm booking nhiều bước, thanh toán, tài khoản, CRM, chatbot hoặc dữ liệu sức khỏe.
- Không ghi secret hay dữ liệu nhạy cảm vào mã, tài liệu, log hoặc Git. `.env.example` chỉ dùng giá trị giả an toàn.
- Không commit, push, tạo PR, merge, release, deploy, đổi DNS/schema/dữ liệu thật nếu yêu cầu chưa cấp quyền cho hành động đó. Không push thẳng `main` hoặc rewrite lịch sử.

## Đọc tài liệu theo nhiệm vụ

Chỉ đọc tài liệu liên quan, không bắt buộc đọc toàn bộ repository:

- Phạm vi/sản phẩm/nội dung: `docs/01-PRD.md` và decision log hoặc changelog liên quan.
- Quy ước tên: `docs/03-engineering/naming-conventions.md`.
- GitHub/PR: `docs/03-engineering/github-rules.md`.
- Deploy: `docs/04-delivery/deployment.md` và `docs/CI-CD.md`.
- Tài nguyên tĩnh: `public/assets/README.md`.

Nếu tài liệu mâu thuẫn, nêu rõ và ưu tiên quyết định mới nhất đã được duyệt.

## Ứng dụng và lệnh

Repository root là ứng dụng React 19 + Vite 8 + TypeScript + Tailwind CSS v4.

- Dev: `pnpm dev` (mặc định cổng 8443; trong Figma Make dùng `$PORT` đang chạy).
- Kiểm tra: `pnpm typecheck`, `pnpm test`, `pnpm build`.
- Entry: `src/main.tsx`; UI chính: `src/App.tsx`; CSS toàn cục: `src/index.css`; output: `dist/`.
- Chỉ `public/` được phục vụ trực tiếp. Không tham chiếu trực tiếp các thư mục asset nguồn ở root.
- Chỉ chạy script thực sự tồn tại trong dự án và không báo đạt nếu chưa chạy.

## Quy ước mã

- Theo cấu trúc và stack hiện có; không tự ép kiến trúc mục tiêu chưa được duyệt.
- Hàm dự án dùng tiếng Việt không dấu, `camelCase`, ví dụ `layDichVuTheoMa`. Giữ nguyên API/thư viện và tiền tố React hook chuẩn.
- Hàm mới hoặc sửa đáng kể cần JSDoc/TSDoc ngắn gọn về mục đích, tham số, kết quả và tác dụng phụ/lỗi đáng chú ý.
- Dùng utility Tailwind trực tiếp trong JSX. Đặt `@import` đầu `src/index.css`; style phần tử toàn cục đặt trong `@layer base`.
- Test theo rủi ro: bug fix có regression test; đổi UI kiểm tra desktop/mobile, bàn phím, điều hướng và CTA liên quan.

## Báo cáo kết quả

Kết thúc ngắn gọn với: file đã đổi, kiểm tra đã chạy và kết quả, phần chưa xác minh, rủi ro còn lại. Không tuyên bố hoàn tất nếu thiếu bằng chứng mới.
