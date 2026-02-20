import type { Metadata } from "next";
import BackButtonHeader from "@/components/back-button-header";

export const metadata: Metadata = {
  title: "Review Destination - Share Your Travel Experiences",
  description:
    "People can review any destination they visited. This will help others to plan accordingly before visiting there.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <BackButtonHeader />
      {children}
    </>
  );
}
