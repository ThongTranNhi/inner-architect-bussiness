import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import * as noiDung from "../src/founder/noi-dung-founder.ts"
import { docNguonWebsite } from "./nguon-website.mjs"

const pageSource = await readFile(
  new URL("../src/founder/FounderPage.tsx", import.meta.url),
  "utf8",
)
const appSource = docNguonWebsite()

test("founder page renders the eight portfolio sections in order", () => {
  const order = [
    "<FounderHero />",
    "<FounderGioiThieu />",
    "<FounderHanhTrinh />",
    "<FounderHocVan />",
    "<FounderTrietLy />",
    "<FounderDuAn />",
    "<FounderTamNhin />",
    "<FounderKetTrang />",
  ]
  const positions = order.map((tag) => pageSource.indexOf(tag))
  assert.ok(
    positions.every((pos) => pos > -1),
    "every section is rendered",
  )
  assert.deepEqual(
    [...positions].sort((a, b) => a - b),
    positions,
  )
})

test("founder page has exactly one h1 and is routed at /vo-khiem", () => {
  assert.equal(pageSource.match(/<h1\b/g)?.length, 1)
  assert.match(
    appSource,
    /path === "\/vo-khiem"\) return trang\(<FounderPage \/>\)/,
  )
  assert.match(appSource, /title: "Võ Khiêm \| Founder INNER ARCHITECT™"/)
})

test("unverified participation figures stay hidden until confirmed", () => {
  assert.equal(noiDung.soLieuDaXacNhan, false)
  assert.match(
    pageSource,
    /soLieuDaXacNhan && <p>\{gioiThieuFounder\.doanSoLieu\}/,
  )
  assert.match(pageSource, /duAn\.ky === "C" && soLieuDaXacNhan/)
  const visibleCopy = JSON.stringify({
    ...noiDung.gioiThieuFounder,
    doanSoLieu: undefined,
    duAn: noiDung.duAnFounder,
  })
  assert.doesNotMatch(visibleCopy, /100 học viên|200 lượt/)
})

test("psychology degree is not presented as awarded", () => {
  const tamLy = noiDung.hocVanFounder.muc.find(
    (muc) => muc.linhVuc === "Tâm lý học",
  )
  assert.ok(tamLy)
  assert.equal(tamLy.moc, "Đang chờ nhận bằng")
  assert.match(tamLy.bang, /^Đã hoàn thành chương trình đào tạo/)
})

test("founder portraits use placeholders, never another person's photo", () => {
  for (const key of ["chanDungHero", "hanhTrinh", "ketThuc"]) {
    assert.equal(
      noiDung.anhFounder[key].src,
      null,
      `${key} must stay a placeholder`,
    )
  }
  for (const anh of Object.values(noiDung.anhFounder)) {
    assert.ok(anh.alt.length > 0)
    assert.match(anh.tiLe, /^\d+ \/ \d+$/)
  }
})

test("founder copy avoids gendered pronouns, matching the portfolio", () => {
  const copy = JSON.stringify(noiDung)
  assert.doesNotMatch(copy, /\b(anh ấy|cô ấy|Anh|Cô) (viết|tiếp tục|là|đã)/)
})

const hieuUngSource = await readFile(
  new URL("../src/founder/hieu-ung.ts", import.meta.url),
  "utf8",
)
const founderCss = await readFile(
  new URL("../src/founder/founder.css", import.meta.url),
  "utf8",
)

test("layThuocTinhHieuUng tags elements and keeps existing styles", async () => {
  const { layThuocTinhHieuUng } = await import("../src/founder/hieu-ung.ts")
  const props = layThuocTinhHieuUng("anh", 2, { aspectRatio: "3 / 4" })
  assert.equal(props["data-reveal"], "anh")
  assert.equal(props.style["--fp-i"], 2)
  assert.equal(props.style.aspectRatio, "3 / 4")
  assert.equal(layThuocTinhHieuUng()["data-reveal"], "len")
})

