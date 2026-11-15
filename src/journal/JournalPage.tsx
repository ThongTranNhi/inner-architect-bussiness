import { useEffect, useRef, useState } from "react"
import { Link } from "../dieu-huong"
import {
  layThuocTinhHieuUng as hieuUng,
  useHieuUngCuon,
} from "../founder/hieu-ung"
import {
  dinhDangNgayJournal,
  nhanChuyenMuc,
  useBaiJournal,
  useDuLieuJournal,
  type BaiJournal,
} from "./du-lieu-journal"
import {
  kichThuocAnh,
  kieuHienAnh,
  layBaiTieuBieu,
  locBaiJournal,
  type ChuyenDeJournal,
} from "./loc-journal"
import { HienThiNoiDung } from "./noi-dung/HienThiNoiDung"
import { coNoiDung } from "./noi-dung/quy-tac"

/**
 * Trang Journal `/journal` — "thư viện chiêm nghiệm".
 *
 * Bố cục:
 * - Masthead: Tiêu đề Explore Within & lời tựa triết lý
 * - Cụm tiêu biểu (Featured Showcase): 1 bài tiêu điểm chính (khổ lớn sang trọng,
 *   nền nâu dải tràn viền) + 2 bài tiêu biểu phụ bên dưới.
 * - Thư viện bài viết: các chuyên mục công khai (quản lý trong /jathong/journal),
 *   mỗi mục có danh sách bài riêng theo thứ tự nhân viên sắp xếp.
 * - Chế độ đọc toàn văn trong trang (In-Page Reader Modal) với nút huỷ (X).
 * - Signature Series: 3 chuyên đề dài hạn chuyên sâu.
 *
 * Chuyên mục và bài lấy từ API công khai: chỉ bài đã xuất bản xuất hiện ở đây.
 */

/** Số bài hiển thị sẵn trong mỗi chuyên mục; phần còn lại mở bằng nút "Xem thêm". */
const SO_BAI_HIEN_SAN = 3

type JournalPageProps = {
  chuyenDe: readonly ChuyenDeJournal[]
}

