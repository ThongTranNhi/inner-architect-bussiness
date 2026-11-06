# Điều chỉnh hệ thống tiêu đề — INNER ARCHITECT

## Mục tiêu

Giảm cảm giác tiêu đề quá lớn, hạn chế xuống dòng thô và tạo nhịp đọc cân bằng hơn trên desktop lẫn mobile, đồng thời giữ nguyên phong cách editorial hiện tại.

## Phạm vi đã duyệt

- Giảm khoảng 18–25% các tiêu đề display đang vượt quá tỷ lệ nội dung.
- Điều chỉnh theo từng nhóm trang thay vì áp một quy tắc chung cho mọi `h1`, `h2`, `h3`.
- Giữ thứ bậc rõ ràng: tiêu đề trang lớn hơn tiêu đề section; tiêu đề card nhỏ hơn tiêu đề section.
- Giới hạn độ rộng dòng và tăng line-height nhẹ ở những tiêu đề dài để tránh các dòng chữ chạm hoặc tạo mảng quá nặng.
- Tối ưu riêng cho desktop, tablet và mobile; không để tiêu đề tràn ngang ở viewport từ 360px.
- Thay nội dung học vấn `Đang chờ nhận bằng` thành `2027` theo xác nhận của PM.

## Hướng triển khai

### Trang chủ

- Hero giữ vai trò tiêu đề lớn nhất nhưng giảm nhẹ.
- Các tiêu đề section như “Bắt đầu từ điều đang lặp lại”, “Đi tiếp theo nhịp riêng”, “An toàn đi trước chiều sâu” và tiêu đề kết trang giảm rõ hơn.
- Độ rộng dòng được kiểm soát theo nội dung để xuống dòng thành 2–3 dòng cân bằng, không ép một dòng quá dài.

### Journal, Võ Khiêm và các trang phụ

- Journal masthead giảm mạnh vì mức tối đa hiện tại quá lớn; tiêu đề bài và series giảm vừa phải.
- Tên Võ Khiêm và các tiêu đề hành trình/học vấn/dự án giảm theo độ rộng cột thực tế.
- The Hermit, LARA, chương trình, liên hệ và bài viết giữ cấu trúc hiện có, chỉ điều chỉnh các display heading vượt tỷ lệ.

## Thang chữ mục tiêu

- Display/H1 desktop: khoảng `64–88px`; mobile: `40–52px`.
- Section/H2 desktop: khoảng `44–68px`; mobile: `34–44px`.
- Card/H3 desktop: khoảng `28–42px`; mobile: `26–36px`.
- Line-height tiêu đề: khoảng `0.98–1.1`, tùy độ dài và bề rộng cột.

Các con số cụ thể được đặt trong selector theo từng trang để bảo toàn thứ bậc thị giác; không tạo global override cho toàn bộ heading.

## Không thay đổi

- Không thay cấu trúc component, sitemap, hình ảnh, animation, palette hoặc font.
- Không sửa nội dung thương hiệu ngoài giá trị `2027` đã được PM duyệt.
- Không thêm dữ liệu kinh doanh, tính năng hoặc dependency.

## Kiểm tra

- Test nội dung học vấn phải trả về `2027`.
- Test hợp đồng CSS xác nhận các giới hạn cỡ chữ mới.
- Chạy `pnpm test`, `pnpm typecheck`, `pnpm build`.
- Kiểm tra trực quan trang chủ và các trang tiêu biểu ở desktop, tablet, mobile; kiểm tra không tràn ngang và không đè chữ.

## Phương án đã cân nhắc

- **Đã chọn:** điều chỉnh theo từng nhóm trang để giữ đúng thứ bậc editorial.
- **Không chọn:** áp giới hạn chung cho mọi heading vì có thể làm các trang mất phân cấp và gây xung đột specificity.
