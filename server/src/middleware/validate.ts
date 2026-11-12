import type { z } from "zod"
import { LoiUngDung } from "../utils/loi-ung-dung.ts"

/**
 * Kiểm tra dữ liệu đầu vào bằng schema Zod; không tin validation phía frontend.
 *
 * Mỗi trường chỉ giữ thông điệp lỗi đầu tiên. Trường không được phép (schema
 * strict) được gom dưới khóa của chính trường đó để client biết trường nào bị từ chối.
 *
 * @param schema - Schema Zod mô tả dữ liệu hợp lệ
 * @param duLieu - Dữ liệu thô từ request (body, query hoặc params)
 * @returns Dữ liệu đã kiểm tra và chuẩn hóa (trim, ép kiểu)
 * @throws LoiUngDung 400 `VALIDATION_ERROR` kèm lỗi theo từng trường
 */
export function phanTichDuLieu<T extends z.ZodType>(
  schema: T,
  duLieu: unknown,
): z.output<T> {
  const ketQua = schema.safeParse(duLieu ?? {})
  if (ketQua.success) return ketQua.data

  const truong: Record<string, string> = {}
  for (const issue of ketQua.error.issues) {
    if (issue.code === "unrecognized_keys") {
      for (const khoa of issue.keys) truong[khoa] ??= "Trường này không được chấp nhận."
      continue
    }
    const khoa = issue.path.length > 0 ? issue.path.join(".") : "_"
    truong[khoa] ??= issue.message
  }
  throw new LoiUngDung(400, "VALIDATION_ERROR", "Dữ liệu không hợp lệ.", truong)
}
