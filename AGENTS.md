# Quy tắc làm việc trong dự án INNER ARCHITECT

> Các quy tắc dưới đây áp dụng cho mọi người và AI coding agent. Đọc `README.md`, `docs/01-PRD.md` và `docs/11-CHANGELOG.md` trước khi thay đổi.

## 20 Git/GitHub & AI Coding Rules bắt buộc

1. **Bảo toàn công việc hiện có.** Kiểm tra `git status` và diff trước khi sửa; không xóa, reset, stash hoặc ghi đè thay đổi của người khác nếu chưa được yêu cầu rõ ràng.
2. **Giữ đúng phạm vi.** Chỉ sửa file cần thiết; không refactor, đổi framework, đổi nội dung thương hiệu hoặc cấu trúc lớn ngoài yêu cầu.
3. **Không tự quyết dữ liệu kinh doanh.** Không bịa giá, lịch, thời lượng, địa chỉ, hồ sơ, đánh giá, số điện thoại hoặc URL liên hệ.
4. **Không tự mở rộng MVP.** Không thêm booking, payment, tài khoản, CRM, chatbot hoặc thu thập dữ liệu sức khỏe khi chưa có phê duyệt riêng.
5. **Đọc nguồn chuẩn trước khi làm.** Đối chiếu bộ tài liệu `docs/01-PRD.md` đến `docs/11-CHANGELOG.md`; nếu mâu thuẫn, báo rõ và ưu tiên quyết định mới nhất đã duyệt.
6. **Không ép stack.** Dùng stack đang có. TypeScript + Next.js + Payload + PostgreSQL chỉ là kiến trúc mục tiêu khi được chốt; không tự chuyển framework.
7. **Nhánh ngắn, một mục đích.** Khi được phép tạo nhánh, dùng `feature/`, `fix/`, `docs/` hoặc `chore/` kèm mã task/tên ngắn.
8. **Không push thẳng `main`.** Không force-push, xóa nhánh dùng chung, rewrite lịch sử hoặc bypass bảo vệ nhánh. Không commit/push/merge nếu nhiệm vụ không cấp quyền.
9. **Commit có chủ đích.** Khi được phép commit, dùng `type(scope): mô tả`; mỗi commit nhỏ, review được và không chứa file ngoài phạm vi.
10. **Rà soát trước khi stage.** Kiểm tra diff, file mới, secret, dữ liệu cá nhân, asset chưa có quyền, file build và log trước mọi commit/push.
11. **Secret chỉ ở biến môi trường.** Không ghi token, mật khẩu, private key hoặc dữ liệu nhạy cảm vào mã, tài liệu, log, ảnh hay Git; `.env.example` chỉ chứa giá trị giả an toàn.
12. **Kiểm tra theo stack thực tế.** Chỉ chạy script thật sự tồn tại; không tuyên bố đạt cho kiểm tra chưa cấu hình hoặc chưa chạy.
13. **Test theo rủi ro.** Thay đổi hành vi phải có test phù hợp; bug fix cần regression test; đổi UI phải kiểm tra desktop/mobile, bàn phím và CTA liên quan.
14. **JSDoc/TSDoc bắt buộc.** Mọi hàm mới hoặc hàm được sửa đáng kể phải có JSDoc/TSDoc mô tả mục đích, tham số, giá trị trả về, tác dụng phụ và lỗi có thể phát sinh.
15. **Tên rõ nghĩa.** Tuân thủ `docs/03-engineering/naming-conventions.md`; giữ nguyên API/framework chuẩn; hàm dự án dùng tiếng Việt không dấu, camelCase theo quy ước đã chốt.
16. **Code review là cổng bắt buộc.** Mọi thay đổi phải được review trước merge. Nếu chỉ có một developer, ghi rõ chưa có review kỹ thuật độc lập; PM/UAT không thay thế code review.
17. **PR phải đủ bằng chứng.** PR nêu vấn đề, phạm vi, thay đổi, cách kiểm tra, kết quả, ảnh desktop/mobile nếu đổi UI, rủi ro, migration và rollback.
18. **Xử lý review có kiểm chứng.** Xác minh từng nhận xét, sửa nguyên nhân gốc, chạy lại kiểm tra bị ảnh hưởng và giải quyết hội thoại trước merge.
19. **Merge/deploy cần phê duyệt.** Không tự merge, tạo release, deploy, đổi DNS, schema hoặc dữ liệu thật. Production cần đúng artifact đã duyệt, smoke test và rollback.
20. **Báo cáo trung thực.** Kết thúc bằng file đã đổi, kiểm tra/kết quả, phần chưa xác minh và rủi ro còn chờ. Không nói “hoàn tất/đạt” nếu thiếu bằng chứng mới.

## Phạm vi và quyền thay đổi

