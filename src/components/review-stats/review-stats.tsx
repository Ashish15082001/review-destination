import {
  getLikesDataByReviewId,
  getCommentsDataByReviewId,
  getUserDataUsingSession,
} from "@/lib/mongodb";
import { ReviewLikeButton } from "../review-like-button/review-like-button";

export async function ReviewStats({ reviewId }: { reviewId: string }) {
  const [likesData, commentsData, userData] = await Promise.all([
    getLikesDataByReviewId({ reviewId }),
    getCommentsDataByReviewId({ reviewId }),
    getUserDataUsingSession(),
  ]);

  const currentUserData = userData;
  const totalLikes = likesData.length;
  const totalComments = commentsData.length;

  // Check if the current user has already liked the review
  // We find like data for the current user by comparing the likedBy field with the currentUserData
  // If current user has liked the review, currentUserLikeData will contain that like data, otherwise it will be undefined
  const currentUserLikeData = likesData?.find(
    (like) => like.likedBy === currentUserData?._id,
  );

  return (
    <>
      {/* Likes */}
      <ReviewLikeButton
        reviewId={reviewId}
        totalLikes={totalLikes}
        currentUserLikeData={currentUserLikeData}
        currentUserData={currentUserData}
      />

      {/* Comments */}
      <div className="flex items-center gap-1.5 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 640 640"
          fill="currentColor"
          stroke="none"
        >
          <path d="M115.9 448.9C83.3 408.6 64 358.4 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304C576 436.5 461.4 544 320 544C283.5 544 248.8 536.8 217.4 524L101 573.9C97.3 575.5 93.5 576 89.5 576C75.4 576 64 564.6 64 550.5C64 546.2 65.1 542 67.1 538.3L115.9 448.9zM153.2 418.7C165.4 433.8 167.3 454.8 158 471.9L140 505L198.5 479.9C210.3 474.8 223.7 474.7 235.6 479.6C261.3 490.1 289.8 496 319.9 496C437.7 496 527.9 407.2 527.9 304C527.9 200.8 437.8 112 320 112C202.2 112 112 200.8 112 304C112 346.8 127.1 386.4 153.2 418.7z" />
        </svg>
        <span className="text-sm font-medium text-gray-600">
          {totalComments}
        </span>
      </div>
    </>
  );
}
