import { NodeSelection } from "@tiptap/pm/state"
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { chuanHoaLienKetNhap, laLienKetAnToan, type NodeNoiDung } from "../../../journal/noi-dung/quy-tac"
import { chuanHoaHtmlDan } from "./dan-tu-word"
import { AnhBaiViet, type ThuocTinhAnh } from "./mo-rong-anh"
import { ThuVienAnh, type CheDoThuVien } from "./ThuVienAnh"

/**
 * Di chuyển ảnh đang chọn lên/xuống một khối trong cùng cấp.
 *
 * @param editor - Trình soạn thảo
 * @param huong - `-1` lên, `1` xuống
 * @returns `true` nếu đã di chuyển
 */
function diChuyenAnh(editor: Editor, huong: -1 | 1): boolean {
  return editor
    .chain()
    .focus()
    .command(({ state, tr, dispatch }) => {
      const chon = state.selection
      if (!(chon instanceof NodeSelection) || chon.node.type.name !== "image") return false
      const $viTri = state.doc.resolve(chon.from)
      const cha = $viTri.parent
      const chiSo = $viTri.index()
      const ke = huong < 0 ? (chiSo > 0 ? cha.child(chiSo - 1) : null) : chiSo < cha.childCount - 1 ? cha.child(chiSo + 1) : null
      if (!ke) return false
      if (dispatch) {
        tr.delete(chon.from, chon.to)
        const dich = huong < 0 ? chon.from - ke.nodeSize : chon.from + ke.nodeSize
        tr.insert(dich, chon.node)
        tr.setSelection(NodeSelection.create(tr.doc, dich))
        tr.scrollIntoView()
      }
      return true
    })
    .run()
}

/**
 * Nút trên thanh công cụ: có nhãn chữ hiển thị, `aria-label` đầy đủ và `aria-pressed` cho nút bật/tắt.
 * Chặn mousedown để không làm mất vùng chọn trong trình soạn thảo.
 */
