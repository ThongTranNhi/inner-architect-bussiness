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
    tieuDe: "Tarot Healer — Professional Training Program",
    chuThich: "Khóa đào tạo chuyên nghiệp: Soi cấu trúc – Giữ trục – Chữa lành không lệ thuộc.",
    src: "/assets/tarot-healer/slide_01.png",
    srcWebp: "/assets/tarot-healer/slide_01.webp",
    alt: "Tarot Healer - Presented by Ms. Tĩnh Khiêm",
  },
  {
    tieuDe: "4 Mục Tiêu Đào Tạo (Lesson Targets)",
    chuThich: "Nhận thức đúng, đọc theo cấu trúc chữa lành, giữ trục ranh giới và xây dựng phong cách hành nghề bền vững.",
    src: "/assets/tarot-healer/slide_02.png",
    srcWebp: "/assets/tarot-healer/slide_02.webp",
    alt: "Lesson Targets - Tarot Healer Training",
  },
  {
    tieuDe: "Khung 5 Modules Đào Tạo Chuyên Nghiệp",
    chuThich: "Từ Trục & Đạo nghề đến Ngôn ngữ biểu tượng, Gỡ mô thức và Thực hành tích hợp.",
    src: "/assets/tarot-healer/slide_03.png",
    srcWebp: "/assets/tarot-healer/slide_03.webp",
    alt: "Danh mục bài học Tarot Healer",
  },
  {
    tieuDe: "Module 1: Trục & Đạo Nghề",
    chuThich: "Tarot không làm bạn trở thành healer. Giữ trục mới làm được điều đó.",
    src: "/assets/tarot-healer/slide_04.png",
    srcWebp: "/assets/tarot-healer/slide_04.webp",
    alt: "Module 1 - Trục và Đạo nghề",
  },
]

/**
 * Trang chi tiết thiết kế mới cho chương trình đào tạo Tarot Healer
 * Dựa trên tài liệu và hình ảnh Canva "TAROT HEALER - Presented by Ms. Tĩnh Khiêm"
 */
