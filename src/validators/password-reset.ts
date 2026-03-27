import {
  PasswordResetData,
  PasswordResetDocument,
  PasswordResetDocumentSchema,
  PasswordResetDataSchema,
} from "@/schema/password-reset";

/**
 * Validates raw password reset data against the PasswordResetDataSchema.
 * @param passwordResetData - The password reset payload to validate.
 * @returns The parsed and validated password reset data.
 * @throws {Error} If validation fails.
 */
export default function validatePasswordResetData(
  passwordResetData: PasswordResetData,
): PasswordResetData {
  const parseResult = PasswordResetDataSchema.safeParse(passwordResetData);

  if (!parseResult.success)
    throw new Error(
      `Invalid password reset data: ${parseResult.error.message}`,
    );

  return parseResult.data;
}

/**
 * Validates a password reset document as stored in MongoDB.
 * @param passwordResetDocument - The password reset document to validate.
 * @returns The parsed and validated password reset document.
 * @throws {Error} If validation fails.
 */
export function validatePasswordResetDocument(
  passwordResetDocument: PasswordResetDocument,
): PasswordResetDocument {
  const parseResult = PasswordResetDocumentSchema.safeParse(
    passwordResetDocument,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid password reset document: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
