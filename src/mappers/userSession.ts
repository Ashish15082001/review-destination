import { UserSessionData, UserSessionDocument } from "@/schema/userSession";
import toObjectId from "@/utils/toObjectId";
import validateUserSessionData, {
  validateUserSessionDocument,
} from "@/validators/userSession";

/**
 * Maps application-level user session data into a MongoDB user session document.
 * @param userSessionData - The user session data to map.
 * @returns The MongoDB user session document.
 */
export function mapUserSessionDocumentToUserSessionData(
  userSessionDocument: UserSessionDocument,
): UserSessionData {
  const validatedUserSessionDocument =
    validateUserSessionDocument(userSessionDocument);

  return validateUserSessionData({
    _id: validatedUserSessionDocument._id.toString(),
    userId: validatedUserSessionDocument.userId.toString(),
    expiresOn: validatedUserSessionDocument.expiresOn,
  });
}

/**
 * Maps application-level user session data into a MongoDB user session document.
 * @param userSessionData - The user session data to map.
 * @returns The MongoDB user session document.
 */
export function mapUserSessionDataToUserSessionDocument(
  userSessionData: UserSessionData,
): UserSessionDocument {
  const validatedUserSessionData = validateUserSessionData(userSessionData);

  return validateUserSessionDocument({
    _id: toObjectId(validatedUserSessionData._id, "_id"),
    userId: toObjectId(validatedUserSessionData.userId, "userId"),
    expiresOn: validatedUserSessionData.expiresOn,
  });
}
