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
import { docNguonWebsite } from "./nguon-website.mjs"

const appSource = docNguonWebsite()
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

test("featured showcase has primary and secondary articles, library uses editorial grid with filter tabs", () => {
  assert.match(css, /\.jr-featured-link \{[^}]*grid-template-areas: "chu anh"/s)
  assert.match(css, /\.jr-featured-sub-grid \{[^}]*grid-template-columns:/s)
  assert.match(css, /\.jr-grid \{[^}]*grid-template-columns:\s*repeat\(3,/s)
  assert.match(pageSource, /<nav className="jr-filter"/)
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
