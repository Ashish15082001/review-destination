import { getPasswordResetValidationTokensCollection } from "@/database/mongoDB";

export async function insertPasswordResetData({
  email,
  token,
  expiresAt,
}: {
  email: string;
  token: string;
  expiresAt: Date;
}): Promise<string> {
  const collection = await getPasswordResetValidationTokensCollection();

  // make sure to remove any existing tokens for the same email to prevent multiple valid tokens at the same time.
  await collection.deleteMany({ email });

  const result = await collection.insertOne({
    email,
    token,
    expiresAt,
  });

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
  const collection = await getPasswordResetValidationTokensCollection();
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
  const collection = await getPasswordResetValidationTokensCollection();

  const result = await collection.deleteMany({ token });

  return result.deletedCount > 0;
}
