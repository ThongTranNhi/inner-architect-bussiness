import { Link } from "../dieu-huong"
import { PageHero } from "./chung"

/**
 * Trang 404 cho đường dẫn, bài viết hoặc chương trình không tồn tại.
 *
 * @returns Trang không tìm thấy
 */
export function NotFoundPage() {
  return (
    <main className="cream-page not-found-page">
      <PageHero
        eyebrow="404 · KHÔNG TÌM THẤY TRANG"
        title="Trang này"
        italic="không còn ở đây."
        intro="Đường dẫn có thể đã thay đổi hoặc chưa từng tồn tại. Bạn có thể quay về trang chủ, đọc Journal hoặc liên hệ trực tiếp với chúng tôi."
      />
      <section className="simple-content section-pad">
        <div>
          <Link to="/" className="button-link">
            Về trang chủ
          </Link>
        </div>
        <div>
          <Link to="/journal" className="underlink">
            Đọc Journal →
          </Link>
          <br />
          <Link to="/lien-he" className="underlink">
            Liên hệ →
          </Link>
        </div>
      </section>
    </main>
  )
}
