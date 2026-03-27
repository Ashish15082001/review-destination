import { getEmailVerificationCollection } from "@/database/mongoDB";
import {
  mapEmailVerificationDataToEmailVerificationDocument,
  mapEmailVerificationDocumentToEmailVerificationData,
} from "@/mappers/email-verification";
import { EmailVerificationData } from "@/schema/email-verification";
import validateEmailVerificationData from "@/validators/email-verification";
import { ObjectId } from "mongodb";

/**
 * Validates and inserts a new email verification data into the email verification collection.
 * @param emailVerificationData - The email verification data to insert.
 * @returns The string representation of the inserted email verification data's ObjectId.
 */
export async function insertEmailVerificationData(
  emailVerificationData: Omit<EmailVerificationData, "_id">,
): Promise<string> {
  const validatedEmailVerificationData: EmailVerificationData =
    validateEmailVerificationData({
      ...emailVerificationData,
      _id: new ObjectId().toString(),
    });

  const collection = await getEmailVerificationCollection();
  const emailVerificationDocument =
    mapEmailVerificationDataToEmailVerificationDocument(
      validatedEmailVerificationData,
    );

  // Remove any existing tokens for this email to prevent multiple valid tokens at the same time.
  await collection.deleteMany({ email: emailVerificationDocument.email });

  const insertedEmailVerificationDocument = await collection.insertOne(
    emailVerificationDocument,
  );

  return insertedEmailVerificationDocument.insertedId.toString();
}

/**
 * Retrieves email verification data from the email verification collection based on the provided token.
 * @param token - The token for which to retrieve verification data.
 * @returns The email verification data or null if not found.
 */
export async function getEmailVerificationDataByToken({
  token,
}: {
  token: string;
}): Promise<EmailVerificationData | null> {
  const collection = await getEmailVerificationCollection();
  const emailVerificationDocument = await collection.findOne({ token });

  if (!emailVerificationDocument) return null;

  return mapEmailVerificationDocumentToEmailVerificationData(
    emailVerificationDocument,
  );
}

/**
 * Deletes email verification data from the email verification collection based on the provided token.
 * @param token - The token for which to delete verification data.
 * @returns A boolean indicating whether any documents were deleted.
 */
export async function deleteEmailVerificationData({
  token,
}: {
  token: string;
}): Promise<boolean> {
  const collection = await getEmailVerificationCollection();

  const result = await collection.deleteMany({ token });

  return result.deletedCount > 0;
}
