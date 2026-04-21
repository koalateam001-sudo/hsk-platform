import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          ← Kembali
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              HSK 3.0 Platform
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          </div>

          {children}
        </section>

        {footer ? (
          <div className="text-center text-sm text-slate-600">{footer}</div>
        ) : null}
      </div>
    </main>
  );
}
