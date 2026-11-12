/** Kiểu dữ liệu dùng chung cho trang quản trị Customer Care (khớp API `/api/v1`). */

export type VaiTroQuanTri = "admin" | "customer_care"

export type TrangThaiKhachHang = "new" | "contacted" | "completed"

/** Tài khoản đang đăng nhập (không có mật khẩu). */
export type QuanTriVien = {
  id: number
  username: string
  displayName: string
  role: VaiTroQuanTri
}

/** Bản ghi khách hàng; thời gian là chuỗi ISO 8601 UTC. */
export type KhachHang = {
  id: number
  fullName: string
  phone: string
  email: string | null
  service: string
  source: string
  status: TrangThaiKhachHang
  consentAt: string
  createdAt: string
  updatedAt: string
}

export type PhanTrang = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type BoLocKhachHang = {
  q: string
  service: string
  status: string
  page: number
}

export type ThongKeKhachHang = {
  total: number
  new: number
  contacted: number
  completed: number
}
