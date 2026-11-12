/**
 * `pnpm db:migrate` — áp dụng SQL migration vào database cấu hình trong `.env`.
 * `pnpm db:migrate -- --test` — áp dụng vào database test (`TEST_DB_NAME`).
 *
 * Dùng tài khoản migration (`DB_MIGRATE_USER`) nếu có; tài khoản ứng dụng chỉ có
 * quyền SELECT/INSERT/UPDATE/DELETE. Không bao giờ tạo hoặc xóa database.
 */
import mysql from "mysql2/promise"
import { docCauHinh } from "../src/config/env.ts"
import { apDungMigration } from "../src/utils/migration.ts"

const cauHinh = docCauHinh()
const dungDatabaseTest = process.argv.includes("--test")
const tenDatabase = dungDatabaseTest ? cauHinh.TEST_DB_NAME : cauHinh.DB_NAME

if (!tenDatabase) {
  console.error("Thiếu TEST_DB_NAME trong .env để chạy migration cho database test.")
  process.exit(1)
}

const ketNoi = await mysql
  .createConnection({
    host: cauHinh.DB_HOST,
    port: cauHinh.DB_PORT,
    database: tenDatabase,
    user: cauHinh.DB_MIGRATE_USER ?? cauHinh.DB_USER,
    password: cauHinh.DB_MIGRATE_PASSWORD ?? cauHinh.DB_PASSWORD,
    multipleStatements: true,
    timezone: "Z",
    charset: "utf8mb4_unicode_ci",
  })
  .catch((loi: { code?: string; message: string }) => {
    console.error(`Không kết nối được MySQL (${loi.code ?? loi.message}).`)
    process.exit(1)
  })

try {
  await ketNoi.query("SET time_zone = '+00:00'")
  const vuaApDung = await apDungMigration(ketNoi)
  console.log(
    vuaApDung.length > 0
      ? `Đã áp dụng ${vuaApDung.length} migration vào ${tenDatabase}: ${vuaApDung.join(", ")}`
      : `Database ${tenDatabase} đã ở phiên bản mới nhất.`,
  )
} catch (loi) {
  console.error(loi instanceof Error ? loi.message : loi)
  process.exitCode = 1
} finally {
  await ketNoi.end()
}
