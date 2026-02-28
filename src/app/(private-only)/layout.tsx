import CheckAuth from "@/components/check-auth/check-auth";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Review Destination - Share Your Travel Experiences",
  description:
    "People can review any destination they visited. This will help others to plan accordingly before visiting there.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense>
      <CheckAuth visibility="private-only">{children}</CheckAuth>
    </Suspense>
  );
}
