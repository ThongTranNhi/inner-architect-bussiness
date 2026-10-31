import { readdirSync, readFileSync } from "node:fs"

/**
 * Đọc toàn bộ mã nguồn website ngoài các module riêng (founder/journal):
 * `src/App.tsx` cùng mọi file trong `src/trang/` và `src/du-lieu/`.
 *
 * Các test kiểm tra theo nội dung nguồn dùng hàm này để vẫn bao phủ code sau
 * khi các trang phụ được tách thành module lazy-load; nhờ vậy những assert
 * `doesNotMatch` không âm thầm bỏ sót phần code đã chuyển file.
 *
 * @returns Nội dung các file nối lại, App.tsx đứng đầu
 */
export function docNguonWebsite() {
  const tep = [new URL("../src/App.tsx", import.meta.url)]
  for (const thuMuc of ["trang", "du-lieu"]) {
    const goc = new URL(`../src/${thuMuc}/`, import.meta.url)
    for (const ten of readdirSync(goc).sort()) tep.push(new URL(ten, goc))
  }
  return tep.map((url) => readFileSync(url, "utf8")).join("\n")
}
