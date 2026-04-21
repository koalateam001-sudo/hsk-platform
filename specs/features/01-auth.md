# Feature: Authentication

**Status:** `Draft`  
**Version:** 1.5  
**Last Updated:** 2026-04-21  

---

## Overview

Sistem autentikasi berbasis Supabase Auth. User bisa mendaftar dengan email dan password, login, logout, dan reset password. Saat register berhasil, profil user otomatis dibuat di tabel `profiles` via database trigger.

---

## Current State

Implementasi fase 2 auth sudah ada dan berjalan pada baseline project saat ini:

- Halaman `/login`, `/register`, `/register/success`, `/forgot-password`, dan `/reset-password` sudah dibuat
- Route handler `/auth/callback` sudah menangani return flow untuk verifikasi email dan reset password
- Login memakai redirect precedence dengan sanitasi path internal; fallback tetap `/dashboard/catalog`
- Register sudah mengirim `full_name` via `options.data` saat `signUp`
- Login mendeteksi kasus email belum diverifikasi dan menyediakan tombol `Kirim ulang email verifikasi`
- Reset password berjalan end-to-end: request email -> callback -> halaman update password -> redirect kembali ke login
- Middleware `/dashboard/*` tetap dipakai untuk proteksi area dashboard
- Tersedia scaffold minimum `/dashboard/catalog` agar hasil login sukses tidak berakhir ke 404 sebelum fase 3 dimulai

---

## Requirements

- [ ] REQ-01: User bisa register dengan email, password, dan nama lengkap
- [ ] REQ-02: Supabase mengirim email verifikasi setelah register
- [ ] REQ-03: User yang belum verifikasi email tidak bisa login
- [ ] REQ-04: User bisa login dengan email dan password
- [ ] REQ-05: User bisa logout dari semua halaman
- [ ] REQ-06: User bisa request reset password via email
- [ ] REQ-06a: User yang membuka link reset password dari email diarahkan ke flow update password yang valid di aplikasi
- [ ] REQ-07: Saat register berhasil, buat row di tabel `profiles` secara otomatis via DB trigger
- [ ] REQ-08: Setelah login, redirect dengan urutan precedence:
  1. Jika URL login mengandung `?redirect=<path>` -> redirect ke path internal tersebut
  2. Jika tidak ada -> fallback ke `/dashboard/catalog`
- [ ] REQ-09: Halaman login dan register tidak bisa diakses oleh user yang sudah login
- [ ] REQ-10: Dari halaman `/register/success` dan layar "email belum diverifikasi", user bisa menekan tombol `Kirim ulang email verifikasi`

---

## Acceptance Criteria

- [ ] AC-01: Form register berisi Full Name, Email, Password, Confirm Password
- [ ] AC-02: Validasi email valid, password minimal 8 karakter, dan konfirmasi password cocok
- [ ] AC-03: Tampilkan error message yang jelas jika validasi gagal
- [ ] AC-04: Tampilkan pesan sukses setelah register
- [ ] AC-05: Form login berisi Email dan Password
- [ ] AC-06: Tampilkan error generik jika login gagal
- [ ] AC-07: Ada link `Lupa Password?` di halaman login
- [ ] AC-08: Tombol logout tersedia di dashboard
- [ ] AC-09: Setelah logout, redirect ke `/login`
- [ ] AC-10: Login sukses dengan query `redirect` mengarah ke path tujuan yang valid
- [ ] AC-11: Login sukses tanpa query `redirect` mengarah ke `/dashboard/catalog`
- [ ] AC-12: Query `redirect` eksternal diabaikan
- [ ] AC-13: Tombol resend verifikasi disabled 60 detik setelah dipencet
- [ ] AC-14: User bisa menyelesaikan reset password end-to-end tanpa harus membuka Supabase dashboard manual

---

## UI / User Flow

### Halaman `/login`

- Form: Email, Password
- Tombol: `Masuk`
- Link: `Belum punya akun? Daftar`
- Link: `Lupa password?`

### Halaman `/register`

- Form: Nama Lengkap, Email, Password, Konfirmasi Password
- Tombol: `Daftar`
- Link: `Sudah punya akun? Masuk`

