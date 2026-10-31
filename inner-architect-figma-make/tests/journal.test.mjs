import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  BO_LOC_JOURNAL,
  KIEU_HIEN_ANH,
  kieuHienAnh,
  locBaiJournal,
  tenChuyenMuc,
} from "../src/journal/loc-journal.ts"

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8")
const pageSource = readFileSync(
  new URL("../src/journal/JournalPage.tsx", import.meta.url),
  "utf8",
)
const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8")

const baiMau = [
  { category: "TAROT", slug: "a", title: "A" },
  { category: "HIỂU MÌNH", slug: "b", title: "B" },
  { category: "TAROT", slug: "c", title: "C" },
  { category: "THE HERMIT", slug: "d", title: "D" },
]

test("journal filter bar follows the DOCX category labels in order", () => {
  assert.deepEqual(
    BO_LOC_JOURNAL.map((loc) => loc.nhan),
    [
      "Tất cả",
      "Hiểu mình",
      "Mối quan hệ",
      "Minh triết",
      "Tarot",
      "Sống tỉnh thức",
      "The Hermit",
    ],
  )
  assert.equal(tenChuyenMuc("SỐNG TỈNH THỨC"), "Sống tỉnh thức")
  assert.equal(tenChuyenMuc("KHÁC"), "KHÁC")
})

test("'Tất cả' hides only the featured article; a category shows all its articles", () => {
  assert.deepEqual(
    locBaiJournal(baiMau, null, "a").map((bai) => bai.slug),
    ["b", "c", "d"],
  )
  assert.deepEqual(
    locBaiJournal(baiMau, "TAROT", "a").map((bai) => bai.slug),
    ["a", "c"],
  )
})

test("journal route renders the new page with the existing articles and series", () => {
  assert.match(
    appSource,
    /<JournalPage baiViet=\{news\} chuyenDe=\{signatureSeriesList\} \/>/,
  )
  assert.doesNotMatch(appSource, /function NewsArchive\(/)
  // The App-wide section reveal must not double-animate Journal sections.
  assert.match(appSource, /:not\(\.journal-page\) > section/)
})

test("featured is text-left/image-right and article rows alternate sides", () => {
  assert.match(css, /\.jr-featured-link \{[^}]*grid-template-areas: "chu anh"/s)
  assert.match(pageSource, /const anhBenTrai = i % 2 === 0/)
  assert.match(css, /\.jr-row a \{[^}]*grid-template-areas: "anh chu"/s)
  assert.match(css, /\.jr-row--anh-phai a \{[^}]*grid-template-areas: "chu anh"/s)
  // Mobile: image on top, text directly below.
  assert.match(
    css,
    /@media \(max-width: 600px\)[\s\S]*\.jr-row--anh-phai a \{ grid-template-columns: 1fr; grid-template-areas: "anh" "chu"/,
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
