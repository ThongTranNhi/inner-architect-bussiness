import { createHash } from "node:crypto"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import type { Connection, RowDataPacket } from "mysql2/promise"
import { thuMucGocServer } from "./duong-dan.ts"

/** Tên file migration hợp lệ: `001_mo_ta.sql`. */
const MAU_TEN_MIGRATION = /^\d{3}_[a-z0-9_]+\.sql$/

/** Câu lệnh phá hủy bị chặn trong migration (không drop database/bảng đang có dữ liệu). */
const MAU_CAU_LENH_CAM = /\b(DROP\s+(DATABASE|SCHEMA|TABLE)|TRUNCATE)\b/i

/** Thư mục chứa file `.sql` migration. */
export function thuMucMigration(): string {
  return path.join(thuMucGocServer(), "database", "migrations")
}

/**
 * Áp dụng các migration chưa chạy theo thứ tự tên file và ghi vào `schema_migrations`.
 *
 * - Migration đã chạy được kiểm tra checksum; file bị sửa sau khi chạy sẽ báo lỗi
 *   thay vì âm thầm bỏ qua.
 * - Chặn `DROP DATABASE/TABLE` và `TRUNCATE` để không làm mất dữ liệu.
 * - Kết nối phải bật `multipleStatements` (chỉ dùng cho migration, không dùng ở API).
 *
 * @param ketNoi - Kết nối MySQL tới database đích
 * @param thuMuc - Thư mục migration (mặc định `server/database/migrations`)
 * @returns Danh sách tên file vừa áp dụng
 * @throws Error khi checksum lệch, có câu lệnh bị cấm hoặc SQL lỗi
 */
export async function apDungMigration(
  ketNoi: Connection,
  thuMuc = thuMucMigration(),
): Promise<string[]> {
  await ketNoi.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) NOT NULL PRIMARY KEY,
      checksum CHAR(64) NOT NULL,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

  const [daChay] = await ketNoi.query<(RowDataPacket & { version: string; checksum: string })[]>(
    "SELECT version, checksum FROM schema_migrations",
  )
  const checksumDaChay = new Map(daChay.map((dong) => [dong.version, dong.checksum]))

  const danhSachFile = readdirSync(thuMuc)
    .filter((ten) => MAU_TEN_MIGRATION.test(ten))
    .sort()
  const vuaApDung: string[] = []

  for (const ten of danhSachFile) {
    const sql = readFileSync(path.join(thuMuc, ten), "utf8")
    const checksum = createHash("sha256").update(sql).digest("hex")
    const checksumCu = checksumDaChay.get(ten)
    if (checksumCu) {
      if (checksumCu !== checksum)
        throw new Error(
          `Migration ${ten} đã chạy nhưng nội dung file đã bị sửa. Tạo migration mới thay vì sửa file cũ.`,
        )
      continue
    }
    const sqlKhongChuThich = sql.replace(/--.*$/gm, "")
    if (MAU_CAU_LENH_CAM.test(sqlKhongChuThich))
      throw new Error(`Migration ${ten} chứa câu lệnh phá hủy bị chặn (DROP/TRUNCATE).`)

    await ketNoi.query(sql)
    await ketNoi.execute("INSERT INTO schema_migrations (version, checksum) VALUES (?, ?)", [
      ten,
      checksum,
    ])
    vuaApDung.push(ten)
  }
  return vuaApDung
}
