"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ReviewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Reviews section error:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 rounded-lg">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Failed to Load Reviews
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            We encountered an error while loading the reviews.
          </p>
          {error.message && (
            <p className="text-sm text-gray-500 mt-4 p-4 bg-white rounded-lg border border-gray-200">
              Error: {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            Go to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          If the problem persists, please contact support.
        </div>
      </div>
    </div>
  );
}
