"use server";

import { postLikeForReview } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

const likeReviewAction = async (reviewId: string) => {
  await postLikeForReview(reviewId);
  // revalidatePath(`/reviews`);
};

export { likeReviewAction };

export interface LikeReviewActionReturnType {
  error: boolean;
  message: string[] | null;
}
