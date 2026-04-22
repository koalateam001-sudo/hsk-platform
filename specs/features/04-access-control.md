# Feature: Access Control

**Status:** `Draft`  
**Version:** 2.5  
**Last Updated:** 2026-04-22  

---

## Overview

Sistem kontrol akses untuk fase 1 memastikan user harus login untuk masuk ke area dashboard, dan hanya ebook Level 1 yang benar-benar bisa dibaca. Level 2-3 tetap tampil sebagai konten premium, tetapi belum ada entitlement membership aktif di fase ini.

---

## Current State

Implementasi access control untuk fase 3 dan fase 4 sudah jalan:

- Middleware tetap memproteksi seluruh `/dashboard/*`
- Redirect ke `/login` mempertahankan original path beserta query string pada parameter `redirect`
- Di katalog, ebook Level 2-3 tampil sebagai premium placeholder
- Klik ebook premium mengarah ke `/dashboard/upgrade`
- Route baca `/dashboard/read/[ebookId]` melakukan gate server-side via `assertEbookAccess` (admin selalu lolos, Level 1 lolos, selain itu redirect ke `/dashboard/upgrade`)
- API route `/api/ebook/[id]/stream` sekarang sudah ada dan memakai gate yang sama: 401 bila belum login, 404 bila ebook tidak ada/tidak published, 403 bila `canAccessEbook` menolak, dan 200 dengan signed URL 15 menit bila lolos

---

## Requirements

- [ ] REQ-01: User yang belum login tidak bisa akses halaman catalog maupun viewer - redirect ke `/login`
- [ ] REQ-02: Semua user terotentikasi bisa akses semua ebook Level 1
- [ ] REQ-03: Semua ebook Level 2-3 ditampilkan sebagai premium / belum aktif
- [ ] REQ-04: User yang mencoba akses ebook Level 2-3 diarahkan ke halaman upgrade
- [ ] REQ-05: Pengecekan permission tetap terjadi di server-side untuk route viewer dan API stream
- [ ] REQ-06: Role `admin` tetap bisa dipakai untuk bypass semua level bila owner membutuhkannya saat testing internal

---

## Acceptance Criteria

- [ ] AC-01: Jika user belum login dan akses `/dashboard/*`, di-redirect ke `/login?redirect=<original-path>`
- [ ] AC-02: Setelah login sukses, redirect mengikuti precedence di `01-auth.md`
- [ ] AC-03: Ebook Level 2-3 di katalog menampilkan badge/ikon premium
- [ ] AC-04: Klik ebook premium membawa user ke `/dashboard/upgrade`, bukan membuka PDF
- [ ] AC-05: API route `/api/ebook/[id]/stream` return `403` untuk ebook Level 2-3 bagi user biasa
- [ ] AC-06: User admin bisa membaca semua level untuk kebutuhan operasional/testing

---

## Logika Akses

```text
function canAccessEbook(user, ebook):
  if user == null -> DENY (redirect login)
  if user.role == 'admin' -> ALLOW
  if ebook.level == 1 -> ALLOW
  return DENY (redirect upgrade)
```

---

## Halaman Upgrade (`/dashboard/upgrade`)

Halaman ini berfungsi sebagai placeholder roadmap premium, bukan checkout aktif.

### Konten halaman:

- Penjelasan singkat bahwa akses Level 2-3 akan dibuka pada fase berikutnya
- Benefit premium secara ringkas
- CTA non-transaksional final: `Hubungi Kami`
- Kanal kontak harus sama dengan yang dipakai di landing page, pricing, dan profile
- Sumber kebenaran kanal kontak: `NEXT_PUBLIC_CONTACT_URL`

---

## Technical Notes

- Middleware hanya cek auth untuk `/dashboard/*`
- Viewer page dan API stream tetap melakukan pengecekan level ebook di server
- Fase 1 tidak membaca tabel `subscriptions`
- Saat fase membership dimulai nanti, spec ini akan di-upgrade lagi untuk entitlement premium real

---

## Pending Changes

*(kosong)*

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-15 | 1.0 | Initial spec |
| 2026-04-16 | 2.0 | Access gate berbasis entitlement subscription |
| 2026-04-20 | 2.1 | Scope fase 1 disederhanakan: Level 1 aktif, Level 2-3 placeholder premium, tanpa membership real |
| 2026-04-21 | 2.2 | Current State diperbarui: katalog dan route baca placeholder sudah memakai access gate server-side dasar untuk fase 3 |
| 2026-04-21 | 2.3 | Sinkronisasi metadata dokumen dengan kondisi spec terbaru agar version header dan tanggal tidak tertinggal |
| 2026-04-21 | 2.4 | Current State diperbarui: API route `/api/ebook/[id]/stream` sudah dibuat dan memakai `canAccessEbook` yang sama dengan route baca, sehingga AC-05 (403 untuk Level 2-3 non-admin) sudah terpenuhi di kode |
| 2026-04-22 | 2.5 | Current State diperbarui: redirect auth di proteksi `/dashboard/*` kini menyimpan original path + query string ke parameter `redirect` saat diarahkan ke `/login` |
