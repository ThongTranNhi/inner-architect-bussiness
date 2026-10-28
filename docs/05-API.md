# 05 — API & Integrations

## Phạm vi

MVP ưu tiên render server/static từ CMS. Không cần public API riêng nếu framework đọc dữ liệu nội bộ an toàn. Nội dung dưới đây là hợp đồng khái niệm, không phải endpoint đã tồn tại.

## Read model tối thiểu

```ts
type ContactChannel = {
  kind: "zalo" | "facebook";
  label: string;
  url: string;
};

type PublicContent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: "published";
  updatedAt: string;
};
```

Nếu triển khai endpoint, chỉ expose trường public, validate slug/locale, trả 404 cho draft/archived và có cache/revalidation rõ.

## Tích hợp liên hệ

- Zalo/Facebook là external link đã duyệt; dùng `https` và `rel="noopener noreferrer"` khi mở tab mới.
- Không tự gửi tin nhắn hoặc gắn PII vào URL.
- Có fallback kênh còn lại khi ứng dụng không mở; không giả định deep link hoạt động mọi thiết bị.
- Analytics (nếu duyệt) chỉ ghi loại CTA, trang và timestamp; không ghi nội dung trao đổi/định danh.

## CMS/admin

Admin API yêu cầu authentication/authorization; role tối thiểu: editor, reviewer, admin. Preview token không xuất hiện trong client bundle hoặc log.

## Lỗi và quan sát

Lỗi public không lộ stack trace, secret hoặc bản ghi CMS. Log kỹ thuật có request ID/context tối thiểu và redaction. Endpoint mới phải ghi auth, input/output, error, rate limit và owner.
