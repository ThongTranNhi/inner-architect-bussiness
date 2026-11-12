import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise"
import type { VaiTroQuanTri } from "../../utils/dich-vu.ts"

/** Tài khoản nội bộ (không kèm mật khẩu) dùng trong phiên đăng nhập. */
export type QuanTriVien = {
  id: number
  username: string
  displayName: string
  role: VaiTroQuanTri
  isActive: boolean
}

type DongQuanTriVien = RowDataPacket & {
  id: number
  username: string
  display_name: string
  role: VaiTroQuanTri
  is_active: number
  password_hash: string
}

/**
 * Chuyển một dòng bảng `admins` thành đối tượng không chứa mật khẩu.
 *
 * @param dong - Dòng dữ liệu từ MySQL
 * @returns Thông tin quản trị viên an toàn để dùng trong phiên
 */
function chuyenDongQuanTriVien(dong: DongQuanTriVien): QuanTriVien {
  return {
    id: Number(dong.id),
    username: dong.username,
    displayName: dong.display_name,
    role: dong.role,
    isActive: Boolean(dong.is_active),
  }
}

/**
 * Tìm tài khoản theo username để xác thực đăng nhập.
 *
 * @param pool - Pool MySQL
 * @param tenDangNhap - Username đã trim
 * @returns Tài khoản kèm `passwordHash`, hoặc `null` nếu không tồn tại
 */
export async function timQuanTriVienDeDangNhap(
  pool: Pool,
  tenDangNhap: string,
): Promise<(QuanTriVien & { passwordHash: string }) | null> {
  const [dong] = await pool.execute<DongQuanTriVien[]>(
    "SELECT id, username, display_name, role, is_active, password_hash FROM admins WHERE username = ? LIMIT 1",
    [tenDangNhap],
  )
  const banGhi = dong[0]
  if (!banGhi) return null
  return { ...chuyenDongQuanTriVien(banGhi), passwordHash: banGhi.password_hash }
}

/**
 * Lấy tài khoản theo ID (dùng mỗi request để phát hiện tài khoản bị khóa ngay lập tức).
 *
 * @param pool - Pool MySQL
 * @param maQuanTriVien - ID tài khoản lưu trong session
 * @returns Tài khoản hoặc `null`
 */
export async function layQuanTriVienTheoMa(
  pool: Pool,
  maQuanTriVien: number,
): Promise<QuanTriVien | null> {
  const [dong] = await pool.execute<DongQuanTriVien[]>(
    "SELECT id, username, display_name, role, is_active, password_hash FROM admins WHERE id = ? LIMIT 1",
    [maQuanTriVien],
  )
  return dong[0] ? chuyenDongQuanTriVien(dong[0]) : null
}

/**
 * Thêm tài khoản nội bộ mới (chỉ gọi từ script CLI, không có API công khai).
 *
 * @param pool - Pool MySQL
 * @param duLieu - Username, tên hiển thị, vai trò và mật khẩu đã hash
 * @returns ID tài khoản vừa tạo
 * @throws Lỗi MySQL `ER_DUP_ENTRY` nếu username đã tồn tại
 */
export async function themQuanTriVien(
  pool: Pool,
  duLieu: {
    username: string
    displayName: string
    role: VaiTroQuanTri
    passwordHash: string
  },
): Promise<number> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    "INSERT INTO admins (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)",
    [duLieu.username, duLieu.passwordHash, duLieu.displayName, duLieu.role],
  )
  return ketQua.insertId
}
