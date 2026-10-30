# Phân tích hosting cho INNER ARCHITECT

**Ngày đối chiếu:** 29/10/2026  
**Cập nhật phạm vi:** 30/10/2026 — PM duyệt bổ sung form yêu cầu đặt lịch, lưu database và dẫn sang Zalo/Fanpage để nhân viên xác nhận.  
**Phạm vi:** Bản React/Vite hiện tại trong `inner-architect-figma-make` và backend nhận yêu cầu đặt lịch tối giản. Đây không phải hệ thống tự động xác nhận lịch trống.

## Kết luận ngắn

Chọn **Cloudflare Pages + Workers + D1 + Turnstile**. Với lưu lượng ban đầu, toàn bộ nền tảng có thể bắt đầu ở mức **0 đồng/tháng**, ngoài domain. Đây là phương án sát nhất với luồng đã duyệt: nhận yêu cầu, lưu database, sau đó mở Zalo/Fanpage để nhân viên phản hồi và xác nhận.

Không cần Cal.com vì khách không tự chiếm slot và hệ thống không cần đồng bộ lịch trống ở MVP. Khi dữ liệu đặt lịch trở thành dữ liệu kinh doanh quan trọng, nâng Workers lên gói Paid từ 5 USD/tháng để tăng giới hạn và thời gian phục hồi D1.

## Bằng chứng từ mã nguồn và bản build

- Stack thực tế: React 19 + Vite 8; không có framework server-side, cơ sở dữ liệu hoặc SDK backend.
- Điều hướng dùng URL hash (`#/...`), nên hosting tĩnh không cần cấu hình rewrite phức tạp.
- Bản build hiện tại: 63 file, khoảng 63,71 MiB; file lớn nhất khoảng 7,02 MiB.
- Thư mục public nguồn: 62 file, khoảng 70,05 MiB.
- Phần lớn ảnh phía dưới trang đã dùng lazy-loading.
- Phạm vi mới chỉ nhận **yêu cầu đặt lịch**, lưu database và chuyển sang Zalo/Fanpage. Không tự xác nhận slot, không thanh toán, không tạo tài khoản khách và không thu thập dữ liệu sức khỏe.

## So sánh phương án

| Phương án | Chi phí nền tảng | Phù hợp với booking | Vận hành | Điểm cần lưu ý |
| --- | ---: | --- | --- | --- |
| Pages + Workers + D1 Free | 0 đồng/tháng | Tốt cho form yêu cầu lịch tối giản | Managed; không quản trị máy chủ | Giới hạn theo ngày; D1 Free phục hồi 7 ngày |
| Pages + Workers Paid + D1 | Từ 5 USD/tháng | Tốt cho production nhỏ | Managed | Phải làm admin/auth; không phải PostgreSQL |
| Supabase Pro + Pages | Từ 25 USD/tháng | Tốt, nhanh phát triển | Postgres managed | Chi phí cao hơn nhưng giảm công vận hành |
| P.A Cloud Server #0 | 72.000đ/tháng trước VAT | Không nên | Phải tự vận hành Linux/Nginx, bảo mật, cập nhật và backup | Thiếu biên RAM/CPU cho Node + PostgreSQL |
| P.A Cloud Server #1 | 136.000đ/tháng trước VAT | Chỉ thử nghiệm nhẹ | Như trên | Biên RAM thấp; single point of failure |
| P.A Cloud Server #2 | 256.000đ/tháng trước VAT | Tốt nếu tự host | Như trên | Cần backup ngoài máy và người quản trị |
| Vercel Hobby | 0 đồng/tháng | Kỹ thuật phù hợp | Dễ triển khai | Tài liệu chính thức giới hạn Hobby cho mục đích cá nhân/phi thương mại, nên không chọn cho website thương hiệu |

### Chi phí cam kết của các gói P.A trong ảnh

Giá 72.000đ, 136.000đ và 256.000đ mỗi tháng được P.A ghi là mức áp dụng khi đăng ký 4 năm, chưa gồm VAT. Tương ứng, tiền thuê cơ sở cho 48 tháng là 3.456.000đ, 6.528.000đ và 12.288.000đ trước VAT. Cần xác nhận lại báo giá, điều kiện RAM tặng, backup và chi phí quản trị trước khi mua.

## Vì sao vẫn giữ Cloudflare Pages cho frontend

- Cloudflare công bố Pages Free có unlimited static requests và bandwidth; 500 build/tháng, 100 custom domain/dự án và 20.000 file/site.
- Giới hạn mỗi asset là 25 MiB; file lớn nhất của dự án chỉ khoảng 7,02 MiB.
- Hướng dẫn chính thức cho React/Vite dùng lệnh build `npm run build` và output `dist`; dự án này tương đương với `pnpm build` và `dist`.
- CDN toàn cầu phù hợp hơn một VPS đơn lẻ cho website nặng hình ảnh và khách truy cập phân tán.
- Không cần vá hệ điều hành, cấu hình firewall, gia hạn chứng chỉ SSL hoặc theo dõi tiến trình Nginx.

