import z from "zod";
import { ObjectId } from "mongodb";

// Base schema with common fields
const BaseReviewSchema = z.object({
  userName: z.string().min(1, "User name is required"),
  destinationName: z.string().min(1, "Destination name is required"),
  whenVisited: z.string().min(1, "Visit date is required"),
  review: z.string().min(1, "Review is required"),
  description: z.string().min(1, "Description is required"),
  experience: z.string().min(1, "Experience is required"),
  famousLocations: z.string().min(1, "Famous locations are required"),
});

// Schema for form data (with File) recieved from browser
export const ReviewDataBrowserSchema = BaseReviewSchema.extend({
  // url of image hosted/stored in cloudnary
  destinationPhoto: z
    .instanceof(File, { message: "Please upload an image" })
    .refine((file) => file.size > 0, {
      message: "File size cannot be empty",
    }),
});

// Schema for review data stored in database
export const ReviewDataDocumentSchema = BaseReviewSchema.extend({
  _id: z.instanceof(ObjectId),
  destinationPhotoUrl: z.url("Invalid URL"),
  datePosted: z.date(),
});

// Schema for review data used in app
export const ReviewDataSchema = ReviewDataDocumentSchema.extend({
  _id: z.string(),
});

export interface ReviewDataBrowser extends z.infer<
  typeof ReviewDataBrowserSchema
> {}

export interface ReviewDataDocument extends z.infer<
  typeof ReviewDataDocumentSchema
> {}

export interface ReviewData extends z.infer<typeof ReviewDataSchema> {}
