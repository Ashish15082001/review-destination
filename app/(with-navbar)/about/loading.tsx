export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-3/4 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-2/3 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-3">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex gap-4">
                <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Cards Skeleton */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="w-64 h-12 bg-gray-200 rounded-lg animate-pulse mx-auto mb-12"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="w-48 h-12 bg-gray-200 rounded-lg animate-pulse mx-auto mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-full h-4 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
            <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Skills Section Skeleton */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="w-64 h-12 bg-gray-200 rounded-lg animate-pulse mx-auto mb-12"></div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="w-40 h-8 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div
                      key={j}
                      className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-16 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Skeleton */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-64 h-12 bg-gray-700 rounded-lg animate-pulse mx-auto mb-6"></div>
          <div className="w-96 h-8 bg-gray-700 rounded-lg animate-pulse mx-auto mb-8"></div>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-40 h-12 bg-gray-700 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
