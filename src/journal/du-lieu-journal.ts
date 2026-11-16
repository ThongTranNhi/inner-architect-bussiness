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

const ANH_BAI_VIET_CHUAN: Record<string, string> = {
  "ban-la-ai-khi-khong-con-phai-lam-hai-long-tat-ca": "/assets/journal/goc/hinh07.webp",
  "co-nhung-luc-ta-khong-biet-minh-dang-cam-thay-gi": "/assets/journal/bai-viet/lang-nghe-kiet-suc.webp",
  "minh-chua-du-tot-mot-niem-tin-ay-da-di-cung-ban-bao-lau-roi": "/assets/journal/bai-viet/lang-nghe-kiet-suc.webp",
  "dieu-ban-dang-theo-duoi-co-thuc-su-la-dieu-ban-coi-trong": "/assets/journal/goc/hinh01.webp",
  "khi-cuoc-doi-doi-huong-minh-co-the-bat-dau-lai-tu-dau": "/assets/journal/bai-viet/buong-tay-giu-moi-quan-he.webp",
  "vi-sao-minh-cu-o-lai-trong-mot-moi-quan-he-khien-minh-buon": "/assets/journal/bai-viet/moi-quan-he-can-kiet.webp",
  "khi-mot-tin-nhan-chua-duoc-tra-loi-khien-minh-bat-an": "/assets/journal/bai-viet/tin-nhan-chua-tra-loi.webp",
  "noi-khong-voi-nguoi-minh-thuong-co-phai-la-ich-ky": "/assets/journal/bai-viet/ranh-gioi-thuong-yeu.webp",
  "khi-minh-luon-la-nguoi-co-gang-giu-gin-moi-quan-he": "/assets/journal/bai-viet/buong-tay-giu-moi-quan-he.webp",
  "sau-mot-moi-quan-he-lam-sao-hoc-cach-tin-minh-tro-lai": "/assets/journal/bai-viet/ranh-gioi-thuong-yeu.webp",
  "doc-lao-tu-giua-nhung-ngay-muon-kiem-soat-moi-thu": "/assets/journal/bai-viet/lao-tu-kiem-soat.webp",
  "vo-vi-khi-nao-nen-hanh-dong-khi-nao-nen-dung": "/assets/journal/bai-viet/vo-vi-thuan-tu-nhien.webp",
  "mem-nhu-nuoc-mot-cach-di-qua-nhung-va-cham": "/assets/journal/bai-viet/mem-nhu-nuoc-doi-dau.webp",
  "biet-du-giua-mot-the-gioi-luon-bao-minh-phai-co-them": "/assets/journal/bai-viet/biet-du-giua-the-gioi.webp",
  "mot-khoang-trong-co-the-mang-lai-dieu-gi": "/assets/journal/bai-viet/khoang-trong-trang-tu.webp",
  "the-hermit-khi-minh-can-mot-khoang-lang-de-nghe-chinh-minh": "/assets/journal/goc/hinh04.webp",
  "the-high-priestess-lang-nghe-dieu-chua-duoc-goi-thanh-loi": "/assets/journal/goc/hinh08.webp",
  "the-tower-khi-dieu-minh-tung-tin-khong-con-dung-vung": "/assets/journal/goc/hinh04.webp",
  "the-star-nuoi-lai-hy-vong-tu-nhung-dieu-nho-be": "/assets/journal/goc/hinh01.webp",
  "the-fool-bat-dau-khi-minh-chua-co-du-moi-cau-tra-loi": "/assets/journal/goc/hinh02.webp",
  "nam-phut-tro-ve-voi-dieu-dang-co-mat": "/assets/journal/goc/hinh05.webp",
  "viet-nhat-ky-khi-minh-khong-biet-bat-dau-tu-dau": "/assets/journal/bai-viet/viet-nhat-ky-khoi-dau.webp",
  "mot-khoang-dung-truoc-khi-tra-loi-trong-luc-gian": "/assets/journal/goc/hinh05.webp",
  "vi-sao-khiem-muon-tao-nen-the-hermit": "/assets/journal/goc/hinh06.webp",
  "mot-goc-nho-o-the-hermit-da-duoc-chon-nhu-the-nao": "/assets/journal/goc/hinh06.webp",
  "mot-tach-tra-mot-khoang-thoi-gian-khong-can-voi": "/assets/journal/goc/hinh06.webp",
  "mot-buoi-trai-nghiem-tarot-tai-the-hermit-dien-ra-the-nao": "/assets/journal/goc/hinh04.webp",
  "den-the-hermit-mot-minh-ban-co-the-lam-gi": "/assets/journal/goc/hinh06.webp",
}

function chuanHoaBai<T extends BaiJournal>(b: T): T {
  const anhMoi = ANH_BAI_VIET_CHUAN[b.slug]
  const tieuDeMoi = b.title ? b.title.replace(/thỰC/g, "thực") : b.title
  const tomTatMoi = b.summary ? b.summary.replace(/thỰC/g, "thực") : b.summary
  const dekMoi = b.dek ? b.dek.replace(/thỰC/g, "thực") : b.dek
  return {
    ...b,
    image: anhMoi || b.image,
    title: tieuDeMoi,
    summary: tomTatMoi,
    dek: dekMoi,
  }
}

let daTai: { duLieu: DuLieuJournal; luc: number } | null = null
let dangTai: Promise<DuLieuJournal> | null = null
const boNhoBai = new Map<string, { bai: BaiJournalChiTiet | null; luc: number }>()

