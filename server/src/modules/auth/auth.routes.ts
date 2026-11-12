import { Router, type RequestHandler } from "express"
import type { Pool } from "mysql2/promise"
import { z } from "zod"
import {
  kiemTraCsrf,
  layQuanTriVienHienTai,
  taoCsrfToken,
  yeuCauDangNhap,
} from "../../middleware/authenticate.ts"
import { phanTichDuLieu } from "../../middleware/validate.ts"
import { LoiUngDung } from "../../utils/loi-ung-dung.ts"
import type { QuanTriVien } from "./auth.repository.ts"
import { timQuanTriVienDeDangNhap } from "./auth.repository.ts"
import { DO_DAI_MAT_KHAU_TOI_DA, soKhopMatKhau } from "./mat-khau.ts"

const schemaDangNhap = z.strictObject({
  username: z
    .string("Vui lòng nhập tên đăng nhập.")
    .trim()
    .min(1, "Vui lòng nhập tên đăng nhập.")
    .max(100, "Tên đăng nhập quá dài."),
  password: z
    .string("Vui lòng nhập mật khẩu.")
    .min(1, "Vui lòng nhập mật khẩu.")
    .max(DO_DAI_MAT_KHAU_TOI_DA, "Mật khẩu quá dài."),
})

/**
 * Dữ liệu tài khoản trả về client (không có mật khẩu, không có trạng thái nội bộ).
 *
 * @param quanTriVien - Tài khoản đang đăng nhập
 * @returns Đối tượng công khai cho giao diện quản trị
 */
function hienThiQuanTriVien(quanTriVien: QuanTriVien) {
  return {
    id: quanTriVien.id,
    username: quanTriVien.username,
    displayName: quanTriVien.displayName,
    role: quanTriVien.role,
  }
}

/**
 * Router `/auth`: đăng nhập, xem phiên hiện tại, đăng xuất.
 *
 * @param pool - Pool MySQL
 * @param gioiHanDangNhap - Rate limiter chống brute-force cho `/login`
 * @param tenCookie - Tên cookie session để xóa khi đăng xuất
 * @returns Router Express
 */
export function taoRouterXacThuc(
  pool: Pool,
  gioiHanDangNhap: RequestHandler,
  tenCookie: string,
): Router {
  const router = Router()

  router.post("/login", gioiHanDangNhap, async (req, res) => {
    const { username, password } = phanTichDuLieu(schemaDangNhap, req.body)
    const taiKhoan = await timQuanTriVienDeDangNhap(pool, username)
    const dungMatKhau = await soKhopMatKhau(taiKhoan?.passwordHash ?? null, password)

    // Cùng một thông điệp cho sai username, sai mật khẩu hay tài khoản bị khóa.
    if (!taiKhoan || !dungMatKhau || !taiKhoan.isActive)
      throw new LoiUngDung(401, "UNAUTHENTICATED", "Tên đăng nhập hoặc mật khẩu không đúng.")

    // Tạo session ID mới sau đăng nhập để chống session fixation.
    await new Promise<void>((resolve, reject) =>
      req.session.regenerate((loi) => (loi ? reject(loi) : resolve())),
    )
    req.session.adminId = taiKhoan.id
    req.session.csrfToken = taoCsrfToken()
    await new Promise<void>((resolve, reject) =>
      req.session.save((loi) => (loi ? reject(loi) : resolve())),
    )

    res.json({
      success: true,
      data: { admin: hienThiQuanTriVien(taiKhoan), csrfToken: req.session.csrfToken },
    })
  })

  router.get("/me", yeuCauDangNhap(pool), (req, res) => {
    res.json({
      success: true,
      data: {
        admin: hienThiQuanTriVien(layQuanTriVienHienTai(res)),
        csrfToken: req.session.csrfToken,
      },
    })
  })

  router.post("/logout", yeuCauDangNhap(pool), kiemTraCsrf(), async (req, res) => {
    await new Promise<void>((resolve, reject) =>
      req.session.destroy((loi) => (loi ? reject(loi) : resolve())),
    )
    res.clearCookie(tenCookie, { path: "/api" })
    res.json({ success: true, message: "Đã đăng xuất." })
  })

  return router
}
