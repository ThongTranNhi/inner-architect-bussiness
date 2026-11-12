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
/** Số điện thoại hotline / Zalo tiếp nhận liên hệ chính thức */
export const SO_DIEN_THOAI_ZALO = "0868 554 141"

export const contactChannels: Record<KenhLienHe, string | null> = {
  zalo: kiemTraDuongDanLienHe(
    import.meta.env.VITE_CONTACT_ZALO_URL || "https://zalo.me/0868554141",
    "zalo",
  ),
  facebook: kiemTraDuongDanLienHe(
    import.meta.env.VITE_CONTACT_FACEBOOK_URL ||
      "https://www.facebook.com/profile.php?id=61595962709692",
    "facebook",
  ),
}

/** Có ít nhất một kênh liên hệ chính thức đã được cấu hình hay chưa. */
export const hasContactChannel = Boolean(
  contactChannels.zalo || contactChannels.facebook,
)
