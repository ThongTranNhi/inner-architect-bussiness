import {
  kiemTraDuongDanLienHe,
  type KenhLienHe,
} from "../lien-he/kiem-tra-duong-dan-lien-he"

/**
 * Nguồn duy nhất cho kênh liên hệ công khai của website.
 *
 * URL được cấp qua biến môi trường lúc build (`VITE_CONTACT_ZALO_URL`,
 * `VITE_CONTACT_FACEBOOK_URL`). Khi chưa có URL chính thức đã duyệt
 * (decision-log D01), giá trị là `null` và giao diện hiển thị trạng thái
 * "đang cập nhật" — không tự tạo link thay thế.
 */
export const contactChannels: Record<KenhLienHe, string | null> = {
  zalo: kiemTraDuongDanLienHe(import.meta.env.VITE_CONTACT_ZALO_URL, "zalo"),
  facebook: kiemTraDuongDanLienHe(
    import.meta.env.VITE_CONTACT_FACEBOOK_URL,
    "facebook",
  ),
}

/** Có ít nhất một kênh liên hệ chính thức đã được cấu hình hay chưa. */
export const hasContactChannel = Boolean(
  contactChannels.zalo || contactChannels.facebook,
)
