import { useState, type FormEvent } from "react"
import { go, Link } from "../../dieu-huong"
import { GOC_QUAN_TRI } from "../duong-dan-quan-tri"
import { usePhienQuanTri } from "../hooks/usePhienQuanTri"
import { LoiApi, moKhoaQuanTri } from "../services/api-quan-tri"

/**
 * Màn đăng nhập nhân viên. Mật khẩu chỉ nằm trong state của form tới khi gửi,
 * không lưu vào storage. Sai thông tin chỉ hiển thị một thông điệp chung.
 *
 * @returns Trang đăng nhập
 */
export function DangNhapQuanTri() {
  const { dangNhap, loiKhoiTao, canNhapPin, kiemTraLai, thongBaoDangNhap, khoaDen, datKhoaDen } = usePhienQuanTri()
  const [pin, setPin] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [dangGui, setDangGui] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  /**
   * Gửi đăng nhập; thành công thì chuyển về dashboard.
   *
   * @param suKien - Sự kiện submit
   */
  async function xuLyDangNhap(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault()
    if (khoaDen !== null || dangGui) return
    if (canNhapPin ? !/^[0-9]{6,8}$/.test(pin) : !username.trim() || !password) {
      setLoi(canNhapPin ? "Vui lòng nhập PIN từ 6 đến 8 chữ số." : "Vui lòng nhập tên đăng nhập và mật khẩu.")
      return
    }
    setDangGui(true)
    setLoi(null)
    try {
      if (canNhapPin) {
        await moKhoaQuanTri(pin)
        setPin("")
        kiemTraLai()
        return
      }
      await dangNhap(username.trim(), password)
      setPassword("")
      go(GOC_QUAN_TRI)
    } catch (e) {
      if (e instanceof LoiApi && e.choDen) {
        setPin("")
        setPassword("")
        datKhoaDen(e.choDen)
      }
      setLoi(e instanceof LoiApi ? e.message : "Đăng nhập không thành công.")
    } finally {
      setDangGui(false)
    }
  }

  const lopONhap =
    "mt-2 w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-[16px] focus:border-[var(--brown)] focus:outline-none"

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--cream)] px-4 py-12 text-[var(--ink)]">
      <div className="w-full max-w-[420px]">
        <p className="wordmark text-center">
          INNER ARCHITECT<sup>™</sup>
        </p>
        <h1 className="serif mt-6 text-center text-[clamp(36px,6vw,48px)] leading-[1.05]">Customer Care</h1>
        <p className="mt-3 text-center text-[14px] text-[#6b5f4f]">Đăng nhập dành cho nhân viên nội bộ.</p>

        {khoaDen !== null ? (
          <p role="status" className="mt-10 border-l-2 border-[#9b3b25] pl-3 text-[14px]">
            Địa chỉ IP tạm bị khóa do nhập sai quá nhiều lần. Bạn có thể thử lại lúc{" "}
            {new Date(khoaDen).toLocaleTimeString("vi-VN")}. Ô nhập sẽ tự hiện lại.
          </p>
        ) : (
        <form onSubmit={xuLyDangNhap} noValidate className="mt-10 grid gap-6" aria-busy={dangGui}>
          {canNhapPin ? (
            <div>
              <label htmlFor="admin-pin" className="text-[13px] font-medium">Mã PIN mở khóa</label>
              <input
                id="admin-pin"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={8}
                value={pin}
                disabled={dangGui}
                onChange={(e) => setPin(e.target.value)}
                className={lopONhap}
              />
            </div>
          ) : (
          <>
          <div>
            <label htmlFor="admin-username" className="text-[13px] font-medium">
              Tên đăng nhập
            </label>
            <input
              id="admin-username"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={100}
              value={username}
              disabled={dangGui}
              onChange={(e) => setUsername(e.target.value)}
              className={lopONhap}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-[13px] font-medium">
              Mật khẩu
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={200}
              value={password}
              disabled={dangGui}
              onChange={(e) => setPassword(e.target.value)}
              className={lopONhap}
            />
          </div>

          </>
          )}

          {thongBaoDangNhap && !loi && (
            <p role="status" className="m-0 border-l-2 border-[var(--olive)] py-1 pl-3 text-[14px]">
              {thongBaoDangNhap}
            </p>
          )}

          <div role="alert" aria-live="assertive">
            {(loi ?? loiKhoiTao) && (
              <p className="m-0 border-l-2 border-[#9b3b25] py-1 pl-3 text-[14px] text-[#9b3b25]">{loi ?? loiKhoiTao}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={dangGui}
            className="min-h-[48px] bg-[var(--ink)] text-[14px] tracking-[.04em] text-white! hover:bg-[var(--brown)] disabled:cursor-wait disabled:opacity-70"
          >
            {canNhapPin ? (dangGui ? "Đang mở khóa…" : "Mở khóa") : (dangGui ? "Đang đăng nhập…" : "Đăng nhập")}
          </button>
        </form>
        )}
        <p className="mt-10 text-center text-[12px]">
          <Link to="/" className="underlink">
            ← Về website
          </Link>
        </p>
      </div>
    </main>
  )
}
