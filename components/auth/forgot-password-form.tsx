"use client";

import { useMemo, useState } from "react";
import { AuthAlert } from "@/components/auth/auth-alert";
import { getAuthCallbackUrl } from "@/lib/auth";
import { createBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      trimmedEmail,
      {
        redirectTo: getAuthCallbackUrl("/reset-password"),
      },
    );

    if (resetError) {
      setError(resetError.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess("Link reset password sudah dikirim. Cek inbox dan folder spam.");
    setIsSubmitting(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <AuthAlert message={error} tone="error" /> : null}
      {success ? <AuthAlert message={success} tone="success" /> : null}

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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
      </button>
    </form>
  );
}
