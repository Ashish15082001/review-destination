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

// Schema for form data (with File)
export const ReviewDataFromBrowserSchema = BaseReviewSchema.extend({
  destinationPhoto: z.instanceof(File, { message: "Please upload an image" }),
});

// Schema for data going to MongoDB (with URL and datePosted)
export const ReviewDataToMongoDBSchema = BaseReviewSchema.extend({
  destinationPhotoUrl: z.url("Invalid URL"),
  totalLikes: z.number().default(0),
  datePosted: z.date().default(() => new Date()),
});

// Schema for data coming from MongoDB (with _id)
export const ReviewDataFromMongoDBSchema = ReviewDataToMongoDBSchema.extend({
  _id: z.instanceof(ObjectId).transform((id) => id.toString()),
})
  .omit({ datePosted: true })
  .extend({
    datePosted: z.date(),
  });

export interface ReviewDataFromBrowser extends z.infer<
  typeof ReviewDataFromBrowserSchema
> {}
export interface ReviewDataFromMongoDB extends z.infer<
  typeof ReviewDataFromMongoDBSchema
> {}
export interface ReviewDataToMongoDB extends z.infer<
  typeof ReviewDataToMongoDBSchema
> {}
