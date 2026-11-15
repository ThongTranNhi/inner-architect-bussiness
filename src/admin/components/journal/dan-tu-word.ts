import { laDuongDanAnhHopLe, laLienKetAnToan } from "../../../journal/noi-dung/quy-tac"

/**
 * Làm sạch HTML khi dán vào trình soạn thảo (Word, Google Docs, trang web).
 *
 * - Bỏ thẻ nguy hiểm/không dùng (script, style, iframe, form, svg…), comment điều kiện của Word.
 * - Chuyển đoạn danh sách của Word (`MsoListParagraph`, `mso-list: l0 level2`) thành `<ul>/<ol>` lồng nhau.
 * - Giữ đậm/nghiêng/gạch chân viết bằng `style` (Google Docs) bằng thẻ `<strong>/<em>/<u>`.
 * - Tiêu đề: H1/Title → H2, H4–H6/Subtitle → H3 (bài chỉ dùng H2/H3; H1 là tiêu đề bài).
 * - Bỏ mọi thuộc tính (class, style, on*), chỉ giữ `href` an toàn, `src/alt` của ảnh hợp lệ, `start` của danh sách số.
 * - Bỏ ảnh không thuộc thư viện Journal (ảnh dán từ Word là `file:///`/`data:`), bỏ đoạn trống.
 *
 * Sau bước này, lược đồ của trình soạn thảo chỉ nhận các thành phần được hỗ trợ; máy chủ
 * kiểm tra lại toàn bộ nội dung trước khi lưu.
 *
 * @param html - HTML trong clipboard
 * @returns HTML đã làm sạch và số ảnh bị bỏ (để nhắc dùng nút Chèn ảnh)
 */
export function chuanHoaHtmlDan(html: string): { html: string; soAnhBo: number } {
  const tai = new DOMParser().parseFromString(html, "text/html")
  const than = tai.body
  let soAnhBo = 0

  // 1. Bỏ comment (kể cả <!--[if !supportLists]-->) và thẻ không dùng.
  const duyetComment = tai.createTreeWalker(than, NodeFilter.SHOW_COMMENT)
  const comment: Node[] = []
  while (duyetComment.nextNode()) comment.push(duyetComment.currentNode)
  comment.forEach((n) => n.parentNode?.removeChild(n))
  than
    .querySelectorAll(
      "script,style,meta,link,title,xml,iframe,frame,object,embed,noscript,template,svg,math,form,input,button,select,textarea,video,audio,canvas",
    )
    .forEach((n) => n.remove())

  // 2. Google Docs bọc toàn bộ nội dung trong <b style="font-weight:normal">: gỡ lớp bọc.
  than.querySelectorAll<HTMLElement>("b").forEach((b) => {
    if (/font-weight\s*:\s*(normal|[1-5]00)\b/i.test(b.getAttribute("style") ?? "")) moBoc(b)
  })

  // 3. Danh sách của Word.
  chuyenDanhSachWord(tai)

  // 4. Định dạng viết bằng style → thẻ ngữ nghĩa.
  than.querySelectorAll<HTMLElement>("span,font").forEach((el) => {
    const style = (el.getAttribute("style") ?? "").toLowerCase()
    let trong: HTMLElement = el
    const boc = (the: string) => {
      const moi = tai.createElement(the)
      while (trong.firstChild) moi.appendChild(trong.firstChild)
      trong.appendChild(moi)
      trong = moi
    }
    if (/font-weight\s*:\s*(bold|bolder|[6-9]00)\b/.test(style)) boc("strong")
    if (/font-style\s*:\s*italic/.test(style)) boc("em")
    if (/text-decoration[^;]*underline/.test(style)) boc("u")
  })

  // 5. Tiêu đề.
  const doiThe = (el: Element, the: string) => {
    const moi = tai.createElement(the)
    while (el.firstChild) moi.appendChild(el.firstChild)
    el.replaceWith(moi)
  }
  than.querySelectorAll("h1").forEach((h) => doiThe(h, "h2"))
  than.querySelectorAll("h4,h5,h6").forEach((h) => doiThe(h, "h3"))
  than.querySelectorAll("p.MsoTitle").forEach((p) => doiThe(p, "h2"))
  than.querySelectorAll("p.MsoSubtitle").forEach((p) => doiThe(p, "h3"))

  // 6. Ảnh & thuộc tính.
  than.querySelectorAll("img").forEach((img) => {
    if (!laDuongDanAnhHopLe(img.getAttribute("src"))) {
      soAnhBo++
      img.remove()
    }
  })
  than.querySelectorAll("*").forEach((el) => {
    for (const { name } of [...el.attributes]) {
      const giu =
        (el.tagName === "A" && name === "href" && laLienKetAnToan(el.getAttribute("href"))) ||
        (el.tagName === "IMG" && (name === "src" || name === "alt")) ||
        (el.tagName === "OL" && name === "start")
      if (!giu) el.removeAttribute(name)
    }
  })
  // Thẻ của Word như <o:p>, <v:shape> → giữ chữ bên trong.
  than.querySelectorAll("*").forEach((el) => {
    if (el.tagName.includes(":")) moBoc(el)
  })

  // 7. Đoạn chỉ có khoảng trắng / &nbsp;.
  than.querySelectorAll("p,h2,h3").forEach((p) => {
    if (!p.querySelector("img") && !(p.textContent ?? "").replace(/[\s ]/g, "")) p.remove()
  })

  return { html: than.innerHTML, soAnhBo }
}

