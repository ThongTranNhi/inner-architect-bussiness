import type {
  BoLocKhachHang,
  KhachHang,
  PhanTrang,
  QuanTriVien,
  ThongKeKhachHang,
  TrangThaiKhachHang,
} from "../types/quan-tri"

/**
 * Lớp gọi API quản trị. Session nằm trong cookie HttpOnly do server đặt;
 * CSRF token chỉ giữ trong bộ nhớ (biến module), không ghi vào Web Storage của trình duyệt.
 */

const GOC_API = "/api/v1"

let csrfToken: string | null = null

/** Lỗi từ API kèm HTTP status (0 = lỗi mạng) và lỗi theo trường nếu có. */
export class LoiApi extends Error {
  readonly status: number
  readonly ma: string
  readonly truong: Record<string, string> | undefined
  readonly choDen: number | undefined

  /**
   * @param status - HTTP status, 0 khi không kết nối được
   * @param ma - Mã lỗi từ server
   * @param thongDiep - Thông điệp tiếng Việt để hiển thị
   * @param truong - Lỗi theo trường
   */
  constructor(status: number, ma: string, thongDiep: string, truong?: Record<string, string>, choDen?: number) {
    super(thongDiep)
    this.name = "LoiApi"
    this.status = status
    this.ma = ma
    this.truong = truong
    this.choDen = choDen
  }
}

/**
 * Gọi một endpoint JSON, tự gắn CSRF token cho request thay đổi dữ liệu.
 *
 * @param duongDan - Đường dẫn sau `/api/v1`, ví dụ `/admin/statistics`
 * @param tuyChon - Method và body JSON
 * @returns Body JSON đã parse
 * @throws LoiApi khi mất kết nối hoặc server trả lỗi
 */
async function goiApi<T>(
  duongDan: string,
  tuyChon: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown } = {},
): Promise<T> {
  const method = tuyChon.method ?? "GET"
  const headers: Record<string, string> = { Accept: "application/json" }
  if (tuyChon.body !== undefined) headers["Content-Type"] = "application/json"
  if (method !== "GET" && csrfToken) headers["X-CSRF-Token"] = csrfToken

  let phanHoi: Response
  try {
    phanHoi = await fetch(`${GOC_API}${duongDan}`, {
      method,
      headers,
      credentials: "same-origin",
      body: tuyChon.body === undefined ? undefined : JSON.stringify(tuyChon.body),
    })
  } catch {
    throw new LoiApi(0, "NETWORK", "Không kết nối được máy chủ. Kiểm tra backend hoặc mạng rồi thử lại.")
  }

  const noiDung = (await phanHoi.json().catch(() => null)) as
    | (T & { error?: { code?: string; message?: string; fields?: Record<string, string> } })
    | null
  if (!phanHoi.ok) {
    const loi = noiDung?.error
    const giayCho = Number(phanHoi.headers.get("Retry-After"))
    throw new LoiApi(
      phanHoi.status,
      loi?.code ?? "HTTP_ERROR",
      loi?.message ??
        (phanHoi.status >= 500
          ? "Máy chủ đang gặp sự cố. Vui lòng thử lại sau."
          : "Yêu cầu không thành công."),
      loi?.fields,
      Number.isFinite(giayCho) && giayCho > 0 ? Date.now() + giayCho * 1000 : undefined,
    )
  }
  return noiDung as T
}

type DuLieuPhien = { data: { admin: QuanTriVien; csrfToken: string } }

/** Mở khóa bước đăng nhập trên máy chủ bằng PIN vừa nhập. */
export async function moKhoaQuanTri(pin: string): Promise<void> {
  await goiApi("/auth/unlock", { method: "POST", body: { pin } })
}

/**
 * Lấy phiên đăng nhập hiện tại (dùng khi mở trang quản trị).
 *
 * @returns Tài khoản đang đăng nhập
 * @throws LoiApi 401 khi chưa đăng nhập
 */
export async function layPhienHienTai(): Promise<QuanTriVien> {
  const ketQua = await goiApi<DuLieuPhien>("/auth/me")
  csrfToken = ketQua.data.csrfToken
  return ketQua.data.admin
}

/**
 * Đăng nhập bằng username/mật khẩu.
 *
 * @param username - Tên đăng nhập
 * @param password - Mật khẩu (chỉ gửi qua body, không lưu ở client)
 * @returns Tài khoản vừa đăng nhập
 */
export async function dangNhap(username: string, password: string): Promise<QuanTriVien> {
  const ketQua = await goiApi<DuLieuPhien>("/auth/login", {
    method: "POST",
    body: { username, password },
  })
  csrfToken = ketQua.data.csrfToken
  return ketQua.data.admin
}

/** Đăng xuất và xóa CSRF token khỏi bộ nhớ (kể cả khi phiên đã hết hạn). */
export async function dangXuat(): Promise<void> {
  try {
    await goiApi("/auth/logout", { method: "POST" })
  } finally {
    csrfToken = null
  }
}

