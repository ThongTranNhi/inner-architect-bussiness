import assert from "node:assert/strict"
import { after, before, beforeEach, describe, test } from "node:test"
import type { RowDataPacket } from "mysql2/promise"
import request from "supertest"
import type { CauHinh } from "../src/config/env.ts"
import {
  chuanBiSchemaTest,
  coDatabaseTest,
  docCauHinhTest,
  donDuLieuTest,
  MAT_KHAU_THU,
  taoTaiKhoanThu,
  taoUngDungTest,
} from "./ho-tro.ts"

// Dữ liệu giả, chỉ dùng trong test. PIN có số 0 ở đầu để kiểm tra xử lý dạng chuỗi.
const PIN_KHOI_TAO = "012345"
const PIN_MOI = "00998877"
const MAT_KHAU_MOI = "mat-khau-moi-chi-dung-trong-test-456"

const cauHinhGoc = docCauHinhTest()
const coDb = await coDatabaseTest(cauHinhGoc)
const lyDoBoQua = coDb ? false : "Chưa có MySQL test (cấu hình TEST_DB_NAME trong server/.env)"

const GIOI_HAN_CAO = { bieuMau: 1000, dangNhap: 1000, chung: 10_000, cuaSoMs: 60_000, xacMinh: 1000 }

/**
 * Mở khóa (nếu có PIN) rồi đăng nhập; trả CSRF token của phiên.
 *
 * @param agent - Supertest agent giữ cookie
 * @param username - Username tài khoản thử
 * @param tuyChon.pin - PIN mở khóa; bỏ trống khi chưa bật PIN
 * @param tuyChon.matKhau - Mật khẩu (mặc định `MAT_KHAU_THU`)
 * @returns CSRF token
 */
async function moKhoaVaDangNhap(
  agent: request.Agent,
  username: string,
  tuyChon: { pin?: string; matKhau?: string } = {},
): Promise<string> {
  if (tuyChon.pin) await agent.post("/api/v1/auth/unlock").send({ pin: tuyChon.pin }).expect(200)
  const res = await agent
    .post("/api/v1/auth/login")
    .send({ username, password: tuyChon.matKhau ?? MAT_KHAU_THU })
    .expect(200)
  return res.body.data.csrfToken as string
}

/** Kiểm tra phản hồi không lộ PIN, mật khẩu hay bản băm. */
function khongLoBiMat(res: request.Response) {
  const noiDung = JSON.stringify(res.body)
  for (const biMat of [PIN_KHOI_TAO, PIN_MOI, MAT_KHAU_THU, MAT_KHAU_MOI, "argon2", "hash"])
    assert.ok(!noiDung.includes(biMat), `phản hồi chứa "${biMat}"`)
}

