import { useRef, useState } from "react"
import { Link } from "../dieu-huong"
import {
  layThuocTinhHieuUng as hieuUng,
  useHieuUngCuon,
} from "../founder/hieu-ung"
import {
  BO_LOC_JOURNAL,
  kichThuocAnh,
  kieuHienAnh,
  layBaiTieuBieu,
  locBaiJournal,
  tenChuyenMuc,
  type BaiJournal,
  type ChuyenDeJournal,
} from "./loc-journal"

/**
 * Trang Journal `/journal` — "thư viện chiêm nghiệm".
 *
 * Bố cục:
 * - Masthead: Tiêu đề Explore Within & lời tựa triết lý
 * - Cụm tiêu biểu (Featured Showcase): 1 bài tiêu điểm chính (khổ lớn sang trọng,
 *   nền nâu dải tràn viền) + 2 bài tiêu biểu phụ bên dưới.
 * - Thư viện bài viết: Thanh lọc theo chuyên mục (Tất cả, Hiểu mình, Mối quan hệ,
 *   Minh triết, Tarot, Sống tỉnh thức, The Hermit) + Lưới 3 cột dạng tạp chí
 *   (Editorial Grid) + Nút Xem thêm khi có nhiều bài.
 * - Signature Series: 3 chuyên đề dài hạn chuyên sâu.
 *
 * Dễ dàng mở rộng cho nhân viên: khi thêm bài viết mới vào dữ liệu, chỉ cần gắn
 * `category` và nội dung, bài sẽ tự động vào lưới; gắn `tieuBieu: true` để đưa lên
 * khu vực tiêu biểu.
 */

type JournalPageProps = {
  baiViet: readonly BaiJournal[]
  chuyenDe: readonly ChuyenDeJournal[]
}

