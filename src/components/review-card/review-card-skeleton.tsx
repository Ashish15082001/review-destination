export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      {/* Destination Image Skeleton */}
      <div className="relative h-52 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse shrink-0">
        {/* When Visited Badge Skeleton */}
        <div className="absolute top-3 left-3 h-6 w-24 bg-white/60 rounded-full animate-pulse" />
        {/* Destination Name Skeleton (overlay) */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="h-5 w-2/3 bg-white/30 rounded animate-pulse" />
        </div>
      </div>

      {/* Card Content */}
      <div className="px-5 pt-4 pb-4 flex flex-col flex-1">
        {/* User Info Skeleton */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-1.5 mb-4 flex-1">
          <div className="h-3.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-full" />
          <div className="h-3.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-3/4" />
        </div>

        {/* Bottom Bar Skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-7 h-3.5 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-7 h-3.5 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
