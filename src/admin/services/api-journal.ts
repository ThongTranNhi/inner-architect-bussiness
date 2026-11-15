import type { NodeNoiDung } from "../../journal/noi-dung/quy-tac"
import { goiApi } from "./api-quan-tri"

/**
 * Lớp gọi API quản trị Journal (`/api/v1/admin/journal`). Quyền, CSRF và kiểm tra dữ liệu
 * đều thực hiện ở máy chủ; các hàm ở đây chỉ chuyển dữ liệu.
 */

const GOC = "/admin/journal"

/** Chuyên mục trong trang quản trị. */
export type ChuyenMucQuanTri = {
  id: number
  slug: string
  name: string
  englishName: string | null
  label: string | null
  description: string
  image: string | null
  isPublic: boolean
  sortOrder: number
  version: number
  articleCount: number
  publishedCount: number
  updatedAt: string
}

/** Dữ liệu gửi khi tạo/sửa chuyên mục. */
export type DuLieuChuyenMuc = {
  name: string
  englishName: string | null
  label: string | null
  description: string
  image: string | null
  isPublic: boolean
}

/** Bài trong danh sách quản trị. */
export type BaiTomTat = {
  id: number
  slug: string
  title: string
  categoryId: number
  publishedCategoryId: number | null
  sortOrder: number
  featured: boolean
  status: "draft" | "published"
  hasDraftChanges: boolean
  coverImage: string | null
  version: number
  publishedAt: string | null
  updatedAt: string
  updatedByName: string | null
}

/** Bài đầy đủ trong trình soạn thảo. */
export type BaiChiTiet = BaiTomTat & { summary: string; coverAlt: string | null; content: NodeNoiDung }

/** Dữ liệu trình soạn thảo gửi khi lưu. */
export type DuLieuBai = {
  title: string
  summary: string
  categoryId: number
  coverImage: string | null
  coverAlt: string | null
  content: NodeNoiDung
}

/** Ảnh trong thư viện Journal. */
export type AnhJournal = {
  id: number
  url: string
  mimeType: string
  byteSize: number
  width: number
  height: number
  originalName: string | null
  createdAt: string
}

/** Nhân viên và quyền Journal. */
export type NhanVienJournal = {
  id: number
  username: string
  displayName: string
  role: string
  isActive: boolean
  canManageJournal: boolean
}

/** Bộ lọc trạng thái bài. */
export type LocTrangThai = "" | "draft" | "published" | "changed"

/** Định dạng ảnh được nhận (máy chủ kiểm tra lại định dạng thật). */
export const DINH_DANG_ANH_CHO_PHEP = ["image/jpeg", "image/png", "image/webp"] as const

/** Dung lượng tối đa mặc định mỗi ảnh (khớp `JOURNAL_MAX_UPLOAD_MB` mặc định của máy chủ). */
export const DUNG_LUONG_ANH_TOI_DA = 5 * 1024 * 1024

type CoData<T> = { data: T }

/** Danh sách chuyên mục. */
export async function layChuyenMuc(): Promise<ChuyenMucQuanTri[]> {
  return (await goiApi<CoData<ChuyenMucQuanTri[]>>(`${GOC}/categories`)).data
}

/**
 * Tạo chuyên mục mới (đặt cuối danh sách).
 *
 * @param duLieu - Thông tin chuyên mục
 * @returns Danh sách chuyên mục sau khi tạo
 */
export async function taoChuyenMuc(duLieu: DuLieuChuyenMuc): Promise<ChuyenMucQuanTri[]> {
  return (await goiApi<CoData<ChuyenMucQuanTri[]>>(`${GOC}/categories`, { method: "POST", body: duLieu })).data
}

/**
 * Sửa chuyên mục (kèm phiên bản để phát hiện ghi đè).
 *
 * @param id - ID chuyên mục
 * @param duLieu - Thông tin mới và phiên bản đang sửa
 * @returns Danh sách chuyên mục sau khi sửa
 */
