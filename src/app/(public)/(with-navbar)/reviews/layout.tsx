export default function HomeLayout({ children }: LayoutProps<"/reviews">) {
  return (
    <div className="min-h-screen bg-[#F3F4F4]">
      {/* Reviews List */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
