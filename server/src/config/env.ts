import { existsSync } from "node:fs"
import path from "node:path"
import { z } from "zod"
import { thuMucGocServer } from "../utils/duong-dan.ts"

/** Chuỗi "true"/"false" từ biến môi trường → boolean. */
const boolTuChuoi = z
  .enum(["true", "false", "1", "0"])
  .default("false")
  .transform((giaTri) => giaTri === "true" || giaTri === "1")

const schemaMoiTruong = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  HOST: z.string().min(1).default("127.0.0.1"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),

  DB_HOST: z.string().min(1).default("127.0.0.1"),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  DB_NAME: z.string().regex(/^[A-Za-z0-9_]+$/, "DB_NAME chỉ gồm chữ, số, _"),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD bắt buộc"),
  DB_CONNECTION_LIMIT: z.coerce.number().int().min(1).max(50).default(10),

  DB_MIGRATE_USER: z.string().min(1).optional(),
  DB_MIGRATE_PASSWORD: z.string().min(1).optional(),
  TEST_DB_NAME: z
    .string()
    .regex(/^[A-Za-z0-9_]+$/)
    .optional(),

  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET cần tối thiểu 32 ký tự ngẫu nhiên"),
  SESSION_MAX_AGE_HOURS: z.coerce.number().min(1).max(72).default(8),
  ADMIN_UNLOCK_PIN: z.string().regex(/^[0-9]{6,8}$/, "PIN cần có 6–8 chữ số").optional(),

  ALLOWED_ORIGINS: z
    .string()
    .default("")
    .transform((chuoi) =>
      chuoi
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
    ),
  TRUST_PROXY: boolTuChuoi,

  // Thư mục lưu ảnh Journal tải lên. Production: thư mục dữ liệu bền vững NGOÀI thư mục
  // từng bản phát hành (vd. /var/lib/inner-architect/uploads/journal) và có trong backup.
  // Bỏ trống (hoặc chuỗi rỗng trong .env) = server/storage/journal, chỉ dùng khi dev.
  JOURNAL_UPLOAD_DIR: z
    .string()
    .optional()
    .transform((thuMuc) => path.resolve(thuMuc?.trim() || path.join(thuMucGocServer(), "storage", "journal"))),
  // Dung lượng tối đa mỗi ảnh (MB). Nginx `client_max_body_size` cho /api/v1/admin/journal/media phải >= giá trị này.
  JOURNAL_MAX_UPLOAD_MB: z.coerce.number().int().min(1).max(20).default(5),
  // Địa chỉ công khai của website, dùng để tạo sitemap.xml.
  SITE_URL: z
    .url({ protocol: /^https?$/, error: "SITE_URL phải là URL http(s)" })
    .default("http://localhost:8443")
    .transform((url) => url.replace(/\/+$/, "")),
})

/** Cấu hình đã kiểm tra của backend. */
export type CauHinh = z.infer<typeof schemaMoiTruong>

/**
 * Nạp `server/.env` (nếu có) vào `process.env` rồi kiểm tra bằng Zod.
 * Biến đã có sẵn trong môi trường (systemd, CI) được ưu tiên hơn file.
 *
 * @param nguon - Bộ biến môi trường cần kiểm tra; mặc định `process.env`
 * @returns Cấu hình đã kiểm tra và chuẩn hóa kiểu
 * @throws Error liệt kê tên biến sai/thiếu (không in giá trị) khi cấu hình không hợp lệ
 */
export function docCauHinh(nguon: NodeJS.ProcessEnv = process.env): CauHinh {
  const tepEnv = path.join(thuMucGocServer(), ".env")
  if (nguon === process.env && existsSync(tepEnv)) process.loadEnvFile(tepEnv)

  const ketQua = schemaMoiTruong.safeParse(nguon)
  if (!ketQua.success) {
    const chiTiet = ketQua.error.issues
      .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")
    throw new Error(`Cấu hình môi trường không hợp lệ:\n${chiTiet}`)
  }
  return ketQua.data
}
