import { unlink } from "node:fs/promises"
import path from "node:path"
import express, { Router, type ErrorRequestHandler, type RequestHandler } from "express"
import type { Pool } from "mysql2/promise"
import {
  kiemTraCsrf,
  kiemTraQuyen,
  kiemTraQuyenJournal,
  layQuanTriVienHienTai,
  yeuCauDangNhap,
} from "../../middleware/authenticate.ts"
import { phanTichDuLieu } from "../../middleware/validate.ts"
import { LoiUngDung } from "../../utils/loi-ung-dung.ts"
import type { GhiNhatKyBaoMat } from "../../utils/nhat-ky-bao-mat.ts"
import { DINH_DANG_ANH, kiemTraAnh, LoiAnh, luuAnh } from "./anh.ts"
import {
  boThayDoiNhap,
  chuyenChuyenMucBai,
  datQuyenJournal,
  datTieuBieu,
  goXuatBanBai,
  layBaiChoSitemap,
  layBaiCongKhai,
  layBaiQuanTri,
  layDanhSachBaiQuanTri,
  layDanhSachChuyenMucQuanTri,
  layJournalCongKhai,
  layNhanVienJournal,
  layThuVienAnh,
  luuNhapBai,
  sapXepBai,
  sapXepChuyenMuc,
  suaChuyenMuc,
  taoBai,
  taoChuyenMuc,
  themAnh,
  timAnhKhongTonTai,
  xuatBanBai,
  xoaAnh,
  xoaBai,
  xoaChuyenMuc,
  type DuLieuBai,
  type KetQuaGhi,
  type KetQuaXoa,
} from "./journal.repository.ts"
import {
  schemaChuyenMucBai,
  schemaLocBai,
  schemaLuuBai,
  schemaMa,
  schemaPhienBan,
  schemaQuyenJournal,
  schemaSlug,
  schemaSuaChuyenMuc,
  schemaTaoBai,
  schemaTaoChuyenMuc,
  schemaThuTu,
  schemaThuVienAnh,
  schemaTieuBieu,
} from "./journal.schema.ts"
import { chuanHoaNoiDung, layAnhTaiLenTrongNoiDung, LoiNoiDung } from "./noi-dung.ts"

/** Giới hạn body JSON cho API Journal (nội dung bài dài hơn biểu mẫu thường). */
export const GIOI_HAN_BODY_JOURNAL = "1mb"

/** Các trang tĩnh công khai đưa vào sitemap (bài Journal được thêm động). */
export const TRANG_TINH_SITEMAP = [
  "/",
  "/journal",
  "/he-thong",
  "/gioi-thieu",
  "/workshop",
  "/chuong-trinh",
  "/the-hermit",
  "/vo-khiem",
  "/lara",
  "/bo-bai-tarot",
  "/lien-he",
  "/faq",
  "/chinh-sach-bao-mat",
  "/pham-vi-ho-tro",
] as const

/**
 * Định dạng thời điểm theo giờ Việt Nam cho thông điệp xung đột.
 *
 * @param isoChuoi - Thời điểm ISO
 * @returns Chuỗi dễ đọc, ví dụ `14:05 16/11/2026`
 */
