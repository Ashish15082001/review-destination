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
 * Inferred TypeScript type for password reset payload.
 */
export type SendPasswordResetLinkFormData = z.infer<
  typeof SendPasswordResetLinkFormDataSchema
>;

/**
 * Inferred TypeScript type for password reset payload.
 */
export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormDataSchema>;
