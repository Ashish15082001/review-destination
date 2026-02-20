import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getReviewData, getUserDataByUserId } from "@/lib/mongodb";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reviewData = await getReviewData(id);
  const userData = await getUserDataByUserId({ userId: reviewData.userId });

  if (!reviewData || !userData) {
    notFound();
  }

  console.log("[id]/@children/default.tsx");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href={`/review/${id}/comments`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          go to comments
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Image */}
          <Link href={`/review/${id}/photo`}>
            <div className="relative h-96 w-full">
              <Image
                src={reviewData.destinationPhotoUrls[0]}
                alt={reviewData.destinationName}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {reviewData.destinationName}
              </h1>
              <div className="flex items-center text-gray-600 space-x-4">
                <span className="font-medium">{userData.userName}</span>
                <span>•</span>
                <span>Visited: {reviewData.whenVisited}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {reviewData.description}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Experience
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {reviewData.experience}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
