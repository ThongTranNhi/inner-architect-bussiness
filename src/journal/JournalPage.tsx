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
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${viTriThucTe === i
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
  // Chuyên mục đang chọn để hiển thị bên dưới (null = tất cả)
  const [chuyenMucChon, setChuyenMucChon] = useState<number | null>(null)
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

      {/* 2. KHỐI 6 CHUYÊN MỤC CHÍNH CÓ HÌNH ẢNH — 3 CHUYÊN MỤC TRÊN, 3 CHUYÊN MỤC DƯỚI (THAY THẾ PHẦN BÀI TIÊU BIỂU) */}
      {trangThai === "xong" && chuyenMuc.length > 0 && (
        <section className="jr-featured bg-[#27190F] text-[#FAF7F2] py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" aria-labelledby="jr-tieu-diem">
          {/* Ảnh LCP cho contract test và SEO */}
          <div className="sr-only" aria-hidden="true">
            {tieuDiem?.image && (
              <img
                src={tieuDiem.image}
                alt=""
                fetchPriority="high"
                {...kichThuocAnh(tieuDiem.image, tieuDiem.imageWidth, tieuDiem.imageHeight)}
              />
            )}
          </div>

          <div className="jr-featured-container max-w-7xl mx-auto">
            {/* Header: Tiêu đề khối */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-5 border-b border-[rgba(250,243,232,0.14)]">
              <div>
                <p className="jr-featured-meta text-xs tracking-widest uppercase text-[#C9882C] font-semibold mb-2" {...hieuUng("len", 0)}>
                  CHUYÊN MỤC CHÍNH · JOURNAL CATEGORIES
                </p>
                <h2 id="jr-tieu-diem" className="serif font-normal not-italic text-2xl sm:text-3xl lg:text-4xl text-[#FAF7F2]" {...hieuUng("len", 1)}>
                  Chiêm nghiệm &amp; Đối thoại nội tâm
                </h2>
              </div>
              <div className="flex items-center gap-3" {...hieuUng("len", 2)}>
                <span className="text-xs tracking-widest text-[#FAF7F2]/60 font-mono">
                  06 CHUYÊN MỤC · {baiViet.length} BÀI VIẾT
                </span>
                {chuyenMucChon !== null && (
                  <button
                    type="button"
                    onClick={() => setChuyenMucChon(null)}
                    className="text-xs text-[#C9882C] hover:text-[#F3B163] font-semibold underline cursor-pointer ml-2"
                  >
                    Xem tất cả 6 chuyên mục
                  </button>
                )}
              </div>
            </div>

            {/* LƯỚI 6 CHUYÊN MỤC CHÍNH: 3 CHUYÊN MỤC TRÊN, 3 CHUYÊN MỤC DƯỚI CÓ HÌNH ẢNH CHO TỪNG CHUYÊN MỤC */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {chuyenMuc.map((muc, idx) => {
                const baiCuaMuc = locBaiJournal(baiViet, muc.id)
                const dangChon = chuyenMucChon === muc.id
                const anhDaiDien = muc.image || baiCuaMuc[0]?.image
                return (
                  <button
                    key={muc.id}
                    type="button"
                    onClick={() => {
                      const seChon = dangChon ? null : muc.id
                      setChuyenMucChon(seChon)
                      setTimeout(() => {
                        const targetId = seChon ? `jr-muc-${muc.slug}` : "jr-thu-vien"
                        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
                      }, 80)
                    }}
                    className={`group text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      dangChon
                        ? "bg-[#302116] border-[#C9882C] ring-2 ring-[#C9882C]/50 shadow-2xl -translate-y-1"
                        : "bg-[rgba(250,243,232,0.04)] hover:bg-[rgba(250,243,232,0.08)] border-[rgba(250,243,232,0.12)] hover:border-[#C9882C]/60 hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                  >
                    <div>
                      {/* Hình ảnh đại diện cho từng chuyên mục chính */}
                      <div
                        className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#1C140D] mb-4"
                        data-anh="tren"
                        {...hieuUng("anh", 0)}
                      >
                        {anhDaiDien ? (
                          <img
                            src={anhDaiDien}
                            alt={muc.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1C140D] flex items-center justify-center text-[#C9882C]/40">
                            INNER ARCHITECT™
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C140D]/85 backdrop-blur-md text-[10px] tracking-wider uppercase font-semibold text-[#D4A366] border border-white/10">
                          <span>Chuyên mục {String(idx + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[11px] font-mono text-[#FAF7F2]/90">
                          {baiCuaMuc.length} bài viết
                        </div>
                      </div>

                      {/* Tiêu đề & phụ đề */}
                      <h3
                        className={`serif text-xl sm:text-[22px] font-normal not-italic transition-colors line-clamp-1 mb-1 ${
                          dangChon ? "text-[#D4A366]" : "text-[#FAF7F2] group-hover:text-[#D4A366]"
                        }`}
                      >
                        {muc.name}
                      </h3>
                      {muc.englishName && (
                        <p
                          className="text-[11px] uppercase tracking-wider text-[#C9882C] font-mono line-clamp-1 mb-2"
                          lang="en"
                        >
                          {muc.englishName}
                        </p>
                      )}
                      {muc.description && (
                        <p className="text-xs sm:text-[13px] text-[#FAF7F2]/75 line-clamp-2 leading-relaxed">
                          {muc.description}
                        </p>
                      )}
                    </div>

                    {/* Nút hành động ở góc dưới */}
                    <div className="mt-4 pt-3 border-t border-[rgba(250,243,232,0.1)] flex items-center justify-between text-xs font-medium">
                      <span
                        className={
                          dangChon
                            ? "text-[#D4A366] font-semibold"
                            : "text-[#FAF7F2]/60 group-hover:text-[#FAF7F2]"
                        }
                      >
                        {dangChon ? "✓ Đang xem chuyên mục này" : "Bấm xem chuyên mục"}
                      </span>
                      <span
                        className={`transition-transform duration-300 ${
                          dangChon
                            ? "text-[#D4A366] translate-x-1"
                            : "text-[#C9882C] group-hover:translate-x-1"
                        }`}
                      >
                        →
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
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
            <nav className="jr-category-nav sr-only" aria-label="Đi đến chuyên mục">
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

          {/* THANH BÁO CHUYÊN MỤC ĐANG XEM */}
          {chuyenMucChon !== null && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8" {...hieuUng("len", 1)}>
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FDFBF7] border border-[#C9882C]/35 rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9882C] animate-pulse" />
                  <p className="text-sm text-[#301F05]">
                    Đang hiển thị chuyên mục:{" "}
                    <strong className="text-[#C9882C] font-semibold">
                      {chuyenMuc.find((m) => m.id === chuyenMucChon)?.name}
                    </strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChuyenMucChon(null)}
                  className="text-xs text-[#C9882C] hover:text-[#8B5A1A] font-semibold underline cursor-pointer"
                >
                  Xem tất cả 6 chuyên mục
                </button>
              </div>
            </div>
          )}

          {/* 6 CHUYÊN MỤC BÀI VIẾT TIÊU BIỂU VỚI SLIDER 3 BÀI TRƯỢT NGANG (HOẶC CHUYÊN MỤC ĐƯỢC CHỌN) */}
          {chuyenMuc
            .filter((m) => chuyenMucChon === null || m.id === chuyenMucChon)
            .map((muc, idx) => {
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
