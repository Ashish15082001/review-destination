import z from "zod";
import { ObjectId } from "mongodb";

// ############################## Schemas and Types for Reviews ##############################

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
  destinationPhoto: z
    .instanceof(File, { message: "Please upload an image" })
    .refine((file) => file.size > 0, {
      message: "File size cannot be empty",
    }),
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

// ############################## Schemas and Types for Users ##############################

const BaseUserFields = {
  userName: z.string().min(1, "User name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
};

export const SignInUserDataFromBrowserSchema = z.object({
  userName: BaseUserFields.userName,
  password: BaseUserFields.password,
});

export const SignUpUserDataFromBrowserSchema = z.object({
  userName: BaseUserFields.userName,
  password: BaseUserFields.password,
  // confirmPassword: z.string(),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

export const UserDataFromMongoDBSchema = z.object({
  _id: z.instanceof(ObjectId),
  userName: z.string(),
  password: z.string(),
  registeredAt: z.date(),
});

export const UserDataToMongoDBSchema = z.object({
  userName: z.string(),
  password: z.string(),
  registeredAt: z.date(),
});

export interface SignInUserDataFromBrowser extends z.infer<
  typeof SignInUserDataFromBrowserSchema
> {}

export interface SignUpUserDataFromBrowser extends z.infer<
  typeof SignUpUserDataFromBrowserSchema
> {}

export interface UserDataFromMongoDB extends z.infer<
  typeof UserDataFromMongoDBSchema
> {}

export interface UserDataToMongoDB extends z.infer<
  typeof UserDataToMongoDBSchema
> {}

// ############################## Schemas and Types for Users Session ##############################

export const UserSessionDataFromMongoDBSchema = z.object({
  _id: z.instanceof(ObjectId),
  expiresOn: z.date(),
});

export const UserSessionDataToMongoDBSchema = z.object({
  expiresOn: z.date(),
});

export interface UserSessionDataFromMongoDB extends z.infer<
  typeof UserSessionDataFromMongoDBSchema
> {}

export interface UserSessionDataToMongoDB extends z.infer<
  typeof UserSessionDataToMongoDBSchema
> {}
