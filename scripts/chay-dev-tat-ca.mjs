/**
 * `pnpm dev:all` — chạy song song backend (server/, cổng 3001) và frontend Vite
 * (cổng 8443) trong cùng một terminal, gắn tiền tố [api]/[web] cho từng dòng log.
 * Một tiến trình thoát thì dừng tiến trình còn lại; Ctrl+C dừng cả hai.
 */
import { spawn } from "node:child_process"

// Gọi lại đúng pnpm đang chạy script này (kể cả khi pnpm chạy qua npx/corepack).
const pnpmJs = process.env.npm_execpath
const lenh = pnpmJs ? process.execPath : "pnpm"
const thamSoGoc = pnpmJs ? [pnpmJs] : []

const tienTrinh = [
  ["api", "dev:backend"],
  ["web", "dev:frontend"],
].map(([nhan, script]) => {
  const con = spawn(lenh, [...thamSoGoc, "run", script], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: !pnpmJs && process.platform === "win32",
  })
  const ghi = (luong) => (du) =>
    du
      .toString()
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((dong) => luong.write(`[${nhan}] ${dong}\n`))
  con.stdout.on("data", ghi(process.stdout))
  con.stderr.on("data", ghi(process.stderr))
  return con
})

let dangDung = false
/**
 * Dừng mọi tiến trình con rồi thoát với mã cho trước.
 *
 * @param {number} ma - Mã thoát
 */
function dungTatCa(ma) {
  if (dangDung) return
  dangDung = true
  for (const con of tienTrinh) if (con.exitCode === null) con.kill()
  setTimeout(() => process.exit(ma), 500)
}
for (const con of tienTrinh) con.on("exit", (ma) => dungTatCa(ma ?? 0))
process.on("SIGINT", () => dungTatCa(0))
process.on("SIGTERM", () => dungTatCa(0))
