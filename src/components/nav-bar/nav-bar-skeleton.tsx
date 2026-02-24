export default function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-44 h-7 bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Nav items */}
        <div className="flex items-center space-x-6">
          {/* About */}
          <div className="w-12 h-5 bg-gray-200 rounded-md animate-pulse" />
          {/* Reviews */}
          <div className="w-16 h-5 bg-gray-200 rounded-md animate-pulse" />
          {/* Add Review button */}
          <div className="w-28 h-9 bg-gray-200 rounded-lg animate-pulse" />
          {/* Profile */}
          <div className="w-14 h-5 bg-gray-200 rounded-md animate-pulse" />
          {/* Sign In / Sign Out */}
          <div className="w-16 h-5 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </nav>
  );
}
