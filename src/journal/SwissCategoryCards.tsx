import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import { useRef, useState } from "react"
import {
  kichThuocAnh,
  type ChuyenMucJournal,
} from "./loc-journal"

/**
 * Thuộc tính cho component SwissCategoryCards.
 */
export type SwissCategoryCardsProps = {
  /** Danh sách 6 chuyên mục chính của Journal */
  chuyenMuc: readonly ChuyenMucJournal[]
  /** Số lượng bài viết theo từng danh mục */
  soBaiTheoDanhMuc?: Record<string, number>
  /** Chuyên mục hiện đang được lọc (null = tất cả) */
  chuyenMucHienTai?: string | null
  /** Hàm callback khi người dùng chọn chuyên mục để cuộn tới */
  khiChonChuyenMuc: (id: string, maDanhMuc: string) => void
}

/**
 * Component Swiss-style Card lấy cảm hứng từ Jiro Build (swiss-style-card):
 * - Bố cục hai cột chuẩn mực Thụy Sĩ (Swiss typography) với số thứ tự to bản sắc sảo.
 * - Hiệu ứng Hover-Reveal Image Popup với lò xo vật lý (Spring Physics qua Framer Motion).
 * - Popup ảnh nổi lướt theo con trỏ chuột kèm xoay nhẹ, đổ bóng nổi bồng bềnh.
 * - Hỗ trợ chạm trên di động không bị kẹt tooltip.
 *
 * @param props - Cấu hình danh sách chuyên mục và hàm callback điều hướng
 */
