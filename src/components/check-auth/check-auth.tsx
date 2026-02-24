import { isUserAthenticated } from "@/lib/isUserAthenticated";
import { redirect } from "next/navigation";

export default async function CheckAuth({
  children,
  isLoginRequired = false,
}: {
  children: React.ReactNode;
  isLoginRequired?: boolean;
}) {
  const isUserAuthenticated = await isUserAthenticated();

  if (isLoginRequired && !isUserAuthenticated)
    return redirect("/auth?mode=signin");

  return children;
}
