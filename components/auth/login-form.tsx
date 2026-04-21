"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAlert } from "@/components/auth/auth-alert";
import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
import { createBrowserClient } from "@/lib/supabase/client";

type LoginFormProps = {
  redirectTo: string;
  infoMessage?: string;
};

export function LoginForm({ redirectTo, infoMessage }: LoginFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNeedsVerification(false);

    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      const normalizedMessage = signInError.message.toLowerCase();

      if (
        normalizedMessage.includes("email not confirmed") ||
        normalizedMessage.includes("email not verified")
      ) {
        setNeedsVerification(true);
        setError("Email Anda belum diverifikasi. Kirim ulang email verifikasi di bawah ini.");
      } else {
        setError("Login gagal. Periksa kembali email dan password Anda.");
      }

      setIsSubmitting(false);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {infoMessage ? <AuthAlert message={infoMessage} tone="success" /> : null}
      {error ? <AuthAlert message={error} tone="error" /> : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            required
          />
        </label>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {needsVerification && email.trim() ? (
        <ResendVerificationButton email={email.trim()} />
      ) : null}
    </div>
  );
}
