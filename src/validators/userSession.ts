import {
  UserSessionData,
  UserSessionDocument,
  UserSessionDocumentSchema,
  UserSessionDataSchema,
} from "@/schema/userSession";

/**
 * Validates user session data used in the application layer.
 * @param userSessionData - The user session payload to validate.
 * @returns The parsed and validated user session data.
 * @throws {Error} If validation fails.
 */
export default function validateUserSessionData(
  userSessionData: UserSessionData,
): UserSessionData {
  const parseResult = UserSessionDataSchema.safeParse(userSessionData);

  if (!parseResult.success)
    throw new Error(`Invalid user session data: ${parseResult.error.message}`);

  return parseResult.data;
}

/**
 * Validates a MongoDB user session document.
 * @param userSessionDocument - The user session document to validate.
 * @returns The parsed and validated session document.
 * @throws {Error} If validation fails.
 */
export function validateUserSessionDocument(
  userSessionDocument: UserSessionDocument,
): UserSessionDocument {
  const parseResult = UserSessionDocumentSchema.safeParse(userSessionDocument);

  if (!parseResult.success)
    throw new Error(
      `Invalid user session document: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
