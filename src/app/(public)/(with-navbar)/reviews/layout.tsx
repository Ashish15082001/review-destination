export default function HomeLayout({ children }: LayoutProps<"/reviews">) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Reviews List */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
