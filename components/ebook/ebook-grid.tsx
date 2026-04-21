import type { Tables } from "@/lib/supabase/types";
import { EbookCard } from "@/components/ebook/ebook-card";

type EbookGridProps = {
  title: string;
  ebooks: Tables<"ebooks">[];
};

export function EbookGrid({ title, ebooks }: EbookGridProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            {ebooks.length} ebook tersedia di bagian ini
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ebooks.map((ebook) => (
          <EbookCard key={ebook.id} ebook={ebook} />
        ))}
      </div>
    </section>
  );
}
