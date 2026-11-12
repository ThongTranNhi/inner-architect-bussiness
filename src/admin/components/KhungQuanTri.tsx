import type { ReactNode } from "react"
import { go, Link } from "../../dieu-huong"
import { GOC_QUAN_TRI } from "../duong-dan-quan-tri"
import { usePhienQuanTri } from "../hooks/usePhienQuanTri"

/**
 * Bố cục chung của trang quản trị: thanh trên (thương hiệu, điều hướng, đăng xuất)
 * và vùng nội dung. Không dùng header/footer của website công khai.
 *
 * @param props.duongDan - Đường dẫn hiện tại để đánh dấu mục đang mở
 * @param props.children - Nội dung trang
 * @returns Khung giao diện quản trị
 */
export function KhungQuanTri({ duongDan, children }: { duongDan: string; children: ReactNode }) {
  const { quanTriVien, dangXuat } = usePhienQuanTri()
  const mucMenu = [
    { href: GOC_QUAN_TRI, nhan: "Tổng quan", dangMo: duongDan === GOC_QUAN_TRI },
    { href: `${GOC_QUAN_TRI}/customers`, nhan: "Khách hàng", dangMo: duongDan.startsWith(`${GOC_QUAN_TRI}/customers`) },
  ]

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <header className="bg-[var(--brown)] text-[var(--cream)]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-4 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="wordmark">
              INNER ARCHITECT<sup>™</sup>
            </span>
            <span className="text-[11px] tracking-[.12em] opacity-75">CUSTOMER CARE</span>
          </div>
          <nav aria-label="Điều hướng quản trị" className="flex gap-6 text-[13px]">
            {mucMenu.map((muc) => (
              <Link
                key={muc.href}
                to={muc.href}
                aria-current={muc.dangMo ? "page" : undefined}
                className={`border-b pb-1 ${muc.dangMo ? "border-current" : "border-transparent opacity-80 hover:opacity-100"}`}
              >
                {muc.nhan}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-[13px]">
            <span className="opacity-80">{quanTriVien?.displayName}</span>
            <button
              type="button"
              onClick={() => void dangXuat().then(() => go(`${GOC_QUAN_TRI}/login`))}
              className="min-h-[40px] border border-current px-4 hover:bg-[var(--cream)] hover:text-[var(--brown)]!"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8 sm:py-12">{children}</main>
    </div>
  )
}
