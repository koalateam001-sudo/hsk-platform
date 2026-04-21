# Getting Started - HSK Platform Development

Panduan langkah demi langkah untuk memulai development. Dokumen ini sudah diselaraskan dengan **MVP publik fase 1**: auth, katalog, viewer Level 1, landing page, pricing placeholder, profile sederhana, dan deploy public. Payment/membership belum dikerjakan sekarang.

---

## Bagian 1: Persiapan Akun & Tools

Beberapa langkah ini harus dikerjakan manual.

### 1.1 Akun Supabase

- [✅] Daftar di https://supabase.com
- [✅] Buat project baru
- [ ] Catat dari Project Settings -> API:
  - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Konfigurasi Auth:
  - Providers -> Email -> pastikan `Confirm email` ON
  - URL Configuration -> Site URL: `http://localhost:3000`
  - URL Configuration -> Redirect URLs: tambahkan `http://localhost:3000/**`
  - Email Templates -> Confirm signup dan Reset password -> sesuaikan bahasa Indonesia
  - Policies -> minimum password length: 8
- [ ] Buat storage bucket:
  - `ebook-covers` -> public
  - `ebook-pdfs` -> private

Referensi: `specs/features/01-auth.md`

### 1.2 Akun GitHub

- [ ] Buat repo baru
- [ ] Copy seluruh isi folder proyek ke repo tersebut

### 1.3 Akun Vercel

- [ ] Daftar di https://vercel.com
- [ ] Connect repo GitHub

### 1.4 Install Tools di Laptop

- [ ] Node.js 20+
- [ ] Git
- [ ] VS Code atau editor sejenis

### 1.5 Domain (Optional)

- [ ] Beli domain jika diperlukan
- [ ] Point ke Vercel setelah deploy

---

## Bagian 2: Urutan Development

Jalankan fase satu per satu. Setelah setiap fase selesai, test dulu sebelum lanjut.

---

### FASE 1 - Setup Project & Database Schema

**Prompt untuk Codex / Claude Code:**

```text
Baca semua file di folder specs/ untuk memahami konteks proyek ini.

Tugas Fase 1:
1. Inisialisasi project Next.js 14 dengan TypeScript, Tailwind CSS, dan App Router
2. Setup Supabase client:
   - lib/supabase/client.ts
   - lib/supabase/server.ts
   - lib/supabase/types.ts
3. Buat file SQL migration berdasarkan specs/_data-models.md
   - Untuk MVP fase 1, schema yang wajib cukup `profiles` dan `ebooks`
   - Migration fase 1 harus sudah mencakup trigger profile creation dan RLS/policies minimum untuk kedua tabel itu
   - Simpan di supabase/migrations/001_initial_schema.sql
4. Setup .env.example sesuai specs/_architecture.md
5. Setup .gitignore yang proper

Ikuti pola di specs/_architecture.md. Jangan install library di luar spec.

Setelah selesai, update Current State pada spec yang relevan.
```

**Setelah selesai:**

1. Buka Supabase Dashboard -> SQL Editor
2. Run isi `supabase/migrations/001_initial_schema.sql`
3. Verifikasi tabel `profiles` dan `ebooks` muncul, trigger `handle_new_user` aktif, dan RLS/policy dasar sudah terpasang
4. Isi `.env.local`
   - pastikan `NEXT_PUBLIC_APP_URL` terisi sesuai origin aktif, mis. `http://localhost:3000`
   - termasuk `NEXT_PUBLIC_CONTACT_URL` untuk CTA `Hubungi Kami`
5. Jalankan `npm run dev`

---

### FASE 2 - Authentication

**Prompt:**

```text
Baca specs/features/01-auth.md dan specs/_architecture.md.

Implementasikan:
- /register
- /login
- /register/success
- /forgot-password
- /reset-password
- /auth/callback
- middleware proteksi /dashboard/*
- form validation
- integrasi Supabase Auth

Update Current State setelah selesai.
```

**Setelah selesai:**

- Test register
- Test email verification
- Test login
- Test forgot password
- Test flow reset password sampai benar-benar bisa ganti password

---

### FASE 3 - Catalog & Access Control

**Prompt:**