export function TarotHealerView() {
  const [anhDangXem, setAnhDangXem] = useState<SlideCanva | null>(null)
  const [moduleDangChonRow1, setModuleDangChonRow1] = useState<number>(1)
  const [moduleDangChonRow2, setModuleDangChonRow2] = useState<number>(4)
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
    <main className="cream-page tarot-healer-page min-h-screen pb-24 text-[#27190F]">
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
              ACADEMY · TẦNG 3 — PROFESSIONAL HEALER TRAINING
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
          TAROT HEALER — Khóa Đào Tạo Chuyên Nghiệp
        </h1>
        <p
          className="tarot-anim-item serif italic text-lg sm:text-2xl text-[#B75E2A] mt-2 mb-4 font-normal"
          style={{ animationDelay: "0.26s" }}
        >
          “Soi cấu trúc – Giữ trục – Chữa lành không lệ thuộc”
        </p>
        <p
          className="tarot-anim-item text-sm sm:text-base text-[#3B3636]/85 max-w-3xl leading-relaxed m-0 font-light"
          style={{ animationDelay: "0.34s" }}
        >
          Chương trình đào tạo chuyên sâu hướng dẫn người thực hành cách sử dụng Tarot như một công cụ trị liệu tâm lý, giữ vững đạo nghề và ranh giới an toàn, giúp thân chủ tự đứng trên đôi chân của mình.
        </p>
      </header>

      {/* 2. Banner Giáo Trình Chính Thức Từ Canva với hiệu ứng 3D tilt và parallax cuộn chuột */}
      <section className="max-w-[1240px] mx-auto px-6 pt-8 pb-12 tarot-banner-anim">
        <div
          onMouseMove={xuLyMouseMovePoster}
          onMouseEnter={() => setDangHoverPoster(true)}
          onMouseLeave={xuLyMouseLeavePoster}
          onClick={() => setAnhDangXem(danhSachSlideCanva[0])}
          className="relative rounded-2xl overflow-hidden shadow-xl border border-[#3B3636]/10 bg-[#251912] group cursor-pointer transition-all duration-300"
          style={{
            transform: `perspective(1000px) rotateY(${posterTilt.x}deg) rotateX(${posterTilt.y}deg) translateY(${Math.min(cuonY * 0.04, 20)}px)`,
            boxShadow: dangHoverPoster
              ? "0 25px 50px -12px rgba(183, 94, 42, 0.25), 0 0 30px rgba(183, 94, 42, 0.12)"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
          title="Nhấn để phóng to ảnh bìa chính thức"
        >
          <picture>
            <source srcSet="/assets/tarot-healer/slide_01.webp" type="image/webp" />
            <img
              src="/assets/tarot-healer/slide_01.png"
              alt="Tarot Healer Professional Training Program - Presented by Ms. Tĩnh Khiêm"
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
              Mục tiêu chương trình
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#27190F] font-semibold mt-1 block md:whitespace-nowrap">
              Đào tạo Healer hành nghề chuẩn mực
            </strong>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#3B3636]/60">
              Hình thức học
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#27190F] font-semibold mt-1 block md:whitespace-nowrap">
              Zoom tương tác &amp; thực hành giám sát
            </strong>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#3B3636]/60">
              Điều kiện tuyển sinh
            </span>
            <strong className="text-xs sm:text-[13px] lg:text-sm text-[#B75E2A] font-semibold mt-1 block md:whitespace-nowrap">
              Phỏng vấn đầu vào định hướng đạo đức
            </strong>
          </div>
        </div>
      </section>

      {/* 4. Triết Lý Đạo Nghề: Tarot Healer Là Ai & Không Phải Là Ai? */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="eyebrow text-[#B75E2A] uppercase tracking-[0.12em] font-medium">
              TRIẾT LÝ &amp; ĐẠO NGHỀ CỐT LÕI
            </span>
            <h2 className="serif text-2xl sm:text-3xl lg:text-4xl text-[#27190F] m-0 font-normal leading-tight">
              “Tarot không làm bạn trở thành healer. Giữ trục mới làm được điều đó.”
            </h2>
            <p className="text-sm sm:text-base text-[#3B3636]/85 leading-relaxed m-0 font-light">
              Tại Inner Architect™, chúng tôi phân định rõ ràng giữa một người giải bài thuần túy và một <strong>Tarot Healer giữ trục trung tính</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border border-[#3B3636]/12 shadow-xs transition-all hover:border-[#3B3636]/25">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B3636]/60" />
                  <strong className="text-[#27190F] text-xs sm:text-sm font-semibold uppercase tracking-wider block">
                    Tarot Healer KHÔNG PHẢI LÀ:
                  </strong>
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-xs sm:text-sm text-[#3B3636]/80 m-0 font-light leading-relaxed">
                  <li>Người dự đoán tương lai cố định</li>
                  <li>Người đưa ra quyết định thay thân chủ</li>
                  <li>Người “biết đúng – sai” phán xét người khác</li>
                  <li>Người gánh nghiệp hay chữa thay ai đó</li>
                </ul>
                <div className="mt-3 pt-2.5 border-t border-[#3B3636]/10 text-xs text-[#8C4019] italic font-medium">
                  Mang vai này → lệch trục ngay từ đầu
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B75E2A]/30 shadow-xs ring-1 ring-[#B75E2A]/10 transition-all hover:border-[#B75E2A]/50">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B75E2A]" />
                  <strong className="text-[#8C4019] text-xs sm:text-sm font-semibold uppercase tracking-wider block">
                    Tarot Healer LÀ AI:
                  </strong>
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-xs sm:text-sm text-[#27190F]/85 m-0 font-light leading-relaxed">
                  <li>Người soi gương cấu trúc</li>
                  <li>Người giữ không gian an toàn</li>
                  <li>Người đặt câu hỏi đúng trọng tâm</li>
                  <li>Người trả quyền lực về cho thân chủ</li>
                </ul>
                <div className="mt-3 pt-2.5 border-t border-[#B75E2A]/15 text-xs text-[#B75E2A] font-semibold">
                  “Tarot không trao quyền — Tarot trả quyền.”
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className="rounded-2xl overflow-hidden shadow-lg border border-[#3B3636]/10 cursor-pointer group bg-[#251912]"
              onClick={() => setAnhDangXem(danhSachSlideCanva[3])}
            >
              <picture>
                <source srcSet="/assets/tarot-healer/slide_04.webp" type="image/webp" />
                <img
                  src="/assets/tarot-healer/slide_04.png"
                  alt="Module 1 - Trục & Đạo nghề"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block transition-transform group-hover:scale-[1.02] duration-300"
                />
              </picture>
              <div className="p-3 text-center bg-white text-xs text-[#B75E2A] font-semibold">
                Xem chi tiết slide Trục &amp; Đạo nghề ⤢
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Khung 5 Modules Đào Tạo Chuyên Sâu */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="serif text-3xl sm:text-4xl text-[#27190F] font-normal mb-3 m-0">
            Khung 5 Modules chuyên nghiệp
          </h2>
          <p className="text-base text-[#3B3636]/80 m-0 font-light">
            Trang bị đầy đủ năng lực nhận thức, kỹ thuật đọc chữa lành và phong cách thực hành bền vững.
          </p>
        </div>

        {/* Nhóm 1: Modules 01 - 03 (Thẻ Mở Rộng Tương Tác) */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full mb-5">
          {[
            {
              id: 1,
              tenModule: "MODULE 01",
              tieuDe: "Trục và Đạo nghề",
              moTa: "Thiết lập khung healer vững vàng, định vị vai trò và phòng ngừa cạm bẫy cứu vớt hay gánh nghiệp.",
              danhSach: [
                "Giữ trục: Tự nhận diện bóng tối & ranh giới cá nhân.",
                "Tránh cứu vớt: Không gánh thay nghiệp, không tạo lệ thuộc.",
                "Khung an toàn: Không gian bảo mật & quân bình năng lượng.",
              ],
              ghiChu: "Giữ trục người đọc và khung healer",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D6] p-2.5 shadow-sm overflow-hidden border border-[#3B3636]/12">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-xs border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#8C4019]">
                        Khung Healer
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Bản lĩnh</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Trục Đạo Nghề Vững Vàng
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Không cứu vớt • Không gánh thay
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1.5 rounded-md bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Trục trung tính</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Soi chiếu không phán xét, lắng nghe sâu</p>
                      </div>

                      <div className="p-1.5 rounded-md bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Ranh giới năng lượng</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Bảo vệ sự quân bình cho cả hai phía</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Nguyên tắc:</span>
                      <span className="font-medium text-[#8C4019]">Tarot trả quyền</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 2,
              tenModule: "MODULE 02",
              tieuDe: "Ngôn ngữ Tarot trị liệu",
              moTa: "Phân tích cấu trúc biểu tượng 78 lá dưới lăng kính tâm lý học nhận thức và năng lượng chuyển hóa.",
              danhSach: [
                "22 Ẩn Chính: Các giai đoạn chữa lành tâm lý.",
                "4 Suits Ẩn Phụ: Điểm nghẽn Thân – Tâm – Trí – Khí.",
                "Ngôn ngữ NVC: Giao tiếp phi bạo lực kiến tạo an toàn.",
              ],
              ghiChu: "Cấu trúc biểu tượng & hệ thống lá bài",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D6] p-2.5 shadow-sm overflow-hidden border border-[#3B3636]/12">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-xs border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#8C4019]">
                        Ngôn ngữ trị liệu
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Carl Jung</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Biểu Tượng Soi Tiềm Thức
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Khám phá các nguyên mẫu vô thức
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1 mb-2 text-[10px]">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#8C4019]">Đất · Thân</span>
                        <span className="text-[9px] text-[#3B3636]/70">Tiếp đất an toàn</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#B75E2A]">Nước · Tâm</span>
                        <span className="text-[9px] text-[#3B3636]/70">Ôm ấp cảm xúc</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#27190F]">Khí · Trí</span>
                        <span className="text-[9px] text-[#3B3636]/70">Gỡ nút thắt</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-center">
                        <span className="block font-medium text-[#9C643C]">Lửa · Khí</span>
                        <span className="text-[9px] text-[#3B3636]/70">Khơi sinh lực</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Phương pháp:</span>
                      <span className="font-medium text-[#8C4019]">Khai mở, không áp đặt</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 3,
              tenModule: "MODULE 03",
              tieuDe: "Đọc Tarot chữa lành",
              moTa: "Kỹ thuật soi cấu trúc đa tầng, đọc dòng chảy năng lượng và nhận diện vòng lặp mô thức tâm lý.",
              danhSach: [
                "Soi cấu trúc: Bóc tách nguyên nhân thay vì hiện tượng.",
                "Gỡ mô thức: Nhận diện phản ứng tiềm thức lặp lại.",
                "Trải bài chuyển hóa: Giải tỏa sang chấn & khơi thông bế tắc.",
              ],
              ghiChu: "Soi cấu trúc – đọc dòng chảy – gỡ mô thức",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D6] p-2.5 shadow-sm overflow-hidden border border-[#3B3636]/12">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-xs border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#8C4019]">
                        Soi Cấu Trúc
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Dòng chảy</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Gỡ Nút Thắt Tâm Lý
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Nhận diện mô thức • Khơi thông bế tắc
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">01. Bóc tách hiện tượng</span>
                        <span className="text-[10px] text-[#3B3636]/70">Thân chủ đang phản ứng gì?</span>
                      </div>
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">02. Soi chiếu gốc rễ</span>
                        <span className="text-[10px] text-[#3B3636]/70">Niềm tin vô thức nào đang vận hành?</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Trọng tâm:</span>
                      <span className="font-medium text-[#8C4019]">Chuyển hóa từ bên trong</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ].map((item) => {
            const isExpanded = moduleDangChonRow1 === item.id

            return (
              <div
                key={item.id}
                onMouseEnter={() => setModuleDangChonRow1(item.id)}
                onClick={() => setModuleDangChonRow1(item.id)}
                className={`relative rounded-[22px] border cursor-pointer select-none overflow-hidden p-5 sm:p-5.5 how-card-transition ${
                  isExpanded
                    ? "lg:flex-[2.6] bg-white border-[#B75E2A]/40 shadow-md ring-1 ring-[#B75E2A]/10"
                    : "lg:flex-[1] bg-white/80 hover:bg-white border-[#3B3636]/12 shadow-sm"
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full h-full gap-4">
                  <div className="flex flex-col justify-between h-full flex-1 text-left min-w-0">
                    <div>
                      <div className="mb-2">
                        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-[#B75E2A]/10 text-[#8C4019] border border-[#B75E2A]/20">
                          {item.tenModule}
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

                    <div className="pt-3 mt-3 border-t border-[#3B3636]/10 text-xs text-[#8C4019] font-medium flex items-center justify-between">
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

        {/* Nhóm 2: Modules 04 - 05 (Thẻ Mở Rộng Tương Tác) */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full">
          {[
            {
              id: 4,
              tenModule: "MODULE 04",
              tieuDe: "Tarot & Mối quan hệ",
              moTa: "Phân tích cơ chế gắn kết, soi chiếu xung đột và thiết lập ranh giới an toàn trong các mối quan hệ.",
              danhSach: [
                "Thuyết gắn kết: Nhận diện lo âu, né tránh hay an toàn.",
                "Phóng chiếu 2 chiều: Tấm gương phản chiếu thay vì đổ lỗi.",
                "Ranh giới lành mạnh: Yêu thương không đánh mất chính mình.",
              ],
              ghiChu: "Gắn kết – xung đột – ranh giới trong trị liệu",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D6] p-2.5 shadow-sm overflow-hidden border border-[#3B3636]/12">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-xs border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#8C4019]">
                        Mối quan hệ
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Gắn kết</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Động Lực Gắn Kết
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Nhận diện phản chiếu • Giữ ranh giới
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Cơ chế phóng chiếu</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Nhận diện điều thân chủ tìm kiếm hay chối bỏ</p>
                      </div>

                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Ranh giới yêu thương</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Khôi phục chủ quyền, không hy sinh mù quáng</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Kim chỉ nam:</span>
                      <span className="font-medium text-[#8C4019]">Yêu thương có ranh giới</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 5,
              tenModule: "MODULE 05",
              tieuDe: "Thực hành tích hợp & Giám sát chuyên môn",
              moTa: "Thực hành tham vấn thực tế dưới sự giám sát trực tiếp 1:1 của Founder Khiêm Võ.",
              danhSach: [
                "Case study thực chiến: Điều phối phiên đọc cảm xúc phức tạp.",
                "Supervision 1:1: Hiệu chỉnh câu chữ, nhịp điệu và năng lượng.",
                "Định hình phong cách: Xây dựng bản lĩnh Healer chuẩn mực.",
              ],
              ghiChu: "Giữ trục – ranh giới – biểu tượng nâng cao thực tiễn",
              renderMockup: () => (
                <div className="relative rounded-xl bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D6] p-2.5 shadow-sm overflow-hidden border border-[#3B3636]/12">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-xs border border-white/90">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B75E2A]/10 text-[#8C4019]">
                        Supervision 1:1
                      </span>
                      <span className="text-[10px] text-[#3B3636]/60">Founder Khiêm Võ</span>
                    </div>

                    <div className="mb-2">
                      <h4 className="serif text-[15px] text-[#27190F] m-0 font-normal">
                        Giám Sát Chuyên Môn
                      </h4>
                      <p className="text-[10px] text-[#3B3636]/65 m-0 font-light">
                        Hiệu chỉnh phản xạ • Tích hợp năng lực
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Phản hồi kèm sát</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Chỉnh ngôn từ, nhịp điệu và giữ trục phiên đọc</p>
                      </div>

                      <div className="p-1 rounded bg-[#FAF7F2] border border-[#3B3636]/10 text-[11px]">
                        <span className="font-medium text-[#27190F] block">Bản lĩnh hành nghề</span>
                        <p className="text-[10px] text-[#3B3636]/75 m-0 font-light">Phong cách tham vấn an toàn, độc lập và nhân văn</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#3B3636]/10 text-[11px]">
                      <span className="text-[#3B3636]/70">Đích đến:</span>
                      <span className="font-medium text-[#8C4019]">Healer chuẩn mực</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ].map((item) => {
            const isExpanded = moduleDangChonRow2 === item.id

            return (
              <div
                key={item.id}
                onMouseEnter={() => setModuleDangChonRow2(item.id)}
                onClick={() => setModuleDangChonRow2(item.id)}
                className={`relative rounded-[22px] border cursor-pointer select-none overflow-hidden p-5 sm:p-5.5 how-card-transition ${
                  isExpanded
                    ? "lg:flex-[2.6] bg-white border-[#B75E2A]/40 shadow-md ring-1 ring-[#B75E2A]/10"
                    : "lg:flex-[1] bg-white/80 hover:bg-white border-[#3B3636]/12 shadow-sm"
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full h-full gap-4">
                  <div className="flex flex-col justify-between h-full flex-1 text-left min-w-0">
                    <div>
                      <div className="mb-2">
                        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-[#B75E2A]/10 text-[#8C4019] border border-[#B75E2A]/20">
                          {item.tenModule}
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

                    <div className="pt-3 mt-3 border-t border-[#3B3636]/10 text-xs text-[#8C4019] font-medium flex items-center justify-between">
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
                TIÊU CHUẨN ĐẠO ĐỨC TAROT HEALER
              </span>
              <h3 className="serif text-xl sm:text-2xl text-white font-normal mb-2 m-0">
                “Chữa lành không tạo sự lệ thuộc. Giữ ranh giới để thân chủ tự dẫn dắt.”
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed m-0 font-light" style={{ color: "rgba(254, 251, 240, 0.9)" }}>
                Tarot Healer tại Inner Architect™ không tạo ra sự dựa dẫm tâm linh. Mọi phiên đọc đều hướng tới việc trao trả quyền tự quyết, kích hoạt trí tuệ tự chữa lành bên trong mỗi con người và xây dựng nền tảng vững vàng trong thực tại.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-[#FEFBF0]">
                Tiêu chuẩn Healer Inner Architect™
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
            Bạn muốn trở thành một Tarot Healer chuyên nghiệp?
          </h2>
          <p className="text-sm sm:text-base text-[#3B3636]/85 max-w-xl mx-auto mb-8 leading-relaxed font-light">
            Chương trình đào tạo có quy trình phỏng vấn đầu vào khắt khe nhằm đảm bảo định hướng đạo đức và tâm thế đúng đắn của người học. Vui lòng liên hệ trực tiếp để trao đổi nguyện vọng, nhận thông tin kỳ tuyển sinh và học phí chi tiết.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/lien-he"
              style={{ backgroundColor: "#B75E2A", color: "#FFFFFF" }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full hover:!bg-[#96471B] !text-white text-sm sm:text-base font-semibold shadow-md transition-all cursor-pointer group"
            >
              <span className="!text-white" style={{ color: "#FFFFFF" }}>
                Liên hệ tư vấn &amp; phỏng vấn khóa học
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

