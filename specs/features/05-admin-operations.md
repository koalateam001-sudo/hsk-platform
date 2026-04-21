# Feature: Admin Operations (via Supabase Dashboard)

**Status:** `Draft`  
**Version:** 1.3  
**Last Updated:** 2026-04-20  

---

## Overview

Di fase 1, tidak ada admin panel custom. Semua operasi admin dilakukan langsung via Supabase dashboard. Karena payment dan membership ditunda, SOP pada fase ini fokus ke pengelolaan ebook, user, dan testing akses dasar.

> Spec ini adalah SOP operasional, bukan target implementasi kode.

---

## Kenapa Tidak Ada Admin Panel Custom?

- MVP dioperasikan solo oleh pemilik
- Fokus fase 1 adalah launch publik yang stabil
- Supabase dashboard sudah cukup untuk operasi CRUD dasar
- Payment belum masuk scope fase 1

---

## SOP #1: Upload Ebook Baru

### Persiapan

- File PDF ebook
- File cover image
- Metadata: judul, level, deskripsi, jumlah halaman

### Langkah

**1. Upload cover image ke public bucket**
- Buka Supabase Dashboard -> Storage -> bucket `ebook-covers`
- Upload file cover image
- Copy URL publik

**2. Upload PDF ke private bucket**
- Buka bucket `ebook-pdfs`
- Upload file PDF
- Catat path file

**3. Insert metadata di tabel `ebooks`**
- Buka Table Editor -> `ebooks` -> Insert row
- Isi `title`, `level`, `description`, `cover_url`, `storage_path`, `total_pages`, `is_published`, `sort_order`

**4. Test**
- Login ke app
- Pastikan ebook unpublished belum muncul
- Ubah `is_published=true`
- Refresh katalog
- Verifikasi:
  - Level 1 bisa dibuka
  - Level 2-3 tampil sebagai premium dan menuju halaman upgrade

---

## SOP #2: Set User Sebagai Admin

Role `admin` dipakai untuk bypass access control saat testing internal atau akses owner.

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'email_owner@example.com';
```

> Tidak ada UI admin khusus. Role ini hanya untuk akses operasional internal.

---

## SOP #3: Review User dan Akses Dasar

### Cek daftar user

```sql
SELECT id, email, full_name, role, created_at
FROM profiles
ORDER BY created_at DESC;
```

### Cek ebook published

```sql
SELECT id, title, level, is_published, sort_order
FROM ebooks
ORDER BY level, sort_order;
```

### Cek ebook premium yang belum bisa diakses user biasa

```sql
SELECT id, title, level
FROM ebooks
WHERE is_published = true
  AND level >= 2
ORDER BY level, sort_order;
```

---

## SOP #4: Persiapan Fase 2

Saat membership/payment dimulai nanti, admin perlu menyiapkan ulang:

- Produk payment di provider
- Env variable payment
- Route webhook
- Tabel `subscriptions`
- Tabel `processed_webhook_events`

Lihat `specs/features/06-payment.md` dan `specs/_data-models.md` saat fase itu dimulai.

---

## Technical Notes

- Admin panel custom bisa ditambahkan di v2 bila operasi dashboard mulai terasa lambat
- Jika jumlah ebook bertambah banyak, pertimbangkan script batch upload

---

## Pending Changes

*(kosong)*

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-16 | 1.0 | Replace admin panel custom dengan SOP via Supabase dashboard |
| 2026-04-16 | 1.1 | Klarifikasi role admin dan SOP payment |
| 2026-04-16 | 1.2 | Sinkronisasi istilah payment Mayar |
| 2026-04-20 | 1.3 | SOP disederhanakan untuk fase 1 tanpa payment/membership |
