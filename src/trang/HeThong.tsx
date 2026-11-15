import { useEffect, useState } from "react"
import { go, Link } from "../dieu-huong"

/**
 * Cấu trúc dữ liệu chi tiết cho từng tầng kiến trúc
 * Trích xuất nguyên bản từ tài liệu gốc Inner_Architect_Noi_Dung_Website_4_Tang.docx
 */
interface TangKienTruc {
  id: string
  soThuTu: string
  soLaMa: string
  tenTang: string
  tenTiengAnh: string
  loiMo: string
  noiDung: string
  traiNghiemTieuBieu: {
    ten: string
    moTa?: string
  }[]
  diemNhan: string
}

const danhSachBonTang: TangKienTruc[] = [
  {
    id: "tang-1",
    soThuTu: "01",
    soLaMa: "TẦNG I",
    tenTang: "Khám phá & Phản tư",
    tenTiengAnh: "Explore & Reflect",
    loiMo:
      "Đôi khi, điều chúng ta cần không phải là một câu trả lời có sẵn, mà là một khoảng lặng để nhìn vấn đề từ góc độ khác.",
    noiDung:
      "Tại The Hermit, Tarot được sử dụng như công cụ gợi mở câu hỏi và phản tư, kết hợp với không gian trà đạo và chiêm nghiệm. Mỗi trải nghiệm khuyến khích bạn nhận diện điều mình đang quan tâm, lắng nghe cảm xúc và tự tìm ra góc nhìn phù hợp.",
    traiNghiemTieuBieu: [
      {
        ten: "Tarot Mini",
        moTa: "Gợi mở câu hỏi và phản tư ban đầu qua góc nhìn biểu tượng.",
      },
      {
        ten: "Tarot Discovery",
        moTa: "Khám phá bối cảnh hiện tại và nhận diện các góc nhìn mới.",
      },
      {
        ten: "Tarot Guidance",
        moTa: "Định vị thấu suốt cảm xúc và lắng nghe tiếng nói nội tâm.",
      },
      {
        ten: "Không gian trà đạo",
        moTa: "Khoảng lặng tĩnh tại để nhấp chén trà và chiêm nghiệm cuộc sống.",
      },
    ],
    diemNhan: "Gợi mở nhận thức · Khoảng lặng phản tư · Lắng nghe cảm xúc",
  },
  {
    id: "tang-2",
    soThuTu: "02",
    soLaMa: "TẦNG II",
    tenTang: "Nhận diện & Phản tư chuyên sâu",
    tenTiengAnh: "Self-Awareness & Deep Reflection",
    loiMo:
      "Có những cảm xúc, niềm tin và cách phản ứng xuất hiện nhiều lần trong cuộc sống, nhưng không phải lúc nào chúng ta cũng nhận ra chúng bắt đầu từ đâu hoặc ảnh hưởng đến lựa chọn của mình như thế nào.",
    noiDung:
      "Thông qua các phiên phản tư chuyên sâu, Inner Architect™ đồng hành cùng bạn khám phá cảm xúc, giá trị bản thân và những khuôn mẫu suy nghĩ, hành vi trong các mối quan hệ hay tình huống đời thường. Những câu hỏi mở giúp bạn tự nhìn lại trải nghiệm, nhận diện điều quan trọng và cân nhắc hướng thay đổi phù hợp.",
    traiNghiemTieuBieu: [
      {
        ten: "Inner Insight",
        moTa: "Khám phá cảm xúc và nhận diện hệ giá trị cốt lõi của bản thân.",
      },
      {
        ten: "Inner Journey",
        moTa: "Nhận diện các khuôn mẫu tiềm ẩn và định hướng thay đổi tích cực.",
      },
    ],
    diemNhan: "Thấu hiểu khuôn mẫu · Nhận diện cảm xúc gốc · Cân nhắc thay đổi",
  },
  {
    id: "tang-3",
    soThuTu: "03",
    soLaMa: "TẦNG III",
    tenTang: "Định hướng & Phát triển",
    tenTiengAnh: "Direction & Personal Growth",
    loiMo:
      "Hiểu mình là điểm khởi đầu. Điều tạo nên khác biệt là cách chúng ta đưa những nhận thức ấy vào cuộc sống hằng ngày.",
    noiDung:
      "Inner Architect™ tạo điều kiện để bạn làm rõ giá trị, xác định mục tiêu và xây dựng các bước hành động khả thi. Bên cạnh phiên định hướng cá nhân, những workshop, lớp học và hoạt động cộng đồng mở ra cơ hội tiếp cận kiến thức, trao đổi góc nhìn và thực hành kỹ năng phát triển bản thân.",
    traiNghiemTieuBieu: [
      {
        ten: "Inner Architect™ Session",
        moTa: "Phản tư chuyên sâu và xây dựng kế hoạch hành động khả thi.",
      },
      {
        ten: "Workshop theo chủ đề",
        moTa: "Tiếp cận kiến thức chuyên sâu và mở rộng đa chiều góc nhìn.",
      },
      {
        ten: "Đào tạo Tarot phản tư",
        moTa: "Thực hành kỹ năng đọc ngôn ngữ biểu tượng để tự soi chiếu.",
      },
      {
        ten: "Hoạt động cộng đồng",
        moTa: "Không gian kết nối, trao đổi trải nghiệm và cùng nhau phát triển.",
      },
    ],
    diemNhan: "Làm rõ giá trị · Xây dựng mục tiêu · Kế hoạch hành động khả thi",
  },
  {
    id: "tang-4",
    soThuTu: "04",
    soLaMa: "TẦNG IV",
    tenTang: "Chăm sóc thân thể & Cân bằng",
    tenTiengAnh: "Body Awareness & Balance",
    loiMo:
      "Giữa những thay đổi và bộn bề, cơ thể cũng cần được lắng nghe. Một nhịp sống cân bằng bắt đầu từ việc nhận biết khi nào mình cần nghỉ ngơi, thư giãn và chăm sóc bản thân.",
    noiDung:
      "Thông qua trà đạo, thực hành chú tâm, thiền thư giãn nhẹ và những gợi ý chăm sóc bản thân, Inner Architect™ khuyến khích bạn dành thời gian kết nối với cơ thể, quan sát nhu cầu và nuôi dưỡng thói quen sống phù hợp.",
    traiNghiemTieuBieu: [
      {
        ten: "Trà đạo tĩnh tại",
        moTa: "Lắng đọng tâm thức, kết nối hơi thở và các giác quan tự nhiên.",
      },
      {
        ten: "Thư giãn & Thả lỏng",
        moTa: "Nhận biết điểm căng thẳng trên cơ thể và thực hành thư giãn nhẹ.",
      },
      {
        ten: "Thực hành chú tâm",
        moTa: "Quan sát nhu cầu bên trong mà không phán xét trong từng khoảnh khắc.",
      },
      {
        ten: "Chăm sóc bản thân",
        moTa: "Gợi ý lối sống lành mạnh, nuôi dưỡng nhịp sinh học cân bằng.",
      },
    ],
    diemNhan: "Lắng nghe thân thể · Thư giãn hệ thần kinh · Nuôi dưỡng nhịp sống",
  },
]

