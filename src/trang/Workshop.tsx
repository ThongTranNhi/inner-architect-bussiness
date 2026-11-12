import { useEffect, useState } from "react"
import { go, Link } from "../dieu-huong"

interface WorkshopItem {
  id: string
  tieuDe: string
  phuDe: string
  chamNgon: string
  thoiGian: string
  ngayThangText: string
  hinhThuc: string
  diaDiem: string
  nguoiDan?: string
  phi: string
  format: string[]
  giaTriNhanDuoc?: string[]
  src: string
  alt: string
}

const danhSachWorkshop: WorkshopItem[] = [
  {
    id: "khoi-dong-khong-gong",
    tieuDe: "Khởi động năm mới không gồng",
    phuDe: "Dành cho những ai đang cố gắng nhiều nhưng không cảm thấy nhẹ hơn",
    chamNgon: "Một không gian để dừng lại, soi trục và chọn nhịp sống phù hợp cho năm mới.",
    thoiGian: "14:00 – 16:30",
    ngayThangText: "Chủ Nhật, 18/10/2026",
    hinhThuc: "Offline · Nhóm nhỏ (tối đa 8 – 10 người)",
    diaDiem: "The Hermit · TP. Hồ Chí Minh",
    nguoiDan: "Khiêm Võ — Người dẫn chữa lành & soi trục (Founder Inner Architect™ System)",
    phi: "499.000đ / người",
    format: [
      "Dẫn thiền ngắn — viết soi trục",
      "Tarot phản chiếu trạng thái hiện tại",
      "Không phán đoán — không can thiệp sâu",
    ],
    giaTriNhanDuoc: [
      "Nhận diện những áp lực vô thức khiến bạn phải gồng mình",
      "Phân biệt giữa nỗ lực lành mạnh và sự gồng chịu đựng kiệt sức",
      "Chọn nhịp khởi động nhẹ, an toàn và bền vững hơn",
    ],
    src: "/assets/workshop/01-workshop-khoi-dong-nam-moi.webp",
    alt: "Poster Workshop Khởi động năm mới không gồng - Inner Architect",
  },
  {
    id: "mo-truc-nam-moi",
    tieuDe: "Mở trục năm mới — Sống đúng trước khi chạy",
    phuDe: "Dành cho những ai đang thấy mình bận rộn nhưng vẫn không đi tới đâu",
    chamNgon: "Một không gian để dừng lại, soi trục và lựa chọn có ý thức cho năm mới.",
    thoiGian: "14:00 – 16:30",
    ngayThangText: "Thứ Bảy, 17/01/2026",
    hinhThuc: "Offline · Nhóm nhỏ (tối đa 8 – 10 người)",
    diaDiem: "The Hermit · TP. Hồ Chí Minh",
    nguoiDan: "Ms. Võ Khiêm — Người dẫn chữa lành & soi trục (Founder Inner Architect™ System)",
    phi: "499.000đ / người",
    format: [
      "Viết soi trục (guided journaling)",
      "Tarot như công cụ phản chiếu",
      "Không xem bài — không chữa liền",
    ],
    giaTriNhanDuoc: [
      "Nhận diện điểm lệch trục đầu năm",
      "Hiểu trục sống cá nhân (không phải mục tiêu)",
      "Xác lập một trục sống thực tế cho quý 1",
    ],
    src: "/assets/workshop/02-workshop-mo-truc-nam-moi.webp",
    alt: "Poster Workshop Mở trục năm mới: Sống đúng trước khi chạy",
  },
]

/**
 * Trang Workshop & Trải nghiệm (`/workshop`)
 * - Trưng bày 2 workshop chính thức kèm hình ảnh poster chất lượng cao.
 * - Ngày tháng được cập nhật gần đây nhất.
 * - Hỗ trợ xem phóng to toàn màn hình kèm icon dấu X thoát nhanh.
 */
