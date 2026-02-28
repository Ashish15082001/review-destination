import { getCommentsDataByReviewId, getUserDataByUserId } from "@/lib/mongodb";
import { CommentCard } from "@/components/comment-card/comment-card";

export async function Comments({ reviewId }: { reviewId: string }) {
  const commentsData = await getCommentsDataByReviewId({ reviewId });

  if (!commentsData || commentsData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
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
    <div className="flex flex-col gap-3">
      {commentsWithUsers.map(({ commentData, commenterName }) => (
        <CommentCard
          key={commentData._id}
          commentData={commentData}
          commenterName={commenterName}
        />
      ))}
    </div>
  );
}
