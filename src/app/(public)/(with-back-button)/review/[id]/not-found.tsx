import Link from "next/link";
import Navbar from "@/components/nav-bar/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            {/* 404 Icon */}
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Review Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the review you're looking for. It may have
              been removed or the link might be incorrect.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/reviews"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Browse All Reviews
              </Link>
              <Link
                href="/"
                className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-purple-500 transition-all"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
