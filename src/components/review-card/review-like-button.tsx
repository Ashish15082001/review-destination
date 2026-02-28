"use client";

import { LikeData } from "@/schema/like";
import { useOptimistic, useState, useTransition } from "react";
import { set } from "zod";

interface ReviewLikeButtonProps {
  reviewId: string;
  currentUserLikeData?: LikeData; // prop to indicate if the current user has already liked the review
  totalLikes: number;
}

export function ReviewLikeButton({
  reviewId,
  currentUserLikeData,
  totalLikes,
}: ReviewLikeButtonProps) {
  const [optimisticLikes, setOptimisticLike] = useState(totalLikes);
  const [optimisticCurrentUserLikeData, setOptimisticCurrentUserLikeData] =
    useState<LikeData | undefined>(currentUserLikeData);

  const handleToggleLike = async () => {
    if (optimisticCurrentUserLikeData) {
      setOptimisticCurrentUserLikeData(undefined); // Clear the optimistic like data to reflect the unliked state
      setOptimisticLike((prev) => prev - 1); // Decrement the optimistic like count

      try {
        await fetch("/api/feedback/like-unlike", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewId,
            likeId: optimisticCurrentUserLikeData._id,
          }), // Use the like ID from the optimistic data
        });
      } catch (error) {
        console.error("Error unliking the review:", error);

        setOptimisticLike((prev) => prev + 1);
        setOptimisticCurrentUserLikeData(currentUserLikeData);
      }
    } else {
      // Like

      try {
        const response = await fetch("/api/feedback/like-unlike", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const newLikeData: LikeData = data.likeData; // Assuming the API returns the new like data in this format
        setOptimisticCurrentUserLikeData(newLikeData);
        setOptimisticLike((prev) => prev + 1);
      } catch (error) {
        console.error("Error liking the review:", error);
        setOptimisticLike((prev) => prev - 1);
        setOptimisticCurrentUserLikeData(undefined);
      }
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={(event) => {
          event.stopPropagation();
          handleToggleLike();
        }}
        className={`flex items-center transition-colors cursor-pointer ${optimisticCurrentUserLikeData ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
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
