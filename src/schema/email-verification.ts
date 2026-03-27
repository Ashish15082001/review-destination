import { ObjectId } from "mongodb";
import { BaseUserFields } from "./user";
import z from "zod";

/**
 * Browser payload schema for sending an email verification link.
 */
export const SendEmailVerificationLinkFormDataSchema = z.object({
  email: BaseUserFields.email,
});

/**
 *  Browser payload schema for verifying an email using a token.
 */
export const VerifyEmailFormDataSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

/**
 * MongoDB document schema for storing email verification data.
 */
export const EmailVerificationDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  token: z.string().min(1, "Verification token is required"),
  email: BaseUserFields.email,
  expiresAt: z.date(),
});

/**
 * Application-level representation of email verification data.
 */
export const EmailVerificationDataSchema = z.object({
  _id: z.string(),
  token: z.string().min(1, "Verification token is required"),
  email: BaseUserFields.email,
  expiresAt: z.date(),
});

/**
 * Inferred TypeScript type for email verification document from MongoDB.
 */
export type EmailVerificationDocument = z.infer<
  typeof EmailVerificationDocumentSchema
>;

/**
 * Inferred TypeScript type for email verification data used in the application.
 */
export type EmailVerificationData = z.infer<typeof EmailVerificationDataSchema>;

/**
 * Inferred TypeScript type for email verification payload.
 */
export type SendEmailVerificationLinkFormData = z.infer<
  typeof SendEmailVerificationLinkFormDataSchema
>;