### Halaman `/forgot-password`

- Form: Email
- Tombol: `Kirim Link Reset`

### Halaman `/reset-password`

- Form: Password Baru, Konfirmasi Password Baru
- Tombol: `Simpan Password Baru`

---

## Email Verification Experience

- Setelah register sukses -> tampilkan halaman `/register/success`
- Jika user login sebelum verifikasi -> tampilkan pesan bahwa email belum diverifikasi
- Tombol resend memanggil `supabase.auth.resend({ type: 'signup', email })`
- Link verifikasi dari email redirect ke app lalu masuk ke `/dashboard/catalog`

## Reset Password Experience

- Dari `/forgot-password`, user submit email untuk menerima link reset
- Link reset dari email diarahkan ke route callback aplikasi
- Route callback memvalidasi session/token Supabase lalu mengarahkan user ke `/reset-password`
- Di `/reset-password`, user memasukkan password baru lalu menyimpannya ke Supabase Auth
- Setelah sukses, user diarahkan ke `/login` dengan pesan sukses

---

## Technical Notes

- Gunakan Supabase Auth dengan `signInWithPassword` dan `signUp`
- Saat `signUp`, wajib kirim `full_name` lewat `options.data` supaya trigger `handle_new_user` bisa membuat row di `profiles` tanpa error:
  ```ts
  supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  })
  ```
  Trigger DB menolak `full_name` kosong (lihat `specs/_data-models.md`), jadi form register harus memvalidasi non-empty sebelum submit
- Resend verifikasi: `supabase.auth.resend({ type: 'signup', email })`
- Tambahkan route callback auth untuk menangani return URL dari email verification / reset password
- Gunakan `NEXT_PUBLIC_APP_URL` sebagai base URL aplikasi saat menyusun callback / redirect auth
- Untuk trigger pembuatan profil, lihat SQL di `specs/_data-models.md`
- Gunakan `createServerClient` di Server Components
- Middleware proteksi `/dashboard/*`
- Saat handling redirect di login page, whitelist hanya path internal
- Gunakan `supabase.auth.getUser()` di middleware
- Form validation bisa menggunakan react-hook-form + zod
- Placeholder tipis `/dashboard/catalog` boleh dipakai sementara pada fase 2 hanya untuk tujuan redirect setelah login; implementasi katalog sebenarnya tetap mengikuti `specs/features/02-catalog.md` di fase 3

### Supabase Auth - Konfigurasi Dashboard

Spec ini mengasumsikan setting Supabase berikut sudah di-set manual oleh owner **sebelum implementasi auth fase 1 dijalankan**. Kalau tidak, behavior tidak akan sesuai spec:

| Setting | Lokasi di Dashboard | Nilai yang Diharapkan |
|---|---|---|
| Email confirmation | Auth -> Providers -> Email -> Confirm email | ON |
| Site URL | Auth -> URL Configuration -> Site URL | `http://localhost:3000` (dev) / domain produksi |
| Redirect URLs | Auth -> URL Configuration -> Redirect URLs | `http://localhost:3000/**` dan domain produksi |
| Email template confirm signup | Auth -> Email Templates | Bahasa Indonesia, tetap gunakan placeholder URL |
| Email template reset password | Auth -> Email Templates | Bahasa Indonesia |
| Password min length | Auth -> Policies | 8 |

Checklist ini juga diacu di `GETTING_STARTED.md`.

---

## Pending Changes

*(kosong)*

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-15 | 1.0 | Initial spec |
| 2026-04-16 | 1.1 | Tambah precedence redirect login, resend email verifikasi, checklist konfigurasi Supabase |
| 2026-04-20 | 1.2 | Rapikan wording agar sinkron dengan fase 1 publik |
| 2026-04-20 | 1.3 | Lengkapi flow reset password agar implementable end-to-end di aplikasi |
| 2026-04-21 | 1.4 | Tegaskan signUp harus kirim `full_name` via `options.data` karena trigger DB sekarang menolak nilai kosong |
| 2026-04-21 | 1.5 | Current State diperbarui: fase 2 auth sudah diimplementasikan end-to-end pada baseline project |
