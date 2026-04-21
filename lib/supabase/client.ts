import { createBrowserClient as supabaseCreateBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export const createBrowserClient = () =>
  supabaseCreateBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
