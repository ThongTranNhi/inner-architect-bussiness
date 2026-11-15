import { z } from "zod"
import { laDuongDanAnhHopLe } from "./noi-dung.ts"

/** Slug URL: chữ thường không dấu, số, gạch nối. */
export const MAU_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** ID số nguyên dương trong params. */
export const schemaMa = z.strictObject({
  id: z.coerce.number("ID không hợp lệ.").int("ID không hợp lệ.").positive("ID không hợp lệ."),
})

/** Slug bài viết trong URL công khai. */
export const schemaSlug = z.strictObject({
  slug: z.string().max(160).regex(MAU_SLUG, "Đường dẫn bài viết không hợp lệ."),
})

const soPhienBan = z
  .number("Thiếu phiên bản dữ liệu.")
  .int("Phiên bản dữ liệu không hợp lệ.")
  .positive("Phiên bản dữ liệu không hợp lệ.")

/** Chuỗi tùy chọn: chuỗi rỗng sau trim được lưu là `null`. */
const chuoiTuyChon = (toiDa: number, thongDiep: string) =>
  z
    .string()
    .trim()
    .max(toiDa, thongDiep)
    .nullish()
    .transform((giaTri) => (giaTri ? giaTri : null))

/** Đường dẫn ảnh: ảnh tải lên thư viện Journal hoặc ảnh tĩnh của website; `null` = không có. */
const duongDanAnh = z
  .string()
  .nullish()
  .transform((giaTri) => (giaTri ? giaTri : null))
  .refine((giaTri) => giaTri === null || laDuongDanAnhHopLe(giaTri), "Ảnh phải được chọn từ thư viện ảnh Journal.")

const truongChuyenMuc = {
  name: z.string("Vui lòng nhập tên chuyên mục.").trim().min(1, "Vui lòng nhập tên chuyên mục.").max(150, "Tên chuyên mục tối đa 150 ký tự."),
  englishName: chuoiTuyChon(150, "Tên tiếng Anh tối đa 150 ký tự."),
  label: chuoiTuyChon(80, "Nhãn ngắn tối đa 80 ký tự."),
  description: z.string().trim().max(600, "Mô tả tối đa 600 ký tự.").default(""),
  image: duongDanAnh,
  isPublic: z.boolean("Trạng thái công khai không hợp lệ."),
}

/** Tạo chuyên mục. */
export const schemaTaoChuyenMuc = z.strictObject(truongChuyenMuc)

/** Sửa chuyên mục (kèm phiên bản để phát hiện ghi đè). */
export const schemaSuaChuyenMuc = z.strictObject({ ...truongChuyenMuc, version: soPhienBan })

const truongBai = {
  title: z.string("Vui lòng nhập tiêu đề.").trim().min(1, "Vui lòng nhập tiêu đề.").max(255, "Tiêu đề tối đa 255 ký tự."),
  summary: z.string().trim().max(1000, "Đoạn giới thiệu tối đa 1000 ký tự.").default(""),
  categoryId: z.number("Vui lòng chọn chuyên mục.").int().positive("Vui lòng chọn chuyên mục."),
  coverImage: duongDanAnh,
  coverAlt: chuoiTuyChon(255, "Mô tả ảnh bìa tối đa 255 ký tự."),
  // Kiểm tra chi tiết bằng `chuanHoaNoiDung` (cần thông điệp lỗi theo cấu trúc cây).
  content: z.unknown(),
}

/** Tạo bài viết mới (bản nháp). */
export const schemaTaoBai = z.strictObject({
  ...truongBai,
  slug: z
    .string()
    .trim()
    .max(160, "Đường dẫn tối đa 160 ký tự.")
    .regex(MAU_SLUG, "Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch nối.")
    .optional(),
})

/** Lưu nháp bài viết. */
export const schemaLuuBai = z.strictObject({ ...truongBai, version: soPhienBan })

/** Thao tác chỉ cần phiên bản: xuất bản, gỡ xuất bản, bỏ thay đổi nháp. */
export const schemaPhienBan = z.strictObject({ version: soPhienBan })

/** Chuyển bài sang chuyên mục khác (áp dụng ngay cho cả bản công khai). */
export const schemaChuyenMucBai = z.strictObject({
  version: soPhienBan,
  categoryId: z.number("Vui lòng chọn chuyên mục.").int().positive("Vui lòng chọn chuyên mục."),
})

/** Bật/tắt bài tiêu biểu. */
export const schemaTieuBieu = z.strictObject({
  version: soPhienBan,
  featured: z.boolean("Giá trị tiêu biểu không hợp lệ."),
})

/** Thứ tự mới: danh sách ID theo thứ tự hiển thị. */
export const schemaThuTu = z.strictObject({
  ids: z
    .array(z.number().int().positive(), "Danh sách thứ tự không hợp lệ.")
    .min(1, "Danh sách thứ tự trống.")
    .max(2000, "Danh sách thứ tự quá dài.")
    .refine((ds) => new Set(ds).size === ds.length, "Danh sách thứ tự có ID trùng."),
})

/** Lọc danh sách bài trong trang quản trị. */
export const schemaLocBai = z.strictObject({
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(["draft", "published", "changed"], "Trạng thái lọc không hợp lệ.").optional(),
})

/** Phân trang thư viện ảnh. */
export const schemaThuVienAnh = z.strictObject({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
})

/** Cấp / thu hồi quyền Journal cho nhân viên. */
export const schemaQuyenJournal = z.strictObject({
  canManageJournal: z.boolean("Giá trị quyền không hợp lệ."),
})
