/**
 * Nội dung trang Founder (`/vo-khiem`).
 *
 * Nguồn: `Vo_Khiem_Profile_Thuong_Hieu_Ca_Nhan_2026.docx` (10 mục). Văn bản được
 * giữ nguyên câu chữ của portfolio; chỉ tách đoạn để phù hợp đọc trên web.
 *
 * Quy ước đã duyệt: eyebrow section bằng tiếng Anh; nội dung, tiêu đề, CTA bằng
 * tiếng Việt; tên thương hiệu luôn viết `INNER ARCHITECT™` / `INNER ARCHITECT™ System`.
 * Portfolio không dùng đại từ nhân xưng cho Khiêm Võ — giữ nguyên cách gọi bằng tên.
 */

/** Ảnh của trang. `src: null` nghĩa là chưa có ảnh thật → hiển thị placeholder. */
export type AnhFounder = {
  src: string | null
  alt: string
  /** Tỉ lệ khung hình CSS, ví dụ `"3 / 4"`. */
  tiLe: string
  /** Mô tả mục đích ảnh, hiển thị trên placeholder để người thay ảnh biết cần gì. */
  mucDich: string
}

/**
 * Hệ thống ảnh tập trung. Thay ảnh bằng cách điền `src` (đường dẫn trong `public/`).
 * Ảnh chân dung bắt buộc là ảnh thật của Khiêm Võ — không dùng ảnh người khác.
 * Ảnh dự án đang dùng lại ảnh có sẵn trên site; quyền sử dụng vẫn chờ xác nhận (D04).
 */
export const anhFounder = {
  chanDungHero: {
    src: "/assets/founder/01-chan-dung-nha-sang-lap-khiem-vo.webp",
    alt: "Chân dung Khiêm Võ, người sáng lập INNER ARCHITECT™",
    tiLe: "1 / 1",
    mucDich: "Chân dung chính thức · 1080 × 1080px",
  },
  hanhTrinh: {
    src: "/assets/founder/02-ban-lam-viec-va-khong-gian-sang-lap.webp",
    alt: "Khiêm Võ trong không gian làm việc hằng ngày",
    tiLe: "3 / 4",
    mucDich: "Ảnh đời thường hoặc khi làm việc · 1086 × 1448px",
  },
  heThong: {
    src: "/assets/founder/04-he-thong-inner-architect-system.jpg",
    alt: "Không gian thực hành và hệ thống INNER ARCHITECT™",
    tiLe: "1 / 1",
    mucDich: "Hoạt động INNER ARCHITECT™ · 500 × 500px",
  },
  theHermit: {
    src: "/assets/the-hermit/05-logo-bieu-trung-the-hermit.webp",
    alt: "Logo biểu trưng The Hermit",
    tiLe: "1 / 1",
    mucDich: "Biểu trưng The Hermit · 2000 × 2000px",
  },
  giangDay: {
    src: "/assets/journal/01-bai-1-tarot-khong-phai-tien-doan-reading-horizontal.webp",
    alt: "Phiên làm việc và đào tạo Tarot phản tư",
    tiLe: "4 / 3",
    mucDich: "Lớp Tarot / workshop · 2048 × 1536px",
  },
  sangTao: {
    src: "/assets/founder/05-tac-gia-va-sang-tao-khiem-vo.jpg",
    alt: "Khiêm Võ trong hoạt động sáng tác, sách và bộ bài Tarot",
    tiLe: "3 / 4",
    mucDich: "Sách, bộ bài và sản phẩm sáng tạo · 960 × 1280px",
  },
  ketThuc: {
    src: "/assets/founder/07-khong-gian-chiem-nghiem-cuoi-trang.jpg",
    alt: "Không gian chiêm nghiệm và tĩnh lặng",
    tiLe: "16 / 9",
    mucDich: "Ảnh ngang kết trang · 1200 × 672px",
  },
} satisfies Record<string, AnhFounder>

/**
 * Số liệu học viên / workshop / lượt tham gia lấy từ portfolio nhưng chưa có tài
 * liệu đối chiếu. Giữ `false` cho đến khi chủ thương hiệu xác nhận; khi `false`,
 * trang không hiển thị các con số này.
 */
export const soLieuDaXacNhan = false

export const soLieuFounder = [
  {
    giaTri: "100+",
    nhan: "học viên đã tham gia các chương trình đào tạo Tarot",
  },
  { giaTri: "3", nhan: "workshop đã được tổ chức" },
  { giaTri: "200+", nhan: "lượt người tham gia workshop" },
]

