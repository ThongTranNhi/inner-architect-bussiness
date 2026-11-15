import { useEffect, useId, useRef, useState } from "react"
import {
  DINH_DANG_ANH_CHO_PHEP,
  DUNG_LUONG_ANH_TOI_DA,
  layThuVienAnh,
  taiAnhLen,
  xoaAnh,
  type AnhJournal,
} from "../../services/api-journal"
import { LoiApi } from "../../services/api-quan-tri"

/** Cách dùng ảnh được chọn: chèn vào bài, đổi ảnh trong bài, ảnh bìa, ảnh chuyên mục. */
export type CheDoThuVien = "chen" | "doi" | "bia" | "chuyen-muc"

const TIEU_DE: Record<CheDoThuVien, string> = {
  chen: "Chèn ảnh vào bài",
  doi: "Đổi ảnh trong bài",
  bia: "Chọn ảnh bìa",
  "chuyen-muc": "Chọn ảnh đại diện chuyên mục",
}

/**
 * Hộp thoại thư viện ảnh Journal: tải ảnh từ máy (JPG/PNG/WebP) hoặc chọn ảnh đã tải.
 * Dùng `<dialog>` gốc nên có sẵn bẫy focus và đóng bằng phím Esc.
 *
 * @param props.mo - Hộp thoại đang mở
 * @param props.cheDo - Mục đích chọn ảnh (quyết định các ô văn bản kèm theo)
 * @param props.moTaBanDau - Văn bản thay thế ban đầu
 * @param props.chuThichBanDau - Chú thích ban đầu
 * @param props.onChon - Gọi khi xác nhận ảnh và thông tin kèm theo
 * @param props.onDong - Gọi khi đóng không chọn
 * @returns Hộp thoại
 */
