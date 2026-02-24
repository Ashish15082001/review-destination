import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ProgressBar, ProgressBarProvider } from "react-transition-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Review Destination - Share Your Travel Experiences",
  description:
    "People can review any destination they visited. This will help others to plan accordingly before visiting there.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBarProvider>
          {/* I.e. using Tailwind CSS to show the progress bar with custom styling */}
          <ProgressBar className="fixed z-60 h-2 shadow-lg shadow-sky-500/20 bg-sky-500 top-0" />
          {children}
        </ProgressBarProvider>
      </body>
    </html>
  );
}
