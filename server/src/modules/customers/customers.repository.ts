import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise"
import type { TrangThaiKhachHang } from "../../utils/dich-vu.ts"
import type { BoLocKhachHang, DuLieuTaoKhachHang } from "./customers.schema.ts"

/** Bản ghi khách hàng trả về cho trang quản trị (thời gian dạng ISO 8601 UTC). */
export type KhachHang = {
  id: number
  fullName: string
  phone: string
  email: string | null
  service: string
  source: string
  status: TrangThaiKhachHang
  consentAt: string
  createdAt: string
  updatedAt: string
}

type DongKhachHang = RowDataPacket & {
  id: number
  full_name: string
  phone: string
  email: string | null
  service: string
  source: string
  status: TrangThaiKhachHang
  consent_at: Date
  created_at: Date
  updated_at: Date
}

const COT_KHACH_HANG =
  "id, full_name, phone, email, service, source, status, consent_at, created_at, updated_at"

/**
 * Chuyển một dòng bảng `customers` sang dạng camelCase cho API.
 *
 * @param dong - Dòng dữ liệu từ MySQL (DATETIME đọc theo UTC)
 * @returns Bản ghi khách hàng
 */
function chuyenDongKhachHang(dong: DongKhachHang): KhachHang {
  return {
    id: Number(dong.id),
    fullName: dong.full_name,
    phone: dong.phone,
    email: dong.email,
    service: dong.service,
    source: dong.source,
    status: dong.status,
    consentAt: dong.consent_at.toISOString(),
    createdAt: dong.created_at.toISOString(),
    updatedAt: dong.updated_at.toISOString(),
  }
}

/**
 * Thoát ký tự đại diện của LIKE (`%`, `_`, `\`) để từ khóa được so khớp nguyên văn.
 *
 * @param tuKhoa - Từ khóa người dùng nhập
 * @returns Chuỗi an toàn để đặt giữa `%…%`
 */
export function thoatKyTuLike(tuKhoa: string): string {
  return tuKhoa.replace(/[\\%_]/g, (kyTu) => `\\${kyTu}`)
}

/**
 * Lưu thông tin khách hàng gửi từ website. `consent_at` là thời điểm server nhận
 * được sự đồng ý (UTC), không lấy từ client.
 *
 * @param pool - Pool MySQL
 * @param duLieu - Dữ liệu đã kiểm tra bằng `schemaTaoKhachHang`
 * @returns ID bản ghi vừa tạo
 */
export async function themKhachHang(
  pool: Pool,
  duLieu: DuLieuTaoKhachHang,
): Promise<number> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    "INSERT INTO customers (full_name, phone, email, service, source, consent_at) VALUES (?, ?, ?, ?, 'website', UTC_TIMESTAMP())",
    [duLieu.fullName, duLieu.phone, duLieu.email, duLieu.service],
  )
  return ketQua.insertId
}

/**
 * Dựng mệnh đề WHERE và tham số tương ứng từ bộ lọc (chỉ dùng placeholder `?`).
 *
 * @param boLoc - Bộ lọc đã kiểm tra
 * @returns Chuỗi WHERE (có thể rỗng) và mảng tham số
 */
function dungDieuKienLoc(boLoc: BoLocKhachHang): {
  where: string
  thamSo: string[]
} {
  const dieuKien: string[] = []
  const thamSo: string[] = []
  if (boLoc.q) {
    const mau = `%${thoatKyTuLike(boLoc.q)}%`
    dieuKien.push("(full_name LIKE ? OR phone LIKE ? OR email LIKE ?)")
    thamSo.push(mau, mau, mau)
  }
  if (boLoc.service) {
    dieuKien.push("service = ?")
    thamSo.push(boLoc.service)
  }
  if (boLoc.status) {
    dieuKien.push("status = ?")
    thamSo.push(boLoc.status)
  }
  return {
    where: dieuKien.length > 0 ? `WHERE ${dieuKien.join(" AND ")}` : "",
    thamSo,
  }
}

