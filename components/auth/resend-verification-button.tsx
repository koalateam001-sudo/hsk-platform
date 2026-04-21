"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

type ResendVerificationButtonProps = {
  email: string;
};

export function ResendVerificationButton({
  email,
}: ResendVerificationButtonProps) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  const isDisabled = countdown > 0 || isSubmitting;

  async function handleResend() {
    setIsSubmitting(true);
    setError("");
    setMessage("");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/catalog`,
      },
    });

    if (resendError) {
      setError(resendError.message);
      setIsSubmitting(false);
      return;
    }

    setMessage("Email verifikasi baru sudah dikirim. Cek inbox dan folder spam.");
    setCountdown(60);
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleResend}
        disabled={isDisabled}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
      >
        {countdown > 0
          ? `Kirim ulang email verifikasi (${countdown}s)`
          : "Kirim ulang email verifikasi"}
      </button>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
