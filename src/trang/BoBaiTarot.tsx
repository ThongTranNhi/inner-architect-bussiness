import { useEffect, useRef, useState } from "react"
import { Link } from "../dieu-huong"
import { IMG } from "../du-lieu/hinh-anh"
import { ParentLink } from "./chung"

interface LaBai {
  so: string
  ten: string
  tenAnh: string
  tuKhoa: string
  yNghiaXuoi: string
  yNghiaNguoc: string
  thongDiep: string
}

const DANH_SACH_AN_CHINH: LaBai[] = [
  {
    so: "00",
    ten: "Kẻ Ngốc",
    tenAnh: "The Fool",
    tuKhoa: "Khởi đầu mới, ngây thơ, tự do",
    yNghiaXuoi:
      "Bạn đang bước vào một hành trình mới đầy hứng khởi. Hãy tin vào trực giác và dũng cảm đón nhận cơ hội.",
    yNghiaNguoc:
      "Cần chậm lại và quan sát kỹ trước khi quyết định; tránh hành động bốc đồng khi chưa có kế hoạch.",
    thongDiep: "Hãy tin vào chính mình, nhưng đừng để sự mù quáng cản trở bước chân bạn.",
  },
  {
    so: "01",
    ten: "Pháp Sư",
    tenAnh: "The Magician",
    tuKhoa: "Tiềm năng, sáng tạo, hiện thực hóa",
    yNghiaXuoi:
      "Bạn đã có đủ công cụ và năng lực để biến ý tưởng thành hiện thực. Đây là lúc hành động quyết đoán.",
    yNghiaNguoc:
      "Sự thiếu tập trung hoặc phân vân có thể làm phân tán nguồn lực quý giá của bạn.",
    thongDiep: "Bạn có quyền năng kiến tạo sự chuyển hóa, hãy dùng nó với sự tỉnh thức.",
  },
  {
    so: "02",
    ten: "Nữ Tư Tế",
    tenAnh: "The High Priestess",
    tuKhoa: "Trực giác, tĩnh lặng, chiều sâu",
    yNghiaXuoi:
      "Khoảng thời gian cần thiết để lắng nghe tiếng nói nội tâm. Câu trả lời sâu sắc nhất đang nằm trong sự yên ắng.",
    yNghiaNguoc:
      "Có thể bạn đang phớt lờ trực giác hoặc để những suy nghĩ lý trí bên ngoài gây nhiễu loạn.",
    thongDiep: "Hãy tin vào giọng nói tĩnh lặng bên trong bạn — sự thật luôn hiện diện ở đó.",
  },
  {
    so: "03",
    ten: "Nữ Hoàng",
    tenAnh: "The Empress",
    tuKhoa: "Nuôi dưỡng, tình yêu, trù phú",
    yNghiaXuoi:
      "Giai đoạn sinh sôi và phát triển. Hãy dành sự dịu dàng chăm sóc thân thể và nuôi dưỡng các dự định mới.",
    yNghiaNguoc:
      "Cảm giác cạn kiệt năng lượng vì cho đi quá nhiều mà quên chăm sóc chính mình.",
    thongDiep: "Hãy trân trọng và bao dung với chính mình trước khi san sẻ tình thương ra bên ngoài.",
  },
  {
    so: "04",
    ten: "Hoàng Đế",
    tenAnh: "The Emperor",
    tuKhoa: "Trật tự, kỷ luật, ranh giới",
    yNghiaXuoi:
      "Bạn đang củng cố sự ổn định và thiết lập nền tảng vững vàng cho tương lai.",
    yNghiaNguoc:
      "Sự kiểm soát quá mức có thể tạo nên áp lực và sự căng cứng không cần thiết.",
    thongDiep: "Làm chủ cuộc đời mình bằng sự vững chãi nhưng đừng quên giữ cho tâm hồn sự mềm mại.",
  },
  {
    so: "06",
    ten: "Những Người Yêu Nhau",
    tenAnh: "The Lovers",
    tuKhoa: "Kết nối, lựa chọn chân thật",
    yNghiaXuoi:
      "Sự đồng điệu và hòa hợp sâu sắc. Nhắc nhở bạn đưa ra lựa chọn phù hợp với giá trị sống cốt lõi.",
    yNghiaNguoc:
      "Sự do dự, mâu thuẫn giữa lý trí và cảm xúc chưa tìm được điểm cân bằng.",
    thongDiep: "Lắng nghe trái tim nhưng hãy soi sáng nó bằng sự tỉnh táo và hiểu biết.",
  },
  {
    so: "08",
    ten: "Sức Mạnh",
    tenAnh: "Strength",
    tuKhoa: "Nội lực, nhẫn nại, lòng trắc ẩn",
    yNghiaXuoi:
      "Sức mạnh thực sự đến từ sự bình thản, kiên trì và khả năng ôm ấp cảm xúc thay vì cưỡng ép hay giận dữ.",
    yNghiaNguoc:
      "Hoài nghi bản thân hoặc để nỗi sợ vô thức chi phối hành động hàng ngày.",
    thongDiep: "Nội lực bền bỉ nhất luôn bắt nguồn từ lòng kiên nhẫn và sự dịu dàng với chính mình.",
  },
  {
    so: "09",
    ten: "Ẩn Sĩ",
    tenAnh: "The Hermit",
    tuKhoa: "Soi sáng nội tâm, chiêm nghiệm",
    yNghiaXuoi:
      "Khoảng lùi cần thiết để tách khỏi ồn ào và tìm lại trật tự bên trong. Ngọn đèn soi đường luôn có sẵn trong bạn.",
    yNghiaNguoc:
      "Sự thu mình tiêu cực hoặc cảm giác cô lập, xa rời thực tại.",
    thongDiep: "Ngọn đèn chân lý bạn đang kiếm tìm không ở đâu xa, nó sáng lên khi bạn chịu ngồi yên lại.",
  },
  {
    so: "10",
    ten: "Bánh Xe Số Phận",
    tenAnh: "Wheel of Fortune",
    tuKhoa: "Chu kỳ, chuyển biến, thuận dòng",
    yNghiaXuoi:
      "Vạn vật biến chuyển theo chu kỳ tự nhiên. Một cơ hội mới đang đến, hãy sẵn sàng đón nhận sự đổi thay.",
    yNghiaNguoc:
      "Cố bám víu vào những điều đã qua khiến bạn mệt mỏi và mất cân bằng.",
    thongDiep: "Học cách thả lỏng và đồng hành cùng dòng chảy cuộc sống thay vì kháng cự quy luật biến thiên.",
  },
  {
    so: "13",
    ten: "Chuyển Hóa",
    tenAnh: "Death",
    tuKhoa: "Khép lại chu kỳ cũ, tái sinh",
    yNghiaXuoi:
      "Không phải sự kết thúc thể xác, mà là sự khép lại một mô thức cũ để nhường chỗ cho một khởi đầu mới mẻ.",
    yNghiaNguoc:
      "Nỗi sợ buông bỏ giữ chân bạn trong những vết thương cũ không còn phù hợp.",
    thongDiep: "Mỗi sự kết thúc đều mở ra cánh cửa dẫn bạn đến phiên bản chân thực và tự do hơn.",
  },
  {
    so: "17",
    ten: "Ngôi Sao",
    tenAnh: "The Star",
    tuKhoa: "Hy vọng, chữa lành, niềm tin",
    yNghiaXuoi:
      "Ánh sáng xoa dịu sau bão giông. Bạn đang được chữa lành và tìm lại niềm tin vào tương lai tươi sáng.",
    yNghiaNguoc:
      "Cảm giác mỏi mệt tạm thời khiến bạn chưa nhận thấy những điều tốt đẹp đang hiện diện.",
    thongDiep: "Dù đêm có tối đến đâu, luôn có một vì sao tĩnh lặng dẫn lối cho bạn trở về sự an yên.",
  },
  {
    so: "19",
    ten: "Mặt Trời",
    tenAnh: "The Sun",
    tuKhoa: "Niềm vui, sáng rõ, sức sống",
    yNghiaXuoi:
      "Sự thấu hiểu rõ ràng và năng lượng ấm áp rạng rỡ. Mọi u ám tan biến nhường chỗ cho niềm vui thuần khiết.",
    yNghiaNguoc:
      "Cần thêm chút thời gian để những đám mây hoài nghi tan biến hoàn toàn.",
    thongDiep: "Bạn hoàn toàn xứng đáng với niềm vui và sự trọn vẹn của hiện tại.",
  },
  {
    so: "21",
    ten: "Thế Giới",
    tenAnh: "The World",
    tuKhoa: "Hoàn tất, viên mãn, tầng thức mới",
    yNghiaXuoi:
      "Bạn đã hoàn thành một bài học lớn và bước lên một tầng nhận thức mới. Một chu kỳ thành tựu trọn vẹn.",
    yNghiaNguoc:
      "Còn một bước nhỏ cần hoàn thành trọn vẹn trước khi chuyển tiếp sang chặng đường tiếp theo.",
    thongDiep: "Hãy tự hào về hành trình bạn đã can đảm đi qua — mọi trải nghiệm đều có giá trị sâu sắc.",
  },
]

