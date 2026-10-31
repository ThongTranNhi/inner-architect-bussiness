import { Link } from "../dieu-huong"
import { danhSachChiTietChuongTrinh } from "../du-lieu/chuong-trinh"
import { PageHero, ParentLink } from "./chung"

/**
 * Chuyển đổi tên chương trình hiển thị sang mã định danh (slug) trên URL.
 *
 * @param tenChuongTrinh - Tên tiếng Việt của chương trình
 * @returns Mã slug tương ứng
 */
export function laySlugChuongTrinh(tenChuongTrinh: string): string {
  switch (tenChuongTrinh) {
    case "Chạm ngõ Tarot":
      return "cham-ngo-tarot"
    case "Workshop nhận diện mô thức":
      return "nhan-dien-mo-thuc"
    case "Chạm — Vẽ để dịu lại":
      return "cham-ve-de-diu-lai"
    case "Trải nghiệm nhóm nhỏ":
      return "trai-nghiem-nhom-nho"
    case "Phiên tiếp cận ban đầu":
      return "phien-tiep-can-ban-dau"
    case "Phiên tái cấu trúc chuyên sâu":
      return "phien-tai-cau-truc-chuyen-sau"
    case "Đồng hành trong giai đoạn chuyển pha":
      return "dong-hanh-chuyen-pha"
    case "Tarot Căn Bản":
      return "tarot-can-ban"
    case "Tarot Nâng Cao":
      return "tarot-nang-cao"
    case "Tarot Healer":
      return "tarot-healer"
    case "Khóa tâm lý chuyên đề":
      return "tam-ly-chuyen-de"
    default:
      return "cham-ngo-tarot"
  }
}

export function ProgramDetail({ slug }: { slug: string }) {
  const p =
    danhSachChiTietChuongTrinh[slug] ||
    danhSachChiTietChuongTrinh["cham-ngo-tarot"]

  return (
    <main className="cream-page program-detail-page">
      <PageHero
        eyebrow={`${p.nhom} · ${p.tang}`}
        title={p.tieuDe}
        italic={p.phuDe}
        intro={p.doanDan}
      />
      <section className="detail-lead section-pad">
        <div className="detail-media">
          <img src={p.hinhAnh} alt={p.tieuDe} loading="lazy" decoding="async" />
        </div>
        <div className="detail-info">
          <div className="program-specs">
            <div className="spec-item">
              <span className="spec-label">THỜI LƯỢNG</span>
              <strong className="spec-value">{p.thoiLuong}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">HÌNH THỨC</span>
              <strong className="spec-value">{p.hinhThuc}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">QUY MÔ</span>
              <strong className="spec-value">{p.quyMo}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">CHI PHÍ / HỌC PHÍ</span>
              <strong className="spec-value">{p.chiPhi}</strong>
            </div>
          </div>

          <div className="program-section-block">
            <h2 className="serif">Mục tiêu cốt lõi</h2>
            <ul className="program-bullet-list">
              {p.mucTieu.map((mt, i) => (
                <li key={i}>{mt}</li>
              ))}
            </ul>
          </div>

          <div className="program-section-block">
            <h2 className="serif">Nội dung & Hoạt động chính</h2>
            <div className="curriculum-steps">
              {p.hoatDong.map((hd, i) => (
                <div key={i} className="curriculum-step-item">
                  <span className="step-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>{hd}</p>
                </div>
              ))}
            </div>
          </div>

          {p.chamNgon && (
            <blockquote className="program-quote serif">
              “{p.chamNgon}”
            </blockquote>
          )}

          <aside className="program-boundary-aside">
            <strong>RANH GIỚI & ĐẠO ĐỨC HỆ THỐNG</strong>
            <p>{p.ranhGioi}</p>
          </aside>

          <div className="program-actions">
            <Link to="/lien-he" className="button-link">
              {p.nutHanhDong} →
            </Link>
            <Link to="/chuong-trinh" className="underlink">
              ← Tất cả chương trình
            </Link>
          </div>
        </div>
      </section>
      <ParentLink to="/chuong-trinh" label="Tất cả chương trình" />
    </main>
  )
}

export function Programmes({ detail }: { detail?: string }) {
  if (detail) {
    return <ProgramDetail slug={detail} />
  }

  const families: [string, string[]][] = [
    [
      "A. TRẢI NGHIỆM",
      [
        "Chạm ngõ Tarot",
        "Workshop nhận diện mô thức",
        "Chạm — Vẽ để dịu lại",
        "Trải nghiệm nhóm nhỏ",
      ],
    ],
    [
      "B. ĐỒNG HÀNH CÁ NHÂN",
      [
        "Phiên tiếp cận ban đầu",
        "Phiên tái cấu trúc chuyên sâu",
        "Đồng hành trong giai đoạn chuyển pha",
      ],
    ],
    [
      "C. ACADEMY",
      [
        "Tarot Căn Bản",
        "Tarot Nâng Cao",
        "Tarot Healer",
        "Khóa tâm lý chuyên đề",
      ],
    ],
  ]
  return (
    <main>
      <PageHero
        eyebrow="PROGRAMME ECOSYSTEM"
        title="Mỗi người cần"
        italic="một điểm bắt đầu khác nhau."
        intro="Các chương trình được thiết kế theo mức độ sẵn sàng, mục tiêu và phạm vi hỗ trợ. Không phải mọi trải nghiệm đều dẫn đến một tiến trình dài hơn."
      />
      <section className="programme-families">
        {families.map((family, fi) => (
          <article key={family[0]}>
            <div>
              <p className="eyebrow">{family[0]}</p>
              <p>
                {fi === 0
                  ? "Những điểm chạm nhẹ để quan sát và trải nghiệm."
                  : fi === 1
                    ? "Một tiến trình riêng tư, có nhịp độ và điểm kết rõ ràng."
                    : "Nền tảng học thuật và thực hành có giám sát."}
              </p>
            </div>
            <div>
              {family[1].map((name, i) => (
                <Link
                  key={name}
                  to={`/chuong-trinh/${laySlugChuongTrinh(name)}`}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="serif">{name}</h2>
                  <b>→</b>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
      <section className="programme-boundary section-pad">
        <p className="serif">
          Các chương trình mang tính giáo dục, trải nghiệm và phát triển cá
          nhân.
        </p>
        <p>
          Chúng không cấp quyền hành nghề khám, chữa bệnh hoặc trị liệu tâm lý.
        </p>
        <Link to="/lien-he" className="button-link">
          Liên hệ về chương trình
        </Link>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}
