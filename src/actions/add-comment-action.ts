"use server";

import {
  addReplyToComment,
  getUserDataUsingSession,
  insertCommentData,
} from "@/lib/mongodb";
import z from "zod";

const CommentFormSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be at most 500 characters"),
  reviewId: z.string().min(1, "Review ID is required"),
  parentCommentId: z.string().optional(),
});

/**
 * Server action to add a comment to a review.
 *
 * Retrieves the authenticated user from the session. If unauthenticated, returns an error
 * immediately without touching the database. Extracts `comment` and `reviewId` from the
 * form data, validates both fields with Zod (comment: 1–500 chars, reviewId: non-empty),
 * and returns field-level validation errors on failure. On success, inserts the comment
 * document into the database (with empty like/dislike arrays and the current timestamp),
 * then invalidates the `commentsData-{reviewId}` cache tag so the comment list refreshes.
 *
 * @param prevData - The previous action state passed automatically by `useActionState`.
 * @param formData - Form data expected to contain:
 *   - `comment` {string} — The comment text (1–500 characters).
 *   - `reviewId` {string} — The ID of the review being commented on.
 *   - `parentCommentId` {string} — Optional ID of the comment being replied to.
 * @returns A promise resolving to {@link AddCommentActionReturnType} with:
 *   - `type` — `"success"` if the comment was saved, `"error"` otherwise.
 *   - `message` — A human-readable summary of the outcome.
 *   - `fields` — Per-field values and validation error messages (comment field is always included).
 *     On success the comment `value` is reset to `""` to clear the form.
 */
const addCommentAction = async (
  prevData: AddCommentActionReturnType,
  formData: FormData,
): Promise<AddCommentActionReturnType> => {
  try {
    const userData = await getUserDataUsingSession();

    if (!userData)
      return {
        type: "error",
        message: "You must be logged in to add a comment.",
      };

    const comment = formData.get("comment") as string;
    const reviewId = formData.get("reviewId") as string;
    const parentCommentId = formData.get("parentCommentId") as string;

    const validationResult = CommentFormSchema.safeParse({ comment, reviewId });

    const returnValue: AddCommentActionReturnType = {
      type: validationResult.success ? "success" : "error",
      message: validationResult.success
        ? "Comment added successfully"
        : "Failed to add comment. Please try again.",
      fields: {
        comment: { value: comment },
      },
    };

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (returnValue.fields)
          returnValue.fields[fieldName] = {
            ...returnValue.fields[fieldName],
            error: issue.message,
          };
        else returnValue.fields = { [fieldName]: { error: issue.message } };
      });

      return returnValue;
    }

    const validatedCommentData = validationResult.data;

    const insertedCommentId = await insertCommentData({
      reviewId: validatedCommentData.reviewId,
      commentedBy: userData._id,
      commentedOn: new Date(),
      comment: validatedCommentData.comment,
      repliesIds: [],
      idsOfUsersWhoLiked: [],
      idsOfUsersWhoDisliked: [],
    });

    await addReplyToComment({
      parentCommentId,
      replyCommentId: insertedCommentId,
      reviewId,
    });

    return {
      type: "success",
      message: "Comment added successfully",
      fields: { comment: { value: "" } },
    };
  } catch (error) {
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};

export { addCommentAction };

export interface AddCommentActionReturnType {
  type?: "success" | "error";
  message?: string;
  fields?: Record<
    PropertyKey,
    {
      value?: string;
      error?: string;
    }
  >;
}
