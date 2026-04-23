# Architecture & Tech Stack

**Status:** Active  
**Version:** 3.6  
**Last Updated:** 2026-04-23  

---

## Current State

Foundation Fase 1 (GETTING_STARTED.md § FASE 1) sudah selesai dan terverifikasi:

- Project Next.js 14 + TypeScript + Tailwind CSS sudah di-init manual (bukan via `create-next-app`) dengan struktur folder sesuai spec
- `lib/supabase/client.ts`, `lib/supabase/server.ts` sudah ada; `lib/supabase/types.ts` sudah di-generate dari Supabase via `supabase` CLI (devDep) dan bukan placeholder lagi
- `proxy.ts` sudah memproteksi `/dashboard/*` pakai `getUser()` dan refresh cookie session di route lain
- `.env.example` dan `.gitignore` sudah ada; `.env.local` terisi lengkap termasuk `NEXT_PUBLIC_CONTACT_URL` (WhatsApp)
- `supabase/migrations/001_initial_schema.sql` sudah dijalankan di Supabase dashboard — tabel `profiles`, `ebooks`, trigger `handle_new_user`, dan RLS minimum aktif
- Storage bucket `ebook-pdfs` (private) dan `ebook-covers` (public) sudah dibuat di Supabase dashboard
- Konfigurasi Supabase Auth dashboard (Confirm email, Site URL, Redirect URLs, password min 8) sudah di-set sesuai checklist `specs/features/01-auth.md`
- `npm install` sudah jalan, `npx tsc --noEmit` lulus tanpa error

Status implementasi lanjutan:

- Fase 2 auth sudah dibuat lengkap: `(auth)/login`, `(auth)/register`, `(auth)/register/success`, `(auth)/forgot-password`, `(auth)/reset-password`, dan `auth/callback`
- Fase 3 dasar juga sudah berjalan: `/dashboard/catalog`, komponen katalog, `/dashboard/upgrade`, dan route `/dashboard/read/[ebookId]` dengan access gate server-side
- Fase 4 PDF viewer sudah selesai: `react-pdf@^9` + `pdfjs-dist@^4` terpasang; komponen `components/pdf/pdf-viewer.tsx` memakai signed URL dari API; API route `app/api/ebook/[id]/stream/route.ts` generate signed URL 15 menit via service role client (`lib/supabase/service.ts`) dan sudah membawa gate 401/403/404 yang sama dengan route baca
- Upgrade Next.js 16.2.4 + React 19.2.5 + `@supabase/ssr@0.10.2` sudah selesai (`build` lulus, `tsc --noEmit` lulus); breaking changes Next.js 15–16 sudah di-handle (lihat § Pola Kode)
- Fase 5 selesai: landing page `/` (Server Component dengan redirect ke `/dashboard/catalog` untuk user login), `/pricing`, dan `/dashboard/profile` sudah jalan; navbar+footer publik di `components/marketing/`; util kontak terpusat di `lib/contact.ts` + `components/marketing/contact-cta.tsx` dipakai oleh landing/pricing/upgrade/profile
- Fase 6 selesai:
  - SEO metadata dasar dipusatkan di `app/layout.tsx` (title template, `metadataBase` dari `NEXT_PUBLIC_APP_URL`, OG/Twitter default, robots allow); halaman publik (`/`, `/pricing`) punya metadata per-route dengan `alternates.canonical`; halaman auth + dashboard di-`noindex`
  - `app/robots.ts` dan `app/sitemap.ts` di-generate native Next.js `MetadataRoute` (hasil build: `/robots.txt` + `/sitemap.xml` static)
  - `components/analytics/google-analytics.tsx` memuat GA4 via `next/script` hanya jika `NEXT_PUBLIC_GA_MEASUREMENT_ID` terisi; di-mount sekali di root layout
  - Dashboard header responsive: `flex-wrap + gap-x-4 gap-y-2` supaya nav (Katalog/Premium/Profile/Logout + user info) tidak overflow di viewport sempit; brand block pakai `min-w-0 truncate`
  - `npm run build` lulus dengan Turbopack tanpa warning (15 routes, 5 static termasuk `robots.txt` dan `sitemap.xml`); `npx tsc --noEmit` lulus
  - Audit credential: tidak ada supabase URL/anon key/service role literal di repo di luar `.env.example` placeholder dan spec docs
