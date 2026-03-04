import { ReviewCardSkeleton } from "@/components/review-card/review-card-skeleton";

export function RecentReviewsSkeleton() {
  return (
    <section className="px-6 lg:px-20 py-20">
      <div className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
        <div className="h-8 w-72 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse shrink-0" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <ReviewCardSkeleton />
        <ReviewCardSkeleton />
        <ReviewCardSkeleton />
        <ReviewCardSkeleton />
      </div>
    </section>
  );
}
