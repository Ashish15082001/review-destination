import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Destination - Share Your Travel Experiences",
  description:
    "People can review any destination they visited. This will help others to plan accordingly before visiting there.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  console.log("############## rendering root layout (public) ##############");
  return children;
}