- Domain custom belum dibeli (opsional, bisa pakai subdomain Vercel saat deploy)

---

## Tech Stack

| Layer | Teknologi | Versi | Alasan |
|---|---|---|---|
| Framework | Next.js | 16.x (App Router, Turbopack) | SSR/SSG untuk SEO, mudah di-extend |
| Runtime UI | React | 19.x | Concurrent features, latest stable |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.x | Cepat dan konsisten |
| Database & Auth | Supabase | Latest | Built-in auth, storage, Postgres, RLS |
| Supabase SSR | @supabase/ssr | 0.10.x | Cookie-based session management untuk Next.js |
| PDF Viewer | react-pdf | 9.x | Render PDF di browser |
| Hosting | Vercel | - | Cukup untuk deploy publik fase 1 |
| Storage PDF | Supabase Storage | - | Private bucket untuk PDF, public bucket untuk cover |
| Email | Supabase Auth email flow | - | Saat ini pakai delivery bawaan Supabase; custom SMTP dapat dikonfigurasi di dashboard tanpa mengubah flow aplikasi |
| Analytics | Google Analytics | GA4 | Opsional, cukup untuk MVP |
| Payment | Mayar (deferred) | - | Direncanakan untuk fase berikutnya, bukan scope fase 1 |
| Admin | Supabase Dashboard | - | Tidak ada admin panel custom di MVP |

### Yang Tidak Dipakai di Fase 1

- `pdf-lib`
- Stripe
- Integrasi Mayar
- Admin panel custom

---

## Struktur Folder

```text
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── success/
│   │   │       └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── catalog/
│   │   │   └── page.tsx
│   │   ├── read/
│   │   │   └── [ebookId]/
│   │   │       └── page.tsx
│   │   ├── upgrade/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── api/
│   │   └── ebook/
│   │       └── [id]/
│   │           └── stream/
│   │               └── route.ts
│   ├── pricing/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── pdf/
│   ├── ebook/
│   ├── auth/
│   ├── marketing/
│   └── ui/
├── lib/
│   ├── supabase/
│   ├── access.ts
│   ├── auth.ts
│   └── contact.ts
├── proxy.ts
├── canvas-stub.js
├── specs/
└── CLAUDE.md
```

> Catatan: `app/(auth)/` adalah route group Next.js — tidak memengaruhi URL, hanya untuk mengelompokkan halaman form auth. Route callback email (`/auth/callback`) ditempatkan terpisah di `app/auth/callback/` agar tidak ikut ter-group dan tetap bisa diakses publik tanpa layout khusus `(auth)`.

> Route payment seperti `/api/checkout/create` dan `/api/webhooks/mayar` belum dibutuhkan di fase 1. Jika fase membership dimulai nanti, route tersebut ditambahkan kembali melalui update spec.

---

## Pola Kode yang Wajib Diikuti

### Server vs Client Components

- Default: Server Component
- Gunakan `"use client"` hanya jika perlu interaktivitas browser
- Form auth dan PDF viewer adalah Client Component

### Data Fetching

- Gunakan `createServerClient` untuk Server Components dan Route Handlers
- Gunakan `createBrowserClient` untuk Client Components
- Selalu handle error

### Authentication Pattern

> **Next.js 16+:** `createServerClient` adalah `async function` — wajib di-`await`.
> **Next.js 16+:** `params` dan `searchParams` di page/route handler adalah `Promise` — wajib di-`await`.

