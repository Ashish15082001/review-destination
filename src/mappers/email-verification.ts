import {
  EmailVerificationData,
  EmailVerificationDataDocument,
} from "@/schema/email-verification";
import toObjectId from "@/utils/toObjectId";
import validateEmailVerificationData from "@/validators/email-verification";
import { validateEmailVerificationDataDocument } from "@/validators/email-verification";

/**
 * Maps a MongoDB email verification document into application-level email verification data.
 */
export function mapEmailVerificationDataDocumentToEmailVerificationData(
  emailVerificationDataDocument: EmailVerificationDataDocument,
): EmailVerificationData {
  const validatedEmailVerificationDataDocument =
    validateEmailVerificationDataDocument(emailVerificationDataDocument);

  return validateEmailVerificationData({
    ...validatedEmailVerificationDataDocument,
    _id: validatedEmailVerificationDataDocument._id.toString(),
  });
}

/**
 * Maps application-level email verification data into a MongoDB email verification document.
 */
export function mapEmailVerificationDataToEmailVerificationDataDocument(
  emailVerificationData: EmailVerificationData,
): EmailVerificationDataDocument {
  const validatedEmailVerificationData = validateEmailVerificationData(
    emailVerificationData,
  );

  return validateEmailVerificationDataDocument({
    ...validatedEmailVerificationData,
    _id: toObjectId(validatedEmailVerificationData._id, "_id"),
  });
}
