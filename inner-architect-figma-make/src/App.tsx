import { useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const IMG = {
  homeHero: "/assets/homepage/tarot-table-candle-placeholder.jpeg",
  homeTarotIntroduction: "/assets/homepage/home-tarot-introduction.webp",
  homeAuthorCover: "/assets/homepage/home-author-cover.webp",
  homeAuthorPortrait: "/assets/homepage/home-author-portrait.webp",
  homeNewCafe: "/assets/home-new/cafe-tarot-Pn1YNV38.jpg",
  homeNewSession: "/assets/home-new/intensive-session-CbAwiJs9.jpg",
  homeNewWorkshop: "/assets/home-new/workshop-group-Ccj38COW.jpg",
  homeNewSystem: "/assets/home-new/8c540421-3d9f-4c3b-bdc0-e0801d698b8f.jpg",
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
  homeStorySession: "/assets/home-story/first-session.png",
  homeStoryReflective: "/assets/home-story/reflective-practice.png",
  homeStoryHermit: "/assets/home-story/the-hermit-room.png",
  workshopArt: "/assets/workshop/ws-cham-ve-diu-lai-CMQz-7CG.png",
  journalReading: "/assets/journal/journal-tarot-reading-horizontal.webp",
  journalBox: "/assets/journal/journal-tarot-box-portrait.webp",
  journalFlatlay: "/assets/journal/journal-tarot-flatlay-vertical.webp",
  journalSpread: "/assets/journal/journal-tarot-spread-vertical.webp",
  journalSelfDiscovery: "/assets/journal/doc-image1.jpg",
  journalRelationships: "/assets/journal/doc-image2.jpg",
  journalWisdom: "/assets/journal/doc-image3.jpg",
  journalTarotHermit: "/assets/journal/doc-image4.jpg",
  journalMindful: "/assets/journal/doc-image5.jpg",
  journalHermitStories: "/assets/journal/doc-image6.jpg",
  founderOffice: "/assets/system/founder-office-placeholder.webp",
  founderGraphic: "/assets/homepage/home-author-portrait.webp",
  hermitStorefront: "/assets/the-hermit/storefront-placeholder.webp",
  hermitHall: "/assets/the-hermit/main-hall-placeholder.webp",
  hermitTeaRoom: "/assets/the-hermit/tea-room-placeholder.png",
  hermitTarotRoom: "/assets/the-hermit/tarot-room-placeholder.webp",
  hermitLockup: "/assets/brand/the-hermit-lockup-source.webp",
  laraHero: "/assets/lara/lara-autumn-collage-source.jpeg",
  laraCollage: "/assets/lara/lara-product-collage.webp",
  laraGourdDetails: "/assets/lara/lara-gourd-product-details.webp",
  laraGourdUse: "/assets/lara/lara-gourd-use.webp",
  soulCleanse: "/assets/lara/lara-soul-cleanse.webp",
  sacredGround: "/assets/lara/lara-sacred-ground.webp",
  soulEmbrace: "/assets/lara/lara-soul-embrace.webp",
  // Compatibility aliases retained for existing page modules while the asset
  // vocabulary stays tied to the appropriate editorial context.
  tarot: "/assets/journal/journal-tarot-reading-horizontal.webp",
  tarot2: "/assets/journal/journal-tarot-box-portrait.webp",
  tarot3: "/assets/journal/journal-tarot-flatlay-vertical.webp",
  tarot4: "/assets/journal/journal-tarot-spread-vertical.webp",
  room: "/assets/the-hermit/main-hall-placeholder.webp",
  hero: "/assets/system/founder-office-placeholder.webp",
  stone: "/assets/the-hermit/storefront-placeholder.webp",
  stair: "/assets/system/founder-office-placeholder.webp",
  founder: "/assets/system/founder-office-placeholder.webp",
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
    image: IMG.journalSpread,
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
 * Đếm số lượng bài viết thuộc một chuyên mục cụ thể trong Journal.
 *
 * @param chuyenMuc - Tên chuyên mục cần lọc hoặc "Tất cả"
 * @returns Số lượng bài viết tương ứng
 */
function demSoLuongBaiVietTheoChuyenMuc(chuyenMuc: string): number {
  if (chuyenMuc === "Tất cả") return news.length
  return news.filter(
    (item) => item.category.toUpperCase() === chuyenMuc.toUpperCase(),
  ).length
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
    nhan: "Đặt lịch",
    duongDan: "/booking",
    moTa: "Phiên tiếp cận ban đầu 1:1",
    anhPreview: IMG.homeGeneratedSessionEntry,
  },
]

/**
 * Cuộn mượt màn hình đến phần tử có ID tương ứng trên trang.
 * @param {string} idPhanTu - ID của phần tử mục tiêu (không kèm dấu #)
 * @returns {void}
 */
function cuonDenPhanTu(idPhanTu: string): void {
  const element = document.getElementById(idPhanTu)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

/**
 * Điều hướng người dùng tới đường dẫn hash tương ứng hoặc cuộn mượt đến phần tử.
 * @param {string} path - Đường dẫn mục tiêu
 * @returns {void}
 */
function go(path: string): void {
  if (path === "/he-thong" || path === "/#he-thong" || path === "#he-thong") {
    if (window.location.hash === "" || window.location.hash === "#/") {
      cuonDenPhanTu("he-thong")
      return
    }
    window.location.hash = "/"
    setTimeout(() => cuonDenPhanTu("he-thong"), 120)
    return
  }
  window.location.hash = path
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function Link({
  to,
  children,
  className = "",
  onClick,
}: {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
        go(to)
      }}
    >
      {children}
    </a>
  )
}

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
          <Link to="/journal">Journal</Link>
          <Link to="/chuong-trinh">Chương trình</Link>
          <Link to="/the-hermit">The Hermit</Link>
        </nav>
        <span className="language">VI</span>
        <Link to="/booking" className="book-link">
          Đặt lịch
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
                </div>
                <p className="menu-contact-info">
                  info@innerarchitect.vn · TP. Hồ Chí Minh · VI / EN
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
          Đặt lịch cho một phiên tiếp cận ban đầu để làm rõ trạng thái hiện tại,
          nhu cầu và bước tiếp theo phù hợp.
        </p>
        <Link to="/booking" className="footer-cta">
          Đặt lịch phiên tiếp cận
        </Link>
        <div className="home-footer-nav">
          <span>INNER ARCHITECT™</span>
          <Link to="/he-thong">Hệ thống</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/chuong-trinh">Chương trình</Link>
          <Link to="/the-hermit">The Hermit</Link>
          <Link to="/booking">Đặt lịch</Link>
          <Link to="/vo-khiem">Võ Khiêm</Link>
          <Link to="/lara">LARA</Link>
          <span>Instagram</span>
          <span>Facebook</span>
          <span>info@innerarchitect.vn</span>
          <span>Chính sách bảo mật</span>
          <span>Tuyên bố phạm vi hỗ trợ</span>
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
        <div className="newsletter">
          <label>Nhận bài viết mới từ Journal</label>
          <div className="email-row">
            Họ tên <span>→</span>
          </div>
          <div className="email-row">
            Email <span>Đăng ký</span>
          </div>
        </div>
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
          <Link to="/booking">Đặt lịch phiên tiếp cận</Link>
          <br />
          info@innerarchitect.vn
          <br />
          637/13/8 Quang Trung, Phường Thông Tây Hội, TP. Hồ Chí Minh
        </div>
        <div>
          <b>THÔNG TIN</b>
          <br />
          <Link to="/he-thong">Đạo đức và ranh giới</Link>
          <br />
          Chính sách bảo mật
          <br />
          CÔNG TY TNHH INNER ARCHITECT
          <br />
          MST: 0319353708
          <br />
          VI / EN
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
    <div className="inviewfade" style={{ transitionDelay: `${delayMs}ms` }}>
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
      to: "/booking",
      action: "Đặt lịch",
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
        <p className="home-v3-hero-brand">INNER ARCHITECT™</p>
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
            <Link to="/booking" className="home-v3-link home-v3-link-light">
              Đặt lịch một phiên tiếp cận
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
          <Link to="/booking" className="home-v3-link">
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
          <Link to="/booking" className="home-v3-link">
            Đặt lịch phiên tiếp cận
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
          <Link to="/booking" className="home-v3-link home-v3-link-light">
            Đặt lịch một phiên tiếp cận
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

function NewsArchive() {
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
  }, [])

  return (
    <main className="cream-page journal-editorial-page">
      <PageHero
        eyebrow="JOURNAL · INNER ARCHITECT™"
        title="Explore Within"
        italic="Reflect Deeply · Transform Consciously"
        intro="Thư viện tri thức và chiêm nghiệm chuyên sâu. Nơi tập hợp các bài viết giúp người đọc quan sát biểu tượng, mô thức tâm lý và trải nghiệm bên trong bằng ngôn ngữ rõ ràng, có ranh giới an toàn và gắn liền với đời sống thực tế."
      />
      <section className="featured-article">
        <img src={news[0].image} alt={news[0].title} />
        <div>
          <p className="eyebrow">FEATURED · {news[0].category} · {news[0].date}</p>
          <h2 className="serif">
            {news[0].title}
            <br />
            <em>{news[0].italic}</em>
          </h2>
          <p className="featured-summary">{news[0].summary}</p>
          <Link
            to={`/journal/${news[0].slug}`}
            className="underlink"
          >
            Đọc bài viết tiêu điểm →
          </Link>
        </div>
      </section>

      {/* SECTION: NEWS & WORKSHOPS (CHUẨN CẤU TRÚC & ANIMATION OGATA PARIS) */}
      <section className="ogata-news-section" id="workshops">
        <h2 className="ogata-section-heading inviewfade">CHUYÊN MỤC BÀI VIẾT</h2>

        <div className="ogata-news-grid">
          {news.map((item, idx) => (
            <NewsCard key={item.slug} item={item} index={idx} />
          ))}
        </div>

        <div
          style={{ maxWidth: "500px", margin: "55px auto 0", padding: "0 50px" }}
          className="inviewfade"
        >
          <button className="ogata-top-link2">XEM TOÀN BỘ BÀI VIẾT</button>
        </div>
      </section>

      {/* Signature Series Spotlight */}
      <section className="journal-series-section section-pad">
        <div className="series-header">
          <p className="eyebrow">SIGNATURE SERIES · CHUYÊN ĐỀ DÀI HẠN</p>
          <h2 className="serif">Ba hành trình chiêm nghiệm chuyên sâu</h2>
          <p className="series-intro">
            Tạo bản sắc học thuật và chiều sâu cho Journal, giúp người đọc theo dõi theo chuỗi bài có hệ thống và chuyển hóa từng bước.
          </p>
        </div>
        <div className="series-grid">
          {signatureSeriesList.map((series) => (
            <article key={series.id} className="series-card">
              <div className="series-badge-row">
                <span className="series-number">{series.count}</span>
                <span className="series-tag">{series.tag}</span>
              </div>
              <h3 className="serif">{series.title}</h3>
              <p className="series-sub">{series.subtitle}</p>
              <p className="series-desc">{series.description}</p>
              <div className="series-footer">
                <span className="series-status-pill">Đang xuất bản định kỳ</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-invite section-pad">
        <p className="eyebrow">NEWSLETTER · SLOW READING LIST</p>
        <h2 className="serif">Nhận bài viết mới từ Journal</h2>
        <p>Tuyển tập chiêm nghiệm chậm về Tarot, tâm lý học và đời sống nội tâm gửi tới bạn định kỳ.</p>
        <div className="email-row">
          Email của bạn <span>→</span>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
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

const layers = [
  [
    "01",
    "Tiếp cận ban đầu",
    "Tạo một ảnh chụp có giới hạn về trạng thái hiện tại, nhu cầu và mức độ phù hợp trước khi đi sâu.",
  ],
  [
    "02",
    "Chữa lành và tái cấu trúc",
    "Nhận diện mô thức, nguồn lực và xây dựng lại cách phản hồi trong một khung làm việc an toàn.",
  ],
  [
    "03",
    "Định hướng và giữ trục",
    "Chuyển hiểu biết thành lựa chọn, ranh giới và nhịp sống có thể duy trì trong đời sống thật.",
  ],
  [
    "04",
    "Điều tiết thân và năng lượng",
    "Làm việc với cơ thể, nhịp thở và cảm giác để mở lại khả năng tự điều chỉnh.",
  ],
]
function SystemPage() {
  const scroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  return (
    <main>
      <section className="project-hero">
        <img src={IMG.stair} alt="" />
        <div>
          <p>THE INNER ARCHITECT SYSTEM®</p>
          <h1 className="serif">
            Tái cấu trúc nội tâm
            <br />
            <em>để sống tự chủ.</em>
          </h1>
        </div>
      </section>
      <nav className="local-nav">
        <button onClick={() => scroll("tong-quan")}>Tổng quan</button>
        <button onClick={() => scroll("bon-tang")}>Bốn tầng</button>
        <button onClick={() => scroll("dao-duc")}>Đạo đức</button>
        <button onClick={() => scroll("phu-hop")}>Phù hợp với ai</button>
      </nav>
      <section id="tong-quan" className="project-meta section-pad">
        <p>
          Loại hình
          <br />
          Integrated Healing System
        </p>
        <p>
          Phạm vi
          <br />
          Nhận thức · Cảm xúc · Cơ thể
        </p>
        <p>
          Địa điểm
          <br />
          TP. Hồ Chí Minh / Online
        </p>
        <h2 className="serif">
          Một hệ thống tích hợp nhận thức, cảm xúc, thân thể và đời sống thực -
          với phạm vi, ranh giới và điểm kết rõ ràng.
        </h2>
      </section>
      <section className="system-narrative section-pad">
        <div>
          <p className="eyebrow">THE MISSING STRUCTURE</p>
          <blockquote className="serif">
            “Con người không thiếu thêm lời khuyên. Điều thường thiếu là một cấu
            trúc đủ an toàn để tự nhìn rõ.”
          </blockquote>
        </div>
        <div>
          <h2 className="serif">
            Từ chữa lành như một lời hứa đến tự chủ như một năng lực.
          </h2>
          <p>
            INNER ARCHITECT™ được hình thành trước một thị trường dễ tạo phụ
            thuộc vào chuyên gia, biểu tượng hoặc câu trả lời nhanh. Sứ mệnh của
            hệ thống là nối nhận thức, cảm xúc, cơ thể và hành động thành một
            tiến trình có điểm vào, điểm kết và chuyển pha rõ ràng.
          </p>
        </div>
      </section>
      <section id="bon-tang" className="layer-chapters">
        {layers.map((l, i) => (
          <article key={l[0]}>
            <div>
              <span>{l[0]}</span>
              <h2 className="serif">{l[1]}</h2>
              <p>{l[2]}</p>
              {i < 3 && (
                <small>
                  Chuyển tầng chỉ diễn ra khi nền tảng trước đó đủ ổn định.
                </small>
              )}
            </div>
            <img src={[IMG.hero, IMG.tarot2, IMG.stone, IMG.room][i]} alt="" />
          </article>
        ))}
      </section>
      <section id="dao-duc" className="ethics section-pad">
        <p className="eyebrow">ETHICS & BOUNDARIES</p>
        <h2 className="serif">
          An toàn đi trước
          <br />
          chiều sâu.
        </h2>
        <p>
          Không hứa hẹn tuyệt đối. Không tiên đoán. Không quyết định thay. Không
          xây dựng sự phụ thuộc. Hệ thống không chẩn đoán và không thay thế hỗ
          trợ tâm lý, tâm thần hoặc y khoa; khi cần, người tham gia được đề xuất
          hình thức hỗ trợ chuyên môn phù hợp hơn.
        </p>
      </section>
      <section id="phu-hop" className="simple-content section-pad">
        <div>
          <p className="eyebrow">SUITABILITY</p>
          <h2 className="serif">Phù hợp khi bạn sẵn sàng tham gia chủ động.</h2>
        </div>
        <div>
          <p>
            Phù hợp với người muốn nhìn lại mô thức và thử những thay đổi vừa
            sức. Không phù hợp với tình trạng cấp cứu, nhu cầu chẩn đoán hoặc
            mong muốn có người quyết định thay.
          </p>
          <p>
            Mục tiêu dài hạn không phải ở lại trong hệ thống, mà là phục hồi khả
            năng tự điều chỉnh và tự dẫn dắt.
          </p>
          <Link to="/booking" className="button-link">
            Bắt đầu bằng phiên tiếp cận
          </Link>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

function Workshop({ detail = false }: { detail?: boolean }) {
  if (detail)
    return (
      <main>
        <PageHero
          eyebrow="TRẢI NGHIỆM · [NGÀY TỔ CHỨC: CẬP NHẬT]"
          title="Chạm -"
          italic="Vẽ để dịu lại"
          intro="Dành cho người muốn chậm nhịp và tiếp cận cảm giác qua màu sắc, không cần kinh nghiệm hội họa."
        />
        <section className="detail-lead">
          <img src={IMG.tarot3} alt="" />
          <div>
            <p>
              [Thời lượng: xác nhận]
              <br />
              [Địa điểm: xác nhận]
              <br />
              [Học phí: xác nhận]
            </p>
            <h2 className="serif">
              Không cần biết vẽ.
              <br />
              Chỉ cần có mặt.
            </h2>
            <p>
              Không gian nhóm nhỏ sử dụng hơi thở, sự chú ý vào cơ thể và vẽ
              trực giác để hỗ trợ người tham gia trở về hiện tại mà không cần
              phân tích quá nhiều.
            </p>
            <p>
              <strong>Ranh giới:</strong> đây không phải liệu pháp nghệ thuật
              hoặc hình thức điều trị.
            </p>
            <Link to="/booking" className="button-link">
              Gửi yêu cầu đăng ký
            </Link>
          </div>
        </section>
        <ParentLink to="/chuong-trinh" label="Tất cả chương trình" />
      </main>
    )
  return (
    <main>
      <PageHero
        eyebrow="WORKSHOP & EXPERIENCES"
        title="Những không gian"
        italic="để thực hành cùng nhau"
        intro="Các trải nghiệm có thời lượng, mục đích và ranh giới rõ ràng — từ một buổi chạm ngõ đến những chuỗi thực hành sâu."
      />
      <section className="irregular section-pad">
        <Link to="/chuong-trinh/cham-ve-de-diu-lai" className="event large">
          <img src={IMG.tarot3} alt="" />
          <span>[NGÀY TỔ CHỨC: CẬP NHẬT]</span>
          <h2 className="serif">Chạm — Vẽ để dịu lại</h2>
        </Link>
        <div className="event">
          <img src={IMG.room} alt="" />
          <span>PAST · THE HERMIT</span>
          <h2 className="serif">Ngồi cùng sự im lặng</h2>
        </div>
        <div className="event">
          <img src={IMG.stone} alt="" />
          <span>PAST · INNER WORK</span>
          <h2 className="serif">Ranh giới mềm, trục vững</h2>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

function Academy({ detail = false }: { detail?: boolean }) {
  if (detail)
    return (
      <main>
        <PageHero
          eyebrow="ACADEMY · FOUNDATION PROGRAMME"
          title="Tarot"
          italic="Căn Bản"
          intro="Học cách đọc hình ảnh, đặt câu hỏi và giữ ranh giới đạo đức trước khi học cách diễn giải."
        />
        <section className="curriculum section-pad">
          <div>
            <p>
              Dành cho người bắt đầu hoặc muốn xây lại nền tảng.
              <br />
              <br />
              [Thời lượng: xác nhận]
              <br />
              [Lịch học: cập nhật]
              <br />
              [Học phí: xác nhận]
            </p>
            <Link to="/booking" className="button-link">
              Nhận thông tin tuyển sinh
            </Link>
          </div>
          <div>
            <h2 className="serif">Nội dung chương trình</h2>
            {[
              "Ngôn ngữ biểu tượng",
              "Cấu trúc một phiên đọc",
              "Câu hỏi và phản hồi",
              "Đạo đức & giới hạn",
              "Thực hành có giám sát",
            ].map((x, i) => (
              <p className="course-row" key={x}>
                <span>0{i + 1}</span>
                {x}
              </p>
            ))}
            <p>
              <strong>Ranh giới chuyên môn</strong>
              <br />
              Chương trình không cấp năng lực chẩn đoán hay điều trị. Học viên
              thực hành trong phạm vi được hướng dẫn và giám sát.
            </p>
          </div>
        </section>
        <ParentLink to="/chuong-trinh" label="Tất cả chương trình" />
      </main>
    )
  return (
    <main>
      <PageHero
        eyebrow="INNER ARCHITECT™ ACADEMY"
        title="Học có cấu trúc."
        italic="Thực hành có trách nhiệm."
        intro="Chương trình dành cho người muốn xây nền tảng Tarot và tâm lý ứng dụng mà không tách rời đạo đức nghề nghiệp."
      />
      <section className="programmes section-pad">
        {[
          ["01", "Tarot Căn Bản", "Nền tảng"],
          ["02", "Tarot Nâng Cao", "Diễn giải"],
          ["03", "Tarot Healer", "Tích hợp"],
          ["04", "Psychology Topics", "Chuyên đề"],
        ].map((x, i) => (
          <Link to={i === 0 ? "/academy/tarot-can-ban" : "/contact"} key={x[0]}>
            <span>{x[0]}</span>
            <h2 className="serif">{x[1]}</h2>
            <em>{x[2]}</em>
            <b>→</b>
          </Link>
        ))}
      </section>
      <ParentLink to="/" label="Về trang chủ" />
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
    nutHanhDong: "Đặt lịch phiên tiếp cận",
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
    nutHanhDong: "Đăng ký tham gia workshop",
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
    nutHanhDong: "Gửi yêu cầu đăng ký",
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
    nutHanhDong: "Đăng ký trải nghiệm nhóm",
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
    nutHanhDong: "Đặt lịch phiên tiếp cận",
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
    nutHanhDong: "Đăng ký tham vấn chuyên sâu",
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
    nutHanhDong: "Gửi thư bày tỏ nguyện vọng",
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
    nutHanhDong: "Nhận thông tin tuyển sinh",
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
    nutHanhDong: "Đăng ký xét tuyển khóa nâng cao",
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
    nutHanhDong: "Nộp hồ sơ ứng tuyển Healer",
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
    nutHanhDong: "Xem lịch các chuyên đề sắp tới",
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
            <Link to="/booking" className="button-link">
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

  const families = [
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
        <Link to="/booking" className="button-link">
          Đặt lịch phiên tiếp cận
        </Link>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

function LegacyHermit() {
  return (
    <main>
      <section className="project-hero">
        <img src={IMG.stone} alt="" />
        <div>
          <p>THE HERMIT · TP. HỒ CHÍ MINH</p>
          <h1 className="serif">
            Một khoảng lặng
            <br />
            <em>có chủ đích.</em>
          </h1>
        </div>
      </section>
      <section className="space-story section-pad">
        <img
          className="space-overview"
          src={IMG.hero}
          alt="Hình minh họa sảnh chính The Hermit, cần xác minh trước khi xuất bản"
        />
        <div>
          <p className="eyebrow">THE SPACE</p>
          <h2 className="serif">
            Không gian là một phần của cách chúng tôi làm việc.
          </h2>
        </div>
        <p>
          The Hermit là không gian café, trà đạo và Tarot thuộc hệ sinh thái
          INNER ARCHITECT™ - nơi một người có thể bắt đầu bằng sự quan sát nhẹ
          nhàng trước khi quyết định có cần một tiến trình sâu hơn hay không.
        </p>
      </section>
      <section className="article-spread">
        <img src={IMG.tarot2} alt="" />
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
      <div className="image-sequence">
        <img src={IMG.stair} alt="" />
        <img src={IMG.stone} alt="" />
      </div>
      <section className="practical section-pad">
        <div>
          <h2 className="serif">Ghé The Hermit</h2>
          <p>
            637/13/8 Quang Trung, Phường Thông Tây Hội
            <br />
            TP. Hồ Chí Minh
            <br />
            <br />
            [Giờ mở cửa: xác nhận]
          </p>
          <p>
            <Link to="/chuong-trinh" className="underlink">
              Khám phá chương trình
            </Link>
          </p>
          <Link to="/booking" className="button-link">
            Đặt phiên tiếp cận
          </Link>
        </div>
        <div className="map">
          MAP
          <br />
          <span>Vị trí chính xác sẽ được cập nhật</span>
        </div>
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
          <Link to="/booking" className="underlink">
            Đặt một phiên tiếp cận →
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
          <Link to="/booking" className="button-link">
            Đặt phiên tiếp cận
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

function LegacyFounderPage() {
  return (
    <main>
      <PageHero
        eyebrow="FOUNDER — INNER ARCHITECT™ SYSTEM"
        title="Võ Khiêm"
        italic="Tarot phản tư, giáo dục và phát triển bản thân."
        intro="Võ Khiêm xây dựng những cấu trúc giúp người tham gia tự đặt câu hỏi, kiểm tra điều mình đang tin và giữ quyền quyết định đối với cuộc sống của mình."
      />
      <section className="profile-lead section-pad">
        <img
          src={IMG.founder}
          alt="Hình minh họa chân dung trong không gian làm việc, cần xác minh trước khi xuất bản"
        />
        <div>
          <h2 className="serif">
            Một hệ thống được xây từ nhiều cách nhìn về con người.
          </h2>
          <p>
            Võ Khiêm là người sáng lập INNER ARCHITECT™ System. Công việc tập
            trung vào Tarot như một công cụ phản tư, hoạt động chia sẻ kiến thức
            và những trải nghiệm giúp mỗi người quan sát rõ hơn cách mình suy
            nghĩ, cảm nhận và lựa chọn.
          </p>
          <blockquote className="serif">
            “Tôi không mong mọi người tin vào một bộ bài hay một lời giải thích
            duy nhất. Tôi mong mỗi người có thêm kiến thức, biết đặt câu hỏi và
            giữ quyền quyết định cuộc sống của chính mình.”
          </blockquote>
        </div>
      </section>
      <section className="profile-sections section-pad">
        <article>
          <h2 className="serif">Nền tảng học tập</h2>
          <p>
            Kỹ sư Công nghệ Thông tin — Đại học Công nghệ TP.HCM, 2004
            <br />
            Cử nhân Tài chính - Ngân hàng — Đại học Mở Hà Nội, 2015
            <br />
            Đã hoàn thành chương trình đào tạo Cử nhân Tâm lý học tại Đại học
            Công nghệ TP.HCM; đang chờ nhận bằng.
          </p>
        </article>
        <article>
          <h2 className="serif">Triết lý thực hành</h2>
          <p>
            Tarot gợi mở câu hỏi, không bảo đảm dự đoán tương lai. Kiến thức tâm
            lý được sử dụng trong giáo dục phổ thông, không thay thế thực hành
            lâm sàng. Quyền tự quyết luôn thuộc về người tham gia.
          </p>
        </article>
        <article>
          <h2 className="serif">Giáo dục và sáng tạo</h2>
          <p>
            Võ Khiêm tổ chức các lớp Tarot, workshop và lớp học trực tuyến về tự
            nhận thức, cảm xúc và mối quan hệ; đồng thời viết nội dung, phát
            triển bộ bài Tarot và sản phẩm hương thơm LARA.
          </p>
        </article>
      </section>
      <section className="booking-invite section-pad">
        <h2 className="serif">
          Khám phá hệ thống hoặc bắt đầu bằng một cuộc gặp rõ ràng.
        </h2>
        <div>
          <Link to="/he-thong" className="underlink">
            Khám phá hệ thống
          </Link>
          <Link to="/booking" className="button-link">
            Đặt lịch phiên tiếp cận
          </Link>
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

function FounderPage() {
  const principles = [
    [
      "01",
      "Tự nhận thức",
      "Quan sát giá trị, nhu cầu, cảm xúc và những phản ứng đang vận hành trong đời sống.",
    ],
    [
      "02",
      "Tư duy phản biện",
      "Đặt câu hỏi, kiểm tra thông tin và phân biệt trải nghiệm chủ quan với kết luận có bằng chứng.",
    ],
    [
      "03",
      "Quyền tự quyết",
      "Mọi công cụ chỉ gợi mở. Quyền lựa chọn và trách nhiệm với cuộc sống luôn thuộc về mỗi người.",
    ],
  ]

  return (
    <main className="about-page">
      <PageHero
        eyebrow="ABOUT · FOUNDER — INNER ARCHITECT™"
        title="Võ Khiêm"
        italic="Tarot Educator · Tác giả · Nhà sáng tạo"
        intro="Võ Khiêm xây dựng những cấu trúc giúp người tham gia tự đặt câu hỏi, kiểm tra điều mình đang tin và giữ quyền quyết định đối với cuộc sống của mình."
      />
      <section className="profile-lead section-pad">
        <img src={IMG.founderOffice} alt="Không gian làm việc của Võ Khiêm" />
        <div>
          <p className="eyebrow">GIỚI THIỆU</p>
          <h2 className="serif">
            Một góc nhìn đa ngành về cách con người nhận thức và lựa chọn.
          </h2>
          <p>
            Võ Khiêm là người sáng lập INNER ARCHITECT™ System, hoạt động trong
            lĩnh vực Tarot phản tư, chia sẻ kiến thức và phát triển bản thân.
            Nền tảng Công nghệ Thông tin, Tài chính - Ngân hàng và Tâm lý học
            tạo nên một cách tiếp cận vừa hệ thống, vừa quan tâm đến trải nghiệm
            riêng của mỗi người.
          </p>
          <blockquote className="serif">
            “Thấu hiểu chính mình là một điểm khởi đầu để lựa chọn cách sống phù
            hợp hơn.”
          </blockquote>
        </div>
      </section>
      <section className="profile-stats section-pad">
        <div>
          <strong className="serif">100+</strong>
          <span>học viên Tarot</span>
        </div>
        <div>
          <strong className="serif">3</strong>
          <span>workshop đã tổ chức</span>
        </div>
        <div>
          <strong className="serif">200+</strong>
          <span>lượt người tham gia</span>
        </div>
      </section>
      <section className="profile-journey section-pad">
        <header>
          <p className="eyebrow">HÀNH TRÌNH</p>
          <h2 className="serif">
            Từ những thay đổi cá nhân đến một hệ thống giúp người khác tự nhìn
            lại.
          </h2>
        </header>
        <div>
          <p>
            Trước khi lựa chọn hướng đi hiện tại, Võ Khiêm từng làm việc trong
            nhiều lĩnh vực và trải qua những thay đổi lớn về sự nghiệp, tài
            chính và các mối quan hệ. Những giai đoạn khó khăn dẫn đến các câu
            hỏi về điều gì ảnh hưởng đến lựa chọn, vì sao một số phản ứng cứ lặp
            lại và làm thế nào để sống chủ động hơn.
          </p>
          <p>
            Từ Tarot, các truyền thống chiêm nghiệm và triết học phương Đông,
            anh tiếp tục học Tâm lý học để bổ sung góc nhìn khoa học về con
            người. Hành trình ấy hình thành mong muốn chia sẻ công cụ và kiến
            thức giúp mỗi người tự tìm hiểu chính mình, thay vì phụ thuộc vào
            một người hướng dẫn hay một lời tiên đoán.
          </p>
        </div>
      </section>
      <section className="profile-principles section-pad">
        <p className="eyebrow">TRIẾT LÝ THỰC HÀNH</p>
        <div>
          {principles.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3 className="serif">{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="profile-education section-pad">
        <div>
          <p className="eyebrow">NỀN TẢNG HỌC VẤN</p>
          <h2 className="serif">
            Logic, phân tích và sự quan tâm đến khác biệt cá nhân.
          </h2>
        </div>
        <div>
          <p>
            <strong>2004</strong>
            <br />
            Kỹ sư Công nghệ Thông tin
            <br />
            Đại học Công nghệ TP.HCM
          </p>
          <p>
            <strong>2015</strong>
            <br />
            Cử nhân Tài chính - Ngân hàng
            <br />
            Đại học Mở Hà Nội
          </p>
          <p>
            <strong>Đã hoàn thành chương trình</strong>
            <br />
            Cử nhân Tâm lý học, Đại học Công nghệ TP.HCM; đang chờ nhận bằng.
          </p>
        </div>
      </section>
      <section className="profile-scope section-pad">
        <div>
          <p className="eyebrow">GIÁO DỤC & SÁNG TẠO</p>
          <h2 className="serif">
            Tarot, lớp học, nội dung và những sản phẩm cho thời gian chiêm
            nghiệm.
          </h2>
        </div>
        <div>
          <p>
            Võ Khiêm tổ chức các lớp Tarot cơ bản, nâng cao và nội dung thực
            hành mang tên Healer; đồng thời chia sẻ kiến thức tâm lý học phổ
            thông, cảm xúc và mối quan hệ qua workshop và lớp trực tuyến.
          </p>
          <p>
            Anh viết về Tarot, thiết kế bộ bài và phát triển sản phẩm hương thơm
            LARA. Các hoạt động mang tính giáo dục, trải nghiệm và phát triển cá
            nhân; không cấp quyền hành nghề khám, chữa bệnh hoặc trị liệu tâm
            lý.
          </p>
          <Link to="/chuong-trinh" className="underlink">
            Khám phá chương trình →
          </Link>
        </div>
      </section>
      <section className="profile-vision section-pad">
        <p className="eyebrow">TẦM NHÌN</p>
        <blockquote className="serif">
          “Tôi không mong mọi người tin vào một bộ bài hay một lời giải thích
          duy nhất. Tôi mong mỗi người có thêm kiến thức, biết đặt câu hỏi và
          giữ quyền quyết định cuộc sống của chính mình.”
        </blockquote>
        <div>
          <Link to="/he-thong" className="underlink">
            Khám phá INNER ARCHITECT™
          </Link>
          <Link to="/booking" className="button-link">
            Đặt lịch phiên tiếp cận
          </Link>
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

function Booking() {
  const [step, setStep] = useState(1)
  const labels = [
    "Hình thức",
    "Ngày",
    "Giờ",
    "Sàng lọc",
    "Liên hệ",
    "Đồng thuận",
    "Gửi yêu cầu",
    "Xác nhận",
  ]
  return (
    <main className="booking-page">
      <header className="booking-intro">
        <p className="eyebrow">PHIÊN TIẾP CẬN BAN ĐẦU</p>
        <h1 className="serif">
          Bắt đầu bằng một cuộc gặp
          <br />
          <em>có giới hạn rõ ràng.</em>
        </h1>
        <div>
          <p>
            Phiên giúp nhận diện trạng thái hiện tại, làm rõ nhu cầu và cân nhắc
            bước tiếp theo. Phù hợp với người sẵn sàng tham gia chủ động và hiểu
            rằng cuộc gặp có thể được dừng khi vượt ngoài phạm vi an toàn.
          </p>
          <p>
            <strong>
              Không phải dịch vụ cấp cứu, hoạt động chẩn đoán hoặc hình thức
              thay thế hỗ trợ tâm lý, tâm thần và y khoa.
            </strong>
            <br />
            <br />
            [Thời lượng: xác nhận] · Trực tiếp hoặc online
            <br />
            [Chi phí: xác nhận]
          </p>
        </div>
      </header>
      <div className="booking-progress">
        {labels.map((x, i) => (
          <span className={i + 1 <= step ? "active" : ""} key={x}>
            {String(i + 1).padStart(2, "0")}
          </span>
        ))}
      </div>
      <section className="booking-panel">
        <p className="eyebrow">ĐẶT LỊCH · BƯỚC {step}/8</p>
        <h2>{labels[step - 1]}</h2>
        {step === 1 && (
          <Choice items={["Trực tiếp tại The Hermit", "Trực tuyến"]} />
        )}
        {step === 2 && (
          <Choice
            items={[
              "[Ngày khả dụng 01]",
              "[Ngày khả dụng 02]",
              "[Ngày khả dụng 03]",
            ]}
          />
        )}
        {step === 3 && (
          <Choice
            items={["[Khung giờ 01]", "[Khung giờ 02]", "[Khung giờ 03]"]}
          />
        )}
        {step === 4 && (
          <div className="form-lines">
            <label>
              Điều gì đưa bạn đến với INNER ARCHITECT™ vào thời điểm này?
              <textarea />
            </label>
            <label>
              Bạn muốn nhìn rõ hoặc thay đổi điều gì nhất?
              <textarea />
            </label>
            <label>
              Bạn đã từng nhận hỗ trợ tâm lý, trị liệu hoặc một hình thức đồng
              hành tương tự chưa?
              <textarea />
            </label>
            <label>
              Hiện tại bạn có đang ở trong tình trạng khẩn cấp hoặc có nguy cơ
              gây hại cho bản thân hay người khác không?
              <select>
                <option>Không</option>
                <option>Có — tôi cần được hướng dẫn đến hỗ trợ phù hợp</option>
              </select>
            </label>
            <label>
              Điều gì sẽ giúp bạn cảm thấy an toàn hơn trong cuộc trao đổi đầu
              tiên?
              <textarea />
            </label>
          </div>
        )}
        {step === 5 && (
          <div className="form-lines">
            <label>
              Họ và tên
              <input />
            </label>
            <label>
              Email
              <input type="email" />
            </label>
            <label>
              Số điện thoại
              <input />
            </label>
          </div>
        )}
        {step === 6 && (
          <div className="consent">
            <label>
              <input type="checkbox" />
              Tôi hiểu rằng phiên tiếp cận ban đầu không phải dịch vụ cấp cứu,
              không thay thế hỗ trợ tâm lý, tâm thần hoặc y khoa, và có thể được
              dừng hoặc giới thiệu sang hình thức hỗ trợ khác nếu tình trạng nằm
              ngoài phạm vi an toàn của INNER ARCHITECT™.
            </label>
          </div>
        )}
        {step === 7 && (
          <div>
            <p>
              Vui lòng kiểm tra lựa chọn, thông tin liên hệ và đồng thuận trước
              khi gửi. Đây là yêu cầu đặt lịch, chưa phải xác nhận một chương
              trình đồng hành dài hạn.
            </p>
          </div>
        )}
        {step === 8 && (
          <div className="confirmation">
            <p className="serif">Yêu cầu của bạn đã được ghi nhận.</p>
            <p>
              Đây là yêu cầu đặt lịch, không phải xác nhận một chương trình chữa
              lành dài hạn. INNER ARCHITECT™ sẽ liên hệ sau khi xem xét phạm vi
              phù hợp.
            </p>
          </div>
        )}
        <div className="booking-actions">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)}>← Quay lại</button>
          )}
          {step < 8 && (
            <button className="next" onClick={() => setStep(step + 1)}>
              {step === 7 ? "Gửi yêu cầu" : "Tiếp tục"} →
            </button>
          )}
          {step === 8 && (
            <Link to="/" className="next">
              Về trang chủ
            </Link>
          )}
        </div>
      </section>
      <section className="booking-contact">
        <p className="eyebrow">LIÊN HỆ THAY THẾ</p>
        <div>
          [Hotline/Zalo: cần xác nhận]
          <br />
          info@innerarchitect.vn
          <br />
          637/13/8 Quang Trung, Phường Thông Tây Hội, TP. Hồ Chí Minh
        </div>
      </section>
    </main>
  )
}
function Choice({ items }: { items: string[] }) {
  return (
    <div className="choices">
      {items.map((x) => (
        <label key={x}>
          <input type="radio" name="choice" />
          {x}
        </label>
      ))}
    </div>
  )
}

function SimplePage({ type }: { type: "about" | "session" | "contact" }) {
  const data = {
    about: [
      "VỀ CHÚNG TÔI & ĐẠO ĐỨC",
      "Không đứng ở vị trí",
      "biết thay bạn.",
      "INNER ARCHITECT™ tạo cấu trúc để mỗi người giữ lại quyền quan sát, lựa chọn và chịu trách nhiệm cho đời sống của mình.",
    ],
    session: [
      "PHIÊN TIẾP CẬN BAN ĐẦU",
      "Một cuộc gặp",
      "đủ rõ để bắt đầu.",
      "[Thời lượng: xác nhận] để hiểu trạng thái hiện tại, nhu cầu, giới hạn và mức độ phù hợp — trước khi lựa chọn bất kỳ tiến trình nào.",
    ],
    contact: [
      "CONTACT",
      "Bắt đầu bằng",
      "một câu hỏi rõ ràng.",
      "Liên hệ về phiên tiếp cận, chương trình Academy, Workshop hoặc hợp tác biên tập.",
    ],
  }[type]
  return (
    <main>
      <PageHero
        eyebrow={data[0]}
        title={data[1]}
        italic={data[2]}
        intro={data[3]}
      />
      <section className="simple-content section-pad">
        <div>
          <p className="eyebrow">
            {type === "contact" ? "CONTACT DETAILS" : "OUR POSITION"}
          </p>
          <h2 className="serif">
            {type === "about"
              ? "Cấu trúc trước. Diễn giải sau. Con người luôn là chủ thể."
              : type === "session"
                ? "Có điểm vào, điểm kết và bước tiếp theo."
                : "hello@innerarchitect.vn"}
          </h2>
        </div>
        <div>
          {type === "contact" ? (
            <>
              <p>
                TP. Hồ Chí Minh
                <br />
                Instagram · Facebook
                <br />
                <br />
                Thứ Hai — Thứ Sáu
                <br />
                09:00 — 18:00
              </p>
              <Link to="/booking" className="button-link">
                Đặt lịch
              </Link>
            </>
          ) : (
            <>
              <p>
                Chúng tôi không chẩn đoán, hứa hẹn kết quả hay sử dụng Tarot để
                thay thế hỗ trợ chuyên môn. Mọi phiên làm việc đều có quyền dừng
                lại và cơ chế chuyển gửi khi cần.
              </p>
              <Link to="/booking" className="button-link">
                {type === "session"
                  ? "Đặt lịch phiên tiếp cận"
                  : "Tìm điểm bắt đầu"}
              </Link>
            </>
          )}
        </div>
      </section>
      <ParentLink to="/" label="Về trang chủ" />
    </main>
  )
}

function ParentLink({ to, label }: { to: string label: string }) {
  return (
    <div className="parent-link">
      <Link to={to}>← {label}</Link>
    </div>
  )
}

function App() {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/")
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const f = () => {
      setPath(window.location.hash.slice(1) || "/")
      setMenu(false)
    }
    addEventListener("hashchange", f)
    return () => removeEventListener("hashchange", f)
  }, [])
  useEffect(() => {
    let observer: IntersectionObserver | undefined
    const frame = requestAnimationFrame(() => {
      const targets = document.querySelectorAll<HTMLElement>(
        "main:not(.hermit-page) > section:not(.hero):not(.hermit-hero):not(.home-stage), .news-card, .profile-principles article",
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
  const page = useMemo(() => {
    if (path === "/") return <Home />
    if (path === "/he-thong") return <Home initialSection="he-thong" />
    if (path === "/journal") return <NewsArchive />
    if (path.startsWith("/journal/"))
      return <Article slug={path.split("/").pop()!} />

    if (path === "/chuong-trinh") return <Programmes />
    if (path.startsWith("/chuong-trinh/"))
      return <Programmes detail={path.split("/").pop()!} />
    if (path === "/the-hermit") return <Hermit />
    if (path === "/vo-khiem") return <FounderPage />
    if (path === "/lara") return <LaraPage />
    if (path === "/booking") return <Booking />
    return <Home />
  }, [path])
  const isHomeView = path === "/" || path === "/he-thong"
  return (
    <>
      <Header open={menu} setOpen={setMenu} home={path === "/"} />
      <div key={isHomeView ? "home-view" : path} className="page-transition">
        {page}
      </div>
      {path !== "/booking" && <Footer home={path === "/"} />}
    </>
  )
}

export default App
