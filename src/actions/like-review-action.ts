"use server";

import { insertLikeData } from "@/lib/mongodb";
import { updateTag } from "next/cache";

export interface LikeReviewActionArgs {
  reviewId: string;
  userId: string;
}

/**
 * Server action to toggle a like on a review.
 *
 * Inserts a like record into the database for the given user and review,
 * then revalidates the likes cache for that review.
 *
 * @param params - Object containing `reviewId` and `userId`.
 * @param params.reviewId - The ID of the review to like.
 * @param params.userId - The ID of the user liking the review.
 */
const likeReviewAction = async ({ reviewId, userId }: LikeReviewActionArgs) => {
  await insertLikeData({
    likedBy: userId,
    reviewId: reviewId,
    likedOn: new Date(),
  });
  updateTag(`likesData-${reviewId}`);
};

export { likeReviewAction };

export interface LikeReviewActionReturnType {
  error: boolean;
  message: string[] | null;
}
