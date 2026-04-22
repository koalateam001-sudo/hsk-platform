import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createServerClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Link%20reset%20tidak%20valid%20atau%20sudah%20kedaluwarsa.");
  }

  return (
    <AuthShell
      title="Atur Ulang Password"
      description="Masukkan password baru Anda untuk menyelesaikan proses reset."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
