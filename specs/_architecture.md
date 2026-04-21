# Architecture & Tech Stack

**Status:** Active  
**Version:** 2.8  
**Last Updated:** 2026-04-21  

---

## Current State

Foundation Fase 1 (GETTING_STARTED.md § FASE 1) sudah selesai dan terverifikasi:

- Project Next.js 14 + TypeScript + Tailwind CSS sudah di-init manual (bukan via `create-next-app`) dengan struktur folder sesuai spec
- `lib/supabase/client.ts`, `lib/supabase/server.ts` sudah ada; `lib/supabase/types.ts` sudah di-generate dari Supabase via `supabase` CLI (devDep) dan bukan placeholder lagi
- `middleware.ts` sudah memproteksi `/dashboard/*` pakai `getUser()` dan refresh cookie session di route lain
- `.env.example` dan `.gitignore` sudah ada; `.env.local` terisi lengkap termasuk `NEXT_PUBLIC_CONTACT_URL` (WhatsApp)
- `supabase/migrations/001_initial_schema.sql` sudah dijalankan di Supabase dashboard — tabel `profiles`, `ebooks`, trigger `handle_new_user`, dan RLS minimum aktif
- Storage bucket `ebook-pdfs` (private) dan `ebook-covers` (public) sudah dibuat di Supabase dashboard
- Konfigurasi Supabase Auth dashboard (Confirm email, Site URL, Redirect URLs, password min 8) sudah di-set sesuai checklist `specs/features/01-auth.md`
- `npm install` sudah jalan, `npx tsc --noEmit` lulus tanpa error

Yang belum:

- Halaman auth fase 2 sudah dibuat: `(auth)/login`, `(auth)/register`, `(auth)/register/success`, `(auth)/forgot-password`, `(auth)/reset-password`, dan `auth/callback`
- Dashboard layout dan placeholder minimum `/dashboard/catalog` sudah dibuat untuk menopang flow login; implementasi katalog sebenarnya masih fase 3
- Halaman `pricing`, route viewer `/dashboard/read/[ebookId]`, halaman upgrade, profile, dan API route `/api/ebook/[id]/stream` belum dibuat (Fase 3-5)
- Domain custom belum dibeli (opsional, bisa pakai subdomain Vercel saat deploy)

---

## Tech Stack

| Layer | Teknologi | Versi | Alasan |
|---|---|---|---|
| Framework | Next.js | 14+ (App Router) | SSR/SSG untuk SEO, mudah di-extend |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.x | Cepat dan konsisten |
| Database & Auth | Supabase | Latest | Built-in auth, storage, Postgres, RLS |
| PDF Viewer | react-pdf | Latest | Render PDF di browser |
| Hosting | Vercel | - | Cukup untuk deploy publik fase 1 |
| Storage PDF | Supabase Storage | - | Private bucket untuk PDF, public bucket untuk cover |
| Email | Supabase built-in | - | Email verifikasi dan reset password |
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
│   └── ui/
├── lib/
│   └── supabase/
├── middleware.ts
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

```typescript
import { createServerClient } from '@/lib/supabase/server'

const supabase = createServerClient()
const {
  data: { user },
} = await supabase.auth.getUser()

if (!user) redirect('/login')
```

### Route Protection

- `middleware.ts` hanya cek auth untuk `/dashboard/*`
- Gunakan `getUser()`, bukan `getSession()`
- Pengecekan akses premium placeholder dilakukan di Server Component atau API Route, bukan di middleware
- Flow verifikasi email dan reset password boleh melewati route callback auth khusus sebelum diarahkan ke halaman final

### TypeScript

- Hindari `any`
- Generate types dari Supabase ke `lib/supabase/types.ts`

### Error Handling

- API route return proper HTTP status
- Log error ke `console.error`
- UI tampilkan error message yang user-friendly

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
