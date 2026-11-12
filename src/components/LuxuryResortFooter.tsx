import { useEffect, useRef, useState } from "react"
import { contactChannels } from "../config/contact"
import { Link } from "../dieu-huong"

/** Danh sách ký tự và tọa độ x tương đối trong SVG wordmark chữ ký. */
const CAC_KY_TU_WORDMARK = [
  { char: "I", x: 80 },
  { char: "N", x: 159 },
  { char: "N", x: 260 },
  { char: "E", x: 353 },
  { char: "R", x: 444 },
  { char: "A", x: 603 },
  { char: "R", x: 701 },
  { char: "C", x: 797 },
  { char: "H", x: 896 },
  { char: "I", x: 974 },
  { char: "T", x: 1048 },
  { char: "E", x: 1136 },
  { char: "C", x: 1227 },
  { char: "T", x: 1321 },
]

/**
 * LuxuryResortFooter — Chân trang phong cách Dark Luxury Resort cao cấp.
 * Tích hợp bố cục 3 cột (Liên hệ / Điều hướng / Ranh giới & Pháp lý)
 * cùng chữ ký SVG giant wordmark trồi lên từng ký tự theo nhịp cuộn trang.
 *
 * @returns Chân trang Dark Luxury Resort
 */
export function LuxuryResortFooter() {
  const footerRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = footerRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Replayable animation on scroll away and return (once: false)
          setIsInView(entry.isIntersecting)
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Nạp phông chữ Cormorant & Outfit theo chuẩn Dark Luxury */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap"
      />

      {/* Scoped font utilities riêng biệt, không ảnh hưởng toàn cục */}
      <style>{`
        .palmoro-footer-serif {
          font-family: 'Cormorant', Georgia, serif;
        }
        .palmoro-footer-sans {
          font-family: 'Outfit', sans-serif;
        }
        @media (prefers-reduced-motion: reduce) {
          .palmoro-animate-transition {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <footer
        ref={footerRef}
        role="contentinfo"
        style={{ backgroundColor: "#27190F" }}
        className="relative w-full min-h-[420px] sm:min-h-[540px] lg:min-h-[759px] flex flex-col justify-between items-start px-6 md:px-10 lg:px-[90px] pt-12 sm:pt-[64px] pb-[6px] gap-12 sm:gap-16 lg:gap-[160px] overflow-hidden box-border"
      >
        {/* Tuyên ngôn định vị thương hiệu ở đầu chân trang */}
        <div
          className="palmoro-animate-transition w-full pb-8 border-b border-[rgba(255,250,240,0.12)]"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(24px)",
            transition:
              "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <p className="palmoro-footer-serif text-[clamp(22px,2.8vw,36px)] text-[#FEFBF0] leading-[135%] font-normal max-w-[960px] m-0">
            INNER ARCHITECT™ hỗ trợ con người xây lại trật tự bên trong,
            <br />
            và trở về với khả năng tự dẫn dắt.
          </p>
        </div>

        {/* 1. TOP ROW: Ba cột (Liên hệ / Điều hướng / Thông tin & Ranh giới) */}
        <div
          className="palmoro-animate-transition flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-between items-start gap-10 md:gap-12 lg:gap-[96px] w-full min-h-[135px]"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(28px)",
            transition:
              "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Cột 1 (Trái) — Liên hệ */}
          <div className="w-full sm:w-[220px] lg:w-[240px] flex flex-col gap-3">
            <h3 className="palmoro-footer-serif text-[#FEFBF0] text-[22px] font-bold leading-[110%] m-0">
              Liên hệ
            </h3>
            <a
              href="mailto:info@innerarchitect.vn"
              className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[17px] leading-[140%] underline whitespace-nowrap hover:opacity-100 transition-opacity duration-200"
            >
              info@innerarchitect.vn
            </a>
            <p className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[15px] leading-[140%] m-0">
              595/18 Cách Mạng Tháng 8, Phường Hoà Hưng, TP. Hồ Chí Minh
            </p>
            <div className="flex items-center gap-4 mt-2">
              {contactChannels.zalo && (
                <a
                  href={contactChannels.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[15px] hover:text-[#FEFBF0] hover:underline transition-colors"
                >
                  Zalo Chat ↗
                </a>
              )}
              {contactChannels.facebook && (
                <a
                  href={contactChannels.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[15px] hover:text-[#FEFBF0] hover:underline transition-colors"
                >
                  Facebook ↗
                </a>
              )}
            </div>
          </div>

          {/* Cột 2 (Giữa) — Điều hướng các trang chính */}
          <nav
            aria-label="Điều hướng chân trang"
            className="flex-1 flex flex-wrap justify-start md:justify-center items-center gap-x-8 gap-y-4 order-3 lg:order-2 w-full"
          >
            {[
              { nhan: "Trang chủ", duongDan: "/" },
              { nhan: "Hệ thống", duongDan: "/he-thong" },
              { nhan: "Journal", duongDan: "/journal" },
              { nhan: "Chương trình", duongDan: "/chuong-trinh" },
              { nhan: "The Hermit", duongDan: "/the-hermit" },
              { nhan: "Khiêm Võ", duongDan: "/vo-khiem" },
              { nhan: "LARA", duongDan: "/lara" },
              { nhan: "Liên hệ", duongDan: "/lien-he" },
              { nhan: "FAQ", duongDan: "/faq" },
            ].map((muc) => (
              <Link
                key={muc.duongDan}
                to={muc.duongDan}
                className="palmoro-footer-serif text-[#FEFBF0] text-[20px] sm:text-[22px] leading-[110%] font-bold no-underline hover:opacity-75 transition-opacity duration-200 whitespace-nowrap"
              >
                {muc.nhan}
              </Link>
            ))}
          </nav>

          {/* Cột 3 (Phải) — Thông tin & Ranh giới */}
          <div className="w-full sm:w-[220px] lg:w-[240px] flex flex-col gap-3 sm:items-end sm:text-right order-2 lg:order-3">
            <h3 className="palmoro-footer-serif text-[#FEFBF0] text-[22px] font-bold leading-[110%] m-0 sm:text-right">
              Thông tin &amp; Ranh giới
            </h3>
            <Link
              to="/he-thong"
              className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[16px] leading-[140%] hover:opacity-100 transition-opacity duration-200 no-underline"
            >
              Đạo đức &amp; Ranh giới
            </Link>
            <Link
              to="/pham-vi-ho-tro"
              className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[16px] leading-[140%] hover:opacity-100 transition-opacity duration-200 no-underline"
            >
              Phạm vi hỗ trợ
            </Link>
            <Link
              to="/chinh-sach-bao-mat"
              className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[16px] leading-[140%] hover:opacity-100 transition-opacity duration-200 no-underline"
            >
              Chính sách bảo mật
            </Link>
            <div className="palmoro-footer-sans text-[rgba(255,250,240,0.65)] text-[13px] leading-[140%] mt-2 sm:text-right">
              <p className="m-0">CÔNG TY TNHH INNER ARCHITECT</p>
              <p className="m-0">MST: 0319353708</p>
            </div>
          </div>
        </div>

        {/* 2. BOTTOM BLOCK: Dòng meta text & Chữ ký giant wordmark SVG */}
        <div className="w-full flex flex-col gap-4 mt-auto">
          {/* Dòng meta text */}
          <div
            className="palmoro-animate-transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full pb-3 border-b border-[rgba(255,250,240,0.1)]"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[14px] sm:text-[16px] leading-[140%]">
              ©2026 INNER ARCHITECT™ · All rights reserved.
            </span>
            <span className="palmoro-footer-sans text-[rgba(255,250,240,0.8)] text-[14px] sm:text-[16px] leading-[140%] text-left sm:text-right">
              Integrated Healing System · TP. Hồ Chí Minh
            </span>
          </div>

          {/* Giant Wordmark SVG với animation từng ký tự trồi lên theo nhịp */}
          <div
            className="palmoro-animate-transition w-full flex items-center justify-center overflow-hidden"
            style={{
              opacity: isInView ? 0.22 : 0,
              transform: isInView ? "translateY(0)" : "translateY(120px)",
              transition:
                "opacity 1.15s cubic-bezier(0.16, 1, 0.3, 1), transform 1.15s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg
              viewBox="0 0 1420 280"
              className="w-full max-h-[320px] select-none pointer-events-none"
              fill="#F4F5EB"
              role="img"
              aria-label="INNER ARCHITECT™ signature wordmark"
            >
              {CAC_KY_TU_WORDMARK.map((item, index) => (
                <text
                  key={`${item.char}-${index}`}
                  x={item.x}
                  y={200}
                  textAnchor="middle"
                  className="palmoro-footer-serif fill-[#F4F5EB] font-bold text-[140px] select-none pointer-events-none"
                  style={{
                    transform: isInView ? "translateY(0)" : "translateY(90px)",
                    opacity: isInView ? 1 : 0,
                    transition: `transform 1.05s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.055}s, opacity 1.05s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.055}s`,
                  }}
                >
                  {item.char}
                </text>
              ))}
              <text
                x={1375}
                y={120}
                textAnchor="middle"
                className="palmoro-footer-serif fill-[#F4F5EB] font-bold text-[48px] select-none pointer-events-none"
                style={{
                  transform: isInView ? "translateY(0)" : "translateY(90px)",
                  opacity: isInView ? 1 : 0,
                  transition: `transform 1.05s cubic-bezier(0.16, 1, 0.3, 1) ${CAC_KY_TU_WORDMARK.length * 0.055}s, opacity 1.05s cubic-bezier(0.16, 1, 0.3, 1) ${CAC_KY_TU_WORDMARK.length * 0.055}s`,
                }}
              >
                ™
              </text>
            </svg>
          </div>
        </div>
      </footer>
    </>
  )
}
