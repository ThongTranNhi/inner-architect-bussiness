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

## Cập nhật: mục Bảo mật tài khoản (migration 002)

Áp dụng cho bản có `/account/pin`, `/account/password` và PIN mở khóa:

1. **Backup** database trước (`mysqldump`, xem [database.md](database.md)).
2. Build và chép mã nguồn backend mới như bước 3, gồm `server/database/migrations/002_admin_account_security.sql`.
3. **Chạy migration trước khi khởi động lại backend:** `node dist/scripts/chay-migration.js` (tài khoản migrator cần quyền `CREATE`, `ALTER`). Code mới đọc cột `admins.credential_version` nên backend mới sẽ lỗi đăng nhập nếu chưa chạy migration.
4. Nếu muốn bật PIN: thêm `ADMIN_UNLOCK_PIN=<6–8 chữ số>` vào `/etc/inner-architect/api.env` (quyền 600) làm PIN khởi tạo, rồi đổi ngay ở `/jathong/bao-mat` để PIN được lưu dạng Argon2id trong MySQL. Sau đó có thể xóa biến này khỏi file env (MySQL vẫn là nguồn chính).
5. `sudo systemctl restart inner-architect-api`. Phiên đăng nhập hiện có vẫn hợp lệ (coi như version 1).
6. Smoke test: `/jathong` hỏi PIN (nếu đã bật) → đăng nhập → mục **Bảo mật tài khoản** hiển thị; `journalctl -u inner-architect-api` chỉ có dòng `"loai":"security"` không chứa bí mật.

Rate limit PIN/xác minh lưu trong bộ nhớ tiến trình: khởi động lại backend sẽ reset bộ đếm.

## Cập nhật: Quản lý Journal (migration 003)

Bản này chuyển 6 chuyên mục / 28 bài Journal từ mã nguồn frontend vào MySQL và thêm mục **Journal** trong `/jathong`. Frontend mới **đọc Journal từ API**: nếu frontend lên trước backend + dữ liệu, trang `/journal`, trang bài và khối Journal trang chủ sẽ trống. Thứ tự bắt buộc: **backup → migration → nhập dữ liệu → backend mới → frontend mới**.

1. **Backup MySQL và ảnh** (trước mọi thay đổi):

   ```bash
   mysqldump --defaults-extra-file=<file-cnf> --single-transaction --routines --triggers --set-gtid-purged=OFF      inner_architect_db | gzip > /var/backups/inner-architect/db_$(date +%Y%m%d_%H%M).sql.gz
   # Lần đầu chưa có thư mục ảnh thì bỏ qua lệnh này
   tar -czf /var/backups/inner-architect/journal_media_$(date +%Y%m%d_%H%M).tar.gz -C /var/lib/inner-architect/uploads journal
   ```

   Đưa cả hai vào job backup hằng ngày (xem [database.md](database.md)).

2. **Thư mục ảnh bền vững** (ngoài `/var/www/inner-architect-api/current` để không mất khi đổi bản phát hành):

   ```bash
   sudo mkdir -p /var/lib/inner-architect/uploads/journal
   sudo chown -R innerarchitect-api:innerarchitect-api /var/lib/inner-architect/uploads
   sudo chmod 755 /var/lib/inner-architect /var/lib/inner-architect/uploads /var/lib/inner-architect/uploads/journal
   ```

   File ảnh được tạo với quyền `0644` để Nginx (user khác) đọc được. Nếu systemd dùng `ProtectSystem=strict`, thêm `ReadWritePaths=/var/lib/inner-architect/uploads` vào unit.

3. **Biến môi trường** trong `/etc/inner-architect/api.env`:

   ```
   JOURNAL_UPLOAD_DIR=/var/lib/inner-architect/uploads/journal
   JOURNAL_MAX_UPLOAD_MB=5
   SITE_URL=https://innerarchitect.vn
   ```

4. Build và chép backend mới như bước 3 (gồm `server/database/migrations/003_journal.sql` và `server/database/seed/journal-ban-dau.json`).

5. **Migration trước khi bật backend mới:** `node dist/scripts/chay-migration.js` (migrator cần `CREATE`, `ALTER`, `REFERENCES`). Code mới đọc cột `admins.can_manage_journal`; chạy backend mới khi chưa migration sẽ lỗi đăng nhập.

