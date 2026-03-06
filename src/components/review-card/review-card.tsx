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
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Destination Image */}
      <div className="relative h-52 w-full bg-gray-200 shrink-0 overflow-hidden">
        <Image
          src={reviewData.destinationPhotoUrls[0]}
          alt={reviewData.destinationName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Card Content */}
      <div className="px-5 pt-4 pb-4 flex flex-col flex-1">
        {/* User Info + Date */}
        <div className="flex items-center gap-3 mb-3">
          <Suspense fallback={<UserInfoSkeleton />}>
            <UserInfo userId={reviewData.userId} date={formattedDate} />
          </Suspense>
        </div>

        {/* Description Excerpt */}
        <p className={`text-sm text-gray-500 line-clamp-2 mb-4 flex-1`}>
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
            className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
