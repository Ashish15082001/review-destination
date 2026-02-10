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

  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues.map(
      (issue) => issue.message,
    );

    return {
      error: true,
      message: errorMessage,
    };
  }

  // Create review object with proper typing
  const reviewDataFromBrowser: ReviewDataFromBrowser = validationResult.data;

  // Upload image to Cloudinary
  const uploadResult = await uploadImage(
    reviewDataFromBrowser.destinationPhoto,
  );

  if (!uploadResult || !uploadResult.secure_url) {
    return {
      error: true,
      message: ["Failed to upload image. Please try again."],
    };
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

  return {
    error: false,
    message: ["Review added successfully. Redirecting to reviews page..."],
  };
};

export { addReviewAction };

export interface AddReviewActionReturnType {
  error: boolean;
  message: string[] | null;
}
