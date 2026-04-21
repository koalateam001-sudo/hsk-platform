# Data Models - Single Source of Truth

**Status:** Active  
**Version:** 3.4  
**Last Updated:** 2026-04-21  

> Setiap perubahan schema database harus diupdate di sini terlebih dahulu.

---

## Current State

- File migration Fase 1 (`profiles`, `ebooks`, trigger `handle_new_user`, RLS minimum) sudah ada di `supabase/migrations/001_initial_schema.sql` dan persis menyalin SQL pada § SQL Migration Lengkap di bawah
- Migration **belum dijalankan** di Supabase dashboard — owner perlu run SQL Editor manual sesuai GETTING_STARTED.md § FASE 1
- Tabel fase 2 (`subscriptions`, `processed_webhook_events`) belum dibuatkan file migration; tetap deferred sesuai spec

---

## Tabel: `profiles`

> Extension dari `auth.users`. Dibuat otomatis via trigger saat user register.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | `uuid` | PK, FK -> `auth.users.id` | Sama dengan Supabase auth user id |
| `full_name` | `text` | NOT NULL | Nama lengkap user |
| `email` | `text` | NOT NULL | Email user |
| `role` | `text` | NOT NULL, DEFAULT `'free'` | Enum: `'free'`, `'subscriber'`, `'admin'` |
| `mayar_customer_id` | `text` | NULLABLE | Dicadangkan untuk fase payment nanti; belum dipakai di MVP publik fase 1 |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS Policy:**
- User hanya bisa baca dan update profile miliknya sendiri
- Role `admin` di-set manual via Supabase dashboard SQL editor

---

## Tabel: `ebooks`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `title` | `text` | NOT NULL | Judul ebook |
| `level` | `int2` | NOT NULL, CHECK (1-9) | Level HSK |
| `description` | `text` | | Deskripsi singkat ebook |
| `cover_url` | `text` | | URL public image cover |
| `storage_path` | `text` | NOT NULL | Path PDF di private bucket |
| `total_pages` | `int4` | | Jumlah halaman PDF |
| `is_published` | `bool` | NOT NULL, DEFAULT `false` | Hanya ebook published yang muncul di katalog |
| `sort_order` | `int4` | DEFAULT `0` | Urutan tampil |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS Policy:**
- Semua user terautentikasi bisa baca ebook yang `is_published = true`
- Insert/Update/Delete hanya via Supabase dashboard

---

## Tabel: `subscriptions` (Fase 2 / Deferred)

> Tabel ini belum perlu dibuat untuk MVP publik fase 1. Definisi disimpan di spec sebagai rancangan fase 2 untuk membership/payment nanti.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK -> `profiles.id` | |
| `status` | `text` | NOT NULL | Enum: `'active'`, `'cancelled'`, `'expired'` |
| `started_at` | `timestamptz` | NOT NULL | Tanggal mulai subscription |
| `expires_at` | `timestamptz` | NOT NULL | Tanggal berakhir |
| `cancel_requested_at` | `timestamptz` | NULLABLE | Diisi saat cancel |
| `provider` | `text` | NOT NULL, DEFAULT `'mayar'` | Payment provider |
| `mayar_member_id` | `text` | UNIQUE, NULLABLE | ID member dari Mayar |
| `notes` | `text` | | Catatan opsional |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS Policy (fase 2):**
- User hanya bisa baca subscription miliknya sendiri
- Insert/Update hanya oleh backend webhook/service role

---

## Tabel: `processed_webhook_events` (Fase 2 / Deferred)

> Tabel ini belum perlu dibuat untuk MVP publik fase 1. Disimpan untuk kebutuhan idempotency webhook saat payment diaktifkan.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `event_id` | `text` | PK | Idempotency key |
| `provider` | `text` | NOT NULL, DEFAULT `'mayar'` | Provider asal event |
| `event_type` | `text` | NOT NULL | Nama event webhook |
| `payload` | `jsonb` | NOT NULL | Raw payload webhook |
| `processed_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Waktu pertama kali diproses |

**RLS Policy (fase 2):**
- Tidak ada akses dari user

---

## Relasi

```text
auth.users
    |
    +-- profiles (1:1)

