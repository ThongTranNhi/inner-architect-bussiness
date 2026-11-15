/**
 * Quy tắc nội dung bài Journal (phía máy chủ).
 *
 * Nội dung được lưu dưới dạng cây JSON của trình soạn thảo (định dạng ProseMirror/Tiptap).
 * Mọi nội dung gửi lên đều đi qua `chuanHoaNoiDung`: chỉ giữ các node/mark/thuộc tính
 * trong danh sách cho phép, từ chối mọi thứ khác (script, iframe, thuộc tính sự kiện,
 * style, giao thức liên kết nguy hiểm…). Frontend hiển thị nội dung bằng cùng danh sách
 * này (`src/journal/noi-dung/HienThiNoiDung.tsx`), không bao giờ dùng HTML thô.
 */

/** Node khối được phép ở cấp tài liệu. */
const NODE_KHOI = new Set(["paragraph", "heading", "bulletList", "orderedList", "blockquote", "image"])

/** Node được phép bên trong một mục danh sách. */
const NODE_TRONG_MUC_DANH_SACH = new Set(["paragraph", "bulletList", "orderedList"])

/** Node được phép bên trong trích dẫn. */
const NODE_TRONG_TRICH_DAN = new Set(["paragraph", "bulletList", "orderedList"])

/** Mark (định dạng chữ) được phép. */
const MARK_CHO_PHEP = new Set(["bold", "italic", "underline", "link"])

/** Giới hạn để chặn nội dung bất thường làm nặng máy chủ hoặc trình duyệt. */
export const GIOI_HAN_NOI_DUNG = {
  soNodeToiDa: 8000,
  doSauToiDa: 8,
  tongKyTuToiDa: 200_000,
  soAnhToiDa: 60,
  doDaiAltToiDa: 300,
  doDaiChuThichToiDa: 500,
  doDaiLienKetToiDa: 2000,
} as const

/** Đường dẫn ảnh tải lên qua trang quản trị: `/media/journal/<uuid>.<ext>`. */
export const MAU_ANH_TAI_LEN = /^\/media\/journal\/[a-f0-9-]{36}\.(jpg|png|webp)$/

/** Ảnh tĩnh có sẵn trong `public/assets` (dùng cho dữ liệu chuyển từ website cũ). */
export const MAU_ANH_TINH = /^\/assets\/[A-Za-z0-9._/-]+\.(jpg|jpeg|png|webp)$/

/**
 * Kiểm tra đường dẫn ảnh có thuộc nguồn được phép không (ảnh tải lên hoặc ảnh tĩnh của site).
 * Chặn URL ngoài, `data:`, `javascript:` và đường dẫn có `..`.
 *
 * @param duongDan - Giá trị `src`
 * @returns `true` nếu hợp lệ
 */
export function laDuongDanAnhHopLe(duongDan: unknown): duongDan is string {
  if (typeof duongDan !== "string" || duongDan.includes("..")) return false
  return MAU_ANH_TAI_LEN.test(duongDan) || MAU_ANH_TINH.test(duongDan)
}

/**
 * Kiểm tra liên kết trong bài: chỉ `http(s)://`, `mailto:`, `tel:`, đường dẫn nội bộ
 * bắt đầu bằng một dấu `/` hoặc anchor `#…`. Chặn `javascript:`, `data:`, `vbscript:`,
 * `//host` (protocol-relative) và ký tự điều khiển.
 *
 * @param lienKet - Giá trị `href`
 * @returns `true` nếu an toàn
 */
export function laLienKetAnToan(lienKet: unknown): lienKet is string {
  if (typeof lienKet !== "string") return false
  if (lienKet.length === 0 || lienKet.length > GIOI_HAN_NOI_DUNG.doDaiLienKetToiDa) return false
  // Ký tự điều khiển / khoảng trắng có thể dùng để lách bộ lọc giao thức.
  if (/[\u0000- \u007f-\u009f\\]/.test(lienKet)) return false
  if (lienKet.startsWith("/")) return !lienKet.startsWith("//")
  if (lienKet.startsWith("#")) return true
  if (/^mailto:[^\s]+$/i.test(lienKet) || /^tel:\+?[0-9().-]{3,30}$/i.test(lienKet)) return true
  try {
    const url = new URL(lienKet)
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.length > 0
  } catch {
    return false
  }
}

