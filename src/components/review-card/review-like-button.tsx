"use client";

import { likeReviewAction } from "@/actions/like-review-action";
import { UserData } from "@/schema/user";
import { useOptimistic, useTransition } from "react";

interface ReviewLikeButtonProps {
  reviewId: string;
  totalLikes: number;
}

export function ReviewLikeButton({
  reviewId,
  totalLikes,
}: ReviewLikeButtonProps) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    totalLikes,
    (prev, like: number) => prev + like,
  );
  const [isPending, startTransition] = useTransition();

  const handlePostLike = async () => {
    if (isPending) return; // Prevent multiple clicks while the action is pending

    // Optimistically update the UI
    startTransition(() => {
      addOptimisticLike(1);
    });

    try {
      // Send the like action to the server
      await fetch("/api/feeback/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId }), // Replace "123" with actual user ID
      });
    } catch (error) {
      console.error("Error liking the review:", error);
      // Optionally, you can revert the optimistic update here if the request fails
      startTransition(() => {
        addOptimisticLike(-1);
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
      <button
        onClick={(event) => {
          event.stopPropagation();
          handlePostLike();
        }}
        className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>

      <span className="text-sm text-gray-500">{optimisticLikes}</span>
    </div>
  );
}
