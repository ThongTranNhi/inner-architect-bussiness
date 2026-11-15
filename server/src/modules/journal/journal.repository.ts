import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise"
import { MAU_ANH_TAI_LEN, taoDongMoTa, taoSlug, type NodeNoiDung } from "./noi-dung.ts"

/** Kết quả thao tác ghi có kiểm tra phiên bản. */
export type KetQuaGhi =
  | { ketQua: "thanh-cong" }
  | { ketQua: "khong-ton-tai" }
  | { ketQua: "khong-co-chuyen-muc" }
  | { ketQua: "xung-dot"; capNhatBoi: string | null; capNhatLuc: string | null }

/** Trạng thái xuất bản của bài trong trang quản trị. */
export type TrangThaiBai = "draft" | "published"

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

/** Một dòng trong danh sách bài của trang quản trị. */
export type BaiTomTatQuanTri = {
  id: number
  slug: string
  title: string
  categoryId: number
  publishedCategoryId: number | null
  sortOrder: number
  featured: boolean
  status: TrangThaiBai
  hasDraftChanges: boolean
  coverImage: string | null
  version: number
  publishedAt: string | null
  updatedAt: string
  updatedByName: string | null
}

/** Bài viết đầy đủ để mở trong trình soạn thảo. */
export type BaiChiTietQuanTri = BaiTomTatQuanTri & {
  summary: string
  coverAlt: string | null
  content: NodeNoiDung
}

/** Dữ liệu bài do trình soạn thảo gửi (đã xác thực, nội dung đã chuẩn hóa). */
export type DuLieuBai = {
  title: string
  summary: string
  categoryId: number
  coverImage: string | null
  coverAlt: string | null
  content: NodeNoiDung
}