export async function suaChuyenMuc(id: number, duLieu: DuLieuChuyenMuc & { version: number }): Promise<ChuyenMucQuanTri[]> {
  return (await goiApi<CoData<ChuyenMucQuanTri[]>>(`${GOC}/categories/${id}`, { method: "PUT", body: duLieu })).data
}

/**
 * Lưu thứ tự chuyên mục.
 *
 * @param ids - ID theo thứ tự mới
 * @returns Danh sách chuyên mục theo thứ tự đã lưu
 */
export async function sapXepChuyenMuc(ids: number[]): Promise<ChuyenMucQuanTri[]> {
  return (await goiApi<CoData<ChuyenMucQuanTri[]>>(`${GOC}/category-order`, { method: "PUT", body: { ids } })).data
}

/**
 * Danh sách bài theo bộ lọc.
 *
 * @param boLoc.categoryId - Chuyên mục (bỏ trống = tất cả)
 * @param boLoc.status - Trạng thái
 * @returns Bài theo thứ tự chuyên mục, rồi thứ tự trong chuyên mục
 */
export async function layDanhSachBai(boLoc: { categoryId?: number; status?: LocTrangThai }): Promise<BaiTomTat[]> {
  const thamSo = new URLSearchParams()
  if (boLoc.categoryId) thamSo.set("categoryId", String(boLoc.categoryId))
  if (boLoc.status) thamSo.set("status", boLoc.status)
  const chuoi = thamSo.toString()
  return (await goiApi<CoData<BaiTomTat[]>>(`${GOC}/articles${chuoi ? `?${chuoi}` : ""}`)).data
}

/**
 * Lưu thứ tự bài trong một chuyên mục.
 *
 * @param maChuyenMuc - ID chuyên mục
 * @param ids - ID bài theo thứ tự mới
 * @returns Danh sách bài của chuyên mục theo thứ tự đã lưu
 */
export async function sapXepBai(maChuyenMuc: number, ids: number[]): Promise<BaiTomTat[]> {
  return (await goiApi<CoData<BaiTomTat[]>>(`${GOC}/categories/${maChuyenMuc}/article-order`, { method: "PUT", body: { ids } })).data
}

/** Mở một bài (bản làm việc). */
export async function layBai(id: number): Promise<BaiChiTiet> {
  return (await goiApi<CoData<BaiChiTiet>>(`${GOC}/articles/${id}`)).data
}

/**
 * Tạo bài nháp mới.
 *
 * @param duLieu - Dữ liệu bài
 * @returns Bài vừa tạo
 */
export async function taoBai(duLieu: DuLieuBai): Promise<BaiChiTiet> {
  return (await goiApi<CoData<BaiChiTiet>>(`${GOC}/articles`, { method: "POST", body: duLieu })).data
}

/**
 * Lưu nháp. Bài đã xuất bản giữ nguyên bản công khai cho tới khi cập nhật.
 *
 * @param id - ID bài
 * @param duLieu - Dữ liệu bài và phiên bản đang sửa
 * @returns Bài sau khi lưu
 */
export async function luuNhap(id: number, duLieu: DuLieuBai & { version: number }): Promise<BaiChiTiet> {
  return (await goiApi<CoData<BaiChiTiet>>(`${GOC}/articles/${id}`, { method: "PUT", body: duLieu })).data
}

/**
 * Thao tác theo phiên bản: xuất bản/cập nhật bản công khai, gỡ xuất bản, bỏ thay đổi nháp.
 *
 * @param id - ID bài
 * @param thaoTac - `publish`, `unpublish` hoặc `discard`
 * @param version - Phiên bản đang xem
 * @returns Bài sau thao tác
 */
export async function thaoTacBai(id: number, thaoTac: "publish" | "unpublish" | "discard", version: number): Promise<BaiChiTiet> {
  return (await goiApi<CoData<BaiChiTiet>>(`${GOC}/articles/${id}/${thaoTac}`, { method: "POST", body: { version } })).data
}

