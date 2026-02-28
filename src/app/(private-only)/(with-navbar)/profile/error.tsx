"use client";
import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ProfileError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white/80 dark:bg-gray-900/80 p-6 rounded-md shadow">
        <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {error?.message || "Unknown error"}
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mb-4 text-xs overflow-auto whitespace-pre-wrap">
            {error?.stack}
          </pre>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
