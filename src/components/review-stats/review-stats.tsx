import {
  getLikesDataByReviewId,
  getCommentsDataByReviewId,
} from "@/lib/mongodb";
import { ReviewLikeButton } from "../review-card/review-like-button";

export async function ReviewStats({ reviewId }: { reviewId: string }) {
  const [likesData, commentsData] = await Promise.all([
    getLikesDataByReviewId({ reviewId }),
    getCommentsDataByReviewId({ reviewId }),
  ]);

  const totalLikes = likesData?.length ?? 0;
  const totalComments = commentsData?.length ?? 0;

  return (
    <>
      {/* Likes */}
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <ReviewLikeButton reviewId={reviewId} totalLikes={totalLikes} />
      </div>

      {/* Comments */}
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{totalComments}</span>
      </div>
    </>
  );
}
