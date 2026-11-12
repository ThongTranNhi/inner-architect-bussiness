import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { dangNhap, dangXuat, LoiApi, layPhienHienTai, xoaPhienCucBo } from "../services/api-quan-tri"
import type { QuanTriVien } from "../types/quan-tri"

type GiaTriPhien = {
  /** `undefined` = đang kiểm tra phiên; `null` = chưa đăng nhập. */
  quanTriVien: QuanTriVien | null | undefined
  /** Lỗi khi kiểm tra phiên ban đầu (vd. backend không chạy). */
  loiKhoiTao: string | null
  dangNhap: (username: string, password: string) => Promise<void>
  dangXuat: () => Promise<void>
  /** Gọi khi một API trả 401 để quay về màn đăng nhập. */
  xuLyHetPhien: () => void
  kiemTraLai: () => void
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
  const [lanKiemTra, setLanKiemTra] = useState(0)

  useEffect(() => {
    let daHuy = false
    setLoiKhoiTao(null)
    layPhienHienTai()
      .then((tk) => !daHuy && setQuanTriVien(tk))
      .catch((loi: unknown) => {
        if (daHuy) return
        if (loi instanceof LoiApi && loi.status === 401) setQuanTriVien(null)
        else {
          setQuanTriVien(null)
          setLoiKhoiTao(loi instanceof Error ? loi.message : "Không kiểm tra được phiên đăng nhập.")
        }
      })
    return () => {
      daHuy = true
    }
  }, [lanKiemTra])

  const xuLyHetPhien = useCallback(() => {
    xoaPhienCucBo()
    setQuanTriVien(null)
  }, [])

  const giaTri = useMemo<GiaTriPhien>(
    () => ({
      quanTriVien,
      loiKhoiTao,
      dangNhap: async (username, password) => {
        setQuanTriVien(await dangNhap(username, password))
        setLoiKhoiTao(null)
      },
      dangXuat: async () => {
        await dangXuat().catch(() => undefined)
        setQuanTriVien(null)
      },
      xuLyHetPhien,
      kiemTraLai: () => setLanKiemTra((n) => n + 1),
    }),
    [quanTriVien, loiKhoiTao, xuLyHetPhien],
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
