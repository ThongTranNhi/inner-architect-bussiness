/** Mã lỗi ổn định trả về client trong trường `error.code`. */
export type MaLoi =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "CSRF_INVALID"
  | "NOT_FOUND"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE"

/**
 * Lỗi nghiệp vụ có HTTP status và thông điệp an toàn để hiển thị cho client.
 * Mọi lỗi khác (lỗi lập trình, lỗi MySQL) được error handler chuyển thành 500/503
 * với thông điệp chung, không lộ chi tiết.
 */
export class LoiUngDung extends Error {
  readonly status: number
  readonly ma: MaLoi
  readonly truong: Record<string, string> | undefined

  /**
   * @param status - HTTP status (4xx/5xx)
   * @param ma - Mã lỗi ổn định cho client
   * @param thongDiep - Thông điệp tiếng Việt an toàn để hiển thị
   * @param truong - Lỗi theo từng trường dữ liệu (chỉ dùng cho VALIDATION_ERROR)
   */
  constructor(
    status: number,
    ma: MaLoi,
    thongDiep: string,
    truong?: Record<string, string>,
  ) {
    super(thongDiep)
    this.name = "LoiUngDung"
    this.status = status
    this.ma = ma
    this.truong = truong
  }
}
