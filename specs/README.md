# Panduan Sistem Spec-Anchored SDD

## Apa ini?

Folder `/specs` adalah Single Source of Truth untuk seluruh proyek ini. Setiap keputusan teknis, setiap fitur, dan setiap perubahan harus dirujuk ke sini.

---

## Hierarki File

```text
specs/
├── _project.md
├── _architecture.md
├── _data-models.md
└── features/
    ├── 01-auth.md
    ├── 02-catalog.md
    ├── 03-pdf-viewer.md
    ├── 04-access-control.md
    ├── 05-admin-operations.md
    ├── 06-payment.md
    ├── 07-landing-page.md
    └── 08-profile.md
```

### Catatan fase saat ini

- Fase aktif sekarang adalah **MVP publik fase 1**
- Scope aktif: auth, katalog, viewer Level 1, profile sederhana, landing page, pricing placeholder, deploy public
- Payment/membership saat ini **deferred** dan hanya disimpan sebagai rancangan fase berikutnya

---

## Workflow Wajib

### Saat membuat fitur baru

```text
1. Buat atau buka file specs/features/[nama].md
2. Tulis Requirements dan Acceptance Criteria
3. Implementasikan sesuai spec
4. Setelah selesai, update bagian "Current State"
```

### Saat mengubah fitur yang sudah ada

```text
1. Buka specs/features/[nama].md
2. Isi bagian "Pending Changes"
3. Update requirement bila perlu
4. Catat di changelog
5. Implementasikan perubahan
6. Setelah selesai, pindahkan hasilnya ke "Current State"
7. Kosongkan "Pending Changes"
```

---

## Larangan

- Jangan ubah kode tanpa dasar di spec
- Jangan biarkan spec dan kode tidak sinkron
- Jangan mengaktifkan payment/membership dari rancangan deferred tanpa update spec dulu

---

## Template Feature Spec

```markdown
# Feature: [Nama Fitur]

**Status:** `Draft` | `Active` | `In Progress` | `Deferred` | `Deprecated`
**Version:** 1.0
**Last Updated:** [YYYY-MM-DD]

---

## Overview
[1-2 kalimat]

## Current State
> Diisi setelah implementasi
- Belum diimplementasikan

## Requirements
- [ ] REQ-01: ...

## Acceptance Criteria
- [ ] AC-01: ...

## UI / User Flow
[Deskripsi]

## Technical Notes
[Catatan]

## Pending Changes
*(kosong)*

## Changelog
| Tanggal | Versi | Perubahan |
|---|---|---|
| [date] | 1.0 | Initial spec |
```

---

Sistem ini adalah tulang punggung proyek. Rawat dengan disiplin.
