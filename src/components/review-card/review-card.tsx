import Image from "next/image";
import Link from "next/link";
import { ReviewData } from "@/schema/review";
import { UserInfo } from "./user-info";
import { Suspense } from "react";
import { UserInfoSkeleton } from "./user-info-skeleton";
import { ReviewStats } from "../review-stats/review-stats";
import { ReviewStatsSkeleton } from "../review-stats/review-stats-skeleton";

export async function ReviewCard({ reviewData }: { reviewData: ReviewData }) {
  return (
    <Link href={`/review/${reviewData._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.05] transition-all duration-300">
        {/* Destination Image */}
        <div className="relative h-60 w-full bg-gray-200">
          <Image
            src={reviewData.destinationPhotoUrls[0]}
            alt={reviewData.destinationName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* reciew stats */}
          <div className="flex items-center space-x-4 mb-4">
            <Suspense fallback={<ReviewStatsSkeleton />}>
              <ReviewStats reviewId={reviewData._id} />
            </Suspense>
          </div>

          {/* Destination Name */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {reviewData.destinationName}
          </h2>

          {/* User and date posted on */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <Suspense fallback={<UserInfoSkeleton />}>
              <UserInfo userId={reviewData.userId} />
            </Suspense>
            <span>
              {new Date(reviewData.datePosted)
                .toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
                .toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
