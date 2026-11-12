import assert from "node:assert/strict"
import { after, before, beforeEach, describe, test } from "node:test"
import type { RowDataPacket } from "mysql2/promise"
import request from "supertest"
import { taoUngDung } from "../src/app.ts"
import { taoPoolKetNoi } from "../src/config/database.ts"
import { THONG_DIEP_DA_TIEP_NHAN } from "../src/modules/customers/customers.routes.ts"
import {
  chuanBiSchemaTest,
  coDatabaseTest,
  docCauHinhTest,
  donDuLieuTest,
  KHACH_HANG_MAU,
  MAT_KHAU_THU,
  taoTaiKhoanThu,
  taoUngDungTest,
} from "./ho-tro.ts"

const cauHinh = docCauHinhTest()
const coDb = await coDatabaseTest(cauHinh)
const lyDoBoQua = coDb ? false : "Chưa có MySQL test (cấu hình TEST_DB_NAME trong server/.env)"

/**
 * Đăng nhập bằng agent (giữ cookie) và trả CSRF token.
 *
 * @param agent - Supertest agent
 * @param username - Username tài khoản thử
 * @returns CSRF token của phiên
 */
async function dangNhap(agent: request.Agent, username: string): Promise<string> {
  const res = await agent
    .post("/api/v1/auth/login")
    .send({ username, password: MAT_KHAU_THU })
    .expect(200)
  return res.body.data.csrfToken as string
}

