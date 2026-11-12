import express, { Router, type RequestHandler } from "express"
import type { Pool } from "mysql2/promise"
import { kiemTraKetNoiDatabase } from "../config/database.ts"
import { kiemTraNguonGoc } from "../middleware/request-context.ts"
import type { taoBoGioiHan } from "../middleware/rate-limiter.ts"
import { taoRouterXacThuc } from "../modules/auth/auth.routes.ts"
import {
  taoRouterKhachHangCongKhai,
  taoRouterQuanTriKhachHang,
} from "../modules/customers/customers.routes.ts"

/** Giới hạn kích thước body JSON; biểu mẫu chỉ có bốn trường ngắn. */
export const GIOI_HAN_BODY = "10kb"

/**
 * Router `/api/v1`. Session chỉ gắn cho `/auth` và `/admin`; API công khai
 * (health, gửi biểu mẫu) không tạo hay đọc session.
 *
 * @param tuyChon.pool - Pool MySQL
 * @param tuyChon.session - Middleware express-session đã cấu hình store MySQL
 * @param tuyChon.tenCookie - Tên cookie session
 * @param tuyChon.gioiHan - Bộ rate limiter
 * @param tuyChon.originChoPhep - Origin được phép gửi request thay đổi dữ liệu
 * @returns Router Express
 */
export function taoRouterApiV1(tuyChon: {
  pool: Pool
  session: RequestHandler
  tenCookie: string
  gioiHan: ReturnType<typeof taoBoGioiHan>
  originChoPhep: readonly string[]
}): Router {
  const { pool, session, tenCookie, gioiHan, originChoPhep } = tuyChon
  const router = Router()

  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store")
    next()
  })
  router.use(gioiHan.chung)
  router.use(express.json({ limit: GIOI_HAN_BODY, strict: true }))
  router.use(kiemTraNguonGoc(originChoPhep))

  router.get("/health", async (_req, res) => {
    const databaseOk = await kiemTraKetNoiDatabase(pool)
    res.status(databaseOk ? 200 : 503).json({
      success: databaseOk,
      status: databaseOk ? "ok" : "degraded",
      database: databaseOk ? "ok" : "unavailable",
    })
  })

  router.use("/customers", taoRouterKhachHangCongKhai(pool, gioiHan.bieuMau))
  router.use("/auth", session, taoRouterXacThuc(pool, gioiHan.dangNhap, tenCookie))
  router.use("/admin", session, taoRouterQuanTriKhachHang(pool))

  return router
}