/** Dữ liệu chuyên mục đã xác thực. */
export type DuLieuChuyenMuc = {
  name: string
  englishName: string | null
  label: string | null
  description: string
  image: string | null
  isPublic: boolean
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

/** Chuyên mục công khai trên /journal. */
export type ChuyenMucCongKhai = {
  id: number
  slug: string
  name: string
  englishName: string | null
  label: string
  description: string
  image: string | null
  imageWidth: number | null
  imageHeight: number | null
}

/** Bài công khai (không kèm nội dung) cho danh sách. */
export type BaiCongKhai = {
  slug: string
  categoryId: number
  title: string
  dek: string
  summary: string
  image: string | null
  imageAlt: string
  imageWidth: number | null
  imageHeight: number | null
  date: string | null
  featured: boolean
}

/** Bản công khai lưu trong `published_data`. */
type BanCongKhai = {
  title: string
  summary: string
  coverImage: string | null
  coverAlt: string | null
  content: NodeNoiDung
}

const iso = (giaTri: Date | null): string | null => (giaTri ? giaTri.toISOString() : null)

/**
 * Chạy hàm trong một transaction; tự commit/rollback và trả kết nối về pool.
 *
 * @param pool - Pool MySQL
 * @param thucHien - Hàm nhận kết nối đang trong transaction
 * @returns Kết quả của `thucHien`
 */
async function trongGiaoDich<T>(pool: Pool, thucHien: (ketNoi: PoolConnection) => Promise<T>): Promise<T> {
  const ketNoi = await pool.getConnection()
  try {
    await ketNoi.beginTransaction()
    const ketQua = await thucHien(ketNoi)
    await ketNoi.commit()
    return ketQua
  } catch (loi) {
    await ketNoi.rollback().catch(() => undefined)
    throw loi
  } finally {
    ketNoi.release()
  }
}

/**
 * Tra kích thước của các ảnh tải lên (để frontend đặt width/height, tránh giật bố cục).
 *
 * @param pool - Pool hoặc kết nối MySQL
 * @param duongDan - Các đường dẫn ảnh (chỉ `/media/journal/...` được tra)
 * @returns Map đường dẫn → kích thước
 */
async function layKichThuocAnh(
  pool: Pool | PoolConnection,
  duongDan: (string | null)[],
): Promise<Map<string, { width: number; height: number }>> {
  const tenFile = [...new Set(duongDan.filter((d): d is string => !!d && MAU_ANH_TAI_LEN.test(d)))].map((d) =>
    d.slice("/media/journal/".length),
  )
  const ketQua = new Map<string, { width: number; height: number }>()
  if (tenFile.length === 0) return ketQua
  const [dong] = await pool.query<(RowDataPacket & { file_name: string; width: number; height: number })[]>(
    "SELECT file_name, width, height FROM journal_media WHERE file_name IN (?)",
    [tenFile],
  )
  for (const d of dong) ketQua.set(`/media/journal/${d.file_name}`, { width: d.width, height: d.height })
  return ketQua
}

/**
 * Kiểm tra các ảnh tải lên được tham chiếu có thực sự tồn tại trong thư viện.
 *
 * @param pool - Pool MySQL
 * @param duongDan - Đường dẫn `/media/journal/...`
 * @returns Danh sách đường dẫn không tồn tại
 */
export async function timAnhKhongTonTai(pool: Pool, duongDan: string[]): Promise<string[]> {
  const coSan = await layKichThuocAnh(pool, duongDan)
  return duongDan.filter((d) => MAU_ANH_TAI_LEN.test(d) && !coSan.has(d))
}

/**
 * Lấy thông tin người/lúc cập nhật gần nhất của bài (để báo khi có xung đột phiên bản).
 *
 * @param ketNoi - Kết nối MySQL
 * @param bang - `journal_articles` hoặc `journal_categories`
 * @param id - ID bản ghi
 * @returns Kết quả xung đột, hoặc không tồn tại
 */
async function moTaXungDot(
  ketNoi: Pool | PoolConnection,
  bang: "journal_articles" | "journal_categories",
  id: number,
): Promise<KetQuaGhi> {
  const [dong] = await ketNoi.query<(RowDataPacket & { updated_at: Date; display_name: string | null })[]>(
    `SELECT t.updated_at, a.display_name FROM ${bang} t LEFT JOIN admins a ON a.id = t.updated_by WHERE t.id = ?`,
    [id],
  )
  const banGhi = dong[0]
  if (!banGhi) return { ketQua: "khong-ton-tai" }
  return { ketQua: "xung-dot", capNhatBoi: banGhi.display_name, capNhatLuc: iso(banGhi.updated_at) }
}

/**
 * Sinh slug chưa dùng trong bảng, thêm hậu tố `-2`, `-3`… khi trùng.
 *
 * @param ketNoi - Kết nối MySQL
 * @param bang - Bảng cần kiểm tra
 * @param goc - Slug gốc
 * @returns Slug duy nhất tại thời điểm kiểm tra (unique index vẫn là chốt chặn cuối)
 */
async function slugChuaDung(
  ketNoi: Pool | PoolConnection,
  bang: "journal_articles" | "journal_categories",
  goc: string,
): Promise<string> {
  const [dong] = await ketNoi.query<(RowDataPacket & { slug: string })[]>(
    `SELECT slug FROM ${bang} WHERE slug = ? OR slug LIKE ?`,
    [goc, `${goc}-%`],
  )
  const daDung = new Set(dong.map((d) => d.slug))
  if (!daDung.has(goc)) return goc
  for (let i = 2; ; i++) if (!daDung.has(`${goc}-${i}`)) return `${goc}-${i}`
}

// ---------------------------------------------------------------- Chuyên mục

type DongChuyenMuc = RowDataPacket & {
  id: number
  slug: string
  name: string
  english_name: string | null
  label: string | null
  description: string
  image: string | null
  is_public: number
  sort_order: number
  version: number
  updated_at: Date
  so_bai: number
  so_bai_cong_khai: number
}

/**
 * Danh sách mọi chuyên mục (kể cả chưa công khai) cho trang quản trị, kèm số bài.
 *
 * @param pool - Pool MySQL
 * @returns Chuyên mục theo thứ tự hiển thị
 */
export async function layDanhSachChuyenMucQuanTri(pool: Pool): Promise<ChuyenMucQuanTri[]> {
  const [dong] = await pool.query<DongChuyenMuc[]>(
    `SELECT c.*,
       (SELECT COUNT(*) FROM journal_articles a WHERE a.category_id = c.id) AS so_bai,
       (SELECT COUNT(*) FROM journal_articles a WHERE a.published_category_id = c.id) AS so_bai_cong_khai
     FROM journal_categories c ORDER BY c.sort_order, c.id`,
  )
  return dong.map((d) => ({
    id: Number(d.id),
    slug: d.slug,
    name: d.name,
    englishName: d.english_name,
    label: d.label,
    description: d.description,
    image: d.image,
    isPublic: Boolean(d.is_public),
    sortOrder: d.sort_order,
    version: d.version,
    articleCount: Number(d.so_bai),
    publishedCount: Number(d.so_bai_cong_khai),
    updatedAt: d.updated_at.toISOString(),
  }))
}

/**
 * Tạo chuyên mục mới ở cuối danh sách. Slug sinh từ tên và cố định sau khi tạo.
 *
 * @param pool - Pool MySQL
 * @param duLieu - Dữ liệu chuyên mục
 * @param maNguoi - ID nhân viên thực hiện
 * @returns ID chuyên mục mới
 */
export async function taoChuyenMuc(pool: Pool, duLieu: DuLieuChuyenMuc, maNguoi: number): Promise<number> {
  for (let lan = 0; ; lan++) {
    try {
      return await trongGiaoDich(pool, async (ketNoi) => {
        const slug = await slugChuaDung(ketNoi, "journal_categories", taoSlug(duLieu.name) || "chuyen-muc")
        const [ketQua] = await ketNoi.execute<ResultSetHeader>(
          `INSERT INTO journal_categories
             (slug, name, english_name, label, description, image, is_public, sort_order, created_by, updated_by)
           SELECT ?, ?, ?, ?, ?, ?, ?, COALESCE(MAX(sort_order), 0) + 1, ?, ? FROM journal_categories`,
          [slug, duLieu.name, duLieu.englishName, duLieu.label, duLieu.description, duLieu.image, duLieu.isPublic, maNguoi, maNguoi],
        )
        return ketQua.insertId
      })
    } catch (loi) {
      // Hai người tạo cùng tên cùng lúc: thử lại với slug mới.
      if ((loi as { code?: string }).code === "ER_DUP_ENTRY" && lan < 3) continue
      throw loi
    }
  }
}

/**
 * Sửa chuyên mục nếu phiên bản còn khớp.
 *
 * @param pool - Pool MySQL
 * @param id - ID chuyên mục
 * @param duLieu - Dữ liệu mới
 * @param phienBan - Phiên bản client đang sửa
 * @param maNguoi - ID nhân viên
 * @returns Kết quả ghi
 */
export async function suaChuyenMuc(
  pool: Pool,
  id: number,
  duLieu: DuLieuChuyenMuc,
  phienBan: number,
  maNguoi: number,
): Promise<KetQuaGhi> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    `UPDATE journal_categories
     SET name = ?, english_name = ?, label = ?, description = ?, image = ?, is_public = ?,
         version = version + 1, updated_by = ?
     WHERE id = ? AND version = ?`,
    [duLieu.name, duLieu.englishName, duLieu.label, duLieu.description, duLieu.image, duLieu.isPublic, maNguoi, id, phienBan],
  )
  if (ketQua.affectedRows === 1) return { ketQua: "thanh-cong" }
  return moTaXungDot(pool, "journal_categories", id)
}

