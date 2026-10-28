## Vấn đề và kết quả

<!-- Nêu vấn đề cụ thể và hành vi sau thay đổi. -->

## Task / phạm vi đã duyệt

<!-- Liên kết task và quyết định liên quan. -->

## Kiểm tra

<!-- Ghi kiểm tra đã thực hiện và kết quả; phân biệt phần chưa kiểm tra. -->

| Kiểm tra | Lệnh / bằng chứng | Kết quả |
| --- | --- | --- |
| Lint/typecheck/test/build |  |  |
| Desktop/mobile/accessibility (nếu có UI) |  |  |
| Content/link/migration (nếu liên quan) |  |  |

## Bằng chứng giao diện

<!-- Thêm ảnh desktop/mobile nếu có thay đổi giao diện. -->

## Rủi ro / phụ thuộc / rollback

<!-- Ghi điểm còn thiếu và ảnh hưởng phát hành. -->

- [ ] Đã rà diff, không có secret hoặc dữ liệu cá nhân
- [ ] Nội dung/thiết kế có duyệt nếu thay đổi thuộc phạm vi đó
- [ ] Kiểm tra liên quan đã chạy, hoặc đã ghi rõ lý do chưa chạy
- [ ] Có preview và hướng dẫn UAT khi có ứng dụng
- [ ] Mọi hàm mới hoặc sửa đáng kể có JSDoc/TSDoc hữu ích
- [ ] Có regression test cho bug fix và test hành vi mới khi phù hợp
- [ ] Đã cập nhật docs/API/database/changelog nếu hợp đồng hoặc hành vi thay đổi
- [ ] Đã có code review kỹ thuật; nếu chưa có reviewer độc lập, đã ghi rõ giới hạn này
- [ ] Migration/rollback và ảnh hưởng bảo mật/quyền riêng tư đã được đánh giá
