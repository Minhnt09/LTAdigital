# PLAN — Website giới thiệu công ty LTA (Angular · chỉ UI & Animation)

> **Công ty Cổ phần Công nghệ và Truyền thông số LTA** — *Kiến tạo giải pháp công nghệ. Đồng hành cùng doanh nghiệp.*
> Nguồn thực tế trong project: `docs/Website LTA.docx` (nội dung song ngữ VI/EN, 39 ảnh nhúng) + `docs/Home.png`, `docs/Services.png`, `docs/Why choose LTA.png`, `docs/Customers and Partners.png`, `docs/Contact.png`.
> Phạm vi: **front-end thuần**, dữ liệu mock tĩnh, **không backend**, form liên hệ chỉ validate + animation thành công.

---

## 0. Tóm tắt nhanh

| Mục | Quyết định |
|---|---|
| Framework | Angular bản stable mới nhất (standalone components, signals, control flow `@if/@for`, `@defer`) — chạy `ng version` để chốt |
| Style | SCSS + CSS variables (design tokens), không dùng UI kit nặng |
| Animation engine | **GSAP + ScrollTrigger + SplitText** (chính) · **Lenis** (smooth scroll) · **CSS scroll-driven animations** (progressive enhancement) · **Canvas 2D** (hero network) · **View Transitions API** (chuyển trang) |
| Ngôn ngữ | VI / EN, đổi tức thời bằng service signals + file JSON (không cần thư viện i18n nặng) |
| Số trang | 5 trang theo thiết kế + 1 template **trang chi tiết dịch vụ** (dựng từ data) |
| Concept thiết kế | **"Signal"** — mạng lưới, tín hiệu, gói dữ liệu chạy trên đường kết nối (khớp logo wifi + hero network của LTA) |
| Ưu tiên | Làm đúng yêu cầu, mượt 60fps, không over-engineering: **MVP 5 trang trước → trang chi tiết sau** |

---

## 1. Phân tích đầu vào

### 1.1 Sitemap đề xuất

```
/                         Home            (Về chúng tôi · Con người · Hợp tác mở · Tầm nhìn · Sứ mệnh)
/services                 Dịch vụ         (hub 5 lĩnh vực + VAS + Cloud + AI + Thiết bị)
/services/:slug           Chi tiết dịch vụ (template dùng chung, data-driven)
/why-lta                  Vì sao chọn LTA (5 lý do + phương châm)
/customers-partners       Khách hàng & Đối tác (logo wall)
/contact                  Liên hệ
```

### 1.2 Trang chi tiết dịch vụ có sẵn nội dung trong docx

| Slug | Tên (khớp thẻ trong thiết kế) | Nội dung chính trong docx |
|---|---|---|
| `cloud-cdn` | CDN | Giới thiệu, 5 bước CDN hoạt động, 3 nhà cung cấp (Alibaba Cloud / BytePlus / CDNetworks), bảng so sánh, lợi ích, tính năng, kiến trúc, use case |
| `cloud-compute` | Cloud server | 10 mục: là gì, nhiều lựa chọn công nghệ, cấu hình, bài toán DN, tối ưu chi phí, AI Infra, quy trình |
| `cloud-storage` | Cloud Storage | 11 mục: Object Storage, kiến trúc, quản lý, bảo mật, tối ưu chi phí |
| `waf-anti-ddos` | WAF & AntiDDoS | Phần 1 WAF · Phần 2 Anti-DDoS (2 cấp bảo vệ) · Phần 3 hệ sinh thái |
| `ai-solutions` | Các giải pháp AI | Danh mục năng lực, hệ sinh thái Alibaba/BytePlus, 10 giải pháp, sức mạnh cộng hưởng, ứng dụng theo ngành, quy trình |
| `ai-chatbot` | AI Chatbot | Chatbot → Assistant → Agent, 6 use case, hành trình Discover → Design → Deploy → Optimize |
| `vas` | Giải pháp & dịch vụ VAS | 3 nhóm VAS, Myclip, Voiz FM, Hyper SMS, Voice Brandname, Voice to Text |
| `telecom-infrastructure` | Thiết bị & Hạ tầng viễn thông | Nhóm thiết bị, dịch vụ đi kèm, đối tượng phù hợp |
| `superapp` | SuperApp *(không có thẻ riêng trong thiết kế)* | SuperApp là gì, giải pháp Alibaba Cloud, vòng đời MiniApp, kiến trúc |
| `vast-data` | AI Data Storage | VAST Data AI OS, kiến trúc DASE, thành phần cốt lõi, use case |
| `api-gate-pro` | API Gate Pro | Xác thực Network API (Silent Auth, Number Verification, SIM Swap), lộ trình triển khai |

> **Phasing:** MVP chỉ làm sâu **`cloud-cdn`** (trang "showcase animation" cho cả template). Các trang còn lại dùng chung template, đổ data dần.

### 1.3 Số liệu có thật trong tài liệu (dùng cho counter animation)

| Số liệu | Giá trị | Nguồn |
|---|---|---|
| Năm thành lập | 03/08/2018 (tính "số năm hoạt động" động bằng code) | Giới thiệu chung |
| Nhà mạng đối tác VAS | 4 (Viettel, VinaPhone, MobiFone, Vietnamobile) | Trang VAS |
| Lĩnh vực hoạt động | 5 | Lĩnh vực hoạt động |
| Nhà cung cấp CDN | 3 | Trang CDN |
| Logo khách hàng & đối tác | 36 | Ảnh Customers & Partners |
| Alibaba Cloud CDN | 3.200+ PoP · 180 Tbps | Trang CDN |
| BytePlus CDN | 1.300+ PoP · 120+ Tbps · < 40ms | Trang CDN |
| CDNetworks | 3.000+ PoP · 90+ quốc gia · 40.000+ website | Trang CDN |

> ⚠️ Không tự bịa số liệu. Số nào chưa có nguồn thì **không hiển thị** hoặc đánh dấu "chờ xác nhận".

---

## 2. Định hướng thiết kế

### 2.1 Concept "Signal"

Thiết kế gốc là nền **navy tối + ảnh công nghệ + khung viền mảnh**. Bản mới giữ nhận diện đó nhưng nâng cấp:

- **Đường kết nối & gói dữ liệu** là motif xuyên suốt: hero network, đường nối giữa các section, đường flow trong trang CDN.
- **Viền mảnh phát sáng theo con trỏ** thay cho khung viền tĩnh của thiết kế.
- **Chữ lớn, tương phản mạnh**, số thứ tự 01–05 dạng outline.
- Xen kẽ **section tối (navy)** và **section sáng (ice)** như thiết kế gốc (Home phần Con người/Hợp tác, Services phần AI).

