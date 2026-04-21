# Feature: Payment Integration (Deferred)

**Status:** `Deferred`  
**Version:** 3.1  
**Last Updated:** 2026-04-20  

---

## Overview

Integrasi payment dan membership premium ditunda dari MVP publik fase 1. Dokumen ini tetap dipertahankan sebagai rancangan fase berikutnya agar arah integrasi tidak hilang, tetapi tidak menjadi blocker launch publik dasar.

---

## Current State

> Tidak diimplementasikan di fase 1.

---

## Keputusan Scope

- Fase 1 tidak membuat checkout, webhook, atau sinkronisasi entitlement
- Halaman pricing dan upgrade hanya menjadi placeholder roadmap
- Semua route dan env Mayar belum dibutuhkan sekarang
- Integrasi payment baru dimulai setelah MVP publik dasar tervalidasi

---

## Apa yang Ditunda ke Fase 2

- Pembuatan checkout session
- Webhook Mayar
- Sinkronisasi `subscriptions`
- Upgrade otomatis role/entitlement
- Halaman sukses pembayaran
- Retry/debugging webhook

---

## Rancangan Fase 2

Saat payment diaktifkan nanti, pendekatan yang saat ini direncanakan adalah:

- Provider: Mayar
- Model: Membership
- Entitlement sinkron via webhook + pull canonical state
- Tabel pendukung: `subscriptions` dan `processed_webhook_events`
- Access gate premium dihubungkan kembali ke `expires_at > now()`

Semua detail lama tentang event, idempotency, dan trust-but-verify sengaja tidak dibuang dari sejarah proyek, tetapi implementasinya harus dipastikan ulang terhadap dokumentasi Mayar terbaru saat fase 2 benar-benar dimulai.

---

## Technical Notes

- Jika fase 2 dimulai, update dulu:
  - `specs/_project.md`
  - `specs/_architecture.md`
  - `specs/_data-models.md`
  - `specs/features/04-access-control.md`
  - `specs/features/07-landing-page.md`
- Jangan implement payment dari dokumen ini tanpa revalidasi docs provider terbaru

---

## Pending Changes

*(kosong)*

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-16 | 3.0 | Rancangan detail integrasi Mayar Membership |
| 2026-04-20 | 3.1 | Ditandai sebagai deferred: bukan bagian dari MVP publik fase 1 |
