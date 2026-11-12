import { DANH_SACH_DICH_VU_LIEN_HE } from "./dich-vu-lien-he.ts"

/**
 * Kiểm tra biểu mẫu liên hệ phía trình duyệt để báo lỗi ngay tại trường.
 *
 * Đây chỉ là lớp trải nghiệm; backend (`server/src/modules/customers/customers.schema.ts`)
 * luôn kiểm tra lại. Quy tắc giữ khớp với backend — test phía server chạy cùng bộ mẫu
 * qua cả hai hàm để phát hiện lệch.
 */

/** Dữ liệu người dùng nhập trên biểu mẫu. */
export type DuLieuBieuMauLienHe = {
  fullName: string
  phone: string
  email: string
  service: string
  consent: boolean
}

export type TruongBieuMau = keyof DuLieuBieuMauLienHe

/** Lỗi theo từng trường; trường hợp lệ không có khóa. */
export type LoiBieuMau = Partial<Record<TruongBieuMau, string>>

const MAU_HO_TEN = /^[\p{L}\p{M}](?:[\p{L}\p{M}\s.'-]*[\p{L}\p{M}.])?$/u
const MAU_SO_DIEN_THOAI = /^(?:0\d{9,10}|\+[1-9]\d{7,14})$/
// Kiểm tra email cơ bản phía client; định dạng chuẩn do backend quyết định.
const MAU_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Kiểm tra toàn bộ biểu mẫu.
 *
 * @param duLieu - Giá trị hiện tại của các trường
 * @returns Lỗi theo trường (đối tượng rỗng nếu hợp lệ)
 */
export function kiemTraBieuMauLienHe(duLieu: DuLieuBieuMauLienHe): LoiBieuMau {
  const loi: LoiBieuMau = {}
  const hoTen = duLieu.fullName.trim()
  if (hoTen.length < 2) loi.fullName = "Vui lòng nhập họ và tên."
  else if (hoTen.length > 150) loi.fullName = "Họ và tên tối đa 150 ký tự."
  else if (!MAU_HO_TEN.test(hoTen)) loi.fullName = "Họ và tên chỉ gồm chữ cái và khoảng trắng."

  const soDienThoai = duLieu.phone.trim()
  if (!soDienThoai) loi.phone = "Vui lòng nhập số điện thoại."
  else if (
    soDienThoai.length > 30 ||
    !MAU_SO_DIEN_THOAI.test(soDienThoai.replace(/[\s.\-()]/g, ""))
  )
    loi.phone = "Số điện thoại không hợp lệ."

  const email = duLieu.email.trim()
  if (email && (email.length > 255 || !MAU_EMAIL.test(email)))
    loi.email = "Email không đúng định dạng."

  if (!DANH_SACH_DICH_VU_LIEN_HE.some((dichVu) => dichVu.ma === duLieu.service))
    loi.service = "Vui lòng chọn dịch vụ quan tâm."

  if (duLieu.consent !== true) loi.consent = "Vui lòng đồng ý để chúng tôi liên hệ lại."
  return loi
}
