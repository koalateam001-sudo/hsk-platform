# Feature: Ebook Catalog

**Status:** `Draft`  
**Version:** 1.1  
**Last Updated:** 2026-04-20  

---

## Overview

Halaman utama setelah user login. Menampilkan daftar semua ebook yang published, dikelompokkan per level HSK. Pada fase 1, Level 1 dapat dibuka untuk dibaca, sedangkan Level 2-3 ditampilkan sebagai premium roadmap.

---

## Current State

> Belum diimplementasikan.

---

## Requirements

- [ ] REQ-01: Tampilkan semua ebook dengan `is_published = true`, dikelompokkan per level
- [ ] REQ-02: Setiap ebook card menampilkan cover image, judul, level badge, jumlah halaman, dan badge akses
- [ ] REQ-03: Level 1 diberi badge "Gratis", Level 2-3 diberi badge "Premium"
- [ ] REQ-04: Klik ebook Level 1 membuka viewer, klik ebook Level 2-3 diarahkan ke halaman upgrade
- [ ] REQ-05: Halaman hanya bisa diakses oleh user yang sudah login
- [ ] REQ-06: Tampilkan nama user di header/navbar

---

## Acceptance Criteria

- [ ] AC-01: Ebook dikelompokkan dengan heading "Level 1", "Level 2", "Level 3"
- [ ] AC-02: Jika tidak ada ebook di suatu level, section level tersebut tidak ditampilkan
- [ ] AC-03: Jika belum ada ebook sama sekali, tampilkan empty state
- [ ] AC-04: Cover image yang gagal load ditampilkan dengan placeholder
- [ ] AC-05: Halaman load data server-side
- [ ] AC-06: Responsive di mobile, tablet, desktop

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
