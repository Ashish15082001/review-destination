import { getEmailVerificationCollection } from "@/database/mongoDB";
import { mapEmailVerificationDataToEmailVerificationDataDocument } from "@/mappers/email-verification";
import { EmailVerificationData } from "@/schema/email-verification";
import validateEmailVerificationData from "@/validators/email-verification";
import { ObjectId } from "mongodb";

export async function insertEmailVerificationData(
  emailVerificationData: Omit<EmailVerificationData, "_id">,
): Promise<string> {
  const collection = await getEmailVerificationCollection();

  const validatedEmailVerificationData: EmailVerificationData =
    validateEmailVerificationData({
      ...emailVerificationData,
      _id: new ObjectId().toString(),
    });

  const emailVerificationDataDocument =
    mapEmailVerificationDataToEmailVerificationDataDocument(
      validatedEmailVerificationData,
    );

  // Remove any existing tokens for this email to prevent multiple valid tokens at the same time.
  await collection.deleteMany({ email: emailVerificationDataDocument.email });

  const result = await collection.insertOne(emailVerificationDataDocument);

  return result.insertedId.toString();
}

export async function getEmailVerificationDataByToken({
  token,
}: {
  token: string;
}): Promise<{
  email: string;
  token: string;
  expiresAt: Date;
} | null> {
  const collection = await getEmailVerificationCollection();
  const tokenDocument = await collection.findOne({ token });

  if (!tokenDocument) return null;

  return {
    email: tokenDocument.email,
    token: tokenDocument.token,
    expiresAt: tokenDocument.expiresAt,
  };
}

export async function deleteEmailVerificationData({
  token,
}: {
  token: string;
}): Promise<boolean> {
  const collection = await getEmailVerificationCollection();

  const result = await collection.deleteMany({ token });

  return result.deletedCount > 0;
}