/**
 * Chuyển đổi văn bản thô thành tài liệu NodeNoiDung cho trình đọc bài.
 */
function vanBanThanhNoiDung(vanBan: string): NodeNoiDung {
  const doan = vanBan
    .split("\n\n")
    .map((d) => d.trim())
    .filter(Boolean)
  if (doan.length === 0) return { type: "doc", content: [] }
  const inline = (chu: string): NodeNoiDung[] =>
    chu.split("\n").flatMap((dong, i) => [
      ...(i > 0 ? [{ type: "hardBreak" }] : []),
      ...(dong ? [{ type: "text", text: dong }] : []),
    ])
  return {
    type: "doc",
    content: doan.map((d) => {
      if (d.startsWith("### ")) return { type: "heading", attrs: { level: 3 }, content: inline(d.slice(4)) }
      if (d.startsWith("## ")) return { type: "heading", attrs: { level: 2 }, content: inline(d.slice(3)) }
      if (d.startsWith("> ")) return { type: "blockquote", content: [{ type: "paragraph", content: inline(d.slice(2)) }] }
      return { type: "paragraph", content: inline(d) }
    }),
  }
}

type SeedChuyenMuc = {
  slug: string
  code: string
  name: string
  englishName?: string | null
  label?: string
  description: string
  image: string | null
}

type SeedBaiViet = {
  slug: string
  category: string
  date?: string | null
  title: string
  summary: string
  image: string | null
  featured?: boolean
  content: string
}

type SeedDuLieu = {
  categories: SeedChuyenMuc[]
  articles: SeedBaiViet[]
}

/**
 * Dự phòng dữ liệu tĩnh từ seed JSON khi backend không chạy (môi trường dev không bật MySQL).
 */
async function layDuLieuDuPhong<T>(duongDan: string): Promise<T | null> {
  try {
    const mod = await import("./journal-ban-dau.json")
    const seed = ((mod as { default?: SeedDuLieu }).default ?? mod) as SeedDuLieu
    const maTheoCode = new Map<string, number>(seed.categories.map((m: SeedChuyenMuc, i: number) => [m.code, i + 1]))

    if (duongDan === "/journal") {
      const categories: ChuyenMucJournal[] = seed.categories.map((m: SeedChuyenMuc, i: number) => ({
        id: i + 1,
        slug: m.slug,
        name: m.name,
        englishName: m.englishName ?? null,
        label: m.label || m.name,
        description: m.description,
        image: m.image,
        imageWidth: 800,
        imageHeight: 600,
      }))

      const articles: BaiJournal[] = seed.articles.map((b: SeedBaiViet) =>
        chuanHoaBai({
          slug: b.slug,
          categoryId: maTheoCode.get(b.category) ?? 1,
          title: b.title,
          dek: b.summary.slice(0, 150),
          summary: b.summary,
          image: b.image,
          imageAlt: b.title,
          imageWidth: 800,
          imageHeight: 600,
          date: b.date ? new Date(b.date.replace(/\./g, "-")).toISOString() : null,
          featured: Boolean(b.featured),
        }),
      )

      return { categories, articles } as T
    }

    if (duongDan.startsWith("/journal/articles/")) {
      const slug = decodeURIComponent(duongDan.slice("/journal/articles/".length))
      const baiTim = seed.articles.find((b: SeedBaiViet) => b.slug === slug)
      if (!baiTim) return null

      const baiChiTiet: BaiJournalChiTiet = chuanHoaBai({
        slug: baiTim.slug,
        categoryId: maTheoCode.get(baiTim.category) ?? 1,
        title: baiTim.title,
        dek: baiTim.summary.slice(0, 150),
        summary: baiTim.summary,
        image: baiTim.image,
        imageAlt: baiTim.title,
        imageWidth: 800,
        imageHeight: 600,
        date: baiTim.date ? new Date(baiTim.date.replace(/\./g, "-")).toISOString() : null,
        featured: Boolean(baiTim.featured),
        content: vanBanThanhNoiDung(baiTim.content),
      })

      return baiChiTiet as T
    }
  } catch {}
  return null
}

/**
 * Gọi API công khai và trả phần `data`.
 *
 * @param duongDan - Đường dẫn sau `/api/v1`
 * @returns Dữ liệu, hoặc `null` khi 404
 * @throws Error khi mất kết nối hoặc máy chủ lỗi
 */
async function goiApiCongKhai<T>(duongDan: string): Promise<T | null> {
  try {
    const phanHoi = await fetch(`/api/v1${duongDan}`, { headers: { Accept: "application/json" }, credentials: "omit" })
    if (phanHoi.status === 404) return null
    if (!phanHoi.ok) throw new Error(`HTTP ${phanHoi.status}`)
    return ((await phanHoi.json()) as { data: T }).data
  } catch (err) {
    const duPhong = await layDuLieuDuPhong<T>(duongDan)
    if (duPhong) return duPhong
    throw err
  }
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
      const ketQua: DuLieuJournal = duLieu
        ? {
            categories: duLieu.categories,
            articles: duLieu.articles.map(chuanHoaBai),
          }
        : { categories: [], articles: [] }
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
  const baiChuan = bai ? chuanHoaBai(bai) : null
  boNhoBai.set(slug, { bai: baiChuan, luc: Date.now() })
  return baiChuan
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
