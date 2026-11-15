# Database MySQL

- Database: `inner_architect_db` (test: `inner_architect_test`), InnoDB, `utf8mb4_unicode_ci`.
- Thời gian lưu **UTC** (pool đặt `time_zone = '+00:00'`, server MySQL local cũng `default-time-zone=+00:00`); trang quản trị hiển thị theo `Asia/Ho_Chi_Minh`.
- Migration có version trong `server/database/migrations/NNN_ten.sql`, ghi vào bảng `schema_migrations` (version + SHA-256). File đã chạy mà bị sửa → runner báo lỗi; thay đổi schema phải tạo file mới.
- Runner chặn `DROP DATABASE/SCHEMA/TABLE` và `TRUNCATE`. Không có seed dữ liệu khách hàng.

## Bảng

### `customers`

| Cột | Kiểu | Ghi chú |
| --- | --- | --- |
| `id` | BIGINT UNSIGNED PK AI | |
| `full_name` | VARCHAR(150) | Giữ nguyên như khách nhập (chỉ trim) |
| `phone` | VARCHAR(30) | Đã bỏ khoảng trắng/dấu chấm/gạch; không UNIQUE |
| `email` | VARCHAR(255) NULL | Không UNIQUE |
| `service` | VARCHAR(100) | `tea`, `tarot`, `healing`, `workshop`, `academy`, `products`, `other` |
| `source` | VARCHAR(30) | Mặc định `website` |
| `status` | ENUM(`new`,`contacted`,`completed`) | Chỉ đổi khi nhân viên bấm Lưu |
| `consent_at` | DATETIME | `UTC_TIMESTAMP()` lúc server nhận đồng ý |
| `created_at`, `updated_at` | DATETIME | Tự động |

Index: `status`, `service`, `phone`, `created_at`.

### `admins`

`id`, `username` (UNIQUE), `password_hash` (Argon2id PHC), `display_name`, `role` (`admin` | `customer_care`), `is_active`, `credential_version` (tăng mỗi lần đổi mật khẩu; phiên lưu version lúc đăng nhập, lệch là bị thu hồi — migration 002), `created_at`, `updated_at`. Chỉ tạo bằng `pnpm admin:create`.

### `admin_settings` (migration 002)

`setting_key` PK, `value_hash` (Argon2id), `version`, `updated_by`, `updated_at`. Hiện có một khóa `unlock_pin` — PIN mở khóa `/jathong`. Chưa có dòng này thì backend dùng `ADMIN_UNLOCK_PIN` làm PIN khởi tạo; có rồi thì bản ghi MySQL là nguồn chính. Xóa dòng này = quay về PIN trong `.env` (hoặc tắt PIN nếu biến trống).

### Journal (migration 003)

- `admins.can_manage_journal` — quyền Journal do admin cấp cho nhân viên (admin luôn có quyền).
- `journal_categories` — chuyên mục: `slug` (cố định, anchor `#jr-muc-<slug>`), `name`, `english_name`, `label` (nhãn ngắn), `description`, `image`, `is_public`, `sort_order`, `version`.
- `journal_articles` — mỗi bài giữ **bản làm việc** (`title`, `summary`, `cover_image`, `cover_alt`, `content` JSON, `category_id`) và **bản công khai** (`published_data` JSON + `published_category_id`; `NULL` = chưa xuất bản). `slug` UNIQUE và không đổi. `sort_order` là thứ tự trong chuyên mục. `has_draft_changes` = bài đã đăng có nháp chưa cập nhật. `version` tăng ở mọi lần ghi (chống ghi đè). `published_at` = lần xuất bản đầu (ngày hiển thị).
- `journal_media` — ảnh tải lên: `file_name` (UUID + đuôi, file nằm trong `JOURNAL_UPLOAD_DIR`), `mime_type`, `byte_size`, `width`, `height`, `original_name` (chỉ hiển thị), `uploaded_by`.

Dữ liệu ban đầu (6 chuyên mục, 28 bài của website cũ) nằm ở `server/database/seed/journal-ban-dau.json`, nhập bằng `pnpm journal:import` (`--dry-run` để chạy thử). Script chỉ **thêm** bản ghi chưa có theo slug, không bao giờ ghi đè chỉnh sửa trong trang quản trị — chạy lại an toàn.

Ảnh Journal **không** nằm trong MySQL: backup phải gồm cả thư mục `JOURNAL_UPLOAD_DIR` (xem mục Backup).

### `sessions`

Do `express-mysql-session` dùng: `session_id` VARCHAR(128) PK, `expires` INT UNSIGNED (Unix giây, có index), `data` MEDIUMTEXT. Phiên hết hạn được dọn mỗi 15 phút.

### `schema_migrations`

`version` PK, `checksum`, `applied_at` — do runner tạo.

## Tài khoản MySQL (tối thiểu quyền)

```sql
-- Ứng dụng: chỉ đọc/ghi dữ liệu
GRANT SELECT, INSERT, UPDATE, DELETE ON inner_architect_db.* TO 'inner_architect_app'@'localhost';
-- Migration: tạo/sửa bảng, không DROP
GRANT CREATE, ALTER, INDEX, REFERENCES, SELECT, INSERT, UPDATE, DELETE
  ON inner_architect_db.* TO 'inner_architect_migrator'@'localhost';
```

(Tạo cho cả host `localhost` và `127.0.0.1`; xem [local-development.md](local-development.md).)

## Backup và restore

Backup (chạy với tài khoản có quyền đọc toàn database; file chứa dữ liệu cá nhân — lưu ngoài repo, quyền truy cập hạn chế, không upload công khai):

```bash
mysqldump --defaults-extra-file=<file-cnf-ngoai-repo> \
  --single-transaction --routines --triggers --set-gtid-purged=OFF \
  inner_architect_db | gzip > inner_architect_db_$(date +%Y%m%d_%H%M).sql.gz
```

Restore vào **database mới** để kiểm tra trước, không ghi đè database đang chạy:

```bash
mysql --defaults-extra-file=<file-cnf> -e "CREATE DATABASE inner_architect_restore_check CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
gunzip -c inner_architect_db_YYYYMMDD_HHMM.sql.gz | mysql --defaults-extra-file=<file-cnf> inner_architect_restore_check
```

Kiểm tra số dòng `customers`/`admins` khớp rồi mới quyết định chuyển đổi. `*.sql.gz`, `*.dump`, `backups/` đã có trong `.gitignore`.

### Ảnh Journal

Ảnh tải lên nằm trong `JOURNAL_UPLOAD_DIR` (production đề xuất `/var/lib/inner-architect/uploads/journal`, ngoài thư mục bản phát hành). Backup cùng lúc với `mysqldump` để bảng `journal_media` khớp với file:

```bash
tar -czf journal_media_$(date +%Y%m%d_%H%M).tar.gz -C /var/lib/inner-architect/uploads journal
```

Restore: giải nén vào đúng thư mục, giữ owner là user dịch vụ, quyền file `0644`, thư mục `0755`.
