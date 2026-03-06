import { CommentData } from "@/schema/comment";
import { CommentActions } from "../comment-actions/comment-actions";
import { UserAvatar } from "../user-avatar/user-avatar";

interface CommentCardProps {
  commentData: CommentData;
  commenterName: string;
  currentUserId: string | null;
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
  commenterName,
  currentUserId,
}: CommentCardProps) {
  const relativeTime = getRelativeTime(commentData.commentedOn);

  // generate a consistent color from the name
  const colors = [
    "bg-[#853853]",
    "bg-[#612D53]",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  const colorIndex = commenterName.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <div className="p-4 flex gap-3">
      {/* Avatar */}
      <UserAvatar userName={commenterName} className={avatarColor} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900">
            {commenterName}
          </span>
          <span className="text-xs text-gray-400">{relativeTime}</span>
        </div>

        <p className={`text-sm text-gray-600 leading-relaxed `}>
          {commentData.comment}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-3">
          <CommentActions
            commentData={commentData}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}