### 2.2 Design tokens (lấy mẫu từ ảnh thiết kế & logo — chỉnh lại nếu có brand guideline)

| Token | Hex | Dùng cho |
|---|---|---|
| `--navy-950` | `#0B1623` | Nền sâu nhất, preloader, footer |
| `--navy-900` | `#1A2B3B` | Nền chính (đo từ thiết kế) |
| `--navy-800` | `#223A50` | Card, panel |
| `--blue-600` | `#1860A8` | Logo / nút chính |
| `--sky-400` | `#3090C0` | Accent, đường kết nối, glow |
| `--gold-400` | `#D8A848` | Accent phụ (vòng wifi logo) |
| `--rose-300` | `#D8A8A8` | Accent phụ (chấm logo) |
| `--ice-200` | `#C5D7E5` | Nền section sáng (đo từ phần AI) |
| `--ink-100` | `#E8EEF3` | Chữ trên nền tối |
| `--muted` | `#8FA1B2` | Nhãn phụ (như "Địa chỉ", "Email" ở trang Liên hệ) |

```scss
:root {
  --signal-gradient: conic-gradient(from var(--angle, 0deg), #3090C0, #D8A848, #D8A8A8, #3090C0);
  --ease-out-expo: cubic-bezier(.16, 1, .3, 1);
  --ease-in-out-quart: cubic-bezier(.76, 0, .24, 1);
  --radius-card: 20px;
  --container: min(1240px, 100% - 3rem);
}
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
```

### 2.3 Typography

| Vai trò | Font | Ghi chú |
|---|---|---|
| Heading + body | **Be Vietnam Pro** (300–800) | Thiết kế riêng cho tiếng Việt, dấu đẹp |
| Số, nhãn kỹ thuật, tag | **JetBrains Mono** | Cho "01", "PoP", "Tbps", "→" |

- Self-host (woff2, subset `latin + vietnamese`), `font-display: swap`, preload font heading.
- Tiêu đề fluid: `font-size: clamp(2.25rem, 5vw + 1rem, 5.5rem)`; line-height 1.05 cho H1.
- Chữ hoa có dấu (CÔNG TY CỔ PHẦN…) dùng `letter-spacing: .02em`, **không** quá 2 dòng trên mobile.

### 2.4 Layout & ảnh

- Grid 12 cột, container 1240px, gutter 24px; mobile-first (breakpoint 640 / 900 / 1200).
- Ảnh: AVIF/WebP + `NgOptimizedImage`, `loading="lazy"` trừ hero; bo góc 20px; overlay gradient navy để chữ luôn đọc được.
- 5 PNG là **ảnh chụp bố cục**, rộng 1366 px; Home cao 6144 px, Services cao 5376 px. Không dùng nguyên ảnh chụp làm nền trang hoặc cắt chữ từ ảnh. Ảnh trong DOCX có thể tách để dùng riêng, nhưng cần chọn lọc theo bảng kiểm kê dưới đây.

### 2.5 Kiểm kê hình ảnh và quyết định thiết kế

Đã xem trực tiếp 5 ảnh bố cục và 39 ảnh trong `word/media/` của DOCX. Tên `imageXX.png` là tên bên trong DOCX, **chưa phải đường dẫn asset của website**. Khi triển khai, trích ra `assets-src/`, đặt lại tên theo nội dung, xuất WebP/AVIF và giữ bản gốc để đối chiếu.

| Khu vực | Ảnh sẵn có trong DOCX | Cách dùng đề xuất | Lưu ý |
|---|---|---|---|
| Logo LTA | `image36.png` (276×114) | Dùng tạm ở header/footer, đặt trên nền phù hợp; vẽ lại thành SVG từ file thương hiệu nếu có | Kích thước nhỏ, nền trắng; không phóng lớn hay dùng để tách nét cho preloader |
| Home — giới thiệu/đội ngũ | `image30.png` (nhóm họp), `image24.png` (văn phòng) | Ưu tiên `image30` cho khối “Về chúng tôi”; `image24` cho đoạn nói về môi trường làm việc | Đây là ảnh minh họa trong tài liệu, không mặc định khẳng định là nhân sự/văn phòng thật của LTA |
| Home — hình toàn chiều rộng | `image13.png` (thành phố tương lai) | Có thể dùng làm visual chuyển nhịp, crop theo điểm nhìn trung tâm | Hình mang tính minh họa; giữ chữ và CTA ngoài ảnh |
| Home — tầm nhìn | `image38.png` (trung tâm dữ liệu), `image24.png` | Dùng ảnh server với lớp phủ navy nhẹ, chừa khoảng trống đọc chữ | Không kéo ảnh 1408 px thành full bleed quá lớn mà thiếu xử lý độ nét |
| Services — mở đầu | `image66.png` (collage kỹ thuật, họp, thiết bị), `image68.png` (phòng điều khiển/văn phòng/data center) | Dùng ảnh collage nếu cần bám bố cục mẫu; bản sắc tốt hơn khi tách thành các khung ảnh riêng có nhịp khoảng trắng | Ảnh collage đã ghép sẵn nên không nên cắt thành ảnh người hoặc thiết bị quá nhỏ |
| Services — Cloud / AI | `image15`, `image16`, `image27`, `image29`, `image31`, `image34`, `image37`, `image39`, `image41`, `image45`, `image51`, `image54`, `image56`, `image58`, `image60`, `image62`, `image64`, `image67`, `image69` | Chọn ảnh minh họa isometric theo đúng dịch vụ, dùng thống nhất tỷ lệ card; ưu tiên `image27` Cloud, `image29` WAF, `image62` chatbot, `image64` SuperApp | Nhiều hình chứa chữ nhỏ hoặc chi tiết dày; không dùng làm hero có chữ chồng lên |
| Services — hạ tầng | `image38.png`, `image48.png`, `image55.png` | Ưu tiên `image48` cho thiết bị/hạ tầng; `image38` cho data center | Tránh dùng lặp một ảnh liên tiếp ở Home và Services |
| Why LTA | `image68.png`, `image38.png`, `image24.png` | `image68` hợp vùng 5 lý do; `image24` hợp phần phương châm | Ảnh mẫu dùng nền tối với chữ trắng: cần overlay và kiểm tra tương phản từng vùng |
| Contact | `image47.png` (phòng họp) | Dùng đúng như ảnh mẫu, crop 4:3 hoặc 5:4 | Không gắn nhãn đây là trụ sở LTA nếu chưa xác minh |
| Customers & Partners | Không có 36 logo tách rời trong DOCX; chỉ thấy logo wall trong `Customers and Partners.png` | Tạo lưới logo trên ô nền sáng; xin logo gốc SVG/PNG từng đối tác trước khi dựng bản cuối | Không cắt logo từ ảnh chụp 1366×768 để dùng sản xuất: độ phân giải thấp, khó giữ rìa chữ sạch |

