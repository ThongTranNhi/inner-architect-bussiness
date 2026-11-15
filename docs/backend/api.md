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

## Journal

### Công khai (không cần đăng nhập, không tạo session)

Chỉ trả bài **đã xuất bản** nằm trong chuyên mục **đang công khai**. Bản nháp và bản nháp chỉnh sửa của bài đã đăng không bao giờ xuất hiện ở đây.

| Method | Đường dẫn | Mô tả |
| --- | --- | --- |
| GET | `/journal` | `{"data":{"categories":[…],"articles":[…]}}`. Chuyên mục: `id, slug, name, englishName, label, description, image, imageWidth, imageHeight`. Bài (không kèm nội dung): `slug, categoryId, title, dek, summary, image, imageAlt, imageWidth, imageHeight, date, featured`. Đã sắp theo thứ tự chuyên mục rồi thứ tự bài trong chuyên mục |
| GET | `/journal/articles/:slug` | Bài + `content` (cây JSON đã kiểm duyệt). `404` nếu không tồn tại, chưa xuất bản hoặc chuyên mục đang ẩn |
| GET | `/sitemap.xml` (ngoài `/api/v1`) | Trang tĩnh công khai + bài đã xuất bản, `loc` dựa trên `SITE_URL` |
| GET | `/media/journal/<uuid>.<jpg\|png\|webp>` (ngoài `/api/v1`) | Ảnh đã tải lên; production nên để Nginx phục vụ trực tiếp |

### Quản trị — `/admin/journal/*`

Mọi route cần phiên đăng nhập **và quyền Journal**: vai trò `admin` luôn có; nhân viên khác cần admin cấp (`admins.can_manage_journal`). Thiếu quyền → `403`. Mọi request ghi cần `X-CSRF-Token`. Giới hạn tần suất riêng 1000 request/15 phút/IP (không tính vào giới hạn chung). Body JSON tối đa 1 MB.

Các thao tác ghi trên bài/chuyên mục gửi kèm `version` đang xem; lệch phiên bản (có người vừa lưu) → `409 CONFLICT` với thông điệp nêu người/lúc cập nhật, không ghi đè.

| Method | Đường dẫn | Mô tả |
| --- | --- | --- |
| GET | `/admin/journal/categories` | Mọi chuyên mục (kể cả đang ẩn) + `articleCount`, `publishedCount`, `version` |
| POST | `/admin/journal/categories` | `{"name","englishName?","label?","description","image?","isPublic"}`. Slug sinh từ tên, cố định. Đặt cuối danh sách |
| PUT | `/admin/journal/categories/:id` | Như trên + `version` |
| PUT | `/admin/journal/category-order` | `{"ids":[…]}` — phải đủ đúng tập chuyên mục, sai → `409` |
| GET | `/admin/journal/articles?categoryId=&status=draft\|published\|changed` | Danh sách bài (không kèm nội dung) |
| GET | `/admin/journal/articles/:id` | Bản làm việc đầy đủ |
| POST | `/admin/journal/articles` | `{"title","summary","categoryId","coverImage","coverAlt","content","slug?"}` → bản nháp mới (`201`). Slug sinh từ tiêu đề nếu không gửi, **không đổi về sau** |
| PUT | `/admin/journal/articles/:id` | Lưu nháp (+`version`). Bài đã xuất bản: bản công khai giữ nguyên, `hasDraftChanges = true` |
| POST | `/admin/journal/articles/:id/publish` | `{"version"}` — xuất bản / cập nhật bản công khai từ bản làm việc. Ngày hiển thị là lần xuất bản đầu |
| POST | `/admin/journal/articles/:id/unpublish` | `{"version"}` — gỡ khỏi trang công khai, giữ bản làm việc |
| POST | `/admin/journal/articles/:id/discard` | `{"version"}` — bỏ bản nháp chỉnh sửa, quay về bản công khai |
| PATCH | `/admin/journal/articles/:id/category` | `{"categoryId","version"}` — chuyển mục ngay (cả bản công khai), URL giữ nguyên |
| PATCH | `/admin/journal/articles/:id/featured` | `{"featured","version"}` |
| PUT | `/admin/journal/categories/:id/article-order` | `{"ids":[…]}` — thứ tự bài trong một chuyên mục; sai tập → `409` |
| GET | `/admin/journal/media?page=1` | Thư viện ảnh (40/trang, mới nhất trước) |
| POST | `/admin/journal/media` | Body **nhị phân** của ảnh, `Content-Type: image/jpeg\|image/png\|image/webp`, header tùy chọn `X-File-Name` (URL-encoded, chỉ để hiển thị). Kiểm tra định dạng thật bằng chữ ký byte, kích thước điểm ảnh, dung lượng ≤ `JOURNAL_MAX_UPLOAD_MB` (`413` khi vượt). JPEG được gỡ EXIF/GPS (giữ hướng xoay). Tên file lưu là UUID ngẫu nhiên |
| DELETE | `/admin/journal/articles/:id` | `{"version"}` — xóa vĩnh viễn bài **chưa xuất bản**; bài đang công khai → `409` (phải gỡ xuất bản trước) |
| DELETE | `/admin/journal/categories/:id` | `{"version"}` — xóa vĩnh viễn chuyên mục **không còn bài** (kể cả nháp); còn bài → `409` |
| DELETE | `/admin/journal/media/:id` | Xóa ảnh khỏi thư viện và file trên đĩa; ảnh còn dùng ở ảnh bìa, nội dung bài (nháp hoặc công khai) hay ảnh chuyên mục → `409` kèm nơi đang dùng |
| GET | `/admin/journal/staff` | **Chỉ `admin`.** Nhân viên (không phải admin) + `canManageJournal` |
| PATCH | `/admin/journal/staff/:id` | **Chỉ `admin`.** `{"canManageJournal":true\|false}` — có hiệu lực ngay ở request kế tiếp của nhân viên |

`/auth/me` và `/auth/login` trả thêm `admin.canManageJournal`.

**Nội dung bài** (`content`) là cây JSON `{ "type":"doc", "content":[…] }`. Máy chủ chỉ nhận: `paragraph`, `heading` (level 2/3), `bulletList`, `orderedList` (`start`), `listItem`, `blockquote`, `image` (`src` phải là `/media/journal/<uuid>.<ext>` đã có trong thư viện hoặc `/assets/…`, `alt`, `caption`, `width`, `height`), `text`, `hardBreak`; mark `bold`, `italic`, `underline`, `link` (`href` chỉ `http(s)://`, `mailto:`, `tel:`, `/…`, `#…`). Node/mark khác (script, iframe, HTML thô…) → `400` với `fields.content`; thuộc tính lạ (`onclick`, `style`…) bị bỏ. Giới hạn: 8000 node, 200.000 ký tự, 60 ảnh, độ sâu 8.

Nhật ký bảo mật ghi `cap_quyen_journal`, `thu_hoi_quyen_journal`, `xuat_ban_journal`, `go_xuat_ban_journal`, `xoa_bai_journal`, `xoa_chuyen_muc_journal`, `xoa_anh_journal` kèm ID (không có nội dung bài).
