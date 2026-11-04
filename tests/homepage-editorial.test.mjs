import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import test from "node:test"
import { docNguonWebsite } from "./nguon-website.mjs"

const appSource = docNguonWebsite()
const cssSource = await readFile(
  new URL("../src/index.css", import.meta.url),
  "utf8",
)

test("homepage uses the isolated editorial v4 structure", () => {
  assert.match(
    appSource,
    /className="home-page home-editorial-v3 home-editorial-v4"/,
  )
  assert.match(appSource, /className="home-v4-feature home-v4-workshop"/)
  assert.match(appSource, /className="home-v4-product-grid"/)
  assert.doesNotMatch(appSource, /className="home-pathway-card"/)
})

test("journal establishes one lead story and a secondary rail", () => {
  assert.match(appSource, /className="[^"]*home-journal-feature[^"]*"/)
  assert.match(appSource, /className="home-journal-rail"/)
  assert.match(
    cssSource,
    /\.home-journal-feature\s*\{[^}]*grid-column:\s*1\s*\/\s*8/s,
  )
  assert.match(
    cssSource,
    /\.home-journal-rail\s*\{[^}]*grid-column:\s*9\s*\/\s*13/s,
  )
})

test("motion is orchestrated and has a complete reduced-motion fallback", () => {
  assert.match(
    cssSource,
    /\.home-editorial-v3 \.reveal-on-scroll\s*\{[^}]*cubic-bezier\(\.86,\s*0,\s*\.07,\s*1\)/s,
  )
  assert.match(cssSource, /\.home-editorial-v3 \.reveal-child/)
  assert.match(
    cssSource,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.home-editorial-v3 \.reveal-on-scroll[\s\S]*transform:\s*none\s*!important/,
  )
  assert.match(
    cssSource,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*clip-path:\s*none\s*!important/,
  )
})

test("homepage responsive contract collapses the new editorial chapters", () => {
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-v3-hero-intro\s*\{[^}]*max-width:\s*100%\s*!important;[^}]*overflow-wrap:\s*anywhere/,
  )
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*760px\)[\s\S]*\.home-v4-intro,[\s\S]*?\.home-v4-founder\s*\{[^}]*grid-template-columns:\s*1fr/,
  )
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*760px\)[\s\S]*\.home-v4-session-grid,[\s\S]*?\.home-v4-product-grid\s*\{[^}]*grid-template-columns:\s*1fr/,
  )
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-journal-rail[\s\S]*grid-column:\s*1\s*\/\s*-1/,
  )
})

test("homepage serves the curated page-specific image collection", async () => {
  const curatedAssets = [
    "01-hero-ban-tarot-nen-am.jpg",
    "01-workshop-cham-ve-de-diu-lai.webp",
    "02-loi-vao-phien-chuyen-sau-1-1.jpg",
    "04-the-lo-trinh-thuc-hanh-phan-tu.webp",
    "07-khong-gian-chiem-nghiem-cuoi-trang.jpg",
    "10-nu-tu-van-don-khach.webp",
    "11-phien-1-1-the-hermit.webp",
  ]

  await Promise.all(
    curatedAssets.map((fileName) =>
      access(
        new URL(`../public/assets/homepage-curated/${fileName}`, import.meta.url),
      ),
    ),
  )

  assert.match(appSource, /src=\{IMG\.homeCuratedHero\}/)
  assert.match(appSource, /src=\{IMG\.homeGeneratedSessionEntry\}/)
  assert.match(appSource, /src=\{IMG\.homeGeneratedSessionProcess\}/)
  assert.match(appSource, /src=\{IMG\.homeCuratedClosing\}/)
  assert.match(appSource, /src=\{IMG\.homeCuratedWorkshop\}/)
  assert.match(appSource, /src=\{IMG\.homeCuratedReflective\}/)
  assert.match(appSource, /src=\{IMG\.hermitHall\}/)
  assert.match(appSource, /src=\{IMG\.soulCleanse\}/)
  assert.match(appSource, /src=\{IMG\.tarot2\}/)
})

test("homepage uses one female-advisor portrait and distinct later session scenes", async () => {
  const sessionAssets = [
    "10-nu-tu-van-don-khach.webp",
    "11-phien-1-1-the-hermit.webp",
  ]

  await Promise.all(
    sessionAssets.map((fileName) =>
      access(
        new URL(`../public/assets/homepage-curated/${fileName}`, import.meta.url),
      ),
    ),
  )

  assert.doesNotMatch(appSource, /IMG\.homeCuratedSession/)
  assert.match(appSource, /anh: IMG\.homeFemaleAdvisor/)
  assert.match(appSource, /src=\{IMG\.homeGeneratedSessionEntry\}/)
  assert.match(appSource, /src=\{IMG\.homeGeneratedSessionProcess\}/)
})

