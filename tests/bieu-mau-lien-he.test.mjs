import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { DANH_SACH_DICH_VU_LIEN_HE, layNhanDichVu } from "../src/lien-he/dich-vu-lien-he.ts"
import { guiThongTinLienHe } from "../src/lien-he/gui-thong-tin-lien-he.ts"
import { kiemTraBieuMauLienHe } from "../src/lien-he/kiem-tra-bieu-mau-lien-he.ts"

// Dữ liệu giả, không phải khách hàng thật.
const hopLe = {
  fullName: "Nguyễn Thị Mẫu",
  phone: "0901 234 567",
  email: "",
  service: "tarot",
  consent: true,
}

/**
 * Tạo hàm fetch giả trả về status/body cho trước và ghi lại request.
 *
 * @param {number} status - HTTP status giả lập
 * @param {unknown} body - Body JSON giả lập
 */
function fetchGia(status, body) {
  const daGoi = []
  const ham = async (url, init) => {
    daGoi.push({ url, init })
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
  }
  return { ham, daGoi }
}

test("danh mục dịch vụ có đúng 6 nhánh + 'other', khớp danh sách trang Liên hệ", () => {
  assert.deepEqual(
    DANH_SACH_DICH_VU_LIEN_HE.map((d) => d.ma),
    ["tea", "tarot", "healing", "workshop", "academy", "products", "other"],
  )
  assert.equal(layNhanDichVu("healing"), "Đồng hành 1:1")
  assert.equal(layNhanDichVu("khong-co"), "khong-co")
})

test("kiểm tra client: dữ liệu hợp lệ không có lỗi", () => {
  assert.deepEqual(kiemTraBieuMauLienHe(hopLe), {})
  assert.deepEqual(kiemTraBieuMauLienHe({ ...hopLe, phone: "+84 90 123 4567", email: "a@example.com" }), {})
})

test("kiểm tra client: báo lỗi đúng trường", () => {
  const loi = kiemTraBieuMauLienHe({ fullName: "", phone: "12", email: "sai@", service: "", consent: false })
  assert.deepEqual(Object.keys(loi).sort(), ["consent", "email", "fullName", "phone", "service"])
  assert.ok(kiemTraBieuMauLienHe({ ...hopLe, fullName: "Tên 123" }).fullName)
  assert.ok(kiemTraBieuMauLienHe({ ...hopLe, service: "spa" }).service)
})

test("gửi thành công chỉ khi server trả 201; body đúng 5 trường + honeypot rỗng", async () => {
  const { ham, daGoi } = fetchGia(201, { success: true, message: "Đã tiếp nhận." })
  const kq = await guiThongTinLienHe(hopLe, { goiFetch: ham })
  assert.deepEqual(kq, { trangThai: "thanh-cong", thongDiep: "Đã tiếp nhận." })
  assert.equal(daGoi[0].url, "/api/v1/customers")
  assert.equal(daGoi[0].init.method, "POST")
  assert.deepEqual(Object.keys(JSON.parse(daGoi[0].init.body)).sort(), [
    "consent", "email", "fullName", "phone", "service", "website",
  ])
})

test("lỗi 400 trả lỗi theo trường (bỏ trường lạ), 429/500/mất mạng không giả lập thành công", async () => {
  const loi400 = await guiThongTinLienHe(hopLe, {
    goiFetch: fetchGia(400, { error: { fields: { phone: "Số điện thoại không hợp lệ.", __proto__x: "x" } } }).ham,
  })
  assert.equal(loi400.trangThai, "du-lieu-sai")
  assert.deepEqual(loi400.loiTruong, { phone: "Số điện thoại không hợp lệ." })

  for (const status of [429, 500, 503]) {
    const kq = await guiThongTinLienHe(hopLe, { goiFetch: fetchGia(status, { error: {} }).ham })
    assert.equal(kq.trangThai, "loi", String(status))
  }
  const matMang = await guiThongTinLienHe(hopLe, {
    goiFetch: async () => {
      throw new TypeError("Failed to fetch")
    },
  })
  assert.equal(matMang.trangThai, "loi")
  assert.match(matMang.thongDiep, /Không kết nối được/)
})