6. **Nhập dữ liệu Journal cũ:** chạy thử rồi chạy thật (dùng tài khoản ứng dụng, chỉ cần `INSERT`):

   ```bash
   node dist/scripts/nhap-journal.js --dry-run   # mong đợi: chuyên mục thêm 6, bài thêm 28
   node dist/scripts/nhap-journal.js
   ```

   Chạy lại an toàn (chỉ thêm bản ghi thiếu, không ghi đè). Kiểm tra: `curl -s https://<host>/api/v1/journal | jq '.data.articles|length'` → `28` (sau khi bật backend).

7. `sudo systemctl restart inner-architect-api`.

8. **Nginx** — thêm vào server block HTTPS (đặt **trước** `location /api/` để giới hạn tải ảnh riêng; `location /api/` vẫn giữ 16k):

   ```nginx
   # Tải ảnh Journal: phải >= JOURNAL_MAX_UPLOAD_MB (thêm dư cho header)
   location = /api/v1/admin/journal/media {
       proxy_pass http://127.0.0.1:3001;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       client_max_body_size 6m;
   }
   # Lưu nháp bài (nội dung JSON tới 1 MB)
   location ^~ /api/v1/admin/journal/ {
       proxy_pass http://127.0.0.1:3001;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       client_max_body_size 1100k;
   }
   # Ảnh Journal: Nginx phục vụ trực tiếp, tên file ngẫu nhiên nên cache dài hạn
   location ^~ /media/journal/ {
       alias /var/lib/inner-architect/uploads/journal/;
       try_files $uri =404;
       add_header Cache-Control "public, max-age=31536000, immutable";
       add_header X-Content-Type-Options nosniff;
       types { image/jpeg jpg; image/png png; image/webp webp; }
       default_type application/octet-stream;
   }
   location = /sitemap.xml {
       proxy_pass http://127.0.0.1:3001;
       proxy_set_header Host $host;
   }
   ```

   `sudo nginx -t && sudo systemctl reload nginx`. Nếu có `robots.txt`, có thể thêm dòng `Sitemap: https://innerarchitect.vn/sitemap.xml`.

9. **Cấp quyền:** đăng nhập `admin` → `/jathong/journal` → tab **Phân quyền** → tích *Được quản lý Journal* cho nhân viên phụ trách.

10. **Triển khai frontend mới**, rồi kiểm tra:
    - `/journal`: đủ 6 chuyên mục, 28 bài, đúng thứ tự; khung đọc nhanh mở được.
    - Mở thẳng một URL cũ, ví dụ `/journal/ban-la-ai-khi-khong-con-phai-lam-hai-long-tat-ca` → hiện đúng nội dung (không 404).
    - Trang chủ: khối Journal hiện 3 bài.
    - `/sitemap.xml` có các URL `/journal/<slug>`, không có bài nháp.
    - Trong `/jathong/journal`: tạo bài nháp thử có ảnh → ảnh hiện (`/media/journal/…` trả `200`, `Content-Type: image/…`) → **không** xuất bản, hoặc xuất bản rồi gỡ; ảnh 6 MB bị từ chối với thông báo rõ.
    - `journalctl -u inner-architect-api` không có lỗi; log `"loai":"security"` chỉ chứa ID.

**Hoàn tác:** frontend cũ vẫn chạy được với backend mới (không đọc API Journal). Bảng mới không ảnh hưởng chức năng liên hệ / Customer Care. Nếu cần quay lại hẳn: khôi phục frontend cũ trước, sau đó mới tính đến khôi phục database từ backup.

## Việc cần PM quyết định trước deploy

- Chính sách bảo mật bản chính thức (thời gian lưu trữ, quyền yêu cầu xóa dữ liệu) — bản hiện tại vẫn là nháp.
- Ai giữ tài khoản `admin`; danh sách nhân viên Customer Care.
- Thời gian lưu backup và nơi lưu.
- Có thêm job CI chạy test backend (cần MySQL service trong GitHub Actions) — chưa thêm vì không được đổi workflow production.
