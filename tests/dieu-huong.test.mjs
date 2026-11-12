import assert from "node:assert/strict"
import { readdirSync, readFileSync, statSync } from "node:fs"
import test from "node:test"

/**
 * Đọc mọi file .ts/.tsx trong src/ (đệ quy).
 *
 * @param {URL} thuMuc - Thư mục cần đọc
 * @returns {{ ten: string, noiDung: string }[]}
 */
function docTatCaNguon(thuMuc = new URL("../src/", import.meta.url)) {
  const ketQua = []
  for (const ten of readdirSync(thuMuc)) {
    const url = new URL(ten, thuMuc)
    if (statSync(url).isDirectory()) ketQua.push(...docTatCaNguon(new URL(`${ten}/`, thuMuc)))
    else if (/\.tsx?$/.test(ten)) ketQua.push({ ten: url.pathname, noiDung: readFileSync(url, "utf8") })
  }
  return ketQua
}

const nguon = docTatCaNguon()
const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8")
const dieuHuong = readFileSync(new URL("../src/dieu-huong.tsx", import.meta.url), "utf8")

test("không còn đường dẫn hash routing (#/…) trong mã nguồn", () => {
  for (const { ten, noiDung } of nguon) {
    // Bỏ comment trước khi kiểm tra; App.tsx còn nhận URL cũ để chuyển hướng.
    const ma = noiDung.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")
    const conHash = ma.match(/["'`]#\/[^"'`]*["'`]|location\.hash\s*=|href=\{?["'`]#\//g) ?? []
    const choPhep = ten.endsWith("/App.tsx") ? conHash.filter((m) => m !== '"#/"') : conHash
    assert.deepEqual(choPhep, [], `${ten} còn: ${choPhep.join(", ")}`)
  }
})

test("điều hướng dùng History API và Link có href là đường dẫn thật", () => {
  assert.match(dieuHuong, /window\.history\.pushState\(null, "", path\)/)
  assert.match(dieuHuong, /href=\{to\}/)
  // Ctrl/Cmd/Shift/Alt-click hoặc chuột giữa giữ hành vi mặc định (mở tab mới).
  assert.match(dieuHuong, /e\.metaKey \|\| e\.ctrlKey \|\| e\.shiftKey \|\| e\.altKey/)
  assert.match(app, /addEventListener\("popstate", f\)/)
  assert.match(app, /chuanHoaDuongDan\(window\.location\.pathname\)/)
})

test("URL hash cũ (/#/lien-he) được chuyển sang đường dẫn mới, anchor trong trang giữ nguyên", () => {
  const ham = app.match(/function docDuongDanHienTai\(\)[\s\S]*?\n\}/)?.[0] ?? ""
  assert.match(ham, /location\.hash\.startsWith\("#\/"\)/)
  assert.doesNotMatch(ham, /hash\.startsWith\("#"\)\)/)
  // Regression: /#/booking phải về /lien-he trong một lần gọi (không phụ thuộc StrictMode gọi hai lần).
  const viTriHash = ham.indexOf('startsWith("#/")')
  const viTriBooking = ham.indexOf('pathname === "/booking"')
  assert.ok(viTriHash > -1 && viTriBooking > viTriHash, "xử lý #/ trước rồi mới kiểm tra /booking")
  assert.doesNotMatch(ham, /else if \(pathname === "\/booking"\)/)
})

test("trang quản trị ở /jathong (một hằng số), API backend vẫn là /api/v1/admin", () => {
  const goc = readFileSync(new URL("../src/admin/duong-dan-quan-tri.ts", import.meta.url), "utf8")
  assert.match(goc, /export const GOC_QUAN_TRI = "\/jathong"/)
  assert.match(app, /const laTrangQuanTri = laDuongDanQuanTri\(path\)/)
  for (const { ten, noiDung } of nguon) {
    if (ten.endsWith("/api-quan-tri.ts")) continue
    const ma = noiDung.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")
    assert.doesNotMatch(ma, /["'`]\/admin(\/|["'`?])/, `${ten} còn đường dẫn trang /admin viết cứng`)
  }
  const api = readFileSync(new URL("../src/admin/services/api-quan-tri.ts", import.meta.url), "utf8")
  assert.match(api, /goiApi<\{ data: ThongKeKhachHang \}>\("\/admin\/statistics"\)/)
})
