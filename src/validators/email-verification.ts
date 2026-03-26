import {
  EmailVerificationData,
  EmailVerificationDataDocument,
  EmailVerificationDataDocumentSchema,
  EmailVerificationDataSchema,
} from "@/schema/email-verification";

/**
 * Validates raw email verification data against the EmailVerificationDataSchema.
 * @param emailVerificationData - The email verification payload to validate.
 * @returns The parsed and validated email verification data.
 * @throws {Error} If validation fails.
 */
export default function validateEmailVerificationData(
  emailVerificationData: EmailVerificationData,
): EmailVerificationData {
  const parseResult = EmailVerificationDataSchema.safeParse(
    emailVerificationData,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid email verification data: ${parseResult.error.message}`,
    );

  return parseResult.data;
}

/**
 * Validates an email verification document as stored in MongoDB.
 * @param emailVerificationDataDocument - The email verification document to validate.
 * @returns The parsed and validated email verification document.
 * @throws {Error} If validation fails.
 */
export function validateEmailVerificationDataDocument(
  emailVerificationDataDocument: EmailVerificationDataDocument,
): EmailVerificationDataDocument {
  const parseResult = EmailVerificationDataDocumentSchema.safeParse(
    emailVerificationDataDocument,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid email verification data document: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
