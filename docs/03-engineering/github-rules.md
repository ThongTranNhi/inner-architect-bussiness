# Quy tắc GitHub

Đây là chính sách dự án đề xuất cho PM duyệt. Chưa có repository nên chưa có bảo vệ nhánh hay CI nào được bật thực tế.

## Nhánh và commit

- main là nhánh chuẩn bị cho production; phải luôn ở trạng thái có thể phát hành.
- Làm việc trên nhánh ngắn: feature/ia-123-contact-cta, fix/ia-124-mobile-header, docs/ia-125-sitemap, chore/ia-126-ci.
- Dùng chữ thường, dấu gạch ngang, mã task nếu đã có. Không bắt buộc thêm nhánh develop cho MVP.
- Commit theo dạng `type(scope): mô tả`, ví dụ `feat(contact): add shared Zalo link`, `fix(header): separate menu from logo`, `docs(product): update MVP scope`.
- Một commit/PR tập trung vào một mục đích. Không trộn chỉnh nội dung thương hiệu với tái cấu trúc không liên quan.

## Trước khi push

1. Xem diff và file sắp đưa lên; loại secret, dữ liệu cá nhân, file thừa và asset chưa được phép chia sẻ.
2. Chạy kiểm tra đã cấu hình tương ứng thay đổi: lint/typecheck/build cho mã ứng dụng; rà liên kết và sơ đồ cho tài liệu.
3. Không tự coi lệnh kiểm tra chưa có là đã đạt; ghi rõ phần chưa cấu hình.
4. Push vào nhánh công việc của repository được chỉ định. Không tự tạo remote hoặc repository công khai.

## Pull request và review

- PR mô tả vấn đề, kết quả, task liên quan, cách kiểm tra, ảnh desktop/mobile nếu đổi giao diện và rủi ro còn lại.
- Dùng draft PR khi nội dung, thiết kế hoặc kiểm tra còn thiếu.
- Cần review kỹ thuật trước merge; PM/chủ thương hiệu duyệt thay đổi ảnh hưởng nội dung, thiết kế, phạm vi hoặc phát hành.
- Khi có nhiều người: ít nhất một người khác người viết phê duyệt. Nếu chỉ có một developer, PM duyệt UAT và ghi rõ chưa có review kỹ thuật độc lập; không gọi đó là review kỹ thuật đã hoàn tất.
- Sửa lỗi và chạy lại kiểm tra bị ảnh hưởng sau review. Dùng squash merge để giữ lịch sử theo công việc.

## Thiết lập bắt buộc trên repository khi được tạo

- Chặn push trực tiếp, force-push và xóa main; yêu cầu PR.
- Bắt buộc các status check thật sự đã cấu hình; không thêm tên check giả.
- Yêu cầu giải quyết nhận xét và approval mới sau thay đổi quan trọng; cấu hình số approval phù hợp nhân sự và khả năng của gói GitHub.
- Chỉ người được giao mới có quyền merge/deploy. Bật phát hiện secret nếu nền tảng hỗ trợ; vẫn tự rà diff.
- Không bypass quy tắc trừ sự cố production có người chịu trách nhiệm và biên bản xử lý.

Không force-push nhánh dùng chung. Nếu cần sửa lịch sử nhánh cá nhân đã push, phải phối hợp với người đang dùng nhánh; ưu tiên commit sửa tiếp.
