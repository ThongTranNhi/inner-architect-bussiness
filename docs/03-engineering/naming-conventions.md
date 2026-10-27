# Quy tắc đặt tên biến và hàm

Mặc định đề xuất cho JavaScript/TypeScript; điều chỉnh nếu chọn ngôn ngữ/framework khác. Nội dung hiển thị dùng tiếng Việt. Theo yêu cầu PM, hàm do dự án tự định nghĩa dùng **tiếng Việt không dấu, camelCase**, theo mẫu động từ + đối tượng. Quy ước biến và kiểu dữ liệu giữ như bảng dưới đây.

| Loại | Quy ước | Ví dụ |
| --- | --- | --- |
| Biến / tham số | camelCase, danh từ đúng ý nghĩa | serviceTitle, selectedService, contactUrl |
| Hàm | Tiếng Việt không dấu, camelCase, động từ + đối tượng | layDichVuTheoMa, dinhDangGia, taoDuongDanLienHe |
| Boolean | is / has / can / should | isMenuOpen, hasAvailableSessions, canSubmit |
| Danh sách | Danh từ số nhiều | services, workshops, products |
| Một phần tử | Danh từ số ít | service, workshop, product |
| Hằng cấu hình cố định | UPPER_SNAKE_CASE | DEFAULT_LOCALE, MAX_TITLE_LENGTH |
| Component / type / interface | PascalCase | ServiceCard, ContactChannel, Workshop |
| Hook nếu dùng React | Giữ tiền tố use theo quy tắc React, phần sau tiếng Việt không dấu | useTrinhDonDiDong |
| Event handler | xuLy + hành động, tiếng Việt không dấu | xuLyBatTatTrinhDon, xuLyNhanLienHe |
| Callback prop do dự án định nghĩa | khi + sự kiện, tiếng Việt không dấu | khiDong, khiChonDichVu |
| File component | PascalCase theo component | ServiceCard.tsx |
| File tiện ích / tài liệu / asset | kebab-case; file hàm tiện ích mới đặt theo tên hàm tiếng Việt không dấu | dinh-dang-gia.ts, project-plan.md, tea-room.webp |
| Route / slug | Chữ thường, không dấu, kebab-case | /dich-vu/tra-dao |
| CSS class | kebab-case hoặc quy ước framework đã chọn | service-card, service-card-title |
| Biến môi trường | UPPER_SNAKE_CASE | CONTACT_ZALO_URL |

## Quy tắc về ý nghĩa

- Tránh tên data, temp, obj, x khi ý nghĩa không rõ. i được chấp nhận cho chỉ số vòng lặp ngắn.
- Không viết tắt tùy ý: dùng selectedService thay selSvc. Giữ các thuật ngữ chuẩn như id, url, API.
- Dùng lay cho lấy giá trị, tim khi có thể không tìm thấy, tai cho truy xuất từ xa, dinhDang cho trình bày, kiemTra cho xác thực, tao cho tạo mới, capNhat cho cập nhật và xoa cho xóa. Không đặt tên lay cho hàm có tác dụng ghi dữ liệu.
- Không dùng dấu tiếng Việt, khoảng trắng hoặc viết tắt khó hiểu trong tên hàm: dùng kiemTraThongTinLienHe thay ktTTLH. Không trộn động từ tiếng Anh và tiếng Việt trong cùng tên hàm tự định nghĩa.
- Giữ nguyên tên API, phương thức chuẩn và tên bắt buộc của thư viện/framework như find, fetch, onClick, useEffect. Ví dụ gắn hàm của dự án vào sự kiện React: onClick={xuLyNhanLienHe}. Không đổi tên API bên ngoài sang tiếng Việt.
- Boolean ưu tiên khẳng định: isEnabled thay isNotDisabled; tránh điều kiện phủ định kép.
- Ghi đơn vị và loại giá trị khi dễ nhầm: durationMinutes, timeoutMs, priceVnd, startDateIso.
- Không dùng 0 để biểu thị “chưa có giá”; dùng kiểu dữ liệu cho phép chưa xác định và cách hiển thị được nội dung duyệt.
- Không dùng contactUrl để chứa lúc Zalo, lúc Facebook một cách ngầm định; khai báo contactChannels.zalo và contactChannels.facebook.
- Không gắn chữ “public” hoặc tiền tố client vào secret. Tên/prefix biến môi trường công khai phụ thuộc framework và chỉ dùng cho dữ liệu được phép lộ.

## Ví dụ minh họa, chưa phải mã đã triển khai

```ts
type Service = {
  id: string;
  slug: string;
  title: string;
  durationMinutes: number | null;
  priceVnd: number | null;
};

function timDichVuTheoSlug(services: Service[], slug: string) {
  return services.find((service) => service.slug === slug);
}

const isMenuOpen = false;
const selectedServiceSlug = "tra-dao";
```

Tên không thay thế thiết kế tốt: một hàm nên có mục đích rõ, tránh vừa xác thực, gửi yêu cầu, thay giao diện và điều hướng trong cùng một hàm khó kiểm tra.
