import { EMAIL_LIEN_HE, PageHero, ParentLink } from "./chung"

/**
 * Trang pháp lý dạng văn bản ngắn (Chính sách bảo mật, Phạm vi hỗ trợ).
 * Nội dung đang là bản nháp mô tả đúng hành vi hiện tại của website và cần
 * chủ thương hiệu / tư vấn pháp lý duyệt trước khi phát hành.
 *
 * @param props.loai - Loại trang pháp lý cần hiển thị
 * @returns Trang pháp lý
 */
export function LegalPage({ loai }: { loai: "bao-mat" | "pham-vi" }) {
  const noiDung =
    loai === "bao-mat"
      ? {
          eyebrow: "CHÍNH SÁCH BẢO MẬT",
          title: "Chính sách",
          italic: "bảo mật.",
          intro:
            "Mô tả cách website INNER ARCHITECT™ xử lý thông tin của người truy cập.",
          muc: [
            [
              "Thông tin website thu thập",
              "Website không có biểu mẫu, tài khoản, giỏ hàng hay hệ thống đặt lịch, và không yêu cầu bạn nhập thông tin cá nhân hoặc thông tin sức khỏe.",
            ],
            [
              "Kênh liên hệ bên thứ ba",
              "Khi bấm liên hệ, bạn được chuyển sang Zalo hoặc Facebook. Nội dung bạn gửi ở đó được xử lý theo chính sách của nền tảng tương ứng và được đội ngũ INNER ARCHITECT™ dùng để phản hồi yêu cầu của bạn.",
            ],
            [
              "Đo lường truy cập",
              "Hiện website chưa bật công cụ phân tích truy cập. Nếu bổ sung trong tương lai, chính sách này sẽ được cập nhật trước khi áp dụng.",
            ],
            [
              "Liên hệ về quyền riêng tư",
              `Gửi câu hỏi về quyền riêng tư tới ${EMAIL_LIEN_HE}.`,
            ],
          ],
        }
      : {
          eyebrow: "TUYÊN BỐ PHẠM VI HỖ TRỢ",
          title: "Phạm vi",
          italic: "hỗ trợ.",
          intro:
            "Các nguyên tắc giới hạn áp dụng cho mọi hoạt động trong hệ sinh thái INNER ARCHITECT™.",
          muc: [
            [
              "Không thay thế chuyên môn y tế",
              "Hệ thống không chẩn đoán, không kê đơn và không thay thế can thiệp y khoa, tâm thần học hoặc tâm lý lâm sàng.",
            ],
            [
              "Không tiên đoán, không quyết định thay",
              "Tarot là bề mặt biểu tượng để quan sát điều đang hiện diện. Quyền lựa chọn và trách nhiệm luôn thuộc về chính bạn.",
            ],
            [
              "Không hứa hẹn tuyệt đối, không tạo phụ thuộc",
              "Phát triển bản thân là tiến trình thực hành trong đời sống thật. Mục tiêu là phục hồi khả năng tự điều chỉnh và tự dẫn dắt.",
            ],
            [
              "Khi vượt ngoài phạm vi an toàn",
              "Người điều phối sẽ dừng phiên và hướng dẫn chuyển gửi tới hỗ trợ phù hợp. Trong tình huống khẩn cấp, hãy gọi 115 hoặc đến cơ sở y tế gần nhất.",
            ],
          ],
        }
  return (
    <main className="cream-page legal-page">
      <PageHero
        eyebrow={noiDung.eyebrow}
        title={noiDung.title}
        italic={noiDung.italic}
        intro={noiDung.intro}
      />
      <section className="faq-list section-pad">
        {noiDung.muc.map(([tieuDe, doan]) => (
          <article key={tieuDe}>
            <h2 className="serif">{tieuDe}</h2>
            <p>{doan}</p>
          </article>
        ))}
        <p className="legal-status">
          Bản nháp — chờ chủ thương hiệu duyệt trước khi phát hành.
        </p>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
