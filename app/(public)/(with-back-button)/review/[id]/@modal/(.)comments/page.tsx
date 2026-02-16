"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

export default function CommentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  console.log("[id]/@modal/(.)comments/page.tsx");

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.57)",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Comments for Review {id}
            </h1>
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-gray-700">
            This is where the comments for the review will be displayed.
            (intercepted this route)
          </p>
        </div>
      </div>
    </div>
  );
}