/**
 * Chuyển bài sang chuyên mục khác (áp dụng ngay, giữ nguyên URL).
 *
 * @param id - ID bài
 * @param categoryId - Chuyên mục đích
 * @param version - Phiên bản đang xem
 * @returns Bài sau khi chuyển
 */
export async function chuyenChuyenMuc(id: number, categoryId: number, version: number): Promise<BaiChiTiet> {
  return (await goiApi<CoData<BaiChiTiet>>(`${GOC}/articles/${id}/category`, { method: "PATCH", body: { categoryId, version } })).data
}

/**
 * Bật/tắt bài tiêu biểu.
 *
 * @param id - ID bài
 * @param featured - Giá trị mới
 * @param version - Phiên bản đang xem
 * @returns Bài sau khi đổi
 */
export async function datTieuBieu(id: number, featured: boolean, version: number): Promise<BaiChiTiet> {
  return (await goiApi<CoData<BaiChiTiet>>(`${GOC}/articles/${id}/featured`, { method: "PATCH", body: { featured, version } })).data
}

/**
 * Thư viện ảnh (mới nhất trước).
 *
 * @param trang - Số trang
 * @returns Ảnh và tổng số
 */
export async function layThuVienAnh(trang = 1): Promise<{ data: AnhJournal[]; pagination: { page: number; pageSize: number; total: number } }> {
  return goiApi(`${GOC}/media?page=${trang}`)
}

/**
 * Tải ảnh từ máy lên thư viện. Máy chủ kiểm tra định dạng thật và dung lượng.
 *
 * @param file - File JPG/PNG/WebP
 * @returns Ảnh vừa tải
 */
export async function taiAnhLen(file: File): Promise<AnhJournal> {
  return (
    await goiApi<CoData<AnhJournal>>(`${GOC}/media`, {
      method: "POST",
      file,
      headers: { "X-File-Name": encodeURIComponent(file.name.slice(0, 200)) },
    })
  ).data
}

/** Danh sách nhân viên để cấp quyền Journal (chỉ admin). */
export async function layNhanVien(): Promise<NhanVienJournal[]> {
  return (await goiApi<CoData<NhanVienJournal[]>>(`${GOC}/staff`)).data
}

/**
 * Cấp hoặc thu hồi quyền Journal (chỉ admin).
 *
 * @param id - ID nhân viên
 * @param canManageJournal - Giá trị mới
 * @returns Danh sách nhân viên sau khi đổi
 */
export async function datQuyenJournal(id: number, canManageJournal: boolean): Promise<NhanVienJournal[]> {
  return (await goiApi<CoData<NhanVienJournal[]>>(`${GOC}/staff/${id}`, { method: "PATCH", body: { canManageJournal } })).data
}

/**
 * Xóa vĩnh viễn bài chưa xuất bản (bài đang công khai phải gỡ xuất bản trước — máy chủ kiểm tra).
 *
 * @param id - ID bài
 * @param version - Phiên bản đang xem
 * @returns Thông điệp từ máy chủ
 */
export async function xoaBai(id: number, version: number): Promise<string> {
  return (await goiApi<{ message: string }>(`${GOC}/articles/${id}`, { method: "DELETE", body: { version } })).message
}

/**
 * Xóa vĩnh viễn chuyên mục không còn bài.
 *
 * @param id - ID chuyên mục
 * @param version - Phiên bản đang xem
 * @returns Danh sách chuyên mục sau khi xóa
 */
export async function xoaChuyenMuc(id: number, version: number): Promise<ChuyenMucQuanTri[]> {
  return (await goiApi<CoData<ChuyenMucQuanTri[]>>(`${GOC}/categories/${id}`, { method: "DELETE", body: { version } })).data
}

/**
 * Xóa ảnh khỏi thư viện (máy chủ từ chối nếu ảnh còn được dùng).
 *
 * @param id - ID ảnh
 * @returns Thông điệp từ máy chủ
 */
export async function xoaAnh(id: number): Promise<string> {
  return (await goiApi<{ message: string }>(`${GOC}/media/${id}`, { method: "DELETE" })).message
}
