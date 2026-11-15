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
  tieuBieu?: boolean
  content?: string
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

/** Cấu trúc một trong Sáu chuyên mục chính theo file Word `Inner_Architect_Journal_Co_Hinh_Anh.docx`. */
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

/**
 * Danh sách Sáu chuyên mục chính của Journal theo file Word:
 * 01. Self-Discovery · Khám phá bản thân (25%)
 * 02. Relationships & Healing · Mối quan hệ & Chữa lành (20%)
 * 03. Wisdom & Philosophy · Triết học & Minh triết sống (20%)
 * 04. Tarot & Symbolism · Tarot & Ngôn ngữ biểu tượng (15%)
 * 05. Mindful Living · Sống tỉnh thức & Phát triển bản thân (15%)
 * 06. The Hermit Stories · Chuyện nhà Hermit (5%)
 */
export const SAU_CHUYEN_MUC_JOURNAL: readonly ChuyenMucJournal[] = [
  {
    id: "01",
    maDanhMuc: "HIỂU MÌNH",
    nhanBoLoc: "Hiểu mình",
    tenTiengAnh: "Self-Discovery",
    tenTiengViet: "Khám phá bản thân",
    moTa: "Nhận diện cảm xúc, niềm tin, giá trị sống, bản sắc cá nhân và khuôn mẫu suy nghĩ – hành vi.",
    tyTrong: "25% tỷ trọng",
    chuDe: "Bản sắc & Tự chủ",
    trichDan: "Bạn không cần phải sửa chữa chính mình. Bạn chỉ cần thấu hiểu cấu trúc đang vận hành bên trong.",
    thoiGianDoc: "6 phút chiêm nghiệm",
    baiGoiY: {
      tieuDe: "Bạn thật sự là ai khi không còn phải làm hài lòng người khác?",
      slug: "ban-that-su-la-ai-khi-khong-con-phai-lam-hai-long-nguoi-khac",
    },
    image: "/assets/journal/goc/hinh01.webp",
  },
  {
    id: "02",
    maDanhMuc: "MỐI QUAN HỆ",
    nhanBoLoc: "Mối quan hệ",
    tenTiengAnh: "Relationships & Healing",
    tenTiengViet: "Mối quan hệ & Chữa lành",
    moTa: "Các kiểu gắn bó, ranh giới, tổn thương cảm xúc, phụ thuộc và những vòng lặp trong mối quan hệ.",
    tyTrong: "20% tỷ trọng",
    chuDe: "Gắn bó & Ranh giới an toàn",
    trichDan: "Mọi ranh giới đặt ra không phải để xa cách, mà để tình yêu được tồn tại trong sự tôn trọng và tự do.",
    thoiGianDoc: "5 phút chiêm nghiệm",
    baiGoiY: {
      tieuDe: "Vì sao chúng ta cứ yêu những người khiến mình đau khổ?",
      slug: "vi-sao-chung-ta-cu-yeu-nhung-nguoi-khien-minh-dau-kho",
    },
    image: "/assets/journal/goc/hinh02.webp",
  },
  {
    id: "03",
    maDanhMuc: "MINH TRIẾT",
    nhanBoLoc: "Minh triết",
    tenTiengAnh: "Wisdom & Philosophy",
    tenTiengViet: "Triết học & Minh triết sống",
    moTa: "Đạo Đức Kinh, triết học Đạo gia, Phật học và các tư tưởng Đông – Tây trong đối thoại với đời sống hiện đại. Series chủ lực: Đạo & Tâm.",
    tyTrong: "20% tỷ trọng",
    chuDe: "Minh triết Đạo gia & Tâm thức",
    trichDan: "Trời đất không có tâm riêng, vạn vật tự vận hành. Hiểu Đạo là học cách xuôi dòng mà không đánh mất cốt cách.",
    thoiGianDoc: "7 phút chiêm nghiệm",
    baiGoiY: {
      tieuDe: "Đọc Lão Tử, hiểu chính mình: Vì sao càng cố kiểm soát, ta càng bất an?",
      slug: "doc-lao-tu-hieu-chinh-minh-vi-sao-cang-co-kiem-soat-ta-cang-bat-an",
    },
    image: "/assets/journal/goc/hinh03.webp",
  },
  {
    id: "04",
    maDanhMuc: "TAROT",
    nhanBoLoc: "Tarot",
    tenTiengAnh: "Tarot & Symbolism",
    tenTiengViet: "Tarot & Ngôn ngữ biểu tượng",
    moTa: "Ý nghĩa biểu tượng Tarot, nguyên mẫu Jung và những câu hỏi phản tư từ các lá bài; không định vị Tarot là công cụ tiên đoán hay chẩn đoán.",
    tyTrong: "15% tỷ trọng",
    chuDe: "Biểu tượng & Vô thức phản chiếu",
    trichDan: "Những lá bài không tiên đoán tương lai. Chúng là tấm gương soi rọi những gì vô thức đang ngấm ngầm dẫn dắt bạn.",
    thoiGianDoc: "5 phút chiêm nghiệm",
    baiGoiY: {
      tieuDe: "The Hermit – Khi ánh sáng không còn đến từ bên ngoài",
      slug: "the-hermit-khi-anh-sang-khong-con-den-tu-ben-ngoai",
    },
    image: "/assets/journal/goc/hinh04.webp",
  },
  {
    id: "05",
    maDanhMuc: "SỐNG TỈNH THỨC",
    nhanBoLoc: "Sống tỉnh thức",
    tenTiengAnh: "Mindful Living",
    tenTiengViet: "Sống tỉnh thức & Phát triển bản thân",
    moTa: "Chánh niệm, thiền, viết nhật ký, xây dựng thói quen, tự chủ và thực hành quan sát nội tâm.",
    tyTrong: "15% tỷ trọng",
    chuDe: "Chánh niệm & Thói quen tự chủ",
    trichDan: "Khoảnh khắc bạn dừng lại và quan sát từng hơi thở, bạn đã từng bước thoát khỏi sự chi phối của những quán tính cũ.",
    thoiGianDoc: "5 phút chiêm nghiệm",
    baiGoiY: {
      tieuDe: "Học cách hiện diện thay vì luôn chạy theo tương lai",
      slug: "hoc-cach-hien-dien-thay-vi-luon-chay-theo-tuong-lai",
    },
    image: "/assets/journal/goc/hinh05.webp",
  },
  {
    id: "06",
    maDanhMuc: "THE HERMIT",
    nhanBoLoc: "The Hermit",
    tenTiengAnh: "The Hermit Stories",
    tenTiengViet: "Chuyện nhà Hermit",
    moTa: "Câu chuyện thương hiệu, trà đạo, không gian, workshop, cộng đồng và trải nghiệm tại The Hermit.",
    tyTrong: "5% tỷ trọng",
    chuDe: "Trà đạo & Không gian tĩnh tại",
    trichDan: "Một chén trà ấm, một góc sáng dịu và một khoảng lặng đủ sâu để mỗi người tự đối thoại với chính mình.",
    thoiGianDoc: "4 phút chiêm nghiệm",
    baiGoiY: {
      tieuDe: "Một tách trà, một khoảng lặng, một cuộc gặp gỡ với chính mình",
      slug: "mot-tach-tra-mot-khoang-lang-mot-cuoc-gap-go-voi-chinh-minh",
    },
    image: "/assets/journal/goc/hinh06.webp",
  },
]

