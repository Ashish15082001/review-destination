"use server";

import { getClientPromise } from "@/database/mongoDB";
import {
  addReplyToComment,
  checkIfCommentExists,
  insertCommentData,
} from "@/repository/comment";
import { checkIfReviewExists } from "@/repository/review";
import { getUserDataUsingSession } from "@/repository/user";
import {
  CommentData,
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
 * 4. performs a transaction to insert the new comment and update the parent comment (if it's a reply).
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

    // 1. If the user is not authenticated, return an error response immediately without attempting to access the database.
    if (!userData)
      return {
        type: "error",
        message: "You must be logged in to post a comment.",
      };

    const comment = formData.get("comment") as string;
    const reviewId = formData.get("reviewId") as string;
    const parentCommentId = formData.get("parentCommentId") as string;

    // 2. Sanitize the comment to prevent XSS attacks. If the sanitized comment is empty, return an error.
    const sanitizedComment = domPurify.sanitize(comment, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    // 3. Validate the form data against the CommentFormDataSchema. If validation fails, return an error response with detailed messages for each invalid field.
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

    // 4. Start the transaction to add the comment and update the parent comment (if it's a reply)
    return await postCommentTransaction({
      ...validatedCommentData,
      commentedBy: userData._id.toString(),
      commentedOn: new Date(),
      replyCommentIds: [],
      idsOfUsersWhoDisliked: [],
      idsOfUsersWhoLiked: [],
    });
  } catch (error) {
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Performs following operations in a transaction:
 * 1. If a `parentCommentId` is provided, checks if the parent comment exists. If it does not exist, the transaction is aborted and an error response is returned.
 * 2. Checks if the review being commented on exists. If it does not exist, the transaction is aborted and an error response is returned.
 * 3. Inserts the new comment into the database.
 * 4. If the comment is a reply, updates the parent comment to include the new reply.
 *
 * @param commentData - The validated comment data to be inserted.
 */
async function postCommentTransaction(
  commentData: Omit<CommentData, "_id">,
): Promise<ApiResponse> {
  const clientSession = (await getClientPromise()).startSession();
  let domainErrorMessage: string | null = null;

  try {
    await clientSession.withTransaction(async () => {
      // 1. If a parentCommentId is provided, ensure it exists before allowing the reply to be added.
      if (commentData.parentCommentId !== null) {
        const doesParentCommentExist = await checkIfCommentExists(
          {
            commentId: commentData.parentCommentId,
          },
          clientSession,
        );
        if (!doesParentCommentExist) {
          domainErrorMessage =
            "The parent comment you are trying to reply to does not exist.";
          throw new Error(domainErrorMessage);
        }
      }

      // 2. Check if the review exists before adding the comment. If the review does not exist, return an error response indicating that the review cannot be found.
      const doesReviewExist = await checkIfReviewExists(
        {
          reviewId: commentData.reviewId,
        },
        clientSession,
      );
      if (doesReviewExist === false) {
        domainErrorMessage =
          "The review you are trying to comment on does not exist.";
        throw new Error(domainErrorMessage);
      }

      // 3. Insert the new comment into the database.
      const insertedCommentId = await insertCommentData(
        commentData,
        clientSession,
      );

      // 4. If the comment is a reply, update the parent comment to include the new reply.
      if (commentData.parentCommentId !== null) {
        const updatedParentComment = await addReplyToComment(
          {
            parentCommentId: commentData.parentCommentId,
            replyCommentId: insertedCommentId,
          },
          clientSession,
        );

        if (!updatedParentComment) {
          domainErrorMessage =
            "Failed to add your reply to the parent comment. Please try again.";
          throw new Error(domainErrorMessage);
        }
      }
    });

    return {
      type: "success",
      message: "Comment posted successfully",
      fields: { comment: { value: "" } },
    };
  } catch (error) {
    return {
      type: "error",
      message:
        domainErrorMessage !== null
          ? domainErrorMessage
          : "An unexpected error occurred. Please try again later.",
    };
  } finally {
    await clientSession.endSession();
  }
}