/** Lỗi nội dung không hợp lệ; `viTri` mô tả node gây lỗi để hiển thị cho người soạn. */
export class LoiNoiDung extends Error {
  /**
   * @param thongDiep - Mô tả lỗi bằng tiếng Việt
   */
  constructor(thongDiep: string) {
    super(thongDiep)
    this.name = "LoiNoiDung"
  }
}

/** Một node đã chuẩn hóa (chỉ gồm khóa được phép). */
export type NodeNoiDung = {
  type: string
  attrs?: Record<string, string | number | null>
  content?: NodeNoiDung[]
  text?: string
  marks?: { type: string; attrs?: Record<string, string> }[]
}

/** Tài liệu rỗng hợp lệ. */
export const TAI_LIEU_RONG: NodeNoiDung = { type: "doc", content: [{ type: "paragraph" }] }

type BoDem = { soNode: number; kyTu: number; soAnh: number }

/**
 * Đọc thuộc tính `attrs` của node thô một cách an toàn.
 *
 * @param node - Node thô
 * @returns Bản ghi thuộc tính hoặc object rỗng
 */
function docThuocTinh(node: Record<string, unknown>): Record<string, unknown> {
  const attrs = node.attrs
  return typeof attrs === "object" && attrs !== null && !Array.isArray(attrs)
    ? (attrs as Record<string, unknown>)
    : {}
}

/**
 * Chuẩn hóa chuỗi văn bản thuần: bỏ ký tự điều khiển (trừ xuống dòng/tab), giới hạn độ dài.
 *
 * @param giaTri - Giá trị thô
 * @param toiDa - Độ dài tối đa
 * @returns Chuỗi đã làm sạch, hoặc `""`
 */
function chuoiSach(giaTri: unknown, toiDa: number): string {
  if (typeof giaTri !== "string") return ""
  return giaTri.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, toiDa)
}

/**
 * Chuẩn hóa danh sách mark của một node chữ.
 *
 * @param marks - Mark thô
 * @returns Mark hợp lệ, không trùng loại
 * @throws LoiNoiDung khi có mark lạ hoặc liên kết không an toàn
 */
function chuanHoaMark(marks: unknown): NodeNoiDung["marks"] {
  if (marks === undefined) return undefined
  if (!Array.isArray(marks)) throw new LoiNoiDung("Định dạng chữ không hợp lệ.")
  const ketQua: NonNullable<NodeNoiDung["marks"]> = []
  const daCo = new Set<string>()
  for (const mark of marks) {
    if (typeof mark !== "object" || mark === null) throw new LoiNoiDung("Định dạng chữ không hợp lệ.")
    const loai = (mark as Record<string, unknown>).type
    if (typeof loai !== "string" || !MARK_CHO_PHEP.has(loai))
      throw new LoiNoiDung(`Định dạng "${String(loai)}" không được hỗ trợ.`)
    if (daCo.has(loai)) continue
    daCo.add(loai)
    if (loai === "link") {
      const href = docThuocTinh(mark as Record<string, unknown>).href
      if (!laLienKetAnToan(href)) throw new LoiNoiDung("Liên kết không hợp lệ hoặc dùng giao thức không được phép.")
      ketQua.push({ type: "link", attrs: { href } })
    } else ketQua.push({ type: loai })
  }
  return ketQua.length > 0 ? ketQua : undefined
}

/**
 * Chuẩn hóa nội dung inline (chữ và xuống dòng) của đoạn văn / tiêu đề.
 *
 * @param content - Mảng node con thô
 * @param boDem - Bộ đếm giới hạn
 * @returns Node inline hợp lệ (bỏ node chữ rỗng)
 */
function chuanHoaInline(content: unknown, boDem: BoDem): NodeNoiDung[] | undefined {
  if (content === undefined) return undefined
  if (!Array.isArray(content)) throw new LoiNoiDung("Nội dung đoạn văn không hợp lệ.")
  const ketQua: NodeNoiDung[] = []
  for (const con of content) {
    if (typeof con !== "object" || con === null) throw new LoiNoiDung("Nội dung đoạn văn không hợp lệ.")
    const node = con as Record<string, unknown>
    boDem.soNode++
    if (node.type === "hardBreak") {
      ketQua.push({ type: "hardBreak" })
      continue
    }
    if (node.type !== "text") throw new LoiNoiDung(`Thành phần "${String(node.type)}" không được hỗ trợ trong đoạn văn.`)
    if (typeof node.text !== "string") throw new LoiNoiDung("Nội dung chữ không hợp lệ.")
    const text = node.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    if (text.length === 0) continue
    boDem.kyTu += text.length
    const marks = chuanHoaMark(node.marks)
    ketQua.push(marks ? { type: "text", text, marks } : { type: "text", text })
  }
  return ketQua.length > 0 ? ketQua : undefined
}

