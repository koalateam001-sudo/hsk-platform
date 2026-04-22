import Link from "next/link";
import { ContactCta } from "@/components/marketing/contact-cta";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

type Profile = Tables<"profiles">;

type AccessBadge = {
  label: string;
  subtext?: string;
};

function getAccessBadge(role: string): AccessBadge {
  if (role === "admin") {
    return { label: "Admin - semua level terbuka" };
  }

  return {
    label: "Gratis - Level 1 aktif",
    subtext: "Premium segera hadir",
  };
}

function formatJoinedDate(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function DashboardProfilePage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileResult = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const profile = profileResult.data as Profile | null;

  if (profileResult.error || !profile) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h1 className="text-2xl font-semibold">Profile belum bisa dimuat</h1>
        <p className="mt-3 text-sm leading-6">
          Terjadi kendala saat mengambil data akun. Coba refresh beberapa saat
          lagi.
        </p>
      </section>
    );
  }

  const access = getAccessBadge(profile.role);
  const showContactCta = profile.role !== "admin";

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Akun
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Profile Saya</h1>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Informasi Akun
        </h2>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Nama Lengkap</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {profile.full_name || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="mt-1 font-medium text-slate-900">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Tanggal Bergabung</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {formatJoinedDate(profile.created_at)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Status Akses</h2>
        <div className="mt-4 space-y-1">
          <p className="text-base font-medium text-slate-900">{access.label}</p>
          {access.subtext ? (
            <p className="text-sm text-slate-500">{access.subtext}</p>
          ) : null}
        </div>

        {showContactCta ? (
          <div className="mt-6">
            <ContactCta />
          </div>
        ) : null}
      </section>

      <div>
        <Link
          href="/dashboard/catalog"
          className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
        >
          ← Kembali ke Katalog
        </Link>
      </div>
    </div>
  );
}
