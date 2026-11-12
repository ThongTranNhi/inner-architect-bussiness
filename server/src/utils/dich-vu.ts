/**
 * Mã dịch vụ khách hàng có thể chọn trên biểu mẫu liên hệ.
 *
 * Phải trùng thứ tự và giá trị với `src/lien-he/dich-vu-lien-he.ts` ở frontend;
 * test `tests/dong-bo-frontend.test.ts` sẽ báo lỗi nếu hai danh sách lệch nhau.
 * Không tự thêm dịch vụ mới khi chưa được PM/chủ thương hiệu xác nhận.
 */
export const MA_DICH_VU = [
  "tea",
  "tarot",
  "healing",
  "workshop",
  "academy",
  "products",
  "other",
] as const

export type MaDichVu = (typeof MA_DICH_VU)[number]

/** Trạng thái chăm sóc khách hàng; chỉ đổi khi nhân viên thao tác xác nhận. */
export const TRANG_THAI_KHACH_HANG = ["new", "contacted", "completed"] as const

export type TrangThaiKhachHang = (typeof TRANG_THAI_KHACH_HANG)[number]

/** Vai trò tài khoản nội bộ. */
export const VAI_TRO_QUAN_TRI = ["admin", "customer_care"] as const

export type VaiTroQuanTri = (typeof VAI_TRO_QUAN_TRI)[number]
