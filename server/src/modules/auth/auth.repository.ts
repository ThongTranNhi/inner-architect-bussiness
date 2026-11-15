import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise"
import type { VaiTroQuanTri } from "../../utils/dich-vu.ts"

/** Tài khoản nội bộ (không kèm mật khẩu) dùng trong phiên đăng nhập. */
export type QuanTriVien = {
  id: number
  username: string
  displayName: string
  role: VaiTroQuanTri
  isActive: boolean
  /** Tăng mỗi lần đổi mật khẩu; phiên lưu version lúc đăng nhập. */
  credentialVersion: number
}

type DongQuanTriVien = RowDataPacket & {
  id: number
  username: string
  display_name: string
  role: VaiTroQuanTri
  is_active: number
  credential_version: number
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
    credentialVersion: Number(dong.credential_version),
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
    "SELECT id, username, display_name, role, is_active, credential_version, password_hash FROM admins WHERE username = ? LIMIT 1",
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
    "SELECT id, username, display_name, role, is_active, credential_version FROM admins WHERE id = ? LIMIT 1",
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

/** Kết quả đổi mật khẩu trong một transaction. */
export type KetQuaDoiMatKhau = "thanh-cong" | "sai-mat-khau" | "khong-ton-tai"

/**
 * Đổi mật khẩu của một tài khoản trong transaction có khóa dòng (`SELECT … FOR UPDATE`).
 * Hai yêu cầu đồng thời được xếp hàng: yêu cầu sau đọc hash mới nên mật khẩu cũ
 * không thể ghi đè thay đổi vừa hoàn tất. Tăng `credential_version` để thu hồi mọi phiên.
 *
 * @param pool - Pool MySQL
 * @param maQuanTriVien - ID tài khoản lấy từ phiên đăng nhập (không nhận từ client)
 * @param xacMinhMatKhauHienTai - So khớp mật khẩu hiện tại với hash đang khóa
 * @param hashMoi - Hash Argon2id của mật khẩu mới
 * @returns Kết quả đổi mật khẩu
 */
export async function doiMatKhauQuanTriVien(
  pool: Pool,
  maQuanTriVien: number,
  xacMinhMatKhauHienTai: (hashHienTai: string) => Promise<boolean>,
  hashMoi: string,
): Promise<KetQuaDoiMatKhau> {
  const ketNoi = await pool.getConnection()
  try {
    await ketNoi.beginTransaction()
    const [dong] = await ketNoi.execute<(RowDataPacket & { password_hash: string; is_active: number })[]>(
      "SELECT password_hash, is_active FROM admins WHERE id = ? FOR UPDATE",
      [maQuanTriVien],
    )
    const banGhi = dong[0]
    if (!banGhi || !banGhi.is_active) {
      await ketNoi.rollback()
      return "khong-ton-tai"
    }
    if (!(await xacMinhMatKhauHienTai(banGhi.password_hash))) {
      await ketNoi.rollback()
      return "sai-mat-khau"
    }
    await ketNoi.execute(
      "UPDATE admins SET password_hash = ?, credential_version = credential_version + 1 WHERE id = ?",
      [hashMoi, maQuanTriVien],
    )
    await ketNoi.commit()
    return "thanh-cong"
  } catch (loi) {
    await ketNoi.rollback().catch(() => undefined)
    throw loi
  } finally {
    ketNoi.release()
  }
}

/**
 * Lấy hash mật khẩu của tài khoản đang đăng nhập (để xác minh trước thao tác nhạy cảm).
 *
 * @param pool - Pool MySQL
 * @param maQuanTriVien - ID tài khoản lấy từ phiên
 * @returns Hash Argon2id, hoặc `null` nếu tài khoản không tồn tại / bị khóa
 */
export async function layHashMatKhauTheoMa(pool: Pool, maQuanTriVien: number): Promise<string | null> {
  const [dong] = await pool.execute<(RowDataPacket & { password_hash: string })[]>(
    "SELECT password_hash FROM admins WHERE id = ? AND is_active = 1 LIMIT 1",
    [maQuanTriVien],
  )
  return dong[0]?.password_hash ?? null
}

/**
 * Xóa mọi bản ghi session của một tài khoản trong bảng `sessions` (express-mysql-session
 * lưu JSON). `CASE` bảo đảm không gọi `JSON_EXTRACT` trên dữ liệu không phải JSON.
 * Đây là bước dọn dẹp; việc thu hồi phiên thực sự dựa vào `credential_version`.
 *
 * @param pool - Pool MySQL
 * @param maQuanTriVien - ID tài khoản
 * @returns Số session đã xóa
 */
export async function xoaPhienCuaQuanTriVien(pool: Pool, maQuanTriVien: number): Promise<number> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    "DELETE FROM sessions WHERE (CASE WHEN JSON_VALID(data) THEN JSON_UNQUOTE(JSON_EXTRACT(data, '$.adminId')) END) = ?",
    [String(maQuanTriVien)],
  )
  return ketQua.affectedRows
}
