import { randomBytes, timingSafeEqual } from "node:crypto"
import type { RequestHandler, Response } from "express"
import type { Pool } from "mysql2/promise"
import {
  layQuanTriVienTheoMa,
  type QuanTriVien,
} from "../modules/auth/auth.repository.ts"
import type { VaiTroQuanTri } from "../utils/dich-vu.ts"
import { LoiUngDung } from "../utils/loi-ung-dung.ts"

declare module "express-session" {
  interface SessionData {
    /** ID tài khoản đã đăng nhập. */
    adminId: number
    /** CSRF token gắn với phiên, gửi lại qua header `X-CSRF-Token`. */
    csrfToken: string
  }
}

/** Header client gửi CSRF token. */
export const HEADER_CSRF = "x-csrf-token"

/**
 * Sinh CSRF token ngẫu nhiên cho một phiên.
 *
 * @returns Chuỗi base64url 32 byte
 */
export function taoCsrfToken(): string {
  return randomBytes(32).toString("base64url")
}

/**
 * Lấy tài khoản đã được `yeuCauDangNhap` gắn vào response.
 *
 * @param res - Response của request đã qua middleware xác thực
 * @returns Tài khoản đang đăng nhập
 * @throws LoiUngDung 401 nếu route quên gắn `yeuCauDangNhap`
 */
export function layQuanTriVienHienTai(res: Response): QuanTriVien {
  const quanTriVien = res.locals.quanTriVien as QuanTriVien | undefined
  if (!quanTriVien)
    throw new LoiUngDung(401, "UNAUTHENTICATED", "Vui lòng đăng nhập.")
  return quanTriVien
}

/**
 * Bắt buộc có phiên đăng nhập hợp lệ. Mỗi request đọc lại tài khoản từ MySQL
 * để tài khoản bị khóa (`is_active = 0`) hoặc bị xóa mất quyền ngay lập tức.
 *
 * @param pool - Pool MySQL
 * @returns Middleware gắn `res.locals.quanTriVien`
 * @throws LoiUngDung 401 khi chưa đăng nhập, phiên hết hạn hoặc tài khoản bị khóa
 */
export function yeuCauDangNhap(pool: Pool): RequestHandler {
  return async (req, res, next) => {
    const maQuanTriVien = req.session.adminId
    if (!maQuanTriVien)
      throw new LoiUngDung(401, "UNAUTHENTICATED", "Vui lòng đăng nhập.")

    const quanTriVien = await layQuanTriVienTheoMa(pool, maQuanTriVien)
    if (!quanTriVien || !quanTriVien.isActive) {
      await new Promise<void>((resolve) => req.session.destroy(() => resolve()))
      throw new LoiUngDung(
        401,
        "UNAUTHENTICATED",
        "Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại.",
      )
    }
    res.locals.quanTriVien = quanTriVien
    next()
  }
}

/**
 * Chỉ cho phép các vai trò được liệt kê (kiểm tra tại backend, không dựa vào UI).
 *
 * @param vaiTro - Vai trò được phép
 * @returns Middleware Express
 * @throws LoiUngDung 403 khi vai trò không phù hợp
 */
export function kiemTraQuyen(...vaiTro: VaiTroQuanTri[]): RequestHandler {
  return (_req, res, next) => {
    if (!vaiTro.includes(layQuanTriVienHienTai(res).role))
      throw new LoiUngDung(403, "FORBIDDEN", "Bạn không có quyền thực hiện thao tác này.")
    next()
  }
}

/**
 * Kiểm tra CSRF token cho request thay đổi dữ liệu dùng cookie session.
 * So sánh hằng thời gian giữa header `X-CSRF-Token` và token lưu trong phiên.
 *
 * @returns Middleware Express (bỏ qua GET/HEAD/OPTIONS)
 * @throws LoiUngDung 403 `CSRF_INVALID` khi thiếu hoặc sai token
 */
export function kiemTraCsrf(): RequestHandler {
  return (req, _res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next()
    const tokenPhien = req.session.csrfToken
    const tokenGui = req.get(HEADER_CSRF)
    const hopLe =
      typeof tokenPhien === "string" &&
      typeof tokenGui === "string" &&
      tokenPhien.length === tokenGui.length &&
      timingSafeEqual(Buffer.from(tokenPhien), Buffer.from(tokenGui))
    if (!hopLe)
      throw new LoiUngDung(
        403,
        "CSRF_INVALID",
        "Phiên làm việc không hợp lệ. Vui lòng tải lại trang.",
      )
    next()
  }
}
