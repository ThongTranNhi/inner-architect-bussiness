import { Link } from "../dieu-huong"
import { KenhLienHeChung, PageHero, ParentLink } from "./chung"

/** Câu hỏi thường gặp, chỉ dùng thông tin đã có trên site hoặc đã chốt. */
export const danhSachCauHoiThuongGap: [string, string][] = [
  [
    "Làm sao để đặt trải nghiệm trà, phiên Tarot hoặc workshop?",
    "Mọi nhu cầu đều được tiếp nhận qua một kênh Zalo / Facebook chung trên trang Liên hệ. Website không có hệ thống đặt lịch; đội ngũ sẽ phản hồi và xác nhận trực tiếp với bạn.",
  ],
  [
    "Trải nghiệm trà đạo có cần hẹn trước không?",
    "Có. Trà đạo tại INNER ARCHITECT™ diễn ra theo lịch hẹn và có người hướng dẫn.",
  ],
  [
    "Tarot có hình thức online không?",
    "Có. Tarot được thực hiện cả online và trực tiếp. Hãy nêu hình thức bạn muốn khi nhắn qua kênh liên hệ.",
  ],
  [
    "Tarot ở đây có tiên đoán tương lai không?",
    "Không. Tarot được dùng như một bề mặt biểu tượng để quan sát điều đang hiện diện — không tiên đoán, không chẩn đoán và không quyết định thay bạn.",
  ],
  [
    "Các chương trình có thay thế trị liệu tâm lý hoặc y khoa không?",
    "Không. Các hoạt động mang tính giáo dục, trải nghiệm và phát triển cá nhân; không chẩn đoán, không kê đơn và không thay thế can thiệp y khoa, tâm thần học hoặc tâm lý lâm sàng.",
  ],
  [
    "Chi phí và lịch cụ thể xem ở đâu?",
    "Thông tin được nêu trên trang chi tiết của từng chương trình khi đã xác nhận. Lịch và chi phí mới nhất sẽ được đội ngũ xác nhận khi bạn nhắn.",
  ],
  [
    "Website có lưu thông tin cá nhân của tôi không?",
    "Không. Website không có biểu mẫu thu thập thông tin. Nội dung bạn gửi qua Zalo / Facebook thuộc phạm vi của nền tảng đó.",
  ],
]

/**
 * Trang Câu hỏi thường gặp; dùng `<details>` gốc để mở/đóng bằng bàn phím.
 *
 * @returns Trang FAQ
 */
export function FaqPage() {
  return (
    <main className="cream-page faq-page">
      <PageHero
        eyebrow="FAQ · CÂU HỎI THƯỜNG GẶP"
        title="Trước khi"
        italic="bạn nhắn cho chúng tôi."
        intro="Những điều thường được hỏi về cách liên hệ, hình thức tham gia và giới hạn hỗ trợ của INNER ARCHITECT™."
      />
      <section className="faq-list section-pad">
        {danhSachCauHoiThuongGap.map(([cauHoi, traLoi]) => (
          <details key={cauHoi}>
            <summary className="serif">{cauHoi}</summary>
            <p>{traLoi}</p>
          </details>
        ))}
      </section>
      <section className="simple-content section-pad">
        <div>
          <h2 className="serif">Vẫn còn câu hỏi?</h2>
        </div>
        <div>
          <KenhLienHeChung />
          <Link to="/lien-he" className="underlink">
            Xem trang liên hệ →
          </Link>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
