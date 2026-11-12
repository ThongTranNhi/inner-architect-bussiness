/**
 * Danh mục dịch vụ khách chọn trên biểu mẫu liên hệ — nguồn duy nhất ở frontend.
 *
 * Mã (`ma`) phải trùng `server/src/utils/dich-vu.ts`; test phía server so sánh hai
 * danh sách. Nhãn lấy đúng tên sáu nhánh đang hiển thị trên trang Liên hệ, cộng
 * "Nhu cầu khác" đã được PM xác nhận. Không tự thêm dịch vụ mới.
 *
 * File không phụ thuộc React/Vite để chạy được bằng `node --test`.
 */
export const DANH_SACH_DICH_VU_LIEN_HE = [
  { ma: "tea", nhan: "Trải nghiệm trà đạo có hướng dẫn (theo lịch hẹn)" },
  { ma: "tarot", nhan: "Phiên Tarot online hoặc trực tiếp" },
  { ma: "healing", nhan: "Đồng hành 1:1" },
  { ma: "workshop", nhan: "Workshop" },
  { ma: "academy", nhan: "Academy và các khóa học" },
  { ma: "products", nhan: "Sản phẩm LARA" },
  { ma: "other", nhan: "Nhu cầu khác" },
] as const

export type MaDichVuLienHe = (typeof DANH_SACH_DICH_VU_LIEN_HE)[number]["ma"]

/**
 * Lấy nhãn tiếng Việt của một mã dịch vụ.
 *
 * @param ma - Mã dịch vụ lưu trong database
 * @returns Nhãn hiển thị; trả lại chính mã nếu không có trong danh mục
 */
export function layNhanDichVu(ma: string): string {
  return DANH_SACH_DICH_VU_LIEN_HE.find((dichVu) => dichVu.ma === ma)?.nhan ?? ma
}
