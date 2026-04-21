"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAlert } from "@/components/auth/auth-alert";
import { createBrowserClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!trimmedEmail) {
      setError("Email wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/catalog`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    const params = new URLSearchParams({
      email: trimmedEmail,
      fullName: trimmedName,
    });

    router.replace(`/register/success?${params.toString()}`);
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <AuthAlert message={error} tone="error" /> : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Nama Lengkap</span>
        <input
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="Nama Anda"
          autoComplete="name"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="nama@email.com"
          autoComplete="email"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="Minimal 8 karakter"
          autoComplete="new-password"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Konfirmasi Password
        </span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="Ulangi password"
          autoComplete="new-password"
          required
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Memproses..." : "Daftar"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-slate-900">
          Masuk
        </Link>
      </p>
    </form>
  );
}