/**
 * Lưu thứ tự chuyên mục. Danh sách gửi lên phải khớp đúng tập chuyên mục hiện có
 * (nếu ai đó vừa thêm chuyên mục, trả xung đột để client tải lại).
 *
 * @param pool - Pool MySQL
 * @param ids - ID theo thứ tự mới
 * @returns `true` nếu đã lưu, `false` nếu danh sách không khớp
 */
export async function sapXepChuyenMuc(pool: Pool, ids: number[]): Promise<boolean> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const [dong] = await ketNoi.query<(RowDataPacket & { id: number })[]>(
      "SELECT id FROM journal_categories FOR UPDATE",
    )
    const hienCo = new Set(dong.map((d) => Number(d.id)))
    if (hienCo.size !== ids.length || ids.some((id) => !hienCo.has(id))) return false
    for (const [viTri, id] of ids.entries())
      await ketNoi.execute("UPDATE journal_categories SET sort_order = ? WHERE id = ?", [viTri + 1, id])
    return true
  })
}

// ---------------------------------------------------------------- Bài viết (quản trị)

type DongBai = RowDataPacket & {
  id: number
  slug: string
  title: string
  summary: string
  category_id: number
  published_category_id: number | null
  sort_order: number
  is_featured: number
  cover_image: string | null
  cover_alt: string | null
  content: NodeNoiDung
  published_data: BanCongKhai | null
  has_draft_changes: number
  version: number
  published_at: Date | null
  updated_at: Date
  updated_by_name: string | null
}

const COT_BAI_TOM_TAT = `a.id, a.slug, a.title, a.category_id, a.published_category_id, a.sort_order, a.is_featured,
  a.cover_image, (a.published_data IS NOT NULL) AS da_xuat_ban, a.has_draft_changes, a.version,
  a.published_at, a.updated_at, u.display_name AS updated_by_name`

/**
 * Chuyển dòng MySQL thành dữ liệu tóm tắt cho danh sách quản trị.
 *
 * @param d - Dòng dữ liệu
 * @returns Bài tóm tắt
 */
function chuyenDongTomTat(d: DongBai & { da_xuat_ban?: number }): BaiTomTatQuanTri {
  const daXuatBan = d.da_xuat_ban !== undefined ? Boolean(d.da_xuat_ban) : d.published_data !== null
  return {
    id: Number(d.id),
    slug: d.slug,
    title: d.title,
    categoryId: Number(d.category_id),
    publishedCategoryId: d.published_category_id === null ? null : Number(d.published_category_id),
    sortOrder: d.sort_order,
    featured: Boolean(d.is_featured),
    status: daXuatBan ? "published" : "draft",
    hasDraftChanges: Boolean(d.has_draft_changes),
    coverImage: d.cover_image,
    version: d.version,
    publishedAt: iso(d.published_at),
    updatedAt: d.updated_at.toISOString(),
    updatedByName: d.updated_by_name,
  }
}

/**
 * Danh sách bài cho trang quản trị, lọc theo chuyên mục và trạng thái.
 * Sắp theo thứ tự chuyên mục rồi thứ tự bài trong chuyên mục.
 *
 * @param pool - Pool MySQL
 * @param boLoc.categoryId - Chỉ lấy bài của chuyên mục này
 * @param boLoc.status - `draft` (chưa xuất bản), `published` (đã xuất bản), `changed` (đã xuất bản, có nháp chưa cập nhật)
 * @returns Danh sách bài (không kèm nội dung)
 */
export async function layDanhSachBaiQuanTri(
  pool: Pool,
  boLoc: { categoryId?: number; status?: "draft" | "published" | "changed" },
): Promise<BaiTomTatQuanTri[]> {
  const dieuKien: string[] = []
  const thamSo: (number | string)[] = []
  if (boLoc.categoryId) {
    dieuKien.push("a.category_id = ?")
    thamSo.push(boLoc.categoryId)
  }
  if (boLoc.status === "draft") dieuKien.push("a.published_data IS NULL")
  if (boLoc.status === "published") dieuKien.push("a.published_data IS NOT NULL")
  if (boLoc.status === "changed") dieuKien.push("a.published_data IS NOT NULL AND a.has_draft_changes = 1")
  const [dong] = await pool.execute<DongBai[]>(
    `SELECT ${COT_BAI_TOM_TAT}
     FROM journal_articles a
     JOIN journal_categories c ON c.id = a.category_id
     LEFT JOIN admins u ON u.id = a.updated_by
     ${dieuKien.length ? `WHERE ${dieuKien.join(" AND ")}` : ""}
     ORDER BY c.sort_order, c.id, a.sort_order, a.id`,
    thamSo,
  )
  return dong.map(chuyenDongTomTat)
}

/**
 * Lấy bản làm việc đầy đủ của một bài.
 *
 * @param pool - Pool MySQL
 * @param id - ID bài
 * @returns Bài hoặc `null`
 */
