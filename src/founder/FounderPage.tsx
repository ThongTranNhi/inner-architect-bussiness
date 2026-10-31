import { useRef } from "react"
import { Link } from "../dieu-huong"
import {
  layThuocTinhHieuUng as hieuUng,
  useHieuUngCuon,
  type KieuHieuUng,
} from "./hieu-ung"
import {
  anhFounder,
  duAnFounder,
  gioiThieuFounder,
  hanhTrinhFounder,
  heroFounder,
  hocVanFounder,
  ketTrangFounder,
  soLieuDaXacNhan,
  soLieuFounder,
  tamNhinFounder,
  trietLyFounder,
  type AnhFounder,
  type DuAnFounder,
} from "./noi-dung-founder"
import { giuTuGhep as g, tachCum } from "./ngat-dong"
import "./founder.css"

/**
 * Khung ảnh có tỉ lệ cố định. Khi `anh.src` là `null`, hiển thị placeholder
 * trung tính ghi rõ mục đích ảnh, để layout không vỡ và người thay ảnh biết
 * cần chuẩn bị gì. Không bao giờ thay bằng ảnh của người khác.
 *
 * @param props.anh - Dữ liệu ảnh từ `anhFounder`
 * @param props.className - Class bổ sung cho `<figure>`
 * @param props.uuTien - `true` cho ảnh trong màn hình đầu (không lazy-load)
 * @param props.kieu - Kiểu hiệu ứng xuất hiện, mặc định `anh` (mờ → rõ, thu nhẹ tỉ lệ)
 * @param props.thuTu - Vị trí stagger trong nhóm
 * @returns `<figure>` chứa ảnh thật hoặc placeholder có `role="img"`
 */
function KhungAnh({
  anh,
  className = "",
  uuTien = false,
  kieu = "anh",
  thuTu = 0,
}: {
  anh: AnhFounder
  className?: string
  uuTien?: boolean
  kieu?: KieuHieuUng
  thuTu?: number
}) {
  return (
    <figure
      className={`fp-media ${className}`}
      {...hieuUng(kieu, thuTu, { aspectRatio: anh.tiLe })}
    >
      {anh.src ? (
        <img
          src={anh.src}
          alt={anh.alt}
          loading={uuTien ? "eager" : "lazy"}
          fetchPriority={uuTien ? "high" : "auto"}
          decoding="async"
        />
      ) : (
        <div className="fp-placeholder" role="img" aria-label={anh.alt}>
          <span>Ảnh chờ bổ sung</span>
          <small>{anh.mucDich}</small>
        </div>
      )}
    </figure>
  )
}

// Kiểu props đặt tên riêng: oxfmt 0.2.0 gộp kiểu inline ngắn thành một dòng rồi bỏ `;`.
type DanhSachCumProps = {
  chuoi: string
}

/**
 * Hiển thị chuỗi "A · B · C" thành từng cụm không bị cắt giữa chừng. Mỗi cụm
 * có dấu "·" phía trước; CSS cắt bỏ dấu rơi vào đầu dòng (xem founder.css).
 * Dấu chỉ để trang trí nên ẩn với trình đọc màn hình.
 *
 * @param props.chuoi - Chuỗi các cụm phân tách bởi " · "
 * @returns Các `<span class="fp-cum">` xen kẽ dấu phân cách
 */
function DanhSachCum({ chuoi }: DanhSachCumProps) {
  return (
    <span className="fp-cum-list">
      {tachCum(chuoi).map((cum) => (
        <span key={cum} className="fp-cum-wrap">
          <span className="fp-cum-sep" aria-hidden="true">
            ·
          </span>
          <span className="fp-cum">{cum}</span>
        </span>
      ))}
    </span>
  )
}

/** Section 01 — Hero: tên, vai trò và chân dung (40/60). */
function FounderHero() {
  return (
    <section className="fp-hero" aria-labelledby="fp-ten">
      <div className="fp-hero-copy">
        <p className="fp-eyebrow" lang="en" {...hieuUng("len", 0)}>
          {heroFounder.eyebrow}
        </p>
        <h1 id="fp-ten" className="serif" {...hieuUng("len", 1)}>
          {g(heroFounder.ten)}
        </h1>
        <p className="fp-hero-subtitle serif" {...hieuUng("len", 2)}>
          {g(heroFounder.phuDe)}
        </p>
        <p className="fp-hero-roles" {...hieuUng("len", 3)}>
          <DanhSachCum chuoi={heroFounder.vaiTro} />
        </p>
        <p className="fp-hero-tagline" {...hieuUng("len", 4)}>
          <DanhSachCum chuoi={heroFounder.tagline} />
        </p>
      </div>
      <KhungAnh
        anh={anhFounder.chanDungHero}
        className="fp-hero-media"
        uuTien
        thuTu={1}
      />
    </section>
  )
}

