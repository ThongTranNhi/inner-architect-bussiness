import { useEffect, useState } from "react"
import { Link } from "../dieu-huong"
import { ParentLink } from "./chung"

interface SlideCanva {
  tieuDe: string
  chuThich: string
  src: string
  srcWebp: string
  alt: string
}

const danhSachSlideCanva: SlideCanva[] = [
  {
    tieuDe: "Tarot Thực Chiến — Kỹ Năng Đọc Bài Đỉnh Cao",
    chuThich: "Bìa giáo trình chính thức cho khóa đào tạo Tarot nâng cao thực chiến.",
    src: "/assets/tarot-nang-cao/slide_01.png",
    srcWebp: "/assets/tarot-nang-cao/slide_01.webp",
    alt: "Kỹ năng đọc bài đỉnh cao - Tarot Thực Chiến",
  },
  {
    tieuDe: "Mục Tiêu Bài Học & 6 Chương Nền Tảng",
    chuThich: "Lộ trình 6 chương chuyên sâu từ giải mã bài ngược đến xác định mốc thời gian.",
    src: "/assets/tarot-nang-cao/slide_02.png",
    srcWebp: "/assets/tarot-nang-cao/slide_02.webp",
    alt: "Mục tiêu bài học Tarot Nâng Cao",
  },
  {
    tieuDe: "Mục Tiêu Chương 1: Làm Chủ Mặt Tối & Bài Ngược",
    chuThich: "Hiểu bản chất khi nào áp dụng bài ngược và cách phân tích 2 chiều.",
    src: "/assets/tarot-nang-cao/slide_04.png",
    srcWebp: "/assets/tarot-nang-cao/slide_04.webp",
    alt: "Mục tiêu chương 1 - Ý nghĩa lá bài ngược",
  },
  {
    tieuDe: "5 Trường Phái Giải Thích Lá Bài Ngược",
    chuThich: "Năng lượng trì hoãn, nội tâm hóa, mặt tối tiềm thức và bài học chưa hoàn tất.",
    src: "/assets/tarot-nang-cao/slide_06.png",
    srcWebp: "/assets/tarot-nang-cao/slide_06.webp",
    alt: "Các trường phái giải thích lá bài ngược",
  },
]

/**
 * Trang chi tiết thiết kế mới cho khóa học Tarot Nâng Cao
 * Dựa trên tài liệu và hình ảnh Canva "Tarot Thực Chiến - Kỹ Năng Đọc Bài Đỉnh Cao"
 */
