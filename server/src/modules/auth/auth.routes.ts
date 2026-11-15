import { Router, type RequestHandler, type Request, type Response } from "express"
import type { Pool } from "mysql2/promise"
import { z } from "zod"
import {
  kiemTraCsrf,
  layQuanTriVienHienTai,
  taoCsrfToken,
  yeuCauDangNhap,
} from "../../middleware/authenticate.ts"
import { phanTichDuLieu } from "../../middleware/validate.ts"
import { ghiNhanXacThucSai } from "../../middleware/rate-limiter.ts"
import { LoiUngDung } from "../../utils/loi-ung-dung.ts"
import type { QuanTriVien } from "./auth.repository.ts"
import { timQuanTriVienDeDangNhap } from "./auth.repository.ts"
import { DO_DAI_MAT_KHAU_TOI_DA, soKhopMatKhau } from "./mat-khau.ts"
import { MAU_PIN, type DichVuPin } from "./pin-mo-khoa.ts"

const schemaPin = z.strictObject({
  pin: z.string("Vui lòng nhập PIN.").regex(MAU_PIN, "PIN gồm 6–8 chữ số."),
})
const THOI_HAN_MO_KHOA_MS = 5 * 60 * 1000

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
 * Router `/auth`: mở khóa bằng PIN, đăng nhập, xem phiên hiện tại, đăng xuất.
 *
 * Luồng: `/unlock` (PIN) → `/login` (username + mật khẩu). Khi chưa bật PIN
 * (không có bản ghi MySQL và không có `ADMIN_UNLOCK_PIN`) bỏ qua bước mở khóa.
 *
 * @param tuyChon.pool - Pool MySQL
 * @param tuyChon.gioiHanDangNhap - Bộ giới hạn dùng chung cho `/login` và `/unlock`
 * @param tuyChon.tenCookie - Tên cookie session để xóa khi đăng xuất
 * @param tuyChon.dichVuPin - Dịch vụ PIN (nguồn MySQL, khởi tạo từ `ADMIN_UNLOCK_PIN`)
 * @returns Router Express
 */
export function taoRouterXacThuc(tuyChon: {
  pool: Pool
  gioiHanDangNhap: RequestHandler
  kiemTraKhoaDangNhap: (req: Request, res: Response) => Promise<boolean>
  tenCookie: string
  dichVuPin: DichVuPin
}): Router {
  const { pool, gioiHanDangNhap, tenCookie, dichVuPin } = tuyChon
  const router = Router()

  /**
   * Yêu cầu phiên đã mở khóa bằng PIN đang có hiệu lực. Lượt mở khóa gắn version
   * PIN cũ (PIN vừa bị đổi) hoặc đã quá hạn đều phải nhập lại PIN.
   */
  const yeuCauMoKhoa: RequestHandler = async (req, _res, next) => {
    const pin = await dichVuPin.layPinHienHanh()
    if (pin && ((req.session.pinMoKhoaDen ?? 0) <= Date.now() || req.session.pinVersion !== pin.version))
      throw new LoiUngDung(401, "ADMIN_PIN_REQUIRED", "Vui lòng nhập PIN để mở khóa đăng nhập.")
    next()
  }

  router.post("/unlock", gioiHanDangNhap, async (req, res) => {
    const { pin } = phanTichDuLieu(schemaPin, req.body)
    if (!(await dichVuPin.layPinHienHanh()))
      throw new LoiUngDung(404, "NOT_FOUND", "Trang quản trị chưa bật PIN mở khóa.")
    const version = await dichVuPin.xacMinh(pin)
    if (version === null) {
      ghiNhanXacThucSai(req, res)
      throw new LoiUngDung(403, "FORBIDDEN", "Mã PIN không đúng.")
    }
    req.session.pinMoKhoaDen = Date.now() + THOI_HAN_MO_KHOA_MS
    req.session.pinVersion = version
    await new Promise<void>((resolve, reject) =>
      req.session.save((loi) => (loi ? reject(loi) : resolve())),
    )
    res.json({ success: true })
  })

  router.post("/login", gioiHanDangNhap, yeuCauMoKhoa, async (req, res) => {
    const { username, password } = phanTichDuLieu(schemaDangNhap, req.body)
    const taiKhoan = await timQuanTriVienDeDangNhap(pool, username)
    const dungMatKhau = await soKhopMatKhau(taiKhoan?.passwordHash ?? null, password)

    // Cùng một thông điệp cho sai username, sai mật khẩu hay tài khoản bị khóa.
    if (!taiKhoan || !dungMatKhau || !taiKhoan.isActive) {
      ghiNhanXacThucSai(req, res)
      throw new LoiUngDung(401, "UNAUTHENTICATED", "Tên đăng nhập hoặc mật khẩu không đúng.")
    }

    // Tạo session ID mới sau đăng nhập để chống session fixation.
    await new Promise<void>((resolve, reject) =>
      req.session.regenerate((loi) => (loi ? reject(loi) : resolve())),
    )
    req.session.adminId = taiKhoan.id
    req.session.credentialVersion = taiKhoan.credentialVersion
    req.session.csrfToken = taoCsrfToken()
    await new Promise<void>((resolve, reject) =>
      req.session.save((loi) => (loi ? reject(loi) : resolve())),
    )

    res.json({
      success: true,
      data: { admin: hienThiQuanTriVien(taiKhoan), csrfToken: req.session.csrfToken },
    })
  })

  router.get("/me", async (req, res, next) => {
    if (req.session.adminId) return next()
    if (await tuyChon.kiemTraKhoaDangNhap(req, res)) return
    return yeuCauMoKhoa(req, res, next)
  }, yeuCauDangNhap(pool), (req, res) => {
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
