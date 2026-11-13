import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { IMG } from "../du-lieu/hinh-anh"

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cherry+Cream+Soda&family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"

const EASE = [0.16, 1, 0.3, 1] as const

interface ServiceItem {
  id: string
  title: string
  desc: string
  image: string
  left: number
  top: number
  borderRadius: string
}

const SERVICES: ServiceItem[] = [
  {
    id: "nhang-tram",
    title: "Nhang Trầm Hương",
    desc: "Nhang que trầm thiên nhiên thanh lọc uế khí, cân bằng năng lượng và nuôi dưỡng sự an định.",
    image: IMG.laraNhangTram,
    left: 169,
    top: 328,
    borderRadius: "0px",
  },
  {
    id: "nhang-que",
    title: "Nhang Quế Tự Nhiên",
    desc: "Hương quế cay ấm tự nhiên giúp xua tan hàn lạnh, thanh lọc phòng và thu hút vượng khí tốt lành.",
    image: IMG.laraNhangQue,
    left: 600,
    top: 328,
    borderRadius: "150px 0px 0px 0px",
  },
  {
    id: "nu-tram",
    title: "Nụ Trầm Hương",
    desc: "Khói trầm sâu lắng an định tâm trí, lý tưởng cho những khoảnh khắc đọc sách, thưởng trà và thiền tập.",
    image: IMG.laraNuTram,
    left: 1031,
    top: 328,
    borderRadius: "0px",
  },
  {
    id: "nu-que",
    title: "Nụ Quế Tự Nhiên",
    desc: "Nụ quế ấm nồng lan tỏa nhanh, hỗ trợ xua đuổi côn trùng, mang lại không gian ấm cúng, phấn chấn.",
    image: IMG.laraNuQue,
    left: 169,
    top: 838,
    borderRadius: "0px",
  },
  {
    id: "nu-bai",
    title: "Nụ Bài Thảo Mộc",
    desc: "Rễ bài cổ truyền mang hương thảo mộc thanh khiết, hỗ trợ cầu an, kích hoạt sinh khí cho gian phòng.",
    image: IMG.laraNuBai,
    left: 600,
    top: 838,
    borderRadius: "0px 0px 150px 0px",
  },
  {
    id: "bo-ba-nen-thom",
    title: "Bộ Ba Nến Thơm LARA",
    desc: "Soul Cleanse, Sacred Ground & Soul Embrace chế tác thủ công từ sáp thực vật cho nghi thức tĩnh tại.",
    image: IMG.soulCleanse,
    left: 1031,
    top: 838,
    borderRadius: "0px",
  },
]

