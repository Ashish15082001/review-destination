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
    <form action={formAction} className="flex flex-col gap-3">
      {/* hidden reviewId */}
      <input type="hidden" name="reviewId" value={reviewId} />

      {/* comment textarea */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Add a comment
        </label>
        <textarea
          ref={textareaRef}
          id="comment"
          name="comment"
          rows={3}
          placeholder="Write your comment here..."
          defaultValue={state.fields?.comment?.value ?? ""}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* validation error */}
        {state.fields?.comment?.error && (
          <p className="mt-1 text-sm text-red-600">
            {state.fields.comment.error}
          </p>
        )}
      </div>

      {/* success message */}
      {state.type === "success" && (
        <p className="text-sm text-green-600">Comment added successfully!</p>
      )}

      {/* submit button */}
      <button
        type="submit"
        disabled={isPending}
        className="self-end bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Adding..." : "Add Comment"}
      </button>
    </form>
  );
}