**Ngôn ngữ thị giác:** Ảnh chụp và ảnh minh họa isometric đang có hai phong cách khác nhau. Dùng ảnh chụp cho câu chuyện doanh nghiệp, ảnh minh họa cho catalog dịch vụ; không trộn hai loại trong cùng một hàng card. Nền navy chiếm phần lớn mockup, vì vậy tạo thêm vùng sáng có chủ đích ở Services và một số đoạn Home để tăng nhịp đọc. Card dùng viền mảnh và khoảng trắng rộng; hạn chế glow, tilt và chữ chạy đồng thời trên một màn hình.

**Ưu tiên motion:** Chỉ giữ một hiệu ứng chủ đạo mỗi section. Hero dùng network tinh tế, phần nội dung dùng reveal ngắn, dịch vụ dùng hover rõ trạng thái. Pin/horizontal scroll chỉ dùng khi thật sự giúp hiểu thông tin; các A1–A24 là thư viện ý tưởng, không phải checklist phải triển khai đủ. Trên mobile ưu tiên đọc, thao tác và tốc độ tải.

**Việc cần làm trước khi code UI:** (1) trích 39 ảnh, tạo manifest `tên gốc → tên mô tả → trang → alt → tỷ lệ crop`; (2) chọn đúng một ảnh chính cho mỗi section, kiểm tra thumbnail desktop/mobile; (3) tối ưu ảnh theo kích thước hiển thị, đặt `width`/`height` hoặc `aspect-ratio`; (4) xin logo LTA vector và logo đối tác gốc nếu có. Không tự suy diễn quyền sử dụng hay tính xác thực của người/địa điểm từ ảnh minh họa.

---

## 3. Kiến trúc Angular

### 3.1 Thư viện

| Gói | Vai trò | Ước lượng (gzip) |
|---|---|---|
| `gsap` (core + ScrollTrigger + SplitText + MotionPath + DrawSVG) | Animation chính | ~60–70 KB nếu import đủ — **chỉ import plugin dùng, lazy theo route** |
| `lenis` | Smooth scroll, đồng bộ với ScrollTrigger | ~3 KB |
| Canvas 2D tự viết | Hero network (không cần three.js) | 0 KB thư viện |

> Từ GSAP 3.13 các plugin (gồm SplitText, MorphSVG, DrawSVG) đã miễn phí — kiểm tra lại license khi cài.
> **Không** cài thêm Angular Material / Bootstrap / Tailwind: tự viết SCSS để giữ kiểm soát animation và dung lượng.

### 3.2 Cấu trúc thư mục

```
src/app/
├─ core/
│  ├─ motion/
│  │  ├─ motion.service.ts        # init GSAP, Lenis, reduced-motion, matchMedia
│  │  ├─ cursor.service.ts        # custom cursor (desktop)
│  │  └─ page-transition.ts       # View Transitions + fallback overlay
│  ├─ i18n/
│  │  ├─ i18n.service.ts          # signal lang(), t(key)
│  │  └─ pipes/t.pipe.ts
│  └─ layout/
│     ├─ header/ footer/ preloader/ scroll-progress/ lang-switch/
├─ shared/
│  ├─ directives/                 # animation directives (mục 4.2)
│  ├─ ui/                         # button, section-title, bento-card, marquee, counter...
│  └─ pipes/
├─ features/
│  ├─ home/            (sections/*.ts)
│  ├─ services/        (hub + service-detail template + blocks/*)
│  ├─ why-lta/
│  ├─ customers/
│  └─ contact/
├─ data/
│  ├─ i18n/vi.json  en.json
│  ├─ services.data.ts            # config-driven cho trang chi tiết
│  └─ partners.data.ts            # 36 logo
└─ app.routes.ts
public/ (assets: fonts, img/{avif,webp}, logos/, geo/world-dots.json)
```

### 3.3 Nguyên tắc tích hợp GSAP với Angular

1. **Chạy ngoài zone** (`NgZone.runOutsideAngular`) hoặc dùng zoneless để scroll/tick không kích hoạt change detection.
2. Khởi tạo trong `afterNextRender()` (an toàn nếu sau này bật SSR/prerender).
3. Mọi animation của một component bọc trong **`gsap.context()`** và `ctx.revert()` trong `DestroyRef.onDestroy` → không rò rỉ khi đổi route.
4. Sau khi route đổi hoặc ảnh load xong: `ScrollTrigger.refresh()`.
5. Mọi hiệu ứng đọc `MotionService.reduced` — bật `prefers-reduced-motion` thì chuyển sang fade ngắn hoặc tắt.
6. Animate **chỉ `transform` và `opacity`** (+ `clip-path`, `filter` có chọn lọc). Không animate `width/height/top/left`.

### 3.4 Routing & chuyển trang

```ts
// app.config.ts
provideRouter(routes,
  withViewTransitions({ skipInitialTransition: true }),
  withInMemoryScrolling({ scrollPositionRestoration: 'top' }));
```

- Route lazy: `loadComponent: () => import('./features/home/home')`.
- Chuyển trang: **View Transitions API** (cross-fade + shared element cho tiêu đề/ảnh card → hero trang chi tiết). Trình duyệt chưa hỗ trợ → fallback **overlay wipe** bằng GSAP (thanh navy quét ngang 0.6s).

---

## 4. Hệ thống animation

### 4.1 Danh mục hiệu ứng (hiện đại, được dùng nhiều — vượt khỏi fade/slide cơ bản)