export function TarotNangCaoView() {
  const [anhDangXem, setAnhDangXem] = useState<SlideCanva | null>(null)
  const [chuongDangChon, setChuongDangChon] = useState<number>(1)
  const [chuongDangChonNhom2, setChuongDangChonNhom2] = useState<number>(4)
  const [cuonY, setCuonY] = useState(0)
  const [posterTilt, setPosterTilt] = useState({ x: 0, y: 0 })
  const [dangHoverPoster, setDangHoverPoster] = useState(false)

  // Cuộn lên đầu trang khi mở
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Theo dõi vị trí cuộn chuột cho hiệu ứng thị sai parallax
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setCuonY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const xuLyPhim = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAnhDangXem(null)
      }
    }
    window.addEventListener("keydown", xuLyPhim)
    return () => window.removeEventListener("keydown", xuLyPhim)
  }, [])

  const xuLyMouseMovePoster = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setPosterTilt({ x: x * 10, y: -y * 10 })
  }

  const xuLyMouseLeavePoster = () => {
    setPosterTilt({ x: 0, y: 0 })
    setDangHoverPoster(false)
  }

  return (
    <main className="cream-page tarot-nang-cao-page min-h-screen pb-24 text-[#27190F]">
      {/* Khối CSS hiệu ứng animation và cuộn chuột */}
      <style>{`
        @keyframes heroFadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroFadeInScale {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes mouseScrollDot {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
          }
          80% {
            opacity: 0;
            transform: translateY(7px);
          }
          100% {
            opacity: 0;
            transform: translateY(7px);
          }
        }
        .tarot-anim-item {
          animation: heroFadeInUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .tarot-banner-anim {
          animation: heroFadeInScale 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }
        .mouse-dot-anim {
          animation: mouseScrollDot 1.8s infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .tarot-anim-item, .tarot-banner-anim, .mouse-dot-anim {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* 1. Header & Điều Hướng */}
      <header className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16 pb-8 border-b border-[#3B3636]/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 tarot-anim-item" style={{ animationDelay: "0.05s" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#B75E2A]" />
            <p className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium m-0">
              ACADEMY · TẦNG 3 — ADVANCED PRACTITIONER
            </p>
          </div>
          <div className="tarot-anim-item" style={{ animationDelay: "0.1s" }}>
            <Link
              to="/chuong-trinh"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#3B3636]/15 text-xs font-semibold text-[#27190F] hover:text-white hover:bg-[#B75E2A] hover:border-[#B75E2A] shadow-xs hover:shadow-md transition-all duration-200"
            >
              <span className="text-[#B75E2A] group-hover:text-white font-bold transition-transform group-hover:-translate-x-1">
                ←
              </span>
              <span>Tất cả chương trình</span>
            </Link>
          </div>
        </div>

        <h1
          className="tarot-anim-item serif text-3xl sm:text-5xl lg:text-6xl text-[#27190F] m-0 font-normal tracking-tight"
          style={{ animationDelay: "0.18s" }}
        >
          Tarot Nâng Cao — Kỹ Năng Đọc Bài Đỉnh Cao
        </h1>
        <p
          className="tarot-anim-item serif italic text-lg sm:text-2xl text-[#B75E2A] mt-2 mb-4 font-normal"
          style={{ animationDelay: "0.26s" }}
        >
          Thao trường nhận thức thực chiến: Làm chủ bài ngược, cấu trúc đa tầng &amp; xác định dòng thời gian
        </p>
        <p
          className="tarot-anim-item text-sm sm:text-base text-[#3B3636]/85 max-w-3xl leading-relaxed m-0 font-light"
          style={{ animationDelay: "0.34s" }}
        >
          Chương trình đào tạo nâng cao dành cho người đã có nền tảng cơ bản, muốn phát triển năng lực đọc bài chiều sâu, giải mã các trải bài phức tạp và ứng dụng Tarot chuyên nghiệp.
        </p>
      </header>

      {/* 2. Banner Giáo Trình Chính Thức Từ Canva với hiệu ứng 3D tilt và parallax cuộn chuột */}
      <section className="max-w-[1240px] mx-auto px-6 pt-8 pb-12 tarot-banner-anim">
        <div
          onMouseMove={xuLyMouseMovePoster}
          onMouseEnter={() => setDangHoverPoster(true)}
          onMouseLeave={xuLyMouseLeavePoster}
          onClick={() => setAnhDangXem(danhSachSlideCanva[0])}
          className="relative rounded-2xl overflow-hidden shadow-xl border border-[#3B3636]/10 bg-[#0d090a] group cursor-pointer transition-all duration-300"
          style={{
            transform: `perspective(1000px) rotateY(${posterTilt.x}deg) rotateX(${posterTilt.y}deg) translateY(${Math.min(cuonY * 0.04, 20)}px)`,
            boxShadow: dangHoverPoster
              ? "0 25px 50px -12px rgba(183, 94, 42, 0.25), 0 0 30px rgba(183, 94, 42, 0.12)"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
          title="Nhấn để phóng to ảnh bìa chính thức"
        >
          <picture>
            <source srcSet="/assets/tarot-nang-cao/slide_01.webp" type="image/webp" />
            <img
              src="/assets/tarot-nang-cao/slide_01.png"
              alt="Tarot Thực Chiến - Kỹ Năng Đọc Bài Đỉnh Cao"
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-h-[520px] object-contain mx-auto block transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </picture>
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none group-hover:bg-[#B75E2A] transition-colors">
            <span>Giáo trình chính thức · Nhấn để phóng to</span>
            <span aria-hidden="true">⤢</span>
          </div>
        </div>
      </section>

      {/* 3. Khung Thông Số Khóa Học */}
      <section id="noi-dung-khoa-hoc" className="max-w-[1240px] mx-auto px-6 pb-14 scroll-mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-white/70 border border-[#3B3636]/10 shadow-sm">
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#3B3636]/60">
              Người hướng dẫn
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#27190F] font-semibold mt-1 block md:whitespace-nowrap">
              Khiêm Võ (Founder)
            </strong>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#3B3636]/60">
              Thời lượng đào tạo
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#27190F] font-semibold mt-1 block md:whitespace-nowrap">
              6 buổi chuyên sâu (20:00 – 22:00)
            </strong>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#3B3636]/60">
              Hình thức học
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#27190F] font-semibold mt-1 block md:whitespace-nowrap">
              Online chuyên đề &amp; giải case thực tế
            </strong>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#3B3636]/60">
              Điều kiện tham gia
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#B75E2A] font-semibold mt-1 block md:whitespace-nowrap">
              Đã qua Căn Bản hoặc có nền tảng
            </strong>
          </div>
        </div>
      </section>

      {/* 4. Triết Lý Tiếp Cận: Làm Chủ Mặt Tối & Phân Tích 2 Chiều */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium">
              TIÊU ĐIỂM CHUYÊN SÂU
            </span>
            <h2 className="serif text-2xl sm:text-3xl lg:text-4xl text-[#27190F] m-0 font-normal leading-tight">
              Lá bài ngược &amp; 5 trường phái phân tích 2 chiều
            </h2>
            <p className="text-sm sm:text-base text-[#3B3636]/85 leading-relaxed m-0 font-light">
              Trong Tarot thực chiến, lá bài ngược không đồng nghĩa với điều xui xẻo. Đó là <strong>chỉ báo năng lượng bị nghẽn, sự trì hoãn, hoặc một trạng thái nội tâm hóa</strong> cần được soi chiếu kỹ lưỡng.
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-white/80 border-l-4 border-[#B75E2A] shadow-sm">
                <strong className="text-[#27190F] text-sm block mb-1">
                  5 Trường phái giải thích bài ngược
                </strong>
                <p className="text-xs sm:text-sm text-[#3B3636]/80 m-0 leading-relaxed font-light">
                  (1) Năng lượng trì hoãn/chặn lại; (2) Trạng thái nội tâm hóa; (3) Mặt tối bộc lộ; (4) Ý nghĩa nghịch hoàn toàn; (5) Bài học cuộc đời chưa hoàn tất.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border-l-4 border-[#3B3636]/40 shadow-sm">
                <strong className="text-[#27190F] text-sm block mb-1">
                  Kỹ thuật xác định thời gian (Timing in Tarot)
                </strong>
                <p className="text-xs sm:text-sm text-[#3B3636]/80 m-0 leading-relaxed font-light">
                  Làm chủ phương pháp định vị mốc thời gian diễn biến sự kiện dựa trên chu kỳ nguyên tố (Lửa/Nước/Khí/Đất), liên kết hoàng đạo và số học ứng dụng.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className="rounded-2xl overflow-hidden shadow-lg border border-[#3B3636]/10 cursor-pointer group bg-[#0d090a]"
              onClick={() => setAnhDangXem(danhSachSlideCanva[3])}
            >
              <picture>
                <source srcSet="/assets/tarot-nang-cao/slide_06.webp" type="image/webp" />
                <img
                  src="/assets/tarot-nang-cao/slide_06.png"
                  alt="5 Trường phái giải thích lá bài ngược"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block transition-transform group-hover:scale-[1.02] duration-300"
                />
              </picture>
              <div className="p-3 text-center bg-white text-xs text-[#B75E2A] font-semibold">
                Xem chi tiết slide trường phái bài ngược ⤢
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Khung 6 Chương Giáo Trình Thực Chiến */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="serif text-3xl sm:text-4xl text-[#27190F] font-normal mb-3 m-0">
            Khung giáo trình 6 chương thực chiến
          </h2>
          <p className="text-base text-[#3B3636]/80 m-0 font-light">
            Trang bị bộ công cụ phân tích đa tầng, giải mã ca thực tế phức tạp và rèn luyện bản lĩnh reader.
          </p>
        </div>

        {/* Nhóm 1: Chương 01 - 03 (Thẻ Mở Rộng Tương Tác) */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full mb-5">
          {[
            {
              id: 1,
              tenChuong: "CHƯƠNG 01",
              tieuDe: "Ý nghĩa lá ngược — Làm chủ mặt tối",
              moTa: "Nắm bản chất khi nào áp dụng bài ngược, 5 trường phái giải nghĩa và phân tích 2 chiều.",
              danhSach: [
                "5 Trường phái: Chặn nghẽn, nội tâm hóa & bài học tiềm thức.",
                "Tránh suy diễn tiêu cực: Bài ngược là chỉ báo điều chỉnh.",
                "Nguyên tắc 2 chiều: Đặt lá ngược trong bối cảnh toàn cảnh.",
              ],
              ghiChu: "Bản lĩnh đối diện năng lượng nghẽn",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FAF0E4] via-[#F4E6D6] to-[#ECD5BE] p-2.5 shadow-sm overflow-hidden border border-[#B75E2A]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#B75E2A]">
                        5 Trường phái
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Reversed</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Giải Mã Chiều Ngược
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Không quy kết xấu • Soi năng lượng nghẽn
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1.5 rounded-md bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Nội tâm hóa (Internalized)</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Năng lượng hướng vào chiều sâu nội tâm</p>
                      </div>

                      <div className="p-1.5 rounded-md bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Trì hoãn (Delayed)</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Tiến trình tắc nghẽn cần tháo gỡ thực tế</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Phương châm:</span>
                      <span className="font-medium text-[#B75E2A]">Chuyển hóa thay vì phán xét</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 2,
              tenChuong: "CHƯƠNG 02",
              tieuDe: "Ẩn phụ ngược chuyên sâu",
              moTa: "Giải mã chi tiết trạng thái nghẽn của 4 bộ Suits: Gậy (ý chí), Cốc (tình cảm), Kiếm (tâm trí) và Xu (tài chính).",
              danhSach: [
                "Gậy ngược: Hao tổn ý chí, bốc đồng hay cạn kiệt.",
                "Cốc ngược: Đè nén cảm xúc, lệ thuộc tổn thương.",
                "Kiếm & Xu ngược: Xung đột tâm trí & bất an tài chính.",
              ],
              ghiChu: "Thấu suốt 56 lá Ẩn Phụ 2 chiều",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FDF0E2] via-[#F8DECE] to-[#F3CDB6] p-2.5 shadow-sm overflow-hidden border border-[#B75E2A]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#B75E2A]">
                        4 Dòng năng lượng
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">56 Ẩn Phụ</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Trạng Thái Nghẽn 4 Suits
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Nhận diện nút thắt hành vi đời thường
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1 mb-2 text-[10px]">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#B75E2A]">Gậy ngược</span>
                        <span className="text-[9px] text-[#3B3636]/70">Hao tổn ý chí</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#2A5C8A]">Cốc ngược</span>
                        <span className="text-[9px] text-[#3B3636]/70">Nghẽn cảm xúc</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#5B6B52]">Kiếm ngược</span>
                        <span className="text-[9px] text-[#3B3636]/70">Bẫy suy nghĩ</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#8A5A36]">Xu ngược</span>
                        <span className="text-[9px] text-[#3B3636]/70">Bất an tài chính</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Tiếp cận:</span>
                      <span className="font-medium text-[#27190F]">Định vị gốc rễ</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 3,
              tenChuong: "CHƯƠNG 03",
              tieuDe: "Các kiểu trải bài nâng cao",
              moTa: "Làm chủ Celtic Cross kinh điển, sơ đồ phân nhánh quyết định và kỹ thuật kết nối câu chuyện đa tầng.",
              danhSach: [
                "Celtic Cross 10 lá: Phân tích gốc rễ tâm lý & xu hướng.",
                "Sơ đồ 2 ngã rẽ: Đặt lên bàn cân lựa chọn tự quyết.",
                "Kỹ thuật kết nối: Đọc câu chuyện liên hoàn xuyên suốt.",
              ],
              ghiChu: "Đọc liên kết mạch lạc, không rời rạc",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#EAE8E3] via-[#E2DFD8] to-[#D5D0C6] p-2.5 shadow-sm overflow-hidden border border-[#4A453E]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#4A453E]/10 text-[#4A453E]">
                        Celtic Cross 10 lá
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Cấu trúc</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Sơ Đồ Đa Tầng Cổ Điển
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Trọng tâm • Tiềm thức • Xu hướng
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Trọng tâm &amp; Thách thức</span>
                        <span className="text-[10px] text-[#3B3636]/70">Lá 1 &amp; Lá 2 tại tâm điểm</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Trục Tiềm thức ↔ Ý thức</span>
                        <span className="text-[10px] text-[#3B3636]/70">Bóc tách động lực ngầm bên dưới</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Kỹ thuật:</span>
                      <span className="font-medium text-[#4A453E]">Mạch truyện xuyên suốt</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ].map((item) => {
            const isExpanded = chuongDangChon === item.id

            return (
              <div
                key={item.id}
                onMouseEnter={() => setChuongDangChon(item.id)}
                onClick={() => setChuongDangChon(item.id)}
                className={`relative rounded-[22px] border cursor-pointer select-none overflow-hidden p-5 sm:p-5.5 how-card-transition ${
                  isExpanded
                    ? "lg:flex-[2.6] bg-white border-[#B75E2A]/35 shadow-md ring-1 ring-[#B75E2A]/10"
                    : "lg:flex-[1] bg-white/75 hover:bg-white border-[#3B3636]/12 shadow-sm"
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full h-full gap-4">
                  <div className="flex flex-col justify-between h-full flex-1 text-left min-w-0">
                    <div>
                      <div className="mb-2">
                        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-[#B75E2A]/10 text-[#B75E2A]">
                          {item.tenChuong}
                        </span>
                      </div>

                      <h3 className="serif text-lg sm:text-xl text-[#27190F] font-normal mb-1.5 m-0">
                        {item.tieuDe}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-[#3B3636]/80 m-0 font-light leading-relaxed mb-2.5">
                        {item.moTa}
                      </p>

                      <ul className="list-disc pl-4 space-y-1 text-xs text-[#3B3636]/85 m-0 font-light leading-relaxed">
                        {item.danhSach.map((ds, dsIdx) => (
                          <li key={dsIdx}>{ds}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#3B3636]/10 text-xs text-[#B75E2A] font-medium flex items-center justify-between">
                      <span>{item.ghiChu}</span>
                      {!isExpanded && (
                        <span className="text-[11px] text-[#3B3636]/50 lg:hidden">
                          Chạm để xem →
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`shrink-0 mockup-reveal-transition ${
                      isExpanded
                        ? "w-full lg:w-[240px] xl:w-[260px] opacity-100 translate-x-0 block mt-3 lg:mt-0 lg:ml-2"
                        : "w-0 opacity-0 translate-x-8 pointer-events-none hidden lg:block overflow-hidden ml-0"
                    }`}
                  >
                    <div className="w-full lg:w-[240px] xl:w-[260px]">
                      {item.renderMockup()}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Nhóm 2: Chương 04 - 06 (Thẻ Mở Rộng Tương Tác) */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full">
          {[
            {
              id: 4,
              tenChuong: "CHƯƠNG 04",
              tieuDe: "Đọc thời gian xảy ra (Timing)",
              moTa: "Phương pháp xác định mốc thời gian, chu kỳ phát triển của vấn đề và nhịp độ chuyển hóa theo nguyên tố.",
              danhSach: [
                "4 Nguyên tố: Lửa (ngày), Khí (tuần), Nước (tháng), Đất (năm).",
                "Số học biểu tượng: Chu kỳ chuyển hóa & cột mốc quan trọng.",
                "Nguyên tắc thời gian mở: Nhịp độ theo hành động thân chủ.",
              ],
              ghiChu: "Nhận diện nhịp điệu của sự việc",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FAF3E4] via-[#F6E9CF] to-[#EDDCB5] p-2.5 shadow-sm overflow-hidden border border-[#9E6725]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#9E6725]/10 text-[#9E6725]">
                        Hệ thống Timing
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Chu kỳ</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Xác Định Nhịp Động
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Nguyên tố • Số học • Mốc chuyển hóa
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1 mb-2 text-[10px]">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#B75E2A]">Lửa · Wands</span>
                        <span className="text-[9px] text-[#3B3636]/70">Mau lẹ (Ngày)</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#5B6B52]">Khí · Swords</span>
                        <span className="text-[9px] text-[#3B3636]/70">Tốc độ (Tuần)</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#2A5C8A]">Nước · Cups</span>
                        <span className="text-[9px] text-[#3B3636]/70">Biến thiên (Tháng)</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#8A5A36]">Đất · Pentacles</span>
                        <span className="text-[9px] text-[#3B3636]/70">Bền bỉ (Năm)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Quy tắc vàng:</span>
                      <span className="font-medium text-[#9E6725]">Thời gian mở theo hành động</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 5,
              tenChuong: "CHƯƠNG 05",
              tieuDe: "Phân tích tổng hợp trải bài lớn",
              moTa: "Giải mã ca thực tế phức tạp, xử lý mâu thuẫn giữa các lá bài và đưa ra kế hoạch hành động cụ thể.",
              danhSach: [
                "Xử lý xung đột biểu tượng: Diễn giải thông điệp đối lập.",
                "Tỷ lệ nguyên tố: Nhận diện năng lượng chi phối toàn cảnh.",
                "Khuyến nghị thực hành: Chuyển hóa insight thành hành động.",
              ],
              ghiChu: "Rèn luyện năng lực thực chiến",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#F7ECE8] via-[#EEDAD2] to-[#E3C5B8] p-2.5 shadow-sm overflow-hidden border border-[#8A3D1E]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#8A3D1E]/10 text-[#8A3D1E]">
                        Tổng hợp Case Study
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Thực chiến</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Xử Lý Ca Phức Tạp
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Hòa giải nghịch lý • Đúc kết giải pháp
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Môi trường nguyên tố</span>
                        <span className="text-[10px] text-[#3B3636]/70">Soi năng lượng lấn át &amp; thiếu hụt</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Hợp nhất thông điệp</span>
                        <span className="text-[10px] text-[#3B3636]/70">Tháo gỡ mâu thuẫn Ẩn Chính &amp; Ẩn Phụ</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Đích đến:</span>
                      <span className="font-medium text-[#8A3D1E]">Hành động sáng rõ</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 6,
              tenChuong: "CHƯƠNG 06",
              tieuDe: "Tổng kết, đạo đức & ranh giới",
              moTa: "Xây dựng bản lĩnh nghề nghiệp, ranh giới an toàn tinh thần và giữ trục trung tính khi đối thoại cùng thân chủ.",
              danhSach: [
                "Giữ trục trung tính: Không áp đặt phán xét cá nhân.",
                "Ranh giới can thiệp: Tôn trọng giới hạn chuyên môn.",
                "Bảo mật trọn vẹn: Tôn trọng quyền tự quyết thân chủ.",
              ],
              ghiChu: "Đạo nghề vững vàng, bền vững",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#EBF0E9] via-[#E1E9DD] to-[#CFDDCA] p-2.5 shadow-sm overflow-hidden border border-[#3F4A36]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#3F4A36]/10 text-[#3F4A36]">
                        Đạo nghề Reader
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Bản lĩnh</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Ranh Giới An Toàn
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Trung tính • Bảo mật • Tôn trọng
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Giữ trục trung tính</span>
                        <span className="text-[10px] text-[#3B3636]/70">Không áp đặt số phận, không phán xét</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Ranh giới can thiệp &amp; Bảo mật</span>
                        <span className="text-[10px] text-[#3B3636]/70">Tôn trọng quyền tự do ý chí</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Kim chỉ nam:</span>
                      <span className="font-medium text-[#3F4A36]">Chuẩn mực &amp; an toàn</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ].map((item) => {
            const isExpanded = chuongDangChonNhom2 === item.id

            return (
              <div
                key={item.id}
                onMouseEnter={() => setChuongDangChonNhom2(item.id)}
                onClick={() => setChuongDangChonNhom2(item.id)}
                className={`relative rounded-[22px] border cursor-pointer select-none overflow-hidden p-5 sm:p-5.5 how-card-transition ${
                  isExpanded
                    ? "lg:flex-[2.6] bg-white border-[#B75E2A]/35 shadow-md ring-1 ring-[#B75E2A]/10"
                    : "lg:flex-[1] bg-white/75 hover:bg-white border-[#3B3636]/12 shadow-sm"
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full h-full gap-4">
                  <div className="flex flex-col justify-between h-full flex-1 text-left min-w-0">
                    <div>
                      <div className="mb-2">
                        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-[#B75E2A]/10 text-[#B75E2A]">
                          {item.tenChuong}
                        </span>
                      </div>

                      <h3 className="serif text-lg sm:text-xl text-[#27190F] font-normal mb-1.5 m-0">
                        {item.tieuDe}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-[#3B3636]/80 m-0 font-light leading-relaxed mb-2.5">
                        {item.moTa}
                      </p>

                      <ul className="list-disc pl-4 space-y-1 text-xs text-[#3B3636]/85 m-0 font-light leading-relaxed">
                        {item.danhSach.map((ds, dsIdx) => (
                          <li key={dsIdx}>{ds}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#3B3636]/10 text-xs text-[#B75E2A] font-medium flex items-center justify-between">
                      <span>{item.ghiChu}</span>
                      {!isExpanded && (
                        <span className="text-[11px] text-[#3B3636]/50 lg:hidden">
                          Chạm để xem →
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`shrink-0 mockup-reveal-transition ${
                      isExpanded
                        ? "w-full lg:w-[240px] xl:w-[260px] opacity-100 translate-x-0 block mt-3 lg:mt-0 lg:ml-2"
                        : "w-0 opacity-0 translate-x-8 pointer-events-none hidden lg:block overflow-hidden ml-0"
                    }`}
                  >
                    <div className="w-full lg:w-[240px] xl:w-[260px]">
                      {item.renderMockup()}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 6. Thư Viện Slide Trích Đoạn Có Lightbox */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium">
            HÌNH ẢNH TÀI LIỆU GỐC
          </span>
          <h2 className="serif text-2xl sm:text-3xl text-[#27190F] font-normal mt-2 mb-2">
            Trích đoạn giáo trình Canva
          </h2>
          <p className="text-xs sm:text-sm text-[#3B3636]/75 m-0 font-light">
            Nhấn vào hình ảnh để phóng to và xem rõ nét nội dung bài học.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {danhSachSlideCanva.map((slide, idx) => (
            <article
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#3B3636]/10 cursor-pointer hover:shadow-md transition-shadow group flex flex-col justify-between"
              onClick={() => setAnhDangXem(slide)}
            >
              <div className="relative overflow-hidden bg-[#121212]/5 aspect-[16/9] flex items-center justify-center">
                <picture>
                  <source srcSet={slide.srcWebp} type="image/webp" />
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                  <span>Phóng to</span>
                  <span aria-hidden="true">⤢</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="serif text-base font-normal text-[#27190F] m-0 mb-1 group-hover:text-[#B75E2A] transition-colors">
                  {slide.tieuDe}
                </h3>
                <p className="text-xs text-[#3B3636]/75 m-0 line-clamp-2">
                  {slide.chuThich}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Khung Đạo Đức & Ranh Giới */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <aside className="p-6 sm:p-8 rounded-2xl bg-[#27190F] text-[#FEFBF0] shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium block mb-2">
                CAM KẾT ĐẠO ĐỨC &amp; NGUYÊN TẮC HÀNH NGHỀ
              </span>
              <h3 className="serif text-xl sm:text-2xl text-white font-normal mb-2 m-0">
                “Càng đi sâu vào biểu tượng, càng phải tỉnh táo với thực tại.”
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed m-0 font-light" style={{ color: "rgba(254, 251, 240, 0.9)" }}>
                Khóa học nghiêm cấm việc dùng kỹ thuật nâng cao để thao túng tâm lý hay hù dọa thân chủ. Học viên được rèn luyện để trở thành người dẫn đường trung thực, bình tĩnh và tôn trọng tối đa quyền tự quyết của người đối thoại.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-[#FEFBF0]">
                Tiêu chuẩn Tarot Thực Chiến
              </span>
            </div>
          </div>
        </aside>
      </section>

      {/* 8. KHUNG KÊU GỌI HÀNH ĐỘNG (CTA) — ĐÚNG YÊU CẦU: "KHI MUỐN HỌC PHẢI LIÊN HỆ" */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#3B3636]/15 shadow-md text-center max-w-3xl mx-auto">
          <span className="w-3 h-3 rounded-full bg-[#B75E2A] inline-block mb-3" />
          <h2 className="serif text-2xl sm:text-4xl text-[#27190F] font-normal mb-3 m-0">
            Bạn muốn tham gia khóa học Tarot Nâng Cao?
          </h2>
          <p className="text-sm sm:text-base text-[#3B3636]/85 max-w-xl mx-auto mb-8 leading-relaxed font-light">
            Khóa học yêu cầu học viên đã hoàn thành khóa Căn bản hoặc có kiến thức nền tảng tương đương. Vui lòng liên hệ trực tiếp với chúng tôi để kiểm tra mức độ phù hợp, nhận lịch khai giảng và thông tin học phí chi tiết.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/lien-he"
              style={{ backgroundColor: "#B75E2A", color: "#FFFFFF" }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full hover:!bg-[#96471B] !text-white text-sm sm:text-base font-semibold shadow-md transition-all cursor-pointer group"
            >
              <span className="!text-white" style={{ color: "#FFFFFF" }}>
                Liên hệ tư vấn &amp; đăng ký khóa học
              </span>
              <span
                className="transition-transform group-hover:translate-x-1 !text-white"
                style={{ color: "#FFFFFF" }}
                aria-hidden="true"
              >
                →
              </span>
            </Link>

            <Link
              to="/chuong-trinh"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[#3B3636]/20 bg-transparent text-[#27190F] hover:bg-[#27190F]/5 text-sm font-semibold transition-colors"
            >
              <span>← Xem các chương trình khác</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Lightbox Phóng To Ảnh Slide Canva Khi Nhấn */}
      {anhDangXem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem slide phóng to"
          className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
          onClick={() => setAnhDangXem(null)}
        >
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white/90 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B75E2A]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#FEFBF0]/90">
                {anhDangXem.tieuDe}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAnhDangXem(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer border border-white/25 hover:scale-105 shadow-lg"
              aria-label="Thoát chế độ phóng to"
              title="Đóng (Esc)"
            >
              <span>Thoát</span>
              <span className="text-lg leading-none font-bold">✕</span>
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center w-full max-w-5xl my-2"
            onClick={(e) => e.stopPropagation()}
          >
            <picture>
              <source srcSet={anhDangXem.srcWebp} type="image/webp" />
              <img
                src={anhDangXem.src}
                alt={anhDangXem.alt}
                loading="lazy"
                decoding="async"
                className="max-h-[82vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </picture>
          </div>

          <div
            className="text-xs text-white/70 text-center pb-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{anhDangXem.chuThich} · Nhấn Thoát ✕ hoặc phím Esc để quay lại</span>
          </div>
        </div>
      )}

      {/* 10. Điều Hướng Cuối Trang */}
      <ParentLink to="/chuong-trinh" label="Tất cả chương trình" />
    </main>
  )
}

