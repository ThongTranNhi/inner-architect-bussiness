import { useCallback, useEffect, useState } from "react"
import { Link } from "../../dieu-huong"
import { GOC_QUAN_TRI } from "../duong-dan-quan-tri"
import { DANH_SACH_DICH_VU_LIEN_HE, layNhanDichVu } from "../../lien-he/dich-vu-lien-he"
import { ChonTrangThai, NhanTrangThai } from "../components/TrangThaiKhachHang"
import { DANH_SACH_TRANG_THAI, dinhDangThoiGian, NHAN_TRANG_THAI } from "../dinh-dang"
import { usePhienQuanTri } from "../hooks/usePhienQuanTri"
import { capNhatTrangThai, LoiApi, layDanhSachKhachHang } from "../services/api-quan-tri"
import type { BoLocKhachHang, KhachHang, PhanTrang, TrangThaiKhachHang } from "../types/quan-tri"

/**
 * Đọc bộ lọc ban đầu từ query của URL, ví dụ `/jathong/customers?status=new`.
 *
 * @returns Bộ lọc khởi tạo
 */
function docBoLocTuUrl(): BoLocKhachHang {
  const query = new URLSearchParams(window.location.search)
  const trang = Number(query.get("page"))
  return {
    q: query.get("q") ?? "",
    service: query.get("service") ?? "",
    status: query.get("status") ?? "",
    page: Number.isInteger(trang) && trang > 0 ? trang : 1,
  }
}

/**
 * Ghi bộ lọc vào query của URL (replaceState, không tạo lịch sử mới, không đổi trang)
 * để tải lại trang vẫn giữ bộ lọc.
 *
 * @param boLoc - Bộ lọc hiện tại
 */
function ghiBoLocVaoUrl(boLoc: BoLocKhachHang) {
  const query = new URLSearchParams()
  if (boLoc.q) query.set("q", boLoc.q)
  if (boLoc.service) query.set("service", boLoc.service)
  if (boLoc.status) query.set("status", boLoc.status)
  if (boLoc.page > 1) query.set("page", String(boLoc.page))
  const chuoi = query.toString()
  history.replaceState(null, "", `${GOC_QUAN_TRI}/customers${chuoi ? `?${chuoi}` : ""}`)
}

/**
 * Danh sách khách hàng: tìm theo tên/SĐT/email, lọc dịch vụ và trạng thái,
 * phân trang ở backend, cập nhật trạng thái ngay trên dòng (có nút xác nhận).
 *
 * @returns Trang quản lý khách hàng
 */