interface NguyenToInfo {
  id: string
  ten: string
  tenBo: string
  yNghia: string
  trongCuocSong: string
  khiXuatHienNhieu: string
  tuKhoa: string
}

const BON_NGUYEN_TO: NguyenToInfo[] = [
  {
    id: "nuoc",
    ten: "Nguyên tố Nước",
    tenBo: "Bộ Cốc (Cups)",
    yNghia: "Đại diện cho cảm xúc, tình yêu thương, trực giác và thế giới tâm hồn.",
    trongCuocSong: "Khả năng thấu cảm, các mối quan hệ sâu sắc và nhu cầu kết nối chân thành.",
    khiXuatHienNhieu: "Cảm xúc đang đóng vai trò trung tâm; bạn cần lắng nghe trái tim và tự chữa lành.",
    tuKhoa: "Tình cảm · Trực giác · Thấu cảm · Chữa lành",
  },
  {
    id: "lua",
    ten: "Nguyên tố Lửa",
    tenBo: "Bộ Gậy (Wands)",
    yNghia: "Đại diện cho ngọn lửa đam mê, ý chí hành động và năng lượng sáng tạo.",
    trongCuocSong: "Sự nghiệp, dự án mới, sự tự tin và tinh thần dám dấn thân đối diện thử thách.",
    khiXuatHienNhieu: "Bạn đang trong giai đoạn bùng nổ hành động; cần điều tiết năng lượng đúng mục tiêu.",
    tuKhoa: "Ý chí · Đam mê · Hành động · Sáng tạo",
  },
  {
    id: "khi",
    ten: "Nguyên tố Khí",
    tenBo: "Bộ Kiếm (Swords)",
    yNghia: "Đại diện cho trí tuệ, tư duy lý trí, sự thật và ranh giới tinh thần.",
    trongCuocSong: "Cách bạn đối diện thử thách, gỡ bỏ niềm tin sai lệch và giữ sự tỉnh táo trước biến động.",
    khiXuatHienNhieu: "Tâm trí bạn đang căng thẳng; hãy dùng sự thật khách quan thay vì để cảm xúc chi phối.",
    tuKhoa: "Lý trí · Sự thật · Trí tuệ · Ranh giới",
  },
  {
    id: "dat",
    ten: "Nguyên tố Đất",
    tenBo: "Bộ Xu (Pentacles)",
    yNghia: "Đại diện cho tài chính, thể chất, công việc và sự ổn định thực tế.",
    trongCuocSong: "Sức khỏe thể chất, nền tảng kinh tế, tính kỷ luật và những thành quả hữu hình.",
    khiXuatHienNhieu: "Cần tập trung vào kế hoạch kiên nhẫn, chăm sóc thân thể và xây dựng sự an toàn bền vững.",
    tuKhoa: "Vật chất · Tài chính · Thể chất · Ổn định",
  },
]

