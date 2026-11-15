import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const doc = (duongDan) => readFile(new URL(duongDan, import.meta.url), "utf8")
const trang = await doc("../src/admin/pages/BaoMatTaiKhoan.tsx")
const api = await doc("../src/admin/services/api-quan-tri.ts")
const ungDung = await doc("../src/admin/UngDungQuanTri.tsx")
const khung = await doc("../src/admin/components/KhungQuanTri.tsx")
const phien = await doc("../src/admin/hooks/usePhienQuanTri.tsx")
const dangNhap = await doc("../src/admin/pages/DangNhapQuanTri.tsx")
const pinBackend = await doc("../server/src/modules/auth/pin-mo-khoa.ts")
const matKhauBackend = await doc("../server/src/modules/auth/mat-khau.ts")

test("mục Bảo mật tài khoản có route /jathong/bao-mat và mục menu", () => {
  assert.match(ungDung, /\$\{GOC_QUAN_TRI\}\/bao-mat`\) noiDung = <BaoMatTaiKhoan \/>/)
  assert.match(khung, /nhan: "Bảo mật tài khoản"/)
  assert.match(trang, /tieuDe="Đổi PIN mở khóa"/)
  assert.match(trang, /tieuDe="Đổi mật khẩu"/)
})

test("PIN, mật khẩu không ghi vào storage của trình duyệt; ô nhập là password", () => {
  for (const src of [trang, api, phien, dangNhap])
    assert.doesNotMatch(src, /\b(localStorage|sessionStorage|indexedDB|document\.cookie)\b/)
  assert.match(trang, /type="password"/)
  assert.doesNotMatch(trang, /type="(text|number)"/)
  // PIN giữ dạng chuỗi (không Number()/parseInt) để không mất số 0 ở đầu.
  assert.doesNotMatch(trang, /\b(Number|parseInt|parseFloat)\(/)
  assert.match(trang, /inputMode=\{laPin \? "numeric" : undefined\}/)
  assert.match(trang, /autoComplete="current-password"/)
  assert.match(trang, /autoComplete="new-password"/)
})

test("biểu mẫu đổi PIN yêu cầu PIN hiện tại, mật khẩu, PIN mới, xác nhận; chỉ hiện khi có quyền", () => {
  for (const id of ["pin-hien-tai", "pin-mat-khau", "pin-moi", "pin-xac-nhan", "mk-hien-tai", "mk-moi", "mk-xac-nhan"])
    assert.match(trang, new RegExp(`id="${id}"`), id)
  assert.match(trang, /trangThai\.canChangePin && \(/)
  // Bí mật bị xóa khỏi state sau mỗi lần gửi.
  assert.match(trang, /finally \{[\s\S]*?setMatKhau\(""\)[\s\S]*?setPinMoi\(""\)/)
})

test("đổi mật khẩu thành công thì kết thúc phiên client và về bước mở khóa kèm thông báo", () => {
  assert.match(trang, /ketThucPhien\(thongDiep\)/)
  assert.match(api, /"\/account\/password"[\s\S]*?csrfToken = null/)
  assert.match(phien, /ketThucPhien: \(thongBao\) => \{[\s\S]*?xoaPhienCucBo\(\)[\s\S]*?setLanKiemTra/)
  assert.match(dangNhap, /thongBaoDangNhap && !loi/)
})

test("quy tắc client khớp backend: PIN 6–8 chữ số, mật khẩu tối thiểu 12 ký tự", () => {
  assert.match(pinBackend, /export const MAU_PIN = \/\^\[0-9\]\{6,8\}\$\//)
  assert.match(trang, /const MAU_PIN = \/\^\[0-9\]\{6,8\}\$\//)
  const toiThieu = matKhauBackend.match(/DO_DAI_MAT_KHAU_TOI_THIEU = (\d+)/)?.[1]
  assert.equal(toiThieu, "12")
  assert.match(trang, new RegExp(`DO_DAI_MAT_KHAU_TOI_THIEU = ${toiThieu}`))
})

test("xóa khách hàng: chỉ admin thấy nút, hai bước xác nhận, gọi DELETE", async () => {
  const nut = await doc("../src/admin/components/NutXoaKhachHang.tsx")
  const danhSach = await doc("../src/admin/pages/DanhSachKhachHang.tsx")
  const chiTiet = await doc("../src/admin/pages/ChiTietKhachHang.tsx")
  assert.match(api, /`\/admin\/customers\/\$\{id\}`, \{ method: "DELETE" \}/)
  assert.match(nut, /"Xóa vĩnh viễn"/)
  assert.match(nut, /Không thể hoàn tác/)
  assert.match(nut, /nutHuy\.current\?\.focus\(\)/)
  assert.match(danhSach, /const laAdmin = quanTriVien\?\.role === "admin"/)
  assert.equal(danhSach.match(/\{laAdmin && \(/g)?.length, 2, "nút xóa ở cả bảng và thẻ mobile, chỉ cho admin")
  assert.match(chiTiet, /quanTriVien\?\.role === "admin" && \(/)
})
