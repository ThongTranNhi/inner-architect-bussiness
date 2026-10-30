# Figma Make prompt for INNER ARCHITECT content and image update

Update the existing INNER ARCHITECT™ multi-page website. Preserve the current routes, working navigation, brand palette and editorial direction. Do not rebuild the project from scratch.

The update has three goals:

1. Integrate the curated founder, Journal, The Hermit and LARA content.
2. Replace generic or empty image areas with the supplied project assets.
3. Correct layout behaviour so headings and paragraphs never collapse into narrow vertical strips.

## Brand and visitor priority

The primary visitor is a person seeking support for themselves. The website must help that visitor understand the approach, its boundaries and the initial contact session.

Founder credentials, education, Tarot work, The Hermit and LARA support trust and exploration. They must not displace the main visitor journey or turn the homepage into a personal portfolio or product catalogue.

Keep the primary CTA name consistent:

**Đặt lịch phiên tiếp cận**

Keep the central statement:

**Không tìm bình an. Xây trật tự bên trong.**

## Information architecture

Keep the primary navigation limited to:

- Hệ thống
- Journal
- Chương trình
- The Hermit
- Đặt lịch

Add the following as secondary detail pages, linked contextually and from the footer, not from the main navigation:

- Võ Khiêm
- LARA

Do not add more top-level pages.

## Global layout constraints

Apply these rules before adding content:

- Desktop width: 1440 px.
- Equal outer margins: 32 px.
- Twelve-column grid with 20 px gutters.
- Tablet: 24 px margins, eight columns, 16 px gutters.
- Mobile: 20 px margins, four columns, 12 px gutters.
- Body text must never be narrower than 280 px on desktop.
- Preferred body width: 320–560 px.
- Large editorial headings should occupy 6–9 desktop columns.
- Every heading must fit within two lines at its target breakpoint.
- Do not use `max-width` values below 8ch for large headings.
- Do not use one grid column for paragraph text.
- Text-only sections use content-driven height, not `100vh`.
- Only the hero and full photographic chapter breaks may use viewport height.
- Remove empty spacer frames.
- No unexplained blank area may occupy more than approximately 30% of a section.
- When text occupies one side, the opposite side must contain its image, supporting content or a deliberate typographic counterweight.
- Use square image corners.
- Use 4:5 for portraits and 16:9 or 3:2 for spaces and landscapes.
- Do not place body text over busy photography.

## Homepage updates

Do not convert the homepage into an index of other pages. Preserve its existing journey:

1. Hero and central statement.
2. Recognition of the visitor's situation.
3. What INNER ARCHITECT is.
4. The gap between understanding and living differently.
5. Four scopes of support.
6. The initial contact session.
7. Ethics and boundaries.
8. Booking invitation.
9. Secondary paths to explore.

Add one compact founder passage after the introductory INNER ARCHITECT section and before the four-scope explanation:

### Người xây dựng hệ thống

“INNER ARCHITECT™ được sáng lập bởi Võ Khiêm, người hoạt động trong lĩnh vực Tarot phản tư, giáo dục và phát triển bản thân. Hệ thống được hình thành từ nền tảng tư duy đa ngành cùng quá trình quan sát cách con người nhận thức, phản ứng và lựa chọn trong đời sống.”

“Võ Khiêm đề cao khả năng tự nhận thức, tư duy phản biện và quyền tự quyết. Tarot được sử dụng để gợi mở câu hỏi và phản tư, không phải để bảo đảm dự đoán tương lai hoặc quyết định thay một con người.”

Text link:

**Gặp người xây dựng hệ thống**

This is a supporting editorial split, not a full-screen founder hero. Use a verified 4:5 portrait of Võ Khiêm when available. Until then, use a neutral placeholder block labelled only inside the Figma annotation layer, not in the public preview.

Do not use the supplied purple or green promotional author graphics as homepage hero images.

## System page updates

Add a full founder chapter after “Về INNER ARCHITECT™” and before the market-gap/four-layer explanation.

Heading:

**Một hệ thống được xây từ nhiều cách nhìn về con người.**

Use the curated founder copy from `inner-architect-website-content.md`, including:

- Founder role
- Technology, Finance and Psychology learning background
- Personal journey
- Distinction between contemplative traditions and scientific knowledge
- Right to self-determination

Feature this quote at statement size rather than heading size:

“Tôi không mong mọi người tin vào một bộ bài hay một lời giải thích duy nhất. Tôi mong mỗi người có thêm kiến thức, biết đặt câu hỏi và giữ quyền quyết định cuộc sống của chính mình.”

Use `founder-office-placeholder.png` only for the Figma demo. Add a private design annotation: “Verify real photograph versus render before launch.” Do not display that warning to normal website visitors.

Do not present education as three equal cards. Use one editorial list beside the portrait or space image.

## Journal updates

Add two editorial topics:

- Tâm linh, trải nghiệm chủ quan và bằng chứng
- Vì sao tư duy phản biện cần thiết khi tiếp cận huyền học?

Add an author block at the end of articles:

**Võ Khiêm — Founder, INNER ARCHITECT™ System**

“Võ Khiêm viết về Tarot phản tư, tự nhận thức, tư duy phản biện và ranh giới trong các hoạt động phát triển bản thân. Nội dung hướng đến việc giúp người đọc đặt câu hỏi rõ hơn và giữ quyền quyết định của chính mình.”

Use these Journal assets:

