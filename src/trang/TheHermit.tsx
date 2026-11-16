import { useState } from "react"
import { Link } from "../dieu-huong"
import { IMG } from "../du-lieu/hinh-anh"
import { ParentLink } from "./chung"

const CAC_MENU_HERMIT = [
  {
    id: "menu-1",
    ten: "Menu I · Trà Đạo, Trà Hoa & Signature",
    anh: IMG.hermitMenuTea,
    alt: "Thực đơn Trà Đạo, Trà Hoa và Signature Drinks - The Hermit",
  },
  {
    id: "menu-2",
    ten: "Menu II · Trà Pha Chế, Trà Sữa & Latte",
    anh: IMG.hermitMenuMix,
    alt: "Thực đơn Trà Pha Chế, Trà Chanh, Trà Sữa và Latte - The Hermit",
  },
]

/**
 * Danh mục dịch vụ và biểu phí Tarot chính thức từ The Hermit
 * Trích xuất nguyên bản từ tài liệu: The_Hermit_Tarot_Services_Website_REVISED.docx
 */
interface GoiDichVuTarot {
  id: string
  nhom: "reader" | "chuyen-gia"
  tenNhom: string
  tenGoi: string
  thoiLuong: string
  bieuPhi: string
  thongDiep: string
  moTa: string
  phuHopKhi: string
  giaTriHuongDen: string
  noiBat?: boolean
  nhanNoiBat?: string
}

