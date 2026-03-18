import z from "zod";
import { ObjectId } from "mongodb";

/**
 * Common review fields shared by browser and database schemas.
 */
const BaseReviewSchema = z.object({
  destinationName: z.string().min(1, "Destination name is required"),
  whenVisited: z.string().min(1, "Visit date is required"),
  description: z.string().min(1, "Description is required"),
  experience: z.string().min(1, "Experience is required"),
});

/**
 * Browser payload schema for review form submissions.
 */
export const ReviewDataBrowserSchema = BaseReviewSchema.extend({
  // Photos uploaded by the user.
  destinationPhotos: z
    .array(
      z
        .instanceof(File, { message: "Please upload an image" })
        .refine((file) => file.size > 0, {
          message: "File size cannot be empty",
        }),
    )
    .min(1, "Please upload at least one image"),
});

/**
 * MongoDB representation of a review document.
 */
export const ReviewDataDocumentSchema = BaseReviewSchema.extend({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  destinationPhotoUrls: z.array(z.url("Invalid URL")).min(1),
  datePosted: z.date(),
});

/**
 * Application-level representation of review data.
 */
export const ReviewDataSchema = ReviewDataDocumentSchema.extend({
  _id: z.string(),
  userId: z.string(),
});

/**
 * Inferred TypeScript type for browser review payload.
 */
export type ReviewDataBrowser = z.infer<typeof ReviewDataBrowserSchema>;

/**
 * Inferred TypeScript type for MongoDB review documents.
 */
export type ReviewDataDocument = z.infer<typeof ReviewDataDocumentSchema>;

/**
 * Inferred TypeScript type for application-level reviews.
 */
export type ReviewData = z.infer<typeof ReviewDataSchema>;
