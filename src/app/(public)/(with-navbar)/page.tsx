import LottieAnimation from "@/components/lottie-animation";
import WhyReviewDestinationCard from "@/components/why-review-destination-card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Share Your Travel
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Experiences
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          People can review any destination they visited. This will help others
          to plan accordingly before visiting there.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link
            href="/reviews"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Explore Reviews
          </Link>
          <Link
            href="/add-review"
            className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-purple-500 transition-all"
          >
            Write a Review
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Why Review Destination?
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <WhyReviewDestinationCard
            animationType={"customerReview"}
            title="Authentic Reviews"
            description="Read genuine experiences from real travelers who have been there.
              Make informed decisions based on honest feedback."
          />

          <WhyReviewDestinationCard
            animationType={"deliveryLocation"}
            title="Any Destination"
            description=" From hidden gems to popular tourist spots, share reviews for any
              destination around the world."
          />

          <WhyReviewDestinationCard
            animationType={"creativeTeam"}
            title="Community Driven"
            description="Join a community of travelers sharing their knowledge and helping
              each other plan better trips."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-20 bg-white rounded-3xl my-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-40 h-40  rounded-full flex items-center justify-center mx-auto mb-6">
              <LottieAnimation animationType="firstPlaceBadge" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Explore Destinations
            </h3>
            <p className="text-gray-600">
              Browse through reviews of destinations worldwide and find your
              next adventure.
            </p>
          </div>

          <div className="text-center">
            <div className="w-40 h-40  rounded-full flex items-center justify-center mx-auto mb-6">
              <LottieAnimation animationType="secondPlaceBadge" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Share Your Experience
            </h3>
            <p className="text-gray-600">
              Write detailed reviews about places you've visited and share your
              insights.
            </p>
          </div>

          <div className="text-center">
            <div className="w-40 h-40  rounded-full flex items-center justify-center mx-auto mb-6">
              <LottieAnimation animationType="thirdPlaceBadge" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Help Others Plan
            </h3>
            <p className="text-gray-600">
              Your reviews help fellow travelers make informed decisions and
              plan better trips.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-16 text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Share Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of travelers and start sharing your experiences
            today.
          </p>
          <Link
            href="/add-review"
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            Write Your First Review
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="mb-4">
            © 2026 Review Destination. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Link href="/about" className="hover:text-gray-900 transition">
              About Us
            </Link>
            <Link href="/reviews" className="hover:text-gray-900 transition">
              All Reviews
            </Link>
            <Link href="/add-review" className="hover:text-gray-900 transition">
              Add Review
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