- `journal-tarot-reading-horizontal.png` — Journal hero or featured article, 16:9.
- `journal-tarot-box-portrait.png` — creator/deck article, 4:5.
- `journal-tarot-flatlay-vertical.png` — long-form article, 4:5.
- `journal-tarot-spread-vertical.png` — secondary article, 4:5.

Present them as an uneven editorial mosaic. Do not create three or four equal article cards. Captions belong under images, not on them.

## Programmes page updates

Add an educator introduction before workshop listings:

### Người hướng dẫn và kinh nghiệm đào tạo

“Võ Khiêm đã tổ chức các lớp Tarot cơ bản, Tarot nâng cao và những chương trình thực hành tập trung vào kiến thức, trải nghiệm cá nhân và trách nhiệm khi sử dụng công cụ chiêm nghiệm.”

The following figures remain hidden in the public website until confirmed:

- More than 100 Tarot learners
- 3 workshops
- More than 200 workshop participants

Keep placeholders in the CMS/content data if required, but do not render them as public proof.

Add this boundary statement:

“Các chương trình mang tính giáo dục, trải nghiệm và phát triển cá nhân. Chúng không cấp quyền hành nghề khám, chữa bệnh hoặc trị liệu tâm lý.”

Do not use supplied generic group-circle or consultation images as evidence of real INNER ARCHITECT events. Use real event photography when supplied. Tarot course sections may use the verified Tarot product photographs.

## The Hermit page updates

Add this founder context near the opening:

“The Hermit được Võ Khiêm phát triển như một điểm tiếp xúc nhẹ trong hệ sinh thái: một nơi để thưởng trà, tiếp cận Tarot phản tư và dành thời gian cho chính mình trong một không gian có ranh giới.”

Use this image sequence for the Figma demo:

1. `storefront-placeholder.png` — opening full-screen image.
2. `main-hall-placeholder.png` — architectural overview.
3. `tea-room-placeholder.png` — tea and slow-space chapter.
4. `tarot-room-placeholder.png` — Tarot consultation chapter.

All four assets require a private annotation: “Verify real photography versus render before launch.”

Use one full-screen image followed by an editorial split and an uneven image pair. Do not place all four images in an equal grid.

## Võ Khiêm detail page

Create a secondary route for the founder profile, but do not add it to the primary navigation.

Page order:

1. Name and founder role.
2. Short introduction.
3. Education and learning background.
4. Personal journey.
5. Practice philosophy.
6. Education and creative work.
7. Ecosystem connections.
8. Links to System, Journal and booking.

Use the exact curated copy from the “Trang Võ Khiêm” section in `inner-architect-website-content.md`.

Important wording:

- Do not call Võ Khiêm a psychologist, psychology expert or therapist.
- State the Psychology education status as “đã hoàn thành chương trình đào tạo Cử nhân Tâm lý học; đang chờ nhận bằng” until updated proof is available.
- Do not publish learner or workshop figures until confirmed.

The final page needs four verified photographs: a 4:5 portrait, a 3:2 environmental portrait at The Hermit, a 4:5 working Tarot photograph and a 3:2 detail photograph. Use neutral placeholders where these are missing.

## LARA detail page

Create a secondary product route and link it from The Hermit, the founder page and the footer.

Positioning:

**Hương thơm cho những khoảng nghỉ và nghi thức cá nhân.**

LARA is a creative fragrance-product branch. It is not a therapy method, a healing layer or a requirement for taking part in INNER ARCHITECT.

Page order:

1. LARA introduction.
2. Product story.
3. Soul Cleanse.
4. Sacred Ground.
5. Soul Embrace.
6. Safe-use guidance.
7. Experience or purchase at The Hermit.

Use the curated copy from the “Trang LARA” section in `inner-architect-website-content.md`.

Use current product assets as temporary editorial material:

- `lara-autumn-collage-source.jpeg` — product-world introduction.
- `lara-soul-cleanse.png` — temporary Soul Cleanse visual.
- `lara-sacred-ground.png` — temporary Sacred Ground visual.
- `lara-soul-embrace.png` — temporary Soul Embrace visual.
- `lara-product-collage.png` — secondary gallery image.

Most current LARA files contain baked-in typography. Do not use them as responsive full-screen heroes. Place them as contained editorial images until clean original photography is supplied.

Do not present energy clearing, chakra effects, nervous-system healing or emotional release as guaranteed product effects. Fragrance descriptions must remain sensory and subjective.

## Footer update

Keep the practical footer compact. Add contextual links to:

- Võ Khiêm
- LARA

Do not turn the footer into a dense sitemap.

## Content that must remain unpublished

Do not render the following as confirmed public information:

- Hotline number, because sources contain both 0868.554.141 and 0867.147.494.
- Past April and June 2026 events as upcoming events.
- Tarot Basic duration, because sources contain both 5 and 8 sessions.
- Tarot Advanced duration, because sources contain both 6 and 12 sessions.
- Incomplete testimonials.
- Unconfirmed partner logos or names.
- Founder statistics without confirmation.
- Images that have not been verified as real photography.

## Final responsive check

Preview every updated page at 1440, 1024 and 390 px.

The update is acceptable only when:

- No heading wraps one word per line.
- No body paragraph becomes a narrow vertical strip.
- No section leaves half the screen empty without a visual counterweight.
- Homepage content remains focused on the support-seeking visitor.
- Founder and LARA routes remain secondary.
- Every image has a deliberate crop and useful alt text.
- Mobile layouts are recomposed rather than compressed desktop layouts.
- Existing menu, booking links and motion fallbacks continue to work.
