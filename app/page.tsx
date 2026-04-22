import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNavbar } from "@/components/marketing/public-navbar";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard/catalog");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              New HSK 3.0
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Materi Lengkap New HSK 3.0, Dalam Satu Tempat
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Mulai gratis dari Level 1. Baca langsung di browser, tanpa perlu
              download. Level 2 dan 3 segera menyusul.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Mulai Gratis
              </Link>
              <Link
                href="/pricing"
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Lihat Paket
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Terstruktur
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ebook dikelompokkan per level sesuai standar New HSK 3.0 resmi.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Langsung Baca
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                PDF viewer in-browser. Tidak perlu install aplikasi tambahan.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Mulai Gratis
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Level 1 bisa langsung dibaca setelah daftar akun.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">
                Premium Level 2-3 Segera Hadir
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Saat ini fokus kami memastikan pengalaman baca Level 1 solid.
                Akses premium untuk Level 2 dan Level 3 akan dibuka di fase
                berikutnya.
              </p>
              <div>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
                >
                  Lihat roadmap paket
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
