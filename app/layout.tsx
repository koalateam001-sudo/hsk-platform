import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HSK 3.0 Platform",
  description: "Platform belajar New HSK 3.0 secara online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
