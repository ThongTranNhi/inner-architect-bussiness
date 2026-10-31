/**
 * Dữ liệu và logic lọc thuần cho trang Journal (không phụ thuộc React), tách
 * riêng để test bằng `node --test` có thể import trực tiếp.
 */

/** Một bài viết hiển thị trên Journal. */
export type BaiJournal = {
  category: string
  date: string
  title: string
  italic: string
  summary: string
  image: string
  slug: string
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
 * Thanh danh mục theo file `Inner_Architect_Journal_Co_Hinh_Anh.docx` (mục 2):
 * "Tất cả | Hiểu mình | Mối quan hệ | Minh triết | Tarot | Sống tỉnh thức | The Hermit".
 * `danhMuc` khớp với trường `category` của bài viết.
 */
export const BO_LOC_JOURNAL: readonly {
  nhan: string
  danhMuc: string | null
}[] = [
  { nhan: "Tất cả", danhMuc: null },
  { nhan: "Hiểu mình", danhMuc: "HIỂU MÌNH" },
  { nhan: "Mối quan hệ", danhMuc: "MỐI QUAN HỆ" },
  { nhan: "Minh triết", danhMuc: "MINH TRIẾT" },
  { nhan: "Tarot", danhMuc: "TAROT" },
  { nhan: "Sống tỉnh thức", danhMuc: "SỐNG TỈNH THỨC" },
  { nhan: "The Hermit", danhMuc: "THE HERMIT" },
]

/**
 * Lấy tên chuyên mục dễ đọc (chữ thường theo thanh danh mục) cho một bài.
 *
 * @param danhMuc - Trường `category` của bài, ví dụ `"HIỂU MÌNH"`
 * @returns Nhãn trong `BO_LOC_JOURNAL`, hoặc chính `danhMuc` nếu không có trong danh sách
 */
export function tenChuyenMuc(danhMuc: string): string {
  return BO_LOC_JOURNAL.find((loc) => loc.danhMuc === danhMuc)?.nhan ?? danhMuc
}

/**
 * Lọc bài viết cho thư viện.
 *
 * Ở chế độ "Tất cả", bài tiêu điểm đã nằm trên dải nâu nên không lặp lại trong
 * lưới. Khi chọn một chuyên mục, mọi bài thuộc chuyên mục đó đều hiện, kể cả bài
 * tiêu điểm, để không bài nào bị mất khỏi kết quả lọc.
 *
 * @param baiViet - Toàn bộ bài viết theo thứ tự hiển thị
 * @param danhMuc - Chuyên mục cần lọc; `null` là "Tất cả"
 * @param slugTieuDiem - Slug của bài tiêu điểm
 * @returns Danh sách bài cần hiện trong lưới, giữ nguyên thứ tự gốc
 */
export function locBaiJournal(
  baiViet: readonly BaiJournal[],
  danhMuc: string | null,
  slugTieuDiem: string,
): BaiJournal[] {
  if (danhMuc === null) {
    return baiViet.filter((bai) => bai.slug !== slugTieuDiem)
  }
  return baiViet.filter((bai) => bai.category === danhMuc)
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
  "/assets/journal/goc/hinh01.jpg": [1536, 1024],
  "/assets/journal/goc/hinh02.jpg": [1536, 1024],
  "/assets/journal/goc/hinh03.jpg": [1536, 1024],
  "/assets/journal/goc/hinh04.jpg": [1536, 1024],
  "/assets/journal/goc/hinh05.jpg": [1536, 1024],
  "/assets/journal/goc/hinh06.jpg": [1536, 1024],
  "/assets/journal/goc/hinh07.jpg": [1536, 1024],
  "/assets/journal/goc/hinh08.jpg": [2560, 1920],
  "/assets/journal/journal-tarot-reading-horizontal.webp": [2048, 1536],
  "/assets/journal/journal-tarot-flatlay-vertical.webp": [1536, 2048],
  "/assets/journal/journal-tarot-spread-vertical.webp": [1536, 2048],
}

/**
 * Thuộc tính kích thước cho ảnh Journal.
 *
 * @param duongDan - Đường dẫn ảnh, ví dụ `/assets/journal/goc/hinh01.jpg`
 * @returns `{ width, height }` theo kích thước gốc; object rỗng nếu chưa khai báo
 */
export function kichThuocAnh(duongDan: string): {
  width?: number
  height?: number
} {
  const kichThuoc = KICH_THUOC_ANH_JOURNAL[duongDan]
  return kichThuoc ? { width: kichThuoc[0], height: kichThuoc[1] } : {}
}
