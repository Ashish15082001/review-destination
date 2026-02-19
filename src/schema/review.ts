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
export const ReviewDataFromBrowserSchema = BaseReviewSchema.extend({
  // url of image hosted/stored in cloudnary
  destinationPhoto: z
    .instanceof(File, { message: "Please upload an image" })
    .refine((file) => file.size > 0, {
      message: "File size cannot be empty",
    }),
});

// Schema for data going to MongoDB (with URL and datePosted)
export const ReviewDataToMongoDBSchema = BaseReviewSchema.extend({
  destinationPhotoUrl: z.url("Invalid URL"),
  // storing likes as an array of user ids who liked
  likes: z.array(
    z.object({
      dateLiked: z.date(),
      userId: z.instanceof(ObjectId),
    }),
  ),
  datePosted: z.date(),
});

// Schema for data coming from MongoDB (with _id)
export const ReviewDataFromMongoDBSchema = ReviewDataToMongoDBSchema.extend({
  _id: z.instanceof(ObjectId),
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
