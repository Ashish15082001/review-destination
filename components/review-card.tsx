import { ReviewDataFromMongoDB } from "@/schema/schema";
import Image from "next/image";
import Link from "next/link";
import { ReviewLikeButton } from "./review-like-button";

export function ReviewCard({ review }: { review: ReviewDataFromMongoDB }) {
  return (
    <Link href={`/review/${review._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.05] transition-all duration-300">
        {/* Destination Image */}
        <div className="relative h-60 w-full bg-gray-200">
          <Image
            src={review.destinationPhotoUrl}
            alt={review.destinationName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Destination Name */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {review.destinationName}
          </h2>

          {/* Review Title */}
          <h3 className="text-lg font-medium text-blue-400 mb-3">
            {review.review}
          </h3>

          {/* User and date posted on */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span className="font-medium">{review.userName}</span>
            <span>
              {new Date(review.datePosted)
                .toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
                .toLowerCase()}
            </span>
          </div>

          {/* Like button and count */}
          <ReviewLikeButton
            reviewId={review._id}
            totalLikes={review.totalLikes}
          />
        </div>
      </div>
    </Link>
  );
}
