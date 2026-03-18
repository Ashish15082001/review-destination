import { UserSessionData, UserSessionDataDocument } from "@/schema/userSession";
import toObjectId from "@/utils/toObjectId";
import validateUserSessionData, {
  validateUserSessionDataDocument,
} from "@/validators/userSession";

/**
 * Maps a MongoDB user session document into application-level session data.
 */
export function mapUserSessionDataDocumentToUserSessionData(
  userSessionDataDocument: UserSessionDataDocument,
): UserSessionData {
  const validatedUserSessionDataDocument = validateUserSessionDataDocument(
    userSessionDataDocument,
  );

  return validateUserSessionData({
    _id: validatedUserSessionDataDocument._id.toString(),
    userId: validatedUserSessionDataDocument.userId.toString(),
    expiresOn: validatedUserSessionDataDocument.expiresOn,
  });
}

/**
 * Maps application-level user session data into a MongoDB session document.
 */
export function mapUserSessionDataToUserSessionDataDocument(
  userSessionData: UserSessionData,
): UserSessionDataDocument {
  const validatedUserSessionData = validateUserSessionData(userSessionData);

  return validateUserSessionDataDocument({
    _id: toObjectId(validatedUserSessionData._id, "_id"),
    userId: toObjectId(validatedUserSessionData.userId, "userId"),
    expiresOn: validatedUserSessionData.expiresOn,
  });
}
