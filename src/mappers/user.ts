import { UserData, UserDocument } from "@/schema/user";
import toObjectId from "@/utils/toObjectId";
import validateUserData, { validateUserDocument } from "@/validators/user";

/**
 * Maps application-level user data into a MongoDB user document.
 * @param userData - The user data to map.
 * @returns The MongoDB user document.
 */
export function mapUserDocumentToUserData(
  userDocument: UserDocument,
): UserData {
  const validatedUserDocument = validateUserDocument(userDocument);

  return validateUserData({
    ...validatedUserDocument,
    _id: validatedUserDocument._id.toString(),
    savedReviewesIds: validatedUserDocument.savedReviewesIds.map((id) =>
      id.toString(),
    ),
  });
}

/**
 * Maps application-level user data into a MongoDB user document.
 * @param userData - The user data to map.
 * @returns The MongoDB user document.
 */
export function mapUserDataToUserDocument(userData: UserData): UserDocument {
  const validatedUserData = validateUserData(userData);

  return validateUserDocument({
    ...validatedUserData,
    _id: toObjectId(validatedUserData._id, "_id"),
    savedReviewesIds: validatedUserData.savedReviewesIds.map((id) =>
      toObjectId(id, "savedReviewesIds"),
    ),
  });
}
