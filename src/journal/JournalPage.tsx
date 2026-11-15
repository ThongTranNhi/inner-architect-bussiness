import { useEffect, useRef, useState } from "react"
import { Link } from "../dieu-huong"
import {
  layThuocTinhHieuUng as hieuUng,
  useHieuUngCuon,
} from "../founder/hieu-ung"
import {
  BO_LOC_JOURNAL,
  SAU_CHUYEN_MUC_JOURNAL,
  kichThuocAnh,
  kieuHienAnh,
  layBaiTieuBieu,
  tenChuyenMuc,
  type BaiJournal,
  type ChuyenDeJournal,
} from "./loc-journal"

/**
 * Trang Journal `/journal` — "thư viện chiêm nghiệm".
 *
 * Bố cục & Hiệu ứng:
 * - Masthead: Tiêu đề Explore Within & lối tắt nhanh 6 chuyên mục.
 * - Hiệu ứng 1: Interactive Expandable Accordion & Staggered Reveal (Cảm hứng từ Jiro Build):
 *   Mỗi chuyên mục trình bày chuẩn mực 1 bài viết tiêu biểu.
 *   Khi người đọc bấm "Xem thêm bài viết", toàn bộ các bài viết con bung nở êm ái
 *   (Smooth Accordion Expansion) và xuất hiện so le sinh động (Staggered Card Reveal).
 *   Bấm lại thu gọn nhẹ nhàng, giúp trang thanh lịch và không bị rối mắt.
 * - Hệ thống 6 chuyên mục Swiss Minimalist Editorial: Đánh số Roman/Serif to bản sắc sảo,
 *   đường viền chỉ đồng cổ điển, thẻ nâng nhẹ khi hover.
 * - Signature Series: 3 chuyên đề dài hạn chuyên sâu.
 */

type JournalPageProps = {
  baiViet: readonly BaiJournal[]
  chuyenDe: readonly ChuyenDeJournal[]
}