function NutCongCu({
  nhan,
  moTa,
  onClick,
  dangBat,
  tat,
  children,
}: {
  nhan: string
  moTa: string
  onClick: () => void
  dangBat?: boolean
  tat?: boolean
  children?: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={moTa}
      title={moTa}
      aria-pressed={dangBat === undefined ? undefined : dangBat}
      disabled={tat}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-h-[40px] min-w-[40px] border px-2.5 text-[13px] leading-none transition-colors disabled:opacity-30 ${
        dangBat ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)]!" : "border-[var(--line)] bg-white hover:border-[var(--ink)]"
      }`}
    >
      {children ?? nhan}
    </button>
  )
}

/**
 * Trình soạn thảo trực quan kiểu Word thu gọn cho nội dung bài Journal (Tiptap/ProseMirror).
 * Lưu nội dung dạng JSON có cấu trúc; chỉ có các thành phần máy chủ chấp nhận.
 *
 * @param props.noiDungBanDau - Tài liệu ban đầu (chỉ đọc khi khởi tạo)
 * @param props.onThayDoi - Nhận tài liệu mới sau mỗi thay đổi
 * @param props.idNhan - ID của nhãn hiển thị cho vùng soạn (aria-labelledby)
 * @returns Thanh công cụ, vùng soạn và hộp thoại ảnh
 */
export function TrinhSoanThao({
  noiDungBanDau,
  onThayDoi,
  idNhan,
}: {
  noiDungBanDau: NodeNoiDung
  onThayDoi: (noiDung: NodeNoiDung) => void
  idNhan: string
}) {
  const idVung = useId()
  const [thongBao, setThongBao] = useState("")
  const [thuVien, setThuVien] = useState<CheDoThuVien | null>(null)
  const viTriChen = useRef<{ from: number; to: number } | null>(null)
  const [moLienKet, setMoLienKet] = useState(false)
  const [lienKet, setLienKet] = useState("")
  const [loiLienKet, setLoiLienKet] = useState("")
  const oLienKet = useRef<HTMLInputElement>(null)
  const onThayDoiRef = useRef(onThayDoi)
  onThayDoiRef.current = onThayDoi

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        horizontalRule: false,
        dropcursor: { color: "#C0814C", width: 2 },
        link: {
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          defaultProtocol: "https",
          isAllowedUri: (url) => laLienKetAnToan(url),
          HTMLAttributes: { target: null, rel: null },
        },
      }),
      AnhBaiViet,
    ],
    content: noiDungBanDau,
    editorProps: {
      attributes: {
        id: idVung,
        class: "jr-noi-dung jr-soan-thao",
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": idNhan,
      },
      transformPastedHTML: (html) => {
        const { html: sach, soAnhBo } = chuanHoaHtmlDan(html)
        setThongBao(
          soAnhBo > 0
            ? `Đã dán nội dung và giữ định dạng được hỗ trợ. ${soAnhBo} ảnh trong nội dung dán đã được bỏ — hãy dùng nút “Chèn ảnh” để thêm ảnh.`
            : "Đã dán nội dung và giữ định dạng được hỗ trợ (đoạn văn, tiêu đề, đậm, nghiêng, danh sách, liên kết).",
        )
        return sach
      },
      handlePaste: (_view, event) => {
        const duLieu = event.clipboardData
        if (duLieu && duLieu.files.length > 0 && !duLieu.getData("text/html") && !duLieu.getData("text/plain")) {
          setThongBao("Không dán ảnh trực tiếp được. Đặt con trỏ tại vị trí cần chèn rồi bấm “Chèn ảnh”.")
          return true
        }
        return false
      },
      handleDrop: (_view, event) => {
        if ((event as DragEvent).dataTransfer?.files.length) {
          setThongBao("Không kéo file ảnh vào bài được. Dùng nút “Chèn ảnh” để tải ảnh lên thư viện.")
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor: e }) => onThayDoiRef.current(e.getJSON() as NodeNoiDung),
  })

  const trangThai = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            doan: e.isActive("paragraph"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            dam: e.isActive("bold"),
            nghieng: e.isActive("italic"),
            gachChan: e.isActive("underline"),
            dsCham: e.isActive("bulletList"),
            dsSo: e.isActive("orderedList"),
            trichDan: e.isActive("blockquote"),
            lienKet: e.isActive("link"),
            anh: e.isActive("image") ? (e.getAttributes("image") as ThuocTinhAnh) : null,
            hoanTac: e.can().undo(),
            lamLai: e.can().redo(),
          }
        : null,
  })

  useEffect(() => {
    if (moLienKet) oLienKet.current?.focus()
  }, [moLienKet])

  if (!editor || !trangThai) return <p aria-busy="true">Đang mở trình soạn thảo…</p>

  const lenh = () => editor.chain().focus()

  const moFormLienKet = () => {
    setLienKet((editor.getAttributes("link").href as string | undefined) ?? "")
    setLoiLienKet("")
    setMoLienKet(true)
  }
  const apDungLienKet = () => {
    const href = chuanHoaLienKetNhap(lienKet)
    if (!href) {
      setLoiLienKet("Liên kết cần bắt đầu bằng https://, http://, mailto:, tel: hoặc / (trang trong website).")
      return
    }
    if (editor.state.selection.empty && !editor.isActive("link"))
      lenh().insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run()
    else lenh().extendMarkRange("link").setLink({ href }).run()
    setMoLienKet(false)
  }

  const moChenAnh = () => {
    const { from, to } = editor.state.selection
    viTriChen.current = { from, to }
    setThuVien("chen")
  }

  return (
    <div className="border border-[var(--line)] bg-white">
      <div
        role="toolbar"
        aria-label="Định dạng nội dung"
        aria-controls={idVung}
        className="sticky top-[var(--cao-thanh-trang-thai,0px)] z-10 flex flex-wrap gap-1.5 border-b border-[var(--line)] bg-[var(--cream)] p-2"
      >
        <NutCongCu nhan="Đoạn văn" moTa="Đoạn văn thường" dangBat={trangThai.doan} onClick={() => lenh().setParagraph().run()} />
        <NutCongCu nhan="H2" moTa="Tiêu đề phụ cấp 2 (H2)" dangBat={trangThai.h2} onClick={() => lenh().toggleHeading({ level: 2 }).run()} />
        <NutCongCu nhan="H3" moTa="Tiêu đề phụ cấp 3 (H3)" dangBat={trangThai.h3} onClick={() => lenh().toggleHeading({ level: 3 }).run()} />
        <span className="mx-1 w-px self-stretch bg-[var(--line)]" aria-hidden="true" />
        <NutCongCu nhan="Đậm" moTa="In đậm (Ctrl+B)" dangBat={trangThai.dam} onClick={() => lenh().toggleBold().run()}>
          <strong>Đậm</strong>
        </NutCongCu>
        <NutCongCu nhan="Nghiêng" moTa="In nghiêng (Ctrl+I)" dangBat={trangThai.nghieng} onClick={() => lenh().toggleItalic().run()}>
          <em>Nghiêng</em>
        </NutCongCu>
        <NutCongCu nhan="Gạch chân" moTa="Gạch chân (Ctrl+U)" dangBat={trangThai.gachChan} onClick={() => lenh().toggleUnderline().run()}>
          <u>Gạch chân</u>
        </NutCongCu>
        <span className="mx-1 w-px self-stretch bg-[var(--line)]" aria-hidden="true" />
        <NutCongCu nhan="• Danh sách" moTa="Danh sách dấu đầu dòng" dangBat={trangThai.dsCham} onClick={() => lenh().toggleBulletList().run()} />
        <NutCongCu nhan="1. Danh sách" moTa="Danh sách đánh số" dangBat={trangThai.dsSo} onClick={() => lenh().toggleOrderedList().run()} />
        <NutCongCu nhan="“ Trích dẫn" moTa="Trích dẫn" dangBat={trangThai.trichDan} onClick={() => lenh().toggleBlockquote().run()} />
        <span className="mx-1 w-px self-stretch bg-[var(--line)]" aria-hidden="true" />
        <NutCongCu nhan="Liên kết" moTa="Thêm hoặc sửa liên kết" dangBat={trangThai.lienKet} onClick={moFormLienKet} />
        <NutCongCu nhan="Chèn ảnh" moTa="Chèn ảnh tại vị trí con trỏ" onClick={moChenAnh} />
        <span className="mx-1 w-px self-stretch bg-[var(--line)]" aria-hidden="true" />
        <NutCongCu nhan="↶ Hoàn tác" moTa="Hoàn tác (Ctrl+Z)" tat={!trangThai.hoanTac} onClick={() => lenh().undo().run()} />
        <NutCongCu nhan="↷ Làm lại" moTa="Làm lại (Ctrl+Shift+Z)" tat={!trangThai.lamLai} onClick={() => lenh().redo().run()} />
      </div>

      {moLienKet && (
        <form
          className="flex flex-wrap items-end gap-2 border-b border-[var(--line)] bg-[var(--cream)] p-3"
          onSubmit={(e) => {
            e.preventDefault()
            apDungLienKet()
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault()
              setMoLienKet(false)
              editor.commands.focus()
            }
          }}
        >
          <label className="grid flex-1 gap-1 text-[13px]">
            <span>Địa chỉ liên kết</span>
            <input
              ref={oLienKet}
              value={lienKet}
              onChange={(e) => setLienKet(e.target.value)}
              placeholder="https://… hoặc /lien-he"
              aria-invalid={Boolean(loiLienKet)}
              aria-describedby={loiLienKet ? `${idVung}-loi-lk` : undefined}
              className="min-h-[40px] border border-[var(--line)] bg-white px-3 text-[14px]"
            />
          </label>
          <button type="submit" className="min-h-[40px] bg-[var(--ink)] px-4 text-[13px] text-[var(--cream)]!">
            Áp dụng
          </button>
          {trangThai.lienKet && (
            <button
              type="button"
              onClick={() => {
                lenh().extendMarkRange("link").unsetLink().run()
                setMoLienKet(false)
              }}
              className="min-h-[40px] border border-[var(--line)] px-4 text-[13px]"
            >
              Gỡ liên kết
            </button>
          )}
          <button type="button" onClick={() => setMoLienKet(false)} className="min-h-[40px] px-3 text-[13px] underline">
            Hủy
          </button>
          {loiLienKet && (
            <p id={`${idVung}-loi-lk`} role="alert" className="w-full text-[13px] text-[#9b3b25]!">
              {loiLienKet}
            </p>
          )}
        </form>
      )}

      {trangThai.anh && (
        <div className="grid gap-3 border-b border-[var(--line)] bg-[#f3e7d3] p-3 sm:grid-cols-[96px_1fr]" aria-label="Ảnh đang chọn" role="group">
          <img src={trangThai.anh.src} alt="" className="hidden aspect-[4/3] w-24 object-cover sm:block" />
          <div className="grid gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="grid gap-1 text-[12px]">
                <span>Văn bản thay thế</span>
                <input
                  value={trangThai.anh.alt ?? ""}
                  maxLength={300}
                  onChange={(e) => editor.commands.updateAttributes("image", { alt: e.target.value })}
                  className="min-h-[36px] border border-[var(--line)] bg-white px-2 text-[14px]"
                />
              </label>
              <label className="grid gap-1 text-[12px]">
                <span>Chú thích</span>
                <input
                  value={trangThai.anh.caption ?? ""}
                  maxLength={500}
                  onChange={(e) => editor.commands.updateAttributes("image", { caption: e.target.value })}
                  className="min-h-[36px] border border-[var(--line)] bg-white px-2 text-[14px]"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <button type="button" onClick={() => setThuVien("doi")} className="min-h-[36px] border border-[var(--line)] bg-white px-3">
                Đổi ảnh
              </button>
              <button type="button" onClick={() => diChuyenAnh(editor, -1)} className="min-h-[36px] border border-[var(--line)] bg-white px-3">
                Di chuyển lên
              </button>
              <button type="button" onClick={() => diChuyenAnh(editor, 1)} className="min-h-[36px] border border-[var(--line)] bg-white px-3">
                Di chuyển xuống
              </button>
              <button
                type="button"
                onClick={() => lenh().deleteSelection().run()}
                className="min-h-[36px] border border-[#9b3b25] bg-white px-3 text-[#9b3b25]!"
              >
                Gỡ ảnh khỏi bài
              </button>
            </div>
          </div>
        </div>
      )}

      <p role="status" aria-live="polite" className={thongBao ? "border-b border-[var(--line)] bg-[#fff8ec] px-3 py-2 text-[13px]" : "sr-only"}>
        {thongBao}
      </p>

      <EditorContent editor={editor} />

      <ThuVienAnh
        mo={thuVien !== null}
        cheDo={thuVien ?? "chen"}
        moTaBanDau={thuVien === "doi" ? (trangThai.anh?.alt ?? "") : ""}
        chuThichBanDau={thuVien === "doi" ? (trangThai.anh?.caption ?? "") : ""}
        onDong={() => setThuVien(null)}
        onChon={(anh, { alt, caption }) => {
          const thuocTinh = { src: anh.url, alt, caption, width: anh.width, height: anh.height }
          if (thuVien === "doi") editor.chain().focus().updateAttributes("image", thuocTinh).run()
          else {
            const viTri = viTriChen.current ?? { from: editor.state.selection.from, to: editor.state.selection.to }
            editor.chain().focus().insertContentAt(viTri, { type: "image", attrs: thuocTinh }).run()
          }
          setThuVien(null)
          setThongBao(thuVien === "doi" ? "Đã đổi ảnh." : "Đã chèn ảnh tại vị trí con trỏ.")
        }}
      />
    </div>
  )
}
