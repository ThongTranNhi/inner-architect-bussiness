import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react"
import { DANH_SACH_DICH_VU_LIEN_HE } from "./dich-vu-lien-he.ts"
import { guiThongTinLienHe } from "./gui-thong-tin-lien-he.ts"
import {
  kiemTraBieuMauLienHe,
  type DuLieuBieuMauLienHe,
  type LoiBieuMau,
  type TruongBieuMau,
} from "./kiem-tra-bieu-mau-lien-he.ts"

const DU_LIEU_TRONG: DuLieuBieuMauLienHe = {
  fullName: "",
  phone: "",
  email: "",
  service: "",
  consent: false,
}

/** Thứ tự trường trên giao diện, dùng để đưa focus tới lỗi đầu tiên. */
const THU_TU_TRUONG: TruongBieuMau[] = ["fullName", "phone", "email", "service", "consent"]

// Ghi chú: CSS cũ trong index.css không nằm trong @layer nên thắng utility của Tailwind
// (`button{color:inherit}`, `.cream-page p{color:…}`, `input:focus-visible{outline…}`);
// các thuộc tính bị đè dùng hậu tố `!`.
const lopONhap =
  "block h-[52px] w-full rounded-[14px] border border-[#3B3636]/20 bg-[#FFFDF8]/80 px-4 text-[15px] text-[#27190F] placeholder:text-[#3B3636]/45 transition-[border-color,box-shadow] duration-150 hover:border-[#3B3636]/35 focus:border-[#3F4A36] focus:ring-[3px] focus:ring-[#3F4A36]/20 focus-visible:outline-none! aria-[invalid=true]:border-[#9b3b25] aria-[invalid=true]:focus:ring-[#9b3b25]/15 disabled:cursor-not-allowed disabled:opacity-60"

/**
 * Card biểu mẫu "Liên hệ để đặt lịch" (cột giữa khối Liên hệ).
 *
 * Gửi họ tên, số điện thoại, email (không bắt buộc), dịch vụ quan tâm và đồng ý
 * chính sách bảo mật tới `POST /api/v1/customers`. Đây là yêu cầu liên hệ, không
 * phải đặt lịch: website không chọn ngày giờ và không xác nhận lịch tự động.
 *
 * - Thành công (server đã lưu MySQL): thay form bằng trạng thái cảm ơn.
 * - Lỗi: giữ nguyên dữ liệu đã nhập, hiển thị lỗi tại trường hoặc thông báo chung.
 *
 * @param props.xuatHien - Hàm tạo style fade-up theo độ trễ (ms) từ khối cha; bỏ trống thì không animate
 * @returns Card biểu mẫu
 */
