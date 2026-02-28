"use server";

import { uploadImage } from "@/lib/cloudinary";
import { getUserDataUsingSession, insertReviewData } from "@/lib/mongodb";
import {
  ReviewData,
  ReviewDataBrowser,
  ReviewDataBrowserSchema,
} from "@/schema/review";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Server action to add a new destination review.
 *
 * First verifies the user is authenticated via their session, then validates the form data
 * (destination name, photos, visit date, description, experience) using Zod, uploads destination
 * photos to Cloudinary, inserts the review into the database, and revalidates the `/reviews` page cache.
 *
 * @param prevData - The previous action state (used by `useActionState`).
 * @param formData - The form data containing `destinationName`, `destinationPhoto` (files),
 *   `whenVisited`, `description`, and `experience`.
 * @returns An object indicating success or error, along with field-level validation messages.
 * @throws {Error} If the user is not authenticated.
 */
const addReviewAction = async (
  prevData: AddReviewActionReturnType,
  formData: FormData,
): Promise<AddReviewActionReturnType> => {
  const userData = await getUserDataUsingSession();

  if (!userData) {
    throw new Error("User is not authenticated.");
  }

  // Extract and type the form data
  const destinationName = formData.get("destinationName") as string;
  const destinationPhotos = formData.getAll("destinationPhoto") as File[];
  const whenVisited = formData.get("whenVisited") as string;
  const description = formData.get("description") as string;
  const experience = formData.get("experience") as string;

  // Validate form data with Zod
  const validationResult = ReviewDataBrowserSchema.safeParse({
    destinationName,
    destinationPhotos,
    whenVisited,
    description,
    experience,
  });

  console.log(validationResult);

  const returnValue: AddReviewActionReturnType = {
    type: validationResult.success ? "success" : "error",
    fields: {
      destinationName: {
        value: destinationName,
      },
      destinationPhotos: {},
      whenVisited: {
        value: whenVisited,
      },
      description: {
        value: description,
      },
      experience: {
        value: experience,
      },
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

  // Create review object with proper typing
  const reviewDataBrowser: ReviewDataBrowser = validationResult.data;

  // Upload all images to Cloudinary
  const uploadResults = await Promise.all(
    reviewDataBrowser.destinationPhotos.map((photo) => uploadImage(photo)),
  );

  if (uploadResults.some((r) => !r || !r.secure_url)) {
    if (returnValue.fields)
      returnValue.fields.destinationPhotos.error =
        "One or more image uploads failed. Please try again.";
    else
      returnValue.fields = {
        destinationPhotos: {
          error: "One or more image uploads failed. Please try again.",
        },
      };

    return returnValue;
  }

  const destinationPhotoUrls = uploadResults.map((r) => r.secure_url);

  await insertReviewData({
    userId: userData._id,
    destinationName: reviewDataBrowser.destinationName,
    destinationPhotoUrls,
    whenVisited: reviewDataBrowser.whenVisited,
    description: reviewDataBrowser.description,
    experience: reviewDataBrowser.experience,
    datePosted: new Date(),
  });
  revalidatePath("/reviews");

  return { type: "success" };
};

export { addReviewAction };

export interface AddReviewActionReturnType {
  type?: "success" | "error";
  fields?: Record<
    PropertyKey,
    {
      value?: string;
      error?: string;
    }
  >;
}
