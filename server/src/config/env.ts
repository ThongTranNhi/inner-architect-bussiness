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