/**
 * Lấy danh sách khách hàng có tìm kiếm, lọc và phân trang (mới nhất trước).
 *
 * @param pool - Pool MySQL
 * @param boLoc - Từ khóa, dịch vụ, trạng thái, trang, kích thước trang
 * @returns Danh sách của trang hiện tại và tổng số bản ghi khớp bộ lọc
 */
export async function layDanhSachKhachHang(
  pool: Pool,
  boLoc: BoLocKhachHang,
): Promise<{ danhSach: KhachHang[]; tong: number }> {
  const { where, thamSo } = dungDieuKienLoc(boLoc)
  const viTri = (boLoc.page - 1) * boLoc.pageSize

  // LIMIT/OFFSET là số nguyên đã kiểm tra bằng Zod; mysql2 execute không nhận
  // placeholder cho LIMIT trên một số phiên bản MySQL nên nội suy số đã ép kiểu.
  const [dong] = await pool.execute<DongKhachHang[]>(
    `SELECT ${COT_KHACH_HANG} FROM customers ${where} ORDER BY created_at DESC, id DESC LIMIT ${Number(boLoc.pageSize)} OFFSET ${Number(viTri)}`,
    thamSo,
  )
  const [dem] = await pool.execute<(RowDataPacket & { tong: number })[]>(
    `SELECT COUNT(*) AS tong FROM customers ${where}`,
    thamSo,
  )
  return { danhSach: dong.map(chuyenDongKhachHang), tong: Number(dem[0]?.tong ?? 0) }
}

/**
 * Lấy chi tiết một khách hàng.
 *
 * @param pool - Pool MySQL
 * @param maKhachHang - ID khách hàng
 * @returns Bản ghi hoặc `null` nếu không tồn tại
 */
export async function layKhachHangTheoMa(
  pool: Pool,
  maKhachHang: number,
): Promise<KhachHang | null> {
  const [dong] = await pool.execute<DongKhachHang[]>(
    `SELECT ${COT_KHACH_HANG} FROM customers WHERE id = ? LIMIT 1`,
    [maKhachHang],
  )
  return dong[0] ? chuyenDongKhachHang(dong[0]) : null
}

/**
 * Cập nhật trạng thái chăm sóc do nhân viên xác nhận.
 *
 * @param pool - Pool MySQL
 * @param maKhachHang - ID khách hàng
 * @param trangThai - Trạng thái mới
 * @returns `true` nếu tồn tại bản ghi để cập nhật
 */
export async function capNhatTrangThaiKhachHang(
  pool: Pool,
  maKhachHang: number,
  trangThai: TrangThaiKhachHang,
): Promise<boolean> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    "UPDATE customers SET status = ? WHERE id = ?",
    [trangThai, maKhachHang],
  )
  return ketQua.affectedRows > 0
}

/** Số liệu tổng hợp cho dashboard. */
export type ThongKeKhachHang = {
  total: number
  new: number
  contacted: number
  completed: number
}

/**
 * Đếm khách hàng theo trạng thái bằng một truy vấn.
 *
 * @param pool - Pool MySQL
 * @returns Tổng số và số lượng theo từng trạng thái
 */
export async function layThongKeKhachHang(pool: Pool): Promise<ThongKeKhachHang> {
  const [dong] = await pool.execute<
    (RowDataPacket & {
      total: number
      moi: string | null
      da_lien_he: string | null
      hoan_tat: string | null
    })[]
  >(
    `SELECT COUNT(*) AS total,
            SUM(status = 'new') AS moi,
            SUM(status = 'contacted') AS da_lien_he,
            SUM(status = 'completed') AS hoan_tat
       FROM customers`,
  )
  const ketQua = dong[0]
  return {
    total: Number(ketQua?.total ?? 0),
    new: Number(ketQua?.moi ?? 0),
    contacted: Number(ketQua?.da_lien_he ?? 0),
    completed: Number(ketQua?.hoan_tat ?? 0),
  }
}
