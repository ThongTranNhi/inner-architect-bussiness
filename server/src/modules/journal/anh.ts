import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

/** Định dạng ảnh được nhận và phần mở rộng file tương ứng. */
export const DINH_DANG_ANH = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const

export type KieuAnh = keyof typeof DINH_DANG_ANH

/** Giới hạn kích thước điểm ảnh để tránh ảnh "bom giải nén" làm treo trình duyệt. */
const CANH_TOI_DA = 12_000
const SO_DIEM_ANH_TOI_DA = 60_000_000

/** Kết quả kiểm tra một file ảnh. */
export type ThongTinAnh = {
  kieu: KieuAnh
  rong: number
  cao: number
  /** Dữ liệu sẽ được lưu (JPEG đã gỡ EXIF/GPS, giữ hướng xoay). */
  duLieu: Buffer
}

/** Ảnh không hợp lệ; thông điệp an toàn để hiển thị cho nhân viên. */
export class LoiAnh extends Error {
  /**
   * @param thongDiep - Mô tả lỗi tiếng Việt
   */
  constructor(thongDiep: string) {
    super(thongDiep)
    this.name = "LoiAnh"
  }
}

/**
 * Nhận diện định dạng thật của file qua chữ ký byte đầu (không tin phần mở rộng hay
 * Content-Type do trình duyệt gửi).
 *
 * @param duLieu - Nội dung file
 * @returns Kiểu ảnh hoặc `null` nếu không phải JPG/PNG/WebP
 */
