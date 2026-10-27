# Sitemap

## Cấu trúc quan sát được trong prototype

```mermaid
flowchart TD
    Home[Trang chủ] --> System[Hệ thống]
    Home --> Journal[Journal]
    Home --> Programs[Chương trình]
    Home --> Hermit[The Hermit]
    Home --> Booking[Đặt lịch: phiên tiếp cận 8 bước]
    Home --> Founder[Võ Khiêm: liên kết trong trang và footer]
    Home --> Lara[LARA: liên kết footer]
    Programs --> Workshop[Chạm - Vẽ để dịu lại]
    Programs --> Course[Tarot Căn Bản]
    Programs --> Booking
    Hermit --> Lara
    Journal --> Article1[Tarot không phải lời tiên đoán]
    Journal --> Article2[Khi một mô thức cứ lặp lại]
    Journal --> Article3[Chạm ngõ Tarot]
    Journal --> Article4[Ranh giới trong một phiên Tarot]
```

## Cấu trúc đề xuất cho MVP — chờ PM duyệt

```mermaid
flowchart TD
    Home[Trang chủ INNER ARCHITECT] --> About[Về INNER ARCHITECT]
    Home --> Services[Dịch vụ và trải nghiệm]
    Home --> Workshop[Workshop]
    Home --> Academy[Academy]
    Home --> Products[Sản phẩm]
    Home --> Journal[Journal]
    Home --> Contact[Liên hệ]
    About --> Philosophy[Triết lý và phạm vi hỗ trợ]
    About --> Founder[Người sáng lập / người đồng hành]
    Services --> Tea[Trà đạo tại The Hermit]
    Services --> Tarot[Tarot online / trực tiếp]
    Services --> OneToOne[Đồng hành 1:1]
    Workshop --> WorkshopDetail[Chi tiết workshop]
    Academy --> CourseDetail[Chi tiết khóa học]
    Products --> ProductDetail[Chi tiết sản phẩm thực tế / LARA]
    Journal --> Article[Chi tiết bài viết]
    Tea --> Contact
    Tarot --> Contact
    OneToOne --> Contact
    WorkshopDetail --> Contact
    CourseDetail --> Contact
    ProductDetail --> Contact
    Contact --> Zalo[Một Zalo chung]
    Contact --> Facebook[Một Facebook chung]
```

Các cạnh về Liên hệ thể hiện hành trình; CTA trên trang chi tiết có thể mở thẳng Zalo/Facebook chung để giảm thao tác. Không bắt buộc đi qua trang Liên hệ.

## URL đề xuất

| Trang | URL |
| --- | --- |
| Trang chủ | / |
| Về thương hiệu | /ve-inner-architect |
| Hồ sơ người sáng lập | /ve-inner-architect/vo-khiem |
| Tổng quan dịch vụ | /dich-vu |
| Trà đạo / The Hermit | /dich-vu/tra-dao |
| Tarot | /dich-vu/tarot |
| Đồng hành 1:1 | /dich-vu/dong-hanh-1-1 |
| Workshop / chi tiết | /workshop, /workshop/[slug] |
| Academy / chi tiết | /academy, /academy/[slug] |
| Sản phẩm / chi tiết | /san-pham, /san-pham/[slug] |
| Journal / bài viết | /journal, /journal/[slug] |
| Liên hệ | /lien-he |
| Bảo mật / phạm vi hỗ trợ | /chinh-sach-bao-mat, /pham-vi-ho-tro |

Menu desktop gợi ý: Về chúng tôi · Dịch vụ · Workshop · Academy · Sản phẩm · Journal · Liên hệ. Dịch vụ mở ba nhánh. Mobile dùng cùng cấu trúc; CTA liên hệ luôn dễ tìm. Trang chính sách đặt ở footer.

URL chỉ là đề xuất. Cần kiểm kê URL website đang hoạt động trước khi lập bảng chuyển hướng cho việc thay website cũ; chưa giả định các đường dẫn hash của prototype là URL production.
