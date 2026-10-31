import { useRef } from "react"
import { Link } from "../dieu-huong"
import {
  layThuocTinhHieuUng as hieuUng,
  useHieuUngCuon,
} from "../founder/hieu-ung"
import {
  kichThuocAnh,
  kieuHienAnh,
  locBaiJournal,
  tenChuyenMuc,
  type BaiJournal,
  type ChuyenDeJournal,
} from "./loc-journal"

/**
 * Trang Journal `/journal` — "thư viện chiêm nghiệm".
 *
 * Bố cục: masthead → bài tiêu điểm trên dải nâu đậm (chữ trái, ảnh phải) →
 * thư viện bài viết, mỗi bài là một hàng so le (ảnh đổi bên trái/phải luân
 * phiên) → Signature Series dạng hàng biên tập. Nội dung bài viết và
 * chuyên đề được truyền vào từ `App.tsx`; file này không chứa dữ liệu bài.
 *
 * Hiệu ứng dùng chung hook `useHieuUngCuon` của trang Founder (một
 * IntersectionObserver, chạy một lần, tôn trọng reduced motion, nội dung luôn
 * hiện khi thiếu JS/IntersectionObserver). CSS nằm trong `index.css`, khối
 * `JOURNAL — THƯ VIỆN CHIÊM NGHIỆM`.
 */

type JournalPageProps = {
  baiViet: readonly BaiJournal[]
  chuyenDe: readonly ChuyenDeJournal[]
}

export function JournalPage({ baiViet, chuyenDe }: JournalPageProps) {
  const trangRef = useRef<HTMLElement>(null)
  useHieuUngCuon(trangRef, { hienNgay: ".jr-masthead [data-reveal]" })

  const tieuDiem = baiViet[0]
  const dangHien = locBaiJournal(baiViet, null, tieuDiem.slug)

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

      <section className="jr-featured" aria-labelledby="jr-tieu-diem">
        <Link to={`/journal/${tieuDiem.slug}`} className="jr-featured-link">
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
      </section>

      <section className="jr-library" aria-labelledby="jr-thu-vien">
        <header className="jr-library-head">
          <h2 id="jr-thu-vien" className="serif" {...hieuUng("len", 0)}>
            Chuyên mục bài viết
          </h2>
        </header>

        <div className="jr-list">
          {dangHien.map((bai, i) => {
            // Hàng lẻ (i chẵn): ảnh trái – chữ phải; hàng chẵn đổi lại.
            const anhBenTrai = i % 2 === 0
            return (
              <article
                key={bai.slug}
                className={`jr-row ${anhBenTrai ? "jr-row--anh-trai" : "jr-row--anh-phai"}`}
              >
                <Link to={`/journal/${bai.slug}`}>
                  <figure
                    className="jr-row-media"
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
                  {/* Chữ trượt vào từ phía đối diện ảnh */}
                  <div
                    className="jr-row-copy"
                    {...hieuUng(anhBenTrai ? "phai" : "trai", 1)}
                  >
                    <p className="jr-row-meta">
                      <span>{tenChuyenMuc(bai.category)}</span>
                      <time>{bai.date}</time>
                    </p>
                    <h3 className="serif">{bai.title}</h3>
                    <p className="jr-row-dek serif">{bai.italic}</p>
                    <p className="jr-row-summary">{bai.summary}</p>
                    <span className="jr-row-cta">Đọc bài viết</span>
                  </div>
                </Link>
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
    </main>
  )
}
