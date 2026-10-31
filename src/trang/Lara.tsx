import { Link } from "../dieu-huong"
import { IMG } from "../du-lieu/hinh-anh"
import { PageHero, ParentLink } from "./chung"

export function LaraPage() {
  const products = [
    [
      IMG.soulCleanse,
      "Soul Cleanse",
      "Hương bạch đàn, bạc hà và cây xô thơm, phù hợp với những khoảng thời gian cần cảm giác thanh thoát và tập trung hơn.",
    ],
    [
      IMG.sacredGround,
      "Sacred Ground",
      "Hương gỗ Palo Santo, khói và xạ hương, tạo nên một bầu không khí trầm, ấm cho thời gian đọc, viết hoặc chiêm nghiệm.",
    ],
    [
      IMG.soulEmbrace,
      "Soul Embrace",
      "Hương rosewood, lavender và xô thơm, hướng đến cảm giác dịu và ấm trong không gian nghỉ ngơi.",
    ],
  ]
  return (
    <main>
      <PageHero
        eyebrow="LARA · INNER ARCHITECT™ ECOSYSTEM"
        title="LARA"
        italic="Hương thơm cho những khoảng nghỉ và nghi thức cá nhân."
        intro="LARA là nhánh sản phẩm hương thơm do Võ Khiêm phát triển, kết nối mùi hương, vật liệu và những khoảng thời gian dành cho chính mình."
      />
      <section className="lara-story section-pad">
        <img
          src={IMG.lara}
          alt="Bộ sưu tập sản phẩm hương thơm LARA"
          loading="lazy"
          decoding="async"
        />
        <div>
          <h2 className="serif">
            Một trải nghiệm cảm quan, không phải tuyên bố điều trị.
          </h2>
          <p>
            Mỗi sản phẩm được giới thiệu như một trải nghiệm về hương, không
            gian và nghi thức cá nhân. LARA không phải tầng chữa lành hoặc điều
            kiện tham gia INNER ARCHITECT™.
          </p>
        </div>
      </section>
      <section className="lara-products section-pad">
        {products.map((p) => (
          <article key={p[1]}>
            <img
              src={p[0]}
              alt={`Graphic sản phẩm LARA ${p[1]} với chữ đóng cứng`}
              loading="lazy"
              decoding="async"
            />
            <h2 className="serif">{p[1]}</h2>
            <p>{p[2]}</p>
          </article>
        ))}
      </section>
      <section className="simple-content section-pad">
        <div>
          <h2 className="serif">Sử dụng an toàn</h2>
        </div>
        <div>
          <p>
            Đặt nến trên bề mặt phẳng, cách vật dễ cháy và luồng gió mạnh. Không
            để nến cháy khi không có người quan sát. Dừng sử dụng nếu mùi hương
            gây khó chịu.
          </p>
          <p>
            Tình trạng hàng, giá và địa điểm mua chỉ được công bố sau khi xác
            nhận.
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
