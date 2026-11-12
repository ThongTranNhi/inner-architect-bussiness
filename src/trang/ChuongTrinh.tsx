import { useEffect, useRef, useState } from "react"
import { Link } from "../dieu-huong"
import { danhSachChiTietChuongTrinh } from "../du-lieu/chuong-trinh"
import { IMG } from "../du-lieu/hinh-anh"
import { PageHero, ParentLink } from "./chung"
import { TarotCanBanView } from "./TarotCanBan"
import { TarotNangCaoView } from "./TarotNangCao"
import { TarotHealerView } from "./TarotHealer"

interface BuoiHocLich {
  id: string
  soThuTu: string
  tieuDe: string
  phuDe: string
  loaiHinh: string
  phanLoai: "online" | "workshop"
  thoiGian: string
  ngayThangCanva: string
  khungGio: string
  chiPhi: string
  hinhThucTag: string
  moTa: string
  diemNhan: string[]
}

const DANH_SACH_LICH_HOC: BuoiHocLich[] = [
  {
    id: "cham-ngo-tarot",
    soThuTu: "01",
    tieuDe: "Chạm Ngõ Tarot",
    phuDe: "Nhập môn biểu tượng & Khai mở trực giác tự vấn",
    loaiHinh: "Học tương tác trực tuyến qua Zoom",
    phanLoai: "online",
    thoiGian: "Coming Soon",
    ngayThangCanva: "02, 09, 16, 23 FEB",
    khungGio: "20:00 – 22:00",
    chiPhi: "Tùy duyên trao gởi",
    hinhThucTag: "Online qua Zoom",
    moTa: "Bước khởi đầu chuẩn mực về hệ thống 78 lá bài Rider-Waite-Smith. Làm quen với ngôn ngữ biểu tượng cổ mẫu và thực hành mở trực giác một cách an toàn, không mang tính mê tín dị đoan.",
    diemNhan: [
      "Nhận diện cấu trúc 22 Ẩn Chính & 56 Ẩn Phụ",
      "Kỹ thuật trải bài tự vấn 1 – 3 lá hàng ngày",
      "Xây dựng thái độ tôn trọng ranh giới và công cụ",
    ],
  },
  {
    id: "ngung-gong-bat-dau-tho",
    soThuTu: "02",
    tieuDe: "Ngừng gồng – Bắt đầu thở",
    phuDe: "Hạ tải hệ thần kinh & Tháo gỡ cơ chế tự vệ mạn tính",
    loaiHinh: "Lớp học tương tác & Thực hành",
    phanLoai: "online",
    thoiGian: "Coming Soon",
    ngayThangCanva: "07, 09, 14, 16 FEB",
    khungGio: "20:00 – 22:00",
    chiPhi: "Tùy duyên trao gởi",
    hinhThucTag: "Online qua Zoom",
    moTa: "Dành cho những ai đang mang vác quá nhiều kỳ vọng và căng thẳng mạn tính. Học cách nhận diện cơ chế gồng mình tự vệ của tâm lý và hạ áp lực hệ thần kinh qua hơi thở có ý thức.",
    diemNhan: [
      "Nhận diện phản ứng co thắt vô thức khi gặp áp lực",
      "Kỹ thuật thở điều hòa nhịp tim & hệ thần kinh phó giao cảm",
      "Xác lập khoảng dừng tĩnh tại giữa các biến cố đời thường",
    ],
  },
  {
    id: "khoi-dong-nam-moi-khong-gong",
    soThuTu: "03",
    tieuDe: "Khởi động năm mới không gồng",
    phuDe: "Tái cấu trúc mục tiêu & Định hình nhịp sống an trú",
    loaiHinh: "Workshop chuyên đề (Offline tại The Hermit)",
    phanLoai: "workshop",
    thoiGian: "Coming Soon",
    ngayThangCanva: "24 FEB",
    khungGio: "14:00 – 16:00",
    chiPhi: "499.000đ / người",
    hinhThucTag: "Workshop Offline · The Hermit",
    moTa: "Phiên thực hành tái cấu trúc mục tiêu và dọn dẹp tâm trí trước thềm chu kỳ mới. Rà soát những áp lực gượng ép để bước vào giai đoạn tiếp theo bằng sự vững chãi tự nhiên.",
    diemNhan: [
      "Lập bản đồ năng lượng cá nhân và điểm ưu tiên cốt lõi",
      "Tháo gỡ nỗi sợ trì hoãn và hội chứng áp lực thành tích",
      "Thiết kế nhịp sinh hoạt tôn trọng sức chứa của thân tâm",
    ],
  },
  {
    id: "co-the-dang-cang-o-dau",
    soThuTu: "04",
    tieuDe: "Cơ thể mình đang căng ở đâu?",
    phuDe: "Lắng nghe thể lý & Giải tỏa tắc nghẽn cảm xúc",
    loaiHinh: "Thực hành soi chiếu & Điều hướng thân tâm",
    phanLoai: "online",
    thoiGian: "Coming Soon",
    ngayThangCanva: "28 JAN",
    khungGio: "20:00 – 22:00",
    chiPhi: "Tùy duyên trao gởi",
    hinhThucTag: "Online qua Zoom",
    moTa: "Kết nối với cơ thể như một chiếc gương trung thực nhất của cảm xúc. Soi chiếu các điểm co cứng cơ học để giải tỏa những tổn thương vô thức bị đè nén trong đời sống hàng ngày.",
    diemNhan: [
      "Phương pháp quét cơ thể (Body Scan) nhận diện điểm tắc nghẽn",
      "Liên kết cơn đau mạn tính với trạng thái tâm lý tương ứng",
      "Các bài tập xoa dịu và chuyển hóa năng lượng tắc nghẽn",
    ],
  },
  {
    id: "vi-sao-nghi-khong-thay-nhe",
    soThuTu: "05",
    tieuDe: "Vì sao mình nghĩ mà không thấy nhẹ",
    phuDe: "Bóc tách bẫy suy nghĩ quá mức (Overthinking)",
    loaiHinh: "Thảo luận chuyên đề & Đọc cấu trúc tâm trí",
    phanLoai: "online",
    thoiGian: "Coming Soon",
    ngayThangCanva: "30 JAN",
    khungGio: "20:00 – 22:00",
    chiPhi: "Tùy duyên trao gởi",
    hinhThucTag: "Online qua Zoom",
    moTa: "Bóc tách vòng lặp suy nghĩ luẩn quẩn (overthinking) và sự tự phán xét nội tâm. Phân biệt rõ giữa 'suy nghĩ để giải quyết vấn đề' và 'suy nghĩ để tự làm khó bản thân'.",
    diemNhan: [
      "Bóc tách 5 bẫy nhận thức khiến tâm trí kiệt quệ",
      "Kỹ thuật phân tách bản thân khỏi dòng chảy suy nghĩ miên man",
      "Thực hành neo giữ nhận thức trong thực tại (Grounding)",
    ],
  },
  {
    id: "cham-ve-de-diu-lai",
    soThuTu: "06",
    tieuDe: "Chạm – Vẽ để dịu lại",
    phuDe: "Trực giác màu sắc & Chữa lành bằng nghệ thuật biểu đạt",
    loaiHinh: "Workshop nghệ thuật trực giác (Offline tại The Hermit)",
    phanLoai: "workshop",
    thoiGian: "Coming Soon",
    ngayThangCanva: "31 JAN",
    khungGio: "14:00 – 16:00",
    chiPhi: "499.000đ / người",
    hinhThucTag: "Workshop Offline · The Hermit",
    moTa: "Không gian trải nghiệm nghệ thuật chữa lành bằng trực giác. Không đòi hỏi năng khiếu hội họa, người tham gia dùng màu sắc và nét vẽ tự do để xoa dịu những vùng ký ức nhạy cảm.",
    diemNhan: [
      "Tự do biểu đạt cảm xúc qua màu nước và chất liệu tự nhiên",
      "Không gian tĩnh lặng, thưởng trà thảo mộc tại The Hermit",
      "Mở rộng lòng đón nhận bản thân trọn vẹn và an bình",
    ],
  },
]

