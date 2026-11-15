import { type CSSProperties, useEffect } from "react"
import { Link } from "../dieu-huong"
import { BaiJournalHienThi } from "../journal/BaiJournalHienThi"
import {
  dinhDangNgayJournal,
  nhanChuyenMuc,
  useBaiJournal,
  useDuLieuJournal,
  type BaiJournal,
} from "../journal/du-lieu-journal"
import { kichThuocAnh } from "../journal/loc-journal"

/**
 * Thẻ bài viết liên quan ở cuối trang chi tiết.
 *
 * @param props.item - Bài công khai
 * @param props.nhan - Nhãn chuyên mục
 * @param props.index - Vị trí (để so le hiệu ứng)
 * @returns Thẻ liên kết tới bài
 */
export function NewsCard({ item, nhan, index = 0 }: { item: BaiJournal; nhan: string; index?: number }) {
  const delayMs = (index % 4) * 120

  return (
    <div
      className="inviewfade journal-card-reveal"
      style={{ "--jr-delay": `${delayMs}ms` } as CSSProperties}
    >
      <Link to={`/journal/${item.slug}`} className="ogata-news-card news-card">
        <div className="ogata-img-box news-image">
          {item.image && (
            <img
              src={item.image}
              alt={item.imageAlt}
              loading="lazy"
              decoding="async"
              {...kichThuocAnh(item.image, item.imageWidth, item.imageHeight)}
            />
          )}
        </div>
        <span className="news-grid__tag">{nhan}</span>
        <p className="news-grid__date">{dinhDangNgayJournal(item.date)} | CHIÊM NGHIỆM SÂU</p>
        <p className="news-grid__title">
          {item.title}
          <br />
          <i>{item.dek}</i>
        </p>
      </Link>
    </div>
  )
}

/**
 * Hiện các phần tử `.inviewfade` (thẻ "Bài viết liên quan") khi chúng cuộn
 * tới 75% chiều cao màn hình trên trang chi tiết bài viết, để các thẻ này không
 * bị kẹt ở trạng thái ẩn.
 *
 * @param khoaLamMoi - Giá trị thay đổi khi nội dung trang đổi (ví dụ slug bài
 *   viết) để kiểm tra lại các thẻ vừa được render
 */
export function useOgataInview(khoaLamMoi?: string) {
  useEffect(() => {
    const triggerOgataInview = () => {
      const targets = document.getElementsByClassName("inviewfade")
      const position = Math.floor(window.innerHeight * 0.75)
      for (let i = 0; i < targets.length; i++) {
        const offsetTop = Math.floor(targets[i].getBoundingClientRect().top)
        if (offsetTop < position) {
          targets[i].classList.add("inviewfadein")
        }
      }
    }

    triggerOgataInview()
    window.addEventListener("scroll", triggerOgataInview, { passive: true })
    window.addEventListener("resize", triggerOgataInview, { passive: true })

    const timer = setTimeout(triggerOgataInview, 50)

    return () => {
      window.removeEventListener("scroll", triggerOgataInview)
      window.removeEventListener("resize", triggerOgataInview)
      clearTimeout(timer)
    }
  }, [khoaLamMoi])
}

/**
 * Ghi tiêu đề và mô tả của bài vào `<head>` (sau khi tải xong bài).
 *
 * @param tieuDe - Tiêu đề trang
 * @param moTa - Mô tả meta
 */
function datSeoBaiViet(tieuDe: string, moTa: string) {
  document.title = tieuDe
  for (const [khoa, ten] of [
    ["name", "description"],
    ["property", "og:description"],
  ] as const) {
    document.head.querySelector<HTMLMetaElement>(`meta[${khoa}="${ten}"]`)?.setAttribute("content", moTa)
  }
  document.head.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", tieuDe)
}

