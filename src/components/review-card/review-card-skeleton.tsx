export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Destination Image Skeleton */}
      <div className="relative h-64 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

      {/* Card Content */}
      <div className="px-6 pt-5 pb-4">
        {/* User Info Skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded mb-2 w-3/4" />

        {/* Description Skeleton */}
        <div className="space-y-1.5 mb-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-full" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-2/3" />
        </div>

        {/* Bottom Bar Skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
