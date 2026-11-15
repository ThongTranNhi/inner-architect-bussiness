import { Link } from "../dieu-huong"
import { kichThuocAnh } from "./loc-journal"
import { HienThiNoiDung } from "./noi-dung/HienThiNoiDung"
import { coNoiDung, type NodeNoiDung } from "./noi-dung/quy-tac"

/** Dữ liệu cần để hiển thị một bài (bản công khai hoặc bản xem trước). */
export type DuLieuHienThiBai = {
  tieuDe: string
  doanGioiThieu: string
  nhanChuyenMuc: string
  ngay: string
  anhBia: string | null
  moTaAnhBia: string
  anhRong?: number | null
  anhCao?: number | null
  noiDung: NodeNoiDung | null
}

/**
 * Bố cục bài Journal: đầu bài, ảnh bìa, nội dung, ranh giới chuyên môn và tác giả.
 * Dùng chung cho trang công khai `/journal/<slug>` và bản xem trước trong trang quản trị
 * để hai nơi hiển thị giống hệt nhau.
 *
 * @param props.bai - Dữ liệu bài
 * @returns Phần tử `<article>`
 */
export function BaiJournalHienThi({ bai }: { bai: DuLieuHienThiBai }) {
  return (
    <article>
      <header className="article-head">
        <div className="breadcrumbs">
          <Link to="/journal">Journal</Link>
          {bai.nhanChuyenMuc && <> / {bai.nhanChuyenMuc}</>}
        </div>
        <p className="eyebrow">
          {[bai.nhanChuyenMuc, bai.ngay].filter(Boolean).join(" · ")}
        </p>
        <h1 className="serif">{bai.tieuDe}</h1>
        {bai.doanGioiThieu && <p className="dek">{bai.doanGioiThieu}</p>}
      </header>
      {bai.anhBia && (
        <img
          className="lead-image"
          src={bai.anhBia}
          alt={bai.moTaAnhBia}
          fetchPriority="high"
          {...kichThuocAnh(bai.anhBia, bai.anhRong, bai.anhCao)}
        />
      )}
      <div className="article-body">
        {coNoiDung(bai.noiDung) ? (
          <HienThiNoiDung noiDung={bai.noiDung} />
        ) : (
          bai.doanGioiThieu && (
            <div className="jr-noi-dung">
              <p>{bai.doanGioiThieu}</p>
            </div>
          )
        )}
        <aside>
          <strong>RANH GIỚI CHUYÊN MÔN</strong>
          <br />
          Tarot và các hoạt động tại INNER ARCHITECT™ không thay thế hỗ trợ y tế, tâm thần hoặc tâm lý lâm sàng. Khi một
          tình trạng vượt ngoài phạm vi an toàn, người đọc cần tìm đến các cơ sở y tế và chuyên gia có chứng chỉ phù hợp.
        </aside>
      </div>
      <footer className="author-block">
        <p className="eyebrow">TÁC GIẢ</p>
        <h2 className="serif">Khiêm Võ — Founder, INNER ARCHITECT™ System</h2>
        <p>
          Khiêm Võ viết về Tarot phản tư, tự nhận thức, tư duy phản biện và
          ranh giới trong các hoạt động phát triển bản thân.
        </p>
        <Link to="/vo-khiem" className="underlink">
          Xem hồ sơ tác giả →
        </Link>
      </footer>
    </article>
  )
}
