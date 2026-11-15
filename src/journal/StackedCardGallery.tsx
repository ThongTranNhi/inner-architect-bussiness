import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import {
  kichThuocAnh,
  type ChuyenMucJournal,
} from "./loc-journal"

/**
 * Thuộc tính cho component StackedCardGallery.
 */
export type StackedCardGalleryProps = {
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
 * Component Stacked Card Gallery (Phương án 2 - Cảm hứng từ Jiro Build stackedcard):
 * - Bộ sưu tập thẻ bài viết/chuyên mục xếp tầng hình nan quạt (Cascading Fan Layout).
 * - Góc xoay tự nhiên hữu cơ (organic tilt) cho từng thẻ trong không gian 3D.
 * - Khi hover hoặc chọn: Thẻ vươn lên phía trước (lift up), thẳng góc (rotate 0),
 *   ảnh trượt phóng to vi mô và lộ toàn bộ trích dẫn triết lý cùng nút khám phá.
 * - Thanh điều khiển lướt chuyển thẻ tuần tự (Next / Previous / Dots).
 *
 * @param props - Cấu hình danh sách chuyên mục và hàm callback điều hướng
 */
export function StackedCardGallery({
  chuyenMuc,
  soBaiTheoDanhMuc = {},
  chuyenMucHienTai = null,
  khiChonChuyenMuc,
}: StackedCardGalleryProps) {
  // Thẻ đang ở vị trí trung tâm nổi bật (mặc định thẻ đầu tiên 0 hoặc thẻ đang lọc)
  const initialIndex = chuyenMucHienTai
    ? Math.max(
        0,
        chuyenMuc.findIndex((cm) => cm.maDanhMuc === chuyenMucHienTai),
      )
    : 0
  const [chiMucHienTai, setChiMucHienTai] = useState<number>(initialIndex)
  const [theHover, setTheHover] = useState<number | null>(null)

  const tongSoThe = chuyenMuc.length

  const xuLyChuyenTruoc = () => {
    setChiMucHienTai((prev) => (prev > 0 ? prev - 1 : tongSoThe - 1))
  }

  const xuLyChuyenTiep = () => {
    setChiMucHienTai((prev) => (prev < tongSoThe - 1 ? prev + 1 : 0))
  }

  const theHienTai = chuyenMuc[chiMucHienTai]
  const soBaiHienTai = soBaiTheoDanhMuc[theHienTai.maDanhMuc] ?? 0

  return (
    <section
      className="jr-stacked-showcase"
      aria-label="Bộ sưu tập 6 chuyên mục phong cách Stacked Card Gallery"
    >
      {/* Tiêu đề & Lời tựa cho bộ sưu tập nan quạt */}
      <div className="jr-stacked-head">
        <div className="jr-stacked-badge">
          <span className="jr-stacked-dot" aria-hidden="true" />
          <span>STACKED CARD GALLERY · JIRO BUILD INSPIRATION</span>
        </div>
        <div className="jr-stacked-title-row">
          <div>
            <h3 className="serif jr-stacked-title">
              Tập Bản Thảo Chiêm Nghiệm
            </h3>
            <p className="jr-stacked-sub">
              Sáu chuyên mục được tạo tác như một tập bản thảo xếp tầng (Cascading Fan Deck).
              Rê chuột vào thẻ để mở rộng hoặc nhấp để đọc sâu.
            </p>
          </div>

          {/* Bộ nút điều hướng Next / Previous */}
          <div className="jr-stacked-nav-btns" aria-label="Điều hướng bộ thẻ">
            <button
              type="button"
              className="jr-stacked-arrow-btn"
              onClick={xuLyChuyenTruoc}
              aria-label="Xem chuyên mục trước"
              title="Chuyên mục trước"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <span className="jr-stacked-counter">
              <strong className="serif">{chiMucHienTai + 1}</strong>
              <span className="jr-stacked-counter-divider">/</span>
              <span>{tongSoThe}</span>
            </span>
            <button
              type="button"
              className="jr-stacked-arrow-btn"
              onClick={xuLyChuyenTiep}
              aria-label="Xem chuyên mục kế tiếp"
              title="Chuyên mục kế tiếp"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sân khấu trình diễn hiệu ứng quạt nan 3D (Cascading Fan Deck Stage) */}
      <div className="jr-stacked-stage-wrapper">
        <div className="jr-stacked-deck" role="region" aria-label="Bộ thẻ xếp tầng">
          {chuyenMuc.map((cm, idx) => {
            // Khoảng cách so với thẻ trung tâm
            const delta = idx - chiMucHienTai
            const isCenter = delta === 0
            const isHovered = theHover === idx
            const isProminent = isHovered || (theHover === null && isCenter)

            // Tính toán vị trí và góc xoay hình nan quạt
            const rotateAngle = isHovered ? 0 : delta * 5.2
            const xOffset = delta * 64
            const yOffset = isHovered ? -28 : Math.abs(delta) * 8
            const scaleVal = isHovered ? 1.05 : isCenter ? 1.02 : Math.max(0.88, 1 - Math.abs(delta) * 0.04)
            const zIndexVal = isHovered ? 50 : 20 - Math.abs(delta)

            return (
              <motion.article
                key={cm.id}
                className={`jr-fan-card ${isProminent ? "is-prominent" : ""}`}
                style={{
                  zIndex: zIndexVal,
                }}
                animate={{
                  x: xOffset,
                  y: yOffset,
                  rotate: rotateAngle,
                  scale: scaleVal,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 26,
                  mass: 0.7,
                }}
                onMouseEnter={() => setTheHover(idx)}
                onMouseLeave={() => setTheHover(null)}
                onClick={() => {
                  if (isCenter) {
                    khiChonChuyenMuc(cm.id, cm.maDanhMuc)
                  } else {
                    setChiMucHienTai(idx)
                  }
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    khiChonChuyenMuc(cm.id, cm.maDanhMuc)
                  }
                }}
                title={`Chuyên mục ${cm.id}: ${cm.tenTiengViet} (Nhấp để chọn)`}
              >
                {/* Ảnh bài viết phía trên */}
                <figure className="jr-fan-media">
                  <img
                    src={cm.image}
                    alt={`${cm.id}. ${cm.tenTiengAnh} - ${cm.tenTiengViet}`}
                    loading="lazy"
                    decoding="async"
                    {...kichThuocAnh(cm.image)}
                  />
                  <div className="jr-fan-overlay" />
                  <span className="serif jr-fan-num-badge">{cm.id}</span>
                  <span className="jr-fan-tag-badge">{cm.tenTiengAnh}</span>
                </figure>

                {/* Nội dung bài luận phía dưới */}
                <div className="jr-fan-body">
                  <div className="jr-fan-meta-row">
                    <span className="jr-fan-theme">{cm.chuDe}</span>
                    <span className="jr-fan-share">{cm.tyTrong}</span>
                  </div>

                  <h4 className="serif jr-fan-title">{cm.tenTiengViet}</h4>

                  <blockquote className="serif jr-fan-quote">
                    “{cm.trichDan}”
                  </blockquote>

                  <p className="jr-fan-desc">{cm.moTa}</p>

                  <div className="jr-fan-footer">
                    <button
                      type="button"
                      className="jr-fan-cta"
                      onClick={(e) => {
                        e.stopPropagation()
                        khiChonChuyenMuc(cm.id, cm.maDanhMuc)
                      }}
                    >
                      <span>Khám phá chuyên mục</span>
                      <span className="jr-fan-cta-arrow" aria-hidden="true">→</span>
                    </button>
                    <span className="jr-fan-read-time">{cm.thoiGianDoc}</span>
                  </div>
                </div>

                {/* Viền chỉ đồng cổ óng ánh */}
                <div className="jr-fan-border-glow" aria-hidden="true" />
              </motion.article>
            )
          })}
        </div>
      </div>

      {/* Thanh lối tắt dạng Dots dưới chân bộ thẻ để nhấp chọn nhanh */}
      <div className="jr-stacked-pills-row" role="tablist" aria-label="Danh sách chuyên mục">
        {chuyenMuc.map((cm, idx) => {
          const isActive = chiMucHienTai === idx
          return (
            <button
              key={cm.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              className={`jr-stacked-pill ${isActive ? "is-active" : ""}`}
              onClick={() => setChiMucHienTai(idx)}
            >
              <span className="jr-pill-num">{cm.id}</span>
              <span className="jr-pill-label">{cm.nhanBoLoc}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
