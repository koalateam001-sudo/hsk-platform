import { NextResponse } from "next/server";
import { canAccessEbook } from "@/lib/access";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import type { Tables } from "@/lib/supabase/types";

const SIGNED_URL_EXPIRY_SECONDS = 15 * 60;

type StreamRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: StreamRouteContext) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [ebookResult, profileResult] = await Promise.all([
    supabase
      .from("ebooks")
      .select("id, level, storage_path, is_published")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle(),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
  ]);

  const ebook = ebookResult.data as Pick<
    Tables<"ebooks">,
    "id" | "level" | "storage_path" | "is_published"
  > | null;
  const profile = profileResult.data as Tables<"profiles"> | null;

  if (ebookResult.error || !ebook) {
    return NextResponse.json({ error: "Ebook tidak ditemukan" }, { status: 404 });
  }

  if (!canAccessEbook(profile, ebook as Tables<"ebooks">)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createServiceRoleClient();
  const { data, error } = await admin.storage
    .from("ebook-pdfs")
    .createSignedUrl(ebook.storage_path, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data?.signedUrl) {
    console.error("[ebook stream] gagal membuat signed URL", error);
    return NextResponse.json(
      { error: "Gagal membuat URL PDF" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: data.signedUrl });
}
