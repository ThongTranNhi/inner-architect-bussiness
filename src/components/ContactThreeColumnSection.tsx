import { useEffect, useRef, useState } from "react"
import { contactChannels, SO_DIEN_THOAI_ZALO } from "../config/contact"
import { IMG } from "../du-lieu/hinh-anh"

/** Nút hành động với hiệu ứng trượt kép hai tầng (Dual-layer sliding text & arrow). */
function SlidingActionButton({
  href,
  label,
  sublabel,
}: {
  href?: string | null
  label: string
  sublabel?: string
}) {
  if (!href) {
    return (
      <div
        className="w-full py-3.5 px-6 rounded-full text-sm text-center italic border select-none font-medium"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          color: "rgba(255, 250, 241, 0.8)",
        }}
      >
        {label} (Đang cập nhật link)
      </div>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="sliding-action-btn group flex items-center justify-between w-full p-2.5 pl-6 rounded-full no-underline transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
      style={{
        backgroundColor: "#FFF5E2",
        color: "#27190F",
        textDecoration: "none",
      }}
    >
      <span
        className="sliding-action-label font-semibold text-base transition-colors duration-200 group-hover:text-[#B75E2A]"
        style={{ color: "#27190F" }}
      >
        {label}
      </span>
      <div
        className="w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center ml-3 shrink-0 group-hover:bg-[#B75E2A]"
        style={{ backgroundColor: "#27190F" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFF5E2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ stroke: "#FFF5E2" }}
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </a>
  )
}

/**
 * ContactThreeColumnSection — Khối Liên hệ 3 cột cao cấp phong cách Glowence / Palmora:
 * - Cột 1: Thông điệp mở đầu hành trình + Ảnh không gian The Hermit bo góc lớn zoom khi hover.
 * - Cột 2: Bộ chọn lịch ngày tương tác (Day-picker) + Giờ đón tiếp thực tế.
 * - Cột 3: Thẻ kết nối Dark Luxury (#27190F) với nút Zalo/Facebook hiệu ứng trượt kép hai tầng.
 *
 * @returns Khối liên hệ 3 cột tương tác
 */
