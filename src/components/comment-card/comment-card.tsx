import { CommentData } from "@/schema/comment";

interface CommentCardProps {
  commentData: CommentData;
  commenterName: string;
}

export function CommentCard({ commentData, commenterName }: CommentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Commenter name */}
      <p className="text-sm font-semibold text-gray-800">{commenterName}</p>

      {/* Comment */}
      <p className="text-gray-700 mt-2">{commentData.comment}</p>

      {/* Commented on date */}
      <p className="text-xs text-gray-400 mt-3">
        {commentData.commentedOn
          .toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          .toLowerCase()}
      </p>
    </div>
  );
}
