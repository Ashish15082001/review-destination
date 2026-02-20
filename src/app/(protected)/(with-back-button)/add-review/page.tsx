"use client";

import { addReviewAction } from "@/actions/add-review-action";
import { useActionState, useState } from "react";

export default function AddReviewPage() {
  const [state, formAction, isPending] = useActionState(addReviewAction, {});
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setPreviews([]);
      return;
    }
    const newPreviews: string[] = new Array(files.length);
    let loaded = 0;
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[i] = reader.result as string;
        loaded++;
        if (loaded === files.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddReview = async (formData: FormData) => {
    formAction(formData);
    setPreviews([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Add Your Travel Review</h1>

        <form className="space-y-6" action={handleAddReview}>
          {/* Destination Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Destination Details</h2>

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
                defaultValue={
                  state.fields && state.fields.destinationName
                    ? (state.fields.destinationName.value as string)
                    : ""
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Paris, Tokyo, New York"
              />

              {/* error message */}
              {state.fields && state.fields.destinationName?.error && (
                <p className="mt-2 text-sm text-red-600">
                  {state.fields.destinationName.error}
                </p>
              )}
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
                defaultValue={
                  state.fields && state.fields.whenVisited
                    ? (state.fields.whenVisited.value as string)
                    : ""
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* error message */}
              {state.fields && state.fields.whenVisited?.error && (
                <p className="mt-2 text-sm text-red-600">
                  {state.fields.whenVisited.error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="destinationPhoto"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Destination Photo *
              </label>
              <div className="flex gap-6">
                <div className="flex-1">
                  <input
                    type="file"
                    id="destinationPhoto"
                    name="destinationPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  {/* error message */}
                  {state.fields && state.fields.destinationPhotos?.error && (
                    <p className="mt-2 text-sm text-red-600">
                      {state.fields.destinationPhotos.error}
                    </p>
                  )}
                </div>
                {previews.length > 0 && (
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {previews.map((src, i) => (
                      <div
                        key={i}
                        className="w-full h-48 rounded-md overflow-hidden border border-gray-300"
                      >
                        <img
                          src={src}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Your Review</h2>

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
                defaultValue={
                  state.fields && state.fields.description
                    ? (state.fields.description.value as string)
                    : ""
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Provide a brief description of the destination"
              />

              {/* error message */}
              {state.fields && state.fields.description?.error && (
                <p className="mt-2 text-sm text-red-600">
                  {state.fields.description?.error}
                </p>
              )}
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
                defaultValue={
                  state.fields && state.fields.experience
                    ? (state.fields.experience.value as string)
                    : ""
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Share your detailed experience, what you loved, tips for other travelers, etc."
              />

              {/* error message */}
              {state.fields && state.fields.experience?.error && (
                <p className="mt-2 text-sm text-red-600">
                  {state.fields.experience.error}
                </p>
              )}
            </div>
          </div>

          {/* success message */}
          {state.type === "success" && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">
                Your review has been submitted successfully. Thank you for
                sharing your experience!
              </span>
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
              onClick={() => setPreviews([])}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
