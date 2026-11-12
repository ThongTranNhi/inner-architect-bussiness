import { ContactThreeColumnSection } from "../components/ContactThreeColumnSection"
import { contactChannels, hasContactChannel, SO_DIEN_THOAI_ZALO } from "../config/contact"
import { IMG } from "../du-lieu/hinh-anh"
import { EMAIL_LIEN_HE, KenhLienHeChung, PageHero, ParentLink } from "./chung"

/** Sáu nhánh nhu cầu khách có thể nhắn qua kênh liên hệ chung. */
export const danhSachNhuCauLienHe = [
  "Trải nghiệm trà đạo có hướng dẫn (theo lịch hẹn)",
  "Phiên Tarot online hoặc trực tiếp",
  "Đồng hành 1:1",
  "Workshop",
  "Academy và các khóa học",
  "Sản phẩm LARA",
]

/** Thông tin bổ trợ chi tiết cho từng nhánh nhu cầu trên trang liên hệ. */
const thongTinNhuCau: Record<
  string,
  {
    so: string
    nhan: string
    moTa: string
    hinhThuc: string
  }
> = {
  "Trải nghiệm trà đạo có hướng dẫn (theo lịch hẹn)": {
    so: "01",
    nhan: "The Hermit · Không gian trà",
    moTa: "Thưởng trà định tâm, trò chuyện tĩnh lặng và kết nối nhịp sống trong không gian trà đạo mộc mạc.",
    hinhThuc: "Trực tiếp tại quán",
  },
  "Phiên Tarot online hoặc trực tiếp": {
    so: "02",
    nhan: "Soi chiếu & Chiêm nghiệm",
    moTa: "Làm việc với biểu tượng Tarot để soi chiếu tâm thức, nhận diện các nút thắt và tìm góc nhìn sáng suốt.",
    hinhThuc: "Online hoặc Trực tiếp",
  },
  "Đồng hành 1:1": {
    so: "03",
    nhan: "Tiến trình chuyên sâu",
    moTa: "Lộ trình đồng hành cá nhân dài hạn có mục tiêu, nhịp điệu và ranh giới rõ ràng cho sự phát triển của bạn.",
    hinhThuc: "Lộ trình cá nhân",
  },
  Workshop: {
    so: "04",
    nhan: "Trải nghiệm nhóm nhỏ",
    moTa: "Các buổi thực hành chạm vẽ để dịu lại, nhận diện mô thức hành vi và tương tác nhóm ấm cúng.",
    hinhThuc: "Nhóm giới hạn",
  },
  "Academy và các khóa học": {
    so: "05",
    nhan: "Học thuật & Đào tạo",
    moTa: "Chương trình đào tạo Tarot từ nền tảng đến chuyên sâu, có người giám sát và giáo trình bài bản.",
    hinhThuc: "Khóa học theo khóa",
  },
  "Sản phẩm LARA": {
    so: "06",
    nhan: "Chăm sóc thân tâm",
    moTa: "Các sản phẩm mùi hương, trà và vật phẩm hỗ trợ không gian tĩnh dưỡng, tái tạo năng lượng mỗi ngày.",
    hinhThuc: "Vật phẩm gửi tận nơi",
  },
}

/**
 * Trang Liên hệ — diện mạo mới ấn tượng, biên tập kiến trúc và hiệu ứng chuyển động mượt mà.
 * Tiếp nhận mọi nhu cầu qua một cổng chung Zalo / Facebook / Email.
 * Không thu thập dữ liệu; khách chủ động gửi nhu cầu qua kênh chính thức.
 *
 * @returns Trang liên hệ biên tập
 */
