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

  /**
   * @param status - HTTP status, 0 khi không kết nối được
   * @param ma - Mã lỗi từ server
   * @param thongDiep - Thông điệp tiếng Việt để hiển thị
   * @param truong - Lỗi theo trường
   */
  constructor(status: number, ma: string, thongDiep: string, truong?: Record<string, string>) {
    super(thongDiep)
    this.name = "LoiApi"
    this.status = status
    this.ma = ma
    this.truong = truong
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
  tuyChon: { method?: "GET" | "POST" | "PATCH"; body?: unknown } = {},
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
    throw new LoiApi(
      phanHoi.status,
      loi?.code ?? "HTTP_ERROR",
      loi?.message ??
        (phanHoi.status >= 500
          ? "Máy chủ đang gặp sự cố. Vui lòng thử lại sau."
          : "Yêu cầu không thành công."),
      loi?.fields,
    )
  }
  return noiDung as T
}

type DuLieuPhien = { data: { admin: QuanTriVien; csrfToken: string } }

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
 * Lấy số liệu tổng hợp cho dashboard.
 *
 * @returns Tổng số và số lượng theo trạng thái
 */
export async function layThongKe(): Promise<ThongKeKhachHang> {
  return (await goiApi<{ data: ThongKeKhachHang }>("/admin/statistics")).data
}