export function WorkshopPage() {
  const [anhDangPhongTo, setAnhDangPhongTo] = useState<WorkshopItem | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const xuLyNhanPhim = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAnhDangPhongTo(null)
      }
    }
    window.addEventListener("keydown", xuLyNhanPhim)
    return () => window.removeEventListener("keydown", xuLyNhanPhim)
  }, [])

  const quayVeTrangTruoc = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      go("/")
    }
  }

  return (
    <main className="cream-page workshop-page min-h-screen pb-20 select-none">
      {/* 1. Header Trang Nhã kèm Nút X Thoát */}
      <header className="max-w-[1360px] mx-auto px-6 pt-10 sm:pt-14 pb-8 border-b border-[#3B3636]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#B75E2A]" />
              <p className="text-xs font-semibold tracking-widest text-[#B75E2A] uppercase m-0">
                INNER ARCHITECT™ · WORKSHOP &amp; TRẢI NGHIỆM
              </p>
            </div>
            <h1 className="serif text-3xl sm:text-4xl lg:text-5xl text-[#27190F] m-0 font-bold tracking-tight">
              Workshop sắp diễn ra
            </h1>
            <p className="text-[#3B3636]/75 text-sm sm:text-base mt-2 max-w-2xl">
              Không gian gặp gỡ, soi chiếu và thực hành cùng nhau trong nhóm nhỏ ấm áp và an toàn.
            </p>
          </div>

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

      {/* 2. Danh Sách 2 Workshop */}
      <section className="max-w-[1360px] mx-auto px-6 py-12">
        <div className="flex flex-col gap-16 lg:gap-24">
          {danhSachWorkshop.map((ws, idx) => {
            const isDaoChieu = idx % 2 === 1
            return (
              <article
                key={ws.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 rounded-[28px] lg:rounded-[36px] bg-[#FAF7F2] border border-[#3B3636]/10 shadow-sm ${
                  isDaoChieu ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Cột Ảnh Poster Workshop */}
                <div
                  className={`lg:col-span-6 ${
                    isDaoChieu ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div
                    onClick={() => setAnhDangPhongTo(ws)}
                    className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border border-black/10 bg-black cursor-zoom-in group transition-transform duration-300 hover:scale-[1.01]"
                    title="Nhấn để phóng to toàn màn hình"
                  >
                    <img
                      src={ws.src}
                      alt={ws.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block"
                    />
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                      <span>Phóng to</span>
                      <span aria-hidden="true">⤢</span>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={() => setAnhDangPhongTo(ws)}
                      className="text-xs text-[#B75E2A] hover:underline font-semibold inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                    >
                      <span>Xem poster phóng to chi tiết</span>
                      <span aria-hidden="true">⤢</span>
                    </button>
                  </div>
                </div>

                {/* Cột Thông Tin Chi Tiết */}
                <div
                  className={`lg:col-span-6 flex flex-col gap-4 ${
                    isDaoChieu ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  {/* Badge Trạng Thái & Lịch */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-[#B75E2A] text-white text-xs font-bold tracking-wider uppercase shadow-sm">
                      Coming Soon
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/5 text-[#3B3636]/80 text-xs font-medium">
                      Đợt gần nhất: {ws.ngayThangText} · {ws.thoiGian}
                    </span>
                  </div>

                  <h2 className="serif text-2xl sm:text-3xl font-bold text-[#27190F] m-0">
                    {ws.tieuDe}
                  </h2>

                  <p className="text-sm sm:text-base text-[#3B3636]/85 italic m-0">
                    &ldquo;{ws.phuDe}&rdquo;
                  </p>

                  {/* Thông tin cốt lõi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-[#3B3636]/10 text-xs sm:text-sm">
                    <div>
                      <span className="text-[#3B3636]/60 block text-[11px] uppercase font-semibold">
                        Hình thức
                      </span>
                      <strong className="text-[#27190F] font-medium">
                        {ws.hinhThuc}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#3B3636]/60 block text-[11px] uppercase font-semibold">
                        Địa điểm
                      </span>
                      <strong className="text-[#27190F] font-medium">
                        {ws.diaDiem}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#3B3636]/60 block text-[11px] uppercase font-semibold">
                        Phí tham gia
                      </span>
                      <strong className="text-[#B75E2A] font-bold text-base">
                        {ws.phi}
                      </strong>
                    </div>
                    {ws.nguoiDan && (
                      <div>
                        <span className="text-[#3B3636]/60 block text-[11px] uppercase font-semibold">
                          Người dẫn
                        </span>
                        <strong className="text-[#27190F] font-medium text-xs">
                          {ws.nguoiDan}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Format hoạt động */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#B75E2A] m-0 mb-1.5">
                      Format trải nghiệm:
                    </h3>
                    <ul className="list-disc pl-5 m-0 space-y-1 text-xs sm:text-sm text-[#3B3636]/85">
                      {ws.format.map((item, fIdx) => (
                        <li key={fIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-[#B75E2A] italic m-0 font-medium">
                    {ws.chamNgon}
                  </p>

                  {/* Nút Đăng Ký */}
                  <div className="pt-2">
                    <Link
                      to="/lien-he"
                      style={{ backgroundColor: "#B75E2A", color: "#FFFFFF" }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full hover:!bg-[#96471B] !text-white transition-all text-sm font-semibold shadow-md group cursor-pointer"
                    >
                      <span className="!text-white" style={{ color: "#FFFFFF" }}>
                        Coming Soon — Liên hệ đăng ký đợt tới
                      </span>
                      <span
                        className="transition-transform group-hover:translate-x-1 !text-white"
                        style={{ color: "#FFFFFF" }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* 3. Chế Độ Xem Phóng To Toàn Màn Hình Có Nút X Thoát */}
      {anhDangPhongTo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chế độ xem ảnh phóng to"
          className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
          onClick={() => setAnhDangPhongTo(null)}
        >
          {/* Header với icon dấu X nổi bật */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white/90 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B75E2A]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#FEFBF0]/90">
                {anhDangPhongTo.tieuDe}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAnhDangPhongTo(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer border border-white/25 hover:scale-105 shadow-lg"
              aria-label="Thoát khỏi chế độ này và quay về trang đang xem"
              title="Đóng (Esc)"
            >
              <span>Thoát</span>
              <span className="text-lg leading-none font-bold">✕</span>
            </button>
          </div>

          {/* Khung ảnh phóng to */}
          <div
            className="relative flex-1 flex items-center justify-center w-full max-w-5xl my-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={anhDangPhongTo.src}
              alt={anhDangPhongTo.alt}
              loading="lazy"
              decoding="async"
              className="max-h-[82vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>

          <div
            className="text-xs text-white/70 text-center pb-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Nhấn nút Thoát ✕ hoặc phím Esc để quay về</span>
          </div>
        </div>
      )}

      {/* 4. Điều Hướng Cuối Trang */}
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
          to="/chuong-trinh"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B75E2A] hover:text-[#27190F] transition-colors"
        >
          <span>Xem tất cả chương trình đồng hành</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </nav>
    </main>
  )
}

