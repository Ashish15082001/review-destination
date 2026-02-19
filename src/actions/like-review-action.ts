"use server";

import { insertLikeData } from "@/lib/mongodb";

export interface LikeReviewActionArgs {
  reviewId: string;
  userId: string;
}

const likeReviewAction = async ({ reviewId, userId }: LikeReviewActionArgs) => {
  await insertLikeData({
    userId: userId,
    reviewId: reviewId,
    likedOn: new Date(),
  });
  // revalidatePath(`/reviews`);
};

export { likeReviewAction };

export interface LikeReviewActionReturnType {
  error: boolean;
  message: string[] | null;
}
