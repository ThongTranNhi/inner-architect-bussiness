import { Link } from "../dieu-huong"
import { IMG } from "../du-lieu/hinh-anh"
import { ParentLink } from "./chung"

export function Hermit() {
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
          <Link to="/lara" className="underlink">
            Khám phá LARA →
          </Link>
        </div>
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
            637/13/8 Quang Trung, Phường Thông Tây Hội
            <br />
            TP. Hồ Chí Minh
            <br />
            <br />
            [Giờ mở cửa: xác nhận]
          </p>
        </div>
        <div className="map">
          THE HERMIT
          <br />
          <span>Vị trí chính xác sẽ được cập nhật</span>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
