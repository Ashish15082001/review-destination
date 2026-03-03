"use client";

import { CommentData } from "@/schema/comment";
import { useState } from "react";
import toast from "react-hot-toast";

interface CommentActionsProps {
  commentData: CommentData;
  currentUserId: string | null;
}

export function CommentActions({
  commentData: {
    _id: commentId,
    reviewId,
    idsOfUsersWhoLiked,
    idsOfUsersWhoDisliked,
  },
  currentUserId,
}: CommentActionsProps) {
  const [optimisticLikedIds, setOptimisticLikedIds] =
    useState<string[]>(idsOfUsersWhoLiked);
  const [optimisticDislikedIds, setOptimisticDislikedIds] = useState<string[]>(
    idsOfUsersWhoDisliked,
  );

  const hasLiked = currentUserId
    ? optimisticLikedIds.includes(currentUserId)
    : false;
  const hasDisliked = currentUserId
    ? optimisticDislikedIds.includes(currentUserId)
    : false;

  const handleLike = async () => {
    if (!currentUserId) {
      toast("Please log in to like a comment.");
      return;
    }

    if (hasLiked) {
      // Remove like
      setOptimisticLikedIds((prev) =>
        prev.filter((id) => id !== currentUserId),
      );
      try {
        const res = await fetch("/api/like-comment", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId, reviewId }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setOptimisticLikedIds(idsOfUsersWhoLiked);
        toast.error("Failed to remove like.");
      }
    }
    // If user is adding a like, we also need to check if they had previously disliked the comment. If so, we optimistically remove the dislike as well and make an API call to remove the dislike.
    else {
      // Add like (remove dislike if present)
      setOptimisticLikedIds((prev) => [...prev, currentUserId]);

      //   Remove dislike if it exists
      if (hasDisliked) {
        setOptimisticDislikedIds((prev) =>
          prev.filter((id) => id !== currentUserId),
        );
      }

      try {
        if (hasDisliked) {
          await fetch("/api/dislike-comment", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId, reviewId }),
          });
        }
        const res = await fetch("/api/like-comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId, reviewId }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setOptimisticLikedIds(idsOfUsersWhoLiked);
        setOptimisticDislikedIds(idsOfUsersWhoDisliked);
        toast.error("Failed to like comment.");
      }
    }
  };

  const handleDislike = async () => {
    if (!currentUserId) {
      toast("Please log in to dislike a comment.");
      return;
    }

    if (hasDisliked) {
      // Remove dislike
      setOptimisticDislikedIds((prev) =>
        prev.filter((id) => id !== currentUserId),
      );
      try {
        const res = await fetch("/api/dislike-comment", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId, reviewId }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setOptimisticDislikedIds(idsOfUsersWhoDisliked);
        toast.error("Failed to remove dislike.");
      }
    } else {
      // Add dislike (remove like if present)
      setOptimisticDislikedIds((prev) => [...prev, currentUserId]);

      if (hasLiked) {
        setOptimisticLikedIds((prev) =>
          prev.filter((id) => id !== currentUserId),
        );
      }
      try {
        if (hasLiked) {
          await fetch("/api/like-comment", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId, reviewId }),
          });
        }
        const res = await fetch("/api/dislike-comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId, reviewId }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setOptimisticLikedIds(idsOfUsersWhoLiked);
        setOptimisticDislikedIds(idsOfUsersWhoDisliked);
        toast.error("Failed to dislike comment.");
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Like button */}
      <button
        onClick={handleLike}
        aria-label={hasLiked ? "Remove like" : "Add like"}
        className={`flex items-center gap-1 transition-colors cursor-pointer ${
          hasLiked ? "text-[#853853]" : "text-gray-400 hover:text-[#853853]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          {hasLiked ? (
            /* liked.svg – filled thumbs up */
            <path d="M144 224C161.7 224 176 238.3 176 256L176 512C176 529.7 161.7 544 144 544L96 544C78.3 544 64 529.7 64 512L64 256C64 238.3 78.3 224 96 224L144 224zM334.6 80C361.9 80 384 102.1 384 129.4L384 133.6C384 140.4 382.7 147.2 380.2 153.5L352 224L512 224C538.5 224 560 245.5 560 272C560 291.7 548.1 308.6 531.1 316C548.1 323.4 560 340.3 560 360C560 383.4 543.2 402.9 521 407.1C525.4 414.4 528 422.9 528 432C528 454.2 513 472.8 492.6 478.3C494.8 483.8 496 489.8 496 496C496 522.5 474.5 544 448 544L360.1 544C323.8 544 288.5 531.6 260.2 508.9L248 499.2C232.8 487.1 224 468.7 224 449.2L224 262.6C224 247.7 227.5 233 234.1 219.7L290.3 107.3C298.7 90.6 315.8 80 334.6 80z" />
          ) : (
            /* not-liked.svg – outline thumbs up */
            <path d="M235.5 102.8C256.3 68 300.5 54 338 71.6L345.2 75.4C380 96.3 394 140.5 376.4 178L376.4 178L362.3 208L472 208L479.4 208.4C515.7 212.1 544 242.8 544 280C544 293.2 540.4 305.4 534.2 316C540.3 326.6 543.9 338.8 544 352C544 370.3 537.1 386.8 526 399.5C527.3 404.8 528 410.3 528 416C528 441.1 515.1 463 495.8 475.9C493.9 511.4 466.4 540.1 431.4 543.6L424 544L319.9 544C301.9 544 284 540.6 267.3 534.1L260.2 531.1L259.5 530.8L252.9 527.6L252.2 527.3L240 520.8C227.7 514.3 216.7 506.1 207.1 496.7C203 523.6 179.8 544.1 151.8 544.1L119.8 544.1C88.9 544.1 63.8 519 63.8 488.1L64 264C64 233.1 89.1 208 120 208L152 208C162.8 208 172.9 211.1 181.5 216.5L231.6 110L232.2 108.8L234.9 103.8L235.5 102.9zM120 256C115.6 256 112 259.6 112 264L112 488C112 492.4 115.6 496 120 496L152 496C156.4 496 160 492.4 160 488L160 264C160 259.6 156.4 256 152 256L120 256zM317.6 115C302.8 108.1 285.3 113.4 276.9 127L274.7 131L217.9 251.9C214.4 259.4 212.4 267.4 211.9 275.6L211.8 279.8L211.8 392.7L212 400.6C214.4 433.3 233.4 462.7 262.7 478.3L274.2 484.4L280.5 487.5C292.9 493.1 306.3 496 319.9 496L424 496L426.4 495.9C438.5 494.7 448 484.4 448 472L447.8 469.4C447.7 468.5 447.6 467.7 447.4 466.8C444.7 454.7 451.7 442.6 463.4 438.8C473.1 435.7 480 426.6 480 416C480 411.7 478.9 407.8 476.9 404.2C470.6 393.1 474.1 379 484.9 372.2C491.7 367.9 496.1 360.4 496.1 352C496.1 344.9 493 338.5 487.9 334C482.7 329.4 479.7 322.9 479.7 316C479.7 309.1 482.7 302.6 487.9 298C493 293.5 496.1 287.1 496.1 280L496 277.6C494.9 266.3 485.9 257.3 474.6 256.2L472.2 256.1L324.7 256.1C316.5 256.1 308.9 251.9 304.5 245C300.1 238.1 299.5 229.3 303 221.9L333 157.6C340 142.6 334.4 124.9 320.5 116.6L317.6 115z" />
          )}
        </svg>
        <span className="text-xs font-medium">{optimisticLikedIds.length}</span>
      </button>

      {/* Dislike button */}
      <button
        onClick={handleDislike}
        aria-label={hasDisliked ? "Remove dislike" : "Dislike comment"}
        className={`flex items-center gap-1 transition-colors cursor-pointer ${
          hasDisliked ? "text-red-500" : "text-gray-400 hover:text-red-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          {hasDisliked ? (
            /* disliked.svg – filled thumbs down */
            <path d="M448 96C474.5 96 496 117.5 496 144C496 150.3 494.7 156.2 492.6 161.7C513 167.2 528 185.8 528 208C528 217.1 525.4 225.6 521 232.9C543.2 237.1 560 256.6 560 280C560 299.7 548.1 316.6 531.1 324C548.1 331.4 560 348.3 560 368C560 394.5 538.5 416 512 416L352 416L380.2 486.4C382.7 492.7 384 499.5 384 506.3L384 510.5C384 537.8 361.9 559.9 334.6 559.9C315.9 559.9 298.8 549.3 290.4 532.6L234.1 420.3C227.4 407 224 392.3 224 377.4L224 190.8C224 171.4 232.9 153 248 140.8L260.2 131.1C288.6 108.4 323.8 96 360.1 96L448 96zM144 160C161.7 160 176 174.3 176 192L176 448C176 465.7 161.7 480 144 480L96 480C78.3 480 64 465.7 64 448L64 192C64 174.3 78.3 160 96 160L144 160z" />
          ) : (
            /* not-disliked.svg – outline thumbs down */
            <path d="M424 96L431.4 96.4C466.4 100 493.9 128.6 495.8 164.1C513.6 175.9 525.9 195.5 527.8 218L528 224C528 229.7 527.3 235.2 526 240.5C536.2 252 542.8 266.8 543.8 283.2L544 288C544 301.2 540.4 313.4 534.2 324C539.1 332.4 542.4 341.9 543.5 352L543.9 360C543.9 397.3 515.6 427.9 479.3 431.6L471.9 432L362.2 432L376.3 462L379.4 469.6C391.9 505.3 377.6 545.1 345.2 564.6L338 568.5C300.5 586.1 256.3 572.1 235.4 537.3L234.8 536.4L232.1 531.4L231.5 530.2L201.4 466.2C192 484 173.4 496.1 151.9 496.1L119.9 496.1C89 496.1 63.9 471 63.9 440.1L64 216C64 185.1 89.1 160 120 160L152 160C164.4 160 175.9 164.1 185.2 171C198.4 149.6 217.2 131.6 240.2 119.4L252.4 112.9L253.1 112.6L259.7 109.4L260.4 109.1L267.5 106.1C284.2 99.5 302 96.2 320.1 96.2L424 96zM319.9 144C307.9 144 296 146.3 284.8 150.6L280.1 152.6L274.8 155.2L274.8 155.2L262.6 161.7C233.4 177.2 214.3 206.6 211.9 239.3L211.7 247.3L211.7 360.2L211.8 364.3C212.3 372.5 214.3 380.5 217.8 388L274.6 508.9L276.7 512.7C285.1 526.4 302.7 531.8 317.5 524.9L320.4 523.3C333.4 515.5 339.1 499.6 334.1 485.3L332.9 482.3L302.7 418.1C299.2 410.7 299.8 402 304.2 395C308.6 388 316.2 383.9 324.4 383.9L471.9 383.9L474.3 383.8C485.6 382.7 494.6 373.7 495.7 362.4L495.8 359.9C495.8 352.8 492.7 346.4 487.6 341.9C482.4 337.3 479.4 330.8 479.4 323.9C479.4 317 482.4 310.5 487.6 305.9C492 302 495 296.6 495.6 290.6L495.8 287.9C495.8 279.5 491.4 272 484.6 267.7C473.9 260.8 470.4 246.8 476.6 235.7C478.1 233.1 479.1 230.1 479.5 227.1L479.7 223.9C479.7 213.3 472.8 204.3 463.1 201.1C451.4 197.3 444.4 185.2 447.1 173.1C447.3 172.2 447.4 171.3 447.5 170.5L447.7 167.9C447.7 155.5 438.2 145.3 426.1 144.1L424 144L319.9 144zM120 208C115.6 208 112 211.6 112 216L112 440C112 444.4 115.6 448 120 448L152 448C156.4 448 160 444.4 160 440L160 216C160 211.6 156.4 208 152 208L120 208z" />
          )}
        </svg>
        <span className="text-xs font-medium">
          {optimisticDislikedIds.length}
        </span>
      </button>
    </div>
  );
}
