# Chuẩn bị deploy backend lên VPS

> **Trạng thái: chưa triển khai.** Tài liệu này là kế hoạch cho phase deploy riêng, cần PM/chủ dự án duyệt. Không SSH, không sửa Nginx/SSL/DNS hay GitHub Actions production khi chưa được giao.

## Rủi ro thứ tự phát hành

Pipeline `ci-cd.yml` deploy frontend mỗi khi có commit vào `main`. Nếu merge nhánh `feature/customer-care-backend` trước khi backend chạy trên VPS, biểu mẫu Liên hệ sẽ hiển thị lỗi "Không kết nối được tới máy chủ" (không mất dữ liệu nhưng khách không gửi được). **Chỉ merge khi backend production đã sẵn sàng**, hoặc PM chủ động chấp nhận rủi ro này.

## Các bước đề xuất (VPS Ubuntu 22.04 + Nginx hiện có)

1. **MySQL 8.0/8.4** trên VPS, `bind-address = 127.0.0.1`, firewall không mở 3306. Tạo database + 2 tài khoản như [database.md](database.md) với mật khẩu mới (không dùng lại mật khẩu local).
2. **Node.js 22 LTS** (≥ 22.12). Người dùng hệ thống riêng (ví dụ `innerarchitect-api`), không chạy bằng root.
3. **Mã nguồn backend:** build `pnpm --dir server install --frozen-lockfile && pnpm --dir server build`, chép `server/dist`, `server/package.json`, `server/pnpm-lock.yaml`, `server/database/` lên VPS, cài `--prod`.
4. **Cấu hình** `/etc/inner-architect/api.env` (quyền 600, owner là user dịch vụ):
   `NODE_ENV=production`, `HOST=127.0.0.1`, `PORT=3001`, `DB_*`, `SESSION_SECRET` mới, `ALLOWED_ORIGINS=https://innerarchitect.vn`, `TRUST_PROXY=true`.
5. **Migration:** `node dist/scripts/chay-migration.js` bằng tài khoản migrator. Backup trước mọi migration sau này.
6. **systemd** (`/etc/systemd/system/inner-architect-api.service`):

   ```ini
   [Service]
   User=innerarchitect-api
   WorkingDirectory=/var/www/inner-architect-api/current
   EnvironmentFile=/etc/inner-architect/api.env
   ExecStart=/usr/bin/node dist/src/server.js
   Restart=on-failure
   NoNewPrivileges=true
   ProtectSystem=strict
   PrivateTmp=true
   ```

7. **Nginx** — thêm vào server block HTTPS hiện có:

   ```nginx
   location /api/ {
       proxy_pass http://127.0.0.1:3001;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       client_max_body_size 16k;
   }
   ```

   Cookie session có `Secure` khi `NODE_ENV=production` nên bắt buộc HTTPS.
8. **Tài khoản nhân viên:** `node dist/scripts/tao-quan-tri-vien.js --username … --display-name … --role customer_care` trực tiếp trên VPS.
9. **Backup tự động** hằng ngày bằng `mysqldump` (xem [database.md](database.md)), lưu ngoài thư mục web, giữ theo chính sách PM quy định; thử restore định kỳ.
10. **Smoke test:** `curl https://innerarchitect.vn/api/v1/health`, gửi biểu mẫu thử bằng dữ liệu giả rồi xóa, đăng nhập/đăng xuất admin, kiểm tra `/jathong` không lộ dữ liệu khi chưa đăng nhập.

## Việc cần PM quyết định trước deploy

- Chính sách bảo mật bản chính thức (thời gian lưu trữ, quyền yêu cầu xóa dữ liệu) — bản hiện tại vẫn là nháp.
- Ai giữ tài khoản `admin`; danh sách nhân viên Customer Care.
- Thời gian lưu backup và nơi lưu.
- Có thêm job CI chạy test backend (cần MySQL service trong GitHub Actions) — chưa thêm vì không được đổi workflow production.