export function ContactPage() {
  return (
    <main className="cream-page contact-page contact-editorial-page">
      <div className="contact-fade-in contact-delay-1">
        <PageHero
          eyebrow="LIÊN HỆ · INNER ARCHITECT™"
          title="Một kênh liên hệ"
          italic="cho mọi nhu cầu."
          intro="Trà đạo có hướng dẫn, Tarot, đồng hành 1:1, workshop, Academy và sản phẩm đều được tiếp nhận qua cùng một kênh Zalo / Facebook. Bạn tự gửi nhu cầu; đội ngũ phản hồi và xác nhận ngoài website."
        />
      </div>

      {/* Thanh điểm nhấn tóm tắt */}
      <section className="contact-summary-strip contact-fade-in contact-delay-2" aria-label="Cam kết tiếp nhận">
        <div className="contact-summary-pill">
          <span className="contact-pill-dot" />
          <span>Phản hồi trong 24 giờ làm việc</span>
        </div>
        <div className="contact-summary-pill">
          <span className="contact-pill-dot" />
          <span>Tiếp đón tại The Hermit (Hoà Hưng)</span>
        </div>
        <div className="contact-summary-pill">
          <span className="contact-pill-dot" />
          <span>Riêng tư &amp; Không lưu trữ dữ liệu</span>
        </div>
      </section>

      {/* Khối liên hệ 3 cột cao cấp: Bộ chọn ngày tương tác, giờ mở cửa & thẻ kết nối trượt kép */}
      <div className="contact-fade-in contact-delay-2 w-full">
        <ContactThreeColumnSection />
      </div>

      {/* Phần 1: Ba thẻ kênh liên hệ trực tiếp */}
      <section className="contact-channels-section contact-fade-in contact-delay-2" aria-labelledby="heading-kenh-truc-tiep">
        <div className="contact-section-header">
          <p className="eyebrow">KÊNH LIÊN HỆ TRỰC TIẾP</p>
          <h2 id="heading-kenh-truc-tiep" className="serif">
            Nhắn trực tiếp cho INNER ARCHITECT™.
          </h2>
          <p className="contact-section-lead">
            Lựa chọn kênh kết nối thuận tiện nhất với bạn để được phản hồi và hướng dẫn chi tiết.
          </p>
        </div>

        <div className="contact-channels-grid">
          {/* Card Zalo */}
          <div className="contact-channel-card contact-channel-zalo">
            <div className="contact-channel-card-top">
              <span className="contact-channel-badge">Phổ biến nhất</span>
              <h3 className="serif">Zalo Official</h3>
              <p>
                Kênh phản hồi nhanh nhất để hỏi thông tin, đặt lịch hẹn trải nghiệm trà hoặc các phiên tham vấn 1:1.
                <br />
                <span className="font-semibold text-[#8C5339]">Zalo: {SO_DIEN_THOAI_ZALO}</span>
              </p>
            </div>
            <div className="contact-channel-card-action">
              {contactChannels.zalo ? (
                <a
                  href={contactChannels.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card-btn primary"
                >
                  Nhắn qua Zalo →
                </a>
              ) : (
                <span className="contact-card-status">Đang cập nhật link Zalo</span>
              )}
            </div>
          </div>

          {/* Card Facebook */}
          <div className="contact-channel-card contact-channel-facebook">
            <div className="contact-channel-card-top">
              <span className="contact-channel-badge">Cộng đồng</span>
              <h3 className="serif">Facebook Page</h3>
              <p>
                Theo dõi các hoạt động, sự kiện workshop mới và nhắn tin trao đổi qua trang fanpage chính thức.
              </p>
            </div>
            <div className="contact-channel-card-action">
              {contactChannels.facebook ? (
                <a
                  href={contactChannels.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card-btn secondary"
                >
                  Nhắn qua Facebook →
                </a>
              ) : (
                <span className="contact-card-status">Đang cập nhật link Facebook</span>
              )}
            </div>
          </div>

          {/* Card Email */}
          <div className="contact-channel-card contact-channel-email">
            <div className="contact-channel-card-top">
              <span className="contact-channel-badge">Hợp tác</span>
              <h3 className="serif">Thư điện tử</h3>
              <p>
                Dành cho các đề xuất hợp tác doanh nghiệp, tổ chức workshop nội bộ hoặc thư chi tiết.
              </p>
            </div>
            <div className="contact-channel-card-action">
              <a
                href={`mailto:${EMAIL_LIEN_HE}`}
                className="contact-card-btn outline"
              >
                Gửi email trực tiếp →
              </a>
            </div>
          </div>
        </div>

        <div className="contact-transparency-note">
          <p>
            Zalo và Facebook là nền tảng bên thứ ba với chính sách riêng. Website không tự gửi tin nhắn thay bạn và không lưu nội dung bạn trao đổi ở đó.
          </p>
          {!hasContactChannel && (
            <div className="contact-fallback-embed">
              <KenhLienHeChung />
            </div>
          )}
        </div>
      </section>

      {/* Phần 2: Danh mục sáu nhánh nhu cầu tiếp nhận */}
      <section className="contact-topics-section contact-fade-in contact-delay-3" aria-labelledby="heading-nhu-cau">
        <div className="contact-section-header">
          <p className="eyebrow">BẠN CÓ THỂ NHẮN VỀ</p>
          <h2 id="heading-nhu-cau" className="serif">
            Ghi rõ nhu cầu để được phản hồi đúng người.
          </h2>
          <p className="contact-section-lead">
            Thời lượng, lịch và chi phí của từng chương trình sẽ được xác nhận trực tiếp khi bạn nhắn qua kênh chung.
          </p>
        </div>

        <div className="contact-topics-grid">
          {danhSachNhuCauLienHe.map((nhuCau, index) => {
            const chiTiet = thongTinNhuCau[nhuCau]
            const soThuTu = chiTiet?.so ?? `0${index + 1}`
            const nhan = chiTiet?.nhan ?? "Chương trình"
            const moTa = chiTiet?.moTa ?? ""
            const hinhThuc = chiTiet?.hinhThuc ?? "Theo lịch hẹn"

            return (
              <article key={nhuCau} className="contact-topic-card">
                <div className="contact-topic-header">
                  <span className="contact-topic-num serif">{soThuTu}</span>
                  <span className="contact-topic-tag">{nhan}</span>
                </div>
                <h3 className="contact-topic-title serif">{nhuCau}</h3>
                {moTa && <p className="contact-topic-desc">{moTa}</p>}
                <div className="contact-topic-footer">
                  <span className="contact-topic-format">{hinhThuc}</span>
                  <span className="contact-topic-arrow">→</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Phần 3: Không gian vật lý The Hermit */}
      <section className="contact-space-section contact-fade-in contact-delay-4" aria-labelledby="heading-khong-gian">
        <div className="contact-space-card">
          <div className="contact-space-visual">
            <img
              src={IMG.hermitKhongGianQuan}
              alt="Không gian quán The Hermit trong một phiên tiếp cận và soi chiếu"
              loading="lazy"
              decoding="async"
              className="contact-space-img"
            />
            <div className="contact-space-visual-overlay">
              <span className="contact-space-visual-badge">The Hermit · TP. Hồ Chí Minh</span>
            </div>
          </div>
          <div className="contact-space-content">
            <p className="eyebrow">ĐỊA CHỈ &amp; KHÔNG GIAN ĐÓN TIẾP</p>
            <h2 id="heading-khong-gian" className="serif">
              The Hermit
            </h2>
            <div className="contact-space-address-box">
              <p className="contact-space-address serif">
                595/18 Cách Mạng Tháng 8, Phường Hoà Hưng
                <br />
                TP. Hồ Chí Minh
              </p>
            </div>
            <p className="contact-space-note">
              Không gian trà đạo mộc mạc và tĩnh lặng, dành riêng cho các buổi thưởng trà và các phiên trò chuyện chuyên sâu.
            </p>
            <div className="contact-space-guidelines">
              <div className="contact-guideline-item">
                <span className="guideline-label">Giờ mở cửa:</span>
                <span>08:00 – 22:00</span>
              </div>
              <div className="contact-guideline-item">
                <span className="guideline-label">Hình thức:</span>
                <span>Tiếp đón theo lịch hẹn đã xác nhận trước</span>
              </div>
              <div className="contact-guideline-item">
                <span className="guideline-label">Chỉ đường:</span>
                <span>
                  <a
                    href="https://www.google.com/maps/place/The+Hermit/@10.78375,106.668791,17z/data=!4m6!3m5!1s0x31752f9cc2654bab:0x989071894092a18a!8m2!3d10.78375!4d106.668791!16s%2Fg%2F11p2ssn6_d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underlink"
                  >
                    Xem vị trí The Hermit trên Google Maps ↗
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-fade-in contact-delay-5">
        <ParentLink to="/" label="Về trang chủ" />
      </div>
    </main>
  )
}