## Cấu hình triển khai đề xuất

| Mục | Giá trị |
| --- | --- |
| Giao diện/CDN | Cloudflare Pages Free |
| API nhận yêu cầu | Cloudflare Worker/Pages Function |
| Database | Cloudflare D1 |
| Chống spam | Cloudflare Turnstile Managed hoặc Invisible |
| Khu vực nhân viên | Trang `/admin` tối giản, bảo vệ bằng Cloudflare Access |
| Build command | `pnpm build` |
| Build output | `dist` |
| Node | Dùng phiên bản tương thích với Vite 8 theo lockfile/môi trường CI |
| Domain | Domain riêng của INNER ARCHITECT; chi phí domain tách khỏi hosting |
| DNS/SSL | Cloudflare DNS + HTTPS tự động |
| Cập nhật | Ưu tiên Git integration khi repository đã sẵn sàng; Direct Upload chỉ dùng cho bản thử nghiệm |
| Rollback | Dùng deployment trước đó của Pages; D1 Free có Time Travel 7 ngày |

## Luồng đặt lịch dành cho người lớn tuổi

Không dùng wizard nhiều bước. Một màn hình duy nhất, chữ lớn, tương phản cao và nút tối thiểu 48 px:

1. Chọn nhu cầu bằng thẻ lớn: Tarot, đồng hành 1:1, The Hermit hoặc workshop.
2. Nhập họ tên.
3. Nhập số điện thoại/Zalo.
4. Chọn ngày mong muốn và một khoảng giờ đơn giản: sáng, chiều hoặc tối.
5. Đồng ý để nhân viên liên hệ xác nhận rồi bấm **Gửi yêu cầu đặt lịch**.
6. Hệ thống lưu database và hiện **Đã ghi nhận — lịch chỉ được xác nhận sau khi nhân viên phản hồi**.
7. Hiện hai nút lớn **Nhắn Zalo** và **Mở Fanpage**.

Không yêu cầu mật khẩu, OTP, chọn slot trên lịch phức tạp hoặc thanh toán. Nhãn luôn nằm phía trên ô nhập; không dùng placeholder thay cho nhãn.

## Dữ liệu tối thiểu

| Trường | Mục đích |
| --- | --- |
| `id`, `created_at` | Nhận diện và thời điểm gửi |
| `service_code` | Nhu cầu khách chọn |
| `customer_name` | Xưng hô khi nhân viên liên hệ |
| `contact_phone` | Điện thoại/Zalo để phản hồi |
| `preferred_date` | Ngày mong muốn, chưa phải lịch xác nhận |
| `preferred_time_window` | Sáng/chiều/tối |
| `contact_channel` | Zalo/Facebook/điện thoại |
| `status` | Mới, đã liên hệ, đã xác nhận, hoàn tất hoặc hủy |
| `staff_note` | Ghi chú nội bộ ngắn; không ghi dữ liệu sức khỏe nhạy cảm |

Khu vực nhân viên chỉ cần danh sách yêu cầu mới, bộ lọc trạng thái, nút mở Zalo/Fanpage và thao tác đổi trạng thái. Không xây CRM hoặc calendar engine ở MVP.

## Ngưỡng nâng cấp

Không nâng cấp chỉ vì tăng lượng truy cập vào các trang tĩnh. Xem xét kiến trúc khác khi một trong các yêu cầu sau đã được PM duyệt:

1. CMS động/Payload cần Node process chạy thường xuyên.
2. PostgreSQL và backup dữ liệu thật.
3. Tự động quản lý lịch trống, chống trùng slot, thanh toán, tài khoản khách hoặc tích hợp CRM.
4. Cần SLA/hỗ trợ có hợp đồng.
5. Asset đơn lẻ vượt 25 MiB hoặc phát sinh kho media lớn.

Nếu chạy **Payload + PostgreSQL + Docker trên cùng một VPS**, Cloud Server #1 chỉ nên xem là cấu hình thử nghiệm. Cloud Server #2 (4 vCPU, 4 GB + RAM khuyến mại và SSD 60 GB theo bảng giá được cung cấp) là mức khởi đầu an toàn hơn, nhưng vẫn cần chiến lược backup ngoài máy, giám sát, cập nhật bảo mật và quy trình khôi phục.

## Phân tích riêng cho backend booking

### 1. Cal.com hosted: không cần cho phạm vi đã chốt