/** Section 02 — Giới thiệu con người và tư duy. */
function FounderGioiThieu() {
  return (
    <section className="fp-intro" aria-labelledby="fp-gioi-thieu">
      <p className="fp-eyebrow" lang="en" {...hieuUng("len", 0)}>
        {gioiThieuFounder.eyebrow}
      </p>
      <h2 id="fp-gioi-thieu" className="serif" {...hieuUng("len", 1)}>
        {g(gioiThieuFounder.tieuDe)}
      </h2>
      <p className="fp-lead serif" {...hieuUng("len", 2)}>
        {g(gioiThieuFounder.dan)}
      </p>
      {gioiThieuFounder.doan.map((doan, i) => (
        <p key={doan} {...hieuUng("len", i + 3)}>
          {doan}
        </p>
      ))}
      {soLieuDaXacNhan && <p>{gioiThieuFounder.doanSoLieu}</p>}
    </section>
  )
}

/** Section 03 — Hành trình cá nhân (ảnh + kể chuyện). */
function FounderHanhTrinh() {
  return (
    <section className="fp-journey" aria-labelledby="fp-hanh-trinh">
      <KhungAnh
        anh={anhFounder.hanhTrinh}
        className="fp-journey-media"
        kieu="trai"
      />
      <div className="fp-journey-copy">
        <p className="fp-eyebrow" lang="en" {...hieuUng("phai", 1)}>
          {hanhTrinhFounder.eyebrow}
        </p>
        <h2 id="fp-hanh-trinh" className="serif" {...hieuUng("phai", 2)}>
          {g(hanhTrinhFounder.tieuDe)}
        </h2>
        {hanhTrinhFounder.doan.map((doan, i) => (
          <p key={doan} {...hieuUng("phai", i + 3)}>
            {doan}
          </p>
        ))}
      </div>
    </section>
  )
}

/** Section 04 — Ba nền tảng học vấn. */
function FounderHocVan() {
  return (
    <section className="fp-education" aria-labelledby="fp-hoc-van">
      <header>
        <p className="fp-eyebrow" lang="en" {...hieuUng("len", 0)}>
          {hocVanFounder.eyebrow}
        </p>
        <h2 id="fp-hoc-van" className="serif" {...hieuUng("len", 1)}>
          {g(hocVanFounder.tieuDe)}
        </h2>
      </header>
      <ol className="fp-education-grid">
        {hocVanFounder.muc.map((muc, i) => (
          <li key={muc.so} {...hieuUng("len", i)}>
            <span className="fp-number serif" aria-hidden="true">
              {muc.so}
            </span>
            <h3 className="serif">{muc.linhVuc}</h3>
            <p>{muc.bang}</p>
            <p>{muc.truong}</p>
            <p className="fp-education-moc">{muc.moc}</p>
          </li>
        ))}
      </ol>
      <p className="fp-education-note" {...hieuUng("len", 0)}>
        {hocVanFounder.ketNoi}
      </p>
    </section>
  )
}

