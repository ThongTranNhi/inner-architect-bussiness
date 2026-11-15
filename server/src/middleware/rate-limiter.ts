import type { Request, Response } from "express"
import { ipKeyGenerator, rateLimit, type AugmentedRequest, type Options } from "express-rate-limit"

/** Ngưỡng giới hạn; cho phép test truyền số nhỏ hơn. */
export type CauHinhGioiHan = {
  /** Số lần gửi biểu mẫu mỗi IP trong cửa sổ thời gian. */
  bieuMau: number
  /** Tổng số lần sai PIN hoặc thông tin đăng nhập trên mỗi IP trong cửa sổ. */
  dangNhap: number
  /** Tổng số request API mỗi IP trong cửa sổ thời gian. */
  chung: number
  /** Độ dài cửa sổ (ms). */
  cuaSoMs: number
  /** Số lần xác minh PIN/mật khẩu hiện tại thất bại mỗi tài khoản trong cửa sổ (mặc định 5). */
  xacMinh?: number
}

export const GIOI_HAN_MAC_DINH: CauHinhGioiHan = {
  bieuMau: 5,
  dangNhap: 5,
  chung: 300,
  cuaSoMs: 15 * 60 * 1000,
  xacMinh: 5,
}

const THONG_BAO_KHOA_IP = "Địa chỉ IP tạm bị khóa do nhập sai quá nhiều lần. Vui lòng thử lại sau."

/** Đánh dấu một lần xác thực sai và báo thời gian chờ ngay khi chạm ngưỡng. */
export function ghiNhanXacThucSai(req: Request, res: Response): void {
  res.locals.xacThucSai = true
  const gioiHan = (req as AugmentedRequest)["rateLimit"]
  if (gioiHan?.remaining === 0 && gioiHan.resetTime) {
    res.setHeader("Retry-After", Math.max(1, Math.ceil((gioiHan.resetTime.getTime() - Date.now()) / 1000)))
  }
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
 * Bộ rate limiter cho API: chung, gửi biểu mẫu, đăng nhập, mở khóa PIN và xác minh
 * thông tin hiện tại khi đổi PIN/mật khẩu.
 *
 * @param cauHinh - Ngưỡng giới hạn
 * @returns Các middleware giới hạn tương ứng
 */
export function taoBoGioiHan(cauHinh: CauHinhGioiHan = GIOI_HAN_MAC_DINH) {
  const dangNhap = taoGioiHan(cauHinh.dangNhap, cauHinh.cuaSoMs, THONG_BAO_KHOA_IP, {
    skipSuccessfulRequests: true,
    requestWasSuccessful: (_req, res) => res.locals.xacThucSai !== true,
  })

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
    dangNhap,
    /** Đọc khóa IP khi tải lại trang mà không tính thêm lượt thử. */
    kiemTraKhoaDangNhap: async (req: Request, res: Response): Promise<boolean> => {
      const trangThai = await dangNhap.getKey(ipKeyGenerator(req.ip ?? ""))
      const conLai = (trangThai?.resetTime?.getTime() ?? 0) - Date.now()
      if (!trangThai || trangThai.totalHits < cauHinh.dangNhap || conLai <= 0) return false
      res.setHeader("Retry-After", Math.ceil(conLai / 1000))
      res.status(429).json({ success: false, error: { code: "RATE_LIMITED", message: THONG_BAO_KHOA_IP } })
      return true
    },
    // Khóa theo tài khoản đang đăng nhập; chỉ đếm lần thất bại (sai PIN/mật khẩu hiện tại).
    // Gắn sau yeuCauDangNhap nên luôn có adminId trong phiên.
    xacMinh: taoGioiHan(
      cauHinh.xacMinh ?? 5,
      cauHinh.cuaSoMs,
      "Bạn đã nhập sai thông tin xác minh quá nhiều lần. Vui lòng thử lại sau 15 phút.",
      {
        skipSuccessfulRequests: true,
        keyGenerator: (req: Request) => `admin:${req.session?.adminId ?? "khong-ro"}`,
      },
    ),
  }
}
