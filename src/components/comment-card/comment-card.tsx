import { CommentData } from "@/schema/comment";

interface CommentCardProps {
  commentData: CommentData;
  commenterName: string;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function CommentCard({ commentData, commenterName }: CommentCardProps) {
  const initials = commenterName.slice(0, 2).toUpperCase();
  const relativeTime = getRelativeTime(commentData.commentedOn);

  // generate a consistent color from the name
  const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];
  const colorIndex = commenterName.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-3">
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 select-none`}>
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900">{commenterName}</span>
          <span className="text-xs text-gray-400">{relativeTime}</span>
        </div>

        <p className="text-sm text-gray-600 italic leading-relaxed">{commentData.comment}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-3">
          <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors text-xs cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          </button>
          <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
              <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
          </button>
          <button className="text-xs text-gray-400 hover:text-blue-500 transition-colors font-medium cursor-pointer">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
