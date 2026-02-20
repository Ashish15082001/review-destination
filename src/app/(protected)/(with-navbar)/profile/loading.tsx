export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
      <div className="max-w-md mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Avatar Skeleton */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-full" />
          </div>

          {/* User Information */}
          <div className="text-center">
            {/* Name Skeleton */}
            <div className="h-9 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-2/3 mx-auto mb-2" />

            {/* User Details */}
            <div className="mt-8 space-y-6">
              {/* Username box */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-1/4 mb-2" />
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-1/2" />
              </div>

              {/* Member Since box */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-1/3 mb-2" />
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
