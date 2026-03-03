import { getReviewsData } from "@/lib/mongodb";
import { ReviewCard } from "@/components/review-card/review-card";
import { Link } from "react-transition-progress/next";

export const metadata = {
  title: "Travel Reviews - Share Your Experiences",
  description:
    "Discover amazing destinations through travelers' experiences. Read and share reviews of your favorite travel spots.",
};

const CATEGORY_FILTERS = [
  "All",
  "Beaches",
  "Mountains",
  "Cities",
  "Countryside",
  "Islands",
  "Cultural",
];

export default async function ReviewsPage() {
  const reviewsData = await getReviewsData({
    pageSize: 10,
  });

  return (
    <div className="min-h-screen ">
      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter Pills */}
        {/* <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORY_FILTERS.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                i === 0
                  ? "bg-[#853853] text-white border-[#853853] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#853853] hover:text-[#853853]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div> */}

        {reviewsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {/* Illustration container */}
            <div
              className="relative flex items-center justify-center w-full aspect-video max-w-lg mx-auto mb-10 rounded-3xl overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(13, 127, 242, 0.08) 0%, transparent 70%)",
              }}
            >
              {/* Background map icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span
                  className="material-symbols-outlined select-none text-[#853853]"
                  style={{ fontSize: 200 }}
                >
                  map
                </span>
              </div>
              {/* Foreground icons */}
              <div className="relative z-10 flex flex-col items-center">
                <span
                  className="material-symbols-outlined text-[#853853]/60 mb-2"
                  style={{ fontSize: 120 }}
                >
                  person_pin_circle
                </span>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-4xl text-slate-300">
                    terrain
                  </span>
                  <span className="material-symbols-outlined text-4xl text-slate-300">
                    forest
                  </span>
                  <span className="material-symbols-outlined text-4xl text-slate-300">
                    hiking
                  </span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                No stories yet
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium max-w-md mx-auto">
                The trail is empty, but your memories aren&apos;t. Be the first
                to share your journey!
              </p>
            </div>

            {/* CTA button */}
            <Link
              href="/add-review"
              className="group relative inline-flex items-center gap-3 text-white px-10 py-5 rounded-2xl text-lg font-extrabold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              style={{
                backgroundColor: "#853853",
                boxShadow: "0 20px 40px rgba(133,56,83,0.25)",
              }}
            >
              <span className="material-symbols-outlined text-2xl">
                add_circle
              </span>
              Share Your Experience
              {/* Animated ping badge */}
              <span className="absolute -top-3 -right-3 flex h-6 w-6">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: "#853853" }}
                />
                <span
                  className="relative inline-flex rounded-full h-6 w-6 border-2 border-white"
                  style={{ backgroundColor: "#853853" }}
                />
              </span>
            </Link>

            <p className="mt-8 text-sm text-slate-400 font-medium">
              Need inspiration?{" "}
              <a
                href="/about"
                className="hover:underline"
                style={{ color: "#853853" }}
              >
                Browse our destination guides
              </a>
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {reviewsData.length}
                </span>{" "}
                travel stories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsData.map((reviewData) => (
                <ReviewCard key={reviewData._id} reviewData={reviewData} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
