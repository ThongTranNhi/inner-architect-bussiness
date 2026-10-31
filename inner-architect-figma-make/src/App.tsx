import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { contactChannels, hasContactChannel } from "./config/contact"
import { cuonDenPhanTu, Link } from "./dieu-huong"
import { FounderPage } from "./founder/FounderPage"
import { JournalPage } from "./journal/JournalPage"

const IMG = {
  homeCuratedHero:
    "/assets/homepage-curated/01-hero-ban-tarot-nen-am.jpg",
  homeCuratedWorkshop:
    "/assets/homepage-curated/01-workshop-cham-ve-de-diu-lai.png",
  homeFemaleAdvisor:
    "/assets/homepage-curated/02-loi-vao-phien-chuyen-sau-1-1.jpg",
  homeGeneratedSessionSetup:
    "/assets/homepage-curated/09-khong-gian-chuan-bi-phien.png",
  homeGeneratedSessionEntry:
    "/assets/homepage-curated/10-nu-tu-van-don-khach.png",
  homeGeneratedSessionProcess:
    "/assets/homepage-curated/11-phien-1-1-the-hermit.png",
  homeCuratedReflective:
    "/assets/homepage-curated/04-the-lo-trinh-thuc-hanh-phan-tu.png",
  homeCuratedHermit:
    "/assets/homepage-curated/05-the-lo-trinh-the-hermit-room.png",
  homeCuratedBoundary:
    "/assets/homepage-curated/06-ranh-gioi-workshop-vong-tron-nhom.jpg",
  homeCuratedClosing:
    "/assets/homepage-curated/07-khong-gian-chiem-nghiem-cuoi-trang.jpg",
  workshopArt: "/assets/workshop/ws-cham-ve-diu-lai-CMQz-7CG.png",
  journalReading: "/assets/journal/journal-tarot-reading-horizontal.webp",
  journalBox: "/assets/journal/goc/hinh07.jpg",
  journalFlatlay: "/assets/journal/journal-tarot-flatlay-vertical.webp",
  journalSpread: "/assets/journal/journal-tarot-spread-vertical.webp",
  journalBoundary: "/assets/journal/goc/hinh08.jpg",
  journalSelfDiscovery: "/assets/journal/goc/hinh01.jpg",
  journalRelationships: "/assets/journal/goc/hinh02.jpg",
  journalWisdom: "/assets/journal/goc/hinh03.jpg",
  journalTarotHermit: "/assets/journal/goc/hinh04.jpg",
  journalMindful: "/assets/journal/goc/hinh05.jpg",
  journalHermitStories: "/assets/journal/goc/hinh06.jpg",
  hermitStorefront: "/assets/the-hermit/storefront-placeholder.webp",
  hermitHall: "/assets/the-hermit/main-hall-placeholder.webp",
  hermitTeaRoom: "/assets/the-hermit/tea-room-placeholder.png",
  hermitTarotRoom: "/assets/the-hermit/tarot-room-placeholder.webp",
  soulCleanse: "/assets/lara/lara-soul-cleanse.webp",
  sacredGround: "/assets/lara/lara-sacred-ground.webp",
  soulEmbrace: "/assets/lara/lara-soul-embrace.webp",
  tarot2: "/assets/journal/journal-tarot-box-portrait.webp",
  lara: "/assets/lara/lara-autumn-collage-source.jpeg",
}