function dinhDangThoiDiem(isoChuoi: string | null): string {
  if (!isoChuoi) return "vừa rồi"
  return new Date(isoChuoi).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/**
 * Chuyển kết quả ghi thành lỗi HTTP phù hợp; không làm gì khi thành công.
 *
 * @param ketQua - Kết quả từ repository
 * @param doiTuong - `bài viết` hoặc `chuyên mục` (dùng trong thông điệp)
 * @throws LoiUngDung 404 / 400 / 409 tương ứng
 */
function nemLoiNeuThatBai(ketQua: KetQuaGhi | KetQuaXoa, doiTuong: "bài viết" | "chuyên mục" | "ảnh"): void {
  switch (ketQua.ketQua) {
    case "dang-xuat-ban":
      throw new LoiUngDung(409, "CONFLICT", "Bài đang được công khai. Hãy gỡ xuất bản trước khi xóa.")
    case "con-bai":
      throw new LoiUngDung(409, "CONFLICT", `Chuyên mục còn ${ketQua.soBai} bài. Hãy chuyển hoặc xóa các bài này trước.`)
    case "dang-dung":
      throw new LoiUngDung(409, "CONFLICT", `Ảnh đang được dùng ở ${ketQua.noiDung.join(", ")}. Hãy gỡ ảnh khỏi những chỗ này trước.`)
    case "thanh-cong":
      return
    case "khong-ton-tai":
      throw new LoiUngDung(404, "NOT_FOUND", `Không tìm thấy ${doiTuong}.`)
    case "khong-co-chuyen-muc":
      throw new LoiUngDung(400, "VALIDATION_ERROR", "Chuyên mục không tồn tại.", { categoryId: "Chuyên mục không tồn tại." })
    case "xung-dot":
      throw new LoiUngDung(
        409,
        "CONFLICT",
        `${doiTuong[0]!.toUpperCase()}${doiTuong.slice(1)} vừa được ${ketQua.capNhatBoi ?? "người khác"} cập nhật lúc ${dinhDangThoiDiem(ketQua.capNhatLuc)}. ` +
          "Thay đổi của bạn chưa được lưu. Hãy tải bản mới nhất rồi thực hiện lại.",
      )
  }
}

/**
 * Xác thực nội dung bài và các ảnh được tham chiếu (ảnh bìa + ảnh trong bài).
 *
 * @param pool - Pool MySQL
 * @param duLieu - Dữ liệu đã qua schema (nội dung còn thô)
 * @returns Dữ liệu bài với nội dung đã chuẩn hóa
 * @throws LoiUngDung 400 khi nội dung không hợp lệ hoặc ảnh không còn trong thư viện
 */
async function chuanBiDuLieuBai(
  pool: Pool,
  duLieu: Omit<DuLieuBai, "content"> & { content: unknown },
): Promise<DuLieuBai> {
  let content
  try {
    content = chuanHoaNoiDung(duLieu.content)
  } catch (loi) {
    if (loi instanceof LoiNoiDung)
      throw new LoiUngDung(400, "VALIDATION_ERROR", loi.message, { content: loi.message })
    throw loi
  }
  const anhThieu = await timAnhKhongTonTai(pool, [
    ...layAnhTaiLenTrongNoiDung(content),
    ...(duLieu.coverImage ? [duLieu.coverImage] : []),
  ])
  if (anhThieu.length > 0)
    throw new LoiUngDung(400, "VALIDATION_ERROR", "Có ảnh không còn trong thư viện Journal. Hãy chọn lại ảnh.", {
      [duLieu.coverImage && anhThieu.includes(duLieu.coverImage) ? "coverImage" : "content"]: "Ảnh không còn trong thư viện.",
    })
  return { ...duLieu, content }
}

/**
 * Làm sạch tên file gốc chỉ để hiển thị (không dùng làm tên lưu trữ).
 *
 * @param giaTri - Header `X-File-Name` (URL-encoded)
 * @returns Tên đã làm sạch hoặc `null`
 */
function tenFileGoc(giaTri: string | undefined): string | null {
  if (!giaTri) return null
  let ten = giaTri
  try {
    ten = decodeURIComponent(giaTri)
  } catch {
    // giữ nguyên chuỗi gốc nếu không giải mã được
  }
  ten = path.basename(ten.replace(/\\/g, "/")).replace(/[\u0000-\u001f\u007f<>"]/g, "").trim()
  return ten ? ten.slice(0, 255) : null
}

/**
 * Router công khai `/journal`: chỉ trả bài đã xuất bản trong chuyên mục công khai.
 *
 * @param pool - Pool MySQL
 * @returns Router Express
 */
export function taoRouterJournalCongKhai(pool: Pool): Router {
  const router = Router()

  router.get("/", async (_req, res) => {
    res.json({ success: true, data: await layJournalCongKhai(pool) })
  })

  router.get("/articles/:slug", async (req, res) => {
    const { slug } = phanTichDuLieu(schemaSlug, req.params)
    const bai = await layBaiCongKhai(pool, slug)
    if (!bai) throw new LoiUngDung(404, "NOT_FOUND", "Không tìm thấy bài viết.")
    res.json({ success: true, data: bai })
  })

  return router
}

/**
 * Router quản trị `/admin/journal`. Mọi route yêu cầu phiên đăng nhập hợp lệ và quyền
 * Journal (admin hoặc nhân viên được cấp quyền); mọi route ghi yêu cầu CSRF token.
 * Cấp quyền Journal cho nhân viên chỉ dành cho vai trò `admin`.
 *
 * @param tuyChon.pool - Pool MySQL
 * @param tuyChon.thuMucAnh - Thư mục lưu ảnh tải lên
 * @param tuyChon.dungLuongAnhToiDa - Số byte tối đa mỗi ảnh
 * @param tuyChon.ghiNhatKy - Ghi nhật ký cấp quyền / xuất bản (chỉ ID)
 * @returns Router Express
 */
export function taoRouterQuanTriJournal(tuyChon: {
  pool: Pool
  thuMucAnh: string
  dungLuongAnhToiDa: number
  ghiNhatKy: GhiNhatKyBaoMat
}): Router {
  const { pool, thuMucAnh, dungLuongAnhToiDa, ghiNhatKy } = tuyChon
  const router = Router()
  router.use(yeuCauDangNhap(pool), kiemTraQuyenJournal(), kiemTraCsrf())
  router.use(express.json({ limit: GIOI_HAN_BODY_JOURNAL, strict: true }))

  /** Trả bài sau khi ghi để client có phiên bản mới nhất. */
  const traBai = async (id: number, res: Parameters<RequestHandler>[1], status = 200) => {
    const bai = await layBaiQuanTri(pool, id)
    if (!bai) throw new LoiUngDung(404, "NOT_FOUND", "Không tìm thấy bài viết.")
    res.status(status).json({ success: true, data: bai })
  }

  // ------------------------------------------------------------ Chuyên mục
  router.get("/categories", async (_req, res) => {
    res.json({ success: true, data: await layDanhSachChuyenMucQuanTri(pool) })
  })

  router.post("/categories", async (req, res) => {
    const duLieu = phanTichDuLieu(schemaTaoChuyenMuc, req.body)
    await taoChuyenMuc(pool, duLieu, layQuanTriVienHienTai(res).id)
    res.status(201).json({ success: true, data: await layDanhSachChuyenMucQuanTri(pool) })
  })

  router.put("/categories/:id", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version, ...duLieu } = phanTichDuLieu(schemaSuaChuyenMuc, req.body)
    nemLoiNeuThatBai(await suaChuyenMuc(pool, id, duLieu, version, layQuanTriVienHienTai(res).id), "chuyên mục")
    res.json({ success: true, data: await layDanhSachChuyenMucQuanTri(pool) })
  })

  router.delete("/categories/:id", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version } = phanTichDuLieu(schemaPhienBan, req.body)
    nemLoiNeuThatBai(await xoaChuyenMuc(pool, id, version), "chuyên mục")
    ghiNhatKy({ thaoTac: "xoa_chuyen_muc_journal", maQuanTriVien: layQuanTriVienHienTai(res).id, ketQua: "thanh_cong", maDoiTuong: id })
    res.json({ success: true, data: await layDanhSachChuyenMucQuanTri(pool) })
  })

  router.put("/category-order", async (req, res) => {
    const { ids } = phanTichDuLieu(schemaThuTu, req.body)
    if (!(await sapXepChuyenMuc(pool, ids)))
      throw new LoiUngDung(409, "CONFLICT", "Danh sách chuyên mục vừa thay đổi. Hãy tải lại rồi sắp xếp lại.")
    res.json({ success: true, data: await layDanhSachChuyenMucQuanTri(pool) })
  })

  router.put("/categories/:id/article-order", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { ids } = phanTichDuLieu(schemaThuTu, req.body)
    if (!(await sapXepBai(pool, id, ids)))
      throw new LoiUngDung(409, "CONFLICT", "Danh sách bài trong chuyên mục vừa thay đổi. Hãy tải lại rồi sắp xếp lại.")
    res.json({ success: true, data: await layDanhSachBaiQuanTri(pool, { categoryId: id }) })
  })

  // ------------------------------------------------------------ Bài viết
  router.get("/articles", async (req, res) => {
    const boLoc = phanTichDuLieu(schemaLocBai, req.query)
    res.json({ success: true, data: await layDanhSachBaiQuanTri(pool, boLoc) })
  })

  router.get("/articles/:id", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    await traBai(id, res)
  })

  router.post("/articles", async (req, res) => {
    const { slug, ...tho } = phanTichDuLieu(schemaTaoBai, req.body)
    const duLieu = await chuanBiDuLieuBai(pool, tho)
    const id = await taoBai(pool, duLieu, slug, layQuanTriVienHienTai(res).id)
    if (id === null)
      throw new LoiUngDung(400, "VALIDATION_ERROR", "Chuyên mục không tồn tại.", { categoryId: "Chuyên mục không tồn tại." })
    await traBai(id, res, 201)
  })

  router.put("/articles/:id", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version, ...tho } = phanTichDuLieu(schemaLuuBai, req.body)
    const duLieu = await chuanBiDuLieuBai(pool, tho)
    nemLoiNeuThatBai(await luuNhapBai(pool, id, duLieu, version, layQuanTriVienHienTai(res).id), "bài viết")
    await traBai(id, res)
  })

  router.post("/articles/:id/publish", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version } = phanTichDuLieu(schemaPhienBan, req.body)
    const maNguoi = layQuanTriVienHienTai(res).id
    nemLoiNeuThatBai(await xuatBanBai(pool, id, version, maNguoi), "bài viết")
    ghiNhatKy({ thaoTac: "xuat_ban_journal", maQuanTriVien: maNguoi, ketQua: "thanh_cong", maDoiTuong: id })
    await traBai(id, res)
  })

  router.post("/articles/:id/unpublish", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version } = phanTichDuLieu(schemaPhienBan, req.body)
    const maNguoi = layQuanTriVienHienTai(res).id
    nemLoiNeuThatBai(await goXuatBanBai(pool, id, version, maNguoi), "bài viết")
    ghiNhatKy({ thaoTac: "go_xuat_ban_journal", maQuanTriVien: maNguoi, ketQua: "thanh_cong", maDoiTuong: id })
    await traBai(id, res)
  })

  router.post("/articles/:id/discard", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version } = phanTichDuLieu(schemaPhienBan, req.body)
    nemLoiNeuThatBai(await boThayDoiNhap(pool, id, version, layQuanTriVienHienTai(res).id), "bài viết")
    await traBai(id, res)
  })

  router.delete("/articles/:id", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version } = phanTichDuLieu(schemaPhienBan, req.body)
    nemLoiNeuThatBai(await xoaBai(pool, id, version), "bài viết")
    ghiNhatKy({ thaoTac: "xoa_bai_journal", maQuanTriVien: layQuanTriVienHienTai(res).id, ketQua: "thanh_cong", maDoiTuong: id })
    res.json({ success: true, message: "Đã xóa bài viết." })
  })

  router.patch("/articles/:id/category", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version, categoryId } = phanTichDuLieu(schemaChuyenMucBai, req.body)
    nemLoiNeuThatBai(await chuyenChuyenMucBai(pool, id, categoryId, version, layQuanTriVienHienTai(res).id), "bài viết")
    await traBai(id, res)
  })

  router.patch("/articles/:id/featured", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { version, featured } = phanTichDuLieu(schemaTieuBieu, req.body)
    nemLoiNeuThatBai(await datTieuBieu(pool, id, featured, version, layQuanTriVienHienTai(res).id), "bài viết")
    await traBai(id, res)
  })

  // ------------------------------------------------------------ Thư viện ảnh
  router.get("/media", async (req, res) => {
    const { page } = phanTichDuLieu(schemaThuVienAnh, req.query)
    const { danhSach, tong } = await layThuVienAnh(pool, page)
    res.json({ success: true, data: danhSach, pagination: { page, pageSize: 40, total: tong } })
  })

  router.post(
    "/media",
    express.raw({ type: Object.keys(DINH_DANG_ANH), limit: dungLuongAnhToiDa }),
    async (req, res) => {
      if (!Buffer.isBuffer(req.body))
        throw new LoiUngDung(400, "VALIDATION_ERROR", "Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.", { file: "Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP." })
      let anh
      try {
        anh = kiemTraAnh(req.body, req.get("content-type"), dungLuongAnhToiDa)
      } catch (loi) {
        if (loi instanceof LoiAnh) throw new LoiUngDung(400, "VALIDATION_ERROR", loi.message, { file: loi.message })
        throw loi
      }
      const tenFile = await luuAnh(thuMucAnh, anh)
      try {
        const banGhi = await themAnh(pool, {
          tenFile,
          kieu: anh.kieu,
          dungLuong: anh.duLieu.length,
          rong: anh.rong,
          cao: anh.cao,
          tenGoc: tenFileGoc(req.get("x-file-name")),
          maNguoi: layQuanTriVienHienTai(res).id,
        })
        res.status(201).json({ success: true, data: banGhi })
      } catch (loi) {
        // Không để file mồ côi khi ghi MySQL thất bại.
        await unlink(path.join(thuMucAnh, tenFile)).catch(() => undefined)
        throw loi
      }
    },
  )

  router.delete("/media/:id", async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const ketQua = await xoaAnh(pool, id)
    nemLoiNeuThatBai(ketQua, "ảnh")
    // Bản ghi đã xóa; file không còn được tham chiếu nên lỗi xóa file chỉ để lại file mồ côi, không ảnh hưởng dữ liệu.
    if (ketQua.tenFile) await unlink(path.join(thuMucAnh, ketQua.tenFile)).catch(() => undefined)
    ghiNhatKy({ thaoTac: "xoa_anh_journal", maQuanTriVien: layQuanTriVienHienTai(res).id, ketQua: "thanh_cong", maDoiTuong: id })
    res.json({ success: true, message: "Đã xóa ảnh khỏi thư viện." })
  })

  // ------------------------------------------------------------ Quyền Journal (chỉ admin)
  router.get("/staff", kiemTraQuyen("admin"), async (_req, res) => {
    res.json({ success: true, data: await layNhanVienJournal(pool) })
  })

  router.patch("/staff/:id", kiemTraQuyen("admin"), async (req, res) => {
    const { id } = phanTichDuLieu(schemaMa, req.params)
    const { canManageJournal } = phanTichDuLieu(schemaQuyenJournal, req.body)
    if (!(await datQuyenJournal(pool, id, canManageJournal)))
      throw new LoiUngDung(404, "NOT_FOUND", "Không tìm thấy nhân viên.")
    ghiNhatKy({
      thaoTac: canManageJournal ? "cap_quyen_journal" : "thu_hoi_quyen_journal",
      maQuanTriVien: layQuanTriVienHienTai(res).id,
      ketQua: "thanh_cong",
      maDoiTuong: id,
    })
    res.json({ success: true, data: await layNhanVienJournal(pool) })
  })

  // Ảnh quá dung lượng: thông điệp cụ thể thay vì lỗi 413 chung.
  const xuLyLoiTaiAnh: ErrorRequestHandler = (loi, req, _res, next) => {
    const { type } = (loi ?? {}) as { type?: string }
    if (type === "entity.too.large" && req.path === "/media") {
      const mb = Math.floor(dungLuongAnhToiDa / 1024 / 1024)
      return next(new LoiUngDung(413, "PAYLOAD_TOO_LARGE", `Ảnh vượt quá dung lượng cho phép (${mb} MB).`, { file: `Tối đa ${mb} MB.` }))
    }
    next(loi)
  }
  router.use(xuLyLoiTaiAnh)

  return router
}

