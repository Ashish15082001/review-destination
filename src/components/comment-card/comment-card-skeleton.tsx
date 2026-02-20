export function CommentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Commenter name skeleton */}
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-1/4" />

      {/* Comment skeleton */}
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-full" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-5/6" />
      </div>

      {/* Date skeleton */}
      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-1/3 mt-3" />
    </div>
  );
}
