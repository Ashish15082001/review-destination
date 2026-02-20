export function ReviewStatsSkeleton() {
  return (
    <>
      {/* Likes skeleton */}
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-6 h-4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Comments skeleton */}
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-6 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    </>
  );
}
