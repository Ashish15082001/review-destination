"use client";

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
    (prev, like: number) => {
      console.log("Optimistic update: ", prev, like);
      return prev + like;
    },
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

  console.log(
    "Rendering ReviewLikeButton with optimisticLikes:",
    optimisticLikes,
  );

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={(event) => {
          event.stopPropagation();
          handlePostLike();
        }}
        className="flex items-center text-pink-500 hover:text-pink-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </button>

      <span className="text-sm font-medium text-gray-600">
        {optimisticLikes}
      </span>
    </div>
  );
}
