# Feature: PDF Viewer

**Status:** `Draft`  
**Version:** 2.2  
**Last Updated:** 2026-04-20  

---

## Overview

Ebook dibaca langsung di browser via PDF viewer berbasis `react-pdf`. PDF diambil dari Supabase private bucket via signed URL yang di-generate server-side. Tombol download/print native tidak diekspos di UI.

> Catatan MVP: watermark dinamis ditunda ke fase berikutnya.

---

## Current State

> Belum diimplementasikan.

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
