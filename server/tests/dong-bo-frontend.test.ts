/**
 * Đảm bảo frontend và backend dùng cùng danh mục dịch vụ và cùng quy tắc kiểm tra
 * biểu mẫu. Frontend chỉ là lớp trải nghiệm, nhưng nếu lệch thì người dùng sẽ thấy
 * "hợp lệ" ở trình duyệt rồi bị server từ chối (hoặc ngược lại).
 */
import assert from "node:assert/strict"
import test from "node:test"
import { DANH_SACH_DICH_VU_LIEN_HE } from "../../src/lien-he/dich-vu-lien-he.ts"
import { kiemTraBieuMauLienHe } from "../../src/lien-he/kiem-tra-bieu-mau-lien-he.ts"
import { schemaTaoKhachHang } from "../src/modules/customers/customers.schema.ts"
import { MA_DICH_VU } from "../src/utils/dich-vu.ts"

test("mã dịch vụ frontend và backend trùng khớp, cùng thứ tự", () => {
  assert.deepEqual(
    DANH_SACH_DICH_VU_LIEN_HE.map((dichVu) => dichVu.ma),
    [...MA_DICH_VU],
  )
})

test("frontend và backend cùng kết luận hợp lệ/không hợp lệ trên bộ mẫu", () => {
  const goc = { fullName: "Nguyễn Thị Mẫu", phone: "0901234567", email: "", service: "tea", consent: true }
  const mau: Array<Partial<typeof goc> & Record<string, unknown>> = [
    {},
    { fullName: "Lê A" },
    { fullName: "A" },
    { fullName: "Nguyễn 2" },
    { fullName: "Đỗ Thị Ánh-Dương" },
    { fullName: "x".repeat(151) },
    { phone: "090 123 4567" },
    { phone: "+84 90 123 4567" },
    { phone: "02838123456" },
    { phone: "0901234" },
    { phone: "+0901234567" },
    { phone: "phone" },
    { email: "khach@example.com" },
    { email: "khach@example" },
    { email: "khong-hop-le" },
    { service: "other" },
    { service: "spa" },
    { consent: false },
  ]
  for (const thayDoi of mau) {
    const duLieu = { ...goc, ...thayDoi }
    const frontendHopLe = Object.keys(kiemTraBieuMauLienHe(duLieu)).length === 0
    const backendHopLe = schemaTaoKhachHang.safeParse(duLieu).success
    assert.equal(frontendHopLe, backendHopLe, JSON.stringify(thayDoi))
  }
})
