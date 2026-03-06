export default function Loading() {
  console.log("/review/[id]/loading.tsx");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl lg:max-w-7xl">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-6 lg:items-start">
          {/* Left column */}
          <div>
            {/* Main Review Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-5">
              {/* Hero Image */}
              <div className="h-72 w-full bg-gray-200 animate-pulse" />

              <div className="p-6">
                {/* Author Row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Title */}
                <div className="h-7 w-2/3 bg-gray-200 rounded mb-3 animate-pulse" />

                {/* Description excerpt */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-5 border-t border-gray-100 pt-4">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Experience Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="h-4 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="mt-5 lg:mt-0 lg:w-120">
            {/* Comments Skeleton */}
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3.5 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-3.5 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