export const heroFounder = {
  eyebrow: "THE FOUNDER",
  ten: "Khiêm Võ",
  phuDe: "Founder – INNER ARCHITECT™ System",
  vaiTro: "Tarot Educator · Tác giả & Nhà sáng tạo · Phát triển bản thân",
  tagline: "Khám phá bản thân · Thấu hiểu nội tâm · Phát triển chính mình",
}

export const gioiThieuFounder = {
  eyebrow: "INTRODUCTION",
  tieuDe: "Khiêm Võ là ai?",
  dan: "Tarot phản tư, chia sẻ kiến thức và phát triển bản thân.",
  doan: [
    "Khiêm Võ là người sáng lập INNER ARCHITECT™ System, hoạt động trong lĩnh vực Tarot phản tư, chia sẻ kiến thức và phát triển bản thân.",
    "Với nền tảng đào tạo đại học trong ba lĩnh vực Công nghệ Thông tin, Tài chính – Ngân hàng và Tâm lý học, Khiêm Võ hướng đến cách tiếp cận đa chiều: kết hợp tư duy hệ thống, kinh nghiệm sống và kiến thức về nhận thức, cảm xúc, hành vi.",
  ],
  /** Đoạn chứa số liệu chưa xác nhận — chỉ hiển thị khi `soLieuDaXacNhan`. */
  doanSoLieu:
    "Bên cạnh việc phát triển The Hermit, Khiêm Võ đã đào tạo hơn 100 học viên Tarot, tổ chức 3 workshop thu hút tổng cộng hơn 200 lượt người tham gia, đồng thời triển khai các lớp học trực tuyến về tâm lý học phổ thông, khám phá nội tâm và chủ đề chữa lành theo hướng phát triển cá nhân.",
}

export const hanhTrinhFounder = {
  eyebrow: "THE JOURNEY",
  tieuDe: "Hành trình từ trải nghiệm đến thấu hiểu",
  doan: [
    "Trước khi lựa chọn hướng đi hiện tại, Khiêm Võ từng làm việc trong nhiều lĩnh vực và trải qua những thay đổi lớn về sự nghiệp, tài chính và các mối quan hệ.",
    "Những giai đoạn khó khăn đã thôi thúc một hành trình tự nhìn lại: điều gì ảnh hưởng đến lựa chọn của con người, vì sao một số cách phản ứng lặp đi lặp lại và làm thế nào để sống chủ động hơn?",
    "Từ việc tìm hiểu Tarot, các truyền thống chiêm nghiệm và triết học phương Đông, Khiêm Võ tiếp tục học Tâm lý học nhằm bổ sung góc nhìn khoa học về con người.",
    "Hành trình ấy hình thành mong muốn chia sẻ công cụ và kiến thức giúp người khác có thêm cơ hội tự tìm hiểu chính mình, thay vì phụ thuộc vào một người hướng dẫn hay một lời tiên đoán.",
  ],
}

export const hocVanFounder = {
  eyebrow: "EDUCATION",
  tieuDe: "Ba nền tảng, một góc nhìn đa chiều",
  muc: [
    {
      so: "01",
      linhVuc: "Công nghệ Thông tin",
      bang: "Kỹ sư Công nghệ Thông tin",
      truong: "Đại học Công nghệ TP.HCM (HUTECH)",
      moc: "2004",
    },
    {
      so: "02",
      linhVuc: "Tài chính – Ngân hàng",
      bang: "Cử nhân Tài chính – Ngân hàng",
      truong: "Đại học Mở Hà Nội",
      moc: "2015",
    },
    {
      so: "03",
      linhVuc: "Tâm lý học",
      bang: "Đã hoàn thành chương trình đào tạo Cử nhân Tâm lý học",
      truong: "Đại học Công nghệ TP.HCM (HUTECH)",
      moc: "2027",
    },
  ],
  ketNoi:
    "Ba lĩnh vực học tập góp phần hình thành góc nhìn vừa logic, vừa phân tích, đồng thời quan tâm đến trải nghiệm và sự khác biệt của mỗi cá nhân. Đây là nền tảng tư duy mà Khiêm Võ tiếp tục vận dụng khi phát triển các hoạt động chia sẻ và sáng tạo.",
}

