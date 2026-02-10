"use client";

import { addReviewAction } from "@/actions/add-review-action";
import { Fragment, useActionState } from "react";

export default function AddReviewPage() {
  const [state, formAction, isPending] = useActionState(addReviewAction, {
    error: false,
    message: null,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Add Your Travel Review</h1>

        <form className="space-y-6" action={formAction}>
          {/* Destination Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Destination Details</h2>

            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="destinationName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Destination Name *
              </label>
              <input
                type="text"
                id="destinationName"
                name="destinationName"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Paris, Tokyo, New York"
              />
            </div>

            <div>
              <label
                htmlFor="whenVisited"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                When Visited *
              </label>
              <input
                type="date"
                id="whenVisited"
                name="whenVisited"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="destinationPhoto"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Destination Photo *
              </label>
              <input
                type="file"
                id="destinationPhoto"
                name="destinationPhoto"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Your Review</h2>

            <div>
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Review Title *
              </label>
              <input
                type="text"
                id="review"
                name="review"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Give your review a title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Provide a brief description of the destination"
              />
            </div>

            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Experience *
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Share your detailed experience, what you loved, tips for other travelers, etc."
              />
            </div>
          </div>

          {/* Famous Locations Section */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Famous Locations</h2>
            <p className="text-sm text-gray-600 mb-4">
              List famous locations or attractions you visited (one per line)
            </p>

            <div>
              <label
                htmlFor="famousLocations"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Famous Locations *
              </label>
              <textarea
                id="famousLocations"
                name="famousLocations"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Enter locations (one per line)&#10;e.g.,&#10;Eiffel Tower&#10;Louvre Museum&#10;Arc de Triomphe"
              />
              <p className="mt-2 text-sm text-gray-500">
                Tip: Enter each location on a new line
              </p>
            </div>
          </div>

          {state.message && state.message.length > 0 && (
            <div
              className={`p-4 rounded-md ${state.error ? "bg-red-50 border border-red-700 text-red-700" : "bg-green-500 text-white"}`}
            >
              {state.message.map((msg, index) => (
                <Fragment key={index}>
                  <p>{msg}</p>
                </Fragment>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="reset"
              className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
