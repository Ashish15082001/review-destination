export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Destination Image Skeleton */}
      <div className="relative h-70 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

      {/* Card Content */}
      <div className="p-6">
        {/* Destination Name Skeleton */}
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded mb-2 w-3/4" />

        {/* Review Title Skeleton */}
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded mb-3 w-full" />

        {/* User and date posted on Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-1/4" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-1/4" />
        </div>

        {/* Like button Skeleton */}
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-1/3" />
      </div>
    </div>
  );
}