/**
 * Trang chi tiết bài Journal `/journal/<slug>`: nội dung bản công khai (đã xuất bản),
 * điều hướng bài trước/sau và bài liên quan. Bài chưa xuất bản hoặc không tồn tại → báo không tìm thấy.
 *
 * @param props.slug - Slug trên URL
 * @returns Trang bài viết
 */
export function Article({ slug }: { slug: string }) {
  const { trangThai, bai, thuLai } = useBaiJournal(slug)
  const { duLieu } = useDuLieuJournal()
  useOgataInview(bai ? slug : undefined)

  const danhSach = duLieu?.articles ?? []
  const chuyenMuc = duLieu?.categories ?? []
  const nhan = bai ? nhanChuyenMuc(chuyenMuc, bai.categoryId) : ""

  useEffect(() => {
    if (bai) datSeoBaiViet(`${bai.title} — INNER ARCHITECT™`, bai.summary)
    else if (trangThai === "khong-co") document.title = "Không tìm thấy bài viết — INNER ARCHITECT™"
  }, [bai, trangThai])

  if (trangThai === "dang-tai") return <main className="article-page trang-dang-tai" aria-busy="true" />
  if (!bai)
    return (
      <main className="article-page">
        <section className="article-head">
          <p className="eyebrow">JOURNAL</p>
          <h1 className="serif">{trangThai === "khong-co" ? "Không tìm thấy bài viết" : "Chưa tải được bài viết"}</h1>
          <p className="dek">
            {trangThai === "khong-co"
              ? "Bài viết có thể đã được gỡ hoặc đường dẫn không còn đúng."
              : "Vui lòng kiểm tra kết nối mạng rồi thử lại."}
          </p>
          <p className="article-actions">
            {trangThai === "loi" && (
              <button type="button" className="button-link" onClick={thuLai}>
                Thử lại
              </button>
            )}
            <Link to="/journal" className="underlink">
              Trở về Journal
            </Link>
          </p>
        </section>
      </main>
    )

  const viTri = danhSach.findIndex((n) => n.slug === bai.slug)
  const baiTruoc = viTri >= 0 && danhSach.length > 1 ? danhSach[(viTri - 1 + danhSach.length) % danhSach.length] : undefined
  const baiSau = viTri >= 0 && danhSach.length > 1 ? danhSach[(viTri + 1) % danhSach.length] : undefined
  const khac = danhSach.filter((n) => n.slug !== bai.slug)
  const lienQuan = [...khac.filter((n) => n.categoryId === bai.categoryId), ...khac.filter((n) => n.categoryId !== bai.categoryId)].slice(0, 3)

  return (
    <main className="article-page">
      <BaiJournalHienThi
        bai={{
          tieuDe: bai.title,
          doanGioiThieu: bai.summary,
          nhanChuyenMuc: nhan,
          ngay: dinhDangNgayJournal(bai.date),
          anhBia: bai.image,
          moTaAnhBia: bai.imageAlt,
          anhRong: bai.imageWidth,
          anhCao: bai.imageHeight,
          noiDung: bai.content,
        }}
      />
      {baiTruoc && baiSau && (
        <section className="article-nav">
          <Link to={`/journal/${baiTruoc.slug}`}>← {baiTruoc.title}</Link>
          <Link to={`/journal/${baiSau.slug}`}>{baiSau.title} →</Link>
        </section>
      )}
      <section className="related section-pad">
        <p className="eyebrow">RELATED JOURNAL · BÀI VIẾT LIÊN QUAN</p>
        <div className="news-grid">
          {lienQuan.map((n, i) => (
            <NewsCard key={n.slug} item={n} nhan={nhanChuyenMuc(chuyenMuc, n.categoryId)} index={i} />
          ))}
        </div>
        <div className="article-actions">
          <Link to="/journal" className="underlink">
            Trở về Journal
          </Link>
          <Link to="/chuong-trinh" className="button-link">
            Khám phá Chương trình
          </Link>
        </div>
      </section>
    </main>
  )
}
