import { getPasswordResetCollection } from "@/database/mongoDB";
import { mapPasswordResetDataToPasswordResetDataDocument } from "@/mappers/password-reset";
import { PasswordResetData } from "@/schema/password-reset";
import validatePasswordResetData from "@/validators/password-reset";
import { ObjectId } from "mongodb";

export async function insertPasswordResetData(
  passwordResetData: Omit<PasswordResetData, "_id">,
): Promise<string> {
  const collection = await getPasswordResetCollection();

  const validatedPasswordResetData: PasswordResetData =
    validatePasswordResetData({
      ...passwordResetData,
      _id: new ObjectId().toString(),
    });

  const passwordResetDataDocument =
    mapPasswordResetDataToPasswordResetDataDocument(validatedPasswordResetData);

  // make sure to remove any existing tokens for the same email to prevent multiple valid tokens at the same time.
  await collection.deleteMany({ email: passwordResetDataDocument.email });

  const result = await collection.insertOne(passwordResetDataDocument);

  return result.insertedId.toString();
}

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
  const tokenDocument = await collection.findOne({ token });

  if (!tokenDocument) return null;

  return {
    email: tokenDocument.email,
    token: tokenDocument.token,
    expiresAt: tokenDocument.expiresAt,
  };
}

export async function deletePasswordResetData({
  token,
}: {
  token: string;
}): Promise<boolean> {
  const collection = await getPasswordResetCollection();

  const result = await collection.deleteMany({ token });

  return result.deletedCount > 0;
}
