import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { contactChannels } from "./config/contact"
import { cuonDenPhanTu, Link } from "./dieu-huong"
import { news, signatureSeriesList } from "./du-lieu/bai-viet"
import { danhSachChiTietChuongTrinh } from "./du-lieu/chuong-trinh"
import { IMG } from "./du-lieu/hinh-anh"

// Trang chủ (Home) nằm trong file này và tải ngay; mọi trang phụ được tách
// thành chunk riêng và chỉ tải khi người dùng mở route tương ứng.

const KHOA_TAI_LAI_CHUNK = "inner-architect:tai-lai-chunk"

/**
 * Nạp module của một trang lazy. Sau khi deploy, chunk của bản cũ không còn
 * trên server; một tab đang mở bản cũ sẽ không tải được trang phụ. Khi đó tải
 * lại trang một lần để nhận `index.html` mới; nếu vẫn lỗi trong cùng phiên thì
 * ném lỗi ra thay vì tải lại vô hạn.
 *
 * @param nap - Hàm `import()` động của module trang
 * @returns Promise của module
 * @throws Lỗi tải module gốc khi đã thử tải lại trong phiên này
 */
function napModule<T>(nap: () => Promise<T>): Promise<T> {
  return nap().then(
    (module) => {
      try {
        sessionStorage.removeItem(KHOA_TAI_LAI_CHUNK)
      } catch {
        // sessionStorage có thể bị chặn; bỏ qua.
      }
      return module
    },
    (loi: unknown) => {
      let daThu = true
      try {
        daThu = sessionStorage.getItem(KHOA_TAI_LAI_CHUNK) === "1"
        if (!daThu) sessionStorage.setItem(KHOA_TAI_LAI_CHUNK, "1")
      } catch {
        // Không lưu được dấu thì không tải lại, tránh vòng lặp.
      }
      if (daThu) throw loi
      window.location.reload()
      return new Promise<T>(() => {})
    },
  )
}
const JournalPage = lazy(() =>
  napModule(() => import("./journal/JournalPage")).then((m) => ({
    default: m.JournalPage,
  })),
)
const FounderPage = lazy(() =>
  napModule(() => import("./founder/FounderPage")).then((m) => ({
    default: m.FounderPage,
  })),
)
const Article = lazy(() =>
  napModule(() => import("./trang/BaiViet")).then((m) => ({
    default: m.Article,
  })),
)
const Programmes = lazy(() =>
  napModule(() => import("./trang/ChuongTrinh")).then((m) => ({
    default: m.Programmes,
  })),
)
const Hermit = lazy(() =>
  napModule(() => import("./trang/TheHermit")).then((m) => ({
    default: m.Hermit,
  })),
)
const LaraPage = lazy(() =>
  napModule(() => import("./trang/Lara")).then((m) => ({
    default: m.LaraPage,
  })),
)
const ContactPage = lazy(() =>
  napModule(() => import("./trang/LienHe")).then((m) => ({
    default: m.ContactPage,
  })),
)
const FaqPage = lazy(() =>
  napModule(() => import("./trang/HoiDap")).then((m) => ({
    default: m.FaqPage,
  })),
)
const LegalPage = lazy(() =>
  napModule(() => import("./trang/PhapLy")).then((m) => ({
    default: m.LegalPage,
  })),
)
const NotFoundPage = lazy(() =>
  napModule(() => import("./trang/KhongTimThay")).then((m) => ({
    default: m.NotFoundPage,
  })),
)

/**
 * Danh mục điều hướng chi tiết cho Menu Overlay toàn màn hình.
 * Bao gồm đường dẫn tới trang chủ, phụ đề gợi mở và ảnh đại diện tương ứng.
 */
interface MucDieuHuongMenu {
  nhan: string
  duongDan: string
  moTa: string
  anhPreview: string
}

const danhSachDieuHuongMenu: MucDieuHuongMenu[] = [
  {
    nhan: "Trang chủ",
    duongDan: "/",
    moTa: "Xây trật tự bên trong để sống tự chủ",
    anhPreview: IMG.homeCuratedHero,
  },
  {
    nhan: "Journal",
    duongDan: "/journal",
    moTa: "Thư viện tri thức & chiêm nghiệm",
    anhPreview: IMG.journalReading,
  },
  {
    nhan: "Chương trình",
    duongDan: "/chuong-trinh",
    moTa: "Các khóa đào tạo & Không gian thực hành",
    anhPreview: IMG.homeCuratedWorkshop,
  },
  {
    nhan: "The Hermit",
    duongDan: "/the-hermit",
    moTa: "Không gian thưởng trà & Tĩnh tại",
    anhPreview: IMG.hermitHall,
  },
  {
    nhan: "Liên hệ",
    duongDan: "/lien-he",
    moTa: "Một kênh Zalo / Facebook chung",
    anhPreview: IMG.homeGeneratedSessionEntry,
  },
]

