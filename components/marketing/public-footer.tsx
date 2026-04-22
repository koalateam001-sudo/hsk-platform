import { getContactUrl } from "@/lib/contact";

export function PublicFooter() {
  const contactUrl = getContactUrl();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} HSK 3.0 Platform. Semua materi mengacu
          pada New HSK 3.0.
        </p>
        <div>
          {contactUrl ? (
            <a
              href={contactUrl}
              className="font-medium text-slate-900 transition hover:text-slate-700"
            >
              Hubungi Kami
            </a>
          ) : (
            <span className="text-slate-500">
              Kontak akan tersedia segera.
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
