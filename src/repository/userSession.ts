import { getUserSessionsCollection } from "@/database/mongoDB";
import {
  mapUserSessionDocumentToUserSessionData,
  mapUserSessionDataToUserSessionDocument,
} from "@/mappers/userSession";
import { UserSessionData, UserSessionDocument } from "@/schema/userSession";
import { ObjectId } from "bson";
import { cacheTag } from "next/cache";

/**
 *  Validates and retrieves user session data by session ID.
 * @param sessionId - The ID of the user session to retrieve.
 * @returns The user session data or null if not found.
 */
export async function getUserSessionData(
  sessionId: string,
): Promise<UserSessionData | null> {
  // "use cache";
  // cacheTag(`userSessionData-sessionId-${sessionId}`);

  const userSessionsCollection = await getUserSessionsCollection();

  const userSessionDocument = await userSessionsCollection.findOne({
    _id: new ObjectId(sessionId),
  });

  return userSessionDocument
    ? mapUserSessionDocumentToUserSessionData(userSessionDocument)
    : null;
}

/**
 * Validates and inserts a new user session into the user sessions collection.
 * @param userSessionData - The user session data to insert.
 * @returns The ID of the inserted user session.
 */
export async function insertUserSession(
  userSessionData: Omit<UserSessionData, "_id">,
): Promise<string> {
  const collection = await getUserSessionsCollection();

  const userSessionDocument: UserSessionDocument =
    mapUserSessionDataToUserSessionDocument({
      ...userSessionData,
      _id: new ObjectId().toString(),
    });

  await collection.insertOne(userSessionDocument);

  return userSessionDocument._id.toString();
}

/**
 * Validates and deletes a user session from the user sessions collection.
 * @param _id - The ID of the user session to delete.
 * @returns A boolean indicating whether the deletion was successful.
 */
export async function deleteUserSession(_id: string): Promise<boolean> {
  const collection = await getUserSessionsCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });

  return result.deletedCount > 0;
}
