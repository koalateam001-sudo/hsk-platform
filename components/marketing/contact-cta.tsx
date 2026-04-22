import { getContactUrl } from "@/lib/contact";

type ContactCtaProps = {
  label?: string;
  fallbackText?: string;
  variant?: "primary" | "outline";
};

export function ContactCta({
  label = "Hubungi Kami",
  fallbackText = "Hubungi kami melalui kanal kontak utama yang sudah disiapkan owner.",
  variant = "primary",
}: ContactCtaProps) {
  const contactUrl = getContactUrl();

  if (!contactUrl) {
    return (
      <div className="rounded-2xl border border-slate-300 px-5 py-3 text-sm text-slate-600">
        {fallbackText}
      </div>
    );
  }

  const className =
    variant === "primary"
      ? "rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
      : "rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900";

  return (
    <a href={contactUrl} className={className}>
      {label}
    </a>
  );
}
