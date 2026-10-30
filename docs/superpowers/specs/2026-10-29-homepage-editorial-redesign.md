# Homepage Editorial Redesign Design

## Intent

Đưa trang chủ INNER ARCHITECT về đúng nhịp editorial đã duyệt: Norm Architects là khung monograph chính, Openhouse Magazine là tham chiếu cho phần mục lục trải nghiệm và Journal. Trang vẫn ưu tiên người đang tìm hỗ trợ cho chính họ và dẫn tới phiên tiếp cận ban đầu.

## Goals

- Tạo chuỗi chương rõ: hero → hệ thống → điểm bắt đầu → các lối đi → ranh giới → Journal → lời mời cuối.
- Dùng ảnh lớn, typography serif–sans, bố cục 12 cột bất đối xứng và khoảng thở có chủ đích.
- Thay các hàng card đồng hạng bằng một câu chuyện chính và các câu chuyện phụ.
- Motion có một nhịp mở trang, reveal theo chương và phản hồi hover tiết chế.
- Tôn trọng `prefers-reduced-motion`, bàn phím và responsive từ 390px đến 1440px.

## Non-goals

- Không đổi route, nội dung kinh doanh, CTA, giá, lịch hoặc dữ liệu liên hệ.
- Không thêm thư viện animation hoặc đổi framework.
- Không sửa Figma hay các trang phụ.

## Constraints

- Giữ React/Vite và các asset hiện có.
- Giữ palette thương hiệu và hai font hiện có.
- Ảnh không bo góc, không shadow trang trí, không gradient màu ngoài scrim ảnh cần cho độ đọc.
- Nội dung y khoa/tâm lý và phạm vi hỗ trợ giữ nguyên.

## Approaches

1. **Chỉ vá CSS hiện tại:** nhanh nhưng tiếp tục mang nhiều selector cũ xung đột và không sửa được hierarchy. Loại.
2. **Viết lại toàn bộ ứng dụng:** sạch nhưng vượt phạm vi và có rủi ro phá các trang phụ. Loại.
3. **Tái cấu trúc riêng component Home bằng namespace mới:** cô lập layout/motion mới, giữ route và nội dung. Chọn phương án này.

## Visual system

- Màu: paper `#FAF3E8`, bone `#F3ECE0`, ink `#383839`, brown `#301F05`, earth `#C0814C`, olive `#3F4A36`.
- Type: EB Garamond cho headline/prose editorial; IBM Plex Sans cho navigation, metadata và CTA.
- Layout: 12 cột desktop; ảnh chapter gần full-width; story index theo tỷ lệ 7/5; mobile dùng các khối lệch 100%/84%/76% thay vì card đồng hạng.
- Motion: hero arrival; section reveal `opacity + translateY`; child stagger; ảnh mở bằng clip; hover tối đa 1.5% scale. Không bounce, blur hoặc parallax liên tục.

