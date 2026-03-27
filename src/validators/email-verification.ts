import {
  EmailVerificationData,
  EmailVerificationDocument,
  EmailVerificationDocumentSchema,
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
 * @param emailVerificationDocument - The email verification document to validate.
 * @returns The parsed and validated email verification document.
 * @throws {Error} If validation fails.
 */
export function validateEmailVerificationDocument(
  emailVerificationDocument: EmailVerificationDocument,
): EmailVerificationDocument {
  const parseResult = EmailVerificationDocumentSchema.safeParse(
    emailVerificationDocument,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid email verification document: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
