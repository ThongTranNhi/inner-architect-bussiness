import type React from "react"

/**
 * Điều hướng hash routing dùng chung cho mọi trang (`#/duong-dan`).
 * Tách khỏi `App.tsx` để các module trang dùng lại mà không import vòng.
 */

/**
 * Cuộn mượt màn hình đến phần tử có ID tương ứng trên trang.
 * @param {string} idPhanTu - ID của phần tử mục tiêu (không kèm dấu #)
 * @returns {void}
 */
export function cuonDenPhanTu(idPhanTu: string): void {
  const element = document.getElementById(idPhanTu)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

/**
 * Điều hướng người dùng tới đường dẫn hash tương ứng hoặc cuộn mượt đến phần tử.
 * @param {string} path - Đường dẫn mục tiêu
 * @returns {void}
 */
export function go(path: string): void {
  if (path === "/he-thong" || path === "/#he-thong" || path === "#he-thong") {
    if (window.location.hash === "" || window.location.hash === "#/") {
      cuonDenPhanTu("he-thong")
      return
    }
    window.location.hash = "/"
    setTimeout(() => cuonDenPhanTu("he-thong"), 120)
    return
  }
  window.location.hash = path
  window.scrollTo({ top: 0, behavior: "smooth" })
}

/**
 * Liên kết nội bộ dùng hash routing; chặn điều hướng mặc định rồi gọi `go`.
 *
 * @param props.to - Đường dẫn nội bộ, ví dụ `/journal`
 * @param props.children - Nội dung hiển thị của liên kết
 * @param props.className - Class CSS bổ sung
 * @param props.onClick - Callback chạy trước khi điều hướng
 * @param props.onMouseEnter - Callback khi rê chuột vào (dùng cho ảnh preview menu)
 * @param props.onMouseLeave - Callback khi rê chuột ra
 * @returns Thẻ `<a>` có `href` dạng `#/duong-dan` để vẫn hoạt động khi mở tab mới
 */
export function Link({
  to,
  children,
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
        go(to)
      }}
    >
      {children}
    </a>
  )
}