export async function layBaiQuanTri(pool: Pool, id: number): Promise<BaiChiTietQuanTri | null> {
  const [dong] = await pool.execute<DongBai[]>(
    `SELECT a.*, u.display_name AS updated_by_name
     FROM journal_articles a LEFT JOIN admins u ON u.id = a.updated_by WHERE a.id = ?`,
    [id],
  )
  const d = dong[0]
  if (!d) return null
  return { ...chuyenDongTomTat(d), summary: d.summary, coverAlt: d.cover_alt, content: d.content }
}

/**
 * Kiểm tra chuyên mục tồn tại.
 *
 * @param ketNoi - Kết nối MySQL
 * @param id - ID chuyên mục
 * @returns `true` nếu có
 */
async function coChuyenMuc(ketNoi: Pool | PoolConnection, id: number): Promise<boolean> {
  const [dong] = await ketNoi.execute<RowDataPacket[]>("SELECT id FROM journal_categories WHERE id = ?", [id])
  return dong.length > 0
}

/**
 * Tạo bài nháp mới ở cuối chuyên mục. Slug lấy từ tham số hoặc sinh từ tiêu đề, và không đổi về sau.
 *
 * @param pool - Pool MySQL
 * @param duLieu - Dữ liệu bài
 * @param slugMongMuon - Slug người soạn nhập (tùy chọn)
 * @param maNguoi - ID nhân viên
 * @returns ID bài mới, hoặc `null` nếu chuyên mục không tồn tại
 */
export async function taoBai(
  pool: Pool,
  duLieu: DuLieuBai,
  slugMongMuon: string | undefined,
  maNguoi: number,
): Promise<number | null> {
  for (let lan = 0; ; lan++) {
    try {
      return await trongGiaoDich(pool, async (ketNoi) => {
        if (!(await coChuyenMuc(ketNoi, duLieu.categoryId))) return null
        const slug = await slugChuaDung(ketNoi, "journal_articles", slugMongMuon || taoSlug(duLieu.title, 150) || "bai-viet")
        const [ketQua] = await ketNoi.execute<ResultSetHeader>(
          `INSERT INTO journal_articles
             (slug, category_id, sort_order, title, summary, cover_image, cover_alt, content, created_by, updated_by)
           SELECT ?, ?, COALESCE(MAX(sort_order), 0) + 1, ?, ?, ?, ?, ?, ?, ?
           FROM journal_articles WHERE category_id = ?`,
          [
            slug,
            duLieu.categoryId,
            duLieu.title,
            duLieu.summary,
            duLieu.coverImage,
            duLieu.coverAlt,
            JSON.stringify(duLieu.content),
            maNguoi,
            maNguoi,
            duLieu.categoryId,
          ],
        )
        return ketQua.insertId
      })
    } catch (loi) {
      if ((loi as { code?: string }).code === "ER_DUP_ENTRY" && lan < 3) continue
      throw loi
    }
  }
}

/**
 * Khóa dòng bài và kiểm tra phiên bản trong transaction.
 *
 * @param ketNoi - Kết nối trong transaction
 * @param id - ID bài
 * @param phienBan - Phiên bản client gửi lên
 * @returns Dòng bài nếu khớp; kết quả lỗi nếu không tồn tại hoặc lệch phiên bản
 */
async function khoaBai(
  ketNoi: PoolConnection,
  id: number,
  phienBan: number,
): Promise<{ dong: DongBai } | { loi: KetQuaGhi }> {
  const [dong] = await ketNoi.execute<DongBai[]>("SELECT * FROM journal_articles WHERE id = ? FOR UPDATE", [id])
  const banGhi = dong[0]
  if (!banGhi) return { loi: { ketQua: "khong-ton-tai" } }
  if (banGhi.version !== phienBan) return { loi: await moTaXungDot(ketNoi, "journal_articles", id) }
  return { dong: banGhi }
}

/**
 * Số thứ tự cuối cùng + 1 trong một chuyên mục (theo cột phân loại chỉ định).
 *
 * @param ketNoi - Kết nối
 * @param maChuyenMuc - ID chuyên mục
 * @returns Số thứ tự cho bài đặt cuối
 */
async function thuTuCuoi(ketNoi: PoolConnection, maChuyenMuc: number): Promise<number> {
  const [dong] = await ketNoi.execute<(RowDataPacket & { cuoi: number | null })[]>(
    "SELECT MAX(sort_order) AS cuoi FROM journal_articles WHERE category_id = ? OR published_category_id = ?",
    [maChuyenMuc, maChuyenMuc],
  )
  return (dong[0]?.cuoi ?? 0) + 1
}

/**
 * Lưu nháp: ghi vào bản làm việc. Bài đã xuất bản giữ nguyên bản công khai
 * (chỉ đánh dấu "có thay đổi chưa cập nhật"); bài chưa xuất bản đổi chuyên mục thì
 * được đặt cuối chuyên mục mới.
 *
 * @param pool - Pool MySQL
 * @param id - ID bài
 * @param duLieu - Dữ liệu từ trình soạn thảo
 * @param phienBan - Phiên bản client đang sửa
 * @param maNguoi - ID nhân viên
 * @returns Kết quả ghi
 */
