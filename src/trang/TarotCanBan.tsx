import { useEffect, useState } from "react"
import { Link } from "../dieu-huong"
import { ParentLink } from "./chung"

/** Thông tin ảnh slide trong giáo trình Canva */
interface SlideCanva {
  tieuDe: string
  chuThich: string
  src: string
  srcWebp: string
  alt: string
}

const danhSachSlideCanva: SlideCanva[] = [
  {
    tieuDe: "Khai mở Tarot — Bìa giáo trình chính thức",
    chuThich: "Khóa học nhập môn do Founder Khiêm Võ trực tiếp biên soạn và giảng dạy.",
    src: "/assets/tarot-can-ban/01-cover-khai-mo-tarot.png",
    srcWebp: "/assets/tarot-can-ban/01-cover-khai-mo-tarot.webp",
    alt: "Bìa giáo trình Khai mở Tarot - Founder Khiêm Võ",
  },
  {
    tieuDe: "Mục tiêu bài học & Khung chương trình",
    chuThich: "Lộ trình 3 chương rõ ràng từ nền tảng biểu tượng đến kỹ thuật trải bài thực chiến.",
    src: "/assets/tarot-can-ban/02-muc-tieu-bai-hoc.png",
    srcWebp: "/assets/tarot-can-ban/02-muc-tieu-bai-hoc.webp",
    alt: "Mục tiêu bài học Tarot Căn Bản",
  },
  {
    tieuDe: "Tarot là gì? Định nghĩa & Cấu trúc",
    chuThich: "Bộ công cụ 78 lá bài phản chiếu tiềm thức, khai mở trực giác và thấu hiểu nội tâm.",
    src: "/assets/tarot-can-ban/04-tarot-la-gi.png",
    srcWebp: "/assets/tarot-can-ban/04-tarot-la-gi.webp",
    alt: "Định nghĩa Tarot và cấu trúc 78 lá bài",
  },
  {
    tieuDe: "Tarot dưới góc nhìn Tâm linh & Khoa học",
    chuThich: "Tiếp cận qua các nguyên mẫu (Archetypes) của Carl Jung và ứng dụng trong trị liệu tâm lý.",
    src: "/assets/tarot-can-ban/06-tam-linh-va-khoa-hoc-jung.png",
    srcWebp: "/assets/tarot-can-ban/06-tam-linh-va-khoa-hoc-jung.webp",
    alt: "Tarot trong tâm lý học và khoa học nhận thức",
  },
  {
    tieuDe: "Bộ Ẩn Chính — 22 lá Major Arcana",
    chuThich: "Đại diện cho các bài học lớn, các chuyển biến và bước ngoặt mang tính định hình cuộc đời.",
    src: "/assets/tarot-can-ban/07-bo-an-chinh-major-arcana.png",
    srcWebp: "/assets/tarot-can-ban/07-bo-an-chinh-major-arcana.webp",
    alt: "Cấu trúc 22 lá Ẩn Chính Major Arcana",
  },
  {
    tieuDe: "Bộ Ẩn Phụ — 56 lá Minor Arcana & 4 Bộ Suits",
    chuThich: "Phản chiếu các khía cạnh đời sống qua 4 nguyên tố: Wands (Lửa), Cups (Nước), Swords (Khí), Pentacles (Đất).",
    src: "/assets/tarot-can-ban/08-bo-an-phu-minor-arcana.png",
    srcWebp: "/assets/tarot-can-ban/08-bo-an-phu-minor-arcana.webp",
    alt: "Cấu trúc 56 lá Ẩn Phụ Minor Arcana và 4 bộ Suits",
  },
]

/**
 * Trang chi tiết thiết kế mới cho khóa học Tarot Căn Bản
 * Dựa trên tài liệu và hình ảnh Canva "Khai mở TAROT - Presented by Khiêm Võ"
 */
