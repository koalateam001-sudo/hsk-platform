import type { Metadata } from "next";
import Link from "next/link";
import { ContactCta } from "@/components/marketing/contact-cta";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNavbar } from "@/components/marketing/public-navbar";

export const metadata: Metadata = {
  title: "Paket & Harga",
  description:
    "Paket Gratis Level 1 tersedia sekarang. Paket Premium Level 2 & 3 segera hadir.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Paket & Harga — HSK 3.0 Platform",
    description:
      "Paket Gratis Level 1 tersedia sekarang. Paket Premium Level 2 & 3 segera hadir.",
    url: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Paket
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Mulai Gratis, Premium Menyusul
            </h1>
            <p className="text-sm leading-7 text-slate-600">
              Fase saat ini hanya membuka paket gratis. Paket premium sedang
              disiapkan dan akan diaktifkan di fase berikutnya.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Gratis
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Level 1
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Semua materi New HSK 3.0 Level 1 bisa dibaca langsung setelah
                  daftar.
                </p>
              </div>

              <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
                <li>• Akses penuh Level 1</li>
                <li>• Baca langsung di browser</li>
                <li>• Tanpa biaya</li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Mulai Gratis
                </Link>
              </div>
            </article>

            <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Premium
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Level 2 &amp; 3
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Akses akan dibuka di fase berikutnya. Belum tersedia untuk
                  pembelian hari ini.
                </p>
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  Segera Hadir
                </span>
              </div>

              <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
                <li>• Akses penuh Level 2 dan Level 3</li>
                <li>• Materi lengkap dalam satu tempat</li>
                <li>• Alur berlangganan akan diumumkan kemudian</li>
              </ul>

              <div className="mt-8">
                <ContactCta />
              </div>
            </article>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
