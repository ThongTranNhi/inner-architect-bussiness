import { Link } from "../dieu-huong"
import { IMG } from "../du-lieu/hinh-anh"
import { ParentLink } from "./chung"
import { LaraServices } from "../components/LaraServices"

export function LaraPage() {
  const products = [
    [
      "/assets/lara/lara-soul-cleanse.webp",
      "Soul Cleanse",
      "Hương bạch đàn, bạc hà và cây xô thơm, phù hợp với những khoảng thời gian cần cảm giác thanh thoát và tập trung hơn.",
      "Bạch đàn · Bạc hà · Xô thơm",
    ],
    [
      IMG.sacredGround,
      "Sacred Ground",
      "Hương gỗ Palo Santo, khói và xạ hương, tạo nên một bầu không khí trầm, ấm cho thời gian đọc, viết hoặc chiêm nghiệm.",
      "Palo Santo · Khói · Xạ hương",
    ],
    [
      IMG.soulEmbrace,
      "Soul Embrace",
      "Hương rosewood, lavender và xô thơm, hướng đến cảm giác dịu và ấm trong không gian nghỉ ngơi.",
      "Rosewood · Lavender · Xô thơm",
    ],
  ]

  const bonNhomSanPham = [
    {
      id: "nen-thom",
      nhanSo: "01 · NẾN THƠM",
      ten: "Nến Thơm Sáp Thực Vật",
      moTa:
        "Sáp đậu nành & dừa tự nhiên, bấc gỗ êm đềm với 3 nốt hương Soul Cleanse, Sacred Ground & Soul Embrace cho từng khoảnh khắc phản tư.",
      anh: IMG.soulCleanse,
      dacDiem: "3 nốt hương · Hũ 200g",
      lienKet: "#bo-suu-tap",
    },
    {
      id: "nhang-que",
      nhanSo: "02 · NHANG QUE",
      ten: "Nhang Que Tự Nhiên",
      moTa:
        "Bột trầm hương rừng và vỏ quế cổ truyền, tăm tre mộc không hóa chất, mang hương thơm thuần khiết ấm cúng neo giữ an yên.",
      anh: IMG.laraNhangTram,
      dacDiem: "Trầm & Quế · Thuần khiết",
      lienKet: "#bo-suu-tap",
    },
    {
      id: "nu-xong",
      nhanSo: "03 · NỤ XÔNG",
      ten: "Nụ Xông Thảo Mộc",
      moTa:
        "Nụ trầm, nụ quế và rễ bài truyền thống giúp thanh lọc uế khí, xua tan hàn lạnh và kích hoạt sinh khí tốt lành cho gian phòng.",
      anh: IMG.laraNuTram,
      dacDiem: "Trầm · Quế · Rễ Bài",
      lienKet: "#bo-suu-tap",
    },
    {
      id: "bai-tarot",
      nhanSo: "04 · BÀI TAROT",
      ten: "Bộ Bài Huyền Giới Tarot",
      moTa:
        "Tác phẩm chiêm nghiệm 78 lá bài do Founder Khiêm Võ biên soạn, biểu tượng trực quan kết nối trực giác và soi chiếu thế giới nội tâm.",
      anh: IMG.tarotHuyenGioiCover,
      dacDiem: "78 lá bài · Sách hướng dẫn",
      lienKet: "/bo-bai-tarot",
    },
  ]

  return (
    <main className="bg-[#FAF7F2] text-[#27190F]">
      {/* Editorial Hero Section */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 pt-8 pb-16 lg:pb-24 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between py-4 border-b border-[#27190F]/10 mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE7DB]/70 border border-[#27190F]/8 text-xs uppercase tracking-widest text-[#7B6B5D] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B75E2A] animate-pulse"></span>
            Lara Infinity · Inner Architect™ Ecosystem
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold text-[#6E5949] bg-[#EFE7DB] hover:bg-[#B75E2A] hover:text-white transition-all shadow-xs group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Về trang chủ</span>
          </Link>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Narrative & Sensory notes */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B75E2A] mb-3">
              HƯƠNG THƠM &amp; NGHI THỨC CÁ NHÂN
            </p>
            <h1 className="serif text-4xl sm:text-5xl md:text-6xl text-[#27190F] tracking-tight leading-[0.98] mb-5 font-normal not-italic">
              Lara Infinity
            </h1>
            <p className="serif italic text-2xl sm:text-3xl text-[#4A3B2C] leading-snug mb-5">
              Hương thơm cho những khoảng nghỉ và nghi thức cá nhân.
            </p>
            <p className="text-[#554538] text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Lara Infinity là nhánh sản phẩm hương thơm do Founder Khiêm Võ phát triển, kết nối mùi hương tự nhiên, vật liệu mộc mạc và những khoảng thời gian tĩnh lặng dành riêng cho chính mình.
            </p>

            {/* 3 Scent Profiles Mini-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#27190F]/10 hover:border-[#B75E2A]/40 transition-all duration-300 hover:shadow-xs group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3D5A45]"></span>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#27190F]">Soul Cleanse</span>
                </div>
                <p className="text-xs text-[#6B5A4D] leading-relaxed">Bạch đàn, bạc hà &amp; xô thơm thanh lọc, tỉnh thức.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#27190F]/10 hover:border-[#B75E2A]/40 transition-all duration-300 hover:shadow-xs group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B75E2A]"></span>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#27190F]">Sacred Ground</span>
                </div>
                <p className="text-xs text-[#6B5A4D] leading-relaxed">Gỗ Palo Santo &amp; xạ hương ấm trầm, neo giữ an yên.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#27190F]/10 hover:border-[#B75E2A]/40 transition-all duration-300 hover:shadow-xs group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7D5A6E]"></span>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#27190F]">Soul Embrace</span>
                </div>
                <p className="text-xs text-[#6B5A4D] leading-relaxed">Rosewood &amp; lavender vỗ về, xoa dịu thân tâm.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/the-hermit"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#B75E2A] hover:bg-[#9E4D1F] text-[#FAF7F2] font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Trải nghiệm tại The Hermit</span>
                <span>→</span>
              </Link>
              <a
                href="#bo-suu-tap"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#EFE7DB] hover:bg-[#E5DACE] text-[#4A3B2C] text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Khám phá bộ sưu tập</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Spotlight Card */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden border border-[#27190F]/15 bg-[#20140D] shadow-2xl transition-all duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(39,25,15,0.25)]">
              <img
                src={IMG.lara}
                alt="Bộ sưu tập nến thơm và nghi thức LARA"
                loading="lazy"
                decoding="async"
                className="w-full h-[400px] sm:h-[480px] lg:h-[540px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20140D]/90 via-[#20140D]/20 to-transparent pointer-events-none"></div>

              {/* Floating Badge Top */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#20140D]/75 backdrop-blur-md border border-[#FAF7F2]/15 text-[11px] font-medium text-[#FAF7F2] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B75E2A]"></span>
                Chế tác thủ công · Sáp thực vật
              </div>

              {/* Editorial Overlay Caption Bottom */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 text-[#FAF7F2]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#D6A56E] font-medium mb-1.5">
                  BỘ SƯU TẬP HƯƠNG NĂM 2026
                </p>
                <h3 className="serif text-lg sm:text-xl leading-snug mb-2 font-normal not-italic">
                  Không gian lắng dịu &amp; nghi thức tĩnh tại
                </h3>
                <p className="text-xs text-[#FAF7F2]/80 leading-relaxed font-light">
                  Hiện diện tại trà quán The Hermit — Nơi mỗi ngọn nến được thắp lên như lời nhắc nhở trở về với hiện tại.
                </p>
              </div>
            </div>

            {/* Subtle decorative background glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#B75E2A]/15 to-[#D6A56E]/15 rounded-3xl blur-xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </section>

      {/* 4-Card Showcase Bar — Xem trọn vẹn 4 nhóm sản phẩm chính trước khi cuộn xuống */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 pt-2 pb-16 lg:pb-24 max-w-7xl mx-auto" aria-labelledby="lara-bon-nhom-san-pham">
        <div className="border-t border-[#27190F]/10 pt-10 sm:pt-14 mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B75E2A] mb-2">
              BỘ SƯU TẬP KHÁM PHÁ · 4 DÒNG SẢN PHẨM
            </p>
            <h2 id="lara-bon-nhom-san-pham" className="serif text-2xl sm:text-3xl text-[#27190F] leading-tight font-normal not-italic">
              Bốn trải nghiệm hương &amp; nghi thức tĩnh tại
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E5949] max-w-md leading-relaxed">
            Xem nhanh 4 dòng sản phẩm cốt lõi của Lara Infinity trước khi tìm hiểu sâu về triết lý và câu chuyện chế tác.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bonNhomSanPham.map((sp) => (
            <div
              key={sp.id}
              className="group flex flex-col rounded-2xl bg-[#F6EFE5] border border-[#27190F]/12 overflow-hidden hover:border-[#B75E2A]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-[#27190F]/5">
                <img
                  src={sp.anh}
                  alt={sp.ten}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#20140D]/80 backdrop-blur-md text-[10px] tracking-wider uppercase font-semibold text-[#FAF7F2] border border-white/10">
                  {sp.nhanSo}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="serif text-lg text-[#27190F] mb-1.5 group-hover:text-[#B75E2A] transition-colors font-normal not-italic">
                    {sp.ten}
                  </h3>
                  <p className="text-xs text-[#554538] leading-relaxed mb-4 line-clamp-3">
                    {sp.moTa}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#27190F]/8 flex items-center justify-between text-[11px] text-[#7A6757]">
                  <span className="font-medium text-[#B75E2A]">{sp.dacDiem}</span>
                  {sp.lienKet.startsWith("/") ? (
                    <Link
                      to={sp.lienKet}
                      className="inline-flex items-center gap-1 font-semibold text-[#27190F] hover:text-[#B75E2A] transition-colors"
                    >
                      <span>Chi tiết</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  ) : (
                    <a
                      href={sp.lienKet}
                      className="inline-flex items-center gap-1 font-semibold text-[#27190F] hover:text-[#B75E2A] transition-colors"
                    >
                      <span>Chi tiết</span>
                      <span className="transition-transform group-hover:translate-y-0.5">↓</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy / Story Section */}
      <section className="lara-story section-pad" id="bo-suu-tap">
        <img
          src={IMG.soulCleanse}
          alt="Bộ ba sản phẩm hương thơm LARA"
          loading="lazy"
          decoding="async"
        />
        <div>
          <h2 className="serif font-normal not-italic text-2xl sm:text-3xl">
            Một trải nghiệm cảm quan, không phải tuyên bố điều trị.
          </h2>
          <p>
            Mỗi sản phẩm được giới thiệu như một trải nghiệm về hương, không
            gian và nghi thức cá nhân. LARA không phải tầng chữa lành hoặc điều
            kiện tham gia INNER ARCHITECT™.
          </p>
        </div>
      </section>

      {/* 3 Products Section */}
      <section className="lara-products section-pad max-w-6xl mx-auto px-5 sm:px-8">
        {products.map((p) => (
          <article key={p[1]} className="max-w-[280px] w-full mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-md border border-[#27190F]/10 group bg-[#20140D]/5">
              <img
                src={p[0]}
                alt={`Graphic sản phẩm LARA ${p[1]} với chữ đóng cứng`}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[280px] aspect-4/5 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <h2 className="serif text-xl sm:text-2xl mt-5 mb-2 text-[#27190F] font-normal not-italic">{p[1]}</h2>
            <p className="text-sm text-[#554538] leading-relaxed">{p[2]}</p>
          </article>
        ))}
      </section>

      {/* LARA INFINITY — Interactive Services / Products Grid */}
      <LaraServices />

      {/* Safe Usage Section */}
      <section className="simple-content section-pad">
        <div>
          <h2 className="serif font-normal not-italic text-2xl sm:text-3xl">Sử dụng an toàn</h2>
        </div>
        <div>
          <p>
            Đặt nến và đế cắm nhang/lư xông trên bề mặt phẳng, chịu nhiệt, cách vật dễ cháy và luồng gió mạnh. Không để nến hay nhang cháy khi không có người quan sát. Dừng sử dụng nếu mùi hương gây khó chịu.
          </p>
          <p>
            Tình trạng hàng, giá và địa điểm mua chỉ được công bố sau khi xác nhận.
          </p>
          <Link to="/the-hermit" className="underlink">
            Trải nghiệm tại The Hermit →
          </Link>
        </div>
      </section>

      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
