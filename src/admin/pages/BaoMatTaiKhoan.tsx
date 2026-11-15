import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { usePhienQuanTri } from "../hooks/usePhienQuanTri"
import {
  doiMatKhau,
  doiPinMoKhoa,
  LoiApi,
  layTrangThaiBaoMat,
  type TrangThaiBaoMat,
} from "../services/api-quan-tri"

/** Mẫu PIN hợp lệ: 6–8 chữ số, giữ dạng chuỗi để không mất số 0 ở đầu. */
const MAU_PIN = /^[0-9]{6,8}$/
/** Độ dài mật khẩu tối thiểu, khớp quy tắc backend. */
const DO_DAI_MAT_KHAU_TOI_THIEU = 12

const lopONhap =
  "mt-2 w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-[16px] focus:border-[var(--brown)] focus:outline-none aria-[invalid=true]:border-[#9b3b25]"
const lopNut =
  "min-h-[48px] bg-[var(--ink)] px-6 text-[14px] tracking-[.04em] text-white! hover:bg-[var(--brown)] disabled:cursor-wait disabled:opacity-70"

type LoiTruong = Record<string, string>

/**
 * Một ô nhập bí mật (PIN/mật khẩu) kèm nhãn và lỗi theo trường.
 * Giá trị chỉ nằm trong state React, không ghi vào storage.
 */
function OBiMat({
  id,
  nhan,
  giaTri,
  datGiaTri,
  loi,
  laPin = false,
  autoComplete,
  goiY,
  voHieu,
}: {
  id: string
  nhan: string
  giaTri: string
  datGiaTri: (v: string) => void
  loi?: string
  laPin?: boolean
  autoComplete: string
  goiY?: string
  voHieu: boolean
}) {
  const idMoTa = loi ? `${id}-loi` : goiY ? `${id}-goi-y` : undefined
  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium">
        {nhan}
      </label>
      <input
        id={id}
        type="password"
        inputMode={laPin ? "numeric" : undefined}
        pattern={laPin ? "[0-9]*" : undefined}
        maxLength={laPin ? 8 : 200}
        autoComplete={autoComplete}
        value={giaTri}
        disabled={voHieu}
        aria-invalid={loi ? true : undefined}
        aria-describedby={idMoTa}
        onChange={(e) => datGiaTri(laPin ? e.target.value.replace(/\D/g, "") : e.target.value)}
        className={lopONhap}
      />
      {loi ? (
        <p id={`${id}-loi`} className="mt-2 text-[13px] text-[#9b3b25]">
          {loi}
        </p>
      ) : (
        goiY && (
          <p id={`${id}-goi-y`} className="mt-2 text-[12px] text-[#6b5f4f]">
            {goiY}
          </p>
        )
      )}
    </div>
  )
}

/** Khung một biểu mẫu trong mục Bảo mật tài khoản. */
function KhoiBieuMau({ tieuDe, moTa, children }: { tieuDe: string; moTa: string; children: ReactNode }) {
  const id = `bm-${tieuDe.replace(/\s+/g, "-").toLowerCase()}`
  return (
    <section aria-labelledby={id} className="border border-[var(--line)] bg-white/40 p-6 sm:p-8">
      <h2 id={id} className="serif text-[28px] leading-[1.15]">
        {tieuDe}
      </h2>
      <p className="mt-2 text-[14px] text-[#6b5f4f]">{moTa}</p>
      {children}
    </section>
  )
}

/** Thông báo lỗi chung / thành công của một biểu mẫu. */
function ThongBaoBieuMau({ loi, thanhCong }: { loi: string | null; thanhCong?: string | null }) {
  return (
    <>
      <div role="alert" aria-live="assertive">
        {loi && <p className="m-0 border-l-2 border-[#9b3b25] py-1 pl-3 text-[14px] text-[#9b3b25]">{loi}</p>}
      </div>
      <div role="status" aria-live="polite">
        {thanhCong && <p className="m-0 border-l-2 border-[var(--olive)] py-1 pl-3 text-[14px]">{thanhCong}</p>}
      </div>
    </>
  )
}

/**
 * Biểu mẫu đổi PIN mở khóa chung của `/jathong` (chỉ hiển thị cho vai trò admin;
 * backend vẫn kiểm tra quyền).
 *
 * @param props.daBatPin - `false` khi chưa có PIN: đặt PIN lần đầu, không cần PIN hiện tại
 * @param props.khiDoiXong - Gọi sau khi đổi thành công để tải lại trạng thái
 */
