import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { dinhDangNgayJournal } from "../src/journal/du-lieu-journal.ts"
import {
  KIEU_HIEN_ANH,
  kieuHienAnh,
  layBaiTieuBieu,
  locBaiJournal,
} from "../src/journal/loc-journal.ts"
import { docNguonWebsite } from "./nguon-website.mjs"

const appSource = docNguonWebsite()
const pageSource = readFileSync(
  new URL("../src/journal/JournalPage.tsx", import.meta.url),
  "utf8",
)
const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8")
const seed = JSON.parse(
  readFileSync(new URL("../server/database/seed/journal-ban-dau.json", import.meta.url), "utf8"),
)

const baiMau = [
  { categoryId: 4, slug: "a", title: "A" },
  { categoryId: 1, slug: "b", title: "B", featured: true },
  { categoryId: 4, slug: "c", title: "C" },
  { categoryId: 6, slug: "d", title: "D" },
]

test("dữ liệu Journal ban đầu (seed MySQL) giữ đủ 6 chuyên mục theo thứ tự và 28 bài", () => {
  assert.deepEqual(
    seed.categories.map((m) => m.label),
    ["Hiểu mình", "Mối quan hệ", "Minh triết", "Tarot", "Sống tỉnh thức", "The Hermit"],
  )
  assert.equal(seed.articles.length, 28)
  assert.equal(new Set(seed.articles.map((b) => b.slug)).size, 28)
  assert.equal(seed.articles[0].slug, "ban-la-ai-khi-khong-con-phai-lam-hai-long-tat-ca")
  // Chuyên mục và bài không còn viết cứng trong bundle website.
  assert.doesNotMatch(appSource, /export const news\b/)
  assert.doesNotMatch(pageSource, /SAU_CHUYEN_MUC_JOURNAL/)
})

test("'Tất cả' hides only the featured article; a category shows all its articles", () => {
  assert.deepEqual(
    locBaiJournal(baiMau, null, "a").map((bai) => bai.slug),
    ["b", "c", "d"],
  )
  assert.deepEqual(
    locBaiJournal(baiMau, 4, "a").map((bai) => bai.slug),
    ["a", "c"],
  )
  assert.deepEqual(layBaiTieuBieu(baiMau, 2).map((b) => b.slug), ["b", "a"])
})

test("ngày xuất bản hiển thị YYYY.MM.DD theo giờ Việt Nam", () => {
  assert.equal(dinhDangNgayJournal("2025-03-10T00:00:00.000Z"), "2025.03.10")
  assert.equal(dinhDangNgayJournal("2025-03-10T18:30:00.000Z"), "2025.03.11")
  assert.equal(dinhDangNgayJournal(null), "")
})

