# Quyết định và dữ liệu cần chốt

## Đã chốt từ yêu cầu người dùng

- Một thương hiệu INNER ARCHITECT, các dịch vụ là nhánh con.
- Một Zalo/Facebook chung; MVP giới thiệu và dẫn về kênh liên hệ.
- Trà đạo theo lịch hẹn, có người hướng dẫn; Tarot cả online và trực tiếp.
- Giữ toàn bộ hệ sinh thái; phong cách tinh tế, thiên nhiên và hiện đại.
- Không chỉnh sửa Figma khi chưa được yêu cầu.
- **D10 (PM duyệt 2026-11-13):** Website có biểu mẫu tiếp nhận thông tin khách hàng gồm 4 trường — họ tên, số điện thoại, dịch vụ quan tâm (`tea`, `tarot`, `healing` = Đồng hành 1:1, `workshop`, `academy`, `products` = Sản phẩm LARA, `other` = Nhu cầu khác), email không bắt buộc — kèm đồng ý chính sách bảo mật; lưu MySQL và hiển thị trong trang quản trị nội bộ cho Customer Care chủ động liên hệ. Stack: Node.js + Express + TypeScript + MySQL. Vẫn ngoài phạm vi: booking, thanh toán, tài khoản khách, chatbot, đồng bộ Facebook/Instagram, CRM nâng cao, email marketing. Quyết định này thay thế phần "không thu thập dữ liệu/không CRM" trong PRD, `04-DATABASE.md` và nội dung trang Liên hệ/Chính sách bảo mật. Chi tiết: `docs/backend/`.

## Chưa chốt

| Mã | Quyết định / đầu vào | Owner đề nghị | Khi cần | Trạng thái |
| --- | --- | --- | --- | --- |
| D01 | URL Zalo và Facebook chung, người nhận yêu cầu | Chủ thương hiệu | Trước duyệt nội dung | Chờ xác nhận |
| D02 | Sitemap đề xuất và cách gọi The Hermit/LARA trong thương hiệu mẹ | PM + chủ thương hiệu | Trước UX | Đề xuất trong tài liệu |
| D03 | Giá, thời lượng, lịch, địa chỉ/chỉ đường, người phụ trách từng dịch vụ | Chủ thương hiệu | Trước UI cuối | Chờ xác nhận |
| D04 | Ảnh thật, quyền sử dụng, hồ sơ và phát biểu của người sáng lập | Chủ thương hiệu | Trước UAT | Chờ xác minh |
| D05 | Công nghệ, CMS hay nội dung lưu trong mã nguồn | PM + developer | Trước phát triển | Chưa chọn |
| D06 | GitHub owner/repository, mức riêng tư, người review | PM + chủ repo | Trước push đầu tiên | Chưa cung cấp |
| D07 | Hosting, domain, tài khoản quản lý DNS và môi trường production | PM + chủ domain | Trước thiết lập deploy | Chưa cung cấp |
| D08 | Nhân sự, ngân sách và ngày phát hành mục tiêu | PM | Trước khóa lịch | Chưa cung cấp |
| D09 | Có cần đo click CTA; ai được xem báo cáo | PM + chủ thương hiệu | Trước phát hành | Chưa chọn |

Không tự điền thông tin chưa xác nhận. Nếu chưa đủ dữ liệu, giữ trong tài liệu nội bộ hoặc ẩn phần tương ứng khỏi phiên bản phát hành sau khi PM duyệt.
