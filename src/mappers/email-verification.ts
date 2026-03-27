import {
  EmailVerificationData,
  EmailVerificationDocument,
} from "@/schema/email-verification";
import toObjectId from "@/utils/toObjectId";
import validateEmailVerificationData from "@/validators/email-verification";
import { validateEmailVerificationDocument } from "@/validators/email-verification";

/**
 * Maps a MongoDB email verification document into application-level email verification data.
 * @param emailVerificationDocument - The email verification document to map.
 * @returns The application-level email verification data.
 */
export function mapEmailVerificationDocumentToEmailVerificationData(
  emailVerificationDocument: EmailVerificationDocument,
): EmailVerificationData {
  const validatedEmailVerificationDocument = validateEmailVerificationDocument(
    emailVerificationDocument,
  );

  return validateEmailVerificationData({
    ...validatedEmailVerificationDocument,
    _id: validatedEmailVerificationDocument._id.toString(),
  });
}

/**
 * Maps application-level email verification data into a MongoDB email verification document.
 * @param emailVerificationData - The email verification data to map.
 * @returns The MongoDB email verification document.
 */
export function mapEmailVerificationDataToEmailVerificationDocument(
  emailVerificationData: EmailVerificationData,
): EmailVerificationDocument {
  const validatedEmailVerificationData = validateEmailVerificationData(
    emailVerificationData,
  );

  return validateEmailVerificationDocument({
    ...validatedEmailVerificationData,
    _id: toObjectId(validatedEmailVerificationData._id, "_id"),
  });
}
