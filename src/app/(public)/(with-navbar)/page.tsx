import LottieAnimation from "@/components/lottie-animation";
import WhyReviewDestinationCard from "@/components/why-review-destination-card";
import { Link } from "react-transition-progress/next";
import { ReviewCard } from "@/components/review-card/review-card";
import { ReviewCardSkeleton } from "@/components/review-card/review-card-skeleton";
import { getMostRecentReviews } from "@/lib/mongodb";
import { Suspense } from "react";

async function RecentReviews() {
  const reviews = await getMostRecentReviews();
  return (
    <>
      {reviews.map((review) => (
        <ReviewCard key={review._id} reviewData={review} />
      ))}
    </>
  );
}

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F4]">
      {/* ── Hero ── */}
      <section
        className="relative flex min-h-[680px] w-full flex-col items-center justify-center p-6 text-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(133,56,83,0.72), rgba(97,45,83,0.80)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&auto=format&fit=crop')",
        }}
      >
        <div className="flex flex-col gap-8 max-w-4xl z-10">
          <h1 className="text-white text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl drop-shadow-2xl">
            Review. Plan. Explore.
          </h1>
          <p className="text-white/90 text-xl font-medium leading-relaxed lg:text-2xl px-4 max-w-2xl mx-auto drop-shadow-md">
            Help travelers make informed decisions by reading authentic,
            first-hand reviews from our global community.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/reviews"
              className="min-w-[180px] bg-[#853853] hover:bg-[#612D53] text-white py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-2xl hover:scale-105 active:scale-95 text-center"
            >
              Start Exploring
            </Link>
            <Link
              href="/add-review"
              className="min-w-[180px] bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-2xl text-center"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </section>

      {/* ── Core Features ── */}
      <section className="px-6 lg:px-20 py-20 bg-white">
        <div className="flex flex-col gap-4 mb-16 text-center items-center">
          <h2 className="text-neutral-800 text-3xl font-bold lg:text-4xl">
            Why Review Destination?
          </h2>
          <div className="h-1.5 w-20 bg-[#853853] rounded-full" />
          <p className="text-neutral-500 text-lg max-w-2xl">
            Everything you need to plan your next adventure with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <WhyReviewDestinationCard
            animationType="customerReview"
            title="Browse Reviews"
            description="Explore a public feed of authentic travel experiences and hidden gems shared by real people."
          />
          <WhyReviewDestinationCard
            animationType="deliveryLocation"
            title="Any Destination"
            description="From hidden gems to popular tourist spots, share reviews for any destination around the world."
          />
          <WhyReviewDestinationCard
            animationType="creativeTeam"
            title="Plan & Save"
            description="Bookmark your favourite destinations and create custom itineraries for your future travels."
          />
        </div>
      </section>

      {/* ── Recent Reviews ── */}
      <section className="px-6 lg:px-20 py-20">
        <div className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
          <h2 className="text-neutral-800 text-3xl font-bold tracking-tight">
            Recent Stories from the Community
          </h2>
          <Link
            href="/reviews"
            className="text-[#853853] font-bold flex items-center gap-1 hover:underline shrink-0"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <Suspense
            fallback={
              <>
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
              </>
            }
          >
            <RecentReviews />
          </Suspense>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 lg:px-20 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-neutral-800 mb-4">
          How It Works
        </h2>
        <div className="h-1.5 w-20 bg-[#853853] rounded-full mx-auto mb-16" />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-6">
              <LottieAnimation animationType="firstPlaceBadge" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-3">
              Explore Destinations
            </h3>
            <p className="text-neutral-500">
              Browse through reviews of destinations worldwide and find your
              next adventure.
            </p>
          </div>
          <div className="text-center">
            <div className="w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-6">
              <LottieAnimation animationType="secondPlaceBadge" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-3">
              Share Your Experience
            </h3>
            <p className="text-neutral-500">
              Write detailed reviews about places you&apos;ve visited and share
              your insights.
            </p>
          </div>
          <div className="text-center">
            <div className="w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-6">
              <LottieAnimation animationType="thirdPlaceBadge" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-3">
              Help Others Plan
            </h3>
            <p className="text-neutral-500">
              Your reviews help fellow travelers make informed decisions and
              plan better trips.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 lg:px-20 py-20 text-center">
        <div className="bg-gradient-to-r from-[#853853] to-[#612D53] rounded-3xl p-16 text-white max-w-5xl mx-auto shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Share Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of travelers and start sharing your experiences
            today.
          </p>
          <Link
            href="/add-review"
            className="inline-block bg-white text-[#853853] px-10 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            Write Your First Review
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white px-6 lg:px-20 py-16 border-t border-[#853853]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-[#853853] font-extrabold text-xl mb-4">
              Review Destination
            </p>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Empowering travelers around the world through shared experiences
              and community insights. Join us and share your journey.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-neutral-800">Explore</h4>
            <ul className="text-sm text-neutral-500 space-y-3">
              <li>
                <Link
                  href="/reviews"
                  className="hover:text-[#853853] transition-colors"
                >
                  All Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#853853] transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-neutral-800">Account</h4>
            <ul className="text-sm text-neutral-500 space-y-3">
              <li>
                <Link
                  href="/auth"
                  className="hover:text-[#853853] transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/add-review"
                  className="hover:text-[#853853] transition-colors"
                >
                  Write a Review
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-neutral-800">Tech Stack</h4>
            <div className="flex flex-col gap-2 text-sm text-neutral-500 font-semibold">
              <span>Next.js</span>
              <span>MongoDB</span>
              <span>Cloudinary</span>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-[#853853]/5 text-center text-xs text-neutral-400">
          © 2026 Review Destination. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
