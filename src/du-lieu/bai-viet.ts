import { IMG } from "./hinh-anh"

export type NewsItem = {
  category: string
  date: string
  title: string
  italic: string
  summary: string
  image: string
  slug: string
}

export const news: NewsItem[] = [
  {
    category: "TAROT",
    date: "2025.05.18",
    title: "Tarot không phải lời tiên đoán",
    italic: "Đọc bài như một hình thức soi chiếu",
    summary:
      "Một cách tiếp cận Tarot dựa trên nhận thức, trách nhiệm và quyền tự lựa chọn.",
    image: IMG.journalReading,
    slug: "tarot-khong-phai-loi-tien-doan",
  },
  {
    category: "HIỂU MÌNH",
    date: "2025.05.20",
    title: "Bạn thật sự là ai khi không còn phải làm hài lòng người khác?",
    italic: "Nhận diện bản sắc vượt ngoài sự kỳ vọng",
    summary:
      "Quan sát cảm xúc, niềm tin cốt lõi và nhận diện các khuôn mẫu hành vi quen thuộc để tìm lại sự tự do bên trong.",
    image: IMG.journalSelfDiscovery,
    slug: "ban-that-su-la-ai-khi-khong-con-phai-lam-hai-long-nguoi-khac",
  },
  {
    category: "MỐI QUAN HỆ",
    date: "2025.05.15",
    title: "Vì sao chúng ta cứ yêu những người khiến mình đau khổ?",
    italic: "Các kiểu gắn bó và vòng lặp cảm xúc quen thuộc",
    summary:
      "Khám phá các cơ chế gắn bó tâm lý, ranh giới an toàn và cách tháo gỡ vòng lặp tổn thương trong tình cảm.",
    image: IMG.journalRelationships,
    slug: "vi-sao-chung-ta-cu-yeu-nhung-nguoi-khien-minh-dau-kho",
  },
  {
    category: "MINH TRIẾT",
    date: "2025.05.10",
    title: "Đọc Lão Tử, hiểu chính mình: Vì sao càng cố kiểm soát, ta càng bất an?",
    italic: "Đối thoại giữa tư tưởng Đạo gia và tâm lý học hiện đại",
    summary:
      "Ứng dụng triết lý Đạo Đức Kinh vào việc giải tỏa áp lực, điều hòa tâm trí và sống hài hòa trong đời sống hiện đại.",
    image: IMG.journalWisdom,
    slug: "doc-lao-tu-hieu-chinh-minh-vi-sao-cang-co-kiem-soat-ta-cang-bat-an",
  },
  {
    category: "TAROT",
    date: "2025.05.05",
    title: "The Hermit – Khi ánh sáng không còn đến từ bên ngoài",
    italic: "Nguyên mẫu ngọn đèn soi bóng trong đêm tối",
    summary:
      "Ý nghĩa biểu tượng học Tarot và nguyên mẫu tâm lý học Carl Jung: hành trình rút lui tạm thời để tự soi rọi nội tâm.",
    image: IMG.journalTarotHermit,
    slug: "the-hermit-khi-anh-sang-khong-con-den-tu-ben-ngoai",
  },
  {
    category: "SỐNG TỈNH THỨC",
    date: "2025.04.28",
    title: "Học cách hiện diện thay vì luôn chạy theo tương lai",
    italic: "Thực hành chánh niệm và tự điều hòa thần kinh",
    summary:
      "Chánh niệm ứng dụng, thiền tập, journaling và phương pháp xây dựng thói quen tự điều hòa thần kinh trong thực tế.",
    image: IMG.journalMindful,
    slug: "hoc-cach-hien-dien-thay-vi-luon-chay-theo-tuong-lai",
  },
  {
    category: "THE HERMIT",
    date: "2025.04.22",
    title: "Một tách trà, một khoảng lặng, một cuộc gặp gỡ với chính mình",
    italic: "Không gian tĩnh lặng và văn hóa trà đạo tại The Hermit",
    summary:
      "Câu chuyện thương hiệu, văn hóa trà đạo tĩnh tâm, không gian chữa lành và những khoảnh khắc chậm lại giữa phố thị.",
    image: IMG.journalHermitStories,
    slug: "mot-tach-tra-mot-khoang-lang-mot-cuoc-gap-go-voi-chinh-minh",
  },
  {
    category: "HIỂU MÌNH",
    date: "2025.05.02",
    title: "Khi một mô thức cứ lặp lại",
    italic: "Điều gì đang vận hành bên dưới?",
    summary:
      "Cách quan sát mối liên hệ giữa biểu tượng Tarot, phản ứng cảm xúc và những lựa chọn quen thuộc.",
    image: IMG.journalBox,
    slug: "khi-mot-mo-thuc-cu-lap-lai",
  },
  {
    category: "THE HERMIT",
    date: "2025.04.20",
    title: "Chạm ngõ Tarot",
    italic: "Chuẩn bị cho phiên tiếp cận đầu tiên",
    summary:
      "Những điều nên biết trước một phiên soi chiếu nhẹ tại The Hermit.",
    image: IMG.journalFlatlay,
    slug: "cham-ngo-tarot",
  },
  {
    category: "TAROT",
    date: "2025.04.04",
    title: "Ranh giới trong một phiên Tarot",
    italic: "Khi nào người đọc cần dừng lại?",
    summary:
      "Tarot không thay thế điều trị chuyên môn và không nên được dùng để quyết định thay một người.",
    image: IMG.journalBoundary,
    slug: "ranh-gioi-trong-phien-tarot",
  },
]

/**
 * Cấu trúc dữ liệu cho 3 Chuyên đề dài hạn (Signature Series) của trang Journal.
 */
export interface ChuoiBaiSignatureSeries {
  id: string
  title: string
  subtitle: string
  description: string
  tag: string
  count: string
}

export const signatureSeriesList: ChuoiBaiSignatureSeries[] = [
  {
    id: "01",
    title: "Đạo & Tâm",
    subtitle: "Triết học Đạo gia & Tâm lý học hiện đại",
    description:
      "Chiêm nghiệm và ứng dụng triết lý Đạo Đức Kinh vào việc giải tỏa áp lực, điều hòa tâm trí và sống hài hòa trong nhịp sống hối hả.",
    tag: "Wisdom & Philosophy",
    count: "Chuyên đề 01",
  },
  {
    id: "02",
    title: "Giải mã mối quan hệ độc hại",
    subtitle: "Gắn bó tâm lý, Thao túng & Ranh giới an toàn",
    description:
      "Phân tích cơ chế tâm lý học về các kiểu gắn bó, nhận diện bẫy thao túng cảm xúc, thiết lập ranh giới lành mạnh và học cách yêu thương tự chủ.",
    tag: "Relationships & Healing",
    count: "Chuyên đề 02",
  },
  {
    id: "03",
    title: "78 lá bài – 78 góc nhìn nội tâm",
    subtitle: "Nguyên mẫu Carl Jung & Đối thoại biểu tượng",
    description:
      "Giải mã Tarot dưới góc nhìn tâm lý học nguyên mẫu Jung (Archetypes) — mỗi lá bài là một câu hỏi mở để người thực hành tự soi rọi chính mình.",
    tag: "Tarot & Symbolism",
    count: "Chuyên đề 03",
  },
]
