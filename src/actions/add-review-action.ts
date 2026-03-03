"use server";

import { uploadImage } from "@/lib/cloudinary";
import { getUserDataUsingSession, insertReviewData } from "@/lib/mongodb";
import { ReviewDataBrowserSchema } from "@/schema/review";
/**
 * Server action to add a new destination review.
 *
 * Verifies the user is authenticated via their session, validates the submitted form data
 * (destination name, photos, visit date, description, experience) using Zod, uploads all
 * destination photos to Cloudinary, and inserts the review into the database.
 *
 * @param prevData - The previous action state (used by `useActionState`).
 * @param formData - The form data containing `destinationName`, `destinationPhoto` (files),
 *   `whenVisited`, `description`, and `experience`.
 * @returns An object indicating success or failure. On failure, includes field-level validation
 *   errors and the previously submitted field values for form repopulation. Returns an error
 *   response (rather than throwing) if the user is not authenticated.
 */
const addReviewAction = async (
  prevData: AddReviewActionReturnType,
  formData: FormData,
): Promise<AddReviewActionReturnType> => {
  try {
    const userData = await getUserDataUsingSession();

    if (!userData)
      return {
        type: "error",
        message: "You must be logged in to add a review.",
      };

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

    const returnValue: AddReviewActionReturnType = {
      type: validationResult.success ? "success" : "error",
      message: validationResult.success
        ? "Review added successfully"
        : "Failed to add review. Please check the form for errors and try again.",
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
    const validatedReviewData = validationResult.data;

    // Upload all images to Cloudinary
    const uploadResults = await Promise.all(
      validatedReviewData.destinationPhotos.map((photo) => uploadImage(photo)),
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
      destinationName: validatedReviewData.destinationName,
      destinationPhotoUrls,
      whenVisited: validatedReviewData.whenVisited,
      description: validatedReviewData.description,
      experience: validatedReviewData.experience,
      datePosted: new Date(),
    });

    return { type: "success", message: "Review added successfully" };
  } catch (error) {
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};

export { addReviewAction };

export interface AddReviewActionReturnType {
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
