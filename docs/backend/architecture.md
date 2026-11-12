# Kiến trúc backend

## Tổng quan

```text
Trình duyệt
  ├─ Website React (Vite)  ──POST /api/v1/customers──┐
  └─ Trang quản trị /jathong ─/api/v1/auth, /admin──┤ (cùng origin)
                                                     ▼
            Vite dev proxy (local) / Nginx reverse proxy (VPS)
                                                     ▼
                     Express 5 + TypeScript (127.0.0.1:3001)
                       helmet → rate limit → JSON 10kb → kiểm tra Origin
                       ├─ /health, /customers         (công khai, không session)
                       └─ /auth, /admin  → express-session (store MySQL)
                                                     ▼
                     MySQL 8.4 (127.0.0.1:3306) — inner_architect_db
```

- Frontend gọi **đường dẫn tương đối** `/api/v1`, nên không cần CORS: local dùng Vite proxy (`vite.config.ts`), production dùng Nginx `location /api/`.
- Một tiến trình Node, không Redis, không microservice, không ORM: SQL thuần qua `mysql2/promise` với prepared statement (`pool.execute`).
- Trang quản trị là chunk lazy riêng (`src/admin/`) trong cùng ứng dụng React, dùng đường dẫn thật `/jathong…` (History API; hằng số `GOC_QUAN_TRI`) như phần còn lại của website.

## Cấu trúc thư mục

```text
server/
├── src/
│   ├── config/        env.ts (Zod kiểm tra biến môi trường), database.ts (pool UTC)
│   ├── middleware/    authenticate.ts (session, quyền, CSRF), error-handler.ts,
│   │                  rate-limiter.ts, request-context.ts (request ID, log, Origin), validate.ts
│   ├── modules/
│   │   ├── auth/      auth.routes.ts, auth.repository.ts, mat-khau.ts (Argon2id)
│   │   └── customers/ customers.routes.ts, customers.repository.ts, customers.schema.ts
│   ├── routes/        index.ts (router /api/v1)
│   ├── utils/         dich-vu.ts (mã dịch vụ/trạng thái/vai trò), loi-ung-dung.ts, migration.ts, duong-dan.ts
│   ├── app.ts         dựng Express app (dùng chung cho server và test)
│   └── server.ts      listen + tắt êm (SIGINT/SIGTERM)
├── database/migrations/001_initial.sql
├── scripts/           chay-migration.ts, tao-quan-tri-vien.ts
└── tests/             unit + tích hợp MySQL thật (database test riêng)

src/
├── lien-he/           BieuMauLienHe.tsx, kiem-tra-bieu-mau-lien-he.ts, gui-thong-tin-lien-he.ts, dich-vu-lien-he.ts
└── admin/             UngDungQuanTri.tsx, pages/, components/, hooks/, services/, types/
```

## Bảo mật đã triển khai

| Rủi ro | Kiểm soát |
| --- | --- |
| SQL injection | Chỉ prepared statement; `multipleStatements` tắt ở API; LIKE thoát `% _ \` |
| Dữ liệu sai/thừa | Zod `strictObject` cho mọi body; từ chối trường lạ; giới hạn body 10kb |
| Spam biểu mẫu | Rate limit 5 lần/15 phút/IP; honeypot `website`; giới hạn tổng 300 request/15 phút/IP |
| Brute-force đăng nhập | Rate limit 10 lần sai/15 phút theo IP + username; thông điệp lỗi chung; verify hash giả khi username không tồn tại |
| Lộ mật khẩu | Argon2id (19 MiB, t=2, p=1); không log, không trả hash; không có tài khoản mặc định |
| Chiếm phiên | Cookie `ia_sid` HttpOnly, SameSite=Strict, Path=/api, Secure khi production; regenerate session khi đăng nhập; hết hạn 8 giờ; destroy khi đăng xuất |
| CSRF | CSRF token theo phiên ở header `X-CSRF-Token` cho mọi request thay đổi dữ liệu có session; kiểm tra Origin cho mọi POST/PATCH; SameSite=Strict |
| Phân quyền | `yeuCauDangNhap` đọc lại tài khoản mỗi request (khóa tài khoản có hiệu lực ngay); `kiemTraQuyen("admin","customer_care")` ở backend |
| Lộ thông tin lỗi | Error handler tập trung: không trả stack/SQL/credential; DB lỗi → 503; log chỉ có request ID, method, path (không query/body) |
| Header | Helmet (CSP, HSTS…), tắt `x-powered-by`, `Cache-Control: no-store` cho API |
| Secret | Chỉ trong `server/.env` (gitignore); `.env.example` không có giá trị; không có secret trong `VITE_*` |
| Database | MySQL bind 127.0.0.1; user ứng dụng chỉ DML; user migration không có DROP; migration chặn DROP/TRUNCATE |

Rate limit dùng bộ nhớ tiến trình (không Redis theo phạm vi MVP): khởi động lại tiến trình sẽ reset bộ đếm; chạy nhiều tiến trình cần store dùng chung.

## Quyết định kỹ thuật

- **express-mysql-session** làm session store (không MemoryStore), bảng `sessions` tạo bằng migration, dùng chung pool.
- **CSRF tự triển khai** (synchronizer token) vì `csurf` đã ngừng phát triển.
- **Argon2id** (`argon2` có prebuilt binary cho Windows/Linux x64, không cần build).
- `server/` là package pnpm độc lập (lockfile riêng) để không đổi `pnpm-lock.yaml` của frontend và pipeline deploy hiện tại.
- Danh mục dịch vụ khai báo ở cả `server/src/utils/dich-vu.ts` và `src/lien-he/dich-vu-lien-he.ts`; test `server/tests/dong-bo-frontend.test.ts` bắt lệch.
