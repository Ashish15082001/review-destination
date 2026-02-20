import { getUserDataByUserId } from "@/lib/mongodb";

export async function UserInfo({ userId }: { userId: string }) {
  const userData = await getUserDataByUserId({ userId });

  if (!userData) return null;

  return <span className="font-medium">{userData.userName}</span>;
}
