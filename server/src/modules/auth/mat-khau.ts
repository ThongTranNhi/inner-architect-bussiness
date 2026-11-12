import argon2 from "argon2"

/** Tham số Argon2id theo khuyến nghị OWASP (19 MiB, 2 vòng, 1 luồng). */
const THAM_SO_ARGON2 = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const

/** Độ dài mật khẩu tối thiểu khi tạo tài khoản. */
export const DO_DAI_MAT_KHAU_TOI_THIEU = 12
/** Giới hạn trên để tránh tốn CPU/RAM khi hash chuỗi quá dài. */
export const DO_DAI_MAT_KHAU_TOI_DA = 200

/**
 * Hash mật khẩu bằng Argon2id.
 *
 * @param matKhau - Mật khẩu nguyên văn (không log, không lưu)
 * @returns Chuỗi hash PHC (`$argon2id$…`) để lưu vào `admins.password_hash`
 */
export function bamMatKhau(matKhau: string): Promise<string> {
  return argon2.hash(matKhau, THAM_SO_ARGON2)
}

// Hash giả để so sánh khi username không tồn tại, giúp thời gian phản hồi
// tương đương trường hợp sai mật khẩu (giảm khả năng dò username qua timing).
let hashGiaLap: Promise<string> | undefined

/**
 * So khớp mật khẩu với hash đã lưu. Khi không có hash (username không tồn tại)
 * vẫn chạy một lần verify với hash giả rồi trả `false`.
 *
 * @param hash - Hash đã lưu, hoặc `null` nếu không tìm thấy tài khoản
 * @param matKhau - Mật khẩu người dùng nhập
 * @returns `true` nếu khớp
 */
export async function soKhopMatKhau(
  hash: string | null,
  matKhau: string,
): Promise<boolean> {
  if (!hash) {
    hashGiaLap ??= bamMatKhau("mat-khau-gia-lap-khong-dung-de-dang-nhap")
    await argon2.verify(await hashGiaLap, matKhau).catch(() => false)
    return false
  }
  try {
    return await argon2.verify(hash, matKhau)
  } catch {
    return false
  }
}
