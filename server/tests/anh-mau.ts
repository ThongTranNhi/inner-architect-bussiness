/**
 * Ảnh mẫu tổng hợp cho test (không phải ảnh thật của người dùng): đủ cấu trúc để kiểm tra
 * nhận diện định dạng, đọc kích thước và gỡ metadata.
 */

/** PNG 1×1 hợp lệ. */
export const ANH_PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "base64",
)

/**
 * WebP lossless (VP8L) chỉ có phần đầu khai báo kích thước.
 *
 * @param rong - Chiều rộng
 * @param cao - Chiều cao
 * @returns Dữ liệu WebP
 */
export function anhWebpVp8l(rong: number, cao: number): Buffer {
  const than = Buffer.alloc(10)
  than[0] = 0x2f
  than.writeUInt32LE(((rong - 1) & 0x3fff) | (((cao - 1) & 0x3fff) << 14), 1)
  const chunk = Buffer.concat([Buffer.from("VP8L"), Buffer.from([than.length, 0, 0, 0]), than])
  const kichThuoc = Buffer.alloc(4)
  kichThuoc.writeUInt32LE(4 + chunk.length)
  return Buffer.concat([Buffer.from("RIFF"), kichThuoc, Buffer.from("WEBP"), chunk])
}

/**
 * Tạo segment JPEG có độ dài.
 *
 * @param marker - Byte marker (vd. 0xe1)
 * @param than - Dữ liệu segment
 * @returns Segment đầy đủ
 */
function segment(marker: number, than: Buffer): Buffer {
  const dau = Buffer.from([0xff, marker, 0, 0])
  dau.writeUInt16BE(than.length + 2, 2)
  return Buffer.concat([dau, than])
}

/**
 * JPEG 320×240 có EXIF chứa Orientation và chuỗi "GPS-BI-MAT" giả lập metadata cá nhân.
 *
 * @param huongXoay - Giá trị Orientation
 * @returns Dữ liệu JPEG
 */
export function anhJpegCoExif(huongXoay: number): Buffer {
  const tiff = Buffer.alloc(26)
  tiff.write("II", 0, "ascii")
  tiff.writeUInt16LE(0x2a, 2)
  tiff.writeUInt32LE(8, 4)
  tiff.writeUInt16LE(1, 8)
  tiff.writeUInt16LE(0x0112, 10)
  tiff.writeUInt16LE(3, 12)
  tiff.writeUInt32LE(1, 14)
  tiff.writeUInt16LE(huongXoay, 18)
  tiff.writeUInt32LE(0, 22)
  const exif = Buffer.concat([Buffer.from("Exif\0\0", "binary"), tiff, Buffer.from("GPS-BI-MAT 10.77N 106.70E")])
  const jfif = Buffer.from([0x4a, 0x46, 0x49, 0x46, 0x00, 1, 1, 0, 0, 1, 0, 1, 0, 0])
  const sof = Buffer.from([8, 0x00, 0xf0, 0x01, 0x40, 3, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1])
  const sos = Buffer.from([3, 1, 0, 2, 0x11, 3, 0x11, 0, 0x3f, 0])
  return Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    segment(0xe0, jfif),
    segment(0xe1, exif),
    segment(0xfe, Buffer.from("comment GPS-BI-MAT")),
    segment(0xc0, sof),
    segment(0xda, sos),
    Buffer.from([0x12, 0x34, 0x56, 0x78]),
    Buffer.from([0xff, 0xd9]),
  ])
}
