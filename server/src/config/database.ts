import mysql, { type Pool, type PoolOptions } from "mysql2/promise"
import type { CauHinh } from "./env.ts"

/**
 * Tạo connection pool MySQL dùng chung cho toàn bộ backend.
 *
 * - `timezone: "Z"` + `SET time_zone = '+00:00'` để DATETIME luôn là UTC ở cả
 *   phía Node lẫn `CURRENT_TIMESTAMP` của MySQL.
 * - Không bật `multipleStatements` (giảm bề mặt SQL injection); mọi truy vấn
 *   dùng prepared statement qua `pool.execute`.
 *
 * @param cauHinh - Cấu hình kết nối đã kiểm tra
 * @param ghiDe - Tùy chọn ghi đè (vd. tên database test, user migration)
 * @returns Pool mysql2/promise
 */
export function taoPoolKetNoi(
  cauHinh: CauHinh,
  ghiDe: Partial<PoolOptions> = {},
): Pool {
  const pool = mysql.createPool({
    host: cauHinh.DB_HOST,
    port: cauHinh.DB_PORT,
    database: cauHinh.DB_NAME,
    user: cauHinh.DB_USER,
    password: cauHinh.DB_PASSWORD,
    connectionLimit: cauHinh.DB_CONNECTION_LIMIT,
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 5000,
    charset: "utf8mb4_unicode_ci",
    timezone: "Z",
    dateStrings: false,
    ...ghiDe,
  })
  pool.on("connection", (ketNoi) => {
    ketNoi.query("SET time_zone = '+00:00'")
  })
  return pool
}

/**
 * Kiểm tra pool có kết nối được MySQL hay không.
 *
 * @param pool - Pool cần kiểm tra
 * @returns `true` nếu `SELECT 1` thành công, ngược lại `false` (không ném lỗi)
 */
export async function kiemTraKetNoiDatabase(pool: Pool): Promise<boolean> {
  try {
    await pool.query("SELECT 1")
    return true
  } catch {
    return false
  }
}
