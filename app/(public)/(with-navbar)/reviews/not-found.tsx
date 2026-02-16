import Link from "next/link";

export default function ReviewsNotFound() {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 rounded-lg">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          Reviews Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The reviews you're looking for could not be found. They may have been
          removed or never existed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Home
          </Link>
          <Link
            href="/add-review"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Add a Review
          </Link>
        </div>
      </div>
    </div>
  );
}