/** Section 05 — Triết lý, ba giá trị và góc nhìn tâm linh – khoa học (nền olive). */
function FounderTrietLy() {
  return (
    <section className="fp-philosophy" aria-labelledby="fp-triet-ly">
      <p className="fp-eyebrow" lang="en" {...hieuUng("mo", 0)}>
        {trietLyFounder.eyebrow}
      </p>
      <h2 id="fp-triet-ly" className="fp-visually-hidden">
        {trietLyFounder.tieuDe}
      </h2>
      <figure className="fp-quote" {...hieuUng("len", 1)}>
        <blockquote className="serif">
          “{g(trietLyFounder.trichDan)}”
        </blockquote>
        <figcaption>— {heroFounder.ten}</figcaption>
      </figure>
      <ul className="fp-values">
        {trietLyFounder.giaTri.map((giaTri, i) => (
          <li key={giaTri.ten} {...hieuUng("len", i)}>
            <h3 className="serif">
              {giaTri.tenViet}
              <span lang="en">{giaTri.ten}</span>
            </h3>
            <p>{giaTri.moTa}</p>
          </li>
        ))}
      </ul>
      <div className="fp-philosophy-body">
        <p {...hieuUng("len", 0)}>{trietLyFounder.doanTrietLy}</p>
        <div {...hieuUng("len", 1)}>
          <h3 className="serif">{g(trietLyFounder.tieuDeTamLinh)}</h3>
          {trietLyFounder.doanTamLinh.map((doan) => (
            <p key={doan}>{doan}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

// Kiểu props đặt tên riêng: oxfmt 0.2.0 gộp kiểu inline ngắn thành một dòng rồi bỏ `;`.
type TheDuAnProps = {
  duAn: DuAnFounder
  thuTu: number
}

/**
 * Một mục dự án trong lưới Selected Works.
 *
 * @param props.duAn - Dữ liệu dự án
 * @param props.thuTu - Vị trí stagger theo hàng (0 trái, 1 phải)
 * @returns `<article>` gồm ảnh, nội dung, ghi chú ranh giới và liên kết
 */
function TheDuAn({ duAn, thuTu }: TheDuAnProps) {
  const coSoLieu = duAn.ky === "C" && soLieuDaXacNhan
  return (
    <article
      className={`fp-work ${duAn.coLon ? "fp-work-large" : ""}`}
      {...hieuUng("len", thuTu)}
    >
      <KhungAnh anh={duAn.anh} kieu="mo" />
      <p className="fp-work-key">{duAn.ky}</p>
      <h3 className="serif">{g(duAn.tieuDe)}</h3>
      {duAn.doan.map((doan) => (
        <p key={doan}>{doan}</p>
      ))}
      {duAn.diem && (
        <ul className="fp-work-points">
          {duAn.diem.map((diem) => (
            <li key={diem}>{diem}</li>
          ))}
        </ul>
      )}
      {coSoLieu && (
        <dl className="fp-stats">
          {soLieuFounder.map((soLieu) => (
            <div key={soLieu.nhan}>
              <dt className="serif">{soLieu.giaTri}</dt>
              <dd>{soLieu.nhan}</dd>
            </div>
          ))}
        </dl>
      )}
      {duAn.ghiChu && <p className="fp-work-note">{duAn.ghiChu}</p>}
      {duAn.lienKet && (
        <Link to={duAn.lienKet.to} className="fp-link">
          {duAn.lienKet.nhan} →
        </Link>
      )}
    </article>
  )
}

/** Section 06 — Selected Works & Contributions. */
function FounderDuAn() {
  return (
    <section className="fp-works" aria-labelledby="fp-du-an">
      <header>
        <p className="fp-eyebrow" lang="en" {...hieuUng("len", 0)}>
          {duAnFounder.eyebrow}
        </p>
        <h2 id="fp-du-an" className="serif" {...hieuUng("len", 1)}>
          {g(duAnFounder.tieuDe)}
        </h2>
      </header>
      <div className="fp-works-grid">
        {duAnFounder.muc.map((duAn, i) => (
          <TheDuAn key={duAn.ky} duAn={duAn} thuTu={i % 2} />
        ))}
      </div>
    </section>
  )
}

/** Section 07 — Tầm nhìn và thông điệp cá nhân. */
function FounderTamNhin() {
  return (
    <section className="fp-vision" aria-labelledby="fp-tam-nhin">
      <KhungAnh anh={anhFounder.ketThuc} className="fp-vision-media" />
      <div className="fp-vision-grid">
        <div {...hieuUng("len", 0)}>
          <p className="fp-eyebrow" lang="en">
            {tamNhinFounder.eyebrow}
          </p>
          <h2 id="fp-tam-nhin" className="serif">
            {g(tamNhinFounder.tieuDe)}
          </h2>
        </div>
        <div>
          <figure className="fp-quote fp-quote-dark" {...hieuUng("len", 2)}>
            <blockquote className="serif">
              “{g(tamNhinFounder.trichDan)}”
            </blockquote>
            <figcaption>— {heroFounder.ten}</figcaption>
          </figure>
          <p {...hieuUng("len", 3)}>{tamNhinFounder.doan}</p>
          <ul className="fp-pillars" {...hieuUng("len", 4)}>
            {tamNhinFounder.truCot.map((truCot) => (
              <li key={truCot}>{truCot}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Section 08 — Lời mời kết trang, chỉ dùng route có sẵn. */
function FounderKetTrang() {
  return (
    <section className="fp-closing" aria-labelledby="fp-ket-trang">
      <p className="fp-eyebrow" lang="en" {...hieuUng("len", 0)}>
        {ketTrangFounder.eyebrow}
      </p>
      <h2 id="fp-ket-trang" className="serif" {...hieuUng("len", 1)}>
        {g(ketTrangFounder.tieuDe)}
      </h2>
      <p {...hieuUng("len", 2)}>{g(ketTrangFounder.moTa)}</p>
      <div className="fp-closing-actions" {...hieuUng("len", 3)}>
        <Link to={ketTrangFounder.ctaChinh.to} className="button-link">
          {ketTrangFounder.ctaChinh.nhan}
        </Link>
        <Link to={ketTrangFounder.ctaPhu.to} className="fp-link">
          {ketTrangFounder.ctaPhu.nhan} →
        </Link>
      </div>
    </section>
  )
}

/**
 * Trang giới thiệu nhà sáng lập Võ Khiêm (`/vo-khiem`), gồm 8 section theo
 * portfolio cá nhân. Dữ liệu nằm ở `noi-dung-founder.ts`; hiệu ứng cuộn ở
 * `hieu-ung.ts` (một IntersectionObserver dùng chung cho cả trang).
 *
 * @returns Phần tử `<main>` của trang Founder
 */
export function FounderPage() {
  const trangRef = useRef<HTMLElement>(null)
  useHieuUngCuon(trangRef, { hienNgay: ".fp-hero [data-reveal]" })
  return (
    <main ref={trangRef} className="cream-page founder-page">
      <FounderHero />
      <FounderGioiThieu />
      <FounderHanhTrinh />
      <FounderHocVan />
      <FounderTrietLy />
      <FounderDuAn />
      <FounderTamNhin />
      <FounderKetTrang />
      <div className="parent-link">
        <Link to="/">← Về trang chủ</Link>
      </div>
    </main>
  )
}
