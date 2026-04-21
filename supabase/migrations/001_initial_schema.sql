-- Initial schema untuk MVP publik fase 1.
-- Sumber kebenaran: specs/_data-models.md (versi 3.3).
-- Tabel subscriptions dan processed_webhook_events sengaja TIDAK dibuat di sini
-- karena fase 2 / deferred.

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
