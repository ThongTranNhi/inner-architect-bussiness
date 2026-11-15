import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { dangNhap, dangXuat, LoiApi, layPhienHienTai, xoaPhienCucBo } from "../services/api-quan-tri"
import type { QuanTriVien } from "../types/quan-tri"

type GiaTriPhien = {
  /** `undefined` = đang kiểm tra phiên; `null` = chưa đăng nhập. */
  quanTriVien: QuanTriVien | null | undefined
  /** Lỗi khi kiểm tra phiên ban đầu (vd. backend không chạy). */
  loiKhoiTao: string | null
  /** `true` khi backend yêu cầu mở khóa bằng PIN trước khi đăng nhập. */
  canNhapPin: boolean
  khoaDen: number | null
  datKhoaDen: (thoiDiem: number) => void
  /** Thông báo hiển thị ở màn mở khóa/đăng nhập (vd. sau khi đổi mật khẩu). */
  thongBaoDangNhap: string | null
  dangNhap: (username: string, password: string) => Promise<void>
  dangXuat: () => Promise<void>
  /** Gọi khi một API trả 401 để quay về màn đăng nhập. */
  xuLyHetPhien: () => void
  kiemTraLai: () => void
  /** Kết thúc phiên phía client (server đã thu hồi phiên) và về bước mở khóa kèm thông báo. */
  ketThucPhien: (thongBao: string) => void
}

const NguCanhPhien = createContext<GiaTriPhien | null>(null)

/**
 * Cung cấp trạng thái phiên đăng nhập cho toàn bộ trang quản trị.
 * Khi mount sẽ gọi `/auth/me` để khôi phục phiên từ cookie.
 *
 * @param props.children - Cây component quản trị
 * @returns Provider ngữ cảnh phiên
 */
export function PhienQuanTriProvider({ children }: { children: ReactNode }) {
  const [quanTriVien, setQuanTriVien] = useState<QuanTriVien | null | undefined>(undefined)
  const [loiKhoiTao, setLoiKhoiTao] = useState<string | null>(null)
  const [canNhapPin, setCanNhapPin] = useState(false)
  const [khoaDen, setKhoaDen] = useState<number | null>(null)
  const [thongBaoDangNhap, setThongBaoDangNhap] = useState<string | null>(null)
  const [lanKiemTra, setLanKiemTra] = useState(0)

  useEffect(() => {
    let daHuy = false
    setLoiKhoiTao(null)
    layPhienHienTai()
      .then((tk) => !daHuy && setQuanTriVien(tk))
      .catch((loi: unknown) => {
        if (daHuy) return
        if (loi instanceof LoiApi && loi.choDen) {
          setKhoaDen(loi.choDen)
          setQuanTriVien(null)
        } else if (loi instanceof LoiApi && loi.status === 401) {
          setKhoaDen(null)
          setCanNhapPin(loi.ma === "ADMIN_PIN_REQUIRED")
          setQuanTriVien(null)
        }
        else {
          setQuanTriVien(null)
          setLoiKhoiTao(loi instanceof Error ? loi.message : "Không kiểm tra được phiên đăng nhập.")
        }
      })
    return () => {
      daHuy = true
    }
  }, [lanKiemTra])

  useEffect(() => {
    if (khoaDen === null) return
    const hen = window.setTimeout(() => {
      setKhoaDen(null)
      setQuanTriVien(undefined)
      setLanKiemTra((n) => n + 1)
    }, Math.max(0, khoaDen - Date.now()))
    return () => window.clearTimeout(hen)
  }, [khoaDen])

  const xuLyHetPhien = useCallback(() => {
    xoaPhienCucBo()
    setQuanTriVien(undefined)
    setLanKiemTra((n) => n + 1)
  }, [])

  const giaTri = useMemo<GiaTriPhien>(
    () => ({
      quanTriVien,
      loiKhoiTao,
      canNhapPin,
      khoaDen,
      datKhoaDen: setKhoaDen,
      thongBaoDangNhap,
      dangNhap: async (username, password) => {
        try {
          setQuanTriVien(await dangNhap(username, password))
        } catch (loi) {
          if (loi instanceof LoiApi && loi.ma === "ADMIN_PIN_REQUIRED") setCanNhapPin(true)
          throw loi
        }
        setLoiKhoiTao(null)
        setThongBaoDangNhap(null)
      },
      dangXuat: async () => {
        await dangXuat().catch(() => undefined)
        setQuanTriVien(undefined)
        setLanKiemTra((n) => n + 1)
      },
      xuLyHetPhien,
      kiemTraLai: () => setLanKiemTra((n) => n + 1),
      ketThucPhien: (thongBao) => {
        xoaPhienCucBo()
        setThongBaoDangNhap(thongBao)
        setQuanTriVien(undefined)
        setLanKiemTra((n) => n + 1)
      },
    }),
    [quanTriVien, loiKhoiTao, canNhapPin, khoaDen, thongBaoDangNhap, xuLyHetPhien],
  )

  return <NguCanhPhien.Provider value={giaTri}>{children}</NguCanhPhien.Provider>
}

/**
 * Truy cập phiên đăng nhập quản trị.
 *
 * @returns Trạng thái phiên và các thao tác đăng nhập/đăng xuất
 * @throws Error nếu dùng ngoài `PhienQuanTriProvider`
 */
export function usePhienQuanTri(): GiaTriPhien {
  const giaTri = useContext(NguCanhPhien)
  if (!giaTri) throw new Error("usePhienQuanTri phải dùng bên trong PhienQuanTriProvider")
  return giaTri
}
