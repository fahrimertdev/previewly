# CLAUDE.md — Previewly

## Proje Özeti
Previewly, freelancer ve ajansların müşterilerine deploy preview linkleri paylaşmasını ve müşterilerin sayfa üzerinde görsel feedback bırakmasını sağlayan bir web uygulaması.

Problem: Freelancer müşteriye WIP site linki atıyor, müşteri "şu şeyi sola kaydır" diyor, hangi şey olduğunu anlamak için 15 email gidip geliyor.

Çözüm: Paylaşılabilir preview linki → müşteri sayfanın üstüne tıklayıp yorum bırakır → freelancer tüm yorumları dashboard'dan görür.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase veya Neon)
- **ORM:** Prisma
- **Auth:** NextAuth.js (GitHub + Google login)
- **Deployment:** Vercel
- **Storage:** Supabase Storage veya Cloudflare R2 (screenshot'lar için)
- **Email:** Resend (bildirimler için, MVP sonrası)
- **Domain:** previewly.dev

## Tasarım Yönü
- **Tema:** Light mode, temiz, profesyonel. Freelancer'lar müşteriye gösterecek — güvenilir görünmeli.
- **Renk paleti:** Beyaz arka plan, koyu gri metin, mavi accent (#2563EB), yeşil success (#10B981), turuncu warning (#F59E0B)
- **Tipografi:** Heading'lerde DM Sans veya Plus Jakarta Sans, body'de aynı font lighter weight
- **Vibe:** Notion + Linear karışımı — minimal, fonksiyonel, premium hissi
- **Animasyonlar:** Subtle transitions, loading states. Abartma.

## Özellikler (MVP Scope)

### Kullanıcı (Freelancer) Tarafı

**1. Auth**
- GitHub ve Google ile login (NextAuth.js)
- Hesap oluştur / giriş yap
- Basit profil (isim, email, avatar)

**2. Proje Oluşturma**
- "New Project" butonu
- Proje ismi gir (örn: "Acme Corp Website Redesign")
- Otomatik slug oluştur

**3. Preview Oluşturma**
- Proje içinde "Add Preview" butonu
- URL gir (herhangi bir live URL — Vercel preview, Netlify, custom domain)
- Previewly bu URL için paylaşılabilir bir link oluşturur
- Format: previewly.dev/p/[random-id]

**4. Dashboard**
- Sol sidebar: Proje listesi
- Ana alan: Seçili projenin preview'ları ve yorumları
- Her yorum: sayfa screenshot'ı üzerinde pin lokasyonu, yorum metni, tarih, durum (open/resolved)
- Yorumları "resolved" olarak işaretleme
- Basit filtre: All / Open / Resolved

**5. Ayarlar**
- Proje silme
- Preview silme
- Hesap ayarları (isim, email)

### Müşteri (Client) Tarafı — AUTH YOK

**6. Preview Görüntüleme**
- Müşteri previewly.dev/p/[random-id] linkini açar
- Sayfa bir iframe içinde yüklenir
- Üstte küçük bir toolbar: "Click anywhere to leave a comment" yazısı
- Sayfanın herhangi bir yerine tıklayınca yorum kutusu açılır

**7. Yorum Bırakma**
- Tıklanan yerde bir pin belirir
- Yorum kutusu açılır: isim (opsiyonel), yorum metni
- "Submit" → yorum kaydedilir
- Müşterinin auth'a ihtiyacı yok — anonim yorum bırakabilir
- Mevcut yorumları görebilir (pinler sayfada görünür)

## Veri Modeli (Prisma Schema)

```prisma
model User {
  id        String    @id @default(cuid())
  name      String?
  email     String    @unique
  image     String?
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Project {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  previews  Preview[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Preview {
  id        String    @id @default(cuid())
  url       String
  shareId   String    @unique @default(cuid())
  projectId String
  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id         String   @id @default(cuid())
  text       String
  authorName String?  @default("Anonymous")
  xPercent   Float    // Tıklanan x pozisyonu (% olarak, responsive uyumluluk için)
  yPercent   Float    // Tıklanan y pozisyonu (% olarak)
  resolved   Boolean  @default(false)
  previewId  String
  preview    Preview  @relation(fields: [previewId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
}
```

## Dosya/Klasör Yapısı

```
previewly/
├── CLAUDE.md
├── next.config.js
├── tailwind.config.js
├── package.json
├── tsconfig.json
├── prisma/
│   └── schema.prisma
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Landing page (marketing)
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx             # Login sayfası
│   │   │   └── layout.tsx               # Auth layout (centered)
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx               # Dashboard layout (sidebar + main)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx             # Proje listesi
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Proje detay (preview'lar + yorumlar)
│   │   │   └── settings/
│   │   │       └── page.tsx             # Hesap ayarları
│   │   │
│   │   ├── p/
│   │   │   └── [shareId]/
│   │   │       └── page.tsx             # Public preview sayfası (müşteri görüntüler)
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts         # NextAuth API route
│   │       ├── projects/
│   │       │   └── route.ts             # CRUD projects
│   │       ├── previews/
│   │       │   └── route.ts             # CRUD previews
│   │       └── comments/
│   │           └── route.ts             # CRUD comments
│   │
│   ├── components/
│   │   ├── ui/                          # Genel UI bileşenleri
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx              # Dashboard sidebar
│   │   │   ├── Navbar.tsx               # Üst navbar
│   │   │   └── Logo.tsx
│   │   ├── dashboard/
│   │   │   ├── ProjectCard.tsx          # Proje kartı
│   │   │   ├── PreviewList.tsx          # Preview listesi
│   │   │   ├── CommentList.tsx          # Yorum listesi
│   │   │   ├── AddPreviewForm.tsx       # URL girme formu
│   │   │   └── CreateProjectModal.tsx   # Yeni proje modal
│   │   ├── preview/
│   │   │   ├── PreviewFrame.tsx         # iframe + overlay container
│   │   │   ├── CommentPin.tsx           # Sayfadaki yorum pin'i
│   │   │   ├── CommentForm.tsx          # Yorum yazma formu (popup)
│   │   │   ├── CommentOverlay.tsx       # Tüm pinleri gösteren overlay
│   │   │   └── PreviewToolbar.tsx       # Üstteki bilgi çubuğu
│   │   └── landing/
│   │       ├── Hero.tsx                 # Landing hero section
│   │       ├── Features.tsx             # Özellikler
│   │       ├── HowItWorks.tsx           # Nasıl çalışır (3 adım)
│   │       ├── Pricing.tsx              # Fiyatlandırma
│   │       └── Footer.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts                    # Prisma client singleton
│   │   ├── auth.ts                      # NextAuth config
│   │   └── utils.ts                     # Yardımcı fonksiyonlar
│   │
│   └── types/
│       └── index.ts                     # TypeScript type tanımları
```

## Sayfa Detayları

### Landing Page (/)
Marketing sayfası. Giriş yapmamış kullanıcılar bunu görür.

Bölümler:
1. **Hero:** "Stop explaining designs over email." + alt başlık + "Get Started Free" CTA + "See how it works" link
2. **How It Works:** 3 adım — Paste URL → Share Link → Get Feedback (ikonlarla)
3. **Features:** Visual feedback, No client login needed, Real-time comments, Resolve & track
4. **Pricing:**
   - Free: 2 projeler, sınırsız yorum, sınırsız preview
   - Pro ($12/ay): Sınırsız proje, custom branding, export, priority support
   - Team ($25/ay): Çoklu kullanıcı, rol yönetimi, analytics
   MVP'de sadece Free tier çalışsın, Pro/Team "Coming Soon" badge'i olsun
5. **Footer:** Logo, linkler, "Built by Fahri Mert 🇹🇷", sosyal linkler

### Login (/login)
- Temiz, centered layout
- "Sign in to Previewly"
- GitHub ile giriş butonu
- Google ile giriş butonu
- Altta: "By signing in, you agree to our Terms"

### Dashboard (/projects)
- Sol sidebar: Logo + Projeler listesi + "New Project" butonu + alt kısımda ayarlar + profil
- Ana alan: Seçili proje yoksa "Create your first project" empty state
- Proje seçiliyse: proje adı + preview listesi + her preview'ın yorum sayısı

### Proje Detay (/projects/[slug])
- Proje başlığı + "Add Preview" butonu
- Preview kartları: URL, oluşturma tarihi, yorum sayısı (open/resolved), "Copy Share Link" butonu, "Open Preview" butonu
- Bir preview'a tıklayınca: sağ tarafta yorum listesi açılır
- Her yorum: pin lokasyonu, yorum metni, yazar, tarih, "Resolve" butonu

### Public Preview (/p/[shareId])
Bu sayfa müşterinin gördüğü sayfa — EN KRİTİK SAYFA.

- Üstte ince toolbar: Previewly logosu (küçük) + "Click anywhere to leave feedback" yazısı + yorum sayısı
- Ana alan: iframe içinde hedef URL yüklenir
- iframe üstünde şeffaf overlay katmanı
- Overlay'e tıklayınca:
  1. Tıklanan yerde bir pin belirir
  2. Küçük form popup'ı açılır: Name (opsiyonel, placeholder: "Anonymous"), Comment (textarea, required), "Submit" butonu
  3. Submit → pin kalıcı olur, yorum kaydedilir
- Daha önce bırakılmış yorumlar pin olarak görünür
- Pin'e hover → yorum içeriği tooltip olarak görünür
- Pin'e tıkla → yorum detayı açılır

### Teknik detaylar — iframe + overlay sistemi:
- iframe URL'yi yükler
- iframe üstünde absolute pozisyonlu şeffaf bir div (overlay)
- Overlay click event'ini yakalar → koordinatları yüzde (%) olarak hesaplar (responsive uyum için)
- Koordinatlar ve yorum metni API'ye gönderilir
- Pinler overlay üzerinde gösterilir (left: x%, top: y%)
- iframe içindeki sayfayla etkileşim: overlay modda iken click yakalanır, "browse mode"da iframe ile normal etkileşim
- Toggle butonu: "Comment Mode" ↔ "Browse Mode"

## API Endpoints

```
POST   /api/projects          → Yeni proje oluştur
GET    /api/projects          → Kullanıcının projelerini listele
DELETE /api/projects/[id]     → Proje sil

POST   /api/previews          → Yeni preview oluştur (projectId, url)
GET    /api/previews/[shareId] → Public preview verisini getir (auth gerektirmez)
DELETE /api/previews/[id]     → Preview sil

POST   /api/comments          → Yeni yorum ekle (previewId, text, authorName, xPercent, yPercent)
GET    /api/comments/[previewId] → Preview'ın yorumlarını getir (auth gerektirmez)
PATCH  /api/comments/[id]     → Yorumu resolved olarak işaretle
DELETE /api/comments/[id]     → Yorum sil
```

## Ortam Değişkenleri (.env)

```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-key"
GITHUB_ID="..."
GITHUB_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Önemli Kurallar

### Yapılacaklar
- Mobile responsive (müşteri telefon/tabletten de bakabilir)
- Semantic HTML + erişilebilirlik
- SEO meta tag'leri (landing page için özellikle)
- Loading states (skeleton loaders)
- Error handling (toast notifications)
- Empty states (proje yok, preview yok, yorum yok durumları için güzel UI)
- Optimistic updates (yorum submit edildiğinde anında görünsün, arka planda kaydet)
- URL validation (preview URL'si valid mi kontrol et)
- Rate limiting (yorum spam'ını önle)

### Yapılmayacaklar (MVP dışı)
- GitHub entegrasyonu (otomatik preview on push) — v2
- Figma tarzı yorum thread'leri — v2
- Team/çoklu kullanıcı — v2
- Custom branding — v2
- Export (PDF/CSV) — v2
- Email bildirimleri — v2
- Screenshot capture — v2
- Analytics — v2
- Real-time (WebSocket) güncellemeler — v2, şimdilik polling veya refetch yeterli
- Ödeme sistemi (Stripe/LemonSqueezy) — v2, MVP'de sadece free tier

## Komutlar

```bash
# Proje oluşturma
npx create-next-app@latest previewly --typescript --tailwind --app --src-dir

# Prisma kurulumu
npm install prisma @prisma/client
npx prisma init
# schema.prisma'yı yukarıdaki gibi düzenle
npx prisma db push
npx prisma generate

# Auth kurulumu
npm install next-auth @auth/prisma-adapter

# Geliştirme
npm run dev

# Deploy
npx vercel
```

## MVP Tamamlanma Kriterleri
- [ ] Landing page render oluyor
- [ ] GitHub/Google ile login çalışıyor
- [ ] Proje oluşturma çalışıyor
- [ ] Preview oluşturma (URL girme) çalışıyor
- [ ] Share link oluşuyor ve kopyalanabiliyor
- [ ] Public preview sayfası URL'yi iframe'de yüklüyor
- [ ] Comment mode'da tıklayıp yorum bırakılabiliyor
- [ ] Yorumlar pin olarak görünüyor
- [ ] Dashboard'da yorumlar listeleniyor
- [ ] Yorum resolved olarak işaretlenebiliyor
- [ ] Mobilde düzgün çalışıyor
- [ ] Vercel'e deploy edilebiliyor

## Geliştirme Sırası (önerilen)
1. Proje setup (Next.js + Tailwind + Prisma + Auth)
2. Database schema + migration
3. Auth (login/logout)
4. Dashboard layout (sidebar + main area)
5. Proje CRUD
6. Preview CRUD + share link
7. Public preview sayfası (iframe + overlay)
8. Comment sistemi (pin + form + kaydetme)
9. Dashboard'da yorum listesi + resolve
10. Landing page
11. Polish (loading states, error handling, empty states)
12. Deploy
