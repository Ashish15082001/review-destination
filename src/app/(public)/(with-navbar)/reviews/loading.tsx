import { ReviewCardSkeleton } from "@/components/review-card/review-card-skeleton";

export default function Loading() {
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
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <ReviewCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
