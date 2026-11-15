import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { after, before, beforeEach, describe, test } from "node:test"
import mysql from "mysql2/promise"
import request from "supertest"
import { nhapSeedJournal } from "../scripts/nhap-journal.ts"
import { anhJpegCoExif, ANH_PNG_1X1 } from "./anh-mau.ts"
import {
  chuanBiSchemaTest,
  coDatabaseTest,
  docCauHinhTest,
  donDuLieuTest,
  MAT_KHAU_THU,
  taoTaiKhoanThu,
  taoUngDungTest,
} from "./ho-tro.ts"

const cauHinh = docCauHinhTest()
const coDb = await coDatabaseTest(cauHinh)
const lyDoBoQua = coDb ? false : "Chưa có MySQL test (cấu hình TEST_DB_NAME trong server/.env)"

const API = "/api/v1/admin/journal"

/** Đăng nhập bằng agent và trả CSRF token. */
async function dangNhap(agent: request.Agent, username: string): Promise<string> {
  const res = await agent.post("/api/v1/auth/login").send({ username, password: MAT_KHAU_THU }).expect(200)
  return res.body.data.csrfToken as string
}

const doan = (text: string) => ({ type: "paragraph", content: [{ type: "text", text }] })

describe("Journal: API quản trị và công khai", { skip: lyDoBoQua }, () => {
  const cfg = cauHinh!
  let ungDung: ReturnType<typeof taoUngDungTest>
  let admin: request.Agent
  let csrfAdmin: string

  before(async () => {
    await chuanBiSchemaTest(cfg)
    ungDung = taoUngDungTest(cfg, { bieuMau: 1000, dangNhap: 1000, chung: 10_000, cuaSoMs: 60_000 })
  })
  after(async () => {
    await donDuLieuTest(ungDung.pool)
    await ungDung.dongTatCa()
  })
  beforeEach(async () => {
    await donDuLieuTest(ungDung.pool)
    await taoTaiKhoanThu(ungDung.pool, "admin.thu", "admin")
    admin = request.agent(ungDung.app)
    csrfAdmin = await dangNhap(admin, "admin.thu")
  })

  /** Tạo chuyên mục công khai và trả ID. */
  async function taoMuc(ten: string, congKhai = true): Promise<number> {
    const res = await admin
      .post(`${API}/categories`)
      .set("X-CSRF-Token", csrfAdmin)
      .send({ name: ten, description: `Mô tả ${ten}`, isPublic: congKhai })
      .expect(201)
    return res.body.data.find((m: { name: string }) => m.name === ten).id
  }

  /** Tải ảnh PNG mẫu và trả URL. */
  async function taiAnh(): Promise<{ url: string; width: number }> {
    const res = await admin
      .post(`${API}/media`)
      .set("X-CSRF-Token", csrfAdmin)
      .set("Content-Type", "image/png")
      .set("X-File-Name", encodeURIComponent("ảnh thử.png"))
      .send(ANH_PNG_1X1)
      .expect(201)
    return res.body.data
  }

  test("phân quyền: chưa đăng nhập 401, nhân viên chưa được cấp 403, admin cấp/thu hồi có hiệu lực ngay", async () => {
    await request(ungDung.app).get(`${API}/categories`).expect(401)
    const maNhanVien = await taoTaiKhoanThu(ungDung.pool, "cc.journal", "customer_care")
    const nhanVien = request.agent(ungDung.app)
    const csrf = await dangNhap(nhanVien, "cc.journal")
    assert.equal((await nhanVien.get("/api/v1/auth/me").expect(200)).body.data.admin.canManageJournal, false)
    await nhanVien.get(`${API}/categories`).expect(403)
    await nhanVien.post(`${API}/categories`).set("X-CSRF-Token", csrf).send({ name: "X", isPublic: true }).expect(403)

    // Nhân viên không tự cấp quyền được.
    await nhanVien.patch(`${API}/staff/${maNhanVien}`).set("X-CSRF-Token", csrf).send({ canManageJournal: true }).expect(403)

    const ds = await admin.patch(`${API}/staff/${maNhanVien}`).set("X-CSRF-Token", csrfAdmin).send({ canManageJournal: true }).expect(200)
    assert.equal(ds.body.data.find((n: { id: number }) => n.id === maNhanVien).canManageJournal, true)
    assert.equal((await nhanVien.get("/api/v1/auth/me").expect(200)).body.data.admin.canManageJournal, true)
    await nhanVien.post(`${API}/categories`).set("X-CSRF-Token", csrf).send({ name: "Mục của nhân viên", isPublic: true }).expect(201)
    // Có quyền Journal nhưng không phải admin → không xem/cấp quyền cho người khác.
    await nhanVien.get(`${API}/staff`).expect(403)

    await admin.patch(`${API}/staff/${maNhanVien}`).set("X-CSRF-Token", csrfAdmin).send({ canManageJournal: false }).expect(200)
    await nhanVien.get(`${API}/categories`).expect(403)
    // Không áp dụng cho tài khoản admin.
    const [dongAdmin] = await ungDung.pool.query<mysql.RowDataPacket[]>("SELECT id FROM admins WHERE username = 'admin.thu'")
    await admin.patch(`${API}/staff/${dongAdmin[0]!.id}`).set("X-CSRF-Token", csrfAdmin).send({ canManageJournal: false }).expect(404)
  })

  test("mọi API ghi yêu cầu CSRF token", async () => {
    const res = await admin.post(`${API}/categories`).send({ name: "Không CSRF", isPublic: true }).expect(403)
    assert.equal(res.body.error.code, "CSRF_INVALID")
    await admin.post(`${API}/media`).set("Content-Type", "image/png").send(ANH_PNG_1X1).expect(403)
    await admin.put(`${API}/category-order`).set("X-CSRF-Token", "sai").send({ ids: [1] }).expect(403)
  })

  test("chuyên mục: tạo, sắp xếp, ẩn/hiện và hiện đúng thứ tự trên API công khai", async () => {
    const a = await taoMuc("Mục A")
    const b = await taoMuc("Mục B")
    const an = await taoMuc("Mục ẩn", false)
    let congKhai = (await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data
    assert.deepEqual(congKhai.categories.map((m: { name: string }) => m.name), ["Mục A", "Mục B"])
    assert.equal(congKhai.categories[0].slug, "muc-a")

    await admin.put(`${API}/category-order`).set("X-CSRF-Token", csrfAdmin).send({ ids: [b, an, a] }).expect(200)
    congKhai = (await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data
    assert.deepEqual(congKhai.categories.map((m: { name: string }) => m.name), ["Mục B", "Mục A"])

    // Danh sách thiếu một chuyên mục → xung đột, không lưu nửa vời.
    await admin.put(`${API}/category-order`).set("X-CSRF-Token", csrfAdmin).send({ ids: [a, b] }).expect(409)

    // Sửa với phiên bản cũ → 409.
    const danhSach = (await admin.get(`${API}/categories`).expect(200)).body.data
    const mucAn = danhSach.find((m: { id: number }) => m.id === an)
    const duLieu = { name: "Mục đã hiện", description: "", isPublic: true, image: "/assets/journal/goc/hinh01.webp", version: mucAn.version }
    await admin.put(`${API}/categories/${an}`).set("X-CSRF-Token", csrfAdmin).send(duLieu).expect(200)
    const xungDot = await admin.put(`${API}/categories/${an}`).set("X-CSRF-Token", csrfAdmin).send(duLieu).expect(409)
    assert.equal(xungDot.body.error.code, "CONFLICT")
    congKhai = (await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data
    assert.deepEqual(congKhai.categories.map((m: { name: string }) => m.name), ["Mục B", "Mục đã hiện", "Mục A"])
    // Slug không đổi khi đổi tên.
    assert.equal(congKhai.categories[1].slug, "muc-an")

    await admin
      .put(`${API}/categories/${a}`)
      .set("X-CSRF-Token", csrfAdmin)
      .send({ name: "A", isPublic: true, image: "https://evil.example/x.png", version: 1 })
      .expect(400)
  })

  test("vòng đời bài: nháp không công khai → xuất bản → sửa nháp không đổi bản công khai → cập nhật", async () => {
    const muc = await taoMuc("Hiểu mình")
    const anh = await taiAnh()
    const noiDung = {
      type: "doc",
      content: [
        doan("Đoạn mở đầu."),
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Tiêu đề phụ" }] },
        { type: "image", attrs: { src: anh.url, alt: "Ảnh minh họa", caption: "Chú thích ảnh" } },
        { type: "bulletList", content: [{ type: "listItem", content: [doan("Ý một")] }] },
        doan("Đoạn kết."),
      ],
    }
    const tao = await admin
      .post(`${API}/articles`)
      .set("X-CSRF-Token", csrfAdmin)
      .send({ title: "Bài thử nghiệm đầu tiên", summary: "Giới thiệu", categoryId: muc, coverImage: anh.url, coverAlt: "Bìa", content: noiDung })
      .expect(201)
    const bai = tao.body.data
    assert.equal(bai.slug, "bai-thu-nghiem-dau-tien")
    assert.equal(bai.status, "draft")
    assert.equal(bai.content.content[2].type, "image")

    // Bản nháp không xuất hiện ở bất kỳ đâu công khai.
    assert.equal((await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data.articles.length, 0)
    await request(ungDung.app).get(`/api/v1/journal/articles/${bai.slug}`).expect(404)
    assert.doesNotMatch((await request(ungDung.app).get("/sitemap.xml").expect(200)).text, /bai-thu-nghiem/)

    const xb = await admin.post(`${API}/articles/${bai.id}/publish`).set("X-CSRF-Token", csrfAdmin).send({ version: bai.version }).expect(200)
    assert.equal(xb.body.data.status, "published")
    const chiTiet = (await request(ungDung.app).get(`/api/v1/journal/articles/${bai.slug}`).expect(200)).body.data
    assert.equal(chiTiet.title, "Bài thử nghiệm đầu tiên")
    assert.equal(chiTiet.content.content[2].attrs.src, anh.url)
    assert.equal(chiTiet.imageWidth, 1)
    const ngayXuatBan = chiTiet.date
    const sitemap = (await request(ungDung.app).get("/sitemap.xml").expect(200)).text
    assert.match(sitemap, /<loc>https:\/\/innerarchitect\.test\/journal\/bai-thu-nghiem-dau-tien<\/loc>/)

    // Sửa nháp: đổi tiêu đề và nội dung, bản công khai giữ nguyên, slug giữ nguyên.
    const luu = await admin
      .put(`${API}/articles/${bai.id}`)
      .set("X-CSRF-Token", csrfAdmin)
      .send({ title: "Tiêu đề mới", summary: "Giới thiệu mới", categoryId: muc, coverImage: anh.url, coverAlt: null, content: { type: "doc", content: [doan("Bản nháp mới")] }, version: xb.body.data.version })
      .expect(200)
    assert.equal(luu.body.data.hasDraftChanges, true)
    assert.equal(luu.body.data.slug, "bai-thu-nghiem-dau-tien")
    let congKhai = (await request(ungDung.app).get(`/api/v1/journal/articles/${bai.slug}`).expect(200)).body.data
    assert.equal(congKhai.title, "Bài thử nghiệm đầu tiên")
    assert.equal(congKhai.content.content[0].content[0].text, "Đoạn mở đầu.")

    const capNhat = await admin
      .post(`${API}/articles/${bai.id}/publish`)
      .set("X-CSRF-Token", csrfAdmin)
      .send({ version: luu.body.data.version })
      .expect(200)
    assert.equal(capNhat.body.data.hasDraftChanges, false)
    congKhai = (await request(ungDung.app).get(`/api/v1/journal/articles/${bai.slug}`).expect(200)).body.data
    assert.equal(congKhai.title, "Tiêu đề mới")
    assert.equal(congKhai.content.content[0].content[0].text, "Bản nháp mới")
    assert.equal(congKhai.date, ngayXuatBan, "ngày hiển thị là lần xuất bản đầu, không đổi khi cập nhật")

    // Bỏ thay đổi nháp đưa bản làm việc về bản công khai.
    const luu2 = await admin
      .put(`${API}/articles/${bai.id}`)
      .set("X-CSRF-Token", csrfAdmin)
      .send({ title: "Nháp sẽ bỏ", summary: "", categoryId: muc, content: { type: "doc", content: [] }, version: capNhat.body.data.version })
      .expect(200)
    const bo = await admin.post(`${API}/articles/${bai.id}/discard`).set("X-CSRF-Token", csrfAdmin).send({ version: luu2.body.data.version }).expect(200)
    assert.equal(bo.body.data.title, "Tiêu đề mới")
    assert.equal(bo.body.data.hasDraftChanges, false)

    // Gỡ xuất bản → biến mất khỏi trang công khai và sitemap.
    await admin.post(`${API}/articles/${bai.id}/unpublish`).set("X-CSRF-Token", csrfAdmin).send({ version: bo.body.data.version }).expect(200)
    await request(ungDung.app).get(`/api/v1/journal/articles/${bai.slug}`).expect(404)
    assert.doesNotMatch((await request(ungDung.app).get("/sitemap.xml").expect(200)).text, /bai-thu-nghiem/)
  })

  test("hai nhân viên lưu trên cùng một phiên bản: người sau nhận 409, không ghi đè", async () => {
    const muc = await taoMuc("Mục")
    const bai = (
      await admin.post(`${API}/articles`).set("X-CSRF-Token", csrfAdmin).send({ title: "Bài chung", categoryId: muc, content: { type: "doc" } }).expect(201)
    ).body.data
    const maNhanVien = await taoTaiKhoanThu(ungDung.pool, "bien.tap", "customer_care")
    await admin.patch(`${API}/staff/${maNhanVien}`).set("X-CSRF-Token", csrfAdmin).send({ canManageJournal: true }).expect(200)
    const nhanVien = request.agent(ungDung.app)
    const csrf = await dangNhap(nhanVien, "bien.tap")
    const duLieu = (title: string) => ({ title, categoryId: muc, content: { type: "doc", content: [doan(title)] }, version: bai.version })

    await admin.put(`${API}/articles/${bai.id}`).set("X-CSRF-Token", csrfAdmin).send(duLieu("Bản của admin")).expect(200)
    const res = await nhanVien.put(`${API}/articles/${bai.id}`).set("X-CSRF-Token", csrf).send(duLieu("Bản của nhân viên")).expect(409)
    assert.equal(res.body.error.code, "CONFLICT")
    assert.match(res.body.error.message, /Tài khoản thử admin\.thu/)
    assert.equal((await admin.get(`${API}/articles/${bai.id}`).expect(200)).body.data.title, "Bản của admin")
  })

  test("sắp xếp bài trong chuyên mục, chuyển chuyên mục giữ URL, tiêu biểu", async () => {
    const a = await taoMuc("Mục A")
    const b = await taoMuc("Mục B")
    const ids: number[] = []
    for (const ten of ["Một", "Hai", "Ba"]) {
      const bai = (await admin.post(`${API}/articles`).set("X-CSRF-Token", csrfAdmin).send({ title: `Bài ${ten}`, categoryId: a, content: { type: "doc" } }).expect(201)).body.data
      await admin.post(`${API}/articles/${bai.id}/publish`).set("X-CSRF-Token", csrfAdmin).send({ version: bai.version }).expect(200)
      ids.push(bai.id)
    }
    await admin.put(`${API}/categories/${a}/article-order`).set("X-CSRF-Token", csrfAdmin).send({ ids: [ids[2], ids[0], ids[1]] }).expect(200)
    let congKhai = (await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data
    assert.deepEqual(congKhai.articles.map((x: { title: string }) => x.title), ["Bài Ba", "Bài Một", "Bài Hai"])
    // Danh sách sai tập bài → 409.
    await admin.put(`${API}/categories/${a}/article-order`).set("X-CSRF-Token", csrfAdmin).send({ ids: [ids[0], ids[1]] }).expect(409)

    const baiMot = (await admin.get(`${API}/articles/${ids[0]}`).expect(200)).body.data
    const chuyen = await admin.patch(`${API}/articles/${ids[0]}/category`).set("X-CSRF-Token", csrfAdmin).send({ categoryId: b, version: baiMot.version }).expect(200)
    assert.equal(chuyen.body.data.slug, baiMot.slug)
    congKhai = (await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data
    assert.equal(congKhai.articles.find((x: { slug: string }) => x.slug === baiMot.slug).categoryId, b)
    await request(ungDung.app).get(`/api/v1/journal/articles/${baiMot.slug}`).expect(200)

    await admin.patch(`${API}/articles/${ids[1]}/featured`).set("X-CSRF-Token", csrfAdmin).send({ featured: true, version: (await admin.get(`${API}/articles/${ids[1]}`)).body.data.version }).expect(200)
    congKhai = (await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data
    assert.equal(congKhai.articles.find((x: { title: string }) => x.title === "Bài Hai").featured, true)

    // Lọc theo chuyên mục và trạng thái trong trang quản trị.
    const loc = (await admin.get(`${API}/articles?categoryId=${a}&status=published`).expect(200)).body.data
    assert.deepEqual(loc.map((x: { title: string }) => x.title), ["Bài Ba", "Bài Hai"])
    await admin.get(`${API}/articles?status=khac`).expect(400)

    // Chuyên mục bị ẩn → bài trong đó không còn công khai.
    const mucB = (await admin.get(`${API}/categories`)).body.data.find((m: { id: number }) => m.id === b)
    await admin.put(`${API}/categories/${b}`).set("X-CSRF-Token", csrfAdmin).send({ name: mucB.name, description: "", isPublic: false, version: mucB.version }).expect(200)
    await request(ungDung.app).get(`/api/v1/journal/articles/${baiMot.slug}`).expect(404)
  })

  test("nội dung có mã nhúng / giao thức nguy hiểm bị từ chối ở máy chủ", async () => {
    const muc = await taoMuc("Mục")
    const gui = (content: unknown) =>
      admin.post(`${API}/articles`).set("X-CSRF-Token", csrfAdmin).send({ title: "Thử mã độc", categoryId: muc, content })
    for (const node of [
      { type: "html", attrs: { html: "<script>alert(1)</script>" } },
      { type: "iframe", attrs: { src: "https://evil.example" } },
      { type: "paragraph", content: [{ type: "text", text: "x", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] },
      { type: "image", attrs: { src: "https://evil.example/x.png", alt: "" } },
    ]) {
      const res = await gui({ type: "doc", content: [node] }).expect(400)
      assert.equal(res.body.error.code, "VALIDATION_ERROR")
      assert.ok(res.body.error.fields.content)
    }
    // Ảnh hợp lệ về định dạng nhưng không có trong thư viện.
    await gui({ type: "doc", content: [{ type: "image", attrs: { src: "/media/journal/00000000-0000-4000-8000-000000000000.png" } }] }).expect(400)
    // Thuộc tính sự kiện bị lược bỏ, nội dung còn lại được lưu.
    const ok = await gui({ type: "doc", content: [{ type: "paragraph", attrs: { onclick: "alert(1)" }, content: [{ type: "text", text: "an toàn" }] }] }).expect(201)
    assert.deepEqual(ok.body.data.content.content[0], { type: "paragraph", content: [{ type: "text", text: "an toàn" }] })
  })

  test("tải ảnh: kiểm tra định dạng thật, dung lượng, lưu tên ngẫu nhiên, gỡ EXIF và phục vụ đúng kiểu", async () => {
    const anh = await taiAnh()
    assert.match(anh.url, /^\/media\/journal\/[a-f0-9-]{36}\.png$/)
    const tep = path.join(cfg.JOURNAL_UPLOAD_DIR, path.basename(anh.url))
    assert.ok(existsSync(tep))
    const phucVu = await request(ungDung.app).get(anh.url).expect(200)
    assert.equal(phucVu.headers["content-type"], "image/png")
    assert.equal(phucVu.headers["x-content-type-options"], "nosniff")

    const jpeg = await admin.post(`${API}/media`).set("X-CSRF-Token", csrfAdmin).set("Content-Type", "image/jpeg").send(anhJpegCoExif(6)).expect(201)
    const duLieuJpeg = readFileSync(path.join(cfg.JOURNAL_UPLOAD_DIR, path.basename(jpeg.body.data.url)))
    assert.ok(!duLieuJpeg.includes(Buffer.from("GPS-BI-MAT")))
    assert.deepEqual([jpeg.body.data.width, jpeg.body.data.height], [320, 240])

    // File HTML giả làm PNG.
    const gia = await admin
      .post(`${API}/media`)
      .set("X-CSRF-Token", csrfAdmin)
      .set("Content-Type", "image/png")
      .send(Buffer.from("<html><script>alert(1)</script></html>"))
      .expect(400)
    assert.equal(gia.body.error.code, "VALIDATION_ERROR")
    // Khai báo sai định dạng.
    await admin.post(`${API}/media`).set("X-CSRF-Token", csrfAdmin).set("Content-Type", "image/jpeg").send(ANH_PNG_1X1).expect(400)
    // SVG / GIF không được nhận.
    await admin.post(`${API}/media`).set("X-CSRF-Token", csrfAdmin).set("Content-Type", "image/svg+xml").send(Buffer.from("<svg/>")).expect(400)
    // Quá dung lượng (test cấu hình 1 MB).
    const qua = await admin
      .post(`${API}/media`)
      .set("X-CSRF-Token", csrfAdmin)
      .set("Content-Type", "image/png")
      .send(Buffer.concat([ANH_PNG_1X1, Buffer.alloc(1024 * 1024 + 10)]))
      .expect(413)
    assert.equal(qua.body.error.code, "PAYLOAD_TOO_LARGE")
    assert.match(qua.body.error.message, /1 MB/)

    const thuVien = (await admin.get(`${API}/media`).expect(200)).body
    assert.equal(thuVien.pagination.total, 2)
    assert.equal(thuVien.data.find((a: { url: string }) => a.url === anh.url).originalName, "ảnh thử.png")
  })

  test("xóa: bài nháp xóa được, bài đang công khai phải gỡ trước; chuyên mục còn bài và ảnh đang dùng bị chặn", async () => {
    const muc = await taoMuc("Mục xóa")
    const anh = await taiAnh()
    const bai = (
      await admin
        .post(`${API}/articles`)
        .set("X-CSRF-Token", csrfAdmin)
        .send({ title: "Bài sẽ xóa", categoryId: muc, coverImage: anh.url, content: { type: "doc", content: [doan("x")] } })
        .expect(201)
    ).body.data
    const xb = (await admin.post(`${API}/articles/${bai.id}/publish`).set("X-CSRF-Token", csrfAdmin).send({ version: bai.version }).expect(200)).body.data

    // Thiếu CSRF → 403; bài đang công khai → 409, không xóa.
    await admin.delete(`${API}/articles/${bai.id}`).send({ version: xb.version }).expect(403)
    const dangCK = await admin.delete(`${API}/articles/${bai.id}`).set("X-CSRF-Token", csrfAdmin).send({ version: xb.version }).expect(409)
    assert.match(dangCK.body.error.message, /gỡ xuất bản trước/)

    // Chuyên mục còn bài và ảnh đang làm ảnh bìa → bị chặn.
    const dsMuc = (await admin.get(`${API}/categories`)).body.data
    const verMuc = dsMuc.find((m: { id: number }) => m.id === muc).version
    const conBai = await admin.delete(`${API}/categories/${muc}`).set("X-CSRF-Token", csrfAdmin).send({ version: verMuc }).expect(409)
    assert.match(conBai.body.error.message, /còn 1 bài/)
    const maAnh = (await admin.get(`${API}/media`)).body.data[0].id
    const anhDung = await admin.delete(`${API}/media/${maAnh}`).set("X-CSRF-Token", csrfAdmin).expect(409)
    assert.match(anhDung.body.error.message, /Bài sẽ xóa/)

    // Gỡ xuất bản → xóa bài → phiên bản cũ bị từ chối, bài biến mất.
    const go = (await admin.post(`${API}/articles/${bai.id}/unpublish`).set("X-CSRF-Token", csrfAdmin).send({ version: xb.version }).expect(200)).body.data
    await admin.delete(`${API}/articles/${bai.id}`).set("X-CSRF-Token", csrfAdmin).send({ version: xb.version }).expect(409)
    await admin.delete(`${API}/articles/${bai.id}`).set("X-CSRF-Token", csrfAdmin).send({ version: go.version }).expect(200)
    await admin.get(`${API}/articles/${bai.id}`).expect(404)

    // Ảnh không còn dùng → xóa được cả bản ghi lẫn file.
    const tep = path.join(cfg.JOURNAL_UPLOAD_DIR, path.basename(anh.url))
    assert.ok(existsSync(tep))
    await admin.delete(`${API}/media/${maAnh}`).set("X-CSRF-Token", csrfAdmin).expect(200)
    assert.ok(!existsSync(tep))
    await request(ungDung.app).get(anh.url).expect(404)

    // Chuyên mục đã trống → xóa được; không còn trên API công khai.
    await admin.delete(`${API}/categories/${muc}`).set("X-CSRF-Token", csrfAdmin).send({ version: verMuc }).expect(200)
    const ck = (await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data
    assert.equal(ck.categories.some((m: { id: number }) => m.id === muc), false)

    // Nhân viên không có quyền Journal không xóa được.
    await taoTaiKhoanThu(ungDung.pool, "cc.xoa", "customer_care")
    const cc = request.agent(ungDung.app)
    const csrfCc = await dangNhap(cc, "cc.xoa")
    await cc.delete(`${API}/media/1`).set("X-CSRF-Token", csrfCc).expect(403)
  })

  test("API quản trị Journal có giới hạn tần suất riêng, không ăn vào giới hạn chung của trang công khai", async () => {
    const rieng = taoUngDungTest(cfg, { bieuMau: 1000, dangNhap: 1000, chung: 1000, cuaSoMs: 60_000, quanTriJournal: 3 })
    try {
      for (let i = 0; i < 3; i++) await request(rieng.app).get(`${API}/categories`).expect(401)
      const res = await request(rieng.app).get(`${API}/categories`).expect(429)
      assert.equal(res.body.error.code, "RATE_LIMITED")
      await request(rieng.app).get("/api/v1/journal").expect(200)
    } finally {
      await rieng.dongTatCa()
    }
  })

  test("nhập dữ liệu cũ: 6 chuyên mục, 28 bài, giữ thứ tự/URL; chạy lại không thêm trùng, không ghi đè", async () => {
    const ketNoi = await mysql.createConnection({
      host: cfg.DB_HOST,
      port: cfg.DB_PORT,
      user: cfg.DB_USER,
      password: cfg.DB_PASSWORD,
      database: cfg.DB_NAME,
      timezone: "Z",
    })
    try {
      const lan1 = await nhapSeedJournal(ketNoi)
      assert.deepEqual(lan1, { chuyenMucThem: 6, chuyenMucCoSan: 0, baiThem: 28, baiCoSan: 0 })

      const congKhai = (await request(ungDung.app).get("/api/v1/journal").expect(200)).body.data
      assert.equal(congKhai.categories.length, 6)
      assert.equal(congKhai.articles.length, 28)
      assert.deepEqual(congKhai.categories.map((m: { label: string }) => m.label), [
        "Hiểu mình",
        "Mối quan hệ",
        "Minh triết",
        "Tarot",
        "Sống tỉnh thức",
        "The Hermit",
      ])
      assert.equal(congKhai.categories[0].slug, "01")
      assert.equal(congKhai.articles[0].slug, "ban-la-ai-khi-khong-con-phai-lam-hai-long-tat-ca")
      assert.equal(congKhai.articles[0].date, "2025-03-10T00:00:00.000Z")
      assert.equal(congKhai.articles[0].image, "/assets/journal/goc/hinh07.webp")
      assert.equal(congKhai.articles.filter((b: { featured: boolean }) => b.featured).length, 6)
      const chiTiet = (await request(ungDung.app).get("/api/v1/journal/articles/ban-la-ai-khi-khong-con-phai-lam-hai-long-tat-ca").expect(200)).body.data
      assert.equal(chiTiet.content.content[0].content[0].text.slice(0, 30), "Có khi nào bạn vừa gật đầu nói")

      // Sửa một bài trong trang quản trị rồi chạy lại import: không bị ghi đè.
      const baiQuanTri = (await admin.get(`${API}/articles`).expect(200)).body.data[0]
      const full = (await admin.get(`${API}/articles/${baiQuanTri.id}`)).body.data
      await admin
        .put(`${API}/articles/${full.id}`)
        .set("X-CSRF-Token", csrfAdmin)
        .send({ title: "Đã sửa trong admin", summary: full.summary, categoryId: full.categoryId, coverImage: full.coverImage, coverAlt: null, content: full.content, version: full.version })
        .expect(200)
      const lan2 = await nhapSeedJournal(ketNoi)
      assert.deepEqual(lan2, { chuyenMucThem: 0, chuyenMucCoSan: 6, baiThem: 0, baiCoSan: 28 })
      assert.equal((await admin.get(`${API}/articles/${full.id}`)).body.data.title, "Đã sửa trong admin")

      const sitemap = (await request(ungDung.app).get("/sitemap.xml").expect(200)).text
      assert.equal(sitemap.match(/\/journal\/[a-z0-9-]+<\/loc>/g)?.length, 28)
      assert.match(sitemap, /<loc>https:\/\/innerarchitect\.test\/lien-he<\/loc>/)
    } finally {
      await ketNoi.end()
    }
  })
})