function BieuMauDoiPin({ daBatPin, khiDoiXong }: { daBatPin: boolean; khiDoiXong: () => void }) {
  const { xuLyHetPhien } = usePhienQuanTri()
  const [pinHienTai, setPinHienTai] = useState("")
  const [matKhau, setMatKhau] = useState("")
  const [pinMoi, setPinMoi] = useState("")
  const [xacNhan, setXacNhan] = useState("")
  const [dangGui, setDangGui] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [loiTruong, setLoiTruong] = useState<LoiTruong>({})
  const [thanhCong, setThanhCong] = useState<string | null>(null)

  /** Kiểm tra phía client (backend kiểm tra lại toàn bộ). */
  function kiemTra(): LoiTruong {
    const ketQua: LoiTruong = {}
    if (daBatPin && !MAU_PIN.test(pinHienTai)) ketQua.currentPin = "PIN hiện tại gồm 6–8 chữ số."
    if (!matKhau) ketQua.password = "Vui lòng nhập mật khẩu."
    if (!MAU_PIN.test(pinMoi)) ketQua.newPin = "PIN mới gồm 6–8 chữ số."
    else if (daBatPin && pinMoi === pinHienTai) ketQua.newPin = "PIN mới phải khác PIN hiện tại."
    if (xacNhan !== pinMoi) ketQua.confirmPin = "PIN xác nhận không khớp."
    return ketQua
  }

  async function guiBieuMau(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault()
    setLoi(null)
    setThanhCong(null)
    const loiClient = kiemTra()
    setLoiTruong(loiClient)
    if (Object.keys(loiClient).length > 0) return
    setDangGui(true)
    try {
      const thongDiep = await doiPinMoKhoa({
        ...(daBatPin ? { currentPin: pinHienTai } : {}),
        password: matKhau,
        newPin: pinMoi,
        confirmPin: xacNhan,
      })
      setThanhCong(thongDiep)
      khiDoiXong()
    } catch (e) {
      if (e instanceof LoiApi && e.status === 401) return xuLyHetPhien()
      setLoi(e instanceof Error ? e.message : "Không đổi được PIN.")
      if (e instanceof LoiApi && e.truong) setLoiTruong(e.truong)
    } finally {
      // Xóa mọi bí mật khỏi state sau mỗi lần gửi, dù thành công hay thất bại.
      setPinHienTai("")
      setMatKhau("")
      setPinMoi("")
      setXacNhan("")
      setDangGui(false)
    }
  }

  return (
    <KhoiBieuMau
      tieuDe="Đổi PIN mở khóa"
      moTa={
        daBatPin
          ? "PIN mở khóa dùng chung cho mọi nhân viên trước bước đăng nhập. Sau khi đổi, PIN cũ hết hiệu lực ngay và các lượt mở khóa chưa đăng nhập phải nhập PIN mới."
          : "Trang quản trị chưa bật PIN mở khóa. Đặt PIN để mọi nhân viên phải nhập PIN trước bước đăng nhập."
      }
    >
      <form onSubmit={guiBieuMau} noValidate className="mt-8 grid gap-6" aria-busy={dangGui}>
        {daBatPin && (
          <OBiMat
            id="pin-hien-tai"
            nhan="PIN hiện tại"
            giaTri={pinHienTai}
            datGiaTri={setPinHienTai}
            loi={loiTruong.currentPin}
            laPin
            autoComplete="off"
            voHieu={dangGui}
          />
        )}
        <OBiMat
          id="pin-mat-khau"
          nhan="Mật khẩu tài khoản của bạn"
          giaTri={matKhau}
          datGiaTri={setMatKhau}
          loi={loiTruong.password}
          autoComplete="current-password"
          voHieu={dangGui}
        />
        <OBiMat
          id="pin-moi"
          nhan="PIN mới"
          giaTri={pinMoi}
          datGiaTri={setPinMoi}
          loi={loiTruong.newPin}
          laPin
          autoComplete="off"
          goiY="6–8 chữ số. Có thể bắt đầu bằng số 0."
          voHieu={dangGui}
        />
        <OBiMat
          id="pin-xac-nhan"
          nhan="Xác nhận PIN mới"
          giaTri={xacNhan}
          datGiaTri={setXacNhan}
          loi={loiTruong.confirmPin}
          laPin
          autoComplete="off"
          voHieu={dangGui}
        />
        <ThongBaoBieuMau loi={loi} thanhCong={thanhCong} />
        <div>
          <button type="submit" disabled={dangGui} className={lopNut}>
            {dangGui ? "Đang lưu…" : daBatPin ? "Đổi PIN" : "Đặt PIN"}
          </button>
        </div>
      </form>
    </KhoiBieuMau>
  )
}

/**
 * Biểu mẫu đổi mật khẩu của chính tài khoản đang đăng nhập. Thành công thì mọi phiên
 * bị thu hồi và người dùng quay về bước mở khóa để đăng nhập lại.
 */
