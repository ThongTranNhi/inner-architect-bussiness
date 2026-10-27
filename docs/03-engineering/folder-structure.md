# Cấu trúc thư mục

## Đã tạo cho giai đoạn PM

```text
inner-architect/
├── README.md
├── AGENTS.md
├── .gitignore
├── .github/
│   └── pull_request_template.md
├── docs/
│   ├── 01-product/
│   │   ├── prd.md
│   │   ├── project-plan.md
│   │   └── decision-log.md
│   ├── 02-design/
│   │   ├── prototype-review.md
│   │   ├── sitemap.md
│   │   └── user-flows.md
│   ├── 03-engineering/
│   │   ├── folder-structure.md
│   │   ├── github-rules.md
│   │   └── naming-conventions.md
│   └── 04-delivery/
│       ├── deployment.md
│       └── acceptance-checklist.md
├── assets/
│   ├── brand/
│   ├── references/
│   └── approved/
└── content/
    ├── services/
    ├── workshops/
    ├── academy/
    ├── products/
    └── journal/
```

Các thư mục chưa có nội dung dùng .gitkeep để Git lưu được cấu trúc. Không lưu ảnh/tài liệu nhạy cảm hoặc chưa có quyền phân phối trong repository có chia sẻ.

assets/references: tài liệu tham chiếu; assets/approved: tài nguyên đã được chủ thương hiệu duyệt. content: bản nội dung đang biên tập, chưa mặc định là định dạng dữ liệu của ứng dụng.

## Cấu trúc mã nguồn đề xuất sau khi chốt công nghệ

Nếu chọn ứng dụng TypeScript có thể dùng cấu trúc dưới đây. Đây chưa phải thư mục ứng dụng đã khởi tạo; framework/CMS có thể yêu cầu cấu trúc khác.

```text
src/
├── app/              # Trang và route theo framework được chọn
├── components/
│   ├── ui/           # Button, input, dialog dùng chung
│   └── layout/       # Header, footer, navigation
├── features/         # services, workshops, academy, products, journal, contact
├── lib/              # Hàm tiện ích và tích hợp
├── config/           # Điều hướng và liên hệ dùng chung
├── styles/           # Token giao diện và style chung
└── types/            # Kiểu dữ liệu dùng chung
public/               # Tài nguyên web đã tối ưu, không chứa file gốc nội bộ
tests/                # Kiểm thử hành trình quan trọng khi cần
```

Nguyên tắc: liên hệ chung quản lý ở một nguồn; component dùng lại khi có nhu cầu thực; tránh chia file quá nhỏ hoặc tạo tầng trừu tượng trước khi cần. Bản tài liệu đã duyệt và dữ liệu chạy trên web phải có quy trình cập nhật rõ ràng để tránh lệch nhau.
