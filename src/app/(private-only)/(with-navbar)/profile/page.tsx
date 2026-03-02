import {
  getUserDataUsingSession,
  getUserStats,
  getReviewsByIds,
  getReviewsDataByUserId,
} from "@/lib/mongodb";
import Link from "next/link";
import { ReviewCard } from "@/components/review-card/review-card";
import { Suspense } from "react";
import { ReviewCardSkeleton } from "@/components/review-card/review-card-skeleton";

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab === "saved" ? "saved" : "my-reviews";

  const [userData, userStats] = await Promise.all([
    getUserDataUsingSession(),
    getUserStats(),
  ]);

  if (!userData) throw new Error("User Not Found!");

  const reviews =
    activeTab === "saved"
      ? await getReviewsByIds(userData.savedReviewesIds)
      : await getReviewsDataByUserId(userData._id);

  // Get initials from userName
  const initials = userData.userName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(userData.registeredAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl">
        {/* ── Cover Banner ────────────────────────────────────────── */}
        <div className="relative h-52 md:h-64 w-full overflow-hidden md:rounded-b-2xl bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* ── Avatar + Name ────────────────────────────────────────── */}
        <div className="-mt-14 relative z-10 flex flex-col items-center px-4">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
            <span className="text-4xl md:text-5xl font-bold text-white select-none">
              {initials}
            </span>
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {userData.userName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{userData.email}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Member since {memberSince}
            </p>
          </div>

          {/* ── Stats Cards ───────────────────────────────────────── */}
          {userStats && (
            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Activity Overview */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Activity Overview
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xl font-bold text-amber-500">
                      {formatCount(userStats.reviews.posted)}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Reviews
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-amber-500">
                      {formatCount(userData.savedReviewesIds.length)}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Saved
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Impact */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Review Impact
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xl font-bold text-slate-800">
                      {formatCount(userStats.reviews.posted)}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Posted
                    </p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-bold text-slate-800">
                        {formatCount(userStats.reviews.likesReceived)}
                      </p>
                      <svg
                        className="w-3 h-3 text-red-400 mb-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Likes Rcvd
                    </p>
                  </div>
                </div>
              </div>

              {/* Engagement */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Engagement
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      {formatCount(userStats.comments.posted)}
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      Comments
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      {formatCount(userStats.comments.likesReceived)}
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      Comm. Likes
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      {formatCount(
                        userStats.comments.likesGivenByMe +
                          userStats.comments.dislikesGivenByMe +
                          userStats.reviews.likedByMe,
                      )}
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      Interacted
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[9px] text-slate-400 font-medium uppercase italic">
                    Likes &amp; dislikes given across the platform
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Tabs ──────────────────────────────────────────────── */}
        <div className="mt-10 border-b border-slate-200 px-4 md:px-0">
          <div className="flex gap-8 max-w-fit mx-auto md:mx-4">
            <Link
              href="/profile?tab=my-reviews"
              className={`pb-4 border-b-2 text-sm font-bold flex items-center gap-2 transition-colors ${
                activeTab === "my-reviews"
                  ? "border-amber-400 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h2"
                />
              </svg>
              My Reviews
            </Link>
            <Link
              href="/profile?tab=saved"
              className={`pb-4 border-b-2 text-sm font-bold flex items-center gap-2 transition-colors ${
                activeTab === "saved"
                  ? "border-amber-400 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Saved Reviews
            </Link>
          </div>
        </div>

        {/* ── Reviews Grid ──────────────────────────────────────── */}
        <div className="p-4 md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-12">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-slate-400 text-sm font-medium">
                {activeTab === "saved"
                  ? "No saved reviews yet."
                  : "No reviews posted yet."}
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <Suspense key={review._id} fallback={<ReviewCardSkeleton />}>
                <ReviewCard reviewData={review} />
              </Suspense>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
