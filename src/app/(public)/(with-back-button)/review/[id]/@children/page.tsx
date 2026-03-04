import { notFound } from "next/navigation";
import Image from "next/image";
import { getReviewData, getUserDataByUserId } from "@/lib/mongodb";
import { ReviewStats } from "@/components/review-stats/review-stats";
import { Comments } from "@/components/comments/comments";
import { CommentForm } from "@/components/comment-form/comment-form";
import CheckAuth from "@/components/check-auth/check-auth";
import { UserAvatar } from "@/components/user-avatar/user-avatar";

export default async function ReviewPage({
  params,
}: PageProps<"/review/[id]">) {
  const { id } = await params;
  const reviewData = await getReviewData(id);

  if (!reviewData) {
    notFound();
  }

  const userData = await getUserDataByUserId({ userId: reviewData.userId });

  if (!userData) {
    notFound();
  }

  const formattedDate = reviewData.datePosted.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  console.log("[id]/@children/page.tsx");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl lg:max-w-7xl">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-6 lg:items-start">
          {/* Left column: Main Review Card + Experience Card */}
          <div>
            {/* Main Review Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-5">
              {/* Hero Image */}
              <div className="relative h-72 w-full">
                <Image
                  src={reviewData.destinationPhotoUrls[0]}
                  alt={reviewData.destinationName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-6">
                {/* Author Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      userName={userData.userName}
                      className="bg-[#853853]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {userData.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formattedDate} &bull; Visited: {reviewData.whenVisited}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {reviewData.destinationName}
                </h1>

                {/* Description excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {reviewData.description}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-5 border-t border-gray-100 pt-4">
                  <ReviewStats reviewId={id} />
                  {/* Share */}
                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Experience Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                Experience
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {reviewData.experience}
              </p>
            </div>
          </div>

          {/* Right column: Join the Conversation + Comments */}
          <div className="mt-5 lg:mt-0 lg:w-120">
            {/* Join the Conversation */}
            <CheckAuth visibility="private-only" fallback={null}>
              <div className="mb-5">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Join the conversation
                </h2>

                <CommentForm reviewId={id} />
              </div>
            </CheckAuth>

            {/* Comments */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Comments
              </h2>
              <Comments reviewId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
