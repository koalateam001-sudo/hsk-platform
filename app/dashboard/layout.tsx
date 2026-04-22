import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  type ProfileName = Pick<Tables<"profiles">, "full_name">;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profileResult = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .maybeSingle();
  const profile = profileResult.data as ProfileName | null;

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              HSK 3.0 Platform
            </p>
            <p className="text-sm text-slate-500">
              {profile?.full_name || user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/catalog"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Katalog
            </Link>
            <Link
              href="/dashboard/upgrade"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Premium
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Profile
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>
    </main>
  );
}