test("journal route renders the new page with API data and the series", () => {
  assert.match(appSource, /<JournalPage chuyenDe=\{signatureSeriesList\} \/>/)
  assert.match(pageSource, /useDuLieuJournal\(\)/)
  assert.doesNotMatch(appSource, /function NewsArchive\(/)
  // The App-wide section reveal must not double-animate Journal sections.
  assert.match(appSource, /:not\(\.journal-page\) > section/)
})

test("featured showcase has primary and secondary articles, library uses editorial grid without filter tabs", () => {
  assert.match(css, /\.jr-featured-link \{[^}]*grid-template-areas: "chu anh"/s)
  assert.match(css, /\.jr-featured-sub-grid \{[^}]*grid-template-columns:/s)
  assert.match(css, /\.jr-grid \{[^}]*grid-template-columns:\s*repeat\(3,/s)
  assert.doesNotMatch(pageSource, /jr-filter/)
  assert.match(pageSource, /layBaiTieuBieu\(baiViet/)
  // Mobile: grid collapses to 1 column.
  assert.match(
    css,
    /@media \(max-width: 600px\)[\s\S]*\.jr-grid \{ grid-template-columns: 1fr; \}/,
  )
})

test("journal reveal only hides content when motion is enabled and respects reduced motion", () => {
  assert.match(pageSource, /useHieuUngCuon\(trangRef/)
  assert.match(css, /\.journal-page\.fp-motion \[data-reveal="len"\] \{ opacity: 0/)
  assert.doesNotMatch(css, /\.journal-page \[data-reveal="len"\] \{ opacity: 0/)
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\.journal-page \[data-reveal\],/,
  )
})

test("adjacent journal images never share the same reveal animation", () => {
  const kieu = ["tren", ...Array.from({ length: 20 }, (_, i) => kieuHienAnh(i))]
  for (let i = 1; i < kieu.length; i++) {
    assert.notEqual(kieu[i], kieu[i - 1], `image ${i} repeats ${kieu[i]}`)
  }
  // Every variant has its own starting clip-path/opacity in the CSS.
  for (const ten of KIEU_HIEN_ANH) {
    assert.match(css, new RegExp(`\\[data-anh="${ten}"\\] \\{[^}]*--jr-(tu|op)`))
  }
  assert.match(pageSource, /data-anh="tren"/)
  assert.match(pageSource, /data-anh=\{kieuHienAnh\(i\)\}/)
})

test("journal headings keep the approved readable display scale", () => {
  assert.match(
    css,
    /\.journal-page \.jr-masthead h1\s*\{[^}]*font-size:\s*clamp\(54px,\s*7\.5vw,\s*108px\)/s,
  )
  assert.match(
    css,
    /\.journal-page \.jr-featured h2\s*\{[^}]*font-size:\s*clamp\(34px,\s*3\.6vw,\s*54px\)/s,
  )
  assert.match(
    css,
    /\.journal-page \.jr-library-head h2\s*\{[^}]*font-size:\s*clamp\(32px,\s*3\.4vw,\s*48px\)/s,
  )
  assert.match(
    css,
    /\.journal-page \.jr-series-head h2\s*\{[^}]*font-size:\s*clamp\(32px,\s*3\.4vw,\s*48px\)/s,
  )
  assert.match(
    css,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.journal-page \.jr-masthead h1\s*\{\s*font-size:\s*52px;/,
  )
})

test("bài hiện thêm sau khi bấm 'Xem thêm' vẫn được hiệu ứng cuộn theo dõi (không bị kẹt ẩn)", async () => {
  const { readFile } = await import("node:fs/promises")
  const hook = await readFile(new URL("../src/founder/hieu-ung.ts", import.meta.url), "utf8")
  assert.match(hook, /new MutationObserver\(capNhatDanhSach\)/)
  assert.match(hook, /mutationObserver\.observe\(container, \{ childList: true, subtree: true \}\)/)
  assert.match(hook, /mutationObserver\.disconnect\(\)/)
})

test("ảnh lồng trong thẻ hiện theo thẻ (ảnh bị clip-path cắt về 0px không tự kích hoạt observer)", async () => {
  const { readFile } = await import("node:fs/promises")
  const hook = await readFile(new URL("../src/founder/hieu-ung.ts", import.meta.url), "utf8")
  assert.match(hook, /entry\.target\s*\.querySelectorAll<HTMLElement>\('\[data-reveal="anh"\]'\)\s*\.forEach\(hien\)/)
})

test("mỗi chuyên mục hiện sẵn 3 bài, phần còn lại mở bằng nút Xem thêm / Thu gọn", () => {
  assert.match(pageSource, /const SO_BAI_HIEN_SAN = 3/)
  assert.match(pageSource, /baiTrongMuc\.slice\(0, SO_BAI_HIEN_SAN\)/)
  assert.match(pageSource, /\{baiHien\.map\(/)
  assert.match(pageSource, /aria-expanded=\{moRong\}/)
  assert.match(pageSource, /Xem thêm \$\{soBaiAn\} bài viết/)
  assert.match(css, /\.journal-page \.jr-more-btn \{/)
})

test("khung đọc nhanh có CSS lớp phủ cố định và dùng chung bộ hiển thị nội dung", () => {
  assert.match(css, /\.journal-page \.jr-reader-backdrop \{[^}]*position: fixed/s)
  assert.match(pageSource, /<HienThiNoiDung noiDung=\{noiDungDoc\.bai\.content\}/)
  assert.match(pageSource, /useBaiJournal\(baiDangDoc\?\.slug \?\? null\)/)
})
