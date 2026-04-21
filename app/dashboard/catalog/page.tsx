export default function DashboardCatalogPlaceholderPage() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Fase 2 Selesai
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Login Berhasil
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Halaman katalog lengkap akan dikerjakan di fase 3. Untuk saat ini,
          route tujuan login sudah aktif agar flow autentikasi bisa diuji
          end-to-end tanpa berakhir di halaman 404.
        </p>
      </div>
    </section>
  );
}
