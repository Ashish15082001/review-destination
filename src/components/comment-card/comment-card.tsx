"use client";

import { CommentDataWithCommenterInfo } from "@/schema/comment";
import { CommentActions } from "../comment-actions/comment-actions";
import { UserAvatar } from "../user-avatar/user-avatar";
import { UserData } from "@/schema/user";
import { useState } from "react";
import { Comments } from "../comments/comments";

interface CommentCardProps {
  commentData: CommentDataWithCommenterInfo;
  parentCommentData?: CommentDataWithCommenterInfo;
  reviewUserData: UserData;
  currentUserData?: UserData;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CommentCard({
  commentData,
  parentCommentData,
  reviewUserData,
  currentUserData,
}: CommentCardProps) {
  const [isCommentRepliesVisible, setIsCommentRepliesVisible] = useState(false);
  const [repliesData, setRepliesData] = useState<
    CommentDataWithCommenterInfo[]
  >([]);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const relativeTime = getRelativeTime(new Date(commentData.commentedOn));

  // generate a consistent color from the name
  const colors = [
    "bg-[#853853]",
    "bg-[#612D53]",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  const { commenterName } = commentData;
  const colorIndex = commenterName.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  const handleToggleCommentRepliesVisibility = async () => {
    if (isCommentRepliesVisible) {
      setIsCommentRepliesVisible(false);
      return;
    }

    if (repliesData.length > 0) {
      setIsCommentRepliesVisible(true);
      return;
    }

    setIsRepliesLoading(true);
    try {
      const response = await fetch(
        `/api/comment-replies?commentId=${commentData._id}`,
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to fetch replies");
      }

      setRepliesData(responseData.commentRepliesData);
      setIsCommentRepliesVisible(true);
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsRepliesLoading(false);
    }
  };

  return (
    <div>
      <div className="p-4 flex gap-3">
        {/* Avatar */}
        <UserAvatar
          userName={commenterName}
          imageSrc={commentData.profilePictureUrl}
          className={avatarColor}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* commenter name and date commented */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">
              {commenterName}
            </span>
            <span className="text-xs text-gray-400">{relativeTime}</span>
          </div>

          {/* comment */}
          <p className={`text-sm text-gray-600 leading-relaxed `}>
            {commentData.parentCommentId && parentCommentData && (
              <span className="text-xs text-gray-400 mr-2 color-gray-400">
                Replying to {parentCommentData.commenterName}
              </span>
            )}
            {commentData.comment}
          </p>

          {/* replies toggle */}
          <div className="mt-2 text-xs text-gray-400">
            <button
              className="hover:underline cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                handleToggleCommentRepliesVisibility();
              }}
            >
              {isCommentRepliesVisible ? "Hide replies" : "View replies"}
            </button>
          </div>

          {/* Actions */}
          <CommentActions
            commentData={commentData}
            currentUserData={currentUserData}
          />
        </div>
      </div>

      <div className="ml-4">
        {/* Replies */}
        {isRepliesLoading ? (
          <div className="p-6">
            <p className="text-gray-400 text-sm text-center">Loading...</p>
          </div>
        ) : (
          isCommentRepliesVisible && (
            <Comments
              commentsData={repliesData}
              reviewUserData={reviewUserData}
              currentUserData={currentUserData}
              parentCommentData={commentData}
            />
          )
        )}
      </div>
    </div>
  );
}
