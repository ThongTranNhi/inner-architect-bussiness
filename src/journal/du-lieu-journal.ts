import { useCallback, useEffect, useState } from "react"
import type { NodeNoiDung } from "./noi-dung/quy-tac"

/**
 * Dữ liệu Journal công khai lấy từ API `/api/v1/journal` (chỉ bài đã xuất bản trong
 * chuyên mục đang công khai). Bộ nhớ đệm trong module giúp chuyển trang không tải lại;
 * dữ liệu cũ hơn `THOI_GIAN_LAM_MOI_MS` được làm mới ngầm để bài vừa xuất bản hiện ra.
 */

/** Chuyên mục công khai. */
export type ChuyenMucJournal = {
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

/** Bài công khai trong danh sách (không kèm nội dung). */
export type BaiJournal = {
  slug: string
  categoryId: number
  title: string
  dek: string
  summary: string
  image: string | null
  imageAlt: string
  imageWidth: number | null
  imageHeight: number | null
  /** Thời điểm xuất bản lần đầu (ISO, UTC). */
  date: string | null
  featured: boolean
}

/** Bài công khai kèm nội dung. */
export type BaiJournalChiTiet = BaiJournal & { content: NodeNoiDung }

/** Toàn bộ dữ liệu trang /journal. */
export type DuLieuJournal = { categories: ChuyenMucJournal[]; articles: BaiJournal[] }

/** Trạng thái tải dữ liệu. */
export type TrangThaiTai = "dang-tai" | "xong" | "loi"

const THOI_GIAN_LAM_MOI_MS = 30_000

let daTai: { duLieu: DuLieuJournal; luc: number } | null = null
let dangTai: Promise<DuLieuJournal> | null = null
const boNhoBai = new Map<string, { bai: BaiJournalChiTiet | null; luc: number }>()

/**
 * Gọi API công khai và trả phần `data`.
 *
 * @param duongDan - Đường dẫn sau `/api/v1`
 * @returns Dữ liệu, hoặc `null` khi 404
 * @throws Error khi mất kết nối hoặc máy chủ lỗi
 */
async function goiApiCongKhai<T>(duongDan: string): Promise<T | null> {
  const phanHoi = await fetch(`/api/v1${duongDan}`, { headers: { Accept: "application/json" }, credentials: "omit" })
  if (phanHoi.status === 404) return null
  if (!phanHoi.ok) throw new Error(`HTTP ${phanHoi.status}`)
  return ((await phanHoi.json()) as { data: T }).data
}

/**
 * Tải danh sách chuyên mục và bài công khai (gộp các lần gọi đồng thời).
 *
 * @param lamMoi - `true` để bỏ qua bộ nhớ đệm
 * @returns Dữ liệu Journal
 */
export function taiDuLieuJournal(lamMoi = false): Promise<DuLieuJournal> {
  if (!lamMoi && daTai) return Promise.resolve(daTai.duLieu)
  dangTai ??= goiApiCongKhai<DuLieuJournal>("/journal")
    .then((duLieu) => {
      const ketQua = duLieu ?? { categories: [], articles: [] }
      daTai = { duLieu: ketQua, luc: Date.now() }
      return ketQua
    })
    .finally(() => {
      dangTai = null
    })
  return dangTai
}

/**
 * Dữ liệu đã có trong bộ nhớ (đồng bộ, dùng cho tiêu đề SEO khi chuyển trang).
 *
 * @returns Dữ liệu hoặc `null` nếu chưa tải
 */
export function layDuLieuJournalDaTai(): DuLieuJournal | null {
  return daTai?.duLieu ?? null
}

/**
 * Tải một bài công khai kèm nội dung.
 *
 * @param slug - Slug trên URL
 * @returns Bài, hoặc `null` nếu không tồn tại / chưa xuất bản
 */
export async function taiBaiJournal(slug: string): Promise<BaiJournalChiTiet | null> {
  const coSan = boNhoBai.get(slug)
  if (coSan && Date.now() - coSan.luc < THOI_GIAN_LAM_MOI_MS) return coSan.bai
  const bai = await goiApiCongKhai<BaiJournalChiTiet>(`/journal/articles/${encodeURIComponent(slug)}`)
  boNhoBai.set(slug, { bai, luc: Date.now() })
  return bai
}

/**
 * Hook dữ liệu trang Journal: trả dữ liệu đệm ngay (nếu có) và làm mới ngầm khi đã cũ.
 *
 * @returns Trạng thái, dữ liệu và hàm thử lại
 */
export function useDuLieuJournal(): { trangThai: TrangThaiTai; duLieu: DuLieuJournal | null; thuLai: () => void } {
  const [duLieu, setDuLieu] = useState<DuLieuJournal | null>(() => layDuLieuJournalDaTai())
  const [trangThai, setTrangThai] = useState<TrangThaiTai>(() => (daTai ? "xong" : "dang-tai"))
  const [lanThu, setLanThu] = useState(0)

  useEffect(() => {
    let conGanKet = true
    const canLamMoi = !daTai || Date.now() - daTai.luc > THOI_GIAN_LAM_MOI_MS || lanThu > 0
    if (!canLamMoi) return
    if (!daTai) setTrangThai("dang-tai")
    taiDuLieuJournal(true)
      .then((moi) => {
        if (!conGanKet) return
        setDuLieu(moi)
        setTrangThai("xong")
      })
      .catch(() => {
        // Đã có dữ liệu cũ thì giữ nguyên, chỉ báo lỗi khi chưa có gì để hiển thị.
        if (conGanKet && !daTai) setTrangThai("loi")
      })
    return () => {
      conGanKet = false
    }
  }, [lanThu])

  return { trangThai, duLieu, thuLai: useCallback(() => setLanThu((n) => n + 1), []) }
}

/**
 * Hook tải một bài công khai.
 *
 * @param slug - Slug bài, `null` để không tải
 * @returns Trạng thái (`khong-co` khi 404) và bài
 */
export function useBaiJournal(slug: string | null): {
  trangThai: TrangThaiTai | "khong-co"
  bai: BaiJournalChiTiet | null
  thuLai: () => void
} {
  const [ketQua, setKetQua] = useState<{ slug: string | null; trangThai: TrangThaiTai | "khong-co"; bai: BaiJournalChiTiet | null }>(
    { slug: null, trangThai: "dang-tai", bai: null },
  )
  const [lanThu, setLanThu] = useState(0)

  useEffect(() => {
    if (!slug) return
    let conGanKet = true
    setKetQua((cu) => (cu.slug === slug ? cu : { slug, trangThai: "dang-tai", bai: null }))
    taiBaiJournal(slug)
      .then((bai) => {
        if (conGanKet) setKetQua({ slug, trangThai: bai ? "xong" : "khong-co", bai })
      })
      .catch(() => {
        if (conGanKet) setKetQua({ slug, trangThai: "loi", bai: null })
      })
    return () => {
      conGanKet = false
    }
  }, [slug, lanThu])

  const hienTai = ketQua.slug === slug ? ketQua : { trangThai: "dang-tai" as const, bai: null }
  return { trangThai: hienTai.trangThai, bai: hienTai.bai, thuLai: useCallback(() => setLanThu((n) => n + 1), []) }
}

/**
 * Ngày hiển thị kiểu tạp chí `YYYY.MM.DD` theo giờ Việt Nam.
 *
 * @param iso - Thời điểm ISO (UTC)
 * @returns Chuỗi ngày, hoặc `""` khi chưa có
 */
export function dinhDangNgayJournal(iso: string | null | undefined): string {
  if (!iso) return ""
  const ngay = new Date(iso)
  if (Number.isNaN(ngay.getTime())) return ""
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(ngay)
    .replace(/-/g, ".")
}

/**
 * Nhãn chuyên mục của một bài (vd. "Hiểu mình").
 *
 * @param chuyenMuc - Danh sách chuyên mục công khai
 * @param maChuyenMuc - ID chuyên mục của bài
 * @returns Nhãn, hoặc `""` nếu không tìm thấy
 */
export function nhanChuyenMuc(chuyenMuc: readonly ChuyenMucJournal[], maChuyenMuc: number): string {
  return chuyenMuc.find((m) => m.id === maChuyenMuc)?.label ?? ""
}