describe("Bảo mật tài khoản: PIN mở khóa", { skip: lyDoBoQua }, () => {
  const cfg: CauHinh = { ...cauHinhGoc!, ADMIN_UNLOCK_PIN: PIN_KHOI_TAO }
  let ungDung: ReturnType<typeof taoUngDungTest>

  before(async () => {
    await chuanBiSchemaTest(cfg)
    ungDung = taoUngDungTest(cfg, GIOI_HAN_CAO)
  })
  after(async () => {
    await donDuLieuTest(ungDung.pool)
    await ungDung.dongTatCa()
  })
  beforeEach(async () => {
    await donDuLieuTest(ungDung.pool)
  })

  test("luồng đăng nhập: phải mở khóa bằng PIN trước khi đăng nhập", async () => {
    await taoTaiKhoanThu(ungDung.pool, "ad.thu", "admin")
    const agent = request.agent(ungDung.app)
    const me = await agent.get("/api/v1/auth/me").expect(401)
    assert.equal(me.body.error.code, "ADMIN_PIN_REQUIRED")
    const login = await agent.post("/api/v1/auth/login").send({ username: "ad.thu", password: MAT_KHAU_THU }).expect(401)
    assert.equal(login.body.error.code, "ADMIN_PIN_REQUIRED")
    await agent.post("/api/v1/auth/unlock").send({ pin: "123456" }).expect(403)
    // PIN là chuỗi: "12345" (mất số 0 đầu) không hợp lệ.
    await agent.post("/api/v1/auth/unlock").send({ pin: 12345 }).expect(400)
    await moKhoaVaDangNhap(agent, "ad.thu", { pin: PIN_KHOI_TAO })
    await agent.get("/api/v1/auth/me").expect(200)
  })

  test("chỉ vai trò admin được đổi PIN (kiểm tra ở backend)", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.thu", "customer_care")
    const agent = request.agent(ungDung.app)
    const csrf = await moKhoaVaDangNhap(agent, "cc.thu", { pin: PIN_KHOI_TAO })
    const trangThai = await agent.get("/api/v1/account/security").expect(200)
    assert.deepEqual(trangThai.body.data, { pinEnabled: true, canChangePin: false })
    const res = await agent
      .post("/api/v1/account/pin")
      .set("X-CSRF-Token", csrf)
      .send({ currentPin: PIN_KHOI_TAO, password: MAT_KHAU_THU, newPin: PIN_MOI, confirmPin: PIN_MOI })
      .expect(403)
    assert.equal(res.body.error.code, "FORBIDDEN")
    const [dong] = await ungDung.pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM admin_settings")
    assert.equal(Number(dong[0]?.n), 0)
  })

  test("thiếu CSRF bị từ chối; chưa đăng nhập bị từ chối", async () => {
    await taoTaiKhoanThu(ungDung.pool, "ad.thu", "admin")
    const agent = request.agent(ungDung.app)
    await moKhoaVaDangNhap(agent, "ad.thu", { pin: PIN_KHOI_TAO })
    const pin = await agent
      .post("/api/v1/account/pin")
      .send({ currentPin: PIN_KHOI_TAO, password: MAT_KHAU_THU, newPin: PIN_MOI, confirmPin: PIN_MOI })
      .expect(403)
    assert.equal(pin.body.error.code, "CSRF_INVALID")
    const mk = await agent
      .post("/api/v1/account/password")
      .set("X-CSRF-Token", "sai-token")
      .send({ currentPassword: MAT_KHAU_THU, newPassword: MAT_KHAU_MOI, confirmPassword: MAT_KHAU_MOI })
      .expect(403)
    assert.equal(mk.body.error.code, "CSRF_INVALID")
    await request(ungDung.app).get("/api/v1/account/security").expect(401)
  })

  test("sai PIN hiện tại hoặc sai mật khẩu: không đổi PIN, thông điệp chung", async () => {
    await taoTaiKhoanThu(ungDung.pool, "ad.thu", "admin")
    const agent = request.agent(ungDung.app)
    const csrf = await moKhoaVaDangNhap(agent, "ad.thu", { pin: PIN_KHOI_TAO })
    for (const sai of [
      { currentPin: "999999", password: MAT_KHAU_THU },
      { currentPin: PIN_KHOI_TAO, password: "sai-mat-khau-hoan-toan" },
    ]) {
      const res = await agent
        .post("/api/v1/account/pin")
        .set("X-CSRF-Token", csrf)
        .send({ ...sai, newPin: PIN_MOI, confirmPin: PIN_MOI })
        .expect(403)
      assert.equal(res.body.error.message, "PIN hiện tại hoặc mật khẩu không đúng.")
      khongLoBiMat(res)
    }
    const loi = await agent
      .post("/api/v1/account/pin")
      .set("X-CSRF-Token", csrf)
      .send({ currentPin: PIN_KHOI_TAO, password: MAT_KHAU_THU, newPin: "1234", confirmPin: "4321" })
      .expect(400)
    assert.ok(loi.body.error.fields.newPin)
    assert.ok(loi.body.error.fields.confirmPin)
    const [dong] = await ungDung.pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM admin_settings")
    assert.equal(Number(dong[0]?.n), 0)
  })

  test("đổi PIN: PIN cũ hết hiệu lực, lượt mở khóa cũ phải nhập lại, lưu Argon2id và vẫn đúng sau khởi động lại", async () => {
    await taoTaiKhoanThu(ungDung.pool, "ad.thu", "admin")
    await taoTaiKhoanThu(ungDung.pool, "cc.thu", "customer_care")

    // Một người đã mở khóa bằng PIN cũ nhưng chưa đăng nhập.
    const dangCho = request.agent(ungDung.app)
    await dangCho.post("/api/v1/auth/unlock").send({ pin: PIN_KHOI_TAO }).expect(200)

    const admin = request.agent(ungDung.app)
    const csrf = await moKhoaVaDangNhap(admin, "ad.thu", { pin: PIN_KHOI_TAO })
    const res = await admin
      .post("/api/v1/account/pin")
      .set("X-CSRF-Token", csrf)
      .send({ currentPin: PIN_KHOI_TAO, password: MAT_KHAU_THU, newPin: PIN_MOI, confirmPin: PIN_MOI })
      .expect(200)
    khongLoBiMat(res)

    // Phiên admin đang đăng nhập vẫn hoạt động.
    await admin.get("/api/v1/auth/me").expect(200)

    // Lượt mở khóa chưa hoàn tất bằng PIN cũ không đăng nhập được nữa.
    const cu = await dangCho.post("/api/v1/auth/login").send({ username: "cc.thu", password: MAT_KHAU_THU }).expect(401)
    assert.equal(cu.body.error.code, "ADMIN_PIN_REQUIRED")

    await request(ungDung.app).post("/api/v1/auth/unlock").send({ pin: PIN_KHOI_TAO }).expect(403)
    await moKhoaVaDangNhap(request.agent(ungDung.app), "cc.thu", { pin: PIN_MOI })

    const [dong] = await ungDung.pool.query<RowDataPacket[]>(
      "SELECT value_hash, version, updated_by FROM admin_settings WHERE setting_key = 'unlock_pin'",
    )
    assert.match(String(dong[0]?.value_hash), /^\$argon2id\$/)
    assert.ok(!String(dong[0]?.value_hash).includes(PIN_MOI))
    assert.equal(Number(dong[0]?.version), 1)

    // Khởi động lại backend (app + pool mới, .env vẫn là PIN khởi tạo cũ): MySQL là nguồn chính.
    const moi = taoUngDungTest(cfg, GIOI_HAN_CAO)
    try {
      await request(moi.app).post("/api/v1/auth/unlock").send({ pin: PIN_KHOI_TAO }).expect(403)
      await moKhoaVaDangNhap(request.agent(moi.app), "ad.thu", { pin: PIN_MOI })
    } finally {
      await moi.dongTatCa()
    }
  })

  test("hai yêu cầu đổi PIN đồng thời: chỉ một thành công, PIN cũ không ghi đè", async () => {
    await taoTaiKhoanThu(ungDung.pool, "ad.thu", "admin")
    const agent = request.agent(ungDung.app)
    const csrf = await moKhoaVaDangNhap(agent, "ad.thu", { pin: PIN_KHOI_TAO })
    const gui = (newPin: string) =>
      agent
        .post("/api/v1/account/pin")
        .set("X-CSRF-Token", csrf)
        .send({ currentPin: PIN_KHOI_TAO, password: MAT_KHAU_THU, newPin, confirmPin: newPin })
    const ketQua = await Promise.all([gui("11112222"), gui("33334444")])
    const trangThai = ketQua.map((r) => r.status).sort()
    assert.equal(trangThai.filter((s) => s === 200).length, 1, `kết quả: ${trangThai.join(",")}`)
    assert.ok(trangThai.every((s) => [200, 403, 409].includes(s)), `kết quả: ${trangThai.join(",")}`)
    const thang = ketQua[0]!.status === 200 ? "11112222" : "33334444"
    const thua = thang === "11112222" ? "33334444" : "11112222"
    await request(ungDung.app).post("/api/v1/auth/unlock").send({ pin: thua }).expect(403)
    await request(ungDung.app).post("/api/v1/auth/unlock").send({ pin: thang }).expect(200)
  })
})

