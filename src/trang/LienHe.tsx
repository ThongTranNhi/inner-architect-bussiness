import { KenhLienHeChung, PageHero, ParentLink } from "./chung"

/** Sáu nhánh nhu cầu khách có thể nhắn qua kênh liên hệ chung. */
export const danhSachNhuCauLienHe = [
  "Trải nghiệm trà đạo có hướng dẫn (theo lịch hẹn)",
  "Phiên Tarot online hoặc trực tiếp",
  "Đồng hành 1:1",
  "Workshop",
  "Academy và các khóa học",
  "Sản phẩm LARA",
]

/**
 * Trang Liên hệ — thay cho form đặt lịch 8 bước trước đây (ngoài phạm vi MVP).
 * Không thu thập dữ liệu; khách tự gửi nhu cầu qua kênh chung.
 *
 * @returns Trang liên hệ
 */
export function ContactPage() {
  return (
    <main className="cream-page contact-page">
      <PageHero
        eyebrow="LIÊN HỆ · INNER ARCHITECT™"
        title="Một kênh liên hệ"
        italic="cho mọi nhu cầu."
        intro="Trà đạo có hướng dẫn, Tarot, đồng hành 1:1, workshop, Academy và sản phẩm đều được tiếp nhận qua cùng một kênh Zalo / Facebook. Bạn tự gửi nhu cầu; đội ngũ phản hồi và xác nhận ngoài website."
      />
      <section className="simple-content section-pad">
        <div>
          <p className="eyebrow">KÊNH LIÊN HỆ CHUNG</p>
          <h2 className="serif">Nhắn trực tiếp cho INNER ARCHITECT™.</h2>
        </div>
        <div>
          <KenhLienHeChung />
          <p>
            Zalo và Facebook là nền tảng bên thứ ba với chính sách riêng. Website
            không tự gửi tin nhắn thay bạn và không lưu nội dung bạn trao đổi ở
            đó.
          </p>
        </div>
      </section>
      <section className="simple-content section-pad">
        <div>
          <p className="eyebrow">BẠN CÓ THỂ NHẮN VỀ</p>
          <h2 className="serif">Ghi rõ nhu cầu để được phản hồi đúng người.</h2>
        </div>
        <div>
          <ul className="program-bullet-list">
            {danhSachNhuCauLienHe.map((nhuCau) => (
              <li key={nhuCau}>{nhuCau}</li>
            ))}
          </ul>
          <p>
            Thời lượng, lịch và chi phí của từng chương trình sẽ được xác nhận
            trực tiếp khi bạn nhắn.
          </p>
        </div>
      </section>
      <section className="simple-content section-pad">
        <div>
          <p className="eyebrow">ĐỊA CHỈ</p>
          <h2 className="serif">The Hermit</h2>
        </div>
        <div>
          <p>
            637/13/8 Quang Trung, Phường Thông Tây Hội
            <br />
            TP. Hồ Chí Minh
          </p>
          <p>Giờ mở cửa và chỉ đường sẽ được cập nhật sau khi xác nhận.</p>
          <aside className="program-boundary-aside">
            <strong>KHÔNG DÀNH CHO TÌNH HUỐNG KHẨN CẤP</strong>
            <p>
              Nếu bạn hoặc người khác đang gặp nguy hiểm, hãy gọi 115 hoặc đến
              cơ sở y tế gần nhất. INNER ARCHITECT™ không phải dịch vụ cấp cứu
              và không thay thế hỗ trợ tâm lý, tâm thần hoặc y khoa.
            </p>
          </aside>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