test("content is only hidden when JS has enabled motion", () => {
  assert.doesNotMatch(
    founderCss,
    /(^|\n)\.founder-page \[data-reveal[^\n{]*\{[^}]*opacity:\s*0/,
  )
  assert.match(
    founderCss,
    /\.founder-page\.fp-motion \[data-reveal\] \{[^}]*opacity: 0/,
  )
  assert.match(hieuUngSource, /"IntersectionObserver" in window/)
  assert.match(hieuUngSource, /prefers-reduced-motion: reduce/)
  assert.match(
    founderCss,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\.founder-page \[data-reveal\][\s\S]*opacity: 1 !important/,
  )
})

test("reveal transitions animate only opacity and transform", () => {
  const revealRules = founderCss.match(/\.fp-motion[^{]*\{[^}]*\}/g) ?? []
  assert.ok(revealRules.length > 0)
  for (const rule of revealRules) {
    assert.doesNotMatch(rule, /\b(height|top|left|margin|width)\s*:/, rule)
  }
})

test("one shared observer that unobserves and disconnects", () => {
  assert.equal(hieuUngSource.match(/new IntersectionObserver/g)?.length, 1)
  assert.match(hieuUngSource, /observer\.unobserve\(/)
  assert.match(hieuUngSource, /observer\.disconnect\(\)/)
  assert.doesNotMatch(hieuUngSource, /addEventListener\("scroll"/)
})

test("founder page opts out of the global section observer", () => {
  assert.match(
    appSource,
    /main:not\(\.hermit-page\):not\(\.founder-page\)(:not\([^)]+\))* > section/,
  )
})

test("all eight sections carry a reveal animation", () => {
  const sections = pageSource.split(/\nfunction Founder/).slice(1, 9)
  assert.equal(sections.length, 8)
  for (const section of sections) {
    assert.match(section, /hieuUng\(|<KhungAnh/, section.slice(0, 40))
  }
})

test("giuTuGhep keeps Vietnamese compounds together without changing text", async () => {
  const { giuTuGhep } = await import("../src/founder/ngat-dong.ts")
  const nbsp = " "
  const tieuDe = "Hành trình từ trải nghiệm đến thấu hiểu"
  const ketQua = giuTuGhep(tieuDe)
  assert.match(ketQua, new RegExp(`trải${nbsp}nghiệm`))
  assert.match(ketQua, new RegExp(`thấu${nbsp}hiểu`))
  assert.match(ketQua, new RegExp(`^Hành${nbsp}trình`))
  assert.equal(ketQua.replace(/ /g, " "), tieuDe)
  assert.equal(
    giuTuGhep("Founder – INNER ARCHITECT™ System"),
    `Founder – INNER${nbsp}ARCHITECT™${nbsp}System`,
  )
  assert.equal(giuTuGhep("Không có cụm nào"), "Không có cụm nào")
})

test("tachCum splits roles and tagline into whole phrases", async () => {
  const { tachCum } = await import("../src/founder/ngat-dong.ts")
  assert.deepEqual(tachCum(noiDung.heroFounder.tagline), [
    "Khám phá bản thân",
    "Thấu hiểu nội tâm",
    "Phát triển chính mình",
  ])
  assert.equal(tachCum(noiDung.heroFounder.vaiTro).length, 3)
  assert.deepEqual(tachCum(""), [])
})

test("section eyebrows follow the approved English labels", () => {
  assert.deepEqual(
    [
      noiDung.heroFounder.eyebrow,
      noiDung.gioiThieuFounder.eyebrow,
      noiDung.hanhTrinhFounder.eyebrow,
      noiDung.hocVanFounder.eyebrow,
      noiDung.trietLyFounder.eyebrow,
      noiDung.duAnFounder.eyebrow,
      noiDung.tamNhinFounder.eyebrow,
      noiDung.ketTrangFounder.eyebrow,
    ],
    [
      "THE FOUNDER",
      "INTRODUCTION",
      "THE JOURNEY",
      "EDUCATION",
      "PHILOSOPHY",
      "SELECTED WORKS",
      "THE VISION",
      "INNER ARCHITECT™",
    ],
  )
  const eyebrows = pageSource.match(/className="fp-eyebrow"[^>]*>/g) ?? []
  assert.equal(eyebrows.length, 8)
  for (const tag of eyebrows) assert.match(tag, /lang="en"/)
})

test("core values show Vietnamese first, English as subtitle", () => {
  assert.match(
    pageSource,
    /\{giaTri\.tenViet\}\s*<span lang="en">\{giaTri\.ten\}<\/span>/,
  )
  assert.deepEqual(
    noiDung.trietLyFounder.giaTri.map((g) => [g.tenViet, g.ten]),
    [
      ["Tự nhận thức", "Self-Awareness"],
      ["Tư duy phản biện", "Critical Thinking"],
      ["Quyền tự quyết", "Personal Autonomy"],
    ],
  )
})

test("brand name is always INNER ARCHITECT™ on the founder page", () => {
  const copy = JSON.stringify(noiDung)
  assert.doesNotMatch(copy, /Inner Architect/)
  assert.doesNotMatch(copy, /INNER ARCHITECT(?!™)/)
  assert.match(copy, /INNER ARCHITECT™ System/)
})
