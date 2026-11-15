// Nội dung 28 bài Journal đã chuyển vào MySQL (server/database/seed/journal-ban-dau.json,
// nhập bằng `pnpm journal:import`) và được quản lý trong /jathong/journal.

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
