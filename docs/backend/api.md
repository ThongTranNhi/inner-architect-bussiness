# API `/api/v1`

Mọi response là JSON. Lỗi có dạng:

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Dữ liệu không hợp lệ.", "fields": { "phone": "Số điện thoại không hợp lệ." } } }
```

| HTTP | `code` | Khi nào |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Dữ liệu sai, trường lạ, JSON hỏng |
| 401 | `UNAUTHENTICATED` | Chưa đăng nhập, phiên hết hạn, tài khoản bị khóa, sai thông tin đăng nhập |
| 403 | `FORBIDDEN` / `CSRF_INVALID` | Sai vai trò, Origin lạ, thiếu/sai CSRF token |
| 404 | `NOT_FOUND` | Không có tài nguyên |
| 413 | `PAYLOAD_TOO_LARGE` | Body > 10kb |
| 429 | `RATE_LIMITED` | Vượt giới hạn tần suất |
| 500 | `INTERNAL_ERROR` | Lỗi không xác định (không lộ chi tiết) |
| 503 | `SERVICE_UNAVAILABLE` | MySQL không khả dụng |

## Công khai

### `GET /health`

`200 {"success":true,"status":"ok","database":"ok"}` hoặc `503 {... "database":"unavailable"}`.

### `POST /customers`

Rate limit 5 lần/15 phút/IP. Không tạo session/cookie.

```json
{ "fullName": "Nguyễn Văn A", "phone": "0901234567", "email": "customer@example.com", "service": "tarot", "consent": true }
```

| Trường | Quy tắc |
| --- | --- |
| `fullName` | Bắt buộc, 2–150 ký tự sau trim; chữ cái (mọi ngôn ngữ), khoảng trắng, `.` `'` `-` |
| `phone` | Bắt buộc; bỏ khoảng trắng/`.`/`-`/`()` rồi khớp `0` + 9–10 số, hoặc `+` + mã quốc gia, tổng 8–15 số |
| `email` | Không bắt buộc (`""`/`null`/bỏ qua → `null`); nếu có phải đúng định dạng, ≤ 255 |
| `service` | Một trong `tea`, `tarot`, `healing`, `workshop`, `academy`, `products`, `other` |
| `consent` | Phải là `true` |
| `website` | Honeypot — chỉ được rỗng |

Thành công `201`: `{"success":true,"message":"Thông tin của bạn đã được tiếp nhận. Đội ngũ INNER ARCHITECT sẽ chủ động liên hệ."}` — chỉ trả sau khi MySQL ghi xong; không trả lại dữ liệu cá nhân.

### `POST /auth/unlock`

Body `{"pin":"012345"}` (6–8 chữ số, **chuỗi**). Bước 1 của luồng đăng nhập khi đã bật PIN. Đúng → phiên được mở khóa 5 phút, gắn version của PIN hiện hành. Sai → `403`. Chưa bật PIN → `404`.

### `POST /auth/login`

Khi đã bật PIN, phải `/auth/unlock` trước, nếu không trả `401 ADMIN_PIN_REQUIRED` (cũng trả khi PIN vừa bị đổi sau lúc mở khóa). Body `{"username","password"}` (strict). Thành công: đặt cookie `ia_sid`, trả `{"data":{"admin":{id,username,displayName,role},"csrfToken"}}`. Sai → `401` với cùng một thông điệp cho mọi trường hợp.

`/auth/unlock` và `/auth/login` dùng chung bộ đếm theo IP. Sau 5 lần nhập sai trong cửa sổ 15 phút, cả hai endpoint trả `429` kèm `Retry-After` đến khi hết cửa sổ. Đổi tên đăng nhập không làm mới bộ đếm. Bộ đếm nằm trong bộ nhớ của tiến trình Express.

## Cần đăng nhập (cookie `ia_sid`)

Request thay đổi dữ liệu phải gửi header `X-CSRF-Token: <csrfToken>`. Vai trò được phép: `admin`, `customer_care`.

| Method | Đường dẫn | Mô tả |
| --- | --- | --- |
| GET | `/auth/me` | Phiên hiện tại + `csrfToken` |
| POST | `/auth/logout` | Hủy phiên, xóa cookie (cần CSRF) |
| GET | `/admin/customers?q=&service=&status=&page=1&pageSize=20` | Danh sách mới nhất trước; `q` tìm trong tên/SĐT/email; `pageSize` ≤ 100 |
| GET | `/admin/customers/:id` | Chi tiết |
| PATCH | `/admin/customers/:id/status` | Body `{"status":"new"|"contacted"|"completed"}` (cần CSRF) |
| DELETE | `/admin/customers/:id` | **Chỉ `admin`.** Xóa vĩnh viễn (cần CSRF). `404` nếu không tồn tại. Ghi log `{"loai":"security","thaoTac":"xoa_khach_hang","maDoiTuong":<id>}` — chỉ ID, không có dữ liệu cá nhân |
| GET | `/admin/statistics` | `{"total","new","contacted","completed"}` |
| GET | `/account/security` | `{"pinEnabled","canChangePin"}` — không trả PIN hay bản băm |
| POST | `/account/pin` | **Chỉ `admin`.** Body `{"currentPin","password","newPin","confirmPin"}` (cần CSRF). `currentPin` bỏ trống chỉ khi chưa bật PIN. Sai PIN/mật khẩu → `403` (thông điệp chung); đổi đồng thời → `409 CONFLICT` |
| POST | `/account/password` | Đổi mật khẩu **của chính mình** (ID lấy từ phiên). Body `{"currentPassword","newPassword","confirmPassword"}` (cần CSRF, mật khẩu mới ≥ 12 ký tự). Thành công: thu hồi mọi phiên của tài khoản, kể cả phiên hiện tại |

`/account/pin` và `/account/password`: 5 lần xác minh sai/15 phút mỗi tài khoản → `429`. Mỗi lần đổi ghi một dòng log JSON `{"loai":"security","thaoTac","maQuanTriVien","ketQua","thoiDiem"}` — không có PIN, mật khẩu hay bản băm.

Danh sách trả `{"data":[KhachHang], "pagination":{page,pageSize,total,totalPages}}`. `KhachHang`: `id, fullName, phone, email, service, source, status, consentAt, createdAt, updatedAt` (ISO 8601 UTC).
