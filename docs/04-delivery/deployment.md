# Quy tắc deploy và rollback

Chính sách đề xuất; chưa kết nối GitHub/hosting, chưa có pipeline hoặc deployment thực tế.

## Môi trường

| Môi trường | Mục đích | Điều kiện |
| --- | --- | --- |
| Local | Developer xây dựng và kiểm tra | Dữ liệu mẫu; không dùng secret production |
| Preview | PM/QA xem từng PR | Có URL gắn PR/commit, hạn chế truy cập nếu có nội dung chưa công bố; ngăn indexing và không gắn domain live |
| Production | Website công khai | Chỉ phát hành phiên bản đã nghiệm thu và được duyệt |

Preview tự động sau push có thể bật khi repo/hosting đã được chủ dự án duyệt. Production mặc định cần thao tác phê duyệt cuối; không thiết lập tự deploy production trên mọi push khi chưa chốt chính sách.

## Điều kiện trước khi phát hành

1. Ghi rõ commit hoặc artifact sẽ phát hành; build đúng phiên bản đó.
2. Các kiểm tra kỹ thuật đã cấu hình đạt. Nội dung, CTA, responsive và đường dẫn quan trọng đã qua UAT.
3. PM/chủ thương hiệu duyệt nội dung và bản preview cụ thể; ghi ngày, người duyệt, phiên bản.
4. Domain, HTTPS, quyền quản lý hosting, biến môi trường và liên hệ chung đã được xác nhận.
5. Có bản production trước để rollback; lần phát hành đầu cần phương án phục hồi site/domain cũ nếu đang thay website hiện có.
6. Nếu có di chuyển nội dung: kiểm kê URL cũ và duyệt mapping chuyển hướng; không đoán URL.

## Trình tự phát hành

PR → kiểm tra tự động → preview → review kỹ thuật + PM UAT → merge main → duyệt production → deploy đúng commit → smoke test → ghi release.

Người triển khai ghi lại: commit, URL, thời gian, người duyệt, thay đổi chính và cách rollback. Với bản preview đã duyệt, ưu tiên phát hành cùng artifact nếu nền tảng hỗ trợ; nếu build lại phải kiểm tra đầu ra tương ứng.

## Smoke test sau deploy

- Mở domain thật, kiểm tra HTTPS và trang chủ.
- Mở sáu nhánh, trang liên hệ và vài trang chi tiết quan trọng trên desktop/mobile.
- Thử CTA Zalo/Facebook mở đúng đích; không gửi tin nhắn thử vào kênh thật khi chưa được giao.
- Kiểm tra ảnh, menu, chuyển hướng đã duyệt, trang 404 và trạng thái index đúng cho production.
- Theo dõi lỗi truy cập và kênh tiếp nhận trong khoảng theo dõi do PM phân công.

## Khi nào rollback

Website không truy cập được, sai kênh liên hệ, mất nội dung quan trọng, lỗi giao diện chặn thao tác, lộ dữ liệu hoặc lỗi nghiêm trọng khác. Người phụ trách báo PM, tạm dừng phát hành tiếp và dùng bản ổn định gần nhất. Quyền rollback khẩn cấp phải được chủ dự án giao trước; nếu chưa có, chuẩn bị phương án và xin duyệt hành động cụ thể.

Rollback hosting về deployment trước, hoặc revert commit qua PR rồi deploy theo cơ chế đã chọn. Không force-push main. Nếu có thay đổi CMS/dữ liệu, rollback ứng dụng chưa chắc khôi phục nội dung; cần bản sao tương ứng. Sau khôi phục phải smoke test lại và ghi nguyên nhân/cách ngăn tái diễn.

## Secret và cấu hình

Không đưa token hoặc mật khẩu vào Git, screenshot hay PR. Mỗi môi trường có cấu hình riêng; quyền truy cập tối thiểu cần thiết. Nếu secret đã bị push, thu hồi/đổi secret và xử lý lịch sử phối hợp với chủ repository; chỉ xóa file khỏi commit mới là chưa đủ.
