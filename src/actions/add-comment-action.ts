"use server";

import { getUserDataUsingSession, insertCommentData } from "@/lib/mongodb";
import { revalidatePath, updateTag } from "next/cache";
import z from "zod";

const CommentFormSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be at most 500 characters"),
  reviewId: z.string().min(1, "Review ID is required"),
});

const addCommentAction = async (
  prevData: AddCommentActionReturnType,
  formData: FormData,
): Promise<AddCommentActionReturnType> => {
  const comment = formData.get("comment") as string;
  const reviewId = formData.get("reviewId") as string;

  const validationResult = CommentFormSchema.safeParse({ comment, reviewId });

  const returnValue: AddCommentActionReturnType = {
    type: validationResult.success ? "success" : "error",
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

  const userData = await getUserDataUsingSession();

  if (!userData) {
    throw new Error("User not authenticated");
  }

  await insertCommentData({
    reviewId: validationResult.data.reviewId,
    commentedBy: userData._id,
    commentedOn: new Date(),
    comment: validationResult.data.comment,
  });

  updateTag(`commentsData-${reviewId}`);

  return { type: "success", fields: { comment: { value: "" } } };
};

export { addCommentAction };

export interface AddCommentActionReturnType {
  type?: "success" | "error";
  fields?: Record<
    PropertyKey,
    {
      value?: string;
      error?: string;
    }
  >;
}
