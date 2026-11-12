import { randomUUID } from "node:crypto"
import type { RequestHandler } from "express"
import { LoiUngDung } from "../utils/loi-ung-dung.ts"

/**
 * Gắn request ID và ghi log truy cập tối thiểu khi response kết thúc.
 *
 * Chỉ ghi method, path (không kèm query vì từ khóa tìm kiếm có thể là tên/SĐT),
 * status và thời gian xử lý. Không bao giờ ghi body, cookie hay header xác thực.
 *
 * @param batLog - `false` để tắt log (dùng trong test)
 * @returns Middleware Express
 */
export function ganNguCanhYeuCau(batLog = true): RequestHandler {
  return (req, res, next) => {
    const maYeuCau = randomUUID()
    res.locals.maYeuCau = maYeuCau
    res.setHeader("X-Request-Id", maYeuCau)
    if (batLog) {
      const batDau = process.hrtime.bigint()
      res.on("finish", () => {
        const ms = Number(process.hrtime.bigint() - batDau) / 1e6
        const duongDan = req.originalUrl.split("?")[0]
        console.log(
          `[${maYeuCau}] ${req.method} ${duongDan} ${res.statusCode} ${ms.toFixed(1)}ms`,
        )
      })
    }
    next()
  }
}

/** Method thay đổi dữ liệu cần kiểm tra nguồn gốc request. */
const METHOD_THAY_DOI = new Set(["POST", "PUT", "PATCH", "DELETE"])

/**
 * Chặn request thay đổi dữ liệu đến từ origin lạ (lớp chống CSRF bổ sung cho
 * cookie SameSite và CSRF token). Request không có header Origin (curl, server-to-server)
 * được cho qua; các API dùng session vẫn phải có CSRF token hợp lệ.
 *
 * @param originChoPhep - Danh sách origin hợp lệ, ví dụ `https://innerarchitect.vn`
 * @returns Middleware Express
 * @throws LoiUngDung 403 khi Origin không thuộc danh sách
 */
export function kiemTraNguonGoc(originChoPhep: readonly string[]): RequestHandler {
  const tapOrigin = new Set(originChoPhep)
  return (req, _res, next) => {
    const origin = req.get("origin")
    if (!METHOD_THAY_DOI.has(req.method) || !origin) return next()
    const cungHost = (() => {
      try {
        return new URL(origin).host === req.get("host")
      } catch {
        return false
      }
    })()
    if (tapOrigin.has(origin) || cungHost) return next()
    next(new LoiUngDung(403, "FORBIDDEN", "Nguồn gửi yêu cầu không được phép."))
  }
}
