import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Verifikasi Email",
  description: "Cek email Anda untuk menyelesaikan verifikasi akun.",
  robots: { index: false, follow: false },
};

type RegisterSuccessPageProps = {
  searchParams?: Promise<{
    email?: string;
    fullName?: string;
  }>;
};

export default async function RegisterSuccessPage({
  searchParams,
}: RegisterSuccessPageProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard/catalog");
  }

  const resolvedSearchParams = await searchParams;
  const email = resolvedSearchParams?.email?.trim();
  const fullName = resolvedSearchParams?.fullName?.trim();

  return (
    <AuthShell
      title="Cek Email Anda"
      description="Verifikasi email diperlukan sebelum Anda bisa login."
      footer={
        <>
          Sudah selesai verifikasi?{" "}
          <Link href="/login" className="font-medium text-slate-900">
            Masuk
          </Link>
        </>
      }
    >
      <div className="space-y-5 text-sm leading-6 text-slate-700">
        <p>
          {fullName
            ? `Akun untuk ${fullName} hampir siap.`
            : "Akun Anda hampir siap."}{" "}
          Kami sudah mengirim email verifikasi
          {email ? ` ke ${email}` : ""}.
        </p>
        <p>
          Setelah klik link verifikasi, Anda akan diarahkan kembali ke aplikasi
          dan bisa login seperti biasa.
        </p>

        {email ? (
          <ResendVerificationButton email={email} />
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
            Email tidak ditemukan di URL. Jika perlu, kembali ke halaman daftar
            dan ulangi proses pendaftaran.
          </p>
        )}
      </div>
    </AuthShell>
  );
}
