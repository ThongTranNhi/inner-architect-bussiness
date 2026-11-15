import { Router, type RequestHandler } from "express"
import type { Pool } from "mysql2/promise"
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
  capNhatTrangThaiKhachHang,
  layDanhSachKhachHang,
  layKhachHangTheoMa,
  layThongKeKhachHang,
  themKhachHang,
  xoaKhachHang,
} from "./customers.repository.ts"
import {
  schemaCapNhatTrangThai,
  schemaLocKhachHang,
  schemaMaKhachHang,
  schemaTaoKhachHang,
} from "./customers.schema.ts"

/** Thông điệp thành công công khai; không trả lại dữ liệu cá nhân. */
export const THONG_DIEP_DA_TIEP_NHAN =
  "Thông tin của bạn đã được tiếp nhận. Đội ngũ INNER ARCHITECT sẽ chủ động liên hệ."

/**
 * Router công khai `/customers`: khách gửi thông tin từ biểu mẫu website.
 * Chỉ trả 201 sau khi MySQL đã ghi thành công.
 *
 * @param pool - Pool MySQL
 * @param gioiHanBieuMau - Rate limiter chống spam biểu mẫu
 * @returns Router Express
 */
export function taoRouterKhachHangCongKhai(
  pool: Pool,
  gioiHanBieuMau: RequestHandler,
): Router {
  const router = Router()
  router.post("/", gioiHanBieuMau, async (req, res) => {
    const duLieu = phanTichDuLieu(schemaTaoKhachHang, req.body)
    await themKhachHang(pool, duLieu)
    res.status(201).json({ success: true, message: THONG_DIEP_DA_TIEP_NHAN })
  })
  return router
}

/**
 * Router quản trị `/admin`: danh sách, chi tiết, cập nhật trạng thái, xóa và thống kê.
 * Mọi route yêu cầu phiên hợp lệ và vai trò `admin` hoặc `customer_care`;
 * route thay đổi dữ liệu yêu cầu thêm CSRF token. Xóa chỉ dành cho vai trò `admin`.
 *
 * @param pool - Pool MySQL
 * @param ghiNhatKy - Ghi nhật ký thao tác xóa (chỉ ID, không có dữ liệu cá nhân)
 * @returns Router Express
 */
export function taoRouterQuanTriKhachHang(pool: Pool, ghiNhatKy: GhiNhatKyBaoMat): Router {
  const router = Router()
  router.use(yeuCauDangNhap(pool), kiemTraQuyen("admin", "customer_care"), kiemTraCsrf())

  router.get("/customers", async (req, res) => {
    const boLoc = phanTichDuLieu(schemaLocKhachHang, req.query)
    const { danhSach, tong } = await layDanhSachKhachHang(pool, boLoc)
    res.json({
      success: true,
      data: danhSach,
      pagination: {
        page: boLoc.page,
        pageSize: boLoc.pageSize,
        total: tong,
        totalPages: Math.max(1, Math.ceil(tong / boLoc.pageSize)),
      },
    })
  })

  router.get("/customers/:id", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMaKhachHang, req.params)
    const khachHang = await layKhachHangTheoMa(pool, id)
    if (!khachHang)
      throw new LoiUngDung(404, "NOT_FOUND", "Không tìm thấy khách hàng.")
    res.json({ success: true, data: khachHang })
  })

  router.patch("/customers/:id/status", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMaKhachHang, req.params)
    const { status } = phanTichDuLieu(schemaCapNhatTrangThai, req.body)
    const daCapNhat = await capNhatTrangThaiKhachHang(pool, id, status)
    if (!daCapNhat)
      throw new LoiUngDung(404, "NOT_FOUND", "Không tìm thấy khách hàng.")
    const khachHang = await layKhachHangTheoMa(pool, id)
    res.json({ success: true, data: khachHang })
  })

  router.delete("/customers/:id", kiemTraQuyen("admin"), async (req, res) => {
    const { id } = phanTichDuLieu(schemaMaKhachHang, req.params)
    const quanTriVien = layQuanTriVienHienTai(res)
    if (!(await xoaKhachHang(pool, id)))
      throw new LoiUngDung(404, "NOT_FOUND", "Không tìm thấy khách hàng.")
    ghiNhatKy({ thaoTac: "xoa_khach_hang", maQuanTriVien: quanTriVien.id, ketQua: "thanh_cong", maDoiTuong: id })
    res.json({ success: true, message: "Đã xóa khách hàng." })
  })

  router.get("/statistics", async (_req, res) => {
    res.json({ success: true, data: await layThongKeKhachHang(pool) })
  })

  return router
}