export const trietLyFounder = {
  eyebrow: "PHILOSOPHY",
  tieuDe: "Triết lý & góc nhìn",
  trichDan:
    "Thấu hiểu chính mình là một điểm khởi đầu để lựa chọn cách sống phù hợp hơn.",
  giaTri: [
    {
      ten: "Self-Awareness",
      tenViet: "Tự nhận thức",
      moTa: "Quan sát giá trị, nhu cầu, cảm xúc cùng những khuôn mẫu suy nghĩ và hành vi trong cuộc sống.",
    },
    {
      ten: "Critical Thinking",
      tenViet: "Tư duy phản biện",
      moTa: "Đặt câu hỏi, kiểm tra thông tin và phân biệt trải nghiệm chủ quan, niềm tin cá nhân với kết luận có bằng chứng kiểm chứng.",
    },
    {
      ten: "Personal Autonomy",
      tenViet: "Quyền tự quyết",
      moTa: "Tôn trọng lựa chọn cá nhân; người tham gia tự tìm hiểu chính mình thay vì phụ thuộc vào một người hướng dẫn hay một lời tiên đoán.",
    },
  ],
  doanTrietLy:
    "Khiêm Võ đề cao sự tự nhận thức, tư duy phản biện và quyền tự quyết. Tarot được tiếp cận như một phương tiện gợi mở câu hỏi và phản tư, không phải công cụ bảo đảm dự đoán tương lai. Kiến thức tâm lý học được sử dụng trong hoạt động chia sẻ và giáo dục phổ thông, không đồng nhất với chẩn đoán hoặc điều trị tâm lý lâm sàng.",
  tieuDeTamLinh: "Góc nhìn tâm linh và khoa học",
  doanTamLinh: [
    "Một định hướng xuyên suốt trong các chương trình chia sẻ là tạo điều kiện để người tham gia đối chiếu những trải nghiệm tâm linh, quan điểm triết học và kiến thức khoa học mà không đánh đồng chúng. Khiêm Võ mong muốn người học có thể tiếp cận các câu hỏi về cuộc sống với sự cởi mở, đồng thời biết phân biệt trải nghiệm chủ quan, niềm tin cá nhân và kết luận có bằng chứng kiểm chứng.",
    "Thay vì khuyến khích sự lệ thuộc hoặc tin tưởng tuyệt đối vào huyền học, các hoạt động hướng đến việc phát triển khả năng suy xét độc lập, hiểu giới hạn của từng cách lý giải và tránh bị dẫn dắt bởi thông tin thiếu căn cứ hoặc mê tín dị đoan.",
  ],
}

export type DuAnFounder = {
  ky: string
  tieuDe: string
  doan: string[]
  diem?: string[]
  ghiChu?: string
  anh: AnhFounder
  lienKet?: {
    to: string
    nhan: string
  }
  /** Bố cục: dự án "lon" chiếm khung ảnh lớn hơn để tạo nhịp editorial. */
  coLon?: boolean
}

