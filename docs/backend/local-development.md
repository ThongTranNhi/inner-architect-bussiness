# Chạy backend trên máy local (Windows)

Đã kiểm tra với: Node.js 22.14, pnpm 10.34.3 (theo `.mise.toml`), MySQL 8.4.10 LTS, Git 2.55.

## 1. MySQL

Không ghi đè MySQL đang có. Nếu máy chưa có MySQL, có hai cách:

- **MySQL Installer/winget** (Windows service, cần quyền admin), hoặc
- **Bản zip portable** (không cần admin, không tạo service) — cách đã dùng khi phát triển:

```bash
# Tải bản chính thức từ https://dev.mysql.com/downloads/mysql/ (Windows x64 ZIP), giải nén ra thư mục ngoài repo.
# my.ini tối thiểu:
[mysqld]
basedir=C:/Users/<ban>/mysql-portable/mysql-8.4.10
datadir=C:/Users/<ban>/mysql-portable/data
port=3306
bind-address=127.0.0.1
mysqlx=OFF
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
default-time-zone=+00:00

# Khởi tạo một lần, rồi chạy:
mysqld --defaults-file=<duong-dan>/my.ini --initialize-insecure
mysqld --defaults-file=<duong-dan>/my.ini
```

Đặt mật khẩu root ngay sau khi khởi tạo, rồi tạo database và tài khoản (thay `<...>` bằng mật khẩu ngẫu nhiên; không dùng lại mật khẩu thật ở nơi khác):

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '<mat-khau-root>';
CREATE DATABASE IF NOT EXISTS inner_architect_db   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS inner_architect_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'inner_architect_app'@'localhost' IDENTIFIED BY '<mat-khau-app>';
CREATE USER 'inner_architect_app'@'127.0.0.1' IDENTIFIED BY '<mat-khau-app>';
CREATE USER 'inner_architect_migrator'@'localhost' IDENTIFIED BY '<mat-khau-migrator>';
CREATE USER 'inner_architect_migrator'@'127.0.0.1' IDENTIFIED BY '<mat-khau-migrator>';
GRANT SELECT, INSERT, UPDATE, DELETE ON inner_architect_db.*   TO 'inner_architect_app'@'localhost', 'inner_architect_app'@'127.0.0.1';
GRANT SELECT, INSERT, UPDATE, DELETE ON inner_architect_test.* TO 'inner_architect_app'@'localhost', 'inner_architect_app'@'127.0.0.1';
GRANT CREATE, ALTER, INDEX, REFERENCES, SELECT, INSERT, UPDATE, DELETE ON inner_architect_db.*   TO 'inner_architect_migrator'@'localhost', 'inner_architect_migrator'@'127.0.0.1';
GRANT CREATE, ALTER, INDEX, REFERENCES, SELECT, INSERT, UPDATE, DELETE ON inner_architect_test.* TO 'inner_architect_migrator'@'localhost', 'inner_architect_migrator'@'127.0.0.1';
```

Truyền SQL có mật khẩu qua stdin hoặc file `--defaults-extra-file` để mật khẩu không nằm trong lịch sử shell.

## 2. Cấu hình backend

```bash
cp server/.env.example server/.env   # rồi điền DB_PASSWORD, DB_MIGRATE_PASSWORD, SESSION_SECRET
pnpm --dir server install --frozen-lockfile
pnpm db:migrate             # inner_architect_db
pnpm db:migrate -- --test   # inner_architect_test (cho test tích hợp)
```

`pnpm install` có thể báo "Ignored build scripts: argon2, esbuild" — không ảnh hưởng: `argon2` dùng binary dựng sẵn, `esbuild` đã có binary theo nền tảng.

## 3. Tạo tài khoản nhân viên

```bash
pnpm admin:create --username lan.cc --display-name "Lan" --role customer_care
# Hỏi mật khẩu (ẩn ký tự, nhập 2 lần, tối thiểu 12 ký tự). Vai trò: admin | customer_care.
```

Không có tài khoản mặc định. Chạy không tương tác: truyền mật khẩu qua stdin (dòng đầu tiên), ví dụ từ một trình quản lý mật khẩu — không đặt mật khẩu trong tham số dòng lệnh.

## 4. Chạy

```bash
pnpm dev:all          # [api] http://127.0.0.1:3001/api/v1  +  [web] http://localhost:8443
```

- Website: `http://localhost:8443/lien-he` (biểu mẫu ở cột giữa khối Liên hệ).
- Quản trị: `http://localhost:8443/jathong`.
- Vite proxy `/api` → `http://127.0.0.1:3001` (đổi bằng biến `API_PROXY_TARGET`).

Kiểm tra cổng trước khi chạy: 8443 (Vite, `strictPort`), 3001 (API), 3306 (MySQL).

## 5. Kiểm tra

```bash
pnpm typecheck:all
pnpm test:all      # test frontend + backend (backend cần MySQL và inner_architect_test)
pnpm build:all
```

Test tích hợp backend dùng `TEST_DB_NAME` và **xóa toàn bộ dữ liệu trong database test**; runner từ chối dọn nếu tên database không chứa `test`. Nếu không kết nối được MySQL, suite tích hợp được đánh dấu *skipped* (không báo đạt giả).

Lưu ý Node: test frontend import file `.ts` trực tiếp nên cần Node ≥ 22.18 (CI dùng Node 24). Với Node 22.6–22.17 chạy `NODE_OPTIONS=--experimental-strip-types pnpm test`.
