import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  chuanHoaLienKetNhap,
  coNoiDung,
  laDuongDanAnhHopLe,
  laLienKetAnToan,
} from "../src/journal/noi-dung/quy-tac.ts"

const doc = (duongDan) => readFileSync(new URL(`../${duongDan}`, import.meta.url), "utf8").replace(/\r\n/g, "\n")
const hienThi = doc("src/journal/noi-dung/HienThiNoiDung.tsx")
const soanThao = doc("src/admin/components/journal/TrinhSoanThao.tsx")
const danWord = doc("src/admin/components/journal/dan-tu-word.ts")
const soanBai = doc("src/admin/pages/SoanBaiJournal.tsx")
const quanLy = doc("src/admin/pages/QuanLyJournal.tsx")
const sapXep = doc("src/admin/components/journal/DanhSachSapXep.tsx")
const thuVien = doc("src/admin/components/journal/ThuVienAnh.tsx")
const ungDung = doc("src/admin/UngDungQuanTri.tsx")
const khung = doc("src/admin/components/KhungQuanTri.tsx")
const baiViet = doc("src/trang/BaiViet.tsx")
const quyTacMayChu = doc("server/src/modules/journal/noi-dung.ts")

test("liên kết: chỉ http(s), mailto, tel, đường dẫn nội bộ, anchor — giống máy chủ", () => {
  for (const ok of ["https://a.vn", "http://a.vn/x", "mailto:a@b.vn", "tel:+84901234567", "/lien-he", "#muc"])
    assert.equal(laLienKetAnToan(ok), true, ok)
  for (const xau of ["javascript:alert(1)", " javascript:x", "java\tscript:x", "data:text/html,x", "//evil.vn", "/\\evil.vn", "vbscript:x", ""])
    assert.equal(laLienKetAnToan(xau), false, xau)
  assert.equal(chuanHoaLienKetNhap("innerarchitect.vn/lien-he"), "https://innerarchitect.vn/lien-he")
  assert.equal(chuanHoaLienKetNhap("javascript:alert(1)"), null)
  // Cùng mẫu chặn ký tự điều khiển/khoảng trắng như máy chủ.
  const mauKyTu = (src) => src.match(/if \(\/\[\\u0000-.*?\]\/\.test\(lienKet\)\) return false/)?.[0]
  assert.ok(mauKyTu(quyTacMayChu))
  assert.equal(mauKyTu(doc("src/journal/noi-dung/quy-tac.ts")), mauKyTu(quyTacMayChu))
})

test("ảnh: chỉ ảnh thư viện Journal hoặc ảnh tĩnh của site", () => {
  assert.equal(laDuongDanAnhHopLe("/media/journal/3f2c1d0e-1111-4222-8333-444455556666.webp"), true)
  assert.equal(laDuongDanAnhHopLe("/assets/journal/goc/hinh01.webp"), true)
  for (const xau of ["https://evil.vn/a.png", "data:image/png;base64,AA", "file:///C:/a.png", "/assets/../x.png", "/media/journal/abc.svg"])
    assert.equal(laDuongDanAnhHopLe(xau), false, xau)
  assert.equal(coNoiDung({ type: "doc", content: [{ type: "paragraph" }] }), false)
  assert.equal(coNoiDung({ type: "doc", content: [{ type: "image", attrs: {} }] }), true)
})

test("bộ hiển thị nội dung không dùng HTML thô và chỉ nhận các thành phần được hỗ trợ", () => {
  assert.doesNotMatch(hienThi, /dangerouslySetInnerHTML|innerHTML/)
  for (const loai of ["paragraph", "heading", "bulletList", "orderedList", "listItem", "blockquote", "image", "text", "hardBreak"])
    assert.match(hienThi, new RegExp(`case "${loai}"`))
  assert.match(hienThi, /default:\s*return null/)
  assert.match(hienThi, /laLienKetAnToan\(mark\.attrs\?\.href\)/)
  assert.match(hienThi, /rel="noopener noreferrer"/)
  // Bài công khai và bản xem trước dùng cùng bố cục + bộ hiển thị.
  assert.match(baiViet, /<BaiJournalHienThi/)
  assert.match(soanBai, /<BaiJournalHienThi bai=\{duLieuXemTruoc\} \/>/)
})