export function JournalPage({ baiViet, chuyenDe }: JournalPageProps) {
  const trangRef = useRef<HTMLElement>(null)
  useHieuUngCuon(trangRef, { hienNgay: ".jr-masthead [data-reveal]" })

  const [chuyenMucChon, setChuyenMucChon] = useState<string | null>(null)
  const [soLuongHienThi, setSoLuongHienThi] = useState<number>(6)

  // 3 bài tiêu biểu phía trên
  const tieuBieu = layBaiTieuBieu(baiViet, 3)
  const tieuDiem = tieuBieu[0]
  const tieuBieuPhu = tieuBieu.slice(1, 3)

  // Lọc bài cho thư viện phía dưới
  const slugsTieuBieu = tieuBieu.map((b) => b.slug)
  const baiDaLoc = locBaiJournal(baiViet, chuyenMucChon, slugsTieuBieu)
  const baiHienThi = baiDaLoc.slice(0, soLuongHienThi)
  const conLai = baiDaLoc.length - soLuongHienThi

  return (
    <main ref={trangRef} className="journal-page">
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

      {tieuDiem && (
        <section className="jr-featured" aria-labelledby="jr-tieu-diem">
          <div className="jr-featured-container">
            {/* Bài tiêu điểm chính */}
            <Link
              to={`/journal/${tieuDiem.slug}`}
              className="jr-featured-link"
            >
              <figure
                className="jr-featured-media"
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
              <div className="jr-featured-copy">
                <p className="jr-featured-meta" {...hieuUng("len", 1)}>
                  Bài tiêu điểm · {tenChuyenMuc(tieuDiem.category)} ·{" "}
                  {tieuDiem.date}
                </p>
                <h2 id="jr-tieu-diem" className="serif" {...hieuUng("len", 2)}>
                  {tieuDiem.title}
                  <em>{tieuDiem.italic}</em>
                </h2>
                <p className="jr-featured-summary" {...hieuUng("len", 3)}>
                  {tieuDiem.summary}
                </p>
                <span className="jr-featured-cta" {...hieuUng("len", 4)}>
                  Đọc bài viết tiêu điểm
                </span>
              </div>
            </Link>

            {/* 2 bài tiêu biểu phụ */}
            {tieuBieuPhu.length > 0 && (
              <div className="jr-featured-sub-grid">
                {tieuBieuPhu.map((bai, idx) => (
                  <Link
                    key={bai.slug}
                    to={`/journal/${bai.slug}`}
                    className="jr-featured-sub-card"
                    {...hieuUng("len", idx + 2)}
                  >
                    <figure className="jr-featured-sub-media">
                      <img
                        src={bai.image}
                        alt={bai.title}
                        loading="lazy"
                        decoding="async"
                        {...kichThuocAnh(bai.image)}
                      />
                    </figure>
                    <div className="jr-featured-sub-copy">
                      <p className="jr-featured-sub-meta">
                        <span>Tiêu biểu</span> · {tenChuyenMuc(bai.category)} ·{" "}
                        {bai.date}
                      </p>
                      <h3 className="serif jr-featured-sub-title">
                        {bai.title}
                      </h3>
                      {bai.italic && (
                        <p className="serif jr-featured-sub-dek">{bai.italic}</p>
                      )}
                      <p className="jr-featured-sub-summary">{bai.summary}</p>
                      <span className="jr-featured-sub-cta">
                        Đọc bài viết →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="jr-library" aria-labelledby="jr-thu-vien">
        <header className="jr-library-head">
          <div className="jr-library-title-row">
            <h2 id="jr-thu-vien" className="serif" {...hieuUng("len", 0)}>
              Chuyên mục bài viết
            </h2>
            <span className="jr-library-count">
              {baiDaLoc.length} bài viết
            </span>
          </div>

          <nav className="jr-filter" aria-label="Lọc bài viết theo chuyên mục">
            {BO_LOC_JOURNAL.map((loc) => {
              const dangChon = chuyenMucChon === loc.danhMuc
              return (
                <button
                  key={loc.nhan}
                  type="button"
                  className={`jr-filter-btn ${dangChon ? "is-active" : ""}`}
                  onClick={() => {
                    setChuyenMucChon(loc.danhMuc)
                    setSoLuongHienThi(6)
                  }}
                >
                  {loc.nhan}
                </button>
              )
            })}
          </nav>
        </header>

        {baiHienThi.length > 0 ? (
          <div className="jr-grid">
            {baiHienThi.map((bai, i) => (
              <article
                key={bai.slug}
                className="jr-card"
                {...hieuUng("len", (i % 3) + 1)}
              >
                <Link to={`/journal/${bai.slug}`} className="jr-card-link">
                  <figure
                    className="jr-card-media"
                    data-anh={kieuHienAnh(i)}
                    {...hieuUng("anh", 0)}
                  >
                    <img
                      src={bai.image}
                      alt={bai.title}
                      loading="lazy"
                      decoding="async"
                      {...kichThuocAnh(bai.image)}
                    />
                  </figure>
                  <div className="jr-card-copy">
                    <p className="jr-card-meta">
                      <span className="jr-card-cat">{tenChuyenMuc(bai.category)}</span>
                      <time className="jr-card-date">{bai.date}</time>
                    </p>
                    <h3 className="serif jr-card-title">{bai.title}</h3>
                    {bai.italic && (
                      <p className="serif jr-card-dek">{bai.italic}</p>
                    )}
                    <p className="jr-card-summary">{bai.summary}</p>
                    <span className="jr-card-cta">Đọc bài viết →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="jr-empty">
            <p>Chưa có bài viết nào trong chuyên mục này.</p>
          </div>
        )}

        {conLai > 0 && (
          <div className="jr-load-more">
            <button
              type="button"
              className="jr-load-more-btn"
              onClick={() => setSoLuongHienThi((prev) => prev + 6)}
            >
              Xem thêm bài viết (còn {conLai} bài)
            </button>
          </div>
        )}
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
    </main>
  )
}