export async function luuNhapBai(
  pool: Pool,
  id: number,
  duLieu: DuLieuBai,
  phienBan: number,
  maNguoi: number,
): Promise<KetQuaGhi> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const khoa = await khoaBai(ketNoi, id, phienBan)
    if ("loi" in khoa) return khoa.loi
    const { dong } = khoa
    if (!(await coChuyenMuc(ketNoi, duLieu.categoryId))) return { ketQua: "khong-co-chuyen-muc" }
    const daXuatBan = dong.published_data !== null
    const doiChuyenMucChuaXuatBan = !daXuatBan && Number(dong.category_id) !== duLieu.categoryId
    const thuTu = doiChuyenMucChuaXuatBan ? await thuTuCuoi(ketNoi, duLieu.categoryId) : dong.sort_order
    await ketNoi.execute(
      `UPDATE journal_articles
       SET title = ?, summary = ?, category_id = ?, cover_image = ?, cover_alt = ?, content = ?,
           sort_order = ?, has_draft_changes = ?, version = version + 1, updated_by = ?
       WHERE id = ?`,
      [
        duLieu.title,
        duLieu.summary,
        duLieu.categoryId,
        duLieu.coverImage,
        duLieu.coverAlt,
        JSON.stringify(duLieu.content),
        thuTu,
        daXuatBan,
        maNguoi,
        id,
      ],
    )
    return { ketQua: "thanh-cong" }
  })
}

/**
 * Xuất bản hoặc cập nhật bản công khai từ bản làm việc hiện tại.
 * Ngày hiển thị (`published_at`) là lần xuất bản đầu tiên và không đổi khi cập nhật.
 *
 * @param pool - Pool MySQL
 * @param id - ID bài
 * @param phienBan - Phiên bản client đang xem (bản đã lưu)
 * @param maNguoi - ID nhân viên
 * @returns Kết quả ghi
 */
export async function xuatBanBai(pool: Pool, id: number, phienBan: number, maNguoi: number): Promise<KetQuaGhi> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const khoa = await khoaBai(ketNoi, id, phienBan)
    if ("loi" in khoa) return khoa.loi
    const { dong } = khoa
    const banCongKhai: BanCongKhai = {
      title: dong.title,
      summary: dong.summary,
      coverImage: dong.cover_image,
      coverAlt: dong.cover_alt,
      content: dong.content,
    }
    // Chuyển sang chuyên mục khác khi xuất bản → đặt cuối chuyên mục mới.
    const doiChuyenMuc =
      dong.published_category_id !== null && Number(dong.published_category_id) !== Number(dong.category_id)
    const thuTu = doiChuyenMuc ? await thuTuCuoi(ketNoi, Number(dong.category_id)) : dong.sort_order
    await ketNoi.execute(
      `UPDATE journal_articles
       SET published_data = ?, published_category_id = category_id, sort_order = ?,
           published_at = COALESCE(published_at, UTC_TIMESTAMP()), published_updated_at = UTC_TIMESTAMP(),
           has_draft_changes = 0, published_by = ?, updated_by = ?, version = version + 1
       WHERE id = ?`,
      [JSON.stringify(banCongKhai), thuTu, maNguoi, maNguoi, id],
    )
    return { ketQua: "thanh-cong" }
  })
}

/**
 * Gỡ bài khỏi trang công khai (giữ nguyên bản làm việc để sửa tiếp).
 *
 * @param pool - Pool MySQL
 * @param id - ID bài
 * @param phienBan - Phiên bản client
 * @param maNguoi - ID nhân viên
 * @returns Kết quả ghi
 */
export async function goXuatBanBai(pool: Pool, id: number, phienBan: number, maNguoi: number): Promise<KetQuaGhi> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    `UPDATE journal_articles
     SET published_data = NULL, published_category_id = NULL, has_draft_changes = 0,
         updated_by = ?, version = version + 1
     WHERE id = ? AND version = ?`,
    [maNguoi, id, phienBan],
  )
  if (ketQua.affectedRows === 1) return { ketQua: "thanh-cong" }
  return moTaXungDot(pool, "journal_articles", id)
}

/**
 * Bỏ các thay đổi nháp, đưa bản làm việc về đúng bản công khai.
 *
 * @param pool - Pool MySQL
 * @param id - ID bài
 * @param phienBan - Phiên bản client
 * @param maNguoi - ID nhân viên
 * @returns Kết quả ghi (`khong-ton-tai` nếu bài chưa từng xuất bản)
 */
export async function boThayDoiNhap(pool: Pool, id: number, phienBan: number, maNguoi: number): Promise<KetQuaGhi> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const khoa = await khoaBai(ketNoi, id, phienBan)
    if ("loi" in khoa) return khoa.loi
    const ban = khoa.dong.published_data
    if (!ban) return { ketQua: "khong-ton-tai" }
    await ketNoi.execute(
      `UPDATE journal_articles
       SET title = ?, summary = ?, cover_image = ?, cover_alt = ?, content = ?, category_id = published_category_id,
           has_draft_changes = 0, updated_by = ?, version = version + 1
       WHERE id = ?`,
      [ban.title, ban.summary, ban.coverImage, ban.coverAlt, JSON.stringify(ban.content), maNguoi, id],
    )
    return { ketQua: "thanh-cong" }
  })
}

/**
 * Chuyển bài sang chuyên mục khác ngay lập tức (cả bản làm việc lẫn bản công khai),
 * đặt ở cuối chuyên mục mới. Slug/URL không đổi.
 *
 * @param pool - Pool MySQL
 * @param id - ID bài
 * @param maChuyenMuc - Chuyên mục đích
 * @param phienBan - Phiên bản client
 * @param maNguoi - ID nhân viên
 * @returns Kết quả ghi
 */
