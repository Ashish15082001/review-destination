import Image from "next/image";
import { Link } from "react-transition-progress/next";
import { ReviewData } from "@/schema/review";
import { UserInfo } from "./user-info";
import { Suspense } from "react";
import { UserInfoSkeleton } from "./user-info-skeleton";
import { ReviewStats } from "../review-stats/review-stats";
import { ReviewStatsSkeleton } from "../review-stats/review-stats-skeleton";

export async function ReviewCard({ reviewData }: { reviewData: ReviewData }) {
  const formattedDate = reviewData.datePosted
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Destination Image */}
      <div className="relative h-64 w-full bg-gray-200">
        <Image
          src={reviewData.destinationPhotoUrls[0]}
          alt={reviewData.destinationName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Bookmark Icon */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-gray-800/70 rounded-full flex items-center justify-center text-white hover:bg-gray-800/90 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Card Content */}
      <div className="px-6 pt-5 pb-4">
        {/* User Info + Date */}
        <div className="flex items-center gap-3 mb-4">
          <Suspense fallback={<UserInfoSkeleton />}>
            <UserInfo userId={reviewData.userId} date={formattedDate} />
          </Suspense>
        </div>
        {/* Destination Name */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {reviewData.destinationName}
        </h2>
        {/* Description Excerpt */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {reviewData.description}
        </p>

        {/* Bottom Bar: Stats + Read Story */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Suspense fallback={<ReviewStatsSkeleton />}>
              <ReviewStats reviewId={reviewData._id} />
            </Suspense>
          </div>
          <Link
            href={`/review/${reviewData._id}`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 tracking-wide uppercase"
          >
            Read Story
          </Link>
        </div>
      </div>
    </div>
  );
}
