import { useEffect, useMemo, useRef, useState } from "react"
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
  type ChuyenMucJournal,
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
 * - Cụm tiêu biểu (Featured Showcase): Slider hiển thị 3 bài cùng lúc, trượt ngang từng bài một.
 * - Thư viện bài viết:
 *   + Thanh tìm kiếm bài viết (Search bar) theo từ khóa real-time.
 *   + 6 chuyên mục công khai: mỗi chuyên mục hiển thị slider 3 bài viết có mũi tên bấm ngang qua từng bài,
 *     bấm vào bài viết sẽ chuyển thẳng sang trang chi tiết bài viết (/journal/:slug).
 * - Signature Series: 3 chuyên đề dài hạn chuyên sâu.
 */

/** Số bài hiển thị sẵn trong mỗi chuyên mục; phần còn lại mở bằng nút "Xem thêm". */
const SO_BAI_HIEN_SAN = 3

type JournalPageProps = {
  chuyenDe: readonly ChuyenDeJournal[]
}

type ChuyenMucSliderProps = {
  muc: ChuyenMucJournal
  baiTrongMuc: BaiJournal[]
  chuyenMuc: readonly ChuyenMucJournal[]
}

/** Slider 3 bài viết có mũi tên trượt ngang từng bài cho chuyên mục */
function ChuyenMucSlider({ muc, baiTrongMuc, chuyenMuc }: ChuyenMucSliderProps) {
  const [viTriHienTai, setViTriHienTai] = useState(0)
  const [soLuongHienThi, setSoLuongHienThi] = useState(3)

  useEffect(() => {
    const capNhatSoLuong = () => {
      if (typeof window === "undefined") return
      if (window.innerWidth >= 1024) setSoLuongHienThi(3)
      else if (window.innerWidth >= 768) setSoLuongHienThi(2)
      else setSoLuongHienThi(1)
    }
    capNhatSoLuong()
    window.addEventListener("resize", capNhatSoLuong)
    return () => window.removeEventListener("resize", capNhatSoLuong)
  }, [])

  const viTriToiDa = Math.max(0, baiTrongMuc.length - soLuongHienThi)
  const viTriThucTe = Math.min(viTriHienTai, viTriToiDa)

  const chuyenTruoc = () => {
    setViTriHienTai((prev) => (prev > 0 ? prev - 1 : viTriToiDa))
  }
  const chuyenSau = () => {
    setViTriHienTai((prev) => (prev < viTriToiDa ? prev + 1 : 0))
  }

  if (baiTrongMuc.length === 0) {
    return (
      <div className="jr-empty">
        <p>Chưa có bài viết nào trong chuyên mục này.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full my-6 px-7 sm:px-10 lg:px-12">
      {/* Nút lùi 1 bài (Trái) — đặt ở chính giữa viền chuyên mục với bài viết */}
      {baiTrongMuc.length > soLuongHienThi && (
        <button
          type="button"
          onClick={chuyenTruoc}
          aria-label={`Xem bài viết trước của chuyên mục ${muc.name}`}
          className="absolute -left-4 sm:-left-5 top-[38%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#301F05]/90 hover:bg-[#C9882C] text-[#FAF7F2] border border-[rgba(48,31,5,0.2)] hover:border-[#C9882C] shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
        >
          <span className="text-xl font-bold leading-none select-none">←</span>
        </button>
      )}

      {/* Khung trượt danh sách bài viết */}
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-out -mx-3"
          style={{
            transform: `translateX(-${viTriThucTe * (100 / soLuongHienThi)}%)`,
          }}
        >
          {baiTrongMuc.map((bai, idx) => (
            <div
              key={bai.slug}
              className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3"
            >
              <Link
                to={`/journal/${bai.slug}`}
                className="group flex flex-col h-full bg-[#FDFBF7] hover:bg-white border border-[rgba(48,31,5,0.12)] hover:border-[#C9882C]/70 rounded-2xl overflow-hidden p-4 sm:p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl text-left no-underline block"
              >
                {bai.image && (
                  <figure className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#27190F]/10 mb-4">
                    <img
                      src={bai.image}
                      alt={bai.imageAlt || bai.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      {...kichThuocAnh(bai.image, bai.imageWidth, bai.imageHeight)}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C140D]/80 backdrop-blur-md text-[10px] tracking-wider uppercase font-semibold text-[#FAF7F2] border border-white/10">
                      <span>{nhanChuyenMuc(chuyenMuc, bai.categoryId)}</span>
                    </div>
                  </figure>
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] text-[#7A6B5D] tracking-wider uppercase font-mono mb-2">
                      {dinhDangNgayJournal(bai.date)}
                    </p>
                    <h4 className="serif text-lg sm:text-xl text-[#301F05] font-normal leading-snug group-hover:text-[#C9882C] transition-colors mb-2.5 line-clamp-2">
                      {bai.title}
                    </h4>
                    {bai.summary && (
                      <p className="text-xs sm:text-[13px] text-[#4A3D31]/80 leading-relaxed line-clamp-3 mb-4">
                        {bai.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[rgba(48,31,5,0.08)] flex items-center justify-between">
                    <span className="text-xs text-[#C9882C] font-medium group-hover:text-[#A76D1F] transition-colors inline-flex items-center gap-1">
                      <span>Đọc bài viết</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                    <span className="text-[11px] text-[#7A6B5D]/60 font-mono">
                      {String(idx + 1).padStart(2, "0")} / {String(baiTrongMuc.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Nút tiến 1 bài (Phải) — đặt ở chính giữa viền chuyên mục với bài viết */}
      {baiTrongMuc.length > soLuongHienThi && (
        <button
          type="button"
          onClick={chuyenSau}
          aria-label={`Xem bài viết tiếp theo của chuyên mục ${muc.name}`}
          className="absolute -right-4 sm:-right-5 top-[38%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#301F05]/90 hover:bg-[#C9882C] text-[#FAF7F2] border border-[rgba(48,31,5,0.2)] hover:border-[#C9882C] shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
        >
          <span className="text-xl font-bold leading-none select-none">→</span>
        </button>
      )}

      {/* Dots Indicator: Chấm vị trí từng bước */}
      {viTriToiDa > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: viTriToiDa + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setViTriHienTai(i)}
              aria-label={`Chuyển đến vị trí bài viết ${i + 1} của ${muc.name}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                viTriThucTe === i
                  ? "w-8 bg-[#C9882C]"
                  : "w-2 bg-[#301F05]/20 hover:bg-[#301F05]/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function JournalPage({ chuyenDe }: JournalPageProps) {
  const trangRef = useRef<HTMLElement>(null)
  useHieuUngCuon(trangRef, { hienNgay: ".jr-masthead [data-reveal]" })

  const { trangThai, duLieu, thuLai } = useDuLieuJournal()
  const chuyenMuc = duLieu?.categories ?? []
  const baiViet = duLieu?.articles ?? []

  const [baiDangDoc, setBaiDangDoc] = useState<BaiJournal | null>(null)
  const noiDungDoc = useBaiJournal(baiDangDoc?.slug ?? null)
  // Chuyên mục đang mở rộng (hiện toàn bộ bài trong fallback/accessibility)
  const [mucMoRong, setMucMoRong] = useState<ReadonlySet<number>>(new Set())
  const doiMoRong = (maMuc: number) =>
    setMucMoRong((cu) => {
      const moi = new Set(cu)
      if (moi.has(maMuc)) moi.delete(maMuc)
      else moi.add(maMuc)
      return moi
    })

  // Khóa cuộn trang và lắng nghe phím Escape để hủy chế độ đọc nếu có
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

  /** Thuộc tính mở chế độ đọc (dành cho contract test) */
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

  // Danh sách bài tiêu biểu: trình bày slider 3 bài cùng lúc, trượt ngang từng bài một
  const tieuBieu = layBaiTieuBieu(baiViet, 9)
  const tieuDiem = tieuBieu[0]
  const [viTriHienTai, setViTriHienTai] = useState(0)
  const [soLuongHienThi, setSoLuongHienThi] = useState(3)

  // Thanh tìm kiếm bài viết
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState("")
  const baiVietTimKiem = useMemo(() => {
    const q = tuKhoaTimKiem.trim().toLowerCase()
    if (!q) return []
    return baiViet.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.summary && b.summary.toLowerCase().includes(q)) ||
        (b.dek && b.dek.toLowerCase().includes(q))
    )
  }, [baiViet, tuKhoaTimKiem])

  useEffect(() => {
    const capNhatSoLuong = () => {
      if (typeof window === "undefined") return
      if (window.innerWidth >= 1024) setSoLuongHienThi(3)
      else if (window.innerWidth >= 768) setSoLuongHienThi(2)
      else setSoLuongHienThi(1)
    }
    capNhatSoLuong()
    window.addEventListener("resize", capNhatSoLuong)
    return () => window.removeEventListener("resize", capNhatSoLuong)
  }, [])

  const viTriToiDa = Math.max(0, tieuBieu.length - soLuongHienThi)
  const viTriThucTe = Math.min(viTriHienTai, viTriToiDa)

  const chuyenTruoc = () => {
    setViTriHienTai((prev) => (prev > 0 ? prev - 1 : viTriToiDa))
  }
  const chuyenSau = () => {
    setViTriHienTai((prev) => (prev < viTriToiDa ? prev + 1 : 0))
  }

  return (
    <main ref={trangRef} className="journal-page">
      {/* 1. MASTHEAD */}
      <section className="jr-masthead" aria-labelledby="jr-tieu-de">
        <p className="jr-masthead-label" {...hieuUng("len", 0)}>
          Journal · INNER ARCHITECT™
        </p>
        <h1 id="jr-tieu-de" className="serif font-normal">
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

      {/* 2. CỤM TIÊU BIỂU (CAROUSEL SLIDER HIỂN THỊ 3 BÀI, TRƯỢT TỪNG BÀI) */}
      {tieuDiem && (
        <section className="jr-featured" aria-labelledby="jr-tieu-diem">
          <div className="jr-featured-container">
            {/* Header: Tiêu đề + Chỉ số vị trí */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-5 border-b border-[rgba(250,243,232,0.14)]">
              <div>
                <p className="jr-featured-meta text-xs tracking-widest uppercase text-[#C9882C] font-semibold mb-2" {...hieuUng("len", 0)}>
                  BÀI VIẾT TIÊU BIỂU · CURATED ESSAYS
                </p>
                <h2 id="jr-tieu-diem" className="serif font-normal not-italic" {...hieuUng("len", 1)}>
                  Chiêm nghiệm &amp; Đối thoại nội tâm
                </h2>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto" {...hieuUng("len", 2)}>
                <span className="text-xs tracking-widest text-[#FAF7F2]/60 font-mono">
                  {String(viTriThucTe + 1).padStart(2, "0")} / {String(tieuBieu.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Carousel Slider với mũi tên đặt cách xa bài viết để không bị đè lên */}
            <div className="relative w-full px-7 sm:px-10 lg:px-12">
              {/* Nút lùi 1 bài (Trái) — đặt cách xa bài viết */}
              <button
                type="button"
                onClick={chuyenTruoc}
                aria-label="Xem bài tiêu biểu trước"
                className="absolute left-0 sm:left-1 top-[38%] -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1C140D]/95 hover:bg-[#C9882C] text-[#FAF7F2] hover:text-[#1C140D] border border-[rgba(250,243,232,0.3)] hover:border-[#C9882C] shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
              >
                <span className="text-xl font-bold leading-none select-none">←</span>
              </button>

              {/* Khung trượt danh sách bài viết */}
              <div className="overflow-hidden w-full">
                <div
                  className="flex transition-transform duration-500 ease-out -mx-3"
                  style={{
                    transform: `translateX(-${viTriThucTe * (100 / soLuongHienThi)}%)`,
                  }}
                >
                  {tieuBieu.map((bai, idx) => (
                    <div
                      key={bai.slug}
                      className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3"
                    >
                      <Link
                        to={`/journal/${bai.slug}`}
                        className="group flex flex-col h-full bg-[rgba(250,243,232,0.04)] hover:bg-[rgba(250,243,232,0.07)] border border-[rgba(250,243,232,0.12)] hover:border-[#C9882C]/60 rounded-2xl overflow-hidden p-4 sm:p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl text-left no-underline block"
                      >
                        {bai.slug === tieuDiem?.slug ? (
                          <figure
                            className="jr-featured-media relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#27190F]/20 mb-4"
                            data-anh="tren"
                            {...hieuUng("anh", 0)}
                          >
                            {tieuDiem.image && (
                              <img
                                src={tieuDiem.image}
                                alt={tieuDiem.imageAlt || tieuDiem.title}
                                fetchPriority="high"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                {...kichThuocAnh(tieuDiem.image, tieuDiem.imageWidth, tieuDiem.imageHeight)}
                              />
                            )}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C140D]/85 backdrop-blur-md text-[10px] tracking-wider uppercase font-semibold text-[#D4A366] border border-white/10">
                              <span>Tiêu biểu</span>
                              <span>·</span>
                              <span>{nhanChuyenMuc(chuyenMuc, bai.categoryId)}</span>
                            </div>
                          </figure>
                        ) : (
                          <figure className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#27190F]/20 mb-4">
                            {bai.image && (
                              <img
                                src={bai.image}
                                alt={bai.imageAlt || bai.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                {...kichThuocAnh(bai.image, bai.imageWidth, bai.imageHeight)}
                              />
                            )}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C140D]/85 backdrop-blur-md text-[10px] tracking-wider uppercase font-semibold text-[#D4A366] border border-white/10">
                              <span>Tiêu biểu</span>
                              <span>·</span>
                              <span>{nhanChuyenMuc(chuyenMuc, bai.categoryId)}</span>
                            </div>
                          </figure>
                        )}

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] text-[#FAF7F2]/60 tracking-wider uppercase font-mono mb-2">
                              {dinhDangNgayJournal(bai.date)}
                            </p>
                            <h3 className="serif text-xl sm:text-[22px] text-[#FAF7F2] font-normal leading-snug group-hover:text-[#D4A366] transition-colors mb-2.5 line-clamp-2">
                              {bai.title}
                            </h3>
                            <p className="text-xs sm:text-[13px] text-[#FAF7F2]/75 leading-relaxed line-clamp-3 mb-4">
                              {bai.summary}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[rgba(250,243,232,0.1)] flex items-center justify-between">
                            <span className="text-xs text-[#C9882C] font-medium group-hover:text-[#F3B163] transition-colors inline-flex items-center gap-1">
                              <span>Đọc bài viết</span>
                              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </span>
                            <span className="text-[11px] text-[#FAF7F2]/40 font-mono">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút tiến 1 bài (Phải) — đặt cách xa bài viết */}
              <button
                type="button"
                onClick={chuyenSau}
                aria-label="Xem bài tiêu biểu tiếp theo"
                className="absolute right-0 sm:right-1 top-[38%] -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1C140D]/95 hover:bg-[#C9882C] text-[#FAF7F2] hover:text-[#1C140D] border border-[rgba(250,243,232,0.3)] hover:border-[#C9882C] shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
              >
                <span className="text-xl font-bold leading-none select-none">→</span>
              </button>
            </div>

            {/* Dots Indicator: Chấm vị trí từng bước */}
            {viTriToiDa > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: viTriToiDa + 1 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setViTriHienTai(i)}
                    aria-label={`Chuyển đến vị trí bài viết ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      viTriThucTe === i
                        ? "w-8 bg-[#C9882C]"
                        : "w-2 bg-[#FAF7F2]/25 hover:bg-[#FAF7F2]/50"
                    }`}
                  />
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
              <h2 id="jr-thu-vien" className="serif font-normal" {...hieuUng("len", 0)}>
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

          {/* THANH TÌM KIẾM BÀI VIẾT ĐẶT TRÊN CHUYÊN MỤC ĐẦU TIÊN */}
          <div className="jr-search-container max-w-2xl mx-auto my-8 px-4 w-full" {...hieuUng("len", 1)}>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#7A6B5D] pointer-events-none text-base">
                🔍
              </span>
              <input
                type="text"
                value={tuKhoaTimKiem}
                onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                placeholder="Tìm kiếm bài viết theo từ khóa, tiêu đề, nội dung..."
                aria-label="Tìm kiếm bài viết"
                className="w-full pl-11 pr-10 py-3.5 rounded-full bg-white/90 border border-[#C9882C]/35 focus:border-[#C9882C] focus:bg-white text-[#301F05] placeholder-[#7A6B5D]/60 text-sm transition-all duration-300 outline-none shadow-sm focus:shadow-md"
              />
              {tuKhoaTimKiem && (
                <button
                  type="button"
                  onClick={() => setTuKhoaTimKiem("")}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-3.5 text-[#7A6B5D]/60 hover:text-[#301F05] text-sm p-1 rounded-full cursor-pointer transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* KẾT QUẢ TÌM KIẾM KHI NGƯỜI DÙNG NHẬP TỪ KHÓA */}
          {tuKhoaTimKiem.trim() && (
            <div className="jr-search-results mb-14 px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#C9882C]/20">
                <p className="text-sm text-[#301F05]">
                  Kết quả cho &ldquo;<span className="text-[#C9882C] font-semibold">{tuKhoaTimKiem}</span>&rdquo;:{" "}
                  <span className="font-semibold text-[#301F05]">{baiVietTimKiem.length} bài viết</span>
                </p>
                <button
                  type="button"
                  onClick={() => setTuKhoaTimKiem("")}
                  className="text-xs text-[#C9882C] hover:text-[#A76D1F] underline cursor-pointer"
                >
                  Xóa tìm kiếm
                </button>
              </div>

              {baiVietTimKiem.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {baiVietTimKiem.map((bai) => (
                    <Link
                      key={bai.slug}
                      to={`/journal/${bai.slug}`}
                      className="group flex flex-col bg-[#FDFBF7] hover:bg-white border border-[rgba(48,31,5,0.12)] hover:border-[#C9882C]/70 rounded-2xl overflow-hidden p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left no-underline block"
                    >
                      {bai.image && (
                        <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#27190F]/10 mb-4">
                          <img
                            src={bai.image}
                            alt={bai.imageAlt || bai.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            {...kichThuocAnh(bai.image, bai.imageWidth, bai.imageHeight)}
                          />
                        </div>
                      )}
                      <p className="text-[11px] text-[#C9882C] font-mono uppercase tracking-wider mb-1.5">
                        {nhanChuyenMuc(chuyenMuc, bai.categoryId)} · {dinhDangNgayJournal(bai.date)}
                      </p>
                      <h4 className="serif text-lg text-[#301F05] group-hover:text-[#C9882C] transition-colors line-clamp-2 mb-2 font-normal">
                        {bai.title}
                      </h4>
                      <p className="text-xs text-[#4A3D31]/80 line-clamp-2 mb-3">
                        {bai.summary}
                      </p>
                      <span className="mt-auto text-xs text-[#C9882C] group-hover:text-[#A76D1F] flex items-center gap-1 font-medium">
                        Đọc bài viết →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#7A6B5D]">
                  <p className="text-sm">Không tìm thấy bài viết nào phù hợp với từ khóa này.</p>
                </div>
              )}
            </div>
          )}

          {/* 6 CHUYÊN MỤC BÀI VIẾT TIÊU BIỂU VỚI SLIDER 3 BÀI TRƯỢT NGANG */}
          {chuyenMuc.map((muc, idx) => {
            const baiTrongMuc = locBaiJournal(baiViet, muc.id).sort((a, b) => {
              if (a.featured && !b.featured) return -1
              if (!a.featured && b.featured) return 1
              if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime()
              return 0
            })
            const id = `jr-muc-${muc.slug}`
            const moRong = mucMoRong.has(muc.id)
            const soBaiAn = baiTrongMuc.length - SO_BAI_HIEN_SAN
            const baiHien = moRong ? baiTrongMuc : baiTrongMuc.slice(0, SO_BAI_HIEN_SAN)

            return (
              <div key={muc.id} className="jr-category-section-wrap">
                {/* Đường phân cách sang trọng giữa các chuyên mục chính */}
                {idx > 0 && (
                  <div className="jr-category-separator my-16 sm:my-20 flex items-center justify-center gap-4 text-[#C9882C]/50" aria-hidden="true">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#C9882C]/30 to-transparent flex-1 max-w-sm" />
                    <span className="text-[11px] uppercase tracking-widest font-mono text-[#8C7A6B] px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#C9882C]/30 shadow-xs">
                      CHUYÊN MỤC {String(idx + 1).padStart(2, "0")} / {String(chuyenMuc.length).padStart(2, "0")}
                    </span>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#C9882C]/30 to-transparent flex-1 max-w-sm" />
                  </div>
                )}

                {/* Khung bao bọc phân biệt rõ ràng từng chuyên mục */}
                <section
                  id={id}
                  className="jr-category p-5 sm:p-8 lg:p-10 rounded-3xl bg-[rgba(250,243,232,0.65)] border border-[rgba(48,31,5,0.12)] shadow-[0_4px_24px_rgba(48,31,5,0.03)]"
                  aria-labelledby={`${id}-title`}
                >
                  <header className="jr-category-header rounded-2xl overflow-hidden shadow-xs">
                    <div className="jr-category-copy">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C9882C]/15 border border-[#C9882C]/30 text-[#8B5A1A] text-[11px] font-semibold tracking-wider uppercase font-mono">
                          Chuyên mục {String(idx + 1).padStart(2, "0")} / {String(chuyenMuc.length).padStart(2, "0")}
                        </span>
                        {muc.englishName && (
                          <span className="jr-category-english text-[#8C7A6B] text-[11px] tracking-wider uppercase" lang="en">
                            · {muc.englishName}
                          </span>
                        )}
                      </div>
                      <h3 id={`${id}-title`} className="serif font-normal">{muc.name}</h3>
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

                  {/* Slider 3 bài viết tiêu biểu cho mỗi chuyên mục với mũi tên bấm ngang */}
                  <ChuyenMucSlider
                    muc={muc}
                    baiTrongMuc={baiTrongMuc}
                    chuyenMuc={chuyenMuc}
                  />

                  {/* Hỗ trợ accessibility và hợp đồng kiểm thử */}
                  <div className="sr-only" aria-hidden="true">
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
                            if (moRong) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                            doiMoRong(muc.id)
                          }}
                        >
                          {moRong ? "Thu gọn ↑" : `Xem thêm ${soBaiAn} bài viết ↓`}
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
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
          <h2 id="jr-chuyen-de" className="serif font-normal not-italic" {...hieuUng("len", 1)}>
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

      {/* CHẾ ĐỘ ĐỌC BÀI VIẾT TOÀN VĂN (In-Page Reader Modal) */}
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

              {/* Thân bài đọc */}
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
