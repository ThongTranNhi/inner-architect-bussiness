# INNER ARCHITECT image assets

Every image in this folder is referenced from `src/` (mostly the `IMG` map in `src/App.tsx`), from `src/founder/noi-dung-founder.ts`, or by a test in `tests/`. Unreferenced files were removed on 2026-10-31; they remain recoverable from Git history (see "Removed in the 2026-10-31 cleanup" below).

Before adding or deleting an asset, search for its file name in `src/`, `index.html`, `vite.config.ts`, `.figma/` and `tests/`.

## Homepage (`homepage-curated/`, `home-story/`)

- `homepage-curated/01-hero-ban-tarot-nen-am.jpg` — homepage hero
- `homepage-curated/01-workshop-cham-ve-de-diu-lai.webp` — workshop card (also used on the founder page)
- `homepage-curated/02-loi-vao-phien-chuyen-sau-1-1.jpg` — session entry
- `homepage-curated/03-the-lo-trinh-phien-dau-tien.webp` — not rendered by the current source; kept because `tests/homepage-editorial.test.mjs` requires it
- `homepage-curated/04-the-lo-trinh-thuc-hanh-phan-tu.webp` — reflective practice card (also used on the founder page)
- `homepage-curated/05-the-lo-trinh-the-hermit-room.webp` — The Hermit card
- `homepage-curated/06-ranh-gioi-workshop-vong-tron-nhom.jpg` — boundary section
- `homepage-curated/07-khong-gian-chiem-nghiem-cuoi-trang.jpg` — closing section
- `homepage-curated/09-khong-gian-chuan-bi-phien.webp` — session setup
- `homepage-curated/10-nu-tu-van-don-khach.webp` — female advisor portrait
- `homepage-curated/11-phien-1-1-the-hermit.webp` — 1:1 session at The Hermit
- `home-story/the-hermit-room.webp` — homepage story section

## Journal (`journal/`)

- `journal/goc/hinh01.webp` … `hinh08.webp` — Journal photographs (hinh08 scaled to 1600×1200) from the supplied `journal/` folder (hinh01–06 follow the DOCX category order; hinh07 and hinh08 replace two article images)
- `journal/journal-tarot-box-portrait.webp` — close portrait of the Tarot box
- `journal/journal-tarot-flatlay-vertical.webp` — vertical Tarot flat lay
- `journal/journal-tarot-spread-vertical.webp` — vertical card spread with box and crystal sphere (also used on a programme page)
- `journal/journal-tarot-reading-horizontal.webp` — horizontal shallow-depth card spread (featured article)

Native pixel sizes for the Journal images live in `KICH_THUOC_ANH_JOURNAL` in `src/journal/loc-journal.ts`; update them if a file is replaced.

## LARA (`lara/`)

- `lara/lara-autumn-collage-source.webp` — supplied LARA product collage; useful inside a product story, not as a full-bleed hero
- `lara/lara-sacred-ground.webp` — Sacred Ground candle graphic (text baked in)
- `lara/lara-soul-cleanse.webp` — Soul Cleanse candle graphic (text baked in)
- `lara/lara-soul-embrace.webp` — Soul Embrace candle graphic (text baked in)

## The Hermit (`the-hermit/`)

All four are placeholders; verify whether they are real photographs or renders before publishing.

- `the-hermit/storefront-placeholder.webp` — exterior/storefront
- `the-hermit/main-hall-placeholder.webp` — main interior (also used on the founder page)
- `the-hermit/tea-room-placeholder.webp` — floor-seating tea room
- `the-hermit/tarot-room-placeholder.webp` — divided Tarot consultation room

## Workshop (`workshop/`)

- `workshop/ws-cham-ve-diu-lai-CMQz-7CG.webp` — "Chạm vẽ để dịu lại" workshop graphic (illustrative, contains text)

## Brand (`brand/`)

- `brand/the-hermit-lockup-source.png` and `.webp` — supplied The Hermit graphic lockup. Not referenced by the current source; kept as a logo reference until logo ownership and final format are confirmed.

## Site root (`public/`)

- `logocongty.jpg` — favicon, set through `.figma/make/site.json`
- `favicon.svg` — fallback favicon used by `vite.config.ts` when `site.json` sets no icon

## Converted to WebP on 2026-10-31

The PNG/JPEG originals of the files marked `.webp` above (homepage-curated 01/03/04/05/09/10/11, `home-story/the-hermit-room`, `the-hermit/tea-room-placeholder`, `workshop/ws-cham-ve-diu-lai-CMQz-7CG`, `lara/lara-autumn-collage-source`, `journal/goc/hinh01–08`) were re-encoded with `scripts/toi-uu-anh.py` at the same pixel size (PSNR ≥ 38 dB against the original; `hinh08` downscaled from 2560×1920). Total 20.5 MB → 3.6 MB. The originals remain in Git history.

## Removed in the 2026-10-31 cleanup

These files had no reference in `src/`, `index.html`, `vite.config.ts`, `.figma/`, `tests/` or `scripts/`. Restore any of them with `git checkout <commit> -- <path>` from a commit before the cleanup.

- `home-new/` (4 JPGs, byte-identical copies of `homepage-curated/01`, `02`, `06`, `07`)
- `home-story/first-session.png`, `home-story/reflective-practice.png` (copies of `homepage-curated/03`, `04`)
- `homepage/` — the DOCX graphics `home-author-cover`, `home-author-portrait`, `home-tarot-introduction` (PNG + WebP) and `tarot-table-candle-placeholder.jpeg`
- `system/founder-office-placeholder` (PNG + WebP)
- `journal/doc-image1.jpg` … `doc-image6.jpg` (368px DOCX crops, replaced by `journal/goc/`)
- PNG originals whose WebP is the version in use: `journal/journal-tarot-*.png` (4 files), `lara/lara-sacred-ground.png`, `lara/lara-soul-cleanse.png`, `lara/lara-soul-embrace.png`, `the-hermit/main-hall-placeholder.png`, `the-hermit/storefront-placeholder.png`, `the-hermit/tarot-room-placeholder.png`
- `the-hermit/tea-room-placeholder.webp` (the PNG is the version in use)
- `lara/lara-gourd-product-details`, `lara/lara-gourd-use`, `lara/lara-product-collage` (PNG + WebP)

See `image-placement-plan.md` for the approved, conditional and excluded usage map.
