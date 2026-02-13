"use server";

import { uploadImage } from "@/lib/cloudinary";
import { putReviewData } from "@/lib/mongodb";
import {
  ReviewDataFromBrowser,
  ReviewDataFromBrowserSchema,
} from "@/schema/schema";
import { revalidatePath } from "next/cache";

const addReviewAction = async (
  prevData: AddReviewActionReturnType,
  formData: FormData,
): Promise<AddReviewActionReturnType> => {
  // Extract and type the form data
  const userName = formData.get("userName") as string;
  const destinationName = formData.get("destinationName") as string;
  const destinationPhoto = formData.get("destinationPhoto") as File;
  const whenVisited = formData.get("whenVisited") as string;
  const review = formData.get("review") as string;
  const description = formData.get("description") as string;
  const experience = formData.get("experience") as string;

  // Handle famousLocations - could be a JSON string or multiple form fields
  const famousLocations = formData.get("famousLocations") as string;

  // Validate form data with Zod
  const validationResult = ReviewDataFromBrowserSchema.safeParse({
    userName,
    destinationName,
    destinationPhoto,
    whenVisited,
    review,
    description,
    experience,
    famousLocations,
  });

  const returnValue: AddReviewActionReturnType = {
    type: validationResult.success ? "success" : "error",
    fields: {
      userName: {
        value: userName,
      },
      destinationName: {
        value: destinationName,
      },
      destinationPhoto: {},
      whenVisited: {
        value: whenVisited,
      },
      review: {
        value: review,
      },
      description: {
        value: description,
      },
      experience: {
        value: experience,
      },
      famousLocations: {
        value: famousLocations,
      },
    },
  };

  if (!validationResult.success) {
    validationResult.error.issues.forEach((issue) => {
      const fieldName = issue.path[issue.path.length - 1];
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
  const reviewDataFromBrowser: ReviewDataFromBrowser = validationResult.data;

  // Upload image to Cloudinary
  const uploadResult = await uploadImage(
    reviewDataFromBrowser.destinationPhoto,
  );

  if (!uploadResult || !uploadResult.secure_url) {
    if (returnValue.fields)
      returnValue.fields.destinationPhoto.error =
        "Image upload failed. Please try again.";
    else
      returnValue.fields = {
        destinationPhoto: { error: "Image upload failed. Please try again." },
      };

    return returnValue;
  }

  // Transform to MongoDB schema (replace File with URL)
  const reviewDataToMongoDB = {
    userName: reviewDataFromBrowser.userName,
    destinationName: reviewDataFromBrowser.destinationName,
    destinationPhotoUrl: uploadResult.secure_url,
    whenVisited: reviewDataFromBrowser.whenVisited,
    review: reviewDataFromBrowser.review,
    description: reviewDataFromBrowser.description,
    experience: reviewDataFromBrowser.experience,
    famousLocations: reviewDataFromBrowser.famousLocations,
    datePosted: new Date(),
    totalLikes: 0,
  };

  await putReviewData(reviewDataToMongoDB);
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
