import { mergeAttributes, Node } from "@tiptap/core"
import { laDuongDanAnhHopLe } from "../../../journal/noi-dung/quy-tac"

/** Thuộc tính của ảnh trong bài. */
export type ThuocTinhAnh = {
  src: string
  alt: string
  caption: string
  width: number | null
  height: number | null
}

/**
 * Node "image" của trình soạn thảo: ảnh khối kèm văn bản thay thế và chú thích.
 * Khớp node `image` mà máy chủ chấp nhận (`server/src/modules/journal/noi-dung.ts`).
 * Kéo thả được trong bài (`draggable`); chỉ nhận ảnh thuộc thư viện Journal khi dán HTML.
 */
export const AnhBaiViet = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
      width: { default: null },
      height: { default: null },
    }
  },

  parseHTML() {
    const soNguyen = (giaTri: string | null) => {
      const so = Number(giaTri)
      return Number.isInteger(so) && so > 0 ? so : null
    }
    return [
      {
        tag: "figure",
        getAttrs: (el) => {
          const img = el.querySelector("img")
          const src = img?.getAttribute("src")
          if (!img || !laDuongDanAnhHopLe(src)) return false
          return {
            src,
            alt: img.getAttribute("alt") ?? "",
            caption: el.querySelector("figcaption")?.textContent?.trim() ?? "",
            width: soNguyen(img.getAttribute("width")),
            height: soNguyen(img.getAttribute("height")),
          }
        },
      },
      {
        tag: "img[src]",
        getAttrs: (el) => {
          const src = el.getAttribute("src")
          if (!laDuongDanAnhHopLe(src)) return false
          return { src, alt: el.getAttribute("alt") ?? "", width: soNguyen(el.getAttribute("width")), height: soNguyen(el.getAttribute("height")) }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, width, height } = node.attrs as ThuocTinhAnh
    const caption = (node.attrs as ThuocTinhAnh).caption
    return [
      "figure",
      mergeAttributes({ class: "jr-noi-dung-anh" }, { "data-drag-handle": "" }, HTMLAttributes.class ? { class: HTMLAttributes.class } : {}),
      ["img", { src, alt, ...(width ? { width } : {}), ...(height ? { height } : {}), draggable: "false" }],
      ...(caption ? [["figcaption", {}, caption] as const] : []),
    ]
  },
})
