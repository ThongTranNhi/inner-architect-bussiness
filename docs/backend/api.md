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

### `POST /auth/login`

Body `{"username","password"}` (strict). Rate limit 10 lần sai/15 phút theo IP + username. Thành công: đặt cookie `ia_sid`, trả `{"data":{"admin":{id,username,displayName,role},"csrfToken"}}`. Sai → `401` với cùng một thông điệp cho mọi trường hợp.

## Cần đăng nhập (cookie `ia_sid`)

Request thay đổi dữ liệu phải gửi header `X-CSRF-Token: <csrfToken>`. Vai trò được phép: `admin`, `customer_care`.

| Method | Đường dẫn | Mô tả |
| --- | --- | --- |
| GET | `/auth/me` | Phiên hiện tại + `csrfToken` |
| POST | `/auth/logout` | Hủy phiên, xóa cookie (cần CSRF) |
| GET | `/admin/customers?q=&service=&status=&page=1&pageSize=20` | Danh sách mới nhất trước; `q` tìm trong tên/SĐT/email; `pageSize` ≤ 100 |
| GET | `/admin/customers/:id` | Chi tiết |
| PATCH | `/admin/customers/:id/status` | Body `{"status":"new"|"contacted"|"completed"}` (cần CSRF) |
| GET | `/admin/statistics` | `{"total","new","contacted","completed"}` |

Danh sách trả `{"data":[KhachHang], "pagination":{page,pageSize,total,totalPages}}`. `KhachHang`: `id, fullName, phone, email, service, source, status, consentAt, createdAt, updatedAt` (ISO 8601 UTC).
