import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

import { KICH_THUOC_ANH_JOURNAL } from "../src/journal/loc-journal.ts"
import { docNguonWebsite } from "./nguon-website.mjs"

const doc = (duongDan) =>
  readFileSync(new URL(`../${duongDan}`, import.meta.url), "utf8")
const appSource = doc("src/App.tsx")
const nguon = [
  docNguonWebsite(),
  doc("src/journal/JournalPage.tsx"),
  doc("src/founder/FounderPage.tsx"),
].join("\n")
const nguonCoDuongDanAnh = [
  nguon,
  doc("src/founder/noi-dung-founder.ts"),
  doc("src/journal/loc-journal.ts"),
].join("\n")

/**
 * Đọc kích thước điểm ảnh từ header của file PNG, JPEG hoặc WebP.
 *
 * @param duongDanCongKhai - Đường dẫn công khai, ví dụ `/assets/a.webp`
 * @returns `[rộng, cao]`
 * @throws Khi định dạng không được hỗ trợ
 */
function kichThuocTep(duongDanCongKhai) {
  const b = readFileSync(new URL(`../public${duongDanCongKhai}`, import.meta.url))
  if (b.toString("ascii", 1, 4) === "PNG") return [b.readUInt32BE(16), b.readUInt32BE(20)]
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const loai = b.toString("ascii", 12, 16)
    if (loai === "VP8X") return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1]
    if (loai === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
    if (loai === "VP8L") {
      const v = b.readUInt32LE(21)
      return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]
    }
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i < b.length) {
      const ma = b[i + 1]
      const dai = b.readUInt16BE(i + 2)
      if (ma >= 0xc0 && ma <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(ma))
        return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]
      i += 2 + dai
    }
  }
  throw new Error(`Không đọc được kích thước: ${duongDanCongKhai}`)
}

const TRANG_LAZY = [
  "JournalPage",
  "FounderPage",
  "Article",
  "Programmes",
  "Hermit",
  "LaraPage",
  "ContactPage",
  "FaqPage",
  "LegalPage",
  "NotFoundPage",
]

test("homepage stays in the main bundle while every secondary route is lazy-loaded", () => {
  assert.match(appSource, /^function Home\(/m)
  assert.doesNotMatch(
    appSource,
    /^import [^\n]*from "\.\/(trang\/|journal\/JournalPage|founder\/FounderPage)/m,
  )
  for (const ten of TRANG_LAZY) {
    const khop = appSource.match(
      new RegExp(
        `const ${ten} = lazy\\(\\(\\) =>\\s*napModule\\(\\(\\) => import\\("\\./([^"]+)"\\)\\)\\.then\\(\\(m\\) => \\(\\{\\s*default: m\\.${ten},?\\s*\\}\\)\\)`,
      ),
    )
    assert.ok(khop, `${ten} must be declared with React.lazy`)
    const module = doc(`src/${khop[1]}.tsx`)
    assert.match(module, new RegExp(`export function ${ten}\\(`))
  }
})

test("a missing chunk after a new release reloads the page once instead of failing", () => {
  const ham = appSource.match(/function napModule<T>\([\s\S]*?\n\}\n/)
  assert.ok(ham, "napModule helper exists")
  assert.match(ham[0], /window\.location\.reload\(\)/)
  assert.match(ham[0], /sessionStorage/)
  // A second failure in the same session must surface instead of looping.
  assert.match(ham[0], /throw loi/)
})

test("lazy pages render inside Suspense and scroll reveal waits for the mounted page", () => {
  const fallback = appSource.match(/<Suspense fallback=\{([^}]*)\}>/)
  assert.ok(fallback, "pages are wrapped in Suspense")
  assert.match(fallback[1], /aria-busy="true"/)
  // The fallback must not stand in for the page's own heading.
  assert.doesNotMatch(fallback[1], /<h[1-6]/)
  assert.match(appSource, /<TinHieuTrangSanSang duongDan=\{path\}/)
  assert.match(appSource, /if \(trangSanSang !== path\) return/)
  assert.match(appSource, /\}, \[path, trangSanSang\]\)/)
})

test("hash routes keep 404 detection outside the lazy chunks", () => {
  assert.match(appSource, /return \{ trang: <NotFoundPage \/>, laTrang404: true \}/)
  assert.match(appSource, /news\.some\(\(item\) => item\.slug === slug\)/)
  assert.match(appSource, /danhSachChiTietChuongTrinh\[slug\]/)
})