describe("API tích hợp với MySQL", { skip: lyDoBoQua }, () => {
  // `cauHinh` chắc chắn có khi không bị skip.
  const cfg = cauHinh!
  let ungDung: ReturnType<typeof taoUngDungTest>

  before(async () => {
    await chuanBiSchemaTest(cfg)
    // Ngưỡng cao để test chức năng không chạm rate limit; rate limit có suite riêng bên dưới.
    ungDung = taoUngDungTest(cfg, { bieuMau: 1000, dangNhap: 1000, chung: 10_000, cuaSoMs: 60_000 })
  })
  after(async () => {
    await donDuLieuTest(ungDung.pool)
    await ungDung.dongTatCa()
  })
  beforeEach(async () => {
    await donDuLieuTest(ungDung.pool)
  })

  test("GET /health báo database ok", async () => {
    const res = await request(ungDung.app).get("/api/v1/health").expect(200)
    assert.equal(res.body.database, "ok")
    assert.equal(res.headers["cache-control"], "no-store")
    assert.equal(res.headers["x-powered-by"], undefined)
  })

  test("POST /customers lưu vào MySQL và chỉ trả 201 + thông điệp, không trả PII", async () => {
    const res = await request(ungDung.app)
      .post("/api/v1/customers")
      .send({ ...KHACH_HANG_MAU, phone: "090 123 4567" })
      .expect(201)
    assert.deepEqual(res.body, { success: true, message: THONG_DIEP_DA_TIEP_NHAN })
    assert.equal(res.headers["set-cookie"], undefined, "API công khai không tạo session")

    const [dong] = await ungDung.pool.query<RowDataPacket[]>(
      "SELECT full_name, phone, email, service, source, status, consent_at, TIMESTAMPDIFF(SECOND, consent_at, UTC_TIMESTAMP()) AS lech FROM customers",
    )
    assert.equal(dong.length, 1)
    assert.equal(dong[0]?.full_name, KHACH_HANG_MAU.fullName)
    assert.equal(dong[0]?.phone, "0901234567")
    assert.equal(dong[0]?.email, KHACH_HANG_MAU.email)
    assert.equal(dong[0]?.source, "website")
    assert.equal(dong[0]?.status, "new")
    assert.ok(Math.abs(Number(dong[0]?.lech)) < 60, "consent_at lưu theo UTC")
  })

  test("POST /customers từ chối dữ liệu sai và không ghi DB", async () => {
    const res = await request(ungDung.app)
      .post("/api/v1/customers")
      .send({ fullName: "", phone: "x", service: "spa", consent: false, extra: 1 })
      .expect(400)
    assert.equal(res.body.error.code, "VALIDATION_ERROR")
    for (const truong of ["fullName", "phone", "service", "consent", "extra"])
      assert.ok(res.body.error.fields[truong], truong)

    await request(ungDung.app)
      .post("/api/v1/customers")
      .set("Content-Type", "application/json")
      .send("{khong-phai-json")
      .expect(400)
    await request(ungDung.app)
      .post("/api/v1/customers")
      .send({ ...KHACH_HANG_MAU, fullName: "A".repeat(20_000) })
      .expect(413)

    const [dong] = await ungDung.pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM customers")
    assert.equal(Number(dong[0]?.n), 0)
  })

  test("chặn request thay đổi dữ liệu từ origin lạ", async () => {
    await request(ungDung.app)
      .post("/api/v1/customers")
      .set("Origin", "https://evil.example")
      .send(KHACH_HANG_MAU)
      .expect(403)
    await request(ungDung.app)
      .post("/api/v1/customers")
      .set("Origin", cfg.ALLOWED_ORIGINS[0] ?? "http://localhost:8443")
      .send(KHACH_HANG_MAU)
      .expect(201)
  })

  test("người chưa đăng nhập không truy cập được API quản trị", async () => {
    for (const duongDan of ["/api/v1/admin/customers", "/api/v1/admin/customers/1", "/api/v1/admin/statistics", "/api/v1/auth/me"])
      await request(ungDung.app).get(duongDan).expect(401)
    await request(ungDung.app)
      .patch("/api/v1/admin/customers/1/status")
      .send({ status: "contacted" })
      .expect(401)
    await request(ungDung.app).post("/api/v1/auth/logout").expect(401)
  })

  test("đăng nhập sai trả 401 cùng thông điệp; tài khoản bị khóa không đăng nhập được", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.thu")
    const saiMatKhau = await request(ungDung.app)
      .post("/api/v1/auth/login")
      .send({ username: "cc.thu", password: "sai-mat-khau-hoan-toan" })
      .expect(401)
    const khongTonTai = await request(ungDung.app)
      .post("/api/v1/auth/login")
      .send({ username: "khong.ton.tai", password: "sai-mat-khau-hoan-toan" })
      .expect(401)
    assert.equal(saiMatKhau.body.error.message, khongTonTai.body.error.message)

    await ungDung.pool.query("UPDATE admins SET is_active = 0 WHERE username = 'cc.thu'")
    await request(ungDung.app)
      .post("/api/v1/auth/login")
      .send({ username: "cc.thu", password: MAT_KHAU_THU })
      .expect(401)
    await request(ungDung.app)
      .post("/api/v1/auth/login")
      .send({ username: "cc.thu", password: MAT_KHAU_THU, role: "admin" })
      .expect(400)
  })

  test("luồng quản trị: đăng nhập, xem, tìm, lọc, phân trang, cập nhật trạng thái, thống kê, đăng xuất", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.thu", "customer_care")
    const congKhai = request(ungDung.app)
    const mau = [
      { fullName: "Lê Văn Một", phone: "0911111111", email: "mot@example.com", service: "tea" },
      { fullName: "Phạm Thị Hai", phone: "0922222222", email: null, service: "tarot" },
      { fullName: "Hoàng Ba", phone: "+84933333333", email: "ba_50@example.com", service: "tarot" },
    ]
    for (const kh of mau) await congKhai.post("/api/v1/customers").send({ ...kh, consent: true }).expect(201)

    const agent = request.agent(ungDung.app)
    const res = await agent
      .post("/api/v1/auth/login")
      .send({ username: "cc.thu", password: MAT_KHAU_THU })
      .expect(200)
    const cookie = String(res.headers["set-cookie"])
    assert.match(cookie, /ia_sid=/)
    assert.match(cookie, /HttpOnly/i)
    assert.match(cookie, /SameSite=Strict/i)
    assert.match(cookie, /Path=\/api/)
    assert.equal(res.body.data.admin.role, "customer_care")
    assert.equal(res.body.data.admin.password_hash, undefined)
    const csrf = res.body.data.csrfToken as string

    const me = await agent.get("/api/v1/auth/me").expect(200)
    assert.equal(me.body.data.admin.username, "cc.thu")
    assert.equal(me.body.data.csrfToken, csrf)

    const tatCa = await agent.get("/api/v1/admin/customers").expect(200)
    assert.equal(tatCa.body.pagination.total, 3)
    assert.equal(tatCa.body.data[0].fullName, "Hoàng Ba", "mới nhất trước")

    const timTen = await agent.get("/api/v1/admin/customers").query({ q: "Phạm" }).expect(200)
    assert.deepEqual(timTen.body.data.map((k: { fullName: string }) => k.fullName), ["Phạm Thị Hai"])
    const timSo = await agent.get("/api/v1/admin/customers").query({ q: "0911" }).expect(200)
    assert.equal(timSo.body.pagination.total, 1)
    // Nếu không thoát ký tự, "a%" sẽ khớp mọi tên có chữ "a"; đã thoát thì phải khớp nguyên văn → 0.
    const timKyTuDacBiet = await agent.get("/api/v1/admin/customers").query({ q: "a%" }).expect(200)
    assert.equal(timKyTuDacBiet.body.pagination.total, 0, "% được so khớp nguyên văn")
    const timGachDuoi = await agent.get("/api/v1/admin/customers").query({ q: "ba_50" }).expect(200)
    assert.equal(timGachDuoi.body.pagination.total, 1)
    const locDichVu = await agent.get("/api/v1/admin/customers").query({ service: "tarot" }).expect(200)
    assert.equal(locDichVu.body.pagination.total, 2)
    const phanTrang = await agent.get("/api/v1/admin/customers").query({ pageSize: 2, page: 2 }).expect(200)
    assert.equal(phanTrang.body.data.length, 1)
    assert.equal(phanTrang.body.pagination.totalPages, 2)
    await agent.get("/api/v1/admin/customers").query({ status: "xoa" }).expect(400)

    const id = tatCa.body.data[0].id as number
    const chiTiet = await agent.get(`/api/v1/admin/customers/${id}`).expect(200)
    assert.equal(chiTiet.body.data.phone, "+84933333333")
    assert.match(chiTiet.body.data.createdAt, /Z$/)
    await agent.get("/api/v1/admin/customers/999999").expect(404)
    await agent.get("/api/v1/admin/customers/abc").expect(400)

    // Thiếu / sai CSRF → 403, trạng thái giữ nguyên.
    await agent.patch(`/api/v1/admin/customers/${id}/status`).send({ status: "contacted" }).expect(403)
    await agent
      .patch(`/api/v1/admin/customers/${id}/status`)
      .set("X-CSRF-Token", "sai")
      .send({ status: "contacted" })
      .expect(403)
    const capNhat = await agent
      .patch(`/api/v1/admin/customers/${id}/status`)
      .set("X-CSRF-Token", csrf)
      .send({ status: "contacted" })
      .expect(200)
    assert.equal(capNhat.body.data.status, "contacted")
    await agent
      .patch(`/api/v1/admin/customers/${id}/status`)
      .set("X-CSRF-Token", csrf)
      .send({ status: "deleted" })
      .expect(400)
    await agent
      .patch("/api/v1/admin/customers/999999/status")
      .set("X-CSRF-Token", csrf)
      .send({ status: "completed" })
      .expect(404)

    const locTrangThai = await agent.get("/api/v1/admin/customers").query({ status: "contacted" }).expect(200)
    assert.equal(locTrangThai.body.pagination.total, 1)
    const thongKe = await agent.get("/api/v1/admin/statistics").expect(200)
    assert.deepEqual(thongKe.body.data, { total: 3, new: 2, contacted: 1, completed: 0 })

    await agent.post("/api/v1/auth/logout").expect(403)
    await agent.post("/api/v1/auth/logout").set("X-CSRF-Token", csrf).expect(200)
    await agent.get("/api/v1/auth/me").expect(401)
    await agent.get("/api/v1/admin/customers").expect(401)
  })

  test("đăng nhập tạo session ID mới (chống session fixation)", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.thu")
    const agent = request.agent(ungDung.app)
    const lan1 = await agent.post("/api/v1/auth/login").send({ username: "cc.thu", password: MAT_KHAU_THU }).expect(200)
    const lan2 = await agent.post("/api/v1/auth/login").send({ username: "cc.thu", password: MAT_KHAU_THU }).expect(200)
    const layId = (r: request.Response) => String(r.headers["set-cookie"]).match(/ia_sid=([^;]+)/)?.[1]
    assert.ok(layId(lan1))
    assert.notEqual(layId(lan1), layId(lan2))
    assert.notEqual(lan1.body.data.csrfToken, lan2.body.data.csrfToken)
  })

  test("tài khoản bị khóa giữa phiên mất quyền ngay ở request tiếp theo", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.thu")
    const agent = request.agent(ungDung.app)
    await dangNhap(agent, "cc.thu")
    await agent.get("/api/v1/admin/statistics").expect(200)
    await ungDung.pool.query("UPDATE admins SET is_active = 0 WHERE username = 'cc.thu'")
    await agent.get("/api/v1/admin/statistics").expect(401)
  })

  test("session lưu trong MySQL, không có mật khẩu trong dữ liệu session", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.thu")
    await dangNhap(request.agent(ungDung.app), "cc.thu")
    const [dong] = await ungDung.pool.query<RowDataPacket[]>("SELECT data FROM sessions")
    assert.equal(dong.length, 1)
    assert.doesNotMatch(String(dong[0]?.data), new RegExp(MAT_KHAU_THU))
    assert.doesNotMatch(String(dong[0]?.data), /argon2/)
  })
})

