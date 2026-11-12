# Backend tiếp nhận khách hàng — INNER ARCHITECT™

Backend Node.js + Express + TypeScript + MySQL cho hai việc:

1. **Website khách hàng:** biểu mẫu trên trang Liên hệ (`/lien-he`) nhận 4 trường — họ tên, số điện thoại, dịch vụ quan tâm, email (không bắt buộc) — kèm đồng ý chính sách bảo mật, lưu vào MySQL.
2. **Trang quản trị nội bộ** (`/jathong`, cấu hình tại `src/admin/duong-dan-quan-tri.ts`): nhân viên Customer Care đăng nhập, xem/tìm/lọc khách hàng, cập nhật trạng thái chăm sóc, xem thống kê.

Hệ thống **không** tư vấn tự động, đặt lịch, thanh toán, tạo tài khoản khách hay đồng bộ Facebook/Instagram. Facebook, Instagram và Email vẫn là kênh độc lập. Quyết định phạm vi: [decision-log D10](../01-product/decision-log.md).

| Tài liệu | Nội dung |
| --- | --- |
| [local-development.md](local-development.md) | Cài MySQL local, tạo database/user, chạy frontend + backend, tạo admin |
| [architecture.md](architecture.md) | Kiến trúc, luồng request, bảo mật |
| [database.md](database.md) | Schema, migration, backup/restore |
| [api.md](api.md) | Hợp đồng API `/api/v1` |
| [deployment.md](deployment.md) | Chuẩn bị deploy VPS (chưa thực hiện) |

## Lệnh nhanh (tại repository root)

| Lệnh | Tác dụng |
| --- | --- |
| `pnpm --dir server install --frozen-lockfile` | Cài phụ thuộc backend (lockfile riêng `server/pnpm-lock.yaml`) |
| `pnpm dev:all` | Chạy backend (3001) + frontend (8443) cùng lúc |
| `pnpm dev:backend` / `pnpm dev:frontend` | Chạy riêng từng phần |
| `pnpm db:migrate` | Áp dụng migration vào `DB_NAME` (`-- --test` cho database test) |
| `pnpm admin:create` | Tạo tài khoản nhân viên (hỏi mật khẩu ẩn) |
| `pnpm typecheck:all` / `pnpm test:all` / `pnpm build:all` | Kiểm tra cả frontend và backend |

`pnpm typecheck`, `pnpm test`, `pnpm build` ở root giữ nguyên phạm vi frontend vì pipeline `ci-cd.yml` đang dùng chúng.
