import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Fragment } from "react/jsx-runtime";

export const metadata: Metadata = {
  title: "Review Destination - Share Your Travel Experiences",
  description:
    "People can review any destination they visited. This will help others to plan accordingly before visiting there.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  console.log("############## rendering root layout (public) ##############");
  return (
    <Fragment>
      {children}

      <Toaster />
    </Fragment>
  );
}
