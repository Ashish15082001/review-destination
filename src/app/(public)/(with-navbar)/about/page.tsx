import { Metadata } from "next";
import { Link } from "react-transition-progress/next";

export const metadata: Metadata = {
  title: "About | Review Destination",
  description:
    "Learn about Review Destination - your trusted platform for authentic travel reviews and destination guides.",
};

export default async function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm">
                🌟 Welcome to
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Review Destination
              </h1>
              <p className="text-2xl text-gray-600">
                Your Trusted Travel Review Platform
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Discover authentic travel experiences through detailed reviews
                and honest insights. We help travelers make informed decisions
                about their next adventure with real, unbiased destination
                reviews.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/reviews"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Explore Reviews
                </Link>
                <Link
                  href="/add-review"
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Add Your Review
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-white text-6xl">🌍</div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Authentic Reviews
              </h3>
              <p className="text-gray-700">
                Real experiences from real travelers. Every review on our
                platform is genuine, helping you make informed decisions about
                your next destination.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Destination Guides
              </h3>
              <p className="text-gray-700">
                Comprehensive guides covering attractions, activities,
                accommodations, and local insights to help you plan your perfect
                trip.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Community Driven
              </h3>
              <p className="text-gray-700">
                Join a community of passionate travelers sharing their
                experiences, tips, and recommendations to inspire your next
                adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Mission
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Review Destination was created to provide travelers with honest,
              detailed, and helpful reviews of destinations around the world. We
              believe that the best travel advice comes from people who have
              actually been there.
            </p>
            <p>
              Our platform connects travelers with authentic experiences, free
              from commercial bias and marketing hype. Whether you're planning a
              weekend getaway or a month-long adventure, we're here to help you
              discover destinations that match your interests and travel style.
            </p>
            <p>
              We're committed to building a community where every traveler's
              voice matters, and where sharing experiences helps others create
              unforgettable memories.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Unbiased Reviews
                </h3>
                <p className="text-gray-700">
                  No sponsored content or paid placements. Every review reflects
                  genuine experiences and honest opinions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Detailed Information
                </h3>
                <p className="text-gray-700">
                  Comprehensive reviews covering all aspects of each
                  destination, from attractions to local culture and practical
                  tips.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Easy to Use
                </h3>
                <p className="text-gray-700">
                  Clean, intuitive interface that makes it simple to find the
                  information you need and plan your perfect trip.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Growing Community
                </h3>
                <p className="text-gray-700">
                  Connect with fellow travelers, share your experiences, and get
                  inspired for your next adventure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 font-semibold">
                Destinations Reviewed
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-purple-600">1000+</div>
              <div className="text-gray-600 font-semibold">User Reviews</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-green-600">50+</div>
              <div className="text-gray-600 font-semibold">
                Countries Covered
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-orange-600">5K+</div>
              <div className="text-gray-600 font-semibold">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Journey Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore thousands of destination reviews or share your own travel
            experiences with our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/reviews"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Browse Destinations
            </Link>
            <Link
              href="/add-review"
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
