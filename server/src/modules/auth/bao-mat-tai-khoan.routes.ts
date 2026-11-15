import { Router, type RequestHandler } from "express"
import type { Pool } from "mysql2/promise"
import { z } from "zod"
import {
  kiemTraCsrf,
  kiemTraQuyen,
  layQuanTriVienHienTai,
  yeuCauDangNhap,
} from "../../middleware/authenticate.ts"
import { phanTichDuLieu } from "../../middleware/validate.ts"
import { LoiUngDung } from "../../utils/loi-ung-dung.ts"
import type { GhiNhatKyBaoMat } from "../../utils/nhat-ky-bao-mat.ts"
import {
  doiMatKhauQuanTriVien,
  layHashMatKhauTheoMa,
  xoaPhienCuaQuanTriVien,
} from "./auth.repository.ts"
import {
  bamMatKhau,
  DO_DAI_MAT_KHAU_TOI_DA,
  DO_DAI_MAT_KHAU_TOI_THIEU,
  soKhopMatKhau,
} from "./mat-khau.ts"
import { MAU_PIN, type DichVuPin } from "./pin-mo-khoa.ts"

const pin = (nhan: string) =>
  z.string(`Vui lòng nhập ${nhan}.`).regex(MAU_PIN, `${nhan[0]?.toUpperCase()}${nhan.slice(1)} gồm 6–8 chữ số.`)

const schemaDoiPin = z
  .strictObject({
    currentPin: pin("PIN hiện tại").optional(),
    password: z
      .string("Vui lòng nhập mật khẩu.")
      .min(1, "Vui lòng nhập mật khẩu.")
      .max(DO_DAI_MAT_KHAU_TOI_DA, "Mật khẩu quá dài."),
    newPin: pin("PIN mới"),
    confirmPin: z.string("Vui lòng xác nhận PIN mới."),
  })
  .superRefine((duLieu, ctx) => {
    if (duLieu.confirmPin !== duLieu.newPin)
      ctx.addIssue({ code: "custom", path: ["confirmPin"], message: "PIN xác nhận không khớp." })
    if (duLieu.currentPin !== undefined && duLieu.currentPin === duLieu.newPin)
      ctx.addIssue({ code: "custom", path: ["newPin"], message: "PIN mới phải khác PIN hiện tại." })
  })

const schemaDoiMatKhau = z
  .strictObject({
    currentPassword: z
      .string("Vui lòng nhập mật khẩu hiện tại.")
      .min(1, "Vui lòng nhập mật khẩu hiện tại.")
      .max(DO_DAI_MAT_KHAU_TOI_DA, "Mật khẩu quá dài."),
    newPassword: z
      .string("Vui lòng nhập mật khẩu mới.")
      .min(DO_DAI_MAT_KHAU_TOI_THIEU, `Mật khẩu mới tối thiểu ${DO_DAI_MAT_KHAU_TOI_THIEU} ký tự.`)
      .max(DO_DAI_MAT_KHAU_TOI_DA, "Mật khẩu quá dài."),
    confirmPassword: z.string("Vui lòng xác nhận mật khẩu mới."),
  })
  .superRefine((duLieu, ctx) => {
    if (duLieu.confirmPassword !== duLieu.newPassword)
      ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Mật khẩu xác nhận không khớp." })
    if (duLieu.newPassword === duLieu.currentPassword)
      ctx.addIssue({ code: "custom", path: ["newPassword"], message: "Mật khẩu mới phải khác mật khẩu hiện tại." })
  })

/**
 * Router `/account`: mục "Bảo mật tài khoản" sau khi đăng nhập.
 *
 * - `GET /security` — trạng thái (đã bật PIN chưa, tài khoản có quyền đổi PIN không).
 * - `POST /pin` — chỉ vai trò `admin`; cần PIN hiện tại + mật khẩu tài khoản đang đăng nhập.
 * - `POST /password` — mọi nhân viên đổi mật khẩu **của chính mình** (ID lấy từ phiên).
 *   Thành công thì thu hồi mọi phiên của tài khoản, kể cả phiên hiện tại.
 *
 * Mọi route cần đăng nhập + CSRF; số lần xác minh sai bị giới hạn theo tài khoản.
 *
 * @param tuyChon.pool - Pool MySQL
 * @param tuyChon.dichVuPin - Dịch vụ PIN mở khóa
 * @param tuyChon.gioiHanXacMinh - Rate limiter số lần xác minh sai
 * @param tuyChon.tenCookie - Tên cookie session để xóa sau khi đổi mật khẩu
 * @param tuyChon.ghiNhatKy - Ghi nhật ký bảo mật (không chứa bí mật)
 * @returns Router Express
 */
