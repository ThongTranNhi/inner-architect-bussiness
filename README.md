# INNER ARCHITECT — Project Hub

Bộ tài liệu dành cho PM, thiết kế, nội dung và phát triển website INNER ARCHITECT.

**Trạng thái:** Git repository đã tồn tại; chưa có mã ứng dụng, package manager manifest hoặc cấu hình deploy. Bộ tài liệu là nguồn chuẩn để chuẩn bị triển khai. Không có thay đổi nào được thực hiện trong Figma.

## Tổng quan sản phẩm

INNER ARCHITECT là một thương hiệu gồm trà đạo có hướng dẫn theo lịch hẹn, Tarot online/offline, đồng hành 1:1, workshop, Academy và sản phẩm. MVP giúp khách hiểu dịch vụ và mở một Zalo/Facebook chung để tự liên hệ; chưa có booking/payment nội bộ. Định hướng thị giác là **natural modern**: ấm, tinh tế, gần thiên nhiên và rõ ràng hiện đại.

## Bộ tài liệu chuẩn

| Tài liệu | Nội dung |
| --- | --- |
| [01 — PRD](docs/01-PRD.md) | Mục tiêu, phạm vi, yêu cầu |
| [02 — Sitemap](docs/02-SITEMAP.md) | Cây trang và điều hướng |
| [03 — Architecture](docs/03-ARCHITECTURE.md) | Kiến trúc mục tiêu và ranh giới |
| [04 — Database](docs/04-DATABASE.md) | Mô hình dữ liệu/nội dung |
| [05 — API](docs/05-API.md) | Hợp đồng dữ liệu và tích hợp |
| [06 — Design System](docs/06-DESIGN-SYSTEM.md) | Token, component, accessibility |
| [07 — UX/UI](docs/07-UX-UI.md) | Hành trình, trạng thái, responsive |
| [08 — Security](docs/08-SECURITY.md) | Bảo mật và quyền riêng tư |
| [09 — Testing](docs/09-TESTING.md) | Chiến lược kiểm thử |
| [10 — Deployment](docs/10-DEPLOYMENT.md) | CI/CD, release, rollback |
| [11 — Changelog](docs/11-CHANGELOG.md) | Lịch sử thay đổi đáng chú ý |

Các thư mục `docs/01-product` đến `docs/04-delivery` giữ tài liệu chi tiết và lịch sử; không xóa khi chưa hợp nhất có chủ đích.

## Bắt đầu tại đây

| Tài liệu | Mục đích |
| --- | --- |
| [Kế hoạch dự án](docs/01-product/project-plan.md) | Giai đoạn, trách nhiệm, điều kiện hoàn tất |
| [Phạm vi và yêu cầu](docs/01-product/prd.md) | Yêu cầu đã chốt và tiêu chí nghiệm thu |
| [Quyết định cần chốt](docs/01-product/decision-log.md) | Những dữ liệu PM cần xác nhận |
| [Đánh giá prototype](docs/02-design/prototype-review.md) | Phát hiện từ Figma và đề xuất sửa |
| [Sitemap](docs/02-design/sitemap.md) | Cây trang hiện tại và đề xuất |
| [Người dùng và website](docs/02-design/user-flows.md) | Vai trò và hành trình sử dụng |
| [Cấu trúc thư mục](docs/03-engineering/folder-structure.md) | Nơi lưu tài liệu và quy ước mã nguồn tương lai |
| [Quy tắc GitHub](docs/03-engineering/github-rules.md) | Nhánh, commit, PR, bảo vệ main |
| [Quy tắc đặt tên](docs/03-engineering/naming-conventions.md) | Biến, hàm, component, dữ liệu |
| [Triển khai và rollback](docs/04-delivery/deployment.md) | Môi trường, điều kiện phát hành, khôi phục |
| [Checklist nghiệm thu](docs/04-delivery/acceptance-checklist.md) | PM kiểm tra trước khi phát hành |

## Nguyên tắc nền tảng

- Một thương hiệu INNER ARCHITECT; dịch vụ và sản phẩm là các nhánh con.
- Giữ toàn bộ hệ sinh thái: trà đạo, Tarot online/offline, đồng hành 1:1, workshop, academy, sản phẩm.
- Website giai đoạn đầu giới thiệu và chuyển khách về một Zalo/Facebook chung.
- Phong cách tinh tế, thiên nhiên kết hợp hiện đại.
- Các sơ đồ và cấu trúc trang trong tài liệu là **đề xuất**, chưa phải thay đổi đã được duyệt trên Figma.

## Cách sử dụng sơ đồ

Các file sơ đồ chứa Mermaid, có thể xem trực tiếp trên GitHub khi repository được tạo. Dùng chúng làm đầu vào trao đổi với thiết kế và lập trình.
