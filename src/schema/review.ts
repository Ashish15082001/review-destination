import z from "zod";
import { ObjectId } from "mongodb";

// Base schema with common fields
const BaseReviewSchema = z.object({
  destinationName: z.string().min(1, "Destination name is required"),
  whenVisited: z.string().min(1, "Visit date is required"),
  description: z.string().min(1, "Description is required"),
  experience: z.string().min(1, "Experience is required"),
});

// Schema for form data (with File) recieved from browser
export const ReviewDataBrowserSchema = BaseReviewSchema.extend({
  // photos uploaded by the user
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

// Schema for review data stored in database
export const ReviewDataDocumentSchema = BaseReviewSchema.extend({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  destinationPhotoUrls: z.array(z.url("Invalid URL")).min(1),
  datePosted: z.date(),
});

// Schema for review data used in app
export const ReviewDataSchema = ReviewDataDocumentSchema.extend({
  _id: z.string(),
  userId: z.string(),
});

export interface ReviewDataBrowser extends z.infer<
  typeof ReviewDataBrowserSchema
> {}

export interface ReviewDataDocument extends z.infer<
  typeof ReviewDataDocumentSchema
> {}

export interface ReviewData extends z.infer<typeof ReviewDataSchema> {}