ebooks (independent)

subscriptions (fase 2)
processed_webhook_events (fase 2)
```

---

## Enum Values

| Field | Nilai yang Valid |
|---|---|
| `profiles.role` | `'free'`, `'subscriber'`, `'admin'` (`subscriber` reserved untuk fase premium nanti) |
| `subscriptions.status` | `'active'`, `'cancelled'`, `'expired'` (fase 2) |
| `subscriptions.provider` | `'mayar'` (fase 2) |
| `processed_webhook_events.provider` | `'mayar'` (fase 2) |
| `ebooks.level` | `1`, `2`, `3` (MVP) - hingga `9` (roadmap) |

---

## SQL Migration Lengkap

> Untuk MVP publik fase 1, yang wajib dibuat hanya `profiles` dan `ebooks`.
> Tabel `subscriptions` dan `processed_webhook_events` adalah migration fase 2.
> SQL fase 1 harus benar-benar sudah cukup untuk dipakai aplikasi, termasuk trigger dan RLS minimum.

```sql
-- ===== TABEL: profiles =====
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'subscriber', 'admin')),
  mayar_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Catatan: NULLIF mengubah empty string jadi NULL sehingga constraint NOT NULL
-- pada `full_name` akan menolak insert jika metadata `full_name` tidak dikirim
-- atau dikirim kosong. Ini melindungi integritas data dari form register yang
-- lupa menyertakan full_name.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    new.id,
    NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'full_name', '')), ''),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ===== TABEL: ebooks =====
CREATE TABLE ebooks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  level int2 NOT NULL CHECK (level BETWEEN 1 AND 9),
  description text,
  cover_url text,
  storage_path text NOT NULL,
  total_pages int4,
  is_published bool NOT NULL DEFAULT false,
  sort_order int4 DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ebooks_select_published"
  ON ebooks
  FOR SELECT
  TO authenticated
  USING (is_published = true);

-- ===== TABEL: subscriptions (FASE 2) =====
CREATE TABLE subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  cancel_requested_at timestamptz,
  provider text NOT NULL DEFAULT 'mayar',
  mayar_member_id text UNIQUE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ===== TABEL: processed_webhook_events (FASE 2) =====
CREATE TABLE processed_webhook_events (
  event_id text PRIMARY KEY,
  provider text NOT NULL DEFAULT 'mayar',
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);
```

---

## Changelog

| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-04-15 | 1.0 | Initial schema (`profiles`, `ebooks`) |
| 2026-04-16 | 2.0 | Tambah rancangan schema payment Mayar (`subscriptions`, `processed_webhook_events`) |
| 2026-04-16 | 2.1 | Sinkronisasi kolom `mayar_customer_id` di `profiles` dan constraint pada `subscriptions` |
| 2026-04-20 | 3.0 | Restrukturisasi dokumen: pisahkan schema fase 1 dan rancangan fase 2, tambah blok SQL Migration Lengkap |
| 2026-04-20 | 3.1 | Tandai schema payment (`subscriptions`, `processed_webhook_events`) sebagai deferred untuk fase 2; MVP publik fase 1 cukup `profiles` dan `ebooks` |
| 2026-04-20 | 3.2 | Lengkapi SQL fase 1 dengan RLS dan policy minimum agar migration benar-benar executable sesuai spec |
| 2026-04-21 | 3.3 | Trigger `handle_new_user` pakai `NULLIF(TRIM(...), '')` supaya full_name kosong ditolak NOT NULL, tidak silently tersimpan sebagai string kosong |
| 2026-04-21 | 3.4 | Tambah § Current State: file migration Fase 1 sudah ada di `supabase/migrations/001_initial_schema.sql`, tapi belum dijalankan |
