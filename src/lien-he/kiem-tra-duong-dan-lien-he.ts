/**
 * Kiểm tra URL kênh liên hệ công khai (Zalo/Facebook) trước khi hiển thị.
 *
 * File này không phụ thuộc Vite hay React để có thể chạy trực tiếp bằng
 * `node --test`. Cấu hình thực tế được đọc ở `src/config/contact.ts`.
 */

export type KenhLienHe = "zalo" | "facebook"

/** Tên miền được phép cho từng kênh; mọi tên miền khác bị từ chối. */
const TEN_MIEN_HOP_LE: Record<KenhLienHe, readonly string[]> = {
  zalo: ["zalo.me", "www.zalo.me"],
  facebook: [
    "facebook.com",
    "www.facebook.com",
    "m.facebook.com",
    "fb.com",
    "m.me",
  ],
}

/**
 * Chuẩn hóa và kiểm tra URL của một kênh liên hệ.
 *
 * Chỉ chấp nhận `https:` và tên miền thuộc danh sách cho phép của kênh, nhằm
 * tránh hiển thị link sai kênh, link giả hoặc giao thức nguy hiểm như
 * `javascript:`. Hàm không ném lỗi: mọi giá trị không hợp lệ đều trả `null`
 * để giao diện hiển thị trạng thái "chưa có kênh" thay vì một link hỏng.
 *
 * @param giaTri - Chuỗi URL thô, thường lấy từ biến môi trường; có thể rỗng
 * @param kenh - Kênh cần kiểm tra (`zalo` hoặc `facebook`)
 * @returns URL đã chuẩn hóa nếu hợp lệ, ngược lại `null`
 */
export function kiemTraDuongDanLienHe(
  giaTri: string | undefined | null,
  kenh: KenhLienHe,
): string | null {
  const chuoi = giaTri?.trim()
  if (!chuoi) return null

  let url: URL
  try {
    url = new URL(chuoi)
  } catch {
    return null
  }

  if (url.protocol !== "https:") return null
  if (url.username || url.password) return null
  if (!TEN_MIEN_HOP_LE[kenh].includes(url.hostname.toLowerCase())) return null
  if (url.pathname === "/" || url.pathname === "") return null

  return url.toString()
}