```typescript
import { createServerClient } from '@/lib/supabase/server'

const supabase = await createServerClient()
const {
  data: { user },
} = await supabase.auth.getUser()

if (!user) redirect('/login')
```

Dynamic route page:
```typescript
// BENAR (Next.js 16+)
type Props = { params: Promise<{ id: string }> };
export default async function Page({ params }: Props) {
  const { id } = await params;
  // ...
}
```

`searchParams` di page:
```typescript
// BENAR (Next.js 16+)
type Props = { searchParams?: Promise<{ q?: string }> };
export default async function Page({ searchParams }: Props) {
  const resolved = await searchParams;
  // gunakan resolved?.q
}
```

### Route Protection

- `proxy.ts` (dahulu `middleware.ts`, rename di Next.js 16) hanya cek auth untuk `/dashboard/*`
- Export function wajib bernama `proxy` (bukan `middleware`) di Next.js 16+
- Gunakan `getUser()`, bukan `getSession()`
- Pengecekan akses premium placeholder dilakukan di Server Component atau API Route, bukan di proxy
- Flow verifikasi email dan reset password boleh melewati route callback auth khusus sebelum diarahkan ke halaman final

### TypeScript

- Hindari `any`
- Generate types dari Supabase ke `lib/supabase/types.ts`

### Error Handling

- API route return proper HTTP status
- Log error ke `console.error`
- UI tampilkan error message yang user-friendly

### Email Delivery Boundary

- Verification email dan reset password tetap dianggap bagian dari Supabase Auth flow
- Jika custom SMTP diaktifkan, konfigurasi utamanya ada di Supabase dashboard, bukan di Next.js app runtime
- Artinya, app tidak perlu menambah mailer backend hanya untuk verifikasi email / reset password
- Risiko tambahan saat custom SMTP aktif:
  - kredensial SMTP salah
  - sender identity belum tervalidasi
  - SPF/DKIM/DMARC belum benar
  - rate limit atau deliverability provider mengganggu auth flow

---

## Keputusan Teknis

| Keputusan | Alternatif yang Ditolak | Alasan |
|---|---|---|
| Supabase untuk auth + DB + storage | Firebase, NextAuth + raw Postgres | Satu ekosistem |
| PDF viewer in-browser dengan react-pdf | iframe, PDF.js vanilla | Kontrol UI penuh |
| Tanpa watermark di fase 1 | pdf-lib server-side | Hemat waktu development |
| Private bucket + signed URL | Public URL dengan auth check | URL publik bisa disebarkan |
| Callback auth terpusat untuk email flow | Menangani semua token langsung di halaman form | Alur verifikasi dan reset password lebih stabil |
| Tanpa payment di fase 1 | Memaksa recurring billing sejak awal | Mengurangi risiko integrasi dan mempercepat launch publik |
| Tanpa admin panel di MVP | Custom admin UI | Supabase dashboard cukup |

---

## Supabase Storage Buckets

Nama bucket di bawah ini adalah sumber kebenaran. Semua spec fitur dan SOP harus merujuk ke nama yang sama.

| Nama Bucket | Visibility | Fungsi |
|---|---|---|
| `ebook-pdfs` | Private | File PDF ebook. Hanya diakses via signed URL yang di-generate server-side |
| `ebook-covers` | Public | Cover image ebook. URL publik boleh disimpan langsung di `ebooks.cover_url` |

Kedua bucket wajib dibuat manual di Supabase dashboard sebelum implementasi fase 1 dimulai. Referensi operasional: `GETTING_STARTED.md` bagian 1.1 dan `specs/features/05-admin-operations.md`.

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_CONTACT_URL=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

