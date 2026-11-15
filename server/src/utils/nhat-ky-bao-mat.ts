/** Thao tác bảo mật được ghi nhật ký. */
export type ThaoTacBaoMat =
  | "doi_pin"
  | "doi_mat_khau"
  | "xoa_khach_hang"
  | "cap_quyen_journal"
  | "thu_hoi_quyen_journal"
  | "xuat_ban_journal"
  | "go_xuat_ban_journal"
  | "xoa_bai_journal"
  | "xoa_chuyen_muc_journal"
  | "xoa_anh_journal"

/** Kết quả thao tác bảo mật. */
export type KetQuaBaoMat = "thanh_cong" | "sai_thong_tin" | "xung_dot"

/** Hàm ghi một sự kiện bảo mật. */
export type GhiNhatKyBaoMat = (suKien: {
  thaoTac: ThaoTacBaoMat
  maQuanTriVien: number
  ketQua: KetQuaBaoMat
  /** ID bản ghi bị tác động (vd. khách hàng bị xóa) — chỉ ID, không có dữ liệu cá nhân. */
  maDoiTuong?: number
}) => void

/**
 * Tạo hàm ghi nhật ký bảo mật. Mỗi dòng là JSON chỉ gồm loại thao tác, ID tài khoản,
 * thời điểm và kết quả — tuyệt đối không có PIN, mật khẩu hay bản băm.
 *
 * @param bat - `false` trong test để không in log
 * @returns Hàm ghi nhật ký
 */
export function taoGhiNhatKyBaoMat(bat: boolean): GhiNhatKyBaoMat {
  return ({ thaoTac, maQuanTriVien, ketQua, maDoiTuong }) => {
    if (!bat) return
    console.info(
      JSON.stringify({
        loai: "security",
        thaoTac,
        maQuanTriVien,
        ketQua,
        ...(maDoiTuong === undefined ? {} : { maDoiTuong }),
        thoiDiem: new Date().toISOString(),
      }),
    )
  }
}
