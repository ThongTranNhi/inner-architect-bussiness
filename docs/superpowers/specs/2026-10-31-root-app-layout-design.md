# Thiết kế: đưa ứng dụng Vite lên repository root

## Mục tiêu

Đưa toàn bộ mã nguồn chạy website từ `inner-architect-figma-make/` lên
`D:\inner-architect`, để root là đồng thời Git root và application root.

## Phạm vi

- Di chuyển bằng `git mv` các phần chạy ứng dụng: `package.json`, lockfile,
  cấu hình TypeScript/Vite, `src/`, `public/`, `tests/`, `.figma/`, `.mise.toml`
  và các tệp app-level liên quan.
- Giữ tài liệu, mockup và asset nguồn ở root; chỉ nội dung trong `public/` hoặc
  được import từ `src/` mới được đưa vào Vite `dist`.
- Sửa GitHub Actions, script deploy và tài liệu để build/deploy từ root.
- Giữ React 19, Vite 8, Tailwind 4 và pnpm; không đổi framework hay URL app.

## Ngoài phạm vi

- Không tự tích hợp các thư mục nguồn chưa được app dùng (`information/`,
  `video/`, v.v.) vào website.
- Không xóa asset chưa được xác minh, không commit/push/deploy.
- Không thay đổi VPS, domain, DNS hoặc GitHub secrets.

## Quyết định

- Các file trùng tên ở root và app (đặc biệt `AGENTS.md`, `CLAUDE.md`,
  `.gitignore`, `README.md`) phải được so sánh/gộp có chủ đích; root giữ vai
  trò canonical sau khi hoàn tất.
- `dist/` và `node_modules/` không được di chuyển/commit; cài lại và build lại
  từ root.
- `ci-cd.yml` phải xóa mọi `working-directory`, cache path và artifact path
  có tiền tố `inner-architect-figma-make/`.
- CI cũ phải tránh chạy bộ kiểm tra app trùng lặp với `CI and production deploy`.

## Thành công

- `pnpm dev`, `pnpm typecheck`, `pnpm test`, `pnpm build` chạy tại root.
- `dist/` tại root chứa app và toàn bộ asset đang được tham chiếu.
- Không còn thư mục `inner-architect-figma-make/` sau khi migration đã được
  kiểm thử và review.
- Pull request chỉ verify; push `main` vẫn deploy artifact từ root khi SSH
  network khả dụng.
