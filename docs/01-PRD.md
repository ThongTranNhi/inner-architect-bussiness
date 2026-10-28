# 01 — Product Requirements Document

**Trạng thái:** Draft để PM/chủ thương hiệu duyệt

**Cập nhật:** 28/10/2026

**Nguồn chi tiết:** `docs/01-product/prd.md`, `project-plan.md`, `decision-log.md`

## Tầm nhìn

Website INNER ARCHITECT giúp người mới hiểu thương hiệu có gì, nhận ra trải nghiệm phù hợp và chủ động liên hệ qua kênh chung. Trải nghiệm phải tĩnh, ấm, đáng tin nhưng không mơ hồ hoặc che khuất thông tin thực tế.

## Đối tượng

- Người muốn trải nghiệm trà đạo có hướng dẫn và biết rằng cần hẹn trước.
- Người cần Tarot online hoặc trực tiếp.
- Người tìm đồng hành 1:1 với chuyên gia.
- Người quan tâm workshop, Academy hoặc sản phẩm.
- Người chưa rõ nhu cầu, muốn khám phá thương hiệu hoặc Journal.

## Phạm vi MVP

| Nhánh | Nội dung bắt buộc | CTA |
| --- | --- | --- |
| Trà đạo | trải nghiệm, lịch hẹn, người hướng dẫn, dữ liệu thực tế đã xác nhận | Liên hệ đặt trải nghiệm trà |
| Tarot | online/offline, cách diễn ra, người thực hiện, giới hạn | Liên hệ đặt phiên Tarot |
| Đồng hành 1:1 | đối tượng phù hợp, phạm vi, chuyên gia, hình thức | Liên hệ chuyên gia |
| Workshop | chủ đề, người hướng dẫn, lịch/địa điểm, phí, trạng thái | Hỏi/đăng ký workshop |
| Academy | đầu vào, mục tiêu, chương trình, giảng viên, lịch/học phí | Nhận tư vấn khóa học |
| Sản phẩm | ảnh, mô tả, thông số, giá/cách hỏi giá, hướng dẫn | Hỏi mua sản phẩm |

MVP gồm trang chủ, giới thiệu, dịch vụ/chi tiết, hồ sơ người đồng hành, chương trình, sản phẩm, Journal, FAQ/liên hệ, pháp lý tối thiểu và 404. Mọi CTA dùng cùng Zalo/Facebook đã được duyệt, nhưng nhãn phải giữ đúng ngữ cảnh nhu cầu.

## Ngoài phạm vi

Booking/lịch trống, thanh toán/giỏ hàng, tài khoản, CRM, chatbot, newsletter thu thập dữ liệu, biểu mẫu sức khỏe/tâm lý và hệ thống nhắn tin nội bộ. Muốn thêm phải có yêu cầu, đánh giá bảo mật và phê duyệt riêng.

## Yêu cầu chất lượng

- Responsive từ 360px; không tràn ngang hoặc che CTA.
- Điều hướng bàn phím, focus rõ, semantic HTML và tương phản WCAG 2.1 AA ở nội dung chính.
- Ảnh có quyền sử dụng, kích thước phù hợp và alt text đúng mục đích.
- SEO cơ bản: metadata riêng, canonical, sitemap/robots đúng môi trường và 404.
- Không hiển thị placeholder hoặc dữ liệu chưa xác nhận như sự thật.

## Tiêu chí thành công

- Người mới nhận ra sáu nhánh và tìm được cách liên hệ đúng mà không cần hướng dẫn.
- CTA mở đúng Zalo/Facebook chung và không tự gửi thông tin thay khách.
- Các nhiệm vụ trà, Tarot online, 1:1, workshop/Academy và sản phẩm hoàn tất trong UAT.
- Không còn tương tác giả, nội dung tạm hoặc chức năng ngoài phạm vi trên bản phát hành.

## Phụ thuộc chưa chốt

URL liên hệ thật, dữ liệu dịch vụ, asset/quyền sử dụng, cách gọi các nhánh, stack/hosting/domain, nhân sự review và mục tiêu phát hành. Theo dõi tại `docs/01-product/decision-log.md`.
