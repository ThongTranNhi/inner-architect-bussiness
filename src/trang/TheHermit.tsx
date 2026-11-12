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

export function Hermit() {
  const [menuIndex, setMenuIndex] = useState<number>(0)
  const [phongTo, setPhongTo] = useState<boolean>(false)

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
            <em>có chủ đích.</em>
          </h1>
          <Link to="/lien-he" className="underlink">
            Liên hệ The Hermit →
          </Link>
        </div>
      </section>

      <section className="hermit-intro section-pad">
        <p className="eyebrow">A PLACE TO STAY AWHILE</p>
        <h2 className="serif">Trà, đồ vật và một cuộc đối thoại vừa đủ.</h2>
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
          <h2 className="serif">Không có cách đúng để ở lại.</h2>
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

      <section className="hermit-tarot section-pad">
        <div>
          <p className="eyebrow">TAROT AT THE HERMIT</p>
          <h2 className="serif">Đọc bài như một hình thức soi chiếu.</h2>
          <p>
            Tarot không dự đoán tương lai, không chẩn đoán và không quyết định
            thay bạn. Một phiên tiếp cận chỉ giúp làm rõ điều đang hiện diện và
            cân nhắc bước tiếp theo phù hợp.
          </p>
          <Link to="/lien-he" className="button-link">
            Liên hệ đặt phiên Tarot
          </Link>
        </div>
        <img src={IMG.hermitTarotRoom} alt="Không gian Tarot tại The Hermit" loading="lazy" decoding="async" />
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
