/**
 * Kiểm soát xuống dòng cho tiếng Việt trên trang Founder.
 *
 * Tiếng Việt viết từ ghép bằng các âm tiết cách nhau dấu cách, nên trình duyệt
 * có thể ngắt giữa một từ ("trải / nghiệm"). Các hàm ở đây chỉ đổi dấu cách
 * bên trong cụm từ thành dấu cách không ngắt dòng (U+00A0) lúc hiển thị —
 * chữ nhìn thấy và nội dung trong `noi-dung-founder.ts` không thay đổi.
 */

/** Dấu cách không ngắt dòng. */
const KHOANG_TRANG_GIU = "\u00A0"

/** Ký tự phân tách các cụm trong vai trò và tagline. */
const DAU_PHAN_CUM = " · "

/**
 * Các cụm không được tách khi xuống dòng trong tiêu đề, trích dẫn và câu dẫn.
 * Sắp từ dài đến ngắn để cụm dài (có chứa cụm ngắn) được xử lý trước.
 */
const CUM_TU_GIU: readonly string[] = [
  "INNER ARCHITECT™ System",
  "INNER ARCHITECT™",
  "INNER ARCHITECT",
  "điểm bắt đầu",
  "trải nghiệm",
  "thấu hiểu",
  "cuộc sống",
  "chính mình",
  "quyết định",
  "góc nhìn",
  "đa chiều",
  "nền tảng",
  "hành trình",
  "Võ Khiêm",
  "kiến thức",
  "lời giải thích",
  "bộ bài",
  "câu hỏi",
  "phù hợp",
  "lựa chọn",
  "trách nhiệm",
]

const MAU_CUM_TU = new RegExp(
  CUM_TU_GIU.map((cum) =>
    cum.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+"),
  ).join("|"),
  "giu",
)

/**
 * Giữ các cụm từ ghép trên cùng một dòng bằng dấu cách không ngắt dòng.
 * Không phân biệt hoa thường; giữ nguyên chữ gốc.
 *
 * @param chuoi - Văn bản cần hiển thị
 * @returns Văn bản đã thay dấu cách bên trong các cụm trong `CUM_TU_GIU`
 */
export function giuTuGhep(chuoi: string): string {
  return chuoi.replace(MAU_CUM_TU, (cum) =>
    cum.replace(/\s+/g, KHOANG_TRANG_GIU),
  )
}

/**
 * Tách chuỗi có dạng "A · B · C" thành các cụm để hiển thị riêng từng cụm
 * (mỗi cụm không bị cắt giữa chừng, dấu "·" không nằm lơ lửng cuối dòng).
 *
 * @param chuoi - Chuỗi các cụm phân tách bởi " · "
 * @returns Mảng cụm đã bỏ khoảng trắng thừa; chuỗi rỗng trả mảng rỗng
 */
export function tachCum(chuoi: string): string[] {
  return chuoi
    .split(DAU_PHAN_CUM)
    .map((cum) => cum.trim())
    .filter(Boolean)
}
