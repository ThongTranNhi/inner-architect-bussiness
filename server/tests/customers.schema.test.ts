import assert from "node:assert/strict"
import test from "node:test"
import { phanTichDuLieu } from "../src/middleware/validate.ts"
import { thoatKyTuLike } from "../src/modules/customers/customers.repository.ts"
import {
  chuanHoaSoDienThoai,
  schemaLocKhachHang,
  schemaTaoKhachHang,
} from "../src/modules/customers/customers.schema.ts"
import { LoiUngDung } from "../src/utils/loi-ung-dung.ts"
import { KHACH_HANG_MAU } from "./ho-tro.ts"

/**
 * Chạy schema và trả về lỗi theo trường (hoặc `null` nếu hợp lệ).
 *
 * @param duLieu - Dữ liệu biểu mẫu
 * @returns Bản đồ lỗi theo trường hoặc `null`
 */
function loiCua(duLieu: unknown): Record<string, string> | null {
  try {
    phanTichDuLieu(schemaTaoKhachHang, duLieu)
    return null
  } catch (loi) {
    assert.ok(loi instanceof LoiUngDung)
    assert.equal(loi.status, 400)
    return loi.truong ?? {}
  }
}

test("chấp nhận dữ liệu hợp lệ, trim và chuẩn hóa số điện thoại", () => {
  const ketQua = phanTichDuLieu(schemaTaoKhachHang, {
    ...KHACH_HANG_MAU,
    fullName: "  Nguyễn Thị Mẫu  ",
    phone: " 090.123-4567 ",
    email: "  khach.mau@example.com ",
  })
  assert.equal(ketQua.fullName, "Nguyễn Thị Mẫu")
  assert.equal(ketQua.phone, "0901234567")
  assert.equal(ketQua.email, "khach.mau@example.com")
})

test("không tự đổi tên khách hàng (giữ chữ hoa/thường, dấu)", () => {
  const ketQua = phanTichDuLieu(schemaTaoKhachHang, {
    ...KHACH_HANG_MAU,
    fullName: "đỗ thị ÁNH-Dương O'Neil",
  })
  assert.equal(ketQua.fullName, "đỗ thị ÁNH-Dương O'Neil")
})

test("email để trống/null/bỏ qua đều thành null", () => {
  for (const email of ["", null, undefined]) {
    const ketQua = phanTichDuLieu(schemaTaoKhachHang, { ...KHACH_HANG_MAU, email })
    assert.equal(ketQua.email, null)
  }
})

test("chấp nhận số trong nước và quốc tế hợp lệ", () => {
  for (const phone of ["0901234567", "02838123456", "+84901234567", "+1 (415) 555-0100", "+44 20 7946 0958"])
    assert.equal(loiCua({ ...KHACH_HANG_MAU, phone }), null, phone)
})

test("từ chối số điện thoại sai định dạng", () => {
  for (const phone of ["", "12345", "090123456", "09012345678901", "+0901234567", "abc0901234567", "0901 234 56a"])
    assert.ok(loiCua({ ...KHACH_HANG_MAU, phone })?.phone, phone)
})

test("từ chối họ tên rỗng, quá dài hoặc có ký tự lạ", () => {
  for (const fullName of ["", " ", "A", "x".repeat(151), "<script>", "Nguyễn 123", "Tên\u0000ẩn"])
    assert.ok(loiCua({ ...KHACH_HANG_MAU, fullName })?.fullName, JSON.stringify(fullName))
})

test("từ chối email sai, dịch vụ ngoài danh mục, consent khác true", () => {
  assert.ok(loiCua({ ...KHACH_HANG_MAU, email: "khong-phai-email" })?.email)
  assert.ok(loiCua({ ...KHACH_HANG_MAU, service: "spa" })?.service)
  assert.ok(loiCua({ ...KHACH_HANG_MAU, service: undefined })?.service)
  for (const consent of [false, "true", 1, undefined])
    assert.ok(loiCua({ ...KHACH_HANG_MAU, consent })?.consent, String(consent))
})

test("từ chối trường không được phép và honeypot có giá trị", () => {
  const loi = loiCua({ ...KHACH_HANG_MAU, healthNote: "x", role: "admin" })
  assert.ok(loi?.healthNote)
  assert.ok(loi?.role)
  assert.ok(loiCua({ ...KHACH_HANG_MAU, website: "http://spam.example" })?.website)
  assert.equal(loiCua({ ...KHACH_HANG_MAU, website: "" }), null)
})

test("từ chối body không phải object", () => {
  for (const duLieu of [null, "chuoi", 42, []]) assert.ok(loiCua(duLieu))
})

test("chuanHoaSoDienThoai bỏ khoảng trắng, chấm, gạch, ngoặc", () => {
  assert.equal(chuanHoaSoDienThoai("+84 (90) 123.45-67"), "+84901234567")
})

test("thoatKyTuLike thoát %, _ và \\", () => {
  assert.equal(thoatKyTuLike("50%_a\\b"), "50\\%\\_a\\\\b")
})

test("bộ lọc danh sách: mặc định trang 1, giới hạn pageSize, từ chối giá trị lạ", () => {
  assert.deepEqual(phanTichDuLieu(schemaLocKhachHang, {}), { page: 1, pageSize: 20 })
  assert.throws(() => phanTichDuLieu(schemaLocKhachHang, { pageSize: "500" }))
  assert.throws(() => phanTichDuLieu(schemaLocKhachHang, { status: "deleted" }))
  assert.throws(() => phanTichDuLieu(schemaLocKhachHang, { page: "0" }))
})