const CAC_GOI_TAROT_HERMIT: GoiDichVuTarot[] = [
  // NHÓM 1: TAROT READER · PHIÊN THÔNG THƯỜNG
  {
    id: "tarot-mini",
    nhom: "reader",
    tenNhom: "Tarot Reader",
    tenGoi: "Tarot Mini",
    thoiLuong: "15 phút",
    bieuPhi: "99.000đ",
    thongDiep: "Một câu hỏi – Một góc nhìn rõ ràng.",
    moTa: "Dành cho những ai có một thắc mắc cụ thể và muốn nhìn nhận tình huống từ góc độ khác. Thông qua biểu tượng Tarot và cuộc trò chuyện cùng Reader, bạn có thể nhận diện các yếu tố đang ảnh hưởng đến vấn đề để tự cân nhắc bước tiếp theo.",
    phuHopKhi: "Có một câu hỏi rõ ràng về tình cảm, công việc, lựa chọn hoặc tình huống hiện tại.",
    giaTriHuongDen: "Một góc nhìn mới và một điều để suy ngẫm sau phiên.",
  },
  {
    id: "tarot-discovery",
    nhom: "reader",
    tenNhom: "Tarot Reader",
    tenGoi: "Tarot Discovery",
    thoiLuong: "30 phút",
    bieuPhi: "199.000đ",
    thongDiep: "Khám phá một chủ đề – Hiểu thêm về chính mình.",
    moTa: "Phiên trải nghiệm dành cho người muốn tìm hiểu sâu hơn về một chủ đề đang quan tâm. Reader đồng hành cùng bạn khám phá cảm xúc, những yếu tố tác động và các khả năng có thể cân nhắc qua biểu tượng Tarot.",
    phuHopKhi: "Đang phân vân về mối quan hệ, định hướng công việc hoặc quyết định cá nhân.",
    giaTriHuongDen: "Hiểu rõ hơn tình huống, nhu cầu và các lựa chọn của mình.",
  },
  {
    id: "tarot-guidance",
    nhom: "reader",
    tenNhom: "Tarot Reader",
    tenGoi: "Tarot Guidance",
    thoiLuong: "60 phút",
    bieuPhi: "399.000đ",
    thongDiep: "Nhìn đa chiều – Tìm hướng đi phù hợp.",
    moTa: "Khi một vấn đề có nhiều yếu tố liên quan, Tarot Guidance dành thêm thời gian để nhìn nhận toàn cảnh: hoàn cảnh, cảm xúc, niềm tin, trở ngại và nguồn lực. Reader hỗ trợ bạn kết nối các góc nhìn và cân nhắc hướng đi phù hợp.",
    phuHopKhi: "Có vấn đề phức tạp, nhiều yếu tố hoặc cần cân nhắc nhiều phương án.",
    giaTriHuongDen: "Bức tranh đa chiều và những lựa chọn có thể xem xét.",
    noiBat: true,
    nhanNoiBat: "Được lựa chọn nhiều nhất",
  },

  // NHÓM 2: CHUYÊN GIA · PHIÊN CHUYÊN SÂU
  {
    id: "inner-insight",
    nhom: "chuyen-gia",
    tenNhom: "Chuyên Gia",
    tenGoi: "Inner Insight",
    thoiLuong: "60 phút",
    bieuPhi: "599.000đ",
    thongDiep: "Thấu hiểu cảm xúc – Nhận diện giá trị bản thân.",
    moTa: "Phiên phản tư cá nhân kết hợp Tarot như công cụ gợi mở và đối thoại có cấu trúc. Bạn được khuyến khích khám phá cảm xúc, nhu cầu, niềm tin và những giá trị quan trọng để hiểu hơn cách mình đang phản ứng trước cuộc sống.",
    phuHopKhi: "Muốn hiểu bản thân, nhận diện nhu cầu hoặc đang trải qua mâu thuẫn nội tâm.",
    giaTriHuongDen: "Nhận diện cảm xúc, nhu cầu và các giá trị cá nhân cần được quan tâm.",
  },
  {
    id: "inner-journey",
    nhom: "chuyen-gia",
    tenNhom: "Chuyên Gia",
    tenGoi: "Inner Journey",
    thoiLuong: "90 phút",
    bieuPhi: "899.000đ",
    thongDiep: "Nhận diện khuôn mẫu – Định hướng thay đổi.",
    moTa: "Phiên tạo không gian để nhìn lại các trải nghiệm, cách phản ứng và những khuôn mẫu suy nghĩ hoặc hành vi có thể đang lặp lại. Qua đối thoại phản tư, bạn tìm hiểu mối liên hệ giữa cảm xúc, niềm tin và lựa chọn hiện tại để định hướng thay đổi phù hợp.",
    phuHopKhi: "Nhận thấy các khuôn mẫu lặp lại trong mối quan hệ, công việc hoặc lựa chọn cá nhân.",
    giaTriHuongDen: "Một khuôn mẫu đáng chú ý và hướng thay đổi có thể thực hành.",
  },
  {
    id: "inner-architect-session",
    nhom: "chuyen-gia",
    tenNhom: "Chuyên Gia",
    tenGoi: "Inner Architect™ Session",
    thoiLuong: "120 phút",
    bieuPhi: "1.499.000đ",
    thongDiep: "Kiến tạo nhận thức – Chủ động định hướng cuộc sống.",
    moTa: "Phiên phản tư chuyên sâu nhất của The Hermit, dành cho người muốn nhìn lại một vấn đề quan trọng và xây dựng định hướng thay đổi cụ thể. Qua đối thoại có cấu trúc, bạn khám phá giá trị, nguồn lực, trở ngại và xây dựng kế hoạch hành động bước đầu.",
    phuHopKhi: "Đang trong giai đoạn chuyển đổi, muốn tái định hướng hoặc hệ thống hóa mục tiêu.",
    giaTriHuongDen: "Bản định hướng cá nhân và kế hoạch hành động bước đầu do chính bạn làm chủ.",
    noiBat: true,
    nhanNoiBat: "Phiên chuyên sâu toàn diện",
  },
]

