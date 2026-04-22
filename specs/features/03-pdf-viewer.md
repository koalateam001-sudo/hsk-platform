# Feature: PDF Viewer

**Status:** `Draft`  
**Version:** 2.5  
**Last Updated:** 2026-04-21  

---

## Overview

Ebook dibaca langsung di browser via PDF viewer berbasis `react-pdf`. PDF diambil dari Supabase private bucket via signed URL yang di-generate server-side. Tombol download/print native tidak diekspos di UI.

> Catatan MVP: watermark dinamis ditunda ke fase berikutnya.

---

## Current State

Fase 4 PDF viewer sudah terpasang:

- `react-pdf` (v9.x) dan `pdfjs-dist` (v4.x) sudah menjadi dependency di `package.json` — v9 dipilih karena pdfjs v5 ESM `.mjs` gagal di-bundle oleh Next 14 webpack (`Object.defineProperty called on non-object`), sedangkan pdfjs v4 tetap CJS dan kompatibel
- Komponen client `components/pdf/pdf-viewer.tsx` menangani fetch signed URL via `/api/ebook/[id]/stream`, rendering `Document`/`Page` dari `react-pdf`, navigasi halaman, zoom 50-200% dengan step 25%, loading state, error state, dan lebar halaman responsif mengikuti lebar container
- `pdfjs.GlobalWorkerOptions.workerSrc` di-set ke unpkg CDN agar tidak memerlukan konfigurasi webpack khusus di `next.config.mjs`
- API route `app/api/ebook/[id]/stream/route.ts` memverifikasi auth via server client, menolak 401 untuk user belum login, 404 untuk ebook yang tidak published, 403 untuk user yang tidak lolos `canAccessEbook`, lalu generate signed URL dari bucket `ebook-pdfs` dengan expiry 15 menit memakai service role client
- Halaman `app/dashboard/read/[ebookId]/page.tsx` sekarang menampilkan header judul + tombol "Kembali ke Katalog" dan merender `PdfViewer` — gate server-side `assertEbookAccess` tetap dipertahankan
- Tombol download/print native tidak diekspos di UI (hanya kontrol Prev/Next dan zoom); klik kanan pada area viewer juga dinonaktifkan sebagai best-effort
- Renderer `Page` menonaktifkan annotation layer agar link/print annotation PDF tidak terekspos; text layer tetap aktif supaya user masih bisa membaca dan menyalin teks untuk belajar

---

## Requirements

- [ ] REQ-01: PDF ditampilkan in-browser menggunakan `react-pdf`
- [ ] REQ-02: Tidak ada tombol download atau print yang diekspos di UI
- [ ] REQ-03: PDF diambil dari Supabase private bucket via signed URL
- [ ] REQ-04: Signed URL di-generate server-side dan expire dalam 15 menit
- [ ] REQ-05: Akses signed URL di-gate oleh auth + level check
- [ ] REQ-06: User bisa navigasi halaman
- [ ] REQ-07: User bisa zoom in dan zoom out
- [ ] REQ-08: Viewer responsive di mobile dan desktop

---

## Acceptance Criteria

- [ ] AC-01: Tidak ada tombol download di UI viewer
- [ ] AC-02: Signed URL boleh tampak di Network tab
- [ ] AC-03: Navigasi halaman berfungsi
- [ ] AC-04: Zoom range 50% sampai 200%
- [ ] AC-05: Error loading PDF ditampilkan jelas
- [ ] AC-06: Ada loading state
- [ ] AC-07: Di mobile viewer tetap usable

---

## Alur Teknis

```text
User klik ebook di katalog
-> navigasi ke /dashboard/read/[ebookId]
-> server component verifikasi auth + level access
-> client render PdfViewer
-> client fetch /api/ebook/[id]/stream
-> API route verifikasi akses
-> generate signed URL
-> return { url }
-> react-pdf render file
```

---

## UI / User Flow

### Halaman `/dashboard/read/[ebookId]`

```text
[Navbar: Judul Ebook | Kembali ke Katalog]
[PDF Viewer Area]
[Controls: Prev | Page | Next | Zoom]
```

---

## Technical Notes

- `react-pdf` memerlukan pdfjs worker
- `next.config.mjs` memakai `transpilePackages: ["react-pdf", "pdfjs-dist"]` + `webpack alias.canvas = false` sebagai safety net; alasan utama kita tetap di `react-pdf` v9 + `pdfjs-dist` v4 adalah karena `pdfjs-dist` v5 (`.mjs` ESM) tidak bisa di-bundle oleh Next 14 webpack
- API route `/api/ebook/[id]/stream` menggunakan `SUPABASE_SERVICE_ROLE_KEY`
- Keputusan arsitektur fase 1:
  - Server mengembalikan signed URL ke client
  - Signed URL akan terlihat di DevTools Network tab
  - Ini acceptable trade-off untuk MVP karena URL cepat expired
  - Private bucket + auth gate di API route mencegah akses dari user yang tidak berhak membuka ebook tersebut
- Untuk performa, `react-pdf` lazy-render per halaman
- Hide print hanya best effort
- Screenshot/record layar tetap dianggap mungkin dilakukan user

---

## Roadmap Fase Berikutnya

- Watermark dinamis via `pdf-lib`
- Opsi stream/proxy file dari backend bila nanti diperlukan

---

## Pending Changes

*(kosong)*

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-15 | 1.0 | Initial spec |
| 2026-04-16 | 2.1 | Diselaraskan ke signed URL client-side |
| 2026-04-20 | 2.2 | Rapikan wording agar sinkron dengan access control fase 1 |
| 2026-04-21 | 2.3 | Update Current State: fase 4 selesai — `PdfViewer` client component, API route `/api/ebook/[id]/stream` dengan signed URL 15 menit via service role, dan halaman `/dashboard/read/[ebookId]` sekarang sudah tidak placeholder |
| 2026-04-21 | 2.4 | Technical Notes: dokumentasikan kewajiban `transpilePackages` + alias `canvas` di `next.config.mjs` agar `pdf.mjs` load tanpa error `Object.defineProperty called on non-object` |
| 2026-04-21 | 2.5 | Downgrade ke `react-pdf@^9` + `pdfjs-dist@^4` karena `pdfjs-dist` v5 `.mjs` ESM tidak kompatibel dengan webpack Next 14 meskipun `transpilePackages` sudah diaktifkan; API komponen identik sehingga `PdfViewer` tidak berubah |
