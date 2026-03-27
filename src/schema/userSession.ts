import z from "zod";
import { ObjectId } from "mongodb";

/**
 * MongoDB representation of a user session document.
 */
export const UserSessionDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  expiresOn: z.date(),
});

/**
 * Application-level representation of a user session.
 */
export const UserSessionDataSchema = UserSessionDocumentSchema.extend({
  _id: z.string(),
  userId: z.string(),
});

/**
 * Inferred TypeScript type for MongoDB user session documents.
 */
export type UserSessionDocument = z.infer<typeof UserSessionDocumentSchema>;

/**
 * Inferred TypeScript type for application-level user sessions.
 */
export type UserSessionData = z.infer<typeof UserSessionDataSchema>;
