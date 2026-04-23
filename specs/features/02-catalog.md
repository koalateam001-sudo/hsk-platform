# Feature: Ebook Catalog

**Status:** `Implemented`  
**Version:** 1.5  
**Last Updated:** 2026-04-23  

---

## Overview

Halaman utama setelah user login. Menampilkan daftar semua ebook yang published, dikelompokkan per level HSK. Pada fase 1, Level 1 dapat dibuka untuk dibaca, sedangkan Level 2-3 ditampilkan sebagai premium roadmap.

---

## Current State

Implementasi fase 3 untuk katalog dasar sudah berjalan:

- Halaman `/dashboard/catalog` sudah mengambil data `ebooks` yang published secara server-side
- Ebook sudah dikelompokkan per level dan hanya section yang berisi data yang ditampilkan
- Card ebook menampilkan cover, judul, level, jumlah halaman, deskripsi singkat, dan badge akses
- Klik ebook Level 1 menuju route baca
- Klik ebook Level 2-3 menuju halaman upgrade
- Empty state dan error state dasar sudah tersedia
- Jika cover image gagal load di browser, card otomatis fallback ke placeholder

---

## Requirements

- [x] REQ-01: Tampilkan semua ebook dengan `is_published = true`, dikelompokkan per level
- [x] REQ-02: Setiap ebook card menampilkan cover image, judul, level badge, jumlah halaman, dan badge akses
- [x] REQ-03: Level 1 diberi badge "Gratis", Level 2-3 diberi badge "Premium"
- [x] REQ-04: Klik ebook Level 1 membuka viewer, klik ebook Level 2-3 diarahkan ke halaman upgrade
- [x] REQ-05: Halaman hanya bisa diakses oleh user yang sudah login
- [x] REQ-06: Tampilkan nama user di header/navbar

---

## Acceptance Criteria

- [x] AC-01: Ebook dikelompokkan dengan heading "Level 1", "Level 2", "Level 3"
- [x] AC-02: Jika tidak ada ebook di suatu level, section level tersebut tidak ditampilkan
- [x] AC-03: Jika belum ada ebook sama sekali, tampilkan empty state
- [x] AC-04: Cover image yang gagal load ditampilkan dengan placeholder
- [x] AC-05: Halaman load data server-side
- [x] AC-06: Responsive di mobile, tablet, desktop

---

## UI / User Flow

### Halaman `/dashboard/catalog`

```text
[Navbar: Logo | Nama User | Tombol Logout]

[Heading: Koleksi Ebook New HSK 3.0]

Level 1 - Gratis
Level 2 - Premium
Level 3 - Premium
```

---

## Technical Notes

- Data fetch di Server Component
- Query: `SELECT * FROM ebooks WHERE is_published = true ORDER BY level, sort_order`
- Badge premium di fase 1 bersifat informasional, bukan entitlement aktif

---

## Pending Changes

*(kosong)*

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-15 | 1.0 | Initial spec |
| 2026-04-20 | 1.1 | Diselaraskan dengan scope fase 1: Level 1 aktif, Level 2-3 placeholder premium |
| 2026-04-21 | 1.2 | Current State diperjelas: route `/dashboard/catalog` baru scaffold minimum untuk mendukung redirect auth, bukan katalog final |
| 2026-04-21 | 1.3 | Current State diperbarui: katalog fase 3 dasar sudah diimplementasikan dengan query server-side, grouping per level, dan routing akses |
| 2026-04-22 | 1.4 | Current State diperbarui: fallback placeholder saat cover image gagal load sudah diimplementasikan pada card katalog |
| 2026-04-23 | 1.5 | Tandai katalog sebagai implemented dan centang REQ/AC yang sudah terpenuhi di kode |
