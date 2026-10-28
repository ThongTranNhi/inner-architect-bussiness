# 07 — UX/UI Specification

## Hành trình chính

1. Người dùng vào từ tìm kiếm/mạng xã hội.
2. Nhận ra INNER ARCHITECT và sáu nhánh trong vùng đầu.
3. Chọn nhu cầu, đọc thông tin thực tế và hồ sơ liên quan.
4. Chọn Zalo/Facebook chung bằng CTA mang đúng ngữ cảnh.
5. Tự gửi yêu cầu; đội ngũ xác nhận ngoài website.

## Yêu cầu theo trang

- **Trang chủ:** value proposition cụ thể, sáu lối vào, giới thiệu ngắn, nội dung nổi bật, CTA.
- **Dịch vụ:** ai phù hợp, trải nghiệm, hình thức, người thực hiện, dữ liệu xác nhận, FAQ, CTA.
- **Workshop/Academy:** mục tiêu, nội dung, người hướng dẫn, lịch/trạng thái, phí, CTA đúng dịch vụ.
- **Sản phẩm:** ảnh, mô tả trung thực, thông số, cách dùng, giá/cách hỏi giá.
- **Journal:** bài riêng; không hiện filter/load more nếu chưa hoạt động.
- **Liên hệ:** hai kênh chung, địa chỉ/chỉ đường/giờ phản hồi chỉ khi đã xác nhận.

## Trạng thái và lỗi

Thiết kế loading, empty, 404, lỗi media/CMS và fallback liên hệ. Nếu JavaScript lỗi, nội dung cốt lõi/link liên hệ vẫn nên dùng được. Không ghi “đặt lịch” nếu thực tế chỉ mở kênh liên hệ.

## Responsive

Kiểm tra 360, 390, 768, 1024, 1440px. Menu không đè logo; CTA không bị che; bảng/chip không tràn ngang; thứ tự nội dung vẫn logic.

## Nội dung và tin cậy

Dùng ngôn ngữ cụ thể, tránh hứa hẹn chữa lành/kết quả y tế. Không dùng testimonial, credential hoặc con số khi chưa xác minh.

## UAT

Thực hiện nhiệm vụ trà, Tarot online, 1:1, workshop/Academy, sản phẩm và khám phá tổng quan; ghi bằng chứng theo `docs/04-delivery/acceptance-checklist.md`.
