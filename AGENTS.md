# AGENTS.md — Instruksi Wajib untuk Codex

> File ini adalah kontrak antara kamu (AI) dan proyek ini.
> Baca seluruh file ini sebelum melakukan tindakan apapun.

---

## 1. Identitas Proyek

Kamu sedang bekerja di proyek **New HSK 3.0 Ebook Subscription Platform** — sebuah web app berbasis Next.js 14 untuk membaca ebook Mandarin secara online dengan model freemium subscription.

---

## 2. Prinsip Utama: Spec-Anchored Development

Proyek ini menggunakan **Spec-Anchored SDD (Specification-Driven Development)**.

### Aturan yang TIDAK BOLEH dilanggar:

1. **Spec adalah Single Source of Truth.** Jika ada konflik antara spec dan kode, SELALU tanyakan kepada user mana yang benar — jangan asumsi sendiri.

2. **Jangan ubah kode tanpa dasar di spec.** Setiap perubahan kode harus bisa dirujuk ke requirement di file spec.

3. **Setelah selesai implement, update bagian `## Current State` di spec yang relevan.** Pastikan spec selalu mencerminkan kondisi kode terkini.

4. **Jika ada sesuatu yang tidak ada di spec tapi perlu diimplementasikan** (misalnya utility function, error handling), tambahkan ke bagian `## Technical Notes` di spec yang relevan, lalu lanjutkan.

5. **Jangan hapus atau refactor kode yang tidak disebutkan dalam task saat ini**, kecuali ada instruksi eksplisit.

---

## 3. Cara Membaca Spec Sebelum Bekerja

Setiap kali menerima task, ikuti urutan ini:

```
1. Baca specs/_project.md          → Pahami konteks proyek
2. Baca specs/_architecture.md     → Pahami tech stack & pola yang digunakan
3. Baca specs/_data-models.md      → Pahami schema database
4. Baca specs/features/[X].md      → Baca spec fitur yang akan dikerjakan
5. Baru mulai implement
```

Jangan skip langkah ini meskipun kamu merasa sudah tahu konteksnya.

---

## 4. Format Response yang Diharapkan

Sebelum mulai coding, selalu tampilkan:

```
📋 SPEC YANG DIBACA:
- specs/_project.md ✓
- specs/_architecture.md ✓
- specs/features/[nama-fitur].md ✓

🎯 TASK:
[Ringkasan singkat apa yang akan dikerjakan]

📌 REQUIREMENT YANG JADI DASAR:
- [Kutip requirement spesifik dari spec]

⚠️ ASUMSI / AMBIGUITAS:
- [Jika ada yang tidak jelas di spec, sebutkan di sini sebelum lanjut]
```

Setelah selesai, tampilkan:

```
✅ SELESAI:
[Daftar file yang dibuat/diubah]

📝 SPEC UPDATE DIPERLUKAN:
[Bagian spec mana yang perlu di-update oleh user — terutama "Current State"]
```

---

## 5. Lokasi File Penting

| File | Isi |
|---|---|
| `specs/_project.md` | Overview proyek, tujuan, target user, scope MVP |
| `specs/_architecture.md` | Tech stack, pola kode, keputusan teknis |
| `specs/_data-models.md` | Schema semua tabel database |
| `specs/features/01-auth.md` | Register, login, lupa password |
| `specs/features/02-catalog.md` | Halaman daftar ebook |
| `specs/features/03-pdf-viewer.md` | PDF viewer in-browser (MVP tanpa watermark) |
| `specs/features/04-access-control.md` | Gate Level 1 vs 2-3 |
| `specs/features/05-admin-operations.md` | SOP admin via Supabase dashboard (bukan kode) |
| `specs/features/06-payment.md` | **Deferred** — rancangan integrasi Mayar untuk fase 2, bukan scope MVP fase 1 |
| `specs/features/07-landing-page.md` | Landing + pricing page |
| `specs/features/08-profile.md` | Halaman profile user sederhana (fase 1) |

---

## 6. Hal yang Tidak Boleh Dilakukan

- ❌ Jangan install library yang tidak ada di `specs/_architecture.md` tanpa bertanya
- ❌ Jangan ubah schema database tanpa update `specs/_data-models.md`
- ❌ Jangan buat file di luar struktur folder yang sudah didefinisikan tanpa alasan yang jelas
- ❌ Jangan gunakan `any` type di TypeScript tanpa alasan yang sangat kuat
- ❌ Jangan commit atau push kode tanpa instruksi eksplisit

---

*File ini adalah bagian dari sistem Spec-Anchored SDD. Jangan modifikasi tanpa instruksi dari user.*
