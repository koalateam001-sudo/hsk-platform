import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getLoginRedirectPath } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams?: Promise<{
    redirect?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedSearchParams = await searchParams;
  const redirectTo = getLoginRedirectPath(resolvedSearchParams?.redirect);

  if (user) {
    redirect(redirectTo);
  }

  return (
    <AuthShell
      title="Masuk"
      description="Masuk untuk melanjutkan membaca materi New HSK 3.0."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-slate-900">
            Daftar
          </Link>
        </>
      }
    >
      <LoginForm redirectTo={redirectTo} infoMessage={resolvedSearchParams?.message} />
    </AuthShell>
  );
}