export function JournalPage({ baiViet, chuyenDe }: JournalPageProps) {
  const trangRef = useRef<HTMLElement>(null)
  useHieuUngCuon(trangRef, { hienNgay: ".jr-masthead [data-reveal]" })

  // Trạng thái lọc theo danh mục (null = hiển thị cả 6 chuyên mục)
  const [chuyenMucChon, setChuyenMucChon] = useState<string | null>(null)

  // Trạng thái mở rộng Accordion từng chuyên mục: Mặc định chuyên mục 01 mở sẵn
  const [chuyenMucMoRong, setChuyenMucMoRong] = useState<Record<string, boolean>>({
    "HIỂU MÌNH": true,
  })

  // Trạng thái mở rộng danh sách bài viết con (sub-articles) riêng biệt
  const [baiNhoMoRong, setBaiNhoMoRong] = useState<Record<string, boolean>>({})

  // Trạng thái chế độ đọc bài viết toàn văn (In-Page Full Reader Mode)
  const [baiDangDoc, setBaiDangDoc] = useState<BaiJournal | null>(null)

  // Khóa cuộn trang và lắng nghe phím Escape để hủy chế độ đọc
  useEffect(() => {
    if (!baiDangDoc) return
    const cuonCu = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const xuLyPhim = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBaiDangDoc(null)
      }
    }
    window.addEventListener("keydown", xuLyPhim)
    return () => {
      document.body.style.overflow = cuonCu
      window.removeEventListener("keydown", xuLyPhim)
    }
  }, [baiDangDoc])

  // Bật/tắt mở rộng toàn bộ chuyên mục (khối 2 cột)
  const batTatMoRongChuyenMuc = (maDanhMuc: string, id?: string) => {
    const dangMo = Boolean(chuyenMucMoRong[maDanhMuc])
    setChuyenMucMoRong((prev) => ({
      ...prev,
      [maDanhMuc]: !prev[maDanhMuc],
    }))
    if (!dangMo && id) {
      setTimeout(() => {
        const target = document.getElementById(`chuyen-muc-${id}`)
        target?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    }
  }

  // Bật/tắt mở rộng danh sách bài viết nhỏ của một chuyên mục kèm cuộn mượt
  const batTatMoRongBaiNho = (maDanhMuc: string, id?: string) => {
    const dangMo = Boolean(baiNhoMoRong[maDanhMuc])
    setBaiNhoMoRong((prev) => ({
      ...prev,
      [maDanhMuc]: !prev[maDanhMuc],
    }))
    if (!dangMo && id) {
      setTimeout(() => {
        const target = document.getElementById(`sub-articles-${id}`)
        target?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }, 80)
    }
  }

  // Chọn chuyên mục từ thanh lọc: tự động mở rộng chuyên mục đó
  const chonLocChuyenMuc = (maDanhMuc: string | null) => {
    setChuyenMucChon(maDanhMuc)
    if (maDanhMuc) {
      setChuyenMucMoRong((prev) => ({
        ...prev,
        [maDanhMuc]: true,
      }))
    }
  }

  // Cuộn lướt và tự động mở Accordion chuyên mục từ thanh lối tắt Masthead
  const cuonVaMoChuyenMuc = (id: string, maDanhMuc: string) => {
    if (chuyenMucChon !== null) setChuyenMucChon(null)
    setChuyenMucMoRong((prev) => ({
      ...prev,
      [maDanhMuc]: true,
    }))
    const el = document.getElementById(`chuyen-muc-${id}`)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Bài tiêu biểu phục vụ LCP
  const tieuBieu = layBaiTieuBieu(baiViet, 3)
  const tieuDiem = tieuBieu[0]

  // Danh sách chuyên mục cần hiển thị (tất cả 6 chuyên mục hoặc chuyên mục được lọc)
  const danhSachChuyenMuc = chuyenMucChon
    ? SAU_CHUYEN_MUC_JOURNAL.filter((cm) => cm.maDanhMuc === chuyenMucChon)
    : SAU_CHUYEN_MUC_JOURNAL

  return (
    <main ref={trangRef} className="journal-page">
      {/* 1. MASTHEAD: Tiêu đề & Lời tựa triết lý */}
      <section className="jr-masthead" aria-labelledby="jr-tieu-de">
        <div className="jr-masthead-badge-row" {...hieuUng("len", 0)}>
          <span className="jr-masthead-label">Journal · INNER ARCHITECT™</span>
          <span className="jr-masthead-issue-badge">TẬP SỐ I · MÙA THƯ VIỆN TRI THỨC</span>
        </div>
        <h1 id="jr-tieu-de" className="serif">
          <span {...hieuUng("len", 1)}>Explore</span>
          <span {...hieuUng("len", 2)}>Within</span>
        </h1>
        <div className="jr-masthead-intro">
          <p className="serif jr-masthead-tagline" {...hieuUng("len", 3)}>
            Reflect Deeply · Transform Consciously
          </p>
          <p {...hieuUng("len", 4)}>
            Thư viện tri thức và chiêm nghiệm chuyên sâu được cấu trúc theo 6
            chuyên mục chính. Nơi tập hợp các bài viết giúp người đọc quan sát
            biểu tượng, nhận diện mô thức nội tâm và tìm thấy sự tự chủ trong
            đời sống thực tế.
          </p>
        </div>

        {/* Thanh nhảy nhanh 6 Chuyên mục phong cách Tạp chí */}
        <div className="jr-masthead-jump-bar" {...hieuUng("len", 5)}>
          <span className="jr-jump-bar-label">Lối tắt 6 chuyên mục:</span>
          <div className="jr-jump-pills">
            {SAU_CHUYEN_MUC_JOURNAL.map((cm) => (
              <a
                key={cm.id}
                href={`#chuyen-muc-${cm.id}`}
                className="jr-jump-pill"
                onClick={(e) => {
                  e.preventDefault()
                  cuonVaMoChuyenMuc(cm.id, cm.maDanhMuc)
                }}
              >
                <span className="jr-jump-num">{cm.id}</span>
                <span className="jr-jump-name">{cm.nhanBoLoc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SÁU CHUYÊN MỤC CHÍNH — TRÌNH BÀY KÈM 1 BÀI VIẾT & XEM THÊM (ACCORDION) */}
      <section className="jr-library" id="sau-chuyen-muc" aria-labelledby="jr-thu-vien">
        <header className="jr-library-head">
          <div className="jr-library-title-row">
            <div>
              <h2 id="jr-thu-vien" className="serif" {...hieuUng("len", 0)}>
                {chuyenMucChon
                  ? `Chuyên mục: ${tenChuyenMuc(chuyenMucChon)}`
                  : "Sáu chuyên mục chính"}
              </h2>
              <p className="jr-library-sub">
                {chuyenMucChon
                  ? `Đang xem các bài viết thuộc chuyên mục ${tenChuyenMuc(chuyenMucChon)}`
                  : "Mỗi chuyên mục đồng hành cùng 1 bài viết chiêm nghiệm nổi bật. Bấm xem thêm để đọc toàn bộ các bài viết nhỏ."}
              </p>
            </div>
            <div className="jr-library-meta-right">
              <span className="jr-library-count">
                {chuyenMucChon
                  ? `${baiViet.filter((b) => b.category === chuyenMucChon).length} bài viết`
                  : `6 chuyên mục · ${baiViet.length} bài viết`}
              </span>
              {chuyenMucChon && (
                <button
                  type="button"
                  className="jr-back-to-all-pill"
                  onClick={() => setChuyenMucChon(null)}
                >
                  ← Xem tất cả 6 chuyên mục
                </button>
              )}
            </div>
          </div>

          {/* Thanh danh mục theo file Word mục 2 */}
          <nav className="jr-filter" aria-label="Lọc bài viết theo chuyên mục">
            {BO_LOC_JOURNAL.map((loc) => {
              const dangChon = chuyenMucChon === loc.danhMuc
              return (
                <button
                  key={loc.nhan}
                  type="button"
                  className={`jr-filter-btn ${dangChon ? "is-active" : ""}`}
                  onClick={() => chonLocChuyenMuc(loc.danhMuc)}
                >
                  {loc.nhan}
                </button>
              )
            })}
          </nav>
        </header>

        {/* Hệ thống 6 chuyên mục với Interactive Accordion & Staggered Reveal */}
        <div className="jr-swiss-editorial-system">
          {danhSachChuyenMuc.map((cm, idx) => {
            const dsBaiCuaMuc = baiViet.filter((b) => b.category === cm.maDanhMuc)
            const baiChinh = dsBaiCuaMuc[0]
            const dsBaiNho = dsBaiCuaMuc.slice(1)
            const daMoRong = Boolean(chuyenMucMoRong[cm.maDanhMuc])
            const daMoRongBaiNho = Boolean(baiNhoMoRong[cm.maDanhMuc])
            const laMucDau = idx === 0

            return (
              <article
                key={cm.id}
                id={`chuyen-muc-${cm.id}`}
                className={`jr-swiss-card jr-expanding-card ${daMoRong ? "is-expanded-card" : "is-collapsed-card"}`}
                aria-labelledby={`heading-cm-${cm.id}`}
                {...hieuUng("len", 1)}
              >
                {/* 1. THANH TIÊU ĐỀ THỤY SĨ: SỐ THỨ TỰ TO BẢN & VIỀN CHỈ MẢNH + NÚT BUNG MỞ ACCORDION */}
                <header
                  className={`jr-swiss-header ${daMoRong ? "is-header-open" : "is-header-closed"}`}
                  onClick={() => batTatMoRongChuyenMuc(cm.maDanhMuc, cm.id)}
                  title={daMoRong ? "Nhấp để thu gọn chuyên mục" : "Nhấp để mở rộng chuyên mục"}
                >
                  <div className="jr-swiss-header-left">
                    <span className="serif jr-swiss-num">{cm.id}</span>
                    <div className="jr-swiss-title-group">
                      <div className="jr-swiss-tag-row">
                        <span className="jr-swiss-eyebrow">CHUYÊN MỤC #{cm.id}</span>
                        <span className="jr-swiss-dot-sep">·</span>
                        <span className="jr-swiss-theme-badge">{cm.chuDe}</span>
                      </div>
                      <h3 id={`heading-cm-${cm.id}`} className="serif jr-swiss-title">
                        {cm.tenTiengViet}
                      </h3>
                      <span className="serif jr-swiss-sub">{cm.tenTiengAnh}</span>
                    </div>
                  </div>

                  {/* Ảnh thu nhỏ và trích dẫn xem trước khi thẻ đang đóng (Phương án 3 - Expanding Cards) */}
                  {!daMoRong && (
                    <div className="jr-swiss-preview-thumb">
                      <img
                        src={cm.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        {...kichThuocAnh(cm.image)}
                      />
                      <span className="serif jr-preview-quote-snippet">
                        “{cm.trichDan}”
                      </span>
                    </div>
                  )}

                  <div className="jr-swiss-header-right-group">
                    <div className={`jr-swiss-header-toggle-pill ${daMoRong ? "is-active-pill" : ""}`}>
                      <span className="jr-toggle-pill-dot" aria-hidden="true" />
                      <span>{daMoRong ? "Thu gọn chuyên mục" : "Khám phá chuyên mục"}</span>
                      <span className={`jr-toggle-pill-arrow ${daMoRong ? "is-open" : ""}`} aria-hidden="true">
                        {daMoRong ? "↑" : "↓"}
                      </span>
                    </div>
                  </div>

                  {/* Đường chỉ đồng cổ đặc trưng phong cách Swiss */}
                  <div className="jr-swiss-line-accent" aria-hidden="true" />
                </header>

                {/* 2. KHỐI TRỌNG TÂM 2 CỘT CHUẨN MỰC TẠP CHÍ (BUNG NỞ KHI EXPANDED - PHƯƠNG ÁN 3) */}
                {daMoRong && (
                  <div className="jr-swiss-content-grid jr-expanding-content-enter">
                    {/* Cột trái: Khám phá Chuyên mục & Triết lý */}
                    <div className="jr-swiss-category-side">
                      <figure className="jr-swiss-media">
                        <img
                          src={cm.image}
                          alt={`${cm.id}. ${cm.tenTiengAnh} - ${cm.tenTiengViet}`}
                          loading="lazy"
                          decoding="async"
                          {...kichThuocAnh(cm.image)}
                        />
                        <div className="jr-swiss-media-badge">
                          <span>ARCHIVE {cm.id}</span>
                        </div>
                      </figure>
                      <blockquote className="serif jr-swiss-quote">
                        “{cm.trichDan}”
                      </blockquote>
                      <p className="jr-swiss-desc">{cm.moTa}</p>

                      {/* Trọng tâm chiêm nghiệm lấp đầy bố cục và nâng tầm thị giác */}
                      <div className="jr-swiss-pillars-box">
                        <span className="jr-pillars-label">Trọng tâm chuyên mục</span>
                        <div className="jr-pillars-chips">
                          <span className="jr-pillar-chip">{cm.chuDe}</span>
                          <span className="jr-pillar-chip">{cm.thoiGianDoc}</span>
                          <span className="jr-pillar-chip">{cm.tyTrong}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cột phải: 1 Bài viết tiêu biểu kèm theo chuyên mục */}
                    {baiChinh && (
                      <div className="jr-swiss-article-side">
                        <div className="jr-swiss-article-meta">
                          <span className="jr-swiss-lead-tag">
                            <span className="jr-lead-star" aria-hidden="true">✦</span> Bài viết tiêu biểu
                          </span>
                          <span className="jr-swiss-bullet">·</span>
                          <span className="jr-swiss-read-time">{cm.thoiGianDoc}</span>
                          <span className="jr-swiss-bullet">·</span>
                          <time className="jr-swiss-date">{baiChinh.date}</time>
                        </div>

                        {cm.id === "01" && (!chuyenMucChon || chuyenMucChon === "HIỂU MÌNH") ? (
                          <figure
                            className="jr-swiss-lead-media"
                            data-anh="tren"
                            {...hieuUng("anh", 0)}
                          >
                            <img
                              src={tieuDiem.image}
                              alt={tieuDiem.title}
                              fetchPriority="high"
                              {...kichThuocAnh(tieuDiem.image)}
                            />
                          </figure>
                        ) : (
                          <figure
                            className="jr-swiss-lead-media"
                            data-anh={kieuHienAnh(idx)}
                            {...hieuUng("anh", 0)}
                          >
                            <img
                              src={baiChinh.image}
                              alt={baiChinh.title}
                              loading="lazy"
                              decoding="async"
                              {...kichThuocAnh(baiChinh.image)}
                            />
                          </figure>
                        )}

                        <h4 className="serif jr-swiss-article-title">{baiChinh.title}</h4>
                        {baiChinh.italic && (
                          <p className="serif jr-swiss-article-dek">{baiChinh.italic}</p>
                        )}
                        <p className="jr-swiss-article-summary">{baiChinh.summary}</p>

                        <div className="jr-swiss-cta-row">
                          <button
                            type="button"
                            className="jr-swiss-read-cta"
                            onClick={() => setBaiDangDoc(baiChinh)}
                            title={`Đọc bài viết: ${baiChinh.title}`}
                          >
                            <span>Đọc bài viết tiêu biểu này</span>
                            <span className="jr-swiss-arrow" aria-hidden="true">→</span>
                          </button>

                          {dsBaiNho.length > 0 && (
                            <button
                              type="button"
                              className={`jr-lead-expand-btn ${daMoRongBaiNho ? "is-expanded" : ""}`}
                              onClick={() => batTatMoRongBaiNho(cm.maDanhMuc, cm.id)}
                              aria-expanded={daMoRongBaiNho}
                            >
                              <span className="jr-expand-sparkle" aria-hidden="true">✦</span>
                              <span>
                                {daMoRongBaiNho
                                  ? "Thu gọn danh sách"
                                  : `Xem thêm ${dsBaiNho.length} bài viết khác`}
                              </span>
                              <span className="jr-expand-count-badge">
                                {dsBaiNho.length} bài
                              </span>
                              <svg
                                className="jr-expand-icon"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. LƯỚI BÀI VIẾT CON TIẾP NỐI (BUNG NỞ KHI BẤM XEM THÊM) */}
                {daMoRong && daMoRongBaiNho && dsBaiNho.length > 0 && (
                  <div id={`sub-articles-${cm.id}`} className="jr-category-sub-articles">
                    <div className="jr-sub-articles-head">
                      <div className="jr-sub-heading-group">
                        <span className="jr-sub-badge">Chuyên mục {cm.id}</span>
                        <h4 className="serif jr-sub-heading">
                          Toàn bộ bài viết thuộc {cm.tenTiengViet}
                        </h4>
                      </div>
                      <button
                        type="button"
                        className="jr-collapse-btn"
                        onClick={() => batTatMoRongBaiNho(cm.maDanhMuc)}
                      >
                        <span>Thu gọn bớt</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                      </button>
                    </div>

                    <div className="jr-grid">
                      {dsBaiNho.map((bai, i) => (
                        <article
                          key={bai.slug}
                          className="jr-card jr-sub-card jr-sub-card-textonly"
                          data-anh={kieuHienAnh(i)}
                          style={{
                            animationDelay: `${i * 80}ms`,
                          }}
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setBaiDangDoc(bai)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                setBaiDangDoc(bai)
                              }
                            }}
                            className="jr-card-link"
                            style={{ cursor: "pointer" }}
                            title={`Nhấp để đọc bài: ${bai.title}`}
                          >
                            <div className="jr-card-copy">
                              <div className="jr-card-meta">
                                <div className="jr-card-meta-left">
                                  <span className="jr-card-index-tag">
                                    {cm.id}.{i + 2 < 10 ? `0${i + 2}` : i + 2}
                                  </span>
                                  <span className="jr-card-cat">
                                    {tenChuyenMuc(bai.category)}
                                  </span>
                                </div>
                                <time className="jr-card-date">{bai.date}</time>
                              </div>
                              <h5 className="serif jr-card-title">{bai.title}</h5>
                              {bai.italic && (
                                <p className="serif jr-card-dek">{bai.italic}</p>
                              )}
                              <p className="jr-card-summary">{bai.summary}</p>
                              <span className="jr-card-cta">
                                Đọc bài viết <span className="jr-swiss-arrow">→</span>
                              </span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className="jr-series" aria-labelledby="jr-chuyen-de">
        <header className="jr-series-head">
          <p className="jr-series-label" {...hieuUng("len", 0)}>
            Signature Series · Chuyên đề dài hạn
          </p>
          <h2 id="jr-chuyen-de" className="serif" {...hieuUng("len", 1)}>
            Ba hành trình chiêm nghiệm chuyên sâu
          </h2>
          <p {...hieuUng("len", 2)}>
            Tạo bản sắc học thuật và chiều sâu cho Journal, giúp người đọc theo
            dõi theo chuỗi bài có hệ thống và chuyển hóa từng bước.
          </p>
        </header>
        <ol className="jr-series-list">
          {chuyenDe.map((series, i) => (
            <li key={series.id} className="jr-series-row" {...hieuUng("mo", i)}>
              <p className="jr-series-count">
                {series.count}
                <span lang="en">{series.tag}</span>
              </p>
              <h3 className="serif">{series.title}</h3>
              <div className="jr-series-body">
                <p className="serif jr-series-sub">{series.subtitle}</p>
                <p>{series.description}</p>
                <p className="jr-series-status">Đang xuất bản định kỳ</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="parent-link">
        <Link to="/">← Về trang chủ</Link>
      </div>

      {/* 4. CHẾ ĐỘ ĐỌC BÀI VIẾT TẬP TRUNG TOÀN VĂN (MODAL READER MODE VỚI NÚT HỦY X) */}
      {baiDangDoc && (
        <div
          className="jr-reader-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="jr-reader-title"
          onClick={() => setBaiDangDoc(null)}
        >
          <div
            className="jr-reader-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thanh công cụ đỉnh dính (Sticky Header) */}
            <header className="jr-reader-top-bar">
              <div className="jr-reader-meta">
                <span className="jr-reader-cat-badge">
                  {tenChuyenMuc(baiDangDoc.category)}
                </span>
                <span className="jr-reader-bullet">·</span>
                <time className="jr-reader-date">{baiDangDoc.date}</time>
                <span className="jr-reader-bullet">·</span>
                <span className="jr-reader-mode-tag">Chế độ đọc bài</span>
              </div>

              <button
                type="button"
                className="jr-reader-close-btn"
                onClick={() => setBaiDangDoc(null)}
                aria-label="Hủy chế độ đọc"
                title="Hủy chế độ đọc (Esc)"
              >
                <span className="jr-reader-close-text">Hủy chế độ đọc</span>
                <span className="jr-reader-close-icon" aria-hidden="true">
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </span>
              </button>
            </header>

            {/* Khung nội dung toàn văn bài viết */}
            <article className="jr-reader-content">
              <h1 id="jr-reader-title" className="serif jr-reader-title">
                {baiDangDoc.title}
              </h1>

              {baiDangDoc.italic && (
                <p className="serif jr-reader-dek">{baiDangDoc.italic}</p>
              )}

              {/* Chỉ hiển thị hình ảnh hero với bài viết tiêu biểu (bài viết nhỏ không hiển thị ảnh theo yêu cầu) */}
              {baiDangDoc.tieuBieu && baiDangDoc.image && (
                <figure className="jr-reader-hero-media">
                  <img
                    src={baiDangDoc.image}
                    alt={baiDangDoc.title}
                    loading="lazy"
                    decoding="async"
                    {...kichThuocAnh(baiDangDoc.image)}
                  />
                </figure>
              )}

              <div className="jr-reader-prose">
                {(baiDangDoc.content
                  ? baiDangDoc.content.split("\n\n").filter(Boolean)
                  : [baiDangDoc.summary]
                ).map((doan, idx) => (
                  <p key={idx} className="jr-reader-p">
                    {doan}
                  </p>
                ))}
              </div>

              {/* Chân trang bài viết với câu triết lý đúc kết - chữ sáng rõ nét, không còn nút thừa */}
              <div
                className="jr-reader-foot"
                style={{
                  marginTop: "48px",
                  padding: "36px 28px",
                  backgroundColor: "#201308",
                  borderRadius: "18px",
                  border: "1px solid rgba(180, 140, 80, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "center",
                  boxShadow: "0 10px 30px -8px rgba(18, 11, 5, 0.35)",
                }}
              >
                <div
                  className="jr-reader-divider-line"
                  aria-hidden="true"
                  style={{
                    width: "54px",
                    height: "2px",
                    background: "linear-gradient(90deg, #b48c50, #d4a853)",
                    borderRadius: "999px",
                  }}
                />
                <p
                  className="serif jr-reader-closing-quote"
                  style={{
                    color: "#FFF9ED",
                    fontSize: "18px",
                    fontStyle: "italic",
                    fontWeight: 500,
                    lineHeight: 1.7,
                    maxWidth: "600px",
                    margin: 0,
                  }}
                >
                  “Cấu trúc trước. Diễn giải sau. Con người luôn là chủ thể duy nhất quyết định cuộc đời mình.”
                </p>
              </div>
            </article>
          </div>
        </div>
      )}
    </main>
  )
}