describe("rate limiting", { skip: lyDoBoQua }, () => {
  const cfg = cauHinh!
  let ungDung: ReturnType<typeof taoUngDungTest>
  before(async () => {
    ungDung = taoUngDungTest(cfg, { bieuMau: 2, dangNhap: 2, chung: 1000, cuaSoMs: 60_000 })
    await donDuLieuTest(ungDung.pool)
  })
  after(async () => {
    await donDuLieuTest(ungDung.pool)
    await ungDung.dongTatCa()
  })

  test("biểu mẫu trả 429 khi vượt giới hạn", async () => {
    await request(ungDung.app).post("/api/v1/customers").send(KHACH_HANG_MAU).expect(201)
    await request(ungDung.app).post("/api/v1/customers").send(KHACH_HANG_MAU).expect(201)
    const res = await request(ungDung.app).post("/api/v1/customers").send(KHACH_HANG_MAU).expect(429)
    assert.equal(res.body.error.code, "RATE_LIMITED")
  })

  test("đăng nhập sai liên tục bị chặn 429, kể cả khi sau đó nhập đúng", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.khoa")
    for (let i = 0; i < 2; i++)
      await request(ungDung.app)
        .post("/api/v1/auth/login")
        .send({ username: "cc.khoa", password: "sai-mat-khau-hoan-toan" })
        .expect(401)
    await request(ungDung.app)
      .post("/api/v1/auth/login")
      .send({ username: "cc.khoa", password: MAT_KHAU_THU })
      .expect(429)
  })
})

