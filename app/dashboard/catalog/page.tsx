import { EbookGrid } from "@/components/ebook/ebook-grid";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

const levels = [1, 2, 3] as const;

export default async function DashboardCatalogPage() {
  const supabase = await createServerClient();
  const result = await supabase
    .from("ebooks")
    .select("*")
    .eq("is_published", true)
    .order("level", { ascending: true })
    .order("sort_order", { ascending: true });
  const ebooks = (result.data ?? []) as Tables<"ebooks">[];
  const error = result.error;

  if (error) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h1 className="text-2xl font-semibold">Katalog belum bisa dimuat</h1>
        <p className="mt-3 text-sm leading-6">
          Terjadi kendala saat mengambil daftar ebook. Coba refresh beberapa saat
          lagi.
        </p>
      </section>
    );
  }

  if (ebooks.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Koleksi Ebook
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Belum ada ebook yang tayang
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Tambahkan ebook published di Supabase dashboard untuk menampilkan katalog
          kepada user.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Koleksi Ebook New HSK 3.0
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Level 1 bisa langsung dibaca. Level 2-3 tetap tampil sebagai roadmap
          premium untuk fase berikutnya.
        </p>
      </section>

      {levels.map((level) => {
        const booksInLevel = ebooks.filter((ebook) => ebook.level === level);

        if (booksInLevel.length === 0) {
          return null;
        }

        return (
          <EbookGrid
            key={level}
            title={`Level ${level}`}
            ebooks={booksInLevel}
          />
        );
      })}
    </div>
  );
}
