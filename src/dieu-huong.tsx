import type React from "react"

/**
 * Điều hướng dùng chung cho mọi trang bằng History API (đường dẫn thật, ví dụ
 * `/lien-he` thay vì `/#/lien-he`). Tách khỏi `App.tsx` để các module trang dùng
 * lại mà không import vòng.
 *
 * Server phải trả `index.html` cho mọi đường dẫn không phải file tĩnh (Vite dev
 * làm sẵn; Nginx dùng `try_files $uri $uri/ /index.html`).
 */

/** Sự kiện phát ra sau `pushState`/`replaceState` để `App` cập nhật trang hiện tại. */
export const SU_KIEN_DIEU_HUONG = "inner-architect:dieu-huong"

/**
 * Báo cho `App` biết URL đã đổi (pushState/replaceState không tự phát `popstate`).
 */
function phatSuKienDieuHuong(): void {
  window.dispatchEvent(new Event(SU_KIEN_DIEU_HUONG))
}

/** Hàm hỏi trang hiện tại có cho rời đi không (vd. trình soạn thảo còn thay đổi chưa lưu). */
let hoiRoiTrang: (() => boolean) | null = null

/**
 * Đăng ký (hoặc gỡ với `null`) hàm kiểm tra trước khi rời trang bằng điều hướng nội bộ
 * hoặc nút Back/Forward. Hàm trả `true` nếu được phép rời đi.
 *
 * @param ham - Hàm kiểm tra, ví dụ hỏi xác nhận khi còn thay đổi chưa lưu
 */
export function datChanRoiTrang(ham: (() => boolean) | null): void {
  hoiRoiTrang = ham
}

/**
 * Trang hiện tại có cho phép rời đi không.
 *
 * @returns `true` nếu không có chặn hoặc người dùng đồng ý rời trang
 */
export function choPhepRoiTrang(): boolean {
  return !hoiRoiTrang || hoiRoiTrang()
}

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
 * Điều hướng tới một đường dẫn nội bộ (thêm vào lịch sử trình duyệt) hoặc cuộn
 * tới mục "Hệ thống" trên trang chủ.
 *
 * @param path - Đường dẫn đích, có thể kèm query, ví dụ `/jathong/customers?status=new`
 * @returns {void}
 */
export function go(path: string): void {
  if (!choPhepRoiTrang()) return
  if (path === "/#he-thong" || path === "#he-thong") {
    if (window.location.pathname === "/") {
      cuonDenPhanTu("he-thong")
      return
    }
    window.history.pushState(null, "", "/")
    phatSuKienDieuHuong()
    setTimeout(() => cuonDenPhanTu("he-thong"), 120)
    return
  }
  window.history.pushState(null, "", path)
  phatSuKienDieuHuong()
  window.scrollTo({ top: 0, behavior: "smooth" })
}

/**
 * Thay URL hiện tại mà không tạo mục lịch sử mới (dùng cho chuyển hướng, ví dụ
 * đã đăng nhập mà vào trang đăng nhập).
 *
 * @param path - Đường dẫn đích
 * @returns {void}
 */
export function thayDuongDan(path: string): void {
  window.history.replaceState(null, "", path)
  phatSuKienDieuHuong()
}

/**
 * Liên kết nội bộ: `href` là đường dẫn thật nên mở tab mới / sao chép link vẫn đúng.
 * Click thường được chặn để điều hướng phía client bằng `go`; click kèm phím
 * Ctrl/Cmd/Shift/Alt hoặc chuột giữa giữ hành vi mặc định của trình duyệt.
 *
 * @param props.to - Đường dẫn nội bộ, ví dụ `/journal`
 * @param props.children - Nội dung hiển thị của liên kết
 * @param props.className - Class CSS bổ sung
 * @param props.onClick - Callback chạy trước khi điều hướng
 * @param props.onMouseEnter - Callback khi rê chuột vào (dùng cho ảnh preview menu)
 * @param props.onMouseLeave - Callback khi rê chuột ra
 * @returns Thẻ `<a>` có `href` là đường dẫn nội bộ
 */
export function Link({
  to,
  children,
  className = "",
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...thuocTinhKhac
}: {
  to: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick" | "onMouseEnter" | "onMouseLeave">) {
  return (
    <a
      {...thuocTinhKhac}
      href={to}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        onClick?.(e)
        const moTheoCachKhac =
          e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
        if (moTheoCachKhac) return
        e.preventDefault()
        go(to)
      }}
    >
      {children}
    </a>
  )
}
