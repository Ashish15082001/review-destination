"use client";

import {
  addCommentAction,
  AddCommentActionReturnType,
} from "@/actions/add-comment-action";
import { useActionState, useEffect, useRef } from "react";

interface CommentFormProps {
  reviewId: string;
}

const initialState: AddCommentActionReturnType = {};

export function CommentForm({ reviewId }: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(
    addCommentAction,
    initialState,
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.type === "success" && textareaRef.current) {
      textareaRef.current.value = "";
    }
  }, [state.type]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <form action={formAction}>
        {/* hidden reviewId */}
        <input type="hidden" name="reviewId" value={reviewId} />

        {/* Avatar + Textarea row */}
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              id="comment"
              name="comment"
              rows={3}
              placeholder="Share your thoughts on this journey..."
              defaultValue={state.fields?.comment?.value ?? ""}
              className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none"
            />
            {/* validation error */}
            {state.fields?.comment?.error && (
              <p className="mt-1 text-xs text-red-500">
                {state.fields.comment.error}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
          {/* Left icons */}
          <div className="flex items-center gap-3 text-gray-400">
            <button
              type="button"
              className="hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            <button
              type="button"
              className="hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>
        </div>

        {/* success message */}
        {state.type === "success" && (
          <p className="mt-2 text-xs text-green-600">
            Comment posted successfully!
          </p>
        )}
      </form>
    </div>
  );
}
