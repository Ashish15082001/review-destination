import type { Metadata } from "next";
import Navbar from "@/components/nav-bar/navbar";
import { Suspense } from "react";
import NavbarSkeleton from "@/components/nav-bar/nav-bar-skeleton";

export const metadata: Metadata = {
  title: "Review Destination - Share Your Travel Experiences",
  description:
    "People can review any destination they visited. This will help others to plan accordingly before visiting there.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      {children}
    </>
  );
}
