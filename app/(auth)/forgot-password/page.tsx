import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

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