/** Xóa CSRF token khi phát hiện phiên đã hết hạn (401). */
export function xoaPhienCucBo(): void {
  csrfToken = null
}

/**
 * Lấy danh sách khách hàng theo bộ lọc, phân trang ở backend.
 *
 * @param boLoc - Từ khóa, dịch vụ, trạng thái, trang
 * @param kichThuocTrang - Số dòng mỗi trang
 * @returns Danh sách và thông tin phân trang
 */
export async function layDanhSachKhachHang(
  boLoc: BoLocKhachHang,
  kichThuocTrang = 20,
): Promise<{ data: KhachHang[]; pagination: PhanTrang }> {
  const thamSo = new URLSearchParams({ page: String(boLoc.page), pageSize: String(kichThuocTrang) })
  if (boLoc.q.trim()) thamSo.set("q", boLoc.q.trim())
  if (boLoc.service) thamSo.set("service", boLoc.service)
  if (boLoc.status) thamSo.set("status", boLoc.status)
  return goiApi(`/admin/customers?${thamSo.toString()}`)
}

/**
 * Lấy chi tiết một khách hàng.
 *
 * @param id - ID khách hàng
 * @returns Bản ghi khách hàng
 */
export async function layChiTietKhachHang(id: number): Promise<KhachHang> {
  return (await goiApi<{ data: KhachHang }>(`/admin/customers/${id}`)).data
}

/**
 * Cập nhật trạng thái chăm sóc sau khi nhân viên bấm xác nhận.
 *
 * @param id - ID khách hàng
 * @param status - Trạng thái mới
 * @returns Bản ghi sau cập nhật
 */
export async function capNhatTrangThai(id: number, status: TrangThaiKhachHang): Promise<KhachHang> {
  return (
    await goiApi<{ data: KhachHang }>(`/admin/customers/${id}/status`, {
      method: "PATCH",
      body: { status },
    })
  ).data
}

/**
 * Xóa vĩnh viễn một khách hàng (chỉ vai trò admin; backend kiểm tra quyền).
 *
 * @param id - ID khách hàng
 * @returns Thông điệp thành công từ server
 */
export async function xoaKhachHang(id: number): Promise<string> {
  return (await goiApi<{ message: string }>(`/admin/customers/${id}`, { method: "DELETE" })).message
}

/**
 * Lấy số liệu tổng hợp cho dashboard.
 *
 * @returns Tổng số và số lượng theo trạng thái
 */
export async function layThongKe(): Promise<ThongKeKhachHang> {
  return (await goiApi<{ data: ThongKeKhachHang }>("/admin/statistics")).data
}

/** Trạng thái mục "Bảo mật tài khoản" (không chứa PIN hay bản băm). */
export type TrangThaiBaoMat = { pinEnabled: boolean; canChangePin: boolean }

/**
 * Lấy trạng thái bảo mật: đã bật PIN mở khóa chưa, tài khoản có quyền đổi PIN không.
 *
 * @returns Trạng thái bảo mật
 */
export async function layTrangThaiBaoMat(): Promise<TrangThaiBaoMat> {
  return (await goiApi<{ data: TrangThaiBaoMat }>("/account/security")).data
}

/**
 * Đổi PIN mở khóa chung của trang quản trị (chỉ vai trò admin; backend kiểm tra quyền).
 * PIN và mật khẩu chỉ gửi qua body, không lưu ở client.
 *
 * @param duLieu.currentPin - PIN hiện tại; bỏ trống khi chưa bật PIN
 * @param duLieu.password - Mật khẩu tài khoản đang đăng nhập
 * @param duLieu.newPin - PIN mới (6–8 chữ số, dạng chuỗi)
 * @param duLieu.confirmPin - Nhập lại PIN mới
 * @returns Thông điệp thành công từ server
 */
export async function doiPinMoKhoa(duLieu: {
  currentPin?: string
  password: string
  newPin: string
  confirmPin: string
}): Promise<string> {
  return (await goiApi<{ message: string }>("/account/pin", { method: "POST", body: duLieu })).message
}

/**
 * Đổi mật khẩu của chính tài khoản đang đăng nhập. Thành công thì server thu hồi mọi
 * phiên của tài khoản (kể cả phiên hiện tại) nên CSRF token trong bộ nhớ cũng bị xóa.
 *
 * @param duLieu.currentPassword - Mật khẩu hiện tại
 * @param duLieu.newPassword - Mật khẩu mới (tối thiểu 12 ký tự)
 * @param duLieu.confirmPassword - Nhập lại mật khẩu mới
 * @returns Thông điệp thành công từ server
 */
export async function doiMatKhau(duLieu: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<string> {
  const ketQua = await goiApi<{ message: string }>("/account/password", { method: "POST", body: duLieu })
  csrfToken = null
  return ketQua.message
}
