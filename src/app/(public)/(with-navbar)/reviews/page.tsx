import { getReviewsData, getReviewsCount } from "@/lib/mongodb";
import { Reviews } from "@/components/reviews/reviews";
import { ReviewCard } from "@/components/review-card/review-card";

export const metadata = {
  title: "Travel Reviews - Share Your Experiences",
  description:
    "Discover amazing destinations through travelers' experiences. Read and share reviews of your favorite travel spots.",
};

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const [reviewsData, total] = await Promise.all([
    getReviewsData({ pageSize: 10, page }),
    getReviewsCount(),
  ]);

  return (
    <div className="min-h-screen ">
      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reviews total={total} currentPage={page} count={reviewsData.length}>
          {reviewsData.map((reviewData) => (
            <ReviewCard key={reviewData._id} reviewData={reviewData} />
          ))}
        </Reviews>
      </div>
    </div>
  );
}
