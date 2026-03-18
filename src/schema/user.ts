import z from "zod";
import { ObjectId } from "mongodb";

/**
 * Reusable field definitions shared across user schemas.
 */
const BaseUserFields = {
  userName: z.string().min(1, "User name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.email("Invalid email address"),
};

/**
 * Browser payload schema for sign-in.
 */
export const SignInUserDataFromBrowserSchema = z.object({
  email: BaseUserFields.email,
  password: BaseUserFields.password,
});

/**
 * Browser payload schema for sign-up.
 */
export const SignUpUserDataFromBrowserSchema = z.object({
  userName: BaseUserFields.userName,
  email: BaseUserFields.email,
  password: BaseUserFields.password,
  confirmPassword: z
    .string()
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
export const UserDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  userName: z.string(),
  email: z.email(),
  password: z.string(),
  registeredAt: z.date(),
  savedReviewesIds: z.array(z.instanceof(ObjectId)),
  profilePictureUrl: z.string(),
});

/**
 * Application-level representation of user data.
 */
export const UserDataSchema = UserDataDocumentSchema.extend({
  _id: z.string(),
  savedReviewesIds: z.array(z.string()),
});

/**
 * Inferred TypeScript type for sign-in browser payload.
 */
export type SignInUserDataFromBrowser = z.infer<
  typeof SignInUserDataFromBrowserSchema
>;

/**
 * Inferred TypeScript type for sign-up browser payload.
 */
export type SignUpUserDataFromBrowser = z.infer<
  typeof SignUpUserDataFromBrowserSchema
>;

/**
 * Inferred TypeScript type for MongoDB user documents.
 */
export type UserDataDocument = z.infer<typeof UserDataDocumentSchema>;

/**
 * Inferred TypeScript type for application-level users.
 */
export type UserData = z.infer<typeof UserDataSchema>;
