const Pulse = ({ className }: { className: string }) => (
  <div
    className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded ${className}`}
  />
);

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl">
        {/* Cover Banner */}
        <div className="relative h-52 md:h-64 w-full overflow-hidden md:rounded-b-2xl bg-slate-200 animate-pulse shadow-lg" />

        {/* Avatar + Name */}
        <div className="-mt-14 relative z-10 flex flex-col items-center px-4">
          {/* Avatar circle */}
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl bg-slate-200 animate-pulse shrink-0" />

          {/* Name / email / member since */}
          <div className="mt-4 flex flex-col items-center gap-2 w-full">
            <Pulse className="h-8 w-48" />
            <Pulse className="h-4 w-36" />
            <Pulse className="h-3 w-40" />
          </div>

          {/* Stats Cards */}
          <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
              >
                {/* Card title */}
                <Pulse className="h-3 w-32 mb-4" />
                {/* Two stat columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Pulse className="h-6 w-10" />
                    <Pulse className="h-2.5 w-16" />
                  </div>
                  <div className="space-y-1.5">
                    <Pulse className="h-6 w-10" />
                    <Pulse className="h-2.5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 border-b border-slate-200 px-4 md:px-0">
          <div className="flex gap-8 max-w-fit mx-auto md:mx-4 pb-4">
            <Pulse className="h-5 w-24" />
            <Pulse className="h-5 w-28" />
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="p-4 md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-12">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3"
            >
              <Pulse className="h-40 w-full rounded-lg" />
              <Pulse className="h-5 w-3/4" />
              <Pulse className="h-4 w-full" />
              <Pulse className="h-4 w-5/6" />
              <div className="flex items-center gap-3 pt-1">
                <Pulse className="h-7 w-7 rounded-full" />
                <Pulse className="h-3.5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
