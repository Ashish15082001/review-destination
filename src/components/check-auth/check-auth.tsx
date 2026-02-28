import { isUserAthenticated } from "@/lib/isUserAthenticated";
import { redirect } from "next/navigation";

/**
 * A server component that conditionally renders its children based on the user's authentication status.
 *
 * @param children - The content to render when the authentication condition is met.
 * @param fallback - Optional custom component to display instead of redirecting when the authentication condition is not met.
 * @param visibility - Controls when children are rendered:
 *   - `"public-only"` — Renders children only if the user is **not** authenticated. Redirects authenticated users to `/`.
 *   - `"private-only"` — Renders children only if the user **is** authenticated. Redirects unauthenticated users to `/auth?mode=signin`.
 *   - `"public"` — Renders children regardless of authentication status.
 *
 * @returns The children, the fallback, or a redirect response.
 */
export default async function CheckAuth({
  children,
  fallback,
  visibility,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  visibility: "public-only" | "private-only" | "public";
}) {
  const isUserAuthenticated = await isUserAthenticated();

  // If visibility is private-only and user is not authenticated, show fallback if provided, otherwise redirect to sign-in page
  if (visibility === "private-only" && !isUserAuthenticated) {
    if (fallback) {
      return fallback;
    }
    return redirect("/auth?mode=signin");
  }

  // If visibility is public-only and user is authenticated, show fallback if provided, otherwise redirect to home page
  if (visibility === "public-only" && isUserAuthenticated) {
    if (fallback) {
      return fallback;
    }

    return redirect("/");
  }

  return children;
}
