import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Kirim ulang link reset password untuk akun HSK 3.0 Platform.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Lupa Password"
      description="Masukkan email akun Anda. Kami akan kirim link untuk mengatur ulang password."
      footer={
        <>
          Ingat password Anda?{" "}
          <Link href="/login" className="font-medium text-slate-900">
            Kembali ke login
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