export function nhanDienAnh(duLieu: Buffer): KieuAnh | null {
  if (duLieu.length >= 3 && duLieu[0] === 0xff && duLieu[1] === 0xd8 && duLieu[2] === 0xff) return "image/jpeg"
  if (duLieu.length >= 8 && duLieu.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png"
  if (
    duLieu.length >= 12 &&
    duLieu.toString("ascii", 0, 4) === "RIFF" &&
    duLieu.toString("ascii", 8, 12) === "WEBP"
  )
    return "image/webp"
  return null
}

/**
 * Đọc kích thước ảnh PNG từ chunk IHDR.
 *
 * @param duLieu - Nội dung PNG
 * @returns Kích thước
 * @throws LoiAnh khi thiếu IHDR
 */
function kichThuocPng(duLieu: Buffer): { rong: number; cao: number } {
  if (duLieu.length < 24 || duLieu.toString("ascii", 12, 16) !== "IHDR") throw new LoiAnh("File PNG bị hỏng.")
  return { rong: duLieu.readUInt32BE(16), cao: duLieu.readUInt32BE(20) }
}

/**
 * Đọc kích thước ảnh WebP (VP8, VP8L hoặc VP8X).
 *
 * @param duLieu - Nội dung WebP
 * @returns Kích thước
 * @throws LoiAnh khi cấu trúc không đúng
 */
function kichThuocWebp(duLieu: Buffer): { rong: number; cao: number } {
  if (duLieu.length < 30) throw new LoiAnh("File WebP bị hỏng.")
  const kieuChunk = duLieu.toString("ascii", 12, 16)
  if (kieuChunk === "VP8 ") {
    if (duLieu[23] !== 0x9d || duLieu[24] !== 0x01 || duLieu[25] !== 0x2a) throw new LoiAnh("File WebP bị hỏng.")
    return { rong: duLieu.readUInt16LE(26) & 0x3fff, cao: duLieu.readUInt16LE(28) & 0x3fff }
  }
  if (kieuChunk === "VP8L") {
    if (duLieu[20] !== 0x2f) throw new LoiAnh("File WebP bị hỏng.")
    const bit = duLieu.readUInt32LE(21)
    return { rong: (bit & 0x3fff) + 1, cao: ((bit >> 14) & 0x3fff) + 1 }
  }
  if (kieuChunk === "VP8X") {
    return { rong: duLieu.readUIntLE(24, 3) + 1, cao: duLieu.readUIntLE(27, 3) + 1 }
  }
  throw new LoiAnh("File WebP bị hỏng.")
}

/**
 * Đọc giá trị Orientation (tag 0x0112) trong segment EXIF APP1 của JPEG.
 *
 * @param app1 - Dữ liệu segment APP1 (sau 2 byte độ dài)
 * @returns Giá trị 1–8, hoặc `null` nếu không có
 */
function docHuongXoayExif(app1: Buffer): number | null {
  if (app1.length < 14 || app1.toString("ascii", 0, 6) !== "Exif\0\0") return null
  const tiff = app1.subarray(6)
  const thuTu = tiff.toString("ascii", 0, 2)
  if (thuTu !== "II" && thuTu !== "MM") return null
  const le = thuTu === "II"
  const u16 = (o: number) => (le ? tiff.readUInt16LE(o) : tiff.readUInt16BE(o))
  const u32 = (o: number) => (le ? tiff.readUInt32LE(o) : tiff.readUInt32BE(o))
  try {
    const ifd0 = u32(4)
    const soMuc = u16(ifd0)
    for (let i = 0; i < soMuc; i++) {
      const muc = ifd0 + 2 + i * 12
      if (u16(muc) === 0x0112) {
        const giaTri = u16(muc + 8)
        return giaTri >= 1 && giaTri <= 8 ? giaTri : null
      }
    }
  } catch {
    return null
  }
  return null
}

/**
 * Tạo segment APP1 EXIF tối giản chỉ chứa Orientation.
 *
 * @param huong - Giá trị Orientation 2–8
 * @returns Segment đầy đủ (marker + độ dài + dữ liệu)
 */
function taoApp1HuongXoay(huong: number): Buffer {
  const tiff = Buffer.alloc(26)
  tiff.write("MM", 0, "ascii")
  tiff.writeUInt16BE(0x002a, 2)
  tiff.writeUInt32BE(8, 4)
  tiff.writeUInt16BE(1, 8)
  tiff.writeUInt16BE(0x0112, 10)
  tiff.writeUInt16BE(3, 12)
  tiff.writeUInt32BE(1, 14)
  tiff.writeUInt16BE(huong, 18)
  tiff.writeUInt32BE(0, 22)
  const duLieu = Buffer.concat([Buffer.from("Exif\0\0", "ascii"), tiff])
  const dau = Buffer.alloc(4)
  dau.writeUInt16BE(0xffe1, 0)
  dau.writeUInt16BE(duLieu.length + 2, 2)
  return Buffer.concat([dau, duLieu])
}

/**
 * Duyệt cấu trúc JPEG: lấy kích thước từ SOF và gỡ metadata cá nhân (EXIF/GPS, XMP,
 * IPTC, comment). Giữ nguyên hướng xoay bằng một APP1 tối giản và giữ ICC profile (APP2).
 *
 * @param duLieu - Nội dung JPEG
 * @returns Kích thước và dữ liệu đã làm sạch
 * @throws LoiAnh khi cấu trúc JPEG không hợp lệ
 */
function xuLyJpeg(duLieu: Buffer): { rong: number; cao: number; duLieu: Buffer } {
  const phan: Buffer[] = [duLieu.subarray(0, 2)]
  let viTri = 2
  let kichThuoc: { rong: number; cao: number } | null = null
  let huongXoay: number | null = null
  let daGapScan = false

  while (viTri < duLieu.length) {
    if (duLieu[viTri] !== 0xff) throw new LoiAnh("File JPEG bị hỏng.")
    let marker = duLieu[viTri + 1]
    while (marker === 0xff) {
      viTri++
      marker = duLieu[viTri + 1]
    }
    if (marker === undefined) throw new LoiAnh("File JPEG bị hỏng.")
    if (marker === 0xd9) {
      phan.push(duLieu.subarray(viTri, viTri + 2))
      break
    }
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      phan.push(duLieu.subarray(viTri, viTri + 2))
      viTri += 2
      continue
    }
    if (viTri + 4 > duLieu.length) throw new LoiAnh("File JPEG bị hỏng.")
    const doDai = duLieu.readUInt16BE(viTri + 2)
    const ketThuc = viTri + 2 + doDai
    if (doDai < 2 || ketThuc > duLieu.length) throw new LoiAnh("File JPEG bị hỏng.")
    const thanSegment = duLieu.subarray(viTri + 4, ketThuc)

    const laSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    if (laSof && !kichThuoc) {
      if (thanSegment.length < 5) throw new LoiAnh("File JPEG bị hỏng.")
      kichThuoc = { cao: thanSegment.readUInt16BE(1), rong: thanSegment.readUInt16BE(3) }
    }

    if (marker === 0xe1) huongXoay ??= docHuongXoayExif(thanSegment)
    // APP1 (EXIF/XMP), APP13 (IPTC/Photoshop), COM: bỏ để không lộ GPS, thiết bị, tác giả.
    if (marker !== 0xe1 && marker !== 0xed && marker !== 0xfe) phan.push(duLieu.subarray(viTri, ketThuc))

    viTri = ketThuc
    if (marker === 0xda) {
      // Sau SOS là dữ liệu ảnh nén tới hết file: giữ nguyên.
      phan.push(duLieu.subarray(viTri))
      daGapScan = true
      break
    }
  }

  if (!kichThuoc || !daGapScan) throw new LoiAnh("File JPEG bị hỏng.")
  if (huongXoay && huongXoay !== 1) phan.splice(1, 0, taoApp1HuongXoay(huongXoay))
  return { ...kichThuoc, duLieu: Buffer.concat(phan) }
}

