import { UserData, UserDataDocument } from "@/schema/user";
import toObjectId from "@/utils/toObjectId";
import validateUserData, { validateUserDataDocument } from "@/validators/user";

/**
 * Maps a MongoDB user document into application-level user data.
 */
export function mapUserDataDocumentToUserData(
  userDataDocument: UserDataDocument,
): UserData {
  const validatedUserDataDocument = validateUserDataDocument(userDataDocument);

  return validateUserData({
    ...validatedUserDataDocument,
    _id: validatedUserDataDocument._id.toString(),
    savedReviewesIds: validatedUserDataDocument.savedReviewesIds.map((id) =>
      id.toString(),
    ),
  });
}

/**
 * Maps application-level user data into a MongoDB user document.
 */
export function mapUserDataToUserDataDocument(
  userData: UserData,
): UserDataDocument {
  const validatedUserData = validateUserData(userData);

  return validateUserDataDocument({
    ...validatedUserData,
    _id: toObjectId(validatedUserData._id, "_id"),
    savedReviewesIds: validatedUserData.savedReviewesIds.map((id) =>
      toObjectId(id, "savedReviewesIds"),
    ),
  });
}