Cal.com Individual Free hỗ trợ một người dùng, loại sự kiện và lịch không giới hạn, kiểm tra xung đột, múi giờ, email/SMS và nhúng lịch vào website. Tuy nhiên INNER ARCHITECT chỉ cần ghi nhận ngày mong muốn rồi để nhân viên xác nhận qua Zalo/Fanpage, nên Cal.com làm trải nghiệm phức tạp hơn mức cần thiết.

Không chọn phương án này khi cần giao diện booking hoàn toàn riêng, nhiều tư vấn viên dùng lịch chung/round-robin, quyền quản trị chi tiết, loại bỏ branding hoặc API riêng. Cal.com Teams hiện từ 12 USD/người/tháng khi trả theo năm; chi phí tăng theo số tư vấn viên và dữ liệu booking nằm trên hệ thống bên thứ ba.

### 2. Cloudflare Workers + D1: phương án chính

Workers Free có 100.000 request/ngày; D1 Free có 5 triệu row-read/ngày, 100.000 row-write/ngày, tổng 5 GB và Time Travel 7 ngày. Đây là mức rất lớn so với form nhận yêu cầu lịch ban đầu. Workers Paid có mức tối thiểu 5 USD/tháng và nâng Time Travel D1 lên 30 ngày.

Ưu điểm là không quản trị Linux, CDN và API cùng hệ sinh thái, chi phí thấp và không tính egress D1. Nhược điểm là D1 dùng ngữ nghĩa SQLite và không tương thích trực tiếp với kiến trúc Payload/PostgreSQL đã đề xuất. Cần tự làm admin/auth tối giản. Free tier dùng được cho giai đoạn đầu nhưng phải có cảnh báo lỗi và backup ngoài hệ thống; nếu chạm giới hạn theo ngày, query sẽ lỗi đến kỳ reset.

### 3. Supabase Pro: vận hành đơn giản, giá cao hơn

Supabase Pro từ 25 USD/tháng, gồm Postgres, Auth, API, 8 GB disk, 250 GB egress và backup hằng ngày giữ 7 ngày. Nó phù hợp nếu cần database quan hệ, tài khoản quản trị và phát triển nhanh mà không muốn tự quản trị máy chủ.

Không chọn Supabase Free cho production booking vì project có thể pause sau một tuần không hoạt động và không có automatic backup chính thức. Supabase Pro đắt hơn Workers+D1 và P.A #2 theo giá niêm yết, nhưng giảm đáng kể công vá hệ điều hành, bảo vệ database và kiểm tra backup.

### 4. P.A Cloud Server #0: không phù hợp cho app + database

Một vCPU, RAM cơ sở 1 GB và SSD 20 GB đủ cho Nginx phục vụ site tĩnh, nhưng không có khoảng đệm an toàn cho hệ điều hành, Node/Payload, PostgreSQL, tác vụ backup và đợt tăng tải. RAM tặng phụ thuộc điều kiện đăng ký; không nên coi khuyến mại là nền tảng cho sizing dài hạn.

### 5. P.A Cloud Server #1: chạy được nhưng biên an toàn thấp

Hai vCPU, RAM cơ sở 1,5 GB và SSD 40 GB có thể chạy bản thử nghiệm hoặc backend tối giản. Khi Node, PostgreSQL và Docker cùng máy, RAM còn ít cho cache, migration, backup nén và các tiến trình đột biến. Gói này không loại bỏ single point of failure và vẫn yêu cầu người quản trị server.

### 6. P.A Cloud Server #2: hợp lý nếu bắt buộc tự host

Bốn vCPU, RAM cơ sở 4 GB và SSD 60 GB đủ hơn cho một app Node nhỏ cùng PostgreSQL ở lưu lượng ban đầu. P.A công bố SLA hạ tầng 99,9%, tương đương tối đa khoảng 43 phút downtime/tháng theo cách tính của họ.

Tuy nhiên SLA loại trừ lỗi hệ điều hành, phần mềm, cấu hình, mã nguồn và nhiều trường hợp tấn công/quá tải. Backup tuần mặc định chủ yếu phục vụ sự cố hạ tầng; để khôi phục booking do xóa nhầm hoặc migration lỗi vẫn cần backup PostgreSQL ngoài máy hằng ngày và diễn tập restore. Vì vậy giá 256.000đ/tháng chưa phải tổng chi phí vận hành thực.

### 7. P.A Cloud Server #3: chưa cần thiết

Sáu vCPU và RAM cơ sở 6 GB không giải quyết vấn đề chính là database và app nằm chung một máy. Thêm CPU không tạo high availability, không thêm bản sao database và không thay thế backup. Chỉ nâng lên #3 sau khi số liệu giám sát chứng minh #2 thiếu tài nguyên.

### 8. Railway: thuận tiện nhưng chi phí khó cố định

