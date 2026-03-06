import signOutUser from "@/actions/sign-out";
import { Link } from "react-transition-progress/next";
import CheckAuth from "../check-auth/check-auth";
import { Suspense } from "react";
import { AuthMode } from "@/lib/auth-mode";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-[#853853]/10 px-6 py-4 lg:px-20 bg-white">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="size-8 flex items-center justify-center bg-[#853853] rounded-lg text-white">
          <span className="material-symbols-outlined text-xl leading-none">
            explore
          </span>
        </div>
        <span className="text-[#2C2C2C] text-xl font-bold leading-tight tracking-tight">
          Review Destination
        </span>
      </Link>

      {/* Right side */}
      <div className="flex flex-1 justify-end gap-8 items-center">
        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/reviews"
            className="text-[#2C2C2C] text-sm font-semibold hover:text-[#853853] transition-colors"
          >
            Explore Reviews
          </Link>

          <Suspense fallback={null}>
            <CheckAuth visibility={"private-only"} fallback={null}>
              <Link
                href="/profile"
                className="text-[#2C2C2C] text-sm font-semibold hover:text-[#853853] transition-colors"
              >
                Profile
              </Link>
            </CheckAuth>
          </Suspense>
        </nav>

        {/* Action buttons */}
        <div className="flex gap-3">
          {/* Ghost login / sign-out button */}
          <Suspense
            fallback={
              <div className="w-20 h-10 bg-[#F3F4F4] rounded-lg animate-pulse" />
            }
          >
            <CheckAuth visibility={"private-only"} fallback={null}>
              <form action={signOutUser}>
                <button
                  type="submit"
                  className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#F3F4F4] text-[#2C2C2C] text-sm font-bold border border-[#853853]/10 hover:border-[#853853]/30 transition-all"
                >
                  Sign Out
                </button>
              </form>
            </CheckAuth>
          </Suspense>

          {/* Primary add-review / get-started button */}
          <Suspense
            fallback={
              <div className="w-28 h-10 bg-[#853853]/20 rounded-lg animate-pulse" />
            }
          >
            <CheckAuth
              visibility={"private-only"}
              fallback={
                <Link
                  href={`/auth?mode=${AuthMode.SIGN_IN}`}
                  className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#853853] text-white text-sm font-bold hover:bg-[#612D53] transition-all shadow-md"
                >
                  Get Started
                </Link>
              }
            >
              <Link
                href="/add-review"
                className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#853853] text-white text-sm font-bold hover:bg-[#612D53] transition-all shadow-md"
              >
                Add Review
              </Link>
            </CheckAuth>
          </Suspense>
        </div>
      </div>
    </header>
  );
}
