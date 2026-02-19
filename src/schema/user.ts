import z from "zod";
import { ObjectId } from "mongodb";

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
