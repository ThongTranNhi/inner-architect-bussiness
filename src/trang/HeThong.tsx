import { useEffect, useRef, useState } from "react"
import { Link } from "../dieu-huong"

/** Dữ liệu 6 trang portfolio chuẩn từ tài liệu Inner Architect Portfolio.pdf. */
interface MucTrangPortfolio {
  soTrang: string
  tenNgan: string
  tieuDe: string
  phuDe: string
  chamNgon: string
  moTa: string
  src: string
  alt: string
}

const danhSachAnhPortfolio: MucTrangPortfolio[] = [
  {
    soTrang: "06",
    tenNgan: "Tổng quan 4 tầng",
    tieuDe: "Giải pháp: Hệ thống tích hợp 4 tầng",
    phuDe: "INNER ARCHITECT™ SYSTEM",
    chamNgon: "Mỗi tầng có điểm bắt đầu & điểm kết rõ ràng",
    moTa: "Hệ thống vận hành thông qua 4 tầng chức năng, được thiết kế nhằm bảo đảm sự rõ ràng, an toàn và khả năng hoàn tất tiến trình.",
    src: "/assets/he-thong/06-giai-phap-he-thong-tich-hop-4-tang.webp",
    alt: "Trang 06 Portfolio - Giải pháp: Hệ thống tích hợp 4 tầng",
  },
  {
    soTrang: "07",
    tenNgan: "Cấu trúc & Logic",
    tieuDe: "Cấu trúc & Logic vận hành hệ thống 4 tầng",
    phuDe: "OPERATIONAL LOGIC",
    chamNgon: "An toàn luôn đặt trước chiều sâu – Tự chủ là mục tiêu tối thượng",
    moTa: "Các tầng đại diện cho phạm vi chức năng riêng biệt, không thay thế nhau và được liên kết bằng logic chuyển tầng rõ ràng.",
    src: "/assets/he-thong/07-cau-truc-va-logic-van-hanh-he-thong-4-tang.webp",
    alt: "Trang 07 Portfolio - Cấu trúc & Logic vận hành hệ thống 4 tầng",
  },
  {
    soTrang: "08",
    tenNgan: "Tầng 1 · Entry",
    tieuDe: "Tầng 1 – Entry (Cafe The Hermit Tarot)",
    phuDe: "TIẾP CẬN BAN ĐẦU",
    chamNgon: "Tầng 1 tồn tại để chỉ ra, không phải để giải quyết.",
    moTa: "Điểm tiếp xúc đầu tiên tạo không gian soi chiếu ban đầu, nhận diện bối cảnh và mức độ sẵn sàng mà không kích hoạt cảm xúc.",
    src: "/assets/he-thong/08-tang-1-entry-the-hermit-tarot.webp",
    alt: "Trang 08 Portfolio - Tầng 1 Entry Cafe The Hermit Tarot",
  },
  {
    soTrang: "09",
    tenNgan: "Tầng 2 · Chữa lành",
    tieuDe: "Tầng 2 – Chữa lành & Tái cấu trúc",
    phuDe: "HEALING & RESTRUCTURING",
    chamNgon: "Không tìm cao trào cảm xúc – xây nền cho thay đổi bền vững.",
    moTa: "Tầng làm việc cốt lõi tháo gỡ mô thức cảm xúc và niềm tin gốc, phục hồi khả năng tự điều chỉnh và lựa chọn sống tự chủ.",
    src: "/assets/he-thong/09-tang-2-chua-lanh-va-tai-cau-truc.webp",
    alt: "Trang 09 Portfolio - Tầng 2 Chữa lành và Tái cấu trúc",
  },
  {
    soTrang: "10",
    tenNgan: "Tầng 3 · Định hướng",
    tieuDe: "Tầng 3 – Định hướng & Giữ linh hồn hệ thống",
    phuDe: "DIRECTION & MASTER LAYER",
    chamNgon: "Giữ trục sống mới sau chữa lành, ngăn quay lại mô thức cũ.",
    moTa: "Tầng giữ trục và bảo toàn vận hành, duy trì sự phù hợp giữa đời sống thực tế và cấu trúc nội tâm mới sau khi tái cấu trúc.",
    src: "/assets/he-thong/10-tang-3-dinh-huong-va-giu-linh-hon-he-thong.webp",
    alt: "Trang 10 Portfolio - Tầng 3 Định hướng và Giữ linh hồn hệ thống",
  },
  {
    soTrang: "11",
    tenNgan: "Tầng 4 · Thân thể",
    tieuDe: "Tầng 4 – Điều tiết thân & Năng lượng",
    phuDe: "BODY & ENERGY REGULATION",
    chamNgon: "Tầng 4 tồn tại để giữ thân an toàn, không phải để đẩy quá trình đi nhanh hơn.",
    moTa: "Giữ nền an toàn hỗ trợ khả năng tự điều hòa của thân thể và hệ thần kinh, neo vững sự chuyển hóa trong đời sống thực.",
    src: "/assets/he-thong/11-tang-4-dieu-tiet-than-va-nang-luong.webp",
    alt: "Trang 11 Portfolio - Tầng 4 Điều tiết thân và Năng lượng",
  },
]

