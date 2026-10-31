import { IMG } from "./hinh-anh"

/**
 * Cấu trúc dữ liệu chi tiết cho từng trang con của hệ sinh thái Chương trình.
 */
export interface ChiTietChuongTrinh {
  slug: string
  nhom: string
  tang: string
  tieuDe: string
  phuDe: string
  doanDan: string
  hinhAnh: string
  thoiLuong: string
  hinhThuc: string
  quyMo: string
  chiPhi: string
  mucTieu: string[]
  hoatDong: string[]
  ranhGioi: string
  chamNgon?: string
  nutHanhDong: string
}

export const danhSachChiTietChuongTrinh: Record<string, ChiTietChuongTrinh> = {
  "cham-ngo-tarot": {
    slug: "cham-ngo-tarot",
    nhom: "A. TRẢI NGHIỆM",
    tang: "TẦNG 1 – ENTRY / CONTACT",
    tieuDe: "Chạm ngõ Tarot",
    phuDe: "Cafe The Hermit Tarot · Phiên soi chiếu nhận thức 1:1",
    doanDan:
      "Phiên Tarot soi chiếu nhẹ trong không gian yên tĩnh của The Hermit. Không tiên đoán, chỉ tập trung vào nhận thức và nhận diện trạng thái hiện tại của bạn.",
    hinhAnh: IMG.journalReading,
    thoiLuong: "60 – 90 phút",
    hinhThuc: "Offline tại The Hermit hoặc Online 1:1",
    quyMo: "Cá nhân 1:1 hoặc nhóm nhỏ",
    chiPhi: "Tùy duyên trao gởi",
    mucTieu: [
      "Giúp thân chủ nhận diện đúng trạng thái hiện tại của mình",
      "Không kích hoạt hoặc khuấy động cảm xúc dồn nén",
      "Xác định rõ bản thân chỉ đang cần một trải nghiệm soi chiếu nhẹ hay thực sự cần bước vào tiến trình sâu hơn",
    ],
    hoatDong: [
      "Phiên Tarot soi chiếu nhận thức bên bàn trà yên tĩnh (không bói toán / tiên đoán)",
      "Trao đổi ngắn, tập trung gọi tên điều đang diễn ra, không can thiệp giải quyết vấn đề",
      "Quan sát mức tải cảm xúc, trạng thái hệ thần kinh và kỳ vọng cá nhân",
    ],
    ranhGioi:
      "Không xử lý sang chấn, không định hướng cuộc đời hay đưa lời khuyên sống, không tạo cao trào cảm xúc hay hứa hẹn thay đổi.",
    chamNgon: "Tầng 1 tồn tại để chỉ ra, không phải để giải quyết.",
    nutHanhDong: "Liên hệ đặt phiên Tarot",
  },
  "nhan-dien-mo-thuc": {
    slug: "nhan-dien-mo-thuc",
    nhom: "A. TRẢI NGHIỆM",
    tang: "TẦNG 2 – TRẢI NGHIỆM NHÓM NHẬN THỨC",
    tieuDe: "Workshop Nhận diện mô thức",
    phuDe: "Mô thức lặp trong tình yêu & cuộc sống",
    doanDan:
      "Không gian trải nghiệm theo nhóm nhỏ, nơi bạn có thể quan sát các mô thức cảm xúc và hành vi đang lặp lại trong cuộc sống, trong một khung an toàn và được nâng đỡ.",
    hinhAnh: IMG.homeCuratedWorkshop,
    thoiLuong: "2 – 2.5 tiếng (20:00 – 22:00)",
    hinhThuc: "Offline hoặc Online nhóm nhỏ",
    quyMo: "Nhóm nhỏ 8 – 12 người · Định kỳ hàng tháng",
    chiPhi: "Tùy duyên trao gởi / Xác nhận theo đợt",
    mucTieu: [
      "Quan sát các mô thức cảm xúc và hành vi đang lặp lại trong các mối quan hệ và công việc",
      "Nhận diện cơ chế tự vệ vô thức: Vì sao ta luôn phản ứng theo một cách dù biết sẽ mang lại tổn thương?",
      "Xây dựng khoảng dừng nhận thức trước khi phản ứng tự động kích hoạt",
    ],
    hoatDong: [
      "Vẽ sơ đồ nhận diện vòng lặp kích hoạt – cảm xúc – hành vi",
      "Đối thoại phản tư dưới sự nâng đỡ an toàn của người điều phối",
      "Thực hành bài tập khoảng dừng nhận thức và quan sát cảm giác thân thể",
    ],
    ranhGioi:
      "Không biến workshop nhóm thành phiên bộc lộ sang chấn cá nhân sâu; bảo mật tuyệt đối chia sẻ của các thành viên trong vòng tròn.",
    chamNgon:
      "Nhận ra một mô thức không buộc bạn phải thay đổi ngay. Nó cho bạn một khoảng dừng để chọn cách khác.",
    nutHanhDong: "Hỏi / đăng ký workshop",
  },
  "cham-ve-de-diu-lai": {
    slug: "cham-ve-de-diu-lai",
    nhom: "A. TRẢI NGHIỆM",
    tang: "TẦNG 4 – ĐIỀU TIẾT THÂN & NĂNG LƯỢNG",
    tieuDe: "Chạm — Vẽ để dịu lại",
    phuDe: "Hạ nhịp hệ thần kinh qua màu sắc & cảm nhận thân",
    doanDan:
      "Dành cho những ai đang căng thẳng, tê mỏi, và cần một cách xả nhẹ qua cơ thể — không qua phân tích lý trí hay đào xới cảm xúc.",
    hinhAnh: IMG.workshopArt,
    thoiLuong: "2 – 2.5 tiếng (14:00 – 16:30)",
    hinhThuc: "Offline tại The Hermit",
    quyMo: "Nhóm nhỏ giới hạn chỗ",
    chiPhi: "499.000 VNĐ / người",
    mucTieu: [
      "Hạ nhịp hệ thần kinh, đưa cơ thể về trạng thái an toàn sinh học",
      "Nhận diện nơi đang giữ căng thẳng trong thân thể",
      "Giải tỏa cảm xúc dồn nén qua chuyển động bàn tay và màu sắc",
      "Cảm giác nhẹ hơn, mềm lại sau khi xả",
    ],
    hoatDong: [
      "Dẫn thở & chạm thân để neo tâm trí về hiện tại",
      "Vẽ trực giác — không kỹ thuật, không có đúng/sai",
      "Không nói nhiều, không phân tích, không phán định",
      "Tập trung hoàn toàn vào trải nghiệm thân thể & xúc giác",
    ],
    ranhGioi:
      "Đây không phải liệu pháp nghệ thuật (art therapy) lâm sàng hoặc hình thức điều trị tâm thần.",
    chamNgon:
      "Tầng 4 tồn tại để giữ thân an toàn, không phải để đẩy quá trình đi nhanh hơn.",
    nutHanhDong: "Hỏi / đăng ký workshop",
  },
  "trai-nghiem-nhom-nho": {
    slug: "trai-nghiem-nhom-nho",
    nhom: "A. TRẢI NGHIỆM",
    tang: "TẦNG 1 & TẦNG 4 – KHÔNG GIAN KẾT NỐI AN TOÀN",
    tieuDe: "Trải nghiệm nhóm nhỏ",
    phuDe: "Vòng tròn tĩnh lặng & Trà thất The Hermit",
    doanDan:
      "Không gian thực hành hiện diện có ranh giới dành cho nhóm nhỏ, nơi mỗi người được nghỉ ngơi, lắng nghe mà không chịu áp lực phải chia sẻ hay làm vừa lòng người khác.",
    hinhAnh: IMG.hermitTeaRoom,
    thoiLuong: "2 tiếng",
    hinhThuc: "Offline tại không gian trà The Hermit",
    quyMo: "Giới hạn 4 – 6 người",
    chiPhi: "Xác nhận theo từng đợt tổ chức",
    mucTieu: [
      "Phục hồi cảm giác an toàn khi ở cạnh người khác mà không cần đeo mặt nạ xã hội",
      "Trải nghiệm trà đạo tỉnh thức và làm dịu các giác quan",
      "Chia sẻ có điều phối ranh giới, tôn trọng tuyệt đối quyền giữ im lặng",
    ],
    hoatDong: [
      "Thưởng thức trà mộc trong không gian ánh sáng ấm",
      "Lắng nghe âm thanh chuông xoay và nhịp thở tự nhiên",
      "Viết nhật ký chiêm nghiệm (journaling) theo câu hỏi gợi mở",
    ],
    ranhGioi:
      "Không tạo cao trào cảm xúc tập thể; không khuyến khích phơi bày đời tư khi chưa có sự chuẩn bị an toàn.",
    chamNgon:
      "Một tách trà, một khoảng lặng, một cuộc gặp gỡ bình yên với chính mình.",
    nutHanhDong: "Hỏi về trải nghiệm nhóm",
  },
  "phien-tiep-can-ban-dau": {
    slug: "phien-tiep-can-ban-dau",
    nhom: "B. ĐỒNG HÀNH CÁ NHÂN",
    tang: "TẦNG 1 – ENTRY / SÀNG LỌC & NHẬN DIỆN",
    tieuDe: "Phiên tiếp cận ban đầu",
    phuDe: "1:1 Initial Session · Nhìn rõ mình đang ở đâu",
    doanDan:
      "Điểm khởi đầu bắt buộc trước mọi can thiệp sâu. Phiên làm việc giúp làm rõ điều bạn đang mang theo, nhu cầu thực tế và xem hệ thống có phải là nơi hỗ trợ phù hợp với bạn hay không.",
    hinhAnh: IMG.homeGeneratedSessionSetup,
    thoiLuong: "60 – 90 phút",
    hinhThuc: "Trực tiếp tại phòng The Hermit hoặc Online bảo mật",
    quyMo: "Phiên riêng tư 1:1",
    chiPhi: "Xác nhận trước phiên làm việc",
    mucTieu: [
      "Tạo một ảnh chụp rõ ràng về bối cảnh, cảm xúc và điều đang khiến bạn bế tắc",
      "Đánh giá mức độ sẵn sàng tự chịu trách nhiệm và khả năng nhận thức thực tại",
      "Xác định điểm dừng hoặc lộ trình phù hợp: Tiếp tục Tầng 2 hay chuyển hướng hỗ trợ khác",
    ],
    hoatDong: [
      "Lắng nghe sâu có định hướng mà không phán xét",
      "Sử dụng công cụ biểu tượng Tarot phản tư để làm sáng tỏ các điểm mù nhận thức",
      "Thống nhất ranh giới, mục tiêu và cam kết nếu bước vào tiến trình tiếp theo",
    ],
    ranhGioi:
      "Không chẩn đoán y khoa, không hứa hẹn kết quả thần tốc, không buộc bạn phải cam kết hành trình dài sau cuộc gặp.",
    chamNgon:
      "Nếu bạn không cần đi tiếp hoặc hệ thống không phù hợp, chúng tôi sẽ nói rõ.",
    nutHanhDong: "Liên hệ về phiên tiếp cận",
  },
  "phien-tai-cau-truc-chuyen-sau": {
    slug: "phien-tai-cau-truc-chuyen-sau",
    nhom: "B. ĐỒNG HÀNH CÁ NHÂN",
    tang: "TẦNG 2 – HEALING & RESTRUCTURING",
    tieuDe: "Phiên tái cấu trúc chuyên sâu",
    phuDe: "1:1 Deep Restructuring · Tháo gỡ mô thức gốc",
    doanDan:
      "Tiến trình làm việc chuyên sâu 1:1, tập trung tháo gỡ một mô thức cốt lõi, diễn ra trong khung thời gian và cấu trúc rõ ràng, đủ sâu để chuyển hóa nhưng không kéo dài quá mức cần thiết.",
    hinhAnh: IMG.homeGeneratedSessionProcess,
    thoiLuong: "60 – 90 phút / phiên · Tiến trình có điểm kết rõ ràng",
    hinhThuc: "Làm việc 1:1 chuyên biệt",
    quyMo: "Cá nhân 1:1",
    chiPhi: "Theo thỏa thuận tiến trình làm việc",
    mucTieu: [
      "Nhận diện mô thức gốc thay vì chỉ xử lý triệu chứng bề mặt",
      "Hoàn tất các phản ứng cảm xúc tồn đọng trong ngưỡng an toàn thần kinh",
      "Tái cấu trúc niềm tin giới hạn và phục hồi khả năng tự điều chỉnh cảm xúc",
    ],
    hoatDong: [
      "Làm việc có cấu trúc, giới hạn thời gian và có điểm kết dứt khoát",
      "Tập trung tháo gỡ một mô thức cốt lõi tại một thời điểm",
      "Kết hợp nhận thức, tín hiệu thân thể và bài tập thực hành áp dụng vào đời sống thực tế sau mỗi phiên",
    ],
    ranhGioi:
      "Không định hướng cuộc đời thay bạn, không tạo sự lệ thuộc vào Healer, không kéo dài liệu trình vô thời hạn.",
    chamNgon: "Không tìm cao trào cảm xúc — Xây nền cho thay đổi bền vững.",
    nutHanhDong: "Liên hệ chuyên gia",
  },
  "dong-hanh-chuyen-pha": {
    slug: "dong-hanh-chuyen-pha",
    nhom: "B. ĐỒNG HÀNH CÁ NHÂN",
    tang: "TẦNG 2 & TẦNG 3 – CƠ CHẾ HỖ TRỢ CHUYỂN TIẾP",
    tieuDe: "Đồng hành trong giai đoạn chuyển pha",
    phuDe: "Transition Mentorship · Vượt qua điểm gãy đời sống",
    doanDan:
      "Cơ chế đồng hành đặc biệt dành cho những cá nhân đang đứng trước các biến cố lớn (đổ vỡ, mất phương hướng sự nghiệp, khủng hoảng căn tính) thật sự muốn bước vào hành trình chuyển hóa.",
    hinhAnh: IMG.homeCuratedReflective,
    thoiLuong: "Theo lộ trình giai đoạn chuyển pha",
    hinhThuc: "Đồng hành riêng tư có giám sát",
    quyMo: "Xét duyệt hồ sơ cá nhân có chọn lọc",
    chiPhi: "Cơ chế hoàn trả giá trị tự nguyện khi đủ năng lực",
    mucTieu: [
      "Giúp cá nhân giữ vững trục sống và hệ thần kinh trong giai đoạn biến động mạnh",
      "Tháo gỡ bế tắc và chuyển hóa khủng hoảng thành cơ hội tái cấu trúc nội tâm",
      "Khôi phục năng lực tự chủ để bước tiếp trên đôi chân của chính mình",
    ],
    hoatDong: [
      "Các buổi đối thoại định kỳ theo dõi tiến trình thích ứng",
      "Hỗ trợ tái thiết lập trật tự sinh hoạt, cảm xúc và ranh giới cá nhân",
      "Theo dõi bài tập tích hợp thân – tâm – trí trong thực tế",
    ],
    ranhGioi:
      "Đây không phải là hỗ trợ tài chính đại trà, mà là sự đồng hành dựa trên cam kết nội tâm và trách nhiệm cá nhân.",
    chamNgon: "Chữa lành không phải nơi để ở lại, mà là nền tảng để tự bước tiếp.",
    nutHanhDong: "Liên hệ chuyên gia",
  },
  "tarot-can-ban": {
    slug: "tarot-can-ban",
    nhom: "C. ACADEMY",
    tang: "TẦNG 3 – FOUNDATION PROGRAMME",
    tieuDe: "Tarot Căn Bản",
    phuDe: "Nhập môn Tarot dưới góc nhìn nhận thức & biểu tượng",
    doanDan:
      "Học cách đọc hình ảnh, đặt câu hỏi phản tư và giữ ranh giới đạo đức trước khi học cách diễn giải bài Tarot.",
    hinhAnh: IMG.journalReading,
    thoiLuong: "5 buổi học chuyên sâu (20:00 – 22:00)",
    hinhThuc: "Online tương tác trực tiếp qua Zoom",
    quyMo: "Lớp học tiêu chuẩn có trợ giảng đồng hành",
    chiPhi: "3.000.000 VNĐ / khóa",
    mucTieu: [
      "Nắm vững hệ thống cấu trúc 78 lá bài Tarot và ngôn ngữ biểu tượng",
      "Xây dựng tư duy Tarot dựa trên nhận thức, trách nhiệm và quyền tự chủ",
      "Biết cách thiết lập ranh giới an toàn và quy trình mở một phiên đọc chuẩn mực",
    ],
    hoatDong: [
      "Phần 01: Ngôn ngữ biểu tượng, màu sắc và nguyên mẫu tâm lý học",
      "Phần 02: Cấu trúc không gian và ranh giới một phiên đọc an toàn",
      "Phần 03: Nghệ thuật đặt câu hỏi phản tư soi rọi hiện tại",
      "Phần 04: Đạo đức hành nghề và các dấu hiệu cần dừng phiên",
      "Phần 05: Thực hành đọc bài thực tế có người hướng dẫn giám sát",
    ],
    ranhGioi:
      "Chương trình không cấp năng lực chẩn đoán hay điều trị y khoa. Học viên thực hành trong phạm vi giáo dục và phát triển bản thân.",
    chamNgon: "Đọc bài như một hình thức soi chiếu, không phải lời tiên đoán.",
    nutHanhDong: "Nhận tư vấn khóa học",
  },
  "tarot-nang-cao": {
    slug: "tarot-nang-cao",
    nhom: "C. ACADEMY",
    tang: "TẦNG 3 – ADVANCED PRACTITIONER",
    tieuDe: "Tarot Nâng Cao",
    phuDe: "Liên kết biểu tượng & Thao trường nhận thức chuyên sâu",
    doanDan:
      "Đào sâu vào các trải bài phức tạp, kỹ năng đọc liên kết đa tầng và ứng dụng Tarot trong việc hỗ trợ người khác tháo gỡ bế tắc.",
    hinhAnh: IMG.journalSpread,
    thoiLuong: "6 buổi chuyên sâu (20:00 – 22:00)",
    hinhThuc: "Online chuyên đề có case study thực tế",
    quyMo: "Học viên đã hoàn tất khóa Căn bản hoặc có nền tảng tương đương",
    chiPhi: "5.000.000 VNĐ / khóa",
    mucTieu: [
      "Làm chủ kỹ thuật đọc liên kết nguyên tố và chuỗi nguyên mẫu (Archetypal Sequence)",
      "Khai phá Shadow Work (Bóng tối tâm lý) qua biểu tượng lá bài",
      "Phát triển trực giác có kiểm chứng và năng lực giữ trục trung tính khi đối thoại",
    ],
    hoatDong: [
      "Phân tích các trải bài giải mã mối quan hệ và vòng lặp mô thức",
      "Thực hành nhận diện cơ chế chiếu rọi (projection) và chuyển di (transference)",
      "Giải mã ca lâm sàng mô phỏng và hiệu chỉnh cách phản hồi",
    ],
    ranhGioi:
      "Không dùng kỹ thuật nâng cao để thao túng tâm lý hay hù dọa thân chủ; nghiêm cấm bói toán số phận.",
    chamNgon: "Càng đi sâu vào biểu tượng, càng phải tỉnh táo với thực tại.",
    nutHanhDong: "Nhận tư vấn khóa học",
  },
  "tarot-healer": {
    slug: "tarot-healer",
    nhom: "C. ACADEMY",
    tang: "TẦNG 3 – HEALER CERTIFICATION",
    tieuDe: "Tarot Healer",
    phuDe: "Chương trình đào tạo Healer hệ thống INNER ARCHITECT™",
    doanDan:
      "Chương trình đào tạo chuyên sâu kéo dài 6 tháng dành cho những người muốn trở thành người đồng hành (Healer) trong hệ thống INNER ARCHITECT™.",
    hinhAnh: IMG.homeFemaleAdvisor,
    thoiLuong: "Lộ trình 6 tháng tích hợp",
    hinhThuc: "Lý thuyết, thực hành lâm sàng có giám sát và tu tập nội tâm",
    quyMo: "Tuyển chọn khắt khe qua phỏng vấn đầu vào",
    chiPhi: "Thông báo chi tiết sau vòng phỏng vấn",
    mucTieu: [
      "Chuẩn hóa phương pháp luận tích hợp Thân – Tâm – Trí của INNER ARCHITECT™",
      "Rèn luyện năng lực hiện diện vững vàng, không bị cuốn vào năng lượng thân chủ",
      "Gìn giữ chuẩn mực đạo đức, tính trung thực và kỷ luật của hệ thống",
    ],
    hoatDong: [
      "Học thuyết về hệ thần kinh, sang chấn và cơ chế bảo vệ tâm lý",
      "Thực tập có giám sát trực tiếp từ Founder Võ Khiêm",
      "Đánh giá năng lực tự quản trị bản thân trước khi tiếp nhận thân chủ thực tế",
    ],
    ranhGioi:
      "Healer không được đánh giá bằng khả năng tạo xúc động nhất thời, mà bằng năng lực giúp thân chủ tự đứng vững mà không cần phụ thuộc vào Healer.",
    chamNgon:
      "Tầm nhìn của hệ thống là đào tạo Healer để người khác không còn cần chữa lành nữa.",
    nutHanhDong: "Nhận tư vấn chương trình Healer",
  },
  "tam-ly-chuyen-de": {
    slug: "tam-ly-chuyen-de",
    nhom: "C. ACADEMY",
    tang: "TẦNG 3 – PSYCHOLOGY TOPICS",
    tieuDe: "Khóa tâm lý chuyên đề",
    phuDe: "Ứng dụng tâm lý học hiện đại vào đời sống & ranh giới",
    doanDan:
      "Các khóa học chuyên đề ngắn hạn giải quyết trực diện các vấn đề then chốt: Ngôn ngữ vô thức, Ranh giới cá nhân, Giải mã cảm xúc và Mối quan hệ lành mạnh.",
    hinhAnh: IMG.journalWisdom,
    thoiLuong: "2 – 3 buổi / chuyên đề (20:00 – 22:00)",
    hinhThuc: "Online chuyên đề chuyên sâu",
    quyMo: "Mở rộng cho cộng đồng",
    chiPhi: "Thông báo theo từng chuyên đề",
    mucTieu: [
      "Cung cấp kiến thức tâm lý học ứng dụng dễ hiểu, có cấu trúc",
      "Trang bị công cụ thực hành tự điều chỉnh trong các tình huống xung đột đời sống",
      "Tháo gỡ các bẫy thao túng tâm lý và học cách giao tiếp trắc ẩn",
    ],
    hoatDong: [
      "Chuyên đề 01: Ngôn ngữ của vô thức & Biểu tượng",
      "Chuyên đề 02: Thiết lập ranh giới mềm nhưng trục vững",
      "Chuyên đề 03: Giải mã các kiểu gắn bó trong tình yêu",
      "Chuyên đề 04: Kỹ thuật tự điều hòa hệ thần kinh khi căng thẳng",
    ],
    ranhGioi:
      "Các chuyên đề mang tính giáo dục tâm lý nâng cao nhận thức, không thay thế trị liệu tâm lý cá nhân.",
    chamNgon: "Hiểu cơ chế để ngừng làm tổn thương chính mình.",
    nutHanhDong: "Nhận tư vấn chuyên đề",
  },
}