test("biểu mẫu có trạng thái loading, khóa nút khi đang gửi và chỉ reset khi thành công", async () => {
  const src = await readFile(new URL("../src/lien-he/BieuMauLienHe.tsx", import.meta.url), "utf8")
  assert.match(src, /disabled=\{dangGui\}/)
  assert.match(src, /aria-busy=\{dangGui\}/)
  assert.match(src, /role="status"/)
  // setDuLieu(DU_LIEU_TRONG) chỉ nằm trong nhánh thành công.
  const nhanThanhCong = src.match(/if \(ketQua\.trangThai === "thanh-cong"\) \{([\s\S]*?)\n    \}/)
  assert.ok(nhanThanhCong)
  assert.match(nhanThanhCong[1], /setDuLieu\(DU_LIEU_TRONG\)/)
  assert.equal(src.match(/setDuLieu\(DU_LIEU_TRONG\)/g)?.length, 1)
})

test("khối Liên hệ 3 cột: không còn lịch, cột giữa là form 'Liên hệ để đặt lịch'", async () => {
  const section = await readFile(new URL("../src/components/ContactThreeColumnSection.tsx", import.meta.url), "utf8")
  const form = await readFile(new URL("../src/lien-he/BieuMauLienHe.tsx", import.meta.url), "utf8")
  for (const cu of [/ngayChon/, /setThang/, /Tháng 1 · 2026/, /Giờ tiếp đón/, /grid-cols-7/])
    assert.doesNotMatch(section, cu)
  assert.match(form, /Liên hệ để đặt lịch/)
  assert.match(form, /ĐẶT LỊCH · APPOINTMENT/)
  assert.match(form, /"Gửi thông tin đặt lịch"/)
  assert.match(form, /"Đang gửi\.\.\."/)
  assert.match(form, /Cảm ơn bạn đã kết nối\./)
  assert.match(form, /Gửi một yêu cầu khác/)
  // Không có trường ngày/giờ: website không đặt lịch thật.
  assert.doesNotMatch(form, /type="(date|time|datetime-local)"|appointment_?date/i)
  // Thứ tự trường theo thiết kế: họ tên → điện thoại → email → dịch vụ → đồng ý.
  const thuTu = [...form.matchAll(/^\s+name="(fullName|phone|email|service|consent)"\r?$/gm)].map((m) => m[1])
  assert.deepEqual(thuTu, ["fullName", "phone", "email", "service", "consent"])
})

test("nội dung không hứa hẹn lịch đã xác nhận", async () => {
  const form = await readFile(new URL("../src/lien-he/BieuMauLienHe.tsx", import.meta.url), "utf8")
  const section = await readFile(new URL("../src/components/ContactThreeColumnSection.tsx", import.meta.url), "utf8")
  for (const src of [form, section])
    for (const cam of [/Đặt lịch thành công/i, /lịch của bạn đã được xác nhận/i, /cuộc hẹn đã được tạo/i])
      assert.doesNotMatch(src, cam)
  assert.match(form, /không xác nhận lịch tự động/)
})

test("kênh trực tiếp chỉ dùng URL chính thức từ config, không tự tạo link", async () => {
  const section = await readFile(new URL("../src/components/ContactThreeColumnSection.tsx", import.meta.url), "utf8")
  assert.doesNotMatch(section, /https?:\/\/(www\.)?(zalo\.me|facebook\.com|m\.me|instagram\.com)/)
  assert.match(section, /contactChannels\.facebook/)
  assert.match(section, /contactChannels\.zalo/)
  assert.match(section, /mailto:\$\{EMAIL_LIEN_HE\}/)
  const externalLinks = section.match(/target: "_blank"|target="_blank"/g) ?? []
  const safe = section.match(/target: "_blank", rel: "noopener noreferrer"|target="_blank"\s+rel="noopener noreferrer"/g) ?? []
  assert.equal(safe.length, externalLinks.length)
})

test("trang quản trị không lưu mật khẩu/token vào storage và route admin tách chunk", async () => {
  const api = await readFile(new URL("../src/admin/services/api-quan-tri.ts", import.meta.url), "utf8")
  const dangNhapSrc = await readFile(new URL("../src/admin/pages/DangNhapQuanTri.tsx", import.meta.url), "utf8")
  for (const src of [api, dangNhapSrc]) assert.doesNotMatch(src, /\b(localStorage|sessionStorage)\s*\./)
  assert.match(api, /"X-CSRF-Token"/)
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8")
  assert.match(app, /import\("\.\/admin\/UngDungQuanTri"\)/)
})
