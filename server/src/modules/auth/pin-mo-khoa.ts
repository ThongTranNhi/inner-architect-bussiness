import type { Pool, RowDataPacket } from "mysql2/promise"
import { bamMatKhau, soKhopMatKhau } from "./mat-khau.ts"

/** Khóa trong bảng `admin_settings` chứa PIN mở khóa /jathong. */
const KHOA_PIN = "unlock_pin"

/** Version của PIN khởi tạo từ `ADMIN_UNLOCK_PIN` (bản ghi MySQL bắt đầu từ 1). */
const VERSION_PIN_KHOI_TAO = 0

/** Mẫu PIN hợp lệ: 6–8 chữ số, luôn xử lý dạng chuỗi để giữ số 0 ở đầu. */
export const MAU_PIN = /^[0-9]{6,8}$/

/** PIN đang có hiệu lực (chỉ hash, không bao giờ là PIN nguyên văn). */
export type PinHienHanh = { hash: string; version: number }

/** Kết quả đổi PIN. */
export type KetQuaDoiPin = "thanh-cong" | "sai-pin" | "xung-dot"

type DongPin = RowDataPacket & { value_hash: string; version: number }

/** Mã lỗi MySQL khi hai yêu cầu cùng tạo bản ghi PIN đầu tiên. */
const LOI_XUNG_DOT = new Set(["ER_DUP_ENTRY", "ER_LOCK_DEADLOCK", "ER_LOCK_WAIT_TIMEOUT"])

/**
 * Dịch vụ PIN mở khóa trang quản trị.
 *
 * Nguồn PIN: bản ghi `admin_settings.unlock_pin` (hash Argon2id) nếu đã có; nếu chưa,
 * dùng `ADMIN_UNLOCK_PIN` làm giá trị khởi tạo (băm Argon2id một lần trong bộ nhớ).
 * Sau lần đổi đầu tiên, bản ghi MySQL là nguồn chính qua mọi lần khởi động lại.
 *
 * @param pool - Pool MySQL
 * @param pinKhoiTao - `ADMIN_UNLOCK_PIN` (tùy chọn); không log, không trả về client
 * @returns Các thao tác đọc, xác minh và đổi PIN
 */
export function taoDichVuPin(pool: Pool, pinKhoiTao?: string) {
  let hashKhoiTao: Promise<string> | undefined
  const layHashKhoiTao = () => (pinKhoiTao ? (hashKhoiTao ??= bamMatKhau(pinKhoiTao)) : undefined)

  /**
   * Đọc PIN đang có hiệu lực.
   *
   * @returns Hash + version, hoặc `null` khi chưa bật PIN
   */
  async function layPinHienHanh(): Promise<PinHienHanh | null> {
    const [dong] = await pool.execute<DongPin[]>(
      "SELECT value_hash, version FROM admin_settings WHERE setting_key = ? LIMIT 1",
      [KHOA_PIN],
    )
    if (dong[0]) return { hash: dong[0].value_hash, version: Number(dong[0].version) }
    const hash = await layHashKhoiTao()
    return hash ? { hash, version: VERSION_PIN_KHOI_TAO } : null
  }

  return {
    layPinHienHanh,

    /**
     * Xác minh PIN người dùng nhập.
     *
     * @param pin - PIN dạng chuỗi
     * @returns `version` của PIN nếu đúng, `null` nếu sai hoặc chưa bật PIN
     */
    async xacMinh(pin: string): Promise<number | null> {
      const hienHanh = await layPinHienHanh()
      if (!hienHanh) return null
      return (await soKhopMatKhau(hienHanh.hash, pin)) ? hienHanh.version : null
    },

    /**
     * Đổi PIN trong transaction có khóa dòng. Yêu cầu đồng thời được xếp hàng: yêu cầu
     * sau xác minh với PIN mới nên PIN cũ không ghi đè được thay đổi vừa hoàn tất.
     * Version tăng lên nên mọi lượt mở khóa chưa hoàn tất đăng nhập đều hết hiệu lực.
     *
     * @param tuyChon.pinHienTai - PIN hiện tại; `undefined` chỉ hợp lệ khi chưa bật PIN
     * @param tuyChon.pinMoi - PIN mới (6–8 chữ số)
     * @param tuyChon.maQuanTriVien - ID tài khoản thực hiện (lưu vào `updated_by`)
     * @returns Kết quả đổi PIN
     */
    async doiPin(tuyChon: {
      pinHienTai: string | undefined
      pinMoi: string
      maQuanTriVien: number
    }): Promise<KetQuaDoiPin> {
      // Băm trước khi mở transaction để không giữ khóa trong lúc Argon2 chạy.
      const hashMoi = await bamMatKhau(tuyChon.pinMoi)
      const ketNoi = await pool.getConnection()
      try {
        await ketNoi.beginTransaction()
        const [dong] = await ketNoi.execute<DongPin[]>(
          "SELECT value_hash, version FROM admin_settings WHERE setting_key = ? FOR UPDATE",
          [KHOA_PIN],
        )
        const banGhi = dong[0]
        const hashHienTai = banGhi?.value_hash ?? (await layHashKhoiTao())

        const dungPin = hashHienTai
          ? tuyChon.pinHienTai !== undefined && (await soKhopMatKhau(hashHienTai, tuyChon.pinHienTai))
          : tuyChon.pinHienTai === undefined
        if (!dungPin) {
          await ketNoi.rollback()
          return "sai-pin"
        }

        if (banGhi)
          await ketNoi.execute(
            "UPDATE admin_settings SET value_hash = ?, version = version + 1, updated_by = ? WHERE setting_key = ?",
            [hashMoi, tuyChon.maQuanTriVien, KHOA_PIN],
          )
        else
          await ketNoi.execute(
            "INSERT INTO admin_settings (setting_key, value_hash, version, updated_by) VALUES (?, ?, 1, ?)",
            [KHOA_PIN, hashMoi, tuyChon.maQuanTriVien],
          )
        await ketNoi.commit()
        return "thanh-cong"
      } catch (loi) {
        await ketNoi.rollback().catch(() => undefined)
        if (LOI_XUNG_DOT.has((loi as { code?: string }).code ?? "")) return "xung-dot"
        throw loi
      } finally {
        ketNoi.release()
      }
    },
  }
}

/** Dịch vụ PIN dùng chung giữa router xác thực và router bảo mật tài khoản. */
export type DichVuPin = ReturnType<typeof taoDichVuPin>