```text
Baca specs/features/02-catalog.md dan specs/features/04-access-control.md.

Implementasikan:
1. Halaman /dashboard/catalog
2. Komponen EbookCard dan EbookGrid
3. Halaman /dashboard/upgrade
4. Logic access control fase 1:
   - Level 1 bisa dibaca
   - Level 2-3 diarahkan ke halaman upgrade

Gunakan data dummy ebook di Supabase untuk testing.

Update Current State setelah selesai.
```

**Setelah selesai:**

- Insert ebook dummy level 1 dan level 2
- Test katalog
- Test klik Level 1 -> viewer
- Test klik Level 2 -> upgrade

---

### FASE 4 - PDF Viewer

**Prompt:**

```text
Baca specs/features/03-pdf-viewer.md.

Implementasikan:
1. Halaman /dashboard/read/[ebookId]
2. Komponen PdfViewer menggunakan react-pdf
3. API route /api/ebook/[id]/stream

Pada fase 1:
- Level 1 bisa dibuka
- Level 2-3 tetap ditolak oleh access control
- Jangan implementasikan watermark

Update Current State setelah selesai.
```

**Setelah selesai:**

- Upload 1 PDF test ke bucket private
- Update `storage_path` ebook
- Test viewer untuk ebook Level 1

---

### FASE 5 - Landing Page, Pricing Placeholder, Profile, dan Deploy Public

**Prompt:**

```text
Baca specs/features/07-landing-page.md, specs/features/08-profile.md, specs/_project.md, dan specs/_architecture.md.

Implementasikan:
1. Landing page di /
2. Pricing page di /pricing
3. Halaman /dashboard/profile sederhana sesuai `specs/features/08-profile.md`
4. Redirect user login dari / ke /dashboard/catalog
5. CTA premium placeholder final: `Hubungi Kami`

Gunakan styling yang simpel, clean, dan tanpa library tambahan.
Update Current State setelah selesai.
```

**Setelah selesai:**

- Deploy ke Vercel
- Update Supabase Auth URL Configuration ke domain publik Vercel
- Test register/login di URL publik
- Test katalog publik setelah login
- Test viewer Level 1 di URL publik

---

### FASE 6 - Polish Sebelum Launch

**Prompt:**

```text
Kita akan finalisasi MVP publik fase 1. Lakukan:
1. Cek semua halaman mobile responsive
2. Tambahkan metadata SEO dasar
3. Tambahkan Google Analytics jika env tersedia
4. Cek warning/error
5. Pastikan tidak ada credential hardcoded

Review final dan laporkan sisa risiko.
```

**Setelah selesai:**

- Upload ebook Level 1 yang benar-benar siap tayang
- Point domain ke Vercel bila perlu
- Soft launch ke user terbatas
- Kumpulkan feedback

---

## Bagian 3: Apa yang Sengaja Ditunda

Belum dikerjakan di fase ini:

- Integrasi Mayar
- Checkout/payment
- Webhook
- Subscription entitlement
- Halaman sukses pembayaran

Jika fase 2 dimulai nanti, buka kembali:

- `specs/features/06-payment.md`
- `specs/_architecture.md`
- `specs/_data-models.md`
- `specs/features/04-access-control.md`

---

## Bagian 4: Tips Disiplin Spec-Anchored

Saat ada perubahan:

1. Buka spec yang relevan
2. Isi `Pending Changes`
3. Baru lakukan implementasi
4. Setelah selesai, pindahkan hasilnya ke `Current State`

---

## Bagian 5: Checklist Sebelum Launch Publik Fase 1

- [ ] Semua env variable Supabase sudah ter-set di Vercel
- [ ] `NEXT_PUBLIC_APP_URL` sudah ter-set sesuai domain aktif
- [ ] `NEXT_PUBLIC_CONTACT_URL` sudah ter-set dan mengarah ke kanal kontak final
- [ ] Supabase auth email template sudah benar
- [ ] Supabase Site URL dan Redirect URLs sudah diganti dari localhost ke domain publik
- [ ] Minimal ada ebook Level 1 yang benar-benar bisa dibaca
- [ ] Level 2-3 tampil sebagai premium placeholder dengan copy yang jujur
- [ ] Domain sudah terhubung jika diperlukan
- [ ] HTTPS aktif
- [ ] Google Analytics aktif jika dipakai
- [ ] Halaman privacy policy dan terms of service dibuat jika diperlukan untuk publik

---

Payment/membership bisa ditambahkan nanti setelah baseline publik ini stabil.
