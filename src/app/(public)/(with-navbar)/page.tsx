import LottieAnimation from "@/components/lottie-animation/lottie-animation";
import FeatureCard from "@/components/feature-card/feature-card";
import { Link } from "react-transition-progress/next";
import Silk from "@/components/Silk";
import RecentReviewsSection from "@/components/recent-reviews/recent-reviews-section";

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F4]">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[680px] w-full flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <Silk speed={10} scale={1} color="#7B7481" noiseIntensity={1.5} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#853853]/60 to-[#612D53]/70" />
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
      <section className="px-6 lg:px-20 py-20 bg-[#F3F4F4]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-800 mb-4">
            Why Review Destination?
          </h2>
          <div className="h-1.5 w-16 bg-[#853853] rounded-full mx-auto mb-6" />
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Everything you need to plan your next adventure with confidence.
            Join a community of explorers sharing real insights.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          <FeatureCard
            animationType="customerReview"
            title="Browse Reviews"
            description="Explore a public feed of authentic travel experiences and hidden gems shared by real people. Get the truth before you book."
          />
          <div className="md:translate-y-4">
            <FeatureCard
              animationType="deliveryLocation"
              title="Any Destination"
              description="From hidden gems to popular tourist spots, share reviews for any destination around the world. No city is too small."
            />
          </div>
          <FeatureCard
            animationType="creativeTeam"
            title="Plan & Save"
            description="Bookmark your favourite destinations and create custom itineraries for your future travels. Collaborative planning made easy."
          />
        </div>
      </section>

      {/* ── Recent Reviews ── */}
      <RecentReviewsSection />

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
        <div className="relative overflow-hidden rounded-3xl p-16 text-white max-w-5xl mx-auto shadow-2xl">
          <div className="absolute inset-0">
            <Silk speed={10} scale={1} color="#7B7481" noiseIntensity={1.5} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#853853]/80 to-[#612D53]/80" />
          <div className="relative z-10">
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
