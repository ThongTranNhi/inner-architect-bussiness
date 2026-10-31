import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import test from "node:test"
import { docNguonWebsite } from "./nguon-website.mjs"

const appSource = docNguonWebsite()
const cssSource = await readFile(
  new URL("../src/index.css", import.meta.url),
  "utf8",
)

test("homepage uses the isolated editorial v3 structure", () => {
  assert.match(appSource, /className="home-page home-editorial-v3"/)
  assert.match(appSource, /className="[^"]*home-story-feature[^"]*"/)
  assert.match(appSource, /className="[^"]*home-story-secondary[^"]*"/)
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

test("homepage responsive contract avoids fixed desktop-only story columns", () => {
  assert.match(appSource, /className="home-v3-mobile-break"/)
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-v3-mobile-break\s*\{[^}]*display:\s*block/,
  )
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-v3-hero-intro\s*\{[^}]*max-width:\s*100%\s*!important;[^}]*overflow-wrap:\s*anywhere/,
  )
  assert.match(appSource, /className="home-v3-intro-line"/)
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-v3-intro-line\s*\{[^}]*display:\s*block/,
  )
  assert.match(
    cssSource,
    /@media\s*\(max-width:\s*600px\)[\s\S]*\.home-story-feature[\s\S]*grid-column:\s*1\s*\/\s*-1/,
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
    "03-the-lo-trinh-phien-dau-tien.webp",
    "04-the-lo-trinh-thuc-hanh-phan-tu.webp",
    "05-the-lo-trinh-the-hermit-room.webp",
    "06-ranh-gioi-workshop-vong-tron-nhom.jpg",
    "07-khong-gian-chiem-nghiem-cuoi-trang.jpg",
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
  assert.match(appSource, /image: IMG\.homeCuratedHermit/)
  assert.match(appSource, /image: IMG\.homeCuratedWorkshop/)
  assert.match(appSource, /image: IMG\.homeCuratedReflective/)
  assert.match(appSource, /src=\{IMG\.homeCuratedBoundary\}/)
})

test("homepage uses one female-advisor portrait and distinct later session scenes", async () => {
  const sessionAssets = [
    "09-khong-gian-chuan-bi-phien.webp",
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
  assert.match(appSource, /image: IMG\.homeGeneratedSessionSetup/)
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

