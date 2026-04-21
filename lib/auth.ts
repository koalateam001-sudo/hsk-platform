const DEFAULT_REDIRECT_PATH = "/dashboard/catalog";

export function sanitizeRedirectPath(
  candidate: string | null | undefined,
  fallback = DEFAULT_REDIRECT_PATH,
) {
  if (!candidate) {
    return fallback;
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  return candidate;
}

export function getAppUrl() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

  return appUrl.replace(/\/+$/, "");
}

export function getAuthCallbackUrl(nextPath?: string) {
  const url = new URL("/auth/callback", getAppUrl());

  if (nextPath) {
    url.searchParams.set("next", sanitizeRedirectPath(nextPath));
  }

  return url.toString();
}

export function getLoginRedirectPath(candidate?: string | null) {
  return sanitizeRedirectPath(candidate, DEFAULT_REDIRECT_PATH);
}
