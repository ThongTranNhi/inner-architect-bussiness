import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { datChanRoiTrang, go, Link, thayDuongDan } from "../../dieu-huong"
import { BaiJournalHienThi } from "../../journal/BaiJournalHienThi"
import { dinhDangNgayJournal } from "../../journal/du-lieu-journal"
import { TAI_LIEU_RONG, type NodeNoiDung } from "../../journal/noi-dung/quy-tac"
import { ThuVienAnh } from "../components/journal/ThuVienAnh"
import { TrinhSoanThao } from "../components/journal/TrinhSoanThao"
import { GOC_QUAN_TRI } from "../duong-dan-quan-tri"
import {
  layBai,
  layChuyenMuc,
  luuNhap,
  taoBai,
  thaoTacBai,
  xoaBai,
  type BaiChiTiet,
  type ChuyenMucQuanTri,
} from "../services/api-journal"
import { LoiApi } from "../services/api-quan-tri"

/** Các trường biểu mẫu ngoài nội dung. */
type BieuMau = {
  title: string
  summary: string
  categoryId: number
  coverImage: string | null
  coverAlt: string
}

type ThongBao = { loai: "ok" | "loi" | "xung-dot"; noiDung: string } | null

/** Thông điệp xác nhận khi rời trang còn thay đổi chưa lưu. */
const HOI_ROI_TRANG = "Bài viết có thay đổi chưa lưu. Rời trang và bỏ các thay đổi này?"

/**
 * Tạo chuỗi so sánh để biết biểu mẫu có thay đổi chưa lưu.
 *
 * @param bieuMau - Các trường biểu mẫu
 * @param noiDung - Nội dung trình soạn thảo
 * @returns Chuỗi JSON ổn định
 */
function anhChup(bieuMau: BieuMau, noiDung: NodeNoiDung): string {
  return JSON.stringify([bieuMau.title, bieuMau.summary, bieuMau.categoryId, bieuMau.coverImage, bieuMau.coverAlt, noiDung])
}

/**
 * Màn hình soạn bài Journal (`/jathong/journal/bai/moi` và `/jathong/journal/bai/<id>`).
 *
 * @param props.id - ID bài, `null` khi viết bài mới
 * @returns Trình soạn bài
 */