/**
 * Thay phần tử bằng các node con của nó.
 *
 * @param el - Phần tử cần gỡ lớp bọc
 */
function moBoc(el: Element): void {
  const cha = el.parentNode
  if (!cha) return
  while (el.firstChild) cha.insertBefore(el.firstChild, el)
  cha.removeChild(el)
}

/** Một đoạn danh sách Word đã phân tích. */
type MucWord = { p: HTMLElement; capDo: number; coSo: boolean }

/**
 * Phân tích một đoạn có phải mục danh sách của Word không.
 *
 * @param el - Phần tử cần kiểm tra
 * @returns Thông tin mục, hoặc `null`
 */
function docMucWord(el: Element): MucWord | null {
  if (el.tagName !== "P") return null
  const style = el.getAttribute("style") ?? ""
  const laMuc = /mso-list\s*:\s*l\d+/i.test(style) || /MsoListParagraph/i.test(el.getAttribute("class") ?? "")
  if (!laMuc || /mso-list\s*:\s*Ignore/i.test(style)) return null
  const capDo = Number(/level(\d+)/i.exec(style)?.[1] ?? 1)
  const dau = el.querySelector<HTMLElement>('[style*="mso-list:Ignore" i], [style*="mso-list: Ignore" i]')
  const kyHieu = (dau?.textContent ?? "").replace(/[\s ]/g, "")
  dau?.remove()
  return { p: el as HTMLElement, capDo: Math.min(Math.max(capDo, 1), 6), coSo: /^\(?([0-9]+|[a-z]|[ivxlcdm]+)[.)]$/i.test(kyHieu) }
}

/**
 * Gom các đoạn danh sách Word liền nhau thành `<ul>/<ol>` lồng theo cấp.
 *
 * @param tai - Tài liệu HTML đang làm sạch
 */
function chuyenDanhSachWord(tai: Document): void {
  const doanMuc = [...tai.body.querySelectorAll("p")]
  const daXuLy = new Set<Element>()
  for (const dau of doanMuc) {
    if (daXuLy.has(dau)) continue
    const mucDau = docMucWord(dau)
    if (!mucDau) continue
    const nhom: MucWord[] = [mucDau]
    daXuLy.add(dau)
    let ke = dau.nextElementSibling
    while (ke) {
      const muc = docMucWord(ke)
      if (!muc) break
      nhom.push(muc)
      daXuLy.add(ke)
      ke = ke.nextElementSibling
    }
    const ngan: { capDo: number; ds: HTMLElement }[] = []
    let goc: HTMLElement | null = null
    for (const muc of nhom) {
      while (ngan.length && ngan[ngan.length - 1]!.capDo > muc.capDo) ngan.pop()
      if (!ngan.length || ngan[ngan.length - 1]!.capDo < muc.capDo) {
        const ds = tai.createElement(muc.coSo ? "ol" : "ul")
        if (!ngan.length) goc = ds
        else {
          const cha = ngan[ngan.length - 1]!.ds
          ;(cha.lastElementChild ?? cha.appendChild(tai.createElement("li"))).appendChild(ds)
        }
        ngan.push({ capDo: muc.capDo, ds })
      }
      const li = tai.createElement("li")
      const doan = tai.createElement("p")
      while (muc.p.firstChild) doan.appendChild(muc.p.firstChild)
      li.appendChild(doan)
      ngan[ngan.length - 1]!.ds.appendChild(li)
    }
    if (goc) dau.replaceWith(goc)
    nhom.slice(1).forEach((m) => m.p.remove())
  }
}