test("four-layer gallery preserves the full landscape images", () => {
  assert.doesNotMatch(
    cssSource,
    /\.home-v3-layer:nth-child\(\d\)\s+img\s*\{\s*height:\s*\d+px;/,
  )
  assert.match(
    cssSource,
    /\.home-v3-layer img\s*\{[^}]*height:\s*auto;[^}]*aspect-ratio:\s*auto;[^}]*object-fit:\s*contain;/s,
  )
})

test("homepage follows the approved Inner Architect content architecture", () => {
  const sectionMarkers = [
    'id="gioi-thieu"',
    'id="he-thong"',
    'id="phien-dong-hanh"',
    'id="workshop"',
    'id="san-pham"',
    'id="the-hermit"',
    'id="nguoi-sang-lap"',
    'id="journal"',
    'id="lien-he"',
  ]
  const sectionPositions = sectionMarkers.map((marker) => appSource.indexOf(marker))

  assert.ok(sectionPositions.every((position) => position >= 0))
  assert.deepEqual(sectionPositions, [...sectionPositions].sort((a, b) => a - b))
  assert.match(appSource, /INNER ARCHITECT™ · KIẾN TRÚC SƯ NỘI TÂM/)
  assert.match(appSource, /Xây trật tự bên trong,/)
  assert.match(appSource, /để sống tự chủ\./)
  assert.match(appSource, /Kiến trúc sư nội tâm — xây nền từ sự thấu hiểu chính mình\./)
  assert.match(appSource, /Hiểu mình sâu hơn\. Từng bước tự đứng vững\./)
  assert.match(appSource, /Từ soi chiếu bản thân đến thay đổi trong đời sống\./)
  assert.match(appSource, /Dành thời gian cho điều bạn đang cần nhìn lại\./)
  assert.match(appSource, /Gặp gỡ, khám phá và thực hành cùng nhau\./)
  assert.match(appSource, /Một khoảng dừng, một góc nhìn mới\./)
  assert.match(appSource, /Một khoảng dừng để trở về với mình\./)
  assert.match(appSource, /Từ hành trình tìm lại mình đến mong muốn đồng hành cùng người khác\./)
  assert.match(appSource, /Đọc để hiểu mình, dừng lại để nhìn sâu hơn\./)
  assert.match(appSource, /Bắt đầu từ điều bạn đang quan tâm\./)
  assert.match(appSource, /ten: "Tiếp cận & Soi chiếu"/)
  assert.match(appSource, /ten: "Khám phá & Thay đổi khuôn mẫu"/)
  assert.match(appSource, /ten: "Định hướng & Phát triển"/)
  assert.match(appSource, /ten: "Chăm sóc thân thể & Cân bằng"/)
})

test("homepage display headings stay within the approved editorial scale", () => {
  assert.match(
    cssSource,
    /\.home-v3-hero h1\s*\{[^}]*font-size:\s*clamp\(44px,\s*4\.8vw,\s*72px\);[^}]*line-height:\s*\.96/s,
  )
  assert.match(
    cssSource,
    /\.home-v3-opening-heading h2,[\s\S]*?\.home-v3-journal-heading h2\s*\{[^}]*font-size:\s*clamp\(42px,\s*4\.2vw,\s*64px\);[^}]*line-height:\s*1;/,
  )
  assert.match(
    cssSource,
    /\.home-v3-ethics-statement h2\s*\{[^}]*font-size:\s*clamp\(46px,\s*5\.1vw,\s*76px\);[^}]*line-height:\s*\.98/s,
  )
  assert.match(
    cssSource,
    /\.home-v3-closing h2\s*\{[^}]*font-size:\s*clamp\(48px,\s*5\.2vw,\s*80px\);[^}]*line-height:\s*\.98/s,
  )
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-v3-opening-heading h2,[\s\S]*?\.home-v3-journal-heading h2\s*\{\s*font-size:\s*40px;/,
  )
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-v3-ethics-statement h2\s*\{\s*font-size:\s*44px;/,
  )
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-v3-closing h2\s*\{\s*font-size:\s*48px;/,
  )
})

