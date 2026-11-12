import type { ErrorRequestHandler, RequestHandler } from "express"
import { LoiUngDung } from "../utils/loi-ung-dung.ts"

/** Mã lỗi mysql2/Node cho thấy database tạm thời không khả dụng → 503. */
const MA_LOI_DATABASE_KHONG_KHA_DUNG = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EHOSTUNREACH",
  "PROTOCOL_CONNECTION_LOST",
  "POOL_CLOSED",
  "ER_CON_COUNT_ERROR",
  "ER_ACCESS_DENIED_ERROR",
  "ER_BAD_DB_ERROR",
  "ER_DBACCESS_DENIED_ERROR",
  "ER_LOCK_WAIT_TIMEOUT",
])

/**
 * Lấy thuộc tính `code`/`type`/`status` từ lỗi không rõ kiểu một cách an toàn.
 *
 * @param loi - Giá trị bị ném
 * @returns Các trường có thể có (chuỗi/số) hoặc `undefined`
 */
function docThuocTinhLoi(loi: unknown): {
  code?: string
  type?: string
  status?: number
} {
  if (typeof loi !== "object" || loi === null) return {}
  const banGhi = loi as Record<string, unknown>
  return {
    code: typeof banGhi.code === "string" ? banGhi.code : undefined,
    type: typeof banGhi.type === "string" ? banGhi.type : undefined,
    status: typeof banGhi.status === "number" ? banGhi.status : undefined,
  }
}

/**
 * Xác định lỗi có phải do MySQL không khả dụng (kể cả lỗi bọc trong AggregateError).
 *
 * @param loi - Giá trị bị ném
 * @returns `true` nếu nên trả 503
 */
export function laLoiDatabaseKhongKhaDung(loi: unknown): boolean {
  const { code } = docThuocTinhLoi(loi)
  if (code && MA_LOI_DATABASE_KHONG_KHA_DUNG.has(code)) return true
  if (loi instanceof AggregateError)
    return loi.errors.some((con) => laLoiDatabaseKhongKhaDung(con))
  return false
}

/** Trả 404 JSON cho mọi đường dẫn API không tồn tại. */
export const xuLyKhongTimThay: RequestHandler = (_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Không tìm thấy tài nguyên." },
  })
}

/**
 * Error handler tập trung: chuyển mọi lỗi thành JSON thống nhất.
 *
 * Không bao giờ trả stack trace, câu SQL, thông tin kết nối hay dữ liệu cá nhân.
 * Log phía server chỉ ghi request ID, mã lỗi và stack (không ghi body/query).
 */
export const xuLyLoiTapTrung: ErrorRequestHandler = (loi, req, res, _next) => {
  const maYeuCau = String(res.locals.maYeuCau ?? "-")
  const guiLoi = (
    status: number,
    code: string,
    message: string,
    truong?: Record<string, string>,
  ) => {
    if (res.headersSent) return
    res.status(status).json({
      success: false,
      error: { code, message, ...(truong ? { fields: truong } : {}) },
    })
  }

  if (loi instanceof LoiUngDung) {
    guiLoi(loi.status, loi.ma, loi.message, loi.truong)
    return
  }

  const { type, status } = docThuocTinhLoi(loi)
  if (type === "entity.parse.failed") {
    guiLoi(400, "VALIDATION_ERROR", "Dữ liệu gửi lên không đúng định dạng JSON.")
    return
  }
  if (type === "entity.too.large" || status === 413) {
    guiLoi(413, "PAYLOAD_TOO_LARGE", "Dữ liệu gửi lên vượt quá giới hạn cho phép.")
    return
  }
  if (type === "encoding.unsupported" || type === "charset.unsupported") {
    guiLoi(400, "VALIDATION_ERROR", "Bảng mã dữ liệu không được hỗ trợ.")
    return
  }

  if (laLoiDatabaseKhongKhaDung(loi)) {
    console.error(
      `[${maYeuCau}] database unavailable: ${docThuocTinhLoi(loi).code ?? "unknown"} ${req.method} ${req.path}`,
    )
    guiLoi(503, "SERVICE_UNAVAILABLE", "Hệ thống đang tạm gián đoạn. Vui lòng thử lại sau.")
    return
  }

  const stack = loi instanceof Error ? loi.stack : String(loi)
  console.error(`[${maYeuCau}] unhandled error ${req.method} ${req.path}\n${stack}`)
  guiLoi(500, "INTERNAL_ERROR", "Đã có lỗi xảy ra. Vui lòng thử lại sau.")
}
