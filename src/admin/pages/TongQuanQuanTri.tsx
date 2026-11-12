import { useEffect, useState } from "react"
import { Link } from "../../dieu-huong"
import { GOC_QUAN_TRI } from "../duong-dan-quan-tri"
import { usePhienQuanTri } from "../hooks/usePhienQuanTri"
import { LoiApi, layThongKe } from "../services/api-quan-tri"
import type { ThongKeKhachHang } from "../types/quan-tri"

/**
 * Dashboard: bốn chỉ số lấy trực tiếp từ `/admin/statistics` (không có số liệu giả).
 * Mỗi thẻ dẫn tới danh sách đã lọc theo trạng thái tương ứng.
 *
 * @returns Trang tổng quan
 */
export function TongQuanQuanTri() {
  const { xuLyHetPhien } = usePhienQuanTri()
  const [thongKe, setThongKe] = useState<ThongKeKhachHang | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [lanTai, setLanTai] = useState(0)

  useEffect(() => {
    let daHuy = false
    setLoi(null)
    layThongKe()
      .then((kq) => !daHuy && setThongKe(kq))
      .catch((e: unknown) => {
        if (daHuy) return
        if (e instanceof LoiApi && e.status === 401) xuLyHetPhien()
        else setLoi(e instanceof Error ? e.message : "Không tải được thống kê.")
      })
    return () => {
      daHuy = true
    }
  }, [lanTai, xuLyHetPhien])

  const theThongKe = [
    { nhan: "Tổng số khách hàng", giaTri: thongKe?.total, href: `${GOC_QUAN_TRI}/customers` },
    { nhan: "Khách hàng mới", giaTri: thongKe?.new, href: `${GOC_QUAN_TRI}/customers?status=new` },
    { nhan: "Đã liên hệ", giaTri: thongKe?.contacted, href: `${GOC_QUAN_TRI}/customers?status=contacted` },
    { nhan: "Hoàn tất chăm sóc", giaTri: thongKe?.completed, href: `${GOC_QUAN_TRI}/customers?status=completed` },
  ]

  return (
    <>
      <p className="eyebrow">TỔNG QUAN</p>
      <h1 className="serif mt-3 text-[clamp(32px,4vw,48px)] leading-[1.1]">Thông tin khách hàng gửi từ website</h1>

      {loi ? (
        <div role="alert" className="mt-10 border-l-2 border-[#9b3b25] py-2 pl-4 text-[#9b3b25]">
          <p className="m-0">{loi}</p>
          <button type="button" onClick={() => setLanTai((n) => n + 1)} className="underlink mt-3 text-[13px]">
            Thử lại
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy={!thongKe}>
          {theThongKe.map((the) => (
            <Link
              key={the.nhan}
              to={the.href}
              className="group block border border-[var(--line)] bg-white/40 p-6 transition-colors hover:border-[var(--brown)]"
            >
              <span className="block text-[13px] tracking-[.04em] text-[#6b5f4f]">{the.nhan}</span>
              <span className="serif mt-4 block text-[48px] leading-none">
                {the.giaTri ?? <span className="opacity-30">—</span>}
              </span>
              <span className="mt-4 block text-[12px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                Xem danh sách →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
