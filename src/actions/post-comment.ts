"use server";

import {
  checkIfCommentExists,
  insertCommentData,
} from "@/repository/comment";
import { checkIfReviewExists } from "@/repository/review";
import { getUserDataUsingSession } from "@/repository/user";
import {
  CommentFormData,
  CommentFormDataSchema,
} from "@/schema/comment";
import { ApiResponse } from "@/types/apiResponse";
import domPurify from "@/utils/domPurify";

/**
 * Server action to add a comment to a review.
 *
 * This action performs the following steps:
 * 1. Validates the user's session to ensure they are authenticated.
 * 2. Sanitizes the comment text to prevent XSS attacks.
 * 3. Validates the form data against the `CommentFormDataSchema`.
 * 4. Checks that the parent comment (if replying) and review both exist.
 * 5. Inserts the new comment as a single write — no transaction needed.
 *
 * @param prevData - The previous action state passed automatically by `useActionState`.
 * @param formData - Form data expected to contain:
 *   - `comment` {string} — The comment text (1–500 characters).
 *   - `reviewId` {string} — The ID of the review being commented on.
 *   - `parentCommentId` {string} — Optional ID of the comment being replied to.
 *
 * @returns A promise resolving to {@link ApiResponse} with:
 *   - `type` — `"success"` if the comment was saved, `"error"` otherwise.
 *   - `message` — A human-readable summary of the outcome.
 *   - `fields` — Per-field values and validation error messages (comment field is always included).
 *     On success the comment `value` is reset to `""` to clear the form.
 */
export default async function postCommentAction(
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> {
  try {
    const userData = await getUserDataUsingSession();

    if (!userData)
      return {
        type: "error",
        message: "You must be logged in to post a comment.",
      };

    const comment = formData.get("comment") as string;
    const reviewId = formData.get("reviewId") as string;
    const parentCommentId = formData.get("parentCommentId") as string;

    const sanitizedComment = domPurify.sanitize(comment, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    const validationResult = CommentFormDataSchema.safeParse({
      comment: sanitizedComment,
      reviewId,
      parentCommentId,
    });

    if (!validationResult.success) {
      const fieldErrors: ApiResponse["fields"] = {
        comment: { value: comment },
      };

      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = {
          ...fieldErrors[fieldName],
          error: issue.message,
        };
      });

      return {
        type: "error",
        message: "Failed to post comment. Please check the form.",
        fields: fieldErrors,
      };
    }

    const validatedCommentData: CommentFormData = validationResult.data;

    if (validatedCommentData.parentCommentId !== null) {
      const doesParentCommentExist = await checkIfCommentExists({
        commentId: validatedCommentData.parentCommentId,
      });
      if (!doesParentCommentExist)
        return {
          type: "error",
          message:
            "The parent comment you are trying to reply to does not exist.",
        };
    }

    const doesReviewExist = await checkIfReviewExists({
      reviewId: validatedCommentData.reviewId,
    });
    if (!doesReviewExist)
      return {
        type: "error",
        message: "The review you are trying to comment on does not exist.",
      };

    await insertCommentData({
      ...validatedCommentData,
      commentedBy: userData._id.toString(),
      commentedOn: new Date(),
      idsOfUsersWhoDisliked: [],
      idsOfUsersWhoLiked: [],
    });

    return {
      type: "success",
      message: "Comment posted successfully",
      fields: { comment: { value: "" } },
    };
  } catch (error) {
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