/**
 * Chuẩn hóa một node khối theo ngữ cảnh cha.
 *
 * @param con - Node thô
 * @param choPhep - Tập loại node được phép tại vị trí này
 * @param doSau - Độ sâu hiện tại
 * @param boDem - Bộ đếm giới hạn
 * @returns Node khối hợp lệ
 * @throws LoiNoiDung khi node không được phép hoặc vượt giới hạn
 */
function chuanHoaKhoi(con: unknown, choPhep: Set<string>, doSau: number, boDem: BoDem): NodeNoiDung {
  if (typeof con !== "object" || con === null || Array.isArray(con))
    throw new LoiNoiDung("Cấu trúc nội dung không hợp lệ.")
  const node = con as Record<string, unknown>
  const loai = node.type
  if (typeof loai !== "string" || !choPhep.has(loai))
    throw new LoiNoiDung(`Thành phần "${String(loai)}" không được hỗ trợ tại vị trí này.`)
  if (doSau > GIOI_HAN_NOI_DUNG.doSauToiDa) throw new LoiNoiDung("Danh sách lồng nhau quá sâu.")
  boDem.soNode++
  if (boDem.soNode > GIOI_HAN_NOI_DUNG.soNodeToiDa) throw new LoiNoiDung("Bài viết quá dài.")
  const attrs = docThuocTinh(node)

  switch (loai) {
    case "paragraph": {
      const content = chuanHoaInline(node.content, boDem)
      return content ? { type: "paragraph", content } : { type: "paragraph" }
    }
    case "heading": {
      const level = attrs.level === 3 ? 3 : attrs.level === 2 ? 2 : null
      if (level === null) throw new LoiNoiDung("Chỉ hỗ trợ tiêu đề phụ H2 và H3.")
      const content = chuanHoaInline(node.content, boDem)
      return content ? { type: "heading", attrs: { level }, content } : { type: "heading", attrs: { level } }
    }
    case "bulletList":
    case "orderedList": {
      const mucCon = Array.isArray(node.content) ? node.content : []
      if (mucCon.length === 0) throw new LoiNoiDung("Danh sách không có mục nào.")
      const content = mucCon.map((muc) => {
        if (typeof muc !== "object" || muc === null || (muc as Record<string, unknown>).type !== "listItem")
          throw new LoiNoiDung("Danh sách chỉ được chứa các mục danh sách.")
        boDem.soNode++
        const khoiCon = (muc as Record<string, unknown>).content
        const mangKhoi = Array.isArray(khoiCon) && khoiCon.length > 0 ? khoiCon : [{ type: "paragraph" }]
        return {
          type: "listItem",
          content: mangKhoi.map((k) => chuanHoaKhoi(k, NODE_TRONG_MUC_DANH_SACH, doSau + 1, boDem)),
        }
      })
      if (loai === "orderedList") {
        const start = typeof attrs.start === "number" && Number.isInteger(attrs.start) ? attrs.start : 1
        if (start < 1 || start > 10_000) throw new LoiNoiDung("Số bắt đầu của danh sách không hợp lệ.")
        return start === 1 ? { type: loai, content } : { type: loai, attrs: { start }, content }
      }
      return { type: loai, content }
    }
    case "blockquote": {
      const khoiCon = Array.isArray(node.content) && node.content.length > 0 ? node.content : [{ type: "paragraph" }]
      return {
        type: "blockquote",
        content: khoiCon.map((k) => chuanHoaKhoi(k, NODE_TRONG_TRICH_DAN, doSau + 1, boDem)),
      }
    }
    case "image": {
      boDem.soAnh++
      if (boDem.soAnh > GIOI_HAN_NOI_DUNG.soAnhToiDa) throw new LoiNoiDung("Bài viết có quá nhiều ảnh.")
      if (!laDuongDanAnhHopLe(attrs.src))
        throw new LoiNoiDung("Ảnh trong bài phải là ảnh đã tải lên thư viện Journal.")
      const kichThuoc = (giaTri: unknown) =>
        typeof giaTri === "number" && Number.isInteger(giaTri) && giaTri > 0 && giaTri <= 20_000 ? giaTri : null
      return {
        type: "image",
        attrs: {
          src: attrs.src,
          alt: chuoiSach(attrs.alt, GIOI_HAN_NOI_DUNG.doDaiAltToiDa),
          caption: chuoiSach(attrs.caption, GIOI_HAN_NOI_DUNG.doDaiChuThichToiDa),
          width: kichThuoc(attrs.width),
          height: kichThuoc(attrs.height),
        },
      }
    }
    default:
      throw new LoiNoiDung(`Thành phần "${loai}" không được hỗ trợ.`)
  }
}