export function SwissCategoryCards({
  chuyenMuc,
  soBaiTheoDanhMuc = {},
  chuyenMucHienTai = null,
  khiChonChuyenMuc,
}: SwissCategoryCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mucDangHover, setMucDangHover] = useState<ChuyenMucJournal | null>(null)

  // Tọa độ chuột thô
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  // Tọa độ mượt với lò xo vật lý (Spring Physics)
  const springX = useSpring(rawMouseX, { stiffness: 320, damping: 26, mass: 0.6 })
  const springY = useSpring(rawMouseY, { stiffness: 320, damping: 26, mass: 0.6 })

  /**
   * Xử lý di chuyển chuột trong khu vực danh sách để popup bám theo con trỏ mượt mà.
   */
  const xuLyDiChuyenChuot = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    rawMouseX.set(e.clientX - rect.left)
    rawMouseY.set(e.clientY - rect.top)
  }

  /**
   * Xử lý khi chuột rời khỏi toàn bộ danh sách.
   */
  const xuLyRoiChuotKhoiBang = () => {
    setMucDangHover(null)
  }

  return (
    <section
      className="jr-swiss-showcase"
      aria-label="Khám phá 6 chuyên mục phong cách Swiss"
      ref={containerRef}
      onMouseMove={xuLyDiChuyenChuot}
      onMouseLeave={xuLyRoiChuotKhoiBang}
    >
      {/* Tiêu đề phần Swiss Showcase */}
      <div className="jr-swiss-showcase-head">
        <div className="jr-swiss-showcase-badge">
          <span className="jr-swiss-showcase-dot" aria-hidden="true" />
          <span>SWISS-STYLE EDITORIAL INDEX · 06 CORE PILLARS</span>
        </div>
        <div className="jr-swiss-showcase-title-row">
          <h3 className="serif jr-swiss-showcase-title">
            Chỉ số &amp; Danh mục Chiêm nghiệm
          </h3>
          <p className="jr-swiss-showcase-hint">
            Rê chuột vào từng đề mục để kích hoạt góc nhìn thị giác (Hover-Reveal Popup).
            Nhấp chuột để mở bài viết.
          </p>
        </div>
      </div>

      {/* Danh sách các dòng đề mục Thụy Sĩ */}
      <div className="jr-swiss-showcase-list" role="list">
        {chuyenMuc.map((cm) => {
          const isHovered = mucDangHover?.id === cm.id
          const isSelected = chuyenMucHienTai === cm.maDanhMuc
          const soLuongBai = soBaiTheoDanhMuc[cm.maDanhMuc] ?? 0

          return (
            <div
              key={cm.id}
              role="listitem"
              className={`jr-swiss-row ${isHovered ? "is-hovered" : ""} ${isSelected ? "is-selected-row" : ""}`}
              onMouseEnter={() => setMucDangHover(cm)}
              onClick={() => khiChonChuyenMuc(cm.id, cm.maDanhMuc)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  khiChonChuyenMuc(cm.id, cm.maDanhMuc)
                }
              }}
              title={`Nhấp để xem chuyên mục ${cm.tenTiengViet}`}
            >
              {/* Cột trái: Số thứ tự to bản + Tên song ngữ */}
              <div className="jr-swiss-row-left">
                <span className="serif jr-swiss-row-num">{cm.id}</span>
                <div className="jr-swiss-row-names">
                  <h4 className="serif jr-swiss-row-vi">{cm.tenTiengViet}</h4>
                  <span className="serif jr-swiss-row-en">{cm.tenTiengAnh}</span>
                </div>
              </div>

              {/* Cột giữa: Nhãn chủ đề cốt lõi */}
              <div className="jr-swiss-row-center">
                <span className="jr-swiss-row-theme">{cm.chuDe}</span>
                <span className="jr-swiss-row-desc">{cm.moTa}</span>
              </div>

              {/* Cột phải: Chỉ số tỷ trọng + Số bài + Mũi tên tương tác */}
              <div className="jr-swiss-row-right">
                <div className="jr-swiss-row-stats">
                  <span className="jr-swiss-row-share">{cm.tyTrong}</span>
                  {soLuongBai > 0 && (
                    <span className="jr-swiss-row-count">{soLuongBai} bài viết</span>
                  )}
                </div>
                <div className="jr-swiss-row-arrow" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>

              {/* Đường chỉ mảnh ngăn cách chuẩn Swiss */}
              <div className="jr-swiss-row-line" aria-hidden="true" />
            </div>
          )
        })}
      </div>

      {/* Popup ảnh bồng bềnh với hiệu ứng Spring Physics theo con trỏ chuột */}
      <AnimatePresence>
        {mucDangHover && (
          <motion.div
            key={mucDangHover.id}
            className="jr-swiss-floating-card"
            style={{
              x: springX,
              y: springY,
              pointerEvents: "none",
            }}
            initial={{ opacity: 0, scale: 0.86, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.88, rotate: 2 }}
            transition={{ type: "spring", stiffness: 360, damping: 25, mass: 0.5 }}
          >
            <div className="jr-swiss-popup-inner">
              <figure className="jr-swiss-popup-figure">
                <img
                  src={mucDangHover.image}
                  alt={mucDangHover.tenTiengViet}
                  loading="lazy"
                  decoding="async"
                  {...kichThuocAnh(mucDangHover.image)}
                />
                <div className="jr-swiss-popup-overlay" />
                <span className="jr-swiss-popup-time-badge">
                  {mucDangHover.thoiGianDoc}
                </span>
              </figure>

              <div className="jr-swiss-popup-content">
                <div className="jr-swiss-popup-top-badge">
                  <span className="jr-popup-badge-num">{mucDangHover.id}</span>
                  <span className="jr-popup-badge-title">{mucDangHover.tenTiengAnh}</span>
                </div>
                <blockquote className="serif jr-swiss-popup-quote">
                  “{mucDangHover.trichDan}”
                </blockquote>
                {mucDangHover.baiGoiY && (
                  <p className="jr-swiss-popup-suggested">
                    <span className="jr-suggested-label">Bài gợi ý:</span>{" "}
                    <span className="serif jr-suggested-title">{mucDangHover.baiGoiY.tieuDe}</span>
                  </p>
                )}
                <div className="jr-swiss-popup-cta">
                  <span>Khám phá {mucDangHover.tenTiengViet}</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
