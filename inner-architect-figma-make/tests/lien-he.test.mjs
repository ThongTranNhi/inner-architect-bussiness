import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { kiemTraDuongDanLienHe } from "../src/lien-he/kiem-tra-duong-dan-lien-he.ts"

const appSource = await readFile(
  new URL("../src/App.tsx", import.meta.url),
  "utf8",
)
const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
)

test("kiemTraDuongDanLienHe accepts official https Zalo and Facebook URLs", () => {
  assert.equal(
    kiemTraDuongDanLienHe("https://zalo.me/123456789", "zalo"),
    "https://zalo.me/123456789",
  )
  assert.equal(
    kiemTraDuongDanLienHe(
      "  https://www.facebook.com/innerarchitect  ",
      "facebook",
    ),
    "https://www.facebook.com/innerarchitect",
  )
  assert.equal(
    kiemTraDuongDanLienHe("https://m.me/innerarchitect", "facebook"),
    "https://m.me/innerarchitect",
  )
})

test("kiemTraDuongDanLienHe rejects missing, unsafe or wrong-channel URLs", () => {
  const invalid = [
    [undefined, "zalo"],
    [null, "zalo"],
    ["", "zalo"],
    ["   ", "facebook"],
    ["not a url", "zalo"],
    ["http://zalo.me/123", "zalo"],
    ["javascript:alert(1)", "zalo"],
    ["https://zalo.me.evil.example/123", "zalo"],
    ["https://evil.example/zalo.me", "zalo"],
    ["https://user:pass@zalo.me/123", "zalo"],
    ["https://zalo.me/", "zalo"],
    ["https://www.facebook.com/page", "zalo"],
    ["https://zalo.me/123", "facebook"],
  ]
  for (const [value, channel] of invalid) {
    assert.equal(
      kiemTraDuongDanLienHe(value, channel),
      null,
      `${String(value)} should be rejected for ${channel}`,
    )
  }
})

test("contact page replaces the out-of-scope booking form", () => {
  assert.match(appSource, /function ContactPage\(/)
  assert.match(
    appSource,
    /path === "\/lien-he"\) return trang\(<ContactPage \/>\)/,
  )
  assert.match(appSource, /if \(duongDan === "\/booking"\) return "\/lien-he"/)
  assert.doesNotMatch(appSource, /function Booking\(/)
  assert.doesNotMatch(appSource, /<Link to="\/booking"/)
  assert.doesNotMatch(appSource, /Yêu cầu của bạn đã được ghi nhận/)
})

test("no sensitive screening questions or data-collection fields remain", () => {
  assert.doesNotMatch(appSource, /<textarea/)
  assert.doesNotMatch(appSource, /<select/)
  assert.doesNotMatch(appSource, /<input/)
  assert.doesNotMatch(appSource, /nguy cơ\s+gây hại cho bản thân/)
  assert.doesNotMatch(
    appSource,
    /hỗ trợ tâm lý, trị liệu hoặc một hình thức đồng\s+hành tương tự/,
  )
})

test("decorative newsletter and dead load-more controls are removed", () => {
  assert.doesNotMatch(appSource, /className="newsletter"/)
  assert.doesNotMatch(appSource, /NEWSLETTER/)
  assert.doesNotMatch(appSource, /XEM TOÀN BỘ BÀI VIẾT/)
})

test("external contact links come only from the shared contact config", () => {
  assert.doesNotMatch(
    appSource,
    /https:\/\/(www\.)?(zalo\.me|facebook\.com|m\.me)/,
  )
  assert.match(appSource, /from "\.\/config\/contact"/)
  const externalLinks = appSource.match(/target="_blank"/g) ?? []
  const safeExternalLinks =
    appSource.match(/target="_blank"\s+rel="noopener noreferrer"/g) ?? []
  assert.ok(externalLinks.length > 0)
  assert.equal(safeExternalLinks.length, externalLinks.length)
})

test("MVP support pages and a real 404 are routed", () => {
  for (const route of ["/faq", "/chinh-sach-bao-mat", "/pham-vi-ho-tro"]) {
    assert.match(appSource, new RegExp(`path === "${route}"\\)`))
  }
  assert.match(
    appSource,
    /return \{ trang: <NotFoundPage \/>, laTrang404: true \}/,
  )
})

test("unused gsap dependency is not shipped", () => {
  assert.equal(packageJson.dependencies?.gsap, undefined)
  assert.doesNotMatch(appSource, /from "gsap/)
})