/**
 * Xác thực và chuẩn hóa tài liệu nội dung bài viết.
 *
 * @param taiLieu - JSON tài liệu gửi từ trình soạn thảo (`{ type: "doc", content: [...] }`)
 * @returns Tài liệu đã chuẩn hóa, chỉ còn các thành phần được phép
 * @throws LoiNoiDung với thông điệp tiếng Việt khi nội dung không hợp lệ
 */
export function chuanHoaNoiDung(taiLieu: unknown): NodeNoiDung {
  if (typeof taiLieu !== "object" || taiLieu === null || (taiLieu as Record<string, unknown>).type !== "doc")
    throw new LoiNoiDung("Nội dung bài viết không đúng định dạng.")
  const content = (taiLieu as Record<string, unknown>).content
  if (content !== undefined && !Array.isArray(content)) throw new LoiNoiDung("Nội dung bài viết không đúng định dạng.")
  const boDem: BoDem = { soNode: 0, kyTu: 0, soAnh: 0 }
  const khoi = (content ?? []).map((con) => chuanHoaKhoi(con, NODE_KHOI, 1, boDem))
  if (boDem.kyTu > GIOI_HAN_NOI_DUNG.tongKyTuToiDa) throw new LoiNoiDung("Bài viết quá dài.")
  return { type: "doc", content: khoi.length > 0 ? khoi : [{ type: "paragraph" }] }
}

/**
 * Liệt kê đường dẫn ảnh tải lên được dùng trong nội dung (để kiểm tra ảnh còn tồn tại).
 *
 * @param taiLieu - Tài liệu đã chuẩn hóa
 * @returns Danh sách `src` dạng `/media/journal/...` không trùng
 */
export function layAnhTaiLenTrongNoiDung(taiLieu: NodeNoiDung): string[] {
  const ketQua = new Set<string>()
  const duyet = (node: NodeNoiDung) => {
    if (node.type === "image" && typeof node.attrs?.src === "string" && MAU_ANH_TAI_LEN.test(node.attrs.src))
      ketQua.add(node.attrs.src)
    node.content?.forEach(duyet)
  }
  duyet(taiLieu)
  return [...ketQua]
}

/**
 * Chuyển văn bản thuần (các đoạn cách nhau bằng dòng trống) thành tài liệu nội dung.
 * Dùng khi nhập dữ liệu cũ: giữ nguyên từng đoạn; đoạn bắt đầu bằng `## `, `### `, `> `
 * được hiểu như bộ hiển thị cũ (tiêu đề phụ, trích dẫn).
 *
 * @param vanBan - Nội dung dạng văn bản
 * @returns Tài liệu nội dung
 */
export function vanBanThanhNoiDung(vanBan: string): NodeNoiDung {
  const doan = vanBan
    .split("\n\n")
    .map((d) => d.trim())
    .filter(Boolean)
  if (doan.length === 0) return TAI_LIEU_RONG
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

/**
 * Tạo slug ASCII từ tiêu đề tiếng Việt: bỏ dấu, `đ` → `d`, chỉ giữ `a-z0-9-`.
 *
 * @param chuoi - Tiêu đề / tên
 * @param toiDa - Độ dài tối đa của slug
 * @returns Slug, hoặc `""` nếu không còn ký tự hợp lệ
 */
export function taoSlug(chuoi: string, toiDa = 120): string {
  return chuoi
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, toiDa)
    .replace(/-+$/g, "")
}

/**
 * Dòng mô tả ngắn (dek) hiển thị dưới tiêu đề trên thẻ bài: 60 ký tự đầu của đoạn giới thiệu,
 * theo đúng quy tắc của dữ liệu website cũ.
 *
 * @param doanGioiThieu - Đoạn giới thiệu
 * @returns Chuỗi rút gọn
 */
export function taoDongMoTa(doanGioiThieu: string): string {
  return doanGioiThieu.length > 60 ? `${doanGioiThieu.slice(0, 60)}...` : doanGioiThieu
}
