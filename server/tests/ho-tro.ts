/**
 * Tiện ích dùng chung cho test tích hợp: cấu hình trỏ vào database test riêng
 * (`TEST_DB_NAME`), áp dụng migration, dọn dữ liệu và tạo tài khoản thử.
 * Toàn bộ dữ liệu là dữ liệu giả; không dùng thông tin khách hàng thật.
 */
import mysql, { type Pool } from "mysql2/promise"
import { taoUngDung } from "../src/app.ts"
import { taoPoolKetNoi } from "../src/config/database.ts"
import { docCauHinh, type CauHinh } from "../src/config/env.ts"
import type { CauHinhGioiHan } from "../src/middleware/rate-limiter.ts"
import { themQuanTriVien } from "../src/modules/auth/auth.repository.ts"
import { bamMatKhau } from "../src/modules/auth/mat-khau.ts"
import type { VaiTroQuanTri } from "../src/utils/dich-vu.ts"
import { apDungMigration } from "../src/utils/migration.ts"

/** Mật khẩu chỉ dùng trong test, không phải tài khoản thật. */
export const MAT_KHAU_THU = "mat-khau-chi-dung-trong-test-123"

/**
 * Đọc cấu hình và thay tên database bằng database test.
 *
 * @returns Cấu hình test, hoặc `null` nếu chưa cấu hình `.env`/`TEST_DB_NAME`
 */
export function docCauHinhTest(): CauHinh | null {
  try {
    const cauHinh = docCauHinh()
    if (!cauHinh.TEST_DB_NAME) return null
    return { ...cauHinh, NODE_ENV: "test", DB_NAME: cauHinh.TEST_DB_NAME }
  } catch {
    return null
  }
}

/**
 * Kiểm tra database test có kết nối được không (để bỏ qua test tích hợp thay vì báo lỗi giả).
 *
 * @param cauHinh - Cấu hình test
 * @returns `true` nếu kết nối được
 */
export async function coDatabaseTest(cauHinh: CauHinh | null): Promise<boolean> {
  if (!cauHinh) return false
  try {
    const ketNoi = await mysql.createConnection({
      host: cauHinh.DB_HOST,
      port: cauHinh.DB_PORT,
      user: cauHinh.DB_USER,
      password: cauHinh.DB_PASSWORD,
      database: cauHinh.DB_NAME,
      connectTimeout: 2000,
    })
    await ketNoi.end()
    return true
  } catch {
    return false
  }
}

/**
 * Áp dụng migration vào database test bằng tài khoản migration.
 *
 * @param cauHinh - Cấu hình test
 */
export async function chuanBiSchemaTest(cauHinh: CauHinh): Promise<void> {
  const ketNoi = await mysql.createConnection({
    host: cauHinh.DB_HOST,
    port: cauHinh.DB_PORT,
    user: cauHinh.DB_MIGRATE_USER ?? cauHinh.DB_USER,
    password: cauHinh.DB_MIGRATE_PASSWORD ?? cauHinh.DB_PASSWORD,
    database: cauHinh.DB_NAME,
    multipleStatements: true,
  })
  try {
    await apDungMigration(ketNoi)
  } finally {
    await ketNoi.end()
  }
}

/**
 * Xóa toàn bộ dữ liệu nghiệp vụ trong database test (DELETE, không DROP/TRUNCATE).
 *
 * @param pool - Pool tới database test
 */
export async function donDuLieuTest(pool: Pool): Promise<void> {
  if (!(await pool.query<mysql.RowDataPacket[]>("SELECT DATABASE() AS db"))[0][0]?.db?.includes("test"))
    throw new Error("Từ chối dọn dữ liệu: database hiện tại không phải database test.")
  await pool.query("DELETE FROM sessions")
  await pool.query("DELETE FROM customers")
  await pool.query("DELETE FROM admins")
}

/**
 * Tạo tài khoản thử với mật khẩu `MAT_KHAU_THU`.
 *
 * @param pool - Pool tới database test
 * @param username - Username
 * @param role - Vai trò
 * @returns ID tài khoản
 */
export async function taoTaiKhoanThu(
  pool: Pool,
  username: string,
  role: VaiTroQuanTri = "customer_care",
): Promise<number> {
  return themQuanTriVien(pool, {
    username,
    displayName: `Tài khoản thử ${username}`,
    role,
    passwordHash: await bamMatKhau(MAT_KHAU_THU),
  })
}

/**
 * Dựng ứng dụng test với pool riêng, tắt log.
 *
 * @param cauHinh - Cấu hình test
 * @param gioiHan - Ngưỡng rate limit tùy chỉnh
 * @returns App, pool và hàm dọn tài nguyên
 */
export function taoUngDungTest(cauHinh: CauHinh, gioiHan?: CauHinhGioiHan) {
  const pool = taoPoolKetNoi(cauHinh, { connectionLimit: 5 })
  const { app, dong } = taoUngDung({ pool, cauHinh, gioiHan, batLog: false })
  return {
    app,
    pool,
    dongTatCa: async () => {
      await dong()
      await pool.end()
    },
  }
}

/** Dữ liệu biểu mẫu hợp lệ (giả). */
export const KHACH_HANG_MAU = {
  fullName: "Nguyễn Thị Mẫu",
  phone: "0901234567",
  email: "khach.mau@example.com",
  service: "tarot",
  consent: true,
} as const
