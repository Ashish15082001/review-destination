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
    _id: validatedUserDataDocument._id.toString(),
    userName: validatedUserDataDocument.userName,
    email: validatedUserDataDocument.email,
    password: validatedUserDataDocument.password,
    registeredAt: validatedUserDataDocument.registeredAt,
    savedReviewesIds: validatedUserDataDocument.savedReviewesIds.map((id) =>
      id.toString(),
    ),
    profilePictureUrl: validatedUserDataDocument.profilePictureUrl,
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
    _id: toObjectId(validatedUserData._id, "_id"),
    userName: validatedUserData.userName,
    email: validatedUserData.email,
    password: validatedUserData.password,
    registeredAt: validatedUserData.registeredAt,
    savedReviewesIds: validatedUserData.savedReviewesIds.map((id) =>
      toObjectId(id, "savedReviewesIds"),
    ),
    profilePictureUrl: validatedUserData.profilePictureUrl,
  });
}
