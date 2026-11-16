/**
 * Logic thuần cho trang Journal (không phụ thuộc React), tách riêng để test bằng
 * `node --test` có thể import trực tiếp. Chuyên mục và bài viết lấy từ API
 * (`du-lieu-journal.ts`), do nhân viên quản lý trong trang quản trị.
 */

/** Slug bài hợp lệ trên URL `/journal/<slug>` (khớp quy tắc máy chủ). */
export const MAU_SLUG_JOURNAL = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Bài tối thiểu mà các hàm lọc cần. */
export type BaiCoChuyenMuc = { slug: string; categoryId: number; featured?: boolean; date?: string | null }

/**
 * Cấu trúc chuyên mục kiểu cũ (dữ liệu tĩnh theo file Word). Chỉ còn dùng cho các component
 * trình bày chưa gắn vào trang (`StackedCardGallery`, `SwissCategoryCards`); chuyên mục thật
 * lấy từ API (`ChuyenMucJournal` trong `du-lieu-journal.ts`).
 */
export type ChuyenMucJournal = {
  id: string
  maDanhMuc: string
  nhanBoLoc: string
  tenTiengAnh: string
  tenTiengViet: string
  moTa: string
  tyTrong: string
  chuDe: string
  trichDan: string
  thoiGianDoc: string
  baiGoiY: {
    tieuDe: string
    slug: string
  }
  image: string
}

/** Một chuyên đề dài hạn (Signature Series). */
export type ChuyenDeJournal = {
  id: string
  title: string
  subtitle: string
  description: string
  tag: string
  count: string
}

/**
 * Lấy danh sách bài tiêu biểu hiển thị ở phần trên cùng.
 * Ưu tiên các bài được đánh dấu tiêu biểu (`featured`); nếu chưa đủ số lượng thì lấy các bài đầu tiên.
 *
 * @param baiViet - Toàn bộ bài viết
 * @param toiDa - Số lượng bài tiêu biểu tối đa cần lấy (mặc định 3 bài)
 * @returns Mảng các bài viết tiêu biểu
 */
export function layBaiTieuBieu<T extends BaiCoChuyenMuc>(
  baiViet: readonly T[],
  toiDa = 3,
): T[] {
  const ghim = baiViet
    .filter((b) => Boolean(b.featured))
    .sort((a, b) => {
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime()
      return 0
    })
  if (ghim.length >= toiDa) {
    return ghim.slice(0, toiDa)
  }
  const slugsDaCo = new Set(ghim.map((b) => b.slug))
  const conLai = baiViet
    .filter((b) => !slugsDaCo.has(b.slug))
    .sort((a, b) => {
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime()
      return 0
    })
  return [...ghim, ...conLai].slice(0, toiDa)
}

/**
 * Lọc bài viết cho thư viện.
 *
 * Ở chế độ "Tất cả", các bài tiêu điểm đã nằm trên khu vực tiêu biểu phía trên
 * nên không lặp lại trong lưới. Khi chọn một chuyên mục, mọi bài thuộc chuyên mục
 * đó đều hiện để không bài nào bị mất khỏi kết quả lọc.
 *
 * @param baiViet - Toàn bộ bài viết theo thứ tự hiển thị
 * @param maChuyenMuc - ID chuyên mục cần lọc; `null` là "Tất cả"
 * @param slugTieuDiem - Slug hoặc danh sách slug của bài tiêu điểm cần ẩn khi ở chế độ "Tất cả"
 * @returns Danh sách bài cần hiện trong lưới, giữ nguyên thứ tự gốc
 */
export function locBaiJournal<T extends BaiCoChuyenMuc>(
  baiViet: readonly T[],
  maChuyenMuc: number | null,
  slugTieuDiem?: string | readonly string[],
): T[] {
  if (maChuyenMuc === null) {
    if (!slugTieuDiem) return [...baiViet]
    const boQua = new Set(
      typeof slugTieuDiem === "string" ? [slugTieuDiem] : slugTieuDiem,
    )
    return baiViet.filter((bai) => !boQua.has(bai.slug))
  }
  return baiViet.filter((bai) => bai.categoryId === maChuyenMuc)
}

/**
 * Các kiểu hiện ảnh trên Journal; CSS (`[data-anh="..."]` trong `index.css`)
 * định nghĩa điểm bắt đầu của từng kiểu, cùng easing và thời lượng nên vẫn
 * đồng nhất về độ mượt.
 */
export const KIEU_HIEN_ANH = [
  "trai",
  "giua-doc",
  "khung",
  "cheo",
  "phai",
  "mo",
  "giua-ngang",
] as const

