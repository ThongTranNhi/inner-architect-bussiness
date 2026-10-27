# Người dùng và website

Đây là mô hình hành vi để PM và nhóm thiết kế trao đổi; các nhóm người dùng là giả thuyết theo nhu cầu dịch vụ, chưa phải kết quả nghiên cứu người dùng.

## Sơ đồ các bên tham gia

```mermaid
flowchart LR
    Visitor[Khách mới] -->|Khám phá thương hiệu và chọn nhu cầu| Web[Website INNER ARCHITECT]
    Return[Khách quay lại] -->|Tìm lịch chương trình, bài viết, sản phẩm| Web
    Learner[Người muốn học / dự workshop] -->|Xem nội dung và điều kiện tham gia| Web
    Web -->|CTA theo dịch vụ| Channels[Zalo / Facebook chung]
    Channels -->|Yêu cầu do khách chủ động gửi| Team[Đội ngũ tiếp nhận]
    Team -->|Tư vấn, xác nhận lịch / đăng ký / mua| Customer[Khách hàng]
    PM[PM / chủ thương hiệu] -->|Duyệt phạm vi, nội dung, phát hành| Delivery[Nhóm nội dung, thiết kế, phát triển]
    Delivery -->|Cập nhật phiên bản được duyệt| Web
```

Website hỗ trợ tìm hiểu và mở kênh liên hệ. Việc gửi tin, xác nhận lịch, thanh toán và theo dõi yêu cầu diễn ra ngoài website trong MVP. Chưa có trang quản trị hoặc CRM được quyết định.

## Hành trình chính

```mermaid
flowchart TD
    Start[Truy cập từ tìm kiếm / mạng xã hội / giới thiệu] --> Home[Trang chủ hoặc trang chi tiết]
    Home --> Need{Nhu cầu hiện tại?}
    Need -->|Trải nghiệm trà| Tea[Xem trà đạo: lịch hẹn và người hướng dẫn]
    Need -->|Tarot| Tarot[Xem Tarot: online hoặc trực tiếp]
    Need -->|Đồng hành cá nhân| Support[Xem 1:1: người đồng hành và phạm vi]
    Need -->|Workshop / học| Learn[Xem lịch, nội dung, điều kiện, phí]
    Need -->|Sản phẩm| Product[Xem sản phẩm và thông tin mua]
    Need -->|Chưa rõ| Explore[Xem tổng quan / Journal / liên hệ hỏi thêm]
    Tea --> Ready{Đã đủ thông tin?}
    Tarot --> Ready
    Support --> Ready
    Learn --> Ready
    Product --> Ready
    Explore --> Ready
    Ready -->|Chưa| More[Đọc chi tiết / FAQ / hồ sơ]
    More --> Ready
    Ready -->|Có hoặc muốn hỏi thêm| Channel{Chọn kênh liên hệ}
    Channel --> Zalo[Mở Zalo chung]
    Channel --> Facebook[Mở Facebook chung]
    Zalo --> Send[Khách tự gửi nhu cầu]
    Facebook --> Send
    Send --> Reply[Đội ngũ tư vấn và xác nhận ngoài website]
    Channel -->|Ứng dụng không mở được| Fallback[Hiển thị kênh còn lại và thông tin liên hệ dự phòng đã xác nhận]
```

## Nhiệm vụ kiểm thử với người dùng

| Nhóm nhu cầu | Nhiệm vụ | Thành công khi |
| --- | --- | --- |
| Trà | Tìm cách đặt một buổi trà có hướng dẫn | Hiểu cần hẹn trước, biết nơi diễn ra và mở đúng kênh liên hệ |
| Tarot | Tìm phiên online | Phân biệt được online/trực tiếp, hiểu cách diễn ra và liên hệ đúng |
| Đồng hành | Tìm người hỗ trợ 1:1 | Đọc được hồ sơ/phạm vi và biết cách đề nghị trao đổi |
| Học tập | Đăng ký khóa Tarot hoặc workshop | Tìm đúng chương trình và CTA không đưa sang phiên tiếp cận không liên quan |
| Sản phẩm | Hỏi mua một sản phẩm | Tìm đủ thông tin sản phẩm và mở được kênh hỏi mua |
| Khách mới | Tìm hiểu INNER ARCHITECT có gì | Nhận ra sáu nhánh và quan hệ với cùng thương hiệu mẹ |

Ghi nhận đường đi thực tế, điểm ngập ngừng, nội dung khó hiểu và lỗi; không hướng dẫn trước rồi coi là người dùng tự hoàn thành.
