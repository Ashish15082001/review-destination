export function ReviewStatsSkeleton() {
  return (
    <>
      {/* Likes skeleton */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Comments skeleton */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    </>
  );
}
