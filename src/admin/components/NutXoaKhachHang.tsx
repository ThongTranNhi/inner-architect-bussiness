import { useEffect, useRef, useState } from "react"

/**
 * Nút xóa khách hàng hai bước: bấm "Xóa" → hiện câu hỏi xác nhận kèm tên và ID,
 * phải bấm "Xóa vĩnh viễn" mới gửi yêu cầu. Chỉ render cho vai trò admin
 * (backend vẫn kiểm tra quyền).
 *
 * @param props.ma - ID khách hàng
 * @param props.ten - Họ tên, hiển thị trong câu xác nhận
 * @param props.onXoa - Gọi API xóa; ném lỗi nếu thất bại để nút trở lại trạng thái ban đầu
 * @param props.lon - Kiểu nút lớn (trang chi tiết)
 * @returns Nút xóa có xác nhận
 */
export function NutXoaKhachHang({
  ma,
  ten,
  onXoa,
  lon = false,
}: {
  ma: number
  ten: string
  onXoa: () => Promise<void>
  lon?: boolean
}) {
  const [dangXacNhan, setDangXacNhan] = useState(false)
  const [dangXoa, setDangXoa] = useState(false)
  const nutHuy = useRef<HTMLButtonElement>(null)
  const coSo = lon ? "min-h-[48px] px-5 text-[14px]" : "min-h-[40px] px-3 text-[13px]"

  // Đưa focus vào nút Hủy để người dùng bàn phím không lỡ tay xóa.
  useEffect(() => {
    if (dangXacNhan) nutHuy.current?.focus()
  }, [dangXacNhan])

  if (!dangXacNhan)
    return (
      <button
        type="button"
        onClick={() => setDangXacNhan(true)}
        aria-label={`Xóa khách hàng ${ten} (#${ma})`}
        className={`${coSo} border border-[#9b3b25] text-[#9b3b25]! hover:bg-[#9b3b25] hover:text-white!`}
      >
        Xóa
      </button>
    )

  return (
    <div role="group" aria-label={`Xác nhận xóa ${ten}`} className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] text-[#9b3b25]">
        Xóa vĩnh viễn #{ma} {ten}? Không thể hoàn tác.
      </span>
      <button
        type="button"
        disabled={dangXoa}
        onClick={async () => {
          setDangXoa(true)
          try {
            await onXoa()
          } catch {
            setDangXoa(false)
            setDangXacNhan(false)
          }
        }}
        className={`${coSo} bg-[#9b3b25] text-white! disabled:cursor-wait disabled:opacity-60`}
      >
        {dangXoa ? "Đang xóa…" : "Xóa vĩnh viễn"}
      </button>
      <button
        ref={nutHuy}
        type="button"
        disabled={dangXoa}
        onClick={() => setDangXacNhan(false)}
        className={`${coSo} border border-[var(--line)] disabled:opacity-40`}
      >
        Hủy
      </button>
    </div>
  )
}