function Header({
  open,
  setOpen,
  home,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  home: boolean
}) {
  const [hidden, setHidden] = useState(false)
  const [overHero, setOverHero] = useState(home)
  const [anhPreviewHover, setAnhPreviewHover] = useState<string | null>(null)
  // Menu ẩn bằng visibility nên ảnh vẫn bị tải nếu luôn có trong DOM; chỉ gắn
  // ảnh preview từ lần mở menu đầu tiên trở đi.
  const [daMoMenu, setDaMoMenu] = useState(open)
  useEffect(() => {
    if (open) setDaMoMenu(true)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, setOpen])

  useEffect(() => {
    let previous = window.scrollY
    const onScroll = () => {
      const current = window.scrollY
      setHidden(!home && current > previous && current > 120)
      setOverHero(home && current < window.innerHeight * 0.82)
      previous = current
    }
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [home])
  return (
    <>
      <header
        className={`site-header ${hidden ? "nav-hidden" : ""} ${
          overHero ? "hero-state" : "editorial-state"
        }`}
      >
        <button
          className="menu-button"
          onClick={() => setOpen(true)}
          aria-label="Mở menu"
        >
          <i />
          <i />
        </button>
        <Link to="/" className="wordmark">
          INNER ARCHITECT<sup>™</sup>
        </Link>
        <nav className="context-nav">
          <Link to="/vo-khiem">About me</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/chuong-trinh">Chương trình</Link>
          <Link to="/the-hermit">The Hermit</Link>
        </nav>
        <span className="language">VI</span>
        <Link to="/lien-he" className="book-link">
          Liên hệ
        </Link>
      </header>
      <div
        className={`menu-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-top">
          <div className="menu-top-brand">
            <strong>INNER ARCHITECT™</strong>
            <span>·</span>
            <small>SƠ ĐỒ ĐIỀU HƯỚNG</small>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="close"
            aria-label="Đóng menu"
          >
            Đóng ×
          </button>
        </div>
        <div className="menu-grid">
          <nav className="menu-links-list">
            {danhSachDieuHuongMenu.map((item, i) => (
              <Link
                key={item.duongDan}
                to={item.duongDan}
                className="menu-link menu-link-card"
                onClick={() => setOpen(false)}
                onMouseEnter={() => setAnhPreviewHover(item.anhPreview)}
                onMouseLeave={() => setAnhPreviewHover(null)}
              >
                <span className="menu-link-index">0{i + 1}</span>
                <div className="menu-link-text">
                  <h2 className="serif menu-link-title">{item.nhan}</h2>
                  <p className="menu-link-desc">{item.moTa}</p>
                </div>
                <span className="menu-link-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>
          <aside className="menu-aside">
            <div className="menu-preview-media">
              {daMoMenu && (
                <img
                  src={anhPreviewHover || IMG.journalReading}
                  alt="Hình ảnh không gian và chiêm nghiệm"
                  key={anhPreviewHover || "mac-dinh"}
                  className="menu-preview-img"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
            <div className="menu-aside-content">
              <p className="eyebrow">FEATURED · CHIÊM NGHIỆM</p>
              <Link
                to="/journal/tarot-khong-phai-loi-tien-doan"
                className="serif menu-feature"
                onClick={() => setOpen(false)}
              >
                Tarot không phải lời tiên đoán
              </Link>
              <blockquote className="menu-aside-quote serif">
                “Cấu trúc trước. Diễn giải sau. Con người luôn là chủ thể duy
                nhất quyết định cuộc đời mình.”
              </blockquote>
              <div className="menu-contact">
                <div className="menu-contact-links">
                  <Link to="/vo-khiem" onClick={() => setOpen(false)}>
                    Võ Khiêm
                  </Link>
                  <span>·</span>
                  <Link to="/lara" onClick={() => setOpen(false)}>
                    LARA
                  </Link>
                  <span>·</span>
                  <Link to="/he-thong" onClick={() => setOpen(false)}>
                    Đạo đức &amp; Ranh giới
                  </Link>
                  <span>·</span>
                  <Link to="/faq" onClick={() => setOpen(false)}>
                    FAQ
                  </Link>
                </div>
                <p className="menu-contact-info">
                  info@innerarchitect.vn · TP. Hồ Chí Minh
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

function Footer({ home = false }: { home?: boolean }) {
  if (home)
    return (
      <footer className="home-footer">
        <div className="home-footer-statement serif">
          Bắt đầu không phải bằng một câu trả lời.
          <br />
          Bắt đầu bằng việc nhìn rõ mình đang ở đâu.
        </div>
        <p>
          Nhắn cho INNER ARCHITECT™ qua kênh liên hệ chung để làm rõ trạng thái
          hiện tại, nhu cầu và bước tiếp theo phù hợp.
        </p>
        <Link to="/lien-he" className="footer-cta">
          Liên hệ INNER ARCHITECT™
        </Link>
        <div className="home-footer-nav">
          <span>INNER ARCHITECT™</span>
          <Link to="/he-thong">Hệ thống</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/chuong-trinh">Chương trình</Link>
          <Link to="/the-hermit">The Hermit</Link>
          <Link to="/lien-he">Liên hệ</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/vo-khiem">Võ Khiêm</Link>
          <Link to="/lara">LARA</Link>
          {contactChannels.facebook && (
            <a
              href={contactChannels.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          )}
          <a href="mailto:info@innerarchitect.vn">info@innerarchitect.vn</a>
          <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
          <Link to="/pham-vi-ho-tro">Tuyên bố phạm vi hỗ trợ</Link>
        </div>
      </footer>
    )
  return (
    <footer>
      <div className="footer-intro">
        <h2 className="serif">
          INNER ARCHITECT™ hỗ trợ con người xây lại trật tự bên trong và trở về
          với khả năng tự dẫn dắt.
        </h2>
      </div>
      <div className="footer-links">
        <div>
          <b>INNER ARCHITECT™</b>
          <br />
          Integrated Healing System
          <br />
          Không tìm bình an. Xây trật tự bên trong.
        </div>
        <div>
          <b>KHÁM PHÁ</b>
          <br />
          <Link to="/he-thong">Hệ thống</Link>
          <br />
          <Link to="/journal">Journal</Link>
          <br />
          <Link to="/chuong-trinh">Chương trình</Link>
          <br />
          <Link to="/the-hermit">The Hermit</Link>
          <br />
          <Link to="/vo-khiem">Võ Khiêm</Link>
          <br />
          <Link to="/lara">LARA</Link>
        </div>
        <div>
          <b>BẮT ĐẦU</b>
          <br />
          <Link to="/lien-he">Liên hệ</Link>
          <br />
          <Link to="/faq">Câu hỏi thường gặp</Link>
          <br />
          <a href="mailto:info@innerarchitect.vn">info@innerarchitect.vn</a>
          <br />
          637/13/8 Quang Trung, Phường Thông Tây Hội, TP. Hồ Chí Minh
        </div>
        <div>
          <b>THÔNG TIN</b>
          <br />
          <Link to="/he-thong">Đạo đức và ranh giới</Link>
          <br />
          <Link to="/pham-vi-ho-tro">Tuyên bố phạm vi hỗ trợ</Link>
          <br />
          <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
          <br />
          CÔNG TY TNHH INNER ARCHITECT
          <br />
          MST: 0319353708
        </div>
      </div>
      <div className="footer-wordmark">
        INNER ARCHITECT<sup>™</sup>
      </div>
    </footer>
  )
}

/**
 * Danh sách 4 tầng hỗ trợ trong hệ thống INNER ARCHITECT™.
 * Định hình phương pháp luận tích hợp giữa nhận thức, cảm xúc, thân thể và đời sống.
 */
const danhSachBonTang = [
  {
    so: "01",
    ten: "Tiếp cận & Soi chiếu",
    linhVuc: "The Hermit · Tarot",
    moTa:
      "Bắt đầu tại The Hermit qua không gian trà và các phiên Tarot soi chiếu.",
    anh: IMG.homeFemaleAdvisor,
    alt: "Nữ tư vấn trò chuyện cùng khách trong một phiên tiếp cận riêng",
  },
  {
    so: "02",
    ten: "Khám phá & Thay đổi khuôn mẫu",
    linhVuc: "Cảm xúc · Niềm tin",
    moTa:
      "Nhìn lại tổn thương, cảm xúc và niềm tin để hiểu những khuôn mẫu lặp lại, từng bước thay đổi cách phản ứng và lựa chọn trong cuộc sống.",
    anh: IMG.homeCuratedReflective,
    alt: "Bàn ghi chép trong một buổi thực hành phản tư",
  },
  {
    so: "03",
    ten: "Định hướng & Phát triển",
    linhVuc: "Giá trị · Hành động",
    moTa:
      "Làm rõ giá trị bản thân, xác định hướng đi và xây dựng mục tiêu phù hợp. Từng bước đưa định hướng thành hành động cụ thể trong công việc và cuộc sống.",
    anh: IMG.homeCuratedHermit,
    alt: "Góc thưởng trà định tâm tại The Hermit",
  },
  {
    so: "04",
    ten: "Chăm sóc thân thể & Cân bằng",
    linhVuc: "Cơ thể · Nhịp sống",
    moTa:
      "Lắng nghe cơ thể, thực hành thư giãn và xây dựng nhịp sống cân bằng.",
    anh: IMG.homeCuratedWorkshop,
    alt: "Màu vẽ và không gian workshop Chạm",
  },
]

/**
 * Danh sách 2 hình ảnh nền tuyển chọn cho Hero Banner Trang Chủ.
 * Tự động luân phiên vòng lặp giữa Bàn Tarot và Sảnh chính The Hermit.
 */
const danhSachAnhHero = [
  {
    src: IMG.homeCuratedHero,
    alt: "Bàn Tarot phủ khăn thổ cẩm trong không gian ánh sáng nến ấm",
    nhan: "Bàn Tarot",
  },
  {
    src: IMG.hermitHall,
    alt: "Sảnh chính The Hermit với ánh sáng ấm và kệ nến thơm LARA",
    nhan: "Sảnh chính",
  },
]

/**
 * Tính toán chỉ số ảnh tiếp theo cho chuỗi ảnh nền hero trang chủ.
 *
 * @param {number} chiSoHienTai - Vị trí của ảnh nền đang hiển thị trong danh sách (0-indexed)
 * @param {number} tongSoLuong - Tổng số lượng hình ảnh nền có sẵn
 * @returns {number} Chỉ số ảnh nền kế tiếp, tự động xoay vòng về 0 khi đến cuối danh sách
 */
function tinhChiSoAnhKeTiep(chiSoHienTai: number, tongSoLuong: number): number {
  if (tongSoLuong <= 0) return 0
  return (chiSoHienTai + 1) % tongSoLuong
}

/**
 * Component Trang Chủ hợp nhất cùng Hệ Thống (Unified Homepage & System).
 * Tích hợp trọn vẹn triết lý 4 tầng, khoảng trống cấu trúc, ranh giới đạo đức,
 * 4 cánh cửa trải nghiệm thực tế và phiên tiếp cận ban đầu 1:1.
 *
 * @param {Object} props - Thuộc tính truyền vào component
 * @param {string} [props.initialSection] - ID của section cần cuộn tới khi tải trang
 * @returns {JSX.Element} Giao diện trang chủ hợp nhất
 */
function Home({ initialSection }: { initialSection?: string }) {
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)

  useEffect(() => {
    if (heroPaused) return
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => tinhChiSoAnhKeTiep(prev, danhSachAnhHero.length))
    }, 4500)
    return () => window.clearInterval(timer)
  }, [heroPaused])

  useEffect(() => {
    if (!initialSection) return
    const timer = window.setTimeout(() => cuonDenPhanTu(initialSection), 150)
    return () => window.clearTimeout(timer)
  }, [initialSection])

  const [huongConTroHero, setHuongConTroHero] = useState<"phai" | "trai">("phai")

  /**
   * Chuyển về hình ảnh nền trước đó trong danh sách ảnh hero trang chủ.
   *
   * @returns {void}
   */
  function chuyenAnhHeroTruoc(): void {
    setHeroIndex((prev) => (prev - 1 + danhSachAnhHero.length) % danhSachAnhHero.length)
  }

  /**
   * Chuyển sang hình ảnh nền kế tiếp trong danh sách ảnh hero trang chủ.
   *
   * @returns {void}
   */
  function chuyenAnhHeroKeTiep(): void {
    setHeroIndex((prev) => (prev + 1) % danhSachAnhHero.length)
  }

  /**
   * Cập nhật hướng con trỏ chuột (trái/phải) dựa trên vị trí di chuyển chuột trong khu vực hero.
   *
   * @param {React.MouseEvent<HTMLElement>} e - Sự kiện di chuyển chuột
   * @returns {void}
   */
  function xuLyDiChuyenChuotHero(e: React.MouseEvent<HTMLElement>): void {
    const rect = e.currentTarget.getBoundingClientRect()
    const viTriX = e.clientX - rect.left
    const huongMoi = viTriX < rect.width / 2 ? "trai" : "phai"
    if (huongMoi !== huongConTroHero) {
      setHuongConTroHero(huongMoi)
    }
  }

  /**
   * Xử lý khi người dùng bấm vào vùng hero để chuyển đổi hình ảnh nền theo hướng con trỏ.
   * Bỏ qua nếu bấm vào nút hoặc liên kết tương tác.
   *
   * @param {React.MouseEvent<HTMLElement>} e - Sự kiện nhấp chuột
   * @returns {void}
   */
  function xuLyBamVungHero(e: React.MouseEvent<HTMLElement>): void {
    const mucTieu = e.target as HTMLElement
    if (mucTieu.closest("a, button, input, textarea")) return
    if (huongConTroHero === "trai") {
      chuyenAnhHeroTruoc()
    } else {
      chuyenAnhHeroKeTiep()
    }
  }

  const leadJournal = news[0]
  const journalRail = news.slice(1, 3)

  return (
    <main className="home-page home-editorial-v3 home-editorial-v4">
      <section
        className={"home-v3-hero cursor-hero-" + huongConTroHero}
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onMouseMove={xuLyDiChuyenChuotHero}
        onClick={xuLyBamVungHero}
      >
        <div className="home-v3-hero-slider" aria-hidden="true">
          <img
            className={"home-v3-hero-image " + (heroIndex === 0 ? "is-active" : "")}
            src={IMG.homeCuratedHero}
            alt="Bàn Tarot trong không gian ánh sáng ấm"
            loading="eager"
            fetchPriority="high"
          />
          {danhSachAnhHero.slice(1).map((anh, idx) => (
            <img
              key={anh.src}
              className={
                "home-v3-hero-image " +
                (heroIndex === idx + 1 ? "is-active" : "")
              }
              src={anh.src}
              alt={anh.alt}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <div className="home-v3-hero-scrim" />
        <div className="home-v3-hero-copy">
          <p className="home-v3-hero-kicker">
            INNER ARCHITECT™ · KIẾN TRÚC SƯ NỘI TÂM
          </p>
          <h1 className="serif">
            Xây trật tự bên trong,
            <br />
            <em>để sống tự chủ.</em>
          </h1>
          <div className="home-v3-hero-intro home-v4-hero-intro">
            <p>
              Inner Architect™ là hệ thống đồng hành giúp bạn khám phá bản
              thân, hiểu những khuôn mẫu đang lặp lại và từng bước xây dựng
              cách sống phù hợp với giá trị của mình.
            </p>
            <p>
              Qua các phiên soi chiếu, workshop và thực hành trong đời sống,
              chúng tôi cùng bạn nuôi dưỡng sự rõ ràng, xây dựng ranh giới và
              khả năng tự đứng vững.
            </p>
          </div>
          <div className="home-v3-hero-actions">
            <Link to="/he-thong" className="home-v3-link home-v3-link-light">
              Khám phá Inner Architect™
            </Link>
            <Link
              to="/chuong-trinh"
              className="home-v3-link home-v3-link-light"
            >
              Xem các hoạt động
            </Link>
          </div>
        </div>
      </section>

      <section id="gioi-thieu" className="home-v4-intro">
        <header className="home-v4-chapter-heading reveal-child">
          <p className="home-v3-label">INNER ARCHITECT™ LÀ GÌ?</p>
          <h2 className="serif">
            Kiến trúc sư nội tâm — xây nền từ sự thấu hiểu chính mình.
          </h2>
        </header>
        <div className="home-v4-intro-copy reveal-child">
          <p className="home-v4-lead serif">
            Có những lúc bạn hiểu vấn đề của mình nhưng vẫn khó thay đổi: tiếp
            tục làm hài lòng người khác, khó đặt giới hạn, hoặc lặp lại những
            lựa chọn khiến bản thân mệt mỏi.
          </p>
          <p>
            Inner Architect™ được Khiêm Võ sáng lập để đồng hành cùng bạn trong
            khoảng cách giữa <strong>“hiểu mình” và “sống khác đi”</strong>.
          </p>
          <p>
            Tên gọi “Kiến trúc sư nội tâm” thể hiện cách chúng tôi tiếp cận
            hành trình ấy: cùng nhìn lại những niềm tin, cảm xúc và khuôn mẫu
            đang ảnh hưởng đến cuộc sống; từ đó từng bước xây dựng nền tảng phù
            hợp với con người và giá trị của bạn.
          </p>
          <p>
            Mỗi điều nhận ra được kết nối với thực hành cụ thể — nói rõ nhu
            cầu, thiết lập ranh giới và lựa chọn có ý thức hơn trong các mối
            quan hệ, công việc và đời sống.
          </p>
          <p className="home-v4-statement serif">
            Bạn là người kiến tạo cuộc đời mình. Inner Architect™ đồng hành
            cùng bạn xây nền.
          </p>
        </div>
        <figure className="home-v4-intro-image home-v3-media reveal-child">
          <img
            src={IMG.homeGeneratedSessionEntry}
            alt="Nữ tư vấn trò chuyện cùng khách trong không gian ấm và riêng tư"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </section>

      <section id="he-thong" className="home-v4-companion">
        <div className="home-v4-companion-inner">
          <header className="home-v4-chapter-heading reveal-child">
            <p className="home-v3-label">TRIẾT LÝ ĐỒNG HÀNH</p>
            <h2 className="serif">
              Hiểu mình sâu hơn. Từng bước tự đứng vững.
            </h2>
            <p>
              Inner Architect™ tin rằng sự đồng hành có ý nghĩa khi giúp bạn
              hiểu bản thân và chủ động hơn trong cuộc sống. Bốn giá trị định
              hướng cách chúng tôi làm việc:
            </p>
          </header>

          <div className="home-v4-values">
            <article className="reveal-child">
              <span>01</span>
              <h3 className="serif">Rõ ràng — Hiểu mình trước khi thay đổi</h3>
              <p>
                Cùng nhìn lại cảm xúc, nhu cầu và những khuôn mẫu đang lặp lại,
                để hiểu điều gì đang ảnh hưởng đến cách bạn phản ứng và lựa
                chọn.
              </p>
            </article>
            <article className="reveal-child">
              <span>02</span>
              <h3 className="serif">
                Ranh giới — Tôn trọng giới hạn của mỗi người
              </h3>
              <p>
                Bạn được lựa chọn điều muốn chia sẻ, nhịp độ tham gia và thời
                điểm dừng lại. Mỗi hoạt động có mục tiêu, phạm vi và giới hạn
                rõ ràng.
              </p>
            </article>
            <article className="reveal-child">
              <span>03</span>
              <h3 className="serif">
                Trách nhiệm — Đưa điều nhận ra vào đời sống
              </h3>
              <p>
                Thay đổi bắt đầu từ những thực hành vừa sức: nói rõ một nhu
                cầu, giữ một giới hạn hoặc thử cách ứng xử mới trong tình huống
                quen thuộc.
              </p>
            </article>
            <article className="reveal-child">
              <span>04</span>
              <h3 className="serif">Tự chủ — Giữ quyền lựa chọn của bạn</h3>
              <p>
                Chúng tôi hỗ trợ bạn nhìn rõ các khả năng và cân nhắc bước tiếp
                theo. Bạn giữ quyền quyết định, đồng thời chủ động tìm kiếm hỗ
                trợ khi cần.
              </p>
            </article>
          </div>

          <p className="home-v4-companion-note serif reveal-child">
            Điều chúng tôi hướng đến là khả năng bạn tự mang những gì đã học
            vào cuộc sống của chính mình.
          </p>

          <div className="home-v4-layers-heading reveal-child">
            <p className="home-v3-label">HỆ THỐNG BỐN TẦNG</p>
            <h2 className="serif">
              Từ soi chiếu bản thân đến thay đổi trong đời sống.
            </h2>
            <p>
              Inner Architect™ được xây dựng theo bốn tầng chức năng, mỗi tầng
              có mục tiêu và phạm vi riêng. Việc lựa chọn hoạt động phù hợp dựa
              trên nhu cầu, mức độ sẵn sàng và khả năng hỗ trợ của đội ngũ.
            </p>
          </div>

          <div className="home-v3-system-gallery home-v4-layers">
            {danhSachBonTang.map((tang) => (
              <article className="home-v3-layer reveal-child" key={tang.so}>
                <figure className="home-v3-media">
                  <img
                    src={tang.anh}
                    alt={tang.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <p>
                  <span>{tang.so}</span>
                  {tang.linhVuc}
                </p>
                <h3 className="serif">{tang.ten}</h3>
                <p className="home-v4-layer-copy">{tang.moTa}</p>
              </article>
            ))}
          </div>

          <div className="home-v4-layers-closing reveal-child">
            <p className="serif">
              Mỗi tầng cùng hướng đến một mục tiêu: giúp bạn hiểu mình và từng
              bước sống tự chủ.
            </p>
            <Link to="/he-thong" className="home-v3-link">
              Tìm hiểu hệ thống bốn tầng
            </Link>
          </div>
        </div>
      </section>

      <section id="phien-dong-hanh" className="home-v4-sessions">
        <header className="home-v4-chapter-heading reveal-child">
          <p className="home-v3-label">CÁC PHIÊN ĐỒNG HÀNH</p>
          <h2 className="serif">
            Dành thời gian cho điều bạn đang cần nhìn lại.
          </h2>
          <p>
            Có thể bạn đang bối rối trước một lựa chọn, mang theo những cảm xúc
            khó gọi tên hoặc muốn hiểu vì sao mình cứ lặp lại một trải nghiệm.
            Các phiên đồng hành tại Inner Architect™ tạo không gian để bạn chia
            sẻ, soi chiếu và làm rõ bước tiếp theo.
          </p>
        </header>

        <div className="home-v4-session-grid">
          <article className="reveal-child">
            <figure className="home-v3-media">
              <img
                src={IMG.hermitTarotRoom}
                alt="Không gian Tarot riêng tư tại The Hermit"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <h3 className="serif">Tarot soi chiếu tại The Hermit</h3>
            <p>
              Dành cho những ai muốn khám phá một vấn đề cụ thể trong cuộc
              sống. Hình ảnh và biểu tượng Tarot gợi mở câu hỏi, giúp bạn nhìn
              trải nghiệm từ nhiều góc độ và hiểu rõ hơn suy nghĩ, cảm xúc của
              mình.
            </p>
          </article>
          <article className="reveal-child">
            <figure className="home-v3-media">
              <img
                src={IMG.homeGeneratedSessionProcess}
                alt="Phiên đồng hành chuyên sâu trong không gian riêng tư"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <h3 className="serif">Phiên chuyên sâu cùng Khiêm Võ</h3>
            <p>
              Dành cho những ai muốn dành nhiều thời gian hơn để tìm hiểu khó
              khăn đang gặp phải, những niềm tin và khuôn mẫu đang ảnh hưởng
              đến bản thân. Bạn cùng người đồng hành xác định điều muốn thay
              đổi và xây dựng những bước thực hành phù hợp trong đời sống.
            </p>
          </article>
        </div>

        <div className="home-v4-session-note reveal-child">
          <p>
            Trước khi đặt lịch, bạn được trao đổi về nhu cầu, nội dung và phạm
            vi của phiên để lựa chọn hình thức phù hợp.
          </p>
          <p>
            <strong>Lưu ý:</strong> Các phiên đồng hành hướng đến soi chiếu,
            khám phá bản thân và phát triển kỹ năng sống; không thực hiện chẩn
            đoán, can thiệp điều trị rối loạn tâm lý, tâm thần và không thay thế
            dịch vụ khám, chữa bệnh.
          </p>
          <div className="home-v4-actions">
            <Link to="/chuong-trinh" className="home-v3-link">
              Xem nội dung &amp; bảng giá
            </Link>
            <Link to="/lien-he" className="home-v3-link">
              Trao đổi trước khi đặt lịch
            </Link>
          </div>
        </div>
      </section>

      <section id="workshop" className="home-v4-feature home-v4-workshop">
        <figure className="home-v4-feature-image home-v3-media reveal-child">
          <img
            src={IMG.homeCuratedWorkshop}
            alt="Màu vẽ và không gian workshop trải nghiệm"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="home-v4-feature-copy reveal-child">
          <p className="home-v3-label">WORKSHOP &amp; TRẢI NGHIỆM</p>
          <h2 className="serif">Gặp gỡ, khám phá và thực hành cùng nhau.</h2>
          <p>
            Các workshop tại Inner Architect™ mở ra không gian để bạn tìm hiểu
            bản thân qua những chủ đề gần gũi: cảm xúc, các mối quan hệ, ranh
            giới và định hướng sống.
          </p>
          <p>
            Thông qua chia sẻ, viết phản tư, Tarot và các hoạt động trải nghiệm
            theo từng chủ đề, bạn có cơ hội nhìn lại câu chuyện của mình, lắng
            nghe những góc nhìn khác và thực hành điều có thể áp dụng vào cuộc
            sống.
          </p>
          <p>
            Bạn được lựa chọn mức độ tham gia và chia sẻ phù hợp với mình.
          </p>
          <Link to="/chuong-trinh" className="home-v3-link">
            Khám phá workshop sắp tới
          </Link>
        </div>
      </section>

      <section id="san-pham" className="home-v4-products">
        <header className="home-v4-chapter-heading reveal-child">
          <p className="home-v3-label">SẢN PHẨM TỪ INNER ARCHITECT™</p>
          <h2 className="serif">Một khoảng dừng, một góc nhìn mới.</h2>
          <p>
            Những sản phẩm được phát triển để bạn mang tinh thần khám phá bản
            thân vào đời sống hằng ngày.
          </p>
        </header>
        <div className="home-v4-product-grid">
          <article className="reveal-child">
            <figure className="home-v3-media">
              <img
                src={IMG.soulCleanse}
                alt="Nến thơm LARA Soul Cleanse"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <h3 className="serif">Nến thơm — Không gian cho riêng mình</h3>
            <p>
              Hương thơm nhẹ nhàng cho những lúc nghỉ ngơi, thưởng trà hay viết
              nhật ký. Một lời nhắc dành thời gian chăm sóc bản thân giữa nhịp
              sống bận rộn.
            </p>
            <Link to="/lara" className="home-v3-link">
              Khám phá nến thơm
            </Link>
          </article>
          <article className="reveal-child">
            <figure className="home-v3-media">
              <img
                src={IMG.tarot2}
                alt="Bộ bài Tarot dùng cho thực hành phản tư"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <h3 className="serif">Bộ bài Tarot — Gợi mở từ hình ảnh</h3>
            <p>
              Mỗi lá bài mở ra những câu hỏi về cảm xúc, trải nghiệm và lựa
              chọn. Bạn có thể sử dụng để viết phản tư, khám phá góc nhìn mới
              và lắng nghe chính mình.
            </p>
            <Link to="/lien-he" className="home-v3-link">
              Khám phá bộ bài Tarot
            </Link>
          </article>
        </div>
      </section>

      <section id="the-hermit" className="home-v4-hermit">
        <img
          src={IMG.hermitHall}
          alt="Sảnh chính The Hermit với ánh sáng ấm"
          loading="lazy"
          decoding="async"
        />
        <div className="home-v4-hermit-scrim" />
        <div className="home-v4-hermit-copy reveal-child">
          <p className="home-v3-label">
            THE HERMIT · TAROT · HEALING · TRÀ ĐẠO
          </p>
          <h2 className="serif">Một khoảng dừng để trở về với mình.</h2>
          <p>
            The Hermit là không gian gặp gỡ và trải nghiệm thuộc hệ thống Inner
            Architect™, nơi bạn có thể thưởng trà, khám phá Tarot và tham gia
            những hoạt động kết nối, phát triển bản thân.
          </p>
          <p>
            Giữa sắc gỗ ấm, hương trà và tiếng nhạc dịu nhẹ, bạn có thể dành
            thời gian đọc sách, trò chuyện hoặc đơn giản là ngồi yên cùng chính
            mình.
          </p>
          <p>
            Các phiên Tarot tại đây sử dụng hình ảnh và biểu tượng như một
            chiếc gương soi, gợi mở góc nhìn về cảm xúc, trải nghiệm và những
            lựa chọn của bạn.
          </p>
          <p className="home-v4-statement serif">
            Ghé uống một tách trà. Dành cho mình một chút thời gian.
          </p>
          <div className="home-v4-actions">
            <Link to="/the-hermit" className="home-v3-link home-v3-link-light">
              Khám phá The Hermit
            </Link>
            <Link to="/lien-he" className="home-v3-link home-v3-link-light">
              Chỉ đường đến quán
            </Link>
          </div>
        </div>
      </section>

      <section id="nguoi-sang-lap" className="home-v4-founder">
        <div className="home-v4-founder-copy reveal-child">
          <p className="home-v3-label">Khiêm Võ · NGƯỜI SÁNG LẬP</p>
          <h2 className="serif">
            Từ hành trình tìm lại mình đến mong muốn đồng hành cùng người khác.
          </h2>
          <p>
            Sau những biến cố trong công việc, tài chính và hôn nhân, Khiêm Võ
            bắt đầu hành trình nhìn lại bản thân, tìm hiểu Tarot, thực hành nội
            tâm và theo học Tâm lý học.
          </p>
          <p>
            Những trải nghiệm ấy đặt nền móng cho Inner Architect™ — nơi Khiêm
            kết nối ngôn ngữ biểu tượng của Tarot với kiến thức tâm lý và những
            thực hành gần gũi trong đời sống.
          </p>
          <p>
            Trong các phiên đồng hành và hoạt động đào tạo, Khiêm hướng đến
            việc giúp mỗi người hiểu rõ trải nghiệm của mình, nhận diện những
            khuôn mẫu đang lặp lại và chủ động lựa chọn hướng đi phù hợp.
          </p>
          <blockquote className="serif">
            “Tôi mong mỗi người có thể hiểu mình hơn, tin vào khả năng lựa chọn
            và từng bước tự đứng vững trong cuộc sống.”
          </blockquote>
          <Link to="/vo-khiem" className="home-v3-link">
            Tìm hiểu về Khiêm Võ
          </Link>
        </div>
        <figure className="home-v4-founder-image home-v3-media reveal-child">
          <img
            src={IMG.homeCuratedReflective}
            alt="Bàn ghi chép trong một buổi thực hành phản tư"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </section>

      <section id="journal" className="home-v3-journal home-v4-journal">
        <header className="home-v3-journal-heading">
          <div>
            <p className="home-v3-label reveal-child">
              JOURNAL · GÓC CHIÊM NGHIỆM
            </p>
            <h2 className="serif reveal-child">
              Đọc để hiểu mình, dừng lại để nhìn sâu hơn.
            </h2>
            <p className="home-v4-journal-intro reveal-child">
              Những bài viết về cảm xúc, các mối quan hệ, ranh giới và hành
              trình phát triển bản thân — kết nối góc nhìn tâm lý, biểu tượng
              Tarot và trải nghiệm đời sống. Mỗi bài viết mở ra một câu hỏi để
              bạn suy ngẫm, nhìn lại câu chuyện của mình và tìm điều có thể thực
              hành trong cuộc sống hằng ngày.
            </p>
          </div>
          <Link to="/journal" className="home-v3-link reveal-child">
            Khám phá Journal
          </Link>
        </header>

        <div className="home-v3-journal-layout">
          <article className="home-journal-feature reveal-child">
            <Link to={"/journal/" + leadJournal.slug}>
              <figure className="home-v3-media">
                <img
                  src={leadJournal.image}
                  alt={leadJournal.title}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="home-v3-story-meta">
                <span>{leadJournal.category}</span>
                <time>{leadJournal.date}</time>
              </div>
              <h3 className="serif">
                {leadJournal.title}
                <em>{leadJournal.italic}</em>
              </h3>
              <p>{leadJournal.summary}</p>
            </Link>
          </article>

          <div className="home-journal-rail">
            {journalRail.map((item) => (
              <article
                className="home-journal-secondary reveal-child"
                key={item.slug}
              >
                <Link to={"/journal/" + item.slug}>
                  <figure className="home-v3-media">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                  <div className="home-v3-story-meta">
                    <span>{item.category}</span>
                    <time>{item.date}</time>
                  </div>
                  <h3 className="serif">
                    {item.title}
                    <em>{item.italic}</em>
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="lien-he" className="home-v3-closing home-v4-contact">
        <img
          src={IMG.homeCuratedClosing}
          alt="Không gian chiêm nghiệm với ánh sáng ấm"
          loading="lazy"
          decoding="async"
        />
        <div className="home-v3-closing-scrim" />
        <div className="home-v3-closing-copy reveal-child">
          <p className="home-v3-label">KẾT NỐI VỚI INNER ARCHITECT™</p>
          <h2 className="serif">Bắt đầu từ điều bạn đang quan tâm.</h2>
          <p>
            Bạn muốn tìm hiểu một phiên đồng hành, tham gia workshop, lựa chọn
            sản phẩm hay ghé The Hermit? Hãy nhắn cho chúng tôi để được cung
            cấp thông tin và trao đổi về nhu cầu của bạn.
          </p>
          <div className="home-v4-actions">
            <Link to="/lien-he" className="home-v3-link home-v3-link-light">
              Liên hệ với chúng tôi
            </Link>
            <Link
              to="/chuong-trinh/phien-tiep-can-ban-dau"
              className="home-v3-link home-v3-link-light"
            >
              Đặt lịch đồng hành
            </Link>
          </div>
          <p className="home-v4-contact-note">
            Các hoạt động hướng đến soi chiếu, khám phá bản thân và phát triển
            kỹ năng sống; không cung cấp chẩn đoán, điều trị và không thay thế
            dịch vụ khám, chữa bệnh.
          </p>
        </div>
      </section>
    </main>
  )
}

/** Tiêu đề và mô tả SEO của một trang. */
type ThongTinSeo = {
  title: string
  description: string
}

/** Tiêu đề và mô tả mặc định của site, dùng khi route không có SEO riêng. */
const SEO_MAC_DINH = {
  title: "INNER ARCHITECT™ — Xây trật tự bên trong",
  description:
    "INNER ARCHITECT™ — hệ sinh thái trà đạo có hướng dẫn, Tarot phản tư, đồng hành 1:1, workshop, Academy và sản phẩm LARA tại TP. Hồ Chí Minh.",
}

/** Tiêu đề và mô tả theo từng route tĩnh. */
const seoTheoDuongDan: Record<
  string,
  ThongTinSeo & {
    giuNguyenTieuDe?: boolean
  }
> =
  {
    "/journal": {
      title: "Journal",
      description:
        "Thư viện chiêm nghiệm về Tarot, tâm lý học và đời sống nội tâm của INNER ARCHITECT™.",
    },
    "/chuong-trinh": {
      title: "Chương trình",
      description:
        "Trải nghiệm, đồng hành cá nhân và Academy của INNER ARCHITECT™, thiết kế theo mức độ sẵn sàng và phạm vi hỗ trợ.",
    },
    "/the-hermit": {
      title: "The Hermit",
      description:
        "The Hermit — không gian café, trà đạo và Tarot thuộc hệ sinh thái INNER ARCHITECT™ tại TP. Hồ Chí Minh.",
    },
    "/vo-khiem": {
      title: "Võ Khiêm | Founder INNER ARCHITECT™",
      description:
        "Võ Khiêm — người sáng lập INNER ARCHITECT™ System, hoạt động trong lĩnh vực Tarot phản tư, chia sẻ kiến thức và phát triển bản thân.",
      giuNguyenTieuDe: true,
    },
    "/lara": {
      title: "LARA",
      description:
        "LARA — nhánh sản phẩm hương thơm cho những khoảng nghỉ và nghi thức cá nhân.",
    },
    "/lien-he": {
      title: "Liên hệ",
      description:
        "Liên hệ INNER ARCHITECT™ qua một kênh Zalo / Facebook chung cho trà đạo, Tarot, đồng hành 1:1, workshop, Academy và sản phẩm.",
    },
    "/faq": {
      title: "Câu hỏi thường gặp",
      description:
        "Giải đáp về cách liên hệ, hình thức tham gia và giới hạn hỗ trợ của INNER ARCHITECT™.",
    },
    "/chinh-sach-bao-mat": {
      title: "Chính sách bảo mật",
      description: "Cách website INNER ARCHITECT™ xử lý thông tin người truy cập.",
    },
    "/pham-vi-ho-tro": {
      title: "Tuyên bố phạm vi hỗ trợ",
      description:
        "Các nguyên tắc giới hạn áp dụng cho mọi hoạt động trong hệ sinh thái INNER ARCHITECT™.",
    },
  }

/**
 * Xác định tiêu đề và mô tả SEO cho một đường dẫn đã chuẩn hóa.
 *
 * @param duongDan - Đường dẫn hash đã chuẩn hóa, ví dụ `/journal/cham-ngo-tarot`
 * @param laTrang404 - `true` nếu đường dẫn không khớp nội dung nào
 * @returns Cặp `title` (đã gắn tên thương hiệu) và `description`
 */
function layThongTinSeo(
  duongDan: string,
  laTrang404: boolean,
): ThongTinSeo {
  const ganThuongHieu = (tieuDe: string) => `${tieuDe} — INNER ARCHITECT™`
  if (laTrang404)
    return {
      title: ganThuongHieu("Không tìm thấy trang"),
      description: SEO_MAC_DINH.description,
    }
  const baiViet = duongDan.startsWith("/journal/")
    ? news.find((item) => `/journal/${item.slug}` === duongDan)
    : undefined
  if (baiViet)
    return { title: ganThuongHieu(baiViet.title), description: baiViet.summary }
  const chuongTrinh = duongDan.startsWith("/chuong-trinh/")
    ? danhSachChiTietChuongTrinh[duongDan.slice("/chuong-trinh/".length)]
    : undefined
  if (chuongTrinh)
    return {
      title: ganThuongHieu(chuongTrinh.tieuDe),
      description: chuongTrinh.doanDan,
    }
  const tinh = seoTheoDuongDan[duongDan]
  if (tinh)
    return {
      title: tinh.giuNguyenTieuDe ? tinh.title : ganThuongHieu(tinh.title),
      description: tinh.description,
    }
  return SEO_MAC_DINH
}

/**
 * Ghi tiêu đề trang và các thẻ meta mô tả vào `<head>`.
 * Tác dụng phụ: sửa `document.title`, tạo thẻ meta nếu chưa có.
 *
 * @param seo - Tiêu đề và mô tả cần áp dụng
 */
function capNhatThongTinSeo(seo: ThongTinSeo) {
  document.title = seo.title
  const thuocTinh: [string, string, string][] = [
    ["name", "description", seo.description],
    ["property", "og:title", seo.title],
    ["property", "og:description", seo.description],
  ]
  thuocTinh.forEach(([khoa, ten, giaTri]) => {
    let the = document.head.querySelector<HTMLMetaElement>(
      `meta[${khoa}="${ten}"]`,
    )
    if (!the) {
      the = document.createElement("meta")
      the.setAttribute(khoa, ten)
      document.head.appendChild(the)
    }
    the.content = giaTri
  })
}

/**
 * Chuẩn hóa đường dẫn hash: bỏ query, bỏ dấu `/` cuối và ánh xạ route cũ.
 * `/booking` (form đặt lịch đã gỡ) được chuyển sang `/lien-he`.
 *
 * @param duongDanTho - Phần sau dấu `#` của URL
 * @returns Đường dẫn chuẩn, luôn bắt đầu bằng `/`
 */
function chuanHoaDuongDan(duongDanTho: string): string {
  let duongDan = duongDanTho.split("?")[0] || "/"
  if (!duongDan.startsWith("/")) duongDan = `/${duongDan}`
  if (duongDan.length > 1) duongDan = duongDan.replace(/\/+$/, "")
  if (duongDan === "/booking") return "/lien-he"
  return duongDan
}

/**
 * Chọn component trang cho một đường dẫn đã chuẩn hóa.
 *
 * @param path - Đường dẫn hash đã qua `chuanHoaDuongDan`
 * @returns Phần tử trang và cờ `laTrang404` khi không có nội dung tương ứng
 */
function chonTrang(path: string): {
  trang: React.ReactNode
  laTrang404: boolean
} {
  const trang = (node: React.ReactNode) => ({ trang: node, laTrang404: false })
  if (path === "/") return trang(<Home />)
  if (path === "/he-thong") return trang(<Home initialSection="he-thong" />)
  if (path === "/journal")
    return trang(
      <JournalPage baiViet={news} chuyenDe={signatureSeriesList} />,
    )
  if (path.startsWith("/journal/")) {
    const slug = path.slice("/journal/".length)
    if (news.some((item) => item.slug === slug))
      return trang(<Article slug={slug} />)
  }
  if (path === "/chuong-trinh") return trang(<Programmes />)
  if (path.startsWith("/chuong-trinh/")) {
    const slug = path.slice("/chuong-trinh/".length)
    if (danhSachChiTietChuongTrinh[slug])
      return trang(<Programmes detail={slug} />)
  }
  if (path === "/the-hermit") return trang(<Hermit />)
  if (path === "/vo-khiem") return trang(<FounderPage />)
  if (path === "/lara") return trang(<LaraPage />)
  if (path === "/lien-he") return trang(<ContactPage />)
  if (path === "/faq") return trang(<FaqPage />)
  if (path === "/chinh-sach-bao-mat") return trang(<LegalPage loai="bao-mat" />)
  if (path === "/pham-vi-ho-tro") return trang(<LegalPage loai="pham-vi" />)
  return { trang: <NotFoundPage />, laTrang404: true }
}

type TinHieuTrangSanSangProps = {
  duongDan: string
  onSanSang: (duongDan: string) => void
}

/**
 * Báo cho `App` biết trang của `duongDan` đã thực sự có trong DOM.
 * Đặt cạnh trang trong cùng `Suspense`, nên effect chỉ chạy khi chunk của
 * trang lazy đã tải xong và được commit (không chạy khi đang hiện fallback).
 *
 * @param props.duongDan - Đường dẫn của trang vừa render
 * @param props.onSanSang - Hàm nhận đường dẫn khi trang đã mount
 * @returns Không render gì
 */
function TinHieuTrangSanSang({ duongDan, onSanSang }: TinHieuTrangSanSangProps) {
  useEffect(() => onSanSang(duongDan), [duongDan, onSanSang])
  return null
}

function App() {
  const [path, setPath] = useState(() =>
    chuanHoaDuongDan(window.location.hash.slice(1)),
  )
  const [menu, setMenu] = useState(false)
  // Đường dẫn của trang đã mount xong; hiệu ứng reveal chờ giá trị này.
  const [trangSanSang, setTrangSanSang] = useState<string | null>(null)
  useEffect(() => {
    const f = () => {
      const tho = window.location.hash.slice(1)
      const chuan = chuanHoaDuongDan(tho)
      // Đường dẫn cũ (vd. #/booking) được thay trong lịch sử để không lưu URL lỗi thời.
      if (tho.split("?")[0] === "/booking") window.location.replace(`#${chuan}`)
      setPath(chuan)
      setMenu(false)
    }
    f()
    addEventListener("hashchange", f)
    return () => removeEventListener("hashchange", f)
  }, [])
  useEffect(() => {
    // Trang lazy chưa có trong DOM thì chưa gắn observer.
    if (trangSanSang !== path) return
    let observer: IntersectionObserver | undefined
    const frame = requestAnimationFrame(() => {
      const targets = document.querySelectorAll<HTMLElement>(
        "main:not(.hermit-page):not(.founder-page):not(.journal-page) > section:not(.hero):not(.hermit-hero):not(.home-stage), .news-card, .profile-principles article",
      )
      targets.forEach((target) => target.classList.add("reveal-on-scroll"))
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible")
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
      )
      targets.forEach((target) => observer?.observe(target))
    })
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [path, trangSanSang])
  const { trang: page, laTrang404 } = useMemo(() => chonTrang(path), [path])
  useEffect(() => {
    capNhatThongTinSeo(layThongTinSeo(path, laTrang404))
  }, [path, laTrang404])
  const isHomeView = path === "/" || path === "/he-thong"
  return (
    <>
      <Header open={menu} setOpen={setMenu} home={path === "/"} />
      <div key={isHomeView ? "home-view" : path} className="page-transition">
        <Suspense fallback={<main className="trang-dang-tai" aria-busy="true" />}>
          {page}
          <TinHieuTrangSanSang duongDan={path} onSanSang={setTrangSanSang} />
        </Suspense>
      </div>
      <Footer home={path === "/"} />
    </>
  )
}

export default App
