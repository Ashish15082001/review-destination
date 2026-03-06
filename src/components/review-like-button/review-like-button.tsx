"use client";

import { UserData } from "@/schema/user";
import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import likeAnimation from "@/assets/like-animation.json";
import toast from "react-hot-toast";
import { LikeData } from "@/schema/like";
interface ReviewLikeButtonProps {
  reviewId: string;
  totalLikes: number;
  currentUserData: UserData | null; // Current user data, null if not logged in
  likeId?: string; // Optional like ID if the current user has liked the review
}

export function ReviewLikeButton({
  reviewId,
  totalLikes,
  currentUserData,
  likeId,
}: ReviewLikeButtonProps) {
  const [optimisticLikes, setOptimisticLike] = useState(totalLikes);
  const [optimisticLikeId, setOptimisticLikeId] = useState(likeId);
  const [isProcessing, setIsProcessing] = useState(false); // To prevent multiple rapid clicks
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // If already liked on mount, jump to frame 100 (end of liked state)
  useEffect(() => {
    if (optimisticLikeId && lottieRef.current) {
      lottieRef.current.goToAndStop(100, true);
    }
  }, []);

  const handleIncreamentLike = async (likeId: string) => {
    lottieRef.current?.playSegments([10, 100], true);
    setOptimisticLike((prev) => prev + 1); // Increment the optimistic like count
    setOptimisticLikeId(likeId); // Set a temporary like ID
  };

  const handleDecreamentLike = async () => {
    lottieRef.current?.playSegments([101, 181], true);
    setOptimisticLike((prev) => prev - 1);
    setOptimisticLikeId(undefined); // Clear the optimistic like ID
  };

  const handleToggleLike = async () => {
    if (isProcessing) return; // Prevent action if already processing
    if (currentUserData === null) {
      toast("Please log in to like the review.");
      return;
    }

    setIsProcessing(true);

    // remove like if it already exists
    if (optimisticLikeId !== undefined) {
      handleDecreamentLike();

      try {
        const response = await fetch("/api/like-review", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewId,
            likeId: optimisticLikeId,
          }), // Use the like ID from the optimistic data
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        handleIncreamentLike(optimisticLikeId);
      }
    } else {
      handleIncreamentLike("temp-like-id"); // Use a temporary like ID for optimistic update

      try {
        const response = await fetch("/api/like-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: { likeData: LikeData } = await response.json();
        const newLikeId = data.likeData._id; // Assuming the response contains the new like ID

        setOptimisticLikeId(newLikeId);
      } catch (error) {
        handleDecreamentLike();
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={(event) => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();

          if (currentUserData === null) {
            toast("Please log in to interact.");
            return;
          }

          handleToggleLike();
        }}
        className={`flex items-center cursor-pointer ${currentUserData ? "transition-transform duration-200 hover:scale-120 active:scale-100" : ""}`}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={likeAnimation}
          loop={false}
          autoplay={false}
          className="h-10 w-10 scale-150"
        />
      </button>

      <span className="text-sm font-medium text-gray-600">
        {optimisticLikes}
      </span>
    </div>
  );
}