export const duAnFounder: {
  eyebrow: string
  tieuDe: string
  muc: DuAnFounder[]
} = {
  eyebrow: "SELECTED WORKS",
  tieuDe: "Những điều được xây dựng từ hành trình ấy",
  muc: [
    {
      ky: "A",
      tieuDe: "INNER ARCHITECT™ System",
      doan: [
        "INNER ARCHITECT™ System là định hướng do Khiêm Võ xây dựng, lấy cảm hứng từ hình ảnh mỗi người là “kiến trúc sư” của cuộc sống bên trong mình. Các hoạt động được phát triển theo bốn hướng:",
      ],
      diem: [
        "Khám phá bản thân: Nhận diện những giá trị, nhu cầu và cảm xúc cá nhân.",
        "Phát triển tự nhận thức: Quan sát những khuôn mẫu suy nghĩ, cảm xúc và hành vi trong cuộc sống.",
        "Phản tư trải nghiệm: Nhìn lại các tình huống và mối quan hệ từ nhiều góc nhìn khác nhau.",
        "Phát triển cá nhân: Xác định mục tiêu và xây dựng những bước hành động phù hợp với bản thân.",
      ],
      ghiChu:
        "Hệ thống hướng đến các hoạt động trải nghiệm, phản tư, học tập và phát triển cá nhân; không được giới thiệu như phương pháp khám bệnh, chẩn đoán hay điều trị rối loạn tâm thần.",
      anh: anhFounder.heThong,
      lienKet: { to: "/he-thong", nhan: "Khám phá hệ thống" },
      coLon: true,
    },
    {
      ky: "B",
      tieuDe: "The Hermit",
      doan: [
        "The Hermit là không gian trải nghiệm do Khiêm Võ phát triển, kết hợp thưởng trà, Tarot và những hoạt động khám phá bản thân. Lấy cảm hứng từ hình tượng The Hermit trong Tarot, không gian hướng đến sự tĩnh tại, riêng tư và cơ hội dành thời gian cho chính mình.",
        "Tại đây, khách hàng có thể thưởng trà, trải nghiệm Tarot phản tư, tìm hiểu sách, bộ bài và sản phẩm sáng tạo.",
      ],
      ghiChu:
        "Các hoạt động được định hướng là trải nghiệm và phát triển cá nhân, không thay thế dịch vụ chăm sóc sức khỏe tâm thần chuyên nghiệp.",
      anh: anhFounder.theHermit,
      lienKet: { to: "/the-hermit", nhan: "Ghé The Hermit" },
    },
    {
      ky: "C",
      tieuDe: "Đào tạo Tarot & chương trình chia sẻ",
      doan: [
        "Khiêm Võ có kinh nghiệm tổ chức và giảng dạy các lớp Tarot cơ bản, Tarot nâng cao và các nội dung thực hành được giới thiệu dưới tên Healer, với trọng tâm là kiến thức, trải nghiệm cá nhân và trách nhiệm khi sử dụng công cụ chiêm nghiệm.",
        "Các lớp học qua Zoom chia sẻ kiến thức tâm lý học phổ thông, cảm xúc, mối quan hệ và những chủ đề chữa lành theo hướng tự khám phá, không phải chương trình đào tạo chuyên môn y tế.",
        "Trong giảng dạy, Khiêm Võ khuyến khích học viên tìm hiểu bản chất của biểu tượng, đặt câu hỏi, kiểm tra thông tin và tôn trọng lựa chọn cá nhân.",
      ],
      ghiChu:
        "Các lớp học không cấp quyền hành nghề khám, chữa bệnh hoặc trị liệu tâm lý.",
      anh: anhFounder.giangDay,
      lienKet: { to: "/chuong-trinh", nhan: "Xem chương trình" },
    },
    {
      ky: "D",
      tieuDe: "Tác giả & nhà sáng tạo",
      doan: [
        "Khiêm Võ viết nội dung và sách về Tarot, thiết kế các bộ bài Tarot mang dấu ấn riêng, đồng thời phát triển sản phẩm nến thơm. Những hoạt động này kết nối tri thức, biểu tượng, thiết kế và trải nghiệm thường ngày, tạo thêm lựa chọn cho người quan tâm đến Tarot và những khoảng thời gian chiêm nghiệm.",
      ],
      ghiChu:
        "Các ấn phẩm và sản phẩm được giới thiệu theo tình trạng phát hành thực tế; không gắn với tuyên bố về công dụng chữa bệnh hoặc hiệu quả tâm lý được bảo đảm.",
      anh: anhFounder.sangTao,
      lienKet: { to: "/lara", nhan: "Khám phá LARA" },
      coLon: true,
    },
  ],
}

export const tamNhinFounder = {
  eyebrow: "THE VISION",
  tieuDe: "Giữ quyền quyết định cuộc sống của chính mình",
  trichDan:
    "Tôi không mong mọi người tin vào một bộ bài hay một lời giải thích duy nhất. Tôi mong mỗi người có thêm kiến thức, biết đặt câu hỏi và giữ quyền quyết định cuộc sống của chính mình.",
  doan: "Khiêm Võ mong muốn tiếp tục phát triển INNER ARCHITECT™ thành một hệ sinh thái kết nối nội dung giáo dục, trải nghiệm phản tư, hoạt động cộng đồng và sản phẩm sáng tạo; qua đó góp phần khuyến khích tự nhận thức, tư duy phản biện và lựa chọn có trách nhiệm.",
  truCot: [
    "Nội dung giáo dục",
    "Trải nghiệm phản tư",
    "Hoạt động cộng đồng",
    "Sản phẩm sáng tạo",
  ],
}

export const ketTrangFounder = {
  eyebrow: "INNER ARCHITECT™",
  tieuDe: "Mỗi hành trình đều có một điểm bắt đầu.",
  moTa: "Khám phá hệ sinh thái trải nghiệm, học tập và phát triển bản thân tại INNER ARCHITECT™.",
  ctaChinh: { to: "/he-thong", nhan: "Khám phá INNER ARCHITECT™" },
  ctaPhu: { to: "/lien-he", nhan: "Liên hệ với chúng tôi" },
}
