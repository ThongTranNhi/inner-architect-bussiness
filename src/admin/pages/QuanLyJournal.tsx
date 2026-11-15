import { useCallback, useEffect, useId, useState } from "react"
import { Link, thayDuongDan } from "../../dieu-huong"
import { DanhSachSapXep } from "../components/journal/DanhSachSapXep"
import { ThuVienAnh } from "../components/journal/ThuVienAnh"
import { dinhDangThoiGian } from "../dinh-dang"
import { GOC_QUAN_TRI } from "../duong-dan-quan-tri"
import { usePhienQuanTri } from "../hooks/usePhienQuanTri"
import {
  chuyenChuyenMuc,
  datQuyenJournal,
  datTieuBieu,
  layChuyenMuc,
  layDanhSachBai,
  layNhanVien,
  sapXepBai,
  sapXepChuyenMuc,
  suaChuyenMuc,
  taoChuyenMuc,
  xoaBai,
  xoaChuyenMuc,
  type BaiTomTat,
  type ChuyenMucQuanTri,
  type DuLieuChuyenMuc,
  type LocTrangThai,
  type NhanVienJournal,
} from "../services/api-journal"
import { LoiApi } from "../services/api-quan-tri"

type Tab = "bai" | "chuyen-muc" | "quyen"

const NHAN_TAB: Record<Tab, string> = { bai: "Bài viết", "chuyen-muc": "Chuyên mục", quyen: "Phân quyền" }

/** Thông điệp lỗi dễ hiểu từ lỗi API. */
const thongDiepLoi = (e: unknown, macDinh: string) => (e instanceof LoiApi ? e.message : macDinh)

/**
 * Nhãn trạng thái xuất bản của bài.
 *
 * @param bai - Bài tóm tắt
 * @returns Phần tử nhãn
 */
function NhanTrangThai({ bai }: { bai: BaiTomTat }) {
  if (bai.status === "draft")
    return <span className="border border-[var(--line)] px-2 py-0.5 text-[11px] tracking-[.06em] uppercase">Bản nháp</span>
  return (
    <span className="inline-flex flex-wrap gap-1">
      <span className="bg-[var(--olive)] px-2 py-0.5 text-[11px] tracking-[.06em] text-[var(--cream)]! uppercase">Đã xuất bản</span>
      {bai.hasDraftChanges && (
        <span className="border border-[var(--earth)] px-2 py-0.5 text-[11px] tracking-[.06em] text-[#8a5a2c] uppercase">
          Có nháp chưa cập nhật
        </span>
      )}
    </span>
  )
}

/**
 * Trang quản lý Journal `/jathong/journal`: bài viết, chuyên mục và (admin) phân quyền.
 *
 * @returns Nội dung trang
 */
export function QuanLyJournal() {
  const { quanTriVien } = usePhienQuanTri()
  const laAdmin = quanTriVien?.role === "admin"
  const tabTuUrl = new URLSearchParams(window.location.search).get("tab")
  const [tab, setTab] = useState<Tab>(tabTuUrl === "chuyen-muc" || (tabTuUrl === "quyen" && laAdmin) ? tabTuUrl : "bai")
  const [chuyenMuc, setChuyenMuc] = useState<ChuyenMucQuanTri[]>([])
  const [loi, setLoi] = useState("")
  // Chuyên mục lọc sẵn khi mở tab bài (từ URL ?chuyenMuc= hoặc nút "Xem bài" ở tab chuyên mục).
  const [mucLoc, setMucLoc] = useState<number | "">(() => Number(new URLSearchParams(window.location.search).get("chuyenMuc")) || "")

  const taiChuyenMuc = useCallback(async () => {
    try {
      setChuyenMuc(await layChuyenMuc())
    } catch (e) {
      setLoi(thongDiepLoi(e, "Không tải được chuyên mục."))
    }
  }, [])
  useEffect(() => {
    void taiChuyenMuc()
  }, [taiChuyenMuc])

  const chonTab = (moi: Tab) => {
    setTab(moi)
    thayDuongDan(`${GOC_QUAN_TRI}/journal${moi === "bai" ? "" : `?tab=${moi}`}`)
  }
  const cacTab: Tab[] = laAdmin ? ["bai", "chuyen-muc", "quyen"] : ["bai", "chuyen-muc"]

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] tracking-[.12em] uppercase opacity-70">Journal</p>
          <h1 className="serif text-[34px] leading-tight sm:text-[42px]">Quản lý Journal</h1>
        </div>
        <a href="/journal" target="_blank" rel="noopener" className="text-[13px] underline">
          Xem trang /journal ↗
        </a>
      </div>

      <div role="tablist" aria-label="Mục quản lý Journal" className="flex flex-wrap gap-1 border-b border-[var(--line)]">
        {cacTab.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => chonTab(t)}
            className={`-mb-px min-h-[44px] border-b-2 px-4 text-[14px] ${tab === t ? "border-[var(--ink)] font-semibold" : "border-transparent opacity-75 hover:opacity-100"}`}
          >
            {NHAN_TAB[t]}
          </button>
        ))}
      </div>

      {loi && (
        <p role="alert" className="border-l-2 border-[#9b3b25] bg-[#9b3b25]/5 px-3 py-2 text-[14px] text-[#9b3b25]!">
          {loi}
        </p>
      )}

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "bai" && <TabBaiViet key={mucLoc} chuyenMuc={chuyenMuc} mucBanDau={mucLoc} />}
        {tab === "chuyen-muc" && (
          <TabChuyenMuc
            chuyenMuc={chuyenMuc}
            setChuyenMuc={setChuyenMuc}
            taiLai={taiChuyenMuc}
            onXemBai={(id) => {
              setMucLoc(id)
              chonTab("bai")
            }}
          />
        )}
        {tab === "quyen" && laAdmin && <TabPhanQuyen />}
      </div>
    </div>
  )
}

