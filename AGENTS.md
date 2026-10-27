# Quy tắc làm việc trong dự án INNER ARCHITECT

## Phạm vi và quyền thay đổi

- Đọc README.md, PRD và decision-log trước khi thực hiện công việc.
- Người dùng hiện đóng vai trò PM. Không tự thay đổi nội dung, bố cục hoặc mã trong Figma; chỉ thực hiện khi được yêu cầu rõ ràng.
- Phân biệt yêu cầu đã chốt với đề xuất. Không tự biến đề xuất sitemap, công nghệ hoặc nội dung thành quyết định đã duyệt.
- Không bịa giá, thời lượng, lịch, hồ sơ chuyên môn, đánh giá khách hàng, địa chỉ, số điện thoại hay liên kết liên hệ.
- Không tự thêm booking nhiều bước, thanh toán, tài khoản hoặc thu thập thông tin sức khỏe vào MVP.

## Mã nguồn và kiểm tra

- Theo docs/03-engineering/naming-conventions.md và cấu trúc tương ứng sau khi công nghệ được chốt.
- Hàm do dự án tự định nghĩa đặt bằng tiếng Việt không dấu, camelCase, ví dụ layDichVuTheoMa, dinhDangGia, xuLyNhanLienHe. Giữ nguyên tên API/thư viện và tiền tố use bắt buộc của React hook; không tự dịch tên chuẩn bên ngoài.
- Không ghi secret vào mã nguồn, tài liệu, log hoặc commit. Chỉ dùng biến môi trường; .env.example chỉ chứa tên biến và giá trị mẫu không nhạy cảm.
- Chạy các kiểm tra thực sự đã cấu hình trong dự án. Không báo kiểm tra đạt nếu chưa chạy.
- Với thay đổi giao diện, kiểm tra desktop/mobile, điều hướng và CTA liên quan; ưu tiên kiểm tra gắn với rủi ro thực tế.
- Bảo toàn dữ liệu và thay đổi đang có của người dùng; không reset hoặc xóa ngoài phạm vi.

## GitHub và deploy

- Tuân thủ docs/03-engineering/github-rules.md và docs/04-delivery/deployment.md.
- Có thể chuẩn bị thay đổi và bản mô tả PR trong phạm vi nhiệm vụ. Chỉ push hoặc tạo PR khi người dùng đã giao việc bao gồm hành động đó; không suy ra quyền publish từ việc sửa file.
- Không force-push nhánh dùng chung, không push thẳng main, không commit secret.
- Merge main và deploy production cần PM/chủ dự án duyệt bản thay đổi cụ thể; không tự tạo repository công khai hoặc đổi quyền truy cập.
- Báo cáo ngắn: đã thay đổi gì, đã kiểm tra gì, điều gì còn chưa xác minh.
