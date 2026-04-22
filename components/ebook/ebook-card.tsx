"use client";

import Link from "next/link";
import { useState } from "react";
import type { Tables } from "@/lib/supabase/types";

type EbookCardProps = {
  ebook: Tables<"ebooks">;
};

function getAccessBadge(level: number) {
  if (level === 1) {
    return {
      label: "Gratis",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: "Premium",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
}

function getHref(ebook: Tables<"ebooks">) {
  if (ebook.level === 1) {
    return `/dashboard/read/${ebook.id}`;
  }

  return "/dashboard/upgrade";
}

export function EbookCard({ ebook }: EbookCardProps) {
  const badge = getAccessBadge(ebook.level);
  const [hasCoverError, setHasCoverError] = useState(false);
  const coverUrl = ebook.cover_url ?? "";
  const showCoverImage = Boolean(coverUrl) && !hasCoverError;

  return (
    <Link
      href={getHref(ebook)}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
    >
      <div className="aspect-[4/5] overflow-hidden bg-slate-100">
        {showCoverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={`Cover ${ebook.title}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            onError={() => setHasCoverError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
            Cover belum tersedia
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            Level {ebook.level}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{ebook.title}</h3>
          {ebook.description ? (
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              {ebook.description}
            </p>
          ) : (
            <p className="text-sm text-slate-400">Deskripsi belum tersedia.</p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-sm text-slate-500">
          <span>{ebook.total_pages ? `${ebook.total_pages} halaman` : "Halaman belum diisi"}</span>
          <span className="font-medium text-slate-700 group-hover:text-slate-900">
            {ebook.level === 1 ? "Buka" : "Lihat detail"}
          </span>
        </div>
      </div>
    </Link>
  );
}
