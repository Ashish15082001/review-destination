import z from "zod";
import { ObjectId } from "mongodb";

const BaseUserFields = {
  userName: z.string().min(1, "User name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.email("Invalid email address"),
};

export const SignInUserDataFromBrowserSchema = z.object({
  email: BaseUserFields.email,
  password: BaseUserFields.password,
});

export const SignUpUserDataFromBrowserSchema = z.object({
  userName: BaseUserFields.userName,
  email: BaseUserFields.email,
  password: BaseUserFields.password,
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters"),
});

export const UserDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  userName: z.string(),
  email: z.email(),
  password: z.string(),
  registeredAt: z.date(),
});

export const UserDataSchema = UserDataDocumentSchema.extend({
  _id: z.string(),
});

export interface SignInUserDataFromBrowser extends z.infer<
  typeof SignInUserDataFromBrowserSchema
> {}

export interface SignUpUserDataFromBrowser extends z.infer<
  typeof SignUpUserDataFromBrowserSchema
> {}

export interface UserDataDocument extends z.infer<
  typeof UserDataDocumentSchema
> {}

export interface UserData extends z.infer<typeof UserDataSchema> {}
