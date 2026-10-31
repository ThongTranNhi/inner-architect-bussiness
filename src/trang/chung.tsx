import { contactChannels, hasContactChannel } from "../config/contact"
import { Link } from "../dieu-huong"

export function PageHero({
  eyebrow,
  title,
  italic,
  intro,
}: {
  eyebrow: string
  title: string
  italic?: string
  intro: string
}) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="serif">
        {title}
        {italic && <em>{italic}</em>}
      </h1>
      <p>{intro}</p>
    </section>
  )
}

/** Email liên hệ dự phòng đang dùng trong nội dung hiện có (chờ xác nhận). */
export const EMAIL_LIEN_HE = "info@innerarchitect.vn"

/**
 * Hiển thị nút mở Zalo/Facebook chung, hoặc trạng thái "đang cập nhật"
 * khi chưa có URL chính thức.
 *
 * Không tạo link thay thế khi thiếu cấu hình. Link ngoài mở tab mới với
 * `rel="noopener noreferrer"`; website không gửi bất kỳ dữ liệu nào kèm theo.
 *
 * @returns Nhóm nút kênh liên hệ hoặc thông báo trạng thái
 */
export function KenhLienHeChung() {
  if (!hasContactChannel)
    return (
      <p role="status">
        <strong>Kênh Zalo / Facebook chính thức đang được cập nhật.</strong>
        <br />
        Trong thời gian này, bạn có thể gửi email tới{" "}
        <a className="underlink" href={`mailto:${EMAIL_LIEN_HE}`}>
          {EMAIL_LIEN_HE}
        </a>
        .
      </p>
    )
  return (
    <div className="program-actions">
      {contactChannels.zalo && (
        <a
          className="button-link"
          href={contactChannels.zalo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Nhắn qua Zalo →
        </a>
      )}
      {contactChannels.facebook && (
        <a
          className="underlink"
          href={contactChannels.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          Nhắn qua Facebook →
        </a>
      )}
    </div>
  )
}

// Kiểu props đặt tên riêng: oxfmt 0.2.0 gộp kiểu inline ngắn thành một dòng rồi bỏ `;`.
export type ParentLinkProps = {
  to: string
  label: string
}

export function ParentLink({ to, label }: ParentLinkProps) {
  return (
    <div className="parent-link">
      <Link to={to}>← {label}</Link>
    </div>
  )
}
