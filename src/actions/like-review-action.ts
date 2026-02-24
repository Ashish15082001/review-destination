"use server";

import { insertLikeData } from "@/lib/mongodb";
import { updateTag } from "next/cache";

export interface LikeReviewActionArgs {
  reviewId: string;
  userId: string;
}

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
