import assert from "node:assert/strict"
import { describe, test } from "node:test"
import { kiemTraAnh, LoiAnh, nhanDienAnh } from "../src/modules/journal/anh.ts"
import {
  chuanHoaNoiDung,
  laLienKetAnToan,
  LoiNoiDung,
  taoDongMoTa,
  taoSlug,
  vanBanThanhNoiDung,
} from "../src/modules/journal/noi-dung.ts"
import { anhJpegCoExif, ANH_PNG_1X1, anhWebpVp8l } from "./anh-mau.ts"

const doan = (text: string) => ({ type: "paragraph", content: [{ type: "text", text }] })

describe("chuẩn hóa nội dung bài Journal", () => {
  test("giữ các thành phần được hỗ trợ: đoạn văn, H2/H3, đậm/nghiêng/gạch chân, danh sách, trích dẫn, liên kết, ảnh", () => {
    const taiLieu = {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Tiêu đề phụ" }] },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Đậm", marks: [{ type: "bold" }, { type: "italic" }, { type: "underline" }] },
            { type: "hardBreak" },
            { type: "text", text: "liên kết", marks: [{ type: "link", attrs: { href: "https://example.com", target: "_blank" } }] },
          ],
        },
        { type: "bulletList", content: [{ type: "listItem", content: [doan("Một")] }] },
        { type: "orderedList", attrs: { start: 3 }, content: [{ type: "listItem", content: [doan("Ba")] }] },
        { type: "blockquote", content: [doan("Trích dẫn")] },
        {
          type: "image",
          attrs: { src: "/media/journal/3f2c1d0e-1111-4222-8333-444455556666.webp", alt: "Ảnh", caption: "Chú thích", width: 800, height: 600 },
        },
      ],
    }
    const ketQua = chuanHoaNoiDung(taiLieu)
    assert.equal(ketQua.content?.length, 6)
    // Thuộc tính lạ (target) bị bỏ, chỉ giữ href.
    assert.deepEqual(ketQua.content?.[1]?.content?.[2]?.marks, [{ type: "link", attrs: { href: "https://example.com" } }])
    assert.deepEqual(ketQua.content?.[3]?.attrs, { start: 3 })
    assert.equal(ketQua.content?.[5]?.attrs?.caption, "Chú thích")
  })

  test("bỏ thuộc tính sự kiện / style trên node được phép", () => {
    const ketQua = chuanHoaNoiDung({
      type: "doc",
      content: [{ type: "paragraph", attrs: { onclick: "alert(1)", style: "color:red" }, content: [{ type: "text", text: "x" }] }],
    })
    assert.deepEqual(ketQua.content?.[0], { type: "paragraph", content: [{ type: "text", text: "x" }] })
  })

  for (const [ten, node] of [
    ["script", { type: "script", content: [{ type: "text", text: "alert(1)" }] }],
    ["iframe", { type: "iframe", attrs: { src: "https://evil.example" } }],
    ["HTML thô", { type: "html", attrs: { html: "<img src=x onerror=alert(1)>" } }],
    ["tiêu đề H1", { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "x" }] }],
    ["ảnh ngoài site", { type: "image", attrs: { src: "https://evil.example/a.png" } }],
    ["ảnh data URI", { type: "image", attrs: { src: "data:image/png;base64,AAAA" } }],
    ["ảnh có ..", { type: "image", attrs: { src: "/assets/../server/.env.png" } }],
    ["mark lạ", { type: "paragraph", content: [{ type: "text", text: "x", marks: [{ type: "textStyle", attrs: { color: "red" } }] }] }],
  ] as const) {
    test(`từ chối ${ten}`, () => {
      assert.throws(() => chuanHoaNoiDung({ type: "doc", content: [node] }), LoiNoiDung)
    })
  }

  test("liên kết: chỉ cho http(s), mailto, tel, đường dẫn nội bộ và anchor", () => {
    for (const ok of ["https://a.vn/x?y=1", "http://a.vn", "mailto:a@b.vn", "tel:+84901234567", "/lien-he", "#muc-1"])
      assert.equal(laLienKetAnToan(ok), true, ok)
    for (const xau of [
      "javascript:alert(1)",
      "JavaScript:alert(1)",
      " javascript:alert(1)",
      "java\tscript:alert(1)",
      "data:text/html,<script>",
      "vbscript:x",
      "//evil.example",
      "/\\evil.example",
      "file:///etc/passwd",
      "",
    ])
      assert.equal(laLienKetAnToan(xau), false, xau)
    assert.throws(
      () =>
        chuanHoaNoiDung({
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: "x", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }],
        }),
      LoiNoiDung,
    )
  })

  test("giới hạn độ sâu danh sách lồng nhau", () => {
    let node: Record<string, unknown> = doan("lá")
    for (let i = 0; i < 12; i++) node = { type: "bulletList", content: [{ type: "listItem", content: [node] }] }
    assert.throws(() => chuanHoaNoiDung({ type: "doc", content: [node] }), LoiNoiDung)
  })

  test("chuyển văn bản cũ thành đoạn văn, giữ nguyên chữ", () => {
    const ketQua = vanBanThanhNoiDung("Đoạn một.\n\nĐoạn hai\ncó xuống dòng.\n\n## Tiêu đề")
    assert.equal(ketQua.content?.length, 3)
    assert.equal(ketQua.content?.[0]?.content?.[0]?.text, "Đoạn một.")
    assert.equal(ketQua.content?.[1]?.content?.[1]?.type, "hardBreak")
    assert.deepEqual(ketQua.content?.[2]?.attrs, { level: 2 })
    assert.deepEqual(vanBanThanhNoiDung(""), { type: "doc", content: [{ type: "paragraph" }] })
  })

  test("slug tiếng Việt và dòng mô tả", () => {
    assert.equal(taoSlug("Điều bạn ĐANG theo đuổi — có thật sự?"), "dieu-ban-dang-theo-duoi-co-that-su")
    assert.equal(taoSlug("!!!"), "")
    assert.equal(taoDongMoTa("a".repeat(70)), `${"a".repeat(60)}...`)
    assert.equal(taoDongMoTa("ngắn"), "ngắn")
  })
})

