"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { DocumentProps } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.25;

type StreamResponse = {
  url?: string;
  error?: string;
};

type PdfViewerProps = {
  ebookId: string;
};

type LoadedDoc = { numPages: number };

type DocumentOnLoadSuccess = NonNullable<DocumentProps["onLoadSuccess"]>;

export function PdfViewer({ ebookId }: PdfViewerProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSignedUrl() {
      setFetchError(null);
      setFileUrl(null);
      setNumPages(null);
      setCurrentPage(1);

      try {
        const response = await fetch(`/api/ebook/${ebookId}/stream`, {
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => ({}))) as StreamResponse;

        if (!response.ok || !payload.url) {
          throw new Error(payload.error || "Gagal memuat PDF");
        }

        if (!cancelled) {
          setFileUrl(payload.url);
        }
      } catch (error) {
        if (!cancelled) {
          setFetchError(
            error instanceof Error ? error.message : "Gagal memuat PDF",
          );
        }
      }
    }

    loadSignedUrl();

    return () => {
      cancelled = true;
    };
  }, [ebookId]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(element);
    setContainerWidth(element.clientWidth);

    return () => observer.disconnect();
  }, []);

  const file = useMemo(() => (fileUrl ? { url: fileUrl } : null), [fileUrl]);

  const handleLoadSuccess: DocumentOnLoadSuccess = (doc: LoadedDoc) => {
    setNumPages(doc.numPages);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((page) =>
      numPages ? Math.min(numPages, page + 1) : page,
    );
  };

  const handleZoomOut = () => {
    setScale((value) => Math.max(ZOOM_MIN, Number((value - ZOOM_STEP).toFixed(2))));
  };

  const handleZoomIn = () => {
    setScale((value) => Math.min(ZOOM_MAX, Number((value + ZOOM_STEP).toFixed(2))));
  };

  const pageWidth = containerWidth
    ? Math.max(320, containerWidth - 32) * scale
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        onContextMenu={(event) => event.preventDefault()}
        className="relative flex min-h-[70vh] items-center justify-center overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-4 select-none"
      >
        {fetchError ? (
          <p className="text-sm text-rose-600">{fetchError}</p>
        ) : !file ? (
          <p className="text-sm text-slate-500">Memuat PDF…</p>
        ) : (
          <Document
            file={file}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={(error) => {
              console.error("[PdfViewer] load error", error);
              setFetchError("Gagal memuat PDF. Coba buka ulang halaman.");
            }}
            loading={
              <p className="text-sm text-slate-500">Memuat PDF…</p>
            }
            error={
              <p className="text-sm text-rose-600">
                Gagal memuat PDF. Coba buka ulang halaman.
              </p>
            }
            noData={
              <p className="text-sm text-slate-500">PDF tidak tersedia.</p>
            }
          >
            <Page
              pageNumber={currentPage}
              width={pageWidth}
              renderAnnotationLayer={false}
              renderTextLayer
              loading={
                <p className="text-sm text-slate-500">Memuat halaman…</p>
              }
            />
          </Document>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || !numPages}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-slate-600">
            Halaman{" "}
            <span className="font-semibold text-slate-900">
              {numPages ? currentPage : "-"}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-900">{numPages ?? "-"}</span>
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={!numPages || currentPage >= (numPages ?? 0)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= ZOOM_MIN}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="min-w-[3.5rem] text-center text-sm font-medium text-slate-700">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= ZOOM_MAX}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