- Đọc README.md, PRD và decision-log trước khi thực hiện công việc.
- Người dùng hiện đóng vai trò PM. Không tự thay đổi nội dung, bố cục hoặc mã trong Figma; chỉ thực hiện khi được yêu cầu rõ ràng.
- Phân biệt yêu cầu đã chốt với đề xuất. Không tự biến đề xuất sitemap, công nghệ hoặc nội dung thành quyết định đã duyệt.
- Không bịa giá, thời lượng, lịch, hồ sơ chuyên môn, đánh giá khách hàng, địa chỉ, số điện thoại hay liên kết liên hệ.
- Không tự thêm booking nhiều bước, thanh toán, tài khoản hoặc thu thập thông tin sức khỏe vào MVP.

## Mã nguồn và kiểm tra

- Theo docs/03-engineering/naming-conventions.md và cấu trúc tương ứng sau khi công nghệ được chốt.
- Hàm do dự án tự định nghĩa đặt bằng tiếng Việt không dấu, camelCase, ví dụ layDichVuTheoMa, dinhDangGia, xuLyNhanLienHe. Giữ nguyên tên API/thư viện và tiền tố use bắt buộc của React hook; không tự dịch tên chuẩn bên ngoài.
- Không ghi secret vào mã nguồn, tài liệu, log hoặc commit. Chỉ dùng biến môi trường; .env.example chỉ chứa tên biến và giá trị mẫu không nhạy cảm.
- Chạy các kiểm tra thực sự đã cấu hình trong dự án. Không báo kiểm tra đạt nếu chưa chạy.
- Với thay đổi giao diện, kiểm tra desktop/mobile, điều hướng và CTA liên quan; ưu tiên kiểm tra gắn với rủi ro thực tế.
- Bảo toàn dữ liệu và thay đổi đang có của người dùng; không reset hoặc xóa ngoài phạm vi.

## Ứng dụng website (React + Vite tại repository root)

Phần này được gộp từ `inner-architect-figma-make/AGENTS.md` (scaffold Figma Make) khi ứng dụng được đưa lên root. Repository root vừa là Git root vừa là application root.

- Chạy tại root: `pnpm dev` (cổng mặc định 8443 theo `vite.config.ts`, đổi bằng `--port`), `pnpm typecheck`, `pnpm test`, `pnpm build` (xuất ra `dist/`). Khi chạy trong Figma Make, dev server đã chạy sẵn trên `$PORT`, không cần tự khởi động.
- `src/main.tsx` — entrypoint React; import `src/index.css` và mount `src/App.tsx` vào `#root`.
- `src/App.tsx` — component chính, điểm bắt đầu thường gặp cho việc sửa UI.
- `src/index.css` — CSS toàn cục và `@import 'tailwindcss';` của Tailwind CSS v4.
- `index.html` — HTML shell của Vite, chứa `#root` và nạp `src/main.tsx`.
- `vite.config.ts` — React, Tailwind v4, các plugin Figma Make và alias `@` trỏ tới `src`; đọc `.figma/make/site.json` (favicon, robots).
- `public/` — tài nguyên tĩnh duy nhất được đưa vào `dist/`; danh mục ở `public/assets/README.md`. Các thư mục nguồn ở root như `information/`, `video/`, `journal/`, `fav-icon/` không được phục vụ trực tiếp.
- `.mise.toml` — phiên bản Node.js và pnpm; `tests/` — test `node --test`; `scripts/deploy/`, `deploy/` — script và mẫu cấu hình deploy (xem `docs/CI-CD.md`).
- Phụ thuộc: React 19, React DOM 19, Tailwind CSS v4 qua `@tailwindcss/vite`, Vite 8, TypeScript 5.7, `@vitejs/plugin-react`, định dạng bằng oxfmt.

### Styling

- Dùng utility class của Tailwind trực tiếp trong JSX; CSS toàn cục và tùy biến theme Tailwind v4 đặt trong `src/index.css`. Không cần file cấu hình Tailwind hay PostCSS.
- Giữ các câu lệnh CSS `@import` ở đầu `src/index.css`, sau đó mới tới `@font-face` và font mặc định.
- Tailwind sinh utility trong `@layer utilities`; CSS nằm ngoài cascade layer sẽ thắng mọi layer bất kể specificity. Đặt style phần tử toàn cục (reset, mặc định cho `body`, heading, `button`, `input`) trong `@layer base { ... }`. Preflight đã có `box-sizing: border-box`, bỏ margin mặc định và `font: inherit` cho form control, không lặp lại.

## GitHub và deploy

- Tuân thủ docs/03-engineering/github-rules.md và docs/04-delivery/deployment.md.
- Có thể chuẩn bị thay đổi và bản mô tả PR trong phạm vi nhiệm vụ. Chỉ push hoặc tạo PR khi người dùng đã giao việc bao gồm hành động đó; không suy ra quyền publish từ việc sửa file.
- Không force-push nhánh dùng chung, không push thẳng main, không commit secret.
- Merge main và deploy production cần PM/chủ dự án duyệt bản thay đổi cụ thể; không tự tạo repository công khai hoặc đổi quyền truy cập.
- Báo cáo ngắn: đã thay đổi gì, đã kiểm tra gì, điều gì còn chưa xác minh.
