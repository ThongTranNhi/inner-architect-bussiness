import type { CSSProperties } from "react"
import { contactChannels, SO_DIEN_THOAI_ZALO } from "../config/contact"
import { IMG } from "../du-lieu/hinh-anh"
import { BieuMauLienHe } from "../lien-he/BieuMauLienHe"
import { useXuatHienMotLan } from "../lien-he/useXuatHienMotLan"
import { EMAIL_LIEN_HE } from "../trang/chung"

/**
 * Nút kênh liên hệ với hiệu ứng trượt mũi tên.
 *
 * @param props.href - URL chính thức của kênh; `null` thì hiển thị trạng thái "đang cập nhật"
 * @param props.label - Nhãn nút
 * @param props.moTabMoi - Mở tab mới (Zalo/Facebook); `false` cho `mailto:`
 * @param props.style - Style fade-up từ khối cha
 * @returns Liên kết dạng nút hoặc nhãn trạng thái
 */
function SlidingActionButton({
  href,
  label,
  moTabMoi = true,
  style,
}: {
  href?: string | null
  label: string
  moTabMoi?: boolean
  style?: CSSProperties
}) {
  if (!href) {
    return (
      <div
        className="w-full py-3.5 px-6 rounded-full text-sm text-center italic border font-medium"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          color: "rgba(255, 250, 241, 0.8)",
          ...style,
        }}
      >
        {label} (Đang cập nhật link)
      </div>
    )
  }

  return (
    <a
      href={href}
      {...(moTabMoi ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="sliding-action-btn group flex items-center justify-between w-full min-h-[56px] p-2 pl-6 rounded-full no-underline transition-shadow duration-300 shadow-md hover:shadow-lg cursor-pointer"
      style={{ backgroundColor: "#FFF5E2", color: "#27190F", textDecoration: "none", ...style }}
    >
      <span
        className="sliding-action-label font-semibold text-base transition-colors duration-200"
        style={{ color: "#27190F" }}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="sliding-action-icon w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center ml-3 shrink-0"
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
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    </a>
  )
}

/**
 * ContactThreeColumnSection — khối Liên hệ 3 cột (Warm Minimal + Premium Editorial):
 * - Cột trái: lời mời bắt đầu hành trình + ảnh không gian The Hermit (asset sẵn có).
 * - Cột giữa: card biểu mẫu "Liên hệ để đặt lịch" gửi lead về backend
 *   (`POST /api/v1/customers`). Không có lịch/ngày giờ — nhân viên tự liên hệ sắp lịch.
 * - Cột phải: kênh liên hệ trực tiếp (Zalo, Fanpage, Email) và thông tin chính thức.
 *
 * Bố cục: mobile xếp dọc (intro → form → kênh trực tiếp); tablet intro full width,
 * form + kênh 2 cột; desktop 3 cột. Hiệu ứng fade-up chạy một lần, tôn trọng
 * `prefers-reduced-motion`.
 *
 * @returns Khối liên hệ 3 cột
 */
export function ContactThreeColumnSection() {
  const { ref, xuatHien } = useXuatHienMotLan<HTMLElement>()

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
        .glowence-dark-card strong {
          color: #FFFAF1 !important;
        }
        .glowence-dark-card a:not(.sliding-action-btn) {
          color: #FFFAF1 !important;
        }
        .glowence-dark-card a.sliding-action-btn:hover {
          background-color: #FFFFFF !important;
        }
        .glowence-dark-card a.sliding-action-btn:hover .sliding-action-label {
          color: #B75E2A !important;
        }
        .glowence-dark-card a.sliding-action-btn:hover .sliding-action-icon {
          background-color: #B75E2A !important;
        }
      `}</style>

      <section
        id="contacts-three-column"
        ref={ref}
        aria-labelledby="contacts-three-column-heading"
        className="relative z-20 w-full overflow-hidden bg-[#FAF7F2] px-5 py-14 text-[#3B3636] glowence-sans sm:px-10 md:py-16 lg:px-10 lg:py-[88px] xl:px-[72px]"
      >
        <div className="mx-auto grid max-w-[1420px] grid-cols-1 items-start gap-9 md:grid-cols-2 md:gap-8 lg:grid-cols-[1fr_1.15fr_1fr] xl:gap-10">
          {/* CỘT TRÁI — Intro + ảnh The Hermit (tablet: full width, chữ và ảnh cạnh nhau) */}
          <div className="md:col-span-2 md:grid md:grid-cols-2 md:items-end md:gap-8 lg:col-span-1 lg:block">
            <div>
              <p className="m-0 text-[15px] font-medium uppercase leading-[150%] tracking-wider text-[#B75E2A]!" style={xuatHien(0)}>
                LIÊN HỆ · CONTACTS
              </p>
              <h2
                id="contacts-three-column-heading"
                className="glowence-serif m-0 mt-3 text-[40px] font-semibold leading-[1.06] tracking-tight text-[#3B3636] sm:text-5xl lg:text-[46px] xl:text-[52px]"
                style={xuatHien(80)}
              >
                Sẵn sàng bắt đầu hành trình của bạn?
              </h2>
              <p className="m-0 mt-4 text-base leading-[1.6] text-[#3B3636]/85! sm:text-[17px]" style={xuatHien(160)}>
                Bạn có thể liên hệ trực tiếp hoặc để lại thông tin để đội ngũ INNER ARCHITECT chủ
                động kết nối và hỗ trợ bạn lựa chọn dịch vụ phù hợp.
              </p>
            </div>

            <div
              className="group relative mt-7 h-[240px] overflow-hidden rounded-[28px] bg-[#3B3636]/5 shadow-md sm:h-[280px] md:mt-0 lg:mt-7"
              style={xuatHien(240)}
            >
              <img
                src={IMG.hermitKhongGianQuan}
                alt="Không gian trà đạo tĩnh lặng tại The Hermit"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-5">
                <span className="text-xs font-medium tracking-wide text-white/95 sm:text-sm">
                  The Hermit · Không gian trà đạo &amp; Soi chiếu
                </span>
              </div>
            </div>
          </div>

          {/* CỘT GIỮA — Biểu mẫu "Liên hệ để đặt lịch" (gửi lead, không đặt lịch tự động) */}
          <div id="de-lai-thong-tin" className="scroll-mt-24">
            <BieuMauLienHe xuatHien={xuatHien} />
          </div>

          {/* CỘT PHẢI — Kênh liên hệ trực tiếp */}
          <div
            className="glowence-dark-card flex flex-col gap-6 rounded-[28px] border border-white/10 p-6 shadow-xl sm:p-8"
            style={{ backgroundColor: "#27190F", color: "#FFFAF1", ...xuatHien(200) }}
          >
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[.14em]" style={{ color: "#D48B55" }}>
                KÊNH TRỰC TIẾP
              </span>
              <h3
                className="glowence-serif m-0 mt-2 text-[32px] font-semibold leading-tight sm:text-4xl xl:text-[40px]"
                style={{ color: "#FFFAF1" }}
              >
                Nhắn trực tiếp cho chúng tôi
              </h3>
              <p className="m-0 mt-3 text-sm leading-relaxed sm:text-base">
                Lựa chọn kênh kết nối thuận tiện nhất nếu bạn muốn trao đổi nhanh với đội ngũ INNER
                ARCHITECT.
              </p>
            </div>

            {/* Chỉ dùng URL chính thức trong src/config/contact.ts (chưa có Instagram chính thức). */}
            <div className="flex flex-col gap-3">
              <SlidingActionButton href={contactChannels.facebook} label="Nhắn qua Fanpage" style={xuatHien(300)} />
              <SlidingActionButton href={contactChannels.zalo} label="Nhắn qua Zalo" style={xuatHien(390)} />
              <SlidingActionButton
                href={`mailto:${EMAIL_LIEN_HE}`}
                label="Gửi Email"
                moTabMoi={false}
                style={xuatHien(480)}
              />
            </div>

            <div className="flex flex-col gap-2.5 border-t border-white/10 pt-5 text-sm">
              <p className="m-0">
                <strong>Địa chỉ:</strong> 595/18 Cách Mạng Tháng 8, Phường Hoà Hưng, TP. Hồ Chí Minh
              </p>
              <p className="m-0">
                <strong>Hotline / Zalo:</strong>{" "}
                {contactChannels.zalo ? (
                  <a
                    href={contactChannels.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline! underline-offset-[3px]"
                  >
                    {SO_DIEN_THOAI_ZALO}
                  </a>
                ) : (
                  SO_DIEN_THOAI_ZALO
                )}
              </p>
              <p className="m-0">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${EMAIL_LIEN_HE}`} className="underline! underline-offset-[3px]">
                  {EMAIL_LIEN_HE}
                </a>
              </p>
              <p className="m-0 pt-1 text-[12px] italic" style={{ color: "rgba(255, 250, 241, 0.72)" }}>
                * Website chỉ lưu thông tin bạn chủ động gửi qua biểu mẫu, để đội ngũ liên hệ tư vấn.
                Trao đổi qua Zalo/Facebook do nền tảng đó xử lý.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
