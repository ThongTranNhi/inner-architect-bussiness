import { useEffect, useRef, useState, type CSSProperties } from "react"

/** Đường cong chuyển động mềm dùng chung cho khối liên hệ. */
const DUONG_CONG = "cubic-bezier(0.16, 1, 0.3, 1)"
/** Thời lượng hiệu ứng xuất hiện (ms), trong khoảng 500–700ms. */
const THOI_LUONG_MS = 600

/**
 * Kiểm tra người dùng có bật "giảm chuyển động" của hệ điều hành hay không.
 *
 * @returns `true` khi `prefers-reduced-motion: reduce`
 */
function nguoiDungGiamChuyenDong(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/**
 * Theo dõi một phần tử và báo `daHien = true` đúng một lần khi nó vào khung nhìn
 * (once: true) — cuộn ra rồi vào lại không chạy lại hiệu ứng, nên không làm
 * nhiễu người đang nhập biểu mẫu.
 *
 * Khi người dùng bật giảm chuyển động hoặc trình duyệt không có
 * IntersectionObserver, nội dung hiển thị ngay và `xuatHien()` không gắn transition.
 *
 * @returns `ref` gắn vào phần tử gốc và hàm `xuatHien(treMs)` trả style fade-up
 *          với độ trễ tính bằng ms để tạo hiệu ứng so le (stagger)
 */
export function useXuatHienMotLan<T extends Element>() {
  const ref = useRef<T>(null)
  const [giamChuyenDong] = useState(nguoiDungGiamChuyenDong)
  const [daHien, setDaHien] = useState(giamChuyenDong)

  useEffect(() => {
    if (daHien) return
    const phanTu = ref.current
    if (!phanTu || typeof IntersectionObserver === "undefined") {
      setDaHien(true)
      return
    }
    const quanSat = new IntersectionObserver(
      (muc) => {
        if (muc.some((m) => m.isIntersecting)) {
          setDaHien(true)
          quanSat.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    quanSat.observe(phanTu)
    return () => quanSat.disconnect()
  }, [daHien])

  /**
   * Style fade-up (opacity + translateY) cho một phần tử con.
   *
   * @param treMs - Độ trễ bắt đầu (ms) so với lúc khối vào khung nhìn
   * @returns Style inline; rỗng khi giảm chuyển động
   */
  const xuatHien = (treMs = 0): CSSProperties =>
    giamChuyenDong
      ? {}
      : {
          opacity: daHien ? 1 : 0,
          transform: daHien ? "none" : "translateY(18px)",
          transition: `opacity ${THOI_LUONG_MS}ms ${DUONG_CONG} ${treMs}ms, transform ${THOI_LUONG_MS}ms ${DUONG_CONG} ${treMs}ms`,
        }

  return { ref, daHien, xuatHien }
}