function BieuMauDoiMatKhau() {
  const { xuLyHetPhien, ketThucPhien } = usePhienQuanTri()
  const [matKhauHienTai, setMatKhauHienTai] = useState("")
  const [matKhauMoi, setMatKhauMoi] = useState("")
  const [xacNhan, setXacNhan] = useState("")
  const [dangGui, setDangGui] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [loiTruong, setLoiTruong] = useState<LoiTruong>({})

  function kiemTra(): LoiTruong {
    const ketQua: LoiTruong = {}
    if (!matKhauHienTai) ketQua.currentPassword = "Vui lòng nhập mật khẩu hiện tại."
    if (matKhauMoi.length < DO_DAI_MAT_KHAU_TOI_THIEU)
      ketQua.newPassword = `Mật khẩu mới tối thiểu ${DO_DAI_MAT_KHAU_TOI_THIEU} ký tự.`
    else if (matKhauMoi === matKhauHienTai) ketQua.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại."
    if (xacNhan !== matKhauMoi) ketQua.confirmPassword = "Mật khẩu xác nhận không khớp."
    return ketQua
  }

  async function guiBieuMau(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault()
    setLoi(null)
    const loiClient = kiemTra()
    setLoiTruong(loiClient)
    if (Object.keys(loiClient).length > 0) return
    setDangGui(true)
    try {
      const thongDiep = await doiMatKhau({
        currentPassword: matKhauHienTai,
        newPassword: matKhauMoi,
        confirmPassword: xacNhan,
      })
      ketThucPhien(thongDiep)
    } catch (e) {
      if (e instanceof LoiApi && e.status === 401) return xuLyHetPhien()
      setLoi(e instanceof Error ? e.message : "Không đổi được mật khẩu.")
      if (e instanceof LoiApi && e.truong) setLoiTruong(e.truong)
      setDangGui(false)
    } finally {
      setMatKhauHienTai("")
      setMatKhauMoi("")
      setXacNhan("")
    }
  }

  return (
    <KhoiBieuMau
      tieuDe="Đổi mật khẩu"
      moTa="Đổi mật khẩu đăng nhập của chính bạn. Sau khi đổi, mọi phiên đăng nhập của tài khoản (kể cả phiên này) sẽ kết thúc và bạn cần mở khóa, đăng nhập lại."
    >
      <form onSubmit={guiBieuMau} noValidate className="mt-8 grid gap-6" aria-busy={dangGui}>
        <OBiMat
          id="mk-hien-tai"
          nhan="Mật khẩu hiện tại"
          giaTri={matKhauHienTai}
          datGiaTri={setMatKhauHienTai}
          loi={loiTruong.currentPassword}
          autoComplete="current-password"
          voHieu={dangGui}
        />
        <OBiMat
          id="mk-moi"
          nhan="Mật khẩu mới"
          giaTri={matKhauMoi}
          datGiaTri={setMatKhauMoi}
          loi={loiTruong.newPassword}
          autoComplete="new-password"
          goiY={`Tối thiểu ${DO_DAI_MAT_KHAU_TOI_THIEU} ký tự.`}
          voHieu={dangGui}
        />
        <OBiMat
          id="mk-xac-nhan"
          nhan="Xác nhận mật khẩu mới"
          giaTri={xacNhan}
          datGiaTri={setXacNhan}
          loi={loiTruong.confirmPassword}
          autoComplete="new-password"
          voHieu={dangGui}
        />
        <ThongBaoBieuMau loi={loi} />
        <div>
          <button type="submit" disabled={dangGui} className={lopNut}>
            {dangGui ? "Đang lưu…" : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </KhoiBieuMau>
  )
}

/**
 * Trang "Bảo mật tài khoản" (`/jathong/bao-mat`): đổi PIN mở khóa (chỉ admin) và đổi
 * mật khẩu của chính mình. Không lưu PIN/mật khẩu vào bất kỳ storage nào của trình duyệt.
 *
 * @returns Trang bảo mật tài khoản
 */
export function BaoMatTaiKhoan() {
  const { xuLyHetPhien } = usePhienQuanTri()
  const [trangThai, setTrangThai] = useState<TrangThaiBaoMat | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [lanTai, setLanTai] = useState(0)

  useEffect(() => {
    let daHuy = false
    setLoi(null)
    layTrangThaiBaoMat()
      .then((tt) => !daHuy && setTrangThai(tt))
      .catch((e: unknown) => {
        if (daHuy) return
        if (e instanceof LoiApi && e.status === 401) xuLyHetPhien()
        else setLoi(e instanceof Error ? e.message : "Không tải được thông tin bảo mật.")
      })
    return () => {
      daHuy = true
    }
  }, [lanTai, xuLyHetPhien])

  return (
    <>
      <p className="eyebrow">BẢO MẬT TÀI KHOẢN</p>
      <h1 className="serif mt-3 text-[clamp(32px,4vw,48px)] leading-[1.1]">Bảo mật tài khoản</h1>

      {loi && (
        <div role="alert" className="mt-10 border-l-2 border-[#9b3b25] py-2 pl-4 text-[#9b3b25]">
          <p className="m-0">{loi}</p>
          <button type="button" onClick={() => setLanTai((n) => n + 1)} className="underlink mt-3 text-[13px]">
            Thử lại
          </button>
        </div>
      )}

      {!trangThai && !loi && (
        <p className="mt-10 text-[14px]" aria-busy="true">
          Đang tải…
        </p>
      )}

      {trangThai && (
        <div className="mt-10 grid max-w-[1000px] grid-cols-1 gap-8 lg:grid-cols-2">
          {trangThai.canChangePin && (
            <BieuMauDoiPin daBatPin={trangThai.pinEnabled} khiDoiXong={() => setLanTai((n) => n + 1)} />
          )}
          <BieuMauDoiMatKhau />
        </div>
      )}
    </>
  )
}
