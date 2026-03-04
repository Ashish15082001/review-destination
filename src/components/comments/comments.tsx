import {
  getCommentsDataByReviewId,
  getUserDataByUserId,
  getUserDataUsingSession,
} from "@/lib/mongodb";
import { CommentCard } from "@/components/comment-card/comment-card";

export async function Comments({ reviewId }: { reviewId: string }) {
  const commentsData = await getCommentsDataByReviewId({ reviewId });
  const currentUserData = await getUserDataUsingSession();

  if (!commentsData || commentsData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Comments</h2>
        <p className="text-gray-400 text-sm text-center">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  const commentsWithUsers = await Promise.all(
    commentsData.map(async (commentData) => {
      const userData = await getUserDataByUserId({
        userId: commentData.commentedBy,
      });
      return { commentData, commenterName: userData?.userName ?? "Unknown" };
    }),
  );

  return (
    <div className="flex flex-col gap-3 bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Comments</h2>
      {commentsWithUsers.map(({ commentData, commenterName }) => (
        <CommentCard
          key={commentData._id}
          commentData={commentData}
          commenterName={commenterName}
          currentUserId={currentUserData?._id ?? null}
        />
      ))}
    </div>
  );
}