export function ContactThreeColumnSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  // Quản lý tháng và ngày chọn trên lịch tương tác
  const [thang, setThang] = useState<1 | 2>(1)
  const [ngayChon, setNgayChon] = useState<number>(25)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsInView(entry.isIntersecting)
        }
      },
      {
        threshold: 0.15,
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Cấu hình các ngày theo tháng
  const danhSachNgay =
    thang === 1
      ? {
          tenThang: "Tháng 1 · 2026",
          khoangTrongDau: 3, // Ngày 1 rơi vào Thứ Năm
          soNgay: 31,
        }
      : {
          tenThang: "Tháng 2 · 2026",
          khoangTrongDau: 6, // Ngày 1 rơi vào Chủ Nhật
          soNgay: 28,
        }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Work+Sans:wght@400;500;600&display=swap"
      />

      <style>{`
        .glowence-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .glowence-sans {
          font-family: 'Work Sans', sans-serif;
        }
        .glowence-dark-card,
        .glowence-dark-card * {
          box-sizing: border-box;
        }
        .cream-page .glowence-dark-card p,
        .contact-page .glowence-dark-card p,
        .glowence-dark-card p {
          color: rgba(255, 250, 241, 0.88) !important;
        }
        .cream-page .glowence-dark-card span,
        .contact-page .glowence-dark-card span,
        .glowence-dark-card span {
          color: inherit;
        }
        .cream-page .glowence-dark-card strong,
        .contact-page .glowence-dark-card strong,
        .glowence-dark-card strong {
          color: #FFFAF1 !important;
        }
        .cream-page .glowence-dark-card a:not(.sliding-action-btn),
        .contact-page .glowence-dark-card a:not(.sliding-action-btn),
        .glowence-dark-card a:not(.sliding-action-btn) {
          color: #FFFAF1 !important;
        }
        .glowence-dark-card a.sliding-action-btn {
          background-color: #FFF5E2 !important;
          color: #27190F !important;
        }
        .glowence-dark-card a.sliding-action-btn:hover {
          background-color: #FFFFFF !important;
        }
        .glowence-dark-card a.sliding-action-btn .sliding-action-label {
          color: #27190F !important;
        }
        .glowence-dark-card a.sliding-action-btn:hover .sliding-action-label {
          color: #B75E2A !important;
        }
        .glowence-dark-card a.sliding-action-btn:hover div {
          background-color: #B75E2A !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .glowence-animate-transition {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <section
        id="contacts-three-column"
        ref={sectionRef}
        aria-label="Kênh liên hệ và giờ mở cửa"
        className="relative w-full z-20 overflow-hidden select-none px-6 sm:px-12 lg:px-[90px] py-16 lg:py-[96px] bg-[#FAF7F2] text-[#3B3636] glowence-sans"
      >
        <div className="max-w-[1420px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT 1 (lg:col-span-4) — Tiêu đề + Ảnh không gian */}
          <div
            className="glowence-animate-transition lg:col-span-4 flex flex-col justify-between gap-8 h-full"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(-40px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div>
              <p className="text-[#B75E2A] font-medium text-base sm:text-lg uppercase tracking-wider leading-[150%] mb-3">
                LIÊN HỆ · CONTACTS
              </p>
              <h2 className="glowence-serif text-4xl sm:text-5xl lg:text-[52px] leading-[1.08] tracking-tight text-[#3B3636] font-semibold mb-4">
                Sẵn sàng bắt đầu hành trình của bạn?
              </h2>
              <p className="text-[#3B3636]/85 text-base sm:text-lg leading-[150%] pt-1">
                Nhắn trực tiếp qua Zalo hoặc Fanpage để được trao đổi về nhu cầu,
                thời lượng và lựa chọn hình thức đồng hành phù hợp nhất với bạn.
              </p>
            </div>

            {/* Thẻ ảnh không gian The Hermit với hiệu ứng zoom khi hover */}
            <div className="mt-auto h-[260px] sm:h-[290px] rounded-[28px] overflow-hidden shadow-md bg-[#3B3636]/5 relative group">
              <img
                src={IMG.hermitKhongGianQuan}
                alt="Không gian trà đạo tĩnh lặng tại The Hermit"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5 pointer-events-none">
                <span className="text-white/95 text-xs sm:text-sm font-medium tracking-wide">
                  The Hermit · Không gian trà đạo &amp; Soi chiếu
                </span>
              </div>
            </div>
          </div>

          {/* CỘT 2 (lg:col-span-4) — Lịch ngày tương tác + Giờ đón khách */}
          <div
            className="glowence-animate-transition lg:col-span-4 bg-[#FFF5E2] border border-[#3B3636]/10 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm h-fit"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(40px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            {/* Header chuyển tháng */}
            <div className="flex items-center justify-between">
              <h3 className="glowence-serif text-2xl sm:text-[30px] font-semibold text-[#3B3636]">
                {danhSachNgay.tenThang}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setThang(thang === 1 ? 2 : 1)}
                  aria-label="Tháng trước"
                  className="w-9 h-9 rounded-full bg-[#3B3636]/10 hover:bg-[#3B3636]/20 flex items-center justify-center transition-colors cursor-pointer border-0 text-[#3B3636]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setThang(thang === 1 ? 2 : 1)}
                  aria-label="Tháng sau"
                  className="w-9 h-9 rounded-full bg-[#3B3636]/10 hover:bg-[#3B3636]/20 flex items-center justify-center transition-colors cursor-pointer border-0 text-[#3B3636]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Hộp lịch ngày */}
            <div className="bg-[#F6E9D4] rounded-[20px] p-4 sm:p-5 flex flex-col gap-3 border border-[#3B3636]/5">
              {/* Tiêu đề thứ trong tuần */}
              <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#3B3636]/80 pb-1">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>

              {/* Lưới các ngày trong tháng */}
              <div className="grid grid-cols-7 gap-y-1.5 text-center text-sm font-medium">
                {/* Các ô trống đầu tháng */}
                {Array.from({ length: danhSachNgay.khoangTrongDau }).map(
                  (_, i) => (
                    <span key={`empty-${i}`} className="w-8 h-8 mx-auto" />
                  ),
                )}

                {/* Các ngày trong tháng */}
                {Array.from({ length: danhSachNgay.soNgay }).map((_, i) => {
                  const ngay = i + 1
                  const daChon = ngay === ngayChon
                  const noiBatPhu = ngay === 26

                  let classTuyChon = "text-[#3B3636]/85 hover:bg-[#3B3636]/10"
                  if (daChon) {
                    classTuyChon =
                      "bg-white font-bold shadow-sm scale-105 text-[#27190F]"
                  } else if (noiBatPhu) {
                    classTuyChon = "bg-[#E2D3BC] font-medium text-[#27190F]"
                  }

                  return (
                    <button
                      key={ngay}
                      type="button"
                      onClick={() => setNgayChon(ngay)}
                      className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer border-0 ${classTuyChon}`}
                    >
                      {ngay}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Khung Giờ tiếp đón (Working Hours) */}
            <div className="pt-1 flex flex-col gap-3">
              <h4 className="glowence-serif text-2xl sm:text-[26px] font-semibold text-[#3B3636] m-0">
                Giờ tiếp đón tại The Hermit
              </h4>
              <div className="flex flex-col text-sm sm:text-base">
                <div className="flex justify-between py-2 border-b border-[#3B3636]/10">
                  <span className="text-[#3B3636]/80">Thứ Hai – Thứ Sáu</span>
                  <span className="font-medium text-[#3B3636]">
                    09:00 – 21:00
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#3B3636]/10">
                  <span className="text-[#3B3636]/80">Thứ Bảy</span>
                  <span className="font-medium text-[#3B3636]">
                    10:00 – 20:00
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#3B3636]/80">Chủ Nhật</span>
                  <span className="font-medium text-[#B75E2A]">
                    Theo lịch hẹn trước
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 3 (lg:col-span-4) — Thẻ kết nối Dark Luxury (#27190F) */}
          <div
            className="glowence-animate-transition glowence-dark-card lg:col-span-4 bg-[#27190F] border border-white/10 rounded-[28px] p-6 sm:p-8 lg:p-10 flex flex-col gap-6 text-[#FFFAF1] shadow-xl h-fit self-start"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(40px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              backgroundColor: "#27190F",
              color: "#FFFAF1",
            }}
          >
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                style={{ color: "#D48B55" }}
              >
                KÊNH TRỰC TIẾP
              </span>
              <h3
                className="glowence-serif text-3xl sm:text-4xl lg:text-[40px] leading-tight font-semibold m-0"
                style={{ color: "#FFFAF1" }}
              >
                Nhắn trực tiếp cho chúng tôi
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed mt-2 m-0"
                style={{ color: "rgba(255, 250, 241, 0.88)" }}
              >
                Lựa chọn kênh kết nối thuận tiện nhất để trao đổi về thời lượng,
                chi phí và chuẩn bị cho buổi gặp.
              </p>
            </div>

            {/* Các nút hành động với hiệu ứng trượt kép */}
            <div className="flex flex-col gap-3.5 pt-2">
              <SlidingActionButton
                href={contactChannels.zalo}
                label="Nhắn qua Zalo"
                sublabel="Mở Zalo chat ↗"
              />

              <SlidingActionButton
                href={contactChannels.facebook}
                label="Nhắn qua Fanpage"
                sublabel="Mở Facebook ↗"
              />
            </div>

            {/* Thông tin hỗ trợ & địa chỉ */}
            <div
              className="pt-4 border-t border-white/10 flex flex-col gap-2.5 text-xs sm:text-sm"
              style={{ color: "rgba(255, 250, 241, 0.85)" }}
            >
              <p
                className="m-0 flex items-start gap-2"
                style={{ color: "rgba(255, 250, 241, 0.88)" }}
              >
                <strong style={{ color: "#FFFAF1" }}>Địa chỉ:</strong>
                <span style={{ color: "rgba(255, 250, 241, 0.92)" }}>
                  595/18 Cách Mạng Tháng 8, Phường Hoà Hưng, TP. Hồ Chí Minh
                </span>
              </p>
              <p
                className="m-0 flex items-start gap-2"
                style={{ color: "rgba(255, 250, 241, 0.88)" }}
              >
                <strong style={{ color: "#FFFAF1" }}>Zalo / Hotline:</strong>
                {contactChannels.zalo ? (
                  <a
                    href={contactChannels.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#B75E2A] transition-colors"
                    style={{ color: "#FFFAF1" }}
                  >
                    {SO_DIEN_THOAI_ZALO}
                  </a>
                ) : (
                  <span style={{ color: "rgba(255, 250, 241, 0.92)" }}>{SO_DIEN_THOAI_ZALO}</span>
                )}
              </p>
              <p
                className="m-0 flex items-start gap-2"
                style={{ color: "rgba(255, 250, 241, 0.88)" }}
              >
                <strong style={{ color: "#FFFAF1" }}>Email:</strong>
                <a
                  href="mailto:info@innerarchitect.vn"
                  className="underline hover:text-[#B75E2A] transition-colors"
                  style={{ color: "#FFFAF1" }}
                >
                  info@innerarchitect.vn
                </a>
              </p>
              <p
                className="m-0 text-[11px] italic pt-1"
                style={{ color: "rgba(255, 250, 241, 0.70)" }}
              >
                * Website không lưu trữ dữ liệu cá nhân. Mọi trao đổi đều được
                thực hiện bảo mật trực tiếp giữa bạn và đội ngũ.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

