# Project: New HSK 3.0 Ebook Platform

**Status:** Active  
**Version:** 2.1  
**Last Updated:** 2026-04-20  

---

## Deskripsi

Platform web untuk membaca ebook New HSK 3.0 secara online. Fase saat ini difokuskan ke MVP publik yang bisa di-deploy dan benar-benar dipakai: user bisa register/login, melihat katalog, dan membaca ebook gratis Level 1 di browser. Konten premium Level 2-3 tetap muncul sebagai arah produk, tetapi membership dan pembayaran belum diaktifkan di fase ini.

---

## Masalah yang Diselesaikan

Belum ada platform digital yang mengorganisir materi New HSK versi 3.0 secara terstruktur dalam satu wadah. Materi versi lama (HSK 2.0) masih banyak beredar dan membingungkan pelajar.

---

## Target Pengguna

| Segmen | Kebutuhan Utama |
|---|---|
| Pelajar Mandarin Pemula | Materi terstruktur dari level paling dasar |
| Peserta Ujian HSK | Materi spesifik New HSK 3.0 yang akurat |
| Pembeli Buku Fisik (existing audience) | Versi digital dari buku yang sudah mereka kenal |

**Target market:** Indonesia only (UI bahasa Indonesia, harga Rupiah)

---

## Model Bisnis

- **Free tier (fase sekarang):** Akses penuh ke semua ebook Level 1
- **Premium tier (fase berikutnya):** Akses ke Level 2 dan Level 3
- **Harga target premium:** Rp 30.000/bulan
- **Payment gateway rencana:** Mayar

---

## Scope MVP Publik Fase 1

### Termasuk di MVP

- Autentikasi user via Supabase Auth
- Katalog ebook Level 1-3, dikelompokkan per level
- In-browser PDF viewer untuk konten yang boleh diakses
- Access control sederhana: Level 1 bisa dibaca oleh user login, Level 2-3 ditandai premium / belum aktif
- Halaman profil user sederhana
- Landing page simpel
- Halaman pricing/upgrade sederhana sebagai placeholder roadmap premium dengan CTA final `Hubungi Kami`
- Deploy public di Vercel

### Tidak Termasuk di MVP

- Integrasi Mayar Membership / webhook
- Sinkronisasi entitlement premium otomatis
- PDF watermarking dinamis
- Admin panel custom
- Progress tracking per halaman
- Search konten dalam ebook
- Mobile app
- Multi-tier pricing atau paket tahunan

### Pertimbangan Keamanan MVP

Untuk fase sekarang, proteksi pembacaan ebook mengandalkan:
1. Private bucket di Supabase Storage
2. Signed URL yang expire dalam 15 menit
3. PDF viewer in-browser
4. Tombol download/print tidak ditampilkan di UI

Ini cukup untuk konten gratis Level 1 pada fase awal. Jika nanti konten premium diaktifkan dan risiko kebocoran jadi prioritas, fitur watermark dan mekanisme entitlement premium akan ditambahkan di fase berikutnya.

---

## Konten

- Ebook: New HSK 3.0 resmi
- Format: PDF
- Fase pertama: Level 1, 2, 3
- Upload dan kelola via Supabase dashboard

---

## Operasional

- **Yang menjalankan:** Pemilik (solo owner)
- **Upload ebook:** Manual via Supabase dashboard
- **Handling customer:** Via satu kanal kontak utama yang sama di seluruh app
- **Monitoring pembayaran:** Belum ada di fase sekarang

---

## Batasan dan Asumsi

- PDF tidak bisa diakses langsung via URL publik
- Signed URL di-generate server-side dengan expiry 15 menit
- Tidak ada offline access
- Semua operasi admin dilakukan via Supabase dashboard
- Fase saat ini tidak bergantung pada payment gateway eksternal agar deploy publik bisa lebih cepat dan stabil
- Membership/pembayaran akan ditambahkan setelah MVP publik dasar tervalidasi

---

## Kanal Kontak Utama

Untuk fase 1, semua CTA `Hubungi Kami` harus mengarah ke **satu kanal kontak kanonis** yang sama di seluruh aplikasi.

- Default yang direkomendasikan: **WhatsApp**
- Fallback jika WhatsApp belum siap: **email**
- Kanal final harus disimpan sebagai environment variable publik agar tidak di-hardcode per halaman:
  - `NEXT_PUBLIC_CONTACT_URL`
- Contoh value:
  - WhatsApp: `https://wa.me/6281234567890`
  - Email: `mailto:hello@example.com`

Aturan:
- Landing page, pricing, upgrade page, dan profile page wajib memakai `NEXT_PUBLIC_CONTACT_URL`
- Jika env ini belum diisi, tampilkan fallback non-error berupa teks kontak manual di footer / halaman terkait

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-15 | 1.0 | Initial project overview, target user, scope MVP dasar |
| 2026-04-16 | 2.0 | Scope memasukkan payment dan membership |
| 2026-04-20 | 2.1 | Scope MVP dipersempit ke public deployable baseline tanpa membership/payment dulu |
