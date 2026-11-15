/**
 * `pnpm journal:import` — nhập dữ liệu Journal ban đầu (6 chuyên mục, 28 bài của website cũ)
 * từ `database/seed/journal-ban-dau.json` vào MySQL.
 *
 * - Chạy lại an toàn: chỉ THÊM chuyên mục/bài chưa có (so theo slug), không bao giờ ghi đè
 *   nội dung đã chỉnh trong trang quản trị.
 * - Bài nhập vào ở trạng thái đã xuất bản với đúng tiêu đề, nội dung, ảnh, chuyên mục,
 *   thứ tự và slug (URL /journal/<slug>) như website cũ; ngày hiển thị giữ nguyên.
 * - `--dry-run`: chạy trong transaction rồi rollback, chỉ in báo cáo.
 * - `--test`: nhập vào database test (`TEST_DB_NAME`).
 *
 * Yêu cầu đã chạy migration 003 (`pnpm db:migrate`).
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import mysql, { type ResultSetHeader, type RowDataPacket } from "mysql2/promise"
import { z } from "zod"
import { docCauHinh } from "../src/config/env.ts"
import { chuanHoaNoiDung, laDuongDanAnhHopLe, vanBanThanhNoiDung } from "../src/modules/journal/noi-dung.ts"
import { MAU_SLUG } from "../src/modules/journal/journal.schema.ts"
import { thuMucGocServer } from "../src/utils/duong-dan.ts"

const anh = z.string().refine(laDuongDanAnhHopLe, "Đường dẫn ảnh không hợp lệ")
const schemaSeed = z.object({
  categories: z
    .array(
      z.object({
        slug: z.string().regex(MAU_SLUG),
        code: z.string().min(1),
        name: z.string().min(1).max(150),
        englishName: z.string().max(150),
        label: z.string().max(80),
        description: z.string().max(600),
        image: anh,
      }),
    )
    .min(1),
  articles: z.array(
    z.object({
      slug: z.string().regex(MAU_SLUG).max(160),
      category: z.string().min(1),
      date: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/),
      title: z.string().min(1).max(255),
      summary: z.string().max(1000),
      image: anh,
      featured: z.boolean(),
      content: z.string(),
    }),
  ),
})

/**
 * Đọc và kiểm tra file seed.
 *
 * @returns Dữ liệu seed hợp lệ
 * @throws Error khi file sai cấu trúc hoặc bài trỏ tới chuyên mục không có
 */
export function docSeedJournal(): z.infer<typeof schemaSeed> {
  const tep = path.join(thuMucGocServer(), "database", "seed", "journal-ban-dau.json")
  const seed = schemaSeed.parse(JSON.parse(readFileSync(tep, "utf8")))
  const maMuc = new Set(seed.categories.map((m) => m.code))
  const loi = seed.articles.filter((b) => !maMuc.has(b.category)).map((b) => b.slug)
  if (loi.length > 0) throw new Error(`Bài trỏ tới chuyên mục không có: ${loi.join(", ")}`)
  return seed
}

/**
 * Nhập seed vào một kết nối MySQL (trong transaction do hàm tự mở).
 *
 * @param ketNoi - Kết nối tới database đích
 * @param chayThu - `true` để rollback sau khi chạy (dry-run)
 * @returns Số chuyên mục/bài đã thêm và đã có sẵn
 */
