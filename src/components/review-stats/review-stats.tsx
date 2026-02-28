import {
  getLikesDataByReviewId,
  getCommentsDataByReviewId,
  getUserDataUsingSession,
} from "@/lib/mongodb";
import { ReviewLikeButton } from "../review-card/review-like-button";

export async function ReviewStats({ reviewId }: { reviewId: string }) {
  const [likesData, commentsData, userData] = await Promise.all([
    getLikesDataByReviewId({ reviewId }),
    getCommentsDataByReviewId({ reviewId }),
    getUserDataUsingSession(),
  ]);

  const currentUserData = userData?._id || null;
  const totalLikes = likesData?.length ?? 0;
  const totalComments = commentsData?.length ?? 0;

  // Check if the current user has already liked the review
  // We find like data for the current user by comparing the likedBy field with the currentUserData
  // If current user has liked the review, currentUserLikeData will contain that like data, otherwise it will be undefined
  const currentUserLikeData = likesData?.find(
    (like) => like.likedBy === currentUserData,
  );

  return (
    <>
      {/* Likes */}
      <ReviewLikeButton
        reviewId={reviewId}
        totalLikes={totalLikes}
        currentUserLikeData={currentUserLikeData}
      />

      {/* Comments */}
      <div className="flex items-center gap-1.5 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-sm font-medium text-gray-600">
          {totalComments}
        </span>
      </div>
    </>
  );
}
