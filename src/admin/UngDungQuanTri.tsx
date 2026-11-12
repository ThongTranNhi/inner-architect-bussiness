import { useEffect, type ReactNode } from "react"
import { Link, thayDuongDan } from "../dieu-huong"
import { KhungQuanTri } from "./components/KhungQuanTri"
import { GOC_QUAN_TRI } from "./duong-dan-quan-tri"
import { PhienQuanTriProvider, usePhienQuanTri } from "./hooks/usePhienQuanTri"
import { ChiTietKhachHang } from "./pages/ChiTietKhachHang"
import { DangNhapQuanTri } from "./pages/DangNhapQuanTri"
import { DanhSachKhachHang } from "./pages/DanhSachKhachHang"
import { TongQuanQuanTri } from "./pages/TongQuanQuanTri"

/** Tiêu đề tab trình duyệt cho từng màn quản trị. */
const TIEU_DE: Record<string, string> = {
  [`${GOC_QUAN_TRI}/login`]: "Đăng nhập",
  [GOC_QUAN_TRI]: "Tổng quan",
  [`${GOC_QUAN_TRI}/customers`]: "Khách hàng",
}

/** Khớp trang chi tiết khách hàng, ví dụ `/jathong/customers/12`. */
const MAU_CHI_TIET = new RegExp(`^${GOC_QUAN_TRI}/customers/(\\d+)$`)

/**
 * Chọn màn hình theo đường dẫn và trạng thái phiên.
 * Chưa đăng nhập → luôn hiển thị màn đăng nhập (kiểm tra quyền thật nằm ở backend).
 *
 * @param props.duongDan - Đường dẫn đã chuẩn hóa, bắt đầu bằng `GOC_QUAN_TRI`
 * @returns Màn hình quản trị tương ứng
 */
function DinhTuyenQuanTri({ duongDan }: { duongDan: string }) {
  const { quanTriVien } = usePhienQuanTri()

  useEffect(() => {
    const tieuDe = MAU_CHI_TIET.test(duongDan) ? "Chi tiết khách hàng" : (TIEU_DE[duongDan] ?? "Quản trị")
    document.title = `${tieuDe} — INNER ARCHITECT™ Customer Care`
  }, [duongDan])

  // Đã đăng nhập mà vẫn ở trang đăng nhập → về dashboard.
  useEffect(() => {
    if (quanTriVien && duongDan === `${GOC_QUAN_TRI}/login`) thayDuongDan(GOC_QUAN_TRI)
  }, [quanTriVien, duongDan])

  if (quanTriVien === undefined)
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--cream)] text-[var(--ink)]" aria-busy="true">
        <p className="text-[14px]">Đang kiểm tra phiên đăng nhập…</p>
      </main>
    )
  if (!quanTriVien) return <DangNhapQuanTri />

  let noiDung: ReactNode
  const khopChiTiet = duongDan.match(MAU_CHI_TIET)
  if (duongDan === GOC_QUAN_TRI || duongDan === `${GOC_QUAN_TRI}/login`) noiDung = <TongQuanQuanTri />
  else if (duongDan === `${GOC_QUAN_TRI}/customers`) noiDung = <DanhSachKhachHang />
  else if (khopChiTiet) noiDung = <ChiTietKhachHang key={khopChiTiet[1]} id={Number(khopChiTiet[1])} />
  else
    noiDung = (
      <p>
        Không tìm thấy trang quản trị.{" "}
        <Link to={GOC_QUAN_TRI} className="underlink">
          Về tổng quan
        </Link>
      </p>
    )

  return <KhungQuanTri duongDan={duongDan}>{noiDung}</KhungQuanTri>
}

/**
 * Điểm vào trang quản trị nội bộ (`/jathong…`, xem `GOC_QUAN_TRI`), tải lazy riêng
 * khỏi website công khai.
 *
 * @param props.duongDan - Đường dẫn đã chuẩn hóa
 * @returns Ứng dụng quản trị
 */
export default function UngDungQuanTri({ duongDan }: { duongDan: string }) {
  return (
    <PhienQuanTriProvider>
      <DinhTuyenQuanTri duongDan={duongDan} />
    </PhienQuanTriProvider>
  )
}