export async function chuyenChuyenMucBai(
  pool: Pool,
  id: number,
  maChuyenMuc: number,
  phienBan: number,
  maNguoi: number,
): Promise<KetQuaGhi> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const khoa = await khoaBai(ketNoi, id, phienBan)
    if ("loi" in khoa) return khoa.loi
    if (!(await coChuyenMuc(ketNoi, maChuyenMuc))) return { ketQua: "khong-co-chuyen-muc" }
    const thuTu = await thuTuCuoi(ketNoi, maChuyenMuc)
    await ketNoi.execute(
      `UPDATE journal_articles
       SET category_id = ?, published_category_id = IF(published_data IS NULL, NULL, ?), sort_order = ?,
           updated_by = ?, version = version + 1
       WHERE id = ?`,
      [maChuyenMuc, maChuyenMuc, thuTu, maNguoi, id],
    )
    return { ketQua: "thanh-cong" }
  })
}

/**
 * Bật/tắt bài tiêu biểu (hiện ở cụm tiêu điểm đầu trang /journal).
 *
 * @param pool - Pool MySQL
 * @param id - ID bài
 * @param tieuBieu - Giá trị mới
 * @param phienBan - Phiên bản client
 * @param maNguoi - ID nhân viên
 * @returns Kết quả ghi
 */
export async function datTieuBieu(
  pool: Pool,
  id: number,
  tieuBieu: boolean,
  phienBan: number,
  maNguoi: number,
): Promise<KetQuaGhi> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    "UPDATE journal_articles SET is_featured = ?, updated_by = ?, version = version + 1 WHERE id = ? AND version = ?",
    [tieuBieu, maNguoi, id, phienBan],
  )
  if (ketQua.affectedRows === 1) return { ketQua: "thanh-cong" }
  return moTaXungDot(pool, "journal_articles", id)
}

/**
 * Lưu thứ tự bài trong một chuyên mục. Danh sách phải khớp đúng tập bài đang thuộc
 * chuyên mục (theo bản làm việc); lệch nghĩa là có người vừa thêm/chuyển bài → xung đột.
 *
 * @param pool - Pool MySQL
 * @param maChuyenMuc - ID chuyên mục
 * @param ids - ID bài theo thứ tự mới
 * @returns `true` nếu đã lưu, `false` nếu danh sách không khớp
 */
export async function sapXepBai(pool: Pool, maChuyenMuc: number, ids: number[]): Promise<boolean> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const [dong] = await ketNoi.execute<(RowDataPacket & { id: number })[]>(
      "SELECT id FROM journal_articles WHERE category_id = ? FOR UPDATE",
      [maChuyenMuc],
    )
    const hienCo = new Set(dong.map((d) => Number(d.id)))
    if (hienCo.size !== ids.length || ids.some((id) => !hienCo.has(id))) return false
    for (const [viTri, id] of ids.entries())
      await ketNoi.execute("UPDATE journal_articles SET sort_order = ? WHERE id = ?", [viTri + 1, id])
    return true
  })
}

// ---------------------------------------------------------------- Công khai

type DongBaiCongKhai = RowDataPacket & {
  slug: string
  published_category_id: number
  published_data: BanCongKhai
  published_at: Date | null
  is_featured: number
}

/**
 * Chuyển dòng công khai thành dữ liệu trả cho website.
 *
 * @param d - Dòng dữ liệu
 * @param kichThuoc - Kích thước ảnh tải lên
 * @returns Bài công khai
 */
function chuyenBaiCongKhai(
  d: DongBaiCongKhai,
  kichThuoc: Map<string, { width: number; height: number }>,
): BaiCongKhai {
  const ban = d.published_data
  const anh = ban.coverImage ? kichThuoc.get(ban.coverImage) : undefined
  return {
    slug: d.slug,
    categoryId: Number(d.published_category_id),
    title: ban.title,
    dek: taoDongMoTa(ban.summary),
    summary: ban.summary,
    image: ban.coverImage,
    imageAlt: ban.coverAlt || ban.title,
    imageWidth: anh?.width ?? null,
    imageHeight: anh?.height ?? null,
    date: iso(d.published_at),
    featured: Boolean(d.is_featured),
  }
}

/** Điều kiện bài được hiện công khai: đã xuất bản và thuộc chuyên mục đang công khai. */
const DIEU_KIEN_CONG_KHAI = "a.published_data IS NOT NULL AND c.is_public = 1"

/**
 * Dữ liệu trang /journal: chuyên mục công khai và bài đã xuất bản (không kèm nội dung).
 *
 * @param pool - Pool MySQL
 * @returns Chuyên mục và bài theo thứ tự hiển thị
 */
export async function layJournalCongKhai(
  pool: Pool,
): Promise<{ categories: ChuyenMucCongKhai[]; articles: BaiCongKhai[] }> {
  const [dongMuc] = await pool.query<DongChuyenMuc[]>(
    "SELECT * FROM journal_categories WHERE is_public = 1 ORDER BY sort_order, id",
  )
  const [dongBai] = await pool.query<DongBaiCongKhai[]>(
    `SELECT a.slug, a.published_category_id, JSON_REMOVE(a.published_data, '$.content') AS published_data,
            a.published_at, a.is_featured
     FROM journal_articles a JOIN journal_categories c ON c.id = a.published_category_id
     WHERE ${DIEU_KIEN_CONG_KHAI}
     ORDER BY c.sort_order, c.id, a.sort_order, a.id`,
  )
  const kichThuoc = await layKichThuocAnh(pool, [
    ...dongMuc.map((m) => m.image),
    ...dongBai.map((b) => b.published_data.coverImage),
  ])
  return {
    categories: dongMuc.map((m) => {
      const anh = m.image ? kichThuoc.get(m.image) : undefined
      return {
        id: Number(m.id),
        slug: m.slug,
        name: m.name,
        englishName: m.english_name,
        label: m.label || m.name,
        description: m.description,
        image: m.image,
        imageWidth: anh?.width ?? null,
        imageHeight: anh?.height ?? null,
      }
    }),
    articles: dongBai.map((b) => chuyenBaiCongKhai(b, kichThuoc)),
  }
}