/**
 * Kiểm tra file ảnh tải lên: định dạng thật khớp khai báo, dung lượng, kích thước hợp lý.
 *
 * @param duLieu - Nội dung file
 * @param kieuKhaiBao - Content-Type trình duyệt gửi
 * @param dungLuongToiDa - Số byte tối đa
 * @returns Thông tin ảnh và dữ liệu cần lưu
 * @throws LoiAnh với thông điệp tiếng Việt khi không hợp lệ
 */
export function kiemTraAnh(duLieu: Buffer, kieuKhaiBao: string | undefined, dungLuongToiDa: number): ThongTinAnh {
  if (duLieu.length === 0) throw new LoiAnh("File ảnh trống.")
  if (duLieu.length > dungLuongToiDa)
    throw new LoiAnh(`Ảnh vượt quá dung lượng cho phép (${Math.floor(dungLuongToiDa / 1024 / 1024)} MB).`)
  const kieu = nhanDienAnh(duLieu)
  if (!kieu) throw new LoiAnh("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.")
  if (kieuKhaiBao && kieuKhaiBao.split(";")[0]!.trim().toLowerCase() !== kieu)
    throw new LoiAnh("Định dạng file không khớp với nội dung ảnh.")

  let ketQua: { rong: number; cao: number; duLieu: Buffer }
  if (kieu === "image/jpeg") ketQua = xuLyJpeg(duLieu)
  else ketQua = { ...(kieu === "image/png" ? kichThuocPng(duLieu) : kichThuocWebp(duLieu)), duLieu }

  const { rong, cao } = ketQua
  if (rong < 1 || cao < 1 || rong > CANH_TOI_DA || cao > CANH_TOI_DA || rong * cao > SO_DIEM_ANH_TOI_DA)
    throw new LoiAnh("Kích thước ảnh không hợp lệ hoặc quá lớn.")
  return { kieu, rong, cao, duLieu: ketQua.duLieu }
}

/**
 * Ghi ảnh vào thư mục lưu trữ với tên ngẫu nhiên (không bao giờ dùng tên file người dùng).
 *
 * @param thuMuc - Thư mục lưu ảnh (JOURNAL_UPLOAD_DIR)
 * @param anh - Ảnh đã kiểm tra
 * @returns Tên file vừa ghi, ví dụ `3f2c…e1.webp`
 */
export async function luuAnh(thuMuc: string, anh: ThongTinAnh): Promise<string> {
  await mkdir(thuMuc, { recursive: true })
  const tenFile = `${randomUUID()}.${DINH_DANG_ANH[anh.kieu]}`
  // `wx`: không ghi đè nếu (cực hiếm) trùng tên.
  // 0644: Nginx (user khác) cần đọc được để phục vụ trực tiếp /media/journal/.
  await writeFile(path.join(thuMuc, tenFile), anh.duLieu, { flag: "wx", mode: 0o644 })
  return tenFile
}