export function SoanBaiJournal({ id }: { id: number | null }) {
  const idNhanNoiDung = useId()
  const [chuyenMuc, setChuyenMuc] = useState<ChuyenMucQuanTri[]>([])
  const [bai, setBai] = useState<BaiChiTiet | null>(null)
  const [bieuMau, setBieuMau] = useState<BieuMau | null>(null)
  const [noiDung, setNoiDung] = useState<NodeNoiDung>(TAI_LIEU_RONG)
  const [khoaSoanThao, setKhoaSoanThao] = useState(0)
  const [loiTai, setLoiTai] = useState("")
  const [cheDo, setCheDo] = useState<"soan" | "xem">("soan")
  const [dangGui, setDangGui] = useState<string | null>(null)
  const [thongBao, setThongBao] = useState<ThongBao>(null)
  const [loiTruong, setLoiTruong] = useState<Record<string, string>>({})
  const [moAnhBia, setMoAnhBia] = useState(false)
  const daLuu = useRef("")
  const khungTrang = useRef<HTMLDivElement>(null)
  const thanhTrangThai = useRef<HTMLDivElement>(null)

  // Thanh trạng thái dính trên (từ màn hình md); đo chiều cao để thanh công cụ soạn thảo dính ngay bên dưới.
  useEffect(() => {
    const thanh = thanhTrangThai.current
    const khung = khungTrang.current
    if (!thanh || !khung) return
    const rong = window.matchMedia("(min-width: 768px)")
    const capNhat = () => khung.style.setProperty("--cao-thanh-trang-thai", rong.matches ? `${thanh.offsetHeight}px` : "0px")
    const quanSat = new ResizeObserver(capNhat)
    quanSat.observe(thanh)
    rong.addEventListener("change", capNhat)
    capNhat()
    return () => {
      quanSat.disconnect()
      rong.removeEventListener("change", capNhat)
    }
    // Thanh chỉ có trong DOM sau khi tải xong bài và chuyên mục.
  }, [bieuMau === null, chuyenMuc.length === 0])

  /** Đưa dữ liệu bài từ máy chủ vào biểu mẫu và trình soạn thảo. */
  const napBai = useCallback((b: BaiChiTiet) => {
    const bm = { title: b.title, summary: b.summary, categoryId: b.categoryId, coverImage: b.coverImage, coverAlt: b.coverAlt ?? "" }
    setBai(b)
    setBieuMau(bm)
    setNoiDung(b.content)
    daLuu.current = anhChup(bm, b.content)
    setKhoaSoanThao((k) => k + 1)
  }, [])

  // Bài đang mở: sau lần lưu đầu, URL đổi sang /bai/<id> nhưng không cần tải lại từ máy chủ
  // (tải lại song song với thao tác xuất bản có thể trả về phiên bản cũ).
  const baiRef = useRef(bai)
  baiRef.current = bai

  useEffect(() => {
    if (id !== null && baiRef.current?.id === id) return
    let conGanKet = true
    Promise.all([layChuyenMuc(), id ? layBai(id) : Promise.resolve(null)])
      .then(([dsMuc, b]) => {
        if (!conGanKet) return
        setChuyenMuc(dsMuc)
        if (b) napBai(b)
        else {
          const tuUrl = Number(new URLSearchParams(window.location.search).get("chuyenMuc"))
          const bm = {
            title: "",
            summary: "",
            categoryId: dsMuc.some((m) => m.id === tuUrl) ? tuUrl : (dsMuc[0]?.id ?? 0),
            coverImage: null,
            coverAlt: "",
          }
          setBieuMau(bm)
          daLuu.current = anhChup(bm, TAI_LIEU_RONG)
        }
      })
      .catch((e) => conGanKet && setLoiTai(e instanceof LoiApi ? e.message : "Không tải được bài viết."))
    return () => {
      conGanKet = false
    }
  }, [id, napBai])

  const coThayDoi = bieuMau !== null && anhChup(bieuMau, noiDung) !== daLuu.current
  const coThayDoiRef = useRef(coThayDoi)
  coThayDoiRef.current = coThayDoi

  // Cảnh báo khi rời trang (đóng tab, tải lại, điều hướng nội bộ, nút Back) còn thay đổi chưa lưu.
  useEffect(() => {
    const truocKhiDong = (e: BeforeUnloadEvent) => {
      if (!coThayDoiRef.current) return
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", truocKhiDong)
    datChanRoiTrang(() => !coThayDoiRef.current || window.confirm(HOI_ROI_TRANG))
    return () => {
      window.removeEventListener("beforeunload", truocKhiDong)
      datChanRoiTrang(null)
    }
  }, [])

  /**
   * Xử lý lỗi từ API: xung đột phiên bản, lỗi theo trường, phiên hết hạn.
   *
   * @param e - Lỗi bắt được
   * @param hanhDong - Mô tả thao tác thất bại
   */
  const xuLyLoi = (e: unknown, hanhDong: string) => {
    if (e instanceof LoiApi) {
      if (e.status === 409) return setThongBao({ loai: "xung-dot", noiDung: e.message })
      if (e.status === 401)
        return setThongBao({
          loai: "loi",
          noiDung:
            "Phiên đăng nhập đã hết hạn nên nội dung chưa được lưu. Giữ nguyên trang này, đăng nhập lại ở một tab khác rồi bấm lưu lần nữa.",
        })
      if (e.truong) setLoiTruong(e.truong)
      return setThongBao({ loai: "loi", noiDung: e.message })
    }
    setThongBao({ loai: "loi", noiDung: `Không ${hanhDong} được. Vui lòng thử lại.` })
  }

  /**
   * Lưu nháp lên máy chủ (tạo bài ở lần lưu đầu tiên).
   *
   * @returns Bài sau khi lưu, hoặc `null` nếu lỗi
   */
  const luu = async (): Promise<BaiChiTiet | null> => {
    if (!bieuMau) return null
    const loi: Record<string, string> = {}
    if (!bieuMau.title.trim()) loi.title = "Vui lòng nhập tiêu đề."
    if (!bieuMau.categoryId) loi.categoryId = "Vui lòng chọn chuyên mục."
    setLoiTruong(loi)
    if (Object.keys(loi).length) {
      setThongBao({ loai: "loi", noiDung: "Vui lòng kiểm tra các trường được đánh dấu." })
      return null
    }
    const chup = anhChup(bieuMau, noiDung)
    const duLieu = {
      title: bieuMau.title.trim(),
      summary: bieuMau.summary.trim(),
      categoryId: bieuMau.categoryId,
      coverImage: bieuMau.coverImage,
      coverAlt: bieuMau.coverAlt.trim() || null,
      content: noiDung,
    }
    try {
      const moi = bai ? await luuNhap(bai.id, { ...duLieu, version: bai.version }) : await taoBai(duLieu)
      setBai(moi)
      daLuu.current = chup
      setLoiTruong({})
      if (!bai) thayDuongDan(`${GOC_QUAN_TRI}/journal/bai/${moi.id}`)
      return moi
    } catch (e) {
      xuLyLoi(e, "lưu bài")
      return null
    }
  }

  const chay = async (nhan: string, viec: () => Promise<void>) => {
    if (dangGui) return
    setDangGui(nhan)
    setThongBao(null)
    try {
      await viec()
    } finally {
      setDangGui(null)
    }
  }

  const luuNhapBai = () =>
    chay("luu", async () => {
      const moi = await luu()
      if (moi)
        setThongBao({
          loai: "ok",
          noiDung:
            moi.status === "published"
              ? "Đã lưu bản nháp chỉnh sửa. Trang công khai chưa đổi cho tới khi bấm “Cập nhật bản công khai”."
              : "Đã lưu nháp. Bài chưa hiện trên trang công khai.",
        })
    })

  const xuatBan = () =>
    chay("xuat-ban", async () => {
      const daLuuBai = coThayDoi || !bai ? await luu() : bai
      if (!daLuuBai) return
      try {
        const moi = await thaoTacBai(daLuuBai.id, "publish", daLuuBai.version)
        setBai(moi)
        const muc = chuyenMuc.find((m) => m.id === moi.categoryId)
        setThongBao({
          loai: "ok",
          noiDung: muc?.isPublic
            ? `Đã ${daLuuBai.status === "published" ? "cập nhật bản công khai" : "xuất bản"}. Bài hiện tại /journal/${moi.slug}.`
            : `Đã xuất bản, nhưng chuyên mục “${muc?.name ?? ""}” đang ẩn nên bài chưa hiện trên trang công khai.`,
        })
      } catch (e) {
        xuLyLoi(e, "xuất bản")
      }
    })

  const goXuatBan = () => {
    if (!bai || !window.confirm("Gỡ bài khỏi trang công khai? Bản làm việc vẫn được giữ để sửa tiếp.")) return
    void chay("go", async () => {
      try {
        setBai(await thaoTacBai(bai.id, "unpublish", bai.version))
        setThongBao({ loai: "ok", noiDung: "Đã gỡ bài khỏi trang công khai." })
      } catch (e) {
        xuLyLoi(e, "gỡ xuất bản")
      }
    })
  }

  const boThayDoi = () => {
    if (!bai || !window.confirm("Bỏ toàn bộ bản nháp chỉnh sửa và quay về nội dung đang công khai?")) return
    void chay("bo", async () => {
      try {
        napBai(await thaoTacBai(bai.id, "discard", bai.version))
        setThongBao({ loai: "ok", noiDung: "Đã bỏ thay đổi nháp. Nội dung đã về đúng bản đang công khai." })
      } catch (e) {
        xuLyLoi(e, "bỏ thay đổi")
      }
    })
  }

  const xoa = () => {
    if (!bai || !window.confirm(`Xóa vĩnh viễn bài “${bai.title}”? Không thể hoàn tác.`)) return
    void chay("xoa", async () => {
      try {
        await xoaBai(bai.id, bai.version)
        // Bài đã xóa: bỏ cảnh báo thay đổi chưa lưu rồi về danh sách.
        if (bieuMau) daLuu.current = anhChup(bieuMau, noiDung)
        coThayDoiRef.current = false
        go(`${GOC_QUAN_TRI}/journal`)
      } catch (e) {
        xuLyLoi(e, "xóa bài")
      }
    })
  }

  const taiBanMoi = () => {
    if (!bai) return
    if (coThayDoi && !window.confirm("Tải bản mới nhất sẽ bỏ các thay đổi chưa lưu của bạn trên trang này. Tiếp tục?")) return
    void chay("tai", async () => {
      try {
        napBai(await layBai(bai.id))
        setThongBao({ loai: "ok", noiDung: "Đã tải bản mới nhất." })
      } catch (e) {
        xuLyLoi(e, "tải bài")
      }
    })
  }

  // Ctrl+S / Cmd+S để lưu nháp.
  const luuNhapRef = useRef(luuNhapBai)
  luuNhapRef.current = luuNhapBai
  useEffect(() => {
    const phim = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        void luuNhapRef.current()
      }
    }
    window.addEventListener("keydown", phim)
    return () => window.removeEventListener("keydown", phim)
  }, [])

  const mucDangChon = chuyenMuc.find((m) => m.id === bieuMau?.categoryId)
  const duLieuXemTruoc = useMemo(
    () =>
      bieuMau && {
        tieuDe: bieuMau.title || "(Chưa có tiêu đề)",
        doanGioiThieu: bieuMau.summary,
        nhanChuyenMuc: mucDangChon ? (mucDangChon.label ?? mucDangChon.name) : "",
        ngay: bai?.publishedAt ? dinhDangNgayJournal(bai.publishedAt) : "Ngày xuất bản",
        anhBia: bieuMau.coverImage,
        moTaAnhBia: bieuMau.coverAlt || bieuMau.title,
        noiDung,
      },
    [bieuMau, noiDung, mucDangChon, bai?.publishedAt],
  )

  if (loiTai)
    return (
      <div className="grid gap-4">
        <p role="alert" className="text-[#9b3b25]!">
          {loiTai}
        </p>
        <Link to={`${GOC_QUAN_TRI}/journal`} className="underlink">
          ← Danh sách bài
        </Link>
      </div>
    )
  if (!bieuMau) return <p aria-busy="true">Đang tải bài viết…</p>

  if (chuyenMuc.length === 0)
    return (
      <div className="grid gap-4">
        <p>Chưa có chuyên mục nào. Hãy tạo chuyên mục trước khi viết bài.</p>
        <Link to={`${GOC_QUAN_TRI}/journal?tab=chuyen-muc`} className="underlink">
          Tạo chuyên mục →
        </Link>
      </div>
    )

  const trangThaiBai = !bai
    ? "Bài mới — chưa lưu"
    : bai.status === "draft"
      ? "Bản nháp — chưa công khai"
      : bai.hasDraftChanges
        ? "Đã xuất bản · có bản nháp chỉnh sửa chưa cập nhật lên trang công khai"
        : "Đã xuất bản"
  const oNhap = (loi?: string) =>
    `w-full border bg-white px-3 text-[15px] ${loi ? "border-[#9b3b25]" : "border-[var(--line)]"} focus:border-[var(--ink)] focus:outline-none`

  return (
    <div ref={khungTrang} className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={`${GOC_QUAN_TRI}/journal`} className="text-[13px] underline">
          ← Danh sách bài
        </Link>
        <div className="flex gap-1 text-[13px]" role="tablist" aria-label="Chế độ">
          {(["soan", "xem"] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cheDo === c}
              onClick={() => setCheDo(c)}
              className={`min-h-[40px] border px-4 ${cheDo === c ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)]!" : "border-[var(--line)]"}`}
            >
              {c === "soan" ? "Soạn thảo" : "Xem trước"}
            </button>
          ))}
        </div>
      </div>

      {/* Thanh trạng thái + thao tác (dính trên khi cuộn) */}
      <div
        ref={thanhTrangThai}
        className="z-20 -mx-4 grid gap-3 border-b border-[var(--line)] bg-[var(--cream)]/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 md:sticky md:top-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px]">
            <span className="font-semibold">{trangThaiBai}</span>
            {coThayDoi && <span className="ml-2 text-[#9b3b25]!">· Có thay đổi chưa lưu</span>}
            {bai?.status === "published" && (
              <>
                {" · "}
                <a href={`/journal/${bai.slug}`} target="_blank" rel="noopener" className="underline">
                  Xem bản công khai
                </a>
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-2 text-[13px]">
            <button
              type="button"
              onClick={() => void luuNhapBai()}
              disabled={!!dangGui}
              className="min-h-[44px] border border-[var(--ink)] px-4 disabled:opacity-50"
              title="Ctrl+S"
            >
              {dangGui === "luu" ? "Đang lưu…" : "Lưu nháp"}
            </button>
            {(!bai || bai.status === "draft" || bai.hasDraftChanges || coThayDoi) && (
              <button
                type="button"
                onClick={() => void xuatBan()}
                disabled={!!dangGui}
                className="min-h-[44px] bg-[var(--ink)] px-4 text-[var(--cream)]! disabled:opacity-50"
              >
                {dangGui === "xuat-ban"
                  ? "Đang xuất bản…"
                  : bai?.status === "published"
                    ? coThayDoi
                      ? "Lưu & cập nhật bản công khai"
                      : "Cập nhật bản công khai"
                    : coThayDoi || !bai
                      ? "Lưu & xuất bản"
                      : "Xuất bản"}
              </button>
            )}
            {bai?.status === "published" && bai.hasDraftChanges && (
              <button type="button" onClick={boThayDoi} disabled={!!dangGui} className="min-h-[44px] border border-[var(--line)] px-4">
                Bỏ thay đổi nháp
              </button>
            )}
            {bai?.status === "published" && (
              <button
                type="button"
                onClick={goXuatBan}
                disabled={!!dangGui}
                className="min-h-[44px] border border-[#9b3b25] px-4 text-[#9b3b25]!"
              >
                Gỡ xuất bản
              </button>
            )}
            {bai?.status === "draft" && (
              <button
                type="button"
                onClick={xoa}
                disabled={!!dangGui}
                className="min-h-[44px] border border-[#9b3b25] px-4 text-[#9b3b25]!"
              >
                {dangGui === "xoa" ? "Đang xóa…" : "Xóa bài"}
              </button>
            )}
          </div>
        </div>
        {thongBao && (
          <div
            role={thongBao.loai === "ok" ? "status" : "alert"}
            className={`flex flex-wrap items-center gap-3 border-l-2 px-3 py-2 text-[14px] ${
              thongBao.loai === "ok" ? "border-[var(--olive)] bg-[var(--olive)]/10" : "border-[#9b3b25] bg-[#9b3b25]/5 text-[#7d2f1d]"
            }`}
          >
            <span>{thongBao.noiDung}</span>
            {thongBao.loai === "xung-dot" && (
              <button type="button" onClick={taiBanMoi} className="min-h-[36px] border border-current px-3 text-[13px]">
                Tải bản mới nhất
              </button>
            )}
          </div>
        )}
      </div>

      {cheDo === "xem" && duLieuXemTruoc ? (
        <section aria-label="Xem trước bài viết" className="jr-xem-truoc border border-[var(--line)] bg-[var(--paper)]">
          <p className="border-b border-[var(--line)] bg-[#f3e7d3] px-4 py-2 text-[12px] tracking-[.08em] uppercase">
            Xem trước — hiển thị giống trang công khai, chưa được công khai
          </p>
          <div className="article-page">
            <BaiJournalHienThi bai={duLieuXemTruoc} />
          </div>
        </section>
      ) : (
        <div className="grid gap-5">
          <label className="grid gap-1">
            <span className="text-[13px]">Tiêu đề</span>
            <input
              value={bieuMau.title}
              onChange={(e) => setBieuMau({ ...bieuMau, title: e.target.value })}
              maxLength={255}
              aria-invalid={!!loiTruong.title}
              className={`${oNhap(loiTruong.title)} serif min-h-[56px] text-[24px] sm:text-[30px]`}
            />
            {loiTruong.title && <span className="text-[13px] text-[#9b3b25]!">{loiTruong.title}</span>}
          </label>
          {bai && (
            <p className="-mt-3 text-[12px] opacity-70">
              Đường dẫn cố định: /journal/{bai.slug} (không đổi khi sửa tiêu đề hoặc chuyển chuyên mục)
            </p>
          )}

          <label className="grid gap-1">
            <span className="text-[13px]">Đoạn giới thiệu</span>
            <textarea
              value={bieuMau.summary}
              onChange={(e) => setBieuMau({ ...bieuMau, summary: e.target.value })}
              maxLength={1000}
              rows={3}
              className={`${oNhap(loiTruong.summary)} py-2`}
            />
            <span className="text-[12px] opacity-70">Hiện trên thẻ bài ở /journal, trang chủ và đầu trang bài viết.</span>
          </label>

          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <label className="grid content-start gap-1">
              <span className="text-[13px]">Chuyên mục</span>
              <select
                value={bieuMau.categoryId}
                onChange={(e) => setBieuMau({ ...bieuMau, categoryId: Number(e.target.value) })}
                aria-invalid={!!loiTruong.categoryId}
                className={`${oNhap(loiTruong.categoryId)} min-h-[44px]`}
              >
                {chuyenMuc.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                    {m.isPublic ? "" : " (đang ẩn)"}
                  </option>
                ))}
              </select>
              {bai?.status === "published" && bai.publishedCategoryId !== bieuMau.categoryId && (
                <span className="text-[12px] opacity-75">Bài sẽ chuyển sang chuyên mục này khi cập nhật bản công khai.</span>
              )}
              {loiTruong.categoryId && <span className="text-[13px] text-[#9b3b25]!">{loiTruong.categoryId}</span>}
            </label>

            <fieldset className="grid gap-2">
              <legend className="mb-1 text-[13px]">Ảnh bìa</legend>
              <div className="flex flex-wrap items-start gap-3">
                {bieuMau.coverImage ? (
                  <img src={bieuMau.coverImage} alt="" className="aspect-[16/10] w-40 border border-[var(--line)] object-cover" />
                ) : (
                  <div className="grid aspect-[16/10] w-40 place-items-center border border-dashed border-[var(--line)] text-[12px] opacity-70">
                    Chưa có ảnh bìa
                  </div>
                )}
                <div className="flex flex-col gap-2 text-[13px]">
                  <button type="button" onClick={() => setMoAnhBia(true)} className="min-h-[40px] border border-[var(--line)] bg-white px-3">
                    {bieuMau.coverImage ? "Đổi ảnh bìa" : "Chọn ảnh bìa"}
                  </button>
                  {bieuMau.coverImage && (
                    <button
                      type="button"
                      onClick={() => setBieuMau({ ...bieuMau, coverImage: null })}
                      className="min-h-[40px] px-3 text-left underline"
                    >
                      Gỡ ảnh bìa
                    </button>
                  )}
                </div>
              </div>
              <label className="grid gap-1 text-[13px]">
                <span>Mô tả ảnh bìa (văn bản thay thế; để trống sẽ dùng tiêu đề)</span>
                <input
                  value={bieuMau.coverAlt}
                  onChange={(e) => setBieuMau({ ...bieuMau, coverAlt: e.target.value })}
                  maxLength={255}
                  className={`${oNhap()} min-h-[40px]`}
                />
              </label>
              {loiTruong.coverImage && <span className="text-[13px] text-[#9b3b25]!">{loiTruong.coverImage}</span>}
            </fieldset>
          </div>

          <div className="grid gap-1">
            <span id={idNhanNoiDung} className="text-[13px]">
              Nội dung
            </span>
            {loiTruong.content && (
              <span role="alert" className="text-[13px] text-[#9b3b25]!">
                {loiTruong.content}
              </span>
            )}
            <TrinhSoanThao key={khoaSoanThao} noiDungBanDau={noiDung} onThayDoi={setNoiDung} idNhan={idNhanNoiDung} />
            <p className="text-[12px] opacity-70">
              Mẹo: dán trực tiếp từ Word để giữ đoạn văn, tiêu đề, chữ đậm và danh sách. Ctrl+S để lưu nháp.
            </p>
          </div>
        </div>
      )}

      <ThuVienAnh
        mo={moAnhBia}
        cheDo="bia"
        moTaBanDau={bieuMau.coverAlt}
        onDong={() => setMoAnhBia(false)}
        onChon={(anh, { alt }) => {
          setBieuMau({ ...bieuMau, coverImage: anh.url, coverAlt: alt })
          setMoAnhBia(false)
        }}
      />
    </div>
  )
}
