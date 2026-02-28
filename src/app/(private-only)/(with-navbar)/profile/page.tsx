import { getUserDataUsingSession } from "@/lib/mongodb";

export default async function ProfilePage() {
  const userData = await getUserDataUsingSession();

  if (!userData) throw new Error("User Not Found!");

  // Get initials from userName
  const initials = userData.userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
      <div className="max-w-md mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{initials}</span>
            </div>
          </div>

          {/* User Information */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userData.userName}
            </h1>

            {/* User Details */}
            <div className="mt-8 space-y-6">
              {/* Username */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Username
                </p>
                <p className="text-lg text-gray-900">{userData.userName}</p>
              </div>

              {/* Registered Date */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Member Since
                </p>
                <p className="text-lg text-gray-900">
                  {new Date(userData.registeredAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
