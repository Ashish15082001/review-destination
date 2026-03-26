import {
  PasswordResetData,
  PasswordResetDataDocument,
} from "@/schema/password-reset";
import toObjectId from "@/utils/toObjectId";
import validatePasswordResetData from "@/validators/password-reset";
import { validatePasswordResetDataDocument } from "@/validators/password-reset";

/**
 * Maps a MongoDB password reset document into application-level password reset data.
 */
export function mapPasswordResetDataDocumentToPasswordResetData(
  passwordResetDataDocument: PasswordResetDataDocument,
): PasswordResetData {
  const validatedPasswordResetDataDocument = validatePasswordResetDataDocument(
    passwordResetDataDocument,
  );

  return validatePasswordResetData({
    ...validatedPasswordResetDataDocument,
    _id: validatedPasswordResetDataDocument._id.toString(),
  });
}

/**
 * Maps application-level password reset data into a MongoDB password reset document.
 */
export function mapPasswordResetDataToPasswordResetDataDocument(
  passwordResetData: PasswordResetData,
): PasswordResetDataDocument {
  const validatedPasswordResetData =
    validatePasswordResetData(passwordResetData);

  return validatePasswordResetDataDocument({
    ...validatedPasswordResetData,
    _id: toObjectId(validatedPasswordResetData._id, "_id"),
  });
}
