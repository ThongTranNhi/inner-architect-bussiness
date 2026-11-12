import { z } from "zod"
import { MA_DICH_VU, TRANG_THAI_KHACH_HANG } from "../../utils/dich-vu.ts"

/** Họ tên: chữ cái (mọi ngôn ngữ, kể cả tiếng Việt có dấu), khoảng trắng, `.`, `'`, `-`. */
const MAU_HO_TEN = /^[\p{L}\p{M}](?:[\p{L}\p{M}\s.'-]*[\p{L}\p{M}.])?$/u

/**
 * Số điện thoại sau khi bỏ khoảng trắng, dấu chấm, gạch ngang, ngoặc:
 * - Trong nước: bắt đầu bằng 0, tổng 10–11 chữ số (di động 10 số, cố định 11 số).
 * - Quốc tế: `+` + mã quốc gia (không bắt đầu bằng 0) + tổng 8–15 chữ số (E.164).
 */
const MAU_SO_DIEN_THOAI = /^(?:0\d{9,10}|\+[1-9]\d{7,14})$/

/**
 * Bỏ ký tự phân cách thường gặp khỏi số điện thoại để lưu dạng gọn.
 *
 * @param soDienThoai - Chuỗi người dùng nhập
 * @returns Chuỗi chỉ còn chữ số và dấu `+` đầu (nếu có)
 */
export function chuanHoaSoDienThoai(soDienThoai: string): string {
  return soDienThoai.replace(/[\s.\-()]/g, "")
}

/**
 * Schema biểu mẫu khách hàng gửi từ website. `strictObject` từ chối mọi trường
 * ngoài danh sách — không thu thập thêm dữ liệu (sức khỏe, ghi chú tự do…).
 *
 * `website` là trường bẫy bot (honeypot): người thật không thấy nên luôn rỗng.
 */
export const schemaTaoKhachHang = z.strictObject({
  fullName: z
    .string("Vui lòng nhập họ và tên.")
    .trim()
    .min(2, "Vui lòng nhập họ và tên.")
    .max(150, "Họ và tên tối đa 150 ký tự.")
    .regex(MAU_HO_TEN, "Họ và tên chỉ gồm chữ cái và khoảng trắng."),
  phone: z
    .string("Vui lòng nhập số điện thoại.")
    .trim()
    .min(1, "Vui lòng nhập số điện thoại.")
    .max(30, "Số điện thoại không hợp lệ.")
    .transform(chuanHoaSoDienThoai)
    .refine((so) => MAU_SO_DIEN_THOAI.test(so), "Số điện thoại không hợp lệ."),
  email: z
    .union([
      z.literal(""),
      z.null(),
      z
        .string()
        .trim()
        .max(255, "Email tối đa 255 ký tự.")
        .pipe(z.email("Email không đúng định dạng.")),
    ])
    .optional()
    .transform((email) => (email ? email : null)),
  service: z.enum(MA_DICH_VU, "Vui lòng chọn dịch vụ quan tâm."),
  consent: z.literal(true, "Vui lòng đồng ý để chúng tôi liên hệ lại."),
  website: z.literal("", "Không thể gửi thông tin.").optional(),
})

export type DuLieuTaoKhachHang = z.output<typeof schemaTaoKhachHang>

/** Query danh sách khách hàng ở trang quản trị. */
export const schemaLocKhachHang = z.object({
  q: z.string().trim().max(100, "Từ khóa tối đa 100 ký tự.").optional(),
  service: z.enum(MA_DICH_VU, "Dịch vụ không hợp lệ.").optional(),
  status: z.enum(TRANG_THAI_KHACH_HANG, "Trạng thái không hợp lệ.").optional(),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type BoLocKhachHang = z.output<typeof schemaLocKhachHang>

/** Tham số `:id` trên URL. */
export const schemaMaKhachHang = z.object({
  id: z.coerce
    .number("ID không hợp lệ.")
    .int("ID không hợp lệ.")
    .positive("ID không hợp lệ.")
    .max(Number.MAX_SAFE_INTEGER, "ID không hợp lệ."),
})

/** Body cập nhật trạng thái chăm sóc. */
export const schemaCapNhatTrangThai = z.strictObject({
  status: z.enum(TRANG_THAI_KHACH_HANG, "Trạng thái không hợp lệ."),
})
