import express, { Router, type RequestHandler } from "express"
import type { Pool } from "mysql2/promise"
import { kiemTraKetNoiDatabase } from "../config/database.ts"
import { kiemTraNguonGoc } from "../middleware/request-context.ts"
import type { taoBoGioiHan } from "../middleware/rate-limiter.ts"
import { taoRouterXacThuc } from "../modules/auth/auth.routes.ts"
import { taoRouterBaoMatTaiKhoan } from "../modules/auth/bao-mat-tai-khoan.routes.ts"
import { taoDichVuPin } from "../modules/auth/pin-mo-khoa.ts"
import type { GhiNhatKyBaoMat } from "../utils/nhat-ky-bao-mat.ts"
import {
  taoRouterKhachHangCongKhai,
  taoRouterQuanTriKhachHang,
} from "../modules/customers/customers.routes.ts"
import { taoRouterJournalCongKhai, taoRouterQuanTriJournal } from "../modules/journal/journal.routes.ts"

/** Giới hạn kích thước body JSON; biểu mẫu chỉ có bốn trường ngắn. */
export const GIOI_HAN_BODY = "10kb"

/**
 * Router `/api/v1`. Session chỉ gắn cho `/auth`, `/account` và `/admin`; API công khai
 * (health, gửi biểu mẫu, đọc Journal) không tạo hay đọc session.
 *
 * @param tuyChon.pool - Pool MySQL
 * @param tuyChon.session - Middleware express-session đã cấu hình store MySQL
 * @param tuyChon.tenCookie - Tên cookie session
 * @param tuyChon.gioiHan - Bộ rate limiter
 * @param tuyChon.originChoPhep - Origin được phép gửi request thay đổi dữ liệu
 * @param tuyChon.pinKhoiTao - `ADMIN_UNLOCK_PIN`: PIN khởi tạo khi MySQL chưa có PIN
 * @param tuyChon.ghiNhatKyBaoMat - Ghi nhật ký đổi PIN / mật khẩu (không chứa bí mật)
 * @param tuyChon.thuMucAnhJournal - Thư mục lưu ảnh Journal tải lên
 * @param tuyChon.dungLuongAnhToiDa - Số byte tối đa mỗi ảnh Journal
 * @returns Router Express
 */
export function taoRouterApiV1(tuyChon: {
  pool: Pool
  session: RequestHandler
  tenCookie: string
  gioiHan: ReturnType<typeof taoBoGioiHan>
  originChoPhep: readonly string[]
  pinKhoiTao?: string
  ghiNhatKyBaoMat: GhiNhatKyBaoMat
  thuMucAnhJournal: string
  dungLuongAnhToiDa: number
}): Router {
  const { pool, session, tenCookie, gioiHan, originChoPhep } = tuyChon
  const router = Router()
  const dichVuPin = taoDichVuPin(pool, tuyChon.pinKhoiTao)

  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store")
    next()
  })
  router.use(kiemTraNguonGoc(originChoPhep))
  // Quản trị Journal có parser riêng (nội dung bài tới 1 MB, ảnh dạng nhị phân) và giới hạn
  // tần suất riêng nên được gắn trước giới hạn chung và parser JSON 10 KB dùng chung;
  // xác thực + quyền + CSRF chạy trước khi đọc body.
  router.use(
    "/admin/journal",
    gioiHan.quanTriJournal,
    session,
    taoRouterQuanTriJournal({
      pool,
      thuMucAnh: tuyChon.thuMucAnhJournal,
      dungLuongAnhToiDa: tuyChon.dungLuongAnhToiDa,
      ghiNhatKy: tuyChon.ghiNhatKyBaoMat,
    }),
  )
  router.use(gioiHan.chung)
  router.use(express.json({ limit: GIOI_HAN_BODY, strict: true }))

  router.get("/health", async (_req, res) => {
    const databaseOk = await kiemTraKetNoiDatabase(pool)
    res.status(databaseOk ? 200 : 503).json({
      success: databaseOk,
      status: databaseOk ? "ok" : "degraded",
      database: databaseOk ? "ok" : "unavailable",
    })
  })

  router.use("/customers", taoRouterKhachHangCongKhai(pool, gioiHan.bieuMau))
  router.use("/journal", taoRouterJournalCongKhai(pool))
  router.use(
    "/auth",
    session,
    taoRouterXacThuc({
      pool,
      gioiHanDangNhap: gioiHan.dangNhap,
      kiemTraKhoaDangNhap: gioiHan.kiemTraKhoaDangNhap,
      tenCookie,
      dichVuPin,
    }),
  )
  router.use(
    "/account",
    session,
    taoRouterBaoMatTaiKhoan({
      pool,
      dichVuPin,
      gioiHanXacMinh: gioiHan.xacMinh,
      tenCookie,
      ghiNhatKy: tuyChon.ghiNhatKyBaoMat,
    }),
  )
  router.use("/admin", session, taoRouterQuanTriKhachHang(pool, tuyChon.ghiNhatKyBaoMat))

  return router
}
