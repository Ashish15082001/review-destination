import { ObjectId } from "mongodb";
import { BaseUserFields } from "./user";
import z from "zod";

/**
 * Browser payload schema for sending a password reset link.
 */
export const SendPasswordResetLinkFormDataSchema = z.object({
  email: BaseUserFields.email,
});

/**
 * Browser payload schema for resetting the password.
 */
export const ResetPasswordFormDataSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: BaseUserFields.password,
  confirmPassword: BaseUserFields.password,
});

/**
 * MongoDB representation of a password reset document.
 */
export const PasswordResetDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  token: z.string().min(1, "Reset token is required"),
  email: BaseUserFields.email,
  expiresAt: z.date(),
});

/**
 * Application-level representation of password reset data.
 */
export const PasswordResetDataSchema = z.object({
  _id: z.string(),
  token: z.string().min(1, "Reset token is required"),
  email: BaseUserFields.email,
  expiresAt: z.date(),
});

/**
 * Inferred TypeScript type for password reset payload.
 */
export type SendPasswordResetLinkFormData = z.infer<
  typeof SendPasswordResetLinkFormDataSchema
>;

/**
 * Inferred TypeScript type for password reset payload.
 */
export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormDataSchema>;

/**
 * Inferred TypeScript type for password reset document from MongoDB.
 */
export type PasswordResetDataDocument = z.infer<
  typeof PasswordResetDataDocumentSchema
>;

/**
 * Inferred TypeScript type for password reset data used in the application.
 */
export type PasswordResetData = z.infer<typeof PasswordResetDataSchema>;
