import { useEffect, useId, useState } from "react"
import { DANH_SACH_TRANG_THAI, NHAN_TRANG_THAI } from "../dinh-dang"
import type { TrangThaiKhachHang } from "../types/quan-tri"

const MAU_NHAN: Record<TrangThaiKhachHang, string> = {
  new: "bg-[#F3B163]/30 text-[#6b3d10] border-[#C0814C]",
  contacted: "bg-[#3F4A36]/10 text-[#3F4A36] border-[#3F4A36]/50",
  completed: "bg-[#301F05]/5 text-[#5a4a33] border-[#301F05]/25",
}

/**
 * Nhãn trạng thái chăm sóc (màu kèm chữ, không chỉ dựa vào màu).
 *
 * @param props.trangThai - Trạng thái
 * @returns Badge trạng thái
 */
export function NhanTrangThai({ trangThai }: { trangThai: TrangThaiKhachHang }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-[12px] ${MAU_NHAN[trangThai]}`}>
      {NHAN_TRANG_THAI[trangThai]}
    </span>
  )
}

/**
 * Chọn trạng thái mới rồi bấm "Lưu" để xác nhận — không tự đổi khi chỉ chọn.
 *
 * @param props.trangThai - Trạng thái hiện tại
 * @param props.onLuu - Hàm lưu (gọi API); lỗi do component cha hiển thị
 * @param props.nhanPhu - Tên khách hàng, dùng cho nhãn truy cập
 * @returns Bộ chọn trạng thái kèm nút lưu
 */
export function ChonTrangThai({
  trangThai,
  onLuu,
  nhanPhu,
}: {
  trangThai: TrangThaiKhachHang
  onLuu: (trangThaiMoi: TrangThaiKhachHang) => Promise<void>
  nhanPhu: string
}) {
  const id = useId()
  const [luaChon, setLuaChon] = useState(trangThai)
  const [dangLuu, setDangLuu] = useState(false)
  useEffect(() => setLuaChon(trangThai), [trangThai])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={id} className="sr-only">
        Trạng thái chăm sóc của {nhanPhu}
      </label>
      <select
        id={id}
        value={luaChon}
        disabled={dangLuu}
        onChange={(e) => setLuaChon(e.target.value as TrangThaiKhachHang)}
        className="min-h-[40px] border border-[var(--line)] bg-white/60 px-2 text-[13px]"
      >
        {DANH_SACH_TRANG_THAI.map((tt) => (
          <option key={tt} value={tt}>
            {NHAN_TRANG_THAI[tt]}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={dangLuu || luaChon === trangThai}
        onClick={async () => {
          setDangLuu(true)
          try {
            await onLuu(luaChon)
          } catch {
            setLuaChon(trangThai)
          } finally {
            setDangLuu(false)
          }
        }}
        className="min-h-[40px] bg-[var(--ink)] px-4 text-[13px] text-white! disabled:cursor-not-allowed disabled:opacity-40"
      >
        {dangLuu ? "Đang lưu…" : "Lưu"}
      </button>
    </div>
  )
}
