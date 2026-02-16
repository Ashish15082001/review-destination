"use server";

import signOutUser from "@/actions/sign-out";
import { isUserAthenticated } from "@/lib/isUserAthenticated";
import Link from "next/link";

export default async function Navbar() {
  const isUserAuthenticated = await isUserAthenticated();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">RD</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">
            Review Destination
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/about"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            About
          </Link>
          <Link
            href="/reviews"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Reviews
          </Link>
          <Link
            href="/add-review"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Add Review
          </Link>
          {isUserAuthenticated && (
            <Link
              href="/profile"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Profile
            </Link>
          )}

          {isUserAuthenticated ? (
            <form action={signOutUser}>
              <button
                type="submit"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Sign Out
              </button>
            </form>
          ) : (
            <Link
              href="/auth"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