describe("kiểm tra ảnh tải lên", () => {
  test("nhận diện định dạng thật theo chữ ký byte", () => {
    assert.equal(nhanDienAnh(ANH_PNG_1X1), "image/png")
    assert.equal(nhanDienAnh(anhWebpVp8l(10, 20)), "image/webp")
    assert.equal(nhanDienAnh(anhJpegCoExif(6)), "image/jpeg")
    assert.equal(nhanDienAnh(Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'/>")), null)
  })

  test("PNG/WebP: đọc đúng kích thước", () => {
    assert.deepEqual([kiemTraAnh(ANH_PNG_1X1, "image/png", 1e6).rong, kiemTraAnh(ANH_PNG_1X1, "image/png", 1e6).cao], [1, 1])
    const webp = kiemTraAnh(anhWebpVp8l(640, 480), "image/webp", 1e6)
    assert.deepEqual([webp.rong, webp.cao], [640, 480])
  })

  test("JPEG: gỡ EXIF (GPS) nhưng giữ hướng xoay", () => {
    const goc = anhJpegCoExif(6)
    assert.ok(goc.includes(Buffer.from("GPS-BI-MAT")))
    const ketQua = kiemTraAnh(goc, "image/jpeg", 1e6)
    assert.deepEqual([ketQua.rong, ketQua.cao], [320, 240])
    assert.ok(!ketQua.duLieu.includes(Buffer.from("GPS-BI-MAT")), "metadata cá nhân phải bị gỡ")
    // APP1 tối giản chứa Orientation = 6.
    const viTri = ketQua.duLieu.indexOf(Buffer.from("Exif\0\0MM", "binary"))
    assert.ok(viTri > 0)
    assert.equal(ketQua.duLieu.readUInt16BE(viTri + 6 + 18), 6)
  })

  test("từ chối file giả, sai khai báo, quá dung lượng, kích thước bất thường", () => {
    assert.throws(() => kiemTraAnh(Buffer.from("<script>alert(1)</script>"), "image/png", 1e6), LoiAnh)
    assert.throws(() => kiemTraAnh(ANH_PNG_1X1, "image/jpeg", 1e6), /không khớp/)
    assert.throws(() => kiemTraAnh(ANH_PNG_1X1, "image/png", 10), /dung lượng/)
    assert.throws(() => kiemTraAnh(anhWebpVp8l(16_000, 16_000), "image/webp", 1e6), /Kích thước/)
    assert.throws(() => kiemTraAnh(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]), "image/jpeg", 1e6), /hỏng/)
  })
})
