export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto px-6 py-12">
        {/* Back Button Skeleton */}
        <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Image Skeleton */}
          <div className="relative h-96 w-full bg-gray-300 animate-pulse"></div>

          {/* Content Skeleton */}
          <div className="p-8 md:p-12">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
              <div className="flex items-center space-x-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="mb-8">
              <div className="h-7 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>

            {/* Experience Skeleton */}
            <div className="mb-8">
              <div className="h-7 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>

            {/* Famous Locations Skeleton */}
            <div>
              <div className="h-7 bg-gray-200 rounded w-56 mb-3 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
