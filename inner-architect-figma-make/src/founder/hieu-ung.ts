import { useEffect, type CSSProperties, type RefObject } from "react"

/**
 * Hiệu ứng xuất hiện khi cuộn cho trang Founder.
 *
 * Nguyên tắc an toàn: phần tử chỉ bị ẩn khi container có class `fp-motion`,
 * và class này chỉ được gắn khi JavaScript chạy, trình duyệt hỗ trợ
 * IntersectionObserver và người dùng không bật `prefers-reduced-motion`.
 * Vì vậy khi thiếu bất kỳ điều kiện nào, nội dung luôn hiển thị ngay.
 */

/** Kiểu chuyển động; CSS trong `founder.css` định nghĩa từng kiểu. */
export type KieuHieuUng = "len" | "trai" | "phai" | "anh" | "mo"

/** Thuộc tính gắn lên phần tử để hook nhận diện và CSS tạo chuyển động. */
export type ThuocTinhHieuUng = {
  "data-reveal": KieuHieuUng
  style: CSSProperties
}

/** Class trên container bật chế độ ẩn-trước-khi-hiện. */
const CLASS_BAT_HIEU_UNG = "fp-motion"
/** Class đánh dấu phần tử đã xuất hiện (chỉ chạy một lần). */
const CLASS_DA_HIEN = "is-revealed"
/** Mở rộng vùng gốc lên trên để phần tử đã bị cuộn qua vẫn được tính là giao nhau. */
const MO_RONG_PHIA_TREN = "100000px"

/**
 * Tạo thuộc tính hiệu ứng cho một phần tử. Dùng `thuTu` để xếp lần lượt
 * (stagger) các phần tử trong cùng nhóm; mỗi bậc trễ 100ms (xem CSS).
 *
 * @param kieu - Kiểu chuyển động, mặc định `len` (fade-up)
 * @param thuTu - Vị trí trong nhóm stagger, bắt đầu từ 0
 * @param style - Style sẵn có cần gộp (ví dụ `aspectRatio`)
 * @returns Đối tượng spread được vào JSX: `{...layThuocTinhHieuUng("len", 1)}`
 */
export function layThuocTinhHieuUng(
  kieu: KieuHieuUng = "len",
  thuTu = 0,
  style: CSSProperties = {},
): ThuocTinhHieuUng {
  return {
    "data-reveal": kieu,
    style: { ...style, "--fp-i": thuTu } as CSSProperties,
  }
}

/**
 * Kiểm tra môi trường có nên chạy hiệu ứng hay không.
 *
 * @returns `true` khi có IntersectionObserver và người dùng không yêu cầu giảm chuyển động
 */
function kiemTraCoNenChayHieuUng(): boolean {
  if (typeof window === "undefined") return false
  if (!("IntersectionObserver" in window)) return false
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Theo dõi mọi phần tử `[data-reveal]` trong container bằng **một**
 * IntersectionObserver dùng chung và gắn `is-revealed` khi chúng vào viewport.
 *
 * - Mỗi phần tử chỉ hiện một lần; observer `unobserve` ngay sau đó.
 * - Vùng gốc được mở rộng lên trên (`MO_RONG_PHIA_TREN`): phần tử nằm *phía trên*
 *   viewport cũng tính là giao nhau. Nhờ vậy khi người dùng nhảy thẳng qua
 *   (phím End, link neo) mà không phần tử nào lọt vào viewport, observer vẫn
 *   nhận được thay đổi trạng thái và nội dung không bị kẹt ẩn.
 * - Khi một phần tử hiện, mọi phần tử đứng trước nó trong DOM cũng được hiện.
 * - Dọn observer và gỡ class khi component unmount.
 *
 * Tác dụng phụ: thêm/bớt class trên container và các phần tử con.
 *
 * @param containerRef - Ref tới phần tử bao (thường là `<main>` của trang)
 * @param tuyChon.threshold - Tỉ lệ hiển thị để kích hoạt, mặc định 0.15
 * @param tuyChon.lePhiaDuoi - Lề đáy viewport, mặc định `-8%` (kích hoạt trễ hơn mép dưới)
 * @param tuyChon.hienNgay - Selector các phần tử hiện ngay khi tải trang
 *   (không chờ cuộn), ví dụ hero; vẫn giữ stagger và transition
 */
export function useHieuUngCuon(
  containerRef: RefObject<HTMLElement | null>,
  { threshold = 0.15, lePhiaDuoi = "-8%", hienNgay }: {
    threshold?: number
    lePhiaDuoi?: string
    hienNgay?: string
  } = {},
): void {
  useEffect(() => {
    const container = containerRef.current
    if (!container || !kiemTraCoNenChayHieuUng()) return

    const danhSach = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal]"),
    )
    const viTri = new Map(danhSach.map((phanTu, i) => [phanTu, i]))
    let daHienDen = -1

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const i = viTri.get(entry.target as HTMLElement) ?? -1
          // Hiện phần tử này và mọi phần tử đứng trước còn đang ẩn.
          for (let j = daHienDen + 1; j <= i; j++) {
            danhSach[j].classList.add(CLASS_DA_HIEN)
            observer.unobserve(danhSach[j])
          }
          daHienDen = Math.max(daHienDen, i)
        })
      },
      {
        threshold,
        rootMargin: `${MO_RONG_PHIA_TREN} 0px ${lePhiaDuoi} 0px`,
      },
    )

    container.classList.add(CLASS_BAT_HIEU_UNG)
    const phanTuHienNgay = new Set(
      hienNgay ? container.querySelectorAll<HTMLElement>(hienNgay) : [],
    )
    danhSach.forEach((phanTu) => {
      if (!phanTuHienNgay.has(phanTu)) observer.observe(phanTu)
    })

    // Chờ 2 frame để trạng thái ẩn ban đầu được vẽ, nhờ đó transition chạy.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        phanTuHienNgay.forEach((phanTu) => phanTu.classList.add(CLASS_DA_HIEN))
      })
    })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      container.classList.remove(CLASS_BAT_HIEU_UNG)
    }
  }, [containerRef, threshold, lePhiaDuoi, hienNgay])
}