/**
 * Thoát ký tự đặc biệt XML.
 *
 * @param chuoi - Chuỗi cần đưa vào XML
 * @returns Chuỗi an toàn
 */
function thoatXml(chuoi: string): string {
  return chuoi.replace(/[<>&'"]/g, (k) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[k]!)
}

/**
 * Handler `/sitemap.xml`: trang tĩnh công khai + bài Journal đã xuất bản (không có bản nháp).
 *
 * @param pool - Pool MySQL
 * @param diaChiWebsite - SITE_URL, ví dụ `https://innerarchitect.vn`
 * @returns Request handler
 */
export function taoXuLySitemap(pool: Pool, diaChiWebsite: string): RequestHandler {
  return async (_req, res) => {
    const bai = await layBaiChoSitemap(pool)
    const url = [
      ...TRANG_TINH_SITEMAP.map((duongDan) => ({ loc: `${diaChiWebsite}${duongDan}`, lastmod: null as string | null })),
      ...bai.map((b) => ({ loc: `${diaChiWebsite}/journal/${b.slug}`, lastmod: b.lastmod })),
    ]
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      url
        .map(
          (u) =>
            `  <url><loc>${thoatXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ""}</url>`,
        )
        .join("\n") +
      "\n</urlset>\n"
    res.setHeader("Cache-Control", "public, max-age=300")
    res.type("application/xml").send(xml)
  }
}
