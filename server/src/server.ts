import { taoUngDung } from "./app.ts"
import { kiemTraKetNoiDatabase, taoPoolKetNoi } from "./config/database.ts"
import { docCauHinh } from "./config/env.ts"

/**
 * Điểm khởi động backend: đọc cấu hình, tạo pool, listen và tắt êm khi nhận
 * SIGINT/SIGTERM (đóng HTTP server, session store rồi pool MySQL).
 *
 * @returns Promise hoàn tất khi server đã listen
 */
async function khoiDong(): Promise<void> {
  const cauHinh = docCauHinh()
  const pool = taoPoolKetNoi(cauHinh)

  if (!(await kiemTraKetNoiDatabase(pool)))
    console.warn(
      "Cảnh báo: chưa kết nối được MySQL. API vẫn chạy và trả 503 cho đến khi database sẵn sàng.",
    )

  const { app, dong } = taoUngDung({ pool, cauHinh })
  const server = app.listen(cauHinh.PORT, cauHinh.HOST, () => {
    console.log(
      `INNER ARCHITECT API (${cauHinh.NODE_ENV}) đang chạy tại http://${cauHinh.HOST}:${cauHinh.PORT}/api/v1`,
    )
  })
  server.on("error", (loi) => {
    console.error(`Không thể khởi động server: ${loi.message}`)
    process.exit(1)
  })

  let dangTat = false
  const tatEm = (tinHieu: string) => {
    if (dangTat) return
    dangTat = true
    console.log(`Nhận ${tinHieu}, đang dừng server…`)
    server.close(async () => {
      await dong().catch(() => undefined)
      await pool.end().catch(() => undefined)
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000).unref()
  }
  process.on("SIGINT", () => tatEm("SIGINT"))
  process.on("SIGTERM", () => tatEm("SIGTERM"))
}

khoiDong().catch((loi: unknown) => {
  console.error(loi instanceof Error ? loi.message : loi)
  process.exit(1)
})
