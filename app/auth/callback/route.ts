import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextPath = sanitizeRedirectPath(requestUrl.searchParams.get("next"));
  const supabase = await createServerClient();

  let authError = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authError = Boolean(error);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    authError = Boolean(error);
  } else {
    authError = true;
  }

  if (authError) {
    return NextResponse.redirect(
      new URL(
        "/login?message=Link%20autentikasi%20tidak%20valid%20atau%20sudah%20kedaluwarsa.",
        request.url,
      ),
    );
  }

  const finalPath = type === "recovery" ? "/reset-password" : nextPath;

  return NextResponse.redirect(new URL(finalPath, request.url));
}
