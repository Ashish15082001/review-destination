import { ReviewCardSkeleton } from "@/components/review-card/review-card-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col">
          {/* Count row skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <ReviewCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