describe("Bảo mật tài khoản: chưa bật PIN", { skip: lyDoBoQua }, () => {
  const cfg: CauHinh = { ...cauHinhGoc!, ADMIN_UNLOCK_PIN: undefined }
  let ungDung: ReturnType<typeof taoUngDungTest>
  before(async () => {
    await chuanBiSchemaTest(cfg)
    ungDung = taoUngDungTest(cfg, GIOI_HAN_CAO)
    await donDuLieuTest(ungDung.pool)
  })
  after(async () => {
    await donDuLieuTest(ungDung.pool)
    await ungDung.dongTatCa()
  })

  test("admin đặt PIN lần đầu không cần PIN hiện tại; sau đó đăng nhập phải mở khóa", async () => {
    await taoTaiKhoanThu(ungDung.pool, "ad.thu", "admin")
    const agent = request.agent(ungDung.app)
    const csrf = await moKhoaVaDangNhap(agent, "ad.thu")
    const trangThai = await agent.get("/api/v1/account/security").expect(200)
    assert.deepEqual(trangThai.body.data, { pinEnabled: false, canChangePin: true })
    await agent
      .post("/api/v1/account/pin")
      .set("X-CSRF-Token", csrf)
      .send({ password: MAT_KHAU_THU, newPin: PIN_MOI, confirmPin: PIN_MOI })
      .expect(200)
    const login = await request(ungDung.app)
      .post("/api/v1/auth/login")
      .send({ username: "ad.thu", password: MAT_KHAU_THU })
      .expect(401)
    assert.equal(login.body.error.code, "ADMIN_PIN_REQUIRED")
    await moKhoaVaDangNhap(request.agent(ungDung.app), "ad.thu", { pin: PIN_MOI })
  })
})