export function ThuVienAnh({
  mo,
  cheDo,
  moTaBanDau = "",
  chuThichBanDau = "",
  onChon,
  onDong,
}: {
  mo: boolean
  cheDo: CheDoThuVien
  moTaBanDau?: string
  chuThichBanDau?: string
  onChon: (anh: AnhJournal, thongTin: { alt: string; caption: string }) => void
  onDong: () => void
}) {
  const hopThoai = useRef<HTMLDialogElement>(null)
  const oFile = useRef<HTMLInputElement>(null)
  const idTieuDe = useId()
  const [danhSach, setDanhSach] = useState<AnhJournal[]>([])
  const [tong, setTong] = useState(0)
  const [trang, setTrang] = useState(1)
  const [dangTai, setDangTai] = useState(false)
  const [dangTaiLen, setDangTaiLen] = useState(false)
  const [loi, setLoi] = useState("")
  const [chon, setChon] = useState<AnhJournal | null>(null)
  const [alt, setAlt] = useState(moTaBanDau)
  const [caption, setCaption] = useState(chuThichBanDau)

  useEffect(() => {
    const dlg = hopThoai.current
    if (!dlg) return
    if (mo && !dlg.open) {
      dlg.showModal()
      setChon(null)
      setAlt(moTaBanDau)
      setCaption(chuThichBanDau)
      setLoi("")
      setTrang(1)
    } else if (!mo && dlg.open) dlg.close()
  }, [mo, moTaBanDau, chuThichBanDau])

  useEffect(() => {
    if (!mo) return
    let conGanKet = true
    setDangTai(true)
    layThuVienAnh(trang)
      .then((kq) => {
        if (!conGanKet) return
        setDanhSach((cu) => (trang === 1 ? kq.data : [...cu, ...kq.data.filter((a) => !cu.some((c) => c.id === a.id))]))
        setTong(kq.pagination.total)
      })
      .catch((e) => conGanKet && setLoi(e instanceof LoiApi ? e.message : "Không tải được thư viện ảnh."))
      .finally(() => conGanKet && setDangTai(false))
    return () => {
      conGanKet = false
    }
  }, [mo, trang])

  /**
   * Kiểm tra sơ bộ rồi tải file lên (máy chủ kiểm tra lại định dạng thật và dung lượng).
   *
   * @param file - File người dùng chọn
   */
  const taiLen = async (file: File) => {
    setLoi("")
    if (!(DINH_DANG_ANH_CHO_PHEP as readonly string[]).includes(file.type)) {
      setLoi("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.")
      return
    }
    if (file.size > DUNG_LUONG_ANH_TOI_DA) {
      setLoi(`Ảnh vượt quá ${DUNG_LUONG_ANH_TOI_DA / 1024 / 1024} MB. Hãy giảm kích thước ảnh rồi thử lại.`)
      return
    }
    setDangTaiLen(true)
    try {
      const anh = await taiAnhLen(file)
      setDanhSach((cu) => [anh, ...cu])
      setTong((n) => n + 1)
      setChon(anh)
    } catch (e) {
      setLoi(e instanceof LoiApi ? e.message : "Không tải được ảnh lên.")
    } finally {
      setDangTaiLen(false)
      if (oFile.current) oFile.current.value = ""
    }
  }

  const coChuThich = cheDo === "chen" || cheDo === "doi"
  const coMoTa = cheDo !== "chuyen-muc"

  return (
    <dialog
      ref={hopThoai}
      aria-labelledby={idTieuDe}
      onClose={onDong}
      onCancel={(e) => {
        e.preventDefault()
        onDong()
      }}
      className="m-auto w-[min(920px,calc(100vw-16px))] max-h-[calc(100dvh-16px)] overflow-hidden bg-[var(--cream)] p-0 text-[var(--ink)] backdrop:bg-black/50"
    >
      <div className="flex max-h-[calc(100dvh-16px)] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-4 py-3 sm:px-6">
          <h2 id={idTieuDe} className="serif text-[24px]">
            {TIEU_DE[cheDo]}
          </h2>
          <button type="button" onClick={onDong} className="min-h-[40px] px-3 text-[14px] underline">
            Đóng
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={oFile}
              id={`${idTieuDe}-file`}
              type="file"
              accept={DINH_DANG_ANH_CHO_PHEP.join(",")}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void taiLen(file)
              }}
            />
            <label
              htmlFor={`${idTieuDe}-file`}
              className="inline-flex min-h-[44px] cursor-pointer items-center bg-[var(--ink)] px-5 text-[13px] text-[var(--cream)]! focus-within:outline focus-within:outline-2"
            >
              {dangTaiLen ? "Đang tải ảnh lên…" : "Tải ảnh từ máy"}
            </label>
            <p className="text-[13px] opacity-70">JPG, PNG hoặc WebP, tối đa {DUNG_LUONG_ANH_TOI_DA / 1024 / 1024} MB.</p>
          </div>
          {loi && (
            <p role="alert" className="mt-3 border-l-2 border-[#9b3b25] bg-[#9b3b25]/5 px-3 py-2 text-[14px] text-[#9b3b25]!">
              {loi}
            </p>
          )}

          <h3 className="mt-6 text-[12px] tracking-[.12em] uppercase opacity-70">Ảnh đã tải ({tong})</h3>
          {danhSach.length === 0 && !dangTai ? (
            <p className="mt-3 text-[14px] opacity-70">Chưa có ảnh nào. Hãy tải ảnh đầu tiên từ máy.</p>
          ) : (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-busy={dangTai}>
              {danhSach.map((anh) => (
                <li key={anh.id}>
                  <button
                    type="button"
                    onClick={() => setChon(anh)}
                    aria-pressed={chon?.id === anh.id}
                    className={`block w-full border-2 text-left ${chon?.id === anh.id ? "border-[var(--earth)]" : "border-transparent hover:border-[var(--line)]"}`}
                  >
                    <img src={anh.url} alt={anh.originalName ?? "Ảnh trong thư viện"} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <span className="block truncate px-1 py-1 text-[11px] opacity-75">
                      {anh.originalName ?? "Ảnh"} · {anh.width}×{anh.height}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {danhSach.length < tong && (
            <button
              type="button"
              onClick={() => setTrang((t) => t + 1)}
              disabled={dangTai}
              className="mt-4 min-h-[40px] border border-[var(--line)] px-4 text-[13px]"
            >
              {dangTai ? "Đang tải…" : "Xem thêm ảnh"}
            </button>
          )}
        </div>

        <footer className="grid gap-3 border-t border-[var(--line)] px-4 py-3 sm:px-6">
          {coMoTa && (
            <div className={`grid gap-3 ${coChuThich ? "sm:grid-cols-2" : ""}`}>
              <label className="grid gap-1 text-[13px]">
                <span>Văn bản thay thế (mô tả ảnh cho người không xem được ảnh)</span>
                <input
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  maxLength={cheDo === "bia" ? 255 : 300}
                  className="min-h-[40px] border border-[var(--line)] bg-white px-3 text-[14px]"
                />
              </label>
              {coChuThich && (
                <label className="grid gap-1 text-[13px]">
                  <span>Chú thích hiển thị dưới ảnh (không bắt buộc)</span>
                  <input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={500}
                    className="min-h-[40px] border border-[var(--line)] bg-white px-3 text-[14px]"
                  />
                </label>
              )}
            </div>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            {chon && (
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm("Xóa vĩnh viễn ảnh đã chọn khỏi thư viện? Ảnh đang dùng trong bài hoặc chuyên mục sẽ không xóa được.")) return
                  setLoi("")
                  try {
                    await xoaAnh(chon.id)
                    setDanhSach((cu) => cu.filter((a) => a.id !== chon.id))
                    setTong((n) => Math.max(0, n - 1))
                    setChon(null)
                  } catch (e) {
                    setLoi(e instanceof LoiApi ? e.message : "Không xóa được ảnh.")
                  }
                }}
                className="mr-auto min-h-[44px] border border-[#9b3b25] px-4 text-[13px] text-[#9b3b25]!"
              >
                Xóa ảnh đã chọn
              </button>
            )}
            <button type="button" onClick={onDong} className="min-h-[44px] border border-[var(--line)] px-5 text-[13px]">
              Hủy
            </button>
            <button
              type="button"
              disabled={!chon}
              onClick={() => chon && onChon(chon, { alt: alt.trim(), caption: caption.trim() })}
              className="min-h-[44px] bg-[var(--ink)] px-5 text-[13px] text-[var(--cream)]! disabled:opacity-40"
            >
              {cheDo === "chen" ? "Chèn ảnh" : "Dùng ảnh này"}
            </button>
          </div>
        </footer>
      </div>
    </dialog>
  )
}
