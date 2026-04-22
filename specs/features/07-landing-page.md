# Feature: Landing Page & Pricing

**Status:** `Draft`  
**Version:** 1.3  
**Last Updated:** 2026-04-22  

---

## Overview

Landing page publik yang sederhana untuk menjelaskan produk dan CTA utama ke registrasi. Pricing page tetap ada, tetapi pada fase 1 hanya berfungsi sebagai halaman informasi roadmap premium, bukan checkout aktif.

---

## Current State

Fase 5 selesai:

- `app/page.tsx` adalah Server Component yang melakukan `supabase.auth.getUser()` dan `redirect('/dashboard/catalog')` bila user sudah login (REQ-05)
- Landing publik menampilkan hero, blok "Kenapa Kami", teaser premium, serta CTA `Mulai Gratis` → `/register` dan `Lihat Paket` → `/pricing`
- `app/pricing/page.tsx` publik menampilkan paket Gratis (Level 1) dan Premium (Level 2-3, badge "Segera Hadir"), dengan CTA final `Hubungi Kami` via `NEXT_PUBLIC_CONTACT_URL`
- Navbar publik dan footer dipakai bersama oleh `/` dan `/pricing` (`components/marketing/public-navbar.tsx`, `components/marketing/public-footer.tsx`)
- Kanal kontak dipusatkan di `lib/contact.ts` dan `components/marketing/contact-cta.tsx`, dipakai oleh landing/pricing/upgrade/profile

---

## Requirements

- [ ] REQ-01: Landing page di `/` bisa diakses publik
- [ ] REQ-02: Halaman pricing di `/pricing` bisa diakses publik
- [ ] REQ-03: Ada CTA utama "Mulai Gratis" yang mengarah ke `/register`
- [ ] REQ-04: Ada CTA sekunder "Lihat Paket" yang mengarah ke `/pricing`
- [ ] REQ-05: User yang sudah login dan buka `/` otomatis redirect ke `/dashboard/catalog`
- [ ] REQ-06: Ada informasi kontak di footer
- [ ] REQ-07: Halaman responsive di mobile
- [ ] REQ-08: CTA premium pada fase 1 tidak melakukan checkout, tetapi mengarah ke CTA final `Hubungi Kami`

---

## Acceptance Criteria

- [ ] AC-01: Landing page load cepat dan semua CTA functional
- [ ] AC-02: Halaman tidak pakai library berat
- [ ] AC-03: Pricing page menampilkan jelas bahwa premium adalah roadmap berikutnya
- [ ] AC-04: Klik CTA premium tidak error dan tidak memerlukan integrasi payment

---

## Struktur Landing Page `/`

```text
[Navbar: Logo | Login | Daftar]

[Hero]
  "Materi Lengkap New HSK 3.0, Dalam Satu Tempat"
  "Mulai gratis dari Level 1."
  [Mulai Gratis] [Lihat Paket]

[Kenapa Kami]
[Cuplikan Ebook]
[Harga / Roadmap Premium]
[Footer]
```

---

## Struktur Pricing Page `/pricing`

Pricing page tetap menampilkan:

- Paket gratis: akses Level 1
- Paket premium: akses Level 2-3
- Status premium: **"Segera Hadir"**
- CTA utama premium: `Hubungi Kami`

---

## Technical Notes

- Landing page dan pricing page adalah Server Component
- REQ-05 (redirect user login dari `/` ke `/dashboard/catalog`) dilakukan di Server Component `app/page.tsx`, **bukan** di middleware. Middleware hanya meng-gate `/dashboard/*` sesuai `specs/_architecture.md`. Gunakan `createServerClient` + `supabase.auth.getUser()` di halaman root, lalu `redirect('/dashboard/catalog')` jika user login
- Tidak perlu route checkout di fase 1
- Copy pricing harus jujur bahwa premium belum aktif
- Jika fase payment dimulai nanti, file spec ini diperbarui lagi agar CTA premium terhubung ke checkout
- Kanal kontak untuk CTA premium harus sama dengan landing page footer, halaman upgrade, dan profile
- Sumber kebenaran kanal kontak: `NEXT_PUBLIC_CONTACT_URL`

---

## Copy Direction

- Hero tetap fokus pada manfaat belajar
- Jangan menjanjikan checkout aktif kalau memang belum ada
- Hindari copy yang memberi kesan premium sudah bisa dibeli hari ini

---

## Pending Changes

*(kosong)*

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-16 | 1.0 | Initial spec |
| 2026-04-20 | 1.1 | Pricing/upgrade diubah jadi placeholder roadmap premium; checkout ditunda |
| 2026-04-21 | 1.2 | Tegaskan bahwa redirect REQ-05 dilakukan di Server Component `app/page.tsx`, bukan middleware |
| 2026-04-22 | 1.3 | Current State diperbarui: landing page `/`, pricing page `/pricing`, navbar+footer publik, dan util kontak terpusat sudah jalan di Fase 5 |
