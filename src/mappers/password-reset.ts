import {
  PasswordResetData,
  PasswordResetDocument,
} from "@/schema/password-reset";
import toObjectId from "@/utils/toObjectId";
import validatePasswordResetData from "@/validators/password-reset";
import { validatePasswordResetDocument } from "@/validators/password-reset";

/**
 * Maps application-level password reset data into a MongoDB password reset document.
 * @param passwordResetData - The password reset data to map.
 * @returns The MongoDB password reset document.
 */
export function mapPasswordResetDocumentToPasswordResetData(
  passwordResetDocument: PasswordResetDocument,
): PasswordResetData {
  const validatedPasswordResetDocument = validatePasswordResetDocument(
    passwordResetDocument,
  );

  return validatePasswordResetData({
    ...validatedPasswordResetDocument,
    _id: validatedPasswordResetDocument._id.toString(),
  });
}

/**
 * Maps application-level password reset data into a MongoDB password reset document.
 * @param passwordResetData - The password reset data to map.
 * @returns The MongoDB password reset document.
 */
export function mapPasswordResetDataToPasswordResetDocument(
  passwordResetData: PasswordResetData,
): PasswordResetDocument {
  const validatedPasswordResetData =
    validatePasswordResetData(passwordResetData);

  return validatePasswordResetDocument({
    ...validatedPasswordResetData,
    _id: toObjectId(validatedPasswordResetData._id, "_id"),
  });
}
