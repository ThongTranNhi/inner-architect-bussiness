import type { TrangThaiKhachHang } from "./types/quan-tri"

/** Nhãn tiếng Việt cho trạng thái chăm sóc. */
export const NHAN_TRANG_THAI: Record<TrangThaiKhachHang, string> = {
  new: "Khách hàng mới",
  contacted: "Đã liên hệ",
  completed: "Hoàn tất chăm sóc",
}

export const DANH_SACH_TRANG_THAI = Object.keys(NHAN_TRANG_THAI) as TrangThaiKhachHang[]

const dinhDangNgayGio = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

/**
 * Hiển thị thời điểm UTC từ API theo múi giờ Asia/Ho_Chi_Minh.
 *
 * @param iso - Chuỗi ISO 8601 (UTC)
 * @returns Ví dụ `13/11/2026, 01:19`; chuỗi gốc nếu không parse được
 */
export function dinhDangThoiGian(iso: string): string {
  const ngay = new Date(iso)
  return Number.isNaN(ngay.getTime()) ? iso : dinhDangNgayGio.format(ngay)
}