test("LCP images load eagerly with high priority; every other image is lazy and async", () => {
  const theAnh = nguon.match(/<img\b[\s\S]*?\/>/g) ?? []
  assert.ok(theAnh.length > 20)
  for (const the of theAnh) {
    if (/uuTien \?/.test(the)) {
      assert.match(the, /fetchPriority=\{uuTien \? "high" : "auto"\}/, the)
      assert.match(the, /loading=\{uuTien \? "eager" : "lazy"\}/, the)
      continue
    }
    if (/fetchPriority="high"/.test(the)) {
      assert.doesNotMatch(the, /loading="lazy"/, the)
      continue
    }
    assert.match(the, /loading="lazy"/, the)
    assert.match(the, /decoding="async"/, the)
  }
  const uuTien = theAnh.filter((the) => /fetchPriority="high"/.test(the))
  for (const lcp of [
    /src=\{IMG\.homeCuratedHero\}/,
    /className="lead-image"/,
    /src=\{IMG\.hermitStorefront\}/,
    /src=\{tieuDiem\.image\}/,
  ])
    assert.ok(uuTien.some((the) => lcp.test(the)), `${lcp} must be high priority`)
})

test("menu preview image is only requested once the menu has been opened", () => {
  assert.match(appSource, /const \[daMoMenu, setDaMoMenu\] = useState\(open\)/)
  assert.match(appSource, /\{daMoMenu && \(\s*<img/)
})

const ANH_DA_CHUYEN = [
  ["/assets/homepage-curated/03-the-lo-trinh-phien-dau-tien.png", "/assets/homepage-curated/03-the-lo-trinh-phien-dau-tien.webp", 1448, 1086],
  ["/assets/homepage-curated/04-the-lo-trinh-thuc-hanh-phan-tu.png", "/assets/homepage-curated/04-the-lo-trinh-thuc-hanh-phan-tu.webp", 1448, 1086],
  ["/assets/homepage-curated/05-the-lo-trinh-the-hermit-room.png", "/assets/homepage-curated/05-the-lo-trinh-the-hermit-room.webp", 1448, 1086],
  ["/assets/homepage-curated/09-khong-gian-chuan-bi-phien.png", "/assets/homepage-curated/09-khong-gian-chuan-bi-phien.webp", 1448, 1086],
  ["/assets/homepage-curated/10-nu-tu-van-don-khach.png", "/assets/homepage-curated/10-nu-tu-van-don-khach.webp", 1448, 1086],
  ["/assets/homepage-curated/11-phien-1-1-the-hermit.png", "/assets/homepage-curated/11-phien-1-1-the-hermit.webp", 1448, 1086],
  ["/assets/homepage-curated/01-workshop-cham-ve-de-diu-lai.png", "/assets/homepage-curated/01-workshop-cham-ve-de-diu-lai.webp", 800, 533],
  ["/assets/home-story/the-hermit-room.png", "/assets/home-story/the-hermit-room.webp", 1448, 1086],
  ["/assets/the-hermit/tea-room-placeholder.png", "/assets/the-hermit/tea-room-placeholder.webp", 1448, 1086],
  ["/assets/workshop/ws-cham-ve-diu-lai-CMQz-7CG.png", "/assets/workshop/ws-cham-ve-diu-lai-CMQz-7CG.webp", 800, 533],
  ["/assets/lara/lara-autumn-collage-source.jpeg", "/assets/lara/lara-autumn-collage-source.webp", 1080, 1080],
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => [
    `/assets/journal/goc/hinh0${n}.jpg`,
    `/assets/journal/goc/hinh0${n}.webp`,
    1536,
    1024,
  ]),
  // Scaled from 2560×1920; same 4:3 ratio, still wider than any rendered size.
  ["/assets/journal/goc/hinh08.jpg", "/assets/journal/goc/hinh08.webp", 1600, 1200],
]

test("converted images exist, keep their aspect ratio and replace every old reference", () => {
  for (const [cu, moi, rong, cao] of ANH_DA_CHUYEN) {
    assert.ok(existsSync(new URL(`../public${moi}`, import.meta.url)), `${moi} exists`)
    assert.deepEqual(kichThuocTep(moi), [rong, cao], moi)
    assert.ok(!nguonCoDuongDanAnh.includes(cu), `${cu} is no longer referenced`)
  }
})

test("every image URL referenced by the website exists in public/", () => {
  const urls = new Set(
    nguonCoDuongDanAnh.match(/\/assets\/[\w./-]+\.(?:png|jpe?g|webp|svg)/g),
  )
  assert.ok(urls.size > 20)
  for (const url of urls)
    assert.ok(existsSync(new URL(`../public${url}`, import.meta.url)), `${url} is missing`)
})

test("journal intrinsic sizes match the real image files", () => {
  for (const [url, kichThuoc] of Object.entries(KICH_THUOC_ANH_JOURNAL))
    assert.deepEqual(kichThuocTep(url), [...kichThuoc], url)
})