/**
 * Một bài công khai kèm nội dung đã xuất bản.
 *
 * @param pool - Pool MySQL
 * @param slug - Slug trên URL
 * @returns Bài và nội dung, hoặc `null` nếu không có / chưa xuất bản / chuyên mục bị ẩn
 */
export async function layBaiCongKhai(
  pool: Pool,
  slug: string,
): Promise<(BaiCongKhai & { content: NodeNoiDung }) | null> {
  const [dong] = await pool.execute<DongBaiCongKhai[]>(
    `SELECT a.slug, a.published_category_id, a.published_data, a.published_at, a.is_featured
     FROM journal_articles a JOIN journal_categories c ON c.id = a.published_category_id
     WHERE a.slug = ? AND ${DIEU_KIEN_CONG_KHAI}`,
    [slug],
  )
  const d = dong[0]
  if (!d) return null
  const kichThuoc = await layKichThuocAnh(pool, [d.published_data.coverImage])
  return { ...chuyenBaiCongKhai(d, kichThuoc), content: d.published_data.content }
}

/**
 * Bài công khai cho sitemap.
 *
 * @param pool - Pool MySQL
 * @returns Slug và thời điểm cập nhật bản công khai gần nhất
 */
export async function layBaiChoSitemap(pool: Pool): Promise<{ slug: string; lastmod: string | null }[]> {
  const [dong] = await pool.query<(RowDataPacket & { slug: string; published_updated_at: Date | null })[]>(
    `SELECT a.slug, a.published_updated_at
     FROM journal_articles a JOIN journal_categories c ON c.id = a.published_category_id
     WHERE ${DIEU_KIEN_CONG_KHAI}
     ORDER BY c.sort_order, c.id, a.sort_order, a.id`,
  )
  return dong.map((d) => ({ slug: d.slug, lastmod: iso(d.published_updated_at) }))
}

// ---------------------------------------------------------------- Thư viện ảnh

type DongAnh = RowDataPacket & {
  id: number
  file_name: string
  mime_type: string
  byte_size: number
  width: number
  height: number
  original_name: string | null
  created_at: Date
}

/**
 * Chuyển dòng ảnh thành dữ liệu trả về client.
 *
 * @param d - Dòng dữ liệu
 * @returns Ảnh kèm URL công khai
 */
function chuyenDongAnh(d: DongAnh): AnhJournal {
  return {
    id: Number(d.id),
    url: `/media/journal/${d.file_name}`,
    mimeType: d.mime_type,
    byteSize: d.byte_size,
    width: d.width,
    height: d.height,
    originalName: d.original_name,
    createdAt: d.created_at.toISOString(),
  }
}

/**
 * Ghi thông tin ảnh vừa tải lên.
 *
 * @param pool - Pool MySQL
 * @param anh - Thông tin file đã lưu
 * @returns Ảnh vừa thêm
 */
