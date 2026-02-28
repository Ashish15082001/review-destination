import { getUserDataByUserId } from "@/lib/mongodb";

export async function UserInfo({
  userId,
  date,
}: {
  userId: string;
  date: string;
}) {
  const userData = await getUserDataByUserId({ userId });

  if (!userData) return null;

  // Get initials for avatar
  const initials = userData.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-white text-sm font-semibold shrink-0">
        {initials}
      </div>
      {/* Name + Date */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">
          {userData.userName}
        </span>
        <span className="text-xs text-blue-500 tracking-wide">{date}</span>
      </div>
    </div>
  );
}