/**
 * Đếm số lượng bài viết có trong một chuyên mục cụ thể.
 *
 * @param baiViet - Danh sách toàn bộ bài viết
 * @param maDanhMuc - Mã chuyên mục (ví dụ "HIỂU MÌNH")
 * @returns Số bài viết thuộc chuyên mục đó
 */
export function demSoBaiVietTheoChuyenMuc(
  baiViet: readonly BaiJournal[],
  maDanhMuc: string,
): number {
  return baiViet.filter((b) => b.category === maDanhMuc).length
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
 * Lấy danh sách bài tiêu biểu hiển thị ở phần trên cùng.
 * Ưu tiên các bài có cờ `tieuBieu: true`; nếu chưa đủ số lượng thì lấy các bài đầu tiên.
 *
 * @param baiViet - Toàn bộ bài viết
 * @param toiDa - Số lượng bài tiêu biểu tối đa cần lấy (mặc định 3 bài)
 * @returns Mảng các bài viết tiêu biểu
 */
export function layBaiTieuBieu(
  baiViet: readonly BaiJournal[],
  toiDa = 3,
): BaiJournal[] {
  const ghim = baiViet.filter((b) => Boolean(b.tieuBieu))
  if (ghim.length >= toiDa) {
    return ghim.slice(0, toiDa)
  }
  const slugsDaCo = new Set(ghim.map((b) => b.slug))
  const conLai = baiViet.filter((b) => !slugsDaCo.has(b.slug))
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
 * @param danhMuc - Chuyên mục cần lọc; `null` là "Tất cả"
 * @param slugTieuDiem - Slug hoặc danh sách slug của bài tiêu điểm cần ẩn khi ở chế độ "Tất cả"
 * @returns Danh sách bài cần hiện trong lưới, giữ nguyên thứ tự gốc
 */
export function locBaiJournal(
  baiViet: readonly BaiJournal[],
  danhMuc: string | null,
  slugTieuDiem?: string | readonly string[],
): BaiJournal[] {
  if (danhMuc === null) {
    if (!slugTieuDiem) return [...baiViet]
    const boQua = new Set(
      typeof slugTieuDiem === "string" ? [slugTieuDiem] : slugTieuDiem,
    )
    return baiViet.filter((bai) => !boQua.has(bai.slug))
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
 * Thuộc tính kích thước cho ảnh Journal.
 *
 * @param duongDan - Đường dẫn ảnh, ví dụ `/assets/journal/goc/hinh01.webp`
 * @returns `{ width, height }` theo kích thước gốc; object rỗng nếu chưa khai báo
 */
export function kichThuocAnh(duongDan: string): {
  width?: number
  height?: number
} {
  const kichThuoc = KICH_THUOC_ANH_JOURNAL[duongDan]
  return kichThuoc ? { width: kichThuoc[0], height: kichThuoc[1] } : {}
}