export function LaraServices() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.12 })
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    let rAFId: number | null = null

    const handleResize = () => {
      if (rAFId) cancelAnimationFrame(rAFId)
      rAFId = requestAnimationFrame(() => {
        const width = window.innerWidth
        if (width < 900) {
          setIsMobile(true)
          setScale(1)
        } else {
          setIsMobile(false)
          setScale(width / 1600)
        }
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize, { passive: true })
    return () => {
      if (rAFId) cancelAnimationFrame(rAFId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const words = [
    { text: "Hương", breakAfter: false },
    { text: "Thơm", breakAfter: false },
    { text: "Cho", breakAfter: false },
    { text: "Mọi", breakAfter: true },
    { text: "Khoảnh", breakAfter: false },
    { text: "Khắc", breakAfter: false },
    { text: "Tĩnh", breakAfter: false },
    { text: "Tại", breakAfter: false },
  ]

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "#F6EAD9",
        position: "relative",
        overflow: "hidden",
        height: isMobile ? "auto" : `${1398 * scale}px`,
        padding: isMobile ? "60px 20px 80px" : 0,
        minHeight: isMobile ? "auto" : undefined,
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`
        .service-card-interactive {
          contain: layout paint;
          will-change: transform;
        }
        .service-img-wrap {
          height: 438px;
          transition: height 0.38s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: height;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .service-card-interactive:hover .service-img-wrap,
        .service-card-interactive.is-active .service-img-wrap {
          height: 388px;
        }
        .service-desc-reveal {
          max-height: 0;
          opacity: 0;
          transform: translateY(-4px) translateZ(0);
          overflow: hidden;
          transition: max-height 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease, transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          will-change: max-height, opacity, transform;
        }
        .service-card-interactive:hover .service-desc-reveal,
        .service-card-interactive.is-active .service-desc-reveal {
          max-height: 48px;
          opacity: 1;
          transform: translateY(0) translateZ(0);
          pointer-events: auto;
        }
        .service-plus-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #F4DEBE;
          background-color: transparent;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, background-color, border-color;
        }
        .service-card-interactive:hover .service-plus-btn,
        .service-card-interactive.is-active .service-plus-btn {
          background-color: #7A1E1E;
          border-color: #7A1E1E;
          transform: rotate(90deg);
        }
        .service-card-interactive:hover .service-card-title,
        .service-card-interactive.is-active .service-card-title {
          color: #7A1E1E;
        }
      `}</style>

      {/* ── DESKTOP SCALED CANVAS (>= 900px) ── */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            width: "1600px",
            height: "1398px",
            top: 0,
            left: 0,
            transform: `scale(${scale}) translateZ(0)`,
            transformOrigin: "top left",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Header Block (Desktop) */}
          <div
            style={{
              position: "absolute",
              width: "661px",
              height: "188px",
              left: "calc(50% - 661px / 2 + 0.5px)",
              top: "80px",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Badge row */}
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: -26, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", damping: 14, stiffness: 150, mass: 0.7 },
                },
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                width: "auto",
              }}
            >
              <HerbIcon size={20} color="#7A1E1E" />
              <span
                style={{
                  fontFamily: "'Inter Tight', -apple-system, sans-serif",
                  fontSize: "18px",
                  lineHeight: "24px",
                  fontWeight: 500,
                  color: "#010000",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.2px",
                }}
              >
                LARA INFINITY · NGUYÊN BẢN TỰ NHIÊN
              </span>
              <HerbIcon size={20} color="#7A1E1E" />
            </motion.div>

            {/* Headline with word-by-word spring reveal */}
            <motion.h2
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.09, delayChildren: 0.12 },
                },
              }}
              style={{
                fontFamily: "'Cherry Cream Soda', cursive, sans-serif",
                fontSize: "62px",
                lineHeight: "72px",
                fontWeight: 400,
                color: "#2B2520",
                textAlign: "center",
                width: "661px",
                margin: 0,
              }}
            >
              {words.map((w, index) => (
                <span key={index}>
                  <motion.span
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: -36,
                        scale: 0.9,
                        rotate: -2,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotate: 0,
                        transition: {
                          type: "spring",
                          damping: 14,
                          stiffness: 140,
                          mass: 0.65,
                        },
                      },
                    }}
                    style={{
                      display: "inline-block",
                      marginRight: "14px",
                      willChange: "transform, opacity",
                    }}
                  >
                    {w.text}
                  </motion.span>
                  {w.breakAfter && <br />}
                </span>
              ))}
            </motion.h2>
          </div>

          {/* 6 Service Cards (3x2 Desktop Grid via exact absolute coords) */}
          {SERVICES.map((item, i) => (
            <motion.div
              key={item.id}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 95, scale: 0.94 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 1.15,
                    delay: 0.22 + i * 0.11,
                    ease: EASE,
                  },
                },
              }}
              onClick={() =>
                setActiveCardId((prev) => (prev === item.id ? null : item.id))
              }
              className={`service-card-interactive ${
                activeCardId === item.id ? "is-active" : ""
              }`}
              style={{
                position: "absolute",
                left: `${item.left}px`,
                top: `${item.top}px`,
                width: "401px",
                height: "480px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {/* Image Frame with Shrink interaction */}
              <div
                className="service-img-wrap"
                style={{
                  width: "401px",
                  backgroundColor: "#FEF8EF",
                  borderRadius: item.borderRadius,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(43, 36, 32, 0.06)",
                  position: "relative",
                  shrink: 0,
                }}
              >
                <motion.img
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={{
                    hidden: { scale: 1.1, y: 25 },
                    visible: {
                      scale: 1,
                      y: 0,
                      transition: { duration: 1.25, ease: EASE },
                    },
                  }}
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    backfaceVisibility: "hidden",
                    willChange: "transform",
                    transform: "translateZ(0)",
                  }}
                />
              </div>

              {/* Details Block */}
              <div
                style={{
                  width: "401px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {/* Title + Plus button row */}
                <div
                  style={{
                    height: "28px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="service-card-title"
                    style={{
                      fontFamily: "'Cherry Cream Soda', cursive, sans-serif",
                      fontSize: "20px",
                      lineHeight: "26px",
                      fontWeight: 400,
                      color: "#010000",
                      transition: "color 0.25s ease",
                    }}
                  >
                    {item.title}
                  </span>

                  <button
                    type="button"
                    aria-label={`Chi tiết ${item.title}`}
                    className="service-plus-btn"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0px",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>

                {/* Description (Hidden by default, revealed on hover/active) */}
                <div className="service-desc-reveal">
                  <p
                    style={{
                      fontFamily: "'Inter Tight', -apple-system, sans-serif",
                      fontSize: "13.5px",
                      lineHeight: "19px",
                      fontWeight: 400,
                      color: "#5A534C",
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── MOBILE VERTICAL COLUMN (< 900px) ── */}
      {isMobile && (
        <div
          style={{
            maxWidth: "540px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "36px",
          }}
        >
          {/* Header Block (Mobile) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <HerbIcon size={18} color="#7A1E1E" />
              <span
                style={{
                  fontFamily: "'Inter Tight', -apple-system, sans-serif",
                  fontSize: "16px",
                  lineHeight: "24px",
                  fontWeight: 500,
                  color: "#010000",
                  letterSpacing: "0.2px",
                }}
              >
                LARA INFINITY · NGUYÊN BẢN TỰ NHIÊN
              </span>
              <HerbIcon size={18} color="#7A1E1E" />
            </div>

            <h2
              style={{
                fontFamily: "'Cherry Cream Soda', cursive, sans-serif",
                fontSize: "32px",
                lineHeight: "42px",
                fontWeight: 400,
                color: "#2B2520",
                margin: 0,
              }}
            >
              Hương Thơm Cho Mọi Khoảnh Khắc Tĩnh Tại
            </h2>
          </div>

          {/* Stacked Cards (Mobile) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {SERVICES.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setActiveCardId((prev) => (prev === item.id ? null : item.id))
                }
                className={`service-card-interactive ${
                  activeCardId === item.id ? "is-active" : ""
                }`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  cursor: "pointer",
                }}
              >
                {/* Fixed 280px image frame on mobile */}
                <div
                  style={{
                    width: "100%",
                    height: "280px",
                    backgroundColor: "#FEF8EF",
                    borderRadius: item.borderRadius,
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(43, 36, 32, 0.06)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>

                {/* Details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="service-card-title"
                      style={{
                        fontFamily: "'Cherry Cream Soda', cursive, sans-serif",
                        fontSize: "18px",
                        lineHeight: "24px",
                        fontWeight: 400,
                        color: "#010000",
                      }}
                    >
                      {item.title}
                    </span>

                    <button
                      type="button"
                      aria-label={`Chi tiết ${item.title}`}
                      className="service-plus-btn"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "0px",
                        padding: 0,
                      }}
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>

                  <p
                    style={{
                      fontFamily: "'Inter Tight', -apple-system, sans-serif",
                      fontSize: "13.5px",
                      lineHeight: "19px",
                      fontWeight: 400,
                      color: "#5A534C",
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function HerbIcon({ size = 20, color = "#7A1E1E" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ shrink: 0 }}
    >
      <path
        d="M3 21C3 14 8 4 19 3C18 14 12 21 3 21Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16L14 10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 21C11 17.5 13.5 13 19 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className="service-plus-icon"
    >
      <path
        d="M8 3.5V12.5M3.5 8H12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <style>{`
        .service-plus-icon {
          color: #010000;
          transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .service-card-interactive:hover .service-plus-icon,
        .service-card-interactive.is-active .service-plus-icon {
          color: #FFFEFE;
        }
      `}</style>
    </svg>
  )
}