| # | Hiệu ứng | Mô tả | Công cụ | Dùng ở đâu |
|---|---|---|---|---|
| A1 | **Smooth scroll quán tính** | Cuộn mượt, đồng bộ mọi trigger | Lenis + ScrollTrigger | Toàn site |
| A2 | **Preloader logo vẽ nét** | Vòng wifi LTA tự "vẽ" (stroke) rồi mở màn dạng curtain | GSAP DrawSVG | Lần đầu vào site |
| A3 | **Hero Network canvas** | Node + đường nối, nhích theo chuột, gói dữ liệu chạy trên đường | Canvas 2D | Hero Home, Why LTA |
| A4 | **Split text reveal** | Tiêu đề lộ theo dòng/chữ trong mask (trượt từ dưới lên) | SplitText | Mọi H1/H2 |
| A5 | **Text scramble/decode** | Chữ nhãn kỹ thuật "giải mã" từ ký tự ngẫu nhiên | Custom (rAF) | Nhãn 01–05, tag, tagline |
| A6 | **Scroll-scrub pin storytelling** | Section ghim, cuộn đến đâu animation chạy đến đó | ScrollTrigger `pin + scrub` | Con người, Tầm nhìn, CDN flow |
| A7 | **Horizontal scroll** | Cuộn dọc → trượt ngang | ScrollTrigger | 5 lĩnh vực (Services), 3 sứ mệnh (mobile dùng stack) |
| A8 | **Sticky stacked cards** | Thẻ chồng lên nhau khi cuộn, thẻ dưới thu nhỏ/mờ nhẹ | `position: sticky` + scrub | Sứ mệnh 1-2-3 |
| A9 | **Spotlight border / glow theo con trỏ** | Viền + nền sáng theo vị trí chuột | CSS vars `--mx --my` | Mọi card (bento) |
| A10 | **3D tilt + parallax layer** | Card nghiêng theo chuột, ảnh bên trong trượt ngược chiều | Custom directive + `transform: perspective` | Card dịch vụ, AI tiles |
| A11 | **Magnetic button + ripple** | Nút bị hút về con trỏ, bấm có gợn sóng | GSAP quickTo | CTA, "Tìm hiểu thêm" |
| A12 | **Custom cursor** | Chấm + vòng đàn hồi, đổi dạng khi hover link/ảnh ("Xem") | GSAP quickTo, `mix-blend-mode` | Desktop (ẩn trên touch) |
| A13 | **Image clip-path reveal + parallax** | Ảnh mở bằng clip-path, scale 1.2→1 khi cuộn | ScrollTrigger | Ảnh trong Home/Why/Services |
| A14 | **Marquee 2 hàng + velocity skew** | Logo chạy ngược chiều; tốc độ & độ nghiêng theo tốc độ cuộn | GSAP + Lenis velocity | Customers & Partners |
| A15 | **Counter / odometer** | Số "cuộn" như đồng hồ cơ khi vào viewport | GSAP | Số liệu CDN, thống kê |
| A16 | **Gradient border xoay (conic)** | Viền gradient chạy vòng quanh card | CSS `@property --angle` | Card nổi bật, CTA |
| A17 | **Aurora / mesh background** | Nền gradient chuyển động chậm, blur | CSS (GPU) | Section CTA, hero phụ |
| A18 | **Expanding panels** | Hàng panel ảnh, hover panel nở rộng, panel khác co lại | CSS flex + GSAP Flip | Lưới giải pháp AI |
| A19 | **Outline-to-fill text** | Chữ stroke lớn (VAS, 01–05) tô đầy theo scroll | `background-clip:text` + scrub | Số thứ tự, chữ "VAS" |
| A20 | **Animated SVG flow + MotionPath** | Gói tin chạy User → DNS → PoP → Cache → Origin | GSAP MotionPath | Trang CDN |
| A21 | **Pulsing dot-map** | Bản đồ thế giới bằng chấm, PoP nhấp nháy lan tỏa | Canvas + JSON toạ độ | Trang CDN, Home |
| A22 | **Scroll-driven CSS animations** | Hiệu ứng thuần CSS theo `view()` — không tốn JS | `animation-timeline: view()` | Reveal đơn giản, progress bar |
| A23 | **Shared-element page transition** | Card → hero trang chi tiết biến hình liền mạch | View Transitions API | Services → chi tiết |
| A24 | **Scroll progress + section dots** | Thanh tiến độ trên cùng + chấm điều hướng cạnh phải | CSS + ScrollTrigger | Toàn site |

### 4.2 Directive / component dùng lại

| Directive | Input chính | Việc làm |
|---|---|---|
| `appReveal` | `variant: 'fade-up' \| 'mask' \| 'blur' \| 'clip'`, `delay`, `stagger` | Reveal khi vào viewport, chạy 1 lần |
| `appSplitText` | `type: 'lines' \| 'words' \| 'chars'`, `scrub?` | Tách chữ + reveal trong mask |
| `appScramble` | `text`, `duration` | Hiệu ứng decode |
| `appTilt` | `max`, `glare`, `layers` | 3D tilt + glare |
| `appSpotlight` | `color`, `size` | Spotlight theo con trỏ trên card |
| `appMagnetic` | `strength` | Nút hút con trỏ |
| `appParallax` | `speed`, `axis` | Parallax theo scroll |
| `appCounter` | `to`, `duration`, `suffix` | Số chạy |
| `appPin` | `end`, `scrub` | Bọc `ScrollTrigger.pin` |
| `<lta-marquee>` | `speed`, `direction`, `pauseOnHover` | Marquee vô hạn |
| `<lta-network-canvas>` | `density`, `mouse` | Hero network |
| `<lta-dot-map>` | `pops[]` | Bản đồ chấm + PoP pulse |

### 4.3 Chuẩn thời lượng & easing

| Loại | Duration | Easing |
|---|---|---|
| Micro (hover, nút) | 0.2–0.35s | `power2.out` |
| Reveal text/ảnh | 0.8–1.2s | `expo.out` (`--ease-out-expo`) |
| Chuyển trang | 0.6–0.8s | `--ease-in-out-quart` |
| Stagger | 0.05–0.12s / phần tử | — |
| Scrub | `scrub: 0.6` (có độ trễ mượt) | `none` |

---

## 5. Chi tiết từng trang

