import Link from "next/link";

function getContactUrl() {
  return process.env.NEXT_PUBLIC_CONTACT_URL?.trim() || "";
}

export default function DashboardUpgradePage() {
  const contactUrl = getContactUrl();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="max-w-3xl space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Premium Roadmap
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Akses Level 2-3 Segera Hadir
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Pada fase saat ini, akses premium belum dibuka. Level 2 dan Level 3
            tetap ditampilkan agar arah produk terlihat jelas, tetapi belum bisa
            dibaca oleh user biasa.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Rencana benefit premium
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>• Akses penuh ke materi Level 2 dan Level 3</li>
            <li>• Pengalaman belajar yang lebih lengkap di satu tempat</li>
            <li>• Alur upgrade yang akan dibuka di fase berikutnya</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          {contactUrl ? (
            <a
              href={contactUrl}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Hubungi Kami
            </a>
          ) : (
            <div className="rounded-2xl border border-slate-300 px-5 py-3 text-sm text-slate-600">
              Hubungi kami melalui kanal kontak utama yang sudah disiapkan owner.
            </div>
          )}

          <Link
            href="/dashboard/catalog"
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    </section>
  );
}
