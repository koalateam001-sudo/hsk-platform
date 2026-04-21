import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { createServerClient } from "@/lib/supabase/server";

export default async function RegisterPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard/catalog");
  }

  return (
    <AuthShell
      title="Buat Akun"
      description="Daftar akun baru untuk mulai mengakses materi Level 1."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-slate-900">
            Masuk
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