export async function nhapSeedJournal(
  ketNoi: mysql.Connection,
  chayThu = false,
): Promise<{ chuyenMucThem: number; chuyenMucCoSan: number; baiThem: number; baiCoSan: number }> {
  const seed = docSeedJournal()
  const thongKe = { chuyenMucThem: 0, chuyenMucCoSan: 0, baiThem: 0, baiCoSan: 0 }
  await ketNoi.beginTransaction()
  try {
    for (const [viTri, muc] of seed.categories.entries()) {
      const [kq] = await ketNoi.execute<ResultSetHeader>(
        `INSERT IGNORE INTO journal_categories (slug, name, english_name, label, description, image, is_public, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [muc.slug, muc.name, muc.englishName || null, muc.label || null, muc.description, muc.image, viTri + 1],
      )
      thongKe[kq.affectedRows === 1 ? "chuyenMucThem" : "chuyenMucCoSan"]++
    }
    const [dongMuc] = await ketNoi.query<(RowDataPacket & { id: number; slug: string })[]>(
      "SELECT id, slug FROM journal_categories WHERE slug IN (?)",
      [seed.categories.map((m) => m.slug)],
    )
    const idTheoMa = new Map(
      seed.categories.map((m) => [m.code, Number(dongMuc.find((d) => d.slug === m.slug)!.id)]),
    )

    const thuTuTrongMuc = new Map<string, number>()
    for (const bai of seed.articles) {
      const thuTu = (thuTuTrongMuc.get(bai.category) ?? 0) + 1
      thuTuTrongMuc.set(bai.category, thuTu)
      const noiDung = chuanHoaNoiDung(vanBanThanhNoiDung(bai.content))
      const maMuc = idTheoMa.get(bai.category)!
      const ngay = `${bai.date.replace(/\./g, "-")} 00:00:00`
      const banCongKhai = { title: bai.title, summary: bai.summary, coverImage: bai.image, coverAlt: null, content: noiDung }
      const [kq] = await ketNoi.execute<ResultSetHeader>(
        `INSERT IGNORE INTO journal_articles
           (slug, category_id, sort_order, is_featured, title, summary, cover_image, cover_alt, content,
            published_category_id, published_data, published_at, published_updated_at, has_draft_changes)
         VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, 0)`,
        [
          bai.slug,
          maMuc,
          thuTu,
          bai.featured,
          bai.title,
          bai.summary,
          bai.image,
          JSON.stringify(noiDung),
          maMuc,
          JSON.stringify(banCongKhai),
          ngay,
          ngay,
        ],
      )
      thongKe[kq.affectedRows === 1 ? "baiThem" : "baiCoSan"]++
    }
    if (chayThu) await ketNoi.rollback()
    else await ketNoi.commit()
    return thongKe
  } catch (loi) {
    await ketNoi.rollback().catch(() => undefined)
    throw loi
  }
}

// Chạy trực tiếp bằng `tsx scripts/nhap-journal.ts` (không chạy khi được import trong test).
if (import.meta.filename === path.resolve(process.argv[1] ?? "")) {
  const cauHinh = docCauHinh()
  const dungTest = process.argv.includes("--test")
  const chayThu = process.argv.includes("--dry-run")
  const tenDatabase = dungTest ? cauHinh.TEST_DB_NAME : cauHinh.DB_NAME
  if (!tenDatabase) {
    console.error("Thiếu TEST_DB_NAME trong .env.")
    process.exit(1)
  }
  const ketNoi = await mysql.createConnection({
    host: cauHinh.DB_HOST,
    port: cauHinh.DB_PORT,
    database: tenDatabase,
    user: cauHinh.DB_USER,
    password: cauHinh.DB_PASSWORD,
    timezone: "Z",
    charset: "utf8mb4_unicode_ci",
  })
  try {
    await ketNoi.query("SET time_zone = '+00:00'")
    const kq = await nhapSeedJournal(ketNoi, chayThu)
    console.log(
      `${chayThu ? "[DRY-RUN — đã rollback] " : ""}${tenDatabase}: ` +
        `chuyên mục thêm ${kq.chuyenMucThem}, đã có ${kq.chuyenMucCoSan}; ` +
        `bài thêm ${kq.baiThem}, đã có ${kq.baiCoSan}.`,
    )
  } catch (loi) {
    const ma = (loi as { code?: string }).code
    console.error(
      ma === "ER_NO_SUCH_TABLE"
        ? "Chưa có bảng Journal. Chạy `pnpm db:migrate` trước."
        : loi instanceof Error
          ? loi.message
          : loi,
    )
    process.exitCode = 1
  } finally {
    await ketNoi.end()
  }
}