export function BoBaiTarotPage() {
  const [laBaiDangChon, setLaBaiDangChon] = useState<LaBai>(DANH_SACH_AN_CHINH[0])
  const [nguyenToDangChon, setNguyenToDangChon] = useState<string>("nuoc")
  const [thongDiepNgauNhien, setThongDiepNgauNhien] = useState<LaBai | null>(null)
  const [dangRutBai, setDangRutBai] = useState(false)
  const [cuonY, setCuonY] = useState(0)
  const [posterTilt, setPosterTilt] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Cuộn lên đầu trang khi mở
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Theo dõi vị trí cuộn trang để kích hoạt hiệu ứng thị sai parallax và thanh tiến trình
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

  // Hiệu ứng cuộn chuột xuất hiện phần tử (Scroll Reveal with IntersectionObserver)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const elms = containerRef.current?.querySelectorAll(".tarot-reveal-on-scroll")
    if (!elms || elms.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )

    elms.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Hiệu ứng nghiêng 3D poster ảnh bìa khi rê chuột
  const xuLyMouseMovePoster = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setPosterTilt({ x: x * 8, y: -y * 8 })
  }

  const xuLyMouseLeavePoster = () => {
    setPosterTilt({ x: 0, y: 0 })
  }

  const xuLyRutBaiNgauNhien = () => {
    setDangRutBai(true)
    setTimeout(() => {
      const ngauNhien =
        DANH_SACH_AN_CHINH[Math.floor(Math.random() * DANH_SACH_AN_CHINH.length)]
      setThongDiepNgauNhien(ngauNhien)
      setDangRutBai(false)
    }, 450)
  }

  const nguyenToHienTai =
    BON_NGUYEN_TO.find((nt) => nt.id === nguyenToDangChon) || BON_NGUYEN_TO[0]

  return (
    <main ref={containerRef} className="bg-[#FAF7F2] text-[#27190F] relative">
      {/* Khối CSS Animation và Keyframes chuyên biệt */}
      <style>{`
        @keyframes tarotFadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tarotFadeInScale {
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
            transform: translateY(6px);
          }
          100% {
            opacity: 0;
            transform: translateY(6px);
          }
        }
        .tarot-anim-item {
          animation: tarotFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .tarot-banner-anim {
          animation: tarotFadeInScale 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }
        .mouse-dot-anim {
          animation: mouseScrollDot 1.6s infinite ease-in-out;
        }
        .tarot-reveal-on-scroll {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .tarot-reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .tarot-anim-item, .tarot-banner-anim, .mouse-dot-anim, .tarot-reveal-on-scroll {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Top Header Breadcrumb */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 pt-8 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between py-4 border-b border-[#27190F]/10 mb-8 sm:mb-12">
          <span
            className="tarot-anim-item inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE7DB]/70 border border-[#27190F]/8 text-xs uppercase tracking-widest text-[#7B6B5D] font-medium"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B75E2A]"></span>
            Huyền Giới Tarot · Cẩm Nang Nhập Môn
          </span>
          <div className="tarot-anim-item" style={{ animationDelay: "0.1s" }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold text-[#6E5949] bg-[#EFE7DB] hover:bg-[#B75E2A] hover:text-white transition-all shadow-xs group"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>

        {/* Hero Section: Clean, Bright & Animated Editorial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div
              className="tarot-anim-item inline-block px-3 py-1 rounded-full bg-[#EFE7DB] border border-[#27190F]/10 text-[#6B5A4D] text-xs font-semibold uppercase tracking-wider mb-4 w-fit"
              style={{ animationDelay: "0.15s" }}
            >
              Cánh cổng kết nối trực giác &amp; chữa lành
            </div>
            <h1
              className="tarot-anim-item serif text-4xl sm:text-5xl md:text-6xl text-[#27190F] tracking-tight leading-[1.08] mb-5"
              style={{ animationDelay: "0.2s" }}
            >
              Khám Phá Bộ Bài Tarot — <br className="hidden sm:block" />
              <em className="text-[#B75E2A]">Tấm Gương Soi Chiếu Tiềm Thức</em>
            </h1>
            <p
              className="tarot-anim-item serif italic text-xl sm:text-2xl text-[#6B5A4D] leading-snug mb-6"
              style={{ animationDelay: "0.25s" }}
            >
              “Tarot không nói về tương lai định sẵn — Tarot nói về bạn, cảm xúc và những lựa chọn của chính bạn.”
            </p>
            <p
              className="tarot-anim-item text-[#554538] text-base sm:text-lg leading-relaxed max-w-xl mb-8"
              style={{ animationDelay: "0.3s" }}
            >
              Được trích lược từ tác phẩm <strong>Huyền Giới Tarot</strong> do <strong>Founder Khiêm Võ</strong> biên soạn, trang hướng dẫn này giải mã toàn bộ cấu trúc 78 lá bài một cách khoa học, sâu sắc và sáng rõ cho những người lần đầu tiếp cận.
            </p>

            {/* Quick Stat Highlights */}
            <div
              className="tarot-anim-item grid grid-cols-3 gap-3 mb-8"
              style={{ animationDelay: "0.35s" }}
            >
              <div className="p-4 rounded-2xl bg-[#F8F4ED] border border-[#27190F]/10 text-center hover:border-[#B75E2A]/30 transition-all duration-300">
                <span className="block text-2xl sm:text-3xl serif font-bold text-[#27190F]">78</span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#6B5A4D] font-medium">Lá Bài Chuẩn Mực</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F4ED] border border-[#27190F]/10 text-center hover:border-[#B75E2A]/30 transition-all duration-300">
                <span className="block text-2xl sm:text-3xl serif font-bold text-[#B75E2A]">22</span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#6B5A4D] font-medium">Lá Ẩn Chính</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F4ED] border border-[#27190F]/10 text-center hover:border-[#B75E2A]/30 transition-all duration-300">
                <span className="block text-2xl sm:text-3xl serif font-bold text-[#484B3D]">04</span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#6B5A4D] font-medium">Nguyên Tố Đời Sống</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="tarot-anim-item flex flex-wrap items-center gap-3.5"
              style={{ animationDelay: "0.4s" }}
            >
              <a
                href="#cau-truc-bo-bai"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#B75E2A] hover:bg-[#9E4D1F] text-white font-medium text-sm transition-all duration-300 shadow-xs hover:-translate-y-0.5 hover:shadow-md"
                style={{ color: "#ffffff", backgroundColor: "#B75E2A" }}
              >
                <span>Tìm hiểu cấu trúc bài</span>
                <span>↓</span>
              </a>
              <a
                href="#rut-bai-hang-ngay"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#EFE7DB] hover:bg-[#E5DACE] text-[#27190F] text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 border border-[#27190F]/10"
              >
                <span>Thực hành rút bài</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right Hero Visual Card with 3D Tilt Effect */}
          <div className="lg:col-span-5 tarot-banner-anim">
            <div
              onMouseMove={xuLyMouseMovePoster}
              onMouseLeave={xuLyMouseLeavePoster}
              style={{
                transform: `perspective(1000px) rotateX(${posterTilt.y}deg) rotateY(${posterTilt.x}deg)`,
                transition: posterTilt.x === 0 && posterTilt.y === 0 ? "transform 0.5s ease" : "none",
              }}
              className="rounded-3xl overflow-hidden border border-[#27190F]/15 bg-[#F8F4ED] shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <img
                src={IMG.tarotHuyenGioiCover || "/assets/huyen-gioi-tarot/huyen-gioi-tarot-cover.jpg"}
                alt="Bộ bài Huyền Giới Tarot - Tác giả Tĩnh Khiêm (Khiêm Võ)"
                loading="lazy"
                decoding="async"
                className="w-full h-[380px] sm:h-[460px] lg:h-[500px] object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="p-5 sm:p-6 bg-[#FAF7F2] border-t border-[#27190F]/10">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#B75E2A] font-semibold mb-1">
                  HUYỀN GIỚI TAROT · TĨNH KHIÊM (KHIÊM VÕ)
                </p>
                <h3 className="serif text-lg sm:text-xl text-[#27190F] font-medium mb-1.5">
                  Ánh sáng dịu dàng của trực giác
                </h3>
                <p className="text-xs text-[#554538] leading-relaxed">
                  Bộ bài lấy cảm hứng từ phong cách fantasy nhiệm màu, kết nối năng lượng thiên nhiên, suối nguồn chữa lành và chiều sâu tâm thức.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue Indicator */}
        <div className="tarot-anim-item flex justify-center mt-12 sm:mt-16" style={{ animationDelay: "0.5s" }}>
          <a
            href="#chuong-01"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#EFE7DB]/60 border border-[#27190F]/10 text-xs text-[#6B5A4D] hover:text-[#B75E2A] hover:bg-[#EFE7DB] transition-all duration-200"
          >
            <span className="w-3.5 h-5 rounded-full border border-[#27190F]/30 flex items-start justify-center p-0.5">
              <span className="w-1 h-1.5 rounded-full bg-[#B75E2A] mouse-dot-anim"></span>
            </span>
            <span>Cuộn chuột khám phá 78 lá bài</span>
          </a>
        </div>
      </section>

      {/* Chapter 1: Tarot là gì (Bố cục tạp chí đan xen Ảnh thực tế & Scroll Reveal) */}
      <section id="chuong-01" className="py-14 sm:py-20 bg-[#F4EDE4] border-y border-[#27190F]/10 tarot-reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Photo Left with subtle Parallax */}
            <div className="lg:col-span-5">
              <div
                className="rounded-3xl overflow-hidden border border-[#27190F]/15 bg-[#FAF7F2] shadow-sm transition-transform duration-300 hover:shadow-md"
                style={{
                  transform: `translateY(${Math.min(12, Math.max(-12, (cuonY - 600) * 0.02))}px)`,
                }}
              >
                <img
                  src={IMG.journalReading || "/assets/journal/journal-tarot-reading-horizontal.webp"}
                  alt="Không gian đọc Tarot với ánh nến và biểu tượng trực giác"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="p-4 bg-[#FAF7F2] border-t border-[#27190F]/10 text-xs text-[#6B5A4D] italic text-center">
                  Phiên trải bài Tarot soi chiếu nội tâm trong không gian yên tĩnh
                </div>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B75E2A] mb-2">
                CHƯƠNG 01 · BẢN CHẤT CỐT LÕI
              </p>
              <h2 className="serif text-3xl sm:text-4xl text-[#27190F] leading-tight mb-4">
                Tarot là gì &amp; Tại sao lại có thể soi tỏ tâm trí bạn?
              </h2>
              <p className="text-[#554538] text-base leading-relaxed mb-6">
                Tarot không phải công cụ tiên đoán tương lai đóng khung, mà là ngôn ngữ hình ảnh cổ mẫu kết nối trực tiếp với tiềm thức của bạn.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Point 1 */}
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#27190F]/10 hover:-translate-y-1 hover:shadow-xs transition-all duration-300">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B5A4D] block mb-2">
                    01. Ngộ nhận thường gặp
                  </span>
                  <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                    Sợ hãi các lá bài mang hình ảnh mạnh hoặc trao quyền quyết định cuộc đời cho người đọc bài bên ngoài.
                  </p>
                </div>

                {/* Point 2 */}
                <div className="p-5 rounded-2xl bg-[#F8F4ED] border border-[#B75E2A]/30 hover:-translate-y-1 hover:shadow-xs transition-all duration-300">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B75E2A] block mb-2">
                    02. Bản chất soi chiếu
                  </span>
                  <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                    Chiếc gương phản chiếu những góc khuất tâm lý, giúp nhận diện cảm xúc thật và trao lại quyền tự chủ cho bạn.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EFE7DB] border-l-4 border-[#B75E2A] text-xs sm:text-sm text-[#27190F] serif italic">
                “Tarot không tạo ra tương lai của bạn. Bạn chính là kiến trúc sư kiến tạo nên nó.”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: Cấu trúc 78 Lá & 4 Nguyên Tố (Đan xen Ảnh Đồ Họa Cấu Trúc) */}
      <section id="cau-truc-bo-bai" className="py-16 sm:py-20 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 tarot-reveal-on-scroll">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B75E2A] mb-2">
            CHƯƠNG 02 · CẤU TRÚC BỘ BÀI
          </p>
          <h2 className="serif text-3xl sm:text-4xl text-[#27190F] leading-tight mb-3">
            Bản Đồ 78 Lá Bài — Hai Tầng Nhận Thức
          </h2>
          <p className="text-[#554538] text-base leading-relaxed">
            22 Lá Ẩn Chính đại diện cho bài học lớn của linh hồn; 56 Lá Ẩn Phụ phân bổ theo 4 nguyên tố đời sống thường nhật.
          </p>
        </div>

        {/* Visual Showcase: 2 Banner Cards with Hover Scaling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-3xl overflow-hidden border border-[#27190F]/12 bg-[#F8F4ED] shadow-xs flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="overflow-hidden h-[220px]">
              <img
                src="/assets/tarot-can-ban/07-bo-an-chinh-major-arcana.webp"
                alt="Cấu trúc Bộ Ẩn Chính Major Arcana"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#B75E2A] block mb-1">
                  Tầng Thức Linh Hồn · 22 Lá
                </span>
                <h3 className="serif text-xl text-[#27190F] mb-2">Bộ Ẩn Chính (Major Arcana)</h3>
                <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                  Tượng trưng cho các bước ngoặt lớn, thử thách và bài học tiến hóa tâm thức từ The Fool (00) đến The World (21).
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-[#27190F]/12 bg-[#F8F4ED] shadow-xs flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="overflow-hidden h-[220px]">
              <img
                src="/assets/tarot-can-ban/09-y-nghia-56-la-an-phu.webp"
                alt="Cấu trúc 56 Lá Ẩn Phụ Minor Arcana"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#484B3D] block mb-1">
                  Đời Sống Thường Nhật · 56 Lá
                </span>
                <h3 className="serif text-xl text-[#27190F] mb-2">Bộ Ẩn Phụ (Minor Arcana)</h3>
                <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                  Phản ánh các khía cạnh cụ thể: tình cảm (Cốc), ý chí hành động (Gậy), lý trí &amp; ranh giới (Kiếm), tài chính thực tế (Xu).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Nguyên Tố Tabs - Clean, High Contrast */}
        <div className="mb-14">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-6">
            {BON_NGUYEN_TO.map((nt) => {
              const laChon = nguyenToDangChon === nt.id
              return (
                <button
                  key={nt.id}
                  type="button"
                  onClick={() => setNguyenToDangChon(nt.id)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    laChon
                      ? "bg-[#B75E2A] text-white shadow-xs -translate-y-0.5 border border-[#B75E2A]"
                      : "bg-[#EFE7DB] text-[#4A3B2C] border border-[#27190F]/10 hover:bg-[#E5DACE]"
                  }`}
                  style={
                    laChon
                      ? { color: "#ffffff", backgroundColor: "#B75E2A" }
                      : { color: "#4A3B2C", backgroundColor: "#EFE7DB" }
                  }
                >
                  {nt.ten} ({nt.tenBo.split(" ")[1]})
                </button>
              )
            })}
          </div>

          {/* Active Element Display Card with Smooth Fade */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F8F4ED] border border-[#27190F]/12 shadow-xs transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <div className="inline-block px-3 py-1 rounded-full bg-[#EFE7DB] border border-[#27190F]/10 text-xs font-semibold text-[#4A3B2C] uppercase tracking-wider mb-2">
                  {nguyenToHienTai.tenBo}
                </div>
                <h3 className="serif text-2xl text-[#27190F] mb-2">
                  {nguyenToHienTai.ten} — {nguyenToHienTai.tuKhoa}
                </h3>
                <p className="text-[#554538] text-sm leading-relaxed mb-4">
                  {nguyenToHienTai.yNghia}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#27190F]/10 hover:border-[#B75E2A]/30 transition-all duration-200">
                    <span className="text-xs uppercase font-bold text-[#B75E2A] block mb-1">
                      Trong đời sống hàng ngày
                    </span>
                    <p className="text-xs text-[#4A3B2C] leading-relaxed">
                      {nguyenToHienTai.trongCuocSong}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#27190F]/10 hover:border-[#B75E2A]/30 transition-all duration-200">
                    <span className="text-xs uppercase font-bold text-[#27190F] block mb-1">
                      Khi xuất hiện nhiều trong trải bài
                    </span>
                    <p className="text-xs text-[#4A3B2C] leading-relaxed">
                      {nguyenToHienTai.khiXuatHienNhieu}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 p-5 rounded-2xl bg-[#EFE7DB] border border-[#27190F]/10 text-[#27190F]">
                <span className="text-xs uppercase font-bold text-[#B75E2A] tracking-wider block mb-2">
                  Cấu trúc 14 lá trong bộ
                </span>
                <p className="text-xs text-[#554538] leading-relaxed mb-3">
                  10 lá số (Át đến 10) phản ánh tiến trình từ khởi sinh đến tròn vẹn; 4 lá Hoàng Gia đại diện cho các mức độ làm chủ năng lượng.
                </p>
                <p className="text-[11px] text-[#6B5A4D] italic">
                  Cân bằng 4 nguyên tố để đạt trạng thái thân tâm an định.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 22 Lá Ẩn Chính: Major Arcana Explorer */}
        <div className="pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B75E2A] mb-1">
                22 LÁ ẨN CHÍNH (MAJOR ARCANA)
              </p>
              <h3 className="serif text-2xl sm:text-3xl text-[#27190F]">
                Hành Trình Linh Hồn (The Fool&apos;s Journey)
              </h3>
            </div>
            <p className="text-xs text-[#6B5A4D]">
              Bấm vào từng lá bài bên dưới để tra cứu thông điệp phản tư:
            </p>
          </div>

          {/* Cards Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2 mb-6">
            {DANH_SACH_AN_CHINH.map((la) => {
              const dangChon = laBaiDangChon.so === la.so
              return (
                <button
                  key={la.so}
                  type="button"
                  onClick={() => setLaBaiDangChon(la)}
                  className={`p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                    dangChon
                      ? "bg-[#B75E2A] text-white border-[#B75E2A] shadow-xs -translate-y-0.5"
                      : "bg-[#F8F4ED] text-[#27190F] border-[#27190F]/10 hover:border-[#B75E2A]/40 hover:bg-[#EFE7DB] hover:-translate-y-0.5"
                  }`}
                  style={
                    dangChon
                      ? { color: "#ffffff", backgroundColor: "#B75E2A" }
                      : { color: "#27190F", backgroundColor: "#F8F4ED" }
                  }
                >
                  <span
                    className="text-[11px] font-bold block mb-0.5"
                    style={{ color: dangChon ? "#ffffff" : "#B75E2A" }}
                  >
                    #{la.so}
                  </span>
                  <p className="text-xs font-semibold truncate leading-tight" style={{ color: dangChon ? "#ffffff" : "#27190F" }}>
                    {la.ten}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: dangChon ? "rgba(255,255,255,0.8)" : "#7B6B5D" }}>
                    {la.tenAnh}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Detailed Selected Card View */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F8F4ED] text-[#27190F] border border-[#27190F]/15 shadow-xs transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <div className="inline-block px-3 py-1 rounded-full bg-[#EFE7DB] border border-[#27190F]/10 text-xs font-bold text-[#B75E2A] mb-2">
                  LÁ BÀI #{laBaiDangChon.so}
                </div>
                <h4 className="serif text-2xl sm:text-3xl text-[#27190F] mb-1">
                  {laBaiDangChon.ten} — <em className="text-[#6B5A4D]">{laBaiDangChon.tenAnh}</em>
                </h4>
                <p className="text-xs uppercase tracking-wider text-[#6B5A4D] font-medium mb-5">
                  {laBaiDangChon.tuKhoa}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#27190F]/10 hover:border-[#B75E2A]/30 transition-all duration-200">
                    <span className="text-xs uppercase font-bold text-[#B75E2A] block mb-1">
                      Ý nghĩa xuôi (Upright)
                    </span>
                    <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                      {laBaiDangChon.yNghiaXuoi}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#27190F]/10 hover:border-[#6B5A4D]/30 transition-all duration-200">
                    <span className="text-xs uppercase font-bold text-[#6B5A4D] block mb-1">
                      Ý nghĩa ngược (Reversed)
                    </span>
                    <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                      {laBaiDangChon.yNghiaNguoc}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#EFE7DB] border-l-4 border-[#B75E2A]">
                  <span className="text-xs uppercase tracking-wider text-[#B75E2A] font-bold block mb-1">
                    Thông điệp chữa lành từ Huyền Giới:
                  </span>
                  <p className="text-sm serif italic text-[#27190F] leading-relaxed">
                    “{laBaiDangChon.thongDiep}”
                  </p>
                </div>
              </div>

              {/* Card Right Info badge */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-[#FAF7F2] border border-[#27190F]/10 text-[#27190F]">
                <span className="text-xs uppercase font-bold tracking-widest text-[#B75E2A] block mb-2">
                  LƯU Ý KHI ĐỌC BỘ ẨN CHÍNH
                </span>
                <p className="text-xs text-[#554538] leading-relaxed mb-3">
                  Khi một lá bài Ẩn Chính xuất hiện ở vị trí then chốt, nó báo hiệu một bài học cuộc đời quan trọng cần sự lắng nghe sâu sắc.
                </p>
                <div className="pt-3 border-t border-[#27190F]/10 text-xs text-[#7B6B5D] italic">
                  Trích Sách Hướng Dẫn Huyền Giới Tarot
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: 3 Bước Thực Hành Nhập Môn (Đan xen Ảnh Flatlay nghệ thuật & Scroll Reveal) */}
      <section className="py-14 sm:py-20 bg-[#F4EDE4] border-t border-[#27190F]/10 tarot-reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
            {/* Visual Photo Left with subtle Parallax */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div
                className="rounded-3xl overflow-hidden border border-[#27190F]/15 bg-[#FAF7F2] shadow-sm transition-transform duration-300 hover:shadow-md"
                style={{
                  transform: `translateY(${Math.min(12, Math.max(-12, (cuonY - 1400) * 0.02))}px)`,
                }}
              >
                <img
                  src={IMG.journalFlatlay || "/assets/journal/journal-tarot-flatlay-vertical.webp"}
                  alt="Bộ bài Tarot kết hợp sổ ghi chép phản tư hàng ngày"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="p-3.5 bg-[#FAF7F2] border-t border-[#27190F]/10 text-xs text-[#6B5A4D] italic text-center">
                  Thực hành rút bài và viết nhật ký phản tư mỗi ngày
                </div>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B75E2A] mb-2">
                CHƯƠNG 03 · CẨM NANG THỰC HÀNH
              </p>
              <h2 className="serif text-3xl sm:text-4xl text-[#27190F] leading-tight mb-4">
                3 Bước Nhập Môn &amp; Nguyên Tắc Đọc Bài An Toàn
              </h2>
              <p className="text-[#554538] text-base leading-relaxed mb-6">
                Chỉ dẫn căn bản giúp bạn giữ trường năng lượng thanh sạch, tôn trọng ranh giới và kết nối sâu sắc với bộ bài.
              </p>

              <div className="space-y-3.5">
                {/* Step 1 */}
                <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border border-[#27190F]/10 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="w-7 h-7 rounded-lg bg-[#EFE7DB] text-[#B75E2A] flex items-center justify-center serif text-sm font-bold">
                      01
                    </span>
                    <h3 className="serif text-lg text-[#27190F]">Thanh Tẩy &amp; Kích Hoạt</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                    Làm sạch bộ bài bằng khói trầm hương, xô thơm tự nhiên, ánh trăng tròn hoặc đá thạch anh tím để nạp năng lượng thanh sạch.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border border-[#27190F]/10 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="w-7 h-7 rounded-lg bg-[#EFE7DB] text-[#B75E2A] flex items-center justify-center serif text-sm font-bold">
                      02
                    </span>
                    <h3 className="serif text-lg text-[#27190F]">Rút 1 Lá Mỗi Ngày &amp; Viết Phản Tư</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                    Tập thói quen rút ngẫu nhiên 1 lá mỗi sáng, quan sát hình ảnh và viết cảm nhận chân thật để định hình tâm thế an định.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border border-[#27190F]/10 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="w-7 h-7 rounded-lg bg-[#EFE7DB] text-[#B75E2A] flex items-center justify-center serif text-sm font-bold">
                      03
                    </span>
                    <h3 className="serif text-lg text-[#27190F]">3 Nguyên Tắc Đạo Đức Vàng</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                    Luôn đặt câu hỏi mở; giữ tâm bình an khi chạm vào bài; không gượng ép bài phải trả lời theo mong muốn vị kỷ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 4: Interactive Daily Card Reflection Tool */}
      <section id="rut-bai-hang-ngay" className="py-14 sm:py-20 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 tarot-reveal-on-scroll">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F8F4ED] text-[#27190F] border border-[#27190F]/15 shadow-sm text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EFE7DB] text-xs uppercase tracking-widest text-[#B75E2A] font-semibold mb-3">
              THỰC HÀNH TĨNH TÂM HÀNG NGÀY
            </span>
            <h2 className="serif text-3xl sm:text-4xl text-[#27190F] mb-3">
              Rút Một Lá Bài Cho Ngày Hôm Nay
            </h2>
            <p className="text-sm sm:text-base text-[#554538] leading-relaxed mb-6">
              Hít thở sâu 3 nhịp, buông lỏng cơ thể và bấm nút bên dưới để nhận một lời gợi mở từ bộ bài Huyền Giới Tarot.
            </p>

            <button
              type="button"
              onClick={xuLyRutBaiNgauNhien}
              disabled={dangRutBai}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#B75E2A] hover:bg-[#9E4D1F] text-white font-semibold text-sm transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
              style={{ color: "#ffffff", backgroundColor: "#B75E2A" }}
            >
              <span>{dangRutBai ? "Đang kết nối..." : "Rút lá bài ngẫu nhiên"}</span>
              <span>→</span>
            </button>

            {/* Reflection Result Card with Animated Reveal */}
            {thongDiepNgauNhien && (
              <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] border border-[#27190F]/15 text-left shadow-xs tarot-anim-item">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-[#B75E2A] tracking-wider">
                    Lá #{thongDiepNgauNhien.so} · Hôm nay
                  </span>
                </div>
                <h3 className="serif text-2xl text-[#27190F] mb-1">
                  {thongDiepNgauNhien.ten} ({thongDiepNgauNhien.tenAnh})
                </h3>
                <p className="text-xs text-[#6B5A4D] mb-3 uppercase tracking-wider font-medium">
                  {thongDiepNgauNhien.tuKhoa}
                </p>
                <div className="p-4 rounded-xl bg-[#EFE7DB] border-l-4 border-[#B75E2A] mb-3">
                  <p className="text-xs sm:text-sm text-[#27190F] leading-relaxed serif italic">
                    “{thongDiepNgauNhien.thongDiep}”
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#554538] leading-relaxed">
                  <strong>Gợi ý chiêm nghiệm:</strong> {thongDiepNgauNhien.yNghiaXuoi}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Chapter 5: Author Quote & Ecosystem CTA */}
      <section className="py-14 sm:py-20 bg-[#F4EDE4] border-t border-[#27190F]/10 tarot-reveal-on-scroll">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B75E2A] mb-3">
            LỜI KẾT TỪ FOUNDER KHIÊM VÕ
          </p>
          <blockquote className="serif text-2xl sm:text-3xl text-[#27190F] leading-snug mb-6">
            “Huyền Giới không phải là một bộ bài bói toán số phận, mà là một cánh cổng dẫn lối bạn trở về với sự an yên, sáng suốt và bản thể thuần khiết của chính mình.”
          </blockquote>
          <p className="text-sm uppercase tracking-widest text-[#7B6B5D] font-semibold mb-8">
            Tĩnh Khiêm (Khiêm Võ) — Inner Architect™
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/chuong-trinh/tarot-can-ban"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#27190F] hover:bg-[#3D2C20] text-white font-medium text-sm transition-all duration-200 shadow-xs hover:-translate-y-0.5 hover:shadow-md"
              style={{ color: "#ffffff", backgroundColor: "#27190F" }}
            >
              <span>Khóa học Khai Mở Tarot Căn Bản</span>
              <span>→</span>
            </Link>
            <Link
              to="/the-hermit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#B75E2A] hover:bg-[#9E4D1F] text-white font-medium text-sm transition-all duration-200 shadow-xs hover:-translate-y-0.5 hover:shadow-md"
              style={{ color: "#ffffff", backgroundColor: "#B75E2A" }}
            >
              <span>Trải nghiệm phiên 1-1 tại The Hermit</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
