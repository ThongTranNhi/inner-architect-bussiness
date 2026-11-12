import type { Request } from "express"
import { ipKeyGenerator, rateLimit, type Options } from "express-rate-limit"

/** Ngưỡng giới hạn; cho phép test truyền số nhỏ hơn. */
export type CauHinhGioiHan = {
  /** Số lần gửi biểu mẫu mỗi IP trong cửa sổ thời gian. */
  bieuMau: number
  /** Số lần đăng nhập thất bại mỗi IP + username trong cửa sổ thời gian. */
  dangNhap: number
  /** Tổng số request API mỗi IP trong cửa sổ thời gian. */
  chung: number
  /** Độ dài cửa sổ (ms). */
  cuaSoMs: number
}

export const GIOI_HAN_MAC_DINH: CauHinhGioiHan = {
  bieuMau: 5,
  dangNhap: 10,
  chung: 300,
  cuaSoMs: 15 * 60 * 1000,
}

/**
 * Tạo middleware giới hạn tần suất trả lỗi JSON 429 thống nhất.
 * Bộ đếm nằm trong bộ nhớ tiến trình — phù hợp một tiến trình Node trên VPS
 * (không dùng Redis theo phạm vi MVP); khởi động lại tiến trình sẽ reset bộ đếm.
 *
 * @param gioiHan - Số request tối đa trong cửa sổ
 * @param cuaSoMs - Độ dài cửa sổ (ms)
 * @param thongDiep - Thông điệp tiếng Việt khi vượt giới hạn
 * @param tuyChon - Tùy chọn bổ sung của express-rate-limit
 * @returns Middleware Express
 */
function taoGioiHan(
  gioiHan: number,
  cuaSoMs: number,
  thongDiep: string,
  tuyChon: Partial<Options> = {},
) {
  return rateLimit({
    windowMs: cuaSoMs,
    limit: gioiHan,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, res, _next, options) => {
      res.status(options.statusCode).json({
        success: false,
        error: { code: "RATE_LIMITED", message: thongDiep },
      })
    },
    ...tuyChon,
  })
}

/**
 * Bộ ba rate limiter cho API: chung, gửi biểu mẫu và đăng nhập.
 *
 * @param cauHinh - Ngưỡng giới hạn
 * @returns Các middleware giới hạn tương ứng
 */
export function taoBoGioiHan(cauHinh: CauHinhGioiHan = GIOI_HAN_MAC_DINH) {
  return {
    chung: taoGioiHan(
      cauHinh.chung,
      cauHinh.cuaSoMs,
      "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.",
    ),
    bieuMau: taoGioiHan(
      cauHinh.bieuMau,
      cauHinh.cuaSoMs,
      "Bạn đã gửi thông tin nhiều lần. Vui lòng thử lại sau hoặc liên hệ qua Zalo/Facebook.",
    ),
    // Khóa theo IP + username để chống dò mật khẩu một tài khoản; chỉ đếm lần thất bại.
    dangNhap: taoGioiHan(
      cauHinh.dangNhap,
      cauHinh.cuaSoMs,
      "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.",
      {
        skipSuccessfulRequests: true,
        keyGenerator: (req: Request) => {
          const tenDangNhap =
            typeof req.body?.username === "string"
              ? req.body.username.trim().toLowerCase().slice(0, 100)
              : ""
          return `${ipKeyGenerator(req.ip ?? "")}|${tenDangNhap}`
        },
      },
    ),
  }
}