export function taoRouterBaoMatTaiKhoan(tuyChon: {
  pool: Pool
  dichVuPin: DichVuPin
  gioiHanXacMinh: RequestHandler
  tenCookie: string
  ghiNhatKy: GhiNhatKyBaoMat
}): Router {
  const { pool, dichVuPin, gioiHanXacMinh, tenCookie, ghiNhatKy } = tuyChon
  const router = Router()
  router.use(yeuCauDangNhap(pool), kiemTraQuyen("admin", "customer_care"), kiemTraCsrf())

  router.get("/security", async (_req, res) => {
    const quanTriVien = layQuanTriVienHienTai(res)
    res.json({
      success: true,
      data: {
        pinEnabled: (await dichVuPin.layPinHienHanh()) !== null,
        canChangePin: quanTriVien.role === "admin",
      },
    })
  })

  router.post("/pin", kiemTraQuyen("admin"), gioiHanXacMinh, async (req, res) => {
    const quanTriVien = layQuanTriVienHienTai(res)
    const duLieu = phanTichDuLieu(schemaDoiPin, req.body)
    const daBatPin = (await dichVuPin.layPinHienHanh()) !== null
    if (daBatPin && duLieu.currentPin === undefined)
      throw new LoiUngDung(400, "VALIDATION_ERROR", "Dữ liệu không hợp lệ.", {
        currentPin: "Vui lòng nhập PIN hiện tại.",
      })

    const hash = await layHashMatKhauTheoMa(pool, quanTriVien.id)
    const dungMatKhau = await soKhopMatKhau(hash, duLieu.password)
    const ketQua = dungMatKhau
      ? await dichVuPin.doiPin({
          pinHienTai: duLieu.currentPin,
          pinMoi: duLieu.newPin,
          maQuanTriVien: quanTriVien.id,
        })
      : "sai-pin"

    if (ketQua === "xung-dot") {
      ghiNhatKy({ thaoTac: "doi_pin", maQuanTriVien: quanTriVien.id, ketQua: "xung_dot" })
      throw new LoiUngDung(409, "CONFLICT", "PIN vừa được thay đổi ở nơi khác. Vui lòng tải lại trang và thử lại.")
    }
    if (ketQua === "sai-pin") {
      ghiNhatKy({ thaoTac: "doi_pin", maQuanTriVien: quanTriVien.id, ketQua: "sai_thong_tin" })
      // Một thông điệp chung để không tiết lộ trường nào sai.
      throw new LoiUngDung(403, "FORBIDDEN", "PIN hiện tại hoặc mật khẩu không đúng.")
    }
    ghiNhatKy({ thaoTac: "doi_pin", maQuanTriVien: quanTriVien.id, ketQua: "thanh_cong" })
    res.json({
      success: true,
      message: "Đã đổi PIN mở khóa. PIN cũ không còn hiệu lực.",
    })
  })

  router.post("/password", gioiHanXacMinh, async (req, res) => {
    const quanTriVien = layQuanTriVienHienTai(res)
    const duLieu = phanTichDuLieu(schemaDoiMatKhau, req.body)

    // Băm trước khi mở transaction để không giữ khóa dòng trong lúc Argon2 chạy.
    const hashMoi = await bamMatKhau(duLieu.newPassword)
    const ketQua = await doiMatKhauQuanTriVien(
      pool,
      quanTriVien.id,
      (hashHienTai) => soKhopMatKhau(hashHienTai, duLieu.currentPassword),
      hashMoi,
    )
    if (ketQua !== "thanh-cong") {
      ghiNhatKy({ thaoTac: "doi_mat_khau", maQuanTriVien: quanTriVien.id, ketQua: "sai_thong_tin" })
      throw new LoiUngDung(403, "FORBIDDEN", "Mật khẩu hiện tại không đúng.")
    }
    ghiNhatKy({ thaoTac: "doi_mat_khau", maQuanTriVien: quanTriVien.id, ketQua: "thanh_cong" })

    // credential_version đã tăng nên mọi phiên cũ bị từ chối; xóa thêm bản ghi session để dọn dẹp.
    await xoaPhienCuaQuanTriVien(pool, quanTriVien.id).catch(() => 0)
    await new Promise<void>((resolve) => req.session.destroy(() => resolve()))
    res.clearCookie(tenCookie, { path: "/api" })
    res.json({
      success: true,
      message: "Đã đổi mật khẩu. Vui lòng mở khóa và đăng nhập lại bằng mật khẩu mới.",
    })
  })

  return router
}
