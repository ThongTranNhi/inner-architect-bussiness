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
 * Danh sách các từ dừng (stopwords) thông dụng trong tiếng Việt cần loại bỏ khi trích xuất từ khóa.
 */
const TU_DUNG_TIENG_VIET = new Set([
  "va", "la", "cua", "cho", "voi", "trong", "de", "co", "mot", "nhung", "cac", "nay", "do",
  "khi", "duoc", "nguoi", "khong", "minh", "ban", "ta", "vua", "dang", "se", "da", "lai",
  "ra", "vao", "len", "xuong", "nhu", "the", "gi", "nao", "sao", "ai", "dau", "roi", "hay",
  "boi", "vi", "den", "tu", "ve", "cung", "ma", "hon", "rat", "qua", "thi", "neu", "chi",
  "lam", "nhieu", "it", "tat", "ca", "biet"
])

/**
 * Chuẩn hóa chuỗi văn bản: chuyển chữ thường, loại bỏ dấu tiếng Việt và ký tự đặc biệt.
 */
function chuanHoaVanBan(str: string): string {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .trim()
}

/**
 * Trích xuất các từ khóa đặc trưng từ chuỗi văn bản.
 */
function trichXuatTuKhoa(str: string): string[] {
  return Array.from(
    new Set(
      chuanHoaVanBan(str)
        .split(/\s+/)
        .filter((w) => w.length > 2 && !TU_DUNG_TIENG_VIET.has(w))
    )
  )
}

/**
 * Tìm bài viết liên quan trong TOÀN BỘ bài viết (xuyên suốt tất cả các chuyên mục)
 * dựa trên từ khóa chính của bài viết hiện tại.
 *
 * @param baiGoc - Bài viết hiện tại
 * @param danhSach - Toàn bộ bài viết có sẵn
 * @param soLuong - Số lượng bài liên quan cần lấy (mặc định: 3)
 */
export function timBaiLienQuanTheoTuKhoa(
  baiGoc: BaiJournal,
  danhSach: readonly BaiJournal[],
  soLuong: number = 3
): BaiJournal[] {
  const khac = danhSach.filter((b) => b.slug !== baiGoc.slug)
  if (khac.length <= soLuong) return khac

  // Lấy từ khóa chính từ tiêu đề (trọng số cao nhất) và phần mô tả tóm tắt
  const tuKhoaTieuDe = trichXuatTuKhoa(baiGoc.title)
  const tuKhoaMoTa = trichXuatTuKhoa(`${baiGoc.summary || ""} ${baiGoc.dek || ""}`)

  // Tính điểm khớp từ khóa cho từng bài viết trong toàn bộ thư viện
  const danhSachCoDiem = khac.map((b) => {
    const textTieuDe = chuanHoaVanBan(b.title)
    const textMoTa = chuanHoaVanBan(`${b.summary || ""} ${b.dek || ""}`)

    let diem = 0
    // Khớp từ khóa tiêu đề:
    for (const tk of tuKhoaTieuDe) {
      if (textTieuDe.includes(tk)) diem += 6
      if (textMoTa.includes(tk)) diem += 2
    }
    // Khớp từ khóa tóm tắt:
    for (const tk of tuKhoaMoTa) {
      if (textTieuDe.includes(tk)) diem += 3
      if (textMoTa.includes(tk)) diem += 1
    }

    return { bai: b, diem }
  })

  // Sắp xếp giảm dần theo điểm khớp từ khóa
  danhSachCoDiem.sort((a, b) => b.diem - a.diem)

  return danhSachCoDiem.slice(0, soLuong).map((item) => item.bai)
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
  const lienQuan = timBaiLienQuanTheoTuKhoa(bai, danhSach, 3)

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
