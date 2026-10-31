"""Chuyển các ảnh PNG/JPEG nặng trong public/ sang WebP, có kiểm tra chất lượng.

Cách chạy (tại repository root, cần Pillow):

    python scripts/toi-uu-anh.py            # tạo .webp, in bảng trước/sau
    python scripts/toi-uu-anh.py --xoa-goc  # như trên rồi xóa file gốc

Mỗi ảnh được mã hóa WebP (method 6) bắt đầu từ chất lượng 82; nếu PSNR so với
bản gốc (cùng kích thước đích) thấp hơn NGUONG_PSNR thì tăng chất lượng thêm 4
cho đến 94. Ảnh không đạt ngưỡng ở 94 sẽ bị bỏ qua và giữ nguyên bản gốc.
Danh sách phải khớp với ANH_DA_CHUYEN trong tests/hieu-nang.test.mjs.
"""

import math
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageChops, ImageStat

GOC = Path(__file__).resolve().parents[1] / "public"
NGUONG_PSNR = 38.0

# (đường dẫn gốc, chiều rộng đích hoặc None để giữ nguyên kích thước)
DANH_SACH = [
    ("assets/homepage-curated/03-the-lo-trinh-phien-dau-tien.png", None),
    ("assets/homepage-curated/04-the-lo-trinh-thuc-hanh-phan-tu.png", None),
    ("assets/homepage-curated/05-the-lo-trinh-the-hermit-room.png", None),
    ("assets/homepage-curated/09-khong-gian-chuan-bi-phien.png", None),
    ("assets/homepage-curated/10-nu-tu-van-don-khach.png", None),
    ("assets/homepage-curated/11-phien-1-1-the-hermit.png", None),
    ("assets/homepage-curated/01-workshop-cham-ve-de-diu-lai.png", None),
    ("assets/home-story/the-hermit-room.png", None),
    ("assets/the-hermit/tea-room-placeholder.png", None),
    ("assets/workshop/ws-cham-ve-diu-lai-CMQz-7CG.png", None),
    ("assets/lara/lara-autumn-collage-source.jpeg", None),
    *[(f"assets/journal/goc/hinh0{n}.jpg", None) for n in range(1, 8)],
    # 2560×1920 vượt xa mọi kích thước hiển thị; thu về 1600×1200, giữ tỉ lệ 4:3.
    ("assets/journal/goc/hinh08.jpg", 1600),
]


def psnr(a: Image.Image, b: Image.Image) -> float:
    """Tính PSNR (dB) giữa hai ảnh RGB cùng kích thước; càng cao càng giống."""
    mse = sum(v * v for v in ImageStat.Stat(ImageChops.difference(a, b)).rms) / 3
    return float("inf") if mse == 0 else 20 * math.log10(255 / math.sqrt(mse))


def chuyen(duong_dan: str, rong_dich: int | None) -> tuple[int, int, int, float, tuple[int, int]] | None:
    """Mã hóa một ảnh sang WebP đạt NGUONG_PSNR.

    Trả về (byte gốc, byte mới, chất lượng, PSNR, kích thước) hoặc None nếu
    không đạt ngưỡng. Tác dụng phụ: ghi file .webp cạnh file gốc.
    """
    tep = GOC / duong_dan
    anh = Image.open(tep).convert("RGB")
    if rong_dich and anh.width > rong_dich:
        anh = anh.resize((rong_dich, round(anh.height * rong_dich / anh.width)), Image.LANCZOS)
    for chat_luong in range(82, 95, 4):
        bo_dem = BytesIO()
        anh.save(bo_dem, "WEBP", quality=chat_luong, method=6)
        diem = psnr(anh, Image.open(BytesIO(bo_dem.getvalue())).convert("RGB"))
        if diem >= NGUONG_PSNR:
            tep.with_suffix(".webp").write_bytes(bo_dem.getvalue())
            return tep.stat().st_size, len(bo_dem.getvalue()), chat_luong, diem, anh.size
    return None


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    xoa_goc = "--xoa-goc" in sys.argv
    tong_cu = tong_moi = 0
    for duong_dan, rong in DANH_SACH:
        ket_qua = chuyen(duong_dan, rong)
        if ket_qua is None:
            print(f"BỎ QUA (không đạt {NGUONG_PSNR} dB): {duong_dan}")
            continue
        cu, moi, q, diem, (w, h) = ket_qua
        tong_cu += cu
        tong_moi += moi
        print(f"{cu / 1024:7.0f} KB -> {moi / 1024:5.0f} KB  q{q}  {diem:5.1f} dB  {w}x{h}  {duong_dan}")
        if xoa_goc:
            (GOC / duong_dan).unlink()
    print(f"Tổng: {tong_cu / 1048576:.1f} MB -> {tong_moi / 1048576:.1f} MB")


if __name__ == "__main__":
    main()
