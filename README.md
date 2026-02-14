# ERKATEK Makina - Endüstriyel Makina Platform

Makina üretim firması için modern, production-ready web sitesi ve yönetim paneli.

## Teknoloji Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Validation**: Zod v4
- **Icons**: Lucide React

## Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Environment variables

`.env.example` dosyasını `.env` olarak kopyalayıp değerleri güncelleyin:

```bash
cp .env.example .env
```

Önemli: `AUTH_SECRET` değerini güvenli bir değer ile değiştirin:

```bash
openssl rand -base64 32
```

### 3. Database kurulumu

PostgreSQL'de database oluşturun:

```sql
CREATE DATABASE erkatek_db;
```

Prisma ile tabloları oluşturun:

```bash
npm run db:push
```

### 4. Seed data (örnek veri)

```bash
npm run db:seed
```

Bu komut aşağıdakileri oluşturur:
- Admin kullanıcı: `admin@erkatek.com` / `admin123`
- 5 örnek sektör
- 3 örnek makina

### 5. Geliştirme sunucusu

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışır.

## Sayfa Yapısı

### Public Sayfalar
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Hero, istatistikler, öne çıkan özellikler |
| Hakkımızda | `/hakkimizda` | Firma bilgileri, tarihçe, değerler |
| Sektörler | `/sektorler` | Tüm sektörlerin listesi |
| Sektör Detay | `/sektorler/[slug]` | Sektöre ait makinalar |
| Makina Detay | `/makinalar/[slug]` | Makina detayları, teknik özellikler |
| İletişim | `/iletisim` | İletişim formu ve bilgiler |

### Admin Panel
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Giriş | `/admin/giris` | Admin login |
| Dashboard | `/admin/dashboard` | İstatistik özeti |
| Sektörler | `/admin/sektorler` | Sektör CRUD yönetimi |
| Makinalar | `/admin/makinalar` | Makina listesi |
| Yeni Makina | `/admin/makinalar/yeni` | Makina ekleme formu |
| Makina Düzenle | `/admin/makinalar/[id]/duzenle` | Makina düzenleme |

## NPM Scripts

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucu
npm run lint         # ESLint kontrolü
npm run db:generate  # Prisma client oluştur
npm run db:push      # Schema'yı database'e uygula
npm run db:migrate   # Migration oluştur ve uygula
npm run db:seed      # Örnek veri ekle
npm run db:studio    # Prisma Studio (GUI)
npm run db:reset     # Database sıfırla
```

## Proje Yapısı

```
├── app/
│   ├── (public)/          # Public route group
│   │   ├── page.tsx       # Ana sayfa
│   │   ├── hakkimizda/
│   │   ├── sektorler/
│   │   ├── makinalar/
│   │   └── iletisim/
│   ├── admin/             # Admin panel
│   │   ├── giris/
│   │   └── (dashboard)/
│   │       ├── dashboard/
│   │       ├── sektorler/
│   │       └── makinalar/
│   └── api/               # API routes
│       ├── auth/
│       └── admin/
├── components/
│   ├── admin/             # Admin components
│   ├── public/            # Public components
│   └── shared/            # Shared components
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   ├── utils.ts           # Utility functions
│   └── validations/       # Zod schemas
├── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
└── middleware.ts           # Auth middleware
```
