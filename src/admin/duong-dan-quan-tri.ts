/**
 * Đường dẫn gốc của trang quản trị Customer Care trên website (frontend).
 *
 * Đổi giá trị này là đổi toàn bộ URL trang quản trị (`/jathong`, `/jathong/login`,
 * `/jathong/customers`…). Không liên quan tới API backend `/api/v1/admin/...`.
 * File không phụ thuộc gì để `App.tsx` dùng mà không kéo cả chunk quản trị vào bundle chính.
 */
export const GOC_QUAN_TRI = "/jathong"

/**
 * Kiểm tra một đường dẫn đã chuẩn hóa có thuộc trang quản trị không.
 *
 * @param duongDan - Đường dẫn bắt đầu bằng `/`
 * @returns `true` với `/jathong` và mọi đường dẫn con
 */
export function laDuongDanQuanTri(duongDan: string): boolean {
  return duongDan === GOC_QUAN_TRI || duongDan.startsWith(`${GOC_QUAN_TRI}/`)
}