type NewsItem = {
  category: string
  date: string
  title: string
  italic: string
  summary: string
  image: string
  slug: string
}
const news: NewsItem[] = [
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

type ArticleCopy = {
  dek: string
  opening: string
  reflectionTitle: string
  reflection: string
  quote: string
  boundaryTitle: string
  boundary: string
}

const articleCopy: Record<string, ArticleCopy> = {
  "tarot-khong-phai-loi-tien-doan": {
    dek: "Tarot tại INNER ARCHITECT™ là một bề mặt biểu tượng để quan sát điều đang hiện diện, không phải công cụ nói thay tương lai.",
    opening:
      "Một lá bài không mang theo câu trả lời hoàn chỉnh. Nó mở ra một khoảng nhìn - nơi biểu tượng, cảm giác và ký ức có thể gặp nhau mà không cần vội vàng đi đến kết luận.",
    reflectionTitle: "Tarot như một bề mặt phản chiếu.",
    reflection:
      "Thay vì hỏi điều gì sẽ xảy ra, chúng tôi bắt đầu bằng câu hỏi điều gì đang hiện diện. Sự thay đổi nhỏ này trả quyền quan sát về cho người xem.",
    quote:
      "Lá bài không biết nhiều hơn bạn. Nó chỉ giúp điều bạn đã biết trở nên có thể nhìn thấy.",
    boundaryTitle: "Điều một lá bài có thể và không thể làm.",
    boundary:
      "Tarot có thể tạo ngôn ngữ cho một trải nghiệm còn mơ hồ. Nó không thể chẩn đoán, hứa hẹn kết quả hay thay thế quyết định cá nhân.",
  },
  "ban-that-su-la-ai-khi-khong-con-phai-lam-hai-long-nguoi-khac": {
    dek: "Khi thói quen làm hài lòng người khác trở thành bản năng sinh tồn, chúng ta dễ nhầm lẫn giữa sự chấp nhận của xã hội với giá trị thật của chính mình.",
    opening:
      "Từ nhỏ, nhiều người đã vô tình học được rằng: muốn được an toàn và yêu thương thì phải ngoan ngoãn, đáp ứng kỳ vọng và giấu đi những nhu cầu thật. Nhưng cái giá của sự vừa lòng người khác luôn là sự xa lánh chính bản thân.",
    reflectionTitle: "Dừng lại trước phản xạ đồng ý vội vã.",
    reflection:
      "Học cách nhận biết tín hiệu co thắt trong cơ thể khi sắp nói 'có' trong khi thâm tâm muốn nói 'không'. Đó là bước đầu tiên để khôi phục lại ranh giới cá nhân.",
    quote:
      "Bạn không cần phải trở nên hữu ích hay hoàn hảo với tất cả mọi người mới xứng đáng có được sự bình yên.",
    boundaryTitle: "Phân biệt tự chủ với cô lập.",
    boundary:
      "Học cách sống thật với chính mình không đồng nghĩa với việc chống đối cực đoan hay cắt đứt vô cớ. Đây là tiến trình thiết lập ranh giới trong tỉnh thức và tôn trọng lẫn nhau.",
  },
  "vi-sao-chung-ta-cu-yeu-nhung-nguoi-khien-minh-dau-kho": {
    dek: "Chúng ta không chỉ bị thu hút bởi người tốt với mình, mà thường bị kéo về phía những người mang lại cảm giác đau đớn quen thuộc của tuổi thơ.",
    opening:
      "Cơ chế gắn bó lo âu (anxious) và né tránh (avoidant) thường tạo nên một vũ điệu luẩn quẩn: người đuổi theo, kẻ rút lui. Sự mãnh liệt đầy biến động này thường bị nhầm lẫn với tình yêu sâu sắc.",
    reflectionTitle: "Giải mã sự hấp dẫn từ tổn thương chưa lành.",
    reflection:
      "Khi quan sát lại các mối quan hệ lặp đi lặp lại, câu hỏi hữu ích không phải là 'Tại sao người đó tệ với mình?', mà là 'Phần nào trong mình cảm thấy việc bị đối xử như vậy là quen thuộc?'.",
    quote:
      "Sự bình yên ban đầu có thể cảm thấy nhàm chán nếu bạn đã quen sống trong hỗn loạn cảm xúc.",
    boundaryTitle: "Ranh giới an toàn trong gắn bó.",
    boundary:
      "Hiểu kiểu gắn bó là để tự thấu cảm và điều chỉnh hành vi, không phải là tấm vé biện minh cho hành vi thao túng hay cố chấp ở lại trong một mối quan hệ độc hại.",
  },
  "doc-lao-tu-hieu-chinh-minh-vi-sao-cang-co-kiem-soat-ta-cang-bat-an": {
    dek: "Đạo Đức Kinh chỉ ra rằng sự cứng nhắc và nỗ lực kiểm soát quá mức là nguồn gốc sâu xa của nỗi bất an và cạn kiệt năng lượng.",
    opening:
      "Trong xã hội coi trọng năng suất và sự hoàn hảo, việc 'buông' thường bị coi là thất bại. Nhưng Lão Tử nhắc nhở: nước mềm mại nhất lại là thứ xói mòn được đá cứng.",
    reflectionTitle: "Vô vi — Hành động thuận theo tự nhiên.",
    reflection:
      "Vô vi không phải là không làm gì, mà là hành động không gượng ép, nhận biết ranh giới của điều ta có thể và không thể tác động, từ đó giữ được tâm thế tĩnh lặng.",
    quote:
      "Cố uốn cong ngọn gió chỉ làm ta mỏi mệt; biết mở cánh buồm mới đưa thuyền về đúng hướng.",
    boundaryTitle: "Tư tưởng triết học và trách nhiệm thực tế.",
    boundary:
      "Minh triết Đạo gia mang lại góc nhìn giải phóng tâm trí, nhưng không thay thế các giải pháp quản lý thực tế hay sự trợ giúp chuyên môn khi đối diện khủng hoảng cụ thể.",
  },
  "the-hermit-khi-anh-sang-khong-con-den-tu-ben-ngoai": {
    dek: "Lá bài The Hermit mang biểu tượng của sự tĩnh lặng có ý thức: một khoảng lùi cần thiết để người lữ hành lắng nghe tiếng nói nội tâm chân thật nhất.",
    opening:
      "Trong một thế giới đầy ắp tiếng ồn và những lời khuyên từ bên ngoài, việc quay vào bên trong đôi khi bị coi là cô độc. Nhưng The Hermit cầm ngọn đèn không phải để trốn chạy trần thế, mà để soi tỏ bước chân của chính mình.",
    reflectionTitle: "Ánh sáng ngọn đèn chỉ soi sáng một bước đi.",
    reflection:
      "Ngọn đèn của The Hermit không chiếu sáng toàn bộ tương lai. Nó chỉ rọi sáng bước chân hiện tại — nhắc nhở chúng ta rằng chỉ cần đủ can đảm cho bước tiếp theo trong sự tỉnh thức.",
    quote:
      "Sự cô độc có ý thức là nơi nuôi dưỡng trí tuệ; sự trốn chạy chỉ tạo ra nỗi sợ hãi mới.",
    boundaryTitle: "Rút lui có ranh giới và kết nối trở lại.",
    boundary:
      "Khoảng lặng của The Hermit là sự tái tạo năng lượng có mục đích, khác biệt hoàn toàn với hành vi cô lập xã hội do trầm cảm hoặc trốn tránh trách nhiệm đời thường.",
  },
  "hoc-cach-hien-dien-thay-vi-luon-chay-theo-tuong-lai": {
    dek: "Tâm trí thường mắc kẹt trong việc nuối tiếc quá khứ hoặc chuẩn bị cho một tương lai chưa tới, bỏ quên cơ thể đang hiện diện ngay lúc này.",
    opening:
      "Khi hệ thần kinh luôn ở trạng thái báo động, chúng ta sống như thể lúc nào cũng có việc khẩn cấp. Thực hành hiện diện bắt đầu từ việc nhận biết hơi thở và xúc chạm của thân thể với mặt đất.",
    reflectionTitle: "Tự điều hòa thần kinh qua từng giác quan.",
    reflection:
      "Không cần phải thiền định hàng giờ. Chỉ cần 3 phút dừng lại, quan sát 5 điều nhìn thấy, 4 điều chạm vào, 3 điều nghe được để đưa tâm trí trở về mặt đất.",
    quote:
      "Tương lai được xây dựng bằng chất lượng nhận thức của giây phút hiện tại, không phải bằng sự lo lắng miên man.",
    boundaryTitle: "Chánh niệm ứng dụng đời sống.",
    boundary:
      "Thực hành điều hòa thân thể là phương pháp tự chăm sóc sức khỏe tinh thần bổ trợ, không thể thay thế cho can thiệp y khoa hoặc tâm lý trị liệu khi có sang chấn nặng.",
  },
  "mot-tach-tra-mot-khoang-lang-mot-cuoc-gap-go-voi-chinh-minh": {
    dek: "Tại The Hermit, mỗi tách trà và không gian tĩnh tại được thiết kế như một vùng đệm an toàn để bạn gác lại áp lực trước khi bước vào cuộc trò chuyện sâu.",
    opening:
      "Không có sự vội vã. Không gian được bài trí với ánh sáng ấm, chất liệu mộc và hương trà thanh nhẹ giúp làm dịu hệ thần kinh đang căng thẳng của người bước vào.",
    reflectionTitle: "Nghi thức chuyển tiếp giữa ồn ào và tĩnh lặng.",
    reflection:
      "Một ngụm trà nóng không đơn thuần là thức uống; nó là lời mời gọi cơ thể thả lỏng vai, thở chậm lại và cho phép mình được nghỉ ngơi.",
    quote:
      "Giữa cuộc sống hối hả, một khoảng lặng tự nguyện chính là món quà xa xỉ và cần thiết nhất bạn có thể trao tặng chính mình.",
    boundaryTitle: "Không gian trải nghiệm phi y khoa.",
    boundary:
      "Không gian trà và chia sẻ tại The Hermit là môi trường đồng hành chiêm nghiệm và thư giãn tinh thần, không đóng vai trò phòng khám trị liệu tâm lý.",
  },
  "khi-mot-mo-thuc-cu-lap-lai": {
    dek: "Khi một phản ứng xuất hiện nhiều lần, điều cần tìm không phải là một nhãn dán, mà là mối liên hệ giữa hoàn cảnh, cảm xúc và lựa chọn quen thuộc.",
    opening:
      "Một mô thức thường không đến từ sự thiếu cố gắng. Nó có thể là cách một người từng học để tự bảo vệ mình, rồi tiếp tục dùng cách đó ngay cả khi hoàn cảnh đã thay đổi.",
    reflectionTitle: "Quan sát trước khi sửa chữa.",
    reflection:
      "Tarot chỉ là điểm tựa để gọi tên những gì đang lặp lại. Điều quan trọng hơn là người xem nhận ra điều gì kích hoạt mình và phần nào vẫn còn có thể lựa chọn.",
    quote:
      "Nhận ra một mô thức không buộc bạn phải thay đổi ngay. Nó cho bạn một khoảng dừng để chọn cách khác.",
    boundaryTitle: "Không biến trải nghiệm thành chẩn đoán.",
    boundary:
      "Một mô thức là giả thuyết để quan sát trong đời sống thật, không phải kết luận về con người. Khi có dấu hiệu khủng hoảng hoặc cần chẩn đoán, cần tìm hỗ trợ chuyên môn phù hợp.",
  },
  "cham-ngo-tarot": {
    dek: "Một phiên tiếp cận đầu tiên không nhằm đưa ra lời khuyên nhanh; nó giúp hai bên xem nhu cầu, phạm vi và cách làm việc có phù hợp hay không.",
    opening:
      "Bạn không cần chuẩn bị một câu chuyện hoàn hảo. Chỉ cần mang theo điều đang khiến mình vướng lại, cùng sự sẵn sàng nói rõ điều mình cần và điều mình chưa muốn chạm tới.",
    reflectionTitle: "Bắt đầu bằng một câu hỏi vừa sức.",
    reflection:
      "Cuộc gặp được giữ ở nhịp chậm: gọi tên bối cảnh, quan sát điều đang hiện diện và chọn một bước có thể mang trở lại đời sống thường ngày.",
    quote:
      "Một phiên đầu tiên tốt không khiến bạn lệ thuộc vào câu trả lời. Nó giúp bạn nghe rõ mình hơn.",
    boundaryTitle: "Phạm vi của một phiên tiếp cận.",
    boundary:
      "Đây không phải trị liệu, chẩn đoán hay lời cam kết về kết quả. Bạn có thể dừng lại, không đồng ý với diễn giải hoặc chọn một hình thức hỗ trợ khác bất cứ lúc nào.",
  },
  "ranh-gioi-trong-phien-tarot": {
    dek: "Ranh giới không làm một phiên Tarot kém sâu. Nó bảo vệ quyền lựa chọn, sự an toàn và tính trung thực của cả người tham gia lẫn người thực hành.",
    opening:
      "Một cuộc trao đổi cần dừng lại khi nó bắt đầu thay thế quyền tự quyết, khuyến khích phụ thuộc, hoặc chạm vào vấn đề vượt ngoài phạm vi thực hành an toàn.",
    reflectionTitle: "Diễn giải luôn là một giả thuyết.",
    reflection:
      "Người đọc có trách nhiệm nói rõ giới hạn của công cụ; người xem có quyền đặt câu hỏi, không đồng ý và quyết định điều nào phù hợp với mình.",
    quote:
      "Sự an toàn không nằm ở một câu trả lời chắc chắn, mà ở chỗ quyền lựa chọn vẫn ở lại với người xem.",
    boundaryTitle: "Khi nào cần chuyển hướng hỗ trợ.",
    boundary:
      "Tarot không thay thế hỗ trợ tâm lý, tâm thần hoặc y khoa. Khi có nguy cơ an toàn, khủng hoảng tinh thần hoặc triệu chứng cần đánh giá chuyên môn, phiên nên dừng và chuyển tới nguồn lực phù hợp.",
  },
}

/**
 * Cấu trúc dữ liệu cho 3 Chuyên đề dài hạn (Signature Series) của trang Journal.
 */
interface ChuoiBaiSignatureSeries {
  id: string
  title: string
  subtitle: string
  description: string
  tag: string
  count: string
}

const signatureSeriesList: ChuoiBaiSignatureSeries[] = [
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

/**
 * Lấy bản sao nội dung bài viết chi tiết dựa theo mã định danh (slug).
 * Trả về bản sao mặc định của bài tarot nếu không tìm thấy slug tương ứng.
 *
 * @param slug - Chuỗi mã định danh của bài viết trên URL
 * @returns Đối tượng ArticleCopy chứa các trường nội dung và ranh giới
 */
function layBanSaoBaiViet(slug: string): ArticleCopy {
  return (
    articleCopy[slug] ||
    articleCopy["tarot-khong-phai-loi-tien-doan"]
  )
}

/**
 * Danh mục điều hướng chi tiết cho Menu Overlay toàn màn hình.
 * Bao gồm đường dẫn tới trang chủ, phụ đề gợi mở và ảnh đại diện tương ứng.
 */
interface MucDieuHuongMenu {
  nhan: string
  duongDan: string
  moTa: string
  anhPreview: string
}

const danhSachDieuHuongMenu: MucDieuHuongMenu[] = [
  {
    nhan: "Trang chủ",
    duongDan: "/",
    moTa: "Xây trật tự bên trong để sống tự chủ",
    anhPreview: IMG.homeCuratedHero,
  },
  {
    nhan: "Journal",
    duongDan: "/journal",
    moTa: "Thư viện tri thức & chiêm nghiệm",
    anhPreview: IMG.journalReading,
  },
  {
    nhan: "Chương trình",
    duongDan: "/chuong-trinh",
    moTa: "Các khóa đào tạo & Không gian thực hành",
    anhPreview: IMG.homeCuratedWorkshop,
  },
  {
    nhan: "The Hermit",
    duongDan: "/the-hermit",
    moTa: "Không gian thưởng trà & Tĩnh tại",
    anhPreview: IMG.hermitHall,
  },
  {
    nhan: "Liên hệ",
    duongDan: "/lien-he",
    moTa: "Một kênh Zalo / Facebook chung",
    anhPreview: IMG.homeGeneratedSessionEntry,
  },
]

function Header({
  open,
  setOpen,
  home,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  home: boolean
}) {
  const [hidden, setHidden] = useState(false)
  const [overHero, setOverHero] = useState(home)
  const [anhPreviewHover, setAnhPreviewHover] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, setOpen])

  useEffect(() => {
    let previous = window.scrollY
    const onScroll = () => {
      const current = window.scrollY
      setHidden(!home && current > previous && current > 120)
      setOverHero(home && current < window.innerHeight * 0.82)
      previous = current
    }
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [home])
  return (
    <>
      <header
        className={`site-header ${hidden ? "nav-hidden" : ""} ${
          overHero ? "hero-state" : "editorial-state"
        }`}
      >
        <button
          className="menu-button"
          onClick={() => setOpen(true)}
          aria-label="Mở menu"
        >
          <i />
          <i />
        </button>
        <Link to="/" className="wordmark">
          INNER ARCHITECT<sup>™</sup>
        </Link>
        <nav className="context-nav">
          <Link to="/vo-khiem">About me</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/chuong-trinh">Chương trình</Link>
          <Link to="/the-hermit">The Hermit</Link>
        </nav>
        <span className="language">VI</span>
        <Link to="/lien-he" className="book-link">
          Liên hệ
        </Link>
      </header>
      <div
        className={`menu-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-top">
          <div className="menu-top-brand">
            <strong>INNER ARCHITECT™</strong>
            <span>·</span>
            <small>SƠ ĐỒ ĐIỀU HƯỚNG</small>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="close"
            aria-label="Đóng menu"
          >
            Đóng ×
          </button>
        </div>
        <div className="menu-grid">
          <nav className="menu-links-list">
            {danhSachDieuHuongMenu.map((item, i) => (
              <Link
                key={item.duongDan}
                to={item.duongDan}
                className="menu-link menu-link-card"
                onClick={() => setOpen(false)}
                onMouseEnter={() => setAnhPreviewHover(item.anhPreview)}
                onMouseLeave={() => setAnhPreviewHover(null)}
              >
                <span className="menu-link-index">0{i + 1}</span>
                <div className="menu-link-text">
                  <h2 className="serif menu-link-title">{item.nhan}</h2>
                  <p className="menu-link-desc">{item.moTa}</p>
                </div>
                <span className="menu-link-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>
          <aside className="menu-aside">
            <div className="menu-preview-media">
              <img
                src={anhPreviewHover || IMG.journalReading}
                alt="Hình ảnh không gian và chiêm nghiệm"
                key={anhPreviewHover || "mac-dinh"}
                className="menu-preview-img"
              />
            </div>
            <div className="menu-aside-content">
              <p className="eyebrow">FEATURED · CHIÊM NGHIỆM</p>
              <Link
                to="/journal/tarot-khong-phai-loi-tien-doan"
                className="serif menu-feature"
                onClick={() => setOpen(false)}
              >
                Tarot không phải lời tiên đoán
              </Link>
              <blockquote className="menu-aside-quote serif">
                “Cấu trúc trước. Diễn giải sau. Con người luôn là chủ thể duy
                nhất quyết định cuộc đời mình.”
              </blockquote>
              <div className="menu-contact">
                <div className="menu-contact-links">
                  <Link to="/vo-khiem" onClick={() => setOpen(false)}>
                    Võ Khiêm
                  </Link>
                  <span>·</span>
                  <Link to="/lara" onClick={() => setOpen(false)}>
                    LARA
                  </Link>
                  <span>·</span>
                  <Link to="/he-thong" onClick={() => setOpen(false)}>
                    Đạo đức &amp; Ranh giới
                  </Link>
                  <span>·</span>
                  <Link to="/faq" onClick={() => setOpen(false)}>
                    FAQ
                  </Link>
                </div>
                <p className="menu-contact-info">
                  info@innerarchitect.vn · TP. Hồ Chí Minh
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

function Footer({ home = false }: { home?: boolean }) {
  if (home)
    return (
      <footer className="home-footer">
        <div className="home-footer-statement serif">
          Bắt đầu không phải bằng một câu trả lời.
          <br />
          Bắt đầu bằng việc nhìn rõ mình đang ở đâu.
        </div>
        <p>
          Nhắn cho INNER ARCHITECT™ qua kênh liên hệ chung để làm rõ trạng thái
          hiện tại, nhu cầu và bước tiếp theo phù hợp.
        </p>
        <Link to="/lien-he" className="footer-cta">
          Liên hệ INNER ARCHITECT™
        </Link>
        <div className="home-footer-nav">
          <span>INNER ARCHITECT™</span>
          <Link to="/he-thong">Hệ thống</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/chuong-trinh">Chương trình</Link>
          <Link to="/the-hermit">The Hermit</Link>
          <Link to="/lien-he">Liên hệ</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/vo-khiem">Võ Khiêm</Link>
          <Link to="/lara">LARA</Link>
          {contactChannels.facebook && (
            <a
              href={contactChannels.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          )}
          <a href="mailto:info@innerarchitect.vn">info@innerarchitect.vn</a>
          <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
          <Link to="/pham-vi-ho-tro">Tuyên bố phạm vi hỗ trợ</Link>
        </div>
      </footer>
    )
  return (
    <footer>
      <div className="footer-intro">
        <h2 className="serif">
          INNER ARCHITECT™ hỗ trợ con người xây lại trật tự bên trong và trở về
          với khả năng tự dẫn dắt.
        </h2>
      </div>
      <div className="footer-links">
        <div>
          <b>INNER ARCHITECT™</b>
          <br />
          Integrated Healing System
          <br />
          Không tìm bình an. Xây trật tự bên trong.
        </div>
        <div>
          <b>KHÁM PHÁ</b>
          <br />
          <Link to="/he-thong">Hệ thống</Link>
          <br />
          <Link to="/journal">Journal</Link>
          <br />
          <Link to="/chuong-trinh">Chương trình</Link>
          <br />
          <Link to="/the-hermit">The Hermit</Link>
          <br />
          <Link to="/vo-khiem">Võ Khiêm</Link>
          <br />
          <Link to="/lara">LARA</Link>
        </div>
        <div>
          <b>BẮT ĐẦU</b>
          <br />
          <Link to="/lien-he">Liên hệ</Link>
          <br />
          <Link to="/faq">Câu hỏi thường gặp</Link>
          <br />
          <a href="mailto:info@innerarchitect.vn">info@innerarchitect.vn</a>
          <br />
          637/13/8 Quang Trung, Phường Thông Tây Hội, TP. Hồ Chí Minh
        </div>
        <div>
          <b>THÔNG TIN</b>
          <br />
          <Link to="/he-thong">Đạo đức và ranh giới</Link>
          <br />
          <Link to="/pham-vi-ho-tro">Tuyên bố phạm vi hỗ trợ</Link>
          <br />
          <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
          <br />
          CÔNG TY TNHH INNER ARCHITECT
          <br />
          MST: 0319353708
        </div>
      </div>
      <div className="footer-wordmark">
        INNER ARCHITECT<sup>™</sup>
      </div>
    </footer>
  )
}

function NewsCard({
  item,
  index = 0,
}: {
  item: NewsItem
  index?: number
}) {
  const delayMs = (index % 4) * 120

  return (
    <div
      className="inviewfade journal-card-reveal"
      style={{ "--jr-delay": `${delayMs}ms` } as CSSProperties}
    >
      <Link to={`/journal/${item.slug}`} className="ogata-news-card news-card">
        <div className="ogata-img-box news-image">
          <img src={item.image} alt={item.title} loading="lazy" />
        </div>
        <span className="news-grid__tag">{item.category}</span>
        <p className="news-grid__date">{item.date} | CHIÊM NGHIỆM SÂU</p>
        <p className="news-grid__title">
          {item.title}
          <br />
          <i>{item.italic}</i>
        </p>
      </Link>
    </div>
  )
}

/**
 * Danh sách 4 tầng hỗ trợ trong hệ thống INNER ARCHITECT™.
 * Định hình phương pháp luận tích hợp giữa nhận thức, cảm xúc, thân thể và đời sống.
 */
const danhSachBonTang = [
  {
    so: "01",
    ten: "Tiếp cận ban đầu",
    linhVuc: "Nhận thức & Thấu hiểu",
    moTa: "Tạo một ảnh chụp có giới hạn về trạng thái hiện tại, nhu cầu và kiểm tra mức độ phù hợp trước khi đi sâu.",
    anh: IMG.homeFemaleAdvisor,
    alt: "Nữ tư vấn trò chuyện cùng khách trong một phiên tiếp cận riêng",
  },
  {
    so: "02",
    ten: "Chữa lành & Tái cấu trúc",
    linhVuc: "Cảm xúc & Mô thức",
    moTa: "Nhận diện mô thức quen thuộc (patterns), kích hoạt nguồn lực bên trong và xây dựng lại cách phản hồi cảm xúc.",
    anh: IMG.homeCuratedReflective,
    alt: "Bàn ghi chép trong một buổi thực hành phản tư",
  },
  {
    so: "03",
    ten: "Định hướng & Giữ trục",
    linhVuc: "Đời sống & Ranh giới",
    moTa: "Chuyển hiểu biết thành lựa chọn, ranh giới và nhịp sống có thể duy trì bền vững trong đời sống thực tế.",
    anh: IMG.homeCuratedHermit,
    alt: "Góc thưởng trà định tâm tại The Hermit",
  },
  {
    so: "04",
    ten: "Điều tiết thân & Năng lượng",
    linhVuc: "Cơ thể & Hơi thở",
    moTa: "Làm việc với cơ thể, nhịp thở và cảm giác thể chất để phục hồi cơ chế tự điều hòa tự nhiên của hệ thần kinh.",
    anh: IMG.homeCuratedWorkshop,
    alt: "Màu vẽ và không gian workshop Chạm",
  },
]

/**
 * Danh sách 2 hình ảnh nền tuyển chọn cho Hero Banner Trang Chủ.
 * Tự động luân phiên vòng lặp giữa Bàn Tarot và Sảnh chính The Hermit.
 */
const danhSachAnhHero = [
  {
    src: IMG.homeCuratedHero,
    alt: "Bàn Tarot phủ khăn thổ cẩm trong không gian ánh sáng nến ấm",
    nhan: "Bàn Tarot",
  },
  {
    src: IMG.hermitHall,
    alt: "Sảnh chính The Hermit với ánh sáng ấm và kệ nến thơm LARA",
    nhan: "Sảnh chính",
  },
]

/**
 * Tính toán chỉ số ảnh tiếp theo cho chuỗi ảnh nền hero trang chủ.
 *
 * @param {number} chiSoHienTai - Vị trí của ảnh nền đang hiển thị trong danh sách (0-indexed)
 * @param {number} tongSoLuong - Tổng số lượng hình ảnh nền có sẵn
 * @returns {number} Chỉ số ảnh nền kế tiếp, tự động xoay vòng về 0 khi đến cuối danh sách
 */
function tinhChiSoAnhKeTiep(chiSoHienTai: number, tongSoLuong: number): number {
  if (tongSoLuong <= 0) return 0
  return (chiSoHienTai + 1) % tongSoLuong
}

/**
 * Component Trang Chủ hợp nhất cùng Hệ Thống (Unified Homepage & System).
 * Tích hợp trọn vẹn triết lý 4 tầng, khoảng trống cấu trúc, ranh giới đạo đức,
 * 4 cánh cửa trải nghiệm thực tế và phiên tiếp cận ban đầu 1:1.
 *
 * @param {Object} props - Thuộc tính truyền vào component
 * @param {string} [props.initialSection] - ID của section cần cuộn tới khi tải trang
 * @returns {JSX.Element} Giao diện trang chủ hợp nhất
 */
function Home({ initialSection }: { initialSection?: string }) {
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)

  useEffect(() => {
    if (heroPaused) return
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => tinhChiSoAnhKeTiep(prev, danhSachAnhHero.length))
    }, 4500)
    return () => window.clearInterval(timer)
  }, [heroPaused])

  useEffect(() => {
    if (!initialSection) return
    const timer = window.setTimeout(() => cuonDenPhanTu(initialSection), 150)
    return () => window.clearTimeout(timer)
  }, [initialSection])

  const [huongConTroHero, setHuongConTroHero] = useState<"phai" | "trai">("phai")

  /**
   * Chuyển về hình ảnh nền trước đó trong danh sách ảnh hero trang chủ.
   *
   * @returns {void}
   */
  function chuyenAnhHeroTruoc(): void {
    setHeroIndex((prev) => (prev - 1 + danhSachAnhHero.length) % danhSachAnhHero.length)
  }

  /**
   * Chuyển sang hình ảnh nền kế tiếp trong danh sách ảnh hero trang chủ.
   *
   * @returns {void}
   */
  function chuyenAnhHeroKeTiep(): void {
    setHeroIndex((prev) => (prev + 1) % danhSachAnhHero.length)
  }

  /**
   * Cập nhật hướng con trỏ chuột (trái/phải) dựa trên vị trí di chuyển chuột trong khu vực hero.
   *
   * @param {React.MouseEvent<HTMLElement>} e - Sự kiện di chuyển chuột
   * @returns {void}
   */
  function xuLyDiChuyenChuotHero(e: React.MouseEvent<HTMLElement>): void {
    const rect = e.currentTarget.getBoundingClientRect()
    const viTriX = e.clientX - rect.left
    const huongMoi = viTriX < rect.width / 2 ? "trai" : "phai"
    if (huongMoi !== huongConTroHero) {
      setHuongConTroHero(huongMoi)
    }
  }

  /**
   * Xử lý khi người dùng bấm vào vùng hero để chuyển đổi hình ảnh nền theo hướng con trỏ.
   * Bỏ qua nếu bấm vào nút hoặc liên kết tương tác.
   *
   * @param {React.MouseEvent<HTMLElement>} e - Sự kiện nhấp chuột
   * @returns {void}
   */
  function xuLyBamVungHero(e: React.MouseEvent<HTMLElement>): void {
    const mucTieu = e.target as HTMLElement
    if (mucTieu.closest("a, button, input, textarea")) return
    if (huongConTroHero === "trai") {
      chuyenAnhHeroTruoc()
    } else {
      chuyenAnhHeroKeTiep()
    }
  }

  const pathways = [
    {
      number: "01",
      category: "Cá nhân",
      title: "Phiên tiếp cận 1:1",
      copy: "Một cuộc gặp có giới hạn rõ ràng, dành cho lúc bạn cần một điểm bắt đầu chứ chưa cần một câu trả lời hoàn chỉnh.",
      image: IMG.homeGeneratedSessionSetup,
      imageAlt: "Bàn trà và sổ ghi chép được chuẩn bị cho phiên tiếp cận",
      to: "/chuong-trinh/phien-tiep-can-ban-dau",
      action: "Xem chi tiết",
    },
    {
      number: "02",
      category: "Không gian",
      title: "The Hermit Space",
      copy: "Không gian trà mộc, Tarot phản tư và khoảng nghỉ đủ yên tại Gò Vấp để quan sát chính mình.",
      image: IMG.homeCuratedHermit,
      imageAlt:
        "Không gian trà yên tĩnh dành cho một khoảng dừng tại The Hermit",
      to: "/the-hermit",
      action: "Ghé The Hermit",
    },
    {
      number: "03",
      category: "Trải nghiệm",
      title: "Workshop Chạm — Vẽ",
      copy: "Không gian nhóm nhỏ dùng hơi thở và màu vẽ để tiếp cận cảm giác cơ thể mà không phán xét.",
      image: IMG.homeCuratedWorkshop,
      imageAlt: "Màu vẽ và không gian workshop Chạm",
      to: "/chuong-trinh/cham-ve-de-diu-lai",
      action: "Xem workshop",
    },
    {
      number: "04",
      category: "Đào tạo",
      title: "Khóa Tarot Căn Bản",
      copy: "Học cách đọc biểu tượng, đặt câu hỏi phản tư và rèn luyện đạo đức nghề trong thực hành.",
      image: IMG.homeCuratedReflective,
      imageAlt: "Bàn ghi chép và những lá bài trống",
      to: "/chuong-trinh/tarot-can-ban",
      action: "Xem giáo trình",
    },
  ]

  const leadStory = pathways[0]
  const secondaryStories = pathways.slice(1)
  const leadJournal = news[0]
  const journalRail = news.slice(1, 3)

  return (
    <main className="home-page home-editorial-v3">
      <section
        className={`home-v3-hero cursor-hero-${huongConTroHero}`}
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onMouseMove={xuLyDiChuyenChuotHero}
        onClick={xuLyBamVungHero}
      >
        <div className="home-v3-hero-slider" aria-hidden="true">
          <img
            className={`home-v3-hero-image ${heroIndex === 0 ? "is-active" : ""}`}
            src={IMG.homeCuratedHero}
            alt="Bàn Tarot trong không gian ánh sáng ấm"
          />
          {danhSachAnhHero.slice(1).map((anh, idx) => (
            <img
              key={anh.src}
              className={`home-v3-hero-image ${heroIndex === idx + 1 ? "is-active" : ""}`}
              src={anh.src}
              alt={anh.alt}
              loading="lazy"
            />
          ))}
        </div>
        <div className="home-v3-hero-scrim" />
        <div className="home-v3-hero-copy">
          <p className="home-v3-hero-kicker">
            Hệ thống tái cấu trúc nội tâm · TP. Hồ Chí Minh
          </p>
          <h1 className="serif">
            Xây trật tự <br className="home-v3-mobile-break" />bên trong
            <br />
            <em>để sống tự chủ.</em>
          </h1>
          <p className="home-v3-hero-intro">
            <span className="home-v3-intro-line">
              Một hệ thống tích hợp nhận thức,
            </span>{" "}
            <span className="home-v3-intro-line">
              cảm xúc, thân thể và đời sống thực —
            </span>{" "}
            <span className="home-v3-intro-line">
              với cấu trúc an toàn, ranh giới rõ ràng
            </span>{" "}
            <span className="home-v3-intro-line">
              và điểm kết có thể nhìn thấy.
            </span>
          </p>
          <div className="home-v3-hero-actions">
            <Link to="/lien-he" className="home-v3-link home-v3-link-light">
              Liên hệ về phiên tiếp cận
            </Link>
            <button
              type="button"
              onClick={() => cuonDenPhanTu("he-thong")}
              className="home-v3-text-button"
            >
              Khám phá hệ thống
            </button>
          </div>
        </div>
        <p className="home-v3-hero-caption">
          Không tiên đoán. Không quyết định thay. Phục hồi khả năng tự điều
          chỉnh và tự dẫn dắt.
        </p>
      </section>

      <section id="he-thong" className="home-v3-system">
        <header className="home-v3-system-intro">
          <p className="home-v3-label reveal-child">
            The Inner Architect System®
          </p>
          <h2 className="serif reveal-child">
            Bốn tầng phản chiếu,
            <br />
            một tiến trình tự chủ.
          </h2>
          <div className="home-v3-system-copy reveal-child">
            <blockquote className="serif">
              “Con người không thiếu thêm lời khuyên. Điều thường thiếu là một
              cấu trúc đủ an toàn để tự nhìn rõ.”
            </blockquote>
            <p>
              Bốn tầng không phải thứ bậc ép buộc. Đây là bản đồ để nhận ra nơi
              bạn đang đứng và bắt đầu từ phần đang cần được nhìn thấy.
            </p>
          </div>
        </header>

        <div className="home-v3-system-gallery">
          {danhSachBonTang.map((tang) => (
            <article className="home-v3-layer reveal-child" key={tang.so}>
              <figure className="home-v3-media">
                <img src={tang.anh} alt={tang.alt} loading="lazy" />
              </figure>
              <p>
                <span>{tang.so}</span>
                {tang.linhVuc}
              </p>
              <h3 className="serif">{tang.ten}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="home-v3-opening">
        <div className="home-v3-opening-heading reveal-child">
          <p className="home-v3-label">
            Nếu bạn đang tìm hỗ trợ cho chính mình
          </p>
          <h2 className="serif">
            Bắt đầu từ
            <br />
            điều đang lặp lại.
          </h2>
        </div>
        <div className="home-v3-opening-copy reveal-child">
          <p>
            Có thể bạn đã hiểu vấn đề bằng lý trí nhưng phản ứng cũ vẫn quay
            lại. Có thể một mối quan hệ, một lựa chọn hay một nỗi bất an cứ lặp
            lại mà bạn chưa biết bắt đầu quan sát từ đâu.
          </p>
          <p>
            INNER ARCHITECT™ tạo một điểm dừng có cấu trúc: cảm xúc, cơ thể và
            điều bạn đang nghĩ được nhìn cùng nhau. Mục tiêu là giúp bạn có thêm
            cơ sở để tự chọn bước tiếp theo.
          </p>
          <Link to="/chuong-trinh/phien-tiep-can-ban-dau" className="home-v3-link">
            Xem thông tin phiên tiếp cận
          </Link>
        </div>
        <figure className="home-v3-opening-image home-v3-media reveal-child">
          <img
            src={IMG.homeGeneratedSessionEntry}
            alt="Không gian phòng Tarot và Trà đạo riêng tư tại The Hermit"
            loading="lazy"
          />
          <figcaption>Một không gian riêng để quan sát</figcaption>
        </figure>
      </section>

      <section className="home-v3-session">
        <figure className="home-v3-session-image home-v3-media reveal-child">
          <img
            src={IMG.homeGeneratedSessionProcess}
            alt="Không gian The Hermit được chuẩn bị cho phiên tiếp cận 1:1"
            loading="lazy"
          />
          <figcaption>Một cuộc gặp có điểm vào và điểm kết rõ ràng</figcaption>
        </figure>
        <div className="home-v3-session-copy reveal-child">
          <p className="home-v3-label">Phiên đầu tiên diễn ra như thế nào?</p>
          <h2 className="serif">Nhìn rõ trước khi đi tiếp.</h2>
          <ol>
            <li>
              <span>Gọi tên</span>
              <p>Bạn mang đến điều đang chiếm nhiều năng lượng nhất lúc này.</p>
            </li>
            <li>
              <span>Quan sát</span>
              <p>
                Tarot và câu hỏi phản tư mở thêm góc nhìn, không đưa ra mệnh
                lệnh.
              </p>
            </li>
            <li>
              <span>Chọn bước</span>
              <p>
                Cuộc gặp khép lại bằng một bước nhỏ phù hợp với đời sống thực
                tế.
              </p>
            </li>
          </ol>
          <Link to="/lien-he" className="home-v3-link">
            Liên hệ về phiên tiếp cận
          </Link>
        </div>
      </section>

      <section className="home-v3-stories">
        <header className="home-v3-section-heading">
          <p className="home-v3-label reveal-child">Những lối đi tiếp theo</p>
          <h2 className="serif reveal-child">Đi tiếp theo nhịp riêng.</h2>
          <p className="reveal-child">
            Đây không phải các gói buộc phải đi qua theo thứ tự. Bạn chỉ chọn
            điều đang phù hợp với trạng thái hiện tại của mình.
          </p>
        </header>

        <div className="home-v3-story-layout">
          <Link to={leadStory.to} className="home-story-feature reveal-child">
            <figure className="home-v3-media">
              <img
                src={leadStory.image}
                alt={leadStory.imageAlt}
                loading="lazy"
              />
            </figure>
            <div className="home-v3-story-meta">
              <span>
                {leadStory.number} · {leadStory.category}
              </span>
              <span>{leadStory.action}</span>
            </div>
            <h3 className="serif">{leadStory.title}</h3>
            <p>{leadStory.copy}</p>
          </Link>

          <div className="home-story-rail">
            {secondaryStories.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="home-story-secondary reveal-child"
              >
                <figure className="home-v3-media">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" />
                </figure>
                <div className="home-v3-story-meta">
                  <span>
                    {item.number} · {item.category}
                  </span>
                  <span>{item.action}</span>
                </div>
                <h3 className="serif">{item.title}</h3>
                <p>{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v3-ethics">
        <div className="home-v3-ethics-statement reveal-child">
          <p className="home-v3-label">Ethics & integrity</p>
          <h2 className="serif">An toàn đi trước chiều sâu.</h2>
          <blockquote className="serif">
            “Cấu trúc trước. Diễn giải sau. Con người luôn là chủ thể duy nhất
            quyết định cuộc đời mình.”
          </blockquote>
        </div>
        <div className="home-v3-ethics-list">
          <article className="reveal-child">
            <span>01</span>
            <h3>Không tiên đoán số mệnh</h3>
            <p>Tarot là bề mặt biểu tượng để quan sát điều đang hiện diện.</p>
          </article>
          <article className="reveal-child">
            <span>02</span>
            <h3>Không quyết định thay</h3>
            <p>Quyền lựa chọn và trách nhiệm luôn thuộc về chính bạn.</p>
          </article>
          <article className="reveal-child">
            <span>03</span>
            <h3>Không hứa hẹn tuyệt đối</h3>
            <p>
              Phát triển bản thân là tiến trình thực hành trong đời sống thật.
            </p>
          </article>
          <article className="reveal-child">
            <span>04</span>
            <h3>Không tạo sự phụ thuộc</h3>
            <p>Mục tiêu là phục hồi khả năng tự điều chỉnh và tự dẫn dắt.</p>
          </article>
        </div>
        <figure className="home-v3-ethics-image home-v3-media reveal-child">
          <img
            src={IMG.homeCuratedBoundary}
            alt="Một vòng tròn workshop giữ khoảng cách và ranh giới an toàn"
            loading="lazy"
          />
          <figcaption>Không gian nhóm nhỏ với ranh giới được giữ rõ</figcaption>
        </figure>
        <p className="home-v3-ethics-note reveal-child">
          <strong>Ranh giới chuyên môn:</strong> Hệ thống không chẩn đoán, không
          kê đơn và không thay thế can thiệp y khoa, tâm thần học hoặc tâm lý
          lâm sàng. Khi vượt ngoài phạm vi an toàn, người điều phối sẽ hướng dẫn
          chuyển gửi tới hỗ trợ phù hợp.
        </p>
      </section>

      <section className="home-v3-journal">
        <header className="home-v3-journal-heading">
          <div>
            <p className="home-v3-label reveal-child">Journal</p>
            <h2 className="serif reveal-child">
              Đọc để hiểu điều đang xảy ra.
            </h2>
          </div>
          <Link to="/journal" className="home-v3-link reveal-child">
            Xem tất cả bài viết
          </Link>
        </header>

        <div className="home-v3-journal-layout">
          <article className="home-journal-feature reveal-child">
            <Link to={`/journal/${leadJournal.slug}`}>
              <figure className="home-v3-media">
                <img
                  src={leadJournal.image}
                  alt={leadJournal.title}
                  loading="lazy"
                />
              </figure>
              <div className="home-v3-story-meta">
                <span>{leadJournal.category}</span>
                <time>{leadJournal.date}</time>
              </div>
              <h3 className="serif">
                {leadJournal.title}
                <em>{leadJournal.italic}</em>
              </h3>
              <p>{leadJournal.summary}</p>
            </Link>
          </article>

          <div className="home-journal-rail">
            {journalRail.map((item) => (
              <article
                className="home-journal-secondary reveal-child"
                key={item.slug}
              >
                <Link to={`/journal/${item.slug}`}>
                  <figure className="home-v3-media">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </figure>
                  <div className="home-v3-story-meta">
                    <span>{item.category}</span>
                    <time>{item.date}</time>
                  </div>
                  <h3 className="serif">
                    {item.title}
                    <em>{item.italic}</em>
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v3-closing">
        <img
          src={IMG.homeCuratedClosing}
          alt="Hình ảnh biểu tượng về một tiến trình có tâm điểm và nhiều lớp"
          loading="lazy"
        />
        <div className="home-v3-closing-scrim" />
        <div className="home-v3-closing-copy reveal-child">
          <p className="home-v3-label">Nếu đây có thể là điểm bắt đầu</p>
          <h2 className="serif">Bắt đầu từ một cuộc gặp nhỏ.</h2>
          <p>
            Phiên tiếp cận ban đầu giúp làm rõ điều bạn đang mang theo, nhu cầu
            hiện tại và giới hạn hỗ trợ phù hợp. Bạn không cần cam kết đi xa hơn
            sau cuộc gặp này.
          </p>
          <Link to="/lien-he" className="home-v3-link home-v3-link-light">
            Liên hệ về phiên tiếp cận
          </Link>
        </div>
      </section>
    </main>
  )
}

function PageHero({
  eyebrow,
  title,
  italic,
  intro,
}: {
  eyebrow: string
  title: string
  italic?: string
  intro: string
}) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="serif">
        {title}
        {italic && <em>{italic}</em>}
      </h1>
      <p>{intro}</p>
    </section>
  )
}

/**
 * Hiện các phần tử `.inviewfade` (thẻ "Bài viết liên quan") khi chúng cuộn
 * tới 75% chiều cao màn hình trên trang chi tiết bài viết, để các thẻ này không
 * bị kẹt ở trạng thái ẩn.
 *
 * @param khoaLamMoi - Giá trị thay đổi khi nội dung trang đổi (ví dụ slug bài
 *   viết) để kiểm tra lại các thẻ vừa được render
 */
function useOgataInview(khoaLamMoi?: string) {
  useEffect(() => {
    const triggerOgataInview = () => {
      const targets = document.getElementsByClassName("inviewfade")
      const position = Math.floor(window.innerHeight * 0.75)
      for (let i = 0; i < targets.length; i++) {
        const offsetTop = Math.floor(targets[i].getBoundingClientRect().top)
        if (offsetTop < position) {
          targets[i].classList.add("inviewfadein")
        }
      }
    }

    triggerOgataInview()
    window.addEventListener("scroll", triggerOgataInview, { passive: true })
    window.addEventListener("resize", triggerOgataInview, { passive: true })

    const timer = setTimeout(triggerOgataInview, 50)

    return () => {
      window.removeEventListener("scroll", triggerOgataInview)
      window.removeEventListener("resize", triggerOgataInview)
      clearTimeout(timer)
    }
  }, [khoaLamMoi])
}

function Article({ slug }: { slug: string }) {
  const currentIndex = news.findIndex((n) => n.slug === slug)
  const current = currentIndex !== -1 ? news[currentIndex] : news[0]
  const copy = layBanSaoBaiViet(current.slug)
  const prevArticle =
    currentIndex > 0 ? news[currentIndex - 1] : news[news.length - 1]
  const nextArticle =
    currentIndex < news.length - 1 ? news[currentIndex + 1] : news[0]
  const relatedArticles = news.filter((n) => n.slug !== current.slug).slice(0, 3)
  useOgataInview(current.slug)

  return (
    <main className="article-page">
      <article>
        <header className="article-head">
          <div className="breadcrumbs">
            <Link to="/journal">Journal</Link> / {current.category}
          </div>
          <p className="eyebrow">
            {current.category} · {current.date}
          </p>
          <h1 className="serif">
            {current.title}
            <em>{current.italic}</em>
          </h1>
          <p className="dek">{copy.dek}</p>
        </header>
        <img className="lead-image" src={current.image} alt={current.title} />
        <div className="article-body">
          <p className="dropcap">{copy.opening}</p>
          <h2 className="serif">{copy.reflectionTitle}</h2>
          <p>{copy.reflection}</p>
          <blockquote className="serif">
            “{copy.quote}”
          </blockquote>
          <h2 className="serif">{copy.boundaryTitle}</h2>
          <p>{copy.boundary}</p>
        </div>
        <div className="article-spread">
          <img src={IMG.tarot2} alt="Không gian chiêm nghiệm và tĩnh lặng" />
          <div>
            <h2 className="serif">Quyền lựa chọn luôn thuộc về người xem.</h2>
            <p>
              Mọi diễn giải đều là một giả thuyết để cùng xem xét. Người xem có
              quyền không đồng ý, dừng lại hoặc chọn một hướng khác.
            </p>
          </div>
        </div>
        <div className="article-body">
          <h2 className="serif">Khi nào cuộc soi chiếu nên dừng lại?</h2>
          <p>
            Khi cuộc trao đổi chạm đến nguy cơ an toàn, khủng hoảng tinh thần,
            triệu chứng y khoa hoặc sự phụ thuộc vào lời đọc, trách nhiệm của
            người thực hành là dừng lại và chuyển hướng hỗ trợ.
          </p>
          <aside>
            <strong>RANH GIỚI CHUYÊN MÔN</strong>
            <br />
            Tarot và các hoạt động tại INNER ARCHITECT™ không thay thế hỗ trợ y tế, tâm thần hoặc tâm lý lâm sàng. Khi một
            tình trạng vượt ngoài phạm vi an toàn, người đọc cần tìm đến các cơ sở y tế và chuyên gia có chứng chỉ phù hợp.
          </aside>
          <h2 className="serif">
            Từ nhận diện đến hành động trong đời sống thật.
          </h2>
          <p>
            Một bài viết hay phiên soi chiếu chỉ có ý nghĩa khi điều được nhận diện có thể trở
            thành một lựa chọn cụ thể, vừa sức và thuộc về chính quyền tự chủ của bạn.
          </p>
        </div>
        <footer className="author-block">
          <p className="eyebrow">TÁC GIẢ</p>
          <h2 className="serif">Võ Khiêm — Founder, INNER ARCHITECT™ System</h2>
          <p>
            Võ Khiêm viết về Tarot phản tư, tự nhận thức, tư duy phản biện và
            ranh giới trong các hoạt động phát triển bản thân.
          </p>
          <Link to="/vo-khiem" className="underlink">
            Xem hồ sơ tác giả →
          </Link>
        </footer>
      </article>
      <section className="article-nav">
        <Link to={`/journal/${prevArticle.slug}`}>← {prevArticle.title}</Link>
        <Link to={`/journal/${nextArticle.slug}`}>{nextArticle.title} →</Link>
      </section>
      <section className="related section-pad">
        <p className="eyebrow">RELATED JOURNAL · BÀI VIẾT LIÊN QUAN</p>
        <div className="news-grid">
          {relatedArticles.map((n) => (
            <NewsCard key={n.slug} item={n} />
          ))}
        </div>
        <div className="article-actions">
          <Link to="/journal" className="underlink">
            Trở về Journal
          </Link>
          <Link to="/chuong-trinh" className="button-link">
            Khám phá Chương trình
          </Link>
        </div>
      </section>
    </main>
  )
}

/**
 * Cấu trúc dữ liệu chi tiết cho từng trang con của hệ sinh thái Chương trình.
 */
interface ChiTietChuongTrinh {
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

const danhSachChiTietChuongTrinh: Record<string, ChiTietChuongTrinh> = {
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

/**
 * Chuyển đổi tên chương trình hiển thị sang mã định danh (slug) trên URL.
 *
 * @param tenChuongTrinh - Tên tiếng Việt của chương trình
 * @returns Mã slug tương ứng
 */
function laySlugChuongTrinh(tenChuongTrinh: string): string {
  switch (tenChuongTrinh) {
    case "Chạm ngõ Tarot":
      return "cham-ngo-tarot"
    case "Workshop nhận diện mô thức":
      return "nhan-dien-mo-thuc"
    case "Chạm — Vẽ để dịu lại":
      return "cham-ve-de-diu-lai"
    case "Trải nghiệm nhóm nhỏ":
      return "trai-nghiem-nhom-nho"
    case "Phiên tiếp cận ban đầu":
      return "phien-tiep-can-ban-dau"
    case "Phiên tái cấu trúc chuyên sâu":
      return "phien-tai-cau-truc-chuyen-sau"
    case "Đồng hành trong giai đoạn chuyển pha":
      return "dong-hanh-chuyen-pha"
    case "Tarot Căn Bản":
      return "tarot-can-ban"
    case "Tarot Nâng Cao":
      return "tarot-nang-cao"
    case "Tarot Healer":
      return "tarot-healer"
    case "Khóa tâm lý chuyên đề":
      return "tam-ly-chuyen-de"
    default:
      return "cham-ngo-tarot"
  }
}

function ProgramDetail({ slug }: { slug: string }) {
  const p =
    danhSachChiTietChuongTrinh[slug] ||
    danhSachChiTietChuongTrinh["cham-ngo-tarot"]

  return (
    <main className="cream-page program-detail-page">
      <PageHero
        eyebrow={`${p.nhom} · ${p.tang}`}
        title={p.tieuDe}
        italic={p.phuDe}
        intro={p.doanDan}
      />
      <section className="detail-lead section-pad">
        <div className="detail-media">
          <img src={p.hinhAnh} alt={p.tieuDe} />
        </div>
        <div className="detail-info">
          <div className="program-specs">
            <div className="spec-item">
              <span className="spec-label">THỜI LƯỢNG</span>
              <strong className="spec-value">{p.thoiLuong}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">HÌNH THỨC</span>
              <strong className="spec-value">{p.hinhThuc}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">QUY MÔ</span>
              <strong className="spec-value">{p.quyMo}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">CHI PHÍ / HỌC PHÍ</span>
              <strong className="spec-value">{p.chiPhi}</strong>
            </div>
          </div>

          <div className="program-section-block">
            <h2 className="serif">Mục tiêu cốt lõi</h2>
            <ul className="program-bullet-list">
              {p.mucTieu.map((mt, i) => (
                <li key={i}>{mt}</li>
              ))}
            </ul>
          </div>

          <div className="program-section-block">
            <h2 className="serif">Nội dung & Hoạt động chính</h2>
            <div className="curriculum-steps">
              {p.hoatDong.map((hd, i) => (
                <div key={i} className="curriculum-step-item">
                  <span className="step-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>{hd}</p>
                </div>
              ))}
            </div>
          </div>

          {p.chamNgon && (
            <blockquote className="program-quote serif">
              “{p.chamNgon}”
            </blockquote>
          )}

          <aside className="program-boundary-aside">
            <strong>RANH GIỚI & ĐẠO ĐỨC HỆ THỐNG</strong>
            <p>{p.ranhGioi}</p>
          </aside>

          <div className="program-actions">
            <Link to="/lien-he" className="button-link">
              {p.nutHanhDong} →
            </Link>
            <Link to="/chuong-trinh" className="underlink">
              ← Tất cả chương trình
            </Link>
          </div>
        </div>
      </section>
      <ParentLink to="/chuong-trinh" label="Tất cả chương trình" />
    </main>
  )
}

function Programmes({ detail }: { detail?: string }) {
  if (detail) {
    return <ProgramDetail slug={detail} />
  }

  const families: [string, string[]][] = [
    [
      "A. TRẢI NGHIỆM",
      [
        "Chạm ngõ Tarot",
        "Workshop nhận diện mô thức",
        "Chạm — Vẽ để dịu lại",
        "Trải nghiệm nhóm nhỏ",
      ],
    ],
    [
      "B. ĐỒNG HÀNH CÁ NHÂN",
      [
        "Phiên tiếp cận ban đầu",
        "Phiên tái cấu trúc chuyên sâu",
        "Đồng hành trong giai đoạn chuyển pha",
      ],
    ],
    [
      "C. ACADEMY",
      [
        "Tarot Căn Bản",
        "Tarot Nâng Cao",
        "Tarot Healer",
        "Khóa tâm lý chuyên đề",
      ],
    ],
  ]
  return (
    <main>
      <PageHero
        eyebrow="PROGRAMME ECOSYSTEM"
        title="Mỗi người cần"
        italic="một điểm bắt đầu khác nhau."
        intro="Các chương trình được thiết kế theo mức độ sẵn sàng, mục tiêu và phạm vi hỗ trợ. Không phải mọi trải nghiệm đều dẫn đến một tiến trình dài hơn."
      />
      <section className="programme-families">
        {families.map((family, fi) => (
          <article key={family[0]}>
            <div>
              <p className="eyebrow">{family[0]}</p>
              <p>
                {fi === 0
                  ? "Những điểm chạm nhẹ để quan sát và trải nghiệm."
                  : fi === 1
                    ? "Một tiến trình riêng tư, có nhịp độ và điểm kết rõ ràng."
                    : "Nền tảng học thuật và thực hành có giám sát."}
              </p>
            </div>
            <div>
              {family[1].map((name, i) => (
                <Link
                  key={name}
                  to={`/chuong-trinh/${laySlugChuongTrinh(name)}`}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="serif">{name}</h2>
                  <b>→</b>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
      <section className="programme-boundary section-pad">
        <p className="serif">
          Các chương trình mang tính giáo dục, trải nghiệm và phát triển cá
          nhân.
        </p>
        <p>
          Chúng không cấp quyền hành nghề khám, chữa bệnh hoặc trị liệu tâm lý.
        </p>
        <Link to="/lien-he" className="button-link">
          Liên hệ về chương trình
        </Link>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

function Hermit() {
  const rituals = [
    [
      "01",
      "Chọn trà",
      "Bắt đầu bằng một hương vị, một chiếc cốc và một nhịp chậm hơn.",
    ],
    [
      "02",
      "Ở lại",
      "Đọc, quan sát hoặc chỉ ngồi yên — không cần phải tạo ra một kết luận.",
    ],
    [
      "03",
      "Trò chuyện",
      "Khi phù hợp, một phiên tiếp cận Tarot ngắn mở ra những câu hỏi có giới hạn rõ ràng.",
    ],
  ]

  return (
    <main className="hermit-page">
      <section className="hermit-hero">
        <img src={IMG.hermitStorefront} alt="Mặt tiền The Hermit" />
        <div>
          <p>THE HERMIT · TP. HỒ CHÍ MINH</p>
          <h1 className="serif">
            Một khoảng lặng
            <br />
            <em>có chủ đích.</em>
          </h1>
          <Link to="/lien-he" className="underlink">
            Liên hệ The Hermit →
          </Link>
        </div>
      </section>
      <section className="hermit-intro section-pad">
        <p className="eyebrow">A PLACE TO STAY AWHILE</p>
        <h2 className="serif">Trà, đồ vật và một cuộc đối thoại vừa đủ.</h2>
        <div>
          <p>
            The Hermit là không gian café, trà đạo và Tarot thuộc hệ sinh thái
            INNER ARCHITECT™. Ở đây, nhịp điệu không bắt bạn phải đi đến một
            trải nghiệm sâu hơn — nó chỉ mời bạn dành thời gian cho điều đang
            hiện diện.
          </p>
          <p>
            Phong cách phục vụ lấy cảm hứng từ một tea room đương đại: vật liệu
            được chạm tay, danh mục ngắn, nhịp chuyển cảnh nhẹ và khoảng trống
            để tự quan sát.
          </p>
        </div>
      </section>
      <section className="hermit-hall">
        <img src={IMG.hermitHall} alt="Sảnh chính The Hermit" />
        <p>THE ROOM · DAY INTO EVENING</p>
      </section>
      <section className="hermit-rituals section-pad">
        <header>
          <p className="eyebrow">HOW TO BE HERE</p>
          <h2 className="serif">Không có cách đúng để ở lại.</h2>
        </header>
        <div>
          {rituals.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3 className="serif">{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="hermit-pair">
        <img src={IMG.hermitTeaRoom} alt="Góc thưởng trà tại The Hermit" />
        <div>
          <p className="eyebrow">TEA · TAROT · OBJECTS</p>
          <h2 className="serif">Những điểm chạm đầu tiên.</h2>
          <p>
            Một ấm trà, một phiên Tarot tiếp cận ngắn, những bộ bài và nến được
            chọn như một phần của thế giới The Hermit — không phải một cửa hàng
            tách biệt.
          </p>
          <Link to="/lara" className="underlink">
            Khám phá LARA →
          </Link>
        </div>
      </section>
      <section className="hermit-tarot section-pad">
        <div>
          <p className="eyebrow">TAROT AT THE HERMIT</p>
          <h2 className="serif">Đọc bài như một hình thức soi chiếu.</h2>
          <p>
            Tarot không dự đoán tương lai, không chẩn đoán và không quyết định
            thay bạn. Một phiên tiếp cận chỉ giúp làm rõ điều đang hiện diện và
            cân nhắc bước tiếp theo phù hợp.
          </p>
          <Link to="/lien-he" className="button-link">
            Liên hệ đặt phiên Tarot
          </Link>
        </div>
        <img src={IMG.hermitTarotRoom} alt="Không gian Tarot tại The Hermit" />
      </section>
      <section className="hermit-visit section-pad">
        <div>
          <p className="eyebrow">VISIT</p>
          <h2 className="serif">Ghé The Hermit</h2>
          <p>
            637/13/8 Quang Trung, Phường Thông Tây Hội
            <br />
            TP. Hồ Chí Minh
            <br />
            <br />
            [Giờ mở cửa: xác nhận]
          </p>
        </div>
        <div className="map">
          THE HERMIT
          <br />
          <span>Vị trí chính xác sẽ được cập nhật</span>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

function LaraPage() {
  const products = [
    [
      IMG.soulCleanse,
      "Soul Cleanse",
      "Hương bạch đàn, bạc hà và cây xô thơm, phù hợp với những khoảng thời gian cần cảm giác thanh thoát và tập trung hơn.",
    ],
    [
      IMG.sacredGround,
      "Sacred Ground",
      "Hương gỗ Palo Santo, khói và xạ hương, tạo nên một bầu không khí trầm, ấm cho thời gian đọc, viết hoặc chiêm nghiệm.",
    ],
    [
      IMG.soulEmbrace,
      "Soul Embrace",
      "Hương rosewood, lavender và xô thơm, hướng đến cảm giác dịu và ấm trong không gian nghỉ ngơi.",
    ],
  ]
  return (
    <main>
      <PageHero
        eyebrow="LARA · INNER ARCHITECT™ ECOSYSTEM"
        title="LARA"
        italic="Hương thơm cho những khoảng nghỉ và nghi thức cá nhân."
        intro="LARA là nhánh sản phẩm hương thơm do Võ Khiêm phát triển, kết nối mùi hương, vật liệu và những khoảng thời gian dành cho chính mình."
      />
      <section className="lara-story section-pad">
        <img src={IMG.lara} alt="Bộ sưu tập sản phẩm hương thơm LARA" />
        <div>
          <h2 className="serif">
            Một trải nghiệm cảm quan, không phải tuyên bố điều trị.
          </h2>
          <p>
            Mỗi sản phẩm được giới thiệu như một trải nghiệm về hương, không
            gian và nghi thức cá nhân. LARA không phải tầng chữa lành hoặc điều
            kiện tham gia INNER ARCHITECT™.
          </p>
        </div>
      </section>
      <section className="lara-products section-pad">
        {products.map((p) => (
          <article key={p[1]}>
            <img
              src={p[0]}
              alt={`Graphic sản phẩm LARA ${p[1]} với chữ đóng cứng`}
            />
            <h2 className="serif">{p[1]}</h2>
            <p>{p[2]}</p>
          </article>
        ))}
      </section>
      <section className="simple-content section-pad">
        <div>
          <h2 className="serif">Sử dụng an toàn</h2>
        </div>
        <div>
          <p>
            Đặt nến trên bề mặt phẳng, cách vật dễ cháy và luồng gió mạnh. Không
            để nến cháy khi không có người quan sát. Dừng sử dụng nếu mùi hương
            gây khó chịu.
          </p>
          <p>
            Tình trạng hàng, giá và địa điểm mua chỉ được công bố sau khi xác
            nhận.
          </p>
          <Link to="/the-hermit" className="underlink">
            Trải nghiệm tại The Hermit →
          </Link>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

/** Email liên hệ dự phòng đang dùng trong nội dung hiện có (chờ xác nhận). */
const EMAIL_LIEN_HE = "info@innerarchitect.vn"

/** Sáu nhánh nhu cầu khách có thể nhắn qua kênh liên hệ chung. */
const danhSachNhuCauLienHe = [
  "Trải nghiệm trà đạo có hướng dẫn (theo lịch hẹn)",
  "Phiên Tarot online hoặc trực tiếp",
  "Đồng hành 1:1",
  "Workshop",
  "Academy và các khóa học",
  "Sản phẩm LARA",
]

/**
 * Hiển thị nút mở Zalo/Facebook chung, hoặc trạng thái "đang cập nhật"
 * khi chưa có URL chính thức.
 *
 * Không tạo link thay thế khi thiếu cấu hình. Link ngoài mở tab mới với
 * `rel="noopener noreferrer"`; website không gửi bất kỳ dữ liệu nào kèm theo.
 *
 * @returns Nhóm nút kênh liên hệ hoặc thông báo trạng thái
 */
function KenhLienHeChung() {
  if (!hasContactChannel)
    return (
      <p role="status">
        <strong>Kênh Zalo / Facebook chính thức đang được cập nhật.</strong>
        <br />
        Trong thời gian này, bạn có thể gửi email tới{" "}
        <a className="underlink" href={`mailto:${EMAIL_LIEN_HE}`}>
          {EMAIL_LIEN_HE}
        </a>
        .
      </p>
    )
  return (
    <div className="program-actions">
      {contactChannels.zalo && (
        <a
          className="button-link"
          href={contactChannels.zalo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Nhắn qua Zalo →
        </a>
      )}
      {contactChannels.facebook && (
        <a
          className="underlink"
          href={contactChannels.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          Nhắn qua Facebook →
        </a>
      )}
    </div>
  )
}

/**
 * Trang Liên hệ — thay cho form đặt lịch 8 bước trước đây (ngoài phạm vi MVP).
 * Không thu thập dữ liệu; khách tự gửi nhu cầu qua kênh chung.
 *
 * @returns Trang liên hệ
 */
function ContactPage() {
  return (
    <main className="cream-page contact-page">
      <PageHero
        eyebrow="LIÊN HỆ · INNER ARCHITECT™"
        title="Một kênh liên hệ"
        italic="cho mọi nhu cầu."
        intro="Trà đạo có hướng dẫn, Tarot, đồng hành 1:1, workshop, Academy và sản phẩm đều được tiếp nhận qua cùng một kênh Zalo / Facebook. Bạn tự gửi nhu cầu; đội ngũ phản hồi và xác nhận ngoài website."
      />
      <section className="simple-content section-pad">
        <div>
          <p className="eyebrow">KÊNH LIÊN HỆ CHUNG</p>
          <h2 className="serif">Nhắn trực tiếp cho INNER ARCHITECT™.</h2>
        </div>
        <div>
          <KenhLienHeChung />
          <p>
            Zalo và Facebook là nền tảng bên thứ ba với chính sách riêng. Website
            không tự gửi tin nhắn thay bạn và không lưu nội dung bạn trao đổi ở
            đó.
          </p>
        </div>
      </section>
      <section className="simple-content section-pad">
        <div>
          <p className="eyebrow">BẠN CÓ THỂ NHẮN VỀ</p>
          <h2 className="serif">Ghi rõ nhu cầu để được phản hồi đúng người.</h2>
        </div>
        <div>
          <ul className="program-bullet-list">
            {danhSachNhuCauLienHe.map((nhuCau) => (
              <li key={nhuCau}>{nhuCau}</li>
            ))}
          </ul>
          <p>
            Thời lượng, lịch và chi phí của từng chương trình sẽ được xác nhận
            trực tiếp khi bạn nhắn.
          </p>
        </div>
      </section>
      <section className="simple-content section-pad">
        <div>
          <p className="eyebrow">ĐỊA CHỈ</p>
          <h2 className="serif">The Hermit</h2>
        </div>
        <div>
          <p>
            637/13/8 Quang Trung, Phường Thông Tây Hội
            <br />
            TP. Hồ Chí Minh
          </p>
          <p>Giờ mở cửa và chỉ đường sẽ được cập nhật sau khi xác nhận.</p>
          <aside className="program-boundary-aside">
            <strong>KHÔNG DÀNH CHO TÌNH HUỐNG KHẨN CẤP</strong>
            <p>
              Nếu bạn hoặc người khác đang gặp nguy hiểm, hãy gọi 115 hoặc đến
              cơ sở y tế gần nhất. INNER ARCHITECT™ không phải dịch vụ cấp cứu
              và không thay thế hỗ trợ tâm lý, tâm thần hoặc y khoa.
            </p>
          </aside>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

/** Câu hỏi thường gặp, chỉ dùng thông tin đã có trên site hoặc đã chốt. */
const danhSachCauHoiThuongGap: [string, string][] = [
  [
    "Làm sao để đặt trải nghiệm trà, phiên Tarot hoặc workshop?",
    "Mọi nhu cầu đều được tiếp nhận qua một kênh Zalo / Facebook chung trên trang Liên hệ. Website không có hệ thống đặt lịch; đội ngũ sẽ phản hồi và xác nhận trực tiếp với bạn.",
  ],
  [
    "Trải nghiệm trà đạo có cần hẹn trước không?",
    "Có. Trà đạo tại INNER ARCHITECT™ diễn ra theo lịch hẹn và có người hướng dẫn.",
  ],
  [
    "Tarot có hình thức online không?",
    "Có. Tarot được thực hiện cả online và trực tiếp. Hãy nêu hình thức bạn muốn khi nhắn qua kênh liên hệ.",
  ],
  [
    "Tarot ở đây có tiên đoán tương lai không?",
    "Không. Tarot được dùng như một bề mặt biểu tượng để quan sát điều đang hiện diện — không tiên đoán, không chẩn đoán và không quyết định thay bạn.",
  ],
  [
    "Các chương trình có thay thế trị liệu tâm lý hoặc y khoa không?",
    "Không. Các hoạt động mang tính giáo dục, trải nghiệm và phát triển cá nhân; không chẩn đoán, không kê đơn và không thay thế can thiệp y khoa, tâm thần học hoặc tâm lý lâm sàng.",
  ],
  [
    "Chi phí và lịch cụ thể xem ở đâu?",
    "Thông tin được nêu trên trang chi tiết của từng chương trình khi đã xác nhận. Lịch và chi phí mới nhất sẽ được đội ngũ xác nhận khi bạn nhắn.",
  ],
  [
    "Website có lưu thông tin cá nhân của tôi không?",
    "Không. Website không có biểu mẫu thu thập thông tin. Nội dung bạn gửi qua Zalo / Facebook thuộc phạm vi của nền tảng đó.",
  ],
]

/**
 * Trang Câu hỏi thường gặp; dùng `<details>` gốc để mở/đóng bằng bàn phím.
 *
 * @returns Trang FAQ
 */
function FaqPage() {
  return (
    <main className="cream-page faq-page">
      <PageHero
        eyebrow="FAQ · CÂU HỎI THƯỜNG GẶP"
        title="Trước khi"
        italic="bạn nhắn cho chúng tôi."
        intro="Những điều thường được hỏi về cách liên hệ, hình thức tham gia và giới hạn hỗ trợ của INNER ARCHITECT™."
      />
      <section className="faq-list section-pad">
        {danhSachCauHoiThuongGap.map(([cauHoi, traLoi]) => (
          <details key={cauHoi}>
            <summary className="serif">{cauHoi}</summary>
            <p>{traLoi}</p>
          </details>
        ))}
      </section>
      <section className="simple-content section-pad">
        <div>
          <h2 className="serif">Vẫn còn câu hỏi?</h2>
        </div>
        <div>
          <KenhLienHeChung />
          <Link to="/lien-he" className="underlink">
            Xem trang liên hệ →
          </Link>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

/**
 * Trang pháp lý dạng văn bản ngắn (Chính sách bảo mật, Phạm vi hỗ trợ).
 * Nội dung đang là bản nháp mô tả đúng hành vi hiện tại của website và cần
 * chủ thương hiệu / tư vấn pháp lý duyệt trước khi phát hành.
 *
 * @param props.loai - Loại trang pháp lý cần hiển thị
 * @returns Trang pháp lý
 */
function LegalPage({ loai }: { loai: "bao-mat" | "pham-vi" }) {
  const noiDung =
    loai === "bao-mat"
      ? {
          eyebrow: "CHÍNH SÁCH BẢO MẬT",
          title: "Chính sách",
          italic: "bảo mật.",
          intro:
            "Mô tả cách website INNER ARCHITECT™ xử lý thông tin của người truy cập.",
          muc: [
            [
              "Thông tin website thu thập",
              "Website không có biểu mẫu, tài khoản, giỏ hàng hay hệ thống đặt lịch, và không yêu cầu bạn nhập thông tin cá nhân hoặc thông tin sức khỏe.",
            ],
            [
              "Kênh liên hệ bên thứ ba",
              "Khi bấm liên hệ, bạn được chuyển sang Zalo hoặc Facebook. Nội dung bạn gửi ở đó được xử lý theo chính sách của nền tảng tương ứng và được đội ngũ INNER ARCHITECT™ dùng để phản hồi yêu cầu của bạn.",
            ],
            [
              "Đo lường truy cập",
              "Hiện website chưa bật công cụ phân tích truy cập. Nếu bổ sung trong tương lai, chính sách này sẽ được cập nhật trước khi áp dụng.",
            ],
            [
              "Liên hệ về quyền riêng tư",
              `Gửi câu hỏi về quyền riêng tư tới ${EMAIL_LIEN_HE}.`,
            ],
          ],
        }
      : {
          eyebrow: "TUYÊN BỐ PHẠM VI HỖ TRỢ",
          title: "Phạm vi",
          italic: "hỗ trợ.",
          intro:
            "Các nguyên tắc giới hạn áp dụng cho mọi hoạt động trong hệ sinh thái INNER ARCHITECT™.",
          muc: [
            [
              "Không thay thế chuyên môn y tế",
              "Hệ thống không chẩn đoán, không kê đơn và không thay thế can thiệp y khoa, tâm thần học hoặc tâm lý lâm sàng.",
            ],
            [
              "Không tiên đoán, không quyết định thay",
              "Tarot là bề mặt biểu tượng để quan sát điều đang hiện diện. Quyền lựa chọn và trách nhiệm luôn thuộc về chính bạn.",
            ],
            [
              "Không hứa hẹn tuyệt đối, không tạo phụ thuộc",
              "Phát triển bản thân là tiến trình thực hành trong đời sống thật. Mục tiêu là phục hồi khả năng tự điều chỉnh và tự dẫn dắt.",
            ],
            [
              "Khi vượt ngoài phạm vi an toàn",
              "Người điều phối sẽ dừng phiên và hướng dẫn chuyển gửi tới hỗ trợ phù hợp. Trong tình huống khẩn cấp, hãy gọi 115 hoặc đến cơ sở y tế gần nhất.",
            ],
          ],
        }
  return (
    <main className="cream-page legal-page">
      <PageHero
        eyebrow={noiDung.eyebrow}
        title={noiDung.title}
        italic={noiDung.italic}
        intro={noiDung.intro}
      />
      <section className="faq-list section-pad">
        {noiDung.muc.map(([tieuDe, doan]) => (
          <article key={tieuDe}>
            <h2 className="serif">{tieuDe}</h2>
            <p>{doan}</p>
          </article>
        ))}
        <p className="legal-status">
          Bản nháp — chờ chủ thương hiệu duyệt trước khi phát hành.
        </p>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

/**
 * Trang 404 cho đường dẫn, bài viết hoặc chương trình không tồn tại.
 *
 * @returns Trang không tìm thấy
 */
function NotFoundPage() {
  return (
    <main className="cream-page not-found-page">
      <PageHero
        eyebrow="404 · KHÔNG TÌM THẤY TRANG"
        title="Trang này"
        italic="không còn ở đây."
        intro="Đường dẫn có thể đã thay đổi hoặc chưa từng tồn tại. Bạn có thể quay về trang chủ, đọc Journal hoặc liên hệ trực tiếp với chúng tôi."
      />
      <section className="simple-content section-pad">
        <div>
          <Link to="/" className="button-link">
            Về trang chủ
          </Link>
        </div>
        <div>
          <Link to="/journal" className="underlink">
            Đọc Journal →
          </Link>
          <br />
          <Link to="/lien-he" className="underlink">
            Liên hệ →
          </Link>
        </div>
      </section>
    </main>
  )
}

/** Tiêu đề và mô tả SEO của một trang. */
type ThongTinSeo = {
  title: string
  description: string
}

/** Tiêu đề và mô tả mặc định của site, dùng khi route không có SEO riêng. */
const SEO_MAC_DINH = {
  title: "INNER ARCHITECT™ — Xây trật tự bên trong",
  description:
    "INNER ARCHITECT™ — hệ sinh thái trà đạo có hướng dẫn, Tarot phản tư, đồng hành 1:1, workshop, Academy và sản phẩm LARA tại TP. Hồ Chí Minh.",
}

/** Tiêu đề và mô tả theo từng route tĩnh. */
const seoTheoDuongDan: Record<
  string,
  ThongTinSeo & {
    giuNguyenTieuDe?: boolean
  }
> =
  {
    "/journal": {
      title: "Journal",
      description:
        "Thư viện chiêm nghiệm về Tarot, tâm lý học và đời sống nội tâm của INNER ARCHITECT™.",
    },
    "/chuong-trinh": {
      title: "Chương trình",
      description:
        "Trải nghiệm, đồng hành cá nhân và Academy của INNER ARCHITECT™, thiết kế theo mức độ sẵn sàng và phạm vi hỗ trợ.",
    },
    "/the-hermit": {
      title: "The Hermit",
      description:
        "The Hermit — không gian café, trà đạo và Tarot thuộc hệ sinh thái INNER ARCHITECT™ tại TP. Hồ Chí Minh.",
    },
    "/vo-khiem": {
      title: "Võ Khiêm | Founder INNER ARCHITECT™",
      description:
        "Võ Khiêm — người sáng lập INNER ARCHITECT™ System, hoạt động trong lĩnh vực Tarot phản tư, chia sẻ kiến thức và phát triển bản thân.",
      giuNguyenTieuDe: true,
    },
    "/lara": {
      title: "LARA",
      description:
        "LARA — nhánh sản phẩm hương thơm cho những khoảng nghỉ và nghi thức cá nhân.",
    },
    "/lien-he": {
      title: "Liên hệ",
      description:
        "Liên hệ INNER ARCHITECT™ qua một kênh Zalo / Facebook chung cho trà đạo, Tarot, đồng hành 1:1, workshop, Academy và sản phẩm.",
    },
    "/faq": {
      title: "Câu hỏi thường gặp",
      description:
        "Giải đáp về cách liên hệ, hình thức tham gia và giới hạn hỗ trợ của INNER ARCHITECT™.",
    },
    "/chinh-sach-bao-mat": {
      title: "Chính sách bảo mật",
      description: "Cách website INNER ARCHITECT™ xử lý thông tin người truy cập.",
    },
    "/pham-vi-ho-tro": {
      title: "Tuyên bố phạm vi hỗ trợ",
      description:
        "Các nguyên tắc giới hạn áp dụng cho mọi hoạt động trong hệ sinh thái INNER ARCHITECT™.",
    },
  }

/**
 * Xác định tiêu đề và mô tả SEO cho một đường dẫn đã chuẩn hóa.
 *
 * @param duongDan - Đường dẫn hash đã chuẩn hóa, ví dụ `/journal/cham-ngo-tarot`
 * @param laTrang404 - `true` nếu đường dẫn không khớp nội dung nào
 * @returns Cặp `title` (đã gắn tên thương hiệu) và `description`
 */
function layThongTinSeo(
  duongDan: string,
  laTrang404: boolean,
): ThongTinSeo {
  const ganThuongHieu = (tieuDe: string) => `${tieuDe} — INNER ARCHITECT™`
  if (laTrang404)
    return {
      title: ganThuongHieu("Không tìm thấy trang"),
      description: SEO_MAC_DINH.description,
    }
  const baiViet = duongDan.startsWith("/journal/")
    ? news.find((item) => `/journal/${item.slug}` === duongDan)
    : undefined
  if (baiViet)
    return { title: ganThuongHieu(baiViet.title), description: baiViet.summary }
  const chuongTrinh = duongDan.startsWith("/chuong-trinh/")
    ? danhSachChiTietChuongTrinh[duongDan.slice("/chuong-trinh/".length)]
    : undefined
  if (chuongTrinh)
    return {
      title: ganThuongHieu(chuongTrinh.tieuDe),
      description: chuongTrinh.doanDan,
    }
  const tinh = seoTheoDuongDan[duongDan]
  if (tinh)
    return {
      title: tinh.giuNguyenTieuDe ? tinh.title : ganThuongHieu(tinh.title),
      description: tinh.description,
    }
  return SEO_MAC_DINH
}

/**
 * Ghi tiêu đề trang và các thẻ meta mô tả vào `<head>`.
 * Tác dụng phụ: sửa `document.title`, tạo thẻ meta nếu chưa có.
 *
 * @param seo - Tiêu đề và mô tả cần áp dụng
 */
function capNhatThongTinSeo(seo: ThongTinSeo) {
  document.title = seo.title
  const thuocTinh: [string, string, string][] = [
    ["name", "description", seo.description],
    ["property", "og:title", seo.title],
    ["property", "og:description", seo.description],
  ]
  thuocTinh.forEach(([khoa, ten, giaTri]) => {
    let the = document.head.querySelector<HTMLMetaElement>(
      `meta[${khoa}="${ten}"]`,
    )
    if (!the) {
      the = document.createElement("meta")
      the.setAttribute(khoa, ten)
      document.head.appendChild(the)
    }
    the.content = giaTri
  })
}

/**
 * Chuẩn hóa đường dẫn hash: bỏ query, bỏ dấu `/` cuối và ánh xạ route cũ.
 * `/booking` (form đặt lịch đã gỡ) được chuyển sang `/lien-he`.
 *
 * @param duongDanTho - Phần sau dấu `#` của URL
 * @returns Đường dẫn chuẩn, luôn bắt đầu bằng `/`
 */
function chuanHoaDuongDan(duongDanTho: string): string {
  let duongDan = duongDanTho.split("?")[0] || "/"
  if (!duongDan.startsWith("/")) duongDan = `/${duongDan}`
  if (duongDan.length > 1) duongDan = duongDan.replace(/\/+$/, "")
  if (duongDan === "/booking") return "/lien-he"
  return duongDan
}

// Kiểu props đặt tên riêng: oxfmt 0.2.0 gộp kiểu inline ngắn thành một dòng rồi bỏ `;`.
type ParentLinkProps = {
  to: string
  label: string
}

function ParentLink({ to, label }: ParentLinkProps) {
  return (
    <div className="parent-link">
      <Link to={to}>← {label}</Link>
    </div>
  )
}

/**
 * Chọn component trang cho một đường dẫn đã chuẩn hóa.
 *
 * @param path - Đường dẫn hash đã qua `chuanHoaDuongDan`
 * @returns Phần tử trang và cờ `laTrang404` khi không có nội dung tương ứng
 */
function chonTrang(path: string): {
  trang: React.ReactNode
  laTrang404: boolean
} {
  const trang = (node: React.ReactNode) => ({ trang: node, laTrang404: false })
  if (path === "/") return trang(<Home />)
  if (path === "/he-thong") return trang(<Home initialSection="he-thong" />)
  if (path === "/journal")
    return trang(
      <JournalPage baiViet={news} chuyenDe={signatureSeriesList} />,
    )
  if (path.startsWith("/journal/")) {
    const slug = path.slice("/journal/".length)
    if (news.some((item) => item.slug === slug))
      return trang(<Article slug={slug} />)
  }
  if (path === "/chuong-trinh") return trang(<Programmes />)
  if (path.startsWith("/chuong-trinh/")) {
    const slug = path.slice("/chuong-trinh/".length)
    if (danhSachChiTietChuongTrinh[slug])
      return trang(<Programmes detail={slug} />)
  }
  if (path === "/the-hermit") return trang(<Hermit />)
  if (path === "/vo-khiem") return trang(<FounderPage />)
  if (path === "/lara") return trang(<LaraPage />)
  if (path === "/lien-he") return trang(<ContactPage />)
  if (path === "/faq") return trang(<FaqPage />)
  if (path === "/chinh-sach-bao-mat") return trang(<LegalPage loai="bao-mat" />)
  if (path === "/pham-vi-ho-tro") return trang(<LegalPage loai="pham-vi" />)
  return { trang: <NotFoundPage />, laTrang404: true }
}

function App() {
  const [path, setPath] = useState(() =>
    chuanHoaDuongDan(window.location.hash.slice(1)),
  )
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const f = () => {
      const tho = window.location.hash.slice(1)
      const chuan = chuanHoaDuongDan(tho)
      // Đường dẫn cũ (vd. #/booking) được thay trong lịch sử để không lưu URL lỗi thời.
      if (tho.split("?")[0] === "/booking") window.location.replace(`#${chuan}`)
      setPath(chuan)
      setMenu(false)
    }
    f()
    addEventListener("hashchange", f)
    return () => removeEventListener("hashchange", f)
  }, [])
  useEffect(() => {
    let observer: IntersectionObserver | undefined
    const frame = requestAnimationFrame(() => {
      const targets = document.querySelectorAll<HTMLElement>(
        "main:not(.hermit-page):not(.founder-page):not(.journal-page) > section:not(.hero):not(.hermit-hero):not(.home-stage), .news-card, .profile-principles article",
      )
      targets.forEach((target) => target.classList.add("reveal-on-scroll"))
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible")
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
      )
      targets.forEach((target) => observer?.observe(target))
    })
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [path])
  const { trang: page, laTrang404 } = useMemo(() => chonTrang(path), [path])
  useEffect(() => {
    capNhatThongTinSeo(layThongTinSeo(path, laTrang404))
  }, [path, laTrang404])
  const isHomeView = path === "/" || path === "/he-thong"
  return (
    <>
      <Header open={menu} setOpen={setMenu} home={path === "/"} />
      <div key={isHomeView ? "home-view" : path} className="page-transition">
        {page}
      </div>
      <Footer home={path === "/"} />
    </>
  )
}

export default App
