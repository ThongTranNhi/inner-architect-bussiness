import { existsSync } from "node:fs"
import path from "node:path"

/**
 * Tìm thư mục gốc của package `server/` (nơi có `package.json`), đi ngược từ file
 * hiện tại. Dùng được cả khi chạy mã nguồn bằng tsx (`src/…`) lẫn bản build (`dist/src/…`).
 *
 * @returns Đường dẫn tuyệt đối tới thư mục `server/`
 * @throws Error nếu không tìm thấy `package.json` ở bất kỳ thư mục cha nào
 */
export function thuMucGocServer(): string {
  let thuMuc = import.meta.dirname
  while (!existsSync(path.join(thuMuc, "package.json"))) {
    const cha = path.dirname(thuMuc)
    if (cha === thuMuc) throw new Error("Không tìm thấy thư mục gốc server/")
    thuMuc = cha
  }
  return thuMuc
}
