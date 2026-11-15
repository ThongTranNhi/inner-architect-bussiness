import type { ReactNode } from "react"
import { laDuongDanAnhHopLe, laLienKetAnToan, laLienKetNgoai, type NodeNoiDung } from "./quy-tac"

/**
 * Bọc một đoạn chữ bằng các định dạng (mark) được hỗ trợ. Mark lạ bị bỏ qua;
 * liên kết không an toàn chỉ hiện chữ, không tạo thẻ `<a>`.
 *
 * @param chu - Phần tử chữ
 * @param marks - Danh sách mark của node
 * @returns Phần tử đã bọc định dạng
 */
function bocDinhDang(chu: ReactNode, marks: NodeNoiDung["marks"]): ReactNode {
  let ketQua = chu
  // Áp dụng từ trong ra ngoài; liên kết luôn bọc ngoài cùng.
  const danhSach = [...(marks ?? [])].sort((a, b) => Number(a.type === "link") - Number(b.type === "link"))
  for (const mark of danhSach) {
    if (mark.type === "bold") ketQua = <strong>{ketQua}</strong>
    else if (mark.type === "italic") ketQua = <em>{ketQua}</em>
    else if (mark.type === "underline") ketQua = <u>{ketQua}</u>
    else if (mark.type === "link" && laLienKetAnToan(mark.attrs?.href)) {
      const href = mark.attrs.href as string
      ketQua = laLienKetNgoai(href) ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {ketQua}
        </a>
      ) : (
        <a href={href}>{ketQua}</a>
      )
    }
  }
  return ketQua
}

/**
 * Hiển thị các node con.
 *
 * @param danhSach - Node con
 * @returns Mảng phần tử React
 */
function hienThiCon(danhSach: NodeNoiDung[] | undefined): ReactNode[] {
  return (danhSach ?? []).map((node, i) => hienThiNode(node, i))
}

/**
 * Hiển thị một node theo danh sách thành phần được hỗ trợ (giống máy chủ).
 *
 * @param node - Node nội dung
 * @param khoa - Key React
 * @returns Phần tử React, hoặc `null` với node không hỗ trợ / đoạn trống
 */
function hienThiNode(node: NodeNoiDung, khoa: number): ReactNode {
  switch (node.type) {
    case "text":
      return typeof node.text === "string" ? <span key={khoa}>{bocDinhDang(node.text, node.marks)}</span> : null
    case "hardBreak":
      return <br key={khoa} />
    case "paragraph":
      return node.content?.length ? <p key={khoa}>{hienThiCon(node.content)}</p> : null
    case "heading":
      return node.attrs?.level === 3 ? (
        <h3 key={khoa} className="serif">
          {hienThiCon(node.content)}
        </h3>
      ) : (
        <h2 key={khoa} className="serif">
          {hienThiCon(node.content)}
        </h2>
      )
    case "bulletList":
      return <ul key={khoa}>{hienThiCon(node.content)}</ul>
    case "orderedList": {
      const start = typeof node.attrs?.start === "number" && node.attrs.start > 1 ? node.attrs.start : undefined
      return (
        <ol key={khoa} start={start}>
          {hienThiCon(node.content)}
        </ol>
      )
    }
    case "listItem":
      return <li key={khoa}>{hienThiCon(node.content)}</li>
    case "blockquote":
      return (
        <blockquote key={khoa} className="serif">
          {hienThiCon(node.content)}
        </blockquote>
      )
    case "image": {
      const { src, alt, caption, width, height } = node.attrs ?? {}
      if (!laDuongDanAnhHopLe(src)) return null
      return (
        <figure key={khoa} className="jr-noi-dung-anh">
          <img
            src={src}
            alt={typeof alt === "string" ? alt : ""}
            loading="lazy"
            decoding="async"
            width={typeof width === "number" ? width : undefined}
            height={typeof height === "number" ? height : undefined}
          />
          {typeof caption === "string" && caption.trim() && <figcaption>{caption}</figcaption>}
        </figure>
      )
    }
    default:
      return null
  }
}

/**
 * Bộ hiển thị nội dung bài Journal — dùng chung cho bài công khai, khung đọc nhanh trên
 * /journal và bản xem trước trong trang quản trị. Tạo phần tử React trực tiếp từ cây JSON
 * (không dùng HTML thô) nên không thể chèn script, iframe hay thuộc tính sự kiện.
 *
 * @param props.noiDung - Tài liệu nội dung (`{ type: "doc", content: [...] }`)
 * @param props.className - Class bổ sung cho khung nội dung
 * @returns Khối nội dung bài
 */
export function HienThiNoiDung({ noiDung, className = "" }: { noiDung: NodeNoiDung | null | undefined; className?: string }) {
  if (!noiDung || noiDung.type !== "doc") return null
  return <div className={`jr-noi-dung ${className}`.trim()}>{hienThiCon(noiDung.content)}</div>
}