Railway có region Singapore và triển khai Node/PostgreSQL nhanh. Hobby có mức tối thiểu 5 USD/tháng, nhưng RAM, CPU, egress và volume đều tính theo sử dụng; một app và một database luôn chạy thường vượt mức tối thiểu. Backup/PITR phải bật và giám sát; Railway hiện không công bố uptime SLA cho database thông thường. Phù hợp dev hoặc đội muốn tốc độ triển khai, không phải lựa chọn tốt nhất khi yêu cầu là hóa đơn thấp và cố định.

### 9. Render: free tier không dùng được cho booking thật

Render Free Postgres hết hạn sau 30 ngày, không có backup, có thể restart hoặc bảo trì bất kỳ lúc nào. Bản trả phí cho web service + Postgres được Render ước tính khoảng 13 USD/tháng ở cấu hình thấp trước tăng trưởng bandwidth/storage. Dễ vận hành hơn VPS nhưng không rẻ bằng Workers+D1 hoặc P.A #2.

### 10. Vercel Hobby: không phù hợp website thương mại

Vercel Hobby dành cho mục đích cá nhân, phi thương mại. Dùng Vercel Pro còn phải mua database riêng, nên tổng chi phí cao hơn các phương án trên mà không mang lợi ích rõ rệt cho bản React/Vite hiện tại.

### 11. Shared hosting/PHP: rẻ nhưng buộc đổi stack

Shared hosting có thể rẻ hơn VPS, nhưng không phù hợp nếu chọn Node/Payload và cần worker, migration, job gửi nhắc lịch hoặc quyền cấu hình tiến trình. Chỉ nên chọn khi chủ động viết backend bằng PHP/MySQL và chấp nhận thay đổi kiến trúc.

### 12. Firebase/Firestore: có thể làm nhưng mô hình dữ liệu kém tự nhiên hơn

Firestore transaction có thể chống đặt trùng, nhưng dữ liệu lịch, truy vấn theo khoảng thời gian, báo cáo và quan hệ tư vấn viên–dịch vụ–slot tự nhiên hơn trong SQL. Chi phí theo lượt đọc/ghi khó dự đoán hơn khi thiết kế query chưa ổn định và tăng mức khóa nhà cung cấp. Không phải lựa chọn đầu tiên nếu đội đã định hướng PostgreSQL.

## Việc nên làm trước khi phát hành

- Chuyển ảnh lớn sang WebP/AVIF và tạo kích thước responsive. Tổng build 63,71 MiB vẫn chạy được nhưng nặng hơn mức cần thiết.
- Kiểm tra quyền sử dụng toàn bộ ảnh.
- Chốt domain và URL Zalo/Facebook chính thức.
- Cấu hình cache dài hạn cho asset có hash; giữ HTML có thời gian cache ngắn.
- Kiểm tra desktop/mobile, CTA, metadata, robots/sitemap và trang 404.
- Không đưa secret vào mã nguồn hoặc build tĩnh.

## Nguồn chính thức

- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages pricing/features: https://www.cloudflare.com/developer-platform/products/pages/
- Cloudflare React deployment guide: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Cloudflare build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Cloudflare Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Cloudflare D1 pricing and limits: https://developers.cloudflare.com/d1/platform/pricing/ and https://developers.cloudflare.com/d1/platform/limits/
- Cloudflare D1 Time Travel: https://developers.cloudflare.com/d1/reference/time-travel/
- Cloudflare Turnstile plans: https://developers.cloudflare.com/turnstile/plans/
- Cloudflare Access setup: https://developers.cloudflare.com/cloudflare-one/setup/
- Supabase pricing and backups: https://supabase.com/pricing and https://supabase.com/docs/guides/platform/backups
- Railway pricing, regions and database operations: https://docs.railway.com/pricing, https://docs.railway.com/deployments/regions and https://docs.railway.com/databases
- Render pricing and free database limits: https://render.com/pricing and https://render.com/docs/free
- Cal.com pricing: https://cal.com/pricing
- Vercel Hobby plan and fair-use scope: https://vercel.com/docs/plans/hobby
- P.A Việt Nam Cloud Server price reference: https://www.pavietnam.vn/vn/tin-tuc-bang-gia-thue-cloud-server-chi-tiet-2025.html
- P.A Việt Nam SLA and backup notes: https://www.pavietnam.vn/en/service-level-agreement-sla.html and https://www.pavietnam.vn/en/tin-tuc-top-3-luu-y-khi-tim-hieu-ve-gia-cloud-server.html

## Phần chưa xác minh

- Chưa có báo giá chính thức theo tài khoản của chủ dự án, điều khoản SLA hoặc phụ lục backup từ P.A Việt Nam.
- Chưa có domain, URL Zalo/Fanpage, email nhân viên được phép vào `/admin`, chính sách lưu/xóa dữ liệu và số liệu truy cập thực tế.
- Kiến trúc Next.js/Payload/PostgreSQL chỉ là định hướng tài liệu, chưa phải stack của bản website hiện tại.
