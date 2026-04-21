import { redirect } from "next/navigation";
import type { Tables } from "@/lib/supabase/types";

type Ebook = Tables<"ebooks">;
type Profile = Tables<"profiles"> | null;

export function canAccessEbook(profile: Profile, ebook: Ebook) {
  if (!profile) {
    return false;
  }

  if (profile.role === "admin") {
    return true;
  }

  return ebook.level === 1;
}

export function assertEbookAccess(profile: Profile, ebook: Ebook) {
  if (canAccessEbook(profile, ebook)) {
    return;
  }

  redirect("/dashboard/upgrade");
}
