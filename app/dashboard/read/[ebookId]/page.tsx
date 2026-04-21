import { notFound } from "next/navigation";
import { assertEbookAccess } from "@/lib/access";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

type ReadPageProps = {
  params: {
    ebookId: string;
  };
};

export default async function ReadEbookPage({ params }: ReadPageProps) {
  type Ebook = Tables<"ebooks">;
  type Profile = Tables<"profiles">;
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [ebookResult, profileResult] =
    await Promise.all([
      supabase
        .from("ebooks")
        .select("*")
        .eq("id", params.ebookId)
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
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Viewer Placeholder
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">{ebook.title}</h1>
        <p className="text-sm leading-6 text-slate-600">
          Route baca untuk Level 1 sudah aktif dan access control server-side
          sudah berjalan. PDF viewer penuh akan dikerjakan di fase 4.
        </p>
      </div>
    </section>
  );
}