/**
 * Trang Hệ thống bốn tầng (`/he-thong`)
 * Thiết kế kiến trúc nội tâm ấn tượng không dùng hình ảnh.
 * Hoàn toàn dựa trên tài liệu word: Inner_Architect_Noi_Dung_Website_4_Tang.docx
 */
export function HeThongPage() {
  const [tangHienTaiIndex, setTangHienTaiIndex] = useState<number>(0)
  const [cheDoXem, setCheDoXem] = useState<"tuong-tac" | "toan-canh">("tuong-tac")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const tangHienTai = danhSachBonTang[tangHienTaiIndex]

  const quayVeTrangTruoc = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      go("/")
    }
  }

  return (
    <main className="cream-page he-thong-page min-h-screen pb-24 text-[#27190F]">
      {/* 1. HEADER CHÍNH XUẤT SẮC */}
      <header className="max-w-[1360px] mx-auto px-6 pt-10 sm:pt-14 pb-10 border-b border-[#3B3636]/10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-4xl">
            {/* Nhãn nhận diện */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B75E2A]" />
              <p className="text-xs font-semibold tracking-[0.25em] text-[#B75E2A] uppercase m-0">
                INNER ARCHITECT™ · HỆ THỐNG TÍCH HỢP BỐN TẦNG
              </p>
            </div>

            {/* Tiêu đề chính lớn */}
            <h1 className="serif text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.15] text-[#27190F] m-0 font-bold tracking-tight">
              Hành trình Khám phá &amp; Kiến tạo Nội tâm
            </h1>

            {/* Subtitle / Trụ cột */}
            <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm font-semibold tracking-widest text-[#B75E2A] uppercase">
              <span>Explore</span>
              <span className="text-[#3B3636]/30">·</span>
              <span>Reflect</span>
              <span className="text-[#3B3636]/30">·</span>
              <span>Transform</span>
            </div>

            {/* Dẫn nhập 2 đoạn từ tài liệu word */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#3B3636]/10 text-sm sm:text-[15px] leading-relaxed text-[#3B3636]/85">
              <p className="m-0">
                Mỗi người đều mang trong mình những trải nghiệm, cảm xúc, niềm tin và khuôn mẫu được hình thành qua năm tháng. Có những điều giúp chúng ta trưởng thành, nhưng cũng có những điều khiến chúng ta lặp lại cách suy nghĩ, phản ứng hoặc kết nối mà chính mình chưa thật sự hiểu rõ.
              </p>
              <p className="m-0">
                <strong className="text-[#27190F] font-semibold">Inner Architect™</strong> được hình thành như một không gian để mỗi người có cơ hội nhìn lại chính mình, khám phá điều đang diễn ra bên trong và từng bước xây dựng cuộc sống phù hợp hơn với giá trị bản thân. Hành trình ấy được mở ra qua bốn tầng trải nghiệm, có thể lựa chọn độc lập hoặc kết hợp tùy nhu cầu.
              </p>
            </div>
          </div>

          {/* Nút X Thoát quay về trang trước */}
          <button
            type="button"
            onClick={quayVeTrangTruoc}
            className="self-start inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#3B3636]/20 bg-white hover:bg-[#27190F] text-[#27190F] text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-sm group hover:scale-[1.02]"
            title="Thoát và quay về trang đang xem"
            aria-label="Thoát và quay về trang đang xem"
          >
            <span className="group-hover:text-[#FEFBF0] transition-colors">Thoát</span>
            <span className="text-base leading-none group-hover:rotate-90 group-hover:text-[#FEFBF0] transition-transform duration-300">✕</span>
          </button>
        </div>

        {/* Thanh chuyển chế độ xem: Tương tác từng tầng vs Xem toàn cảnh */}
        <div className="mt-10 pt-6 border-t border-[#3B3636]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#3B3636]/70">
            <span className="font-semibold uppercase tracking-wider text-[#B75E2A]">Chế độ xem:</span>
            <span>Chọn cách bạn muốn tìm hiểu cấu trúc 4 tầng</span>
          </div>

          {/* Pill Switcher với độ tương phản tuyệt đối không bị chìm/che chữ */}
          <div className="inline-flex p-1 rounded-full bg-[#3B3636]/5 border border-[#3B3636]/15">
            <button
              type="button"
              onClick={() => setCheDoXem("tuong-tac")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: cheDoXem === "tuong-tac" ? "#27190F" : "transparent",
                color: cheDoXem === "tuong-tac" ? "#FEFBF0" : "#3B3636",
                boxShadow: cheDoXem === "tuong-tac" ? "0 2px 6px rgba(39, 25, 15, 0.25)" : "none",
              }}
            >
              ✦ Tương tác từng tầng
            </button>
            <button
              type="button"
              onClick={() => setCheDoXem("toan-canh")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: cheDoXem === "toan-canh" ? "#27190F" : "transparent",
                color: cheDoXem === "toan-canh" ? "#FEFBF0" : "#3B3636",
                boxShadow: cheDoXem === "toan-canh" ? "0 2px 6px rgba(39, 25, 15, 0.25)" : "none",
              }}
            >
              ☰ Toàn cảnh 4 tầng
            </button>
          </div>
        </div>
      </header>

      {/* 2. CHẾ ĐỘ 1: TƯƠNG TÁC TỪNG TẦNG (INTERACTIVE EXPLORER) */}
      {cheDoXem === "tuong-tac" && (
        <section className="max-w-[1360px] mx-auto px-6 pt-10">
          {/* Thanh chọn 4 Tầng Kiến Trúc (Architecture Tabs) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {danhSachBonTang.map((tang, index) => {
              const dangChon = tangHienTaiIndex === index
              return (
                <button
                  key={tang.id}
                  type="button"
                  onClick={() => setTangHienTaiIndex(index)}
                  className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative group ${
                    dangChon
                      ? "bg-[#FFF9ED] border-[#B75E2A] shadow-lg ring-1 ring-[#B75E2A]/30 scale-[1.01]"
                      : "bg-white/80 hover:bg-[#FAF7F2] border-[#3B3636]/12 opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Dải màu đánh dấu phía trên khi chọn */}
                  {dangChon && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#B75E2A] rounded-t-2xl" />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-xs font-bold tracking-widest ${
                        dangChon ? "text-[#B75E2A]" : "text-[#3B3636]/50"
                      }`}
                    >
                      {tang.soLaMa}
                    </span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors"
                      style={{
                        backgroundColor: dangChon ? "#B75E2A" : "rgba(0, 0, 0, 0.05)",
                        color: dangChon ? "#ffffff" : "rgba(59, 54, 54, 0.7)",
                      }}
                    >
                      TẦNG {tang.soThuTu}
                    </span>
                  </div>

                  <h2
                    className={`serif text-base sm:text-lg font-bold m-0 transition-colors leading-normal ${
                      dangChon ? "text-[#27190F]" : "text-[#3B3636]"
                    }`}
                  >
                    {tang.tenTang}
                  </h2>
                  <p
                    className={`text-xs mt-1 m-0 tracking-wide transition-colors ${
                      dangChon ? "text-[#B75E2A] font-medium" : "text-[#3B3636]/60"
                    }`}
                  >
                    {tang.tenTiengAnh}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Sân khấu kiến trúc hiển thị tầng đang chọn (Architectural Stage Card) */}
          <article className="rounded-3xl border border-[#3B3636]/15 bg-white shadow-xl overflow-hidden transition-all duration-300">
            {/* Header của thẻ tầng */}
            <div className="bg-[#FAF7F2] px-6 sm:px-10 py-8 border-b border-[#3B3636]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-xs font-bold tracking-widest text-[#B75E2A] uppercase">
                    {tangHienTai.soLaMa}
                  </span>
                  <span className="text-xs text-[#3B3636]/30">|</span>
                  <span className="text-xs font-semibold tracking-wider text-[#3B3636]/70 uppercase">
                    {tangHienTai.tenTiengAnh}
                  </span>
                </div>
                <h3 className="serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#27190F] m-0">
                  Tầng {tangHienTai.soThuTu} — {tangHienTai.tenTang}
                </h3>
              </div>

              {/* Tag điểm nhấn */}
              <div className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#FFF9ED] border border-[#B75E2A]/25 text-xs text-[#B75E2A] font-semibold tracking-wide">
                ✦ {tangHienTai.diemNhan}
              </div>
            </div>

            {/* Nội dung chi tiết tầng */}
            <div className="p-6 sm:p-10 lg:p-12 space-y-10">
              {/* Lời mở triết lý trích dẫn nổi bật - sạch sẽ, không có ký tự đè chữ */}
              <div className="pl-6 sm:pl-8 border-l-4 border-[#B75E2A] py-3 bg-[#FFF9ED]/60 rounded-r-2xl pr-6">
                <p className="serif italic text-lg sm:text-xl lg:text-2xl text-[#27190F] leading-relaxed m-0 font-medium">
                  “{tangHienTai.loiMo}”
                </p>
              </div>

              {/* Nội dung vận hành chuyên sâu */}
              <div className="space-y-4 max-w-4xl">
                <h4 className="text-xs uppercase tracking-widest font-bold text-[#B75E2A] m-0">
                  PHẠM VI &amp; NỘI DUNG VẬN HÀNH
                </h4>
                <p className="text-base sm:text-lg leading-relaxed text-[#3B3636]/90 m-0">
                  {tangHienTai.noiDung}
                </p>
              </div>

              {/* Khối trải nghiệm tiêu biểu */}
              <div className="pt-6 border-t border-[#3B3636]/10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#B75E2A]" />
                  <h4 className="text-xs uppercase tracking-widest font-bold text-[#27190F] m-0">
                    TRẢI NGHIỆM TIÊU BIỂU TẠI TẦNG {tangHienTai.soThuTu}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tangHienTai.traiNghiemTieuBieu.map((item, idx) => (
                    <div
                      key={item.ten}
                      className="p-5 rounded-2xl border border-[#3B3636]/10 bg-[#FAF7F2]/70 hover:bg-[#FFF9ED] hover:border-[#B75E2A]/40 transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[11px] font-mono text-[#B75E2A] font-bold mb-2">
                          0{idx + 1}
                        </div>
                        <h5 className="serif text-base sm:text-lg font-bold text-[#27190F] m-0 mb-2">
                          {item.ten}
                        </h5>
                        {item.moTa && (
                          <p className="text-xs sm:text-sm text-[#3B3636]/80 leading-relaxed m-0">
                            {item.moTa}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thanh điều hướng giữa các tầng */}
              <div className="pt-6 border-t border-[#3B3636]/10 flex items-center justify-between">
                <button
                  type="button"
                  disabled={tangHienTaiIndex === 0}
                  onClick={() => setTangHienTaiIndex((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border border-[#3B3636]/15 bg-white hover:bg-[#27190F] text-[#27190F] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm group"
                >
                  <span className="group-hover:text-[#FEFBF0] transition-colors">← Tầng trước</span>
                </button>

                <div className="text-xs font-mono font-bold text-[#B75E2A]">
                  {tangHienTaiIndex + 1} / {danhSachBonTang.length}
                </div>

                <button
                  type="button"
                  disabled={tangHienTaiIndex === danhSachBonTang.length - 1}
                  onClick={() =>
                    setTangHienTaiIndex((prev) =>
                      Math.min(danhSachBonTang.length - 1, prev + 1),
                    )
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border border-[#3B3636]/15 bg-white hover:bg-[#27190F] text-[#27190F] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm group"
                >
                  <span className="group-hover:text-[#FEFBF0] transition-colors">Tầng tiếp theo →</span>
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* 3. CHẾ ĐỘ 2: TOÀN CẢNH 4 TẦNG (PANORAMIC ARCHITECTURAL BLUEPRINT) */}
      {cheDoXem === "toan-canh" && (
        <section className="max-w-[1360px] mx-auto px-6 pt-10 space-y-12">
          {danhSachBonTang.map((tang) => (
            <article
              key={tang.id}
              className="rounded-3xl border border-[#3B3636]/15 bg-white shadow-lg overflow-hidden transition-all"
            >
              <div className="bg-[#FAF7F2] px-6 sm:px-10 py-6 border-b border-[#3B3636]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#B75E2A]">
                    {tang.soThuTu}
                  </span>
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-[#3B3636]/60 uppercase block">
                      {tang.tenTiengAnh}
                    </span>
                    <h3 className="serif text-xl sm:text-2xl font-bold text-[#27190F] m-0">
                      TẦNG {tang.soThuTu} — {tang.tenTang}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#FFF9ED] border border-[#B75E2A]/25 text-xs text-[#B75E2A] font-semibold self-start sm:self-auto">
                  {tang.soLaMa}
                </span>
              </div>

              <div className="p-6 sm:p-10 space-y-8">
                {/* Trích dẫn triết lý */}
                <div className="pl-5 sm:pl-6 border-l-4 border-[#B75E2A] py-1 bg-[#FFF9ED]/50 rounded-r-xl pr-4">
                  <p className="serif italic text-base sm:text-lg text-[#27190F] leading-relaxed m-0 font-medium">
                    “{tang.loiMo}”
                  </p>
                </div>

                {/* Nội dung vận hành */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-[#B75E2A] m-0 mb-2">
                    NỘI DUNG VẬN HÀNH
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed text-[#3B3636]/90 m-0">
                    {tang.noiDung}
                  </p>
                </div>

                {/* Trải nghiệm tiêu biểu */}
                <div className="pt-4 border-t border-[#3B3636]/10">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-[#27190F] m-0 mb-4">
                    TRẢI NGHIỆM TIÊU BIỂU
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {tang.traiNghiemTieuBieu.map((item, idx) => (
                      <div
                        key={item.ten}
                        className="p-4 rounded-xl border border-[#3B3636]/10 bg-[#FAF7F2]"
                      >
                        <div className="text-[11px] font-mono text-[#B75E2A] font-bold mb-1">
                          0{idx + 1}
                        </div>
                        <h5 className="serif text-base font-bold text-[#27190F] m-0 mb-1">
                          {item.ten}
                        </h5>
                        {item.moTa && (
                          <p className="text-xs text-[#3B3636]/75 m-0 leading-relaxed">
                            {item.moTa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* 4. HAI KHỐI NỀN TẢNG: NHỊP ĐỘ RIÊNG & NGUYÊN TẮC ĐỒNG HÀNH */}
      <section className="max-w-[1360px] mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Khối 1: Mỗi hành trình đều có nhịp độ riêng */}
          <div className="rounded-3xl border border-[#B75E2A]/25 bg-[#FFF9ED] p-8 sm:p-10 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 right-5 text-4xl select-none opacity-20 text-[#B75E2A]">
              ✦
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#B75E2A]" />
                <p className="text-xs font-semibold tracking-wider text-[#B75E2A] uppercase m-0">
                  TRIẾT LÝ VẬN HÀNH
                </p>
              </div>

              <h3 className="serif text-2xl sm:text-3xl font-bold text-[#27190F] m-0 mb-4">
                Mỗi hành trình đều có nhịp độ riêng
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#3B3636]/85 m-0">
                Bốn tầng không phải là các bước bắt buộc hay một liệu trình điều trị. Bạn có thể bắt đầu từ một buổi Tarot, tham dự workshop, trải nghiệm trà đạo hoặc lựa chọn phiên phản tư phù hợp với nhu cầu hiện tại. Inner Architect™ không quyết định thay bạn; chúng tôi trân trọng khả năng tự lựa chọn và phát triển của mỗi người.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-[#B75E2A]/20 text-xs font-medium text-[#B75E2A] italic">
              👉 Tôn trọng sự tự chủ và sẵn sàng của mỗi cá nhân
            </div>
          </div>

          {/* Khối 2: Nguyên tắc đồng hành */}
          <div className="rounded-3xl border border-[#3B3636]/15 bg-white p-8 sm:p-10 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 right-5 text-4xl select-none opacity-10 text-[#27190F]">
              🛡
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#27190F]" />
                <p className="text-xs font-semibold tracking-wider text-[#3B3636]/70 uppercase m-0">
                  RANH GIỚI &amp; AN TOÀN
                </p>
              </div>

              <h3 className="serif text-2xl sm:text-3xl font-bold text-[#27190F] m-0 mb-4">
                Nguyên tắc đồng hành
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#3B3636]/85 m-0">
                Các hoạt động của Inner Architect™ tập trung vào khám phá bản thân, phản tư, giáo dục tâm lý và phát triển cá nhân; không thay thế việc đánh giá, chẩn đoán hoặc điều trị y khoa và tâm lý lâm sàng. Khi nhu cầu vượt ngoài phạm vi hoạt động, chúng tôi khuyến khích tìm đến chuyên gia hoặc cơ sở chuyên môn phù hợp.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-[#3B3636]/10 text-xs font-medium text-[#3B3636]/70 italic">
              👉 An toàn luôn được đặt trước chiều sâu
            </div>
          </div>
        </div>
      </section>

      {/* 5. KHỐI KẾT BÀI ẤN TƯỢNG (ARCHITECTURAL EPILOGUE) - Đảm bảo độ tương phản tuyệt đối */}
      <section className="max-w-[1360px] mx-auto px-6 pt-16">
        <div
          className="rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-2xl relative overflow-hidden glowence-dark-card"
          style={{ backgroundColor: "#27190F", color: "#FEFBF0" }}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase m-0"
              style={{ color: "#D97736" }}
            >
              INNER ARCHITECT™
            </p>

            <h2
              className="serif text-2xl sm:text-3xl lg:text-4xl m-0 font-bold leading-tight"
              style={{ color: "#FEFBF0" }}
            >
              Khám phá bản thân · Chiêm nghiệm nội tâm · Chuyển hóa nhận thức
            </h2>

            <p
              className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto m-0"
              style={{ color: "rgba(254, 251, 240, 0.88)" }}
            >
              Mỗi tầng trải nghiệm là một nhịp bước vững chãi giúp bạn nhìn thấu trật tự bên trong và kiến tạo đời sống bình an, vững vàng.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/lien-he"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:scale-[1.02]"
                style={{ backgroundColor: "#B75E2A", color: "#ffffff" }}
              >
                <span>Liên hệ tư vấn về hệ thống bốn tầng</span>
                <span>→</span>
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border transition-all hover:bg-white/10"
                style={{ borderColor: "rgba(255, 255, 255, 0.25)", color: "#ffffff" }}
              >
                <span>Về trang chủ</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ĐIỀU HƯỚNG CUỐI TRANG */}
      <nav
        aria-label="Điều hướng trang"
        className="max-w-[1360px] mx-auto px-6 pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#3B3636]/15 mt-16 text-[#27190F]"
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm text-[#3B3636]/75 hover:text-[#27190F] transition-colors font-medium"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          <span>Về trang chủ</span>
        </Link>
        <Link
          to="/lien-he"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B75E2A] hover:text-[#27190F] transition-colors"
        >
          <span>Liên hệ tư vấn về hệ thống bốn tầng</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </nav>
    </main>
  )
}