export function JournalPage({ chuyenDe }: JournalPageProps) {
  const trangRef = useRef<HTMLElement>(null)
  useHieuUngCuon(trangRef, { hienNgay: ".jr-masthead [data-reveal]" })

  const { trangThai, duLieu, thuLai } = useDuLieuJournal()
  const chuyenMuc = duLieu?.categories ?? []
  const baiViet = duLieu?.articles ?? []

  const [baiDangDoc, setBaiDangDoc] = useState<BaiJournal | null>(null)
  const noiDungDoc = useBaiJournal(baiDangDoc?.slug ?? null)
  // Chuyên mục đang mở rộng (hiện toàn bộ bài)
  const [mucMoRong, setMucMoRong] = useState<ReadonlySet<number>>(new Set())
  const doiMoRong = (maMuc: number) =>
    setMucMoRong((cu) => {
      const moi = new Set(cu)
      if (moi.has(maMuc)) moi.delete(maMuc)
      else moi.add(maMuc)
      return moi
    })

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

  /** Thuộc tính mở chế độ đọc bằng chuột hoặc bàn phím. */
  const moDoc = (bai: BaiJournal) => ({
    role: "button" as const,
    tabIndex: 0,
    onClick: () => setBaiDangDoc(bai),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setBaiDangDoc(bai)
      }
    },
  })

  // 3 bài tiêu biểu phía trên
  const tieuBieu = layBaiTieuBieu(baiViet, 3)
  const tieuDiem = tieuBieu[0]
  const tieuBieuPhu = tieuBieu.slice(1, 3)

  return (
    <main ref={trangRef} className="journal-page">
      {/* 1. MASTHEAD */}
      <section className="jr-masthead" aria-labelledby="jr-tieu-de">
        <p className="jr-masthead-label" {...hieuUng("len", 0)}>
          Journal · INNER ARCHITECT™
        </p>
        <h1 id="jr-tieu-de" className="serif">
          <span {...hieuUng("len", 1)}>Explore</span>
          <span {...hieuUng("len", 2)}>Within</span>
        </h1>
        <div className="jr-masthead-intro">
          <p className="serif jr-masthead-tagline" {...hieuUng("len", 3)}>
            Reflect Deeply · Transform Consciously
          </p>
          <p {...hieuUng("len", 4)}>
            Thư viện tri thức và chiêm nghiệm chuyên sâu. Nơi tập hợp các bài
            viết giúp người đọc quan sát biểu tượng, mô thức tâm lý và trải
            nghiệm bên trong bằng ngôn ngữ rõ ràng, có ranh giới an toàn và gắn
            liền với đời sống thực tế.
          </p>
        </div>
      </section>

      {trangThai !== "xong" && (
        <div className="jr-trang-thai" aria-live="polite" aria-busy={trangThai === "dang-tai"}>
          {trangThai === "dang-tai" ? (
            <p>Đang tải bài viết…</p>
          ) : (
            <>
              <p>Chưa tải được danh sách bài viết. Vui lòng kiểm tra kết nối rồi thử lại.</p>
              <button type="button" className="jr-more-btn" onClick={thuLai}>
                Thử lại
              </button>
            </>
          )}
        </div>
      )}

      {/* 2. CỤM TIÊU BIỂU */}
      {tieuDiem && (
        <section className="jr-featured" aria-labelledby="jr-tieu-diem">
          <div className="jr-featured-container">
            {/* Bài tiêu điểm chính */}
            <div className="jr-featured-link cursor-pointer" {...moDoc(tieuDiem)}>
              <figure
                className="jr-featured-media"
                data-anh="tren"
                {...hieuUng("anh", 0)}
              >
                {tieuDiem.image && (
                  <img
                    src={tieuDiem.image}
                    alt={tieuDiem.imageAlt}
                    fetchPriority="high"
                    {...kichThuocAnh(tieuDiem.image, tieuDiem.imageWidth, tieuDiem.imageHeight)}
                  />
                )}
              </figure>
              <div className="jr-featured-copy">
                <p className="jr-featured-meta" {...hieuUng("len", 1)}>
                  Bài tiêu điểm · {nhanChuyenMuc(chuyenMuc, tieuDiem.categoryId)} ·{" "}
                  {dinhDangNgayJournal(tieuDiem.date)}
                </p>
                <h2 id="jr-tieu-diem" className="serif" {...hieuUng("len", 2)}>
                  {tieuDiem.title}
                  <em>{tieuDiem.dek}</em>
                </h2>
                <p className="jr-featured-summary" {...hieuUng("len", 3)}>
                  {tieuDiem.summary}
                </p>
                <span className="jr-featured-cta" {...hieuUng("len", 4)}>
                  Đọc toàn văn bài viết →
                </span>
              </div>
            </div>

            {/* 2 bài tiêu biểu phụ */}
            {tieuBieuPhu.length > 0 && (
              <div className="jr-featured-sub-grid">
                {tieuBieuPhu.map((bai, idx) => (
                  <div
                    key={bai.slug}
                    className="jr-featured-sub-card cursor-pointer"
                    {...moDoc(bai)}
                    {...hieuUng("len", idx + 2)}
                  >
                    <figure className="jr-featured-sub-media">
                      {bai.image && (
                        <img
                          src={bai.image}
                          alt={bai.imageAlt}
                          loading="lazy"
                          decoding="async"
                          {...kichThuocAnh(bai.image, bai.imageWidth, bai.imageHeight)}
                        />
                      )}
                    </figure>
                    <div className="jr-featured-sub-copy">
                      <p className="jr-featured-sub-meta">
                        <span>Tiêu biểu</span> · {nhanChuyenMuc(chuyenMuc, bai.categoryId)} ·{" "}
                        {dinhDangNgayJournal(bai.date)}
                      </p>
                      <h3 className="serif jr-featured-sub-title">
                        {bai.title}
                      </h3>
                      {bai.dek && (
                        <p className="serif jr-featured-sub-dek">{bai.dek}</p>
                      )}
                      <p className="jr-featured-sub-summary">{bai.summary}</p>
                      <span className="jr-featured-sub-cta">
                        Đọc toàn văn bài viết →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. CHUYÊN MỤC */}
      {trangThai === "xong" && (
        <section className="jr-library" aria-labelledby="jr-thu-vien">
          <header className="jr-library-head">
            <div className="jr-library-title-row">
              <h2 id="jr-thu-vien" className="serif" {...hieuUng("len", 0)}>
                Chuyên mục bài viết
              </h2>
              <span className="jr-library-count">
                {baiViet.length} bài viết
              </span>
            </div>
            <nav className="jr-category-nav" aria-label="Đi đến chuyên mục">
              {chuyenMuc.map((muc) => (
                <a key={muc.id} href={`#jr-muc-${muc.slug}`}>{muc.label}</a>
              ))}
            </nav>
          </header>

          {chuyenMuc.map((muc) => {
            const baiTrongMuc = locBaiJournal(baiViet, muc.id)
            const id = `jr-muc-${muc.slug}`
            const moRong = mucMoRong.has(muc.id)
            const soBaiAn = baiTrongMuc.length - SO_BAI_HIEN_SAN
            const baiHien = moRong ? baiTrongMuc : baiTrongMuc.slice(0, SO_BAI_HIEN_SAN)

            return (
              <section key={muc.id} id={id} className="jr-category" aria-labelledby={`${id}-title`}>
                <header className="jr-category-header">
                  <div className="jr-category-copy">
                    {muc.englishName && (
                      <p className="jr-category-english" lang="en">{muc.englishName}</p>
                    )}
                    <h3 id={`${id}-title`} className="serif">{muc.name}</h3>
                    <p className="jr-category-description">{muc.description}</p>
                    <p className="jr-library-count">{baiTrongMuc.length} bài viết</p>
                  </div>
                  {muc.image && (
                    <img
                      src={muc.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      {...kichThuocAnh(muc.image, muc.imageWidth, muc.imageHeight)}
                    />
                  )}
                </header>

                {baiTrongMuc.length > 0 ? (
                  <>
                  <div className="jr-grid" id={`${id}-grid`}>
                    {baiHien.map((bai, i) => (
                      <article
                        key={bai.slug}
                        className="jr-card cursor-pointer"
                        {...moDoc(bai)}
                        {...hieuUng("len", (i % 3) + 1)}
                      >
                        <div className="jr-card-link">
                          <figure
                            className="jr-card-media"
                            data-anh={kieuHienAnh(i)}
                            {...hieuUng("anh", 0)}
                          >
                            {bai.image && (
                              <img
                                src={bai.image}
                                alt={bai.imageAlt}
                                loading="lazy"
                                decoding="async"
                                {...kichThuocAnh(bai.image, bai.imageWidth, bai.imageHeight)}
                              />
                            )}
                          </figure>
                          <div className="jr-card-copy">
                            <p className="jr-card-meta">
                              <span className="jr-card-cat">{muc.label}</span>
                              <time className="jr-card-date" dateTime={bai.date ?? undefined}>
                                {dinhDangNgayJournal(bai.date)}
                              </time>
                            </p>
                            <h4 className="serif jr-card-title">{bai.title}</h4>
                            {bai.dek && (
                              <p className="serif jr-card-dek">{bai.dek}</p>
                            )}
                            <p className="jr-card-summary">{bai.summary}</p>
                            <span className="jr-card-cta">Đọc toàn văn bài viết →</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  {soBaiAn > 0 && (
                    <div className="jr-more">
                      <button
                        type="button"
                        className="jr-more-btn"
                        aria-expanded={moRong}
                        aria-controls={`${id}-grid`}
                        onClick={() => {
                          // Khi thu gọn, đưa người đọc về đầu chuyên mục để không bị lạc vị trí
                          if (moRong) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                          doiMoRong(muc.id)
                        }}
                      >
                        {moRong ? "Thu gọn ↑" : `Xem thêm ${soBaiAn} bài viết ↓`}
                      </button>
                    </div>
                  )}
                  </>
                ) : (
                  <div className="jr-empty">
                    <p>Chưa có bài viết nào trong chuyên mục này.</p>
                  </div>
                )}
              </section>
            )
          })}
        </section>
      )}

      {/* 4. CHUYÊN ĐỀ DÀI HẠN */}
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

      {/* CHẾ ĐỘ ĐỌC BÀI VIẾT TOÀN VĂN (In-Page Reader Modal) VỚI NÚT X HUỶ CHẾ ĐỘ ĐỌC */}
      {baiDangDoc && (
        <div
          className="jr-reader-backdrop"
          onClick={() => setBaiDangDoc(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reader-article-title"
        >
          <div
            className="jr-reader-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header điều khiển: Nút X huỷ chế độ đọc */}
            <div className="jr-reader-topbar">
              <span className="jr-reader-meta-tag">
                {nhanChuyenMuc(chuyenMuc, baiDangDoc.categoryId)} · {dinhDangNgayJournal(baiDangDoc.date)}
              </span>
              <button
                type="button"
                className="jr-reader-close-btn"
                onClick={() => setBaiDangDoc(null)}
                aria-label="Đóng bài viết và huỷ chế độ đọc"
                title="Đóng (Phím Esc)"
                autoFocus
              >
                ✕ Huỷ chế độ đọc
              </button>
            </div>

            {/* Nội dung bài đọc đầy đủ */}
            <div className="jr-reader-body">
              <header className="jr-reader-header">
                <span className="jr-reader-kicker">INNER ARCHITECT™ JOURNAL</span>
                <h1 id="reader-article-title" className="serif jr-reader-title">
                  {baiDangDoc.title}
                </h1>
                {baiDangDoc.dek && (
                  <p className="serif jr-reader-italic">{baiDangDoc.dek}</p>
                )}
                <div className="jr-reader-divider"></div>
              </header>

              {/* Ảnh bài viết */}
              {baiDangDoc.image && (
                <div className="jr-reader-hero-img-wrap">
                  <img
                    src={baiDangDoc.image}
                    alt={baiDangDoc.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="jr-reader-hero-img"
                    {...kichThuocAnh(baiDangDoc.image, baiDangDoc.imageWidth, baiDangDoc.imageHeight)}
                  />
                </div>
              )}

              {/* Thân bài đọc — cùng bộ hiển thị với trang bài viết và bản xem trước */}
              <div className="jr-reader-article-content">
                {baiDangDoc.summary && (
                  <blockquote className="jr-reader-lead-quote serif">
                    “{baiDangDoc.summary}”
                  </blockquote>
                )}
                {noiDungDoc.trangThai === "dang-tai" && <p aria-busy="true">Đang tải nội dung…</p>}
                {noiDungDoc.trangThai === "loi" && (
                  <p>
                    Chưa tải được nội dung.{" "}
                    <button type="button" className="underlink" onClick={noiDungDoc.thuLai}>
                      Thử lại
                    </button>
                  </p>
                )}
                {noiDungDoc.trangThai === "khong-co" && <p>Bài viết này không còn được công khai.</p>}
                {noiDungDoc.bai && coNoiDung(noiDungDoc.bai.content) && (
                  <HienThiNoiDung noiDung={noiDungDoc.bai.content} className="jr-reader-prose" />
                )}
                <p className="jr-reader-link">
                  <Link to={`/journal/${baiDangDoc.slug}`} className="underlink">
                    Mở trang bài viết →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
