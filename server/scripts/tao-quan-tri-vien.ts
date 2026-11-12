/**
 * `pnpm admin:create` — tạo tài khoản nhân viên cho trang quản trị.
 *
 *   pnpm admin:create -- --username lan.cc --display-name "Lan" --role customer_care
 *
 * Trường thiếu sẽ được hỏi tương tác. Mật khẩu luôn nhập từ bàn phím (ẩn ký tự)
 * hoặc từ stdin khi chạy không tương tác; không nhận qua tham số dòng lệnh để
 * tránh lưu vào lịch sử shell. Không có tài khoản/mật khẩu mặc định.
 */
import { createInterface } from "node:readline"
import { parseArgs } from "node:util"
import { z } from "zod"
import { taoPoolKetNoi } from "../src/config/database.ts"
import { docCauHinh } from "../src/config/env.ts"
import { themQuanTriVien } from "../src/modules/auth/auth.repository.ts"
import {
  bamMatKhau,
  DO_DAI_MAT_KHAU_TOI_DA,
  DO_DAI_MAT_KHAU_TOI_THIEU,
} from "../src/modules/auth/mat-khau.ts"
import { VAI_TRO_QUAN_TRI } from "../src/utils/dich-vu.ts"

const schemaTaiKhoan = z.object({
  username: z
    .string()
    .trim()
    .regex(/^[a-z0-9._-]{3,100}$/, "Username 3–100 ký tự: chữ thường, số, . _ -"),
  displayName: z.string().trim().min(1, "Tên hiển thị bắt buộc").max(150),
  role: z.enum(VAI_TRO_QUAN_TRI),
  password: z
    .string()
    .min(DO_DAI_MAT_KHAU_TOI_THIEU, `Mật khẩu tối thiểu ${DO_DAI_MAT_KHAU_TOI_THIEU} ký tự`)
    .max(DO_DAI_MAT_KHAU_TOI_DA),
})

const { values: thamSo } = parseArgs({
  // `pnpm admin:create -- --username x` chuyển cả dấu `--` vào script; bỏ nó đi.
  args: process.argv.slice(2).filter((thamSoDong) => thamSoDong !== "--"),
  options: {
    username: { type: "string" },
    "display-name": { type: "string" },
    role: { type: "string" },
  },
})

// Dùng một readline cho cả phiên để không mất dòng stdin đã đệm (chế độ không tương tác).
const giaoDien = createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY })
const hangDoiDong: string[] = []
const choDong: ((dong: string) => void)[] = []
let daHetDauVao = false
giaoDien.on("line", (dong) => {
  const cho = choDong.shift()
  if (cho) cho(dong)
  else hangDoiDong.push(dong)
})
// stdin đóng (pipe hết dữ liệu) khi còn câu hỏi đang chờ → trả chuỗi rỗng để báo thiếu dữ liệu.
giaoDien.on("close", () => {
  daHetDauVao = true
  for (const cho of choDong.splice(0)) cho("")
})

/**
 * Hỏi một dòng từ người dùng; khi `an` = true thì không hiển thị ký tự đã gõ.
 *
 * @param cauHoi - Lời nhắc
 * @param an - Ẩn ký tự (dùng cho mật khẩu)
 * @returns Chuỗi người dùng nhập
 */
function hoi(cauHoi: string, an = false): Promise<string> {
  process.stdout.write(cauHoi)
  const coSan = hangDoiDong.shift()
  if (coSan !== undefined) {
    if (an) process.stdout.write("\n")
    return Promise.resolve(coSan)
  }
  if (daHetDauVao) {
    process.stdout.write("\n")
    return Promise.resolve("")
  }
  const ghiGoc = (giaoDien as unknown as { _writeToOutput: (s: string) => void })._writeToOutput
  if (an && process.stdin.isTTY) {
    ;(giaoDien as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s) => {
      if (s.includes("\n") || s.includes("\r")) process.stdout.write("\n")
    }
  }
  return new Promise((resolve) => {
    choDong.push((dong) => {
      ;(giaoDien as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = ghiGoc
      resolve(dong)
    })
  })
}

const username = thamSo.username ?? (await hoi("Username: "))
const displayName = thamSo["display-name"] ?? (await hoi("Tên hiển thị: "))
// Không tương tác (stdin là pipe) thì không hỏi vai trò để dòng đầu tiên luôn là mật khẩu.
const role =
  thamSo.role ??
  (process.stdin.isTTY
    ? (await hoi("Vai trò (admin/customer_care) [customer_care]: ")) || "customer_care"
    : "customer_care")
const password = await hoi("Mật khẩu: ", true)
if (process.stdin.isTTY) {
  const xacNhan = await hoi("Nhập lại mật khẩu: ", true)
  if (xacNhan !== password) {
    console.error("Mật khẩu nhập lại không khớp.")
    process.exit(1)
  }
}
giaoDien.close()

const ketQua = schemaTaiKhoan.safeParse({ username, displayName, role, password })
if (!ketQua.success) {
  for (const issue of ketQua.error.issues) console.error(`- ${issue.path.join(".")}: ${issue.message}`)
  process.exit(1)
}

const cauHinh = docCauHinh()
const pool = taoPoolKetNoi(cauHinh, { connectionLimit: 1 })
try {
  const id = await themQuanTriVien(pool, {
    username: ketQua.data.username,
    displayName: ketQua.data.displayName,
    role: ketQua.data.role,
    passwordHash: await bamMatKhau(ketQua.data.password),
  })
  console.log(`Đã tạo tài khoản #${id} "${ketQua.data.username}" (${ketQua.data.role}).`)
} catch (loi) {
  const ma = (loi as { code?: string }).code
  console.error(
    ma === "ER_DUP_ENTRY"
      ? `Username "${ketQua.data.username}" đã tồn tại.`
      : `Không tạo được tài khoản (${ma ?? (loi instanceof Error ? loi.message : "lỗi không xác định")}).`,
  )
  process.exitCode = 1
} finally {
  await pool.end()
}
