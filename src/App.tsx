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
    ten: "Tiếp cận ban đầu",
    linhVuc: "Nhận thức & Thấu hiểu",
    moTa: "Tạo một ảnh chụp có giới hạn về trạng thái hiện tại, nhu cầu và kiểm tra mức độ phù hợp trước khi đi sâu.",
    anh: IMG.homeFemaleAdvisor,
    alt: "Nữ tư vấn trò chuyện cùng khách trong một phiên tiếp cận riêng",
  },
  {
    so: "02",
    ten: "Chữa lành & Tái cấu trúc",
    linhVuc: "Cảm xúc & Mô thức",
    moTa: "Nhận diện mô thức quen thuộc (patterns), kích hoạt nguồn lực bên trong và xây dựng lại cách phản hồi cảm xúc.",
    anh: IMG.homeCuratedReflective,
    alt: "Bàn ghi chép trong một buổi thực hành phản tư",
  },
  {
    so: "03",
    ten: "Định hướng & Giữ trục",
    linhVuc: "Đời sống & Ranh giới",
    moTa: "Chuyển hiểu biết thành lựa chọn, ranh giới và nhịp sống có thể duy trì bền vững trong đời sống thực tế.",
    anh: IMG.homeCuratedHermit,
    alt: "Góc thưởng trà định tâm tại The Hermit",
  },
  {
    so: "04",
    ten: "Điều tiết thân & Năng lượng",
    linhVuc: "Cơ thể & Hơi thở",
    moTa: "Làm việc với cơ thể, nhịp thở và cảm giác thể chất để phục hồi cơ chế tự điều hòa tự nhiên của hệ thần kinh.",
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

  const pathways = [
    {
      number: "01",
      category: "Cá nhân",
      title: "Phiên tiếp cận 1:1",
      copy: "Một cuộc gặp có giới hạn rõ ràng, dành cho lúc bạn cần một điểm bắt đầu chứ chưa cần một câu trả lời hoàn chỉnh.",
      image: IMG.homeGeneratedSessionSetup,
      imageAlt: "Bàn trà và sổ ghi chép được chuẩn bị cho phiên tiếp cận",
      to: "/chuong-trinh/phien-tiep-can-ban-dau",
      action: "Xem chi tiết",
    },
    {
      number: "02",
      category: "Không gian",
      title: "The Hermit Space",
      copy: "Không gian trà mộc, Tarot phản tư và khoảng nghỉ đủ yên tại Gò Vấp để quan sát chính mình.",
      image: IMG.homeCuratedHermit,
      imageAlt:
        "Không gian trà yên tĩnh dành cho một khoảng dừng tại The Hermit",
      to: "/the-hermit",
      action: "Ghé The Hermit",
    },
    {
      number: "03",
      category: "Trải nghiệm",
      title: "Workshop Chạm — Vẽ",
      copy: "Không gian nhóm nhỏ dùng hơi thở và màu vẽ để tiếp cận cảm giác cơ thể mà không phán xét.",
      image: IMG.homeCuratedWorkshop,
      imageAlt: "Màu vẽ và không gian workshop Chạm",
      to: "/chuong-trinh/cham-ve-de-diu-lai",
      action: "Xem workshop",
    },
    {
      number: "04",
      category: "Đào tạo",
      title: "Khóa Tarot Căn Bản",
      copy: "Học cách đọc biểu tượng, đặt câu hỏi phản tư và rèn luyện đạo đức nghề trong thực hành.",
      image: IMG.homeCuratedReflective,
      imageAlt: "Bàn ghi chép và những lá bài trống",
      to: "/chuong-trinh/tarot-can-ban",
      action: "Xem giáo trình",
    },
  ]

  const leadStory = pathways[0]
  const secondaryStories = pathways.slice(1)
  const leadJournal = news[0]
  const journalRail = news.slice(1, 3)

  return (
    <main className="home-page home-editorial-v3">
      <section
        className={`home-v3-hero cursor-hero-${huongConTroHero}`}
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onMouseMove={xuLyDiChuyenChuotHero}
        onClick={xuLyBamVungHero}
      >
        <div className="home-v3-hero-slider" aria-hidden="true">
          <img
            className={`home-v3-hero-image ${heroIndex === 0 ? "is-active" : ""}`}
            src={IMG.homeCuratedHero}
            alt="Bàn Tarot trong không gian ánh sáng ấm"
            loading="eager"
            fetchPriority="high"
          />
          {danhSachAnhHero.slice(1).map((anh, idx) => (
            <img
              key={anh.src}
              className={`home-v3-hero-image ${heroIndex === idx + 1 ? "is-active" : ""}`}
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
            Hệ thống tái cấu trúc nội tâm · TP. Hồ Chí Minh
          </p>
          <h1 className="serif">
            Xây trật tự <br className="home-v3-mobile-break" />bên trong
            <br />
            <em>để sống tự chủ.</em>
          </h1>
          <p className="home-v3-hero-intro">
            <span className="home-v3-intro-line">
              Một hệ thống tích hợp nhận thức,
            </span>{" "}
            <span className="home-v3-intro-line">
              cảm xúc, thân thể và đời sống thực —
            </span>{" "}
            <span className="home-v3-intro-line">
              với cấu trúc an toàn, ranh giới rõ ràng
            </span>{" "}
            <span className="home-v3-intro-line">
              và điểm kết có thể nhìn thấy.
            </span>
          </p>
          <div className="home-v3-hero-actions">
            <Link to="/lien-he" className="home-v3-link home-v3-link-light">
              Liên hệ về phiên tiếp cận
            </Link>
            <button
              type="button"
              onClick={() => cuonDenPhanTu("he-thong")}
              className="home-v3-text-button"
            >
              Khám phá hệ thống
            </button>
          </div>
        </div>
        <p className="home-v3-hero-caption">
          Không tiên đoán. Không quyết định thay. Phục hồi khả năng tự điều
          chỉnh và tự dẫn dắt.
        </p>
      </section>

      <section id="he-thong" className="home-v3-system">
        <header className="home-v3-system-intro">
          <p className="home-v3-label reveal-child">
            The Inner Architect System®
          </p>
          <h2 className="serif reveal-child">
            Bốn tầng phản chiếu,
            <br />
            một tiến trình tự chủ.
          </h2>
          <div className="home-v3-system-copy reveal-child">
            <blockquote className="serif">
              “Con người không thiếu thêm lời khuyên. Điều thường thiếu là một
              cấu trúc đủ an toàn để tự nhìn rõ.”
            </blockquote>
            <p>
              Bốn tầng không phải thứ bậc ép buộc. Đây là bản đồ để nhận ra nơi
              bạn đang đứng và bắt đầu từ phần đang cần được nhìn thấy.
            </p>
          </div>
        </header>

        <div className="home-v3-system-gallery">
          {danhSachBonTang.map((tang) => (
            <article className="home-v3-layer reveal-child" key={tang.so}>
              <figure className="home-v3-media">
                <img src={tang.anh} alt={tang.alt} loading="lazy" decoding="async" />
              </figure>
              <p>
                <span>{tang.so}</span>
                {tang.linhVuc}
              </p>
              <h3 className="serif">{tang.ten}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="home-v3-opening">
        <div className="home-v3-opening-heading reveal-child">
          <p className="home-v3-label">
            Nếu bạn đang tìm hỗ trợ cho chính mình
          </p>
          <h2 className="serif">
            Bắt đầu từ
            <br />
            điều đang lặp lại.
          </h2>
        </div>
        <div className="home-v3-opening-copy reveal-child">
          <p>
            Có thể bạn đã hiểu vấn đề bằng lý trí nhưng phản ứng cũ vẫn quay
            lại. Có thể một mối quan hệ, một lựa chọn hay một nỗi bất an cứ lặp
            lại mà bạn chưa biết bắt đầu quan sát từ đâu.
          </p>
          <p>
            INNER ARCHITECT™ tạo một điểm dừng có cấu trúc: cảm xúc, cơ thể và
            điều bạn đang nghĩ được nhìn cùng nhau. Mục tiêu là giúp bạn có thêm
            cơ sở để tự chọn bước tiếp theo.
          </p>
          <Link to="/chuong-trinh/phien-tiep-can-ban-dau" className="home-v3-link">
            Xem thông tin phiên tiếp cận
          </Link>
        </div>
        <figure className="home-v3-opening-image home-v3-media reveal-child">
          <img
            src={IMG.homeGeneratedSessionEntry}
            alt="Không gian phòng Tarot và Trà đạo riêng tư tại The Hermit"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Một không gian riêng để quan sát</figcaption>
        </figure>
      </section>

      <section className="home-v3-session">
        <figure className="home-v3-session-image home-v3-media reveal-child">
          <img
            src={IMG.homeGeneratedSessionProcess}
            alt="Không gian The Hermit được chuẩn bị cho phiên tiếp cận 1:1"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Một cuộc gặp có điểm vào và điểm kết rõ ràng</figcaption>
        </figure>
        <div className="home-v3-session-copy reveal-child">
          <p className="home-v3-label">Phiên đầu tiên diễn ra như thế nào?</p>
          <h2 className="serif">Nhìn rõ trước khi đi tiếp.</h2>
          <ol>
            <li>
              <span>Gọi tên</span>
              <p>Bạn mang đến điều đang chiếm nhiều năng lượng nhất lúc này.</p>
            </li>
            <li>
              <span>Quan sát</span>
              <p>
                Tarot và câu hỏi phản tư mở thêm góc nhìn, không đưa ra mệnh
                lệnh.
              </p>
            </li>
            <li>
              <span>Chọn bước</span>
              <p>
                Cuộc gặp khép lại bằng một bước nhỏ phù hợp với đời sống thực
                tế.
              </p>
            </li>
          </ol>
          <Link to="/lien-he" className="home-v3-link">
            Liên hệ về phiên tiếp cận
          </Link>
        </div>
      </section>

      <section className="home-v3-stories">
        <header className="home-v3-section-heading">
          <p className="home-v3-label reveal-child">Những lối đi tiếp theo</p>
          <h2 className="serif reveal-child">Đi tiếp theo nhịp riêng.</h2>
          <p className="reveal-child">
            Đây không phải các gói buộc phải đi qua theo thứ tự. Bạn chỉ chọn
            điều đang phù hợp với trạng thái hiện tại của mình.
          </p>
        </header>

        <div className="home-v3-story-layout">
          <Link to={leadStory.to} className="home-story-feature reveal-child">
            <figure className="home-v3-media">
              <img
                src={leadStory.image}
                alt={leadStory.imageAlt}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="home-v3-story-meta">
              <span>
                {leadStory.number} · {leadStory.category}
              </span>
              <span>{leadStory.action}</span>
            </div>
            <h3 className="serif">{leadStory.title}</h3>
            <p>{leadStory.copy}</p>
          </Link>

          <div className="home-story-rail">
            {secondaryStories.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="home-story-secondary reveal-child"
              >
                <figure className="home-v3-media">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" />
                </figure>
                <div className="home-v3-story-meta">
                  <span>
                    {item.number} · {item.category}
                  </span>
                  <span>{item.action}</span>
                </div>
                <h3 className="serif">{item.title}</h3>
                <p>{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v3-ethics">
        <div className="home-v3-ethics-statement reveal-child">
          <p className="home-v3-label">Ethics & integrity</p>
          <h2 className="serif">An toàn đi trước chiều sâu.</h2>
          <blockquote className="serif">
            “Cấu trúc trước. Diễn giải sau. Con người luôn là chủ thể duy nhất
            quyết định cuộc đời mình.”
          </blockquote>
        </div>
        <div className="home-v3-ethics-list">
          <article className="reveal-child">
            <span>01</span>
            <h3>Không tiên đoán số mệnh</h3>
            <p>Tarot là bề mặt biểu tượng để quan sát điều đang hiện diện.</p>
          </article>
          <article className="reveal-child">
            <span>02</span>
            <h3>Không quyết định thay</h3>
            <p>Quyền lựa chọn và trách nhiệm luôn thuộc về chính bạn.</p>
          </article>
          <article className="reveal-child">
            <span>03</span>
            <h3>Không hứa hẹn tuyệt đối</h3>
            <p>
              Phát triển bản thân là tiến trình thực hành trong đời sống thật.
            </p>
          </article>
          <article className="reveal-child">
            <span>04</span>
            <h3>Không tạo sự phụ thuộc</h3>
            <p>Mục tiêu là phục hồi khả năng tự điều chỉnh và tự dẫn dắt.</p>
          </article>
        </div>
        <figure className="home-v3-ethics-image home-v3-media reveal-child">
          <img
            src={IMG.homeCuratedBoundary}
            alt="Một vòng tròn workshop giữ khoảng cách và ranh giới an toàn"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Không gian nhóm nhỏ với ranh giới được giữ rõ</figcaption>
        </figure>
        <p className="home-v3-ethics-note reveal-child">
          <strong>Ranh giới chuyên môn:</strong> Hệ thống không chẩn đoán, không
          kê đơn và không thay thế can thiệp y khoa, tâm thần học hoặc tâm lý
          lâm sàng. Khi vượt ngoài phạm vi an toàn, người điều phối sẽ hướng dẫn
          chuyển gửi tới hỗ trợ phù hợp.
        </p>
      </section>

      <section className="home-v3-journal">
        <header className="home-v3-journal-heading">
          <div>
            <p className="home-v3-label reveal-child">Journal</p>
            <h2 className="serif reveal-child">
              Đọc để hiểu điều đang xảy ra.
            </h2>
          </div>
          <Link to="/journal" className="home-v3-link reveal-child">
            Xem tất cả bài viết
          </Link>
        </header>

        <div className="home-v3-journal-layout">
          <article className="home-journal-feature reveal-child">
            <Link to={`/journal/${leadJournal.slug}`}>
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
                <Link to={`/journal/${item.slug}`}>
                  <figure className="home-v3-media">
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
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

      <section className="home-v3-closing">
        <img
          src={IMG.homeCuratedClosing}
          alt="Hình ảnh biểu tượng về một tiến trình có tâm điểm và nhiều lớp"
          loading="lazy"
          decoding="async"
        />
        <div className="home-v3-closing-scrim" />
        <div className="home-v3-closing-copy reveal-child">
          <p className="home-v3-label">Nếu đây có thể là điểm bắt đầu</p>
          <h2 className="serif">Bắt đầu từ một cuộc gặp nhỏ.</h2>
          <p>
            Phiên tiếp cận ban đầu giúp làm rõ điều bạn đang mang theo, nhu cầu
            hiện tại và giới hạn hỗ trợ phù hợp. Bạn không cần cam kết đi xa hơn
            sau cuộc gặp này.
          </p>
          <Link to="/lien-he" className="home-v3-link home-v3-link-light">
            Liên hệ về phiên tiếp cận
          </Link>
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