export function BieuMauLienHe({
  xuatHien = () => ({}),
}: {
  xuatHien?: (treMs?: number) => CSSProperties
}) {
  const id = useId()
  const [duLieu, setDuLieu] = useState<DuLieuBieuMauLienHe>(DU_LIEU_TRONG)
  const [loi, setLoi] = useState<LoiBieuMau>({})
  const [dangGui, setDangGui] = useState(false)
  const [loiChung, setLoiChung] = useState<string | null>(null)
  const [daGui, setDaGui] = useState(false)
  const boBatRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const tieuDeThanhCongRef = useRef<HTMLHeadingElement>(null)
  // Chỉ chuyển focus sau thao tác của người dùng, không chuyển khi trang vừa tải.
  const canChuyenFocus = useRef(false)

  useEffect(() => {
    if (!canChuyenFocus.current) return
    canChuyenFocus.current = false
    if (daGui) tieuDeThanhCongRef.current?.focus()
    else formRef.current?.querySelector<HTMLElement>('[name="fullName"]')?.focus()
  }, [daGui])

  /**
   * Cập nhật một trường và xóa lỗi cũ của trường đó.
   *
   * @param truong - Tên trường
   * @param giaTri - Giá trị mới
   */
  function capNhat<K extends TruongBieuMau>(truong: K, giaTri: DuLieuBieuMauLienHe[K]) {
    setDuLieu((cu) => ({ ...cu, [truong]: giaTri }))
    setLoi((cu) => {
      if (!cu[truong]) return cu
      const moi = { ...cu }
      delete moi[truong]
      return moi
    })
  }

  /**
   * Đưa focus tới trường lỗi đầu tiên (hỗ trợ bàn phím và trình đọc màn hình).
   *
   * @param loiMoi - Lỗi theo trường
   */
  function focusLoiDauTien(loiMoi: LoiBieuMau) {
    const truong = THU_TU_TRUONG.find((ten) => loiMoi[ten])
    if (truong) formRef.current?.querySelector<HTMLElement>(`[name="${truong}"]`)?.focus()
  }

  /**
   * Kiểm tra phía client, gửi lên backend và chuyển sang trạng thái cảm ơn khi đã lưu.
   *
   * @param suKien - Sự kiện submit của form
   */
  async function xuLyGui(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault()
    if (dangGui) return
    setLoiChung(null)

    const loiClient = kiemTraBieuMauLienHe(duLieu)
    if (Object.keys(loiClient).length > 0) {
      setLoi(loiClient)
      focusLoiDauTien(loiClient)
      return
    }

    setDangGui(true)
    const ketQua = await guiThongTinLienHe(duLieu, { boBat: boBatRef.current?.value })
    setDangGui(false)

    if (ketQua.trangThai === "thanh-cong") {
      setDuLieu(DU_LIEU_TRONG)
      setLoi({})
      canChuyenFocus.current = true
      setDaGui(true)
      return
    }
    if (ketQua.trangThai === "du-lieu-sai") {
      setLoi(ketQua.loiTruong)
      focusLoiDauTien(ketQua.loiTruong)
    }
    setLoiChung(ketQua.thongDiep)
  }

  /** Quay lại form trống để gửi thêm một yêu cầu (không tải lại trang). */
  function guiYeuCauKhac() {
    setLoiChung(null)
    canChuyenFocus.current = true
    setDaGui(false)
  }

  /** Thuộc tính ARIA nối ô nhập với thông điệp lỗi của nó. */
  const ariaLoi = (truong: TruongBieuMau) => ({
    "aria-invalid": loi[truong] ? true : undefined,
    "aria-describedby": loi[truong] ? `${id}-${truong}-loi` : undefined,
  })

  /** Thông điệp lỗi ngay dưới trường, có ký hiệu để không chỉ dựa vào màu. */
  const dongLoi = (truong: TruongBieuMau) =>
    loi[truong] ? (
      <p id={`${id}-${truong}-loi`} className="m-0 mt-1.5 text-[13px] leading-snug text-[#9b3b25]!">
        <span aria-hidden="true">⚠ </span>
        {loi[truong]}
      </p>
    ) : null

  const nhanTruong = "mb-1.5 block text-[13px] font-semibold tracking-[.02em] text-[#3B3636]"

  return (
    <div
      className="rounded-[28px] border border-[#3B3636]/10 bg-[#FFF8EC] p-6 sm:p-8"
      style={xuatHien(120)}
    >
      <p className="m-0 text-xs font-semibold uppercase tracking-[.14em] text-[#B75E2A]!" style={xuatHien(180)}>
        ĐẶT LỊCH · APPOINTMENT
      </p>
      <h3
        className="glowence-serif m-0 mt-2 text-[30px] font-semibold leading-[1.12] text-[#3B3636] sm:text-[34px]"
        style={xuatHien(240)}
      >
        Liên hệ để đặt lịch
      </h3>

      {daGui ? (
        <div role="status" aria-live="polite" className="mt-6">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3F4A36]/10 text-[#3F4A36]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <h4
            ref={tieuDeThanhCongRef}
            tabIndex={-1}
            className="glowence-serif m-0 mt-4 text-[26px] font-semibold leading-tight text-[#27190F] focus:outline-none"
          >
            Cảm ơn bạn đã kết nối.
          </h4>
          <p className="m-0 mt-3 text-[15px] leading-[1.6] text-[#3B3636]/85!">
            Thông tin của bạn đã được tiếp nhận. Đội ngũ INNER ARCHITECT sẽ chủ động liên hệ để trao
            đổi thêm và sắp xếp thời gian phù hợp.
          </p>
          <button
            type="button"
            onClick={guiYeuCauKhac}
            className="mt-6 inline-flex min-h-[46px] items-center rounded-full border border-[#3B3636]/30 bg-transparent px-6 text-[14px] font-medium text-[#27190F]! transition-colors hover:border-[#3F4A36] hover:bg-[#3F4A36]/5"
          >
            Gửi một yêu cầu khác
          </button>
        </div>
      ) : (
        <>
          <p className="m-0 mt-3 text-[15px] leading-[1.6] text-[#3B3636]/85!" style={xuatHien(300)}>
            Để lại một vài thông tin cơ bản. Đội ngũ INNER ARCHITECT sẽ chủ động liên hệ để xác nhận
            nhu cầu, dịch vụ và thời gian phù hợp với bạn.
          </p>

          <form
            ref={formRef}
            onSubmit={xuLyGui}
            noValidate
            aria-busy={dangGui}
            className="mt-7 grid gap-[18px]"
          >
            <div>
              <label htmlFor={`${id}-fullName`} className={nhanTruong}>
                Họ và tên <span aria-hidden="true" className="text-[#B75E2A]">*</span>
              </label>
              <input
                id={`${id}-fullName`}
                name="fullName"
                type="text"
                autoComplete="name"
                maxLength={150}
                required
                disabled={dangGui}
                value={duLieu.fullName}
                onChange={(e) => capNhat("fullName", e.target.value)}
                className={lopONhap}
                {...ariaLoi("fullName")}
              />
              {dongLoi("fullName")}
            </div>

            <div>
              <label htmlFor={`${id}-phone`} className={nhanTruong}>
                Số điện thoại <span aria-hidden="true" className="text-[#B75E2A]">*</span>
              </label>
              <input
                id={`${id}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={30}
                required
                disabled={dangGui}
                placeholder="0901 234 567"
                value={duLieu.phone}
                onChange={(e) => capNhat("phone", e.target.value)}
                className={lopONhap}
                {...ariaLoi("phone")}
              />
              {dongLoi("phone")}
            </div>

            <div>
              <label htmlFor={`${id}-email`} className={nhanTruong}>
                Email <span className="font-normal text-[#3B3636]/60">(không bắt buộc)</span>
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={255}
                disabled={dangGui}
                value={duLieu.email}
                onChange={(e) => capNhat("email", e.target.value)}
                className={lopONhap}
                {...ariaLoi("email")}
              />
              {dongLoi("email")}
            </div>

            <div>
              <label htmlFor={`${id}-service`} className={nhanTruong}>
                Dịch vụ quan tâm <span aria-hidden="true" className="text-[#B75E2A]">*</span>
              </label>
              <div className="relative">
                <select
                  id={`${id}-service`}
                  name="service"
                  required
                  disabled={dangGui}
                  value={duLieu.service}
                  onChange={(e) => capNhat("service", e.target.value)}
                  className={`${lopONhap} cursor-pointer appearance-none pr-11`}
                  {...ariaLoi("service")}
                >
                  <option value="" disabled>
                    Chọn một dịch vụ
                  </option>
                  {DANH_SACH_DICH_VU_LIEN_HE.map((dichVu) => (
                    <option key={dichVu.ma} value={dichVu.ma}>
                      {dichVu.nhan}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3B3636"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 opacity-60"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {dongLoi("service")}
            </div>

            {/* Bẫy bot: ẩn khỏi người dùng và trình đọc màn hình; người thật luôn để trống. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={`${id}-website`}>Website</label>
              <input
                ref={boBatRef}
                id={`${id}-website`}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <div>
              <div className="flex items-start gap-3">
                <input
                  id={`${id}-consent`}
                  name="consent"
                  type="checkbox"
                  required
                  disabled={dangGui}
                  checked={duLieu.consent}
                  onChange={(e) => capNhat("consent", e.target.checked)}
                  className="mt-0.5 h-[22px] w-[22px] shrink-0 cursor-pointer rounded accent-[#3F4A36]"
                  {...ariaLoi("consent")}
                />
                <label
                  htmlFor={`${id}-consent`}
                  className="cursor-pointer text-[14px] leading-[1.55] text-[#3B3636]"
                >
                  Tôi đồng ý cung cấp thông tin trên để INNER ARCHITECT™ liên hệ tư vấn, theo{" "}
                  <a
                    href="/chinh-sach-bao-mat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline! decoration-[#3B3636]/50 underline-offset-[3px] hover:decoration-[#3F4A36]"
                  >
                    Chính sách bảo mật
                  </a>
                  .
                </label>
              </div>
              {dongLoi("consent")}
            </div>

            {loiChung && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-[14px] border border-[#9b3b25]/30 bg-[#9b3b25]/[.06] px-4 py-3"
              >
                <span aria-hidden="true" className="mt-px text-[15px] text-[#9b3b25]">
                  ⚠
                </span>
                <p className="m-0 text-[14px] leading-[1.55] text-[#7a2e1d]!">
                  <strong className="font-semibold">Chưa gửi được thông tin.</strong> {loiChung}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={dangGui}
              className="mt-1 inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-[#3F4A36] px-7 text-[15px] font-medium tracking-[.02em] text-[#FFFAF1]! transition-colors hover:bg-[#2F3828] disabled:cursor-wait disabled:bg-[#3F4A36]/60"
            >
              {dangGui && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFFAF1]/40 border-t-[#FFFAF1] motion-reduce:animate-none"
                />
              )}
              {dangGui ? "Đang gửi..." : "Gửi thông tin đặt lịch"}
            </button>
            <p className="m-0 text-center text-[12px] leading-snug text-[#3B3636]/65!">
              Website không xác nhận lịch tự động. Thời gian cụ thể sẽ được đội ngũ trao đổi với bạn.
            </p>
          </form>
        </>
      )}
    </div>
  )
}