/**
 * Tab bài viết: lọc theo chuyên mục / trạng thái, sắp xếp trong chuyên mục, chuyển mục, tiêu biểu.
 *
 * @param props.chuyenMuc - Danh sách chuyên mục
 * @param props.mucBanDau - Chuyên mục lọc sẵn
 * @returns Nội dung tab
 */
function TabBaiViet({ chuyenMuc, mucBanDau }: { chuyenMuc: ChuyenMucQuanTri[]; mucBanDau: number | "" }) {
  const [maMuc, setMaMuc] = useState<number | "">(mucBanDau)
  const [trangThai, setTrangThai] = useState<LocTrangThai>("")
  const [danhSach, setDanhSach] = useState<BaiTomTat[]>([])
  const [dangTai, setDangTai] = useState(true)
  const [loi, setLoi] = useState("")
  const [thongBao, setThongBao] = useState("")

  const taiLai = useCallback(async () => {
    setDangTai(true)
    try {
      setDanhSach(await layDanhSachBai({ categoryId: maMuc || undefined, status: trangThai }))
      setLoi("")
    } catch (e) {
      setLoi(thongDiepLoi(e, "Không tải được danh sách bài."))
    } finally {
      setDangTai(false)
    }
  }, [maMuc, trangThai])
  useEffect(() => {
    void taiLai()
  }, [taiLai])

  const sapXepDuoc = maMuc !== "" && trangThai === ""
  const tenMuc = (id: number) => chuyenMuc.find((m) => m.id === id)?.name ?? "—"

  /** Chạy một thao tác trên dòng rồi tải lại danh sách. */
  const thaoTac = async (viec: () => Promise<unknown>, thanhCong: string) => {
    setLoi("")
    setThongBao("")
    try {
      await viec()
      setThongBao(thanhCong)
    } catch (e) {
      setLoi(thongDiepLoi(e, "Thao tác không thành công."))
    }
    await taiLai()
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-[13px]">
          <span>Chuyên mục</span>
          <select
            value={maMuc}
            onChange={(e) => setMaMuc(e.target.value ? Number(e.target.value) : "")}
            className="min-h-[44px] min-w-[220px] border border-[var(--line)] bg-white px-3"
          >
            <option value="">Tất cả chuyên mục</option>
            {chuyenMuc.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-[13px]">
          <span>Trạng thái</span>
          <select
            value={trangThai}
            onChange={(e) => setTrangThai(e.target.value as LocTrangThai)}
            className="min-h-[44px] min-w-[200px] border border-[var(--line)] bg-white px-3"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="published">Đã xuất bản</option>
            <option value="changed">Có nháp chưa cập nhật</option>
          </select>
        </label>
        <Link
          to={`${GOC_QUAN_TRI}/journal/bai/moi${maMuc ? `?chuyenMuc=${maMuc}` : ""}`}
          className="ml-auto inline-flex min-h-[44px] items-center bg-[var(--ink)] px-5 text-[13px] text-[var(--cream)]!"
        >
          + Viết bài mới
        </Link>
      </div>

      <p className="text-[13px] opacity-75">
        {sapXepDuoc
          ? "Kéo biểu tượng ⠿ hoặc dùng nút Lên / Xuống để đổi thứ tự bài trong chuyên mục. Thứ tự được lưu ngay."
          : "Chọn một chuyên mục (và trạng thái “Tất cả”) để sắp xếp thứ tự bài."}
      </p>
      {loi && (
        <p role="alert" className="border-l-2 border-[#9b3b25] bg-[#9b3b25]/5 px-3 py-2 text-[14px] text-[#9b3b25]!">
          {loi}
        </p>
      )}
      <p role="status" className={thongBao ? "text-[14px]" : "sr-only"}>
        {thongBao}
      </p>

      {dangTai && danhSach.length === 0 ? (
        <p aria-busy="true">Đang tải bài viết…</p>
      ) : danhSach.length === 0 ? (
        <p className="text-[14px] opacity-75">Không có bài nào khớp bộ lọc.</p>
      ) : (
        <DanhSachSapXep
          muc={danhSach}
          layMa={(b) => b.id}
          layTen={(b) => b.title}
          nhan="Danh sách bài viết"
          tatSapXep={!sapXepDuoc}
          luuThuTu={async (ids) => {
            if (maMuc) setDanhSach(await sapXepBai(maMuc, ids))
          }}
          hienThi={(b) => (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="min-w-[220px] flex-1">
                <Link to={`${GOC_QUAN_TRI}/journal/bai/${b.id}`} className="serif text-[18px] leading-snug hover:underline">
                  {b.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] opacity-90">
                  <NhanTrangThai bai={b} />
                  {!maMuc && <span>{tenMuc(b.categoryId)}</span>}
                  <span className="opacity-70">
                    Sửa {dinhDangThoiGian(b.updatedAt)}
                    {b.updatedByName ? ` · ${b.updatedByName}` : ""}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <button
                  type="button"
                  aria-pressed={b.featured}
                  onClick={() => void thaoTac(() => datTieuBieu(b.id, !b.featured, b.version), b.featured ? `Đã bỏ tiêu biểu: ${b.title}` : `Đã đánh dấu tiêu biểu: ${b.title}`)}
                  className={`min-h-[36px] border px-3 ${b.featured ? "border-[var(--earth)] bg-[var(--earth)]/15" : "border-[var(--line)]"}`}
                >
                  {b.featured ? "★ Tiêu biểu" : "☆ Tiêu biểu"}
                </button>
                <label className="flex items-center gap-1">
                  <span className="sr-only">Chuyển “{b.title}” sang chuyên mục</span>
                  <select
                    value=""
                    onChange={(e) => {
                      const dich = Number(e.target.value)
                      if (dich) void thaoTac(() => chuyenChuyenMuc(b.id, dich, b.version), `Đã chuyển “${b.title}” sang ${tenMuc(dich)}.`)
                    }}
                    className="min-h-[36px] max-w-[180px] border border-[var(--line)] bg-white px-2"
                  >
                    <option value="">Chuyển mục…</option>
                    {chuyenMuc
                      .filter((m) => m.id !== b.categoryId)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </select>
                </label>
                <Link to={`${GOC_QUAN_TRI}/journal/bai/${b.id}`} className="inline-flex min-h-[36px] items-center border border-[var(--ink)] px-3">
                  Sửa
                </Link>
                {b.status === "published" && (
                  <a href={`/journal/${b.slug}`} target="_blank" rel="noopener" className="inline-flex min-h-[36px] items-center px-2 underline">
                    Xem ↗
                  </a>
                )}
                {b.status === "draft" && (
                  <button
                    type="button"
                    aria-label={`Xóa bài “${b.title}”`}
                    onClick={() => {
                      if (window.confirm(`Xóa vĩnh viễn bài “${b.title}”? Không thể hoàn tác.`))
                        void thaoTac(() => xoaBai(b.id, b.version), `Đã xóa bài “${b.title}”.`)
                    }}
                    className="min-h-[36px] border border-[#9b3b25] px-3 text-[#9b3b25]!"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          )}
        />
      )}
    </div>
  )
}

/** Trường biểu mẫu chuyên mục (ô nhập dạng chuỗi). */
type BieuMauMuc = { name: string; englishName: string; label: string; description: string; image: string | null; isPublic: boolean }

/**
 * Biểu mẫu tạo / sửa chuyên mục.
 *
 * @param props.banDau - Giá trị ban đầu
 * @param props.nhanNut - Nhãn nút lưu
 * @param props.onLuu - Gửi dữ liệu (ném lỗi khi thất bại)
 * @param props.onHuy - Đóng biểu mẫu
 * @returns Biểu mẫu
 */
function BieuMauChuyenMuc({
  banDau,
  nhanNut,
  onLuu,
  onHuy,
}: {
  banDau: BieuMauMuc
  nhanNut: string
  onLuu: (duLieu: DuLieuChuyenMuc) => Promise<void>
  onHuy: () => void
}) {
  const id = useId()
  const [bm, setBm] = useState(banDau)
  const [loi, setLoi] = useState("")
  const [dangLuu, setDangLuu] = useState(false)
  const [moAnh, setMoAnh] = useState(false)
  const o = "min-h-[40px] w-full border border-[var(--line)] bg-white px-3 text-[14px]"

  return (
    <form
      className="grid gap-3 border border-[var(--line)] bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!bm.name.trim()) return setLoi("Vui lòng nhập tên chuyên mục.")
        setDangLuu(true)
        setLoi("")
        try {
          await onLuu({
            name: bm.name.trim(),
            englishName: bm.englishName.trim() || null,
            label: bm.label.trim() || null,
            description: bm.description.trim(),
            image: bm.image,
            isPublic: bm.isPublic,
          })
        } catch (err) {
          setLoi(thongDiepLoi(err, "Không lưu được chuyên mục."))
        } finally {
          setDangLuu(false)
        }
      }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-[13px]">
          <span>Tên chuyên mục *</span>
          <input value={bm.name} onChange={(e) => setBm({ ...bm, name: e.target.value })} maxLength={150} className={o} required />
        </label>
        <label className="grid gap-1 text-[13px]">
          <span>Tên tiếng Anh</span>
          <input value={bm.englishName} onChange={(e) => setBm({ ...bm, englishName: e.target.value })} maxLength={150} className={o} />
        </label>
        <label className="grid gap-1 text-[13px]">
          <span>Nhãn ngắn (trên thẻ bài)</span>
          <input value={bm.label} onChange={(e) => setBm({ ...bm, label: e.target.value })} maxLength={80} className={o} placeholder="Mặc định: tên chuyên mục" />
        </label>
      </div>
      <label className="grid gap-1 text-[13px]">
        <span>Mô tả</span>
        <textarea value={bm.description} onChange={(e) => setBm({ ...bm, description: e.target.value })} maxLength={600} rows={2} className={`${o} py-2`} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          {bm.image ? (
            <img src={bm.image} alt="" className="aspect-[3/2] w-28 border border-[var(--line)] object-cover" />
          ) : (
            <span className="grid aspect-[3/2] w-28 place-items-center border border-dashed border-[var(--line)] text-[11px] opacity-70">Chưa có ảnh</span>
          )}
          <div className="flex flex-col gap-1 text-[13px]">
            <button type="button" onClick={() => setMoAnh(true)} className="min-h-[36px] border border-[var(--line)] px-3">
              {bm.image ? "Đổi ảnh đại diện" : "Chọn ảnh đại diện"}
            </button>
            {bm.image && (
              <button type="button" onClick={() => setBm({ ...bm, image: null })} className="text-left underline">
                Gỡ ảnh
              </button>
            )}
          </div>
        </div>
        <label className="flex min-h-[44px] items-center gap-2 text-[14px]">
          <input type="checkbox" checked={bm.isPublic} onChange={(e) => setBm({ ...bm, isPublic: e.target.checked })} className="h-5 w-5" />
          Công khai trên /journal
        </label>
      </div>
      {loi && (
        <p id={`${id}-loi`} role="alert" className="text-[13px] text-[#9b3b25]!">
          {loi}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" disabled={dangLuu} className="min-h-[44px] bg-[var(--ink)] px-5 text-[13px] text-[var(--cream)]! disabled:opacity-50">
          {dangLuu ? "Đang lưu…" : nhanNut}
        </button>
        <button type="button" onClick={onHuy} className="min-h-[44px] border border-[var(--line)] px-5 text-[13px]">
          Hủy
        </button>
      </div>
      <ThuVienAnh
        mo={moAnh}
        cheDo="chuyen-muc"
        onDong={() => setMoAnh(false)}
        onChon={(anh) => {
          setBm({ ...bm, image: anh.url })
          setMoAnh(false)
        }}
      />
    </form>
  )
}

/**
 * Tab chuyên mục: thêm, sửa, sắp xếp và bật/tắt công khai.
 *
 * @param props.chuyenMuc - Danh sách hiện tại
 * @param props.setChuyenMuc - Cập nhật danh sách sau thao tác
 * @param props.taiLai - Tải lại từ máy chủ
 * @param props.onXemBai - Mở tab bài viết lọc theo chuyên mục
 * @returns Nội dung tab
 */
function TabChuyenMuc({
  chuyenMuc,
  setChuyenMuc,
  taiLai,
  onXemBai,
}: {
  chuyenMuc: ChuyenMucQuanTri[]
  setChuyenMuc: (ds: ChuyenMucQuanTri[]) => void
  taiLai: () => Promise<void>
  onXemBai: (id: number) => void
}) {
  const [dangThem, setDangThem] = useState(false)
  const [dangSua, setDangSua] = useState<number | null>(null)
  const [thongBao, setThongBao] = useState("")
  const [loiMuc, setLoiMuc] = useState("")

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] opacity-75">
          Thứ tự ở đây là thứ tự chuyên mục trên /journal. Kéo ⠿ hoặc dùng Lên / Xuống; thứ tự được lưu ngay.
          Chỉ xóa được chuyên mục không còn bài nào.
        </p>
        {!dangThem && (
          <button type="button" onClick={() => setDangThem(true)} className="min-h-[44px] bg-[var(--ink)] px-5 text-[13px] text-[var(--cream)]!">
            + Thêm chuyên mục
          </button>
        )}
      </div>
      <p role="status" className={thongBao ? "text-[14px]" : "sr-only"}>
        {thongBao}
      </p>
      {loiMuc && (
        <p role="alert" className="border-l-2 border-[#9b3b25] bg-[#9b3b25]/5 px-3 py-2 text-[14px] text-[#9b3b25]!">
          {loiMuc}
        </p>
      )}
      {dangThem && (
        <BieuMauChuyenMuc
          banDau={{ name: "", englishName: "", label: "", description: "", image: null, isPublic: true }}
          nhanNut="Tạo chuyên mục"
          onHuy={() => setDangThem(false)}
          onLuu={async (duLieu) => {
            setChuyenMuc(await taoChuyenMuc(duLieu))
            setDangThem(false)
            setThongBao(`Đã tạo chuyên mục “${duLieu.name}”.`)
          }}
        />
      )}
      <DanhSachSapXep
        muc={chuyenMuc}
        layMa={(m) => m.id}
        layTen={(m) => m.name}
        nhan="Danh sách chuyên mục"
        luuThuTu={async (ids) => setChuyenMuc(await sapXepChuyenMuc(ids))}
        hienThi={(m) =>
          dangSua === m.id ? (
            <BieuMauChuyenMuc
              banDau={{
                name: m.name,
                englishName: m.englishName ?? "",
                label: m.label ?? "",
                description: m.description,
                image: m.image,
                isPublic: m.isPublic,
              }}
              nhanNut="Lưu chuyên mục"
              onHuy={() => setDangSua(null)}
              onLuu={async (duLieu) => {
                try {
                  setChuyenMuc(await suaChuyenMuc(m.id, { ...duLieu, version: m.version }))
                  setDangSua(null)
                  setThongBao(`Đã lưu chuyên mục “${duLieu.name}”.`)
                } catch (e) {
                  if (e instanceof LoiApi && e.status === 409) await taiLai()
                  throw e
                }
              }}
            />
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {m.image ? (
                <img src={m.image} alt="" className="hidden aspect-[3/2] w-16 object-cover sm:block" />
              ) : (
                <span className="hidden aspect-[3/2] w-16 border border-dashed border-[var(--line)] sm:block" />
              )}
              <div className="min-w-[200px] flex-1">
                <p className="serif text-[18px] leading-snug">{m.name}</p>
                <p className="text-[12px] opacity-75">
                  {[m.englishName, m.label && `Nhãn: ${m.label}`].filter(Boolean).join(" · ")}
                  {" · "}
                  {m.articleCount} bài · {m.publishedCount} đã xuất bản
                </p>
              </div>
              <span
                className={`px-2 py-0.5 text-[11px] tracking-[.06em] uppercase ${m.isPublic ? "bg-[var(--olive)] text-[var(--cream)]!" : "border border-[var(--line)]"}`}
              >
                {m.isPublic ? "Công khai" : "Đang ẩn"}
              </span>
              <button type="button" onClick={() => setDangSua(m.id)} className="min-h-[36px] border border-[var(--ink)] px-3 text-[12px]">
                Sửa
              </button>
              <button type="button" onClick={() => onXemBai(m.id)} className="min-h-[36px] px-2 text-[12px] underline">
                Xem bài
              </button>
              {m.articleCount === 0 && m.publishedCount === 0 && (
                <button
                  type="button"
                  aria-label={`Xóa chuyên mục “${m.name}”`}
                  onClick={async () => {
                    if (!window.confirm(`Xóa vĩnh viễn chuyên mục “${m.name}”? Không thể hoàn tác.`)) return
                    setLoiMuc("")
                    try {
                      setChuyenMuc(await xoaChuyenMuc(m.id, m.version))
                      setThongBao(`Đã xóa chuyên mục “${m.name}”.`)
                    } catch (e) {
                      setLoiMuc(thongDiepLoi(e, "Không xóa được chuyên mục."))
                      await taiLai()
                    }
                  }}
                  className="min-h-[36px] border border-[#9b3b25] px-3 text-[12px] text-[#9b3b25]!"
                >
                  Xóa
                </button>
              )}
            </div>
          )
        }
      />
    </div>
  )
}

/**
 * Tab phân quyền (chỉ admin): cấp / thu hồi quyền Journal cho nhân viên.
 *
 * @returns Nội dung tab
 */
function TabPhanQuyen() {
  const [nhanVien, setNhanVien] = useState<NhanVienJournal[] | null>(null)
  const [loi, setLoi] = useState("")
  const [thongBao, setThongBao] = useState("")

  useEffect(() => {
    layNhanVien()
      .then(setNhanVien)
      .catch((e) => setLoi(thongDiepLoi(e, "Không tải được danh sách nhân viên.")))
  }, [])

  return (
    <div className="grid gap-4">
      <p className="text-[13px] opacity-75">
        Nhân viên được cấp quyền có thể tạo chuyên mục, soạn bài, sắp xếp và xuất bản Journal. Tài khoản admin luôn có quyền này.
        Thu hồi quyền có hiệu lực ngay ở lần thao tác tiếp theo của nhân viên.
      </p>
      {loi && (
        <p role="alert" className="text-[14px] text-[#9b3b25]!">
          {loi}
        </p>
      )}
      <p role="status" className={thongBao ? "text-[14px]" : "sr-only"}>
        {thongBao}
      </p>
      {!nhanVien ? (
        !loi && <p aria-busy="true">Đang tải…</p>
      ) : nhanVien.length === 0 ? (
        <p className="text-[14px] opacity-75">Chưa có tài khoản nhân viên nào ngoài admin.</p>
      ) : (
        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {nhanVien.map((nv) => (
            <li key={nv.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-[15px]">{nv.displayName}</p>
                <p className="text-[12px] opacity-70">
                  {nv.username} · {nv.role === "customer_care" ? "Customer Care" : nv.role}
                  {nv.isActive ? "" : " · đã khóa"}
                </p>
              </div>
              <label className="flex min-h-[44px] items-center gap-2 text-[14px]">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={nv.canManageJournal}
                  onChange={async (e) => {
                    const coQuyen = e.target.checked
                    setLoi("")
                    try {
                      setNhanVien(await datQuyenJournal(nv.id, coQuyen))
                      setThongBao(coQuyen ? `Đã cấp quyền Journal cho ${nv.displayName}.` : `Đã thu hồi quyền Journal của ${nv.displayName}.`)
                    } catch (err) {
                      setLoi(thongDiepLoi(err, "Không cập nhật được quyền."))
                    }
                  }}
                />
                Được quản lý Journal
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