> Quy ước: **[A#]** = hiệu ứng ở mục 4.1.

### 5.1 HOME `/`

| # | Section (theo thiết kế) | Layout | Animation | Mobile |
|---|---|---|---|---|
| 1 | **Hero** — logo, tiêu đề "CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG SỐ LTA", tagline "Kiến Tạo Giải Pháp Công Nghệ. Đồng Hành Cùng Doanh Nghiệp." | Full-screen, nền navy + network | [A2] preloader → [A3] network phản ứng chuột → [A4] tiêu đề lộ từng dòng → tagline [A5] decode → gợi ý "cuộn" có chấm chạy | Giảm node 90→40, tắt phản ứng chuột |
| 2 | **VỀ CHÚNG TÔI** — ảnh đội ngũ trước màn hình dashboard + đoạn giới thiệu | 2 cột (ảnh trái, chữ phải) | [A13] ảnh mở clip-path + parallax; đoạn văn reveal theo dòng; từ khoá in đậm ("cung cấp giải pháp và dịch vụ đa lĩnh vực…") highlight chạy nền | Ảnh trên, chữ dưới |
| 3 | **Lấy Con người làm nền tảng — Công nghệ làm động lực** (nền sáng) + 4 đoạn | Tiêu đề trái (sticky), 4 đoạn phải | [A6] tiêu đề **sticky**, 4 đoạn lần lượt sáng lên (opacity .25 → 1) theo scroll; [A4] tiêu đề | Bỏ sticky, reveal tuần tự |
| 4 | **Hợp tác mở, không giới hạn một nền tảng** + 2 ảnh (nắm tay, bắt tay) | Chữ trái, 2 ảnh phải so le | [A13] 2 ảnh lệch nhịp, parallax ngược chiều nhau | Xếp dọc |
| 5 | **4 ô khung viền** (đa đối tác · tích hợp Cloud/AI/Data/Telecom/Software/Infra · tư vấn theo bài toán · mở rộng danh mục) trên nền tối + icon bắt tay mờ | Lưới 2×2 | [A9] spotlight + [A16] viền conic xoay khi hover; icon nền [A13] parallax nhẹ; khung **vẽ viền** (stroke) khi vào viewport | Lưới 1 cột |
| 6 | **Ảnh toàn chiều rộng** (thành phố tương lai) | Full-bleed 70vh | Ảnh scale 1.25→1 theo scroll; vignette navy; chữ chạy ngang (marquee) "Cloud · AI · Data · Telecom · Infrastructure" mờ phía trên | Cao 50vh |
| 7 | **TẦM NHÌN** (nền phòng server tối) | Căn giữa | [A6] pin ngắn; chữ "TẦM NHÌN" [A19] outline → fill; đoạn văn lộ **từng từ** theo scrub (word-by-word) | Tắt pin, giữ word reveal |
| 8 | **SỨ MỆNH** — thẻ trắng, icon mục tiêu, 3 cột + icon biểu đồ | Thẻ lớn nổi trên nền | [A8] 3 thẻ chồng sticky (desktop có thể giữ 3 cột + stagger); icon mục tiêu vẽ nét [DrawSVG], mũi tên biểu đồ "mọc" lên | Stack dọc |
| 9 | **CTA cuối** ("Bạn đang tìm kiếm một đối tác công nghệ…") | Panel lớn + SĐT / email / web | [A17] aurora nền + [A11] nút magnetic + [A16] viền conic | — |

### 5.2 SERVICES `/services`

| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | **DỊCH VỤ** + collage 3 ảnh + danh sách 01–03 | Ảnh trái, list phải | [A19] số 01–03 outline→fill; item reveal stagger; collage 3 ảnh [A10] tilt + parallax lệch tầng |
| 2 | **04–05** (Enterprises IT; Data Center & Telecom Infrastructure) + ảnh data center + nút "Tìm hiểu thêm" | List trái, ảnh phải | Giữ nhịp A19; ảnh [A13]; nút [A11] |
| ★ | **Nâng cấp:** gộp 01–05 thành 1 khối **horizontal scroll** (mỗi lĩnh vực là 1 panel full-height) | Desktop | [A7] — mobile giữ list dọc như thiết kế |
| 3 | **VAS** — chữ "VAS" lớn mảnh, 4 khung: Nền tảng công nghệ · Dịch vụ nội dung số · Giải pháp & dịch vụ trò chơi điện tử · Quảng cáo – Truyền thông | Nền ảnh kính thành phố, lưới 2×2 | Chữ "VAS" [A19]; 4 khung [A9] spotlight, hover làm mờ 3 khung còn lại (focus effect); click → `/services/vas` |
| 4 | **Cloud and Platform service** — 4 thẻ: CDN · Cloud server · Cloud Storage · WAF & AntiDDoS | 4 cột, minh hoạ isometric | [A10] tilt + ảnh isometric nổi lớp (parallax layer); đường kẻ dưới tiêu đề vẽ nét; click → **[A23] shared-element** sang trang chi tiết |
| 5 | **CÁC GIẢI PHÁP AI** (nền ice) — lưới 3×3: AI Content Moderation · AI Recommend · AI Search · AI Image Generation · AI Video Generation · AI Video Highlight · AI Chatbot · API Gate Pro · AI Data Storage | Lưới ảnh + thanh nhãn dưới | Nền network nhẹ chuyển động; mỗi tile [A13] clip reveal xen kẽ chéo; hover: ảnh zoom + thanh nhãn trượt lên hiện mô tả ngắn; (tuỳ chọn) [A18] expanding panels ở desktop |
| 6 | **Thiết Bị & Hạ Tầng Viễn Thông** + ảnh tủ rack + "Tìm hiểu thêm" | Ảnh trái, chữ phải | [A13] + [A4] |

### 5.3 SERVICE DETAIL `/services/:slug` (template dùng chung)

Dựng từ `services.data.ts` bằng các **block** có thể ghép:

| Block | Dùng cho | Animation |
|---|---|---|
| `hero-block` | Tiêu đề + tagline | [A4] + [A17] |
| `intro-block` | Giới thiệu | Reveal theo dòng |
| `steps-flow-block` | "CDN hoạt động thế nào" 5 bước | **[A6]+[A20]** (xem 5.3.1) |
| `provider-compare-block` | Bảng 3 nhà cung cấp | Hàng bảng stagger; cột được hover sẽ highlight; [A15] counter PoP/Tbps |
| `feature-grid-block` | Lợi ích / Tính năng | Bento [A9] |
| `architecture-block` | Kiến trúc 01–04 + flow | SVG vẽ nét tuần tự |
| `use-case-block` | Mô hình sử dụng | Chip xuất hiện stagger |
| `cta-block` | Liên hệ | Như CTA Home |

#### 5.3.1 Trang `cloud-cdn` — "showcase"

1. **Dot-map toàn cầu** [A21]: chấm PoP lan tỏa; hover hiện nhà cung cấp.
2. **CDN flow pin-scrub** [A6][A20]: ghim màn hình; cuộn qua 5 bước
   `Người dùng → Routing/DNS → PoP gần nhất → Cache (hit/miss) → Origin`; gói tin chạy trên đường SVG, khi **cache hit** gói quay đầu ngay tại PoP, khi **miss** đi tiếp tới Origin rồi quay lại (thể hiện đúng nội dung "Kết quả: ít lượt truy cập về origin hơn").
3. **So sánh 3 nhà cung cấp**: counter số PoP, thanh Tbps tăng dần.
4. **Kiến trúc** 4 hệ thống: Routing · Route Quality · Caching · Support & Monitoring.

### 5.4 WHY CHOOSE LTA `/why-lta`

| # | Section | Animation |
|---|---|---|
| 1 | **Hero** "Vì sao lựa chọn LTA?" + "Hiểu bài toán. Đúng giải pháp. Đồng hành dài lâu." (nền network mờ + sparkle) | [A3] network nhẹ hơn Home; [A4] tiêu đề; **3 cụm từ phụ lần lượt sáng** (Hiểu bài toán → Đúng giải pháp → Đồng hành dài lâu) |
| 2 | **5 khung** (Cập nhật công nghệ · Giải pháp linh hoạt · Đội ngũ chuyên nghiệp · Đồng hành tận tâm · Tạo giá trị thực) trên ảnh phòng điều khiển/data center | Bố cục 2 + 3 như thiết kế; [A9] spotlight; **nền ảnh đổi nhẹ** theo khung đang hover (crossfade); số thứ tự 01–05 [A5] |
| 3 | **PHƯƠNG CHÂM** — câu trích lớn nghiêng + thanh "TƯ DUY SÁNG TẠO — HÀNH ĐỘNG HIỆU QUẢ — ĐỒNG HÀNH DÀI LÂU" | [A6] câu trích lộ **từng từ theo scrub** (chữ xám → trắng); thanh tagline 3 cụm lần lượt trượt vào; ảnh nền parallax |

### 5.5 CUSTOMERS & PARTNERS `/customers-partners`

| # | Section | Animation |
|---|---|---|
| 1 | Tiêu đề "Khách hàng và Đối tác" | [A4] |
| 2 | **Logo wall** 36 logo | Desktop: bố cục lưới/so le giống thiết kế, mỗi logo [A9] spotlight + hover từ trắng đơn sắc → màu gốc; vào viewport: **stagger theo ngẫu nhiên có kiểm soát** (GSAP `stagger: { from: 'random' }`) |
| 3 | **Marquee 2 hàng** (phiên bản gọn đặt cuối Home) | [A14] 2 hàng ngược chiều, skew theo tốc độ cuộn, dừng khi hover |
| 4 | **Phân nhóm (filter)** — Nhà mạng · Nền tảng/Cloud · Truyền hình & Nội dung · Hạ tầng & Thiết bị | Chip lọc; dùng **GSAP Flip** để logo bay về vị trí mới khi lọc |

> Nhóm logo cần xác nhận với khách. Gợi ý ban đầu: *Nhà mạng* (Viettel, MobiFone, Vinaphone, Vietnamobile, Bitel, Halotel, Movitel, Mytel, Metfone, Unitel, Natcom, Telemor, Lumitel, Viettel Global, Viettel IDC) · *Cloud/Nền tảng* (Alibaba Cloud, BytePlus, ByteDance, TikTok, CDNetworks, VAST, Telsoft, Monty Mobile, VEGA) · *Truyền hình & nội dung* (K+, TV360, SCTV, VTC, VTVgo, VTVcab, VMG Media Group, VDCA) · *Hạ tầng & thiết bị* (Vertiv, Schneider Electric, Commax, iSMA Controlli).

### 5.6 CONTACT `/contact`

| Thông tin (đúng theo thiết kế) | Giá trị |
|---|---|
| Địa chỉ | Toà nhà Viet Dragon, A1/D21 ngõ 11 Duy Tân, phường Cầu Giấy, Hà Nội, Việt Nam |
| Số điện thoại | 024 37721888 |
| Email | ltadigital@ltadigital.com |
| Website | ltadigital.com |

| # | Phần | Animation |
|---|---|---|
| 1 | Tiêu đề "Liên hệ" | [A4] |
| 2 | Ảnh phòng họp + khối thông tin | Ảnh [A13]; 4 khối info reveal stagger; **click-to-copy** (SĐT, email) với toast xác nhận; nhãn [A5] |
| 3 | **Form liên hệ** (Họ tên · Email · SĐT · Nhu cầu · Nội dung) *— bổ sung nhẹ, chỉ UI* | Floating label; validate realtime; nút gửi biến hình **loading → dấu tick vẽ nét** + confetti chấm tín hiệu (không gọi API, chỉ mô phỏng) |
| 4 | **Bản đồ** (tuỳ chọn) | Iframe Google Maps có lớp overlay navy, bỏ overlay khi hover |

---

## 6. Layout toàn cục

| Thành phần | Hành vi |
|---|---|
| **Header** | Trong suốt trên hero; cuộn xuống → blur nền + thu nhỏ; ẩn khi cuộn xuống, hiện khi cuộn lên; link có underline "vẽ" khi hover; mobile: menu fullscreen với **stagger** các mục + hiệu ứng clip-path mở từ nút |
| **Language switch** | VI ⇄ EN, chữ **flip** dọc khi đổi; nội dung đổi không reload |
| **Scroll progress** | Thanh mảnh gradient trên cùng [A22] + chấm section bên phải [A24] |
| **Footer** | Logo, thông tin liên hệ, sitemap; chữ "LTA" cực lớn mờ phía dưới, lộ dần khi cuộn tới cuối |
| **Cursor** | Chấm + vòng; "Xem" khi hover ảnh, "Kéo" khi hover vùng horizontal scroll; tắt trên touch |
| **Preloader** | Chỉ hiện lần đầu mỗi phiên (`sessionStorage`), tối đa ~1.6s, có thể bỏ qua |

---

## 7. Song ngữ (VI / EN)

- `vi.json` / `en.json` lấy nguyên từ docx (đã có đủ 2 ngôn ngữ cho mọi trang).
- `I18nService`: `lang = signal<'vi'|'en'>('vi')`, `t(key)` computed; lưu `localStorage`; cập nhật `<html lang>`.
- Lưu ý khi **split text**: đổi ngôn ngữ phải `revert()` SplitText rồi tách lại, tránh vỡ dấu tiếng Việt (tách theo `lines/words`, hạn chế `chars` với đoạn dài).
- Chiều dài EN thường khác VI → kiểm tra card/tiêu đề không tràn ở cả hai.

---

## 8. Hiệu năng, khả năng truy cập, responsive

### 8.1 Ngân sách hiệu năng (mục tiêu)

| Chỉ số | Mục tiêu |
|---|---|
| Lighthouse Performance (mobile) | ≥ 85 |
| LCP | ≤ 2.5s |
| CLS | ≤ 0.1 |
| JS khởi tạo | ≤ ~250 KB gzip (GSAP plugin nạp theo route) |
| Hero network | 60fps desktop; mobile giảm mật độ, giới hạn DPR ≤ 2, **dừng khi ra khỏi viewport / tab ẩn** |

### 8.2 Quy tắc chống giật

- `will-change` chỉ gắn khi animation chạy, gỡ sau đó.
- Chỉ animate `transform/opacity`; blur nặng dùng tiết kiệm.
- `@defer (on viewport)` cho section nặng dưới màn hình đầu; canvas/dot-map chỉ khởi tạo khi gần viewport (IntersectionObserver).
- Ảnh: AVIF/WebP, `srcset`, kích thước cố định để tránh CLS; poster blur-up.
- Thiết bị yếu (`navigator.hardwareConcurrency <= 4` hoặc `saveData`): tắt canvas hero, tắt tilt/cursor.

### 8.3 Accessibility

- `prefers-reduced-motion: reduce` → tắt Lenis, tắt pin/scrub/parallax/cursor, reveal còn fade 200ms.
- Chữ trên ảnh luôn có overlay đảm bảo tương phản ≥ 4.5:1.
- Focus ring rõ (outline gradient), điều hướng bàn phím đầy đủ, `aria-label` cho icon, `alt` cho logo đối tác.
- Marquee/animation tự chạy có nút **tạm dừng** (hoặc dừng khi focus).
- Hiệu ứng split text giữ nguyên text gốc trong `aria-label`, các span con `aria-hidden`.

### 8.4 Responsive

| Breakpoint | Thay đổi chính |
|---|---|
| ≥ 1200 | Đủ hiệu ứng: pin, horizontal scroll, tilt, cursor |
| 900–1199 | Giữ pin/scrub, bỏ cursor |
| < 900 | Stack dọc, bỏ horizontal scroll & sticky-stack, giảm canvas, reveal đơn giản |
| Touch | Không hover: thay bằng `:active` + tap reveal |

Dùng `ScrollTrigger.matchMedia` / `gsap.matchMedia()` để bật tắt theo breakpoint.

---

## 9. Lộ trình triển khai

| Phase | Nội dung | Kết quả kiểm tra |
|---|---|---|
| **P0 — Setup** (0.5–1 ngày) | `ng new`, SCSS tokens, font self-host, ESLint/Prettier, cấu trúc thư mục, cài `gsap` `lenis`; trích ảnh từ docx → tối ưu AVIF/WebP | `ng serve` chạy, font tiếng Việt hiển thị đúng |
| **P1 — Core motion** (1–2 ngày) | `MotionService`, Lenis↔ScrollTrigger, directive `appReveal/appSplitText/appSpotlight/appMagnetic/appCounter`, header/footer/preloader/progress, i18n | Demo page thử tất cả directive, đổi route không rò rỉ trigger |
| **P2 — Home** (2–3 ngày) | 9 section Home + hero network canvas + sticky/pin | Đối chiếu từng section với `Home.png` |
| **P3 — Services hub** (2 ngày) | 6 section + horizontal scroll + lưới AI + expanding panels | Đối chiếu `Services.png` |
| **P4 — Why LTA, Customers, Contact** (2 ngày) | 3 trang + logo wall + marquee + Flip filter + form UI | Đối chiếu 3 ảnh thiết kế |
| **P5 — Service detail + CDN showcase** (2–3 ngày) | Template block, dot-map, CDN flow pin-scrub, shared-element transition | CDN flow chạy đúng cả cache hit/miss |
| **P6 — Polish & QA** (1–2 ngày) | Reduced motion, mobile, Lighthouse, cross-browser (Chrome/Safari/Firefox), sửa giật | Đạt ngân sách mục 8.1 |
| **P7 — Mở rộng** (tuỳ chọn) | Đổ data các trang dịch vụ còn lại; prerender nếu cần SEO; deploy (Vercel/Netlify/GitHub Pages) | — |

> Tổng ước lượng **~11–16 ngày làm việc** cho MVP đầy đủ (P0–P6) nếu làm một mình.

### Checklist Definition of Done (mỗi trang)

- [ ] Khớp bố cục thiết kế ở desktop
- [ ] Có phiên bản mobile hợp lý
- [ ] Mọi animation dọn dẹp khi rời trang (`ctx.revert()`)
- [ ] Hoạt động với `prefers-reduced-motion`
- [ ] VI & EN đều không tràn chữ
- [ ] Không cảnh báo console, không layout shift
- [ ] Lighthouse mobile ≥ 85

---

## 10. Rủi ro & điểm cần chốt

| Vấn đề | Rủi ro | Cách xử lý / Cần bạn quyết định |
|---|---|---|
| Ảnh thiết kế là screenshot bố cục rộng 1366 px | Cắt hình từ screenshot để dùng trên web sẽ mờ và lẫn chữ | Dùng ảnh nhúng trong DOCX theo mục 2.5; xin file ảnh gốc nếu cần hero độ phân giải cao |
| **Logo đối tác** chỉ có trong screenshot nền trắng | Logo cắt ra sẽ răng cưa, không đồng đều | Xin bộ logo SVG/PNG chính thức; trước khi có, dùng ô tên đối tác có kiểu chữ rõ ràng hoặc tạm ẩn logo chưa đạt chất lượng |
| Quyền sử dụng logo/nhãn hiệu | Pháp lý | Xác nhận LTA được phép hiển thị |
| Hiệu ứng nặng trên máy yếu | Giật, nóng máy | Ngân sách 8.1, tắt có điều kiện |
| Tiếng Việt + SplitText | Vỡ dấu khi tách ký tự | Ưu tiên tách theo từ/dòng, `revert()` khi đổi ngôn ngữ |
| SEO (site giới thiệu công ty) | Angular SPA kém SEO mặc định | Phạm vi hiện tại chỉ UI; nếu cần thì bật prerender (SSG) ở P7 |
| Phạm vi trang chi tiết | Nội dung docx rất dài (11 chủ đề) | MVP làm sâu `cloud-cdn`, còn lại đổ data dần |
| Số liệu thống kê | Dùng sai | Chỉ dùng số trong mục 1.3, số khác cần khách xác nhận |

### Câu hỏi cần bạn chốt trước khi code

1. Giữ **tông navy + 3 màu accent từ logo** như plan, hay có brand guideline chính thức?
2. Có file **logo LTA dạng SVG** (đặc biệt 3 vòng wifi) để làm preloader vẽ nét không?
3. Có file **ảnh gốc** (hero, thành phố, phòng server) hay dùng ảnh trích từ docx?
4. Trang chi tiết dịch vụ: làm **CDN trước** rồi mở rộng, đúng không?
5. Mức "mạnh tay" của animation: **Cân bằng** (khuyến nghị) hay **Tối đa** (cursor + horizontal scroll + pin ở hầu hết section)?

---

## 11. Phụ lục

### 11.1 Khởi tạo dự án

```bash
npm i -g @angular/cli
ng new lta-website --style=scss --routing --ssr=false
cd lta-website
npm i gsap lenis
```

### 11.2 `MotionService` — GSAP + Lenis

```ts
import { Injectable, NgZone, inject } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

@Injectable({ providedIn: 'root' })
export class MotionService {
  private zone = inject(NgZone);
  private lenis?: Lenis;

  readonly reduced =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  init() {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    if (this.reduced) return;

    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => this.lenis!.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    });
  }

  get velocity() { return this.lenis?.velocity ?? 0; }   // dùng cho marquee skew
  refresh() { ScrollTrigger.refresh(); }
}
```

```ts
// app.config.ts — khởi tạo 1 lần
provideAppInitializer(() => inject(MotionService).init())
```

### 11.3 Directive `appReveal`

```ts
import { Directive, ElementRef, DestroyRef, afterNextRender, inject, input } from '@angular/core';
import gsap from 'gsap';
import { MotionService } from '../../core/motion/motion.service';

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective {
  variant = input<'fade-up' | 'mask' | 'blur'>('fade-up', { alias: 'appReveal' });
  delay = input(0);

  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private motion = inject(MotionService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (this.motion.reduced) return;
      const ctx = gsap.context(() => {
        const from = {
          'fade-up': { y: 40, opacity: 0 },
          'mask':    { clipPath: 'inset(0 0 100% 0)', y: 30 },
          'blur':    { filter: 'blur(14px)', opacity: 0, scale: 1.04 },
        }[this.variant()];

        gsap.from(this.el, {
          ...from,
          duration: 1,
          delay: this.delay(),
          ease: 'expo.out',
          scrollTrigger: { trigger: this.el, start: 'top 85%', once: true },
        });
      }, this.el);
      this.destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
```

### 11.4 Split text theo dòng (mask reveal)

```ts
const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'line' });
gsap.from(split.lines, {
  yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08,
  scrollTrigger: { trigger: el, start: 'top 80%', once: true },
});
// đổi ngôn ngữ: split.revert() rồi tạo lại
```

### 11.5 Spotlight + viền conic (thuần CSS + 6 dòng JS)

```scss
.bento {
  position: relative; border-radius: var(--radius-card);
  background: var(--navy-800); isolation: isolate;
  &::before {                       // spotlight theo con trỏ
    content: ''; position: absolute; inset: 0; border-radius: inherit; z-index: -1;
    background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%),
                rgba(48,144,192,.28), transparent 45%);
    opacity: 0; transition: opacity .3s;
  }
  &:hover::before { opacity: 1; }
  &::after {                        // viền conic xoay
    content: ''; position: absolute; inset: 0; padding: 1px; border-radius: inherit;
    background: var(--signal-gradient);
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude; opacity: 0; transition: opacity .3s;
    animation: spin 6s linear infinite;
  }
  &:hover::after { opacity: 1; }
}
@keyframes spin { to { --angle: 360deg; } }
```

```ts
// appSpotlight: cập nhật --mx / --my
host.addEventListener('pointermove', (e) => {
  const r = host.getBoundingClientRect();
  host.style.setProperty('--mx', `${e.clientX - r.left}px`);
  host.style.setProperty('--my', `${e.clientY - r.top}px`);
});
```

### 11.6 Scroll-driven CSS (không JS, progressive enhancement)

```scss
@supports (animation-timeline: view()) {
  .rise {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 5% cover 30%;
  }
  .progress-bar {
    transform-origin: 0 50%;
    animation: grow linear both;
    animation-timeline: scroll(root);
  }
}
@keyframes rise { from { opacity: 0; transform: translateY(40px); } }
@keyframes grow { from { transform: scaleX(0); } }
```

### 11.7 CDN flow — pin + scrub + MotionPath (phác thảo)

```ts
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const tl = gsap.timeline({
  scrollTrigger: { trigger: '.cdn-flow', start: 'top top', end: '+=3200', pin: true, scrub: 0.6 },
});

tl.to('.packet', { motionPath: { path: '#p-user-dns',  align: '#p-user-dns'  }, duration: 1 })  // 1. User → DNS
  .to('.step-1', { opacity: 1 }, '<')
  .to('.packet', { motionPath: { path: '#p-dns-pop',   align: '#p-dns-pop'   }, duration: 1 })  // 2. DNS → PoP
  .to('.step-2', { opacity: 1 }, '<')
  .add(() => cacheHit.classList.add('flash'))                                                   // 3. Cache check
  .to('.packet', { motionPath: { path: '#p-pop-origin',align: '#p-pop-origin'}, duration: 1 })  // 4. Miss → Origin
  .to('.packet', { motionPath: { path: '#p-origin-user',align:'#p-origin-user'}, duration: 1.4 }); // 5. Cache + trả về
```

### 11.8 Hero network — thông số canvas

| Thông số | Desktop | Mobile |
|---|---|---|
| Số node | 90 | 40 |
| Khoảng cách nối | 140px | 110px |
| Phản ứng chuột | Đẩy node trong bán kính 120px | Tắt |
| Gói dữ liệu | 1 gói / 600ms trên cạnh ngẫu nhiên | 1 gói / 1200ms |
| DPR | `min(devicePixelRatio, 2)` | `min(devicePixelRatio, 1.5)` |
| Dừng khi | Ra khỏi viewport · tab ẩn · reduced motion | như trái |

Vẽ bằng `requestAnimationFrame`, `ResizeObserver` cho kích thước, màu node `--sky-400`, đường nối alpha giảm theo khoảng cách, gói dữ liệu màu `--gold-400`.

### 11.9 Chuẩn bị asset

```bash
# Trích ảnh từ docx
mkdir -p assets-src && unzip -j 'docs/Website LTA.docx' 'word/media/*' -d assets-src

# Tối ưu (ví dụ dùng sharp-cli)
npx sharp-cli -i "assets-src/*.png" -o public/img/ -f avif -q 60 --resize 1920
npx sharp-cli -i "assets-src/*.png" -o public/img/ -f webp -q 78 --resize 1920
```

### 11.10 Danh sách 36 logo (Customers & Partners)

TikTok · Vietnamobile · Vinaphone · Alibaba Cloud · BytePlus · VEGA Corporation · CDNetworks · Viettel IDC · MobiFone · VMG Media Group · ByteDance · Vertiv · Telemor · Schneider Electric · Commax · Lumitel · iSMA Controlli · Monty Mobile · Viettel · VDCA · K+ · TV360 · Bitel · Halotel · Movitel · VAST · SCTV · VTC · Mytel · Viettel Global · Metfone · Unitel · VTVgo · VTVcab · Telsoft · Natcom

### 11.11 Tham chiếu hiệu ứng ↔ trang (tra nhanh)

| Hiệu ứng | Home | Services | Detail | Why | Customers | Contact |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| A1 Smooth scroll | ● | ● | ● | ● | ● | ● |
| A3 Network canvas | ● | | | ● | | |
| A4 Split text | ● | ● | ● | ● | ● | ● |
| A6 Pin-scrub | ● | | ● | ● | | |
| A7 Horizontal scroll | | ● | | | | |
| A8 Sticky stack | ● | | | | | |
| A9 Spotlight | ● | ● | ● | ● | ● | |
| A10 Tilt | | ● | | | | |
| A14 Marquee | ● | | | | ● | |
| A18 Expanding panels | | ● | | | | |
| A20 SVG flow | | | ● | | | |
| A21 Dot-map | ● | | ● | | | |
| A23 Shared element | | ● | ● | | | |

---

**Bước tiếp theo đề xuất:** bạn chốt 5 câu hỏi ở mục 10, mình bắt đầu từ **P0 → P1** (khung Angular + hệ thống animation), sau đó dựng **Home** đối chiếu với `Home.png`.
