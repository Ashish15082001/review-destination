import { isUserAthenticated } from "@/lib/isUserAthenticated";
import { redirect } from "next/navigation";

export default async function CheckAuth({
  children,
  fallback,
  isLoginRequired = false,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isLoginRequired?: boolean;
}) {
  const isUserAuthenticated = await isUserAthenticated();

  // If login is required and user is not authenticated, show fallback if provided, otherwise redirect to sign-in page
  if (isLoginRequired && !isUserAuthenticated) {
    if (fallback) {
      return fallback;
    }
    return redirect("/auth?mode=signin");
  }

  return children;
}
