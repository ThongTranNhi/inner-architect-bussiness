import type { DuLieuBieuMauLienHe, LoiBieuMau } from "./kiem-tra-bieu-mau-lien-he.ts"

/** Kết quả gửi biểu mẫu; không có nhánh "giả lập thành công". */
export type KetQuaGuiLienHe =
  | { trangThai: "thanh-cong"; thongDiep: string }
  | { trangThai: "du-lieu-sai"; thongDiep: string; loiTruong: LoiBieuMau }
  | { trangThai: "loi"; thongDiep: string }

/** Đường dẫn API tương đối: Vite proxy khi dev, Nginx khi production. */
export const DUONG_DAN_API_KHACH_HANG = "/api/v1/customers"

const TRUONG_HOP_LE = new Set(["fullName", "phone", "email", "service", "consent"])

/**
 * Gửi thông tin liên hệ tới backend.
 *
 * Chỉ trả `thanh-cong` khi server phản hồi 201 (đã lưu MySQL). Lỗi mạng, 5xx,
 * 429 và phản hồi không đọc được đều trả `loi` kèm thông điệp tiếng Việt để
 * người dùng thử lại hoặc dùng kênh Zalo/Facebook.
 *
 * @param duLieu - Giá trị biểu mẫu đã qua kiểm tra phía client
 * @param thamSo.boBat - Trường honeypot (người thật luôn để trống)
 * @param thamSo.goiFetch - Hàm fetch (cho phép test thay thế)
 * @returns Kết quả gửi
 */
export async function guiThongTinLienHe(
  duLieu: DuLieuBieuMauLienHe,
  thamSo: { boBat?: string; goiFetch?: typeof fetch } = {},
): Promise<KetQuaGuiLienHe> {
  const goiFetch = thamSo.goiFetch ?? fetch
  let phanHoi: Response
  try {
    phanHoi = await goiFetch(DUONG_DAN_API_KHACH_HANG, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        fullName: duLieu.fullName.trim(),
        phone: duLieu.phone.trim(),
        email: duLieu.email.trim(),
        service: duLieu.service,
        consent: duLieu.consent,
        website: thamSo.boBat ?? "",
      }),
    })
  } catch {
    return {
      trangThai: "loi",
      thongDiep:
        "Không kết nối được tới máy chủ. Vui lòng kiểm tra mạng và thử lại, hoặc nhắn qua Zalo/Facebook.",
    }
  }

  const noiDung = (await phanHoi.json().catch(() => null)) as {
    message?: string
    error?: { message?: string; fields?: Record<string, string> }
  } | null

  if (phanHoi.status === 201)
    return {
      trangThai: "thanh-cong",
      thongDiep:
        noiDung?.message ??
        "Thông tin của bạn đã được tiếp nhận. Đội ngũ INNER ARCHITECT sẽ chủ động liên hệ.",
    }

  if (phanHoi.status === 400 && noiDung?.error?.fields) {
    const loiTruong: LoiBieuMau = {}
    for (const [truong, thongDiep] of Object.entries(noiDung.error.fields))
      if (TRUONG_HOP_LE.has(truong)) loiTruong[truong as keyof LoiBieuMau] = thongDiep
    return {
      trangThai: "du-lieu-sai",
      thongDiep: "Vui lòng kiểm tra lại các trường được đánh dấu.",
      loiTruong,
    }
  }

  if (phanHoi.status === 429)
    return {
      trangThai: "loi",
      thongDiep:
        noiDung?.error?.message ??
        "Bạn đã gửi thông tin nhiều lần. Vui lòng thử lại sau ít phút.",
    }

  return {
    trangThai: "loi",
    thongDiep:
      "Hệ thống đang tạm gián đoạn nên chưa lưu được thông tin. Vui lòng thử lại sau, hoặc nhắn qua Zalo/Facebook.",
  }
}