describe("Bảo mật tài khoản: đổi mật khẩu", { skip: lyDoBoQua }, () => {
  const cfg: CauHinh = { ...cauHinhGoc!, ADMIN_UNLOCK_PIN: PIN_KHOI_TAO }
  let ungDung: ReturnType<typeof taoUngDungTest>
  before(async () => {
    await chuanBiSchemaTest(cfg)
    ungDung = taoUngDungTest(cfg, GIOI_HAN_CAO)
  })
  after(async () => {
    await donDuLieuTest(ungDung.pool)
    await ungDung.dongTatCa()
  })
  beforeEach(async () => {
    await donDuLieuTest(ungDung.pool)
  })

  test("nhân viên đổi mật khẩu của chính mình; mọi phiên của tài khoản bị thu hồi, kể cả phiên hiện tại", async () => {
    const maCc = await taoTaiKhoanThu(ungDung.pool, "cc.thu", "customer_care")
    await taoTaiKhoanThu(ungDung.pool, "cc.khac", "customer_care")

    const phienHienTai = request.agent(ungDung.app)
    const csrf = await moKhoaVaDangNhap(phienHienTai, "cc.thu", { pin: PIN_KHOI_TAO })
    const phienThietBiKhac = request.agent(ungDung.app)
    await moKhoaVaDangNhap(phienThietBiKhac, "cc.thu", { pin: PIN_KHOI_TAO })
    const phienNguoiKhac = request.agent(ungDung.app)
    await moKhoaVaDangNhap(phienNguoiKhac, "cc.khac", { pin: PIN_KHOI_TAO })

    // Không nhận ID tài khoản từ client.
    await phienHienTai
      .post("/api/v1/account/password")
      .set("X-CSRF-Token", csrf)
      .send({ adminId: 999, currentPassword: MAT_KHAU_THU, newPassword: MAT_KHAU_MOI, confirmPassword: MAT_KHAU_MOI })
      .expect(400)

    const res = await phienHienTai
      .post("/api/v1/account/password")
      .set("X-CSRF-Token", csrf)
      .send({ currentPassword: MAT_KHAU_THU, newPassword: MAT_KHAU_MOI, confirmPassword: MAT_KHAU_MOI })
      .expect(200)
    khongLoBiMat(res)

    // Phiên hiện tại về bước mở khóa; phiên thiết bị khác mất quyền; người khác không bị ảnh hưởng.
    const me = await phienHienTai.get("/api/v1/auth/me").expect(401)
    assert.equal(me.body.error.code, "ADMIN_PIN_REQUIRED")
    await phienThietBiKhac.get("/api/v1/admin/statistics").expect(401)
    await phienNguoiKhac.get("/api/v1/admin/statistics").expect(200)

    const [phien] = await ungDung.pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS n FROM sessions WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.adminId')) = ?",
      [String(maCc)],
    )
    assert.equal(Number(phien[0]?.n), 0)

    // Mật khẩu cũ hết hiệu lực, mật khẩu mới đăng nhập được.
    const cu = request.agent(ungDung.app)
    await cu.post("/api/v1/auth/unlock").send({ pin: PIN_KHOI_TAO }).expect(200)
    await cu.post("/api/v1/auth/login").send({ username: "cc.thu", password: MAT_KHAU_THU }).expect(401)
    await moKhoaVaDangNhap(request.agent(ungDung.app), "cc.thu", { pin: PIN_KHOI_TAO, matKhau: MAT_KHAU_MOI })

    const [dong] = await ungDung.pool.query<RowDataPacket[]>(
      "SELECT password_hash, credential_version FROM admins WHERE id = ?",
      [maCc],
    )
    assert.match(String(dong[0]?.password_hash), /^\$argon2id\$/)
    assert.equal(Number(dong[0]?.credential_version), 2)
  })

  test("sai mật khẩu hiện tại, xác nhận không khớp hoặc quá ngắn: không đổi", async () => {
    const ma = await taoTaiKhoanThu(ungDung.pool, "cc.thu", "customer_care")
    const agent = request.agent(ungDung.app)
    const csrf = await moKhoaVaDangNhap(agent, "cc.thu", { pin: PIN_KHOI_TAO })
    const sai = await agent
      .post("/api/v1/account/password")
      .set("X-CSRF-Token", csrf)
      .send({ currentPassword: "sai-mat-khau-hoan-toan", newPassword: MAT_KHAU_MOI, confirmPassword: MAT_KHAU_MOI })
      .expect(403)
    khongLoBiMat(sai)
    const loi = await agent
      .post("/api/v1/account/password")
      .set("X-CSRF-Token", csrf)
      .send({ currentPassword: MAT_KHAU_THU, newPassword: "ngan", confirmPassword: "khac" })
      .expect(400)
    assert.ok(loi.body.error.fields.newPassword)
    assert.ok(loi.body.error.fields.confirmPassword)
    await agent.get("/api/v1/auth/me").expect(200)
    const [dong] = await ungDung.pool.query<RowDataPacket[]>("SELECT credential_version FROM admins WHERE id = ?", [ma])
    assert.equal(Number(dong[0]?.credential_version), 1)
  })

  test("hai yêu cầu đổi mật khẩu đồng thời: chỉ một thành công", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.thu", "customer_care")
    const a = request.agent(ungDung.app)
    const csrfA = await moKhoaVaDangNhap(a, "cc.thu", { pin: PIN_KHOI_TAO })
    const b = request.agent(ungDung.app)
    const csrfB = await moKhoaVaDangNhap(b, "cc.thu", { pin: PIN_KHOI_TAO })
    const gui = (agent: request.Agent, csrf: string, moi: string) =>
      agent
        .post("/api/v1/account/password")
        .set("X-CSRF-Token", csrf)
        .send({ currentPassword: MAT_KHAU_THU, newPassword: moi, confirmPassword: moi })
    const [ra, rb] = await Promise.all([
      gui(a, csrfA, "mat-khau-moi-thu-nhat-123"),
      gui(b, csrfB, "mat-khau-moi-thu-hai-4567"),
    ])
    const trangThai = [ra.status, rb.status].sort()
    assert.equal(trangThai.filter((s) => s === 200).length, 1, `kết quả: ${trangThai.join(",")}`)
    assert.ok(trangThai.every((s) => [200, 401, 403].includes(s)), `kết quả: ${trangThai.join(",")}`)
    const thang = ra.status === 200 ? "mat-khau-moi-thu-nhat-123" : "mat-khau-moi-thu-hai-4567"
    await moKhoaVaDangNhap(request.agent(ungDung.app), "cc.thu", { pin: PIN_KHOI_TAO, matKhau: thang })
  })
})

