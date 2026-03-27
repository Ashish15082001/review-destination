import { getPasswordResetCollection } from "@/database/mongoDB";
import {
  mapPasswordResetDataToPasswordResetDocument,
  mapPasswordResetDocumentToPasswordResetData,
} from "@/mappers/password-reset";
import { PasswordResetData } from "@/schema/password-reset";
import { ObjectId } from "mongodb";

/**
 * Validates and inserts a new password reset data into the password reset collection.
 * @param passwordResetData - The password reset data to insert.
 * @returns The ID of the inserted password reset data.
 */
export async function insertPasswordResetData(
  passwordResetData: Omit<PasswordResetData, "_id">,
): Promise<string> {
  const collection = await getPasswordResetCollection();

  const passwordResetDocument = mapPasswordResetDataToPasswordResetDocument({
    ...passwordResetData,
    _id: new ObjectId().toString(),
  });

  // make sure to remove any existing tokens for the same email to prevent multiple valid tokens at the same time.
  await collection.deleteMany({ email: passwordResetDocument.email });
  const result = await collection.insertOne(passwordResetDocument);

  return result.insertedId.toString();
}

/**
 * Validates and retrieves password reset data by its token.
 * @param token - The token of the password reset data to retrieve.
 * @returns The password reset data if found, otherwise null.
 */
export async function getPasswordResetDataByToken({
  token,
}: {
  token: string;
}): Promise<{
  email: string;
  token: string;
  expiresAt: Date;
} | null> {
  const collection = await getPasswordResetCollection();
  const passwordResetDocument = await collection.findOne({ token });

  if (!passwordResetDocument) return null;

  return mapPasswordResetDocumentToPasswordResetData(passwordResetDocument);
}

/**
 * Validates and deletes password reset data by its token.
 * @param token - The token of the password reset data to delete.
 * @returns A boolean indicating whether the password reset data was successfully deleted.
 */
export async function deletePasswordResetData({
  token,
}: {
  token: string;
}): Promise<boolean> {
  const collection = await getPasswordResetCollection();

  const result = await collection.deleteMany({ token });

  return result.deletedCount > 0;
}
