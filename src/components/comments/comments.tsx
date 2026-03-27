"use client";

import { CommentCard } from "@/components/comment-card/comment-card";
import { UserData } from "@/schema/user";
import { CommentDataWithCommenterInfo } from "@/schema/comment";
import { useEffect, useState } from "react";

export function Comments({
  isRootLevel = false,
  commentIds,
  reviewUserData,
  currentUserData,
  parentCommentData,
}: {
  isRootLevel?: boolean;
  commentIds: string[];
  reviewUserData: UserData;
  currentUserData?: UserData;
  parentCommentData?: CommentDataWithCommenterInfo;
}) {
  const [commentsDataWithCommenterName, setCommentsDataWithCommenterName] =
    useState<CommentDataWithCommenterInfo[]>([]);
  const [isLoading, setIsLoading] = useState(commentIds.length > 0);

  useEffect(() => {
    async function fetchCommentsData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/comments-with-commenter-name-by-commentIds?${commentIds
            .map((id) => `commentIds=${id}`)
            .join("&")}`,
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.error || "Failed to fetch comments data",
          );
        }

        if (response.ok) {
          setCommentsDataWithCommenterName(responseData.commentsData);
        }
      } catch (error) {
        console.error("Error fetching comments data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (commentIds.length > 0) fetchCommentsData();
  }, [commentIds]);

  if (isLoading) {
    if (isRootLevel)
      return (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Comments
          </h2>

          <p className="text-gray-400 text-sm text-center">
            Loading comments...
          </p>
        </div>
      );

    return (
      <div className="p-6">
        <p className="text-gray-400 text-sm text-center">Loading comments...</p>
      </div>
    );
  }

  if (commentsDataWithCommenterName.length === 0) {
    if (isRootLevel)
      return (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Comments
          </h2>
          <p className="text-gray-400 text-sm text-center">
            No comments yet. Be the first to comment!
          </p>
        </div>
      );

    return (
      <div className="p-6">
        <p className="text-gray-400 text-sm text-center">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  if (isRootLevel)
    return (
      <div className="flex flex-col gap-3 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Comments</h2>
        {commentsDataWithCommenterName.map((commentDataWithCommenterData) => (
          <CommentCard
            key={commentDataWithCommenterData._id}
            commentData={commentDataWithCommenterData}
            reviewUserData={reviewUserData}
            currentUserData={currentUserData}
            parentCommentData={parentCommentData}
          />
        ))}
      </div>
    );

  return (
    <div className="border-l border-gray-300 ml-4 pl-4">
      {commentsDataWithCommenterName.map((commentDataWithCommenterData) => (
        <CommentCard
          key={commentDataWithCommenterData._id}
          commentData={commentDataWithCommenterData}
          reviewUserData={reviewUserData}
          currentUserData={currentUserData}
          parentCommentData={parentCommentData}
        />
      ))}
    </div>
  );
}
