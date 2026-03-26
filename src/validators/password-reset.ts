import {
  PasswordResetData,
  PasswordResetDataDocument,
  PasswordResetDataDocumentSchema,
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
 * @param passwordResetDataDocument - The password reset document to validate.
 * @returns The parsed and validated password reset document.
 * @throws {Error} If validation fails.
 */
export function validatePasswordResetDataDocument(
  passwordResetDataDocument: PasswordResetDataDocument,
): PasswordResetDataDocument {
  const parseResult = PasswordResetDataDocumentSchema.safeParse(
    passwordResetDataDocument,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid password reset data document: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
