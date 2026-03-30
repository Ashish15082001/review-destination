import z from "zod";
import { ObjectId } from "mongodb";

/**
 * Reusable field definitions shared across user schemas.
 */
export const BaseUserFields = {
  userName: z.string().trim().min(1, "User name is required"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
  email: z.email("Invalid email address"),
};

/**
 * Browser payload schema for sign-in.
 */
export const UserSignInDataSchema = z.object({
  email: BaseUserFields.email,
  password: BaseUserFields.password,
});

/**
 * Browser payload schema for sign-up.
 */
export const UserSignUpDataSchema = z.object({
  userName: BaseUserFields.userName,
  email: BaseUserFields.email,
  password: BaseUserFields.password,
  confirmPassword: z
    .string()
    .trim()
    .min(6, "Confirm password must be at least 6 characters"),
  profilePicture: z
    .instanceof(File, { message: "Please upload an image" })
    .refine((file) => file.size > 0, {
      message: "File size cannot be empty",
    }),
});

/**
 * MongoDB representation of a user document.
 */
export const UserDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  userName: z.string().trim().min(1, "User name is required"),
  email: z.email("Invalid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
  registeredAt: z.date(),
  savedReviewesIds: z.array(z.instanceof(ObjectId)),
  profilePictureUrl: z
    .string()
    .trim()
    .min(1, "Profile picture URL is required"),
  isEmailVerified: z.boolean(),
});

/**
 * Application-level representation of user data.
 */
export const UserDataSchema = UserDocumentSchema.extend({
  _id: z.string(),
  savedReviewesIds: z.array(z.string()),
});

/**
 * Inferred TypeScript type for sign-in browser payload.
 */
export type UserSignInData = z.infer<typeof UserSignInDataSchema>;

/**
 * Inferred TypeScript type for sign-up browser payload.
 */
export type UserSignUpData = z.infer<typeof UserSignUpDataSchema>;

/**
 * Inferred TypeScript type for MongoDB user documents.
 */
export type UserDocument = z.infer<typeof UserDocumentSchema>;

/**
 * Inferred TypeScript type for application-level users.
 */
export type UserData = z.infer<typeof UserDataSchema>;
