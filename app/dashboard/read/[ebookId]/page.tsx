import Link from "next/link";
import { notFound } from "next/navigation";
import { PdfViewer } from "@/components/pdf/pdf-viewer";
import { assertEbookAccess } from "@/lib/access";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

type ReadPageProps = {
  params: Promise<{
    ebookId: string;
  }>;
};

export default async function ReadEbookPage({ params }: ReadPageProps) {
  type Ebook = Tables<"ebooks">;
  type Profile = Tables<"profiles">;
  const { ebookId } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [ebookResult, profileResult] = await Promise.all([
    supabase
      .from("ebooks")
      .select("*")
      .eq("id", ebookId)
      .eq("is_published", true)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id ?? "")
      .maybeSingle(),
  ]);

  const ebook = ebookResult.data as Ebook | null;
  const ebookError = ebookResult.error;
  const profile = profileResult.data as Profile | null;

  if (ebookError || !ebook) {
    notFound();
  }

  assertEbookAccess(profile ?? null, ebook);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Level {ebook.level}
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">{ebook.title}</h1>
        </div>
        <Link
          href="/dashboard/catalog"
          className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
        >
          Kembali ke Katalog
        </Link>
      </header>

      <PdfViewer ebookId={ebook.id} />
    </section>
  );
}
