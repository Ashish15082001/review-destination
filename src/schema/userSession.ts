import z from "zod";
import { ObjectId } from "mongodb";

export const UserSessionDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  expiresOn: z.date(),
});

export const UserSessionDataSchema = UserSessionDataDocumentSchema.extend({
  _id: z.string(),
  userId: z.string(),
});

export interface UserSessionDataDocument extends z.infer<
  typeof UserSessionDataDocumentSchema
> {}

export interface UserSessionData extends z.infer<
  typeof UserSessionDataSchema
> {}
