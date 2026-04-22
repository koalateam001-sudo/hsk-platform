import Link from "next/link";

export function PublicNavbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-sm font-semibold text-slate-900">
          HSK 3.0 Platform
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/pricing"
            className="text-slate-600 transition hover:text-slate-900"
          >
            Paket
          </Link>
          <Link
            href="/login"
            className="text-slate-600 transition hover:text-slate-900"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
          >
            Daftar
          </Link>
        </nav>
      </div>
    </header>
  );
}
