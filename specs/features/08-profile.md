# Feature: User Profile

**Status:** `Draft`  
**Version:** 1.1  
**Last Updated:** 2026-04-21  

---

## Overview

Halaman profile sederhana untuk fase 1. Tujuannya bukan mengelola subscription, tetapi memberi user tempat melihat informasi akun dasarnya setelah login.

---

## Current State

> Belum diimplementasikan.

---

## Requirements

- [ ] REQ-01: Halaman `/dashboard/profile` hanya bisa diakses oleh user yang sudah login
- [ ] REQ-02: Halaman menampilkan informasi dasar user dari tabel `profiles`
- [ ] REQ-03: Informasi akun yang tampil (blok "Informasi Akun"):
  - nama lengkap
  - email
  - tanggal akun dibuat
- [ ] REQ-04: Blok terpisah "Status Akses" menampilkan label UI yang diturunkan dari `profiles.role` + scope fase:
  - `role = 'free'` → tampilkan `Gratis - Level 1 aktif`, dengan subteks `Premium segera hadir`
  - `role = 'subscriber'` → tampilkan `Gratis - Level 1 aktif` (fase 1 belum mengaktifkan premium; lihat Technical Notes)
  - `role = 'admin'` → tampilkan `Admin - semua level terbuka`
- [ ] REQ-05: Field `role` mentah (`free` / `subscriber` / `admin`) TIDAK ditampilkan di blok Informasi Akun. Role adalah internal; yang user lihat adalah label UI di REQ-04.
- [ ] REQ-06: Ada CTA `Hubungi Kami` untuk user yang tertarik akses premium (disembunyikan untuk `role = 'admin'`)
- [ ] REQ-07: Ada tombol atau link kembali ke katalog

---

## Acceptance Criteria

- [ ] AC-01: User yang belum login di-redirect ke `/login`
- [ ] AC-02: User login bisa membuka `/dashboard/profile` tanpa error
- [ ] AC-03: Data profile di-load server-side dari Supabase
- [ ] AC-04: Jika data profile gagal dimuat, tampilkan error state yang user-friendly
- [ ] AC-05: CTA `Hubungi Kami` menggunakan kanal kontak yang sama dengan landing page / pricing / upgrade page
- [ ] AC-06: Label status akses untuk user `role = 'free'` adalah `Gratis - Level 1 aktif` dengan subteks `Premium segera hadir`
- [ ] AC-07: Label status akses untuk user `role = 'admin'` adalah `Admin - semua level terbuka` dan CTA `Hubungi Kami` tidak ditampilkan
- [ ] AC-08: Blok Informasi Akun tidak memuat baris `Role` mentah

---

## UI / User Flow

### Halaman `/dashboard/profile`

```text
[Navbar / Header]

[Judul: Profile Saya]

[Blok: Informasi Akun]
  Nama Lengkap
  Email
  Tanggal Bergabung

[Blok: Status Akses]
  <Label UI turunan dari role, lihat REQ-04>
  <Subteks opsional, misal "Premium segera hadir">

[CTA: Hubungi Kami]  (tidak ditampilkan untuk admin)
[Link: Kembali ke Katalog]
```

---

## Technical Notes

- Gunakan Server Component
- Ambil data dari tabel `profiles` berdasarkan `auth.uid()`
- Role `subscriber` belum dipakai di fase 1. Jika row dengan role ini muncul (misal di-set manual untuk testing), profile page tetap menampilkan label `Gratis - Level 1 aktif` karena entitlement premium belum aktif; ini disengaja agar UI tidak menjanjikan akses yang belum bisa di-serve
- Mapping `role -> label UI` adalah satu-satunya tempat user melihat status akses. Field `role` mentah dari DB tidak boleh bocor ke UI profile
- Sumber kebenaran CTA `Hubungi Kami`: `NEXT_PUBLIC_CONTACT_URL`
- Jika nanti fase premium dimulai, spec ini diperluas untuk menampilkan status entitlement real dan mapping role baru

---

## Pending Changes

*(kosong)*

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-20 | 1.0 | Tambah spec profile page fase 1 agar route `/dashboard/profile` punya anchor SDD yang jelas |
| 2026-04-21 | 1.1 | Pisahkan blok Informasi Akun dan Status Akses; tegaskan mapping role -> label UI agar tidak redundan menampilkan role mentah |