export function TarotCanBanView() {
  const [anhDangXem, setAnhDangXem] = useState<SlideCanva | null>(null)
  const [chuongDangChon, setChuongDangChon] = useState<number>(1)
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

  // Đóng phóng to bằng phím Escape
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
    <main className="cream-page tarot-can-ban-page min-h-screen pb-24 text-[#27190F]">
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

      {/* 1. Header Trang Nhã & Tiêu Đề Khóa Học */}
      <header className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16 pb-8 border-b border-[#3B3636]/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 tarot-anim-item" style={{ animationDelay: "0.05s" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#B75E2A]" />
            <p className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium m-0">
              ACADEMY · TẦNG 3 — FOUNDATION PROGRAMME
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
          Khai Mở Tarot — Tarot Căn Bản
        </h1>
        <p
          className="tarot-anim-item serif italic text-lg sm:text-2xl text-[#B75E2A] mt-2 mb-4 font-normal"
          style={{ animationDelay: "0.26s" }}
        >
          Nhập môn Tarot dưới góc nhìn nhận thức, biểu tượng &amp; tâm lý học ứng dụng
        </p>
        <p
          className="tarot-anim-item text-sm sm:text-base text-[#3B3636]/85 max-w-3xl leading-relaxed m-0 font-light"
          style={{ animationDelay: "0.34s" }}
        >
          Học cách đọc hình ảnh, kết nối với trực giác và giữ ranh giới đạo đức vững vàng trước khi bước vào thực hành giải nghĩa. Chương trình do Founder Khiêm Võ trực tiếp biên soạn và hướng dẫn.
        </p>
      </header>

      {/* 2. Hero Banner Chính thức từ Canva với hiệu ứng 3D tilt và parallax cuộn chuột */}
      <section className="max-w-[1240px] mx-auto px-6 pt-8 pb-12 tarot-banner-anim">
        <div
          onMouseMove={xuLyMouseMovePoster}
          onMouseEnter={() => setDangHoverPoster(true)}
          onMouseLeave={xuLyMouseLeavePoster}
          onClick={() => setAnhDangXem(danhSachSlideCanva[0])}
          className="relative rounded-2xl overflow-hidden shadow-xl border border-[#3B3636]/10 bg-[#121212] group cursor-pointer transition-all duration-300"
          style={{
            transform: `perspective(1000px) rotateY(${posterTilt.x}deg) rotateX(${posterTilt.y}deg) translateY(${Math.min(cuonY * 0.04, 20)}px)`,
            boxShadow: dangHoverPoster
              ? "0 25px 50px -12px rgba(183, 94, 42, 0.25), 0 0 30px rgba(183, 94, 42, 0.12)"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
          title="Nhấn để phóng to ảnh bìa chính thức"
        >
          <picture>
            <source srcSet="/assets/tarot-can-ban/01-cover-khai-mo-tarot.webp" type="image/webp" />
            <img
              src="/assets/tarot-can-ban/01-cover-khai-mo-tarot.png"
              alt="Khai mở Tarot - Bìa giáo trình chính thức do Khiêm Võ trình bày"
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-h-[540px] object-contain mx-auto block transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </picture>
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none group-hover:bg-[#B75E2A] transition-colors">
            <span>Giáo trình chính thức · Nhấn để phóng to</span>
            <span aria-hidden="true">⤢</span>
          </div>
        </div>
      </section>

      {/* 3. Khung Thông Số & Tổng Quan Thực Hành */}
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
              Thời lượng học
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#27190F] font-semibold mt-1 block md:whitespace-nowrap">
              5 buổi chuyên sâu (20:00 – 22:00)
            </strong>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#3B3636]/60">
              Hình thức học
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#27190F] font-semibold mt-1 block md:whitespace-nowrap">
              Online tương tác trực tiếp qua Zoom
            </strong>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#3B3636]/60">
              Quy mô lớp
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#B75E2A] font-semibold mt-1 block md:whitespace-nowrap">
              Nhóm nhỏ có trợ giảng kèm sát
            </strong>
          </div>
        </div>
      </section>

      {/* 4. Triết Lý Cốt Lõi: Tarot Dưới Góc Nhìn Nhận Thức & Tâm Lý Học */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium">
              TRIẾT LÝ &amp; GÓC NHÌN TIẾP CẬN
            </span>
            <h2 className="serif text-2xl sm:text-3xl lg:text-4xl text-[#27190F] m-0 font-normal leading-tight">
              Tarot là gì dưới góc nhìn nhận thức &amp; khoa học?
            </h2>
            <p className="text-sm sm:text-base text-[#3B3636]/85 leading-relaxed m-0">
              Tại <strong>Inner Architect™</strong>, Tarot không phải là phép thuật hay bói toán đoán định số phận mang tính mê tín. Tarot được tiếp cận như một <strong>hệ thống hình ảnh biểu tượng cổ xưa gồm 78 lá</strong>, hoạt động như tấm gương phản chiếu những gì đang diễn ra trong tầng sâu tiềm thức.
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-white/80 border-l-4 border-[#B75E2A] shadow-sm">
                <strong className="text-[#27190F] text-sm block mb-1">
                  Liên kết tâm lý học Carl Jung
                </strong>
                <p className="text-xs sm:text-sm text-[#3B3636]/80 m-0 leading-relaxed font-light">
                  Các lá bài Tarot phản chiếu các <em>nguyên mẫu (Archetypes)</em> trong vô thức tập thể. Nhiều nhà trị liệu và cố vấn tâm lý hiện đại sử dụng Tarot như cầu nối an toàn giúp thân chủ tự nhận diện cảm xúc, soi tỏ xung đột nội tâm và tự tìm ra câu trả lời.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border-l-4 border-[#3B3636]/40 shadow-sm">
                <strong className="text-[#27190F] text-sm block mb-1">
                  Phá bỏ hiểu lầm về dự đoán tương lai
                </strong>
                <p className="text-xs sm:text-sm text-[#3B3636]/80 m-0 leading-relaxed font-light">
                  Tương lai không cố định. Tarot không quyết định cuộc đời bạn, mà cung cấp góc nhìn đa chiều về tình huống hiện tại để bạn đưa ra lựa chọn sáng suốt, có trách nhiệm và giữ quyền tự quyết cho chính mình.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className="rounded-2xl overflow-hidden shadow-lg border border-[#3B3636]/10 cursor-pointer group bg-white"
              onClick={() => setAnhDangXem(danhSachSlideCanva[3])}
            >
              <picture>
                <source srcSet="/assets/tarot-can-ban/06-tam-linh-va-khoa-hoc-jung.webp" type="image/webp" />
                <img
                  src="/assets/tarot-can-ban/06-tam-linh-va-khoa-hoc-jung.png"
                  alt="Tarot trong góc nhìn tâm linh và khoa học"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block transition-transform group-hover:scale-[1.02] duration-300"
                />
              </picture>
              <div className="p-3 text-center bg-white text-xs text-[#B75E2A] font-semibold">
                Xem chi tiết slide góc nhìn khoa học &amp; tâm lý ⤢
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Cấu Trúc Khung Chương Trình Học (Mục Tiêu Bài Học Vừa Đủ) */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="serif text-3xl sm:text-4xl text-[#27190F] font-normal mb-3 m-0">
            Khung giáo trình 3 chương nền tảng
          </h2>
          <p className="text-base text-[#3B3636]/80 m-0 font-light">
            Nội dung được tinh gọn và chắt lọc bài bản, giúp người học làm chủ ngôn ngữ biểu tượng mà không bị sa vào học vẹt hay mê tín.
          </p>
        </div>

        {/* 3 Thẻ Chương Học Tương Tác (Accordion mở rộng khi di chuột / chạm) */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full">
          {[
            {
              id: 1,
              tenChuong: "CHƯƠNG 01",
              tieuDe: "Làm quen & Cấu trúc bộ bài",
              moTa: "Nắm vững hệ thống 78 lá bài gồm 22 Ẩn Chính, 56 Ẩn Phụ và cách kết nối công cụ trực giác.",
              danhSach: [
                "22 Ẩn Chính: Đại diện bài học lớn & bước ngoặt cuộc đời.",
                "56 Ẩn Phụ: Phản chiếu đời sống thường nhật qua 4 Suits.",
                "Làm sạch & kết nối: Tạo thói quen tôn trọng công cụ.",
              ],
              ghiChu: "Nắm vững cấu trúc tổng quan 78 lá",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FAF0E4] via-[#F4E6D6] to-[#ECD5BE] p-2.5 shadow-sm overflow-hidden border border-[#B75E2A]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#B75E2A]">
                        Hệ thống 78 lá bài
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Rider-Waite</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Cấu Trúc Đa Tầng
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Nguyên mẫu tâm lý &amp; Đời sống thực tế
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1.5 rounded-md bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">22 Ẩn Chính (Major)</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Bài học lớn, bước ngoặt linh hồn</p>
                      </div>

                      <div className="p-1.5 rounded-md bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">56 Ẩn Phụ (Minor)</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">4 Suits phản chiếu thực tế đời thường</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Người hướng dẫn:</span>
                      <span className="font-medium text-[#B75E2A]">Khiêm Võ</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 2,
              tenChuong: "CHƯƠNG 02",
              tieuDe: "Ý nghĩa 78 lá & Tư duy tiếp cận",
              moTa: "Hành trình The Fool, 4 nguyên tố nền tảng, 16 lá Hoàng gia và chiêm nghiệm cá nhân.",
              danhSach: [
                "Hành trình The Fool: Tiến hóa tâm thức từ số 0 đến 21.",
                "4 Nguyên tố: Lửa (Ý chí), Nước (Cảm xúc), Khí (Trí tuệ), Đất (Vật chất).",
                "Học qua trực giác: Chiêm nghiệm cá nhân không máy móc.",
              ],
              ghiChu: "Hiểu bản chất từng biểu tượng",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FDF0E2] via-[#F8DECE] to-[#F3CDB6] p-2.5 shadow-sm overflow-hidden border border-[#B75E2A]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#B75E2A]">
                        4 Nguyên tố &amp; Tâm thức
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Jungian</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Hành Trình Biểu Tượng
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Từ The Fool (0) đến The World (21)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1 mb-2 text-[10px]">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#B75E2A]">Lửa · Wands</span>
                        <span className="text-[9px] text-[#3B3636]/70">Ý chí &amp; Hành động</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#2A5C8A]">Nước · Cups</span>
                        <span className="text-[9px] text-[#3B3636]/70">Cảm xúc &amp; Gắn kết</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#5B6B52]">Khí · Swords</span>
                        <span className="text-[9px] text-[#3B3636]/70">Tâm trí &amp; Khai mở</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#8A5A36]">Đất · Pentacles</span>
                        <span className="text-[9px] text-[#3B3636]/70">Vật chất &amp; Nền tảng</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Phương pháp:</span>
                      <span className="font-medium text-[#27190F]">Trực giác + Phản tư</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 3,
              tenChuong: "CHƯƠNG 03",
              tieuDe: "Kỹ thuật trải bài & Đạo đức",
              moTa: "Nghệ thuật đặt câu hỏi khai mở, các sơ đồ trải bài 1–3–5 lá và ranh giới an toàn tinh thần.",
              danhSach: [
                "Nghệ thuật đặt câu hỏi: Tập trung tháo gỡ thực tại.",
                "Trải bài 1 lá (ngày), 3 lá (thời gian), 5 lá (quan hệ).",
                "Ranh giới đạo đức: Tôn trọng quyền tự do ý chí.",
              ],
              ghiChu: "Thực hành chuẩn mực và an toàn",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#EBF2E8] via-[#E0EBDC] to-[#CFE0C9] p-2.5 shadow-sm overflow-hidden border border-[#3F4A36]/20">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#3F4A36]/10 text-[#3F4A36]">
                        Ranh Giới Đạo Đức
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">An toàn</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Sơ Đồ Trải Bài Thực Tế
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Soi chiếu tiến trình • Không áp đặt
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mb-2 text-[10px]">
                      <div className="flex-1 p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block text-[8px] text-[#3B3636]/60 uppercase">01</span>
                        <span className="font-medium text-[#27190F]">Quá khứ</span>
                      </div>
                      <span className="text-[#3B3636]/40 text-xs">→</span>
                      <div className="flex-1 p-1 rounded bg-[#3F4A36]/10 border border-[#3F4A36]/30 text-center">
                        <span className="block text-[8px] text-[#3F4A36] uppercase font-semibold">02</span>
                        <span className="font-semibold text-[#3F4A36]">Hiện tại</span>
                      </div>
                      <span className="text-[#3B3636]/40 text-xs">→</span>
                      <div className="flex-1 p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block text-[8px] text-[#3B3636]/60 uppercase">03</span>
                        <span className="font-medium text-[#27190F]">Xu hướng</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Nguyên tắc:</span>
                      <span className="font-medium text-[#3F4A36]">Trả quyền thân chủ</span>
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
                  {/* Cột Nội Dung Bài Học */}
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

                  {/* Cột Mockup Mở Rộng Trực Quan */}
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

      {/* 6. Thư Viện Hình Ảnh Trích Đoạn Từ Giáo Trình Canva */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium">
            HÌNH ẢNH GIÁO TRÌNH GỐC
          </span>
          <h2 className="serif text-2xl sm:text-3xl text-[#27190F] font-normal mt-2 mb-2">
            Trích đoạn tài liệu từ Canva
          </h2>
          <p className="text-xs sm:text-sm text-[#3B3636]/75 m-0">
            Nhấn vào bất kỳ hình ảnh nào để phóng to và xem rõ nét nội dung bài học.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <span>Phóng to xem</span>
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

      {/* 7. Khung Đạo Đức & Ranh Giới Khóa Học */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <aside className="p-6 sm:p-8 rounded-2xl bg-[#27190F] text-[#FEFBF0] shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium block mb-2">
                RANH GIỚI &amp; CAM KẾT ĐỒNG HÀNH
              </span>
              <h3 className="serif text-xl sm:text-2xl text-white font-normal mb-2 m-0">
                “Đọc bài như một hình thức soi chiếu, không phải lời tiên đoán.”
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed m-0 font-light" style={{ color: "rgba(254, 251, 240, 0.9)" }}>
                Chương trình Tarot Căn Bản tại Inner Architect™ không đào tạo bói toán số phận hay các hình thức thao túng tâm lý. Chúng tôi hướng dẫn học viên xây dựng năng lực quan sát, thấu cảm và giữ trục trung tính để hỗ trợ chính mình và người khác một cách an toàn, nhân văn.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-[#FEFBF0]">
                Tiêu chuẩn đạo đức Inner Architect™
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
            Bạn muốn tham gia khóa học Tarot Căn Bản?
          </h2>
          <p className="text-sm sm:text-base text-[#3B3636]/85 max-w-xl mx-auto mb-8 leading-relaxed font-light">
            Để đảm bảo chất lượng giảng dạy, mỗi khóa học đều được tổ chức với số lượng học viên giới hạn và có sự sàng lọc mức độ phù hợp. Vui lòng liên hệ trực tiếp với chúng tôi để nhận lịch khai giảng mới nhất, thông tin học phí và được tư vấn chi tiết.
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

