import { Suspense } from "react";
import { Link } from "react-transition-progress/next";
import { ReviewCard } from "@/components/review-card/review-card";
import { ReviewCardSkeleton } from "@/components/review-card/review-card-skeleton";
import { getMostRecentReviews } from "@/lib/mongodb";

async function ReviewList() {
  const reviews = await getMostRecentReviews();
  return (
    <>
      {reviews.map((review) => (
        <ReviewCard key={review._id} reviewData={review} />
      ))}
    </>
  );
}

export default function RecentReviewsSection() {
  return (
    <section className="px-6 lg:px-20 py-20">
      <div className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
        <h2 className="text-neutral-800 text-3xl font-bold tracking-tight">
          Recent Stories from the Community
        </h2>
        <Link
          href="/reviews"
          className="text-[#853853] font-bold flex items-center gap-1 hover:underline shrink-0"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <Suspense
          fallback={
            <>
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </>
          }
        >
          <ReviewList />
        </Suspense>
      </div>
    </section>
  );
}