/**
 * Trang chi tiết Lịch đào tạo & Workshop (Coming Soon).
 * Thiết kế giao diện tạp chí cao cấp (Luxury Editorial Experience),
 * tích hợp áp phích Canva, chế độ xem đa chiều (Thẻ đa sắc & Lộ trình Timeline),
 * cùng thông tin chi tiết từng phiên học và hộp xem áp phích khổ lớn (Lightbox).
 */
export function LichDayHocPageView() {
  const [boLoc, setBoLoc] = useState<"tat-ca" | "online" | "workshop">("tat-ca")
  const [cheDoXem, setCheDoXem] = useState<"grid" | "timeline">("grid")
  const [moLightbox, setMoLightbox] = useState(false)
  const [cuonY, setCuonY] = useState(0)
  const [posterTilt, setPosterTilt] = useState({ x: 0, y: 0 })
  const [dangHoverPoster, setDangHoverPoster] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoLightbox(false)
    }
    if (moLightbox) {
      window.addEventListener("keydown", onKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [moLightbox])

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

  const cuonXuongLichHoc = () => {
    const el = document.getElementById("danh-sach-lich-hoc")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const danhSachHienThi = DANH_SACH_LICH_HOC.filter((item) => {
    if (boLoc === "online") return item.phanLoai === "online"
    if (boLoc === "workshop") return item.phanLoai === "workshop"
    return true
  })

  return (
    <main className="lich-day-hoc-page min-h-screen pb-24 text-[#27190F] bg-[#FAF7F2]">
      {/* Khối CSS hiệu ứng animation và cuộn chuột mượt mà */}
      <style>{`
        @keyframes heroFadeInUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroFadeInRight {
          from {
            opacity: 0;
            transform: translateX(28px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes heroGlowPulse {
          0%, 100% {
            opacity: 0.18;
            transform: scale(1);
          }
          50% {
            opacity: 0.32;
            transform: scale(1.08);
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
        .hero-anim-item {
          animation: heroFadeInUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-poster-anim {
          animation: heroFadeInRight 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }
        .mouse-dot-anim {
          animation: mouseScrollDot 1.8s infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-anim-item, .hero-poster-anim, .mouse-dot-anim {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* 1. Thanh điều hướng đầu trang */}
      <div className="max-w-[1280px] mx-auto px-6 pt-8 pb-4 flex items-center justify-between text-xs font-semibold text-[#3B3636]/75">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B75E2A]" />
          <span className="text-[#B75E2A] uppercase tracking-[0.16em] font-medium">
            INNER ARCHITECT™ · ACADEMY
          </span>
        </div>
        <div>
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

      {/* 2. Hero Banner phong cách Dark Editorial sang trọng với hiệu ứng animation & phản hồi cuộn */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-2 pb-10">
        <div
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-14 text-[#FEFBF0] shadow-2xl border border-[#3D2C22] transition-shadow duration-500 hover:shadow-[0_24px_60px_-15px_rgba(26,18,13,0.7)]"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(212,175,55,0.18), transparent 65%), linear-gradient(145deg, #1A120D 0%, #120C08 100%)",
            color: "#FEFBF0",
          }}
        >
          {/* Họa tiết quầng sáng vàng mờ phía sau phản hồi theo cuộn chuột */}
          <div
            className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full pointer-events-none transition-transform duration-300"
            style={{
              background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
              transform: `translateY(${Math.min(cuonY * 0.08, 40)}px) scale(${1 + Math.min(cuonY * 0.0004, 0.12)})`,
              animation: "heroGlowPulse 6s ease-in-out infinite",
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Cột trái: Thông điệp hành trình & Chỉ số */}
            <div className="lg:col-span-7 space-y-6">
              <div
                className="hero-anim-item inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E5C158] text-[11px] font-semibold tracking-widest uppercase"
                style={{ animationDelay: "0.05s" }}
              >
                <span>LEARNING &amp; HEALING JOURNEY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
                <span className="text-[#FFBA92]">COMING SOON</span>
              </div>

              <div>
                <h1
                  className="hero-anim-item serif text-3xl sm:text-5xl lg:text-[54px] m-0 font-normal leading-[1.08] tracking-tight"
                  style={{ color: "#FEFBF0", animationDelay: "0.15s" }}
                >
                  Hành Trình Khai Mở &amp; Chữa Lành
                </h1>
                <p
                  className="hero-anim-item serif italic text-xl sm:text-2xl mt-3 mb-0 font-normal"
                  style={{ color: "#E5A874", animationDelay: "0.25s" }}
                >
                  6 Điểm chạm chuyển hóa: Thân — Tâm — Trí
                </p>
              </div>

              <p
                className="hero-anim-item text-sm sm:text-base max-w-xl leading-relaxed m-0 font-light"
                style={{ color: "rgba(254, 251, 240, 0.9)", animationDelay: "0.32s" }}
              >
                Hệ thống các buổi học tương tác trực tuyến qua Zoom và workshop chuyên đề offline tại The Hermit cùng Founder Khiêm Võ. Mỗi phiên học là một trạm dừng có cấu trúc, giúp bạn hạ bớt những gồng gánh vô thức, kết nối trực giác và neo lại sự bình an nội tại.
              </p>

              {/* 4 Thẻ chỉ số tổng quan với hiệu ứng hover và trễ động */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { so: "06", nhan: "Phiên học & WS", delay: "0.38s" },
                  { so: "10-15", nhan: "Học viên / Lớp", delay: "0.45s" },
                  { so: "Zoom & Offline", nhan: "Hình thức học", delay: "0.52s", size: "text-2xl sm:text-3xl" },
                  { so: "Sớm Mở", nhan: "Ghi danh ưu tiên", delay: "0.59s", size: "text-xl sm:text-2xl", mau: "#FFBA92" },
                ].map((thongSo, idx) => (
                  <div
                    key={idx}
                    className="hero-anim-item bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-3.5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-default"
                    style={{ animationDelay: thongSo.delay }}
                  >
                    <span
                      className={`block ${thongSo.size || "text-2xl sm:text-3xl"} serif leading-none mb-1 transition-transform group-hover:scale-105 duration-200`}
                      style={{ color: thongSo.mau || "#E5A874" }}
                    >
                      {thongSo.so}
                    </span>
                    <span
                      className="text-[11px] uppercase tracking-wider block"
                      style={{ color: "rgba(254, 251, 240, 0.85)" }}
                    >
                      {thongSo.nhan}
                    </span>
                  </div>
                ))}
              </div>

              {/* Nút hành động, liên hệ và nút cuộn chuột trực quan */}
              <div className="pt-2 space-y-4">
                <div
                  className="hero-anim-item flex flex-wrap items-center gap-4"
                  style={{ animationDelay: "0.65s" }}
                >
                  <Link
                    to="/lien-he"
                    className="px-6 py-3 rounded-full bg-[#B75E2A] hover:bg-[#8C4019] text-[#FEFBF0] text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group cursor-pointer hover:scale-[1.02]"
                    style={{ color: "#FEFBF0" }}
                  >
                    <span>Đăng ký nhận thông báo sớm</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(254, 251, 240, 0.85)" }}>
                    <span style={{ color: "rgba(254, 251, 240, 0.6)" }}>Hotline:</span>
                    <a href="tel:0868554141" className="font-semibold hover:underline" style={{ color: "#D4AF37" }}>
                      0868.554.141
                    </a>
                  </div>
                </div>

                {/* Nút hiệu ứng cuộn chuột (Scroll Down Indicator) */}
                <div
                  className="hero-anim-item pt-1"
                  style={{ animationDelay: "0.72s" }}
                >
                  <button
                    type="button"
                    onClick={cuonXuongLichHoc}
                    className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#D4AF37]/40 text-xs text-[#FEFBF0]/85 hover:text-[#FEFBF0] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-xs"
                    title="Cuộn nhanh xuống danh sách các buổi học"
                  >
                    <span className="w-4 h-6 rounded-full border border-[#D4AF37]/60 flex items-start justify-center p-0.5 shrink-0">
                      <span className="w-1 h-1.5 rounded-full bg-[#E5A874] mouse-dot-anim" />
                    </span>
                    <span>Cuộn chuột khám phá chi tiết 6 buổi học</span>
                    <span className="text-[#E5A874] font-bold transition-transform group-hover:translate-y-0.5">
                      ↓
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cột phải: Khung áp phích Canva tương tác với hiệu ứng 3D tilt và parallax cuộn chuột */}
            <div className="lg:col-span-5 hero-poster-anim">
              <div
                onMouseMove={xuLyMouseMovePoster}
                onMouseEnter={() => setDangHoverPoster(true)}
                onMouseLeave={xuLyMouseLeavePoster}
                onClick={() => setMoLightbox(true)}
                className="relative group rounded-2xl overflow-hidden bg-black/60 border border-[#D4AF37]/35 shadow-2xl cursor-pointer transition-all duration-300"
                style={{
                  transform: `perspective(1000px) rotateY(${posterTilt.x}deg) rotateX(${posterTilt.y}deg) translateY(${Math.min(cuonY * 0.04, 20)}px)`,
                  boxShadow: dangHoverPoster
                    ? "0 25px 50px -12px rgba(212, 175, 55, 0.25), 0 0 30px rgba(212, 175, 55, 0.15)"
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
                title="Nhấn để phóng to áp phích chính thức"
              >
                <img
                  src={IMG.lichDayHocPoster}
                  alt="Áp phích lịch đào tạo và workshop Inner Architect chính thức"
                  className="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                      ÁP PHÍCH CHÍNH THỨC CANVA
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium group-hover:bg-[#B75E2A] group-hover:text-white transition-colors">
                      <span>Phóng to</span>
                      <span aria-hidden="true">⤢</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Thanh điều khiển tương tác: Bộ lọc hình thức & Chế độ xem */}
      <section id="danh-sach-lich-hoc" className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-4 pb-8 scroll-mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#3B3636]/10 shadow-sm">
          {/* Bộ lọc phân loại buổi học */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#3B3636]/60 uppercase tracking-wider mr-1">
              Lọc theo:
            </span>
            <button
              type="button"
              onClick={() => setBoLoc("tat-ca")}
              style={
                boLoc === "tat-ca"
                  ? { backgroundColor: "#B75E2A", color: "#FFFFFF", borderColor: "#B75E2A" }
                  : { backgroundColor: "#FFFFFF", color: "#27190F", borderColor: "rgba(59, 54, 54, 0.18)" }
              }
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border shadow-xs"
            >
              Tất cả lộ trình ({DANH_SACH_LICH_HOC.length})
            </button>
            <button
              type="button"
              onClick={() => setBoLoc("online")}
              style={
                boLoc === "online"
                  ? { backgroundColor: "#B75E2A", color: "#FFFFFF", borderColor: "#B75E2A" }
                  : { backgroundColor: "#FFFFFF", color: "#27190F", borderColor: "rgba(59, 54, 54, 0.18)" }
              }
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border shadow-xs"
            >
              Học tương tác Zoom (4)
            </button>
            <button
              type="button"
              onClick={() => setBoLoc("workshop")}
              style={
                boLoc === "workshop"
                  ? { backgroundColor: "#B75E2A", color: "#FFFFFF", borderColor: "#B75E2A" }
                  : { backgroundColor: "#FFFFFF", color: "#27190F", borderColor: "rgba(59, 54, 54, 0.18)" }
              }
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border shadow-xs"
            >
              Workshop The Hermit (2)
            </button>
          </div>

          {/* Công tắc chuyển chế độ hiển thị: Dạng Thẻ Lưới vs Lộ Trình Timeline */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#3B3636]/10 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setCheDoXem("grid")}
              style={
                cheDoXem === "grid"
                  ? { backgroundColor: "#FFFFFF", color: "#27190F", fontWeight: 600 }
                  : { backgroundColor: "transparent", color: "rgba(59, 54, 54, 0.65)" }
              }
              className="px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer shadow-xs"
            >
              Dạng Thẻ Lưới
            </button>
            <button
              type="button"
              onClick={() => setCheDoXem("timeline")}
              style={
                cheDoXem === "timeline"
                  ? { backgroundColor: "#FFFFFF", color: "#27190F", fontWeight: 600 }
                  : { backgroundColor: "transparent", color: "rgba(59, 54, 54, 0.65)" }
              }
              className="px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer shadow-xs"
            >
              Lộ Trình Timeline
            </button>
          </div>
        </div>
      </section>

      {/* 4. CHẾ ĐỘ 1: DẠNG THẺ LƯỚI (Grid Cards View - Đồng bộ nhận diện thương hiệu) */}
      {cheDoXem === "grid" && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8 items-stretch">
            {danhSachHienThi.map((buoi) => (
              <article
                key={buoi.id}
                className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-xs border border-[#3B3636]/12 transition-all duration-300 hover:shadow-xl hover:border-[#B75E2A]/40 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Thanh thông tin lịch trình */}
                  <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#3B3636]/10 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-[#B75E2A]/10 text-[#8C4019] border border-[#B75E2A]/20 shadow-2xs">
                        {buoi.ngayThangCanva}
                      </span>
                      <span className="text-xs font-medium text-[#27190F]/70">
                        {buoi.khungGio}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#27190F]/5 text-[#27190F]/70 border border-[#27190F]/10">
                        {buoi.thoiGian}
                      </span>
                      <span className="serif text-lg font-bold text-[#27190F]/25">
                        #{buoi.soThuTu}
                      </span>
                    </div>
                  </div>

                  {/* Tiêu đề & Phụ đề buổi học */}
                  <div className="mb-3">
                    <h2 className="serif text-2xl sm:text-3xl text-[#27190F] font-normal leading-snug m-0">
                      {buoi.tieuDe}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium mt-1 mb-0 text-[#B75E2A]">
                      {buoi.phuDe}
                    </p>
                  </div>

                  {/* Phân loại & Mức phí */}
                  <div className="flex flex-wrap items-center gap-2 my-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF7F2] text-[11px] font-semibold text-[#27190F] border border-[#3B3636]/10 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B75E2A]" />
                      {buoi.hinhThucTag}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FAF7F2] text-[11px] font-semibold text-[#27190F] border border-[#3B3636]/10 shadow-2xs">
                      <span>Mức phí:</span>
                      <strong className="text-[#8C4019]">{buoi.chiPhi}</strong>
                    </span>
                  </div>

                  {/* Đoạn mô tả chi tiết */}
                  <p className="text-sm text-[#3B3636]/80 leading-relaxed my-3 font-light">
                    {buoi.moTa}
                  </p>

                  {/* 3 Điểm nhấn giá trị */}
                  <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#3B3636]/10 my-4 shadow-2xs">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#8C4019]">
                      Nội dung trọng tâm:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#27190F]/85 m-0 pl-0 list-none">
                      {buoi.diemNhan.map((dn, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="font-bold text-sm leading-none shrink-0 text-[#B75E2A]">
                            ✓
                          </span>
                          <span>{dn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Chân thẻ: Nút đăng ký */}
                <div className="pt-2 mt-auto">
                  <Link
                    to="/lien-he"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm text-[#FEFBF0] bg-[#B75E2A] hover:bg-[#8C4019] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>Đăng ký giữ chỗ ưu tiên ({buoi.thoiGian})</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 5. CHẾ ĐỘ 2: LỘ TRÌNH TIMELINE (Dạng sơ đồ kết nối xuyên suốt) */}
      {cheDoXem === "timeline" && (
        <section className="max-w-[960px] mx-auto px-4 sm:px-6 pb-16">
          <div className="relative pl-6 sm:pl-10 border-l-2 border-[#B75E2A]/30 space-y-10 my-4">
            {danhSachHienThi.map((buoi) => (
              <div key={buoi.id} className="relative group">
                {/* Nút mốc tròn trên đường timeline */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-[#B75E2A] text-white font-mono text-xs sm:text-sm font-bold shadow-md ring-4 ring-[#FAF7F2]">
                  {buoi.soThuTu}
                </div>

                {/* Thẻ nội dung mốc lộ trình */}
                <div className="rounded-2xl p-6 sm:p-7 bg-white/90 border border-[#3B3636]/12 shadow-xs transition-all hover:shadow-md hover:border-[#B75E2A]/30">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#3B3636]/10">
                    <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-[#B75E2A]/10 text-[#8C4019] border border-[#B75E2A]/20">
                      {buoi.ngayThangCanva} · {buoi.khungGio}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#3B3636]/70">
                      {buoi.hinhThucTag} · <strong className="text-[#8C4019]">{buoi.chiPhi}</strong>
                    </span>
                  </div>

                  <h3 className="serif text-2xl text-[#27190F] m-0 font-normal">
                    {buoi.tieuDe}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 mb-2 font-medium text-[#B75E2A]">
                    {buoi.phuDe}
                  </p>
                  <p className="text-sm text-[#3B3636]/80 m-0 leading-relaxed font-light">
                    {buoi.moTa}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#3B3636]/10 flex items-center justify-between">
                    <span className="text-xs text-[#27190F]/60 italic">
                      Quy mô: 10 – 15 học viên / nhóm nhỏ
                    </span>
                    <Link
                      to="/lien-he"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B75E2A] hover:text-[#8C4019] hover:underline"
                    >
                      <span>Đăng ký tham gia</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Khu vực cam kết môi trường & ranh giới đạo đức */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-4 pb-12">
        <div
          className="rounded-3xl p-8 sm:p-10 bg-[#1E1510] border border-[#3A281E] shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ color: "#FEFBF0" }}
        >
          <div className="max-w-2xl space-y-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest block"
              style={{ color: "#D4AF37" }}
            >
              TIÊU CHUẨN ĐÀO TẠO &amp; KHÔNG GIAN AN TOÀN
            </span>
            <h3
              className="serif text-2xl sm:text-3xl font-normal m-0 leading-tight"
              style={{ color: "#FEFBF0" }}
            >
              “Chữa lành không tạo lệ thuộc. Giữ ranh giới để thân chủ tự dẫn dắt.”
            </h3>
            <p
              className="text-sm leading-relaxed m-0 font-light"
              style={{ color: "rgba(254, 251, 240, 0.9)" }}
            >
              Các khóa học và workshop tại Inner Architect™ không mang tính tiên đoán số phận hay thương mại hóa tâm linh. Mọi nội dung đều được biên soạn chỉn chu nhằm trang bị năng lực tự thấu hiểu và trao lại quyền làm chủ cuộc đời cho mỗi cá nhân.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={() => setMoLightbox(true)}
              className="px-5 py-3 rounded-full border border-white/30 hover:bg-white/10 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              style={{ color: "#FEFBF0" }}
            >
              Xem lại áp phích ⤢
            </button>
            <Link
              to="/lien-he"
              className="px-6 py-3 rounded-full bg-[#B75E2A] hover:bg-[#8C4019] text-xs sm:text-sm font-semibold transition-colors shadow-md"
              style={{ color: "#FEFBF0" }}
            >
              Liên hệ ghi danh →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Lightbox phóng to ảnh Canva chính thức */}
      {moLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
          onClick={() => setMoLightbox(false)}
        >
          <div
            className="relative max-w-[850px] max-h-[94vh] bg-[#1A120D] rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
                  Áp phích chính thức · Learning &amp; Healing Workshops
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMoLightbox(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Đóng (Esc)"
                title="Đóng (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Khung ảnh phóng to */}
            <div className="overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
              <img
                src={IMG.lichDayHocPoster}
                alt="Áp phích lịch học đầy đủ Canva"
                className="max-h-[76vh] w-auto rounded-xl shadow-2xl"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Chân modal */}
            <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/75">
              <span>Hotline: 0868.554.141 · www.innerarchitect.vn</span>
              <Link
                to="/lien-he"
                onClick={() => setMoLightbox(false)}
                className="px-4 py-1.5 rounded-lg bg-[#B75E2A] text-white hover:bg-[#8C4019] font-medium transition-colors"
              >
                Đăng ký giữ chỗ →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 8. Điều hướng cuối trang */}
      <ParentLink to="/chuong-trinh" label="Về danh mục chương trình" />
    </main>
  )
}

/**
 * Chuyển đổi tên chương trình hiển thị sang mã định danh (slug) trên URL.
 *
 * @param tenChuongTrinh - Tên tiếng Việt của chương trình
 * @returns Mã slug tương ứng
 */
export function laySlugChuongTrinh(tenChuongTrinh: string): string {
  switch (tenChuongTrinh) {
    case "Chạm ngõ Tarot":
      return "cham-ngo-tarot"
    case "Workshop nhận diện mô thức":
      return "nhan-dien-mo-thuc"
    case "Chạm — Vẽ để dịu lại":
      return "cham-ve-de-diu-lai"
    case "Trải nghiệm nhóm nhỏ":
      return "trai-nghiem-nhom-nho"
    case "Phiên tiếp cận ban đầu":
      return "phien-tiep-can-ban-dau"
    case "Phiên tái cấu trúc chuyên sâu":
      return "phien-tai-cau-truc-chuyen-sau"
    case "Đồng hành trong giai đoạn chuyển pha":
      return "dong-hanh-chuyen-pha"
    case "Tarot Căn Bản":
      return "tarot-can-ban"
    case "Tarot Nâng Cao":
      return "tarot-nang-cao"
    case "Tarot Healer":
      return "tarot-healer"
    case "Khóa tâm lý chuyên đề":
      return "tam-ly-chuyen-de"
    case "Lịch dạy học":
    case "Lịch dạy học & Workshop":
      return "lich-day-hoc"
    default:
      return "cham-ngo-tarot"
  }
}

export function ProgramDetail({ slug }: { slug: string }) {
  if (slug === "tarot-can-ban") {
    return <TarotCanBanView />
  }
  if (slug === "tarot-nang-cao") {
    return <TarotNangCaoView />
  }
  if (slug === "tarot-healer") {
    return <TarotHealerView />
  }
  if (slug === "lich-day-hoc") {
    return <LichDayHocPageView />
  }

  const p =
    danhSachChiTietChuongTrinh[slug] ||
    danhSachChiTietChuongTrinh["cham-ngo-tarot"]

  return (
    <main className="cream-page program-detail-page">
      <PageHero
        eyebrow={`${p.nhom} · ${p.tang}`}
        title={p.tieuDe}
        italic={p.phuDe}
        intro={p.doanDan}
      />
      <section className="detail-lead section-pad">
        <div className="detail-media">
          <img src={p.hinhAnh} alt={p.tieuDe} loading="lazy" decoding="async" />
        </div>
        <div className="detail-info">
          <div className="program-specs">
            <div className="spec-item">
              <span className="spec-label">THỜI LƯỢNG</span>
              <strong className="spec-value">{p.thoiLuong}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">HÌNH THỨC</span>
              <strong className="spec-value">{p.hinhThuc}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">QUY MÔ</span>
              <strong className="spec-value">{p.quyMo}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">CHI PHÍ / HỌC PHÍ</span>
              <strong className="spec-value">{p.chiPhi}</strong>
            </div>
          </div>

          <div className="program-section-block">
            <h2 className="serif">Mục tiêu cốt lõi</h2>
            <ul className="program-bullet-list">
              {p.mucTieu.map((mt, i) => (
                <li key={i}>{mt}</li>
              ))}
            </ul>
          </div>

          <div className="program-section-block">
            <h2 className="serif">Nội dung & Hoạt động chính</h2>
            <div className="curriculum-steps">
              {p.hoatDong.map((hd, i) => (
                <div key={i} className="curriculum-step-item">
                  <span className="step-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>{hd}</p>
                </div>
              ))}
            </div>
          </div>

          {p.chamNgon && (
            <blockquote className="program-quote serif">
              “{p.chamNgon}”
            </blockquote>
          )}

          <aside className="program-boundary-aside">
            <strong>RANH GIỚI & ĐẠO ĐỨC HỆ THỐNG</strong>
            <p>{p.ranhGioi}</p>
          </aside>

          <div className="program-actions">
            <Link to="/lien-he" className="button-link">
              {p.nutHanhDong} →
            </Link>
            <Link to="/chuong-trinh" className="underlink">
              ← Tất cả chương trình
            </Link>
          </div>
        </div>
      </section>
      <ParentLink to="/chuong-trinh" label="Tất cả chương trình" />
    </main>
  )
}

/**
 * Hàng mục chương trình hiển thị trong danh sách phân hệ.
 * Tự động tính toán vị trí động của ảnh xem trước để luôn xuất hiện ngay sau chữ tiêu đề.
 *
 * @param props.ten - Tên tiếng Việt của chương trình
 * @param props.chiSo - Chỉ số thứ tự trong danh sách (bắt đầu từ 0)
 * @param props.slug - Mã định danh slug
 * @param props.hinhAnh - Đường dẫn hình ảnh xem trước
 */
function HangMucChuongTrinh({
  ten,
  chiSo,
  slug,
  hinhAnh,
}: {
  ten: string
  chiSo: number
  slug: string
  hinhAnh: string
}) {
  const tieuDeRef = useRef<HTMLHeadingElement>(null)
  const [toaDoTrai, setToaDoTrai] = useState<number | null>(null)

  const capNhatViTri = () => {
    if (tieuDeRef.current) {
      const tieuDe = tieuDeRef.current
      const chieuRongTieuDe = tieuDe.offsetWidth
      const viTriTraiTieuDe = tieuDe.offsetLeft
      // Đặt mép trái của hình ảnh cách chữ cuối cùng của tiêu đề 45px để thoáng và không chạm chữ
      const viTriMongMuon = viTriTraiTieuDe + chieuRongTieuDe + 45
      setToaDoTrai(viTriMongMuon)
    }
  }

  useEffect(() => {
    capNhatViTri()
    window.addEventListener("resize", capNhatViTri)
    return () => window.removeEventListener("resize", capNhatViTri)
  }, [])

  return (
    <Link
      to={`/chuong-trinh/${slug}`}
      onMouseEnter={capNhatViTri}
    >
      <span>{String(chiSo + 1).padStart(2, "0")}</span>
      <h2 ref={tieuDeRef} className="serif">
        <span>{ten}</span>
      </h2>
      <b>→</b>
      <img
        src={hinhAnh}
        alt={ten}
        className="programme-hover-preview"
        style={toaDoTrai !== null ? { left: `${toaDoTrai}px` } : undefined}
        loading="lazy"
        decoding="async"
      />
    </Link>
  )
}

export function Programmes({ detail }: { detail?: string }) {
  if (detail) {
    return <ProgramDetail slug={detail} />
  }

  const families: [string, string[]][] = [
    [
      "A. TRẢI NGHIỆM",
      [
        "Chạm ngõ Tarot",
        "Workshop nhận diện mô thức",
        "Chạm — Vẽ để dịu lại",
        "Trải nghiệm nhóm nhỏ",
      ],
    ],
    [
      "B. ĐỒNG HÀNH CÁ NHÂN",
      [
        "Phiên tiếp cận ban đầu",
        "Phiên tái cấu trúc chuyên sâu",
        "Đồng hành trong giai đoạn chuyển pha",
      ],
    ],
    [
      "C. ACADEMY",
      [
        "Tarot Căn Bản",
        "Tarot Nâng Cao",
        "Tarot Healer",
        "Khóa tâm lý chuyên đề",
        "Lịch dạy học & Workshop",
      ],
    ],
  ]
  return (
    <main>
      <PageHero
        eyebrow="PROGRAMME ECOSYSTEM"
        title="Mỗi người cần"
        italic="một điểm bắt đầu khác nhau."
        intro="Các chương trình được thiết kế theo mức độ sẵn sàng, mục tiêu và phạm vi hỗ trợ. Không phải mọi trải nghiệm đều dẫn đến một tiến trình dài hơn."
      />
      <section className="programme-families">
        {families.map((family, fi) => (
          <article key={family[0]}>
            <div>
              <p className="eyebrow">{family[0]}</p>
              <p>
                {fi === 0
                  ? "Những điểm chạm nhẹ để quan sát và trải nghiệm."
                  : fi === 1
                    ? "Một tiến trình riêng tư, có nhịp độ và điểm kết rõ ràng."
                    : "Nền tảng học thuật và thực hành có giám sát."}
              </p>
              {fi === 0 && (
                <div className="programme-family-image">
                  <img
                    src={IMG.traiNghiemFamily}
                    alt="Các hoạt động trải nghiệm tại Inner Architect"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              {fi === 1 && (
                <div className="programme-family-image">
                  <img
                    src={IMG.homeGeneratedSessionEntry}
                    alt="Lối vào phiên đồng hành chuyên sâu 1-1 tại Inner Architect"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              {fi === 2 && (
                <div className="programme-family-image">
                  <img
                    src={IMG.academyTarotCanBan}
                    alt="Chương trình đào tạo và giáo trình Academy tại Inner Architect"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
            </div>
            <div>
              {family[1].map((name, i) => {
                const slug = laySlugChuongTrinh(name)
                const chiTiet = danhSachChiTietChuongTrinh[slug]
                const hinhAnhHover = chiTiet?.hinhAnh || IMG.workshopArt

                return (
                  <HangMucChuongTrinh
                    key={name}
                    ten={name}
                    chiSo={i}
                    slug={slug}
                    hinhAnh={hinhAnhHover}
                  />
                )
              })}
            </div>
          </article>
        ))}
      </section>
      <section className="programme-boundary section-pad">
        <p className="serif">
          Các chương trình mang tính giáo dục, trải nghiệm và phát triển cá
          nhân.
        </p>
        <p>
          Chúng không cấp quyền hành nghề khám, chữa bệnh hoặc trị liệu tâm lý.
        </p>
        <Link to="/lien-he" className="button-link">
          Liên hệ về chương trình
        </Link>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