/**
 * Trang Hệ thống bốn tầng (`/he-thong`)
 * - Desktop/Tablet: Phương án 2 (Triển lãm song song Dual-pane Exhibition, cột ảnh ghim sticky, cột chỉ mục tương tác).
 * - Mobile: Nửa trên là dải hình ảnh trượt ngang (Horizontal Slider), nửa dưới là chỉ mục các tầng tương tác đồng bộ.
 */
export function HeThongPage() {
  const [trangHienTaiIndex, setTrangHienTaiIndex] = useState<number>(0)
  const [dangMoToanManHinh, setDangMoToanManHinh] = useState<boolean>(false)
  const mobileSliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const xuLyNhanPhim = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDangMoToanManHinh(false)
      }
    }
    window.addEventListener("keydown", xuLyNhanPhim)
    return () => window.removeEventListener("keydown", xuLyNhanPhim)
  }, [])

  const trangDangXem = danhSachAnhPortfolio[trangHienTaiIndex]

  const quayVeTrangTruoc = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.hash = "/"
    }
  }

  /** Xử lý khi chọn trang từ danh mục hoặc tab */
  const chuyenTrang = (index: number) => {
    setTrangHienTaiIndex(index)
    // Đồng bộ vị trí cuộn trên slider mobile nếu có
    if (mobileSliderRef.current) {
      const card = mobileSliderRef.current.children[index] as HTMLElement
      if (card) {
        card.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        })
      }
    }
  }

  return (
    <main className="cream-page he-thong-page min-h-screen pb-20 select-none">
      {/* 1. Header Trang Nhã kèm Nút X Thoát Quay Về */}
      <header className="max-w-[1360px] mx-auto px-6 pt-10 sm:pt-14 pb-8 border-b border-[#3B3636]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#B75E2A]" />
              <p className="text-xs font-semibold tracking-widest text-[#B75E2A] uppercase m-0">
                INNER ARCHITECT™ · PORTFOLIO EXHIBITION
              </p>
            </div>
            <h1 className="serif text-3xl sm:text-4xl lg:text-5xl text-[#27190F] m-0 font-bold tracking-tight">
              Hệ thống tích hợp bốn tầng
            </h1>
            <p className="text-[#3B3636]/75 text-sm sm:text-base mt-2 max-w-2xl">
              Hồ sơ cấu trúc và triết lý vận hành chính thức trích từ tài liệu gốc.
            </p>
          </div>

          {/* Nút X Thoát quay về trang trước */}
          <button
            type="button"
            onClick={quayVeTrangTruoc}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#3B3636]/20 bg-white/80 hover:bg-[#27190F] hover:text-[#FEFBF0] text-[#27190F] text-xs font-semibold transition-all cursor-pointer shadow-sm group"
            title="Thoát và quay về trang đang xem"
            aria-label="Thoát và quay về trang đang xem"
          >
            <span>Thoát</span>
            <span className="text-base leading-none group-hover:rotate-90 transition-transform">✕</span>
          </button>
        </div>
      </header>

      {/* 2. GIAO DIỆN DI ĐỘNG (MOBILE: < md) — Nửa trên slider trượt ngang, nửa dưới chỉ mục */}
      <div className="block md:hidden px-4 pt-6">
        {/* Nửa trên: Dải hình ảnh trượt ngang (Horizontal Slider) */}
        <div className="mb-2 flex items-center justify-between text-xs text-[#3B3636]/60 px-1 font-medium">
          <span>Vuốt ngang để lật trang</span>
          <span className="font-mono text-[#B75E2A] font-bold">
            {trangHienTaiIndex + 1} / {danhSachAnhPortfolio.length}
          </span>
        </div>

        <div
          ref={mobileSliderRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-none"
          onScroll={(e) => {
            const el = e.currentTarget
            const scrollLeft = el.scrollLeft
            const width = el.offsetWidth * 0.82
            const newIndex = Math.round(scrollLeft / width)
            if (newIndex >= 0 && newIndex < danhSachAnhPortfolio.length && newIndex !== trangHienTaiIndex) {
              setTrangHienTaiIndex(newIndex)
            }
          }}
        >
          {danhSachAnhPortfolio.map((item, index) => (
            <div
              key={item.soTrang}
              onClick={() => chuyenTrang(index)}
              className={`snap-center shrink-0 w-[82vw] rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl bg-white ${
                trangHienTaiIndex === index
                  ? "border-[#B75E2A] ring-2 ring-[#B75E2A]/30 scale-[1.01]"
                  : "border-[#3B3636]/15 opacity-80"
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block"
              />
            </div>
          ))}
        </div>

        {/* Nút lật nhanh trang trước / sau trên mobile */}
        <div className="flex items-center justify-between mt-2 mb-6 px-1">
          <button
            type="button"
            disabled={trangHienTaiIndex === 0}
            onClick={() => chuyenTrang(Math.max(0, trangHienTaiIndex - 1))}
            className="px-4 py-2 rounded-full text-xs font-medium border border-[#3B3636]/15 bg-white disabled:opacity-30 disabled:cursor-not-allowed text-[#27190F]"
          >
            ← Trang trước
          </button>
          <span className="text-xs font-semibold text-[#B75E2A]">
            {trangDangXem.tenNgan}
          </span>
          <button
            type="button"
            disabled={trangHienTaiIndex === danhSachAnhPortfolio.length - 1}
            onClick={() => chuyenTrang(Math.min(danhSachAnhPortfolio.length - 1, trangHienTaiIndex + 1))}
            className="px-4 py-2 rounded-full text-xs font-medium border border-[#3B3636]/15 bg-white disabled:opacity-30 disabled:cursor-not-allowed text-[#27190F]"
          >
            Trang sau →
          </button>
        </div>

        {/* Nửa dưới: Chỉ mục các tầng dạng danh thiếp tương tác */}
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-wider font-bold text-[#B75E2A] mb-1">
            NỘI DUNG TẦNG ĐANG XEM:
          </p>
          <div className="p-5 rounded-2xl bg-[#FFF5E2] border border-[#B75E2A]/30 shadow-sm">
            <span className="text-[11px] font-semibold text-[#B75E2A] block uppercase mb-1 tracking-wider">
              {trangDangXem.phuDe}
            </span>
            <h3 className="serif text-xl font-bold text-[#27190F] m-0 mb-2">
              {trangDangXem.tieuDe}
            </h3>
            <p className="text-xs sm:text-sm text-[#3B3636]/85 leading-relaxed m-0 mb-3">
              {trangDangXem.moTa}
            </p>
            <div className="pt-2 border-t border-[#B75E2A]/20 text-xs italic text-[#B75E2A] font-medium">
              👉 {trangDangXem.chamNgon}
            </div>
          </div>

          {/* Dải nút chuyển nhanh 6 trang */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {danhSachAnhPortfolio.map((item, idx) => (
              <button
                key={item.soTrang}
                type="button"
                onClick={() => chuyenTrang(idx)}
                className={`p-2.5 rounded-xl text-center border transition-all text-xs ${
                  trangHienTaiIndex === idx
                    ? "bg-[#27190F] text-[#FEFBF0] border-[#27190F] font-bold shadow"
                    : "bg-white text-[#3B3636]/80 border-[#3B3636]/15 hover:bg-[#FFF5E2]"
                }`}
              >
                <span className="block truncate font-medium">
                  {item.tenNgan}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GIAO DIỆN MÁY TÍNH & TABLET (DESKTOP/TABLET: md+) — Phương án 2 Triển lãm Song Song */}
      <div className="hidden md:block max-w-[1360px] mx-auto px-6 py-12">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* CỘT TRÁI (col-span-7): Khung triển lãm hình ảnh ghim sticky */}
          <div className="col-span-7 sticky top-24">
            <div className="flex items-center justify-between mb-3 text-xs text-[#3B3636]/70 px-2 font-medium">
              <span className="uppercase tracking-wider text-[#B75E2A] font-semibold">
                {trangDangXem.phuDe}
              </span>
            </div>

            {/* Khung trưng bày trang Portfolio cao cấp */}
            <div
              onClick={() => setDangMoToanManHinh(true)}
              className="relative rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl border border-[#3B3636]/15 bg-white transition-all duration-500 cursor-zoom-in group"
              title="Nhấn để xem phóng to toàn màn hình"
            >
              <img
                src={trangDangXem.src}
                alt={trangDangXem.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <span>Phóng to</span>
                <span>⤢</span>
              </div>
            </div>

            {/* Nút lật nhanh trang ở dưới khung ảnh */}
            <div className="flex items-center justify-between mt-4 px-2">
              <button
                type="button"
                disabled={trangHienTaiIndex === 0}
                onClick={() => chuyenTrang(Math.max(0, trangHienTaiIndex - 1))}
                className="px-4 py-2 rounded-full text-xs font-medium border border-[#3B3636]/15 bg-white hover:bg-[#27190F] hover:text-[#FEFBF0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[#27190F] cursor-pointer shadow-sm"
              >
                ← Trang trước
              </button>
              <button
                type="button"
                onClick={() => setDangMoToanManHinh(true)}
                className="text-xs text-[#B75E2A] hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer bg-transparent border-0"
              >
                <span>Xem ảnh phóng to</span>
                <span aria-hidden="true">⤢</span>
              </button>
              <button
                type="button"
                disabled={trangHienTaiIndex === danhSachAnhPortfolio.length - 1}
                onClick={() => chuyenTrang(Math.min(danhSachAnhPortfolio.length - 1, trangHienTaiIndex + 1))}
                className="px-4 py-2 rounded-full text-xs font-medium border border-[#3B3636]/15 bg-white hover:bg-[#27190F] hover:text-[#FEFBF0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[#27190F] cursor-pointer shadow-sm"
              >
                Trang sau →
              </button>
            </div>
          </div>

          {/* CỘT PHẢI (col-span-5): Chỉ mục tương tác 6 bước */}
          <div className="col-span-5 flex flex-col gap-3.5">
            <div className="mb-2">
              <p className="text-xs uppercase tracking-widest font-bold text-[#B75E2A] m-0 mb-1">
                CHỈ MỤC HỒ SƠ · INDEX
              </p>
              <h2 className="serif text-2xl font-bold text-[#27190F] m-0">
                Khám phá từng tầng
              </h2>
            </div>

            {danhSachAnhPortfolio.map((item, index) => {
              const dangChon = trangHienTaiIndex === index
              return (
                <div
                  key={item.soTrang}
                  onClick={() => chuyenTrang(index)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex flex-col ${
                    dangChon
                      ? "bg-[#FFF5E2] border-[#B75E2A] shadow-md scale-[1.01]"
                      : "bg-[#FAF7F2] hover:bg-white border-[#3B3636]/10 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[11px] uppercase tracking-wider font-semibold transition-colors ${
                        dangChon ? "text-[#B75E2A]" : "text-[#3B3636]/60"
                      }`}
                    >
                      {item.phuDe}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                        dangChon
                          ? "bg-[#B75E2A] text-white"
                          : "bg-black/5 text-[#3B3636]/60"
                      }`}
                    >
                      {item.tenNgan}
                    </span>
                  </div>

                  <h3
                    className={`serif text-lg font-bold m-0 transition-colors ${
                      dangChon ? "text-[#27190F]" : "text-[#3B3636]"
                    }`}
                  >
                    {item.tieuDe}
                  </h3>

                  {dangChon && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#B75E2A]/20">
                      <p className="text-xs text-[#3B3636]/85 leading-relaxed m-0 mb-2">
                        {item.moTa}
                      </p>
                      <p className="text-xs italic text-[#B75E2A] font-medium m-0 flex items-center gap-1.5">
                        <span>👉</span>
                        <span>{item.chamNgon}</span>
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 4. Điều Hướng Cuối Trang Tinh Tế */}
      <nav
        aria-label="Điều hướng trang"
        className="max-w-[1360px] mx-auto px-6 pt-10 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#3B3636]/15 mt-12 bg-transparent text-[#27190F]"
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm text-[#3B3636]/75 hover:text-[#27190F] transition-colors font-medium"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          <span>Về trang chủ</span>
        </Link>
        <Link
          to="/lien-he"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B75E2A] hover:text-[#27190F] transition-colors"
        >
          <span>Liên hệ tư vấn về hệ thống bốn tầng</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </nav>

      {/* 5. Chế độ xem phóng to toàn màn hình với icon dấu X thoát */}
      {dangMoToanManHinh && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chế độ xem ảnh toàn màn hình"
          className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
          onClick={() => setDangMoToanManHinh(false)}
        >
          {/* Header với nút icon dấu X nổi bật để thoát */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white/90 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B75E2A]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#FEFBF0]/90">
                {trangDangXem.phuDe} · {trangDangXem.tenNgan}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDangMoToanManHinh(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer border border-white/25 hover:scale-105 shadow-lg"
              aria-label="Thoát khỏi chế độ này và quay về trang đang xem"
              title="Đóng chế độ phóng to (Esc)"
            >
              <span>Thoát</span>
              <span className="text-lg leading-none font-bold">✕</span>
            </button>
          </div>

          {/* Ảnh toàn màn hình */}
          <div
            className="relative flex-1 flex items-center justify-center w-full max-w-5xl my-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={trangDangXem.src}
              alt={trangDangXem.alt}
              loading="lazy"
              decoding="async"
              className="max-h-[82vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Phím chuyển nhanh trang */}
          <div
            className="w-full max-w-md flex items-center justify-between gap-4 text-xs z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              disabled={trangHienTaiIndex === 0}
              onClick={() => chuyenTrang(Math.max(0, trangHienTaiIndex - 1))}
              className="px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← Trang trước
            </button>
            <span className="text-white/70 font-medium">
              {trangHienTaiIndex + 1} / {danhSachAnhPortfolio.length}
            </span>
            <button
              type="button"
              disabled={trangHienTaiIndex === danhSachAnhPortfolio.length - 1}
              onClick={() =>
                chuyenTrang(
                  Math.min(
                    danhSachAnhPortfolio.length - 1,
                    trangHienTaiIndex + 1,
                  ),
                )
              }
              className="px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Trang sau →
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