describe("Bảo mật tài khoản: giới hạn số lần xác minh", { skip: lyDoBoQua }, () => {
  const cfg: CauHinh = { ...cauHinhGoc!, ADMIN_UNLOCK_PIN: PIN_KHOI_TAO }
  let ungDung: ReturnType<typeof taoUngDungTest>
  before(async () => {
    await chuanBiSchemaTest(cfg)
    ungDung = taoUngDungTest(cfg, { ...GIOI_HAN_CAO, dangNhap: 3, xacMinh: 2 })
    await donDuLieuTest(ungDung.pool)
  })
  after(async () => {
    await donDuLieuTest(ungDung.pool)
    await ungDung.dongTatCa()
  })

  test("xác minh mật khẩu hiện tại sai liên tục bị chặn 429, kể cả khi sau đó nhập đúng", async () => {
    await taoTaiKhoanThu(ungDung.pool, "cc.thu", "customer_care")
    const agent = request.agent(ungDung.app)
    const csrf = await moKhoaVaDangNhap(agent, "cc.thu", { pin: PIN_KHOI_TAO })
    const gui = (currentPassword: string) =>
      agent
        .post("/api/v1/account/password")
        .set("X-CSRF-Token", csrf)
        .send({ currentPassword, newPassword: MAT_KHAU_MOI, confirmPassword: MAT_KHAU_MOI })
    await gui("sai-mat-khau-hoan-toan").expect(403)
    await gui("sai-mat-khau-hoan-toan").expect(403)
    const res = await gui(MAT_KHAU_THU).expect(429)
    assert.equal(res.body.error.code, "RATE_LIMITED")
  })

  test("IP cộng dồn PIN và đăng nhập sai qua nhiều tên tài khoản, rồi chặn cả hai bước", async () => {
    const agent = request.agent(ungDung.app)
    await agent.post("/api/v1/auth/unlock").send({ pin: "999999" }).expect(403)
    await agent.post("/api/v1/auth/unlock").send({ pin: PIN_KHOI_TAO }).expect(200)
    await agent.post("/api/v1/auth/login").send({ username: "cc.thu", password: "sai-mat-khau" }).expect(401)
    const chamNguong = await agent.post("/api/v1/auth/login")
      .send({ username: "tai-khoan-khac", password: "sai-mat-khau" }).expect(401)
    assert.ok(Number(chamNguong.headers["retry-after"]) > 0)
    const taiLai = await request(ungDung.app).get("/api/v1/auth/me").expect(429)
    assert.ok(Number(taiLai.headers["retry-after"]) > 0)
    const biChan = await agent.post("/api/v1/auth/unlock").send({ pin: PIN_KHOI_TAO }).expect(429)
    assert.ok(Number(biChan.headers["retry-after"]) > 0)
    await agent.post("/api/v1/auth/login").send({ username: "cc.thu", password: MAT_KHAU_THU }).expect(429)
  })
})
