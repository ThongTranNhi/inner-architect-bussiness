/**
 * Quy tắc nội dung bài Journal phía trình duyệt — khớp với máy chủ
 * (`server/src/modules/journal/noi-dung.ts`). Máy chủ là nơi kiểm tra chính trước khi lưu;
 * bộ hiển thị dùng lại các quy tắc này để bản xem trước và bài công khai lọc giống nhau.
 * File không phụ thuộc React để test `node --test` import trực tiếp.
 */

/** Một node nội dung (cây JSON của trình soạn thảo). */
export type NodeNoiDung = {
  type: string
  attrs?: Record<string, unknown>
  content?: NodeNoiDung[]
  text?: string
  marks?: { type: string; attrs?: Record<string, unknown> }[]
}

/** Tài liệu rỗng. */
export const TAI_LIEU_RONG: NodeNoiDung = { type: "doc", content: [{ type: "paragraph" }] }

const MAU_ANH_TAI_LEN = /^\/media\/journal\/[a-f0-9-]{36}\.(jpg|png|webp)$/
const MAU_ANH_TINH = /^\/assets\/[A-Za-z0-9._/-]+\.(jpg|jpeg|png|webp)$/

/**
 * Ảnh hợp lệ: ảnh tải lên thư viện Journal hoặc ảnh tĩnh của website.
 *
 * @param duongDan - Giá trị `src`
 * @returns `true` nếu được phép hiển thị
 */
export function laDuongDanAnhHopLe(duongDan: unknown): duongDan is string {
  if (typeof duongDan !== "string" || duongDan.includes("..")) return false
  return MAU_ANH_TAI_LEN.test(duongDan) || MAU_ANH_TINH.test(duongDan)
}

/**
 * Liên kết an toàn: `http(s)://`, `mailto:`, `tel:`, đường dẫn nội bộ `/…` hoặc anchor `#…`.
 *
 * @param lienKet - Giá trị `href`
 * @returns `true` nếu an toàn
 */
export function laLienKetAnToan(lienKet: unknown): lienKet is string {
  if (typeof lienKet !== "string" || lienKet.length === 0 || lienKet.length > 2000) return false
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

/**
 * Chuẩn hóa liên kết người soạn gõ vào: thêm `https://` khi thiếu giao thức.
 *
 * @param nhap - Chuỗi người dùng nhập
 * @returns Liên kết an toàn, hoặc `null` nếu không hợp lệ
 */
export function chuanHoaLienKetNhap(nhap: string): string | null {
  const giaTri = nhap.trim()
  if (!giaTri) return null
  if (laLienKetAnToan(giaTri)) return giaTri
  const coGiaoThuc = /^[a-z][a-z0-9+.-]*:/i.test(giaTri)
  if (!coGiaoThuc && /^[^\s/]+\.[^\s]+$/.test(giaTri) && laLienKetAnToan(`https://${giaTri}`)) return `https://${giaTri}`
  return null
}

/**
 * Liên kết có trỏ ra ngoài website không (để mở tab mới kèm `rel="noopener"`).
 *
 * @param href - Liên kết đã hợp lệ
 * @returns `true` với `http(s)://`
 */
export function laLienKetNgoai(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

/**
 * Nội dung có chữ hoặc ảnh không (tài liệu chỉ có đoạn trống coi là rỗng).
 *
 * @param noiDung - Tài liệu
 * @returns `true` nếu có nội dung hiển thị
 */
export function coNoiDung(noiDung: NodeNoiDung | null | undefined): boolean {
  if (!noiDung) return false
  const duyet = (node: NodeNoiDung): boolean =>
    node.type === "image" || (node.type === "text" && !!node.text?.trim()) || (node.content ?? []).some(duyet)
  return duyet(noiDung)
}
