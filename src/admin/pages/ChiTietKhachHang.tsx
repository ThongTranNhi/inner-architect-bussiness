import { useEffect, useState } from "react"
import { Link } from "../../dieu-huong"
import { GOC_QUAN_TRI } from "../duong-dan-quan-tri"
import { layNhanDichVu } from "../../lien-he/dich-vu-lien-he"
import { ChonTrangThai, NhanTrangThai } from "../components/TrangThaiKhachHang"
import { dinhDangThoiGian, NHAN_TRANG_THAI } from "../dinh-dang"
import { usePhienQuanTri } from "../hooks/usePhienQuanTri"
import { capNhatTrangThai, LoiApi, layChiTietKhachHang } from "../services/api-quan-tri"
import type { KhachHang } from "../types/quan-tri"

/**
 * Chi tiết một khách hàng: thông tin liên hệ, nút gọi/gửi email, lịch sử thời gian
 * và cập nhật trạng thái chăm sóc (có nút xác nhận).
 *
 * @param props.id - ID khách hàng lấy từ đường dẫn
 * @returns Trang chi tiết
 */
export function ChiTietKhachHang({ id }: { id: number }) {
  const { xuLyHetPhien } = usePhienQuanTri()
  const [khachHang, setKhachHang] = useState<KhachHang | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [thongBao, setThongBao] = useState<string | null>(null)

  useEffect(() => {
    let daHuy = false
    setLoi(null)
    layChiTietKhachHang(id)
      .then((kh) => !daHuy && setKhachHang(kh))
      .catch((e: unknown) => {
        if (daHuy) return
        if (e instanceof LoiApi && e.status === 401) xuLyHetPhien()
        else setLoi(e instanceof Error ? e.message : "Không tải được thông tin khách hàng.")
      })
    return () => {
      daHuy = true
    }
  }, [id, xuLyHetPhien])

  return (
    <>
      <Link to={`${GOC_QUAN_TRI}/customers`} className="underlink text-[13px]">
        ← Danh sách khách hàng
      </Link>

      {loi && (
        <p role="alert" className="mt-8 border-l-2 border-[#9b3b25] py-2 pl-4 text-[#9b3b25]">
          {loi}
        </p>
      )}
      {!khachHang && !loi && <p className="mt-8" aria-busy="true">Đang tải…</p>}

      {khachHang && (
        <article className="mt-6">
          <p className="eyebrow">KHÁCH HÀNG #{khachHang.id}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <h1 className="serif m-0 text-[clamp(32px,4vw,48px)] leading-[1.1]">{khachHang.fullName}</h1>
            <NhanTrangThai trangThai={khachHang.status} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${khachHang.phone}`}
              className="inline-flex min-h-[48px] items-center bg-[var(--ink)] px-5 text-[14px] text-white! hover:bg-[var(--brown)]"
            >
              Gọi {khachHang.phone}
            </a>
            {khachHang.email && (
              <a
                href={`mailto:${khachHang.email}`}
                className="inline-flex min-h-[48px] items-center border border-[var(--ink)] px-5 text-[14px] hover:bg-white/60"
              >
                Gửi email
              </a>
            )}
          </div>

          <dl className="mt-10 grid max-w-[760px] grid-cols-1 border-t border-[var(--line)] sm:grid-cols-[200px_1fr]">
            {[
              ["Số điện thoại", khachHang.phone],
              ["Email", khachHang.email ?? "—"],
              ["Dịch vụ quan tâm", layNhanDichVu(khachHang.service)],
              ["Nguồn", khachHang.source === "website" ? "Website" : khachHang.source],
              ["Ngày gửi", dinhDangThoiGian(khachHang.createdAt)],
              ["Đồng ý liên hệ lúc", dinhDangThoiGian(khachHang.consentAt)],
              ["Cập nhật gần nhất", dinhDangThoiGian(khachHang.updatedAt)],
            ].map(([nhan, giaTri]) => (
              <div key={nhan} className="contents">
                <dt className="border-b border-[var(--line)] py-3 text-[13px] text-[#6b5f4f] sm:pr-6">{nhan}</dt>
                <dd className="m-0 border-b border-[var(--line)] py-3 text-[15px] break-words">{giaTri}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-10 max-w-[760px]" aria-labelledby="tieu-de-trang-thai">
            <h2 id="tieu-de-trang-thai" className="serif m-0 text-[26px] leading-[1.2]">
              Trạng thái chăm sóc
            </h2>
            <p className="mt-1 text-[13px] text-[#6b5f4f]">Chọn trạng thái rồi bấm Lưu để xác nhận.</p>
            <div className="mt-3">
              <ChonTrangThai
                trangThai={khachHang.status}
                nhanPhu={khachHang.fullName}
                onLuu={async (trangThai) => {
                  setThongBao(null)
                  try {
                    const moi = await capNhatTrangThai(khachHang.id, trangThai)
                    setKhachHang(moi)
                    setThongBao(`Đã cập nhật: ${NHAN_TRANG_THAI[moi.status]}.`)
                  } catch (e) {
                    if (e instanceof LoiApi && e.status === 401) xuLyHetPhien()
                    else setLoi(e instanceof Error ? e.message : "Không cập nhật được trạng thái.")
                    throw e
                  }
                }}
              />
            </div>
            <p className="mt-3 min-h-[20px] text-[13px] text-[var(--olive)]" aria-live="polite">
              {thongBao}
            </p>
          </section>
        </article>
      )}
    </>
  )
}
