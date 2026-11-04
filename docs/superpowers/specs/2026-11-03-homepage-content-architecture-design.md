# Homepage Content Architecture Design

## Intent

Tái cấu trúc riêng trang chủ INNER ARCHITECT™ theo bộ nội dung PM cung cấp ngày 03/11/2026. Trang phải giúp người mới lần lượt hiểu thương hiệu, triết lý, hệ thống, hình thức đồng hành và các nhánh của hệ sinh thái trước khi liên hệ.

## Scope

- Giữ React/Vite, route, header, footer, palette, font, ảnh và cơ chế reveal hiện có.
- Chỉ thay nội dung và bố cục bên trong component `Home` cùng CSS/test liên quan.
- Không thêm giá, địa chỉ, lịch, bản đồ, form đặt lịch hoặc dữ liệu kinh doanh chưa xác nhận.
- Không sửa trang phụ, Figma, animation nền tảng hoặc asset.

## Information architecture

Trang chủ hiển thị theo đúng thứ tự:

1. Hero — “Xây trật tự bên trong, để sống tự chủ.”
2. Giới thiệu — “INNER ARCHITECT™ LÀ GÌ?”
3. Một chương kết hợp “TRIẾT LÝ ĐỒNG HÀNH” và “HỆ THỐNG BỐN TẦNG”.
4. Các phiên đồng hành.
5. Workshop & trải nghiệm.
6. Sản phẩm từ INNER ARCHITECT™.
7. The Hermit.
8. Về Khiêm Võ.
9. Journal.
10. Kết nối.

Nội dung câu chữ dùng đúng bản PM cung cấp trong yêu cầu. Hai tên “Khiêm Võ” trong bản này được giữ theo nguồn mới nhất của PM. CTA “Xem nội dung & bảng giá” chỉ dẫn đến trang chương trình hiện có; không tạo hoặc bịa bảng giá.

## Visual direction

- Palette hiện có: paper `#FAF3E8`, ink `#301F05`, olive `#3F4A36`, earth `#C0814C`.
- EB Garamond cho tiêu đề và câu nhấn; IBM Plex Sans cho nhãn, nội dung chức năng và CTA.
- Hero full-bleed giữ slider ảnh hiện tại.
- Giới thiệu dùng bố cục chữ lớn và ảnh lệch cột.
- Triết lý dùng bốn hàng có đường phân cách; bốn tầng tiếp nối bằng gallery ảnh không bo góc.
- Các chương còn lại luân phiên ảnh lớn–khối chữ, tránh card lặp.
- Journal giữ cấu trúc bài nổi bật + rail hiện tại.
- Kết nối dùng ảnh kết trang hiện tại và disclaimer rõ ràng.

## Responsive and accessibility

- Không tràn ngang từ 360px.
- Tiêu đề dùng thang `clamp()` và `text-wrap: balance`.
- CTA có chiều cao tối thiểu 44px và focus-visible hiện có.
- Ảnh ngoài hero tiếp tục lazy-load; hero ảnh đầu eager/high priority.
- Reveal hiện có và `prefers-reduced-motion` tiếp tục hoạt động.

## Approaches considered

1. **Tái cấu trúc component Home hiện có (chọn):** giữ route và nền tảng motion, thêm lớp bố cục scoped cho nội dung mới; phạm vi nhỏ nhất và không ảnh hưởng trang phụ.
2. Tạo mười component/trang mới: dễ tách file nhưng là refactor ngoài yêu cầu.
3. Chỉ thay câu chữ trong bố cục cũ: diff nhỏ hơn nhưng không đáp ứng thứ tự và chủ đề nội dung mới.