export async function themAnh(
  pool: Pool,
  anh: { tenFile: string; kieu: string; dungLuong: number; rong: number; cao: number; tenGoc: string | null; maNguoi: number },
): Promise<AnhJournal> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    `INSERT INTO journal_media (file_name, mime_type, byte_size, width, height, original_name, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [anh.tenFile, anh.kieu, anh.dungLuong, anh.rong, anh.cao, anh.tenGoc, anh.maNguoi],
  )
  const [dong] = await pool.execute<DongAnh[]>("SELECT * FROM journal_media WHERE id = ?", [ketQua.insertId])
  return chuyenDongAnh(dong[0]!)
}

/**
 * Thư viện ảnh, mới nhất trước.
 *
 * @param pool - Pool MySQL
 * @param trang - Số trang (từ 1)
 * @param kichThuocTrang - Số ảnh mỗi trang
 * @returns Ảnh và tổng số
 */
export async function layThuVienAnh(
  pool: Pool,
  trang: number,
  kichThuocTrang = 40,
): Promise<{ danhSach: AnhJournal[]; tong: number }> {
  const [dong] = await pool.query<DongAnh[]>(
    "SELECT * FROM journal_media ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?",
    [kichThuocTrang, (trang - 1) * kichThuocTrang],
  )
  const [tong] = await pool.query<(RowDataPacket & { tong: number })[]>("SELECT COUNT(*) AS tong FROM journal_media")
  return { danhSach: dong.map(chuyenDongAnh), tong: Number(tong[0]?.tong ?? 0) }
}

// ---------------------------------------------------------------- Quyền Journal

/** Tài khoản nhân viên (không phải admin) và quyền Journal. */
export type NhanVienJournal = {
  id: number
  username: string
  displayName: string
  role: string
  isActive: boolean
  canManageJournal: boolean
}

/**
 * Danh sách tài khoản không phải admin để cấp quyền Journal.
 *
 * @param pool - Pool MySQL
 * @returns Nhân viên theo tên
 */
export async function layNhanVienJournal(pool: Pool): Promise<NhanVienJournal[]> {
  const [dong] = await pool.query<
    (RowDataPacket & { id: number; username: string; display_name: string; role: string; is_active: number; can_manage_journal: number })[]
  >(
    "SELECT id, username, display_name, role, is_active, can_manage_journal FROM admins WHERE role <> 'admin' ORDER BY display_name, id",
  )
  return dong.map((d) => ({
    id: Number(d.id),
    username: d.username,
    displayName: d.display_name,
    role: d.role,
    isActive: Boolean(d.is_active),
    canManageJournal: Boolean(d.can_manage_journal),
  }))
}

/**
 * Cấp hoặc thu hồi quyền Journal cho một nhân viên (không áp dụng cho admin).
 *
 * @param pool - Pool MySQL
 * @param id - ID tài khoản
 * @param coQuyen - Giá trị mới
 * @returns `true` nếu đã cập nhật, `false` nếu không tìm thấy nhân viên phù hợp
 */
export async function datQuyenJournal(pool: Pool, id: number, coQuyen: boolean): Promise<boolean> {
  const [ketQua] = await pool.execute<ResultSetHeader>(
    "UPDATE admins SET can_manage_journal = ? WHERE id = ? AND role <> 'admin'",
    [coQuyen, id],
  )
  return ketQua.affectedRows === 1
}

// ---------------------------------------------------------------- Xóa

/** Kết quả xóa (bổ sung lý do bị từ chối so với `KetQuaGhi`). */
export type KetQuaXoa =
  | KetQuaGhi
  | { ketQua: "dang-xuat-ban" }
  | { ketQua: "con-bai"; soBai: number }
  | { ketQua: "dang-dung"; noiDung: string[] }

/**
 * Xóa vĩnh viễn một bài **chưa xuất bản** (bài đang công khai phải gỡ xuất bản trước,
 * tránh lỡ tay làm hỏng URL đã chia sẻ).
 *
 * @param pool - Pool MySQL
 * @param id - ID bài
 * @param phienBan - Phiên bản client đang xem
 * @returns Kết quả xóa
 */
export async function xoaBai(pool: Pool, id: number, phienBan: number): Promise<KetQuaXoa> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const khoa = await khoaBai(ketNoi, id, phienBan)
    if ("loi" in khoa) return khoa.loi
    if (khoa.dong.published_data !== null) return { ketQua: "dang-xuat-ban" }
    await ketNoi.execute("DELETE FROM journal_articles WHERE id = ?", [id])
    return { ketQua: "thanh-cong" }
  })
}

/**
 * Xóa vĩnh viễn một chuyên mục không còn bài nào (kể cả bản nháp).
 *
 * @param pool - Pool MySQL
 * @param id - ID chuyên mục
 * @param phienBan - Phiên bản client đang xem
 * @returns Kết quả xóa
 */
export async function xoaChuyenMuc(pool: Pool, id: number, phienBan: number): Promise<KetQuaXoa> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const [dong] = await ketNoi.execute<(RowDataPacket & { version: number })[]>(
      "SELECT version FROM journal_categories WHERE id = ? FOR UPDATE",
      [id],
    )
    if (!dong[0]) return { ketQua: "khong-ton-tai" }
    if (dong[0].version !== phienBan) return moTaXungDot(ketNoi, "journal_categories", id)
    const [dem] = await ketNoi.execute<(RowDataPacket & { so: number })[]>(
      "SELECT COUNT(*) AS so FROM journal_articles WHERE category_id = ? OR published_category_id = ? FOR UPDATE",
      [id, id],
    )
    const soBai = Number(dem[0]?.so ?? 0)
    if (soBai > 0) return { ketQua: "con-bai", soBai }
    await ketNoi.execute("DELETE FROM journal_categories WHERE id = ?", [id])
    return { ketQua: "thanh-cong" }
  })
}

/**
 * Xóa ảnh khỏi thư viện nếu không còn được dùng ở ảnh bìa, nội dung bài (bản làm việc
 * hoặc bản công khai) hay ảnh chuyên mục. Trả tên file để route xóa file trên đĩa.
 *
 * @param pool - Pool MySQL
 * @param id - ID ảnh
 * @returns Kết quả xóa, kèm `tenFile` khi thành công
 */
export async function xoaAnh(pool: Pool, id: number): Promise<KetQuaXoa & { tenFile?: string }> {
  return trongGiaoDich(pool, async (ketNoi) => {
    const [dong] = await ketNoi.execute<(RowDataPacket & { file_name: string })[]>(
      "SELECT file_name FROM journal_media WHERE id = ? FOR UPDATE",
      [id],
    )
    const tenFile = dong[0]?.file_name
    if (!tenFile) return { ketQua: "khong-ton-tai" }
    const duongDan = `/media/journal/${tenFile}`
    const mau = `%${tenFile}%`
    const [bai] = await ketNoi.execute<(RowDataPacket & { title: string })[]>(
      `SELECT title FROM journal_articles
       WHERE cover_image = ? OR CAST(content AS CHAR) LIKE ? OR CAST(published_data AS CHAR) LIKE ?
       ORDER BY id LIMIT 5`,
      [duongDan, mau, mau],
    )
    const [muc] = await ketNoi.execute<(RowDataPacket & { name: string })[]>(
      "SELECT name FROM journal_categories WHERE image = ? ORDER BY id LIMIT 5",
      [duongDan],
    )
    const noiDung = [...bai.map((b) => `bài “${b.title}”`), ...muc.map((m) => `chuyên mục “${m.name}”`)]
    if (noiDung.length > 0) return { ketQua: "dang-dung", noiDung }
    await ketNoi.execute("DELETE FROM journal_media WHERE id = ?", [id])
    return { ketQua: "thanh-cong", tenFile }
  })
}
