import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { getAppUrl } from "@/lib/auth";

const siteUrl = getAppUrl();
const siteName = "HSK 3.0 Platform";
const defaultTitle = "HSK 3.0 Platform — Materi New HSK 3.0 Online";
const defaultDescription =
  "Platform belajar New HSK 3.0 online. Mulai gratis dari Level 1. Baca langsung di browser, tanpa perlu download.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s — HSK 3.0 Platform",
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: ["HSK", "New HSK 3.0", "Mandarin", "ebook", "belajar Mandarin"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
