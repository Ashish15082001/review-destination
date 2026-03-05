"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Link } from "react-transition-progress/next";

const PAGE_SIZE = 10;

interface ReviewsProps {
  children: React.ReactNode;
  total: number;
  currentPage: number;
  count: number;
}

export function Reviews({ children, total, currentPage, count }: ReviewsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function goToPage(page: number) {
    if (page === currentPage || isPending) return;

    startTransition(() => {
      router.replace(`?page=${page}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Illustration container */}
        <div
          className="relative flex items-center justify-center w-full aspect-video max-w-lg mx-auto mb-10 rounded-3xl overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at center, rgba(13, 127, 242, 0.08) 0%, transparent 70%)",
          }}
        >
          {/* Background map icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span
              className="material-symbols-outlined select-none text-[#853853]"
              style={{ fontSize: 200 }}
            >
              map
            </span>
          </div>
          {/* Foreground icons */}
          <div className="relative z-10 flex flex-col items-center">
            <span
              className="material-symbols-outlined text-[#853853]/60 mb-2"
              style={{ fontSize: 120 }}
            >
              person_pin_circle
            </span>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-4xl text-slate-300">
                terrain
              </span>
              <span className="material-symbols-outlined text-4xl text-slate-300">
                forest
              </span>
              <span className="material-symbols-outlined text-4xl text-slate-300">
                hiking
              </span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            No stories yet
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-md mx-auto">
            The trail is empty, but your memories aren&apos;t. Be the first to
            share your journey!
          </p>
        </div>

        {/* CTA button */}
        <Link
          href="/add-review"
          className="group relative inline-flex items-center gap-3 text-white px-10 py-5 rounded-2xl text-lg font-extrabold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          style={{
            backgroundColor: "#853853",
            boxShadow: "0 20px 40px rgba(133,56,83,0.25)",
          }}
        >
          <span className="material-symbols-outlined text-2xl">add_circle</span>
          Share Your Experience
          {/* Animated ping badge */}
          <span className="absolute -top-3 -right-3 flex h-6 w-6">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "#853853" }}
            />
            <span
              className="relative inline-flex rounded-full h-6 w-6 border-2 border-white"
              style={{ backgroundColor: "#853853" }}
            />
          </span>
        </Link>

        <p className="mt-8 text-sm text-slate-400 font-medium">
          Need inspiration?{" "}
          <a
            href="/about"
            className="hover:underline"
            style={{ color: "#853853" }}
          >
            Browse our destination guides
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Review count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{count}</span>{" "}
          of <span className="font-semibold text-gray-800">{total}</span> travel{" "}
          {total === 1 ? "story" : "stories"}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-semibold text-gray-800">{currentPage}</span>{" "}
            of <span className="font-semibold text-gray-800">{totalPages}</span>
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-12">
          {/* Previous */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || isPending}
            aria-label="Previous page"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-2 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ borderColor: "#853853", color: "#853853" }}
          >
            <span className="material-symbols-outlined text-base">
              chevron_left
            </span>
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex items-center justify-center w-9 h-9 text-sm text-slate-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page as number)}
                disabled={isPending}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-2 text-sm font-semibold transition-all disabled:cursor-not-allowed cursor-pointer"
                style={
                  page === currentPage
                    ? {
                        backgroundColor: "#853853",
                        borderColor: "#853853",
                        color: "#fff",
                      }
                    : {
                        borderColor: "#d1d5db",
                        color: "#374151",
                        backgroundColor: "transparent",
                      }
                }
              >
                {page}
              </button>
            ),
          )}

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || isPending}
            aria-label="Next page"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-2 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ borderColor: "#853853", color: "#853853" }}
          >
            <span className="material-symbols-outlined text-base">
              chevron_right
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