/** Một kiểu hiện ảnh; `tren` dành riêng cho ảnh bài tiêu điểm. */
export type KieuHienAnh = (typeof KIEU_HIEN_ANH)[number] | "tren"

/**
 * Chọn kiểu hiện cho ảnh của hàng bài viết thứ `viTri`. Xoay vòng qua
 * `KIEU_HIEN_ANH` nên hai ảnh liền nhau không bao giờ trùng kiểu, và ảnh đầu
 * tiên khác kiểu `tren` của bài tiêu điểm ngay phía trên.
 *
 * @param viTri - Vị trí hàng trong danh sách đang hiện (từ 0)
 * @returns Giá trị cho thuộc tính `data-anh` của khung ảnh
 */
export function kieuHienAnh(viTri: number): KieuHienAnh {
  return KIEU_HIEN_ANH[viTri % KIEU_HIEN_ANH.length]
}

/**
 * Kích thước gốc (rộng, cao) của ảnh dùng trên Journal. Gắn vào `width`/`height`
 * của thẻ `<img>` để trình duyệt giữ đúng tỉ lệ và chừa chỗ trước khi ảnh tải
 * (không giật bố cục). Ảnh `goc/hinh01–06` là bản gốc trong
 * `D:\inner-architect\journal`, đã đối chiếu khớp ảnh 1–6 của file DOCX.
 */
export const KICH_THUOC_ANH_JOURNAL: Readonly<
  Record<string, readonly [number, number]>
> = {
  "/assets/journal/goc/hinh01.webp": [1536, 1024],
  "/assets/journal/goc/hinh02.webp": [1536, 1024],
  "/assets/journal/goc/hinh03.webp": [1536, 1024],
  "/assets/journal/goc/hinh04.webp": [1536, 1024],
  "/assets/journal/goc/hinh05.webp": [1536, 1024],
  "/assets/journal/goc/hinh06.webp": [1536, 1024],
  "/assets/journal/goc/hinh07.webp": [1536, 1024],
  "/assets/journal/goc/hinh08.webp": [1600, 1200],
  "/assets/journal/journal-tarot-reading-horizontal.webp": [2048, 1536],
  "/assets/journal/journal-tarot-flatlay-vertical.webp": [1536, 2048],
  "/assets/journal/journal-tarot-spread-vertical.webp": [1536, 2048],
  "/assets/journal/journal-tarot-box-portrait.webp": [1536, 2048],
  "/assets/home-story/the-hermit-room.webp": [1448, 1086],
  "/assets/the-hermit/01-mat-tien-cua-tiem-storefront.webp": [1087, 1447],
  "/assets/the-hermit/main-hall-placeholder.webp": [1086, 1448],
  "/assets/the-hermit/tea-room-placeholder.webp": [1448, 1086],
  "/assets/homepage-curated/01-workshop-cham-ve-de-diu-lai.webp": [800, 533],
  "/assets/homepage-curated/04-the-lo-trinh-thuc-hanh-phan-tu.webp": [1448, 1086],
  "/assets/homepage-curated/05-the-lo-trinh-the-hermit-room.webp": [1448, 1086],
  "/assets/homepage-curated/11-phien-1-1-the-hermit.webp": [1448, 1086],
  "/assets/workshop/ws-cham-ve-diu-lai-CMQz-7CG.webp": [800, 533],
  "/assets/workshop/01-workshop-khoi-dong-nam-moi.webp": [1280, 720],
  "/assets/workshop/02-workshop-mo-truc-nam-moi.webp": [756, 426],
  "/assets/founder/02-ban-lam-viec-va-khong-gian-sang-lap.webp": [1086, 1448],
}

/**
 * Thuộc tính kích thước cho ảnh Journal. Ảnh tải lên qua trang quản trị có kích thước
 * do API trả về; ảnh tĩnh có sẵn tra trong `KICH_THUOC_ANH_JOURNAL`.
 *
 * @param duongDan - Đường dẫn ảnh, ví dụ `/assets/journal/goc/hinh01.webp`
 * @param rong - Chiều rộng từ API (nếu có)
 * @param cao - Chiều cao từ API (nếu có)
 * @returns `{ width, height }` theo kích thước gốc; object rỗng nếu chưa biết
 */
export function kichThuocAnh(
  duongDan: string | null | undefined,
  rong?: number | null,
  cao?: number | null,
): {
  width?: number
  height?: number
} {
  if (rong && cao) return { width: rong, height: cao }
  if (!duongDan) return {}
  const kichThuoc = KICH_THUOC_ANH_JOURNAL[duongDan]
  return kichThuoc ? { width: kichThuoc[0], height: kichThuoc[1] } : {}
}