describe("database không khả dụng", { skip: lyDoBoQua }, () => {
  test("health và gửi biểu mẫu trả 503, không lộ chi tiết lỗi", async () => {
    // Cổng 1 không có MySQL → ECONNREFUSED.
    const cfg = { ...cauHinh!, DB_PORT: 1 }
    const pool = taoPoolKetNoi(cfg, { connectTimeout: 1000 })
    const { app, dong } = taoUngDung({ pool, cauHinh: cfg, batLog: false })
    const loiGoc = console.error
    console.error = () => {}
    try {
      const health = await request(app).get("/api/v1/health").expect(503)
      assert.equal(health.body.database, "unavailable")
      const res = await request(app).post("/api/v1/customers").send(KHACH_HANG_MAU).expect(503)
      assert.equal(res.body.error.code, "SERVICE_UNAVAILABLE")
      const noiDung = JSON.stringify(res.body)
      for (const nhayCam of ["ECONNREFUSED", "127.0.0.1", cfg.DB_USER, "stack"])
        assert.ok(!noiDung.includes(nhayCam), nhayCam)
      await request(app).post("/api/v1/auth/login").send({ username: "a", password: "b" }).expect(503)
    } finally {
      console.error = loiGoc
      await dong().catch(() => undefined)
      await pool.end().catch(() => undefined)
    }
  })
})