> `NEXT_PUBLIC_CONTACT_URL` adalah sumber kebenaran tunggal untuk semua CTA `Hubungi Kami` pada fase 1.
> Environment variable payment belum dibutuhkan di fase 1. Saat fase membership dimulai, env Mayar ditambahkan kembali melalui update spec.
> Jika custom SMTP diaktifkan, konfigurasi SMTP tidak disimpan sebagai env aplikasi Next.js kecuali ada perubahan arsitektur eksplisit; source of truth tetap Supabase Auth dashboard.

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-15 | 1.0 | Initial arsitektur |
| 2026-04-16 | 2.0 | Payment provider Mayar masuk scope |
| 2026-04-16 | 2.1 | Sinkronisasi env dan route payment Mayar |
| 2026-04-20 | 2.2 | Scope fase 1 dipersempit ke public deployable baseline tanpa route/env/payment module Mayar |
| 2026-04-20 | 2.3 | Tambah anchor arsitektur untuk flow reset password dan callback auth agar onboarding implementasi tidak buntu |
| 2026-04-21 | 2.4 | Rapikan ASCII tree struktur folder; pisahkan `app/auth/callback/` dari route group `app/(auth)/` agar tidak ambigu |
| 2026-04-21 | 2.5 | Deklarasikan nama canonical Supabase Storage buckets (`ebook-pdfs`, `ebook-covers`) agar tidak perlu ditebak dari SOP |
| 2026-04-21 | 2.6 | Tambah § Current State: scaffolding Next.js 14, lib/supabase, middleware, dan env files Fase 1 sudah jalan |
| 2026-04-21 | 2.7 | Update § Current State: migration sudah jalan, buckets + auth dashboard ter-konfigurasi, types ter-regenerate dari Supabase |
| 2026-04-21 | 2.8 | Update § Current State: route auth fase 2 sudah terimplementasi, plus dashboard scaffold minimum untuk target redirect login |
| 2026-04-21 | 2.9 | Klarifikasi boundary email: auth tetap via Supabase Auth, custom SMTP diposisikan sebagai layer delivery operasional |
| 2026-04-21 | 3.0 | Sinkronisasi Current State dengan repo aktual: fase 2 dan fase 3 dasar sudah jalan, viewer route masih placeholder, sedangkan landing/pricing/profile dan API stream belum dibuat |
| 2026-04-21 | 3.1 | Update Current State: Fase 4 selesai — `react-pdf` dan `pdfjs-dist` terpasang, komponen `PdfViewer`, service role client di `lib/supabase/service.ts`, dan API route `/api/ebook/[id]/stream` dengan signed URL 15 menit sudah jalan |
| 2026-04-21 | 3.2 | Dep pinning: `react-pdf` dikunci ke `^9` dan `pdfjs-dist` ke `^4` karena pdfjs v5 `.mjs` ESM gagal di-bundle oleh Next 14 webpack; `next.config.mjs` mendapat `transpilePackages` + alias `canvas=false` sebagai safety net |
| 2026-04-22 | 3.3 | Upgrade Next.js 14.2.15 → 16.2.4, React 18 → 19.2.5, `@supabase/ssr` 0.5.2 → 0.10.2, eslint 8 → 9; rename `middleware.ts` → `proxy.ts`; migrasi webpack config ke Turbopack (`canvas-stub.js`); async `cookies()`, `params`, `searchParams` di semua server components dan route handlers |
| 2026-04-22 | 3.4 | Koreksi wording Current State agar konsisten dengan implementasi Next.js 16: proteksi route disebut `proxy.ts` (bukan `middleware.ts`) |
| 2026-04-22 | 3.5 | Fase 5 selesai: landing `/`, `/pricing`, `/dashboard/profile`; tambah `components/marketing/` (public navbar, footer, contact CTA) dan `lib/contact.ts` sebagai sumber tunggal `NEXT_PUBLIC_CONTACT_URL` |
| 2026-04-23 | 3.6 | Fase 6 polish: SEO metadata (title template + metadataBase + OG/Twitter), `app/robots.ts` + `app/sitemap.ts`, noindex untuk auth/dashboard, Google Analytics conditional via `components/analytics/google-analytics.tsx`, dashboard header responsive (flex-wrap), build Turbopack lulus tanpa warning |