test("trình soạn thảo: thanh công cụ đủ nút có nhãn, chỉ H2/H3, lọc dán và chặn dán file ảnh", () => {
  for (const moTa of [
    "Đoạn văn thường",
    "Tiêu đề phụ cấp 2 (H2)",
    "Tiêu đề phụ cấp 3 (H3)",
    "In đậm (Ctrl+B)",
    "In nghiêng (Ctrl+I)",
    "Gạch chân (Ctrl+U)",
    "Danh sách dấu đầu dòng",
    "Danh sách đánh số",
    "Trích dẫn",
    "Thêm hoặc sửa liên kết",
    "Chèn ảnh tại vị trí con trỏ",
    "Hoàn tác (Ctrl+Z)",
    "Làm lại (Ctrl+Shift+Z)",
  ])
    assert.match(soanThao, new RegExp(`moTa="${moTa.replace(/[()+]/g, "\\$&")}"`), moTa)
  assert.match(soanThao, /role="toolbar"/)
  assert.match(soanThao, /heading: \{ levels: \[2, 3\] \}/)
  assert.match(soanThao, /transformPastedHTML: \(html\) => \{/)
  assert.match(soanThao, /isAllowedUri: \(url\) => laLienKetAnToan\(url\)/)
  assert.match(soanThao, /insertContentAt\(viTri, \{ type: "image"/)
  for (const nut of ["Đổi ảnh", "Di chuyển lên", "Di chuyển xuống", "Gỡ ảnh khỏi bài"]) assert.ok(soanThao.includes(nut), nut)
  // Dán từ Word: danh sách mso-list → ul/ol, H1 → H2, bỏ thuộc tính và ảnh ngoài thư viện.
  assert.match(danWord, /mso-list/)
  assert.match(danWord, /querySelectorAll\("h1"\)\.forEach\(\(h\) => doiThe\(h, "h2"\)\)/)
  assert.match(danWord, /script,style,meta/)
  assert.match(danWord, /laDuongDanAnhHopLe\(img\.getAttribute\("src"\)\)/)
})

test("soạn bài: lưu nháp, xem trước, xuất bản/cập nhật, xung đột phiên bản, cảnh báo rời trang", () => {
  for (const nhan of ["Lưu nháp", "Xem trước", "Cập nhật bản công khai", "Gỡ xuất bản", "Bỏ thay đổi nháp", "Tải bản mới nhất"])
    assert.ok(soanBai.includes(nhan), nhan)
  assert.match(soanBai, /window\.addEventListener\("beforeunload", truocKhiDong\)/)
  assert.match(soanBai, /datChanRoiTrang\(\(\) => !coThayDoiRef\.current \|\| window\.confirm\(HOI_ROI_TRANG\)\)/)
  assert.match(soanBai, /e\.status === 409/)
  assert.match(soanBai, /version: bai\.version/)
  // Không lưu bản nháp vào bộ nhớ trình duyệt.
  for (const src of [soanBai, soanThao, quanLy, thuVien])
    assert.doesNotMatch(src, /\b(localStorage|sessionStorage|indexedDB)\b/)
})

test("danh sách sắp xếp: kéo thả + nút Lên/Xuống có nhãn, lưu máy chủ và hoàn tác khi lỗi", () => {
  assert.match(sapXep, /aria-label=\{`Đưa “\$\{ten\}” lên`\}/)
  assert.match(sapXep, /aria-label=\{`Đưa “\$\{ten\}” xuống`\}/)
  assert.match(sapXep, /onDrop=/)
  assert.match(sapXep, /await luuThuTu\(moi\.map\(layMa\)\)/)
  assert.match(sapXep, /setThuTu\(cu\)/)
  assert.match(sapXep, /aria-live="polite"/)
  assert.match(quanLy, /sapXepBai\(maMuc, ids\)/)
  assert.match(quanLy, /sapXepChuyenMuc\(ids\)/)
})

test("menu Journal và route quản trị chỉ dành cho tài khoản có quyền; phân quyền chỉ cho admin", () => {
  assert.match(khung, /quanTriVien\?\.canManageJournal/)
  assert.match(ungDung, /laTrangJournal && !quanTriVien\.canManageJournal/)
  assert.match(ungDung, /<SoanBaiJournal key="soan" id=\{null\} \/>/)
  assert.match(quanLy, /laAdmin \? \["bai", "chuyen-muc", "quyen"\] : \["bai", "chuyen-muc"\]/)
  assert.match(thuVien, /accept=\{DINH_DANG_ANH_CHO_PHEP\.join\(","\)\}/)
})

test("xóa: bài nháp (bài đã đăng phải gỡ trước), chuyên mục trống, ảnh không còn dùng — đều hỏi xác nhận", () => {
  const api = doc("src/admin/services/api-journal.ts")
  assert.match(api, /`\$\{GOC\}\/articles\/\$\{id\}`, \{ method: "DELETE", body: \{ version \} \}/)
  assert.match(api, /`\$\{GOC\}\/categories\/\$\{id\}`, \{ method: "DELETE", body: \{ version \} \}/)
  assert.match(api, /`\$\{GOC\}\/media\/\$\{id\}`, \{ method: "DELETE" \}/)
  assert.match(soanBai, /bai\?\.status === "draft" && \(/)
  assert.match(soanBai, /window\.confirm\(`Xóa vĩnh viễn bài/)
  assert.match(quanLy, /b\.status === "draft" && \(/)
  assert.match(quanLy, /m\.articleCount === 0 && m\.publishedCount === 0 && \(/)
  assert.match(thuVien, /await xoaAnh\(chon\.id\)/)
})
