import { useEffect, useRef, useState, type ReactNode } from "react"
import { LoiApi } from "../../services/api-quan-tri"

/**
 * Danh sách sắp xếp được bằng kéo thả (chuột, qua tay nắm ⠿) và nút Lên / Xuống
 * (bàn phím, điện thoại). Mỗi lần đổi chỗ được lưu ngay lên máy chủ; lưu lỗi thì
 * đưa về thứ tự cũ và báo lỗi. Thông báo vị trí mới cho trình đọc màn hình.
 *
 * @param props.muc - Phần tử theo thứ tự hiện tại
 * @param props.layMa - Lấy ID phần tử
 * @param props.layTen - Tên phần tử (dùng trong nhãn nút và thông báo)
 * @param props.hienThi - Nội dung từng dòng
 * @param props.luuThuTu - Lưu thứ tự mới (ném lỗi khi thất bại)
 * @param props.nhan - Nhãn của danh sách cho trình đọc màn hình
 * @param props.tatSapXep - Ẩn công cụ sắp xếp (vd. đang lọc theo trạng thái)
 * @returns Danh sách `<ol>`
 */
export function DanhSachSapXep<T>({
  muc,
  layMa,
  layTen,
  hienThi,
  luuThuTu,
  nhan,
  tatSapXep = false,
}: {
  muc: T[]
  layMa: (m: T) => number
  layTen: (m: T) => string
  hienThi: (m: T) => ReactNode
  luuThuTu: (ids: number[]) => Promise<void>
  nhan: string
  tatSapXep?: boolean
}) {
  const [thuTu, setThuTu] = useState(muc)
  const [dangLuu, setDangLuu] = useState(false)
  const [loi, setLoi] = useState("")
  const [thongBao, setThongBao] = useState("")
  const [choPhepKeo, setChoPhepKeo] = useState<number | null>(null)
  const [dangKeo, setDangKeo] = useState<number | null>(null)
  const [viTriTha, setViTriTha] = useState<number | null>(null)
  // Ref song song với state: sự kiện kéo thả có thể tới trước khi React render lại.
  const keoRef = useRef<number | null>(null)
  const thaRef = useRef<number | null>(null)
  const nut = useRef(new Map<string, HTMLButtonElement>())
  const canFocus = useRef<string | null>(null)

  useEffect(() => setThuTu(muc), [muc])
  useEffect(() => {
    if (!canFocus.current) return
    nut.current.get(canFocus.current)?.focus()
    canFocus.current = null
  })

  /**
   * Chuyển phần tử từ vị trí `tu` sang `den`, lưu lên máy chủ.
   *
   * @param tu - Vị trí cũ
   * @param den - Vị trí mới
   * @param giuFocus - Khóa nút cần giữ focus sau khi đổi chỗ
   */
  const doiCho = async (tu: number, den: number, giuFocus?: string) => {
    if (tu === den || den < 0 || den >= thuTu.length || dangLuu) return
    const cu = thuTu
    const moi = [...cu]
    const [phanTu] = moi.splice(tu, 1)
    moi.splice(den, 0, phanTu!)
    setThuTu(moi)
    setLoi("")
    setDangLuu(true)
    if (giuFocus) canFocus.current = giuFocus
    try {
      await luuThuTu(moi.map(layMa))
      setThongBao(`Đã chuyển “${layTen(phanTu!)}” tới vị trí ${den + 1} trên ${moi.length}.`)
    } catch (e) {
      setThuTu(cu)
      setLoi(e instanceof LoiApi ? e.message : "Không lưu được thứ tự. Vui lòng thử lại.")
    } finally {
      setDangLuu(false)
    }
  }

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {thongBao}
      </p>
      {loi && (
        <p role="alert" className="mb-3 border-l-2 border-[#9b3b25] bg-[#9b3b25]/5 px-3 py-2 text-[14px] text-[#9b3b25]!">
          {loi}
        </p>
      )}
      <ol aria-label={nhan} aria-busy={dangLuu} className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {thuTu.map((phanTu, viTri) => {
          const ma = layMa(phanTu)
          const ten = layTen(phanTu)
          return (
            <li
              key={ma}
              draggable={!tatSapXep && choPhepKeo === ma}
              onDragStart={(e) => {
                keoRef.current = viTri
                setDangKeo(viTri)
                e.dataTransfer.effectAllowed = "move"
                e.dataTransfer.setData("text/plain", String(ma))
              }}
              onDragOver={(e) => {
                if (keoRef.current === null) return
                e.preventDefault()
                e.dataTransfer.dropEffect = "move"
                const khung = e.currentTarget.getBoundingClientRect()
                thaRef.current = e.clientY < khung.top + khung.height / 2 ? viTri : viTri + 1
                setViTriTha(thaRef.current)
              }}
              onDrop={(e) => {
                e.preventDefault()
                const tu = keoRef.current
                const tha = thaRef.current
                if (tu !== null && tha !== null) void doiCho(tu, tha > tu ? tha - 1 : tha)
                keoRef.current = null
                thaRef.current = null
                setDangKeo(null)
                setViTriTha(null)
              }}
              onDragEnd={() => {
                keoRef.current = null
                thaRef.current = null
                setDangKeo(null)
                setViTriTha(null)
                setChoPhepKeo(null)
              }}
              className={`relative flex flex-wrap items-center gap-x-3 gap-y-2 bg-[var(--cream)] px-2 py-3 sm:flex-nowrap ${
                dangKeo === viTri ? "opacity-50" : ""
              } ${viTriTha === viTri && dangKeo !== null ? "shadow-[inset_0_2px_0_var(--earth)]" : ""} ${
                viTriTha === viTri + 1 && viTri === thuTu.length - 1 && dangKeo !== null ? "shadow-[inset_0_-2px_0_var(--earth)]" : ""
              }`}
            >
              {!tatSapXep && (
                <div className="flex shrink-0 items-center gap-1">
                  <span
                    aria-hidden="true"
                    title="Kéo để sắp xếp"
                    onPointerDown={() => setChoPhepKeo(ma)}
                    onPointerUp={() => setChoPhepKeo(null)}
                    className="hidden cursor-grab select-none px-1 text-[18px] leading-none opacity-60 hover:opacity-100 sm:inline"
                  >
                    ⠿
                  </span>
                  <span className="w-6 text-right text-[12px] tabular-nums opacity-60">{viTri + 1}</span>
                  <button
                    type="button"
                    ref={(el) => {
                      if (el) nut.current.set(`${ma}-len`, el)
                    }}
                    onClick={() => void doiCho(viTri, viTri - 1, `${ma}-len`)}
                    disabled={viTri === 0 || dangLuu}
                    aria-label={`Đưa “${ten}” lên`}
                    className="min-h-[36px] min-w-[44px] border border-[var(--line)] px-2 text-[12px] hover:border-[var(--ink)] disabled:opacity-30"
                  >
                    Lên
                  </button>
                  <button
                    type="button"
                    ref={(el) => {
                      if (el) nut.current.set(`${ma}-xuong`, el)
                    }}
                    onClick={() => void doiCho(viTri, viTri + 1, `${ma}-xuong`)}
                    disabled={viTri === thuTu.length - 1 || dangLuu}
                    aria-label={`Đưa “${ten}” xuống`}
                    className="min-h-[36px] min-w-[44px] border border-[var(--line)] px-2 text-[12px] hover:border-[var(--ink)] disabled:opacity-30"
                  >
                    Xuống
                  </button>
                </div>
              )}
              <div className="min-w-0 flex-1">{hienThi(phanTu)}</div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