export function DanhSachKhachHang() {
  const { xuLyHetPhien } = usePhienQuanTri()
  const [boLoc, setBoLoc] = useState<BoLocKhachHang>(docBoLocTuUrl)
  const [tuKhoaNhap, setTuKhoaNhap] = useState(boLoc.q)
  const [ketQua, setKetQua] = useState<{ data: KhachHang[]; pagination: PhanTrang } | null>(null)
  const [dangTai, setDangTai] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [thongBao, setThongBao] = useState<string | null>(null)
  const [lanTai, setLanTai] = useState(0)

  /** Xử lý lỗi API chung: 401 → về đăng nhập, còn lại hiển thị thông điệp. */
  const xuLyLoi = useCallback(
    (e: unknown) => {
      if (e instanceof LoiApi && e.status === 401) xuLyHetPhien()
      else setLoi(e instanceof Error ? e.message : "Đã có lỗi xảy ra.")
    },
    [xuLyHetPhien],
  )

  // Tìm kiếm chạy sau khi ngừng gõ 300ms.
  useEffect(() => {
    const hen = setTimeout(() => {
      setBoLoc((cu) => (cu.q === tuKhoaNhap.trim() ? cu : { ...cu, q: tuKhoaNhap.trim(), page: 1 }))
    }, 300)
    return () => clearTimeout(hen)
  }, [tuKhoaNhap])

  useEffect(() => {
    let daHuy = false
    ghiBoLocVaoUrl(boLoc)
    setDangTai(true)
    setLoi(null)
    layDanhSachKhachHang(boLoc)
      .then((kq) => !daHuy && setKetQua(kq))
      .catch((e: unknown) => !daHuy && xuLyLoi(e))
      .finally(() => !daHuy && setDangTai(false))
    return () => {
      daHuy = true
    }
  }, [boLoc, lanTai, xuLyLoi])

  /**
   * Lưu trạng thái mới cho một khách hàng rồi cập nhật dòng tương ứng.
   *
   * @param khachHang - Khách hàng cần cập nhật
   * @param trangThai - Trạng thái nhân viên đã chọn
   */
  async function luuTrangThai(khachHang: KhachHang, trangThai: TrangThaiKhachHang) {
    setThongBao(null)
    try {
      const moi = await capNhatTrangThai(khachHang.id, trangThai)
      setKetQua((cu) => cu && { ...cu, data: cu.data.map((kh) => (kh.id === moi.id ? moi : kh)) })
      setThongBao(`Đã cập nhật #${moi.id} ${moi.fullName}: ${NHAN_TRANG_THAI[moi.status]}.`)
    } catch (e) {
      xuLyLoi(e)
      throw e
    }
  }

  const doiBoLoc = (thayDoi: Partial<BoLocKhachHang>) => setBoLoc((cu) => ({ ...cu, ...thayDoi, page: 1 }))
  const phanTrang = ketQua?.pagination
  const coBoLoc = Boolean(boLoc.q || boLoc.service || boLoc.status)
  const lopBoLoc = "min-h-[44px] w-full border border-[var(--line)] bg-white/60 px-3 text-[14px]"

  return (
    <>
      <p className="eyebrow">KHÁCH HÀNG</p>
      <h1 className="serif mt-3 text-[clamp(32px,4vw,48px)] leading-[1.1]">Danh sách khách hàng</h1>

      <div className="mt-8 grid gap-3 md:grid-cols-[2fr_1fr_1fr]" role="search">
        <div>
          <label htmlFor="loc-tu-khoa" className="mb-1 block text-[12px] text-[#6b5f4f]">
            Tìm theo tên, số điện thoại hoặc email
          </label>
          <input
            id="loc-tu-khoa"
            type="search"
            value={tuKhoaNhap}
            maxLength={100}
            onChange={(e) => setTuKhoaNhap(e.target.value)}
            className={lopBoLoc}
          />
        </div>
        <div>
          <label htmlFor="loc-dich-vu" className="mb-1 block text-[12px] text-[#6b5f4f]">
            Dịch vụ
          </label>
          <select id="loc-dich-vu" value={boLoc.service} onChange={(e) => doiBoLoc({ service: e.target.value })} className={lopBoLoc}>
            <option value="">Tất cả dịch vụ</option>
            {DANH_SACH_DICH_VU_LIEN_HE.map((dv) => (
              <option key={dv.ma} value={dv.ma}>
                {dv.nhan}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="loc-trang-thai" className="mb-1 block text-[12px] text-[#6b5f4f]">
            Trạng thái
          </label>
          <select id="loc-trang-thai" value={boLoc.status} onChange={(e) => doiBoLoc({ status: e.target.value })} className={lopBoLoc}>
            <option value="">Tất cả trạng thái</option>
            {DANH_SACH_TRANG_THAI.map((tt) => (
              <option key={tt} value={tt}>
                {NHAN_TRANG_THAI[tt]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex min-h-[24px] flex-wrap items-center justify-between gap-3 text-[13px]" aria-live="polite">
        <span>
          {dangTai ? "Đang tải…" : phanTrang ? `${phanTrang.total} khách hàng${coBoLoc ? " khớp bộ lọc" : ""}` : ""}
        </span>
        {thongBao && <span className="text-[var(--olive)]">{thongBao}</span>}
      </div>

      {loi && (
        <div role="alert" className="mt-4 border-l-2 border-[#9b3b25] py-2 pl-4 text-[14px] text-[#9b3b25]">
          {loi}{" "}
          <button type="button" className="underlink ml-2" onClick={() => setLanTai((n) => n + 1)}>
            Tải lại
          </button>
        </div>
      )}

      {ketQua && ketQua.data.length === 0 && !dangTai && !loi && (
        <div className="mt-8 border border-dashed border-[var(--line)] px-6 py-12 text-center">
          <p className="serif m-0 text-[24px]">{coBoLoc ? "Không có khách hàng khớp bộ lọc." : "Chưa có khách hàng nào."}</p>
          <p className="mt-2 text-[13px] text-[#6b5f4f]">
            {coBoLoc ? "Thử bỏ bớt điều kiện tìm kiếm." : "Thông tin gửi từ biểu mẫu Liên hệ sẽ xuất hiện tại đây."}
          </p>
        </div>
      )}

      {ketQua && ketQua.data.length > 0 && (
        <div className={`mt-4 transition-opacity ${dangTai ? "opacity-50" : ""}`}>
          {/* Bảng cho màn hình rộng */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[var(--ink)] text-[12px] tracking-[.04em] text-[#6b5f4f]">
                  <th scope="col" className="py-3 pr-3 font-medium">ID</th>
                  <th scope="col" className="py-3 pr-3 font-medium">Họ tên</th>
                  <th scope="col" className="py-3 pr-3 font-medium">Điện thoại</th>
                  <th scope="col" className="py-3 pr-3 font-medium">Email</th>
                  <th scope="col" className="py-3 pr-3 font-medium">Dịch vụ quan tâm</th>
                  <th scope="col" className="py-3 pr-3 font-medium">Trạng thái</th>
                  <th scope="col" className="py-3 pr-3 font-medium">Ngày gửi</th>
                  <th scope="col" className="py-3 font-medium">Cập nhật trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {ketQua.data.map((kh) => (
                  <tr key={kh.id} className="border-b border-[var(--line)] align-middle">
                    <td className="py-3 pr-3 tabular-nums text-[#6b5f4f]">#{kh.id}</td>
                    <td className="py-3 pr-3">
                      <Link to={`${GOC_QUAN_TRI}/customers/${kh.id}`} className="underlink font-medium">
                        {kh.fullName}
                      </Link>
                    </td>
                    <td className="py-3 pr-3 tabular-nums">
                      <a href={`tel:${kh.phone}`} className="hover:text-[var(--rust)]!">{kh.phone}</a>
                    </td>
                    <td className="max-w-[220px] truncate py-3 pr-3">
                      {kh.email ? (
                        <a href={`mailto:${kh.email}`} className="hover:text-[var(--rust)]!">{kh.email}</a>
                      ) : (
                        <span className="text-[#9a8f80]">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-3">{layNhanDichVu(kh.service)}</td>
                    <td className="py-3 pr-3"><NhanTrangThai trangThai={kh.status} /></td>
                    <td className="whitespace-nowrap py-3 pr-3 tabular-nums">{dinhDangThoiGian(kh.createdAt)}</td>
                    <td className="py-3">
                      <ChonTrangThai trangThai={kh.status} nhanPhu={kh.fullName} onLuu={(tt) => luuTrangThai(kh, tt)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Thẻ cho mobile/tablet */}
          <ul className="grid list-none gap-3 p-0 lg:hidden">
            {ketQua.data.map((kh) => (
              <li key={kh.id} className="border border-[var(--line)] bg-white/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`${GOC_QUAN_TRI}/customers/${kh.id}`} className="font-medium underlink">
                    {kh.fullName}
                  </Link>
                  <span className="text-[12px] tabular-nums text-[#6b5f4f]">#{kh.id}</span>
                </div>
                <p className="mt-2 mb-0 text-[13px]">{layNhanDichVu(kh.service)}</p>
                <p className="mt-1 mb-0 text-[12px] text-[#6b5f4f]">{dinhDangThoiGian(kh.createdAt)}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
                  <a href={`tel:${kh.phone}`} className="inline-flex min-h-[40px] items-center border border-[var(--ink)] px-3">
                    Gọi {kh.phone}
                  </a>
                  {kh.email && (
                    <a href={`mailto:${kh.email}`} className="inline-flex min-h-[40px] items-center border border-[var(--line)] px-3">
                      Gửi email
                    </a>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <NhanTrangThai trangThai={kh.status} />
                  <ChonTrangThai trangThai={kh.status} nhanPhu={kh.fullName} onLuu={(tt) => luuTrangThai(kh, tt)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {phanTrang && phanTrang.totalPages > 1 && (
        <nav aria-label="Phân trang" className="mt-8 flex items-center justify-center gap-4 text-[14px]">
          <button
            type="button"
            disabled={boLoc.page <= 1 || dangTai}
            onClick={() => setBoLoc((cu) => ({ ...cu, page: cu.page - 1 }))}
            className="min-h-[44px] border border-[var(--line)] px-4 disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="tabular-nums">
            Trang {phanTrang.page}/{phanTrang.totalPages}
          </span>
          <button
            type="button"
            disabled={boLoc.page >= phanTrang.totalPages || dangTai}
            onClick={() => setBoLoc((cu) => ({ ...cu, page: cu.page + 1 }))}
            className="min-h-[44px] border border-[var(--line)] px-4 disabled:opacity-40"
          >
            Sau →
          </button>
        </nav>
      )}
    </>
  )
}
