# Kế hoạch triển khai dành cho PM

Đây là ước lượng theo tuần làm việc kể từ khi đủ đầu vào, chưa phải cam kết ngày phát hành. Cần chốt nhân sự và công nghệ trước khi khóa lịch.

## Các giai đoạn

| Giai đoạn | Ước lượng | Công việc | Đầu ra / điều kiện chuyển bước | Người phụ trách |
| --- | --- | --- | --- | --- |
| 1. Chốt phạm vi và dữ liệu | Tuần 1 | Duyệt PRD/sitemap; quyết định CTA; thu ảnh, nội dung, thông tin dịch vụ, liên hệ | PRD được duyệt; dữ liệu bắt buộc có người chịu trách nhiệm; quyết định công nghệ/hosting | PM + chủ thương hiệu |
| 2. Hoàn thiện UX và nội dung | Tuần 2 | Sửa hành trình theo sáu nhánh; đơn giản hóa liên hệ; viết nội dung riêng từng trang; wireframe mobile | Luồng không còn dẫn sai nhu cầu; nội dung được duyệt; đủ trạng thái giao diện | Designer + nội dung, PM duyệt |
| 3. Hoàn thiện UI | Tuần 3 | Hệ màu/chữ/khoảng cách; desktop/mobile; component và trạng thái tương tác | Thiết kế được PM duyệt; bàn giao asset và hành vi rõ ràng | Designer |
| 4. Xây dựng MVP | Tuần 4–5 | Khởi tạo ứng dụng; layout, các nhánh, nội dung, liên hệ; preview; SEO cơ bản | Bản preview sử dụng được; các kiểm tra kỹ thuật đã cấu hình đạt | Developer |
| 5. QA và UAT | Tuần 6 | Rà nội dung, điện thoại, trình duyệt, CTA, ảnh, khả năng truy cập; người dùng thử nhiệm vụ | Không còn lỗi chặn; PM ký nhận phiên bản cụ thể; có rollback | QA + PM |
| 6. Phát hành và theo dõi | Sau UAT | Kiểm tra domain/HTTPS, deploy có duyệt, smoke test, bàn giao | Website hoạt động; người nhận vận hành và cách khôi phục được ghi nhận | Developer + PM/chủ domain |

Một người có thể kiêm nhiều vai trò; PM vẫn cần chỉ rõ tên người chịu trách nhiệm cho từng đầu ra.

## Backlog ưu tiên

| Mã | Mức | Hạng mục | Hoàn tất khi |
| --- | --- | --- | --- |
| IA-001 | P0 | Xác nhận một Zalo và một Facebook chung | Có URL thật, người tiếp nhận và kiểm thử mở trên điện thoại/máy tính |
| IA-002 | P0 | Chốt sitemap sáu nhánh | PM duyệt vị trí trà, Tarot, 1:1, workshop, academy, sản phẩm |
| IA-003 | P0 | Thay luồng booking bằng liên hệ theo nhu cầu | PM duyệt; CTA workshop/khóa học không dẫn vào phiên tiếp cận |
| IA-004 | P0 | Hoàn thiện dữ liệu thật | Không còn giá, lịch, thời lượng, ảnh, địa chỉ hoặc hồ sơ chưa xác nhận trên bản live |
| IA-005 | P1 | Làm rõ trang chủ | Đủ sáu lối vào; giới thiệu dễ hiểu trước nội dung triết lý dài |
| IA-006 | P1 | Hoàn thiện các trang chi tiết | Mỗi dịch vụ có thông tin giúp khách quyết định và CTA phù hợp |
| IA-007 | P1 | Hoàn thiện Journal | Bốn bài có nội dung riêng; filter/load more hoạt động hoặc được bỏ khỏi bản phát hành |
| IA-008 | P1 | Sửa header và responsive | Menu không đè logo; chữ/CTA đọc được và không bị che ở khung kiểm thử |
| IA-009 | P1 | Thiết lập repository và môi trường | Repo/hosting được chỉ định; bảo vệ main và preview được kiểm tra thực tế |
| IA-010 | P1 | UAT và phát hành | Checklist đạt; PM duyệt; có release và cách rollback |
| IA-011 | P2 | Tối ưu sau phát hành | Ưu tiên bằng phản hồi và dữ liệu sử dụng thực tế |

P0: cần giải quyết trước khi khóa thiết kế/phạm vi. P1: bắt buộc trước phát hành. P2: cải tiến sau MVP.

## Cách PM theo dõi

- Trạng thái công việc: Backlog → Ready → Doing → Review → Done; dùng Blocked khi có phụ thuộc cụ thể.
- Mỗi việc có owner, đầu ra, tiêu chí nghiệm thu, phụ thuộc, mốc dự kiến và liên kết bằng chứng.
- Họp ngắn hằng tuần để rà đầu ra, lỗi và quyết định; không coi việc “đã thiết kế/đã code” là hoàn tất khi chưa nghiệm thu.
- Yêu cầu mới ghi riêng: lý do, ảnh hưởng phạm vi/chi phí/thời gian, người duyệt. Không đưa ngầm vào sprint.

## Rủi ro chính

Thiếu nội dung/ảnh thật có thể chặn UAT; PM phân công người cung cấp ngay giai đoạn 1. Định vị thiên về phiên tiếp cận có thể làm mất khách trà/khóa học/sản phẩm; chốt lại kiến trúc thông tin trước UI. Chưa có repo/hosting nên chưa thể xác nhận lịch deploy; lập quyết định trước khi lập trình.
