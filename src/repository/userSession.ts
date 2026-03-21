import { getUserSessionsCollection } from "@/database/mongoDB";
import {
  mapUserSessionDataDocumentToUserSessionData,
  mapUserSessionDataToUserSessionDataDocument,
} from "@/mappers/userSession";
import { UserSessionData, UserSessionDataDocument } from "@/schema/userSession";
import { ObjectId } from "bson";
import { cacheTag } from "next/cache";

export async function getUserSessionData(
  sessionId: string,
): Promise<UserSessionData | null> {
  "use cache";
  cacheTag(`userSessionData-sessionId-${sessionId}`);

  const userSessionsCollection = await getUserSessionsCollection();

  const userSessionDataDocument = await userSessionsCollection.findOne({
    _id: new ObjectId(sessionId),
  });

  return userSessionDataDocument
    ? mapUserSessionDataDocumentToUserSessionData(userSessionDataDocument)
    : null;
}

export async function insertUserSession(
  userSessionData: Omit<UserSessionData, "_id">,
): Promise<string> {
  const collection = await getUserSessionsCollection();

  const userSessionDataDocument: UserSessionDataDocument =
    mapUserSessionDataToUserSessionDataDocument({
      ...userSessionData,
      _id: new ObjectId().toString(),
    });

  await collection.insertOne(userSessionDataDocument);

  return userSessionDataDocument._id.toString();
}

export async function deleteUserSession(_id: string): Promise<boolean> {
  const collection = await getUserSessionsCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });

  return result.deletedCount > 0;
}
