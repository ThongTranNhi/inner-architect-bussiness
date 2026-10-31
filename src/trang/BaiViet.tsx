import { Link } from "../dieu-huong"
import { type NewsItem, news } from "../du-lieu/bai-viet"
import { IMG } from "../du-lieu/hinh-anh"
import { type CSSProperties, useEffect } from "react"

export type ArticleCopy = {
  dek: string
  opening: string
  reflectionTitle: string
  reflection: string
  quote: string
  boundaryTitle: string
  boundary: string
}

export const articleCopy: Record<string, ArticleCopy> = {
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
 * Lấy bản sao nội dung bài viết chi tiết dựa theo mã định danh (slug).
 * Trả về bản sao mặc định của bài tarot nếu không tìm thấy slug tương ứng.
 *
 * @param slug - Chuỗi mã định danh của bài viết trên URL
 * @returns Đối tượng ArticleCopy chứa các trường nội dung và ranh giới
 */
export function layBanSaoBaiViet(slug: string): ArticleCopy {
  return (
    articleCopy[slug] ||
    articleCopy["tarot-khong-phai-loi-tien-doan"]
  )
}

export function NewsCard({
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
          <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
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
 * Hiện các phần tử `.inviewfade` (thẻ "Bài viết liên quan") khi chúng cuộn
 * tới 75% chiều cao màn hình trên trang chi tiết bài viết, để các thẻ này không
 * bị kẹt ở trạng thái ẩn.
 *
 * @param khoaLamMoi - Giá trị thay đổi khi nội dung trang đổi (ví dụ slug bài
 *   viết) để kiểm tra lại các thẻ vừa được render
 */
export function useOgataInview(khoaLamMoi?: string) {
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

export function Article({ slug }: { slug: string }) {
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
        <img
          className="lead-image"
          src={current.image}
          alt={current.title}
          fetchPriority="high"
        />
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
          <img
            src={IMG.tarot2}
            alt="Không gian chiêm nghiệm và tĩnh lặng"
            loading="lazy"
            decoding="async"
          />
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
