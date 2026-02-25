import { getReviewsData } from "@/lib/mongodb";
import { ReviewCard } from "@/components/review-card/review-card";

export const metadata = {
  title: "Travel Reviews - Share Your Experiences",
  description:
    "Discover amazing destinations through travelers' experiences. Read and share reviews of your favorite travel spots.",
};

export default async function ReviewsPage() {
  const reviewsData = await getReviewsData();

  if (reviewsData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            No Reviews Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Be the first to share your travel experience!
          </p>
          <a
            href="/add-review"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Your Review
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Travel Reviews
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing destinations through travelers&apos; experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.map((reviewData) => (
            <ReviewCard key={reviewData._id} reviewData={reviewData} />
          ))}
        </div>
      </div>
    </div>
  );
}