export function Hermit() {
  const [menuIndex, setMenuIndex] = useState<number>(0)
  const [phongTo, setPhongTo] = useState<boolean>(false)
  const [nhomTarotChon, setNhomTarotChon] = useState<"reader" | "chuyen-gia">("reader")

  const rituals = [
    [
      "01",
      "Chọn trà",
      "Bắt đầu bằng một hương vị, một chiếc cốc và một nhịp chậm hơn.",
    ],
    [
      "02",
      "Ở lại",
      "Đọc, quan sát hoặc chỉ ngồi yên — không cần phải tạo ra một kết luận.",
    ],
    [
      "03",
      "Trò chuyện",
      "Khi phù hợp, một phiên tiếp cận Tarot ngắn mở ra những câu hỏi có giới hạn rõ ràng.",
    ],
  ]

  return (
    <main className="hermit-page">
      <section className="hermit-hero">
        <img
          src={IMG.hermitStorefront}
          alt="Mặt tiền The Hermit"
          fetchPriority="high"
        />
        <div>
          <p>THE HERMIT · TP. HỒ CHÍ MINH</p>
          <h1 className="serif">
            Một khoảng lặng
            <br />
            để lắng nghe chính mình.
          </h1>
          <Link to="/lien-he" className="underlink">
            Liên hệ The Hermit →
          </Link>
        </div>
      </section>

      <section className="hermit-intro section-pad">
        <p className="eyebrow">A PLACE TO STAY AWHILE</p>
        <h2 className="serif">Trà đạo, Tarot và những cuộc đối thoại lắng đọng.</h2>
        <div>
          <p>
            The Hermit là không gian café, trà đạo và Tarot thuộc hệ sinh thái
            INNER ARCHITECT™. Ở đây, nhịp điệu không bắt bạn phải đi đến một
            trải nghiệm sâu hơn — nó chỉ mời bạn dành thời gian cho điều đang
            hiện diện.
          </p>
          <p>
            Phong cách phục vụ lấy cảm hứng từ một tea room đương đại: vật liệu
            được chạm tay, danh mục ngắn, nhịp chuyển cảnh nhẹ và khoảng trống
            để tự quan sát.
          </p>
        </div>
      </section>

      <section className="hermit-hall">
        <img src={IMG.hermitHall} alt="Sảnh chính The Hermit" loading="lazy" decoding="async" />
        <p>THE ROOM · DAY INTO EVENING</p>
      </section>

      <section className="hermit-rituals section-pad">
        <header>
          <p className="eyebrow">HOW TO BE HERE</p>
          <h2 className="serif">Cứ thong thả ở lại theo cách của bạn.</h2>
        </header>
        <div>
          {rituals.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3 className="serif">{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hermit-pair">
        <img src={IMG.hermitTeaRoom} alt="Góc thưởng trà tại The Hermit" loading="lazy" decoding="async" />
        <div>
          <p className="eyebrow">TEA · TAROT · OBJECTS</p>
          <h2 className="serif">Những điểm chạm đầu tiên.</h2>
          <p>
            Một ấm trà, một phiên Tarot tiếp cận ngắn, những bộ bài và nến được
            chọn như một phần của thế giới The Hermit — không phải một cửa hàng
            tách biệt.
          </p>
          <a href="#menu-the-hermit" className="underlink">
            Xem thực đơn trà & thức uống ↓
          </a>
        </div>
      </section>

      {/* PHẦN MENU HÌNH ẢNH NGUYÊN BẢN — THIẾT KẾ GỌN GÀNG TRỌN VẸN 1 TRANG */}
      <section id="menu-the-hermit" className="hermit-menu-showcase-section">
        <header className="hermit-menu-showcase-header">
          <p className="eyebrow">THE HERMIT · MENU</p>
          <h2 className="serif">Thực Đơn Quán The Hermit</h2>

          <div className="hermit-menu-pill-switch" role="tablist">
            {CAC_MENU_HERMIT.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={menuIndex === idx}
                className={`hermit-menu-pill ${
                  menuIndex === idx ? "is-active" : ""
                }`}
                onClick={() => setMenuIndex(idx)}
              >
                {item.ten}
              </button>
            ))}
          </div>
        </header>

        <div className="hermit-menu-stage-wrapper">
          <figure
            className="hermit-menu-figure"
            onClick={() => setPhongTo(true)}
            title="Nhấn vào ảnh để xem phóng to toàn màn hình"
          >
            <img
              src={CAC_MENU_HERMIT[menuIndex].anh}
              alt={CAC_MENU_HERMIT[menuIndex].alt}
              loading="lazy"
              decoding="async"
            />
            <div className="hermit-menu-figure-badge">
              <span>⤢ Nhấn để phóng to toàn màn hình</span>
            </div>
          </figure>

          {/* Nút điều hướng nhanh trước / sau */}
          <button
            type="button"
            className="hermit-menu-nav-arrow hermit-nav-prev"
            onClick={() =>
              setMenuIndex((prev) =>
                prev === 0 ? CAC_MENU_HERMIT.length - 1 : prev - 1
              )
            }
            aria-label="Xem menu trước"
            title="Xem menu trước"
          >
            ‹
          </button>
          <button
            type="button"
            className="hermit-menu-nav-arrow hermit-nav-next"
            onClick={() =>
              setMenuIndex((prev) =>
                prev === CAC_MENU_HERMIT.length - 1 ? 0 : prev + 1
              )
            }
            aria-label="Xem menu kế tiếp"
            title="Xem menu kế tiếp"
          >
            ›
          </button>
        </div>

        {/* Modal phóng to toàn màn hình khi cần soi rõ chi tiết */}
        {phongTo && (
          <div
            className="hermit-menu-modal"
            onClick={() => setPhongTo(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="hermit-menu-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="hermit-menu-modal-close"
                onClick={() => setPhongTo(false)}
                aria-label="Đóng xem ảnh"
              >
                ✕ Đóng
              </button>
              <img
                src={CAC_MENU_HERMIT[menuIndex].anh}
                alt={CAC_MENU_HERMIT[menuIndex].alt}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        )}
      </section>

      {/* PHIÊN SOI CHIẾU TAROT & BIỂU PHÍ DỊCH VỤ CHÍNH THỨC */}
      <section id="tarot-the-hermit" className="hermit-tarot-showcase">
        <div className="hermit-tarot-container">
          {/* Header Giới Thiệu Dịch Vụ */}
          <div className="hermit-tarot-header">
            <p className="eyebrow">THE HERMIT · TAROT SERVICES</p>
            <h2 className="serif">Đọc bài như một hình thức soi chiếu.</h2>
            <p className="hermit-tarot-desc">
              Mỗi hành trình bắt đầu từ một câu hỏi. Tại The Hermit, Tarot được sử dụng như một công cụ gợi mở đối thoại, giúp bạn nhìn nhận vấn đề từ nhiều góc độ và hiểu thêm về chính mình. Mỗi phiên là không gian đối thoại riêng tư 1:1, giúp bạn nhìn rõ những cảm xúc đang hiện diện, quan sát mô thức tâm lý và tự lựa chọn hướng đi phù hợp.
            </p>
            <div className="hermit-tarot-pillars">
              <span>Explore</span>
              <span>·</span>
              <span>Reflect</span>
              <span>·</span>
              <span>Transform</span>
            </div>
          </div>

          {/* Bộ chuyển đổi Nhóm Dịch Vụ */}
          <div className="hermit-tarot-tabs">
            <button
              type="button"
              onClick={() => setNhomTarotChon("reader")}
              className={`hermit-tarot-tab-btn ${
                nhomTarotChon === "reader" ? "active" : ""
              }`}
            >
              Tarot Reader · Phiên Thông Thường
            </button>
            <button
              type="button"
              onClick={() => setNhomTarotChon("chuyen-gia")}
              className={`hermit-tarot-tab-btn ${
                nhomTarotChon === "chuyen-gia" ? "active" : ""
              }`}
            >
              Chuyên Gia · Phiên Chuyên Sâu
            </button>
          </div>

          {/* Lưới các gói dịch vụ và biểu phí chi tiết */}
          <div className="hermit-tarot-grid">
            {CAC_GOI_TAROT_HERMIT.filter(
              (goi) => goi.nhom === nhomTarotChon,
            ).map((goi) => (
              <article
                key={goi.id}
                className={`hermit-tariff-card ${goi.noiBat ? "featured" : ""}`}
              >
                {goi.nhanNoiBat && (
                  <div className="hermit-tariff-ribbon">
                    ✦ {goi.nhanNoiBat}
                  </div>
                )}

                <div>
                  <div className="hermit-tariff-top">
                    <span className="hermit-tariff-tier-badge">{goi.tenNhom}</span>
                    <span className="hermit-tariff-duration">{goi.thoiLuong}</span>
                  </div>

                  <h3 className="serif hermit-tariff-title">{goi.tenGoi}</h3>

                  <div className="hermit-tariff-price">
                    <span>{goi.bieuPhi}</span>
                  </div>

                  <p className="serif hermit-tariff-motto">“{goi.thongDiep}”</p>

                  <p className="hermit-tariff-desc">{goi.moTa}</p>

                  <div className="hermit-tariff-criteria">
                    <div className="hermit-tariff-criteria-row">
                      <strong>Phù hợp khi:</strong> {goi.phuHopKhi}
                    </div>
                    <div className="hermit-tariff-criteria-row">
                      <strong>Giá trị hướng đến:</strong> {goi.giaTriHuongDen}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/lien-he?dichVu=${encodeURIComponent(goi.tenGoi)}`}
                  className="hermit-tariff-cta"
                  title={`Đặt lịch phiên ${goi.tenGoi}`}
                >
                  <span>Đặt lịch {goi.tenGoi}</span>
                  <span>→</span>
                </Link>
              </article>
            ))}
          </div>

          {/* Thông tin dịch vụ & Ranh giới an toàn */}
          <div className="hermit-tarot-notes">
            <div className="hermit-tarot-note-item">
              <span>
                <strong>Thực đơn đồ uống:</strong> Mức phí chưa bao gồm thức uống tại quán (tính riêng theo thực đơn).
              </span>
            </div>
            <div className="hermit-tarot-note-item">
              <span>
                <strong>Bảo mật &amp; Riêng tư:</strong> Đối thoại 1:1 trong phòng riêng; nội dung được tôn trọng và bảo mật nghiêm ngặt.
              </span>
            </div>
            <div className="hermit-tarot-note-item">
              <span>
                <strong>Công cụ gợi mở:</strong> Tarot là công cụ chiêm nghiệm đa chiều, không mang tính bói toán hay quyết định thay bạn.
              </span>
            </div>
            <div className="hermit-tarot-note-item">
              <span>
                <strong>Ranh giới chuyên môn:</strong> Phiên phản tư không thay thế dịch vụ khám, chẩn đoán hoặc điều trị y tế lâm sàng.
              </span>
            </div>
          </div>

          {/* Khối không gian trải nghiệm tĩnh lặng */}
          <div className="hermit-tarot-atmosphere">
            <figure className="hermit-tarot-atmosphere-media">
              <img
                src="/assets/the-hermit/khong-gian-tarot-tinh-lang.webp"
                alt="Không gian trải nghiệm Tarot tĩnh lặng tại The Hermit"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="hermit-tarot-atmosphere-copy">
              <p className="eyebrow" style={{ color: "#B75E2A", marginBottom: "8px" }}>
                SANCTUARY &amp; INTENTION
              </p>
              <h3 className="serif">
                Không gian tĩnh lặng cho những cuộc trò chuyện sâu.
              </h3>
              <p>
                Phòng riêng được bài trí ấm cúng với ánh sáng dịu, hương trầm nhẹ và chén trà thơm, bảo đảm sự an tâm trọn vẹn để bạn thả lỏng và lắng nghe những điều quan trọng nhất bên trong mình.
              </p>
              <div>
                <Link
                  to="/lien-he"
                  className="button-link"
                  style={{
                    display: "inline-block",
                    padding: "14px 28px",
                    background: "#27190F",
                    color: "#FEFBF0",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  Liên hệ nhận tư vấn &amp; đặt lịch hẹn →
                </Link>
                <p style={{ fontSize: "12px", color: "rgba(48, 31, 5, 0.6)", marginTop: "8px", marginBottom: 0 }}>
                  Hỗ trợ giải đáp nhanh qua Zalo hoặc Fanpage chính thức
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hermit-visit section-pad">
        <div>
          <p className="eyebrow">VISIT</p>
          <h2 className="serif">Ghé The Hermit</h2>
          <p>
            595/18 Cách Mạng Tháng 8, Phường Hoà Hưng
            <br />
            TP. Hồ Chí Minh
            <br />
            <br />
            Giờ mở cửa: 08:00 – 22:00
          </p>
          <a
            href="https://www.google.com/maps/place/The+Hermit/@10.78375,106.668791,17z/data=!4m6!3m5!1s0x31752f9cc2654bab:0x989071894092a18a!8m2!3d10.78375!4d106.668791!16s%2Fg%2F11p2ssn6_d"
            target="_blank"
            rel="noopener noreferrer"
            className="underlink"
          >
            Chỉ đường trên Google Maps →
          </a>
        </div>
        <div className="map hermit-map-box">
          <iframe
            src="https://maps.google.com/maps?q=10.78375,106.668791&hl=vi&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "260px", flex: 1 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ The Hermit trên Google Maps"
          />
          <div className="hermit-map-card">
            <div>
              <strong>THE HERMIT</strong>
              <span>595/18 Cách Mạng Tháng 8, P. Hoà Hưng, TP.HCM · 08:00 – 22:00</span>
            </div>
            <a
              href="https://www.google.com/maps/place/The+Hermit/@10.78375,106.668791,17z/data=!4m6!3m5!1s0x31752f9cc2654bab:0x989071894092a18a!8m2!3d10.78375!4d106.668791!16s%2Fg%2F11p2ssn6_d"
              target="_blank"
              rel="noopener noreferrer"
              className="underlink"
            >
              Mở trên Google Maps ↗
            </a>
          </div>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
