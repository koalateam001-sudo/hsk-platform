"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAlert } from "@/components/auth/auth-alert";
import { createBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/login?message=Password%20berhasil%20diperbarui.%20Silakan%20login%20kembali.");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <AuthAlert message={error} tone="error" /> : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Password Baru</span>
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
          Konfirmasi Password Baru
        </span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="Ulangi password baru"
          autoComplete="new-password"
          required
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
      </button>
    </form>
  );
}
