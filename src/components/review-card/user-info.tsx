import { getUserDataByUserId } from "@/lib/mongodb";
import { UserAvatar } from "../user-avatar/user-avatar";

export async function UserInfo({
  userId,
  date,
}: {
  userId: string;
  date: string;
}) {
  const userData = await getUserDataByUserId({ userId });

  if (!userData) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <UserAvatar
        userName={userData.userName}
        imageSrc={userData.profilePictureUrl}
      />
      {/* Name + Date */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">
          {userData.userName}
        </span>
        <span className="text-xs text-[#853853] tracking-wide">{date}</span>
      </div>
    </div>
  );
}
